import type { ReviewHairType } from "@/data/review-form-options";

export type UserReview = {
  id: string;
  name: string;
  ageGroup: string;
  hairType: ReviewHairType;
  concerns: string[];
  productId: string;
  product: string;
  usagePeriod: string;
  rating: number;
  good: string;
  concern: string;
  fragrance: string;
  finish: string;
  useAgain: string;
  createdAt: string;
};

// 公開済みの実データだけをAPIから読み込みます。画面用の架空口コミは置きません。
export const initialReviews: UserReview[] = [];
