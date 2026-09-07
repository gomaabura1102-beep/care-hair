import type { DiagnosisLabels, ScoreMap } from "@/types/diagnosis";

export type SavedDiagnosis = {
  diagnosisId: string;
  createdAt: string;
  labels: DiagnosisLabels;
  scores: ScoreMap;
  recommendedProductIds: string[];
  currentProductId: string | null;
  mode: "questions" | "photo";
};

export type UsageFeedback = {
  manageability: number;
  frizz: number;
  dryness: number;
  fragrance: number;
  washFeel: number;
  continueUse: "yes" | "maybe" | "no";
  note: string;
  recordedAt: string;
};

export type UsageRecord = {
  id: string;
  productId: string;
  startDate: string;
  diagnosisId: string | null;
  hairType: string | null;
  concerns: string[];
  feedback: UsageFeedback | null;
};

export type CareHairState = {
  version: 1;
  favoriteProductIds: string[];
  comparisonProductIds: string[];
  recentlyViewedProductIds: string[];
  diagnoses: SavedDiagnosis[];
  usages: UsageRecord[];
};

export type PendingDiagnosisContext = {
  diagnosisId: string;
  currentProductId: string | null;
  mode: "questions" | "photo";
};
