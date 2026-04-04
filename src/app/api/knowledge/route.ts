import { NextResponse } from "next/server";
import { getPublishedArticles } from "@/lib/knowledge";

export async function GET() {
  const articles = await getPublishedArticles();
  return NextResponse.json(articles.slice(0, 3));
}
