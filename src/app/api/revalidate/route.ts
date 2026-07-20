import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { verifyBearerToken } from "@/lib/api-auth";

// 公開記事キャッシュの再検証エンドポイント。
//
// 記事の追加・公開は Supabase 上で起きるが、revalidateTag を呼ぶ
// admin は ADMIN_ENABLED でローカル限定のため、本番のキャッシュには届かない。
// 結果として「公開したのに本番の一覧・サイトマップに出ない」が起きる
// （getPublishedArticles は revalidate: 86400 でキャッシュされる）。
// 本番の外から再検証を起こせる唯一の経路がこのルート。
//
// BLOG_API_KEY とは別トークンにしている。記事の読み書き権限と
// キャッシュ破棄の権限は影響範囲が違うため、片方が漏れても
// もう片方が巻き込まれないようにする。
export async function POST(request: Request) {
  const authorized = verifyBearerToken(
    request.headers.get("Authorization"),
    process.env.REVALIDATE_TOKEN,
  );

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("published-articles");

  return NextResponse.json({
    revalidated: true,
    tag: "published-articles",
    now: new Date().toISOString(),
  });
}
