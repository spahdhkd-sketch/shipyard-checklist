-- Phase 2B inspection history boundary:
-- Field inspection submissions remain public insert/read, but browser clients
-- can no longer directly update or delete submitted inspection history.

alter table public.safety_inspections enable row level security;
alter table public.safety_inspection_items enable row level security;

revoke update, delete on table public.safety_inspections from public, anon, authenticated;
revoke update, delete on table public.safety_inspection_items from public, anon, authenticated;
revoke truncate, references, trigger on table public.safety_inspections from public, anon, authenticated;
revoke truncate, references, trigger on table public.safety_inspection_items from public, anon, authenticated;

grant select, insert on table public.safety_inspections to anon, authenticated;
grant select, insert on table public.safety_inspection_items to anon, authenticated;

drop policy if exists "anon all safety inspections" on public.safety_inspections;
drop policy if exists "anon all safety inspection items" on public.safety_inspection_items;
drop policy if exists "public read safety inspections" on public.safety_inspections;
drop policy if exists "public insert safety inspections" on public.safety_inspections;
drop policy if exists "public read safety inspection items" on public.safety_inspection_items;
drop policy if exists "public insert safety inspection items" on public.safety_inspection_items;

create policy "public read safety inspections"
  on public.safety_inspections
  for select to anon, authenticated
  using (true);

create policy "public insert safety inspections"
  on public.safety_inspections
  for insert to anon, authenticated
  with check (
    id is not null
    and char_length(id) between 1 and 120
    and char_length(category_id) between 1 and 120
    and char_length(worker) between 1 and 200
    and char_length(ship_no) between 1 and 120
    and char_length(status) between 1 and 40
    and warnings >= 0
    and completion between 0 and 100
  );

create policy "public read safety inspection items"
  on public.safety_inspection_items
  for select to anon, authenticated
  using (true);

create policy "public insert safety inspection items"
  on public.safety_inspection_items
  for insert to anon, authenticated
  with check (
    id is not null
    and char_length(id) between 1 and 120
    and char_length(inspection_id) between 1 and 120
    and char_length(item_id) between 1 and 120
    and char_length(risk) between 1 and 40
    and char_length(text) between 1 and 1000
  );

comment on table public.safety_inspections is
  'Phase 2B: public browser access is select/insert only; update/delete requires the admin-mutations Edge Function.';

comment on table public.safety_inspection_items is
  'Phase 2B: public browser access is select/insert only; update/delete requires the admin-mutations Edge Function.';
