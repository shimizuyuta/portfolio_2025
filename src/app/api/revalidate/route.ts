import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { verifyBearerToken } from "@/lib/api-auth";
import { submitSitemap } from "@/lib/gsc";

// 公開記事キャッシュの再検証エンドポイント。
//
// 記事の追加・公開は Supabase 上で起きるが、revalidateTag を呼ぶ
// admin は ADMIN_ENABLED でローカル限定のため、本番のキャッシュには届かない。
// 結果として「公開したのに本番の一覧・サイトマップに出ない」が起きる
// （getPublishedArticles は revalidate: 86400 でキャッシュされる）。
// 本番の外から再検証を起こせる唯一の経路がこのルート。
//
// 認証は BLOG_API_KEY を流用する。専用トークンを分ける案もあったが、
// 漏洩時の被害が非対称すぎて分離の価値が小さい：BLOG_API_KEY が漏れれば
// 記事を書き換えられるのに対し、キャッシュ破棄でできるのは本番を一度
// 再クエリさせることだけ。変数を増やす設定コストのほうが上回る。
export async function POST(request: Request) {
  const authorized = verifyBearerToken(
    request.headers.get("Authorization"),
    process.env.BLOG_API_KEY,
  );

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("published-articles");

  // sitemap の再送信で GSC に再クロールを促す。
  // Google が sitemap ping を廃止したため、公開反映と同じこのタイミングで
  // Search Console API を叩くのが自動検知の唯一の経路になる。
  // キャッシュ再検証が主目的なので、送信失敗で全体を 500 にはしない。
  // 結果は sitemap フィールドで返し、成否はレスポンスで確認できるようにする。
  let sitemap: string;
  try {
    const result = await submitSitemap();
    if (result.ok) {
      sitemap = "submitted";
    } else if (result.skipped) {
      sitemap = `skipped: ${result.reason}`;
    } else {
      sitemap = `failed: ${result.status} ${result.body}`;
    }
  } catch (error) {
    sitemap = `error: ${error instanceof Error ? error.message : String(error)}`;
  }

  return NextResponse.json({
    revalidated: true,
    tag: "published-articles",
    sitemap,
    now: new Date().toISOString(),
  });
}
