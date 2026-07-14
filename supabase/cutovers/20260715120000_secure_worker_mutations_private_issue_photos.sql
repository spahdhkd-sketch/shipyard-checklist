begin;

revoke insert, update, delete on table public.safety_inspections from anon, authenticated, public;
revoke insert, update, delete on table public.safety_inspection_items from anon, authenticated, public;
revoke insert, update, delete on table public.unsafe_issues from anon, authenticated, public;
revoke insert, update, delete on table public.missing_materials from anon, authenticated, public;
revoke insert, update, delete on table public.issue_photos from anon, authenticated, public;
revoke insert, update, delete on table public.work_prep_records from anon, authenticated, public;
revoke select on table public.issue_photos from anon, authenticated, public;

drop policy if exists "public insert safety inspections" on public.safety_inspections;
drop policy if exists "public insert safety inspection items" on public.safety_inspection_items;
drop policy if exists "public insert unsafe issues" on public.unsafe_issues;
drop policy if exists "public insert missing materials" on public.missing_materials;
drop policy if exists "public insert issue photos" on public.issue_photos;
drop policy if exists "public read issue photos" on public.issue_photos;
drop policy if exists "public insert work prep records" on public.work_prep_records;
drop policy if exists "public update work prep records" on public.work_prep_records;

do $$
begin
  if not exists (select 1 from storage.buckets where id = 'issue-photos') then
    raise exception 'issue-photos bucket is missing';
  end if;
end
$$;

update storage.buckets set public = false where id = 'issue-photos';

drop policy if exists "issue_photos_insert_public" on storage.objects;
drop policy if exists "issue_photos_delete_public" on storage.objects;
drop policy if exists "public update issue photos" on public.issue_photos;
drop policy if exists "public delete issue photos" on public.issue_photos;

commit;
