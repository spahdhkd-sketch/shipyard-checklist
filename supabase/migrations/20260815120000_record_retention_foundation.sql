begin;

create or replace function public.record_retention_record_ids_valid(p_record_ids text[])
returns boolean
language sql
immutable
strict
set search_path = ''
as $$
  select
    pg_catalog.cardinality(p_record_ids) > 0
    and not exists (
      select 1
      from pg_catalog.unnest(p_record_ids) as input(record_id)
      where input.record_id is null
        or pg_catalog.char_length(pg_catalog.btrim(input.record_id)) not between 1 and 120
    )
    and pg_catalog.cardinality(p_record_ids) = (
      select pg_catalog.count(distinct pg_catalog.btrim(input.record_id))
      from pg_catalog.unnest(p_record_ids) as input(record_id)
    );
$$;

revoke all on function public.record_retention_record_ids_valid(text[]) from public, anon, authenticated;
grant execute on function public.record_retention_record_ids_valid(text[]) to service_role;

create table if not exists public.record_retention_states (
  resource_type text not null,
  record_id text not null,
  status text not null,
  archived_at timestamptz,
  retention_expires_at timestamptz,
  restored_at timestamptz,
  last_reason text not null,
  actor_ref text not null,
  request_id text not null,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  primary key (resource_type, record_id),
  check (resource_type ~ '^[a-z][a-z0-9_]{0,79}$'),
  check (pg_catalog.char_length(record_id) between 1 and 120),
  check (status in ('archived', 'active')),
  check (pg_catalog.char_length(pg_catalog.btrim(last_reason)) between 1 and 500),
  check (pg_catalog.char_length(pg_catalog.btrim(actor_ref)) between 1 and 120),
  check (pg_catalog.char_length(pg_catalog.btrim(request_id)) between 1 and 120),
  check (
    (
      status = 'archived'
      and archived_at is not null
      and retention_expires_at > archived_at
      and restored_at is null
    )
    or (
      status = 'active'
      and archived_at is null
      and retention_expires_at is null
      and restored_at is not null
    )
  )
);

create index if not exists record_retention_states_expiry_idx
  on public.record_retention_states (retention_expires_at, resource_type)
  where status = 'archived';

create table if not exists public.record_retention_events (
  event_id text primary key,
  request_id text not null,
  resource_type text not null,
  record_ids text[] not null,
  action text not null,
  reason text not null,
  affected_count integer not null,
  actor_ref text not null,
  mutation_session_id text,
  retention_expires_at timestamptz,
  occurred_at timestamptz not null default pg_catalog.now(),
  unique (request_id, resource_type, action),
  check (pg_catalog.char_length(pg_catalog.btrim(event_id)) between 1 and 120),
  check (pg_catalog.char_length(pg_catalog.btrim(request_id)) between 1 and 120),
  check (resource_type ~ '^[a-z][a-z0-9_]{0,79}$'),
  check (action in ('archive', 'restore', 'purge_expired')),
  check (public.record_retention_record_ids_valid(record_ids)),
  check (affected_count > 0 and affected_count = pg_catalog.cardinality(record_ids)),
  check (pg_catalog.char_length(pg_catalog.btrim(reason)) between 1 and 500),
  check (pg_catalog.char_length(pg_catalog.btrim(actor_ref)) between 1 and 120),
  check (mutation_session_id is null or pg_catalog.char_length(pg_catalog.btrim(mutation_session_id)) between 1 and 120),
  check (
    (action = 'archive' and retention_expires_at > occurred_at)
    or (action in ('restore', 'purge_expired') and retention_expires_at is null)
  )
);

create index if not exists record_retention_events_resource_time_idx
  on public.record_retention_events (resource_type, occurred_at desc);

