import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkFootnotes from "remark-footnotes";
import remarkGfm from "remark-gfm";

// 記事本文の描画。記事詳細ページと /admin のプレビューで共有する。
// 別実装にすると必ず見た目がずれるため、必ずこのコンポーネントを通す。
//
// "use client" は付けない：記事詳細ページ（Server Component）では
// サーバー描画のまま、AdminClient から import したときだけ
// クライアントバンドルに含まれる。
export function ArticleBody({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline prose-code:text-sky-700 prose-code:bg-sky-50 prose-code:px-1 prose-code:rounded max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkFootnotes as never]}
        rehypePlugins={[rehypeSlug, rehypeHighlight, rehypeRaw]}
        components={{
          img({ src, alt }) {
            if (!src || typeof src !== "string") return null;
            return (
              <span
                className="block relative w-full"
                style={{ aspectRatio: "16/9" }}
              >
                <Image
                  src={src}
                  alt={alt ?? ""}
                  fill
                  className="object-contain rounded-lg"
                  loading="lazy"
                />
              </span>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
