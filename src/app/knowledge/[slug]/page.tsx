import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { getArticleBySlug, getPublishedArticles } from "@/lib/knowledge";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-24">
      <Link
        href="/knowledge"
        className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block"
      >
        ← Knowledge 一覧へ
      </Link>

      <article>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">{article.category}</Badge>
          {article.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

        <time className="text-sm text-muted-foreground mb-8 block">
          {article.published_at
            ? new Date(article.published_at).toLocaleDateString("ja-JP")
            : ""}
        </time>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
