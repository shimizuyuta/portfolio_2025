# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build with Turbopack
npm run lint     # Run Biome linter (no auto-fix)
npm run format   # Format with Biome (writes changes)
```

No test framework is configured.

## 開発フロー

タスクは必ず以下のフローで進める：

1. `main` から作業ブランチを作成
2. 実装・コミット
3. PR を作成してユーザーに提出（**マージは行わない**）

### ブランチ命名規則

| 種別 | プレフィックス | 例 |
|------|-------------|-----|
| 新機能 | `feat/` | `feat/contact-form` |
| バグ修正 | `fix/` | `fix/mobile-menu` |
| 保守・依存更新 | `chore/` | `chore/update-deps` |
| スタイル・UI調整 | `style/` | `style/hero-layout` |

### PR ルール

- タイトルは日本語（例: `feat: お問い合わせフォームを追加`）
- 本文は `.github/pull_request_template.md` の構成に従う
- マージは行わない（ユーザーがレビュー後にマージする）
- PR 作成前に `npm run build` と `npm run lint` が通ることを確認

## Architecture

**Next.js 15 App Router、シングルページのポートフォリオサイト。**

- `src/app/page.tsx` — 全コンテンツがここに直書き。セクションはアンカー ID で管理（`#about`, `#services`, `#portfolio`, `#faq`, `#contact`）
- `src/app/layout.tsx` — ルートレイアウト（`"use client"`）。モバイルメニューの state を所有。Server Component に変更する場合はメニューを別コンポーネントに切り出す必要がある
- `src/components/ui/` — shadcn/ui コンポーネント（New York スタイル、Radix UI ベース）
- `src/lib/utils.ts` — Tailwind クラスをマージする `cn()` ヘルパー
- `src/lib/data.ts` — 型定義のみ。現在 page.tsx では使われていない（コンテンツ追加は page.tsx を直接編集する）

## 画像アセット

- `public/images/` — hero.png, profile.png, work1〜3.jpg
- `public/logo/` — logo.png, logo2.png, logo.svg
- Next.js の `<Image>` コンポーネントを使用。`width`/`height` は必須。

## Git ルール

@.claude/git.md

## Key Conventions

- **Linter/Formatter:** Biome（ESLint/Prettier ではない）。`npm run lint` で確認、`npm run format` でフォーマット修正。
- **スタイリング:** Tailwind CSS 4 + OKLch CSS 変数。ダークモードは `.dark` クラス。クラスの条件結合は `cn()` を使う。
- **UI コンポーネント:** インストール済み → Accordion, Badge, Button, Card, Separator, Sheet。追加は `npx shadcn@latest add <component>`（`src/components/ui/` を事前確認）。
- **パスエイリアス:** `@/*` は `src/*` に解決される。
- **コンテンツ言語:** 日本語・英語の混在。既存のバランスを維持すること。
