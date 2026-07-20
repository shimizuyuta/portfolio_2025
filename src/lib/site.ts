// 本番サイトの URL。
//
// 環境変数にしていない。本番は1つしかなく、切り替える必要が無いため。
// 環境変数にすると Vercel・ローカル双方への設定が必要になり、
// 「環境変数は既存デプロイに遡らない」（vercel.md）を踏む機会も増える。
//
// layout.tsx（metadataBase）・sitemap.ts・robots.ts・admin/actions.ts が参照する。
// 以前は3箇所に同じ文字列がハードコードされていた。
export const SITE_URL = "https://www.ysdevelopment.jp";
