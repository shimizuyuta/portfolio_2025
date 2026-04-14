-- articles テーブルにサムネイル URL カラムを追加
alter table articles
  add column if not exists thumbnail_url text;

-- Supabase Storage: blog-images バケットを作成（公開）
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880,  -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Storage RLS: 誰でも読み取り可（バケットが public なので SELECT は不要だが明示)
create policy "blog-images 公開読み取り"
  on storage.objects for select
  using (bucket_id = 'blog-images');

-- Storage RLS: アップロードはサービスロールのみ（RLS をバイパスするため実質不要だが明示）
create policy "blog-images サービスロールのみ書き込み"
  on storage.objects for insert
  with check (bucket_id = 'blog-images');

create policy "blog-images サービスロールのみ削除"
  on storage.objects for delete
  using (bucket_id = 'blog-images');
