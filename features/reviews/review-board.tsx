"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Star } from "lucide-react";
import { initialReviews, type Review } from "@/data/reviews";
import { Button } from "@/components/ui/button";

const storageKey = "care-hair-reviews";

function ratingStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${index < rating ? "fill-green text-green" : "text-line"}`}
      aria-hidden="true"
    />
  ));
}

export function ReviewBoard() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    product: "",
    hairType: "",
    rating: "5",
    comment: ""
  });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setReviews([...JSON.parse(saved), ...initialReviews]);
    }
  }, []);

  const average = useMemo(() => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextReview: Review = {
      id: `local-${Date.now()}`,
      name: form.name || "匿名",
      grade: "ユーザー投稿",
      rating: Number(form.rating),
      product: form.product,
      hairType: form.hairType,
      comment: form.comment
    };

    const savedReviews = [nextReview, ...reviews.filter((review) => review.id.startsWith("local-"))];
    window.localStorage.setItem(storageKey, JSON.stringify(savedReviews));
    setReviews([nextReview, ...reviews]);
    setForm({ name: "", product: "", hairType: "", rating: "5", comment: "" });
    setSent(true);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-brand border border-line bg-white p-5 shadow-brand sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">Review form</p>
        <h2 className="mt-3 text-3xl font-medium">口コミを投稿する</h2>
        <form className="mt-7 grid gap-4" onSubmit={submitReview}>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            名前
            <input
              value={form.name}
              onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))}
              className="min-h-12 rounded-brand border border-line px-4 font-normal outline-none transition focus:border-green"
              placeholder="匿名でもOK"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            使った商品
            <input
              value={form.product}
              onChange={(event) => setForm((value) => ({ ...value, product: event.target.value }))}
              className="min-h-12 rounded-brand border border-line px-4 font-normal outline-none transition focus:border-green"
              placeholder="例: THE ANSWER"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            髪質・悩み
            <input
              value={form.hairType}
              onChange={(event) => setForm((value) => ({ ...value, hairType: event.target.value }))}
              className="min-h-12 rounded-brand border border-line px-4 font-normal outline-none transition focus:border-green"
              placeholder="例: 細毛・パサつき"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            評価
            <select
              value={form.rating}
              onChange={(event) => setForm((value) => ({ ...value, rating: event.target.value }))}
              className="min-h-12 rounded-brand border border-line px-4 font-normal outline-none transition focus:border-green"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            感想
            <textarea
              value={form.comment}
              onChange={(event) => setForm((value) => ({ ...value, comment: event.target.value }))}
              className="min-h-32 rounded-brand border border-line px-4 py-3 font-normal leading-7 outline-none transition focus:border-green"
              placeholder="使ってみた感想を書いてください"
              required
            />
          </label>
          <Button type="submit">口コミを追加</Button>
          {sent && <p className="text-sm text-green">投稿しました。この端末のブラウザに保存されています。</p>}
        </form>
      </section>

      <section>
        <div className="mb-5 rounded-brand border border-line bg-soft p-5">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-green">Average</span>
          <div className="mt-2 flex items-end gap-3">
            <strong className="text-5xl font-medium text-green">{average}</strong>
            <span className="pb-2 text-sm text-muted">/ 5.0</span>
          </div>
        </div>
        <div className="grid gap-4">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-brand border border-line bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{review.product}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {review.name} / {review.hairType}
                  </p>
                </div>
                <div className="flex gap-1" aria-label={`${review.rating}点`}>
                  {ratingStars(review.rating)}
                </div>
              </div>
              <p className="mt-4 leading-7 text-muted">{review.comment}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
