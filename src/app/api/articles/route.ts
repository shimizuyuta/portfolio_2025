import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { syncArticleTags, upsertTags } from "@/lib/knowledge/write";
import { createServiceClient } from "@/lib/supabase/service";

// AI から書き込める記事フィールドの allowlist。
// status / published_at を意図的に含めていない：公開操作は人間のみが行うため、
// リクエストに何が入っていても公開ステータスへ遷移できない構造にしている。
const WRITABLE_FIELDS = [
  "title",
  "slug",
  "content",
  "excerpt",
  "category",
  "thumbnail_url",
] as const;

// thumbnail_url のみ nullable。他は DB 側が NOT NULL
type ArticleFields = {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  thumbnail_url?: string | null;
};

type RequiredField = "title" | "slug" | "content" | "excerpt" | "category";

const REQUIRED_ON_CREATE: RequiredField[] = [
  "title",
  "slug",
  "content",
  "excerpt",
  "category",
];

function authenticate(request: Request): boolean {
  const auth = request.headers.get("Authorization");
  // Vercel の環境変数は貼り付け時に末尾へ改行が混入することがある。
  // 見た目が同じでも "abc" と "abc\n" は厳密比較で一致しないため、
  // 両辺を trim してから比較する（NEXT_PUBLIC_GA_ID と同種の対処）。
  const key = process.env.BLOG_API_KEY?.trim();
  if (!key || !auth?.startsWith("Bearer ")) return false;

  const received = Buffer.from(auth.slice(7).trim());
  const expected = Buffer.from(key);

  // timingSafeEqual は長さが違うと例外を投げるので先に弾く。
  // 長さの差は秘匿できないが、内容の総当たりは時間差から守る（preview.ts と同方針）。
  if (received.length !== expected.length) return false;

  return timingSafeEqual(received, expected);
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// allowlist に無いキー（status / published_at 等）は黙って捨てる
function pickWritable(body: Record<string, unknown>): ArticleFields {
  const picked: ArticleFields = {};
  for (const field of WRITABLE_FIELDS) {
    const value = body[field];
    if (value === undefined) continue;
    if (field === "thumbnail_url") {
      // 明示的な null はサムネイル削除の意思表示として通す
      if (value === null || typeof value === "string") {
        picked.thumbnail_url = value;
      }
      continue;
    }
    if (typeof value === "string") {
      picked[field] = value;
    }
  }
  return picked;
}

function normalizeTags(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter(
    (t): t is string => typeof t === "string" && t.length > 0,
  );
}

type RowWithTags = {
  article_tags?: { tags: { id: string; name: string } | null }[] | null;
};

function flattenTags<T extends RowWithTags>(row: T) {
  const { article_tags, ...rest } = row;
  return {
    ...rest,
    tags: (article_tags ?? [])
      .map((at) => at.tags)
      .filter((t): t is { id: string; name: string } => t !== null),
  };
}

// GET /api/articles          → 全 status の一覧（重複チェック用）
// GET /api/articles?slug=xxx → 本文を含む単一記事（旧版退避用）
export async function GET(request: Request) {
  if (!authenticate(request)) return unauthorized();

  const slug = new URL(request.url).searchParams.get("slug");
  const supabase = createServiceClient();

  if (slug) {
    const { data, error } = await supabase
      .from("articles")
      .select("*, article_tags(tags(id, name))")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ article: flattenTags(data) });
  }

  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, title, slug, category, status, published_at, updated_at, article_tags(tags(id, name))",
    )
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ articles: (data ?? []).map(flattenTags) });
}

// POST /api/articles → draft として新規作成（公開はしない）
export async function POST(request: Request) {
  if (!authenticate(request)) return unauthorized();

  const body = (await request.json()) as Record<string, unknown>;
  const fields = pickWritable(body);

  const missing = REQUIRED_ON_CREATE.filter((f) => !fields[f]);
  const { title, slug, content, excerpt, category } = fields;
  if (!title || !slug || !content || !excerpt || !category) {
    return NextResponse.json(
      { error: `必須項目が不足しています: ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();

  const { data: article, error } = await supabase
    .from("articles")
    .insert({
      title,
      slug,
      content,
      excerpt,
      category,
      thumbnail_url: fields.thumbnail_url ?? null,
      // 常に draft。リクエストの status / published_at は反映しない
      status: "draft",
      published_at: null,
    })
    .select("id, slug")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const tags = normalizeTags(body.tags);
  if (tags && tags.length > 0) {
    const tagIds = await upsertTags(supabase, tags);
    await syncArticleTags(supabase, article.id, tagIds);
  }

  revalidateTag("published-articles");

  return NextResponse.json(
    { id: article.id, slug: article.slug, status: "draft" },
    { status: 201 },
  );
}

// PATCH /api/articles → 既存記事の更新。status / published_at は変更できない
export async function PATCH(request: Request) {
  if (!authenticate(request)) return unauthorized();

  const body = (await request.json()) as Record<string, unknown>;
  const slug = typeof body.slug === "string" ? body.slug : null;
  const id = typeof body.id === "string" ? body.id : null;

  if (!slug && !id) {
    return NextResponse.json(
      { error: "slug または id を指定してください" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();

  // 更新前のスナップショットを取得して返す（旧版退避の突き合わせ用）
  const baseQuery = supabase
    .from("articles")
    .select("*, article_tags(tags(id, name))");
  const { data: previous, error: previousError } = await (id
    ? baseQuery.eq("id", id)
    : baseQuery.eq("slug", slug as string)
  ).maybeSingle();

  if (previousError) {
    return NextResponse.json({ error: previousError.message }, { status: 500 });
  }
  if (!previous) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const fields = pickWritable(body);

  // slug をキーに更新する場合、slug 自体の変更は id 指定を必須にする
  // （変更後の slug で対象を引けなくなり、意図しない記事を更新する恐れがあるため）
  if (!id && fields.slug && fields.slug !== previous.slug) {
    return NextResponse.json(
      { error: "slug を変更する場合は id を指定してください" },
      { status: 400 },
    );
  }

  // slug は対象の指定にも使われるため、現行値と同じなら書き込み対象から外す。
  // 外さないと「実質何も変えない PATCH」が updated_at だけを更新してしまい、
  // リライト候補の除外判定（直近30日以内の更新）を誤らせる。
  if (fields.slug === previous.slug) {
    delete fields.slug;
  }

  const tags = normalizeTags(body.tags);

  if (Object.keys(fields).length === 0 && !tags) {
    return NextResponse.json(
      { error: "更新可能な項目が指定されていません" },
      { status: 400 },
    );
  }

  if (Object.keys(fields).length > 0) {
    const { error } = await supabase
      .from("articles")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", previous.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (tags) {
    const tagIds = await upsertTags(supabase, tags);
    await syncArticleTags(supabase, previous.id, tagIds);
  }

  revalidateTag("published-articles");

  return NextResponse.json({
    id: previous.id,
    slug: fields.slug ?? previous.slug,
    // status は更新対象外。現行値をそのまま返す
    status: previous.status,
    previous: flattenTags(previous),
  });
}
