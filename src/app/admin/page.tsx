import { notFound } from "next/navigation";
import AdminClient from "./AdminClient";
import { getAdminArticles } from "./actions";

export default async function AdminPage() {
  if (!process.env.ADMIN_ENABLED) {
    notFound();
  }

  const articles = await getAdminArticles();

  return <AdminClient initialArticles={articles} />;
}
