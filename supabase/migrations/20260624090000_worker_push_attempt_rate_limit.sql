create table if not exists public.worker_push_attempts (
  bucket_key text primary key,
  worker_id text not null references public.workers(id) on delete cascade,
  fail_count integer not null default 0,
  window_started_at timestamptz not null default now(),
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists worker_push_attempts_worker_idx
  on public.worker_push_attempts (worker_id, updated_at desc);

alter table public.worker_push_attempts enable row level security;
revoke all on table public.worker_push_attempts from public, anon, authenticated;

drop policy if exists "deny browser worker push attempts" on public.worker_push_attempts;
create policy "deny browser worker push attempts"
  on public.worker_push_attempts
  for all to anon, authenticated
  using (false)
  with check (false);

comment on table public.worker_push_attempts is
  'Tracks failed worker-push employee number checks so public Edge Function credentials cannot be brute forced.';
