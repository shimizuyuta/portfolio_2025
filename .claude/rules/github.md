# GitHub / PR / CI ルール

## 作業前の確認（必須）

ブランチ操作の前に必ず実行する：

```bash
gh pr list                          # オープン PR の一覧確認
gh pr view <番号>                   # 対象 PR がマージ済みかを確認
git log origin/main --oneline -5    # main の最新コミット確認
```

会話コンテキストから「まだオープンのはず」と思い込まず、必ずツールで現在の状態を確認する。

## PR のマージ順序

同じファイルを変更する複数の PR がある場合、古い PR から順にマージする。
順序を誤るとコンフリクトが発生する。

## Vercel CI エラーの確認方法

```bash
gh pr checks <PR番号>                              # CI ステータス一覧
npx vercel inspect <deployment-id> --logs          # Vercel ビルドログ取得
```

`deployment-id` は `gh pr checks` の出力 URL から取得できる。

## 検証コメントの記録（必須）

PR または Issue で検証を行った場合、Claude・ユーザーどちらが行った場合も必ずコメントを残す。

```bash
gh pr comment <PR番号> --body "..."       # PR に記録
gh issue comment <Issue番号> --body "..." # Issue に記録
```

コメントフォーマット：
```
## 検証記録

- 検証者: Claude / ユーザー
- 内容: （何を確認したか）
- 結果: ✅ 問題なし / ⚠️ 軽微な指摘あり / ❌ 要修正
- 備考: （任意）
```
