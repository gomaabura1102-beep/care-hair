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
- 写真はブラウザでJPEGへ描き直し、EXIF・位置情報を除去してから非公開Storageへ保存します。
- 写真、元の質問回答、元ラベル、診断ロジックVersionを関連付けます。
- 画像AIの自動学習処理は実装していません。
- `/admin` はSupabase Authと`profiles.role = 'admin'`の両方をサーバーで確認します。
- AI学習用エクスポートは、同意済み・確認済み・分割済みデータだけを対象にします。

## 主な機能

- 質問だけ／写真＋質問の2種類の診断と、根拠を表示するルールベース推薦
- 診断結果に基づくシャンプー・トリートメント各TOP3
- 髪質・悩み・価格・仕上がり・重さなどの商品絞り込み
- 最大3商品の比較、お気に入り、最近見た商品の端末内保存
- 使用開始記録、約2週間後の使用感、任意の使用前／使用後写真記録
- 実投稿数を明示する口コミ、髪質フィルター、投稿内容の管理者確認
- Supabase Authで保護された運営者画面と、非公開診断画像の短時間表示

お気に入り・比較・使用履歴・使用前／使用後写真は利用者の端末内に保存します。使用前／使用後写真はSupabaseへ送信しません。

## 商品の購入リンクについて

商品カードは、正式なAPIレスポンスから取得して登録した `officialImages`、楽天の生成HTML `rakutenImageHtml` の順で表示します。どちらも未登録の場合は、Care Hairオリジナルの「商品画像準備中」を表示します。商品詳細・比較ページの既存画像枠は、元HTMLがなければ非表示です。

`officialImages` は表示優先順の配列で、`source`（amazon / rakuten）、`obtainedVia`（creators-api / rakuten-ichiba-api）、`url`、`itemId`、`affiliateUrl` を組にして保持します。実際に公式APIから取得し、商品・容量・種類と利用条件を確認できた情報だけを登録してください。このフィールドやドメイン検証自体が、画像の利用許諾を証明するものではありません。画像を押したときは同じレコードの購入URLを使用し、既存のAmazon・楽天ボタンは元のURLをそのまま使います。画像URLの書き換え、ダウンロード保存、代理配信はしません。失敗時は次の正式な画像、最後にプレースホルダーへ切り替えます。

楽天の元HTMLを使う場合は、リンク作成画面で「画像のみ・240×240」を選択し、生成されたHTML全体を編集せず `data/products.ts` の対象商品へ登録してください。

生成HTMLはsandbox付きiframeの `srcDoc` へそのまま渡します。サイトのCSSで画像やリンクの属性・サイズを変更せず、PR表記はHTMLの外に表示します。スクリプトは実行できません。元HTML内のリンクは別タブで開けます。

既存の `affiliateImageUrl` は参照用に残していますが表示には使いません。URLの `pc` パラメーターから画像を取り出す処理は削除しました。ローカル商品画像への切り替えも行いません。楽天の生成HTMLが閲覧環境でブロックされる場合、そのブロックを回避するためのURL書き換えは行いません。

掲載前に、登録するHTMLが該当商品用の正式な生成コードであることと、公開サイトが楽天アフィリエイトの登録サイトであることを確認してください。URLだけから生成HTMLを復元しないでください。

### APIの設定状況

現在、このリポジトリにAmazon/Rakutenの商品API取得処理はありません。`officialImages` は全商品で未設定です。APIキーを設定するだけで画像取得が始まる実装ではありません。確認できたローカル設定は `.env.example` のSupabase/OpenAI/Google Analytics用項目だけで、Vercelの非公開環境変数は未確認です。

将来API連携を追加する際は、以下を各公式管理画面で取得し、サーバー専用の `.env.local` とVercel環境変数に設定します。以下の変数名は連携追加時の候補で、現在のコードは読み取りません。秘密情報に `NEXT_PUBLIC_` を付けないでください。

- 楽天市場商品検索API: 楽天ウェブサービスで発行するApplication ID、Access Key、楽天アフィリエイトID（候補: `RAKUTEN_APPLICATION_ID`、`RAKUTEN_ACCESS_KEY`、`RAKUTEN_AFFILIATE_ID`）。各商品の正確なitemCode、APIレスポンスの画像とアフィリエイトURLを対応付ける実装・利用条件に沿った更新処理が別途必要です。https://webservice.rakuten.co.jp/documentation/ichiba-item-search
- Amazon Creators API: アソシエイト・セントラルでAPI利用登録後に発行するClient ID、Client Secret、Partner Tag（候補: `AMAZON_CREATORS_CLIENT_ID`、`AMAZON_CREATORS_CLIENT_SECRET`、`AMAZON_ASSOCIATE_TAG`）。各商品のASIN、認証・取得処理、利用条件に沿った画像URLの更新処理が別途必要です。https://affiliate.amazon.co.jp/creatorsapi/docs/en-us/get-started/using-curl
- 元の楽天生成HTMLを提供する方法なら、APIキーは不要です。

### 画像のテスト

`npm run test:images` で未設定・読み込み失敗・提供元の対応・URL不変・不正URL・1px画像・元HTMLの保持を確認します。テスト用URLは通信せずReact上のイベントで検証し、本番の商品データには登録しません。実際の商品写真を取得・確認したテストではありません。
