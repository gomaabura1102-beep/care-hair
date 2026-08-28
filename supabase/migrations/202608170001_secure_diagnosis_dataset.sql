create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated, service_role;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.diagnoses (
  id uuid primary key default gen_random_uuid(),
  anonymous_user_id uuid not null,
  original_answers jsonb,
  original_scores jsonb,
  original_labels jsonb,
  result_snapshot jsonb,
  diagnosis_logic_version text not null,
  consent_ai_training boolean not null default false,
  consent_version text not null,
  consented_at timestamptz not null,
  guardian_confirmation boolean not null default false,
  data_status text not null default 'draft' check (data_status in ('draft', 'completed', 'deletion_requested')),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint completed_diagnosis_has_originals check (
    data_status <> 'completed' or
    (original_answers is not null and original_scores is not null and original_labels is not null and result_snapshot is not null)
  )
);

create table if not exists public.diagnosis_images (
  id uuid primary key default gen_random_uuid(),
  diagnosis_id uuid not null references public.diagnoses(id) on delete cascade,
  storage_path text not null unique,
  direction text not null check (direction in ('front', 'side', 'back', 'top', 'other')),
  mime_type text not null default 'image/webp' check (mime_type = 'image/webp'),
  width integer not null check (width between 400 and 1600),
  height integer not null check (height between 400 and 1600),
  byte_size integer not null check (byte_size between 1 and 4194304),
  exif_removed boolean not null default true check (exif_removed = true),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_reviews (
  diagnosis_id uuid primary key references public.diagnoses(id) on delete cascade,
  admin_label jsonb,
  admin_note text check (char_length(admin_note) <= 4000),
  review_status text not null default 'unreviewed' check (
    review_status in ('unreviewed', 'usable', 'low_quality', 'label_review_needed', 'excluded')
  ),
  dataset_split text not null default 'unassigned' check (
    dataset_split in ('unassigned', 'train', 'validation', 'test', 'excluded')
  ),
  image_quality text not null default 'unrated' check (
    image_quality in ('unrated', 'good', 'acceptable', 'poor')
  ),
  hair_visibility text not null default 'unrated' check (
    hair_visibility in ('unrated', 'good', 'acceptable', 'poor')
  ),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz
);

create table if not exists public.admin_audit_logs (
  id bigint generated always as identity primary key,
  admin_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_diagnosis_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists diagnoses_created_at_idx on public.diagnoses(created_at desc);
create index if not exists diagnoses_anonymous_created_idx on public.diagnoses(anonymous_user_id, created_at desc);
create index if not exists diagnoses_logic_version_idx on public.diagnoses(diagnosis_logic_version);
create index if not exists diagnoses_hair_body_idx on public.diagnoses((original_labels->>'hairBody'));
create index if not exists diagnosis_images_diagnosis_idx on public.diagnosis_images(diagnosis_id);
create index if not exists diagnosis_images_direction_idx on public.diagnosis_images(direction);
create index if not exists admin_reviews_status_idx on public.admin_reviews(review_status, dataset_split);
create index if not exists admin_reviews_reviewer_idx on public.admin_reviews(reviewed_by);
create index if not exists admin_audit_created_at_idx on public.admin_audit_logs(created_at desc);
create index if not exists admin_audit_admin_user_idx on public.admin_audit_logs(admin_user_id);
create index if not exists admin_audit_target_idx on public.admin_audit_logs(target_diagnosis_id);

alter table public.profiles enable row level security;
alter table public.diagnoses enable row level security;
alter table public.diagnosis_images enable row level security;
alter table public.admin_reviews enable row level security;
alter table public.admin_audit_logs enable row level security;

-- anon/authenticated向けポリシーは意図的に作成しません。
-- すべての診断データ操作は、認証・入力検証後のサーバー処理だけがservice_roleで行います。

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.diagnoses from anon, authenticated;
revoke all on table public.diagnosis_images from anon, authenticated;
revoke all on table public.admin_reviews from anon, authenticated;
revoke all on table public.admin_audit_logs from anon, authenticated;

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.profiles to service_role;
grant select, insert, update, delete on table public.diagnoses to service_role;
grant select, insert, update, delete on table public.diagnosis_images to service_role;
grant select, insert, update, delete on table public.admin_reviews to service_role;
grant select, insert, update, delete on table public.admin_audit_logs to service_role;
grant usage, select on sequence public.admin_audit_logs_id_seq to service_role;

create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure private.handle_new_auth_user();

create or replace function private.prevent_original_diagnosis_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.original_answers is not null and (
    new.original_answers is distinct from old.original_answers or
    new.original_scores is distinct from old.original_scores or
    new.original_labels is distinct from old.original_labels or
    new.result_snapshot is distinct from old.result_snapshot or
    new.diagnosis_logic_version is distinct from old.diagnosis_logic_version
  ) then
    raise exception 'Original diagnosis data is immutable';
  end if;
  if new.consent_ai_training is distinct from old.consent_ai_training or
     new.consent_version is distinct from old.consent_version or
     new.consented_at is distinct from old.consented_at then
    raise exception 'Consent record is immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_original_diagnosis on public.diagnoses;
create trigger protect_original_diagnosis
  before update on public.diagnoses
  for each row execute procedure private.prevent_original_diagnosis_changes();

create or replace function private.prevent_audit_log_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Audit logs are append-only';
end;
$$;

drop trigger if exists protect_audit_log on public.admin_audit_logs;
create trigger protect_audit_log
  before update or delete on public.admin_audit_logs
  for each row execute procedure private.prevent_audit_log_mutation();

revoke execute on function private.handle_new_auth_user() from public, anon, authenticated, service_role;
revoke execute on function private.prevent_original_diagnosis_changes() from public, anon, authenticated, service_role;
revoke execute on function private.prevent_audit_log_mutation() from public, anon, authenticated, service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('hair-diagnosis-images', 'hair-diagnosis-images', false, 4194304, array['image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
