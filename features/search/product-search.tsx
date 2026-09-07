"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Scale, SlidersHorizontal, Star } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Card, CardEyebrow } from "@/components/ui/card";
import { filterOptions, productsWithInsights } from "@/data/product-insights";
import { useCareHairState } from "@/lib/user-state";

const empty = "すべて";

export function ProductSearch() {
  const [hairType, setHairType] = useState(empty);
  const [concern, setConcern] = useState(empty);
  const [price, setPrice] = useState(empty);
  const [finish, setFinish] = useState(empty);
  const [weight, setWeight] = useState(empty);
  const [rating, setRating] = useState(empty);
  const { state } = useCareHairState();

  useEffect(() => {
    const requestedConcern = new URLSearchParams(window.location.search).get("concern");
    if (requestedConcern && filterOptions.concerns.includes(requestedConcern)) setConcern(requestedConcern);
  }, []);

  const filteredProducts = useMemo(() => {
    const minRating = rating === empty ? 0 : Number(rating.replace(/[^\d.]/g, ""));
    const priceRange = filterOptions.priceRanges.find((range) => range.label === price);

    return productsWithInsights.filter((product) => {
      const matchesHairType = hairType === empty || product.insight.hairTypes.includes(hairType);
      const matchesConcern = concern === empty || product.insight.concerns.includes(concern);
      const matchesPrice = !priceRange || (product.insight.priceValue >= priceRange.min && product.insight.priceValue <= priceRange.max);
      const matchesFinish = finish === empty || product.insight.finishCategory === finish;
      const matchesWeight = weight === empty || product.insight.weight === weight;
      const matchesRating = rating === empty || (product.insight.rating !== null && product.insight.rating >= minRating);
      return matchesHairType && matchesConcern && matchesPrice && matchesFinish && matchesWeight && matchesRating;
    });
  }, [concern, finish, hairType, price, rating, weight]);

  return (
    <div className="grid gap-8">
      <Card as="section" className="p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-green">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <CardEyebrow>Search</CardEyebrow>
            <h2 className="mt-2 text-2xl font-semibold">条件から候補を探す</h2>
            <p className="mt-2 text-sm leading-7 text-muted">気になる条件だけ選べます。未選択の項目は検索に影響しません。</p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select label="髪質" value={hairType} options={filterOptions.hairTypes} onChange={setHairType} />
          <Select label="髪の悩み" value={concern} options={filterOptions.concerns} onChange={setConcern} />
          <Select label="価格帯" value={price} options={filterOptions.priceRanges.map((range) => range.label)} onChange={setPrice} />
          <Select label="仕上がり" value={finish} options={filterOptions.finishes} onChange={setFinish} />
          <Select label="重さ" value={weight} options={filterOptions.weights} onChange={setWeight} />
          <Select label="Amazon評価" value={rating} options={filterOptions.ratings} onChange={setRating} />
        </div>
      </Card>

      {state.comparisonProductIds.length > 0 ? (
        <div className="sticky top-[calc(var(--header-height)+.75rem)] z-20 flex flex-col gap-3 rounded-2xl border border-green/30 bg-white/95 p-4 shadow-brand backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold"><Scale className="h-4 w-4 text-green" />{state.comparisonProductIds.length} / 3商品を比較に追加中</p>
          <Link href="/compare" className="inline-flex min-h-11 items-center justify-center rounded-full bg-green px-5 text-sm font-semibold text-white">比較表を見る</Link>
        </div>
      ) : null}

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-green"><Star className="h-4 w-4" />検索結果</p>
          <h2 className="mt-1 text-2xl font-semibold">{filteredProducts.length}件の商品候補</h2>
        </div>
      </div>
      {filteredProducts.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-white p-10 text-center">
          <p className="font-semibold">条件に合う商品がありません</p>
          <button type="button" className="mt-3 text-sm font-semibold text-green underline" onClick={() => { setHairType(empty); setConcern(empty); setPrice(empty); setFinish(empty); setWeight(empty); setRating(empty); }}>条件をリセット</button>
        </div>
      )}
    </div>
  );
}

type SelectProps = { label: string; value: string; options: readonly string[]; onChange: (value: string) => void };

function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 rounded-xl border border-line bg-white px-4 font-normal outline-none transition focus:border-green">
        <option value={empty}>{empty}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
