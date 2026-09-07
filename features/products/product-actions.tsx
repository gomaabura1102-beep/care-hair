"use client";

import Link from "next/link";
import { Check, Heart, Play, Scale } from "lucide-react";
import { useEffect, useState } from "react";
import { startUsingProduct, useCareHairState } from "@/lib/user-state";

export function ProductActions({ productId }: { productId: string }) {
  const { state, toggleFavorite, toggleComparison, markRecentlyViewed } = useCareHairState();
  const [message, setMessage] = useState("");
  const favorite = state.favoriteProductIds.includes(productId);
  const compared = state.comparisonProductIds.includes(productId);
  const alreadyUsing = state.usages.some((usage) => usage.productId === productId && !usage.feedback);

  useEffect(() => markRecentlyViewed(productId), [markRecentlyViewed, productId]);

  const addComparison = () => {
    const result = toggleComparison(productId);
    setMessage(result.full ? "比較できるのは3商品までです。" : result.added ? "比較に追加しました。" : "比較から外しました。");
  };

  const start = () => {
    const latest = state.diagnoses[0];
    startUsingProduct({
      productId,
      diagnosisId: latest?.diagnosisId,
      hairType: latest?.labels.hairBody,
      concerns: latest ? concernLabels(latest.scores) : []
    });
    setMessage("使用開始日をマイページに記録しました。");
  };

  return (
    <section className="mt-8 rounded-[20px] border border-line bg-white p-5 shadow-brand sm:p-6">
      <h2 className="text-lg font-semibold">あとで迷わないように保存</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={() => toggleFavorite(productId)} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold ${favorite ? "border-green bg-secondary text-green" : "border-line hover:border-green"}`} aria-pressed={favorite}>
          <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />{favorite ? "お気に入り済み" : "お気に入り"}
        </button>
        <button type="button" onClick={addComparison} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold ${compared ? "border-green bg-secondary text-green" : "border-line hover:border-green"}`} aria-pressed={compared}>
          <Scale className="h-4 w-4" />{compared ? "比較中" : "比較に追加"}
        </button>
        <button type="button" onClick={start} disabled={alreadyUsing} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green px-4 text-sm font-semibold text-white disabled:bg-muted">
          {alreadyUsing ? <Check className="h-4 w-4" /> : <Play className="h-4 w-4" />}{alreadyUsing ? "使用中" : "この商品を使い始める"}
        </button>
      </div>
      {compared ? <Link href="/compare" className="mt-4 inline-block text-sm font-semibold text-green underline underline-offset-4">比較表を見る</Link> : null}
      {message ? <p className="mt-4 rounded-xl bg-soft px-4 py-3 text-sm font-semibold text-green" role="status">{message}</p> : null}
      <p className="mt-4 text-xs leading-6 text-muted">お気に入り・使用記録はこの端末に保存されます。約2週間後、マイページから使用感を記録できます。</p>
    </section>
  );
}

function concernLabels(scores: Record<string, number>) {
  return [
    scores.dry >= 4 && "パサつき",
    scores.frizz >= 4 && "広がり",
    scores.curly >= 4 && "くせ毛・うねり",
    scores.damage >= 4 && "ダメージ",
    scores.scalp >= 4 && "フケ・かゆみ"
  ].filter(Boolean) as string[];
}
