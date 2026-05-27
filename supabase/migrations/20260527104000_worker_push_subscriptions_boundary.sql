-- Phase 2F worker push subscriptions boundary:
-- Push subscriptions are managed only by the worker-push Edge Function using
-- the service role key. Browser roles must not read or mutate raw endpoints.

alter table public.worker_push_subscriptions enable row level security;

revoke all on table public.worker_push_subscriptions from public, anon, authenticated;

drop policy if exists "deny browser worker push subscriptions select" on public.worker_push_subscriptions;
drop policy if exists "deny browser worker push subscriptions insert" on public.worker_push_subscriptions;
drop policy if exists "deny browser worker push subscriptions update" on public.worker_push_subscriptions;
drop policy if exists "deny browser worker push subscriptions delete" on public.worker_push_subscriptions;

create policy "deny browser worker push subscriptions select"
  on public.worker_push_subscriptions
  for select to anon, authenticated
  using (false);

create policy "deny browser worker push subscriptions insert"
  on public.worker_push_subscriptions
  for insert to anon, authenticated
  with check (false);

create policy "deny browser worker push subscriptions update"
  on public.worker_push_subscriptions
  for update to anon, authenticated
  using (false)
  with check (false);

create policy "deny browser worker push subscriptions delete"
  on public.worker_push_subscriptions
  for delete to anon, authenticated
  using (false);

comment on table public.worker_push_subscriptions is
  'Phase 2F: raw push endpoints are managed by the worker-push Edge Function only; browser roles have explicit deny RLS policies.';
