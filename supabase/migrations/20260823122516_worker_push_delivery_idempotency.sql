create table if not exists public.worker_push_deliveries (
  sender_worker_id text not null references public.workers(id) on delete cascade,
  send_kind text not null check (send_kind in ('test', 'unsafeIssue', 'missingMaterial', 'pledgePending', 'adminManual')),
  idempotency_key text not null,
  target_fingerprint text not null,
  delivery_state text not null default 'processing' check (delivery_state in ('processing', 'completed')),
  response_body jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null,
  primary key (sender_worker_id, send_kind, idempotency_key),
  check (char_length(idempotency_key) between 8 and 120),
  check (char_length(target_fingerprint) between 16 and 128)
);

create index if not exists worker_push_deliveries_expiry_idx
  on public.worker_push_deliveries (expires_at);

alter table public.worker_push_deliveries enable row level security;
revoke all on table public.worker_push_deliveries from public, anon, authenticated;

drop policy if exists "deny browser worker push deliveries" on public.worker_push_deliveries;
create policy "deny browser worker push deliveries"
  on public.worker_push_deliveries
  for all
  to anon, authenticated
  using (false)
  with check (false);

comment on table public.worker_push_deliveries is
  'Service-role-only durable idempotency ledger for worker-push delivery attempts.';

create or replace function public.reserve_worker_push_delivery(
  p_sender_worker_id text,
  p_send_kind text,
  p_idempotency_key text,
  p_target_fingerprint text,
  p_ttl_seconds integer default 600,
  p_inflight_seconds integer default 120
)
returns table(decision text, stored_response jsonb)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_delivery public.worker_push_deliveries%rowtype;
  inserted_count integer := 0;
  safe_ttl_seconds integer := greatest(60, least(coalesce(p_ttl_seconds, 600), 3600));
  safe_inflight_seconds integer := greatest(15, least(coalesce(p_inflight_seconds, 120), 600));
begin
  if p_sender_worker_id is null
    or p_send_kind not in ('test', 'unsafeIssue', 'missingMaterial', 'pledgePending', 'adminManual')
    or p_idempotency_key !~ '^[A-Za-z0-9:._-]{8,120}$'
    or p_target_fingerprint !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid_worker_push_delivery_reservation';
  end if;

  insert into public.worker_push_deliveries (
    sender_worker_id,
    send_kind,
    idempotency_key,
    target_fingerprint,
    delivery_state,
    response_body,
    expires_at
  ) values (
    p_sender_worker_id,
    p_send_kind,
    p_idempotency_key,
    p_target_fingerprint,
    'processing',
    null,
    now() + make_interval(secs => safe_ttl_seconds)
  )
  on conflict (sender_worker_id, send_kind, idempotency_key) do nothing;

  get diagnostics inserted_count = row_count;
  if inserted_count = 1 then
    return query select 'reserved'::text, null::jsonb;
    return;
  end if;

  select *
    into current_delivery
    from public.worker_push_deliveries delivery
   where delivery.sender_worker_id = p_sender_worker_id
     and delivery.send_kind = p_send_kind
     and delivery.idempotency_key = p_idempotency_key
   for update;

  if current_delivery.target_fingerprint <> p_target_fingerprint then
    return query select 'conflict'::text, null::jsonb;
    return;
  end if;

  if current_delivery.delivery_state = 'completed'
    and current_delivery.response_body is not null
    and current_delivery.expires_at > now() then
    return query select 'replayed'::text, current_delivery.response_body;
    return;
  end if;

  if current_delivery.delivery_state = 'processing'
    and current_delivery.updated_at > now() - make_interval(secs => safe_inflight_seconds) then
    return query select 'in_flight'::text, null::jsonb;
    return;
  end if;

  update public.worker_push_deliveries
     set delivery_state = 'processing',
         response_body = null,
         updated_at = now(),
         expires_at = now() + make_interval(secs => safe_ttl_seconds)
   where sender_worker_id = p_sender_worker_id
     and send_kind = p_send_kind
     and idempotency_key = p_idempotency_key;

  return query select 'reserved'::text, null::jsonb;
end;
$$;

create or replace function public.complete_worker_push_delivery(
  p_sender_worker_id text,
  p_send_kind text,
  p_idempotency_key text,
  p_target_fingerprint text,
  p_response_body jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.worker_push_deliveries
     set delivery_state = 'completed',
         response_body = coalesce(p_response_body, '{}'::jsonb),
         updated_at = now()
   where sender_worker_id = p_sender_worker_id
     and send_kind = p_send_kind
     and idempotency_key = p_idempotency_key
     and target_fingerprint = p_target_fingerprint
     and delivery_state = 'processing';
  return found;
end;
$$;

create or replace function public.release_worker_push_delivery(
  p_sender_worker_id text,
  p_send_kind text,
  p_idempotency_key text,
  p_target_fingerprint text
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  delete from public.worker_push_deliveries
   where sender_worker_id = p_sender_worker_id
     and send_kind = p_send_kind
     and idempotency_key = p_idempotency_key
     and target_fingerprint = p_target_fingerprint
     and delivery_state = 'processing';
  return found;
end;
$$;

revoke all on function public.reserve_worker_push_delivery(text, text, text, text, integer, integer)
  from public, anon, authenticated;
revoke all on function public.complete_worker_push_delivery(text, text, text, text, jsonb)
  from public, anon, authenticated;
revoke all on function public.release_worker_push_delivery(text, text, text, text)
  from public, anon, authenticated;

grant execute on function public.reserve_worker_push_delivery(text, text, text, text, integer, integer)
  to service_role;
grant execute on function public.complete_worker_push_delivery(text, text, text, text, jsonb)
  to service_role;
grant execute on function public.release_worker_push_delivery(text, text, text, text)
  to service_role;
