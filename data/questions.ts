import type { DiagnosisQuestion } from "@/types/diagnosis";

export const questions: DiagnosisQuestion[] = [
  {
    id: "hair-shape-paper",
    title: "抜けた髪を1本、白い紙の上に置いたときの状態を教えてください。",
    hint: "髪の形を見て、一番近いものを選んでください。",
    options: [
      { label: "うねりやねじれが目立つ", scores: { curly: 5, frizz: 2 } },
      { label: "少し曲がっている", scores: { curly: 3, normal: 1 } },
      { label: "ほぼまっすぐ", scores: { straight: 5 } }
    ]
  },
  {
    id: "touch",
    title: "髪全体の手触りはどのような感じですか？",
    hint: "指通りや表面のざらつきを確認してください。",
    options: [
      { label: "表面がザラザラ・ゴワゴワしている", scores: { damage: 4, dry: 2, frizz: 2 } },
      { label: "なめらかで指通りが良い", scores: { normal: 3, straight: 1 } }
    ]
  },
  {
    id: "body",
    title: "抜けた髪を1本持ち、片側だけを指でつまむと髪はどうなりますか？",
    hint: "髪のハリや太さを判定します。",
    options: [
      { label: "しばらく横向きのまま立っている", scores: { coarse: 5 } },
      { label: "すぐに垂れ下がる", scores: { fine: 5, volume: 3 } }
    ]
  },
  {
    id: "curl-memory",
    title: "抜けた髪を1本、指に10秒ほど巻き付けてから外すとどうなりますか？",
    hint: "形が残るかどうかを選んでください。",
    options: [
      { label: "すぐにまっすぐに戻る", scores: { straight: 4 } },
      { label: "カールした状態がしばらく残る", scores: { curly: 4 } }
    ]
  },
  {
    id: "wet-stretch",
    title: "抜けた髪を1本取り、濡らして両端を持ってゆっくり引っ張るとどうなりますか？",
    hint: "ダメージの出やすさを確認します。",
    options: [
      { label: "すぐに切れる", scores: { damage: 5, dry: 2 } },
      { label: "なかなか切れない", scores: { normal: 2, coarse: 1 } }
    ]
  },
  {
    id: "humidity",
    title: "雨の日や湿度が高い日に髪はどうなりますか？",
    hint: "湿気の日の広がり方を思い出してください。",
    options: [
      { label: "あまり変化しない", scores: { straight: 3, normal: 1 } },
      { label: "うねりや広がりが出る", scores: { curly: 4, frizz: 5, dry: 1 } }
    ]
  },
  {
    id: "chemical-history",
    title: "過去1年以内に、次の施術を受けたことがありますか？",
    hint: "カラー・ブリーチ・縮毛矯正・パーマの中で、当てはまる数を選んでください。",
    options: [
      { label: "受けたことはない", scores: { normal: 1 } },
      { label: "1種類だけ受けた", scores: { damage: 2 } },
      { label: "2種類受けた", scores: { damage: 4, dry: 2 } },
      { label: "3種類以上受けた", scores: { damage: 7, dry: 3 } }
    ]
  },
  {
    id: "iron",
    title: "ヘアアイロンを使用する頻度を教えてください。",
    hint: "普段のスタイリング頻度を選んでください。",
    options: [
      { label: "ほとんど使わない", scores: { normal: 1 } },
      { label: "週に数回使う", scores: { damage: 2, dry: 1 } },
      { label: "ほぼ毎日使う", scores: { damage: 5, dry: 2 } }
    ]
  },
  {
    id: "scalp",
    title: "頭皮のかゆみやフケはありますか？",
    hint: "頭皮ケアの優先度を判定します。",
    options: [
      { label: "よくある", scores: { scalp: 8 } },
      { label: "ときどきある", scores: { scalp: 4 } },
      { label: "ほとんどない", scores: { normal: 1 } }
    ]
  },
  {
    id: "concerns",
    title: "現在の髪の悩みを教えてください。",
    hint: "複数選択できます。選び終えたら次へ進んでください。",
    multiple: true,
    options: [
      { label: "パサつき", scores: { dry: 6, damage: 2 } },
      { label: "うねり・くせ毛", scores: { curly: 6, frizz: 2 } },
      { label: "広がり", scores: { frizz: 6, dry: 2 } },
      { label: "ボリューム不足", scores: { fine: 3, volume: 6 } },
      { label: "ダメージ", scores: { damage: 6, dry: 2 } },
      { label: "フケ・かゆみ", scores: { scalp: 8 } },
      { label: "特にない", scores: { normal: 2 } }
    ]
  }
];
