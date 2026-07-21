"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardEyebrow } from "@/components/ui/card";
import {
  allReviewProducts,
  concernOptions,
  hairTypeOptions,
  hairTypeProducts,
  type ReviewHairType
} from "@/data/review-form-options";
import type { UserReview } from "@/data/reviews";

type ProductReviewFormProps = {
  onSubmitReview?: (review: UserReview) => void;
};

export function ProductReviewForm({ onSubmitReview }: ProductReviewFormProps) {
  const [hairType, setHairType] = useState<ReviewHairType>("fine");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [rating, setRating] = useState(5);
  const [sent, setSent] = useState(false);

  const recommendedProducts = useMemo(() => hairTypeProducts[hairType], [hairType]);
  const otherProducts = useMemo(
    () => allReviewProducts.filter((productName) => !recommendedProducts.includes(productName)),
    [recommendedProducts]
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const review: UserReview = {
      id: `review-${Date.now()}`,
      name: String(formData.get("name") || "匿名"),
      hairType,
      concerns,
      product: String(formData.get("product") || recommendedProducts[0]),
      rating,
      good: String(formData.get("good") || ""),
      concern: String(formData.get("concern") || "")
    };

    onSubmitReview?.(review);
    setHairType("fine");
    setConcerns([]);
    setRating(5);
    setSent(true);
    event.currentTarget.reset();
  };

  const toggleConcern = (concern: string) => {
    setConcerns((current) =>
      current.includes(concern) ? current.filter((item) => item !== concern) : [...current, concern]
    );
  };

  return (
    <Card as="section" className="mt-16">
      <CardEyebrow>Review</CardEyebrow>
      <h2 className="mt-3 text-3xl font-medium">口コミを入力する</h2>
      <form className="mt-8 grid gap-5" onSubmit={submit}>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          名前（ニックネーム可）
          <input
            name="name"
            className="min-h-12 rounded-brand border border-line px-4 font-normal outline-none transition focus:border-green"
            placeholder="例: 高校2年・男子"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-ink">
          髪質
          <select
            name="hairType"
            value={hairType}
            onChange={(event) => {
              setHairType(event.target.value as ReviewHairType);
              setSent(false);
            }}
            className="min-h-12 rounded-brand border border-line bg-white px-4 font-normal outline-none transition focus:border-green"
          >
            {hairTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="rounded-brand border border-line p-4">
          <legend className="px-2 text-sm font-semibold text-ink">髪の悩み</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {concernOptions.map((concern) => (
              <label key={concern} className="flex items-center gap-3 text-sm text-muted">
                <input
                  name="concerns"
                  type="checkbox"
                  value={concern}
                  checked={concerns.includes(concern)}
                  onChange={() => toggleConcern(concern)}
                  className="h-4 w-4 accent-green"
                />
                {concern}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="grid gap-2 text-sm font-semibold text-ink">
          使用した商品
          <select
            name="product"
            className="min-h-12 rounded-brand border border-line bg-white px-4 font-normal outline-none transition focus:border-green"
          >
            <optgroup label="おすすめ">
              {recommendedProducts.map((productName) => (
                <option key={productName} value={productName}>
                  {productName}
                </option>
              ))}
            </optgroup>
            <optgroup label="その他の商品">
              {otherProducts.map((productName) => (
                <option key={productName} value={productName}>
                  {productName}
                </option>
              ))}
            </optgroup>
          </select>
        </label>

        <fieldset className="rounded-brand border border-line p-4">
          <legend className="px-2 text-sm font-semibold text-ink">評価</legend>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`h-11 w-11 rounded-full border text-lg transition ${
                  value <= rating ? "border-green bg-green text-white" : "border-line text-muted hover:border-green"
                }`}
                onClick={() => setRating(value)}
                aria-label={`${value}点`}
              >
                ★
              </button>
            ))}
          </div>
          <input type="hidden" name="rating" value={rating} />
        </fieldset>

        <label className="grid gap-2 text-sm font-semibold text-ink">
          良かったところ
          <textarea
            name="good"
            className="min-h-32 rounded-brand border border-line px-4 py-3 font-normal leading-7 outline-none transition focus:border-green"
            placeholder="使いやすかった点や仕上がりを書いてください"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-ink">
          気になったところ
          <textarea
            name="concern"
            className="min-h-32 rounded-brand border border-line px-4 py-3 font-normal leading-7 outline-none transition focus:border-green"
            placeholder="重さ、香り、泡立ちなど気になった点を書いてください"
            required
          />
        </label>

        <Button type="submit">口コミを送信する</Button>
        {sent && <p className="text-sm text-green">口コミを追加しました。</p>}
      </form>
    </Card>
  );
}
