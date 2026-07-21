"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, Star } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Card, CardEyebrow } from "@/components/ui/card";
import { filterOptions, productsWithInsights } from "@/data/product-insights";

const empty = "すべて";

export function ProductSearch() {
  const [hairType, setHairType] = useState(empty);
  const [concern, setConcern] = useState(empty);
  const [scent, setScent] = useState(empty);
  const [rating, setRating] = useState(empty);

  const filteredProducts = useMemo(() => {
    const minRating = rating === empty ? 0 : Number(rating.replace(/[^\d.]/g, ""));

    return productsWithInsights.filter((product) => {
      const matchesHairType = hairType === empty || product.insight.hairTypes.includes(hairType);
      const matchesConcern = concern === empty || product.insight.concerns.includes(concern);
      const matchesScent = scent === empty || product.insight.scentCategory === scent;
      const matchesRating = product.insight.rating >= minRating;

      return matchesHairType && matchesConcern && matchesScent && matchesRating;
    });
  }, [concern, hairType, rating, scent]);

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
            <p className="mt-2 text-sm leading-7 text-muted">
              髪質・悩み・香り・評価だけに絞って、迷わず候補を探せるようにしました。診断結果とあわせて使う補助検索です。
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-4">
          <Select label="髪質" value={hairType} options={filterOptions.hairTypes} onChange={setHairType} />
          <Select label="髪の悩み" value={concern} options={filterOptions.concerns} onChange={setConcern} />
          <Select label="香り" value={scent} options={filterOptions.scents} onChange={setScent} />
          <Select label="評価" value={rating} options={filterOptions.ratings} onChange={setRating} />
        </div>
      </Card>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-green">
            <Star className="h-4 w-4" />
            検索結果
          </p>
          <h2 className="mt-1 text-2xl font-semibold">{filteredProducts.length}件の商品候補</h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

type SelectProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
};

function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 rounded-brand border border-line bg-white px-4 font-normal outline-none transition focus:border-green"
      >
        <option value={empty}>{empty}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
