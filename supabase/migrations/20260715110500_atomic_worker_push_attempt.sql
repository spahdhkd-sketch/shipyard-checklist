create or replace function public.begin_worker_push_attempt(
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
  current_attempt public.worker_push_attempts%rowtype;
  current_time timestamptz := clock_timestamp();
  next_count integer;
  next_locked_until timestamptz;
begin
  if p_worker_id is null
    or char_length(p_worker_id) not between 1 and 80
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

  insert into public.worker_push_attempts (
    bucket_key,
    worker_id,
    fail_count,
    window_started_at,
    locked_until,
    updated_at
  )
  values (p_bucket_key, p_worker_id, 0, current_time, null, current_time)
  on conflict (bucket_key) do nothing;

  select attempt.*
  into current_attempt
  from public.worker_push_attempts attempt
  where attempt.bucket_key = p_bucket_key
  for update;

  if current_attempt.locked_until is not null
    and current_attempt.locked_until > current_time then
    return query select false, current_attempt.fail_count, current_attempt.locked_until;
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

  update public.worker_push_attempts
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

  return query select next_locked_until is null, next_count, next_locked_until;
end;
$$;

revoke all on function public.begin_worker_push_attempt(text, text, integer, integer, integer)
  from public, anon, authenticated;
grant execute on function public.begin_worker_push_attempt(text, text, integer, integer, integer)
  to service_role;
