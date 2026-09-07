# Supabase セットアップ

Care Hairの診断データは、SupabaseのPostgreSQL・Auth・非公開Storageを使用します。画像や秘密鍵をGitへ保存しないでください。

## 1. Supabaseプロジェクトを作成

Supabaseで本番用プロジェクトを作成します。Project Settings > API Keysから、次の3項目を確認します。

- Project URL
- Publishable key（`sb_publishable_...`）
- Secret key（`sb_secret_...`）

Secret keyはRLSを迂回して全データへアクセスできる秘密鍵です。ブラウザ、チャット、GitHubへ貼らないでください。

## 2. DBと非公開Storageを作成

SupabaseのSQL Editorで、次のマイグレーションを実行します。

```text
supabase/migrations/202608170001_secure_diagnosis_dataset.sql
```

続けて、次のマイグレーションも実行します。

```text
supabase/migrations/202608170002_restrict_rls_helper.sql
supabase/migrations/202608210001_allow_jpeg_diagnosis_images.sql
supabase/migrations/202608210002_allow_jpeg_diagnosis_image_records.sql
supabase/migrations/202609050001_product_reviews.sql
```

これらのSQLは以下を作成・設定します。

- `profiles`
- `diagnoses`
- `diagnosis_images`
- `admin_reviews`
- `admin_audit_logs`
- `product_reviews`
- 非公開バケット `hair-diagnosis-images`
- 元回答・元ラベルを上書きさせないトリガー
- 追記専用の管理者操作ログ
- 全診断テーブルのRLS
- 公開前確認を行う口コミ保存領域と管理者レビュー項目

一般ユーザー用のRLSポリシーは意図的に作成していません。診断データへ直接アクセスできるクライアントは存在せず、サーバーAPIだけが入力検証後にSecret keyで操作します。

## 3. 管理者を作成

Authentication > Usersで運営者アカウントを作成します。パスワードはソースコードへ書きません。

作成後、SQL Editorで対象ユーザーへ管理者権限を付与します。メールアドレス部分を実際の管理者に置き換えてください。

```sql
insert into public.profiles (id, role)
select id, 'admin'
from auth.users
where email = 'admin@example.com'
on conflict (id) do update set role = 'admin';
```

管理者権限を外す場合：

```sql
update public.profiles
set role = 'user'
where id = (select id from auth.users where email = 'admin@example.com');
```

## 4. 環境変数

ローカルでは`.env.local`、VercelではProject Settings > Environment Variablesに設定します。

```dotenv
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_SECRET_KEY=sb_secret_xxx
```

`SUPABASE_SECRET_KEY`に`NEXT_PUBLIC_`を付けてはいけません。旧形式の`SUPABASE_ANON_KEY`と`SUPABASE_SERVICE_ROLE_KEY`も互換用に利用できますが、新規設定では上記の新しいキーを使用します。

## 5. 動作確認

```bash
npm install
npm run dev
```

確認項目：

1. `/diagnosis`で写真を選択し、同意後に質問へ進める
2. 11問の回答後、質問だけから診断結果が表示される
3. Supabase Storageのバケットが`Public: false`である
4. 一般ブラウザから画像のStorageパスへ直接アクセスできない
5. `/admin`が未ログイン・一般ユーザーを拒否する
6. 管理者だけが画像、元回答、元ラベルを確認できる
7. 「同意あり・使用可能・train/validation/test」のデータだけがエクスポートされる
8. 口コミ投稿が`pending`で保存され、管理者が公開するまで一般画面へ出ない

## 運用前に決める事項

- 18歳未満の利用者に対する正式な保護者同意文
- 写真と未完了診断の保存期間
- 削除依頼を受け付ける連絡窓口
- プライバシーポリシーと利用規約
- 学習・検証・テスト分割時に同一人物のデータを異なる分割へ混ぜない運用ルール

現在、画像AIの推論・自動学習・顔認識・本人識別は行いません。
