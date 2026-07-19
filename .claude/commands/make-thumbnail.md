# /make-thumbnail

記事のサムネイル画像を生成する。記事データから文言を起案し、人間の承認を得てから PNG を出力する。

## 使い方

```
/make-thumbnail <slug>
```

例:
```
/make-thumbnail care-record-ai-voice-input
```

## 着手前に必ず読む

`.claude/rules/blog.md` — 記事データの取得経路とガードレール。

## スコープ

**このコマンドはローカルに PNG を出力するまでで終わる。**

- Supabase Storage へのアップロードは行わない
- `thumbnail_url` の更新は行わない
- 記事本文は変更しない

アップロードと DB 反映は人間が `/admin` から行う。

## 実行手順

### Step 1. 記事の取得

```bash
curl -s "$BLOG_API_BASE_URL/api/articles?slug=<slug>" \
  -H "Authorization: Bearer $BLOG_API_KEY"
```

`.claude/rules/blog.md` の Supabase 操作規約どおり API 経由で取得する。service role での直接読み取りはしない。

**HTTP ステータスを必ず確認する。** 401 をレスポンス本文だけ見て「記事が無い」と誤読しない（→ `.claude/rules/vercel.md`）。

### Step 2. 文言の起案

取得した `title` / `excerpt` / `category` / `article_tags` から、サムネ用の文言を組み立てる。**記事タイトルをそのまま流し込まない。**

| 項目 | 方針 |
|---|---|
| 見出し | 20字前後。2行に割り、改行位置を `\n` で明示する。記事タイトルは32字以内の規約だがサムネには長いので、主語と要点だけ残して削る |
| サブ | `excerpt` を25字前後に圧縮した一文 |
| バッジ | タグから「業界タグ × テーマタグ」を1〜2個。長くなるなら業界タグのみ |

一覧では縮小表示されるため、**見出しは縮小しても読める長さに寄せる**。

### Step 3. テンプレートの選択

| テンプレ | 向き |
|---|---|
| `minimal` | ハウツー・比較・検証。内容で読ませる記事。既定 |
| `decorated` | 年度版・制度解説・トレンド。一覧で目を引かせたい記事 |

### Step 4. 承認（省略禁止）

**文言案とテンプレ選択を提示して停止する。** 人間の承認を得るまで生成しない。

提示フォーマット:
```
テンプレ: minimal
バッジ  : 介護 ・ 業務効率化
見出し  : 訪問介護の記録を
          音声入力AIで半減
サブ    : 無料プランの範囲で今日から試せる
```

### Step 5. 生成

```bash
npx tsx --tsconfig scripts/thumbnail/tsconfig.json scripts/thumbnail/generate.tsx \
  --slug <slug> \
  --template <minimal|decorated> \
  --badge "<バッジ>" \
  --title '<見出し（\n で改行）>' \
  --subtitle "<サブ>" \
  --brand "TodoONada" \
  --brand-suffix "note.com/daikidomon"
```

- `--title` は `\n` をシェルに食わせないため**シングルクォート**で囲む
- `--brand` / `--brand-suffix` は `minimal` のみ有効
- `decorated` にイラストを入れる場合は `--emoji 🪙`（Twemoji）か `--illustration <パス>`（自前画像）を足す

#### `--emoji` を使う前に確認する（省略禁止）

**Twemoji の画像は CC-BY 4.0 で、帰属表示の義務がある。** npm の `license` 欄が MIT なのはコードの話で、画像には適用されない。

`docs/thumbnail-credits.md` に記載した帰属表示がサイトに設置済みかを確認する。**未設置なら `--emoji` を使わず、人間に判断を仰いで停止する。**

出力先は `tmp/thumbnails/<slug>.png`（1200×630）。

### Step 6. 目視確認

**Read ツールで出力 PNG を開いて確認する。** 生成成功＝見た目が正しい、ではない。

確認する点:
- 文字が枠からはみ出していないか
- 豆腐（▯）が出ていないか
- 見出しが縮小されすぎていないか

崩れていれば文言を詰めて Step 5 からやり直す。

### Step 7. 報告

出力パスを伝え、**アップロードと `thumbnail_url` の更新は人間の作業として残っている**ことを明記する。

## 仕組み

| ファイル | 役割 |
|---|---|
| `scripts/thumbnail/generate.tsx` | CLI エントリ。satori で SVG 化し sharp で PNG 化する |
| `scripts/thumbnail/templates/minimal.tsx` | テンプレA |
| `scripts/thumbnail/templates/decorated.tsx` | テンプレB |
| `scripts/thumbnail/theme.ts` | 配色・サイズ・見出しの自動縮小 |
| `scripts/thumbnail/fonts.ts` | フォントの取得と `tmp/fonts/` へのキャッシュ |
| `scripts/thumbnail/emoji.ts` | Twemoji SVG の取得と `tmp/emoji/` へのキャッシュ |
| `docs/thumbnail-credits.md` | 素材のライセンスと帰属表示の義務 |

### 変更するときの注意（satori の制約）

テンプレートを編集する場合、以下は実測で確認済みの制約:

- **`clipPath` を CSS で使わない。** satori が自分自身を参照する `clip-path` を吐き、ラスタライズが破綻する。多角形は inline SVG の `<polygon>` で描く
- **`<svg>` に `<title>` を置かない。** 画像内に文字として焼き込まれる
- **oklch は解釈されない。** `globals.css` の CSS 変数は使えず、`theme.ts` に hex を複製している。ブランドカラーを変えたら追随させる
- **`position: absolute` の要素は文字幅で自動的に広がらない。** 幅は明示する
- **フォントのサブセットに無い記号は豆腐になる**（例: ◆ U+25C6）。図形は div や SVG で描く
- **関数コンポーネントは解決されない。** satori は host 要素しか辿らないため `<Sparkle />` と書くと黙って捨てられる。`{Sparkle({...})}` と関数呼び出しにする
- **`<pattern>` は解釈されない。** 繰り返し模様は図形を1つずつ描く
