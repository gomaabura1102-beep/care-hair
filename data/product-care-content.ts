import { products } from "@/data/products";
import type { Product, ProductCareContent } from "@/types/product";

const defaultContent = (product: Product): ProductCareContent => ({
  recommendedFor: [
    product.fit,
    product.tags[0] ? `${product.tags[0]}が気になる人` : "自分に合う商品を探している人"
  ],
  recommendReason:
    `${product.name}は、${product.fit}に向けて選びやすい商品です。診断で近い髪質や悩みが出た場合、${product.point}`,
  features: {
    scent: product.scent,
    finish: product.texture,
    foam: product.type === "shampoo" ? "毎日使いやすい泡立ち" : "髪になじませやすい質感",
    character: product.feature
  },
  reviewSummary: {
    good: product.review,
    concern: "仕上がりの感じ方には個人差があるため、髪の太さや乾燥の強さに合わせて選ぶことが大切です。"
  }
});

const careContentById: Record<string, Partial<ProductCareContent>> = {
  "plus-eau-mellow-shampoo": {
    recommendedFor: ["細毛・軟毛の人", "軽さとまとまりを両立したい人", "ヘアケア初心者", "パサつきが少し気になる人"],
    recommendReason:
      "細毛でも重くなりすぎにくく、自然なまとまりを出しやすい商品です。診断で細毛・軟毛や普通毛寄りと出た人に、最初の候補として提案しやすいバランス型です。",
    reviewSummary: {
      good: "軽い洗い上がりで、指通りとまとまりのバランスが良いという声が多い傾向です。",
      concern: "強いダメージやかなりの乾燥がある場合は、保湿感が物足りないと感じる人もいます。"
    }
  },
  "mememe-smooth-boost-shampoo": {
    recommendedFor: ["髪がぺたんとしやすい人", "ふんわり軽い仕上がりが好きな人", "細毛・軟毛の人", "サラサラ感を重視したい人"],
    recommendReason:
      "ボリューム不足が気になる髪でも重くなりにくく、扱いやすい軽さを出しやすい商品です。診断で細毛・軟毛やふんわり希望が強い人に向いています。",
    reviewSummary: {
      good: "軽さやサラサラ感を評価する声が多く、朝のセット前にも使いやすい印象です。",
      concern: "しっとり感を強く求める人には、やや軽く感じられる場合があります。"
    }
  },
  "sleek-balance-effect-shampoo": {
    recommendedFor: ["強い悩みがまだ少ない人", "細毛・普通毛の人", "毎日使いやすい商品を選びたい人", "自然な清潔感を重視したい人"],
    recommendReason:
      "軽さと扱いやすさのバランスが良く、ヘアケアを始めたばかりの人でも取り入れやすい商品です。診断で大きなダメージが出ない場合に合わせやすい候補です。",
    reviewSummary: {
      good: "自然な仕上がりで使いやすいという声があり、普段使いしやすい印象です。",
      concern: "強いくせや乾燥をしっかり抑えたい人には、補修感が控えめに感じられることがあります。"
    }
  },
  "the-answer-shampoo": {
    recommendedFor: ["パサつきが気になる人", "普通毛から硬毛の人", "まとまりを重視したい人", "ダメージケアをしたい人"],
    recommendReason:
      "保湿と補修のバランスが良く、パサつき・うねり・ダメージが重なった診断結果でも提案しやすい商品です。重すぎにくいため、幅広い髪質に合わせやすいです。",
    reviewSummary: {
      good: "まとまりや補修感を評価する声が多く、乾燥や広がりが気になる人に選ばれやすい傾向です。",
      concern: "軽い仕上がりを好む細毛の人には、少ししっとり感じる場合があります。"
    }
  },
  "unlabel-kr-control-shampoo": {
    recommendedFor: ["うねりが気になる人", "湿気で広がりやすい人", "普通毛の人", "重すぎないまとまりが欲しい人"],
    recommendReason:
      "広がりやうねりを抑えたい診断結果に合わせやすく、しっとりしすぎないコントロール感が特徴です。普通毛で湿気に弱い人の候補になります。",
    reviewSummary: {
      good: "広がりが落ち着きやすい、扱いやすいという声が見られます。",
      concern: "かなり乾燥している髪や強いダメージ毛では、保湿感が足りないと感じることがあります。"
    }
  },
  "plus-eau-repair-shampoo": {
    recommendedFor: ["硬毛・剛毛の人", "パサつきが気になる人", "ダメージケアをしたい人", "しっとりまとまりたい人"],
    recommendReason:
      "硬く広がりやすい髪や、カラー・アイロンで乾燥しやすい髪に合わせやすい商品です。診断で硬毛やダメージの点数が高い人に提案しやすいです。",
    reviewSummary: {
      good: "毛先のまとまりやしっとり感を評価する声が多い傾向です。",
      concern: "細毛やボリューム不足の人は、つけすぎると重く感じる場合があります。"
    }
  },
  "qurap-wrapping-moist-shampoo": {
    recommendedFor: ["乾燥が強い人", "硬毛・剛毛の人", "広がりやすい人", "しっとり感を重視したい人"],
    recommendReason:
      "保湿感が高く、乾燥や広がりが強い診断結果に向いています。特に硬毛で毛量が多い人や、しっとりまとまる仕上がりを求める人に合わせやすい商品です。",
    reviewSummary: {
      good: "しっとり感や広がりにくさを評価する声が多い傾向です。",
      concern: "細毛・軟毛では重く感じる場合があるため、乾燥が強いときの候補として考えるのがおすすめです。"
    }
  },
  "the-answer-ss-shampoo": {
    recommendedFor: ["硬毛・剛毛の人", "髪が広がりやすい人", "補修感が欲しい人", "しっとりしすぎないまとまりが欲しい人"],
    recommendReason:
      "硬毛向けにまとまりと補修感を出しやすく、硬毛・剛毛かつしっとり希望の診断結果で優先しやすい商品です。Qurapほど重くしすぎたくない人にも合いやすいです。",
    reviewSummary: {
      good: "硬い髪が扱いやすくなる、まとまりやすいという声が見られます。",
      concern: "かなり軽い仕上がりを求める人には、ややしっとり感じることがあります。"
    }
  },
  "cow-moist-shampoo": {
    recommendedFor: ["フケ・かゆみが気になる人", "頭皮へのやさしさを重視したい人", "香りが強いものが苦手な人", "低刺激系から選びたい人"],
    recommendReason:
      "診断で頭皮状態の点数が高い場合は、髪質より頭皮へのやさしさを優先します。低刺激系で選びやすく、フケ・かゆみが気になる人の候補になります。",
    reviewSummary: {
      good: "やさしい使い心地や刺激の少なさを評価する声が多い傾向です。",
      concern: "髪の補修感や強いまとまりを求める人には、物足りなく感じる場合があります。"
    }
  }
};

export function getProductCareContent(product: Product): ProductCareContent {
  const base = defaultContent(product);
  const override = careContentById[product.id] ?? {};

  return {
    ...base,
    ...override,
    features: {
      ...base.features,
      ...override.features
    },
    reviewSummary: {
      ...base.reviewSummary,
      ...override.reviewSummary
    }
  };
}

export const productsWithCareContent = products.map((product) => ({
  ...product,
  careContent: getProductCareContent(product)
}));
