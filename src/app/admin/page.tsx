import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleFilters } from "./_components/ArticleFilters";
import { ArticleList } from "./_components/ArticleList";
import {
  type AdminSearchParams,
  hasActiveFilters,
  parseFilters,
} from "./_components/filters";
import { getAdminArticles } from "./actions";
import { assertAdminPage } from "./guard";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  assertAdminPage();

  const params = await searchParams;
  const filters = parseFilters(params);
  const articles = await getAdminArticles(filters);

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h2 className="text-lg font-bold text-gray-900">記事一覧</h2>

        <div className="flex items-center gap-3">
          <ArticleFilters searchParams={params} filters={filters} />
          <Button
            asChild
            className="bg-gray-900 hover:bg-gray-700 text-white rounded-lg px-4 py-2 h-auto text-sm"
          >
            <Link href="/admin/new">+ 新規作成</Link>
          </Button>
        </div>
      </div>

      <ArticleList articles={articles} isFiltered={hasActiveFilters(filters)} />
    </>
  );
}
