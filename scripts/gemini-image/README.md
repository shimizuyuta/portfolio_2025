# gemini-image

記事の図・アイキャッチを Gemini 画像API（Nano Banana 系）で生成するスクリプト。

日本語ラベル入りのインフォグラフィックは、拡散系だと文字が崩れがちだが、
**Gemini 3 世代（既定 `gemini-3-pro-image`）はほぼ崩れずに作れる**。
2.5 世代は日本語が崩壊するので使わない。

## 準備

1. [Google AI Studio](https://aistudio.google.com/apikey) で API キーを発行
2. `.env.local` に `GEMINI_API_KEY=...` を追加（`.env.example` 参照）

## 使い方

```bash
set -a; source .env.local; set +a
python3 scripts/gemini-image/gen.py <プロンプト.txt>
```

- プロンプトは記事ごとに `tmp/記事画像/<slug>/` 等に置く（`tmp/` は .gitignore 済み）
- 出力は `tmp/gemini-image/out/<時刻>_<モデル>.png`（毎回別名＋使用プロンプトを同名 .txt で保存）
- 参照画像でスタイル寄せ/編集: `--ref path/to/ref.png`
- モデル一覧: `--list` ／ モデル指定: `--model gemini-3.1-flash-lite-image`

## モデルの目安（実測）

| モデル | 日本語 | 用途 |
|---|---|---|
| `gemini-3-pro-image`（既定） | ◎ 完璧 | 図・インフォグラフィックの本番 |
| `gemini-3.1-flash-lite-image` | ○ ほぼ正確・安価 | コスト重視の下書き |
| `gemini-2.5-flash-image` | ✗ 崩れる | 日本語の図には使わない |

## 料金の目安

`gemini-3-pro-image`（1K〜2K）で **約 $0.13/枚**、100枚で約 $13（Batch APIで半額）。

## プロンプトのコツ

- 配色は**サイトのブランド**に合わせる（青/ネイビー `#0050b5` / `#026fd7`、オレンジは使わない）。
  ブランド色の正は `scripts/thumbnail/theme.ts` と `src/app/globals.css`。
- 描かせる日本語ラベルは**本文と表記を一致**させ、正確に列挙する。
- 図中に実在の個人情報を入れない（架空・抽象データで）。ブランドロゴ・URLは焼き込まない。

## 注意

- 生成物は素材。記事本文の `【画像:】` への差し込み・アップロードは人間が `/admin` から行う
  （`blog.md` 準拠。スクリプトは PNG 出力まで）。
