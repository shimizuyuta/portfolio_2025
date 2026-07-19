import { timingSafeEqual } from "node:crypto";

// プレビュートークンの照合。
//
// fail closed：PREVIEW_TOKEN が未設定・空文字の環境ではプレビュー機能ごと
// 無効になる。設定漏れの環境で draft が誰でも見える事故を防ぐため。
export function isValidPreviewToken(token: string | undefined): boolean {
  const expected = process.env.PREVIEW_TOKEN?.trim();

  if (!expected || !token) return false;

  const a = Buffer.from(token);
  const b = Buffer.from(expected);

  // timingSafeEqual は長さが違うと例外を投げるので先に弾く。
  // 長さの differences は秘匿できないが、内容の総当たりは時間差から守る。
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}
