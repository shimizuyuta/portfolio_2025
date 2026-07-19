import { notFound } from "next/navigation";

// 各ページの先頭で、データ取得より前に呼ぶ。
//
// layout.tsx にも同じ判定があるが、それだけでは足りない：
// Next.js は layout と page のデータ取得を独立して実行するため、
// layout が notFound() を投げてもページ側の getAdminArticles() は走る。
// ADMIN_ENABLED が無い環境（CI・本番ビルド）ではそこで
// assertAdminEnabled() が Forbidden を投げ、ビルドが失敗する。
export function assertAdminPage() {
  if (!process.env.ADMIN_ENABLED) {
    notFound();
  }
}
