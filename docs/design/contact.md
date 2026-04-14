# Contact ページ（/contact）設計

## 概要

お問い合わせフォームページ。名前・メールアドレス・メッセージを入力して送信すると、Resend 経由でオーナーにメールが届く。

---

## UI

### レイアウト
- `max-w-2xl mx-auto`、中央揃え
- タイトル「Contact」 + サブテキスト
- フォーム送信後は成功メッセージ（フォームと差し替え表示）

### フォームフィールド

| フィールド | 必須 | 型 | placeholder |
|-----------|------|---|-------------|
| お名前 | ✅ | text | 山田 太郎 |
| メールアドレス | ✅ | email | example@email.com |
| メッセージ | ✅ | textarea（6行） | お問い合わせ内容をご記入ください |

### 状態管理

| 状態 | 説明 |
|------|------|
| `idle` | 初期状態 |
| `sending` | 送信中（ボタン disabled） |
| `success` | 送信成功（フォームを成功メッセージに差し替え） |
| `error` | 送信失敗（エラーメッセージ表示） |

---

## API

- エンドポイント: `POST /api/contact`
- リクエスト: `{ name, email, message }`
- レスポンス: `{ success: boolean, error?: string }`

---

## メール送信

- サービス: Resend
- 送信先: shimizuyuta213@gmail.com
- 環境変数: `RESEND_API_KEY`（Vercel の環境変数に設定）
