import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getPublishedArticles } from "@/lib/knowledge";

export default async function KnowledgePage() {
  const articles = await getPublishedArticles();

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Knowledge
      </h1>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <p className="text-lg">記事を準備中です。しばらくお待ちください。</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                href={`/knowledge/${article.slug}`}
                className="block rounded-lg border bg-card p-6 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{article.category}</Badge>
                  {article.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-muted-foreground text-sm mb-3">
                  {article.excerpt}
                </p>
                <time className="text-xs text-muted-foreground">
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString("ja-JP")
                    : ""}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
