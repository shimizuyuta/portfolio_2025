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

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Design tokens ────────────────────────────────────────────────────────────
// ソリッドボタン: シンプルで力強い黒
const btnPrimary =
  "bg-gray-900 hover:bg-gray-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 py-4 px-8 rounded-[100px] h-auto";

// セクションラベル（白背景用 / 暗背景用）
function SectionLabel({
  label,
  dark = false,
}: {
  label: string;
  dark?: boolean;
}) {
  const lineColor = dark ? "bg-sky-400/40" : "bg-sky-500/40";
  const textColor = dark ? "text-sky-400" : "text-sky-600";
  return (
    <div className="flex items-center justify-center gap-3 mb-3">
      <span className={`w-10 h-px ${lineColor}`} aria-hidden="true" />
      <p
        className={`text-xs font-bold tracking-[0.25em] ${textColor} uppercase`}
      >
        {label}
      </p>
      <span className={`w-10 h-px ${lineColor}`} aria-hidden="true" />
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
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

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentWork, setCurrentWork] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [knowledgeArticles, setKnowledgeArticles] = useState<Article[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("/api/knowledge")
      .then((res) => res.json())
      .then((data: Article[]) => setKnowledgeArticles(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const worksPerPage = isMobile ? 1 : 3;
  const totalWorksPages = Math.ceil(works.length / worksPerPage);
  const visibleWorks = works.slice(
    currentWork * worksPerPage,
    currentWork * worksPerPage + worksPerPage,
  );

  return (
    <main>
      {/* ════════════════════════���══════════════════════════════
          Hero
      ═══════════════════════════════════════════════════════ */}
      <section
        id="hero"
        aria-label="ヒーローセクション"
        className="w-full overflow-hidden bg-white"
      >
        {/* PC: 2-column */}
        <div className="hidden md:flex items-stretch min-h-[620px] lg:min-h-[700px]">
          {/* Left: text */}
          <motion.div
            className="flex-[9] flex flex-col justify-center pl-12 lg:pl-20 pr-8 py-16"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-7">
              <span className="w-6 h-px bg-sky-500" aria-hidden="true" />
              <p className="text-sm font-bold tracking-[0.2em] text-sky-600 uppercase">
                IT Partner
              </p>
            </div>
            {/* Sub-headline */}
            <p className="text-xl lg:text-2xl font-semibold text-gray-500 mb-4 leading-relaxed">
              AI・ITを活用したい。
            </p>
            {/* Main headline */}
            <h1
              id="hero-heading"
              className="text-5xl lg:text-6xl font-bold leading-[1.15] mb-8 text-gray-900 whitespace-nowrap"
            >
              でも、誰に頼めばいい？
            </h1>
            <p className="text-base lg:text-lg leading-relaxed mb-10 text-gray-500 max-w-md">
              集客・採用・業務効率化・システム開発まで、
              <br />
              あなたのビジネスを一緒に作り上げる
              <span className="font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                ITパートナー
              </span>
              。
            </p>
            <Button asChild className={`${btnPrimary} w-fit text-base`}>
              <Link href="/contact" className="flex items-center gap-2">
                お問い合わせはこちら
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>

          {/* Right: slideshow */}
          <div className="w-[55%] shrink-0 relative self-stretch overflow-hidden rounded-tl-[4rem]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={currentSlide}
                className="absolute inset-0"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              >
                <Image
                  src={heroSlides[currentSlide].pcSrc}
                  alt={heroSlides[currentSlide].alt}
                  fill
                  className="object-cover"
                  sizes="60vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* SP: stacked */}
        <div className="md:hidden">
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.alt}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={index !== currentSlide}
              >
                <Image
                  src={slide.pcSrc}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          <div className="px-6 pt-10 pb-12">
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-5 h-px bg-sky-500" aria-hidden="true" />
                <p className="text-xs font-bold tracking-[0.2em] text-sky-600 uppercase">
                  IT Partner
                </p>
              </div>
              <p className="text-base font-semibold text-gray-500 mb-3">
                AI・ITを活用したい。
              </p>
              <h1 className="text-3xl font-bold leading-tight mb-5 text-gray-900 whitespace-nowrap">
                でも、誰に頼めばいい？
              </h1>
              <p className="text-base leading-relaxed mb-8 text-gray-500">
                集客・採用・業務効率化・システム開発まで、
                <br />
                あなたのビジネスを一緒に作り上げる
                <span className="font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                  ITパートナー
                </span>
                。
              </p>
              <Button
                asChild
                className="bg-gray-900 hover:bg-gray-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm py-3 px-6 rounded-[100px] h-auto w-fit mx-auto block"
              >
                <Link
                  href="/contact"
                  className="flex items-center gap-2 justify-center"
                >
                  お問い合わせはこちら
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════��═══════
          選ばれる理由（白）
      ═══════════════════════════════════════════════════════ */}
      <motion.section
        id="about"
        className="bg-white max-w-7xl mx-auto py-20 md:py-32 px-6"
        aria-labelledby="about-heading"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
      >
        <div className="text-center mb-16 md:mb-20">
          <SectionLabel label="Why Choose" />
          <h2
            id="about-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            選ばれる理由
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* 左: 写真 */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div
                className="absolute top-4 left-4 w-full h-full rounded-full bg-gradient-to-br from-sky-100 to-indigo-100"
                aria-hidden="true"
              />
              <Image
                src="/images/profile.png"
                alt="清水優太のプロフィール写真"
                fill
                className="rounded-full object-cover border-4 border-white relative shadow-lg"
              />
            </div>
          </div>

          {/* 右: テキスト */}
          <div className="space-y-6 text-left">
            <p className="text-gray-700 leading-[1.9] text-base md:text-lg">
              「人を支えたい」という思いから、福祉系大学へ進学し社会福祉士を取得。しかし、学生時代から独学でプログラムを書き始め、「技術でもっと多くの人を支えられる」と気づいたことがITの世界に飛び込むきっかけになりました。
            </p>
            <p className="text-gray-700 leading-[1.9] text-base md:text-lg">
              複数のスタートアップでエンジニアインターンを経験し、ハッカソン・アイデアソンにも積極的に参加。数々の表彰を受けました。新卒では新規事業の伴走支援を行う某コンサル企業に入社し、不動産クラウドファンディングや行政向けサービス、受託開発など幅広いプロジェクトに携わりました。
            </p>
            <p className="text-gray-700 leading-[1.9] text-base md:text-lg">
              現在はフリーランスエンジニアとして、プライム上場企業や大手メディア企業のシステム開発に関わりながら、中小企業向けにAI活用・Web制作・マーケティング支援など、ビジネス全体を一緒に考えるパートナーとして伴走しています。
            </p>
            <div className="pt-2">
              <Button asChild className={`${btnPrimary} text-base`}>
                <Link href="/service" className="flex items-center gap-2">
                  サービスを見る
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          お悩み（薄グレー）
      ═══════════════════════════════════════════════════════ */}
      <motion.section
        id="pain"
        className="relative w-full bg-slate-50 py-20 md:py-32 overflow-hidden"
        aria-labelledby="pain-heading"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-24">
            <SectionLabel label="Problem" />
            <h2
              id="pain-heading"
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              こんなお悩み解決します
            </h2>
          </div>

          <motion.div
            className="space-y-20 md:space-y-28 mb-20"
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
                    className="rounded-2xl w-full object-cover shadow-2xl shadow-black/40"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <p
                    className="text-7xl md:text-8xl font-bold text-sky-500/15 leading-none mb-3 select-none"
                    aria-hidden="true"
                  >
                    {item.num}
                  </p>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-5 text-gray-900">
                      {item.title}
                    </h3>
                    <ul className="space-y-4 text-base text-gray-600">
                      {item.items.map((text) => (
                        <li key={text} className="flex items-start gap-3">
                          <span
                            className="mt-[0.6em] w-4 h-px bg-sky-500 flex-shrink-0 inline-block"
                            aria-hidden="true"
                          />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <p className="text-center text-lg md:text-xl font-bold text-gray-900">
            そんな課題を解決するため、伴走型で支援します。
          </p>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          Services（白）
      ═══════════════════════════════════════════════════════ */}
      <motion.section
        id="services"
        className="w-full bg-white py-20 md:py-32"
        aria-labelledby="services-heading"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-14 md:mb-20">
            <SectionLabel label="Services" />
            <h2
              id="services-heading"
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              サービス
            </h2>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-80px" }}
          >
            {[
              {
                src: "/images/services/ai.png",
                alt: "AI・DX活用支援",
                title: "AI・DX活用支援",
                body: "毎日の繰り返し作業をAIで自動化。書類作成・データ集計・返信対応を仕組み化し、社員がコア業務に集中できる環境をつくります。",
                priority: false,
              },
              {
                src: "/images/services/マーケ.png",
                alt: "Webマーケティング",
                title: "Webマーケティング",
                body: "数値を見ながら改善し続ける、ROIが見えるマーケ支援。集客からリピートまで一貫して支援します。",
                priority: true,
              },
              {
                src: "/images/services/開発.png",
                alt: "ホームページ制作・アプリ開発",
                title: "ホームページ制作・アプリ開発",
                body: "要件を整理し、適正コストでスピーディに開発。事業視点で一緒に設計・開発するパートナーとして伴走します。",
                priority: false,
              },
            ].map((s) => (
              <motion.div
                key={s.title}
                variants={staggerItem}
                whileHover={{ scale: 1.02, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="pt-0 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 h-full">
                  <div className="w-full h-48 relative">
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      priority={s.priority}
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <h3 className="text-lg font-bold text-center mb-4 text-gray-900">
                      {s.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <Button asChild className={`${btnPrimary} text-base`}>
              <Link href="/service" className="flex items-center gap-2">
                詳しく見る
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          Works（薄グレー）
      ═══════════════════════════════════════════════════════ */}
      <motion.section
        id="works"
        className="relative w-full bg-slate-50 py-20 md:py-32 overflow-hidden"
        aria-labelledby="works-heading"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-14 md:mb-20">
            <SectionLabel label="Works" />
            <h2
              id="works-heading"
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              支援実績
            </h2>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {visibleWorks.map((work) => (
                <motion.div
                  key={work.title}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-xl hover:border-gray-300 transition-all duration-300">
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">画像準備中</span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-sky-50 text-sky-700 hover:bg-sky-50 border border-sky-200 text-xs">
                          {work.industry}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {work.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {work.description}
                      </p>
                      <p className="text-sm font-bold text-sky-600">
                        ✦ {work.result}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* pagination */}
            <div className="flex justify-center items-center gap-4">
              <button
                type="button"
                onClick={() => setCurrentWork((prev) => Math.max(prev - 1, 0))}
                className="p-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 disabled:opacity-30"
                aria-label="前の実績"
                disabled={currentWork === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-400 tabular-nums">
                {currentWork + 1} / {totalWorksPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setCurrentWork((prev) =>
                    Math.min(prev + 1, totalWorksPages - 1),
                  )
                }
                className="p-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 disabled:opacity-30"
                aria-label="次の実績"
                disabled={currentWork === totalWorksPages - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          Knowledge（白）
      ═══════════════════════════════════════════════════════ */}
      <motion.section
        id="knowledge"
        className="w-full bg-white py-20 md:py-32"
        aria-labelledby="knowledge-heading"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-14 md:mb-20">
            <SectionLabel label="Knowledge" />
            <h2
              id="knowledge-heading"
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              ナレッジ
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Left: image (PC only) */}
            <motion.div
              className="hidden md:block md:w-2/5"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: false, margin: "-80px" }}
            >
              <div
                className="relative w-full h-[400px] overflow-hidden"
                style={{
                  clipPath: "polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)",
                }}
              >
                <Image
                  src="/images/hero/pc/pc_tech.png"
                  alt="ナレッジイメージ"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Right: article list */}
            <div className="w-full md:w-3/5">
              {knowledgeArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-24 text-gray-400">
                  <p>記事を準備中です。</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {knowledgeArticles.map((article) => (
                    <li key={article.id}>
                      <Link
                        href={`/knowledge/${article.slug}`}
                        className="flex items-start gap-4 py-5 px-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex-shrink-0 w-28 h-20 md:w-36 md:h-24 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                          <BookOpen
                            className="w-8 h-8 text-gray-300"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className="text-xs border-sky-200 text-sky-700 bg-sky-50"
                            >
                              {article.category}
                            </Badge>
                            {article.published_at && (
                              <time className="text-xs text-gray-400">
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
                          <p className="text-sm md:text-base font-semibold leading-snug line-clamp-2 text-gray-800">
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

          <div className="flex justify-center mt-14 md:mt-16">
            <Button asChild className={`${btnPrimary} text-base`}>
              <Link href="/knowledge" className="flex items-center gap-2">
                もっと見る
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          Contact（薄グレー）
      ═══════════════════════════════════════════════════════ */}
      <motion.section
        id="contact"
        className="relative w-full bg-slate-50 py-20 md:py-32 text-center overflow-hidden"
        aria-labelledby="contact-heading"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
      >
        <div className="relative max-w-2xl mx-auto px-4 md:px-6">
          <SectionLabel label="Contact" />
          <h2
            id="contact-heading"
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            お問い合わせ
          </h2>
          <p className="text-gray-600 mb-10 text-base md:text-lg leading-relaxed">
            AI活用・Web制作・マーケティングまで、
            <br className="hidden md:block" />
            まずはお気軽にご相談ください。
          </p>
          <Button asChild className={`${btnPrimary} text-base`}>
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
