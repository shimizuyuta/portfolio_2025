# サムネイル素材のクレジット

`/make-thumbnail` で生成する画像に含まれる第三者素材と、その帰属表示の義務をまとめる。

## Twemoji（絵文字イラスト）

`--emoji` オプションで差し込まれる絵文字は [Twemoji](https://github.com/jdecked/twemoji) の SVG。

| 項目 | 内容 |
|---|---|
| 対象 | `--emoji` を使って生成したサムネイル |
| ライセンス | **グラフィックは CC-BY 4.0**（コードは MIT） |
| 権利表記 | Copyright 2020 Twitter, Inc and other contributors |
| バージョン | 15.0.0（`scripts/thumbnail/emoji.ts` で固定） |

### 帰属表示の義務（重要）

**CC-BY 4.0 は帰属表示を要求する。** npm パッケージ `@twemoji/svg` の `license` フィールドは `MIT` だが、これは**コードのライセンスであって画像のものではない**。画像を公開物に使う場合は CC-BY 4.0 が適用される。

サムネイルはサイトと外部SNSに公開されるため、以下のいずれかで表示する：

- サイトに素材クレジットのページを設け、そこに記載する
- 記事フッターまたはサイト共通フッターに記載する

記載文例：

```
絵文字画像は Twemoji（Copyright 2020 Twitter, Inc and other contributors）を使用しています。
CC-BY 4.0 でライセンスされています。
https://creativecommons.org/licenses/by/4.0/
```

> **未対応の場合は `--emoji` を使わない。** 帰属表示を置かないまま公開するとライセンス違反になる。
> 絵文字を使わないサムネイル（`--emoji` なし、または `minimal` テンプレ）にはこの義務は生じない。

## フォント

| フォント | ライセンス | 帰属表示 |
|---|---|---|
| Noto Sans JP | SIL Open Font License 1.1 | 不要（埋め込み・派生物ともに可） |
| Noto Serif | SIL Open Font License 1.1 | 不要 |

satori はグリフをパスに変換して出力するため、生成された PNG にフォントファイル自体は含まれない。OFL の観点でも問題ない。

## 自前の画像（`--illustration`）

素材サイト等から調達した画像を使う場合、**そのライセンス確認は使う人の責任**。商用利用可否・帰属表示の要否・加工の可否を調達時に確認し、必要ならこのファイルに追記する。
