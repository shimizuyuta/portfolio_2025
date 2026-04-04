"use client";

import "./globals.css";
import { Menu, X } from "lucide-react";
import { Noto_Sans_JP, Zen_Kaku_Gothic_New } from "next/font/google";
import Link from "next/link";
import { type ReactNode, useState } from "react";

const NAV_LINKS = [
  { label: "サービス", href: "/#services" },
  { label: "実績", href: "/#works" },
  { label: "ナレッジ", href: "/knowledge" },
  { label: "お問い合わせ", href: "/contact" },
];

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const zenKakuGothic = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-zen-kaku",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${zenKakuGothic.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-[family-name:var(--font-noto-sans-jp)]">
        {/* ナビゲーション */}
        <header className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 md:py-4 md:px-6">
            {/* ロゴ */}
            <span className="font-[family-name:var(--font-zen-kaku)] font-bold text-lg md:text-xl tracking-widest bg-gradient-to-r from-sky-600 to-indigo-500 bg-clip-text text-transparent">
              YSデベロップメント
            </span>

            {/* PC用ナビ */}
            <ul className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-sky-600 transition-colors duration-200 py-2 px-1"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* モバイル用ハンバーガー */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="メニュー切替"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>

          {/* モバイルメニュー */}
          <div
            className={`md:hidden bg-white border-t transition-all duration-300 ease-in-out ${
              isOpen
                ? "max-h-64 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="max-w-7xl mx-auto">
              <ul className="flex flex-col px-4 py-2 gap-1 text-sm font-medium">
                {NAV_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="block py-3 px-3 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        <main className="w-full flex-1">{children}</main>

        <footer className="border-t py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} YS Development. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
