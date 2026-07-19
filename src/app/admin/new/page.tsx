import { assertAdminPage } from "../guard";
import { NewArticleForm } from "./NewArticleForm";

export default function NewArticlePage() {
  assertAdminPage();
  return (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-6">新規作成</h2>
      <NewArticleForm />
    </>
  );
}
