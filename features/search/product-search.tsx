"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Card, CardEyebrow } from "@/components/ui/card";
import { filterOptions, productsWithInsights } from "@/data/product-insights";

const empty = "すべて";

export function ProductSearch() {
  const [keyword, setKeyword] = useState("");
  const [hairType, setHairType] = useState(empty);
  const [concern, setConcern] = useState(empty);
  const [scent, setScent] = useState(empty);
  const [brand, setBrand] = useState(empty);
  const [priceRange, setPriceRange] = useState(empty);

  const filteredProducts = useMemo(() => {
    const selectedRange = filterOptions.priceRanges.find((range) => range.label === priceRange);

    return productsWithInsights.filter((product) => {
      const text = `${product.name} ${product.feature} ${product.fit} ${product.insight.brand}`.toLowerCase();
      const matchesKeyword = keyword ? text.includes(keyword.toLowerCase()) : true;
      const matchesHairType = hairType === empty || product.insight.hairTypes.includes(hairType);
      const matchesConcern = concern === empty || product.insight.concerns.includes(concern);
      const matchesScent = scent === empty || product.insight.scent === scent;
      const matchesBrand = brand === empty || product.insight.brand === brand;
      const matchesPrice = !selectedRange || (product.insight.priceValue >= selectedRange.min && product.insight.priceValue <= selectedRange.max);

      return matchesKeyword && matchesHairType && matchesConcern && matchesScent && matchesBrand && matchesPrice;
    });
  }, [brand, concern, hairType, keyword, priceRange, scent]);

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
            <p className="mt-2 text-sm text-muted">
              診断結果とあわせて使える補助検索です。気になる条件を入れると、近い商品候補だけを表示します。
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-semibold">
            商品名・特徴
            <span className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                className="min-h-12 w-full rounded-brand border border-line pl-11 pr-4 font-normal outline-none transition focus:border-green"
                placeholder="THE ANSWER など"
              />
            </span>
          </label>
          <Select label="髪質" value={hairType} options={filterOptions.hairTypes} onChange={setHairType} />
          <Select label="悩み" value={concern} options={filterOptions.concerns} onChange={setConcern} />
          <Select label="香り" value={scent} options={filterOptions.scents} onChange={setScent} />
          <Select label="ブランド" value={brand} options={filterOptions.brands} onChange={setBrand} />
          <Select label="価格帯" value={priceRange} options={filterOptions.priceRanges.map((range) => range.label)} onChange={setPriceRange} />
        </div>
      </Card>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-green">検索結果</p>
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
  options: string[];
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
