import { products } from "@/data/products";
import { questions } from "@/data/questions";
import type { DiagnosisAdvice, DiagnosisResult, ScoreKey, ScoreMap } from "@/types/diagnosis";
import type { Product, ProductType } from "@/types/product";

export const scoreKeys: ScoreKey[] = [
  "fine",
  "normal",
  "coarse",
  "straight",
  "curly",
  "dry",
  "oily",
  "damage",
  "scalp",
  "frizz",
  "volume",
  "moist",
  "airy",
  "smooth",
  "refresh",
  "repair"
];

export const emptyScores: ScoreMap = {
  fine: 0,
  normal: 0,
  coarse: 0,
  straight: 0,
  curly: 0,
  dry: 0,
  oily: 0,
  damage: 0,
  scalp: 0,
  frizz: 0,
  volume: 0,
  moist: 0,
  airy: 0,
  smooth: 0,
  refresh: 0,
  repair: 0
};

export function parseAnswers(value: string | null): number[][] {
  if (!value) return [];

  return value.split(".").map((group) =>
    group
      .split(",")
      .map((item) => Number(item))
      .filter((item) => Number.isInteger(item))
  );
}

export function encodeAnswers(answers: number[][]): string {
  return answers.map((group) => group.join(",")).join(".");
}

export function calculateScores(answers: number[][]): ScoreMap {
  const scores = { ...emptyScores };

  answers.forEach((answerGroup, questionIndex) => {
    const question = questions[questionIndex];
    if (!question) return;

    answerGroup.forEach((answerIndex) => {
      const option = question.options[answerIndex];
      if (!option) return;

      Object.entries(option.scores).forEach(([key, value]) => {
        scores[key as ScoreKey] += value ?? 0;
      });
    });
  });

  return scores;
}

export function getDiagnosisResult(answers: number[][]): DiagnosisResult {
  const scores = calculateScores(answers);
  const hairBody =
    scores.coarse >= 5 && scores.coarse >= scores.fine
      ? "硬毛・剛毛"
      : scores.fine >= 5 && scores.fine > scores.coarse
        ? "細毛・軟毛"
        : "普通毛";
  const hairShape = scores.curly > scores.straight ? "くせ毛・うねり毛" : "直毛寄り";
  const scalpState = scores.scalp >= 8 ? "頭皮ケア優先" : "通常ケア";
  const condition =
    scores.scalp >= 8
      ? "バランス型"
    : scores.damage >= 8
        ? "ダメージ毛"
        : scores.dry >= 8
          ? "パサつき・乾燥毛"
          : scores.oily >= 5
            ? "脂性ケア優先"
            : "バランス型";

  const feature =
    hairShape === "くせ毛・うねり毛"
      ? "湿気でうねりや広がりが出やすく、保湿とまとまりを意識したケアが向いています。"
      : "大きなくせは少なめなので、重くしすぎず清潔感と扱いやすさを保つケアが向いています。";

  const reason =
    scalpState === "頭皮ケア優先"
      ? "フケ・かゆみのスコアが高いため、髪質よりも頭皮へのやさしさを優先して商品を並べています。"
      : `${hairBody}と${hairShape}の傾向に加えて、乾燥・ダメージ・広がりの点数を掛け合わせ、続けやすい市販商品から提案しています。`;

  return { scores, hairBody, hairShape, scalpState, condition, feature, reason, advices: getDiagnosisAdvices(scores) };
}

const adviceMaster: Record<string, DiagnosisAdvice> = {
  fine: {
    title: "細毛・軟毛",
    features: ["髪が細く柔らかい", "ボリュームが出にくい", "セットが崩れやすい"],
    advice:
      "トリートメントは毛先を中心に少量使用し、根元には付けすぎないようにしましょう。ドライヤーで根元を立ち上げるように乾かすと、ふんわり仕上がります。"
  },
  normal: {
    title: "普通毛",
    features: ["太さ・硬さが平均的", "大きなクセが少ない"],
    advice:
      "自分の髪の悩みに合わせてヘアケア商品を選ぶことが大切です。紫外線や熱によるダメージを防ぐため、ドライヤーは髪から20cmほど離して使用しましょう。"
  },
  coarse: {
    title: "硬毛・剛毛",
    features: ["髪が太く硬い", "広がりやすい", "ボリュームが出やすい"],
    advice:
      "保湿力の高いシャンプー・トリートメントを選びましょう。ドライヤー後に冷風を当てると髪がまとまりやすくなります。"
  },
  curly: {
    title: "くせ毛・うねり毛",
    features: ["湿気で広がる", "髪がうねりやすい"],
    advice:
      "タオルドライ後はできるだけ早く乾かしましょう。保湿力のあるヘアケアを使うことで、広がりやうねりを抑えやすくなります。"
  },
  damage: {
    title: "ダメージ毛",
    features: ["カラー・ブリーチ歴がある", "アイロンをよく使う", "切れ毛・枝毛が多い"],
    advice:
      "ヘアアイロンは180℃以上で使用すると髪への負担が大きくなりやすいため、160〜170℃程度を目安に使用しましょう。また、ドライヤーやアイロンの前には洗い流さないトリートメントを使用すると、熱ダメージを軽減しやすくなります。"
  },
  dry: {
    title: "パサつき・乾燥毛",
    features: ["指通りが悪い", "ツヤが少ない", "毛先が乾燥する"],
    advice:
      "お湯の温度は38℃前後がおすすめです。熱すぎるお湯は必要な皮脂まで落としてしまうため、乾燥の原因になります。"
  },
  volume: {
    title: "ボリューム不足",
    features: ["髪がぺたんこになる", "根元が立ち上がらない"],
    advice:
      "シャンプーは頭皮をしっかり洗い、ドライヤーで根元を起こすように乾かすとボリュームが出やすくなります。"
  },
  scalp: {
    title: "フケ・かゆみ",
    features: ["頭皮がかゆい", "フケが出る"],
    advice:
      "シャンプーはしっかりすすぎ、頭皮に洗浄成分が残らないようにしましょう。トリートメントは中間から毛先を中心になじませ、頭皮には付けないようにすることが大切です。"
  }
};

