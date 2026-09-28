import type { ScoreMap } from "@/types/diagnosis";

export type ProductType = "shampoo" | "treatment";

/** Only populate from an authorized API response after verifying the exact item. */
export type OfficialProductImage = {
  url: string;
  itemId: string;
  affiliateUrl: string;
} & (
  | { source: "amazon"; obtainedVia: "creators-api" }
  | { source: "rakuten"; obtainedVia: "rakuten-ichiba-api" }
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
  /** Original Rakuten-generated image-only HTML (240 x 240), pasted without edits. */
  rakutenImageHtml?: string;
  /** In display preference order; never infer these from existing affiliate URLs. */
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
