"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";

export type ArticleInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: "draft" | "published";
  published_at: string | null;
};

export async function createArticle(input: ArticleInput) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("articles").insert([input]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/knowledge");
}

export async function updateArticle(id: string, input: ArticleInput) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("articles")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/knowledge");
}

export async function deleteArticle(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/knowledge");
}

export async function getAdminArticles() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug, category, status, published_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminArticleById(id: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}
