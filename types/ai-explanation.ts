import type { ScoreMap } from "@/types/diagnosis";

export type AiExplanationBudget =
  | ""
  | "1500円まで"
  | "2000円まで"
  | "3000円まで"
  | "予算は気にしない";

export type AiExplanationContext = {
  diagnosisId: string;
  scores: ScoreMap;
  currentProductId: string | null;
};

export type AiExplanation = {
  headline: string;
  explanation: string;
  reasons: [string, string, string];
  caution: string;
  followUpQuestion: string;
};

export type AiExplanationResponse = {
  explanation: AiExplanation;
};
