import { createClient } from "@/lib/supabase/server";

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
  tags: { id: string; name: string }[];
};

export async function getPublishedArticles(): Promise<Article[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*, article_tags(tags(id, name))")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    ...row,
    tags: row.article_tags
      .map((at: { tags: { id: string; name: string } | null }) => at.tags)
      .filter(Boolean) as { id: string; name: string }[],
  }));
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("slug")
    .eq("status", "published");
  return data?.map((r) => r.slug) ?? [];
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*, article_tags(tags(id, name))")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return undefined;

  return {
    ...data,
    tags: data.article_tags
      .map((at: { tags: { id: string; name: string } | null }) => at.tags)
      .filter(Boolean) as { id: string; name: string }[],
  };
}
