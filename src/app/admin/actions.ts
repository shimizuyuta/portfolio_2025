"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { syncArticleTags, upsertTags } from "@/lib/knowledge/write";
import { SITE_URL } from "@/lib/site";
import { createServiceClient } from "@/lib/supabase/service";

// "use server" のファイルでは export した関数がすべて Server Action として
// 公開され、Next-Action ヘッダ付き POST で外部から直接呼び出せる。
// ページ側（admin/page.tsx）の ADMIN_ENABLED チェックは呼び出し側のガードに
// すぎず、アクション本体には掛からない。そのためアクションごとに検査する。
//
// export しないことでこの関数自体は Server Action にならない。
function assertAdminEnabled() {
  if (!process.env.ADMIN_ENABLED) {
    throw new Error("Forbidden");
  }
}

// 本番のキャッシュ再検証を呼ぶ。
//
// revalidateTag() はそのプロセスのキャッシュにしか効かない。admin は
// ADMIN_ENABLED でローカル限定のため、ローカルで公開しても本番の一覧・
// サイトマップは古いまま残る（getPublishedArticles は revalidate: 86400）。
// 本番へ届かせるには HTTP で叩くしかない。
//
// 時間ベースの短い revalidate ではなくこの方式にしている。記事が変わらない
// 期間も定期的に問い合わせ続けるのは無駄で、変更した瞬間だけ1回無効化すれば
// 足りるため。
//
// 失敗しても保存は成功扱いにする。記事は Supabase に保存済みであり、
// ここで throw すると「保存できなかった」と誤解させるため。
// 反映されなくても revalidate: 86400 で最終的には追いつく。
async function revalidateProduction() {
  const token = process.env.BLOG_API_KEY?.trim();
  if (!token) return;

  try {
    const res = await fetch(`${SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error(`本番キャッシュの再検証に失敗しました: HTTP ${res.status}`);
    }
  } catch (e) {
    console.error("本番キャッシュの再検証に失敗しました", e);
  }
}

export type ArticleInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: "draft" | "published";
  published_at: string | null;
  tagNames: string[];
  thumbnail_url: string | null;
};

export async function createArticle(input: ArticleInput) {
  assertAdminEnabled();
  const supabase = createServiceClient();
  const { tagNames, ...articleData } = input;

  // published かつ published_at 未設定の場合は現在時刻を自動セット
  if (articleData.status === "published" && !articleData.published_at) {
    articleData.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("articles")
    .insert([articleData])
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const tagIds = await upsertTags(supabase, tagNames);
  await syncArticleTags(supabase, data.id, tagIds);

  revalidateTag("published-articles");
  await revalidateProduction();
  revalidatePath("/admin");
  revalidatePath("/knowledge");
}

export async function updateArticle(id: string, input: ArticleInput) {
  assertAdminEnabled();
  const supabase = createServiceClient();
  const { tagNames, ...articleData } = input;

  // published かつ published_at 未設定の場合は現在時刻を自動セット
  if (articleData.status === "published" && !articleData.published_at) {
    articleData.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("articles")
    .update({ ...articleData, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  const tagIds = await upsertTags(supabase, tagNames);
  await syncArticleTags(supabase, id, tagIds);

  revalidateTag("published-articles");
  await revalidateProduction();
  revalidatePath("/admin");
  revalidatePath("/knowledge");
}

export async function deleteArticle(id: string) {
  assertAdminEnabled();
  const supabase = createServiceClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag("published-articles");
  await revalidateProduction();
  revalidatePath("/admin");
  revalidatePath("/knowledge");
}

// 一覧の絞り込み条件。増えた分はここに足し、getAdminArticles で条件を積む。
export type ArticleFilters = {
  status?: "draft" | "published";
};

export async function getAdminArticles(filters: ArticleFilters = {}) {
  assertAdminEnabled();
  const supabase = createServiceClient();

  // 取得後に JS で絞ると記事が増えたときに全件取得が無駄になるため、
  // 条件はクエリ側に積む。
  let query = supabase
    .from("articles")
    .select("id, title, slug, category, status, published_at, updated_at");

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query.order("updated_at", {
    ascending: false,
  });
  if (error) throw new Error(error.message);
  return data ?? [];
}

// サムネイルと本文画像の両方から使う。保存先は blog-images バケット共通。
export async function uploadImage(formData: FormData): Promise<string> {
  assertAdminEnabled();
  const supabase = createServiceClient();
  const file = formData.get("file") as File;
  const bytes = await file.arrayBuffer();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function getAdminArticleById(id: string) {
  assertAdminEnabled();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, article_tags(tags(id, name))")
    .eq("id", id)
    .single();
  if (error) return null;

  const tagNames = (data.article_tags ?? [])
    .map((at: { tags: { name: string } | null }) => at.tags?.name)
    .filter(Boolean) as string[];

  return { ...data, tagNames };
}
