import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, School, Scissors, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "私たちについて",
  description: "Care Hairを作った理由、高校生へのアンケート、美容師インタビュー、サービスへの想い。"
};

const panels = [
  {
    icon: School,
    title: "サービスを作った理由",
    body: "ヘアケアを始めたい男子高校生が、専門用語や価格で迷わず選べる場所を作るためです。"
  },
  {
    icon: MessageCircle,
    title: "高校生へのアンケート",
    body: "高校生から集めた声をもとに、悩みや購入しやすい価格帯、商品選びの不安を整理しています。集計根拠を公開できる内容だけを今後掲載します。"
  },
  {
    icon: Scissors,
    title: "美容師インタビュー",
    body: "専門家情報は、氏名・所属・専門分野・取材日を確認できる場合だけ公開します。現在、公開用コンテンツを準備しています。"
  },
  {
    icon: Sparkles,
    title: "サービスへの想い",
    body: "髪型が整うと、毎日の気分も少し変わります。その最初の一歩を、分かりやすく支えます。"
  }
];

const heroProducts = [
  {
    category: "Shampoo",
    brand: "Qurap",
    name: "ラッピングモイスト"
  },
  {
    category: "Shampoo",
    brand: "THE ANSWER",
    name: "シャンプー"
  },
  {
    category: "Treatment",
    brand: "プリュスオー",
    name: "リポアトリートメント"
  }
];

export default function AboutPage() {
  return (
    <main className="pt-[var(--header-height)]">
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-site items-center gap-12 px-4 md:grid-cols-2 md:gap-20">
          <FadeIn>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-green">About us</p>
            <h1 className="text-4xl font-medium leading-[1.18] sm:text-5xl lg:text-6xl">
              <span className="block whitespace-nowrap">自分に合うものを、</span>
              <span className="block whitespace-nowrap">もっと簡単に。</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-muted sm:text-lg">
              Care Hairは、高校のアントレプレナーシップ授業で生まれたヘアケア診断サービスです。男子中高生が、無理なく続けやすい商品を理由と一緒に選べるようサポートします。
            </p>
            <Link href="/diagnosis" className={buttonVariants({ className: "mt-9" })}>
              診断を始める
            </Link>
          </FadeIn>
          <FadeIn>
            <div className="relative overflow-hidden rounded-brand border border-line bg-soft p-5 shadow-brand sm:p-7">
              <div className="grid min-h-[420px] grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
                {heroProducts.map((product, index) => (
                  <article key={`${product.brand}-${product.name}`} className={`relative overflow-hidden rounded-brand border border-line bg-white p-5 sm:p-6 ${index === 2 ? "col-span-2" : ""}`}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green">{product.category}</p>
                    <p className="mt-5 text-sm font-semibold text-muted">{product.brand}</p>
                    <p className="mt-2 max-w-[16rem] text-xl font-semibold leading-snug text-ink">{product.name}</p>
                    <span aria-hidden="true" className="absolute -bottom-10 -right-8 h-28 w-28 rounded-full border border-green/10 bg-secondary" />
                  </article>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-soft py-20 md:py-28">
        <div className="mx-auto max-w-site px-4">
          <SectionHeading eyebrow="Story" title="Care Hairに込めたこと" />
          <div className="grid gap-6 md:grid-cols-2">
            {panels.map((panel) => (
              <FadeIn key={panel.title}>
                <article className="rounded-brand border border-line bg-white p-7">
                  <panel.icon className="h-7 w-7 text-green" />
                  <h2 className="mt-8 text-2xl font-semibold">{panel.title}</h2>
                  <p className="mt-4 text-muted">{panel.body}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
