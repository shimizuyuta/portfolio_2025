import { BarChart3, Brain, Code, MessageSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export default function ServicePage() {
  return (
    <main>
      {/* Services Section */}
      <section className="w-full py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-20">
            Services
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <Card className="pt-0 overflow-hidden hover:shadow-xl transition-shadow duration-300 border">
              <div className="w-full h-56 md:h-64 bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <Brain
                    className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-4"
                    aria-hidden="true"
                  />
                  <span className="text-lg font-semibold text-primary">
                    AI・DX活用支援
                  </span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Brain
                    className="w-6 h-6 text-primary flex-shrink-0"
                    aria-hidden="true"
                  />
                  AI・DX活用支援
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  業務効率化、自動化の仕組みづくりを支援します。AIを活用した書類処理の自動化や、データ分析による業務改善をサポートします。
                </p>
              </div>
            </Card>

            <Card className="pt-0 overflow-hidden hover:shadow-xl transition-shadow duration-300 border">
              <div className="w-full h-56 md:h-64 bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3
                    className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-4"
                    aria-hidden="true"
                  />
                  <span className="text-lg font-semibold text-primary">
                    Webマーケティング
                  </span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-3">
                  <BarChart3
                    className="w-6 h-6 text-primary flex-shrink-0"
                    aria-hidden="true"
                  />
                  Webマーケティング
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  広告運用や効果測定を通じて売上向上をサポート。Meta広告やGoogle広告の最適化により、ROIの向上を実現します。
                </p>
              </div>
            </Card>

            <Card className="pt-0 overflow-hidden hover:shadow-xl transition-shadow duration-300 border">
              <div className="w-full h-56 md:h-64 bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare
                    className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-4"
                    aria-hidden="true"
                  />
                  <span className="text-lg font-semibold text-primary">
                    LINE公式構築
                  </span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-3">
                  <MessageSquare
                    className="w-6 h-6 text-primary flex-shrink-0"
                    aria-hidden="true"
                  />
                  LINE公式構築
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  顧客対応や販促を効率化するLINE活用を実現。Lステップを活用した自動化でリピート率向上をサポートします。
                </p>
              </div>
            </Card>

            <Card className="pt-0 overflow-hidden hover:shadow-xl transition-shadow duration-300 border">
              <div className="w-full h-56 md:h-64 bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <Code
                    className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-4"
                    aria-hidden="true"
                  />
                  <span className="text-lg font-semibold text-primary">
                    ホームページ制作・アプリ開発
                  </span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Code
                    className="w-6 h-6 text-primary flex-shrink-0"
                    aria-hidden="true"
                  />
                  ホームページ制作・アプリ開発
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Webサイトやアプリの開発・リニューアルを対応。モダンな技術で高品質なサービスを提供します。
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16 md:py-24 bg-muted/50">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">
            FAQ
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem
              value="item-1"
              className="bg-card border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-accent">
                開発にどれくらいの期間がかかりますか？
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                内容や規模によって異なりますが、簡単なサイトであれば2〜4週間程度、カスタムシステムやアプリ開発では1〜3ヶ月程度を目安としています。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-2"
              className="bg-card border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-accent">
                予算の目安はどのくらいですか？
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                規模や機能により異なりますが、小規模案件では数万円〜、大規模開発では数十万円以上を目安としています。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-3"
              className="bg-card border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-accent">
                小規模な案件や個人事業でもお願いできますか？
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                はい、もちろんです。個人事業主の方や小規模ビジネス向けのサポートも可能ですのでお気軽にご相談ください。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-4"
              className="bg-card border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-accent">
                技術的な知識がなくても依頼できますか？
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                問題ありません。専門用語を極力使わず、わかりやすく説明しながら進めますので、初めての方でも安心してご依頼いただけます。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-5"
              className="bg-card border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-accent">
                LINE公式アカウントや広告運用だけの依頼も可能ですか？
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                はい、部分的なご依頼にも対応しています。公式LINEの構築・Lステップ連携、Meta広告の運用など単独のサポートも可能です。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-6"
              className="bg-card border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-accent">
                保守・運用のサポートもしてもらえますか？
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                ご希望に応じて、リリース後の改善や運用サポートも承っています。長期的なパートナーとして安心してご利用いただけます。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-7"
              className="bg-card border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-accent">
                AIや自動化はどんな業務で活用できますか？
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                データ入力や書類処理の自動化、顧客対応のチャットボット、営業支援など、中小企業や個人事業で負担になりやすい業務を効率化する事例が多いです。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
}
