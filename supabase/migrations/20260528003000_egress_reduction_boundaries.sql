drop policy if exists "issue_photos_insert_public" on storage.objects;
drop policy if exists "issue_photos_delete_public" on storage.objects;
drop policy if exists "public update issue photos" on storage.objects;
drop policy if exists "public delete issue photos" on storage.objects;

create policy "issue_photos_insert_public"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'issue-photos'
    and name like 'unsafe/%'
    and position('..' in name) = 0
  );

comment on policy "issue_photos_insert_public" on storage.objects is
  'Egress reduction boundary: browser uploads may create only unsafe issue photo objects. Reads are explicit user/detail flows; deletes use admin-mutations.';
