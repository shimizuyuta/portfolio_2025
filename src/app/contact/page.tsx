"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type FormState = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (res.ok) {
      setFormState("success");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      const data = await res.json();
      setErrorMessage(data.error ?? "エラーが発生しました");
      setFormState("error");
    }
  }

  return (
    <main className="w-full py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Contact</h1>
        <p className="text-muted-foreground mb-10 text-lg text-center leading-relaxed">
          お仕事のご相談やお問い合わせは
          <br />
          お気軽にどうぞ！
        </p>

        {formState === "success" ? (
          <div className="text-center py-12">
            <p className="text-lg font-semibold mb-2">送信しました！</p>
            <p className="text-muted-foreground">お返事をお待ちください。</p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setFormState("idle")}
            >
              別のお問い合わせをする
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                お名前 <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                placeholder="山田 太郎"
                disabled={formState === "sending"}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                メールアドレス <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                placeholder="example@email.com"
                disabled={formState === "sending"}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                メッセージ <span className="text-destructive">*</span>
              </label>
              <textarea
                id="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 resize-none"
                placeholder="お問い合わせ内容をご記入ください"
                disabled={formState === "sending"}
              />
            </div>

            {formState === "error" && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}

            <Button
              type="submit"
              disabled={formState === "sending"}
              className="w-full"
            >
              {formState === "sending" ? "送信中…" : "送信する"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
