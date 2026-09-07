create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  anonymous_user_id uuid not null,
  product_id text not null check (char_length(product_id) between 1 and 120),
  nickname text not null check (char_length(nickname) between 1 and 30),
  age_group text not null check (age_group in ('中学生', '高校生', '大学生以上')),
  hair_type text not null check (hair_type in ('fine', 'normal', 'coarse')),
  concerns jsonb not null default '[]'::jsonb,
  usage_period text not null check (usage_period in ('1週間未満', '1〜2週間', '3週間〜1か月', '1か月以上')),
  rating smallint not null check (rating between 1 and 5),
  positive text not null check (char_length(positive) between 1 and 1000),
  negative text not null check (char_length(negative) between 1 and 1000),
  fragrance text not null check (fragrance in ('好き', '普通', '苦手')),
  finish text not null check (finish in ('軽い', 'ちょうどよい', '重い', 'よく分からない')),
  use_again text not null check (use_again in ('はい', 'まだ分からない', 'いいえ')),
  moderation_status text not null default 'pending' check (moderation_status in ('pending', 'published', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz
);

create index if not exists product_reviews_status_created_idx on public.product_reviews(moderation_status, created_at desc);
create index if not exists product_reviews_product_idx on public.product_reviews(product_id, moderation_status);
create index if not exists product_reviews_anonymous_created_idx on public.product_reviews(anonymous_user_id, created_at desc);
create index if not exists product_reviews_reviewer_idx on public.product_reviews(reviewed_by);

alter table public.product_reviews enable row level security;
revoke all on table public.product_reviews from anon, authenticated;
grant select, insert, update, delete on table public.product_reviews to service_role;

-- 投稿・公開取得とも、入力検証と公開状態の確認を行うCare HairのサーバーAPIだけが実行します。
