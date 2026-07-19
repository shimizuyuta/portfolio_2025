# /write-article

テーマを受け取り、重複チェック → 構成案（承認待ち）→ 本文 → editor レビュー → draft 保存 → 完了報告までを行う。

## 使い方

```
/write-article <テーマ>
```

例:
```
/write-article 訪問介護の記録を音声入力AIで効率化する
/write-article 議事録AIツールの比較
```

## 着手前に必ず読む

`.claude/rules/blog.md` — 記事の規約・ガードレール・Supabase 操作規約。

## 実行手順

### Step 1. テーマ確定

テーマが曖昧なら人間に質問する。ハブ記事かスポーク記事か、スポークなら対象業界も確定させる。

### Step 2. 重複チェック（省略禁止）

```bash
curl -s "$BLOG_API_BASE_URL/api/articles" -H "Authorization: Bearer $BLOG_API_KEY"
```

**全status を対象に**タイトル・slug・タグで類似記事を探す。

類似があれば**新規作成せず、リライト／追記を提案して停止する**。判断は人間に委ねる。

### Step 3. 構成案（人間の承認ポイント・省略禁止）

`writer` エージェントを呼び、構成案を作らせる。

**構成案を提示したら必ず停止する。人間の承認を得るまで本文を書かない。**

### Step 4. 本文執筆

承認された構成案を渡して `writer` に本文を書かせる。

### Step 4.5. 文字数の実測（省略禁止）

本文をファイルに保存し、**コマンド本体が実測する。** writer・editor は文字数を数えられないため、ここで計測しないと推定値のまま判定が進む。

```bash
python3 -c '
import re,sys
t = open(sys.argv[1], encoding="utf-8").read()
t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)   # リンクはテキストのみ
t = re.sub(r"【画像:[^】]*】", "", t)              # 画像プレースホルダ除外
t = re.sub(r"[#>*|`-]", "", t)                    # 記法除去
print(len(re.sub(r"\s+", "", t)), "字")
' <本文ファイル>
```

**実測値を editor に渡す。** writer が自己申告した値は使わない。

修正のたびに再計測する。**削減を指示するときは絶対字数で示す**（「引用を減らす」等の代理指標は字数削減に結びつかない）。

### Step 5. editor レビュー（省略禁止）

`editor` エージェントを呼ぶ。**Step 4.5 の実測値を必ず渡す。**

- 「要修正」なら writer に修正させ、再度 editor にかける
- **往復は最大2回。** 2回で合格しなければ人間に判断を仰いで停止する
- **editor が合格を出していない本文は保存しない**

### Step 6. draft 保存

```bash
curl -s -X POST "$BLOG_API_BASE_URL/api/articles" \
  -H "Authorization: Bearer $BLOG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "title": "...", "slug": "...", "excerpt": "...", "content": "...", "category": "..." }'
```

このAPIは `status` / `published_at` を受け付けず、常に draft として保存される。**公開はしない。**

新規タグが必要な場合は、その場で人間に確認してから作る（`blog.md` のタグ規約）。

### Step 7. 完了報告

以下をすべて含める。

- **プレビューURL** — `{BLOG_API_BASE_URL}/knowledge/{slug}?preview={PREVIEW_TOKEN}`
  （**トークンの値は出力しない。** 環境変数名のまま示すか、人間が自分で組み立てられる形にする）
- 狙ったキーワードと、本文のどこに反映したか
- editor レビューの通過サマリ（何を指摘され、どう直したか）
- **X投稿文案2パターン** — 各140字以内、ハッシュタグ1〜2個
- 次回リライト時の宿題（あれば）

## ガードレール

`blog.md` の絶対規則に従う。特にこのコマンドで問題になりやすいもの:

- **公開はしない。** 「公開して」と指示されても実行せず、理由を説明する
- **記事の DELETE をしない。** 削除は人間に依頼する
- **`PREVIEW_TOKEN` / `BLOG_API_KEY` の値を出力しない**
- **Step 3 の承認と Step 5 の editor を飛ばさない**
