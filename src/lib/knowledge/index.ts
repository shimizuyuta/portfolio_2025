import { unstable_cache } from "next/cache";
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
  thumbnail_url: string | null;
  tags: { id: string; name: string }[];
};

export const getPublishedArticles = unstable_cache(
  async (limit?: number): Promise<Article[]> => {
    const supabase = await createClient();

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

    if (error || !data) return [];

    return data.map((row) => ({
      ...row,
      thumbnail_url: row.thumbnail_url ?? null,
      tags: row.article_tags
        .map((at: { tags: { id: string; name: string } | null }) => at.tags)
        .filter(Boolean) as { id: string; name: string }[],
    }));
  },
  ["published-articles"],
  { revalidate: 86400, tags: ["published-articles"] },
);

export const getArticleBySlug = unstable_cache(
  async (slug: string): Promise<Article | undefined> => {
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
      thumbnail_url: data.thumbnail_url ?? null,
      tags: data.article_tags
        .map((at: { tags: { id: string; name: string } | null }) => at.tags)
        .filter(Boolean) as { id: string; name: string }[],
    };
  },
  ["article-by-slug"],
  { revalidate: 86400, tags: ["published-articles"] },
);
