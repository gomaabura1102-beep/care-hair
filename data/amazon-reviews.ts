export type AmazonReviewSnapshot = {
  rating: number;
  reviewCount: number;
  checkedAt: string;
  sourceUrl: string;
  goodSummary: string;
  concernSummary: string;
};

// Amazon.co.jpの商品ページを確認した時点のスナップショットです。
// 評価と件数は変動するため、更新時はcheckedAtも必ず変更します。
const amazonReviewSnapshots: Record<string, AmazonReviewSnapshot> = {
  "plus-eau-mellow-shampoo": {
    rating: 4.3,
    reviewCount: 306,
    checkedAt: "2026-08-22",
    sourceUrl: "https://www.amazon.co.jp/dp/B0B8ZB19L6",
    goodSummary: "髪のさらさら感や香り、なじませやすさ、コストパフォーマンスを評価する声が目立ちます。",
    concernSummary: "まとまりや泡立ち、洗い上がりの感じ方には個人差があるという声があります。"
  },
  "mememe-smooth-boost-shampoo": {
    rating: 4.7,
    reviewCount: 6,
    checkedAt: "2026-08-22",
    sourceUrl: "https://www.amazon.co.jp/dp/B0GMD56RMH",
    goodSummary: "香りの良さ、泡立ち、さらさらした仕上がりを評価する声が見られます。",
    concernSummary: "レビュー数はまだ少なく、香りの好みが合わないという声もあります。"
  },
  "the-answer-shampoo": {
    rating: 4.2,
    reviewCount: 526,
    checkedAt: "2026-08-22",
    sourceUrl: "https://www.amazon.co.jp/dp/B0DSFQNXR9",
    goodSummary: "しっとり感、ツヤ、まとまり、泡立ちや香りを評価する声が目立ちます。",
    concernSummary: "洗浄力が強いと感じる人もいるため、頭皮や髪の状態によって使用感が分かれます。"
  },
  "plus-eau-repair-shampoo": {
    rating: 4.2,
    reviewCount: 146,
    checkedAt: "2026-08-22",
    sourceUrl: "https://www.amazon.co.jp/dp/B0DHX77ZJ9",
    goodSummary: "髪のやわらかさやしっとり感、毛先のパサつきにくさ、香りを評価する声が目立ちます。",
    concernSummary: "ポンプの押しやすさについては評価が分かれています。"
  },
  "qurap-wrapping-moist-shampoo": {
    rating: 4.3,
    reviewCount: 363,
    checkedAt: "2026-08-22",
    sourceUrl: "https://www.amazon.co.jp/dp/B0CYSX961H",
    goodSummary: "さらさら感やツヤ、指通り、泡立ち、しっとりした洗い上がりを評価する声が目立ちます。",
    concernSummary: "仕上がりや香りの感じ方には個人差があるため、髪質との相性を確認するのがおすすめです。"
  }
};

export function getAmazonReviewSnapshot(productId: string) {
  return amazonReviewSnapshots[productId] ?? null;
}
