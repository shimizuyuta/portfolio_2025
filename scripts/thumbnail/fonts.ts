import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// satori はフォントを Buffer で受け取るため、next/font/google（src/app/layout.tsx）は再利用できない。
// woff2 は satori 非対応なので woff を使う。
//
// Fontsource は unicode-range ごとにファイルが分かれており、japanese サブセットに
// ラテン文字は入っていない。フッターの URL などが豆腐になるため latin も併せて読み込み、
// satori のフォントスタックでグリフ単位にフォールバックさせる。
const CDN = "https://cdn.jsdelivr.net/npm/@fontsource";
const CACHE_DIR = join(process.cwd(), "tmp", "fonts");

export const FONT_JP = "Noto Sans JP";
export const FONT_LATIN = "Noto Sans JP Latin";
export const FONT_SERIF = "Noto Serif";

/** 本文用。日本語 → ラテンの順に解決される。 */
export const FONT_STACK = `"${FONT_JP}", "${FONT_LATIN}"`;

/**
 * 見出し用。ラテン文字だけセリフ体になる。
 *
 * お手本（tmp/サムネお手本/image copy.png）の「IT導入補助金とは」は
 * IT がセリフ体・日本語が極太ゴシックという組み合わせ。セリフを先頭に置くと
 * satori がグリフ単位でフォールバックするため、この形が再現できる。
 */
export const DISPLAY_STACK = `"${FONT_SERIF}", "${FONT_JP}", "${FONT_LATIN}"`;

type Weight = 500 | 700 | 900;

type FontSpec = {
  /** satori に登録する名前 */
  name: string;
  /** Fontsource 上のファイル名（拡張子なし） */
  file: string;
  weight: Weight;
};

const FONTS: FontSpec[] = [
  {
    name: FONT_JP,
    file: "noto-sans-jp/noto-sans-jp-japanese-500",
    weight: 500,
  },
  {
    name: FONT_JP,
    file: "noto-sans-jp/noto-sans-jp-japanese-700",
    weight: 700,
  },
  {
    name: FONT_JP,
    file: "noto-sans-jp/noto-sans-jp-japanese-900",
    weight: 900,
  },
  {
    name: FONT_LATIN,
    file: "noto-sans-jp/noto-sans-jp-latin-500",
    weight: 500,
  },
  {
    name: FONT_LATIN,
    file: "noto-sans-jp/noto-sans-jp-latin-700",
    weight: 700,
  },
  {
    name: FONT_LATIN,
    file: "noto-sans-jp/noto-sans-jp-latin-900",
    weight: 900,
  },
  { name: FONT_SERIF, file: "noto-serif/noto-serif-latin-700", weight: 700 },
  { name: FONT_SERIF, file: "noto-serif/noto-serif-latin-900", weight: 900 },
];

async function loadFile(file: string): Promise<Buffer> {
  const filename = `${file.split("/")[1]}-normal.woff`;
  const cached = join(CACHE_DIR, filename);

  try {
    return await readFile(cached);
  } catch {
    // 未キャッシュなら取得する。tmp/ は .gitignore 済みなのでリポジトリには載らない。
  }

  const [pkg, name] = file.split("/");
  const response = await fetch(`${CDN}/${pkg}@5/files/${name}-normal.woff`);
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
  return Promise.all(
    FONTS.map(async ({ name, file, weight }) => ({
      name,
      data: await loadFile(file),
      weight,
      style: "normal" as const,
    })),
  );
}
