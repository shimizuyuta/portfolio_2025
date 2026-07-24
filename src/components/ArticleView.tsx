import Image from "next/image";
import Link from "next/link";
import { ArticleBody } from "@/components/ArticleBody";
import { AuthorCard } from "@/components/article/AuthorCard";
import { ConsultationCta } from "@/components/article/ConsultationCta";
import { Badge } from "@/components/ui/badge";
import type { ArticleCard } from "@/lib/knowledge";

// Markdownの見出し（## / ###）を抽出してToCを生成
export function extractHeadings(markdown: string) {
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

export type ArticleViewProps = {
  title: string;
  category: string;
  tags: string[];
  content: string;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  // 管理画面のプレビューはサムネイル未保存時に blob URL を渡す。
  // next/image は blob を最適化できないため、その場合だけ最適化を切る。
  unoptimizedImage?: boolean;
  // 本文中の内部リンクをカード化するためのメタ。Server 側で事前取得して渡す。
  // 省略時（編集フォームのライブプレビュー等）は通常リンクで描画される。
  linkCards?: Map<string, ArticleCard>;
};

// 記事ページの見た目だけを持つコンポーネント。データ取得は呼び出し側の責務。
//
// 公開ページと管理画面のプレビューが同じ実装を共有するために切り出している。
// プレビュー用にレイアウトを別実装すると、公開ページを直すたびに乖離するため。
export function ArticleView({
  title,
  category,
  tags,
  content,
  thumbnailUrl,
  publishedAt,
  unoptimizedImage,
  linkCards,
}: ArticleViewProps) {
  const headings = extractHeadings(content);
  const publishedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
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
            <li className="text-gray-800 font-medium line-clamp-1">{title}</li>
          </ol>
        </nav>
      </div>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16">
        {/* ヒーロー画像 */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-8 shadow-sm">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
              priority
              unoptimized={unoptimizedImage}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100">
              <span className="text-4xl font-bold text-sky-300/60 tracking-wider">
                {category}
              </span>
            </div>
          )}
        </div>

        {/* メタ情報 */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge className="bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-50 text-xs">
            {category}
          </Badge>
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {publishedDate && (
            <time
              dateTime={publishedAt ?? undefined}
              className="text-xs text-gray-400 w-full md:w-auto md:ml-auto"
            >
              {publishedDate}
            </time>
          )}
        </div>

        {/* タイトル */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-10">
          {title}
        </h1>

        {/* 目次 */}
        {headings.length > 0 && (
          <nav
            aria-label="目次"
            className="mb-10 rounded-xl border border-gray-200 bg-gray-50 px-4 py-5 md:px-6"
          >
            <p className="text-sm font-bold text-gray-700 mb-3">目次</p>
            <div className="space-y-2">
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className={`block text-sm text-sky-600 hover:text-sky-800 hover:underline transition-colors${h.level === 3 ? " pl-4" : ""}`}
                >
                  {h.text}
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* 記事本文 */}
        <ArticleBody content={content} linkCards={linkCards} />

        <AuthorCard />
        <ConsultationCta />

        {/* 戻るリンク */}
        <div className="mt-10 pt-8 border-t">
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
    </>
  );
}
