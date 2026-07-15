export type ReviewHairType = "fine" | "normal" | "coarse" | "curly" | "damage" | "dry" | "scalp";

export const hairTypeOptions: { value: ReviewHairType; label: string }[] = [
  { value: "fine", label: "細毛・軟毛" },
  { value: "normal", label: "普通毛" },
  { value: "coarse", label: "硬毛・剛毛" },
  { value: "curly", label: "くせ毛・うねり毛" },
  { value: "damage", label: "ダメージ毛" },
  { value: "dry", label: "パサつき・乾燥毛" },
  { value: "scalp", label: "フケ・かゆみ" }
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
  coarse: ["プリュスオー リポア", "Qurap ラッピングモイスト", "THE ANSWER SS"],
  curly: ["THE ANSWER", "メルト モイスト", "Qurap ラッピングモイスト"],
  damage: ["THE ANSWER", "プリュスオー リポア", "THE ANSWER SS"],
  dry: ["THE ANSWER", "プリュスオー リポア", "Qurap ラッピングモイスト"],
  scalp: ["カウブランド うるおい", "ミノン", "無印良品 スカルプ"]
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
