-- Phase 2D app_state boundary:
-- app_state is legacy shared state. The current frontend does not write it, so
-- browser roles should only be able to read the known shipyard state row.

alter table public.app_state enable row level security;

revoke insert, update, delete, truncate, references, trigger on table public.app_state from public, anon, authenticated;

grant select on table public.app_state to anon, authenticated;

drop policy if exists "app_state_insert_public" on public.app_state;
drop policy if exists "app_state_update_public" on public.app_state;
drop policy if exists "app_state_select_public" on public.app_state;

create policy "app_state_select_public"
  on public.app_state
  for select to anon, authenticated
  using (
    id = 'shipyard-safety'
    and jsonb_typeof(data) = 'object'
  );

comment on table public.app_state is
  'Phase 2D: legacy app state is public read-only for the shipyard-safety row; browser writes are blocked.';
