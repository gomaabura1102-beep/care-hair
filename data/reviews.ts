export type Review = {
  id: string;
  name: string;
  grade: string;
  rating: number;
  product: string;
  hairType: string;
  comment: string;
};

export const initialReviews: Review[] = [
  {
    id: "review-1",
    name: "高校2年・男子",
    grade: "細毛・直毛",
    rating: 5,
    product: "プリュスオー メロウ",
    hairType: "細毛・軟毛",
    comment: "重くなりすぎず、朝のセットがしやすくなった感じがしました。"
  },
  {
    id: "review-2",
    name: "高校1年・男子",
    grade: "くせ毛",
    rating: 4,
    product: "THE ANSWER",
    hairType: "くせ毛・乾燥",
    comment: "広がりが気になる日にまとまりやすくて、香りも強すぎないところがよかったです。"
  },
  {
    id: "review-3",
    name: "高校3年・男子",
    grade: "頭皮ケア",
    rating: 4,
    product: "ミノン",
    hairType: "フケ・かゆみ",
    comment: "頭皮が気になるときに選びやすいと思いました。刺激が少ない印象です。"
  }
];
