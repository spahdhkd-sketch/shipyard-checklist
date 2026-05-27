-- Phase 2C work prep records boundary:
-- Work-prep registration sync remains public read/write for field use, but
-- browser clients can no longer delete records or hold schema-level grants.

alter table public.work_prep_records enable row level security;

revoke delete, truncate, references, trigger on table public.work_prep_records from public, anon, authenticated;

grant select, insert, update on table public.work_prep_records to anon, authenticated;

drop policy if exists "allow_all_work_prep_records" on public.work_prep_records;
drop policy if exists "public select work prep records" on public.work_prep_records;
drop policy if exists "public insert work prep records" on public.work_prep_records;
drop policy if exists "public update work prep records" on public.work_prep_records;

create policy "public select work prep records"
  on public.work_prep_records
  for select to anon, authenticated
  using (true);

create policy "public insert work prep records"
  on public.work_prep_records
  for insert to anon, authenticated
  with check (
    id is not null
    and char_length(id) between 1 and 120
    and char_length(work_date) <= 40
    and char_length(coalesce(appearance_time, '')) <= 20
    and char_length(coalesce(team, '')) <= 80
    and char_length(coalesce(ship_no, '')) <= 120
    and char_length(coalesce(category_id, '')) <= 120
    and char_length(coalesce(leader_worker_id, '')) <= 120
    and (worker_ids is null or jsonb_typeof(worker_ids) = 'array')
    and (other_team_worker_ids is null or jsonb_typeof(other_team_worker_ids) = 'array')
    and (tool_ids is null or jsonb_typeof(tool_ids) = 'array')
    and coalesce(status, 'preparing') in ('confirmed', 'preparing', 'ordered', 'unregistered', 'used')
  );

create policy "public update work prep records"
  on public.work_prep_records
  for update to anon, authenticated
  using (true)
  with check (
    id is not null
    and char_length(id) between 1 and 120
    and char_length(work_date) <= 40
    and char_length(coalesce(appearance_time, '')) <= 20
    and char_length(coalesce(team, '')) <= 80
    and char_length(coalesce(ship_no, '')) <= 120
    and char_length(coalesce(category_id, '')) <= 120
    and char_length(coalesce(leader_worker_id, '')) <= 120
    and (worker_ids is null or jsonb_typeof(worker_ids) = 'array')
    and (other_team_worker_ids is null or jsonb_typeof(other_team_worker_ids) = 'array')
    and (tool_ids is null or jsonb_typeof(tool_ids) = 'array')
    and coalesce(status, 'preparing') in ('confirmed', 'preparing', 'ordered', 'unregistered', 'used')
  );

comment on table public.work_prep_records is
  'Phase 2C: public browser access is select/insert/update only for work-prep registration sync; delete and schema-level grants are blocked.';
