import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/knowledge";
import { KnowledgeClient } from "./KnowledgeClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ブログ",
  description:
    "福祉×IT・AIをテーマに、現役エンジニア・社会福祉士が発信するブログ。福祉業界のDX・AI活用・業務効率化の実践知見を紹介します。",
  alternates: {
    canonical: "/knowledge",
  },
  openGraph: {
    title: "ブログ | YSデベロップメント",
    description:
      "福祉×IT・AIをテーマに、現役エンジニア・社会福祉士が発信するブログ。福祉業界のDX・AI活用の実践知見を紹介します。",
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
