"use client";

import { useState } from "react";
import { hairTypeOptions } from "@/data/review-form-options";
import { initialReviews, type UserReview } from "@/data/reviews";
import { ProductReviewForm } from "@/features/reviews/product-review-form";

const hairTypeLabel = Object.fromEntries(hairTypeOptions.map((option) => [option.value, option.label]));

function Rating({ value }: { value: number }) {
  return (
    <div className="flex gap-1 text-lg text-green" aria-label={`${value}点`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= value ? "text-green" : "text-line"}>
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: UserReview }) {
  return (
    <article className="rounded-brand border border-line bg-white p-5 shadow-brand sm:p-6">
      <h2 className="text-xl font-medium">{review.name}</h2>

      <div className="mt-4 grid gap-4 text-sm">
        <div>
          <p className="mb-2 font-semibold text-green">髪質</p>
          <span className="inline-flex rounded-full border border-line px-3 py-1 text-muted">
            {hairTypeLabel[review.hairType]}
          </span>
        </div>

        <div>
          <p className="mb-2 font-semibold text-green">髪の悩み</p>
          <div className="flex flex-wrap gap-2">
            {review.concerns.map((concern) => (
              <span key={concern} className="rounded-full bg-soft px-3 py-1 text-muted">
                {concern}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold text-green">使用した商品</p>
          <p className="mt-1 text-muted">{review.product}</p>
        </div>

        <div>
          <p className="mb-1 font-semibold text-green">評価</p>
          <Rating value={review.rating} />
        </div>

        <div>
          <p className="font-semibold text-green">良かったところ</p>
          <p className="mt-1 leading-7 text-muted">{review.good}</p>
        </div>

        <div>
          <p className="font-semibold text-green">気になったところ</p>
          <p className="mt-1 leading-7 text-muted">{review.concern}</p>
        </div>
      </div>
    </article>
  );
}

export function ReviewPageContent() {
  const [reviews, setReviews] = useState<UserReview[]>(initialReviews);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-start">
      <div className="grid gap-5">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className="lg:sticky lg:top-28">
        <ProductReviewForm onSubmitReview={(review) => setReviews((current) => [review, ...current])} />
      </div>
    </div>
  );
}
