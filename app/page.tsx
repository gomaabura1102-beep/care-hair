import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Crown,
  Droplets,
  Home,
  Instagram,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  UserRound,
  Waves,
  Wind
} from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { getProductInsight, trendingProducts } from "@/data/product-insights";
import { stylists } from "@/data/stylists";

const quickActions = [
  { href: "/diagnosis", label: "髪の状態を診断", icon: ClipboardList },
  { href: "/search", label: "悩みから探す", icon: Search },
  { href: "/search", label: "商品を探す", icon: ShoppingBag },
  { href: "#ranking", label: "人気ランキング", icon: Crown }
];

const concerns = [
  { label: "乾燥・パサつき", icon: Droplets },
  { label: "ベタつき", icon: Waves },
  { label: "抜け毛・薄毛", icon: Wind },
  { label: "うねり・くせ毛", icon: Waves },
  { label: "ダメージ", icon: Sparkles },
  { label: "フケ・かゆみ", icon: ShieldCheck }
];

const guides = [
  {
    href: "/about",
    eyebrow: "CARE GUIDE",
    title: "自分の髪質を知ることから、ヘアケアは始まります。",
    image: "/stylists/keisuke-goto.jpeg"
  },
  {
    href: "/diagnosis",
    eyebrow: "DIAGNOSIS",
    title: "11の質問で、今の髪に合うケアを見つける。",
    image: "/hero-care-hair.jpg"
  },
  {
    href: "/search",
    eyebrow: "PRODUCTS",
    title: "髪質と悩みから、市販の商品を比較できます。",
    image: "/products/qurap-wrapping-moist-shampoo.jpeg"
  }
];

