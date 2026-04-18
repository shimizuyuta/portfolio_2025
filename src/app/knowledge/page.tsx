import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/knowledge";
import { KnowledgeClient } from "./KnowledgeClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ブログ",
  description:
    "Web制作・AI活用・業務効率化に関する技術記事を発信しています。Next.js、Supabase、フリーランスのノウハウなど。",
  alternates: {
    canonical: "/knowledge",
  },
  openGraph: {
    title: "ブログ | YSデベロップメント",
    description:
      "Web制作・AI活用・業務効率化に関する技術記事を発信しています。",
    url: "/knowledge",
    type: "website",
  },
};

export default async function KnowledgePage() {
  const articles = await getPublishedArticles();

  return (
    <main className="min-h-screen bg-white">
      {/* ── ヘッダー ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-12">
          {/* パンくずリスト */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              Top
            </Link>
            <span>/</span>
            <span className="text-gray-600">Blog</span>
          </nav>

          <p className="text-sm font-bold text-sky-500 tracking-widest mb-2">
            Blog
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            ブログ
          </h1>
        </div>
      </div>

      {/* ── コンテンツ ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <KnowledgeClient articles={articles} />
      </div>
    </main>
  );
}
