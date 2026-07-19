"use client";

import { useRouter } from "next/navigation";
import { ArticleForm } from "../../_components/ArticleForm";
import { type ArticleInput, updateArticle } from "../../actions";

export function EditArticleForm({
  id,
  initialForm,
}: {
  id: string;
  initialForm: ArticleInput;
}) {
  const router = useRouter();

  async function handleSubmit(input: ArticleInput) {
    await updateArticle(id, input);
    // updateArticle 側で revalidatePath("/admin") 済みなので push だけでよい
    router.push("/admin");
  }

  return (
    <ArticleForm
      initialForm={initialForm}
      submitLabel="更新する"
      onSubmit={handleSubmit}
    />
  );
}
