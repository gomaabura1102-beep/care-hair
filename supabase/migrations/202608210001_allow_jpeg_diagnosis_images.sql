update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/webp']
where id = 'hair-diagnosis-images';
