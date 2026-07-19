import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleList } from "./_components/ArticleList";
import { getAdminArticles } from "./actions";
import { assertAdminPage } from "./guard";

export default async function AdminPage() {
  assertAdminPage();
  const articles = await getAdminArticles();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">記事一覧</h2>
        <Button
          asChild
          className="bg-gray-900 hover:bg-gray-700 text-white rounded-lg px-4 py-2 h-auto text-sm"
        >
          <Link href="/admin/new">+ 新規作成</Link>
        </Button>
      </div>

      <ArticleList articles={articles} />
    </>
  );
}
