export type ScoreKey =
  | "fine"
  | "normal"
  | "coarse"
  | "straight"
  | "curly"
  | "dry"
  | "oily"
  | "damage"
  | "scalp"
  | "frizz"
  | "volume";

export type ScoreMap = Record<ScoreKey, number>;

export type DiagnosisOption = {
  label: string;
  scores: Partial<ScoreMap>;
};

export type DiagnosisQuestion = {
  id: string;
  title: string;
  hint: string;
  multiple?: boolean;
  options: DiagnosisOption[];
};

export type DiagnosisAdvice = {
  title: string;
  features: string[];
  advice: string;
};

export type DiagnosisResult = {
  scores: ScoreMap;
  hairBody: "細毛・軟毛" | "普通毛" | "硬毛・剛毛";
  hairShape: "直毛寄り" | "くせ毛・うねり毛";
  scalpState: "頭皮ケア優先" | "通常ケア";
  condition: "パサつき・乾燥毛" | "脂性ケア優先" | "ダメージ毛" | "バランス型";
  feature: string;
  reason: string;
  advices: DiagnosisAdvice[];
};
