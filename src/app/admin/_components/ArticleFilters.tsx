import Link from "next/link";
import type { ArticleFilters as Filters } from "../actions";
import { type AdminSearchParams, buildAdminHref } from "./filters";

// 選択肢が有限なのでリンクで組む。クライアントコンポーネントにしない。
// 将来キーワード検索を足すときは、その入力欄だけを "use client" にすればよい。
const STATUS_OPTIONS: { label: string; value: Filters["status"] }[] = [
  { label: "すべて", value: undefined },
  { label: "公開", value: "published" },
  { label: "下書き", value: "draft" },
];

export function ArticleFilters({
  searchParams,
  filters,
}: {
  searchParams: AdminSearchParams;
  filters: Filters;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
      {STATUS_OPTIONS.map((option) => {
        const active = filters.status === option.value;
        return (
          <Link
            key={option.label}
            href={buildAdminHref(searchParams, { status: option.value })}
            aria-current={active ? "true" : undefined}
            className={`rounded-md px-3 py-1 text-xs transition-colors ${
              active
                ? "bg-white font-bold text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
