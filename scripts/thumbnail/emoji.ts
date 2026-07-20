import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Twemoji の SVG を取得して data URI にする。
 *
 * ライセンス: グラフィックは CC-BY 4.0（コードは MIT）。
 * 生成したサムネを公開する場合は帰属表示の義務がある。→ docs/thumbnail-credits.md
 *
 * バージョンは固定する。@latest だと同じ引数でも出力が変わりうるため。
 */
const TWEMOJI_VERSION = "15.0.0";
const CDN = `https://cdn.jsdelivr.net/npm/@twemoji/svg@${TWEMOJI_VERSION}`;
const CACHE_DIR = join(process.cwd(), "tmp", "emoji");

/**
 * 絵文字を Twemoji のファイル名（コードポイント列）に変換する。
 *
 * Twemoji は異体字セレクタ FE0F をファイル名から落とす（⚖️ → 2696）が、
 * ZWJ シーケンス（👨‍⚕️ など）では保持する。この分岐を踏まないと 404 になる。
 */
export function toCodePoints(emoji: string): string {
  const points = [...emoji].map((c) => c.codePointAt(0) ?? 0);
  const hasZwj = points.includes(0x200d);
  return points
    .filter((p) => hasZwj || p !== 0xfe0f)
    .map((p) => p.toString(16))
    .join("-");
}

/** 絵文字1文字を Twemoji SVG の data URI にして返す。初回のみ取得しキャッシュする。 */
export async function loadEmoji(emoji: string): Promise<string> {
  const code = toCodePoints(emoji);
  const cached = join(CACHE_DIR, `${code}.svg`);

  let svg: string;
  try {
    svg = await readFile(cached, "utf8");
  } catch {
    const response = await fetch(`${CDN}/${code}.svg`);
    if (!response.ok) {
      throw new Error(
        `絵文字 "${emoji}" (${code}) を Twemoji から取得できませんでした (HTTP ${response.status})。Twemoji に無い絵文字の可能性があります。`,
      );
    }
    svg = await response.text();
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(cached, svg);
  }

  // satori の <img> は data URI を読める。base64 にしておくと
  // SVG 内の "#" や引用符をエスケープせずに済む。
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
