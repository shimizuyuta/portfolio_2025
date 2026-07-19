import { notFound } from "next/navigation";
import { getAdminArticleById } from "../../actions";
import { EditArticleForm } from "./EditArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getAdminArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-6">記事を編集</h2>
      <EditArticleForm
        id={id}
        initialForm={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt ?? "",
          content: article.content ?? "",
          category: article.category ?? "",
          status: article.status as "draft" | "published",
          published_at: article.published_at ?? null,
          tagNames: article.tagNames ?? [],
          thumbnail_url: article.thumbnail_url ?? null,
        }}
      />
    </>
  );
}
