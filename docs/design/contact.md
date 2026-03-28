# Contact ページ（/contact）設計

## 概要

お問い合わせフォームページ。訪問者が名前・メールアドレス・メッセージを入力して送信すると、Resend 経由でオーナーにメールが届く。

## フォームフィールド

| フィールド | 必須 | 説明 |
|-----------|------|------|
| 名前 | ✅ | 送信者の名前 |
| メールアドレス | ✅ | 返信先メールアドレス |
| メッセージ | ✅ | お問い合わせ内容 |

## メール送信

- サービス: Resend
- 送信先: shimizuyuta213@gmail.com
- 環境変数: `RESEND_API_KEY`（Vercel の環境変数に設定）

## UI

- フォームは `/contact` ページにインライン実装
- shadcn/ui の Button を使用
- 送信中はボタンを disabled に
- 送信後は成功・失敗メッセージを表示

## API

- エンドポイント: `POST /api/contact`
- リクエスト: `{ name, email, message }`
- レスポンス: `{ success: boolean, error?: string }`