create or replace function public.record_retention_transition(
  p_action text,
  p_resource_type text,
  p_record_ids text[],
  p_reason text,
  p_expected_affected_count integer,
  p_request_id text,
  p_actor_ref text,
  p_mutation_session_id text default null,
  p_retention_expires_at timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz;
  v_record_ids text[];
  v_affected_ids text[];
  v_existing_record_ids text[];
  v_existing_reason text;
  v_existing_count integer;
  v_existing_expiry timestamptz;
  v_event_id text;
begin
  if p_action is null or p_action not in ('archive', 'restore', 'purge_expired') then
    raise exception 'action_unsupported' using errcode = 'P0001';
  end if;
  if p_resource_type is null
    or p_resource_type not in ('safety_inspection', 'work_prep_record', 'unsafe_issue', 'missing_material') then
    raise exception 'resource_type_unsupported' using errcode = 'P0001';
  end if;
  if p_record_ids is null
    or not public.record_retention_record_ids_valid(p_record_ids)
    or pg_catalog.cardinality(p_record_ids) > 200 then
    raise exception 'record_ids_invalid' using errcode = 'P0001';
  end if;
  if p_expected_affected_count is null or p_expected_affected_count < 1
    or p_expected_affected_count > 200 then
    raise exception 'affected_count_invalid' using errcode = 'P0001';
  end if;
  if p_reason is null
    or pg_catalog.char_length(pg_catalog.btrim(p_reason)) not between 1 and 500 then
    raise exception 'reason_invalid' using errcode = 'P0001';
  end if;
  if p_request_id is null
    or pg_catalog.char_length(pg_catalog.btrim(p_request_id)) not between 1 and 120 then
    raise exception 'request_id_invalid' using errcode = 'P0001';
  end if;
  if p_actor_ref is null
    or pg_catalog.char_length(pg_catalog.btrim(p_actor_ref)) not between 1 and 120 then
    raise exception 'actor_ref_invalid' using errcode = 'P0001';
  end if;
  if p_mutation_session_id is not null
    and pg_catalog.char_length(pg_catalog.btrim(p_mutation_session_id)) not between 1 and 120 then
    raise exception 'mutation_session_id_invalid' using errcode = 'P0001';
  end if;
  if p_action in ('restore', 'purge_expired') and p_retention_expires_at is not null then
    raise exception 'retention_expiry_not_allowed' using errcode = 'P0001';
  end if;

  select pg_catalog.array_agg(pg_catalog.btrim(input.record_id) order by input.ordinality)
  into v_record_ids
  from pg_catalog.unnest(p_record_ids) with ordinality as input(record_id, ordinality);

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('record_retention:' || p_resource_type, 0)
  );
  v_now := pg_catalog.clock_timestamp();

  select event.record_ids, event.reason, event.affected_count, event.retention_expires_at
  into v_existing_record_ids, v_existing_reason, v_existing_count, v_existing_expiry
  from public.record_retention_events as event
  where event.request_id = pg_catalog.btrim(p_request_id)
    and event.resource_type = p_resource_type
    and event.action = p_action;

  if found then
    if v_existing_record_ids <> v_record_ids
      or v_existing_reason <> pg_catalog.btrim(p_reason)
      or v_existing_count <> p_expected_affected_count
      or v_existing_expiry is distinct from p_retention_expires_at then
      raise exception 'request_id_conflict' using errcode = 'P0001';
    end if;
    return pg_catalog.jsonb_build_object(
      'ok', true,
      'action', p_action,
      'resourceType', p_resource_type,
      'recordIds', pg_catalog.to_jsonb(v_existing_record_ids),
      'affectedCount', v_existing_count,
      'replayed', true
    );
  end if;

  if p_action = 'archive' and (
    p_retention_expires_at is null
    or p_retention_expires_at <= v_now
    or p_retention_expires_at > v_now + pg_catalog.make_interval(days => 3650)
  ) then
    raise exception 'retention_expiry_invalid' using errcode = 'P0001';
  end if;

  if p_action = 'archive' then
    select pg_catalog.array_agg(input.record_id order by input.ordinality)
    into v_affected_ids
    from pg_catalog.unnest(v_record_ids) with ordinality as input(record_id, ordinality)
    left join public.record_retention_states as state
      on state.resource_type = p_resource_type
      and state.record_id = input.record_id
    where state.status is distinct from 'archived';
  elsif p_action = 'restore' then
    select pg_catalog.array_agg(input.record_id order by input.ordinality)
    into v_affected_ids
    from pg_catalog.unnest(v_record_ids) with ordinality as input(record_id, ordinality)
    join public.record_retention_states as state
      on state.resource_type = p_resource_type
      and state.record_id = input.record_id
      and state.status = 'archived';
  else
    select pg_catalog.array_agg(input.record_id order by input.ordinality)
    into v_affected_ids
    from pg_catalog.unnest(v_record_ids) with ordinality as input(record_id, ordinality)
    join public.record_retention_states as state
      on state.resource_type = p_resource_type
      and state.record_id = input.record_id
      and state.status = 'archived'
      and state.retention_expires_at <= v_now;
  end if;

  if coalesce(pg_catalog.cardinality(v_affected_ids), 0) <> p_expected_affected_count
    or v_affected_ids <> v_record_ids then
    raise exception 'affected_count_mismatch' using errcode = 'P0001';
  end if;

  if p_action = 'archive' then
    insert into public.record_retention_states (
      resource_type,
      record_id,
      status,
      archived_at,
      retention_expires_at,
      restored_at,
      last_reason,
      actor_ref,
      request_id,
      updated_at
    )
    select
      p_resource_type,
      input.record_id,
      'archived',
      v_now,
      p_retention_expires_at,
      null,
      pg_catalog.btrim(p_reason),
      pg_catalog.btrim(p_actor_ref),
      pg_catalog.btrim(p_request_id),
      v_now
    from pg_catalog.unnest(v_affected_ids) as input(record_id)
    on conflict (resource_type, record_id) do update
    set status = 'archived',
        archived_at = excluded.archived_at,
        retention_expires_at = excluded.retention_expires_at,
        restored_at = null,
        last_reason = excluded.last_reason,
        actor_ref = excluded.actor_ref,
        request_id = excluded.request_id,
        updated_at = excluded.updated_at;
  elsif p_action = 'restore' then
    update public.record_retention_states
    set status = 'active',
        archived_at = null,
        retention_expires_at = null,
        restored_at = v_now,
        last_reason = pg_catalog.btrim(p_reason),
        actor_ref = pg_catalog.btrim(p_actor_ref),
        request_id = pg_catalog.btrim(p_request_id),
        updated_at = v_now
    where resource_type = p_resource_type
      and record_id = any(v_affected_ids);
  end if;

  v_event_id := 'rte_' || pg_catalog.md5(
    pg_catalog.btrim(p_request_id) || ':' || p_resource_type || ':' || p_action
  );
  insert into public.record_retention_events (
    event_id,
    request_id,
    resource_type,
    record_ids,
    action,
    reason,
    affected_count,
    actor_ref,
    mutation_session_id,
    retention_expires_at,
    occurred_at
  ) values (
    v_event_id,
    pg_catalog.btrim(p_request_id),
    p_resource_type,
    v_affected_ids,
    p_action,
    pg_catalog.btrim(p_reason),
    p_expected_affected_count,
    pg_catalog.btrim(p_actor_ref),
    case when p_mutation_session_id is null then null else pg_catalog.btrim(p_mutation_session_id) end,
    p_retention_expires_at,
    v_now
  );

  return pg_catalog.jsonb_build_object(
    'ok', true,
    'action', p_action,
    'resourceType', p_resource_type,
    'recordIds', pg_catalog.to_jsonb(v_affected_ids),
    'affectedCount', p_expected_affected_count,
    'replayed', false
  );
end;
$$;

revoke all on function public.record_retention_transition(
  text, text, text[], text, integer, text, text, text, timestamptz
) from public, anon, authenticated;
grant execute on function public.record_retention_transition(
  text, text, text[], text, integer, text, text, text, timestamptz
) to service_role;

alter table public.record_retention_states enable row level security;
alter table public.record_retention_events enable row level security;

revoke all on table public.record_retention_states from public, anon, authenticated;
revoke all on table public.record_retention_events from public, anon, authenticated;

grant select, insert, update, delete on table public.record_retention_states to service_role;
grant select, insert on table public.record_retention_events to service_role;

comment on table public.record_retention_states is
  'Service-owned archive and restore state. Existing resource reads remain unchanged until callers explicitly join this ledger.';

comment on table public.record_retention_events is
  'Append-only audit contract for archive, restore, and retention-expiry actions.';

commit;
