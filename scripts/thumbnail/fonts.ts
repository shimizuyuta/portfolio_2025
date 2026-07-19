import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// satori はフォントを Buffer で受け取るため、next/font/google（src/app/layout.tsx）は再利用できない。
// woff2 は satori 非対応なので woff を使う。
//
// Fontsource は unicode-range ごとにファイルが分かれており、japanese サブセットに
// ラテン文字は入っていない。フッターの URL などが豆腐になるため latin も併せて読み込み、
// satori のフォントスタックでグリフ単位にフォールバックさせる。
const FONT_CDN =
  "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5/files";
const CACHE_DIR = join(process.cwd(), "tmp", "fonts");

export const FONT_JP = "Noto Sans JP";
export const FONT_LATIN = "Noto Sans JP Latin";

/** satori の fontFamily に渡すスタック。日本語 → ラテンの順に解決される。 */
export const FONT_STACK = `"${FONT_JP}", "${FONT_LATIN}"`;

type Subset = "japanese" | "latin";
type Weight = 500 | 700;

async function loadFile(subset: Subset, weight: Weight): Promise<Buffer> {
  const filename = `noto-sans-jp-${subset}-${weight}-normal.woff`;
  const cached = join(CACHE_DIR, filename);

  try {
    return await readFile(cached);
  } catch {
    // 未キャッシュなら取得する。tmp/ は .gitignore 済みなのでリポジトリには載らない。
  }

  const response = await fetch(`${FONT_CDN}/${filename}`);
  if (!response.ok) {
    throw new Error(
      `フォントの取得に失敗しました: ${filename} (HTTP ${response.status})`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(cached, buffer);
  return buffer;
}

export type SatoriFont = {
  name: string;
  data: Buffer;
  weight: Weight;
  style: "normal";
};

/** satori の `fonts` オプションに渡す配列を返す。初回のみ CDN から取得しキャッシュする。 */
export async function loadFonts(): Promise<SatoriFont[]> {
  const specs: Array<{ name: string; subset: Subset; weight: Weight }> = [
    { name: FONT_JP, subset: "japanese", weight: 500 },
    { name: FONT_JP, subset: "japanese", weight: 700 },
    { name: FONT_LATIN, subset: "latin", weight: 500 },
    { name: FONT_LATIN, subset: "latin", weight: 700 },
  ];

  return Promise.all(
    specs.map(async ({ name, subset, weight }) => ({
      name,
      data: await loadFile(subset, weight),
      weight,
      style: "normal" as const,
    })),
  );
}
