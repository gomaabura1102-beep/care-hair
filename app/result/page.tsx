import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ScoreBars } from "@/components/score-bars";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { getDiagnosisResult, parseAnswers, rankPairedTreatments, rankProducts } from "@/lib/diagnosis";

export const metadata: Metadata = {
  title: "診断結果",
  description: "Care Hairの髪質診断結果とおすすめ商品ランキングです。"
};

type ResultPageProps = {
  searchParams: {
    answers?: string;
  };
};

export default function ResultPage({ searchParams }: ResultPageProps) {
  const answers = parseAnswers(searchParams.answers ?? null);
  const result = getDiagnosisResult(answers);
  const shampoos = rankProducts("shampoo", result.scores);
  const treatments = rankPairedTreatments(shampoos, result.scores);

  return (
    <main className="pt-[var(--header-height)]">
      <section className="bg-soft py-16 md:py-24">
        <div className="mx-auto grid max-w-site gap-6 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-brand border border-line bg-white p-7 shadow-brand md:p-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-green">Your result</p>
            <h1 className="text-balance text-3xl font-medium leading-tight md:text-5xl">
              {result.hairBody}・{result.hairShape} / {result.condition}
            </h1>
            <p className="mt-6 text-muted">{result.feature}</p>
            <ScoreBars scores={result.scores} />
          </div>
          <div className="rounded-brand border border-line bg-white p-7 md:p-10">
            <h2 className="text-2xl font-semibold">おすすめ理由</h2>
            <p className="mt-4 text-muted">{result.reason}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Link
                href={`/products/${shampoos[0].id}`}
                className="rounded-brand border border-line bg-soft p-5 transition hover:-translate-y-0.5 hover:border-green hover:bg-white"
              >
                <span className="text-sm font-semibold text-green">おすすめシャンプー</span>
                <h3 className="mt-2 text-lg font-semibold leading-snug">{shampoos[0].name}</h3>
                <p className="mt-2 text-sm text-muted">{shampoos[0].fit}</p>
              </Link>
              <Link
                href={`/products/${treatments[0].id}`}
                className="rounded-brand border border-line bg-soft p-5 transition hover:-translate-y-0.5 hover:border-green hover:bg-white"
              >
                <span className="text-sm font-semibold text-green">おすすめトリートメント</span>
                <h3 className="mt-2 text-lg font-semibold leading-snug">{treatments[0].name}</h3>
                <p className="mt-2 text-sm text-muted">{treatments[0].fit}</p>
              </Link>
            </div>
            <div className="mt-8 grid gap-4 rounded-brand border border-line p-5">
              <div>
                <span className="text-sm font-semibold text-green">あなたの髪質</span>
                <p className="mt-1">{result.hairBody} / {result.hairShape}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-green">頭皮状態</span>
                <p className="mt-1">{result.scalpState}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/diagnosis" className={buttonVariants()}>
                もう一度診断する
              </Link>
              <Link href="/products" className={buttonVariants({ variant: "outline" })}>
                商品一覧へ
              </Link>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-site px-4">
          <div className="rounded-brand border border-line bg-white p-7 shadow-brand md:p-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">Care tips</p>
                <h2 className="mt-3 text-2xl font-semibold md:text-3xl">特徴とワンポイントアドバイス</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-muted">
                診断結果に合わせて、毎日のケアで意識したいポイントをまとめました。
              </p>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {result.advices.map((item) => (
                <article key={item.title} className="rounded-brand border border-line bg-soft p-5">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.features.map((feature) => (
                      <span key={feature} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-green">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted">{item.advice}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-site px-4">
          <SectionHeading eyebrow="Top 3" title="おすすめシャンプー" />
          <div className="grid gap-6 md:grid-cols-3">
            {shampoos.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-soft py-20 md:py-28">
        <div className="mx-auto max-w-site px-4">
          <SectionHeading eyebrow="Top 3" title="おすすめトリートメント" />
          <div className="grid gap-6 md:grid-cols-3">
            {treatments.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
