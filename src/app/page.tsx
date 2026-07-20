import { getPublishedArticles } from "@/lib/knowledge";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // ホームの記事セクションは補助的な要素なので、取得に失敗しても
  // ページ全体を 500 にはしない。トップが落ちる損失のほうが大きい。
  //
  // 一覧（/knowledge）とサイトマップでは逆に握り潰さない。
  // あちらは記事が本体で、空のまま 200 を返すと検索エンジンに
  // 「記事が無いサイト」と伝えてしまうため。
  let articles: Awaited<ReturnType<typeof getPublishedArticles>> = [];
  try {
    articles = await getPublishedArticles(3);
  } catch (e) {
    console.error("ホームの記事セクションの取得に失敗しました", e);
  }

  return <HomeClient articles={articles} />;
}
