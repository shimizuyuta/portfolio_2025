# /trend-scan

監視キーワードを調査し、記事化候補3本を提示するコマンド。**選定までで止まる。執筆は `/write-article` で行う。**

## 使い方

```
/trend-scan
/trend-scan <テーマを絞る場合のヒント>
```

例:
```
/trend-scan
/trend-scan 補助金まわりで探して
/trend-scan 歯科向けのスポーク記事がほしい
```

## 着手前に必ず読む

`.claude/rules/blog.md` — メディア定義・ペルソナ・記事フォーマット規約。

## 実行手順

### Step 1. 既存記事一覧の取得（省略禁止）

重複候補を出さないために必要。**`BLOG_API_KEY` が必要なため、人間に実行してもらう**（環境ファイルへのアクセスは `.claude/hooks/block-env-read.py` でブロックされている）。

以下を提示し、`!` プレフィックスでの実行を依頼する。

```
! set -a; source .env.local; set +a; curl -s "$BLOG_API_BASE_URL/api/articles" -H "Authorization: Bearer $BLOG_API_KEY" | python3 -c 'import sys,json; d=json.load(sys.stdin); arts=d.get("articles",[]); [print("[%s] %s | %s | %s | %s" % (a["status"],a["slug"],a["category"],a["title"],[t["name"] for t in a.get("tags",[])])) for a in arts]'
```

**全status が対象。** draft も重複判定に含める（同じネタで draft が既にあるのに新規提案するのを防ぐ）。

### Step 2. trend-scout を起動

`trend-scout` エージェントに以下を渡す。

- Step 1 で取得した既存記事一覧
- ユーザーがヒントを指定した場合はその内容
- 今日の日付（制度・時事の鮮度判定に必要）

エージェントは `.claude/config/trend-keywords.json` を自分で読む。**コマンド側でキーワードを列挙して渡さない**（設定ファイルを唯一の正にするため）。

### Step 3. 候補を提示して終了

trend-scout の出力をユーザーに提示する。**ここで停止する。**

選択後の執筆は `/write-article <選ばれたテーマ>` で行う。**このコマンドから続けて執筆に入らない。**

## 候補が出せない場合

trend-scout が候補を出せない、または調査が空振りした場合は、その旨を伝える。

代替として、**既存記事のタグの空白領域から候補を提案してよい**（例: `介護` タグの記事はあるが `歯科` タグが無い、など）。ただし「トレンド調査の結果ではなく、既存記事の穴埋め提案である」ことを明示する。

## ガードレール

`blog.md` の絶対規則に従う。特にこのコマンドで関わるもの:

- **記事の保存・更新をしない。** このコマンドは読み取りと提案のみ
- **執筆に進まない。** 候補提示で必ず停止する
- **`BLOG_API_KEY` の値を出力しない**
- 制度・法令が絡む候補は、一次情報で裏を取るか「未確認」と明記する
