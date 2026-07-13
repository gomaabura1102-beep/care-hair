import type { Metadata } from "next";
import Image from "next/image";
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
    body: "約200人へのアンケートから、悩みや購入しやすい価格帯、商品選びの不安を整理しました。"
  },
  {
    icon: Scissors,
    title: "美容師インタビュー",
    body: "men's hair SENSE、SKILL SHIBUYAの美容師の意見を参考に、髪質ごとの選び方を設計しました。"
  },
  {
    icon: Sparkles,
    title: "サービスへの想い",
    body: "髪型が整うと、毎日の気分も少し変わります。その最初の一歩を、分かりやすく支えます。"
  }
];

const heroProducts = [
  {
    name: "Qurap ラッピングモイスト",
    image: "/products/qurap-wrapping-moist-shampoo.jpeg"
  },
  {
    name: "THE ANSWER",
    image: "/products/the-answer-shampoo.png"
  },
  {
    name: "プリュスオー リポア",
    image: "/products/plus-eau-repair-treatment.jpeg"
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
              Care Hairは、高校のアントレプレナーシップ授業で生まれたヘアケア診断サービスです。男子高校生の声と美容師インタビューをもとに、無理なく続けやすい商品選びをサポートします。
            </p>
            <Link href="/diagnosis" className={buttonVariants({ className: "mt-9" })}>
              診断を始める
            </Link>
          </FadeIn>
          <FadeIn>
            <div className="relative overflow-hidden rounded-brand border border-line bg-soft p-5 shadow-brand sm:p-7">
              <div className="grid aspect-[4/5] grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
                <div className="relative overflow-hidden rounded-brand bg-white p-4">
                  <Image
                    src={heroProducts[0].image}
                    alt={heroProducts[0].name}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-contain p-5"
                    priority
                  />
                </div>
                <div className="relative overflow-hidden rounded-brand bg-white p-4">
                  <Image
                    src={heroProducts[1].image}
                    alt={heroProducts[1].name}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-contain p-5"
                  />
                </div>
                <div className="relative col-span-2 overflow-hidden rounded-brand bg-white p-4">
                  <Image
                    src={heroProducts[2].image}
                    alt={heroProducts[2].name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-contain p-6"
                  />
                </div>
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
