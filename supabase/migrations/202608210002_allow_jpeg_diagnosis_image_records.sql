alter table public.diagnosis_images
  drop constraint if exists diagnosis_images_mime_type_check;

alter table public.diagnosis_images
  add constraint diagnosis_images_mime_type_check
  check (mime_type in ('image/jpeg', 'image/webp'));
