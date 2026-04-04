# Git Worktree ルール

## 基本方針

並行開発は **git worktree** を使う。同じリポジトリを別ディレクトリに展開することで、ブランチ切り替えなしに複数の作業を並行して進められる。

## Worktree の作成

```bash
# origin/main から新しいブランチで worktree を作成
git worktree add ../portfolio-<branch-name> -b <branch-name> origin/main
```

ディレクトリ名は `portfolio-<branch-name>` の形式に統一する。

## Worktree の削除（ブランチマージ後）

GitHub の「Automatically delete head branches」が有効なため、PR マージ時にリモートブランチは自動削除される。
ローカルの worktree とブランチは手動で削除する：

```bash
# worktree を削除（ディレクトリごと削除される）
git worktree remove ../portfolio-<branch-name>

# ローカルブランチを削除
git branch -d <branch-name>
```

## 現在の Worktree 一覧確認

```bash
git worktree list
```

## ルール

- 新しい作業を始めるときは必ず worktree を作成する（既存ブランチ上で直接作業しない）
- main ブランチの worktree（メインディレクトリ）では直接コミットしない
- マージ済みの worktree は速やかに削除してディレクトリを整理する
