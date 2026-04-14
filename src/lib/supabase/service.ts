import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Service Role クライアント（RLS バイパス・サーバーサイド専用）
// cookies 不要のため generateStaticParams やサーバーアクションでも使用可能
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  );
}
