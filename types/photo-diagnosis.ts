import type { ScoreMap } from "@/types/diagnosis";

export type PhotoMetric = {
  label: string;
  value: string;
};

export type HairPhotoAnalysis = {
  usable: boolean;
  message: string;
  scores: Partial<ScoreMap>;
  metrics: PhotoMetric[];
};
