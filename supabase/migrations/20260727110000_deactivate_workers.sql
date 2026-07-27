create or replace view public.workers_public
with (security_invoker = true)
as
select
  id,
  name,
  team,
  position,
  active,
  unsafe_push_target,
  created_at,
  updated_at
from public.workers
where active is true;

grant select on table public.workers_public to anon, authenticated;

create or replace function public.admin_deactivate_worker(
  p_worker_id text,
  p_actor_worker_id text,
  p_actor_session_id text
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  updated_workers integer := 0;
  revoked_sessions integer := 0;
  deleted_subscriptions integer := 0;
begin
  if nullif(trim(p_worker_id), '') is null then
    return jsonb_build_object('error', 'worker_id_invalid');
  end if;

  if p_worker_id = p_actor_worker_id then
    return jsonb_build_object('error', 'worker_self_delete_forbidden');
  end if;

  perform 1
  from public.admin_mutation_sessions as session
  join public.workers as actor on actor.id = session.worker_id
  where session.id = p_actor_session_id
    and session.worker_id = p_actor_worker_id
    and session.revoked_at is null
    and session.expires_at > now()
    and actor.active is true
  for update of session, actor;
  if not found then
    return jsonb_build_object('error', 'admin_session_invalid');
  end if;

  update public.workers
  set
    active = false,
    updated_at = now()
  where id = p_worker_id
    and active is true;
  get diagnostics updated_workers = row_count;

  update public.admin_mutation_sessions
  set revoked_at = coalesce(revoked_at, now())
  where worker_id = p_worker_id
    and revoked_at is null;
  get diagnostics revoked_sessions = row_count;

  delete from public.worker_push_subscriptions
  where worker_id = p_worker_id;
  get diagnostics deleted_subscriptions = row_count;

  return jsonb_build_object(
    'ok', true,
    'mutated', updated_workers,
    'revokedSessions', revoked_sessions,
    'deletedSubscriptions', deleted_subscriptions
  );
end;
$$;

revoke all on function public.admin_deactivate_worker(text, text, text) from public, anon, authenticated;
grant execute on function public.admin_deactivate_worker(text, text, text) to service_role;

create index if not exists worker_push_subscriptions_worker_id_idx
  on public.worker_push_subscriptions (worker_id);

create or replace function public.enforce_active_worker_push_subscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform 1
  from public.workers
  where id = new.worker_id
    and active is true
  for share;
  if not found then
    raise exception 'worker_inactive'
      using errcode = '23503';
  end if;
  return new;
end;
$$;

drop trigger if exists worker_push_subscription_active_worker on public.worker_push_subscriptions;
create trigger worker_push_subscription_active_worker
before insert or update on public.worker_push_subscriptions
for each row execute function public.enforce_active_worker_push_subscription();

revoke all on function public.enforce_active_worker_push_subscription() from public, anon, authenticated;

comment on view public.workers_public is
  'Public worker directory exposes active worker profiles only; credentials remain private.';

comment on function public.admin_deactivate_worker(text, text, text) is
  'Atomically deactivates a worker, revokes active admin sessions, and removes push subscriptions while preserving historical records.';
