"use client";

import "./globals.css";
import { Mail, Menu, X } from "lucide-react";
import { Noto_Sans_JP, Zen_Kaku_Gothic_New } from "next/font/google";
import Link from "next/link";
import { type ReactNode, useState } from "react";

// PC 中央ナビ（お問い合わせは右 CTA に分離）
const NAV_LINKS = [
  { label: "サービス", href: "/#services" },
  { label: "実績", href: "/#works" },
  { label: "ブログ", href: "/knowledge" },
];

// SP ドロワー（ホームを先頭に追加）
const DRAWER_LINKS = [
  { label: "ホーム", href: "/" },
  { label: "サービス", href: "/#services" },
  { label: "実績", href: "/#works" },
  { label: "ブログ", href: "/knowledge" },
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
        {/* ── ヘッダー ──────────────────────────────────────── */}
        <header className="w-full border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 md:py-5 md:px-8">
            {/* ロゴ */}
            <Link
              href="/"
              className="font-[family-name:var(--font-zen-kaku)] font-bold text-lg md:text-xl tracking-widest bg-gradient-to-r from-sky-600 to-indigo-500 bg-clip-text text-transparent shrink-0"
            >
              YSデベロップメント
            </Link>

            {/* PC: 中央ナビ */}
            <ul className="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-medium absolute left-1/2 -translate-x-1/2">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-700 hover:text-sky-600 transition-colors duration-200 py-1"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* PC: 右 CTA */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors duration-200 shrink-0"
            >
              お問い合わせ
            </Link>

            {/* SP: お問い合わせ pill + ハンバーガー */}
            <div className="flex md:hidden items-center gap-3">
              <Link
                href="/contact"
                className="flex items-center gap-1.5 border border-gray-900 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                <Mail size={12} aria-hidden="true" />
                お問い合わせ
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="メニューを開く"
                className="p-1.5 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </header>

        {/* SP: 全画面ドロワー */}
        <div
          className={`fixed inset-0 z-[60] bg-white flex flex-col transition-opacity duration-300 md:hidden ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={!isOpen}
        >
          {/* 閉じるボタン */}
          <div className="flex justify-end px-6 pt-6 pb-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="メニューを閉じる"
              className="p-1.5 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          {/* ナビリンク */}
          <nav className="flex-1 px-8 pt-8">
            <ul>
              {DRAWER_LINKS.map(({ label, href }) => (
                <li key={href} className="border-b border-gray-100">
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="block py-5 text-base font-medium text-gray-800 hover:text-sky-600 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 下部 CTA */}
          <div className="px-8 pb-12 space-y-3">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors duration-200"
            >
              お問い合わせ
            </Link>
          </div>
        </div>

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
