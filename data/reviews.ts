import type { ReviewHairType } from "@/data/review-form-options";

export type UserReview = {
  id: string;
  name: string;
  hairType: ReviewHairType;
  concerns: string[];
  product: string;
  rating: number;
  good: string;
  concern: string;
};

export const initialReviews: UserReview[] = [
  {
    id: "review-1",
    name: "高校2年・R",
    hairType: "fine",
    concerns: ["ボリューム不足", "パサつき"],
    product: "プリュスオー メロウ",
    rating: 5,
    good: "重くなりすぎず、朝のセット前でも使いやすいと感じました。",
    concern: "ダメージが強い毛先は、少し物足りない日もありました。"
  },
  {
    id: "review-2",
    name: "高校2年・S",
    hairType: "normal",
    concerns: ["広がり", "くせ毛・うねり"],
    product: "THE ANSWER",
    rating: 4,
    good: "湿気がある日でもまとまりやすく、指通りもよかったです。",
    concern: "軽い仕上がりが好きな人には少ししっとり感じるかもしれません。"
  },
  {
    id: "review-3",
    name: "高校2年・K",
    hairType: "coarse",
    concerns: ["広がり", "ダメージ"],
    product: "THE ANSWER SS",
    rating: 5,
    good: "硬い髪でもまとまりやすく、ドライヤー後の広がりが気になりにくかったです。",
    concern: "使う量が多いと少し重く感じることがありました。"
  }
];
