"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const DRAWER_LINKS = [
  { label: "ホーム", href: "/" },
  { label: "サービス", href: "/#services" },
  { label: "実績", href: "/#works" },
  { label: "ブログ", href: "/knowledge" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto flex items-center py-4 px-4 md:py-6 md:px-6">
          <Link
            href="/"
            className="font-[family-name:var(--font-zen-kaku)] font-bold text-base md:text-xl tracking-wide md:tracking-widest whitespace-nowrap shrink-0 bg-gradient-to-r from-sky-600 to-indigo-500 bg-clip-text text-transparent"
          >
            YSデベロップメント
          </Link>

          <ul className="hidden md:flex items-center gap-1 text-sm font-medium ml-auto">
            <li>
              <Link
                href="/#services"
                className="hover:text-sky-600 transition-colors duration-200 py-2 px-3"
              >
                サービス
              </Link>
            </li>
            <li>
              <Link
                href="/#works"
                className="hover:text-sky-600 transition-colors duration-200 py-2 px-3"
              >
                実績
              </Link>
            </li>
            <li>
              <Link
                href="/knowledge"
                className="hover:text-sky-600 transition-colors duration-200 py-2 px-3"
              >
                ブログ
              </Link>
            </li>
            {process.env.NEXT_PUBLIC_ADMIN_ENABLED && (
              <li>
                <Link
                  href="/admin"
                  className="text-xs font-medium text-gray-400 border border-gray-200 rounded-md px-2.5 py-1.5 hover:border-sky-400 hover:text-sky-600 transition-colors duration-200"
                >
                  記事編集
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/contact"
                className="bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200 py-2 px-4"
              >
                お問い合わせ
              </Link>
            </li>
          </ul>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="メニューを開く"
            className="md:hidden shrink-0 ml-auto p-1.5 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-white flex flex-col transition-opacity duration-300 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
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
    </>
  );
}
