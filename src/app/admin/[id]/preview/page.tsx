import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/ArticleView";
import { getAdminArticleById } from "../../actions";
import { assertAdminPage } from "../../guard";

// 保存済み記事を公開ページと同じ見た目で確認するページ。
//
// PREVIEW_TOKEN を使う /knowledge/[slug]?preview= とは経路を分けている。
// 一覧からリンクする以上トークンをクライアントに渡すことになり、
// 認証情報をクライアントコードに埋め込まない方針に反するため。
// admin は ADMIN_ENABLED でローカル限定なので、ここでは認証が要らない。
export default async function PreviewArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  assertAdminPage();
  const { id } = await params;
  const article = await getAdminArticleById(id);

  if (!article) {
    notFound();
  }

  const tagNames: string[] = article.tagNames ?? [];

  return (
    // admin layout の max-w-4xl / px-6 / py-10 を打ち消して全幅で描く。
    // 公開ページと同じ幅で見せることがこのページの目的なので、
    // 管理画面のコンテナ幅に収めると意味がなくなる。
    <div className="relative left-1/2 -my-10 w-screen -translate-x-1/2 bg-white">
      {/* sticky にはしない。サイト共通ヘッダーも sticky で、その背面に隠れる。
          ヘッダー高さ分の top オフセットを数値で決め打ちすると、
          ヘッダーを変えたときに静かに壊れるため。 */}
      <div className="flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2">
        <span className="text-xs font-bold text-amber-800">
          プレビュー（
          {article.status === "published" ? "公開済み" : "下書き"}）
        </span>
        <Link
          href={`/admin/${id}/edit`}
          className="ml-auto rounded-md border border-amber-300 bg-white px-3 py-1 text-xs text-amber-900 transition-colors hover:bg-amber-100"
        >
          編集する
        </Link>
        <Link
          href="/admin"
          className="rounded-md border border-amber-300 bg-white px-3 py-1 text-xs text-amber-900 transition-colors hover:bg-amber-100"
        >
          一覧へ戻る
        </Link>
      </div>

      <ArticleView
        title={article.title}
        category={article.category ?? ""}
        tags={tagNames}
        content={article.content ?? ""}
        thumbnailUrl={article.thumbnail_url ?? null}
        publishedAt={article.published_at ?? null}
      />
    </div>
  );
}
