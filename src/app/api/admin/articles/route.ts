import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { getAdminArticles } from "@/app/admin/actions";

export async function GET() {
  if (!process.env.ADMIN_ENABLED) {
    notFound();
  }
  const articles = await getAdminArticles();
  return NextResponse.json(articles);
}
