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

    if (error || !data) return [];

    return data.map(toArticle);
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

    if (error || !data) return undefined;

    return toArticle(data);
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

  if (error || !data) return undefined;

  return toArticle(data);
}
