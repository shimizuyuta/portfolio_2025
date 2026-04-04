import { type Article, mockArticles } from "./mock";

export type { Article };

export async function getPublishedArticles(): Promise<Article[]> {
  return mockArticles
    .filter((a) => a.status === "published" && a.published_at !== null)
    .sort(
      (a, b) =>
        new Date(b.published_at ?? "").getTime() -
        new Date(a.published_at ?? "").getTime(),
    );
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  return mockArticles.find((a) => a.slug === slug && a.status === "published");
}
