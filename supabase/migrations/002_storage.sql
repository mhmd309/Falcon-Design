-- Storage buckets + policies
-- Create buckets in Supabase Dashboard (Storage) OR via this SQL if storage schema allows.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-media', 'site-media', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif','image/avif']),
  ('gallery', 'gallery', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif','image/avif'])
on conflict (id) do nothing;

create policy "public_read_site_media"
  on storage.objects for select
  using (bucket_id = 'site-media');

create policy "public_read_gallery"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "admins_write_site_media"
  on storage.objects for insert
  with check (bucket_id = 'site-media' and public.is_admin());

create policy "admins_update_site_media"
  on storage.objects for update
  using (bucket_id = 'site-media' and public.is_admin())
  with check (bucket_id = 'site-media' and public.is_admin());

create policy "admins_delete_site_media"
  on storage.objects for delete
  using (bucket_id = 'site-media' and public.is_admin());

create policy "admins_write_gallery"
  on storage.objects for insert
  with check (bucket_id = 'gallery' and public.is_admin());

create policy "admins_update_gallery"
  on storage.objects for update
  using (bucket_id = 'gallery' and public.is_admin())
  with check (bucket_id = 'gallery' and public.is_admin());

create policy "admins_delete_gallery"
  on storage.objects for delete
  using (bucket_id = 'gallery' and public.is_admin());
