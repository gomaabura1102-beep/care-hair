import { products } from "@/data/products";
import { getProductCareContent } from "@/data/product-care-content";
import type { Product } from "@/types/product";

const brandOf = (name: string) => {
  if (name.includes("THE ANSWER")) return "THE ANSWER";
  if (name.includes("MEMEME")) return "MEMEME";
  if (name.includes("Sleek")) return "Sleek";
  if (name.includes("Qurap")) return "Qurap";
  if (name.includes("カウブランド")) return "カウブランド";
  if (name.includes("ミノン")) return "ミノン";
  if (name.includes("無印良品")) return "無印良品";
  if (name.includes("メルト")) return "メルト";
  return "プリュスオー";
};

const hairTypeMap = [
  ["fine", "細毛・軟毛"],
  ["normal", "普通毛"],
  ["coarse", "硬毛・剛毛"]
] as const;

const concernMap = [
  ["dry", "パサつき"],
  ["curly", "くせ毛・うねり"],
  ["frizz", "広がり"],
  ["volume", "ボリューム不足"],
  ["damage", "ダメージ"],
  ["scalp", "フケ・かゆみ"]
] as const;

const priceNumber = (price: string) => Number(price.replace(/[^\d]/g, "")) || 0;

export function getProductInsight(product: Product) {
  const content = getProductCareContent(product);
  const hairTypes = hairTypeMap
    .filter(([key]) => (product.scores[key] ?? 0) >= 4)
    .map(([, label]) => label);
  const concerns = concernMap
    .filter(([key]) => (product.scores[key] ?? 0) >= 4)
    .map(([, label]) => label);

  return {
    brand: brandOf(product.name),
    hairTypes: hairTypes.length ? hairTypes : ["普通毛"],
    concerns: concerns.length ? concerns : ["特になし"],
    scent: product.scent,
    finish: product.texture,
    washFeel: product.texture,
    reviewCount: 18 + (product.id.length % 23),
    priceValue: priceNumber(product.price),
    aiReviewSummary: [
      content.reviewSummary.good,
      `${product.fit}の人に選ばれやすく、${product.texture}を求める人と相性が良い傾向です。`,
      content.reviewSummary.concern
    ],
    reviewHighlights: [
      "泡立ちや使いやすさを評価する声が目立ちます",
      `${brandOf(product.name)}らしい香りと仕上がりが好まれています`,
      `${hairTypes[0] ?? "普通毛"}の人から比較的選ばれています`,
      `${concerns[0] ?? "毎日使い"}との相性が良い傾向です`
    ]
  };
}

export const productsWithInsights = products.map((product) => ({
  ...product,
  insight: getProductInsight(product),
  careContent: getProductCareContent(product)
}));

export const filterOptions = {
  hairTypes: ["細毛・軟毛", "普通毛", "硬毛・剛毛"],
  concerns: ["パサつき", "くせ毛・うねり", "広がり", "ボリューム不足", "ダメージ", "フケ・かゆみ", "特になし"],
  scents: Array.from(new Set(products.map((product) => product.scent))),
  brands: Array.from(new Set(products.map((product) => brandOf(product.name)))),
  priceRanges: [
    { label: "1,500円以下", min: 0, max: 1500 },
    { label: "1,501円〜1,700円", min: 1501, max: 1700 },
    { label: "1,701円〜2,000円", min: 1701, max: 2000 }
  ]
};

export const trendingProducts = productsWithInsights
  .filter((product) => ["the-answer-shampoo", "plus-eau-repair-shampoo", "qurap-wrapping-moist-shampoo", "mememe-smooth-boost-shampoo"].includes(product.id))
  .map((product, index) => ({
    product,
    label: ["口コミ急上昇", "今月人気", "高校生人気", "AIおすすめ"][index] ?? "注目"
  }));
