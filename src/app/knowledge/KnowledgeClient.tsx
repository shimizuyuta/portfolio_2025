"use client";

import Link from "next/link";
import { useState } from "react";
import type { Article } from "@/lib/knowledge";

const categoryColors: Record<string, string> = {
  デザイン: "from-pink-400 to-rose-500",
  フロントエンド: "from-sky-400 to-blue-500",
  Web制作ガイド: "from-violet-400 to-purple-500",
  カルチャー: "from-amber-400 to-orange-500",
  インタビュー: "from-emerald-400 to-teal-500",
  マーケティング: "from-indigo-400 to-blue-600",
  AI: "from-cyan-400 to-sky-500",
  開発: "from-slate-400 to-gray-600",
};

function getCategoryGradient(category: string): string {
  return categoryColors[category] ?? "from-sky-400 to-indigo-500";
}

export function KnowledgeClient({ articles }: { articles: Article[] }) {
  const categories = [
    "すべて",
    ...Array.from(new Set(articles.map((a) => a.category))),
  ];
  const allTags = Array.from(
    new Map(articles.flatMap((a) => a.tags).map((t) => [t.id, t])).values(),
  );

  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  };

  const filtered = articles.filter((a) => {
    const catMatch =
      selectedCategory === "すべて" || a.category === selectedCategory;
    const tagMatch =
      selectedTags.length === 0 ||
      selectedTags.every((id) => a.tags.some((t) => t.id === id));
    return catMatch && tagMatch;
  });

  return (
    <div>
      {/* ── フィルター ───────────────────────────────────── */}
      <div className="mb-10 space-y-5">
        {/* カテゴリー */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-gray-500 tracking-wide w-full md:w-auto">
            Category
            <span className="ml-2 font-normal text-xs text-gray-400">
              カテゴリーから探す
            </span>
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                  selectedCategory === cat
                    ? "bg-sky-500 border-sky-500 text-white"
                    : "bg-white border-gray-300 text-gray-600 hover:border-sky-400 hover:text-sky-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* タグ */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-500 tracking-wide w-full md:w-auto">
              Tag
              <span className="ml-2 font-normal text-xs text-gray-400">
                キーワードから探す
              </span>
            </span>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                    selectedTags.includes(tag.id)
                      ? "bg-sky-500 border-sky-500 text-white"
                      : "bg-white border-gray-300 text-gray-500 hover:border-sky-400 hover:text-sky-600"
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Latest ─────────────────────────────────────────── */}
      <div className="mb-8 flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-gray-900 inline-block" />
        <h2 className="text-lg font-bold text-gray-900">
          Latest
          <span className="ml-3 text-sm font-normal text-gray-400">
            最新の記事
          </span>
        </h2>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-gray-400">
          該当する記事が見つかりませんでした。
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((article) => (
            <li key={article.id}>
              <Link
                href={`/knowledge/${article.slug}`}
                className="group block rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200"
              >
                {/* サムネイル */}
                <div
                  className={`h-36 bg-gradient-to-br ${getCategoryGradient(article.category)} flex items-center justify-center`}
                >
                  <span className="text-white/30 text-5xl font-black tracking-tighter select-none">
                    {article.category.charAt(0)}
                  </span>
                </div>

                {/* 本文 */}
                <div className="p-4">
                  <span className="inline-block text-xs font-medium text-sky-600 mb-2">
                    {article.category}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-3 line-clamp-2 group-hover:text-sky-600 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {article.tags.map((tag) => (
                      <span key={tag.id} className="text-xs text-sky-500">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                  <time className="text-xs text-gray-400">
                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString(
                          "ja-JP",
                        )
                      : ""}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
