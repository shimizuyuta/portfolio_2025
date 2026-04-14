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

## ビルド確認の方針

- `npm run build` はローカルでは不要（Vercel CI に任せる）
- PR 作成後に `gh pr checks <PR番号>` で CI が通過したことを確認してからユーザーに報告する
