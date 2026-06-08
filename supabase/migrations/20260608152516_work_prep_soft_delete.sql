-- Work-prep deletion must survive stale browser sync.
-- Keep rows as server-side tombstones instead of physically deleting them,
-- then hide tombstoned rows from public reads and block public stale updates.

alter table public.work_prep_records
  add column if not exists deleted_at timestamptz;

create index if not exists work_prep_records_deleted_at_idx
  on public.work_prep_records (deleted_at);

revoke update (deleted_at) on table public.work_prep_records from anon, authenticated;

drop policy if exists "public select work prep records" on public.work_prep_records;
drop policy if exists "public insert work prep records" on public.work_prep_records;
drop policy if exists "public update work prep records" on public.work_prep_records;

create policy "public select work prep records"
  on public.work_prep_records
  for select to anon, authenticated
  using (deleted_at is null);

create policy "public insert work prep records"
  on public.work_prep_records
  for insert to anon, authenticated
  with check (
    deleted_at is null
    and id is not null
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
  using (
    deleted_at is null
    and id is not null
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
  )
  with check (
    deleted_at is null
    and id is not null
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

comment on column public.work_prep_records.deleted_at is
  'Server-side tombstone for work-prep deletion. Public sync cannot clear it.';
