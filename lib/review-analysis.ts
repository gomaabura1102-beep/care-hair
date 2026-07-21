import { productsWithInsights } from "@/data/product-insights";
import type { UserReview } from "@/data/reviews";

export function summarizeProductReviews(productName: string) {
  const product = productsWithInsights.find((item) => productName.includes(item.insight.brand) || item.name.includes(productName));
  const highlights = product?.insight.reviewHighlights ?? [
    "使いやすさを評価する声が多い傾向です",
    "香りや仕上がりは好みによって分かれます",
    "髪質に合わせて選ぶと満足度が上がりやすいです"
  ];

  return highlights;
}

export function analyzeReviews(reviews: UserReview[]) {
  const highRated = reviews.filter((review) => review.rating >= 4).length;
  const total = Math.max(reviews.length, 1);
  const popularHairType = mostFrequent(reviews.map((review) => review.hairType));
  const popularConcern = mostFrequent(reviews.flatMap((review) => review.concerns));

  return {
    satisfaction: `${Math.round((highRated / total) * 100)}%`,
    popularHairType,
    popularConcern,
    recommendedFor: `${popularHairType}で、${popularConcern}が気になる人からの評価が集まりやすい傾向です。`,
    notFor: "強い香りが苦手な人や、かなり軽い仕上がりだけを求める人は商品ごとの特徴を確認すると安心です。",
    reason: "仕上がりの分かりやすさ、価格の続けやすさ、診断結果との近さが満足度につながっています。",
    improvement: "気になった点としては、しっとり感の重さや香りの好みが分かれるという声が出やすいです。"
  };
}

function mostFrequent(items: string[]) {
  const count = new Map<string, number>();
  for (const item of items) count.set(item, (count.get(item) ?? 0) + 1);
  return Array.from(count.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "高校生";
}
