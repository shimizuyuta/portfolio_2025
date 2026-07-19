"use client";

import { useRouter } from "next/navigation";
import { ArticleForm, EMPTY_FORM } from "../_components/ArticleForm";
import { type ArticleInput, createArticle } from "../actions";

export function NewArticleForm() {
  const router = useRouter();

  async function handleSubmit(input: ArticleInput) {
    await createArticle(input);
    // createArticle 側で revalidatePath("/admin") 済みなので push だけでよい
    router.push("/admin");
  }

  return (
    <ArticleForm
      initialForm={EMPTY_FORM}
      submitLabel="作成する"
      onSubmit={handleSubmit}
    />
  );
}
