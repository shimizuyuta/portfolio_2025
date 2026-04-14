"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRight, BookOpen, Mail } from "lucide-react";
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

const charContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const charItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
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
const btnPrimary =
  "bg-gray-900 hover:bg-gray-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 py-4 px-8 rounded-[100px] h-auto";

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

// ─── Hero background images ───────────────────────────────────────────────────
const pcHeroImages = [
  "/images/hero/pc/pc_tech.png",
  "/images/hero/pc/pc_business.png",
  "/images/hero/pc/pc_president.png",
];
const spHeroImages = [
  "/images/hero/sp/sp_tech.png",
  "/images/hero/sp/sp_business.png",
  "/images/hero/sp/sp_president.png",
];

// ─── Data ─────────────────────────────────────────────────────────────────────
const works = [
  {
    industry: "医療",
    title: "新規事業の立ち上げ支援",
    description:
      "歯科医院が新たに展開するリップアート事業において、補助金の申請支援からターゲット調査、LP企画・制作、公式LINEの構築・運用、インフルエンサーへの依頼までをワンストップで対応しました。",
    result: "初月で30名の来院獲得につながる",
    thumbnail: "/images/works/shikai.png",
  },
  {
    industry: "福祉",
    title: "AIを活用し記録業務の効率化",
    description:
      "相談員が面談内容を手書きでメモし、行政提出用フォーマットへ転記するという工程に多大な時間がかかっていました。これに対し、面談の録音データから提出用Excelが自動生成されるフローを構築。個人情報の取り扱いに配慮したセキュリティ設計も施しました。",
    result: "1人あたり約6時間の作業が約10分で完結",
    thumbnail: "/images/works/shougai.png",
  },
  {
    industry: "スポーツ・教育",
    title: "ホームページの運用改善と自走化支援",
    description:
      "メンテナンスが行き届かず有効活用できていないホームページに対し、CMSのカスタマイズによる大会情報の更新簡易化、申し込み導線の見直し・修正、セキュリティ強化などWeb運営全般を改善しました。",
    result: "1人で運用・更新できる基盤を実現",
    thumbnail: "/images/works/tennis.png",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function HomeClient({ articles }: { articles: Article[] }) {
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % pcHeroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isAboutModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAboutModalOpen]);

  return (
    <main>
      {/* ════════════════════════════════════════════════════════
          Hero
      ════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        aria-label="ヒーローセクション"
        className="w-full overflow-hidden"
      >
        {/* ── PC ─────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center relative bg-gradient-to-br from-sky-400/70 to-indigo-500/70 overflow-hidden min-h-[70svh]">
          {/* 背景スライド画像 */}
          <AnimatePresence mode="sync">
            <motion.div
              key={heroImageIndex}
              className="absolute inset-0"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            >
              <Image
                src={pcHeroImages[heroImageIndex]}
                alt=""
                fill
                className="object-cover opacity-30"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* 半透明ダークオーバーレイ */}
          <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

          {/* 装飾ウォーターマーク */}
          <p
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[280px] font-black text-white/5 select-none pointer-events-none leading-none tracking-tighter whitespace-nowrap"
            aria-hidden="true"
          >
            AI DX
          </p>

          <div className="relative w-full max-w-4xl pl-20 lg:pl-24 pr-12 lg:pr-20 py-16 pb-24">
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <p className="text-xl lg:text-2xl font-semibold text-white/80 mb-5 leading-relaxed">
                AI・ITを活用したい。
              </p>
              <h1
                id="hero-heading"
                className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-8 text-white whitespace-nowrap"
              >
                「でも、誰に頼めばいい？」
              </h1>
              <p className="text-base lg:text-xl leading-relaxed text-white/80 max-w-xl">
                ホームページ制作・業務効率化・システム開発など<br></br>
                あなたのビジネスを一緒に作り上げる
                <span className="font-semibold text-white">ITパートナー</span>
              </p>
            </motion.div>
          </div>

          {/* 波形 SVG ディバイダー（アニメーション） */}
          <div className="absolute bottom-0 left-0 w-full h-16 md:h-20 overflow-hidden">
            <motion.svg
              viewBox="0 0 2880 80"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-0 left-0 h-full"
              style={{ width: "200%" }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              aria-hidden="true"
            >
              <path
                fill="white"
                d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 C1680,80 1920,0 2160,40 C2400,80 2640,0 2880,40 L2880,80 L0,80 Z"
              />
            </motion.svg>
          </div>
        </div>

        {/* ── SP ─────────────────────────────────────────────── */}
        <div className="md:hidden flex items-center relative bg-gradient-to-br from-sky-400/70 to-indigo-500/70 min-h-[70svh] px-6 overflow-hidden">
          {/* 背景スライド画像 */}
          <AnimatePresence mode="sync">
            <motion.div
              key={heroImageIndex}
              className="absolute inset-0"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            >
              <Image
                src={spHeroImages[heroImageIndex]}
                alt=""
                fill
                className="object-cover opacity-30"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* 半透明ダークオーバーレイ */}
          <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

          {/* 装飾ウォーターマーク */}
          <p
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[120px] font-black text-white/5 select-none pointer-events-none leading-none tracking-tighter whitespace-nowrap"
            aria-hidden="true"
          >
            AI DX
          </p>

          {/* コンテンツ */}
          <motion.div
            className="relative w-full pb-16 pt-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <p className="text-lg font-semibold text-white/80 mb-4 leading-relaxed">
              AI・ITを活用したい。
            </p>
            <h1 className="text-[7.5vw] font-bold text-white leading-[1.15] mb-6 whitespace-nowrap">
              でも、誰に頼めばいい？
            </h1>
            <p className="text-base leading-relaxed text-white/75">
              ホームページ制作・DX・AI活用支援・システム開発など
              経営の課題解決をサポートする
              <span className="font-semibold text-white">ITパートナー</span>
            </p>
          </motion.div>

          {/* 波形 SVG ディバイダー（アニメーション） */}
          <div className="absolute bottom-0 left-0 w-full h-12 overflow-hidden">
            <motion.svg
              viewBox="0 0 780 60"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-0 left-0 h-full"
              style={{ width: "200%" }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              aria-hidden="true"
            >
              <path
                fill="white"
                d="M0,30 C100,60 200,0 390,30 C490,60 580,0 780,30 L780,60 L0,60 Z"
              />
            </motion.svg>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
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
          <SectionLabel label="About Me" />
          <h2
            id="about-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            私について
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
              大学を卒業後、新規事業支援のコンサル会社にてエンジニアとして、クラウドファンディングシステムや行政向けサービス、新規SaaSの立ち上げなど多様なプロジェクトを経験。
              <br></br>
              現在はフリーランスとして、プライム上場企業や大手メディア企業のシステム開発に携わる傍ら、地元の千葉を中心に中小企業向けにAI活用・システム開発・HP制作／保守運用をワンストップで提供しています。
            </p>
            <div className="relative">
              {/* マーカー（全文字出現後にフェードイン） */}
              <motion.span
                className="absolute -inset-x-1 inset-y-[0.15em] rounded-sm bg-sky-400/15"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: 3.13, duration: 0.6, ease: "easeOut" }}
                aria-hidden="true"
              />
              {/* 文字アニメーション */}
              <motion.p
                className="relative font-[family-name:var(--font-zen-kaku)] text-gray-800 leading-[2] text-[1.3rem] font-bold"
                variants={charContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                aria-label="「作って終わり」ではなく、お客様のビジネスを長期的に伸ばすことを第一に、お客様が迷うすべての局面で、隣に立てるパートナーであり続けます。"
              >
                {"「作って終わり」ではなく、お客様のビジネスを長期的に伸ばすことを第一に、お客様が迷うすべての局面で、隣に立てるパートナーであり続けます。"
                  .split("")
                  .map((char, i) => (
                    <motion.span
                      // biome-ignore lint/suspicious/noArrayIndexKey: 固定テキストのため index を key に使用
                      key={i}
                      variants={charItem}
                      aria-hidden="true"
                    >
                      {char}
                    </motion.span>
                  ))}
              </motion.p>
            </div>
            <div className="pt-2">
              <Button
                className={`${btnPrimary} text-base`}
                onClick={() => setIsAboutModalOpen(true)}
              >
                <span className="flex items-center gap-2">
                  続きを読む
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </span>
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
                title: "ホームページ制作・システム開発",
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
          {/* 一旦見せない */}
          {/* <div className="text-center">
            <Button asChild className={`${btnPrimary} text-base`}>
              <Link href="/service" className="flex items-center gap-2">
                詳しく見る
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
          </div> */}
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

          {/* Marquee */}
          <div
            className="relative overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div
              className="flex gap-6 w-max"
              style={{ animation: "marquee 50s linear infinite" }}
            >
              {[
                ...works.map((w) => ({ ...w, _key: `a-${w.title}` })),
                ...works.map((w) => ({ ...w, _key: `b-${w.title}` })),
              ].map((work) => (
                <div key={work._key} className="w-[390px] shrink-0">
                  <Card className="overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-xl hover:border-gray-300 transition-all duration-300 h-full">
                    <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
                      {work.thumbnail ? (
                        <Image
                          src={work.thumbnail}
                          alt={work.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-sm">
                            画像準備中
                          </span>
                        </div>
                      )}
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
                </div>
              ))}
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
            <SectionLabel label="Blog" />
            <h2
              id="knowledge-heading"
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              ブログ
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
              {articles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-24 text-gray-400">
                  <p>記事を準備中です。</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {articles.map((article) => (
                    <li key={article.id}>
                      <Link
                        href={`/knowledge/${article.slug}`}
                        className="flex items-start gap-4 py-5 px-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex-shrink-0 w-28 h-20 md:w-36 md:h-24 rounded-xl bg-gray-100 overflow-hidden relative flex items-center justify-center">
                          {article.thumbnail_url ? (
                            <Image
                              src={article.thumbnail_url}
                              alt={article.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <BookOpen
                              className="w-8 h-8 text-gray-300"
                              aria-hidden="true"
                            />
                          )}
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

      {/* ═══════════════════════════════════════════════════════
          私についてモーダル
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isAboutModalOpen && (
          <>
            {/* オーバーレイ */}
            <motion.div
              key="about-overlay"
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsAboutModalOpen(false)}
              aria-hidden="true"
            />

            {/* モーダル本体 */}
            <motion.div
              key="about-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="about-modal-title"
              className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto pointer-events-auto">
                {/* 閉じるボタン */}
                <button
                  type="button"
                  onClick={() => setIsAboutModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="閉じる"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* コンテンツ */}
                <div className="px-8 pt-10 pb-10">
                  <p
                    id="about-modal-title"
                    className="text-xs font-bold tracking-[0.25em] text-sky-600 uppercase mb-2"
                  >
                    About Me
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">
                    私について
                  </h3>

                  <div className="space-y-6">
                    <p className="text-gray-700 leading-[1.9] text-base">
                      「人の役に立ちたい」という原点から福祉系大学に進学し、社会福祉士を取得。また、学生時代に独学でプログラミングを始め、「技術の力ならもっと多くの人の役に立てる」と確信し、ITの世界へ。在学中から複数のスタートアップでエンジニアインターンを経験。趣味では、プログラミング技術をビジネスに活かすアイデアや実装力を競う大会（ハッカソン・アイデアソン）にも積極的に参加してきました。（
                      <a
                        href="https://tornado-official.jp/student/1040/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 underline underline-offset-2 hover:text-sky-800 transition-colors"
                      >
                        インタビュー記事
                      </a>
                      ）
                    </p>
                    <p className="text-gray-700 leading-[1.9] text-base">
                      新卒では新規事業の伴走支援を行うコンサル企業に入社。約3年間にわたり、クラウドファンディングシステムや行政向けサービス、新規SaaSの立ち上げなど、自社サービス・受託開発の双方で幅広いプロジェクトに従事しました。要件定義から設計・開発・保守運用まで、すべての工程を一気通貫で経験してきました。
                    </p>
                    <p className="text-gray-700 leading-[1.9] text-base">
                      現在はフリーランスエンジニアとして、プライム上場企業や大手メディア企業のシステム開発に携わりながら、中小企業のお客様に向けてAI活用支援、システム開発、HP制作・保守運用、Webマーケティング支援まで幅広く対応しています。
                    </p>
                    <p className="text-gray-700 leading-[1.9] text-base">
                      大切にしているのは、「お客様のビジネスを伸ばすこと」を最優先に考えること。目先の納品だけでなく、事業の成長にずっと寄り添える"伴走パートナー"であり続けます。まずはお気軽にご相談ください。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
