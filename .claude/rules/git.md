# Git ルール

## 禁止・要注意コマンド

履歴を破壊するため、原則として実行しない：

| コマンド | 理由 | 代替手段 |
|---------|------|---------|
| `git push --force` | リモート履歴を上書き | `--force-with-lease`（feature ブランチのみ）|
| `git reset --hard` | コミットを消去 | `git revert`（履歴を残して取り消し）|
| `git commit --amend`（push 済み） | 公開済みコミットを書き換え | 新規コミットで修正 |
| `git rebase`（main ブランチ上） | 共有履歴の書き換え | `git merge` |
| `git clean -fd` | 未追跡ファイルを削除 | 個別に `rm` で削除 |

## force-with-lease を使う場合

自分のブランチをリベースした後のみ許可。必ず事前に差分を確認してから実行：
```bash
git log --oneline origin/<branch>..HEAD
```

## コミットメッセージ規則

```
<type>: <説明（日本語）>
```

| type | 用途 |
|------|------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `style` | UI・スタイル変更 |
| `chore` | 依存更新・設定変更 |
| `refactor` | 動作変更なしのリファクタ |
| `docs` | ドキュメントのみ |

## 作業前の確認（必須）

```bash
gh pr list                        # 関連 PR の状態確認
git log origin/main --oneline -5  # main の最新コミット確認
```

## 検証コメントの記録（必須）

PR または Issue で検証を行った場合、Claude・ユーザーどちらが行った場合も必ずコメントを残す。

```bash
gh pr comment <PR番号> --body "..."      # PR に記録
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

## 安全な取り消し方法

```bash
git revert <commit-hash>    # push 済みコミットを取り消す（履歴保持）
git restore <file>          # ファイル単位で変更を戻す
git restore --staged <file> # ステージングを取り消す（ファイルは保持）
```
