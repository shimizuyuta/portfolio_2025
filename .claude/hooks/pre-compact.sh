#!/bin/bash

echo ""
echo "⚠️  compact が発動しようとしています。"
echo ""
echo "圧縮前に以下を確認してください："
echo "  - 会話で決まったルール・方針で未文書化のものはないか"
echo "  - memory/ に保存すべき情報はないか"
echo "  - skills などに追記すべき内容はないか"
echo ""

read -r -p "確認済みですか？ (y/N): " answer

if [[ "$answer" =~ ^[Yy]$ ]]; then
  echo "✅ 確認済み。compact を実行します。"
  exit 0
else
  echo "❌ compact をキャンセルしました。必要な文書化を行ってから /compact を手動実行してください。"
  exit 1
fi