export default function HomePage() {
  return (
    <main className="overflow-hidden pb-24 pt-[var(--header-height)] md:pb-0">
      <section className="relative isolate min-h-[520px] overflow-hidden bg-[#eff7fb] sm:min-h-[580px] lg:min-h-[650px]">
        <div className="absolute inset-0 sm:left-auto sm:w-[64%] lg:w-[58%]">
          <Image
            src="/hero-home-user.jpg"
            alt="料理を持つ短髪の男子"
            fill
            priority
            sizes="(min-width: 1024px) 58vw, (min-width: 640px) 64vw, 100vw"
            className="object-cover object-[66%_34%] sm:object-[62%_8%] lg:object-[65%_3%]"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.90)_38%,rgba(255,255,255,0.18)_72%,rgba(255,255,255,0.02)_100%)] sm:bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.90)_42%,rgba(255,255,255,0.10)_72%)]" />
        <div className="relative mx-auto flex min-h-[520px] max-w-site items-center px-5 py-14 sm:min-h-[580px] sm:px-8 lg:min-h-[650px]">
          <FadeIn className="w-[78%] max-w-[650px] sm:w-[60%] lg:w-[52%]">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.24em] text-primary sm:text-xs">
              Hair care diagnosis
            </p>
            <h1 className="text-[clamp(2rem,7vw,4.8rem)] font-medium leading-[1.28] tracking-[0.02em] text-[#102d44]">
              <span className="whitespace-nowrap">あなたの髪に、</span>
              <br />
              <span className="whitespace-nowrap"><span className="text-[#53a5d5]">最適なケア</span>を。</span>
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-[#29485f] sm:text-base sm:leading-8 lg:text-lg">
              髪質や悩みに合わせて、
              <br className="sm:hidden" />
              あなただけのヘアケアをご提案します。
            </p>
            <Link
              href="/diagnosis"
              className="mt-8 inline-flex min-h-14 w-full max-w-[340px] items-center justify-center gap-4 rounded-full bg-[#55a9da] px-7 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(42,143,184,.28)] transition hover:-translate-y-0.5 hover:bg-primary sm:text-base"
            >
              今すぐ診断をはじめる
              <ArrowRight className="h-5 w-5" />
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="relative z-10 -mt-4 sm:-mt-8">
        <div className="mx-auto grid max-w-site grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:gap-4 lg:px-8">
          {quickActions.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex min-h-32 flex-col items-center justify-center rounded-2xl border border-[#e7eef3] bg-white px-3 text-center shadow-[0_10px_28px_rgba(16,45,68,.10)] transition hover:-translate-y-1 hover:border-[#8dc8e8] hover:shadow-[0_16px_36px_rgba(42,143,184,.16)] sm:min-h-36"
            >
              <item.icon className="h-8 w-8 stroke-[1.6] text-[#55a9da] transition group-hover:scale-110 sm:h-10 sm:w-10" />
              <span className="mt-4 text-sm font-semibold text-[#15324a] sm:text-base">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="ranking" className="py-16 sm:py-20">
        <div className="mx-auto max-w-site">
          <SectionTitle title="おすすめ商品" href="/search" />
          <div className="flex snap-x gap-4 overflow-x-auto px-4 pb-5 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4 lg:px-8 [&::-webkit-scrollbar]:hidden">
            {trendingProducts.map(({ product, label }) => {
              const insight = getProductInsight(product);

              return (
                <article
                  key={product.id}
                  className="w-[74vw] max-w-[290px] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#e5edf2] bg-white shadow-[0_12px_32px_rgba(16,45,68,.08)] sm:w-auto sm:max-w-none"
                >
                  <Link href={`/products/${product.id}`} className="group block h-full">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f7fa]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 74vw"
                        className="object-contain p-5 transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold text-primary shadow-sm">
                        {label}
                      </span>
                    </div>
                    <div className="p-5">
                      <h2 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-[#15324a]">{product.name}</h2>
                      <p className="mt-1 line-clamp-1 text-xs text-muted">{product.fit}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-[#29485f]">
                        <span className="flex text-[#55a9da]" aria-label={`${insight.rating}点`}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </span>
                        <span>{insight.rating}</span>
                        <span className="text-muted">({insight.reviewCount})</span>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#55a9da]">
                        詳しく見る <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[#e8f0f4] bg-[#f8fbfd] py-14 sm:py-18">
        <div className="mx-auto max-w-site">
          <SectionTitle title="悩みから探す" href="/search" />
          <div className="flex snap-x gap-5 overflow-x-auto px-4 pb-3 [scrollbar-width:none] lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-8 [&::-webkit-scrollbar]:hidden">
            {concerns.map((concern) => (
              <Link
                key={concern.label}
                href="/search"
                className="group flex w-24 shrink-0 snap-start flex-col items-center text-center sm:w-28 lg:w-auto"
              >
                <span className="grid h-20 w-20 place-items-center rounded-full border border-[#dceaf2] bg-white text-[#55a9da] shadow-[0_8px_24px_rgba(16,45,68,.06)] transition group-hover:-translate-y-1 group-hover:border-[#8dc8e8] sm:h-24 sm:w-24">
                  <concern.icon className="h-9 w-9 stroke-[1.5]" />
                </span>
                <span className="mt-3 text-xs font-semibold leading-5 text-[#29485f] sm:text-sm">{concern.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-site px-4 lg:px-8">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(110deg,#e8f6fc_0%,#f7fbfd_54%,#d7edf8_100%)] px-6 py-8 shadow-[0_16px_40px_rgba(42,143,184,.10)] sm:px-10 sm:py-10">
              <div className="absolute -bottom-8 left-[48%] hidden h-36 w-36 rounded-full border border-[#83c6e7]/40 sm:block" />
              <div className="relative grid gap-7 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-[#3995c9]">3分であなたの髪質をチェック</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[0.03em] text-[#15324a] sm:text-3xl">無料パーソナル診断</h2>
                  <p className="mt-2 text-sm text-[#466175]">あなたに合うケアと商品がわかります。</p>
                </div>
                <Link
                  href="/diagnosis"
                  className="inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-[#55a9da] px-8 font-semibold text-white shadow-[0_12px_26px_rgba(42,143,184,.24)] transition hover:-translate-y-0.5 hover:bg-primary"
                >
                  無料で診断する <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <ProfessionalSupervisionSection />

      <section className="pb-20 pt-8 sm:pb-24 sm:pt-12">
        <div className="mx-auto max-w-site">
          <SectionTitle title="ヘアケアガイド" href="/about" />
          <div className="flex snap-x gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:grid md:grid-cols-3 md:overflow-visible lg:px-8 [&::-webkit-scrollbar]:hidden">
            {guides.map((guide) => (
              <Link
                key={guide.title}
                href={guide.href}
                className="group grid w-[82vw] max-w-[340px] shrink-0 snap-start grid-cols-[112px_1fr] overflow-hidden rounded-2xl border border-[#e5edf2] bg-white shadow-[0_10px_28px_rgba(16,45,68,.07)] transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(42,143,184,.13)] md:w-auto md:max-w-none"
              >
                <div className="relative min-h-36 overflow-hidden bg-[#eff7fb]">
                  <Image
                    src={guide.image}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-4">
                  <span className="text-[10px] font-bold tracking-[0.16em] text-[#55a9da]">{guide.eyebrow}</span>
                  <h2 className="mt-2 text-sm font-semibold leading-6 text-[#15324a] sm:text-base">{guide.title}</h2>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#55a9da]">
                    読んでみる <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[#e1e9ee] bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(16,45,68,.08)] backdrop-blur md:hidden" aria-label="ホームのメインメニュー">
        <MobileNavItem href="/" label="ホーム" icon={Home} active />
        <MobileNavItem href="/diagnosis" label="診断" icon={ClipboardList} />
        <MobileNavItem href="/search" label="商品一覧" icon={ShoppingBag} />
        <MobileNavItem href="/mypage" label="マイページ" icon={UserRound} />
      </nav>
    </main>
  );
}

function ProfessionalSupervisionSection() {
  return (
    <section className="border-t border-[#e8f0f4] bg-[#fbfdfe] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-site px-4 lg:px-8">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#55a9da]">Professional supervision</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[0.02em] text-[#15324a] sm:text-4xl lg:text-5xl">
            美容師の意見を参考に設計
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted sm:text-base sm:leading-8">
            美容師へのインタビューをもとに、髪質ごとの選び方と商品選定の基準を整理しました。
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-3">
          {stylists.map((stylist, index) => (
            <FadeIn key={stylist.name} delay={index * 0.05}>
              <article className="flex min-h-40 items-center gap-4 rounded-2xl border border-[#dfe9ef] bg-white p-5 shadow-[0_10px_28px_rgba(16,45,68,.05)] transition hover:-translate-y-1 hover:border-[#8dc8e8] hover:shadow-[0_16px_36px_rgba(42,143,184,.12)] sm:gap-5 sm:p-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-[#eff7fb] sm:h-28 sm:w-28">
                  <Image
                    src={stylist.image}
                    alt={`${stylist.shop} ${stylist.name}`}
                    fill
                    sizes="112px"
                    className="object-cover"
                    style={{ objectPosition: "imagePosition" in stylist ? stylist.imagePosition : "center" }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-[#2f83b4] sm:text-xs">
                    {stylist.shop}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#15324a] sm:text-2xl">{stylist.name}</h3>
                  <p className="mt-1 text-sm text-muted">{stylist.role}</p>
                </div>
                <Link
                  href={stylist.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${stylist.name}さんのInstagram`}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#dfe9ef] text-[#2f83b4] transition hover:border-[#55a9da] hover:bg-[#eff7fb]"
                >
                  <Instagram className="h-5 w-5 stroke-[1.7]" />
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-6 flex items-center justify-between px-4 lg:px-8">
      <h2 className="text-xl font-semibold tracking-[0.04em] text-[#15324a] sm:text-2xl">{title}</h2>
      <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-[#55a9da] transition hover:text-primary">
        すべて見る <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function MobileNavItem({
  href,
  label,
  icon: Icon,
  active = false
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
        active ? "text-[#55a9da]" : "text-[#6f7d87]"
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? "fill-[#55a9da] stroke-[#55a9da]" : "stroke-[1.7]"}`} />
      {label}
    </Link>
  );
}
