import { timingSafeEqual } from "node:crypto";

// Bearer トークンの照合。
//
// fail closed：期待値が未設定・空文字の環境では常に false を返す。
// 設定漏れの環境でエンドポイントが誰でも叩ける事故を防ぐため
// （preview.ts の isValidPreviewToken と同方針）。
export function verifyBearerToken(
  authorizationHeader: string | null,
  expectedToken: string | undefined,
): boolean {
  // Vercel の環境変数は貼り付け時に末尾へ改行が混入することがある。
  // 見た目が同じでも "abc" と "abc\n" は厳密比較で一致しないため、
  // 両辺を trim してから比較する（NEXT_PUBLIC_GA_ID と同種の対処）。
  const key = expectedToken?.trim();
  if (!key || !authorizationHeader?.startsWith("Bearer ")) return false;

  const received = Buffer.from(authorizationHeader.slice(7).trim());
  const expected = Buffer.from(key);

  // timingSafeEqual は長さが違うと例外を投げるので先に弾く。
  // 長さの差は秘匿できないが、内容の総当たりは時間差から守る。
  if (received.length !== expected.length) return false;

  return timingSafeEqual(received, expected);
}
