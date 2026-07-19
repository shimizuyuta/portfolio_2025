# Git ルール

**いつ読むか:** 履歴を書き換える操作（rebase・commit --amend・force push・revert）を行う前。

## 機械的にブロック済みのコマンド

以下は `.claude/settings.json` の `permissions.deny` で拒否される。プロンプトで注意する必要はない：

| コマンド | 理由 | 代替手段 |
|---------|------|---------|
| `git push --force` | リモート履歴を上書き | `--force-with-lease`（feature ブランチのみ、許可済み）|
| `git reset --hard` | コミットを消去 | `git revert`（履歴を残して取り消し）|
| `git clean -fd` | 未追跡ファイルを削除 | 個別に `rm` で削除 |

## 条件付きで禁止（deny では表現できないため要注意）

| コマンド | 禁止条件 | 代替手段 |
|---------|---------|---------|
| `git commit --amend` | push 済みコミットに対して | 新規コミットで修正 |
| `git rebase` | main ブランチ上で | `git merge` |

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

## 安全な取り消し方法

```bash
git revert <commit-hash>    # push 済みコミットを取り消す（履歴保持）
git restore <file>          # ファイル単位で変更を戻す
git restore --staged <file> # ステージングを取り消す（ファイルは保持）
```
