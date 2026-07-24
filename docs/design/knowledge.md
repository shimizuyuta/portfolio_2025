# Knowledge ページ（/knowledge, /knowledge/[slug]）設計

## 概要

Supabase の `articles` テーブルをデータソースとするブログ機能。
一覧ページとスラッグベースの詳細ページで構成される。

---

## 一覧ページ（/knowledge）

### レイアウト
- 上部にパンくずリスト（Top / Blog）
- ページタイトル「ブログ」
- フィルター（カテゴリー・タグ）
- 記事グリッド

### フィルター
- **カテゴリー**: Supabase から動的取得。選択中は `bg-sky-500`
- **タグ**: `#タグ名` 形式、複数選択可（AND 絞り込み）

### 記事カード
- グリッド: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- サムネイル: `h-36`、なければカテゴリ名の頭文字グラデーション背景
- 表示項目: カテゴリ・タイトル（2行）・タグ・公開日

### カテゴリーカラー（サムネイルなし時）

| カテゴリー | グラデーション |
|-----------|--------------|
| デザイン | `from-pink-400 to-rose-500` |
| フロントエンド | `from-sky-400 to-blue-500` |
| AI | `from-cyan-400 to-sky-500` |
| 開発 | `from-slate-400 to-gray-600` |
| その他 | `from-sky-400 to-indigo-500` |

---

## 詳細ページ（/knowledge/[slug]）

### レンダリング
- `export const dynamic = "force-dynamic"` で SSR 固定
- Supabase から `slug` でデータ取得、記事なしは `notFound()`

### レイアウト構成

```
パンくずリスト（Top / Blog / 記事タイトル）
↓
ヒーロー画像（aspect-video、なければカテゴリグラデーション）
↓
メタ情報（カテゴリバッジ・タグバッジ・公開日）
↓
記事タイトル（h1）
↓
目次
↓
本文（ReactMarkdown）
↓
「ブログ一覧へ戻る」リンク
```

### 目次
- Markdown の `##`（h2）と `###`（h3）を抽出
- h3 は `pl-4` でインデント
- リスト要素（ul/li）なし、`<a>` を直接並べるフラット構造
- 番号・装飾なし

### 本文レンダリング
- `react-markdown` + 以下プラグイン
  - `remark-gfm`: テーブル・打ち消し線など GFM 記法
  - `remark-footnotes`: 脚注
  - `rehype-slug`: 見出しに id 付与（目次アンカーに対応）
  - `rehype-highlight`: コードハイライト
  - `rehype-raw`: HTML タグを直接記述可能
- スタイル: Tailwind Typography（`prose`）を基盤に、下記のタイポグラフィ／見出し装飾を適用

### 本文タイポグラフィ

「スマホ閲覧が主」のため SP を基準に組む。可読性の目標値は、読みやすいと評価される他メディア（本文16px・行間1.8・段落間~28px・高コントラスト）に合わせる。

| 項目 | 値 | 実装 |
|---|---|---|
| 本文サイズ | SP 16px / PC 18px | `prose` + `md:prose-lg` |
| 行間 | 1.8 | `prose-p:leading-[1.8]` |
| 段落間の余白 | ~24〜28px（段落を明確に分離） | `prose-p:my-6`（実測で微調整） |
| 本文色 | gray-800 相当（高コントラスト） | `[--tw-prose-body:#1f2937]` |
| 折り返し | 長い英単語・URL で横スクロールさせない | `break-words` |
| 見出しアンカー | sticky ヘッダー裏に隠さない | `prose-headings:scroll-mt-24` |
| 表・コード | ページでなく要素内で横スクロール | `prose-table:block overflow-x-auto` / `prose-pre:overflow-x-auto` |

### 見出し・要素の装飾（「文字の壁」対策）

読みやすいと評価される他メディアは、見出し・囲み・色分けでセクションを視覚的に分割している。同様に、記事本文を「のっぺりした文字の壁」にしないための装飾を入れる。

すべて `ArticleBody.tsx` の `PROSE_CLASSES`（`prose-*` / 任意バリアントのユーティリティ）で定義（公開ページと `/admin` プレビューの双方に自動適用）。
※`.prose h2` の生CSSは Tailwind v4 では出力されないため、ユーティリティ方式を使う。

| 要素 | 装飾 | 実装（要点） |
|---|---|---|
| **h2** | ネイビー塗り帯・白文字・角丸（セクションの開始を明確化） | `prose-h2:bg-sidebar prose-h2:text-white prose-h2:rounded-lg prose-h2:px-5 prose-h2:py-3` |
| **h3** | 左 sky バー ＋ 下罫線 | `prose-h3:border-l-4 prose-h3:border-l-sky-500 prose-h3:border-b prose-h3:border-b-gray-200 prose-h3:pl-3 prose-h3:pb-1` |
| **引用（blockquote）** | 左 sky アクセント ＋ 薄青背景のカラーボックス（引用符なし） | `prose-blockquote:bg-sky-50 prose-blockquote:rounded-r-lg prose-blockquote:not-italic` ＋ `[--tw-prose-quote-borders:#38bdf8]` |
| **太字（strong）** | sky のマーカー風ハイライト | `[&_strong]:bg-[linear-gradient(...)] [&_strong]:box-decoration-clone` |
| **リスト（li）** | マーカーを sky 色に | `prose-li:marker:text-sky-500` |

- h2 のネイビーはサイトのブランド navy（`--sidebar` トークン）を使う。
- 引用の左ボーダー色は specificity 争いを避けるため、prose が参照する変数 `--tw-prose-quote-borders` を上書きして指定する。

**内容側（別作業）**: 上記は描画の土台。実際の「図が多い・要点が囲まれている」体験には、執筆側で実画像・`>` 囲み・`**強調**`・比較表を入れる必要がある（現状の記事は画像が `【画像:…】` プレースホルダのまま）。`blog.md` / writer 側で対応する。

---

## データ構造（Supabase）

### articles テーブル

| カラム | 型 | 説明 |
|---|---|---|
| id | uuid | PK |
| title | text | 記事タイトル |
| slug | text | URL スラッグ（ユニーク） |
| content | text | Markdown 本文 |
| category | text | カテゴリー |
| status | text | `published` / `draft` |
| published_at | timestamptz | 公開日時 |
| thumbnail_url | text | サムネイル URL（nullable） |

### tags / article_tags テーブル
- 多対多リレーション
- `article_tags` で `article_id` と `tag_id` を紐付け

### RLS ポリシー
- `status = 'published'` かつ `published_at <= now()` のみ anon 読み取り可
- 書き込みは禁止（管理は Supabase Dashboard または /admin から）

---

## 記事管理（/admin）

- `NEXT_PUBLIC_ADMIN_ENABLED=true` の環境でのみヘッダーにリンク表示
- 記事の作成・編集・削除
- タグ・カテゴリ・サムネイル・公開日・ステータスの設定
- Supabase Storage へのサムネイル画像アップロード
