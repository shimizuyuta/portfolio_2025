export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  tags: { id: string; name: string }[];
};

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Next.js App Router 入門",
    slug: "nextjs-app-router-intro",
    excerpt:
      "Next.js 13 から導入された App Router の基本的な使い方を解説します。",
    content: `# Next.js App Router 入門

Next.js 13 から導入された App Router は、React Server Components をベースにした新しいルーティングシステムです。

## ファイルベースルーティング

\`app/\` ディレクトリ以下にファイルを置くだけでルートが作成されます。

\`\`\`tsx
// app/page.tsx → /
// app/about/page.tsx → /about
// app/blog/[slug]/page.tsx → /blog/:slug
\`\`\`

## Server Components

デフォルトでコンポーネントはサーバーサイドで実行されます。

\`\`\`tsx
// データ取得をコンポーネント内で直接行える
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  const json = await data.json();
  return <div>{json.title}</div>;
}
\`\`\`

## まとめ

App Router を使うことで、より直感的なデータ取得とルーティングが可能になります。
`,
    category: "技術",
    status: "published",
    published_at: "2026-03-01T00:00:00Z",
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    tags: [
      { id: "1", name: "Next.js" },
      { id: "2", name: "React" },
    ],
  },
  {
    id: "2",
    title: "Supabase で始めるバックエンド開発",
    slug: "supabase-backend-intro",
    excerpt:
      "Supabase を使ったバックエンド開発の基本を、実際のプロジェクト事例とともに紹介します。",
    content: `# Supabase で始めるバックエンド開発

Supabase は PostgreSQL をベースにしたオープンソースの BaaS です。

## できること

- **データベース**: PostgreSQL のフル機能
- **認証**: メール / OAuth / マジックリンク
- **ストレージ**: ファイルアップロード
- **Edge Functions**: サーバーレス関数

## テーブル作成とデータ取得

\`\`\`sql
CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  published_at timestamptz
);
\`\`\`

\`\`\`ts
const { data, error } = await supabase
  .from('articles')
  .select('*')
  .order('published_at', { ascending: false });
\`\`\`

## RLS で安全なアクセス制御

Row Level Security を有効にすることで、データへのアクセスをきめ細かく制御できます。
`,
    category: "技術",
    status: "published",
    published_at: "2026-03-15T00:00:00Z",
    created_at: "2026-03-15T00:00:00Z",
    updated_at: "2026-03-15T00:00:00Z",
    tags: [
      { id: "3", name: "Supabase" },
      { id: "4", name: "PostgreSQL" },
    ],
  },
  {
    id: "3",
    title: "中小企業の DX 推進で大切なこと",
    slug: "sme-dx-key-points",
    excerpt:
      "DX 推進に取り組む中小企業が陥りがちな失敗パターンと、成功に向けたポイントを解説します。",
    content: `# 中小企業の DX 推進で大切なこと

DX（デジタルトランスフォーメーション）は、単なるツール導入ではありません。

## よくある失敗パターン

1. **ツールを導入して終わり** — 現場に定着しない
2. **トップダウンのみ** — 現場の声が反映されない
3. **目的が不明確** — 「とりあえず DX」になってしまう

## 成功のポイント

### 小さく始めて横展開する

最初から全社一括導入は避け、特定の部署や業務から始めましょう。

### 現場を巻き込む

DX は現場の人が主役です。ITに詳しくない人でも使えるツール選定が重要です。

### 定量的な目標を設定する

「月に〇時間削減」「エラー率を〇%改善」など、成果を測れる指標を持ちましょう。

## まとめ

DX 推進は長期的な取り組みです。伴走型の支援を受けながら、着実に進めることが成功への近道です。
`,
    category: "ビジネス",
    status: "published",
    published_at: "2026-04-01T00:00:00Z",
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
    tags: [
      { id: "5", name: "DX" },
      { id: "6", name: "中小企業" },
    ],
  },
];
