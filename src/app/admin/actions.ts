"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";

export type ArticleInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: "draft" | "published";
  published_at: string | null;
  tagNames: string[];
};

// タグを upsert して ID を返す
async function upsertTags(
  supabase: ReturnType<typeof createServiceClient>,
  names: string[],
): Promise<string[]> {
  if (names.length === 0) return [];
  const { data, error } = await supabase
    .from("tags")
    .upsert(
      names.map((name) => ({ name })),
      { onConflict: "name" },
    )
    .select("id");
  if (error) throw new Error(error.message);
  return (data ?? []).map((t) => t.id);
}

// article_tags を洗い替え
async function syncArticleTags(
  supabase: ReturnType<typeof createServiceClient>,
  articleId: string,
  tagIds: string[],
) {
  await supabase.from("article_tags").delete().eq("article_id", articleId);
  if (tagIds.length === 0) return;
  const { error } = await supabase
    .from("article_tags")
    .insert(tagIds.map((tag_id) => ({ article_id: articleId, tag_id })));
  if (error) throw new Error(error.message);
}

export async function createArticle(input: ArticleInput) {
  const supabase = createServiceClient();
  const { tagNames, ...articleData } = input;

  const { data, error } = await supabase
    .from("articles")
    .insert([articleData])
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const tagIds = await upsertTags(supabase, tagNames);
  await syncArticleTags(supabase, data.id, tagIds);

  revalidatePath("/admin");
  revalidatePath("/knowledge");
}

export async function updateArticle(id: string, input: ArticleInput) {
  const supabase = createServiceClient();
  const { tagNames, ...articleData } = input;

  const { error } = await supabase
    .from("articles")
    .update({ ...articleData, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  const tagIds = await upsertTags(supabase, tagNames);
  await syncArticleTags(supabase, id, tagIds);

  revalidatePath("/admin");
  revalidatePath("/knowledge");
}

export async function deleteArticle(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/knowledge");
}

export async function getAdminArticles() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug, category, status, published_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminArticleById(id: string) {
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
