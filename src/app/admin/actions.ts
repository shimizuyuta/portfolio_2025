"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { syncArticleTags, upsertTags } from "@/lib/knowledge/write";
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
  revalidatePath("/admin");
  revalidatePath("/knowledge");
}

export async function deleteArticle(id: string) {
  assertAdminEnabled();
  const supabase = createServiceClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag("published-articles");
  revalidatePath("/admin");
  revalidatePath("/knowledge");
}

export async function getAdminArticles() {
  assertAdminEnabled();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug, category, status, published_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function uploadThumbnail(formData: FormData): Promise<string> {
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
