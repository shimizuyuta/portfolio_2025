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

ディレクトリ構成は `src/app/`・`src/lib/` を直接見れば分かる。以下は見ただけでは分からない点のみ：

- **レンダリング:** `knowledge/page.tsx` は Server Component（Supabase から取得）、`knowledge/[slug]/page.tsx` は `force-dynamic` SSR。それ以外の主要ページ（`layout.tsx`・ホーム・contact）は `"use client"`。
- **ローカル専用ページ:** `admin/`（記事管理）と `design/`（コンポーネントショーケース）は `NEXT_PUBLIC_ADMIN_ENABLED` で制御。本番には出さない。
- **Supabase クライアント:** 通常の読み取りは `src/lib/supabase/server.ts`、RLS をバイパスする管理操作のみ `service.ts`。
- **型:** `src/types/supabase.ts` は自動生成（`supabase gen types typescript --linked`）。手で編集しない。
- **設計ドキュメント:** `docs/design/` に各ページの設計がある。設計に関わる実装は先にこちらを更新する。

## 作業原則

- **会話の記憶より実際の状態を優先する。** 「さっきこうだった」で動かず、必ずツールで現在の状態を確認してから行動する。
- **1アクションごとに報告する。** 複数の操作をまとめて実行せず、「〜しました。次に〜してよいですか？」の形で確認を取る。
- **着手前に確定していること:** 何を作るか（機能・構造）、どう見せるか（デザイン・内容・文言）、ユーザーの承認。構造が決まっても内容が未確定なら壁打ちを先に行う。
- **並行開発は git worktree を使う。** `git checkout -b` は使わない（→ `worktree.md`）。
- **コミットメッセージ:** `<type>: <説明（日本語）>`。type は `feat` / `fix` / `style` / `chore` / `refactor` / `docs`。

## ルール

タスクが該当したら、**着手前に必ず該当ファイルを読む**：

| ファイル | いつ読むか |
|---|---|
| `.claude/rules/github.md`   | PR 作成・CI 確認・Issue 操作の前 |
| `.claude/rules/worktree.md` | 新規ブランチ／作業ディレクトリの着手前 |
| `.claude/rules/git.md`      | 履歴を書き換える操作（rebase・amend・force push・revert）の前 |
| `.claude/rules/blog.md`     | 記事の執筆・リライト・企画・改善など、ブログ運用に関わる作業の前 |
| `.claude/rules/supabase.md` | DB・テーブル・マイグレーション・記事データ操作の前 |
| `.claude/rules/vercel.md`   | Vercel デプロイ／CI ステータス確認の前 |
| `.claude/rules/env.md`      | 環境変数を追加・変更する前 |
| `.claude/rules/docs.md`     | 設計に関わる実装の前（`docs/design/` 更新を伴う作業） |
| `.claude/rules/article-images.md` | 記事の図・画像を生成／配置する作業の前 |

破壊的な git コマンド（`push --force` / `reset --hard` / `clean -fd`）は `.claude/settings.json` の `permissions.deny` でブロック済み。

## 技術説明ルール

実装・修正・バグ解決を行った際は、必ず以下を説明する：

- **何をしたか** — 技術的な変更内容（どのファイル・関数・仕組みを変えたか）
- **なぜそうしたか** — 技術的な根拠・選択の理由（他の選択肢との比較、既知の制約、ライブラリの挙動など）

ユーザーが「なぜ？」と聞く前に自発的に説明すること。

## Key Conventions

- **Linter/Formatter:** Biome（ESLint/Prettier ではない）。`npm run lint` で確認、`npm run format` でフォーマット修正。
- **スタイリング:** Tailwind CSS 4 + OKLch CSS 変数。ダークモードは `.dark` クラス。クラスの条件結合は `cn()`（`src/lib/utils.ts`）を使う。
- **UI コンポーネント:** shadcn/ui（New York スタイル、Radix UI ベース）。追加前に `src/components/ui/` を確認し、なければ `npx shadcn@latest add <component>`。
- **パスエイリアス:** `@/*` は `src/*` に解決される。
- **コンテンツ言語:** 日本語・英語の混在。既存のバランスを維持すること。
