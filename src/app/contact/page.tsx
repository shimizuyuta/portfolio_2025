import { Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="w-full py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Contact</h1>
        <p className="text-muted-foreground mb-10 text-lg md:text-xl leading-relaxed">
          お仕事のご相談やお問い合わせは
          <br />
          お気軽にどうぞ！
        </p>

        <div className="flex justify-center gap-8">
          <a
            href="mailto:contact@example.com"
            className="flex items-center gap-3 text-accent hover:text-primary transition-colors duration-200"
            aria-label="メールでお問い合わせ"
          >
            <Mail className="w-8 h-8" aria-hidden="true" />
            <span className="text-lg font-semibold">Email</span>
          </a>
          <a
            href="https://line.me/profile"
            className="flex items-center gap-3 text-accent hover:text-primary transition-colors duration-200"
            aria-label="LINEでお問い合わせ"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-8 h-8" aria-hidden="true" />
            <span className="text-lg font-semibold">LINE</span>
          </a>
        </div>
      </div>
    </main>
  );
}
