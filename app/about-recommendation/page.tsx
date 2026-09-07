import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Database, Scale, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "おすすめが決まる仕組み",
  description: "Care Hairの質問診断と商品推薦の考え方、データの扱い、限界を説明します。"
};

const principles = [
  { icon: Database, title: "質問回答を点数化", text: "髪の太さ、くせ、乾燥、ダメージ、頭皮、希望の仕上がりに関係する回答を項目別に加点します。" },
  { icon: Scale, title: "商品特徴と照合", text: "各商品に登録した向いている髪質・悩み・仕上がりの特徴と、回答傾向の重なりを比較します。" },
  { icon: CheckCircle2, title: "理由と一緒に表示", text: "根拠のない一致率は使わず、最有力・有力・候補の順と、重なった項目を文章で示します。" }
];

export default function AboutRecommendationPage() {
  return (
    <main className="min-h-screen bg-soft pb-24 pt-[calc(var(--header-height)+4rem)]">
      <div className="mx-auto max-w-4xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">Transparency</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">おすすめが決まる仕組み</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted">Care Hairは、回答と商品特徴の重なりを使うルールベース診断です。現在、画像AIや生成AIが診断結果を決めることはありません。</p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {principles.map((item, index) => (
            <article key={item.title} className="rounded-[20px] border border-line bg-white p-6 shadow-brand"><span className="text-xs font-bold text-muted">0{index + 1}</span><item.icon className="mt-5 h-7 w-7 text-green" /><h2 className="mt-5 text-xl font-semibold">{item.title}</h2><p className="mt-3 text-sm leading-7 text-muted">{item.text}</p></article>
          ))}
        </div>

        <section className="mt-8 rounded-[20px] border border-line bg-white p-6 sm:p-9">
          <h2 className="text-2xl font-semibold">診断で分かること</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-7 text-muted sm:grid-cols-2">
            {["髪の太さ・硬さの傾向", "直毛・くせ／うねりの傾向", "乾燥・広がり・ダメージの優先度", "頭皮ケアを優先した方がよいか", "希望する仕上がりとの相性", "回答に近い商品の候補と理由"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green" />{item}</li>)}
          </ul>
        </section>

        <section className="mt-8 rounded-[20px] border border-green/25 bg-[#eef6f2] p-6 sm:p-9">
          <div className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-green" /><h2 className="text-xl font-semibold">できないこと・注意点</h2></div>
          <p className="mt-4 text-sm leading-7 text-muted">これは医療診断ではありません。急な抜け毛、強いかゆみ、痛み、炎症などがある場合は、商品を替えるだけで様子を見ず、保護者や医療機関へ相談してください。商品の感じ方には個人差があります。</p>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row"><Link href="/diagnosis" className={buttonVariants({ size: "lg" })}>無料で診断する <ArrowRight className="h-4 w-4" /></Link><Link href="/search" className={buttonVariants({ variant: "outline", size: "lg" })}>商品を見る</Link></div>
      </div>
    </main>
  );
}
