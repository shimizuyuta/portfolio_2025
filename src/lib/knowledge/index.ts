import { unstable_cache } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  thumbnail_url: string | null;
  tags: { id: string; name: string }[];
};

type ArticleRow = Omit<Article, "tags"> & {
  thumbnail_url: string | null;
  article_tags: { tags: { id: string; name: string } | null }[];
};

// PostgREST が .single() で0件だったときに返すコード。
// 「記事が無い」と「取得に失敗した」を区別するために使う。
const NO_ROWS_RETURNED = "PGRST116";

function toArticle(row: ArticleRow): Article {
  return {
    ...row,
    thumbnail_url: row.thumbnail_url ?? null,
    tags: row.article_tags.map((at) => at.tags).filter(Boolean) as {
      id: string;
      name: string;
    }[],
  };
}

export const getPublishedArticles = unstable_cache(
  async (limit?: number): Promise<Article[]> => {
    const supabase = createServiceClient();

    let query = supabase
      .from("articles")
      .select("*, article_tags(tags(id, name))")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    // 取得に失敗したら握りつぶさず投げる。
    //
    // 以前は空配列を返していたが、これは事故になる：サイトマップが
    // 「記事0件」の XML を 200 で配信し、Google にインデックス削除と
    // 解釈されうる。さらに unstable_cache は返り値をキャッシュするため、
    // 一時的な障害の結果が最大24時間居座る（例外はキャッシュされない）。
    //
    // 呼び出し側の判断で握り潰したい場合（ホームの記事セクション等）は、
    // 各ページで catch する。ここでは事実を返すことに徹する。
    if (error) {
      throw new Error(`公開記事の取得に失敗しました: ${error.message}`);
    }

    return (data ?? []).map(toArticle);
  },
  ["published-articles"],
  { revalidate: 86400, tags: ["published-articles"] },
);

export const getArticleBySlug = unstable_cache(
  async (slug: string): Promise<Article | undefined> => {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("articles")
      .select("*, article_tags(tags(id, name))")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    // 0件（未公開・存在しない）は undefined を返し、呼び出し側で 404 にする。
    // それ以外のエラーは投げる。区別しないと、一時的な障害で公開中の記事が
    // 404 になり、検索エンジンに存在しないページと見なされる。
    if (error) {
      if (error.code === NO_ROWS_RETURNED) return undefined;
      throw new Error(`記事の取得に失敗しました（${slug}）: ${error.message}`);
    }

    return data ? toArticle(data) : undefined;
  },
  ["article-by-slug"],
  { revalidate: 86400, tags: ["published-articles"] },
);

// プレビュー専用。status を絞らず、draft も予約投稿も取得する。
//
// unstable_cache で包んでいないのは意図的：
// - draft は編集のたびに変わるため、毎回最新を取得する必要がある
// - published-articles タグのキャッシュに混ぜると、公開記事向けの
//   revalidateTag（人間が公開操作時に行う）の意味が濁る
export async function getArticleBySlugForPreview(
  slug: string,
): Promise<Article | undefined> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*, article_tags(tags(id, name))")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === NO_ROWS_RETURNED) return undefined;
    throw new Error(`記事の取得に失敗しました（${slug}）: ${error.message}`);
  }

  return data ? toArticle(data) : undefined;
}
