-- Supabase schema update for the shipyard safety checklist tool-prep feature.
-- Project ref in app: psatbyktzladtymdygwh
--
-- Run this in the Supabase SQL editor or with an authenticated Supabase SQL tool.
-- The app uses the anon client for a shared field checklist, so these policies
-- intentionally allow anon/authenticated read-write access, matching the
-- existing public sync model of the current app.

begin;

alter table if exists public.safety_categories
  add column if not exists require_tool_check boolean not null default true;

alter table if exists public.safety_items
  add column if not exists tool_ids text[] not null default '{}'::text[];

alter table if exists public.safety_inspections
  add column if not exists tools jsonb not null default '[]'::jsonb;

create table if not exists public.safety_tools (
  id text primary key,
  category_id text not null references public.safety_categories(id) on delete cascade,
  name text not null,
  deleted boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.safety_pictograms (
  id text primary key,
  label text not null,
  src text not null,
  source text not null default 'custom' check (source in ('custom')),
  deleted boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists safety_tools_category_order_idx
  on public.safety_tools (category_id, sort_order, id);

create index if not exists safety_pictograms_order_idx
  on public.safety_pictograms (sort_order, id);

create index if not exists safety_sections_category_id_idx
  on public.safety_sections (category_id);

create index if not exists safety_items_category_id_idx
  on public.safety_items (category_id);

create index if not exists safety_items_section_id_idx
  on public.safety_items (section_id);

create index if not exists safety_inspections_category_id_idx
  on public.safety_inspections (category_id);

create index if not exists safety_inspection_items_inspection_id_idx
  on public.safety_inspection_items (inspection_id);

alter table public.safety_tools enable row level security;
alter table public.safety_pictograms enable row level security;

grant select, insert, update, delete on public.safety_tools to anon, authenticated;
grant select, insert, update, delete on public.safety_pictograms to anon, authenticated;

drop policy if exists "public read safety tools" on public.safety_tools;
create policy "public read safety tools"
  on public.safety_tools
  for select
  to anon, authenticated
  using (true);

drop policy if exists "public insert safety tools" on public.safety_tools;
create policy "public insert safety tools"
  on public.safety_tools
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "public update safety tools" on public.safety_tools;
create policy "public update safety tools"
  on public.safety_tools
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "public delete safety tools" on public.safety_tools;
create policy "public delete safety tools"
  on public.safety_tools
  for delete
  to anon, authenticated
  using (true);

drop policy if exists "public read safety pictograms" on public.safety_pictograms;
create policy "public read safety pictograms"
  on public.safety_pictograms
  for select
  to anon, authenticated
  using (true);

drop policy if exists "public insert safety pictograms" on public.safety_pictograms;
create policy "public insert safety pictograms"
  on public.safety_pictograms
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "public update safety pictograms" on public.safety_pictograms;
create policy "public update safety pictograms"
  on public.safety_pictograms
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "public delete safety pictograms" on public.safety_pictograms;
create policy "public delete safety pictograms"
  on public.safety_pictograms
  for delete
  to anon, authenticated
  using (true);

commit;
