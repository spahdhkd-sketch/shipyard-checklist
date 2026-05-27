-- Phase 2A admin mutation boundary:
-- Browser admin catalog writes are replaced by the admin-mutations Edge Function.
-- Keep public SELECT paths. Remove direct anon/authenticated INSERT/UPDATE/DELETE.

revoke insert, update, delete on table public.workers from public, anon, authenticated;
revoke insert, update, delete on table public.safety_categories from public, anon, authenticated;
revoke insert, update, delete on table public.safety_sections from public, anon, authenticated;
revoke insert, update, delete on table public.safety_items from public, anon, authenticated;
revoke insert, update, delete on table public.safety_tools from public, anon, authenticated;
revoke insert, update, delete on table public.safety_pictograms from public, anon, authenticated;
revoke insert, update, delete on table public.safety_ships from public, anon, authenticated;

drop policy if exists "workers public insert" on public.workers;
drop policy if exists "workers public update" on public.workers;

drop policy if exists "anon all safety categories" on public.safety_categories;
drop policy if exists "anon all safety sections" on public.safety_sections;
drop policy if exists "anon all safety items" on public.safety_items;
drop policy if exists "anon all safety tools" on public.safety_tools;
drop policy if exists "anon all safety pictograms" on public.safety_pictograms;
drop policy if exists "anon all safety ships" on public.safety_ships;

drop policy if exists "public read safety categories" on public.safety_categories;
drop policy if exists "public read safety sections" on public.safety_sections;
drop policy if exists "public read safety items" on public.safety_items;
drop policy if exists "public read safety tools" on public.safety_tools;
drop policy if exists "public read safety pictograms" on public.safety_pictograms;
drop policy if exists "public read safety ships" on public.safety_ships;

create policy "public read safety categories"
  on public.safety_categories
  for select to anon, authenticated
  using (true);

create policy "public read safety sections"
  on public.safety_sections
  for select to anon, authenticated
  using (true);

create policy "public read safety items"
  on public.safety_items
  for select to anon, authenticated
  using (true);

create policy "public read safety tools"
  on public.safety_tools
  for select to anon, authenticated
  using (true);

create policy "public read safety pictograms"
  on public.safety_pictograms
  for select to anon, authenticated
  using (true);

create policy "public read safety ships"
  on public.safety_ships
  for select to anon, authenticated
  using (true);

comment on table public.workers is
  'Phase 2A: browser writes require the admin-mutations Edge Function. Public direct insert/update/delete revoked.';

comment on table public.safety_categories is
  'Phase 2A: browser writes require the admin-mutations Edge Function.';
comment on table public.safety_sections is
  'Phase 2A: browser writes require the admin-mutations Edge Function.';
comment on table public.safety_items is
  'Phase 2A: browser writes require the admin-mutations Edge Function.';
comment on table public.safety_tools is
  'Phase 2A: browser writes require the admin-mutations Edge Function.';
comment on table public.safety_pictograms is
  'Phase 2A: browser writes require the admin-mutations Edge Function.';
comment on table public.safety_ships is
  'Phase 2A: browser writes require the admin-mutations Edge Function.';
