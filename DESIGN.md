# Care Hair 設計

## ディレクトリ構成

- `app`: App Routerのページ、SEO、robots、sitemap
- `components`: 共通UI、ヘッダー、フッター、カード、アニメーション
- `features/diagnosis`: 診断画面、質問、結果表示
- `data`: 商品、美容師、質問データ
- `lib`: 診断アルゴリズム、汎用関数
- `types`: 商品や診断スコアの型

## 画面構成

- `/`: ヒーロー、サービス紹介、診断の流れ、美容師監修、アンケート結果、おすすめ商品
- `/diagnosis`: 一問ずつ表示する髪質診断
- `/result`: 診断結果。回答データはURLクエリで受け取る
- `/products`: 商品一覧
- `/products/[id]`: 商品詳細
- `/about`: 私たちについて

## コンポーネント設計

- `SiteHeader`, `SiteFooter`: 全ページ共通のナビゲーション
- `Button`: shadcn/ui風の再利用ボタン
- `ProductCard`: 商品一覧、結果、ホームで共通利用
- `FadeIn`: Framer Motionでスクロール時のフェードアップ
- `DiagnosisForm`: React Hook FormとZodで回答を管理
- `ResultSummary`: スコアとおすすめ理由を表示

## 診断アルゴリズム

各回答に `fine`, `normal`, `coarse`, `straight`, `curly`, `dry`, `oily`, `damage`, `scalp`, `frizz`, `volume` の点数を持たせます。

1. 回答ごとの点数を合計
2. `細毛・普通毛・硬毛`、`直毛・癖毛`、`乾燥・普通・脂性`、`ダメージ`、`頭皮状態`を判定
3. 商品ごとの適性スコアと診断スコアを掛け合わせてランキング化
4. シャンプーTOP3、トリートメントTOP3を表示
