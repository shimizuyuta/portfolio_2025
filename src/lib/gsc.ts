import { createSign } from "node:crypto";
import { SITE_URL } from "@/lib/site";

// Google Search Console への sitemap 再送信。
//
// Google は 2023 年に sitemap ping（google.com/ping?sitemap=）を廃止したため、
// 「公開したら GSC に読み直させる」正規の手段は Search Console API の
// sitemaps.submit（PUT）だけになった。記事公開時に人間が叩く
// /api/revalidate に相乗りさせ、そこからこの関数を呼ぶ。
//
// 認証はサービスアカウントの JWT を自前で組んで access token に交換する。
// google-auth-library / googleapis を足す案もあったが、呼ぶのは 1 エンドポイント
// だけで、依存を増やすほどの実装量ではないため node:crypto で完結させる。

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters";
// GSC の URL プレフィックスプロパティは末尾スラッシュ付きで登録されている。
// API の siteUrl は登録値と厳密一致する必要があるためスラッシュを付ける。
const GSC_SITE_URL = `${SITE_URL}/`;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

export type SitemapSubmitResult =
  | { ok: true }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped: false; status: number; body: string };

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// サービスアカウントの秘密鍵で署名した JWT を access token に交換する。
async function fetchAccessToken(
  clientEmail: string,
  privateKey: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );

  const signingInput = `${header}.${claim}`;
  const signature = base64url(
    createSign("RSA-SHA256").update(signingInput).sign(privateKey),
  );
  const assertion = `${signingInput}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!res.ok) {
    throw new Error(`token exchange failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("token exchange returned no access_token");
  }
  return data.access_token;
}

export async function submitSitemap(): Promise<SitemapSubmitResult> {
  const clientEmail = process.env.GSC_SERVICE_ACCOUNT_EMAIL?.trim();
  // Vercel の環境変数では改行が \n という 2 文字で保存されるため、
  // 実際の改行に戻さないと PEM のパースに失敗する。
  const privateKey = process.env.GSC_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  ).trim();

  // 認証情報が無い環境（preview デプロイ・ローカル等）では送信をスキップする。
  // revalidate 本体を失敗させないため、これは正常系として扱う。
  if (!clientEmail || !privateKey) {
    return {
      ok: false,
      skipped: true,
      reason: "GSC service account env vars are not set",
    };
  }

  const accessToken = await fetchAccessToken(clientEmail, privateKey);

  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    GSC_SITE_URL,
  )}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`;

  const res = await fetch(endpoint, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // 成功時は 204 No Content。
  if (!res.ok) {
    return {
      ok: false,
      skipped: false,
      status: res.status,
      body: await res.text(),
    };
  }

  return { ok: true };
}
