# Supabase ルール

## プロジェクト情報

プロジェクト設定は `supabase/config.toml` を参照。
接続情報（URL・キー）は `.env.local` を参照。

## MCP Server

MCP Server を使うと Claude Code から直接 Supabase を操作できる。
設定は `.claude/mcp.json` で管理する。

CLI で毎回接続文字列を貼る運用はトラブルが多いため、**Supabase の操作は MCP 経由を基本とする**。

## MCP でできること

| 操作 | 方法 |
|------|------|
| テーブル設計・確認 | MCP |
| マイグレーション生成 | MCP |
| SQL 実行 | MCP |
| TypeScript 型生成 | CLI（`supabase gen types`）|
| リモートへの適用 | CLI（`supabase db push`）|

## CLI コマンド（補助的に使う）

```bash
# マイグレーション作成
supabase migration new <name>

# リモートに適用
supabase db push

# TypeScript 型を自動生成（src/types/supabase.ts を上書き）
supabase gen types typescript --linked > src/types/supabase.ts

# リモートの変更をローカルに取り込む
supabase db pull

# ローカルとリモートの差分確認
supabase db diff
```

## クライアントの使い分け

- **Server Components / Route Handlers** → `src/lib/supabase/server.ts` の `createClient()` を使う
- **Client Components** → `src/lib/supabase/client.ts` の `createClient()` を使う（認証が必要になったとき）

このプロジェクトでは記事データの取得のみのため、基本的に **Server Components + server.ts** を使う。

## マイグレーションの進め方

テーブルの変更は必ずマイグレーションファイルで管理する。Supabase の Table Editor から直接変更しない（履歴が残らないため）。

```
1. MCP でテーブル設計・マイグレーション SQL を生成
2. supabase migration new <変更内容を表す名前>
3. supabase/migrations/<timestamp>_<name>.sql を編集
4. supabase db push でリモートに適用
5. supabase gen types typescript --linked > src/types/supabase.ts で型を再生成
```

## Docker 未起動時のデータ操作（REST API）

`supabase status` が Docker エラーを返す場合、CLI の DB 操作コマンドは使えない。
また `supabase db execute` というコマンドは存在しない（CLI v2 系には未実装）。

その場合は `.env.local` の値を使って REST API で直接操作する：

```bash
# .env.local から読み込む
source .env.local  # または手動で変数をセット

# SELECT
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/<table>?select=*" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"

# INSERT（RLS をバイパスするため service_role キーを使う）
curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/<table>" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '[{ ... }]'
```

- `NEXT_PUBLIC_SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` は `.env.local` に定義済み
- upsert 時は `-H "Prefer: return=representation,resolution=ignore-duplicates"` を追加

## RLS ポリシーの方針

- テーブルには必ず RLS を有効化する
- `articles` テーブルは `status = 'published'` かつ `published_at <= now()` のもののみ anon で読み取り可能
- 書き込み（INSERT / UPDATE / DELETE）は RLS で禁止（管理は Supabase Dashboard から行う）
- ポリシーの実装はマイグレーションファイル（`supabase/migrations/`）を参照
