import type { ArticleFilters } from "../actions";

// URL のクエリパラメータが絞り込み条件の置き場。
// パラメータの解釈とリンク先の組み立てをここ 1 箇所に集約する。
// 条件を増やすときに触るのはこのファイルと ArticleFilters 型だけで済む。

export type AdminSearchParams = Record<string, string | string[] | undefined>;

const STATUSES = ["draft", "published"] as const;

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

// 不正な値は「指定なし」に倒す。
// 任意の文字列をそのまま DB クエリに渡さないため、既知の値のみ通す。
export function parseFilters(searchParams: AdminSearchParams): ArticleFilters {
  const status = single(searchParams.status);

  return {
    status: STATUSES.includes(status as (typeof STATUSES)[number])
      ? (status as ArticleFilters["status"])
      : undefined,
  };
}

// 既存のパラメータを保ったまま、指定したキーだけ差し替える。
// undefined を渡すとそのキーを削除する（＝絞り込み解除）。
//
// 条件が増えても「他を保ったまま1つだけ変える」が自然に書けるようにするため、
// 個別のリンクで URL を組み立てず必ずこれを通す。
export function buildAdminHref(
  searchParams: AdminSearchParams,
  patch: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    const v = single(value);
    if (v) params.set(key, v);
  }

  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
}

// 絞り込みが 1 つでも掛かっているか（空状態の文言の出し分けに使う）
export function hasActiveFilters(filters: ArticleFilters): boolean {
  return Object.values(filters).some((v) => v !== undefined);
}
