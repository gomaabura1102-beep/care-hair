import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Droplets,
  FlaskConical,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Waves
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { FadeIn } from "@/components/fade-in";
import { productsWithInsights } from "@/data/product-insights";

const diagnosisSteps = [
  { icon: ClipboardList, number: "01", title: "髪について答える", text: "11の質問に、今の状態に近いものを選びます。" },
  { icon: FlaskConical, number: "02", title: "髪質・悩みを分析", text: "回答から太さ・くせ・乾燥などの傾向を整理します。" },
  { icon: Search, number: "03", title: "あなた向けの商品を比較", text: "理由を見ながら、市販の商品を最大3つ比べられます。" }
];

const concerns = [
  { label: "乾燥・パサつき", query: "パサつき", icon: Droplets },
  { label: "うねり・くせ毛", query: "くせ毛・うねり", icon: Waves },
  { label: "広がり", query: "広がり", icon: Sparkles },
  { label: "ダメージ", query: "ダメージ", icon: ShieldCheck }
];

const popularProducts = [...productsWithInsights]
  .filter((product) => product.type === "shampoo" && product.insight.reviewCount !== null)
  .sort((a, b) => (b.insight.reviewCount ?? 0) - (a.insight.reviewCount ?? 0))
  .slice(0, 3);

const guides = [
  { href: "/about-recommendation", eyebrow: "HOW IT WORKS", title: "おすすめが決まる仕組み", text: "質問回答と商品特徴をどう照合しているかを公開します。", icon: FlaskConical },
  { href: "/about", eyebrow: "BASIC CARE", title: "自分の髪質を知る", text: "毎日のケアを選びやすくするための基礎ガイドです。", icon: BookOpen },
  { href: "/reviews", eyebrow: "REVIEWS", title: "自分に近い髪質の口コミ", text: "評価だけでなく、良い点と気になる点の両方を確認します。", icon: MessageCircle }
];

