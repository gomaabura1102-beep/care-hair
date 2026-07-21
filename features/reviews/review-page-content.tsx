"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Brain, Search, Star } from "lucide-react";
import { Card, CardEyebrow } from "@/components/ui/card";
import { allReviewProducts, concernOptions, hairTypeOptions } from "@/data/review-form-options";
import { filterOptions, productsWithInsights } from "@/data/product-insights";
import { initialReviews, type UserReview } from "@/data/reviews";
import { ProductReviewForm } from "@/features/reviews/product-review-form";
import { analyzeReviews, summarizeProductReviews } from "@/lib/review-analysis";

const hairTypeLabel = Object.fromEntries(hairTypeOptions.map((option) => [option.value, option.label]));
const all = "すべて";

function Rating({ value }: { value: number }) {
  return (
    <div className="flex gap-1 text-lg text-green" aria-label={`${value}点`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={star <= value ? "h-4 w-4 fill-current" : "h-4 w-4 text-line"} />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: UserReview }) {
  const summary = summarizeProductReviews(review.product);

  return (
    <Card as="article">
      <h2 className="text-xl font-medium">{review.name}</h2>
      <div className="mt-4 grid gap-4 text-sm">
        <Info label="髪質">
          <Badge>{hairTypeLabel[review.hairType]}</Badge>
        </Info>
        <Info label="髪の悩み">
          <div className="flex flex-wrap gap-2">
            {review.concerns.map((concern) => <Badge key={concern}>{concern}</Badge>)}
          </div>
        </Info>
        <Info label="使用した商品"><p className="text-muted">{review.product}</p></Info>
        <Info label="評価"><Rating value={review.rating} /></Info>
        <Info label="良かったところ"><p className="leading-7 text-muted">{review.good}</p></Info>
        <Info label="気になったところ"><p className="leading-7 text-muted">{review.concern}</p></Info>
        <div className="rounded-brand bg-secondary p-4">
          <p className="font-semibold text-green">レビューをAIが要約</p>
          <ul className="mt-3 grid gap-2 text-sm text-muted">
            {summary.slice(0, 3).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export function ReviewPageContent() {
  const [reviews, setReviews] = useState<UserReview[]>(initialReviews);
  const [hairType, setHairType] = useState(all);
  const [concern, setConcern] = useState(all);
  const [product, setProduct] = useState(all);
  const [brand, setBrand] = useState(all);
  const [rating, setRating] = useState(all);
  const [scent, setScent] = useState(all);
  const [age, setAge] = useState(all);
  const [sort, setSort] = useState("新しい順");

  const filteredReviews = useMemo(() => {
    const brandProducts = productsWithInsights.filter((item) => item.insight.brand === brand).map((item) => item.name);
    const scentProducts = productsWithInsights.filter((item) => item.insight.scentCategory === scent).map((item) => item.name);

    const result = reviews.filter((review) => {
      const matchesHairType = hairType === all || hairTypeLabel[review.hairType] === hairType;
      const matchesConcern = concern === all || review.concerns.includes(concern);
      const matchesProduct = product === all || review.product.includes(product);
      const matchesBrand = brand === all || brandProducts.some((name) => name.includes(review.product) || review.product.includes(name.split(" ")[0]));
      const matchesRating = rating === all || review.rating >= Number(rating);
      const matchesScent = scent === all || scentProducts.some((name) => name.includes(review.product) || review.product.includes(name.split(" ")[0]));
      const matchesAge = age === all || review.name.includes(age);

      return matchesHairType && matchesConcern && matchesProduct && matchesBrand && matchesRating && matchesScent && matchesAge;
    });

    return [...result].sort((a, b) => sort === "評価が高い順" ? b.rating - a.rating : b.id.localeCompare(a.id));
  }, [age, brand, concern, hairType, product, rating, reviews, scent, sort]);

  const analysis = analyzeReviews(filteredReviews);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-start">
      <div className="grid gap-6">
        <Card as="section" className="border-accent/30 bg-secondary">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-green">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <CardEyebrow>AI analysis</CardEyebrow>
              <h2 className="mt-2 text-2xl font-semibold">口コミのAI分析</h2>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-muted md:grid-cols-2">
                <p>満足度が高い割合: {analysis.satisfaction}</p>
                <p>人気の悩み: {analysis.popularConcern}</p>
                <p>{analysis.recommendedFor}</p>
                <p>{analysis.notFor}</p>
                <p>{analysis.reason}</p>
                <p>{analysis.improvement}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card as="section">
          <div className="mb-6 flex items-center gap-3">
            <Search className="h-5 w-5 text-green" />
            <h2 className="text-xl font-semibold">口コミを絞り込む</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Select label="髪質" value={hairType} options={hairTypeOptions.map((option) => option.label)} onChange={setHairType} />
            <Select label="髪の悩み" value={concern} options={concernOptions} onChange={setConcern} />
            <Select label="商品名" value={product} options={allReviewProducts} onChange={setProduct} />
            <Select label="ブランド" value={brand} options={filterOptions.brands} onChange={setBrand} />
            <Select label="評価" value={rating} options={["5", "4", "3", "2", "1"]} onChange={setRating} />
            <Select label="香り" value={scent} options={filterOptions.scents} onChange={setScent} />
            <Select label="年代" value={age} options={["高校1年", "高校2年", "高校3年", "中学生"]} onChange={setAge} />
            <Select label="表示順" value={sort} options={["新しい順", "評価が高い順"]} onChange={setSort} includeAll={false} />
          </div>
        </Card>

        <div className="grid gap-5">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>

      <div className="lg:sticky lg:top-28">
        <ProductReviewForm onSubmitReview={(review) => setReviews((current) => [review, ...current])} />
      </div>
    </div>
  );
}

function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-semibold text-green">{label}</p>
      {children}
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-full bg-soft px-3 py-1 text-muted">{children}</span>;
}

function Select({ label, value, options, onChange, includeAll = true }: { label: string; value: string; options: string[]; onChange: (value: string) => void; includeAll?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 rounded-brand border border-line bg-white px-4 font-normal outline-none transition focus:border-green"
      >
        {includeAll ? <option value={all}>{all}</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
