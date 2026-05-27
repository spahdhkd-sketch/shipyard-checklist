-- Phase 2A follow-up:
-- - remove duplicate workers SELECT policies introduced across incremental hardening
-- - keep admin mutation ledgers explicitly closed to browser roles

drop policy if exists "public read workers" on public.workers;
drop policy if exists "workers public select" on public.workers;

create policy "workers public select"
  on public.workers
  for select to anon, authenticated
  using (true);

drop policy if exists "deny browser admin mutation sessions" on public.admin_mutation_sessions;
create policy "deny browser admin mutation sessions"
  on public.admin_mutation_sessions
  for all to anon, authenticated
  using (false)
  with check (false);

drop policy if exists "deny browser admin mutation attempts" on public.admin_mutation_attempts;
create policy "deny browser admin mutation attempts"
  on public.admin_mutation_attempts
  for all to anon, authenticated
  using (false)
  with check (false);
