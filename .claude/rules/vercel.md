# Vercel ルール

## プロジェクト情報

| 項目 | 値 |
|---|---|
| Project ID | `prj_88Zqft7PGcGPm7CHWMyzQeW6BI24` |
| Org ID | `team_1b1OAksYMWLhwZWVLFzYp4qe` |
| Dashboard | https://vercel.com/yutas-projects-44633396/portfolio-2025 |

## CI / デプロイ確認コマンド

```bash
# PR の CI ステータスと Vercel デプロイ確認
gh pr checks <PR番号>

# Vercel ビルドログ取得
npx vercel inspect <deployment-id> --logs
```

## 環境変数の管理

- 本番・プレビューの環境変数は Vercel Dashboard から設定する
- ローカル専用の変数（`NEXT_PUBLIC_ADMIN_ENABLED` など）は Vercel に設定しない
- `.env.example` が環境変数のテンプレート（実値は書かない）

### 環境変数はビルド時に焼き込まれる（重要）

**Vercel の環境変数は既存デプロイに遡って反映されない。** 追加・変更しても、稼働中のデプロイは古い値のまま動き続ける。

```
環境変数を追加 → 既存デプロイは変わらない → 再デプロイして初めて反映
```

「変数を追加したのに 401 / 404 が直らない」は、ほぼこれが原因。挙動を確認する前に必ず再デプロイする。値の変更が効かない場合はビルドキャッシュを無効にして再デプロイする。

### 貼り付け時の改行混入に注意

Dashboard の入力欄に値を貼ると、末尾に改行が入ることがある。`"abc"` と `"abc\n"` は厳密比較で一致しないため、認証系の変数では原因の分かりにくい失敗になる。

- 過去の事例: `NEXT_PUBLIC_GA_ID`（`3120741`）、`BLOG_API_KEY`（PR #146）
- **シークレットを比較するコードでは、読み出し時に `.trim()` を通す**

### 切り分けの手順

本番だけ失敗する場合、まずローカルと本番で同じ入力を試して差を確認する。

1. ローカル（`npm run dev`）で同じリクエストを投げる
2. 通ればコードではなく環境変数の問題
3. HTTP ステータスを必ず確認する（レスポンス本文だけ見ると 401 を「データ0件」と誤読する）

## ビルド確認の方針

- `npm run build` はローカルでは不要（Vercel CI に任せる）
- PR 作成後に `gh pr checks <PR番号>` で CI が通過したことを確認してからユーザーに報告する
