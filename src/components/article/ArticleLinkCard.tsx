import Image from "next/image";
import Link from "next/link";
import type { ArticleCard } from "@/lib/knowledge";

// 本文中の「単独行のサイト内リンク」を差し替えるブログカード（SWELL 風）。
// 枠の上辺にかかる「あわせて読みたい」タブ見出し ＋ サムネ左・タイトル・抜粋の横型。
// 色はサイトのテーマカラー sky 系に合わせる。
//
// items-center を親（Link）に置くのは意図的：flex 既定の stretch だとサムネが
// カード高さまで引き伸ばされ、1200:630 の比率が崩れる。中央寄せで比率を保つ。
//
// カード化するかの判定・データ取得は呼び出し側（ArticleBody / Server 側）の責務。
export function ArticleLinkCard({
  slug,
  title,
  excerpt,
  category,
  thumbnail_url,
}: ArticleCard) {
  return (
    <div className="not-prose relative my-8">
      {/* タブ見出し: 枠の上辺にかかるように配置。 */}
      <span className="absolute -top-3 left-4 z-10 inline-flex items-center gap-1.5 rounded-md bg-sky-600 px-3 py-1 text-xs font-bold text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
          <path d="M10 9H8" />
        </svg>
        あわせて読みたい
      </span>

      <Link
        href={`/knowledge/${slug}`}
        className="group flex items-start gap-4 rounded-lg border border-sky-200 bg-white px-4 pb-4 pt-6 no-underline transition-shadow duration-200 hover:shadow-md"
      >
        {/* サムネイル: 1200:630 固定・左寄せ。 */}
        <div className="relative aspect-[1200/630] w-32 shrink-0 overflow-hidden rounded bg-gray-100 sm:w-44">
          {thumbnail_url ? (
            <Image
              src={thumbnail_url}
              alt=""
              fill
              sizes="(max-width: 640px) 128px, 176px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100">
              <span className="select-none text-3xl font-black tracking-tighter text-sky-300/60">
                {category.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* タイトル + 抜粋 */}
        <div className="min-w-0">
          <p className="m-0 line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-sky-600 sm:text-base">
            {title}
          </p>
          {excerpt && (
            <p className="m-0 mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
              {excerpt}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
