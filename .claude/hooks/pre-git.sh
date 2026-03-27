#!/bin/bash
# pre-git.sh
# git checkout / branch / fetch 操作の前に PR 状態を表示する

input=$(cat)
command=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('command',''))" 2>/dev/null)

if echo "$command" | grep -qE "git (checkout|branch|fetch)"; then
  echo "=== 作業前確認: オープン PR 一覧 ==="
  gh pr list --limit 10 2>/dev/null || echo "(gh pr list 取得失敗)"
  echo ""
fi
