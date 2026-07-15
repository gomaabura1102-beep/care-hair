export type ReviewHairType = "fine" | "normal" | "coarse";

export const hairTypeOptions: { value: ReviewHairType; label: string }[] = [
  { value: "fine", label: "細毛・軟毛" },
  { value: "normal", label: "普通毛" },
  { value: "coarse", label: "硬毛・剛毛" }
];

export const concernOptions = [
  "パサつき",
  "くせ毛・うねり",
  "広がり",
  "ボリューム不足",
  "ダメージ",
  "フケ・かゆみ",
  "特になし"
];

export const hairTypeProducts: Record<ReviewHairType, string[]> = {
  fine: ["プリュスオー メロウ", "MEMEME スムースブースト", "Sleek バランスエフェクト"],
  normal: ["プリュスオー メロウ", "THE ANSWER", "アンレーベル KR コントロール"],
  coarse: ["プリュスオー リポア", "Qurap ラッピングモイスト", "THE ANSWER SS"]
};

export const allReviewProducts = [
  "プリュスオー メロウ",
  "MEMEME スムースブースト",
  "Sleek バランスエフェクト",
  "THE ANSWER",
  "THE ANSWER SS",
  "プリュスオー リポア",
  "Qurap ラッピングモイスト",
  "アンレーベル KR コントロール",
  "メルト モイスト",
  "カウブランド うるおい",
  "ミノン",
  "無印良品 スカルプ"
];
