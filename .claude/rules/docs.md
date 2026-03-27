# ドキュメント管理ルール

## docs/design/ の更新

設計に関わる Issue では、実装前に必ず `docs/design/` の該当ファイルを更新する。

Issue のチェックリストは以下の順序で進める：

```
- [ ] 壁打ち・内容確定
- [ ] docs/design/ を更新
- [ ] 実装
- [ ] lint 確認
- [ ] PR 作成
```

対象ファイル：
- 全体方針の変更 → `docs/design/overview.md`
- ホームページのセクション → `docs/design/home.md`
- 各ページの設計 → `docs/design/<page>.md`
