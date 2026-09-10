"use client";

import { CheckCircle2, ChevronUp, ClipboardCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { getDiagnosisResultFromScores, getRecommendationReasons } from "@/lib/diagnosis";
import type { AiExplanation, AiExplanationContext } from "@/types/ai-explanation";
import type { ScoreKey, ScoreMap } from "@/types/diagnosis";
import type { Product } from "@/types/product";

type AiWhyRecommendedProps = {
  productId: string;
  context: AiExplanationContext;
};

const concernLabels: Array<{ key: ScoreKey; label: string }> = [
  { key: "dry", label: "乾燥・パサつき" },
  { key: "frizz", label: "広がり" },
  { key: "curly", label: "くせ・うねり" },
  { key: "damage", label: "ダメージ" },
  { key: "scalp", label: "頭皮の不快感" },
  { key: "volume", label: "ボリューム不足" },
  { key: "fine", label: "細毛・軟毛" },
  { key: "coarse", label: "硬毛・剛毛" },
  { key: "oily", label: "頭皮のベタつき" }
];

export function AiWhyRecommended({ productId, context }: AiWhyRecommendedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const explanation = useMemo(() => {
    const product = products.find((item) => item.id === productId);
    return product ? buildExplanation(product, context.scores) : null;
  }, [context.scores, productId]);

  if (!explanation) return null;

  if (!isOpen) {
    return (
      <button type="button" onClick={() => setIsOpen(true)} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-green bg-white px-4 text-sm font-semibold text-green transition hover:bg-secondary" aria-expanded="false">
        <ClipboardCheck className="h-4 w-4" /> Care Hairの詳しい理由を見る
      </button>
    );
  }

  return (
    <div className="mt-4 border-t border-line pt-4">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-sm font-semibold text-ink">診断結果から詳しく見る</p><p className="mt-1 text-xs leading-5 text-muted">Care Hairの商品情報と診断ロジックから表示しています。</p></div>
        <button type="button" onClick={() => setIsOpen(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-white hover:text-green" aria-label="詳しいおすすめ理由を閉じる" aria-expanded="true"><ChevronUp className="h-4 w-4" /></button>
      </div>

      <div className="mt-5 rounded-xl border border-green/20 bg-white p-4 text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-green">Care Hair guide</p>
        <h4 className="mt-2 text-base font-semibold leading-6 text-ink">{explanation.headline}</h4>
        <p className="mt-3 text-sm leading-7 text-muted">{explanation.explanation}</p>
        <div className="mt-4"><p className="text-xs font-semibold text-ink">合いやすい理由</p><ol className="mt-2 grid gap-2 text-xs leading-6 text-muted">{explanation.reasons.map((reason, index) => <li key={`${index}-${reason}`} className="grid grid-cols-[22px_1fr] gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-secondary text-[10px] font-bold text-green">{index + 1}</span><span>{reason}</span></li>)}</ol></div>
        <div className="mt-4 rounded-lg bg-soft p-3"><p className="text-xs font-semibold text-ink">注意点</p><p className="mt-1 text-xs leading-6 text-muted">{explanation.caution}</p></div>
        <div className="mt-4 border-t border-line pt-3"><p className="flex items-center gap-1.5 text-xs font-semibold text-green"><CheckCircle2 className="h-3.5 w-3.5" /> 購入前の確認</p><p className="mt-1 text-xs leading-6 text-ink">{explanation.followUpQuestion}</p></div>
      </div>
      <p className="mt-3 text-[11px] leading-5 text-muted">外部AIへの通信や入力内容の保存は行いません。</p>
    </div>
  );
}

function buildExplanation(product: Product, scores: ScoreMap): AiExplanation {
  const diagnosis = getDiagnosisResultFromScores(scores);
  const mainConcern = concernLabels.reduce((current, item) => scores[item.key] > scores[current.key] ? item : current);
  const reasons = unique([
    ...getRecommendationReasons(product, scores),
    `${product.fit}を想定した商品です。`,
    product.point,
    `仕上がりの特徴は「${product.texture}」です。`
  ]).slice(0, 3) as [string, string, string];

  return {
    headline: `${mainConcern.label}を意識した候補`,
    explanation: `${diagnosis.hairBody}・${diagnosis.hairShape}という診断結果で、特に「${mainConcern.label}」を優先したい状態です。${product.name}は「${trimPeriod(product.feature)}」と登録されています。Care Hairの商品情報と回答の重なりから候補にしています。`,
    reasons,
    caution: getCaution(product, scores),
    followUpQuestion: `香りは「${product.scent}」、仕上がりは「${product.texture}」です。好みに合うか購入前に確認してください。`
  };
}

function getCaution(product: Product, scores: ScoreMap) {
  const isMoistProduct = (product.scores.moist ?? 0) >= 5 || product.texture.includes("しっとり");
  if (isMoistProduct && scores.fine > scores.coarse) return "細毛・軟毛は量をつけすぎると重く感じる場合があります。まず少なめから試してください。";
  if (scores.scalp >= 6) return "頭皮に違和感があるときは使用を中止し、すすぎ残しがないよう丁寧に洗い流してください。";
  if (scores.oily >= 6) return "すっきり感には個人差があります。洗いすぎを避け、頭皮の状態を見ながら使用してください。";
  return "仕上がりや香りの感じ方には個人差があります。少量から使い、髪の状態を見ながら調整してください。";
}

function trimPeriod(value: string) {
  return value.replace(/[。．.!！]+$/, "");
}

function unique(values: string[]) {
  return values.filter((value, index) => values.indexOf(value) === index);
}
