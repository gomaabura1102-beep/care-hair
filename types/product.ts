import type { ScoreMap } from "@/types/diagnosis";

export type ProductType = "shampoo" | "treatment";

export type Product = {
  id: string;
  name: string;
  type: ProductType;
  price: string;
  image: string;
  tags: string[];
  feature: string;
  point: string;
  fit: string;
  scent: string;
  texture: string;
  ingredients: string;
  review: string;
  amazonUrl: string;
  scores: Partial<ScoreMap>;
};

export type ProductFeatureSet = {
  scent: string;
  finish: string;
  foam: string;
  character: string;
};

export type ProductReviewSummary = {
  good: string;
  concern: string;
};

export type ProductCareContent = {
  recommendedFor: string[];
  recommendReason: string;
  features: ProductFeatureSet;
  reviewSummary: ProductReviewSummary;
};
