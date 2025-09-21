import "./globals.css";
import { ReactNode } from "react";
import Image from "next/image";

export const metadata = {
  title: "YS Development | ポートフォリオ",
  description: "AI・IT・Webマーケティング・LINE構築支援",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-background text-foreground">
        {/* ナビゲーション */}
        <header className="w-full border-b">
          <nav className="container mx-auto flex justify-between items-center py-4 px-6">
            <div className="flex items-center">
              <Image
                src="/logo/logo2.png"
                alt="YS Development Logo"
                width={80}
                height={80}
                className="mr-2"
              />
              {/* <span className="font-bold text-xl text-primary">YSデベロップメント</span> */}
            </div>
            <ul className="flex gap-6 text-sm font-medium">
              <li>
                <a href="#services" className="hover:text-primary">
                  サービス
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-primary">
                  実績
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-primary">
                  経歴
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary">
                  お問い合わせ
                </a>
              </li>
            </ul>
          </nav>
        </header>

        <main className="w-full">{children}</main>

        <footer className="mt-16 border-t py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} YS Development
        </footer>
      </body>
    </html>
  );
}
