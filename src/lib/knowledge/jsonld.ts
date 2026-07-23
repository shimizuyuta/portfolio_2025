import { SITE_URL } from "@/lib/site";
import type { Article } from "./index";

// 発行元（サイト運営者）。schema.org の Organization として使う。
const PUBLISHER = {
  "@type": "Organization",
  name: "YSデベロップメント",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo/logo.png`,
  },
} as const;

// 記事本文（Article.content）から description を作る。
// generateMetadata と同じロジックにして、OGP と構造化データの説明文を揃える。
function buildDescription(article: Article): string {
  return article.excerpt || article.content.slice(0, 120).replace(/\n/g, " ");
}

// 記事詳細ページの構造化データ（BlogPosting）。
// 検索結果での記事としての意味づけ・日付表示に使われる。
function buildBlogPosting(article: Article) {
  const url = `${SITE_URL}/knowledge/${article.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: article.title,
    description: buildDescription(article),
    // サムネイルが無い記事もあるため、あるときだけ image を出す。
    ...(article.thumbnail_url ? { image: [article.thumbnail_url] } : {}),
    datePublished: article.published_at ?? undefined,
    dateModified: article.updated_at || article.published_at || undefined,
    author: {
      "@type": "Organization",
      name: PUBLISHER.name,
      url: PUBLISHER.url,
    },
    publisher: PUBLISHER,
    // 業界タグ×テーマタグをキーワードとして渡す。
    ...(article.tags.length > 0
      ? { keywords: article.tags.map((tag) => tag.name).join(", ") }
      : {}),
  };
}

// パンくず（ホーム → ナレッジ → 記事）。検索結果のパンくず表示に使われる。
function buildBreadcrumb(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "ナレッジ",
        item: `${SITE_URL}/knowledge`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${SITE_URL}/knowledge/${article.slug}`,
      },
    ],
  };
}

// 記事ページに埋め込む JSON-LD 群を1つの配列で返す。
export function buildArticleJsonLd(article: Article) {
  return [buildBlogPosting(article), buildBreadcrumb(article)];
}

// JSON-LD を <script> に埋め込む際の文字列化。
// `<` を < にエスケープして、本文中の "</script>" 等による
// スクリプト境界の破壊（XSS）を防ぐ。
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
