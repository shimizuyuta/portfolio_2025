import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const contactTo = process.env.CONTACT_TO_EMAIL;
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "必須項目が入力されていません" },
      { status: 400 },
    );
  }

  if (!contactTo) {
    console.error("CONTACT_TO_EMAIL が設定されていません");
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }

  const { error } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: contactTo,
    replyTo: email,
    subject: `【お問い合わせ】${name}様より`,
    text: `名前: ${name}\nメール: ${email}\n\nメッセージ:\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