function getDiagnosisAdvices(scores: ScoreMap): DiagnosisAdvice[] {
  const bodyAdvice =
    scores.coarse >= 5 && scores.coarse >= scores.fine
      ? adviceMaster.coarse
      : scores.fine >= 5 && scores.fine > scores.coarse
        ? adviceMaster.fine
        : adviceMaster.normal;

  const optionalAdvices = [
    scores.curly > scores.straight ? adviceMaster.curly : null,
    scores.damage >= 8 ? adviceMaster.damage : null,
    scores.dry >= 8 ? adviceMaster.dry : null,
    scores.volume >= 6 ? adviceMaster.volume : null,
    scores.scalp >= 8 ? adviceMaster.scalp : null
  ].filter((advice): advice is DiagnosisAdvice => Boolean(advice));

  const uniqueAdvices = [bodyAdvice, ...optionalAdvices].filter(
    (advice, index, items) => items.findIndex((item) => item.title === advice.title) === index
  );

  return uniqueAdvices.slice(0, 4);
}

export function rankProducts(type: ProductType, scores: ScoreMap): Product[] {
  return products
    .filter((product) => product.type === type)
    .map((product) => {
      const total = Object.entries(product.scores).reduce((sum, [key, value]) => {
        return sum + (scores[key as ScoreKey] || 0) * (value || 0);
      }, 0) + getProductAdjustment(product, scores);

      return { product, total };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 3)
    .map(({ product }) => product);
}

function getProductAdjustment(product: Product, scores: ScoreMap): number {
  const isFineHair = scores.fine >= 5 && scores.fine > scores.coarse;
  const wantsMoistFinish = scores.moist >= 6;
  const hasStrongDryness = scores.dry >= 8;

  if (!isFineHair) return 0;

  const isQurap = product.id.startsWith("qurap-wrapping-moist");

  if (isQurap || product.id.startsWith("melt-moist")) {
    return hasStrongDryness ? 18 : -70;
  }

  if (!wantsMoistFinish) return 0;

  if (product.id.startsWith("the-answer-")) return 34;
  if (product.id.startsWith("plus-eau-repair")) return 55;
  if (product.id.startsWith("unlabel-kr-control")) return 12;

  return 0;
}

const shampooTreatmentPairs: Record<string, string> = {
  "plus-eau-mellow-shampoo": "plus-eau-mellow-treatment",
  "mememe-smooth-boost-shampoo": "mememe-smooth-boost-treatment",
  "sleek-balance-effect-shampoo": "sleek-balance-effect-treatment",
  "the-answer-shampoo": "the-answer-treatment",
  "unlabel-kr-control-shampoo": "unlabel-kr-control-treatment",
  "plus-eau-repair-shampoo": "plus-eau-repair-treatment",
  "qurap-wrapping-moist-shampoo": "qurap-wrapping-moist-treatment",
  "the-answer-ss-shampoo": "the-answer-ss-treatment",
  "cow-moist-shampoo": "cow-moist-treatment",
  "minon-shampoo": "minon-treatment",
  "muji-scalp-shampoo": "muji-scalp-treatment",
  "melt-moist-shampoo": "melt-moist-treatment"
};

export function rankPairedTreatments(shampoos: Product[], scores: ScoreMap): Product[] {
  const rankedTreatments = rankProducts("treatment", scores);
  const treatmentById = new Map(products.filter((product) => product.type === "treatment").map((product) => [product.id, product]));
  const pairedTreatments = shampoos
    .map((shampoo) => treatmentById.get(shampooTreatmentPairs[shampoo.id]))
    .filter((product): product is Product => Boolean(product));

  const filled = [...pairedTreatments];

  rankedTreatments.forEach((product) => {
    if (!filled.some((item) => item.id === product.id)) {
      filled.push(product);
    }
  });

  return filled.slice(0, 3);
}
