import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { parseArgs } from "node:util";
import satori from "satori";
import sharp from "sharp";
import { loadEmoji } from "./emoji";
import { loadFonts } from "./fonts";
import { Decorated } from "./templates/decorated";
import { Minimal } from "./templates/minimal";
import { HEIGHT, type TemplateName, type ThumbnailInput, WIDTH } from "./theme";

const OUT_DIR = join(process.cwd(), "tmp", "サムネ");

const USAGE = `
使い方:
  npx tsx --tsconfig scripts/thumbnail/tsconfig.json scripts/thumbnail/generate.tsx \\
    --slug <slug> --template <minimal|decorated> --title "見出し" [options]

必須:
  --slug          出力ファイル名（tmp/サムネ/<slug>.png）
  --title         主見出し。\\n で改行位置を指定できる

任意:
  --template      minimal（既定）| decorated
  --badge         ミニマル版はピルバッジ、装飾版はリボン見出しに入る
  --subtitle      補足の一文
  --brand         ミニマル版フッターのブランド名
  --brand-suffix  ミニマル版フッターの URL 等
  --illustration  装飾版に差し込む画像のパス（png / jpg / webp）
  --emoji         装飾版に差し込む絵文字（Twemoji SVG。例: 🪙）
                  --illustration が指定されていればそちらが優先される
`.trim();

/** 画像を data URI に変換する。satori は外部ファイルパスを読めないため。 */
async function toDataUri(path: string): Promise<string> {
  const mime =
    {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
    }[extname(path).toLowerCase()] ?? "image/png";
  const data = await readFile(path);
  return `data:${mime};base64,${data.toString("base64")}`;
}

async function main() {
  const { values } = parseArgs({
    options: {
      slug: { type: "string" },
      template: { type: "string", default: "minimal" },
      title: { type: "string" },
      badge: { type: "string" },
      subtitle: { type: "string" },
      brand: { type: "string" },
      "brand-suffix": { type: "string" },
      illustration: { type: "string" },
      emoji: { type: "string" },
      help: { type: "boolean", default: false },
    },
  });

  if (values.help) {
    console.log(USAGE);
    return;
  }

  if (!values.slug || !values.title) {
    console.error("エラー: --slug と --title は必須です。\n");
    console.error(USAGE);
    process.exitCode = 1;
    return;
  }

  const template = values.template as TemplateName;
  if (template !== "minimal" && template !== "decorated") {
    console.error(
      `エラー: 不明なテンプレート "${values.template}"。minimal か decorated を指定してください。`,
    );
    process.exitCode = 1;
    return;
  }

  const input: ThumbnailInput = {
    title: values.title,
    badge: values.badge,
    subtitle: values.subtitle,
    brand: values.brand,
    brandSuffix: values["brand-suffix"],
    // --illustration（自前の画像）を優先し、無ければ --emoji を使う
    illustration: values.illustration
      ? await toDataUri(values.illustration)
      : values.emoji
        ? await loadEmoji(values.emoji)
        : undefined,
  };

  const element = template === "decorated" ? Decorated(input) : Minimal(input);

  const svg = await satori(element, {
    width: WIDTH,
    height: HEIGHT,
    fonts: await loadFonts(),
  });

  // satori は文字をグリフパスに変換して出力するため、sharp 側にフォントが無くても崩れない
  const outPath = join(OUT_DIR, `${values.slug}.png`);
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(outPath, await sharp(Buffer.from(svg)).png().toBuffer());

  console.log(outPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
