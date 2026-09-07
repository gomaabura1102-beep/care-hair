"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Brain, Search, Star } from "lucide-react";
import { Card, CardEyebrow } from "@/components/ui/card";
import { concernOptions, hairTypeOptions } from "@/data/review-form-options";
import { filterOptions } from "@/data/product-insights";
import { products } from "@/data/products";
import { type UserReview } from "@/data/reviews";
import { ProductReviewForm } from "@/features/reviews/product-review-form";
import { analyzeReviews } from "@/lib/review-analysis";
import { useCareHairState } from "@/lib/user-state";

const hairTypeLabel = Object.fromEntries(hairTypeOptions.map((option) => [option.value, option.label]));
const all = "すべて";

export function ReviewPageContent() {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [hairType, setHairType] = useState(all);
  const [concern, setConcern] = useState(all);
  const [productId, setProductId] = useState(all);
  const [rating, setRating] = useState(all);
  const [age, setAge] = useState(all);
  const [sort, setSort] = useState("新しい順");
  const { state } = useCareHairState();
  const diagnosedHairType = state.diagnoses[0]?.labels.hairBody;

  const loadReviews = useCallback(async () => {
    setLoading(true); setLoadError("");
    try {
      const response = await fetch("/api/reviews", { cache: "no-store" });
      const body = await response.json() as UserReview[] & { error?: string };
      if (!response.ok) throw new Error(body.error ?? "口コミを読み込めませんでした。");
      setReviews(Array.isArray(body) ? body : []);
    } catch (error) { setLoadError(error instanceof Error ? error.message : "口コミを読み込めませんでした。"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const filteredReviews = useMemo(() => {
    const result = reviews.filter((review) => {
      const matchesHairType = hairType === all || hairTypeLabel[review.hairType] === hairType;
      const matchesConcern = concern === all || review.concerns.includes(concern);
      const matchesProduct = productId === all || review.productId === productId;
      const matchesRating = rating === all || review.rating >= Number(rating);
      const matchesAge = age === all || review.ageGroup === age;
      return matchesHairType && matchesConcern && matchesProduct && matchesRating && matchesAge;
    });
    return [...result].sort((a, b) => sort === "評価が高い順" ? b.rating - a.rating : b.createdAt.localeCompare(a.createdAt));
  }, [age, concern, hairType, productId, rating, reviews, sort]);

  const analysis = filteredReviews.length >= 10 ? analyzeReviews(filteredReviews) : null;

  return (
    <div className="grid min-w-0 gap-10 lg:grid-cols-[1fr_.85fr] lg:items-start">
      <div className="grid min-w-0 gap-6">
        <Card as="section" className="min-w-0 border-green/25 bg-secondary">
          <div className="flex min-w-0 items-start gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-green"><Brain className="h-5 w-5" /></div><div className="min-w-0"><CardEyebrow>Review trends</CardEyebrow><h2 className="mt-2 text-2xl font-semibold">口コミの傾向</h2>{analysis ? <div className="mt-5 grid gap-2 text-sm leading-7 text-muted"><p>公開口コミ {filteredReviews.length}件中、評価4以上は{analysis.highRatedCount}件です。</p><p>多く選ばれた悩み: {analysis.popularConcern}</p><p>{analysis.improvement}</p></div> : <p className="mt-4 text-sm leading-7 text-muted">口コミが10件以上集まると、評価や良い点・気になる点の傾向を表示します。現在は{filteredReviews.length}件です。</p>}</div></div>
        </Card>

        <Card as="section" className="min-w-0">
          <div className="mb-6 flex items-center gap-3"><Search className="h-5 w-5 text-green" /><h2 className="text-xl font-semibold">口コミを絞り込む</h2></div>
          {diagnosedHairType ? <button type="button" onClick={() => setHairType(diagnosedHairType)} className="mb-5 min-h-10 rounded-full border border-green px-4 text-xs font-semibold text-green">診断結果と同じ髪質（{diagnosedHairType}）</button> : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Select label="髪質" value={hairType} options={hairTypeOptions.map((option) => option.label)} onChange={setHairType} />
            <Select label="髪の悩み" value={concern} options={concernOptions} onChange={setConcern} />
            <Select label="商品名" value={productId} options={products.map((product) => ({ value: product.id, label: product.name }))} onChange={setProductId} />
            <Select label="評価" value={rating} options={filterOptions.ratings.map((value) => ({ value: value.replace(/[^\d.]/g, ""), label: value }))} onChange={setRating} />
            <Select label="年代" value={age} options={["中学生", "高校生", "大学生以上"]} onChange={setAge} />
            <Select label="表示順" value={sort} options={["新しい順", "評価が高い順"]} onChange={setSort} includeAll={false} />
          </div>
        </Card>

        {loading ? <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-muted">公開済みの口コミを読み込んでいます。</p> : null}
        {loadError ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"><p className="text-sm font-semibold text-red-700">{loadError}</p><button type="button" onClick={loadReviews} className="mt-4 rounded-full bg-green px-5 py-2 text-sm font-semibold text-white">再読み込み</button></div> : null}
        {!loading && !loadError && filteredReviews.length === 0 ? <div className="rounded-[20px] border border-dashed border-line bg-white p-10 text-center"><p className="text-xl font-semibold">条件に合う公開口コミはまだありません</p><p className="mt-3 text-sm leading-7 text-muted">最初の口コミを投稿できます。投稿内容は確認後に公開されます。</p></div> : null}
        <div className="grid gap-5">{filteredReviews.map((review) => <ReviewCard key={review.id} review={review} />)}</div>
      </div>
      <div className="lg:sticky lg:top-24"><ProductReviewForm /></div>
    </div>
  );
}

function ReviewCard({ review }: { review: UserReview }) {
  return <Card as="article"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">{review.name}</h2><p className="mt-1 text-xs text-muted">{review.ageGroup}・{hairTypeLabel[review.hairType]}・{review.usagePeriod}</p></div><Rating value={review.rating} /></div><p className="mt-5 font-semibold">{review.product}</p><div className="mt-3 flex flex-wrap gap-2">{review.concerns.map((item) => <span key={item} className="rounded-full bg-soft px-3 py-1 text-xs text-muted">{item}</span>)}</div><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-soft p-4"><p className="text-sm font-semibold text-green">良かったところ</p><p className="mt-2 text-sm leading-7 text-muted">{review.good}</p></div><div className="rounded-xl bg-soft p-4"><p className="text-sm font-semibold text-green">気になったところ</p><p className="mt-2 text-sm leading-7 text-muted">{review.concern}</p></div></div><p className="mt-4 text-xs text-muted">香り: {review.fragrance}・仕上がり: {review.finish}・また使いたい: {review.useAgain}</p></Card>;
}

function Rating({ value }: { value: number }) { return <div className="flex gap-1 text-[#d69a2d]" aria-label={`${value}点`}>{[1,2,3,4,5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= value ? "fill-current" : "text-line"}`} />)}</div>; }

type Option = string | { value: string; label: string };
function Select({ label, value, options, onChange, includeAll = true }: { label: string; value: string; options: Option[]; onChange: (value: string) => void; includeAll?: boolean }) { return <label className="grid min-w-0 gap-2 text-sm font-semibold">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 min-w-0 w-full rounded-xl border border-line bg-white px-4 font-normal outline-none focus:border-green">{includeAll ? <option value={all}>{all}</option> : null}{options.map((option) => { const normalized = typeof option === "string" ? { value: option, label: option } : option; return <option key={normalized.value} value={normalized.value}>{normalized.label}</option>; })}</select></label>; }
