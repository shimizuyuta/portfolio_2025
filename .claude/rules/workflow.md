# 作業原則

## 会話コンテキストより実際の状態を優先する

会話の記憶（「さっきこうだった」）ではなく、必ずツールで現在の状態を確認してから行動する。

悪い例：「さっき feat/xxx ブランチで作業していたからまだオープンのはず」→ そのまま操作
良い例：`gh pr view <番号>` で確認 → マージ済みと判明 → main から切り直す

## ブランチ作成前のチェックリスト

1. `gh pr list` でオープン PR を確認
2. 関連する PR は `gh pr view <番号>` でマージ済みかを確認
3. `git log origin/main --oneline -5` で main の最新を確認
4. `git fetch origin && git checkout -b <branch> origin/main` でブランチを作成
