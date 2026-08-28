# Care Hair

男子高校生向けのヘアケア診断サービスです。Next.js App Router、TypeScript、Tailwind CSS、Supabaseで構成しています。

## 起動方法

```bash
npm install
npm run dev
```

診断データの保存と管理画面を利用するには、Supabaseの設定が必要です。手順は [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) を確認してください。

## 診断データの扱い

- 診断結果は質問回答だけから算出します。写真の解析値は使用しません。
- 写真はブラウザでWebPへ描き直し、EXIF・位置情報を除去してから非公開Storageへ保存します。
- 写真、元の質問回答、元ラベル、診断ロジックVersionを関連付けます。
- 画像AIの自動学習処理は実装していません。
- `/admin` はSupabase Authと`profiles.role = 'admin'`の両方をサーバーで確認します。
- AI学習用エクスポートは、同意済み・確認済み・分割済みデータだけを対象にします。

## 実装ステップ

1. プロジェクト作成
2. ホームページ
3. ヘッダー・フッター
4. 診断ページ
5. 診断ロジック
6. 診断結果
7. 商品一覧
8. 商品詳細
9. Aboutページ
10. 最終デザイン調整

## 商品画像について

`data/products.ts` の `image` を差し替えるだけで、商品画像を更新できます。Amazonへのリンクは各商品の検索リンクとして管理しています。
