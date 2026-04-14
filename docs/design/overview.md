# サイト全体設計

## プロジェクト概要

ポートフォリオサイトのリニューアル。参考サイト: https://gyas.co.jp/

## ターゲット

- 中小企業の経営者
- 個人事業主

## サイトの目的

- フリーランス・受託の案件獲得
- 個人ブランディング

## テーマ

信頼性のあるサイト

## カラーパレット

| 役割 | 値 |
|---|---|
| Primary（深紺） | `oklch(0.25 0.08 250)` |
| Accent（ブルー） | `oklch(0.55 0.18 220)` |
| Background（白） | `oklch(1 0 0)` |
| Foreground（ダークネイビー） | `oklch(0.15 0.05 250)` |

実装上は Tailwind の `sky-600` / `indigo-500` 系を多用。グラデーションは `from-sky-600 to-indigo-500`。

## フォント

- 本文・見出し: Noto Sans JP
- ロゴ: Zen Kaku Gothic New（Bold、グラデーションテキスト）
- コード: Geist Mono

## ページ構成

| ページ | パス | 状態 |
|---|---|---|
| Home | `/` | ✅ 実装済み |
| Service | `/service` | ✅ 実装済み |
| Knowledge（ブログ一覧） | `/knowledge` | ✅ 実装済み |
| Knowledge（記事詳細） | `/knowledge/[slug]` | ✅ 実装済み |
| Contact | `/contact` | ✅ 実装済み |
| Admin（記事管理） | `/admin` | ✅ ローカル専用（`NEXT_PUBLIC_ADMIN_ENABLED` フラグで表示） |

## ナビゲーション（ヘッダー）

### PC（md 以上）
- `grid grid-cols-3` の3カラム構成
- 左: ロゴ（`/` へリンク、グラデーションテキスト）
- 中央: サービス・実績・ブログ のリンク
- 右: 「お問い合わせ」ボタン（`bg-gray-900 text-white`）+ 記事編集（`NEXT_PUBLIC_ADMIN_ENABLED` 時のみ）

### SP（md 未満）
- ハンバーガーアイコンで全画面ドロワーを開閉
- ドロワー内: ホーム・サービス・実績・ブログ のリンク + 下部に「お問い合わせ」ボタン
- 閉じるボタン（X）あり

## 技術スタック

| 分類 | 技術 |
|---|---|
| フレームワーク | Next.js 15（App Router） |
| スタイリング | Tailwind CSS 4 + OKLch CSS 変数 |
| UI コンポーネント | shadcn/ui（New York スタイル） |
| アニメーション | Framer Motion |
| データベース | Supabase（PostgreSQL） |
| メール送信 | Resend |
| デプロイ | Vercel |
| Linter/Formatter | Biome |
