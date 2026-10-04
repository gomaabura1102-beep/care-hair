import type { ScoreMap } from "@/types/diagnosis";

export type ProductType = "shampoo" | "treatment";

/** Populate only from an authorized provider response, after matching the exact item. */
export type OfficialProductImage = {
  url: string;
  itemId: string;
} & (
  | { source: "amazon"; obtainedVia: "amazon-associates-api" }
  | { source: "rakuten"; obtainedVia: "rakuten-ichiba-api" | "rakuten-affiliate" }
);

export type Product = {
  id: string;
  name: string;
  type: ProductType;
  price: string;
  volumeMl?: number;
  amazonAffiliateUrl?: string;
  affiliateUrl: string;
  affiliateImageUrl?: string;
  /** Preferred image first. Legacy affiliateImageUrl alone is not proof of permission. */
  officialImages?: OfficialProductImage[];
  tags: string[];
  feature: string;
  point: string;
  fit: string;
  scent: string;
  texture: string;
  ingredients: string;
  review: string;
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
