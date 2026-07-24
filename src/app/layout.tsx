import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Zen_Kaku_Gothic_New } from "next/font/google";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/site";
import { GoogleAnalytics } from "./_components/GoogleAnalytics";
import { Header } from "./_components/Header";

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

export const metadata: Metadata = {
  title: {
    default: "YSデベロップメント",
    template: "%s | YSデベロップメント",
  },
  description:
    "福祉×IT・AIの視点で発信するフリーランスエンジニア。社会福祉士の資格と6年のエンジニア経験を活かし、福祉業界のDX・AI導入支援を行っています。",
  metadataBase: new URL(SITE_URL),
};

// スマホ閲覧が主のため viewport を明示する。
// - viewportFit: "cover" は iOS のノッチ／ホームバー領域（セーフエリア）まで
//   背景を敷くための前提。env(safe-area-inset-*) を使う場合に必須。
// - themeColor は公開ページが常時ライト（背景 white 固定）のため単一値。
//   ダークテーマは .dark クラス未使用で公開側に出ないため dark 値は設けない。
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${zenKakuGothic.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-[family-name:var(--font-noto-sans-jp)]">
        <GoogleAnalytics />
        <Header />
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
