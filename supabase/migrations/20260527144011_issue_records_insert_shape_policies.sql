-- Phase 2E issue record insert boundary:
-- Field submissions remain public insert/read, but public inserts must look like
-- newly submitted records. Admin status, memo, completion, update, and delete
-- paths stay behind the admin-mutations Edge Function.

alter table public.unsafe_issues enable row level security;
alter table public.missing_materials enable row level security;
alter table public.issue_photos enable row level security;

revoke truncate, references, trigger on table public.unsafe_issues from public, anon, authenticated;
revoke truncate, references, trigger on table public.missing_materials from public, anon, authenticated;
revoke truncate, references, trigger on table public.issue_photos from public, anon, authenticated;

grant select, insert on table public.unsafe_issues to anon, authenticated;
grant select, insert on table public.missing_materials to anon, authenticated;
grant select, insert on table public.issue_photos to anon, authenticated;

drop policy if exists "public insert unsafe issues" on public.unsafe_issues;
drop policy if exists "public insert missing materials" on public.missing_materials;
drop policy if exists "public insert issue photos" on public.issue_photos;

create policy "public insert unsafe issues"
  on public.unsafe_issues
  for insert to anon, authenticated
  with check (
    id is not null
    and char_length(id) between 1 and 120
    and char_length(ship_no) between 1 and 120
    and char_length(content) between 1 and 4000
    and (worker_id is null or char_length(worker_id) between 1 and 120)
    and char_length(worker_name_snapshot) <= 200
    and char_length(worker_team_snapshot) <= 80
    and status = '접수'
    and admin_memo = ''
    and completed_at is null
    and updated_at >= created_at - interval '1 minute'
    and updated_at <= created_at + interval '1 day'
    and jsonb_typeof(status_history) = 'array'
    and case
      when jsonb_typeof(status_history) = 'array' then jsonb_array_length(status_history) between 1 and 20
      else false
    end
  );

create policy "public insert missing materials"
  on public.missing_materials
  for insert to anon, authenticated
  with check (
    id is not null
    and char_length(id) between 1 and 120
    and char_length(ship_no) between 1 and 120
    and char_length(material_name) between 1 and 300
    and char_length(content) between 1 and 4000
    and char_length(material_type) <= 80
    and char_length(material_type_label) <= 120
    and char_length(spec) <= 300
    and char_length(quantity) <= 80
    and char_length(unit) <= 40
    and char_length(detail) <= 2000
    and (worker_id is null or char_length(worker_id) between 1 and 120)
    and char_length(worker_name_snapshot) <= 200
    and char_length(worker_team_snapshot) <= 80
    and status = '접수'
    and admin_memo = ''
    and completed_at is null
    and updated_at >= created_at - interval '1 minute'
    and updated_at <= created_at + interval '1 day'
    and jsonb_typeof(status_history) = 'array'
    and case
      when jsonb_typeof(status_history) = 'array' then jsonb_array_length(status_history) between 1 and 20
      else false
    end
  );

create policy "public insert issue photos"
  on public.issue_photos
  for insert to anon, authenticated
  with check (
    id is not null
    and char_length(id) between 1 and 120
    and target_type = 'unsafe_issue'
    and char_length(target_id) between 1 and 120
    and storage_bucket = 'issue-photos'
    and char_length(storage_path) between 1 and 3000
    and storage_path like 'unsafe/%'
    and position('..' in storage_path) = 0
    and sort_order between 1 and 20
  );

comment on table public.unsafe_issues is
  'Phase 2E: public browser access is select/insert only; inserts are limited to newly submitted unsafe issue records.';

comment on table public.missing_materials is
  'Phase 2E: public browser access is select/insert only; inserts are limited to newly submitted missing material records.';

comment on table public.issue_photos is
  'Phase 2E: public browser access is select/insert only; inserts are limited to unsafe issue photo uploads.';
