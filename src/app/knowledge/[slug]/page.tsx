import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { getAllArticleSlugs, getArticleBySlug } from "@/lib/knowledge";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (process.env.VERCEL === "1") {
    return [];
  }
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Markdownの見出し（## / ###）を抽出してToCを生成
function extractHeadings(markdown: string) {
  const lines = markdown.split("\n");
  return lines
    .filter((line) => /^#{2,3}\s/.test(line))
    .map((line) => {
      const level = line.match(/^(#{2,3})/)?.[1].length ?? 2;
      const text = line.replace(/^#{2,3}\s+/, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\u3040-\u30FF\u4E00-\u9FFF\u3400-\u4DBF]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      return { level, text, id };
    });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const headings = extractHeadings(article.content);
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-white min-h-screen">
      {/* パンくずナビ */}
      <div className="border-b bg-gray-50">
        <nav
          aria-label="パンくずリスト"
          className="max-w-4xl mx-auto px-4 md:px-6 py-3"
        >
          <ol className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
            <li>
              <Link href="/" className="hover:text-sky-600 transition-colors">
                Top
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/knowledge"
                className="hover:text-sky-600 transition-colors"
              >
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-800 font-medium line-clamp-1">
              {article.title}
            </li>
          </ol>
        </nav>
      </div>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16">
        {/* ヒーロー画像 */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-8 shadow-sm">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100">
            <span className="text-4xl font-bold text-sky-300/60 tracking-wider">
              {article.category}
            </span>
          </div>
        </div>

        {/* メタ情報 */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge className="bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-50 text-xs">
            {article.category}
          </Badge>
          {article.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
          {publishedDate && (
            <time
              dateTime={article.published_at ?? undefined}
              className="text-xs text-gray-400 ml-auto"
            >
              {publishedDate}
            </time>
          )}
        </div>

        {/* タイトル */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-10">
          {article.title}
        </h1>

        {/* 目次 */}
        {headings.length > 0 && (
          <nav
            aria-label="目次"
            className="mb-10 rounded-xl border border-gray-200 bg-gray-50 px-6 py-5"
          >
            <p className="text-sm font-bold text-gray-700 mb-3">目次</p>
            <ol className="space-y-2">
              {headings.map((h, i) => (
                <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
                  <a
                    href={`#${h.id}`}
                    className="text-sm text-sky-600 hover:text-sky-800 hover:underline transition-colors flex gap-2"
                  >
                    <span className="text-gray-400 shrink-0 tabular-nums">
                      {i + 1}.
                    </span>
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* 記事本文 */}
        <div className="prose prose-neutral prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline prose-code:text-sky-700 prose-code:bg-sky-50 prose-code:px-1 prose-code:rounded max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeSlug]}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* 戻るリンク */}
        <div className="mt-16 pt-8 border-t">
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-sky-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            ブログ一覧へ戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
