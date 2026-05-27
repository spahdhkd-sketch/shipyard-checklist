-- Phase 2C follow-up:
-- Keep work-prep public updates for registration sync, but avoid an always-true
-- UPDATE USING clause so the policy is bounded by the same record shape checks.

drop policy if exists "public update work prep records" on public.work_prep_records;

create policy "public update work prep records"
  on public.work_prep_records
  for update to anon, authenticated
  using (
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
  )
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
