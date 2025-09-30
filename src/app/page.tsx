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
      {/* Hero Section - アクセシビリティ改善版 */}
      {/* ヒーローセクション - アクセシビリティ改善版 */}
      <section 
        id="hero" 
        className="relative w-full min-h-screen bg-white text-gray-900 overflow-hidden"
        role="banner"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-7xl mx-auto min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-12">
          
          {/* 全デバイスで横並び */}
          <div className="w-full flex items-center justify-between gap-4 md:gap-8 lg:gap-12">
            
            {/* 左側: テキストエリア */}
            <div className="flex-1 text-left relative z-10">
              <p className="text-sky-700 text-sm sm:text-base md:text-lg mb-3 md:mb-4 font-semibold">
                ポートフォリオサイトへようこそ！
              </p>
              <h1 
                id="hero-heading"
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-8 leading-tight text-gray-900"
              >
                こんにちは、<br />
                <span className="text-sky-700">清水優太</span>です
              </h1>
              <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-6 md:mb-10 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
                <p className="font-semibold">フリーランスエンジニア & 社会福祉士</p>
                <p className="hidden sm:block text-gray-800">AI・DXサポート、ウェブ開発、マーケティング支援を通じて</p>
                <p className="hidden sm:block text-gray-800">中小企業や個人事業主をサポートしています。</p>
                <p className="sm:hidden text-gray-800">AI・DX・ウェブ開発・マーケティング支援で中小企業をサポート</p>
              </div>
            </div>
            
            {/* 右側: ヒーロー画像 */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <Image
                src="/images/hero.png"
                alt="清水優太のヒーロー画像"
                width={500}
                height={500}
                className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] object-cover rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
        
        {/* 背景装飾要素 - アクセシビリティのため非表示 */}
        <div className="absolute top-20 right-10 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-sky-100 rounded-full opacity-20 blur-2xl md:blur-3xl" aria-hidden="true"></div>
        <div className="absolute bottom-20 left-10 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-cyan-100 rounded-full opacity-20 blur-xl md:blur-2xl" aria-hidden="true"></div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        className="max-w-7xl mx-auto py-16 md:py-24 px-6"
        aria-labelledby="about-heading"
      >
        <h2 id="about-heading" className="text-3xl md:text-4xl font-bold text-center mb-16 md:mb-20 text-gray-900">
          自己紹介
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* 左側：画像 */}
          <div className="flex justify-center lg:justify-center">
            <Image
              src="/images/profile.png"
              alt="Yuta Shimizuのプロフィール写真"
              width={400}
              height={400}
              className="rounded-full shadow-lg w-80 h-80 md:w-96 md:h-96 object-cover"
            />
          </div>

          {/* 右側：テキスト */}
          <div className="space-y-10 text-left">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-6 text-sky-700 flex items-center">
                <span className="mr-3 text-2xl" aria-hidden="true">🌟</span>Background
              </h3>
              <p className="text-gray-800 leading-relaxed text-base md:text-lg">
                学生時代に福祉とプログラミングに出会い、「人の課題を解決する」という共通点に魅力を感じて独学でスキルを習得。
                <strong className="text-sky-800 font-semibold">社会福祉士の資格も取得</strong>
                し、人に寄り添う視点を身につけました。
                スタートアップでの長期インターンを通じて「事業を作る」面白さを知り、新卒では新規事業の伴走支援を専門とする株式会社Relicに入社。
                不動産クラウドファンディング事業や新規SaaSの立ち上げに企画から実装まで幅広く関わり、フルスタックエンジニアとして成長しました。
                その後、大手福祉系企業でフリーランスエンジニアとして請求基盤の開発を支援し、学生時代に抱いた「福祉×IT」の想いを実現できました。
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-6 text-sky-700 flex items-center">
                <span className="mr-3 text-2xl" aria-hidden="true">💡</span>Current Mission
              </h3>
              <p className="text-gray-800 leading-relaxed text-base md:text-lg">
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
        className="w-full bg-gray-50 py-16 md:py-24"
        aria-labelledby="services-heading"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8">
          <h2 id="services-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-20 text-gray-900">
            Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* AI・DX活用支援 */}
            <Card className="pt-0 overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
              <div className="relative">
                <div className="w-full h-56 md:h-64 bg-gradient-to-r from-sky-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-16 h-16 md:w-20 md:h-20 text-sky-700 mx-auto mb-4" aria-hidden="true" />
                    <span className="text-lg font-semibold text-sky-800">
                      AI・DX活用支援
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-3 text-gray-900">
                  <Brain className="w-6 h-6 md:w-7 md:h-7 text-sky-700 flex-shrink-0" aria-hidden="true" />
                  <span className="leading-tight">AI・DX活用支援</span>
                </h3>

                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  業務効率化、自動化の仕組みづくりを支援します。AIを活用した書類処理の自動化や、データ分析による業務改善をサポートします。
                </p>
              </div>
            </Card>

            {/* Webマーケティング */}
            <Card className="pt-0 overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
              <div className="relative">
                <div className="w-full h-56 md:h-64 bg-gradient-to-r from-sky-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 md:w-20 md:h-20 text-sky-700 mx-auto mb-4" aria-hidden="true" />
                    <span className="text-lg font-semibold text-sky-800">
                      Webマーケティング
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-3 text-gray-900">
                  <BarChart3 className="w-6 h-6 md:w-7 md:h-7 text-sky-700 flex-shrink-0" aria-hidden="true" />
                  <span className="leading-tight">Webマーケティング</span>
                </h3>

                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  広告運用や効果測定を通じて売上向上をサポート。Meta広告やGoogle広告の最適化により、ROIの向上を実現します。
                </p>
              </div>
            </Card>

            {/* LINE公式構築 */}
            <Card className="pt-0 overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
              <div className="relative">
                <div className="w-full h-56 md:h-64 bg-gradient-to-r from-sky-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 md:w-20 md:h-20 text-sky-700 mx-auto mb-4" aria-hidden="true" />
                    <span className="text-lg font-semibold text-sky-800">
                      LINE公式構築
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-3 text-gray-900">
                  <MessageSquare className="w-6 h-6 md:w-7 md:h-7 text-sky-700 flex-shrink-0" aria-hidden="true" />
                  <span className="leading-tight">LINE公式構築</span>
                </h3>

                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  顧客対応や販促を効率化するLINE活用を実現。Lステップを活用した自動化でリピート率向上をサポートします。
                </p>
              </div>
            </Card>

            {/* HP・アプリ開発 */}
            <Card className="pt-0 overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
              <div className="relative">
                <div className="w-full h-56 md:h-64 bg-gradient-to-r from-sky-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <Code className="w-16 h-16 md:w-20 md:h-20 text-sky-700 mx-auto mb-4" aria-hidden="true" />
                    <span className="text-lg font-semibold text-sky-800">
                      ホームページ制作・アプリ開発
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-3 text-gray-900">
                  <Code className="w-6 h-6 md:w-7 md:h-7 text-sky-700 flex-shrink-0" aria-hidden="true" />
                  <span className="leading-tight">ホームページ制作・アプリ開発</span>
                </h3>

                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Webサイトやアプリの開発・リニューアルを対応。モダンな技術で高品質なサービスを提供します。
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section 
        id="portfolio" 
        className="w-full px-6 py-16 md:py-24"
        aria-labelledby="portfolio-heading"
      >
        <h2 id="portfolio-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-gray-900">
          Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
            <Image
              src="/images/work1.jpg"
              alt="AIを活用した業務改善プロジェクトの画面"
              width={400}
              height={280}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-lg md:text-xl mb-3 text-gray-900">AIを活用した業務改善</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                OCRで書類処理を自動化し、工数を80%削減。月100時間の業務効率化を実現しました。
              </p>
            </div>
          </Card>
          
          <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
            <Image
              src="/images/work2.jpg"
              alt="Web広告運用の成果画面"
              width={400}
              height={280}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-lg md:text-xl mb-3 text-gray-900">Web広告運用</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                小規模事業向けにCV改善を実現。ROI 250%を達成し、売上を3倍に成長させました。
              </p>
            </div>
          </Card>
          
          <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
            <Image
              src="/images/work3.jpg"
              alt="LINE公式アカウント構築プロジェクトの画面"
              width={400}
              height={280}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-lg md:text-xl mb-3 text-gray-900">LINE公式構築</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                顧客対応を自動化し、リピート率を40%向上。顧客満足度の大幅な改善を実現しました。
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section 
        id="faq" 
        className="w-full py-16 md:py-24 bg-gray-50"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-gray-900">
            FAQ
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-white border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900 hover:text-sky-700">
                開発にどれくらいの期間がかかりますか？
              </AccordionTrigger>
              <AccordionContent className="text-base md:text-lg text-gray-700 leading-relaxed pt-2">
                内容や規模によって異なりますが、簡単なサイトであれば2〜4週間程度、
                カスタムシステムやアプリ開発では1〜3ヶ月程度を目安としています。
                詳細なスケジュールについては、ヒアリング後にご提案いたします。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900 hover:text-sky-700">
                予算の目安はどのくらいですか？
              </AccordionTrigger>
              <AccordionContent className="text-base md:text-lg text-gray-700 leading-relaxed pt-2">
                規模や機能により異なりますが、小規模案件では数万円〜、
                大規模開発では数十万円以上を目安としています。
                ご相談内容に応じて柔軟に対応可能ですので、まずはお気軽にお問い合わせください。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900 hover:text-sky-700">
                小規模な案件や個人事業でもお願いできますか？
              </AccordionTrigger>
              <AccordionContent className="text-base md:text-lg text-gray-700 leading-relaxed pt-2">
                はい、もちろんです。個人事業主の方や小規模ビジネス向けの
                サポートも可能ですのでお気軽にご相談ください。
                小さなお悩みからでも丁寧に対応いたします。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900 hover:text-sky-700">
                技術的な知識がなくても依頼できますか？
              </AccordionTrigger>
              <AccordionContent className="text-base md:text-lg text-gray-700 leading-relaxed pt-2">
                問題ありません。専門用語を極力使わず、わかりやすく説明しながら進めますので、
                初めての方でも安心してご依頼いただけます。
                丁寧なヒアリングで、ご要望を正確に把握いたします。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900 hover:text-sky-700">
                LINE公式アカウントや広告運用だけの依頼も可能ですか？
              </AccordionTrigger>
              <AccordionContent className="text-base md:text-lg text-gray-700 leading-relaxed pt-2">
                はい、部分的なご依頼にも対応しています。
                公式LINEの構築・Lステップ連携、Meta広告の運用など単独のサポートも可能です。
                必要な部分だけをピンポイントでサポートいたします。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900 hover:text-sky-700">
                保守・運用のサポートもしてもらえますか？
              </AccordionTrigger>
              <AccordionContent className="text-base md:text-lg text-gray-700 leading-relaxed pt-2">
                ご希望に応じて、リリース後の改善や運用サポートも承っています。
                長期的なパートナーとして安心してご利用いただけます。
                継続的な改善提案も積極的に行います。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-white border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900 hover:text-sky-700">
                AIや自動化はどんな業務で活用できますか？
              </AccordionTrigger>
              <AccordionContent className="text-base md:text-lg text-gray-700 leading-relaxed pt-2">
                データ入力や書類処理の自動化、顧客対応のチャットボット、営業支援など、
                中小企業や個人事業で負担になりやすい業務を効率化する事例が多いです。
                まずは現在の業務課題をお聞かせください。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        className="w-full py-16 md:py-24 px-6 text-center bg-white"
        aria-labelledby="contact-heading"
      >
        <h2 id="contact-heading" className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          Contact
        </h2>
        <p className="text-gray-700 mb-10 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          お仕事のご相談やお問い合わせは
          <br />
          お気軽にどうぞ！
        </p>
        
        <div className="flex justify-center gap-8 mb-10">
          <a 
            href="mailto:contact@example.com" 
            className="flex items-center gap-3 text-sky-700 hover:text-sky-800 transition-colors duration-200"
            aria-label="メールでお問い合わせ"
          >
            <Mail className="w-8 h-8" aria-hidden="true" />
            <span className="text-lg font-semibold">Email</span>
          </a>
          <a 
            href="https://line.me/profile" 
            className="flex items-center gap-3 text-sky-700 hover:text-sky-800 transition-colors duration-200"
            aria-label="LINEでお問い合わせ"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-8 h-8" aria-hidden="true" />
            <span className="text-lg font-semibold">LINE</span>
          </a>
        </div>

        {/* <div className="max-w-md mx-auto">
          <Button 
            size="lg" 
            className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-colors duration-200"
            aria-label="お問い合わせフォームを開く"
          >
            お問い合わせフォーム
          </Button>
        </div> */}
      </section>
    </main>
  );
}