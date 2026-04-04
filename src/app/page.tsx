"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Article } from "@/lib/knowledge";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

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
  const [knowledgeArticles, setKnowledgeArticles] = useState<Article[]>([]);

  // Hero スライドショー自動切り替え（4秒ごと）
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // ナレッジ記事取得
  useEffect(() => {
    fetch("/api/knowledge")
      .then((res) => res.json())
      .then((data: Article[]) => setKnowledgeArticles(data))
      .catch(() => {});
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
      {/* Hero Section */}
      <section
        id="hero"
        aria-label="ヒーローセクション"
        className="w-full overflow-hidden bg-white"
      >
        {/* PC レイアウト（2カラム） */}
        <div className="hidden md:flex items-center min-h-[600px] lg:min-h-[680px] max-w-7xl mx-auto px-8 lg:px-16 py-16 gap-12 lg:gap-16">
          {/* 左: テキスト */}
          <motion.div
            className="flex-1"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <h1
              id="hero-heading"
              className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-gray-900"
            >
              AI・ITを活用したい。
              <br />
              でも、誰に頼めばいい？
            </h1>
            <p className="text-base lg:text-lg leading-relaxed mb-8 text-muted-foreground max-w-lg">
              集客・採用・業務効率化・システム開発まで、
              あなたのビジネスを一緒に作り上げるITパートナー。
            </p>
            <Button
              asChild
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-base py-4 rounded-[100px] h-auto"
            >
              <Link href="/contact" className="flex items-center gap-2">
                お問い合わせはこちら
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>

          {/* 右: 画像カード（横スライド） */}
          <div className="flex-1 relative pb-10">
            {/* 装飾シェイプ */}
            <div
              className="absolute -bottom-2 -right-6 w-[88%] h-[88%] bg-sky-50 rounded-3xl"
              aria-hidden="true"
            />
            {/* スライダー本体 */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={currentSlide}
                  className="absolute inset-0"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Image
                    src={heroSlides[currentSlide].pcSrc}
                    alt={heroSlides[currentSlide].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 50vw, 640px"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            {/* インジケーター */}
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-2"
              role="tablist"
              aria-label="スライドインジケーター"
            >
              {heroSlides.map((slide, index) => (
                <button
                  key={`indicator-pc-${slide.alt}`}
                  type="button"
                  role="tab"
                  aria-selected={index === currentSlide}
                  aria-label={`スライド ${index + 1}`}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-sky-600 w-6"
                      : "bg-sky-200 w-2.5 hover:bg-sky-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* SP レイアウト（縦積み） */}
        <div className="md:hidden">
          {/* 画像カード（上） */}
          <div className="relative mx-4 mt-6">
            <div
              className="absolute -bottom-4 -right-4 w-full h-full bg-sky-50 rounded-3xl"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.alt}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden={index !== currentSlide}
                >
                  <Image
                    src={slide.spSrc}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    sizes="calc(100vw - 2rem)"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
            {/* インジケーター */}
            <div
              className="absolute -bottom-9 left-1/2 -translate-x-1/2 flex gap-2"
              role="tablist"
              aria-label="スライドインジケーター"
            >
              {heroSlides.map((slide, index) => (
                <button
                  key={`indicator-sp-${slide.alt}`}
                  type="button"
                  role="tab"
                  aria-selected={index === currentSlide}
                  aria-label={`スライド ${index + 1}`}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-sky-600 w-6"
                      : "bg-sky-200 w-2.5 hover:bg-sky-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* テキスト（下） */}
          <div className="px-6 pt-14 pb-10">
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <h1 className="text-3xl font-bold leading-tight mb-4 text-gray-900">
                AI・ITを活用したい。
                <br />
                でも、誰に頼めばいい？
              </h1>
              <p className="text-base leading-relaxed mb-8 text-muted-foreground">
                集客・採用・業務効率化・システム開発まで、
                あなたのビジネスを一緒に作り上げるITパートナー。
              </p>
              <Button
                asChild
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-base py-4 rounded-[100px] h-auto"
              >
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2"
                >
                  お問い合わせはこちら
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <motion.section
        id="about"
        className="bg-background max-w-7xl mx-auto py-16 md:py-24 px-6"
        aria-labelledby="about-heading"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
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
                className="bg-sky-600 hover:bg-sky-700 text-white text-base  py-4 rounded-[100px] h-auto"
              >
                <Link href="/service" className="flex items-center gap-2">
                  サービスを見る
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* お悩みセクション */}
      <motion.section
        id="pain"
        className="w-full bg-muted py-16 md:py-24"
        aria-labelledby="pain-heading"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
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
              こんなお悩みありませんか？
            </h2>
          </div>

          <motion.div
            className="space-y-16 md:space-y-24 mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-80px" }}
          >
            {[
              {
                num: "01",
                title: "AI・DX活用",
                img: "/images/problem/01.png",
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
                img: "/images/problem/02.png",
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
                img: "/images/problem/03.png",
                alt: "Web・システム開発イメージ",
                items: [
                  "制作会社に見積を取ったら数百万円と言われて断念した",
                  "作ったWebサイトが古くなっているが更新できていない",
                  "エンジニアに依頼しても話が噛み合わず、思った通りに仕上がらない",
                ],
                reverse: false,
              },
            ].map((item) => (
              <motion.div
                key={item.num}
                className={`flex flex-col ${item.reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-16`}
                variants={staggerItem}
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
                  <p className="text-5xl md:text-6xl font-bold text-primary/20 leading-none mb-2">
                    {item.num}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {item.title}
                  </h3>
                  <ul className="space-y-3 text-sm md:text-base text-muted-foreground">
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
              </motion.div>
            ))}
          </motion.div>

          <p className="text-center text-lg md:text-xl font-bold text-gray-900">
            そんな課題を解決するため、伴走型で支援します。
          </p>
        </div>
      </motion.section>

      {/* Services Section（ホーム導線） */}
      <motion.section
        id="services"
        className="w-full bg-background py-16 md:py-24"
        aria-labelledby="services-heading"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
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

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-80px" }}
          >
            {/* AI・DX活用支援 */}
            <motion.div
              variants={staggerItem}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="pt-0 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
                <div className="w-full h-48 relative mb-0">
                  <Image
                    src="/images/services/ai.png"
                    alt="AI・DX活用支援"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-lg font-bold text-center mb-4 text-gray-900">
                    AI・DX活用支援
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    毎日の繰り返し作業をAIで自動化。書類作成・データ集計・返信対応を仕組み化し、社員がコア業務に集中できる環境をつくります。
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Webマーケティング */}
            <motion.div
              variants={staggerItem}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="pt-0 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
                <div className="w-full h-48 relative mb-0">
                  <Image
                    src="/images/services/マーケ.png"
                    alt="Webマーケティング"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-lg font-bold text-center mb-4 text-gray-900">
                    Webマーケティング
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    数値を見ながら改善し続ける、ROIが見えるマーケ支援。集客からリピートまで一貫して支援します。
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* ホームページ制作・アプリ開発 */}
            <motion.div
              variants={staggerItem}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="pt-0 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
                <div className="w-full h-48 relative mb-0">
                  <Image
                    src="/images/services/開発.png"
                    alt="ホームページ制作・アプリ開発"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-lg font-bold text-center mb-4 text-gray-900">
                    ホームページ制作・アプリ開発
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    要件を整理し、適正コストでスピーディに開発。事業視点で一緒に設計・開発するパートナーとして伴走します。
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          <div className="text-center">
            <Button
              asChild
              className="bg-sky-600 hover:bg-sky-700 text-white text-base  py-4 rounded-[100px] h-auto"
            >
              <Link href="/service" className="flex items-center gap-2">
                詳しく見る
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Works Section */}
      <motion.section
        id="works"
        className="w-full bg-muted py-16 md:py-24"
        aria-labelledby="works-heading"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
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
                <motion.div
                  key={work.title}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
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
                </motion.div>
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
              className="bg-sky-600 hover:bg-sky-700 text-white text-base  py-4 rounded-[100px] h-auto"
            >
              <Link href="/contact" className="flex items-center gap-2">
                お問い合わせはこちら
                <Mail className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Knowledge Section */}
      <motion.section
        id="knowledge"
        className="w-full bg-background py-16 md:py-24"
        aria-labelledby="knowledge-heading"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
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

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Left: Button（SP では記事の下に表示） */}
            <div className="w-full md:w-1/3 flex items-center justify-center order-last md:order-first">
              <Button
                asChild
                className="text-base py-4 rounded-[100px] h-auto px-8 bg-sky-600 hover:bg-sky-700 text-white"
              >
                <Link href="/knowledge" className="flex items-center gap-2">
                  もっと見る
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {/* Right: Article List */}
            <div className="w-full md:w-2/3 order-first md:order-last">
              {knowledgeArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-24 text-muted-foreground">
                  <p>記事を準備中です。</p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {knowledgeArticles.map((article) => (
                    <li key={article.id}>
                      <Link
                        href={`/knowledge/${article.slug}`}
                        className="flex items-start gap-4 p-6 hover:bg-muted/50 transition-colors"
                      >
                        {/* Thumbnail placeholder */}
                        <div className="flex-shrink-0 w-28 h-20 md:w-36 md:h-24 rounded-lg bg-muted overflow-hidden flex items-center justify-center">
                          <BookOpen
                            className="w-8 h-8 text-muted-foreground/40"
                            aria-hidden="true"
                          />
                        </div>
                        {/* Meta + Title */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                            {article.published_at && (
                              <time className="text-xs text-muted-foreground">
                                {new Date(
                                  article.published_at,
                                ).toLocaleDateString("ja-JP", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </time>
                            )}
                          </div>
                          <p className="text-sm md:text-base font-semibold leading-snug line-clamp-2">
                            {article.title}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section（プレースホルダー） */}
      <motion.section
        id="contact"
        className="w-full bg-muted py-16 md:py-24 text-center"
        aria-labelledby="contact-heading"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
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
            className="bg-sky-600 hover:bg-sky-700 text-white text-base  py-4 rounded-[100px] h-auto"
          >
            <Link href="/contact" className="flex items-center gap-2">
              お問い合わせはこちら
              <Mail className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </motion.section>
    </main>
  );
}
