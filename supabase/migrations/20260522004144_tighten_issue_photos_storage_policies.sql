drop policy if exists "issue_photos_insert_public" on storage.objects;
drop policy if exists "issue_photos_delete_public" on storage.objects;

create policy "issue_photos_insert_public"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'issue-photos');

create policy "issue_photos_delete_public"
  on storage.objects
  for delete
  to anon, authenticated
  using (bucket_id = 'issue-photos');