export default function HomePage() {
  return (
    <main className="overflow-hidden pb-20 pt-[var(--header-height)] md:pb-0">
      <section className="relative isolate min-h-[610px] overflow-hidden bg-[#edf4f1] sm:min-h-[680px]">
        <Image src="/hero-care-hair.jpg" alt="清潔感のあるヘアスタイルの男性" fill priority sizes="100vw" className="object-cover object-[68%_center] sm:object-[70%_center] lg:object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,250,247,.99)_0%,rgba(250,250,247,.94)_42%,rgba(250,250,247,.28)_72%,rgba(250,250,247,.08)_100%)]" />
        <div className="relative mx-auto flex min-h-[610px] max-w-site items-center px-5 py-16 sm:min-h-[680px] sm:px-8">
          <FadeIn className="w-[82%] max-w-[670px] sm:w-[64%] lg:w-[58%]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green">11 questions · free diagnosis</p>
            <h1 className="mt-5 text-[clamp(2.35rem,7vw,5rem)] font-medium leading-[1.18] tracking-[-0.03em] text-ink">
              自分に合う<br />シャンプーが、<br />分からない。
            </h1>
            <p className="mt-7 max-w-xl text-sm font-medium leading-7 text-[#3e4a44] sm:text-lg sm:leading-9">11の質問から、あなたの髪質と悩みに合うヘアケアを探します。</p>
            <Link href="/diagnosis" className="mt-8 inline-flex min-h-14 w-full max-w-[340px] items-center justify-center gap-3 rounded-full bg-green px-7 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(29,80,66,.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--primary-dark)] sm:text-base">無料で診断する <ArrowRight className="h-5 w-5" /></Link>
            <p className="mt-3 text-xs font-medium text-muted">約2分・登録不要</p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-site px-4 lg:px-8">
          <SectionIntro eyebrow="How it works" title="3ステップで、選ぶ理由まで分かる。" lead="専門用語を覚えなくても、今の髪に近い回答を選ぶだけです。" />
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {diagnosisSteps.map((step) => (
              <article key={step.number} className="rounded-[20px] border border-line bg-white p-6 shadow-[0_12px_34px_rgba(22,45,37,.06)] sm:p-7">
                <div className="flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-green"><step.icon className="h-6 w-6 stroke-[1.7]" /></span><span className="text-xs font-bold tracking-[0.16em] text-muted">STEP {step.number}</span></div>
                <h2 className="mt-7 text-xl font-semibold">{step.title}</h2><p className="mt-3 text-sm leading-7 text-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-soft py-16 sm:py-20">
        <div className="mx-auto max-w-site px-4 lg:px-8">
          <SectionIntro eyebrow="Concerns" title="悩みから探す" lead="今いちばん気になることから、商品候補を絞り込めます。" />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {concerns.map((concern) => (
              <Link key={concern.label} href={`/search?concern=${encodeURIComponent(concern.query)}`} className="group rounded-[20px] border border-line bg-white p-5 text-center transition duration-200 hover:-translate-y-1 hover:border-green hover:shadow-brand">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary text-green"><concern.icon className="h-7 w-7 stroke-[1.6]" /></span>
                <span className="mt-4 block text-sm font-semibold sm:text-base">{concern.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-site gap-6 px-4 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
          <div className="rounded-[24px] bg-[#173f35] p-7 text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/65">Personal selection</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">あなたに合う商品を探す</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/75">髪の太さ、くせ、乾燥、ダメージ、頭皮の状態を整理して、理由が説明できる候補を表示します。</p>
            <Link href="/diagnosis" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#173f35]">診断から探す <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="rounded-[24px] border border-line bg-white p-7 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green">Already know?</p>
            <h2 className="mt-4 text-2xl font-semibold">条件を選んで探す</h2>
            <p className="mt-4 text-sm leading-7 text-muted">価格・仕上がり・重さ・悩みから、すべての商品を検索できます。</p>
            <Link href="/search" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-green px-6 text-sm font-semibold text-green">商品一覧へ <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="bg-soft py-16 sm:py-24">
        <div className="mx-auto max-w-site px-4 lg:px-8">
          <SectionIntro eyebrow="Amazon review count" title="人気商品" lead="Amazon.co.jpで確認できた口コミ件数が多い順です。人気を断定する独自ランキングではありません。" action={{ href: "/search", label: "すべて見る" }} />
          <div className="mt-8 grid gap-5 md:grid-cols-3">{popularProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          <p className="mt-5 text-xs leading-6 text-muted">Amazon評価・件数は2026年8月22日の確認情報で、現在は変動している場合があります。</p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-site px-4 lg:px-8">
          <SectionIntro eyebrow="User reviews" title="利用者の口コミ" lead="まだ十分な口コミ数がないため、満足度や傾向は表示していません。" action={{ href: "/reviews", label: "口コミを見る・書く" }} />
          <div className="mt-8 rounded-[20px] border border-dashed border-line bg-soft p-8 text-center sm:p-12">
            <MessageCircle className="mx-auto h-8 w-8 text-green" /><h3 className="mt-4 text-xl font-semibold">口コミを集めています</h3><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted">10件以上集まった商品から、良かった点・気になった点の傾向を表示します。</p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-[#f4f7f5] py-16 sm:py-24">
        <div className="mx-auto max-w-site px-4 lg:px-8">
          <SectionIntro eyebrow="Expert content" title="美容師・専門家コンテンツ" lead="氏名・所属・専門・取材日を確認できる情報だけを掲載します。現在、公開できる監修者プロフィールは準備中です。" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["髪質の見分け方", "商品表示の読み方", "毎日の正しい洗い方"].map((title) => (
              <article key={title} className="rounded-[20px] border border-line bg-white p-6"><CheckCircle2 className="h-6 w-6 text-green" /><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted">監修情報を確認でき次第、取材日と一緒に公開します。</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-site px-4 lg:px-8">
          <SectionIntro eyebrow="Care guide" title="ヘアケアガイド" lead="選び方・使い方・口コミの見方を、同じデザインで読みやすくまとめます。" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {guides.map((guide) => (
              <Link key={guide.title} href={guide.href} className="group rounded-[20px] border border-line bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-green hover:shadow-brand">
                <guide.icon className="h-7 w-7 text-green" /><p className="mt-7 text-[11px] font-bold tracking-[0.16em] text-green">{guide.eyebrow}</p><h3 className="mt-3 text-xl font-semibold">{guide.title}</h3><p className="mt-3 text-sm leading-7 text-muted">{guide.text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green">読む <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:pb-24">
        <div className="mx-auto max-w-site rounded-[28px] bg-[#173f35] px-6 py-12 text-center text-white sm:px-10 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Check again anytime</p><h2 className="mt-4 text-3xl font-semibold sm:text-4xl">髪は、季節や使う商品で変わります。</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/75">前回と比べながら、今の状態をもう一度確認できます。</p><Link href="/diagnosis" className="mt-7 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-8 font-semibold text-[#173f35]">再診断する <ArrowRight className="h-5 w-5" /></Link>
        </div>
      </section>
    </main>
  );
}

function SectionIntro({ eyebrow, title, lead, action }: { eyebrow: string; title: string; lead?: string; action?: { href: string; label: string } }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-green">{eyebrow}</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">{title}</h2>{lead ? <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">{lead}</p> : null}</div>
      {action ? <Link href={action.href} className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-green">{action.label} <ArrowRight className="h-4 w-4" /></Link> : null}
    </div>
  );
}
