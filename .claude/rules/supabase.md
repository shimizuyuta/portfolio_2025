# Supabase ルール

## プロジェクト情報

| 項目 | 値 |
|------|-----|
| プロジェクト名 | portfolio-2025 |
| Project Ref | yjpbkeytzoyliozbzmhf |
| URL | https://yjpbkeytzoyliozbzmhf.supabase.co |
| リージョン | ap-northeast-1（東京） |

## よく使う CLI コマンド

```bash
# マイグレーション作成
supabase migration new <name>

# リモートに適用
supabase db push

# TypeScript 型を自動生成
supabase gen types typescript --project-id yjpbkeytzoyliozbzmhf > src/types/supabase.ts

# リモートの変更をローカルに取り込む
supabase db pull

# ローカルとリモートの差分確認
supabase db diff
```

## クライアントの使い分け

Server Components・Route Handlers では `createServerClient`、Client Components では `createBrowserClient` を使う。

```ts
// src/lib/supabase/server.ts — Server Components / Route Handlers
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  );
}
```

```ts
// src/lib/supabase/client.ts — "use client" コンポーネント
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

このプロジェクトでは記事データの取得のみのため、基本的に **Server Components + `createServerClient`** を使う。

## マイグレーションの進め方

テーブルの変更は必ずマイグレーションファイルで管理する。Supabase の Table Editor から直接変更しない（履歴が残らないため）。

```
1. supabase migration new <変更内容を表す名前>
2. supabase/migrations/<timestamp>_<name>.sql を編集
3. supabase db push でリモートに適用
4. supabase gen types typescript ... で型を再生成
```

## RLS ポリシーの方針

- テーブルには必ず RLS を有効化する
- `articles` テーブルは公開記事のみ anon で読み取り可能にする
- 書き込み（INSERT / UPDATE / DELETE）は RLS で禁止（管理は Supabase Dashboard から行う）

```sql
-- RLS 有効化
alter table articles enable row level security;

-- 公開記事の読み取りのみ許可
create policy "公開記事は誰でも読める"
  on articles for select
  using (published_at is not null and published_at <= now());
```

## MCP でできること

Supabase MCP（`@supabase/mcp-server-supabase`）を使うと Claude から直接以下が行える：

- テーブル一覧・スキーマの確認
- SQL の実行
- マイグレーションの生成・適用
- TypeScript 型の生成
- Edge Functions の管理
- プロジェクトのログ確認

MCP はスキーマ設計・マイグレーション生成の補助として使う。本番データの直接操作は避ける。
