import { notFound } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ローカル開発環境のみアクセス可能
export default function DesignPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 space-y-20">
      <header>
        <p className="text-xs font-bold tracking-[0.25em] text-sky-600 uppercase mb-2">
          Dev Only
        </p>
        <h1 className="text-4xl font-bold text-gray-900">Component Showcase</h1>
        <p className="mt-3 text-gray-500">
          インストール済みコンポーネントの一覧。本番環境では 404 になります。
        </p>
      </header>

      <Separator />

      {/* ─── Button ──────────────────────────────────────────── */}
      <Section title="Button" description="variant / size の組み合わせ">
        <div className="space-y-6">
          {/* variants */}
          <div>
            <Label>variant</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>
          {/* sizes */}
          <div>
            <Label>size</Label>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
          {/* disabled */}
          <div>
            <Label>disabled</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              <Button disabled>Default</Button>
              <Button variant="outline" disabled>
                Outline
              </Button>
            </div>
          </div>
          {/* このプロジェクトの実使用スタイル */}
          <div>
            <Label>プロジェクト実使用スタイル（CTA）</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              <Button className="bg-gray-900 hover:bg-gray-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 py-4 px-8 rounded-[100px] h-auto">
                無料に相談する
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Separator />

      {/* ─── Badge ───────────────────────────────────────────── */}
      <Section title="Badge" description="variant の組み合わせ">
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
        <div className="mt-4">
          <Label>プロジェクト実使用スタイル</Label>
          <div className="flex flex-wrap gap-3 mt-2">
            <Badge className="bg-sky-50 text-sky-700 hover:bg-sky-50 border border-sky-200 text-xs">
              製造業
            </Badge>
            <Badge
              variant="outline"
              className="text-xs border-sky-200 text-sky-700 bg-sky-50"
            >
              AI・DX
            </Badge>
          </div>
        </div>
      </Section>

      <Separator />

      {/* ─── Card ────────────────────────────────────────────── */}
      <Section title="Card" description="CardHeader / CardContent / CardFooter">
        <div className="grid md:grid-cols-2 gap-6">
          {/* フル構成 */}
          <Card>
            <CardHeader>
              <CardTitle>カードタイトル</CardTitle>
              <CardDescription>サブテキスト・説明文</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">
                CardContent
                にはメインコンテンツを置きます。テキスト・画像・リストなど自由に配置できます。
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">アクション</Button>
            </CardFooter>
          </Card>

          {/* シンプル */}
          <Card className="bg-slate-50 border-0 shadow-none">
            <CardHeader>
              <CardTitle>シンプルカード</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                border なし・shadow なしの背景カラー変形例。
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Separator />

      {/* ─── Separator ───────────────────────────────────────── */}
      <Section title="Separator" description="horizontal / vertical の 2 方向">
        <div className="space-y-6">
          <div>
            <Label>horizontal（デフォルト）</Label>
            <div className="mt-3 space-y-3">
              <p className="text-sm text-gray-500">上のコンテンツ</p>
              <Separator />
              <p className="text-sm text-gray-500">下のコンテンツ</p>
            </div>
          </div>
          <div>
            <Label>vertical</Label>
            <div className="mt-3 flex items-center gap-4 h-8">
              <span className="text-sm text-gray-500">左</span>
              <Separator orientation="vertical" />
              <span className="text-sm text-gray-500">右</span>
            </div>
          </div>
        </div>
      </Section>

      <Separator />

      {/* ─── Accordion ───────────────────────────────────────── */}
      <Section title="Accordion" description="FAQ などで使用する折りたたみ">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>料金はどのくらいかかりますか？</AccordionTrigger>
            <AccordionContent>
              ご要望・規模によって異なります。まずは無料相談でお気軽にご相談ください。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>対応エリアはどこですか？</AccordionTrigger>
            <AccordionContent>
              全国対応可能です。基本的にはオンラインでのやり取りになります。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              どのくらいの期間で対応できますか？
            </AccordionTrigger>
            <AccordionContent>
              内容によりますが、小規模なものは数日〜数週間、システム開発は数ヶ月程度が目安です。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Separator />

      {/* ─── Color palette ───────────────────────────────────── */}
      <Section title="Color Palette" description="globals.css の CSS 変数">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            {
              name: "primary",
              bg: "bg-[oklch(0.45_0.18_255)]",
              label: "oklch(0.45 0.18 255)",
            },
            {
              name: "accent",
              bg: "bg-[oklch(0.55_0.18_255)]",
              label: "oklch(0.55 0.18 255)",
            },
            {
              name: "secondary",
              bg: "bg-[oklch(0.94_0.03_255)]",
              label: "oklch(0.94 0.03 255)",
            },
            {
              name: "muted",
              bg: "bg-[oklch(0.96_0.02_255)]",
              label: "oklch(0.96 0.02 255)",
            },
            {
              name: "destructive",
              bg: "bg-[oklch(0.577_0.245_27.325)]",
              label: "oklch(0.577 0.245 27.3)",
            },
            {
              name: "border",
              bg: "bg-[oklch(0.9_0.02_255)] border border-gray-200",
              label: "oklch(0.9 0.02 255)",
            },
          ].map((c) => (
            <div key={c.name} className="space-y-2">
              <div className={`h-12 rounded-lg ${c.bg}`} />
              <p className="text-xs font-medium text-gray-700">{c.name}</p>
              <p className="text-xs text-gray-400 font-mono">{c.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      {/* ─── Typography ──────────────────────────────────────── */}
      <Section title="Typography" description="Noto Sans JP + Tailwind scale">
        <div className="space-y-4">
          {[
            { cls: "text-5xl font-bold", label: "text-5xl / bold — H1" },
            { cls: "text-4xl font-bold", label: "text-4xl / bold — H2" },
            { cls: "text-3xl font-bold", label: "text-3xl / bold — H3" },
            { cls: "text-xl font-semibold", label: "text-xl / semibold — H4" },
            { cls: "text-base", label: "text-base — 本文" },
            {
              cls: "text-sm text-gray-500",
              label: "text-sm / muted — キャプション",
            },
            {
              cls: "text-xs font-bold tracking-[0.25em] text-sky-600 uppercase",
              label: "text-xs / tracking wide — Section Label",
            },
          ].map((t) => (
            <div key={t.cls} className="flex items-baseline gap-4">
              <p className={`${t.cls} shrink-0`}>Ag 日本語</p>
              <span className="text-xs text-gray-400 font-mono">{t.label}</span>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}

// ─── 小コンポーネント（このファイル内専用）─────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
      {children}
    </p>
  );
}
