import type { Element } from "hast";
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
// 中身が画像1枚だけの段落か（前後の空白テキストは無視する）
function isImageOnlyParagraph(node: Element | undefined) {
  if (!node) return false;
  const meaningful = node.children.filter(
    (child) => !(child.type === "text" && child.value.trim() === ""),
  );
  return (
    meaningful.length === 1 &&
    meaningful[0].type === "element" &&
    meaningful[0].tagName === "img"
  );
}

export function ArticleBody({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline prose-code:text-sky-700 prose-code:bg-sky-50 prose-code:px-1 prose-code:rounded max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkFootnotes as never]}
        rehypePlugins={[rehypeSlug, rehypeHighlight, rehypeRaw]}
        components={{
          // 画像だけの段落は p を外す。
          // markdown の `![](...)` は <p> に包まれるが、img を figure に
          // 置き換えると <p> 内に <figure> が入り HTML として不正になるため。
          p({ node, children }) {
            return isImageOnlyParagraph(node) ? children : <p>{children}</p>;
          },
          img({ src, alt }) {
            if (!src || typeof src !== "string") return null;
            return (
              <figure className="my-6">
                {/* 縦横比は画像の実寸に従わせる。16:9 固定だと縦長の
                    スクリーンショットが左右の余白に潰されるため。
                    width/height は読み込み前の場所取り用の目安値。 */}
                <Image
                  src={src}
                  alt={alt ?? ""}
                  width={1600}
                  height={900}
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="mx-auto h-auto max-h-[70vh] w-auto max-w-full rounded-lg border border-gray-200"
                  loading="lazy"
                />
                {alt && (
                  <figcaption className="mt-2 text-center text-xs text-gray-500">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
