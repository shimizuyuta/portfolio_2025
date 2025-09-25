// src/app/page.tsx
import Image from "next/image";
import {
  Brain,
  BarChart3,
  MessageSquare,
  Code,
  Mail,
  MapPin,
  Facebook,
  MessageCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <main className="">
      {/* Hero Section */}
      {/* Hero Section - 改善版 */}
{/* Hero Section - SP横並び対応版 */}
<section id="hero" className="relative w-full min-h-screen bg-white text-gray-900 overflow-hidden">
  <div className="max-w-7xl mx-auto min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-12">
    
    {/* 全デバイスで横並び */}
    <div className="w-full flex items-center justify-between gap-4 md:gap-8 lg:gap-12">
      
      {/* 左側: テキストエリア */}
      <div className="flex-1 text-left relative z-10">
        <p className="text-sky-600 text-xs sm:text-sm md:text-base mb-2 md:mb-3 font-medium">
          Welcome to my portfolio!
        </p>
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-6 leading-tight">
          Hi, I'm <br />
          <span className="text-sky-600">Yuta Shimizu</span>
        </h1>
        <div className="space-y-1 sm:space-y-2 md:space-y-3 mb-4 md:mb-8 text-xs sm:text-sm md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
          <p className="font-medium">フリーランスエンジニア & 社会福祉士</p>
          <p className="hidden sm:block">AI・DXサポート、Web開発、マーケティング支援を通じて</p>
          <p className="hidden sm:block">中小企業や個人事業主をサポートしています。</p>
          <p className="sm:hidden">AI・DX・Web開発・マーケティング支援で中小企業をサポート</p>
        </div>
      </div>
    </div>
  </div>
  
  {/* 背景装飾要素 */}
  <div className="absolute top-20 right-10 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-sky-100 rounded-full opacity-30 blur-2xl md:blur-3xl"></div>
  <div className="absolute bottom-20 left-10 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-cyan-100 rounded-full opacity-40 blur-xl md:blur-2xl"></div>
</section>
      {/* About Section */}

      <section id="about" className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-16">About Me</h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左側：画像 */}
          <div className="flex justify-center lg:justify-center">
            <Image
              src="/images/profile.png"
              alt="Profile"
              width={350}
              height={350}
              className="rounded-full shadow-lg"
            />
          </div>

          {/* 右側：テキスト */}
          <div className="space-y-8 text-left">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-sky-600 flex items-center">
                <span className="mr-2">🌟</span>Background
              </h3>
              <p className="text-gray-700 leading-relaxed">
                学生時代に福祉とプログラミングに出会い、「人の課題を解決する」という共通点に魅力を感じて独学でスキルを習得。
                <strong className="text-sky-600">社会福祉士の資格も取得</strong>
                し、人に寄り添う視点を身につけました。
                スタートアップでの長期インターンを通じて「事業を作る」面白さを知り、新卒では新規事業の伴走支援を専門とする株式会社Relicに入社。
                不動産クラウドファンディング事業や新規SaaSの立ち上げに企画から実装まで幅広く関わり、フルスタックエンジニアとして成長しました。
                その後、大手福祉系企業でフリーランスエンジニアとして請求基盤の開発を支援し、学生時代に抱いた「福祉×IT」の想いを実現できました。
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-sky-600 flex items-center">
                <span className="mr-2">💡</span>Current Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                現在はフリーランスとして独立し、AIやWebを活用したサービス開発に加え、Webマーケティングの支援にも力を入れています。
                LINE公式アカウントやLステップの構築・運用など、これまでの技術とマーケティングの経験を活かして中小企業や個人事業主の成長をサポート。
                「人に寄り添う」という福祉で学んだ視点を大切にしながら、お客様の課題解決と事業成長を一緒に作り上げていくことが私のミッションです。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="w-full bg-cyan-50 py-12 md:py-16 xl:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8">
          <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold text-center mb-8 md:mb-12 xl:mb-16">
            Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* AI・DX活用支援 - 画像付き */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <div className="w-full h-48 md:h-56 bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-12 h-12 md:w-16 md:h-16 text-cyan-600 mx-auto mb-2" />
                    <span className="text-sm text-cyan-700 font-medium">
                      AI・DX活用支援
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 md:w-6 md:h-6 text-cyan-600 flex-shrink-0" />
                  <span className="leading-tight">AI・DX活用支援</span>
                </h3>

                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  業務効率化、自動化の仕組みづくりを支援します。
                </p>
              </div>
            </Card>

            {/* Webマーケティング - 画像付き */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <div className="w-full h-48 md:h-56 bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 md:w-16 md:h-16 text-cyan-600 mx-auto mb-2" />
                    <span className="text-sm text-cyan-700 font-medium">
                      Webマーケティング
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-cyan-600 flex-shrink-0" />
                  <span className="leading-tight">Webマーケティング</span>
                </h3>

                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  広告運用や効果測定を通じて売上向上をサポート。
                </p>
              </div>
            </Card>

            {/* LINE公式構築 - 画像付き */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <div className="w-full h-48 md:h-56 bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-cyan-600 mx-auto mb-2" />
                    <span className="text-sm text-cyan-700 font-medium">
                      LINE公式構築
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-cyan-600 flex-shrink-0" />
                  <span className="leading-tight">LINE公式構築</span>
                </h3>

                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  顧客対応や販促を効率化するLINE活用を実現。
                </p>
              </div>
            </Card>

            {/* HP・アプリ開発 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <div className="w-full h-48 md:h-56 bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <Code className="w-12 h-12 md:w-16 md:h-16 text-cyan-600 mx-auto mb-4 md:mb-6" />
                    <span className="text-sm text-cyan-700 font-medium">
                      ホームページ制作・アプリ開発
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-cyan-600 flex-shrink-0" />
                  <span className="leading-tight">
                    ホームページ制作・アプリ開発
                  </span>
                </h3>

                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Webサイトやアプリの開発・リニューアルを対応。
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="w-full px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <Card className="overflow-hidden">
            <Image
              src="/images/work1.jpg"
              alt="Work 1"
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">AIを活用した業務改善</h3>
              <p className="text-sm text-muted-foreground">
                OCRで書類処理を自動化し、工数を削減。
              </p>
            </div>
          </Card>
          <Card className="overflow-hidden">
            <Image
              src="/images/work2.jpg"
              alt="Work 2"
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">Web広告運用</h3>
              <p className="text-sm text-muted-foreground">
                小規模事業向けにCV改善を実現。
              </p>
            </div>
          </Card>
          <Card className="overflow-hidden">
            <Image
              src="/images/work3.jpg"
              alt="Work 3"
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">LINE公式構築</h3>
              <p className="text-sm text-muted-foreground">
                顧客対応を自動化し、リピート率を向上。
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      {/* FAQ Section */}
      <section id="faq" className="w-full py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            よくある質問
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-sm md:text-base">
                開発にどれくらいの期間がかかりますか？
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base">
                内容や規模によって異なりますが、簡単なサイトであれば2〜4週間程度、
                カスタムシステムやアプリ開発では1〜3ヶ月程度を目安としています。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-sm md:text-base">
                予算の目安はどのくらいですか？
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base">
                規模や機能により異なりますが、小規模案件では数十万円〜、
                大規模開発では100万円以上を目安としています。
                ご相談内容に応じて柔軟に対応可能です。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-sm md:text-base">
                小規模な案件や個人事業でもお願いできますか？
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base">
                はい、もちろんです。個人事業主の方や小規模ビジネス向けの
                サポート実績も多数ありますのでお気軽にご相談ください。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-sm md:text-base">
                技術的な知識がなくても依頼できますか？
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base">
                問題ありません。専門用語を極力使わず、わかりやすく説明しながら進めますので、
                初めての方でも安心してご依頼いただけます。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-sm md:text-base">
                LINE公式アカウントや広告運用だけの依頼も可能ですか？
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base">
                はい、部分的なご依頼にも対応しています。
                公式LINEの構築・Lステップ連携、Meta広告の運用など単独のサポートも可能です。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left text-sm md:text-base">
                保守・運用のサポートもしてもらえますか？
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base">
                ご希望に応じて、リリース後の改善や運用サポートも承っています。
                長期的なパートナーとして安心してご利用いただけます。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left text-sm md:text-base">
                AIや自動化はどんな業務で活用できますか？
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base">
                データ入力や書類処理の自動化、顧客対応のチャットボット、営業支援など、
                中小企業や個人事業で負担になりやすい業務を効率化する事例が多いです。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Contact</h2>
        <p className="text-muted-foreground mb-6">
          お仕事のご相談やお問い合わせは
          <br />
          お気軽にどうぞ！
        </p>
        <div className="flex justify-center gap-6 mb-6 text-cyan-700">
          <Mail className="w-6 h-6" />
          <Facebook className="w-6 h-6" />
          <MessageCircle className="w-6 h-6" />
        </div>
      </section>
    </main>
  );
}
