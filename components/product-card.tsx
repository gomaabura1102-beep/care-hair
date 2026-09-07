"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Scale, Star } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { getProductInsight } from "@/data/product-insights";
import { useCareHairState } from "@/lib/user-state";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  recommendation?: {
    label: "最有力" | "有力" | "候補";
    reasons: string[];
  };
};

export function ProductCard({ product, recommendation }: ProductCardProps) {
  const insight = getProductInsight(product);
  const { state, toggleFavorite, toggleComparison } = useCareHairState();
  const [message, setMessage] = useState("");
  const favorite = state.favoriteProductIds.includes(product.id);
  const compared = state.comparisonProductIds.includes(product.id);

  const changeComparison = () => {
    const result = toggleComparison(product.id);
    setMessage(result.full ? "比較できるのは3商品までです。" : result.added ? "比較に追加しました。" : "比較から外しました。");
    window.setTimeout(() => setMessage(""), 2200);
  };

  return (
    <Card as="article" interactive className="relative flex h-full flex-col overflow-hidden p-0">
      {recommendation ? (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-green px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {recommendation.label}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => toggleFavorite(product.id)}
        className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-line bg-white/95 text-green shadow-sm transition hover:scale-105"
        aria-label={favorite ? `${product.name}をお気に入りから外す` : `${product.name}をお気に入りに追加`}
        aria-pressed={favorite}
      >
        <Heart className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} />
      </button>

      <Link href={`/products/${product.id}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-5 transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{insight.brand}</p>
        <Link href={`/products/${product.id}`} className="mt-2 text-lg font-semibold leading-snug transition hover:text-green">
          {product.name}
        </Link>
        <p className="mt-2 font-semibold text-green">{product.price}</p>

        <div className="mt-3 flex min-h-6 items-center gap-2 text-xs">
          {insight.rating !== null && insight.reviewCount !== null ? (
            <>
              <span className="flex text-[#d69a2d]" aria-label={`Amazon評価 ${insight.rating}点`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-3.5 w-3.5 ${star <= Math.round(insight.rating ?? 0) ? "fill-current" : "opacity-25"}`} />
                ))}
              </span>
              <span>{insight.rating}</span>
              <span className="text-muted">Amazon {insight.reviewCount}件</span>
            </>
          ) : (
            <span className="text-muted">Amazon評価は商品ページで確認</span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[...insight.hairTypes, ...insight.concerns].slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-soft px-3 py-1 text-xs text-muted">{tag}</span>
          ))}
        </div>

        {recommendation ? (
          <details className="mt-5 rounded-xl border border-line bg-soft p-4">
            <summary className="cursor-pointer text-sm font-semibold text-green">なぜおすすめ？</summary>
            <ul className="mt-3 grid gap-2 text-xs leading-6 text-muted">
              {recommendation.reasons.map((reason) => <li key={reason}>・{reason}</li>)}
            </ul>
          </details>
        ) : null}

        <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={changeComparison}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${compared ? "border-green bg-secondary text-green" : "border-line text-ink hover:border-green"}`}
            aria-pressed={compared}
          >
            <Scale className="h-4 w-4" /> {compared ? "比較中" : "比較する"}
          </button>
          <Link href={`/products/${product.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-green px-4 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]">
            詳しく見る <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {message ? <p className="mt-3 text-center text-xs font-semibold text-green" role="status">{message}</p> : null}
      </div>
    </Card>
  );
}
