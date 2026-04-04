# 開発環境セットアップ

## 1. 依存関係のインストール

```bash
npm install
```

## 2. 環境変数の設定

```bash
cp .env.example .env.local
# .env.local を開いて実際の値を設定する
```

必要な環境変数：

| 変数名 | 説明 |
|--------|------|
| `RESEND_API_KEY` | Resend のメール送信 API キー |
| `SUPABASE_DB_PASSWORD` | Supabase DB パスワード |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon キー |

## 3. Supabase CLI のセットアップ

```bash
supabase login
supabase link --project-ref yjpbkeytzoyliozbzmhf --password <DB_PASSWORD>
```

## 4. 開発サーバーの起動

```bash
npm run dev
```

## 5. MCP の確認

Claude Code 起動時に Supabase MCP が接続されていることを確認する：

```bash
claude mcp list
```
