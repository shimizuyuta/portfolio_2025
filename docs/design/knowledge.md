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
- スタイル: Tailwind `prose` クラス適用

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
