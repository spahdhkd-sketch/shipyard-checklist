create table if not exists public.worker_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  worker_id text not null references public.workers(id) on delete cascade,
  endpoint text not null unique,
  subscription jsonb not null,
  user_agent text,
  device_label text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  last_sent_at timestamptz,
  last_error text,
  last_error_at timestamptz
);

alter table public.worker_push_subscriptions enable row level security;

create index if not exists worker_push_subscriptions_worker_idx
  on public.worker_push_subscriptions(worker_id)
  where enabled is true;

create index if not exists worker_push_subscriptions_endpoint_idx
  on public.worker_push_subscriptions(endpoint);

create or replace function public.get_worker_push_secret(secret_name text)
returns text
language sql
security definer
set search_path = ''
as $$
  select decrypted_secret
  from vault.decrypted_secrets
  where name = secret_name
  limit 1;
$$;

revoke all on function public.get_worker_push_secret(text) from public, anon, authenticated;
grant execute on function public.get_worker_push_secret(text) to service_role;
