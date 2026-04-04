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

- `src/app/` — App Router ページ（`/`, `/service`, `/knowledge`, `/contact`）
- `src/app/layout.tsx` — ルートレイアウト（`"use client"`）。モバイルメニューの state を所有
- `src/components/ui/` — shadcn/ui コンポーネント（New York スタイル、Radix UI ベース）
- `src/lib/utils.ts` — Tailwind クラスをマージする `cn()` ヘルパー

## ルール

@.claude/rules/git.md
@.claude/rules/github.md
@.claude/rules/workflow.md
@.claude/rules/docs.md
@.claude/rules/env.md

## Key Conventions

- **Linter/Formatter:** Biome（ESLint/Prettier ではない）。`npm run lint` で確認、`npm run format` でフォーマット修正。
- **スタイリング:** Tailwind CSS 4 + OKLch CSS 変数。ダークモードは `.dark` クラス。クラスの条件結合は `cn()` を使う。
- **UI コンポーネント:** インストール済み → Accordion, Badge, Button, Card, Separator, Sheet。追加は `npx shadcn@latest add <component>`（`src/components/ui/` を事前確認）。
- **パスエイリアス:** `@/*` は `src/*` に解決される。
- **コンテンツ言語:** 日本語・英語の混在。既存のバランスを維持すること。
