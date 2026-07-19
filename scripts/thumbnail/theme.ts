import { DISPLAY_STACK as DISPLAY, FONT_STACK } from "./fonts";

export const WIDTH = 1200;
export const HEIGHT = 630;

/**
 * サイトのブランドカラー（src/app/globals.css の :root）を sRGB hex に変換した値。
 * satori は oklch を解釈しないため CSS 変数を直接使えず、ここに複製している。
 * globals.css の色を変えたらこの表も追随させること。
 */
export const COLORS = {
  /** --primary: oklch(0.45 0.18 255) */
  primary: "#0050b5",
  /** --accent: oklch(0.55 0.18 255) */
  accent: "#026fd7",
  /** --foreground: oklch(0.15 0.04 255) */
  foreground: "#020b1b",
  /** --muted-foreground: oklch(0.5 0.05 255) */
  muted: "#506580",
  /** --border: oklch(0.9 0.02 255) */
  border: "#d5dfeb",
  /** ミニマル版の下地。globals.css には無い、サムネ専用の淡いトーン */
  surface: "#f3f7fc",
  /** ミニマル版の装飾円 */
  decoration: "#d2ddfd",
  white: "#ffffff",
} as const;

/** 装飾版のパープル系。お手本 (tmp/サムネお手本/image copy.png) に合わせたサムネ専用の配色 */
export const DECORATED = {
  bgFrom: "#8b6ea8",
  bgTo: "#c9b6d8",
  ribbon: "#5c2d68",
  stripe: "#ffffff",
  card: "#ffffff",
  title: "#1a1420",
  accent: "#e8c84a",
} as const;

export const FONT_FAMILY = FONT_STACK;

/** 見出し用のフォントスタック。ラテン文字だけセリフ体になる（→ fonts.ts） */
export const DISPLAY_STACK = DISPLAY;

/** 記事タイプに応じて選ぶテンプレート。 */
export type TemplateName = "minimal" | "decorated";

export type ThumbnailInput = {
  /** 上部のバッジ。ミニマル版はピル、装飾版はリボンに入る */
  badge?: string;
  /** 主見出し。`\n` で改行位置を明示できる */
  title: string;
  /** 補足の一文 */
  subtitle?: string;
  /** ミニマル版のフッターに出すブランド表記 */
  brand?: string;
  /** ミニマル版のフッターに出す URL 等 */
  brandSuffix?: string;
  /** 装飾版に差し込むイラストの data URI（任意） */
  illustration?: string;
};

/**
 * 見出しの行数と最長行の文字数から font-size を決める。
 * 日本語は等幅に近いので「文字数 × サイズ」で概ね幅を見積もれる。
 */
export function fitTitleSize(lines: string[]): number {
  const longest = Math.max(...lines.map((line) => line.length), 1);
  const byWidth = 880 / longest;
  const byHeight = lines.length >= 3 ? 74 : 96;
  return Math.max(40, Math.min(96, byWidth, byHeight));
}

/** `\n` と全角スペースを改行として扱い、空行を落とす。 */
export function splitLines(title: string): string[] {
  return title
    .split(/\\n|\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
