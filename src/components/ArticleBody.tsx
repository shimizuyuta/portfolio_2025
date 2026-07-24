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
    // スマホ閲覧が主のため SP を基準に文字組みを整える:
    // - base=16px を維持し md:prose-lg で PC のみ 18px に上げる
    // - break-words: 長い英単語・URL で横スクロールが出ないようにする
    // - prose-headings:scroll-mt-24: sticky ヘッダー裏に見出しが隠れないよう
    //   目次アンカーの着地位置をずらす
    // - prose-table を block+overflow-x-auto にし、幅広の表はページ全体でなく
    //   表の中だけを横スクロールさせる（table を block 化する定石）
    // 可読性向上（見やすいメディアに合わせる）:
    // - prose-p:my-6: 段落間の余白を広げ、スクロール時に段落を明確に分離
    // - [--tw-prose-body:#1f2937]: 本文色を gray-800 相当に濃くし高コントラスト化
    // 見出し装飾（案B：アクセント線）— 章の切れ目を一目で分かるようにする:
    // - h2: 下罫線(gray-200) ＋ 短い sky アクセント下線(::after, w-12/h-[3px])
    // - h3: 左 sky バー(border-l-4)
    //   ※prose の生CSS(.prose h2)は Tailwind v4 で出力されないため、
    //     prose-h2:/prose-h3:/after: ユーティリティで指定する（確実に出力される）
    <div className="prose prose-neutral md:prose-lg max-w-none break-words [--tw-prose-body:#1f2937] prose-p:my-6 prose-p:leading-[1.8] prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-24 prose-h2:relative prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:after:absolute prose-h2:after:bottom-[-1px] prose-h2:after:left-0 prose-h2:after:h-[3px] prose-h2:after:w-12 prose-h2:after:rounded-full prose-h2:after:bg-sky-500 prose-h2:after:content-[''] prose-h3:border-l-4 prose-h3:border-sky-500 prose-h3:pl-3 prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline prose-code:text-sky-700 prose-code:bg-sky-50 prose-code:px-1 prose-code:rounded prose-pre:overflow-x-auto prose-pre:text-sm prose-table:block prose-table:overflow-x-auto">
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
