# Portfolio 2025

YSデベロップメントのポートフォリオサイト。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を開いて実際の値を設定する（必要な変数は `.env.example` を参照）。

### 3. Supabase CLI のリンク

```bash
supabase login
supabase link
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

### 5. MCP の確認（Claude Code 使用時）

```bash
claude mcp list
```

## コマンド

```bash
npm run dev     # 開発サーバー起動（Turbopack）
npm run lint    # Biome によるコード品質チェック
npm run format  # Biome によるフォーマット修正
```
