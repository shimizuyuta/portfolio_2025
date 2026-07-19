import type { createServiceClient } from "@/lib/supabase/service";

type ServiceClient = ReturnType<typeof createServiceClient>;

// タグを upsert して ID を返す
export async function upsertTags(
  supabase: ServiceClient,
  names: string[],
): Promise<string[]> {
  if (names.length === 0) return [];
  const { data, error } = await supabase
    .from("tags")
    .upsert(
      names.map((name) => ({ name })),
      { onConflict: "name" },
    )
    .select("id");
  if (error) throw new Error(error.message);
  return (data ?? []).map((t) => t.id);
}

// article_tags を洗い替え
export async function syncArticleTags(
  supabase: ServiceClient,
  articleId: string,
  tagIds: string[],
) {
  await supabase.from("article_tags").delete().eq("article_id", articleId);
  if (tagIds.length === 0) return;
  const { error } = await supabase
    .from("article_tags")
    .insert(tagIds.map((tag_id) => ({ article_id: articleId, tag_id })));
  if (error) throw new Error(error.message);
}
