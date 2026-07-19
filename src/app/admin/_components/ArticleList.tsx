"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteArticle } from "../actions";

export type AdminArticle = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  published_at: string | null;
  updated_at: string;
};

export function ArticleList({
  articles,
  isFiltered = false,
}: {
  articles: AdminArticle[];
  isFiltered?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string, title: string) {
    if (!window.confirm(`「${title}」を削除しますか？`)) return;
    startTransition(async () => {
      try {
        await deleteArticle(id);
        // 一覧はサーバーコンポーネントなので再取得はサーバーに任せる
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "削除に失敗しました");
      }
    });
  }

  if (articles.length === 0) {
    // 絞り込みの結果 0 件なのか、そもそも記事が無いのかで意味が違う
    return (
      <p className="text-sm text-gray-400 text-center py-20">
        {isFiltered ? "条件に一致する記事がありません" : "記事がありません"}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}

      {articles.map((a) => (
        <div
          key={a.id}
          className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4"
        >
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{a.title}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge
                className={`text-xs border ${
                  a.status === "published"
                    ? "bg-sky-50 text-sky-700 border-sky-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {a.status === "published" ? "公開" : "下書き"}
              </Badge>
              {a.category && (
                <span className="text-xs text-gray-400">{a.category}</span>
              )}
              {a.published_at && (
                <span className="text-xs text-gray-400">
                  {new Date(a.published_at).toLocaleDateString("ja-JP")}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              asChild
              variant="outline"
              className="h-auto py-1.5 px-3 text-xs rounded-lg"
            >
              <Link href={`/admin/${a.id}/preview`}>プレビュー</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-1.5 px-3 text-xs rounded-lg"
            >
              <Link href={`/admin/${a.id}/edit`}>編集</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDelete(a.id, a.title)}
              disabled={isPending}
              className="h-auto py-1.5 px-3 text-xs rounded-lg text-red-600 border-red-200 hover:bg-red-50"
            >
              削除
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
