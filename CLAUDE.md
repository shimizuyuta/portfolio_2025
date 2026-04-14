# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run lint     # Run Biome linter (no auto-fix)
npm run format   # Format with Biome (writes changes)
```

No test framework is configured.

## Architecture

### ページ構成（`src/app/`）

| パス | 説明 |
|---|---|
| `layout.tsx` | ルートレイアウト（`"use client"`）。PC: grid 3カラムヘッダー、SP: 全画面ドロワー |
| `page.tsx` | ホームページ（`"use client"`、Framer Motion アニメーション） |
| `service/page.tsx` | サービス一覧 + FAQ |
| `contact/page.tsx` | お問い合わせフォーム（`"use client"`、Resend メール送信） |
| `knowledge/page.tsx` | ブログ一覧（Server Component、Supabase からデータ取得） |
| `knowledge/KnowledgeClient.tsx` | カテゴリー・タグフィルター＋グリッド（`"use client"`） |
| `knowledge/[slug]/page.tsx` | 記事詳細（`force-dynamic` SSR、目次・ReactMarkdown） |
| `admin/page.tsx` | 記事管理（ローカル専用、`NEXT_PUBLIC_ADMIN_ENABLED` フラグで制御） |
| `api/contact/route.ts` | メール送信 API（Resend） |
| `api/knowledge/route.ts` | 公開記事一覧 API |
| `api/articles/route.ts` | 記事 CRUD API |
| `api/admin/articles/route.ts` | 管理用記事 API |
| `design/page.tsx` | ローカル専用コンポーネントショーケース |

### ライブラリ（`src/lib/`）

| パス | 説明 |
|---|---|
| `knowledge/index.ts` | Supabase から記事を取得する関数 |
| `knowledge/mock.ts` | ローカル開発用モックデータ |
| `supabase/server.ts` | Server Components 用 Supabase クライアント |
| `supabase/service.ts` | Service Role クライアント（管理操作用） |
| `utils.ts` | Tailwind クラスをマージする `cn()` ヘルパー |
| `slack.ts` | Slack API クライアント |

### その他

- `src/components/ui/` — shadcn/ui コンポーネント（New York スタイル、Radix UI ベース）
- `src/types/supabase.ts` — Supabase 自動生成型（`supabase gen types typescript --linked` で再生成）
- `docs/design/` — 各ページの設計ドキュメント（実装前に更新必須）

## ルール

@.claude/rules/git.md
@.claude/rules/github.md
@.claude/rules/workflow.md
@.claude/rules/docs.md
@.claude/rules/env.md
@.claude/rules/supabase.md
@.claude/rules/vercel.md
@.claude/rules/worktree.md

## Key Conventions

- **Linter/Formatter:** Biome（ESLint/Prettier ではない）。`npm run lint` で確認、`npm run format` でフォーマット修正。
- **スタイリング:** Tailwind CSS 4 + OKLch CSS 変数。ダークモードは `.dark` クラス。クラスの条件結合は `cn()` を使う。
- **UI コンポーネント:** インストール済み → Accordion, Badge, Button, Card, Separator, Sheet。追加は `npx shadcn@latest add <component>`（`src/components/ui/` を事前確認）。
- **パスエイリアス:** `@/*` は `src/*` に解決される。
- **コンテンツ言語:** 日本語・英語の混在。既存のバランスを維持すること。
