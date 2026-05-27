-- Phase 2A admin mutation boundary:
-- Browser admin catalog writes are replaced by the admin-mutations Edge Function.
-- Keep public SELECT paths. Remove direct anon/authenticated INSERT/UPDATE/DELETE.

create table if not exists public.admin_mutation_sessions (
  id text primary key,
  worker_id text not null references public.workers(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  last_used_at timestamptz,
  revoked_at timestamptz
);

create index if not exists admin_mutation_sessions_worker_idx
  on public.admin_mutation_sessions (worker_id, expires_at desc);

create table if not exists public.admin_mutation_attempts (
  bucket_key text primary key,
  worker_id text,
  fail_count integer not null default 0,
  window_started_at timestamptz,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists admin_mutation_attempts_worker_idx
  on public.admin_mutation_attempts (worker_id, updated_at desc);

create or replace function public.admin_delete_category_cascade(p_category_id text)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  deleted_items integer := 0;
  deleted_sections integer := 0;
  deleted_categories integer := 0;
begin
  delete from public.safety_items
  where category_id = p_category_id;
  get diagnostics deleted_items = row_count;

  delete from public.safety_sections
  where category_id = p_category_id;
  get diagnostics deleted_sections = row_count;

  delete from public.safety_categories
  where id = p_category_id;
  get diagnostics deleted_categories = row_count;

  return jsonb_build_object(
    'deletedItems', deleted_items,
    'deletedSections', deleted_sections,
    'deletedCategories', deleted_categories
  );
end;
$$;

create or replace function public.admin_delete_section_cascade(p_section_id text)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  updated_items integer := 0;
  deleted_sections integer := 0;
begin
  update public.safety_items
  set active = false
  where section_id = p_section_id;
  get diagnostics updated_items = row_count;

  delete from public.safety_sections
  where id = p_section_id;
  get diagnostics deleted_sections = row_count;

  return jsonb_build_object(
    'updatedItems', updated_items,
    'deletedSections', deleted_sections
  );
end;
$$;

revoke all on function public.admin_delete_category_cascade(text) from public, anon, authenticated;
revoke all on function public.admin_delete_section_cascade(text) from public, anon, authenticated;
grant execute on function public.admin_delete_category_cascade(text) to service_role;
grant execute on function public.admin_delete_section_cascade(text) to service_role;

alter table public.admin_mutation_sessions enable row level security;
alter table public.admin_mutation_attempts enable row level security;
revoke all on table public.admin_mutation_sessions from public, anon, authenticated;
revoke all on table public.admin_mutation_attempts from public, anon, authenticated;

alter table public.workers enable row level security;
alter table public.safety_categories enable row level security;
alter table public.safety_sections enable row level security;
alter table public.safety_items enable row level security;
alter table public.safety_tools enable row level security;
alter table public.safety_pictograms enable row level security;
alter table public.safety_ships enable row level security;
alter table public.unsafe_issues enable row level security;
alter table public.missing_materials enable row level security;
alter table public.issue_photos enable row level security;

revoke insert, update, delete on table public.workers from public, anon, authenticated;
revoke insert, update, delete on table public.safety_categories from public, anon, authenticated;
revoke insert, update, delete on table public.safety_sections from public, anon, authenticated;
revoke insert, update, delete on table public.safety_items from public, anon, authenticated;
revoke insert, update, delete on table public.safety_tools from public, anon, authenticated;
revoke insert, update, delete on table public.safety_pictograms from public, anon, authenticated;
revoke insert, update, delete on table public.safety_ships from public, anon, authenticated;
revoke update, delete on table public.unsafe_issues from public, anon, authenticated;
revoke update, delete on table public.missing_materials from public, anon, authenticated;
revoke update, delete on table public.issue_photos from public, anon, authenticated;

grant select on table public.safety_categories to anon, authenticated;
grant select on table public.safety_sections to anon, authenticated;
grant select on table public.safety_items to anon, authenticated;
grant select on table public.safety_tools to anon, authenticated;
grant select on table public.safety_pictograms to anon, authenticated;
grant select on table public.safety_ships to anon, authenticated;
grant select, insert on table public.unsafe_issues to anon, authenticated;
grant select, insert on table public.missing_materials to anon, authenticated;
grant select, insert on table public.issue_photos to anon, authenticated;

do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'workers',
        'safety_categories',
        'safety_sections',
        'safety_items',
        'safety_tools',
        'safety_pictograms',
        'safety_ships',
        'unsafe_issues',
        'missing_materials',
        'issue_photos'
      )
      and cmd <> 'SELECT'
  loop
    execute format('drop policy if exists %I on %I.%I', policy_row.policyname, policy_row.schemaname, policy_row.tablename);
  end loop;
end $$;

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
drop policy if exists "public read workers" on public.workers;
drop policy if exists "public all unsafe issues" on public.unsafe_issues;
drop policy if exists "public all missing materials" on public.missing_materials;
drop policy if exists "public all issue photos" on public.issue_photos;
drop policy if exists "public read unsafe issues" on public.unsafe_issues;
drop policy if exists "public insert unsafe issues" on public.unsafe_issues;
drop policy if exists "public read missing materials" on public.missing_materials;
drop policy if exists "public insert missing materials" on public.missing_materials;
drop policy if exists "public read issue photos" on public.issue_photos;
drop policy if exists "public insert issue photos" on public.issue_photos;

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

create policy "public read workers"
  on public.workers
  for select to anon, authenticated
  using (true);

create policy "public read unsafe issues"
  on public.unsafe_issues
  for select to anon, authenticated
  using (true);

create policy "public insert unsafe issues"
  on public.unsafe_issues
  for insert to anon, authenticated
  with check (true);

create policy "public read missing materials"
  on public.missing_materials
  for select to anon, authenticated
  using (true);

create policy "public insert missing materials"
  on public.missing_materials
  for insert to anon, authenticated
  with check (true);

create policy "public read issue photos"
  on public.issue_photos
  for select to anon, authenticated
  using (true);

create policy "public insert issue photos"
  on public.issue_photos
  for insert to anon, authenticated
  with check (true);

drop policy if exists "public update issue photos" on storage.objects;
drop policy if exists "public delete issue photos" on storage.objects;
drop policy if exists "issue_photos_delete_public" on storage.objects;

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
comment on table public.unsafe_issues is
  'Phase 2A: public browser access is select/insert only; admin update/delete requires the admin-mutations Edge Function.';
comment on table public.missing_materials is
  'Phase 2A: public browser access is select/insert only; admin update/delete requires the admin-mutations Edge Function.';
comment on table public.issue_photos is
  'Phase 2A: public browser access is select/insert only; admin/delete cleanup requires the admin-mutations Edge Function.';
