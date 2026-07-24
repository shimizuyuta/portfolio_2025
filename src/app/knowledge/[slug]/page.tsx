import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/ArticleView";
import {
  extractInternalArticleSlugs,
  getArticleBySlug,
  getArticleBySlugForPreview,
  getArticleCardsBySlugs,
  toArticleCardMap,
} from "@/lib/knowledge";
import { buildArticleJsonLd, serializeJsonLd } from "@/lib/knowledge/jsonld";
import { isValidPreviewToken } from "@/lib/knowledge/preview";
import { PreviewBanner } from "./_components/PreviewBanner";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

// ?preview=<PREVIEW_TOKEN> が正しいときだけ draft を取得する。
// トークンが無効なら「プレビューではない」として扱い、通常どおり
// 公開記事のみを探す。結果として draft は notFound() になり、
// 「トークンが違う」と「記事が無い」を外から区別できない。
// draft の存在自体を漏らさないための設計。
async function resolveArticle(
  slug: string,
  searchParams: Promise<{ preview?: string }>,
) {
  const { preview } = await searchParams;
  const isPreview = isValidPreviewToken(preview);

  const article = isPreview
    ? await getArticleBySlugForPreview(slug)
    : await getArticleBySlug(slug);

  return { article, isPreview };
}

// force-dynamic で SSR を強制する。
// generateStaticParams を使うと on-demand ISR（静的コンテキスト）になり
// cookies() が例外になるため、force-dynamic で明示的に SSR に固定する。
// ビルド時の Supabase 接続もスキップされるため generateStaticParams は不要。
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { article, isPreview } = await resolveArticle(slug, searchParams);

  if (!article) {
    return { title: "記事が見つかりません" };
  }

  // プレビューは未公開の内容なので、検索エンジンに拾わせない。
  // canonical も付けない（未公開URLを正規URLとして申告しないため）。
  if (isPreview) {
    return {
      title: `[プレビュー] ${article.title}`,
      robots: { index: false, follow: false },
    };
  }

  const description =
    article.excerpt || article.content.slice(0, 120).replace(/\n/g, " ");
  const ogImage = article.thumbnail_url
    ? [
        {
          url: article.thumbnail_url,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ]
    : undefined;

  return {
    title: article.title,
    description,
    alternates: {
      canonical: `/knowledge/${slug}`,
    },
    openGraph: {
      title: article.title,
      description,
      url: `/knowledge/${slug}`,
      type: "article",
      publishedTime: article.published_at ?? undefined,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: ogImage?.map((img) => img.url),
    },
  };
}

export default async function ArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { article, isPreview } = await resolveArticle(slug, searchParams);

  if (!article) {
    notFound();
  }

  // 本文中の単独行サイト内リンクをカード化するため、リンク先の公開記事メタを
  // 先に取得して渡す（自分自身へのリンクは除外）。
  const linkedSlugs = extractInternalArticleSlugs(article.content).filter(
    (s) => s !== slug,
  );
  const linkCards = toArticleCardMap(await getArticleCardsBySlugs(linkedSlugs));

  return (
    <div className="bg-white min-h-screen">
      {/* プレビューは noindex なので構造化データは公開記事だけに出す。 */}
      {!isPreview &&
        buildArticleJsonLd(article).map((jsonLd) => (
          <script
            key={jsonLd["@type"]}
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD は serializeJsonLd で < をエスケープ済み
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
          />
        ))}
      {isPreview && (
        <PreviewBanner
          status={article.status}
          publishedAt={article.published_at}
        />
      )}
      <ArticleView
        title={article.title}
        category={article.category}
        tags={article.tags.map((tag) => tag.name)}
        content={article.content}
        thumbnailUrl={article.thumbnail_url}
        publishedAt={article.published_at}
        linkCards={linkCards}
      />
    </div>
  );
}
