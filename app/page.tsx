import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, Instagram, Scissors, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { featuredProducts } from "@/data/products";
import { stylists } from "@/data/stylists";

const flow = [
  { title: "髪の状態を選ぶ", body: "髪一本の形や手触りなど、家でも確認しやすい質問に答えます。" },
  { title: "悩みを追加", body: "パサつき、癖毛、広がり、頭皮のかゆみなどを反映します。" },
  { title: "スコア化", body: "細毛・普通毛・硬毛、直毛・癖毛、頭皮状態などを判定します。" },
  { title: "商品を提案", body: "診断結果に近いシャンプーとトリートメントをTOP3で表示します。" }
];

export default function HomePage() {
  return (
    <main className="pt-[var(--header-height)]">
      <section className="relative flex min-h-[calc(100svh-var(--header-height))] items-start overflow-hidden bg-soft md:min-h-[calc(94vh-var(--header-height))] md:items-end">
        <div className="absolute inset-x-4 top-6 grid h-36 grid-cols-3 gap-3 sm:h-44 md:hidden">
          {[
            "/products/qurap-wrapping-moist-shampoo.jpeg",
            "/products/the-answer-shampoo.png",
            "/products/plus-eau-mellow-shampoo.jpeg"
          ].map((src, index) => (
            <div key={src} className={`relative overflow-hidden rounded-brand bg-white p-4 shadow-brand ${index === 1 ? "translate-y-4" : ""}`}>
              <Image
                src={src}
                alt="Care Hairで紹介しているヘアケア商品"
                fill
                priority={index === 0}
                sizes="33vw"
                className="object-contain p-3"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-y-10 right-0 hidden w-[52vw] max-w-[720px] md:block">
          <div className="grid h-full grid-cols-2 grid-rows-3 gap-4 pr-4 lg:pr-8">
            {[
              { src: "/products/qurap-wrapping-moist-shampoo.jpeg", className: "row-span-2" },
              { src: "/products/the-answer-shampoo.png", className: "" },
              { src: "/products/plus-eau-mellow-treatment.jpeg", className: "row-span-2" },
              { src: "/products/mememe-smooth-boost-shampoo.jpeg", className: "" }
            ].map((item, index) => (
              <div key={item.src} className={`relative overflow-hidden rounded-brand border border-line bg-white p-6 shadow-brand ${item.className}`}>
                <Image
                  src={item.src}
                  alt="Care Hairで紹介しているヘアケア商品"
                  fill
                  priority={index === 0}
                  sizes="(min-width: 768px) 26vw, 50vw"
                  className="object-contain p-6"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/80 to-white md:bg-gradient-to-r md:from-white md:via-white/90 md:to-white/25" />
        <div className="relative mx-auto w-full max-w-site px-4 pb-12 pt-64 sm:pt-72 md:pb-24 md:pt-0">
          <div className="max-w-3xl rounded-brand bg-white/80 md:bg-transparent">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-green">Hair care diagnosis</p>
            <h1 className="whitespace-nowrap text-[clamp(2.2rem,10vw,4.5rem)] font-medium leading-[1.12] sm:text-6xl md:text-8xl md:leading-[1.08]">
              本当に合うヘアケアを。
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-ink/75 md:text-xl">
              Care Hairは、男子高校生の髪質・悩み・頭皮状態に合わせて、市販で買いやすいシャンプーとトリートメントを提案する診断サービスです。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/diagnosis" className={buttonVariants({ size: "lg" })}>
                診断を始める <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products" className={buttonVariants({ variant: "outline", size: "lg" })}>
                商品を見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-site items-center gap-12 px-4 md:grid-cols-2 md:gap-20">
          <FadeIn>
            <SectionHeading
              eyebrow="Concept"
              title="迷わず選べる髪質診断。"
              lead="髪の太さ、くせ、乾燥、ダメージ、フケ・かゆみなどをスコア化し、悩みに近い商品をランキング形式で表示します。販売サイトではなく、比較・診断・紹介に特化したサービスです。"
            />
            <div className="grid overflow-hidden rounded-brand border border-line bg-line sm:grid-cols-3">
              {[
                ["200", "男子高校生へのアンケート"],
                ["11", "スマホで答えやすい質問"],
                ["¥2,000", "以内の商品を中心に紹介"]
              ].map(([number, label]) => (
                <div key={label} className="bg-white p-6">
                  <strong className="block text-3xl font-medium text-green">{number}</strong>
                  <span className="mt-3 block text-sm text-muted">{label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-2 gap-3 rounded-brand border border-line bg-line p-4 shadow-brand sm:p-5">
              {[
                { src: "/products/plus-eau-mellow-shampoo.jpeg", alt: "プリュスオー メロウシャンプー" },
                { src: "/products/the-answer-shampoo.png", alt: "THE ANSWER シャンプー" },
                { src: "/products/qurap-wrapping-moist-shampoo.jpeg", alt: "Qurap ラッピングモイスト シャンプー" },
                { src: "/products/cow-moist-shampoo.jpeg", alt: "カウブランド 無添加 うるおいケア シャンプー" }
              ].map((item) => (
                <div key={item.src} className="relative aspect-square rounded-brand bg-white p-4">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 22vw, 45vw"
                    className="object-contain p-4"
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-site px-4">
          <FadeIn>
            <SectionHeading
              eyebrow="Supervision"
              title="美容師の意見を参考に設計"
              lead="美容師へのインタビューをもとに、髪質ごとの選び方と商品選定の基準を整理しました。"
            />
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-3">
            {stylists.map((stylist) => (
              <FadeIn key={stylist.name}>
                <article className="rounded-brand border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-brand">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-soft sm:h-20 sm:w-20">
                      <Image
                        src={stylist.image}
                        alt={`${stylist.shop} ${stylist.name}`}
                        fill
                        sizes="(min-width: 640px) 80px, 64px"
                        className="object-cover"
                        style={{ objectPosition: "imagePosition" in stylist ? stylist.imagePosition : "center" }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold uppercase tracking-[0.16em] text-green">{stylist.shop}</p>
                      <h3 className="mt-2 text-xl font-semibold">{stylist.name}</h3>
                      <p className="mt-1 text-sm text-muted">{stylist.role}</p>
                    </div>
                    <Link
                      href={stylist.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${stylist.name}さんのInstagram`}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-green transition hover:-translate-y-0.5 hover:border-green hover:bg-soft sm:h-11 sm:w-11"
                    >
                      <Instagram className="h-5 w-5" />
                    </Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-soft py-20 md:py-28">
        <div className="mx-auto max-w-site px-4">
          <FadeIn>
            <SectionHeading eyebrow="How it works" title="診断の流れ" />
          </FadeIn>
          <div className="grid gap-px overflow-hidden rounded-brand border border-line bg-line md:grid-cols-4">
            {flow.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.05} className="bg-white p-7">
                <span className="text-sm font-semibold tracking-[0.14em] text-green">0{index + 1}</span>
                <h3 className="mt-10 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm text-muted">{item.body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-soft py-20 md:py-28">
        <div className="mx-auto grid max-w-site gap-12 px-4 md:grid-cols-[0.9fr_1.1fr]">
          <FadeIn>
            <SectionHeading
              eyebrow="Survey"
              title="高校生のリアルな悩みから生まれたサービス。"
              lead="どれを買えばいいか分からない、美容室で聞くのは少し恥ずかしい、高すぎる商品は続けにくい。Care Hairは、そうした声を出発点にしています。"
            />
          </FadeIn>
          <div className="grid gap-4">
            {[
              { icon: ClipboardList, title: "約200人にアンケート", body: "髪の悩み、価格帯、商品選びで困るポイントを整理。" },
              { icon: Scissors, title: "美容師インタビュー", body: "髪質ごとに見るべきポイントを聞き、診断ロジックに反映。" },
              { icon: CheckCircle2, title: "市販商品に限定", body: "ドラッグストアや通販で買いやすい価格帯を中心に紹介。" }
            ].map((item) => (
              <FadeIn key={item.title}>
                <div className="flex gap-5 rounded-brand border border-line bg-white p-6">
                  <item.icon className="mt-1 h-6 w-6 shrink-0 text-green" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted">{item.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-site px-4">
          <FadeIn>
            <SectionHeading eyebrow="Products" title="おすすめ商品を一部紹介" />
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <FadeIn className="mt-10">
            <Link href="/diagnosis" className={buttonVariants({ size: "lg" })}>
              自分に合う商品を診断する <Sparkles className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
