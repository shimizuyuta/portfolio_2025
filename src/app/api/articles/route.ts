import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { Database } from "@/types/supabase";

function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  );
}

function authenticate(request: Request): boolean {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === process.env.BLOG_API_KEY;
}

export async function POST(request: Request) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    slug,
    content,
    excerpt,
    category,
    tags,
    status,
    published_at,
  } = body;

  if (!title || !slug || !content || !excerpt || !category) {
    return NextResponse.json(
      { error: "必須項目が不足しています" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();

  const { data: article, error: articleError } = await supabase
    .from("articles")
    .insert({
      title,
      slug,
      content,
      excerpt,
      category,
      status: status ?? "draft",
      published_at: published_at ?? null,
    })
    .select("id")
    .single();

  if (articleError) {
    return NextResponse.json({ error: articleError.message }, { status: 500 });
  }

  if (Array.isArray(tags) && tags.length > 0) {
    for (const tagName of tags) {
      const { data: tag } = await supabase
        .from("tags")
        .upsert({ name: tagName }, { onConflict: "name" })
        .select("id")
        .single();

      if (tag) {
        await supabase
          .from("article_tags")
          .insert({ article_id: article.id, tag_id: tag.id });
      }
    }
  }

  return NextResponse.json({ id: article.id }, { status: 201 });
}
