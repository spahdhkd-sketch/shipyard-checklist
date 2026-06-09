-- Store work-prep status changes as an audit timeline.
-- Keep the public sync shape bounded while allowing admin-mutations to persist
-- status changes immediately through the service-role Edge Function.

alter table public.work_prep_records
  add column if not exists status_history jsonb not null default '[]'::jsonb;

create index if not exists work_prep_records_status_idx
  on public.work_prep_records (status);

create index if not exists work_prep_records_updated_at_idx
  on public.work_prep_records (updated_at desc);

drop policy if exists "public insert work prep records" on public.work_prep_records;
drop policy if exists "public update work prep records" on public.work_prep_records;

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
    and jsonb_typeof(status_history) = 'array'
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
    and jsonb_typeof(status_history) = 'array'
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
    and jsonb_typeof(status_history) = 'array'
    and coalesce(status, 'preparing') in ('confirmed', 'preparing', 'ordered', 'unregistered', 'used')
  );

comment on column public.work_prep_records.status_history is
  'Audit timeline for work-prep registration and admin status changes.';
