"use client";

import {
  BarChart3,
  Brain,
  ChevronLeft,
  ChevronRight,
  Code,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Hero スライドショーデータ
const heroSlides = [
  {
    pcSrc: "/images/hero/pc/pc_business.png",
    spSrc: "/images/hero/sp/sp_business.png",
    alt: "ビジネス支援イメージ",
  },
  {
    pcSrc: "/images/hero/pc/pc_president.png",
    spSrc: "/images/hero/sp/sp_president.png",
    alt: "経営者支援イメージ",
  },
  {
    pcSrc: "/images/hero/pc/pc_tech.png",
    spSrc: "/images/hero/sp/sp_tech.png",
    alt: "テクノロジー活用イメージ",
  },
];

// Works データ
const works = [
  {
    industry: "製造業",
    title: "業務自動化",
    description: "書類処理・データ入力の自動化を実施。月40時間の工数を削減。",
    result: "工数削減 40h/月",
  },
  {
    industry: "EC・小売",
    title: "Meta広告運用",
    description: "ターゲット設定の見直しとクリエイティブのA/Bテストを実施。",
    result: "CPA 50% 改善",
  },
  {
    industry: "飲食",
    title: "公式LINE構築・運用",
    description: "顧客フォロー自動化とリピーター向けキャンペーン設計を実施。",
    result: "リピート率 20% 向上",
  },
  {
    industry: "士業",
    title: "Webサイトリニューアル",
    description: "既存サイトをモダンな技術でリニューアル。SEO対策も実施。",
    result: "問い合わせ数 3倍",
  },
  {
    industry: "物流",
    title: "業務システム開発",
    description:
      "在庫管理システムをスクラッチ開発。現場の業務フローに合わせた設計。",
    result: "作業時間 60% 削減",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentWork, setCurrentWork] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Hero スライドショー自動切り替え（4秒ごと）
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // モバイル判定
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Works スライダー: PC は3枚表示、SP は1枚表示
  const worksPerPage = isMobile ? 1 : 3;
  const totalWorksPages = Math.ceil(works.length / worksPerPage);
  const visibleWorks = works.slice(
    currentWork * worksPerPage,
    currentWork * worksPerPage + worksPerPage,
  );

  return (
    <main className="">
      {/* Hero Section - スライドショー */}
      <section
        id="hero"
        className="relative w-full h-screen min-h-[500px] overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* スライド画像 */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.alt}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== currentSlide}
          >
            {/* PC 画像 */}
            <Image
              src={slide.pcSrc}
              alt={slide.alt}
              fill
              className="object-cover hidden md:block"
              priority={index === 0}
            />
            {/* SP 画像 */}
            <Image
              src={slide.spSrc}
              alt={slide.alt}
              fill
              className="object-cover md:hidden"
              priority={index === 0}
            />
          </div>
        ))}

        {/* オーバーレイ */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60"
          aria-hidden="true"
        />

        {/* コピー */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center text-white">
          <h1
            id="hero-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug mb-4 md:mb-6"
          >
            AI・ITを活用したい。でも、誰に頼めばいい？
          </h1>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-2 max-w-2xl">
            集客・採用・業務効率化・システム開発まで、
          </p>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-8 md:mb-10 max-w-2xl">
            あなたのビジネスを一緒に作り上げるITパートナー。
          </p>

          {/* CTA ボタン */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-3"
            >
              <Link href="/contact">お問い合わせはこちら</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 border-white text-white hover:bg-white/20 font-semibold px-8 py-3"
            >
              <Link href="/service">サービスを見る</Link>
            </Button>
          </div>
        </div>

        {/* スライドインジケーター */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10"
          role="tablist"
          aria-label="スライドインジケーター"
        >
          {heroSlides.map((slide, index) => (
            <button
              key={`indicator-${slide.alt}`}
              type="button"
              role="tab"
              aria-selected={index === currentSlide}
              aria-label={`スライド ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="bg-background max-w-7xl mx-auto py-16 md:py-24 px-6"
        aria-labelledby="about-heading"
      >
        <div className="text-center mb-16 md:mb-20">
          <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-2">
            About
          </p>
          <h2 id="about-heading" className="text-3xl md:text-4xl font-bold">
            私について
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* 左側：画像 */}
          <div className="flex justify-center">
            <Image
              src="/images/profile.png"
              alt="清水優太のプロフィール写真"
              width={400}
              height={400}
              className="rounded-full shadow-lg w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover"
            />
          </div>

          {/* 右側：テキスト */}
          <div className="space-y-6 text-left">
            <p className="text-gray-800 leading-relaxed text-base md:text-lg">
              SaaS 立ち上げ・大規模システム開発から、公式 LINE 導入・HP/LP
              制作まで。 業界を問わず、開発にとどまらない幅広い支援を経験。
            </p>
            <p className="text-gray-800 leading-relaxed text-base md:text-lg">
              根底にあるのは「事業を作る力」。技術と事業視点で、あなたのビジネスを共に成長させます。
            </p>
            <div className="pt-2">
              <Button
                asChild
                className="bg-sky-600 hover:bg-sky-700 text-white"
              >
                <Link href="/service">サービスを見る</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* お悩みセクション */}
      <section
        id="pain"
        className="w-full bg-muted py-16 md:py-24"
        aria-labelledby="pain-heading"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-2">
              Problem
            </p>
            <h2
              id="pain-heading"
              className="text-2xl md:text-3xl lg:text-4xl font-bold"
            >
              中小企業・個人事業主の悩みから生まれました
            </h2>
          </div>

          <div className="space-y-16 md:space-y-24 mb-16">
            {[
              {
                num: "01",
                title: "AI・DX活用",
                img: "/images/hero/pc/pc_tech.png",
                alt: "AI・DX活用イメージ",
                items: [
                  "ChatGPTを触ったことはあるが、自社業務への活かし方がわからない",
                  "自動化したい作業はあるが、どのツールを選べばいいか判断できない",
                ],
                reverse: false,
              },
              {
                num: "02",
                title: "Webマーケティング",
                img: "/images/hero/pc/pc_business.png",
                alt: "Webマーケティングイメージ",
                items: [
                  "広告費をかけているのに問い合わせが来ない・費用対効果が見えない",
                  "SNSを更新しているが集客につながっている実感がない",
                ],
                reverse: true,
              },
              {
                num: "03",
                title: "Web・システム開発",
                img: "/images/hero/pc/pc_president.png",
                alt: "Web・システム開発イメージ",
                items: [
                  "制作会社に見積を取ったら数百万円と言われて断念した",
                  "作ったWebサイトが古くなっているが更新できていない",
                  "エンジニアに依頼しても話が噛み合わず、思った通りに仕上がらない",
                ],
                reverse: false,
              },
            ].map((item) => (
              <div
                key={item.num}
                className={`flex flex-col ${item.reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-16`}
              >
                <div className="w-full md:w-1/2">
                  <Image
                    src={item.img}
                    alt={item.alt}
                    width={600}
                    height={400}
                    className="rounded-xl w-full object-cover"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <p className="text-7xl font-bold text-primary/20 leading-none mb-3">
                    {item.num}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold mb-4">
                    {item.title}
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    {item.items.map((text) => (
                      <li key={text} className="flex items-start gap-2">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"
                          aria-hidden="true"
                        />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-lg md:text-xl font-bold text-gray-900">
            そんな課題を解決するため、伴走型で支援します。
          </p>
        </div>
      </section>

      {/* Services Section（ホーム導線） */}
      <section
        id="services"
        className="w-full bg-background py-16 md:py-24"
        aria-labelledby="services-heading"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-2">
              Services
            </p>
            <h2
              id="services-heading"
              className="text-3xl md:text-4xl font-bold"
            >
              サービス
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* AI・DX活用支援 */}
            <Card className="p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
              <div className="flex justify-center mb-4">
                <Brain className="w-10 h-10 text-sky-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-center mb-4 text-gray-900">
                AI・DX活用支援
              </h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                毎日の繰り返し作業をAIで自動化。書類作成・データ集計・返信対応を仕組み化し、社員がコア業務に集中できる環境をつくります。
              </p>
            </Card>

            {/* Webマーケティング */}
            <Card className="p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
              <div className="flex justify-center mb-4">
                <BarChart3
                  className="w-10 h-10 text-sky-600"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-lg font-bold text-center mb-4 text-gray-900">
                Webマーケティング
              </h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                数値を見ながら改善し続ける、ROIが見えるマーケ支援。集客からリピートまで一貫して支援します。
              </p>
            </Card>

            {/* ホームページ制作・アプリ開発 */}
            <Card className="p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
              <div className="flex justify-center mb-4">
                <Code className="w-10 h-10 text-sky-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-center mb-4 text-gray-900">
                ホームページ制作・アプリ開発
              </h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                要件を整理し、適正コストでスピーディに開発。事業視点で一緒に設計・開発するパートナーとして伴走します。
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button
              asChild
              className="bg-sky-600 hover:bg-sky-700 text-white px-8"
            >
              <Link href="/service">詳しく見る</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Works Section */}
      <section
        id="works"
        className="w-full bg-muted py-16 md:py-24"
        aria-labelledby="works-heading"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-2">
              Works
            </p>
            <h2 id="works-heading" className="text-3xl md:text-4xl font-bold">
              支援実績
            </h2>
          </div>

          {/* スライダー */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {visibleWorks.map((work) => (
                <Card
                  key={work.title}
                  className="overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* プレースホルダー画像 */}
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">画像準備中</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{work.industry}</Badge>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {work.title}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      {work.description}
                    </p>
                    <p className="text-sm font-bold text-sky-600">
                      {work.result}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {/* 前後ボタン */}
            <div className="flex justify-center items-center gap-4">
              <button
                type="button"
                onClick={() => setCurrentWork((prev) => Math.max(prev - 1, 0))}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-40"
                aria-label="前の実績"
                disabled={currentWork === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-500">
                {currentWork + 1} / {totalWorksPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setCurrentWork((prev) =>
                    Math.min(prev + 1, totalWorksPages - 1),
                  )
                }
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-40"
                aria-label="次の実績"
                disabled={currentWork === totalWorksPages - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button
              asChild
              className="bg-sky-600 hover:bg-sky-700 text-white px-8"
            >
              <Link href="/contact">お問い合わせはこちら</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Knowledge Section（プレースホルダー） */}
      <section
        id="knowledge"
        className="w-full bg-background py-16 md:py-24 text-center"
        aria-labelledby="knowledge-heading"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-2">
              Knowledge
            </p>
            <h2
              id="knowledge-heading"
              className="text-3xl md:text-4xl font-bold"
            >
              ナレッジ
            </h2>
          </div>
          <p className="text-gray-500 mb-6">準備中です。</p>
          <Button asChild variant="outline">
            <Link href="/knowledge">記事一覧を見る</Link>
          </Button>
        </div>
      </section>

      {/* Contact Section（プレースホルダー） */}
      <section
        id="contact"
        className="w-full bg-muted py-16 md:py-24 text-center"
        aria-labelledby="contact-heading"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-2">
              Contact
            </p>
            <h2 id="contact-heading" className="text-3xl md:text-4xl font-bold">
              お問い合わせ
            </h2>
          </div>
          <p className="text-gray-700 mb-8 text-lg md:text-xl">
            お気軽にご相談ください。
          </p>
          <Button
            asChild
            size="lg"
            className="bg-sky-600 hover:bg-sky-700 text-white px-8"
          >
            <Link href="/contact">お問い合わせはこちら</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
