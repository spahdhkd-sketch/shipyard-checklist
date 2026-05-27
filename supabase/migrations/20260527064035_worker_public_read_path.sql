-- Phase 1 security hardening:
-- - browser worker sync reads public worker fields through workers_public
-- - employee_no remains available only to server-side privileged code and verify_worker_login
-- - direct anon/authenticated select/insert/update of employee_no is removed

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
from public.workers;

grant select on table public.workers_public to anon, authenticated;

revoke select on table public.workers from public, anon, authenticated;
grant select (
  id,
  name,
  team,
  position,
  active,
  created_at,
  updated_at,
  unsafe_push_target
) on public.workers to anon, authenticated;

revoke insert, update on table public.workers from public, anon, authenticated;
grant insert (
  id,
  name,
  team,
  position,
  active,
  created_at,
  updated_at,
  unsafe_push_target
) on public.workers to anon, authenticated;
grant update (
  name,
  team,
  position,
  active,
  created_at,
  updated_at,
  unsafe_push_target
) on public.workers to anon, authenticated;

create or replace function public.verify_worker_login(p_worker_id text, p_employee_no text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workers
    where id = p_worker_id
      and active is true
      and nullif(btrim(employee_no), '') is not null
      and btrim(employee_no) = btrim(coalesce(p_employee_no, ''))
  );
$$;

revoke all on function public.verify_worker_login(text, text) from public;
grant execute on function public.verify_worker_login(text, text) to anon, authenticated;

comment on view public.workers_public is
  'Public browser-safe worker read model. Deliberately omits employee_no.';

comment on function public.verify_worker_login(text, text) is
  'Compares worker employee number inside Postgres so employee_no is not exposed through browser sync.';
