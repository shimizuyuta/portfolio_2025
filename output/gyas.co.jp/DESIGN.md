# Design System

## Overview
Design tokens extracted from gyas.co.jp.

## Colors

| Role | Hex | OKLCH | 用途 |
|------|-----|-------|------|
| Primary | `#693289` | `oklch(49.21% 0.266 297.94)` ※WP変数 | hover/focus のアクセント |
| Secondary | `#adadad` | `oklch(74.76% 0 89.88)` | サポート UI・二次的要素 |
| Surface | `#ffffff` | `oklch(100% 0 89.88)` | ページ背景 |
| On-surface | `#111111` | — | メインテキスト（出現数 670 回・最多） |
| Border | `#dbdfe3` | — | カード・リンク枠線 |
| Link-hover | `#ed2446` | — | リンクホバー色（白・黒どちらの背景でも同色） |
| Accent-blue | `#0359be` | — | 下線アクセント（p 要素の border-bottom） |

> `#693289` は WP 管理変数由来のため、実際の UI での出現頻度は低い（5回）。link-hover の `#ed2446` が視覚的アクセントとして機能している。

## Typography

### フォントソース
- Google Fonts: **Barlow**, **Noto Sans JP**, **PT Sans**
- Variable fonts: 使用あり

### スタイル詳細

| Context | Family | Size | Weight | Line-height | Letter-spacing | 備考 |
|---------|--------|------|--------|-------------|----------------|------|
| Display / Hero | PT Sans | 180px | 500 | 1.00 | 1.12px | セクション英語ラベル用（"WORKS" 等） |
| Heading / H1 | Noto Sans JP | 65px | 700 | 1.50 | 1.12px | — |
| Heading / H1 | Noto Sans JP | 48px | 700 | 1.50 | 1.12px | — |
| Heading / H1 | Roboto | 48px | 500 | 1.50 | 1.12px | — |
| Heading / H1 | Noto Sans JP | 42px | 700 | **1.00** | 2.94px | 最も使用回数が多い見出しパターン（6回） |
| Heading / H2 | PT Sans | 28px | 700 | 1.50 | 1.96px | 英語サブ見出し |
| Heading / H3 | Noto Sans JP | 26px | 700 | 1.50 | 1.82px | — |
| Heading / H3 | Noto Sans JP | 26px | 500 | 1.50 | 1.12px | — |
| Heading / H4 | Noto Sans JP | 22px | 700 | 1.50 | 1.12px | — |
| Body / Large | Noto Sans JP | 20px | 500/700 | 1.50 | 1.12px | — |
| Body | Noto Sans JP | 16px | 500 | 1.50 | 1.12px | 最頻出 body スタイル（13回） |
| Body / Small | Noto Sans JP | 15px | 500 | 1.80 | 1.12px | — |
| Label / Small | Barlow | 15px | 500 | 1.50 | 1.12px | 英語ラベル |
| Link | Noto Sans JP | 17px | 700 | 1.22 | — | ナビ・CTA リンク |
| Link | Noto Sans JP | 15px | 700 | 1.50 | 1.05px | — |
| Caption | Noto Sans JP | 14px | 500 | 1.00 | 1.12px | — |
| Caption | PT Sans | 12px | 500 | 1.50 | 0.96px | — |

**共通設定:** `font-feature-settings: "palt"`（プロポーショナルかな）がほぼ全スタイルに適用。

## Spacing

- **スケール基準:** 8px グリッド
- **セクション padding:** 100px（上下）が標準。大セクションは 120px・140px
- **コンポーネント内余白:** 25px・30px が最頻出（72回・69回）

| 用途 | 値 | 備考 |
|------|----|------|
| コンテンツ間隔 | 20px・25px・30px | 最頻出グループ |
| コンポーネント内 padding | 15px・20px | input・card 内余白 |
| セクション縦 padding | 80px–140px | 100px が標準 |
| 細かい間隔 | 4px・5px・10px | アイコン・バッジ周辺 |

## Border Radius

