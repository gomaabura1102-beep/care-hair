"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { ScoreBars } from "@/components/score-bars";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardEyebrow } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ShareResultCard } from "@/features/result/share-result-card";
import { calculateScores, getDiagnosisResultFromScores, parseAnswers, rankPairedTreatments, rankProducts, scoreKeys } from "@/lib/diagnosis";
import type { ScoreMap } from "@/types/diagnosis";
import type { HairPhotoAnalysis } from "@/types/photo-diagnosis";

export function ResultContent() {
  const searchParams = useSearchParams();
  const answers = parseAnswers(searchParams.get("answers"));
  const [photoAnalysis, setPhotoAnalysis] = useState<HairPhotoAnalysis | null>(null);
  const usesPhoto = searchParams.get("photo") === "1";
  const result = useMemo(() => {
    const scores = calculateScores(answers);
    if (usesPhoto && photoAnalysis?.usable) {
      scoreKeys.forEach((key) => {
        scores[key] += photoAnalysis.scores[key] ?? 0;
      });
    }
    return getDiagnosisResultFromScores(scores);
  }, [answers, photoAnalysis, usesPhoto]);
  const shampoos = rankProducts("shampoo", result.scores);
  const treatments = rankPairedTreatments(shampoos, result.scores);
  const features = getUserFeatures(result.scores);

  useEffect(() => {
    if (!usesPhoto) return;

    const stored = sessionStorage.getItem("care-hair-photo-analysis");
    if (!stored) return;

    try {
      setPhotoAnalysis(JSON.parse(stored) as HairPhotoAnalysis);
    } catch {
      setPhotoAnalysis(null);
    }
  }, [usesPhoto]);

  return (
    <main className="pt-[var(--header-height)]">
      <section className="bg-soft py-16 md:py-24">
        <div className="mx-auto grid max-w-site gap-6 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-brand border border-line bg-white p-7 shadow-brand md:p-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-green">Your result</p>
            <h1 className="space-y-2 text-3xl font-medium leading-tight md:text-5xl">
              <span className="block">{result.hairBody}</span>
              <span className="block text-2xl text-ink/80 md:text-4xl">{result.hairShape}</span>
              {result.condition !== "バランス型" && (
                <span className="block text-2xl text-green md:text-4xl">{result.condition}</span>
              )}
            </h1>
            <p className="mt-6 text-muted">{result.feature}</p>
            {usesPhoto && (
              <p className="mt-4 rounded-brand bg-secondary px-4 py-3 text-sm font-semibold text-green">
                {photoAnalysis?.usable ? "写真診断の結果も反映しています。" : "写真から髪質を正確に判断できませんでした。質問内容のみで診断します。"}
              </p>
            )}
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
              <Link href="/search" className={buttonVariants({ variant: "outline" })}>
                条件から探す
              </Link>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-6 grid max-w-site gap-6 px-4 lg:grid-cols-[.9fr_1.1fr]">
          <Card as="section">
            <CardEyebrow>Your features</CardEyebrow>
            <h2 className="mt-3 text-2xl font-semibold">あなたの特徴</h2>
            <ul className="mt-5 grid gap-3 text-muted">
              {features.map((feature) => (
                <li key={feature} className="flex gap-3 leading-7">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
          <ShareResultCard
            hairBody={result.hairBody}
            hairShape={result.hairShape}
            shampoo={shampoos[0].name}
            treatment={treatments[0].name}
          />
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
          <SectionHeading eyebrow="Top 3" title="おすすめ商品" lead="診断結果に近いシャンプーとトリートメントを表示しています。" />
          <h3 className="mb-5 text-xl font-semibold">おすすめシャンプー</h3>
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

function getUserFeatures(scores: ScoreMap) {
  const items = [
    scores.dry >= 4 && "乾燥しやすい",
    scores.frizz >= 4 && "広がりやすい",
    scores.curly >= 4 && "湿気の影響を受けやすい",
    scores.damage >= 4 && "指通りが悪くなりやすい",
    scores.volume >= 4 && "根元がぺたんとしやすい",
    scores.scalp >= 4 && "頭皮のかゆみやフケに注意したい"
  ].filter(Boolean) as string[];

  return items.length ? items : ["大きなダメージは少なく、毎日の基本ケアを続けやすい髪質です"];
}
