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

// 記事本文の prose カスタマイズ。スマホ閲覧が主のため SP を基準に組む。
// Tailwind v4 では .prose の生CSSが出力されないため、装飾はすべて
// prose-* / 任意バリアントのユーティリティで指定する（確実にビルドに出る）。
const PROSE_CLASSES = [
  // ベース: SP16px / PC18px、行間1.8、本文色を濃く、長語の折り返し、見出しアンカー退避
  // 引用ボーダー色は prose の変数を上書きして指定（specificity 争いを避ける）
  "prose prose-neutral md:prose-lg max-w-none break-words",
  "[--tw-prose-body:#1f2937] [--tw-prose-quote-borders:#38bdf8]",
  "prose-p:my-6 prose-p:leading-[1.8]",
  "prose-headings:font-bold prose-headings:scroll-mt-24",
  // h2: ネイビー塗り帯・白文字・角丸（セクションの開始を明確化）
  "prose-h2:text-white prose-h2:bg-sidebar prose-h2:rounded-lg prose-h2:px-5 prose-h2:py-3 prose-h2:text-xl prose-h2:leading-snug",
  // h3: 左 sky バー＋下罫線
  "prose-h3:text-gray-900 prose-h3:border-l-4 prose-h3:border-l-sky-500 prose-h3:border-b prose-h3:border-b-gray-200 prose-h3:pl-3 prose-h3:pb-1",
  // blockquote: 左アクセント（色は上の変数で指定）＋薄背景のカラーボックス（引用符は消す）
  "prose-blockquote:bg-sky-50 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-gray-700 prose-blockquote:px-4 prose-blockquote:py-1",
  "[&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none",
  // 太字: マーカー風ハイライトで色のアクセント（折り返しても綺麗に敷く）
  "prose-strong:text-gray-900 [&_strong]:bg-[linear-gradient(transparent_65%,#bae6fd_65%)] [&_strong]:box-decoration-clone",
  // リスト: マーカーを sky 色に
  "prose-li:marker:text-sky-500",
  // リンク・コード・表（既存の対策を維持）
  "prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline",
  "prose-code:text-sky-700 prose-code:bg-sky-50 prose-code:px-1 prose-code:rounded",
  "prose-pre:overflow-x-auto prose-pre:text-sm prose-table:block prose-table:overflow-x-auto",
].join(" ");

export function ArticleBody({ content }: { content: string }) {
  return (
    <div className={PROSE_CLASSES}>
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
