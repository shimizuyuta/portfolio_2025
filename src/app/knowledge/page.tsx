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

      {/* ── CTAバナー ─────────────────────────────────────────── */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-sky-400 mb-3">
            Free Consultation
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
            AI・ITの導入、一緒に考えます
          </h2>
          <p className="text-sm md:text-base text-gray-300 mb-8 leading-relaxed max-w-lg mx-auto">
            「何から始めればいい？」「自社に合うか不安」——
            現役エンジニアがあなたの状況に合わせて一緒に整理します。
          </p>
          <Link
            href="/contact"
            className="inline-block bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm px-8 py-3 rounded-full transition-colors duration-200"
          >
            無料で相談する →
          </Link>
        </div>
      </div>
    </main>
  );
}
