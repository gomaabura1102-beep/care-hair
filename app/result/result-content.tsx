"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DiagnosisSteps } from "@/components/diagnosis-steps";
import { ProductCard } from "@/components/product-card";
import { ScoreBars } from "@/components/score-bars";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardEyebrow } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { DeleteDiagnosisButton } from "@/features/result/delete-diagnosis-button";
import { ShareResultCard } from "@/features/result/share-result-card";
import { getPriorityCare, rankPairedTreatments, rankProductRecommendations, rankProducts } from "@/lib/diagnosis";
import { products } from "@/data/products";
import { readPendingDiagnosisContext, saveDiagnosisToDevice } from "@/lib/user-state";
import type { PublicDiagnosis, ScoreMap } from "@/types/diagnosis";

export function ResultContent() {
  const searchParams = useSearchParams();
  const diagnosisId = searchParams.get("id");
  const [diagnosis, setDiagnosis] = useState<PublicDiagnosis | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!diagnosisId) {
      setError("診断結果を表示するためのIDがありません。");
      return;
    }
    const controller = new AbortController();
    fetch(`/api/diagnoses/${diagnosisId}/result`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const body = (await response.json()) as PublicDiagnosis & { error?: string };
        if (!response.ok) throw new Error(body.error ?? "診断結果を読み込めませんでした。");
        setDiagnosis(body);
      })
      .catch((fetchError) => {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setError(fetchError instanceof Error ? fetchError.message : "診断結果を読み込めませんでした。");
      });
    return () => controller.abort();
  }, [diagnosisId]);

  useEffect(() => {
    if (!diagnosis) return;
    const recommendations = rankProductRecommendations("shampoo", diagnosis.result.scores);
    const pending = readPendingDiagnosisContext(diagnosis.diagnosisId);
    saveDiagnosisToDevice({
      diagnosisId: diagnosis.diagnosisId,
      createdAt: diagnosis.createdAt,
      result: diagnosis.result,
      recommendedProductIds: recommendations.map((item) => item.productId),
      mode: diagnosis.mode,
      currentProductId: pending?.currentProductId ?? null
    });
  }, [diagnosis]);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center px-4 pt-[var(--header-height)]">
        <div className="max-w-lg rounded-brand border border-line bg-white p-8 text-center shadow-brand">
          <h1 className="text-2xl font-semibold">診断結果を表示できません</h1>
          <p className="mt-4 text-sm leading-7 text-muted">{error}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button type="button" onClick={() => window.location.reload()} className={buttonVariants()}>もう一度読み込む</button><Link href="/diagnosis" className={buttonVariants({ variant: "outline" })}>診断をはじめる</Link></div>
        </div>
      </main>
    );
  }

  if (!diagnosis) {
    return (
      <main className="grid min-h-screen place-items-center pt-[var(--header-height)]">
        <p className="text-sm text-muted">診断結果を安全に読み込んでいます。</p>
      </main>
    );
  }

  const result = diagnosis.result;
  const shampoos = rankProducts("shampoo", result.scores);
  const treatments = rankPairedTreatments(shampoos, result.scores);
  const shampooRecommendations = rankProductRecommendations("shampoo", result.scores);
  const treatmentRecommendations = rankProductRecommendations("treatment", result.scores);
  const features = getUserFeatures(result.scores);
  const priorityCare = getPriorityCare(result.scores);
  const pending = readPendingDiagnosisContext(diagnosis.diagnosisId);
  const currentProduct = pending?.currentProductId ? products.find((product) => product.id === pending.currentProductId) : null;
  const currentProductIsRecommended = currentProduct ? shampooRecommendations.some((item) => item.productId === currentProduct.id) : false;

  return (
    <main className="pt-[var(--header-height)]">
      <section className="bg-soft py-16 md:py-24">
        <div className="mx-auto max-w-site px-4">
          <DiagnosisSteps current={diagnosis.mode === "photo" ? 3 : 2} mode={diagnosis.mode} />
        </div>
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
            <p className="mt-4 rounded-brand bg-secondary px-4 py-3 text-sm font-semibold text-green">
              この結果は質問への回答だけから判定しています。写真の解析結果は使用していません。
            </p>
            <ScoreBars scores={result.scores} />
          </div>
          <div className="rounded-brand border border-line bg-white p-7 md:p-10">
            <h2 className="text-2xl font-semibold">優先したいケア TOP3</h2>
            <ol className="mt-5 grid gap-3">
              {priorityCare.map((item, index) => (
                <li key={item.label} className="grid grid-cols-[36px_1fr] gap-3 rounded-brand bg-soft p-4"><span className="grid h-9 w-9 place-items-center rounded-full bg-green text-sm font-semibold text-white">{index + 1}</span><span><strong className="block">{item.label}</strong><span className="mt-1 block text-sm leading-6 text-muted">{item.detail}</span></span></li>
              ))}
            </ol>
            <details className="mt-6 rounded-brand border border-line p-4"><summary className="cursor-pointer font-semibold text-green">判定の考え方を見る</summary><p className="mt-3 text-sm leading-7 text-muted">{result.reason}</p></details>
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
            {currentProduct ? (
              <div className="mt-5 rounded-brand border border-green/25 bg-secondary p-5"><p className="text-sm font-semibold text-green">今使っている商品について</p><p className="mt-2 font-semibold">{currentProduct.name}</p><p className="mt-2 text-sm leading-7 text-muted">{currentProductIsRecommended ? "今回の回答との重なりがあります。使用感に困っていなければ、急いで替える必要はありません。" : "今の悩みが続いている場合は、上位候補と特徴を比べてから変更を検討できます。"}</p></div>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/diagnosis" className={buttonVariants()}>
                もう一度診断する
              </Link>
              <Link href="/search" className={buttonVariants({ variant: "outline" })}>
                条件から探す
              </Link>
            </div>
            <p className="mt-5 break-all text-xs text-muted">診断ID：{diagnosis.diagnosisId}</p>
            <DeleteDiagnosisButton diagnosisId={diagnosis.diagnosisId} />
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
          <SectionHeading eyebrow="Top 3" title="おすすめ商品" lead="回答と商品特徴の重なりが大きい順です。一致率ではなく、理由が確認できる3候補を表示しています。" />
          <h3 className="mb-5 text-xl font-semibold">おすすめシャンプー</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {shampoos.map((product, index) => (
              <ProductCard key={product.id} product={product} recommendation={{ label: shampooRecommendations[index].label, reasons: shampooRecommendations[index].reasons }} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-soft py-20 md:py-28">
        <div className="mx-auto max-w-site px-4">
          <SectionHeading eyebrow="Top 3" title="おすすめトリートメント" />
          <div className="grid gap-6 md:grid-cols-3">
            {treatments.map((product, index) => (
              <ProductCard key={product.id} product={product} recommendation={{ label: treatmentRecommendations.find((item) => item.productId === product.id)?.label ?? (["最有力", "有力", "候補"] as const)[index], reasons: treatmentRecommendations.find((item) => item.productId === product.id)?.reasons ?? ["おすすめシャンプーと同じシリーズで合わせやすい"] }} />
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