| 値 | 対象要素 | 用途 |
|----|----------|------|
| `10px` | image, a | カード・リンクの角丸（最多・27回） |
| `3px` | p | テキスト周辺の微小角丸 |
| `30px` | img, p | 大きめ角丸（画像・吹き出し系） |
| `10px 10px 0 0` | card | カード上半分のみ角丸 |
| `0 0 10px 10px` | card | カード下半分のみ角丸 |
| `8px` | ul, a | リスト・リンクブロック |
| `13px` | input, textarea | フォーム入力フィールド |
| `50px` | input | 丸型インプット（pill 型） |
| `50%` | button | スライダーナビボタン（円形） |
| `50px 0 0 0` | img | 画像の一角だけ大きく丸める（アクセント） |

## Borders

| Width | Style | Color | 対象 | 頻度 |
|-------|-------|-------|------|------|
| `1px solid` | — | `#dbdfe3` | a（リンク枠） | 高（20回） |
| `0 0 1px solid` | — | `#111111` | a, div（下線アンカー） | 高（14回） |
| `0 0 1px` | solid dotted | `#111111` | li（リスト仕切り線） | 中（10回） |
| `0 0 1px solid` | — | `#0359be` | p（青下線アクセント） | 中（6回） |
| `1px solid` | — | `#c1c1c1` | textarea | 中（5回） |
| `1px solid` | — | `#cccccc` | input, textarea | 中（4回） |
| `1px solid` | — | `#939ba2` | button（outlined） | 低（2回） |
| `2px solid` | — | `#00a0d2` | div（強調アクセント） | 低（1回） |

## Shadows

| Shadow | 用途 |
|--------|------|
| `rgba(20,20,20,0.16) 2px 2px 8px 0px` | カード・モーダルの標準エレベーション |
| `rgb(128,128,128) 0px 0px 5px 0px` | フォーカスリング・入力フィールド |
| `rgba(0,0,0,0.05) 0px 4px 7px 0px` | 軽いホバー時の浮き上がり |

## Components

### Buttons
- **スライダーナビ（Prev/Next）:** 背景 `#ffffff`、`border-radius: 50%`、デフォルト `opacity: 0.3`（非活性感）、hover で `opacity` さらに下げる
- **Outlined ボタン:** `1px solid #939ba2`、`border-radius: 50%`、背景白
- **CTAボタン:** JSON 上の直接データなし（画像ベースの可能性）

### Inputs
- **Text input:**
  - 背景: `rgb(251, 250, 247)`（温かみのあるオフホワイト）
  - ボーダー: `1px solid #cccccc`
  - border-radius: `13px`
  - padding: `15px 20px`
  - focus: `outline: unset`（ブラウザデフォルトを除去）

### Links
- **通常テキストリンク:** `color: #111111`、`text-decoration: none`
- **ホバー:** `color: #ed2446`（白背景・黒背景どちらでも同じ赤色）
- **白文字リンク（暗背景）:** `color: #ffffff` → hover `color: #ed2446`
- font-weight: 500（通常）/ 700（強調・ナビ）

### Cards
- 角丸は上下で分割: 上部画像エリア `border-radius: 10px 10px 0 0`、下部テキストエリア `0 0 10px 10px`
- shadow: `rgba(20,20,20,0.16) 2px 2px 8px 0px`

## Breakpoints

主要ブレークポイント（メディアクエリ検出値）:

| Breakpoint | 用途 |
|------------|------|
| `600px` | SP 小 |
| `660px` | SP 中 |
| `768px` | SP/PC 切り替え（標準） |
| `900px` | タブレット |
| `1000px` | タブレット大 |
| `1280px` | PC 標準 |
| `1440px` | PC ワイド |
| `1600px`–`1860px` | 大型モニター対応 |

## Do's and Don'ts
- Do use rounded corners consistently across interactive elements
- Do use the primary color sparingly — only for the most important action per screen
- Do maintain 4.5:1 contrast ratio for all body text (WCAG AA)
- Do split card border-radius top/bottom (10px top, 0 bottom for image; 0 top, 10px bottom for text)
- Do apply `font-feature-settings: "palt"` to all Japanese text for proportional kana spacing
- Do use `#ed2446` as the single hover accent color across all link contexts
- Don't use inline `outline` on focused inputs — gyas removes it via `outline: unset`
