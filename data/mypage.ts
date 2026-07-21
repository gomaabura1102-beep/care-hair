export const myPageData = {
  seasonalRecommendations: [
    { season: "夏", title: "頭皮のべたつき対策", product: "無印良品 スカルプケア" },
    { season: "秋", title: "乾燥前の保湿ケア", product: "THE ANSWER" },
    { season: "冬", title: "パサつき対策", product: "プリュスオー リポア" }
  ],
  announcements: [
    "新商品レビューの入力機能を準備中です",
    "季節ごとのおすすめを更新しました",
    "診断結果のシェア機能を追加しました"
  ],
  diagnosisHistory: [
    { date: "2026.07.21", result: "細毛・軟毛 × 直毛寄り", product: "プリュスオー メロウ" },
    { date: "2026.06.01", result: "普通毛 × くせ毛・うねり毛", product: "THE ANSWER" }
  ],
  ranking: [
    "THE ANSWER",
    "プリュスオー メロウ",
    "Qurap ラッピングモイスト",
    "MEMEME スムースブースト"
  ],
  monthlyPopular: ["THE ANSWER", "プリュスオー リポア", "カウブランド うるおい"]
};

export type NotificationAdapter = {
  scheduleRediagnosis: (startDate: string) => { title: string; date: string; message: string };
};

export const dummyNotificationAdapter: NotificationAdapter = {
  scheduleRediagnosis(startDate) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + 2);

    return {
      title: "2か月後の再診断通知",
      date: date.toLocaleDateString("ja-JP"),
      message: "季節や髪の長さが変わるタイミングで、もう一度診断してみましょう。"
    };
  }
};
