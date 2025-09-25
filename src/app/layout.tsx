"use client";

import "./globals.css";
import { ReactNode, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="ja">
      <body className="min-h-screen bg-background text-foreground">
        {/* ナビゲーション */}
        <header className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 md:py-4 md:px-6">
            {/* ロゴ */}
            <div className="flex items-center">
              <Image
                src="/logo/logo2.png"
                alt="YS Development Logo"
                width={50}
                height={50}
                className="mr-2 md:w-[60px] md:h-[60px]"
              />
              {/* <span className="hidden sm:block font-bold text-lg md:text-xl text-sky-600">
                YSデベロップメント
              </span> */}
            </div>

            {/* PC用ナビ */}
            <ul className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium">
              <li>
                <a
                  href="#about"
                  className="hover:text-sky-600 transition-colors duration-200 py-2 px-1"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-sky-600 transition-colors duration-200 py-2 px-1"
                >
                  サービス
                </a>
              </li>
              <li>
                <a
                  href="#portfolio"
                  className="hover:text-sky-600 transition-colors duration-200 py-2 px-1"
                >
                  実績
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-sky-600 transition-colors duration-200 py-2 px-1"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-sky-600 transition-colors duration-200 py-2 px-1"
                >
                  お問い合わせ
                </a>
              </li>
            </ul>

            {/* モバイル用ハンバーガー */}
            <button
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
                <li>
                  <a
                    href="#about"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-3 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-3 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors duration-200"
                  >
                    サービス
                  </a>
                </li>
                <li>
                  <a
                    href="#portfolio"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-3 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors duration-200"
                  >
                    実績
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-3 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors duration-200"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-3 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors duration-200"
                  >
                    お問い合わせ
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </header>

        <main className="w-full">{children}</main>

        <footer className="mt-16 border-t py-8 bg-gray-50">
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
