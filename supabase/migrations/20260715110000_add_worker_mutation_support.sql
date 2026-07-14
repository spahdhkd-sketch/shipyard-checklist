begin;

alter table public.safety_inspections
  add column if not exists worker_id text references public.workers(id) on delete set null;

update public.safety_inspections inspection
set worker_id = inspection.work_prep_worker_id
where inspection.worker_id is null
  and nullif(inspection.work_prep_worker_id, '') is not null
  and exists (
    select 1
    from public.workers worker
    where worker.id = inspection.work_prep_worker_id
  );

create index if not exists safety_inspections_worker_id_created_at_idx
  on public.safety_inspections (worker_id, created_at desc);

alter table public.issue_photos
  add column if not exists upload_status text not null default 'ready',
  add column if not exists upload_expires_at timestamptz;

do $$
begin
  if exists (
    select 1
    from public.issue_photos
    where sort_order not between 1 and 2
  ) then
    raise exception 'issue_photos has rows outside the supported two-slot range';
  end if;

  if exists (
    select 1
    from public.issue_photos
    group by target_type, target_id, sort_order
    having count(*) > 1
  ) then
    raise exception 'issue_photos has duplicate target slots';
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'issue_photos_upload_status_check'
      and conrelid = 'public.issue_photos'::regclass
  ) then
    alter table public.issue_photos
      add constraint issue_photos_upload_status_check
      check (upload_status in ('pending', 'ready'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'issue_photos_two_slot_check'
      and conrelid = 'public.issue_photos'::regclass
  ) then
    alter table public.issue_photos
      add constraint issue_photos_two_slot_check
      check (sort_order between 1 and 2);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'issue_photos_upload_lifecycle_check'
      and conrelid = 'public.issue_photos'::regclass
  ) then
    alter table public.issue_photos
      add constraint issue_photos_upload_lifecycle_check
      check (
        (upload_status = 'ready' and upload_expires_at is null)
        or (upload_status = 'pending' and upload_expires_at is not null)
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'issue_photos_storage_boundary_check'
      and conrelid = 'public.issue_photos'::regclass
  ) then
    alter table public.issue_photos
      add constraint issue_photos_storage_boundary_check
      check (
        target_type = 'unsafe_issue'
        and storage_bucket = 'issue-photos'
        and storage_path like 'unsafe/%'
        and position('..' in storage_path) = 0
      );
  end if;
end
$$;

create unique index if not exists issue_photos_target_slot_uidx
  on public.issue_photos (target_type, target_id, sort_order);

create unique index if not exists issue_photos_storage_path_uidx
  on public.issue_photos (storage_bucket, storage_path);

drop policy if exists "public read issue photos" on public.issue_photos;
create policy "public read issue photos"
  on public.issue_photos
  for select
  to anon, authenticated
  using (upload_status = 'ready');

drop policy if exists "public insert issue photos" on public.issue_photos;
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
    and sort_order between 1 and 2
    and upload_status = 'ready'
    and upload_expires_at is null
  );

create or replace function public.begin_admin_mutation_attempt(
  p_bucket_key text,
  p_worker_id text,
  p_max_attempts integer default 5,
  p_window_seconds integer default 900,
  p_lock_seconds integer default 900
)
returns table (
  allowed boolean,
  fail_count integer,
  locked_until timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_attempt public.admin_mutation_attempts%rowtype;
  current_time timestamptz := clock_timestamp();
  next_count integer;
  next_locked_until timestamptz;
begin
  if p_worker_id is null
    or char_length(p_worker_id) not between 1 and 120
    or p_bucket_key is distinct from 'worker:' || p_worker_id
    or not exists (
      select 1
      from public.workers worker
      where worker.id = p_worker_id
        and worker.active = true
    ) then
    return query select false, 0, null::timestamptz;
    return;
  end if;

  insert into public.admin_mutation_attempts (
    bucket_key,
    worker_id,
    fail_count,
    window_started_at,
    locked_until,
    updated_at
  )
  values (
    p_bucket_key,
    p_worker_id,
    0,
    current_time,
    null,
    current_time
  )
  on conflict (bucket_key) do nothing;

  select attempt.*
  into current_attempt
  from public.admin_mutation_attempts attempt
  where attempt.bucket_key = p_bucket_key
  for update;

  if current_attempt.locked_until is not null
    and current_attempt.locked_until > current_time then
    return query
      select false, current_attempt.fail_count, current_attempt.locked_until;
    return;
  end if;

  if current_attempt.window_started_at is null
    or current_attempt.window_started_at <= current_time - make_interval(secs => greatest(p_window_seconds, 1)) then
    next_count := 1;
  else
    next_count := current_attempt.fail_count + 1;
  end if;

  if next_count > greatest(p_max_attempts, 1) then
    next_locked_until := current_time + make_interval(secs => greatest(p_lock_seconds, 1));
  end if;

  update public.admin_mutation_attempts
  set
    worker_id = p_worker_id,
    fail_count = next_count,
    window_started_at = case
      when current_attempt.window_started_at is null
        or current_attempt.window_started_at <= current_time - make_interval(secs => greatest(p_window_seconds, 1))
      then current_time
      else current_attempt.window_started_at
    end,
    locked_until = next_locked_until,
    updated_at = current_time
  where bucket_key = p_bucket_key;

  return query
    select next_locked_until is null, next_count, next_locked_until;
end;
$$;

revoke all on function public.begin_admin_mutation_attempt(text, text, integer, integer, integer)
  from public, anon, authenticated;
grant execute on function public.begin_admin_mutation_attempt(text, text, integer, integer, integer)
  to service_role;

commit;
