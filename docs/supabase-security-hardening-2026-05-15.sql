-- Security hardening for the shipyard checklist Supabase project.
--
-- Admin allowlist seeded in this migration:
-- - spahdhkd@gmail.com
-- - spahdhkd@naver.com
--
-- Access model:
-- - Public users may read checklist data and submit new inspection records.
-- - Only allowlisted Supabase Auth users may create, edit, or delete admin-managed data.
-- - Inspection rows remain insertable by anon users to preserve field submission, but update/delete is admin-only.

begin;

create table if not exists public.shipyard_admins (
  email text primary key,
  created_at timestamptz not null default now(),
  constraint shipyard_admins_email_not_blank check (length(trim(email)) > 3)
);

alter table public.shipyard_admins enable row level security;
grant select on public.shipyard_admins to anon, authenticated;
revoke insert, update, delete on public.shipyard_admins from anon, authenticated;

insert into public.shipyard_admins (email)
values
  ('spahdhkd@gmail.com'),
  ('spahdhkd@naver.com')
on conflict (email) do nothing;

drop policy if exists "current admin can read own allowlist row" on public.shipyard_admins;
create policy "current admin can read own allowlist row"
  on public.shipyard_admins
  for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

create or replace function public.is_shipyard_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.shipyard_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_shipyard_admin() to anon, authenticated;

do $$
declare
  table_name text;
  policy_name text;
begin
  foreach table_name in array array[
    'safety_categories',
    'safety_sections',
    'safety_items',
    'safety_tools',
    'safety_pictograms',
    'safety_ships',
    'safety_inspections',
    'safety_inspection_items'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);

    for policy_name in
      select policyname
      from pg_policies
      where schemaname = 'public'
        and tablename = table_name
    loop
      execute format('drop policy if exists %I on public.%I', policy_name, table_name);
    end loop;
  end loop;
end $$;

grant select on public.safety_categories to anon, authenticated;
grant select on public.safety_sections to anon, authenticated;
grant select on public.safety_items to anon, authenticated;
grant select on public.safety_tools to anon, authenticated;
grant select on public.safety_pictograms to anon, authenticated;
grant select on public.safety_ships to anon, authenticated;
grant select on public.safety_inspections to anon, authenticated;
grant select on public.safety_inspection_items to anon, authenticated;

revoke insert, update, delete on public.safety_categories from anon;
revoke insert, update, delete on public.safety_sections from anon;
revoke insert, update, delete on public.safety_items from anon;
revoke insert, update, delete on public.safety_tools from anon;
revoke insert, update, delete on public.safety_pictograms from anon;
revoke insert, update, delete on public.safety_ships from anon;
revoke update, delete on public.safety_inspections from anon;
revoke update, delete on public.safety_inspection_items from anon;

grant insert, update, delete on public.safety_categories to authenticated;
grant insert, update, delete on public.safety_sections to authenticated;
grant insert, update, delete on public.safety_items to authenticated;
grant insert, update, delete on public.safety_tools to authenticated;
grant insert, update, delete on public.safety_pictograms to authenticated;
grant insert, update, delete on public.safety_ships to authenticated;
grant insert, update, delete on public.safety_inspections to authenticated;
grant insert, update, delete on public.safety_inspection_items to authenticated;
grant insert on public.safety_inspections to anon;
grant insert on public.safety_inspection_items to anon;

create policy "public read safety categories"
  on public.safety_categories for select
  to anon, authenticated
  using (true);

create policy "admin insert safety categories"
  on public.safety_categories for insert
  to authenticated
  with check ((select public.is_shipyard_admin()));

create policy "admin update safety categories"
  on public.safety_categories for update
  to authenticated
  using ((select public.is_shipyard_admin()))
  with check ((select public.is_shipyard_admin()));

create policy "admin delete safety categories"
  on public.safety_categories for delete to authenticated using ((select public.is_shipyard_admin()));

create policy "public read safety sections"
  on public.safety_sections for select
  to anon, authenticated
  using (true);

create policy "admin insert safety sections"
  on public.safety_sections for insert
  to authenticated
  with check ((select public.is_shipyard_admin()));

create policy "admin update safety sections"
  on public.safety_sections for update
  to authenticated
  using ((select public.is_shipyard_admin()))
  with check ((select public.is_shipyard_admin()));

create policy "admin delete safety sections"
  on public.safety_sections for delete to authenticated using ((select public.is_shipyard_admin()));

create policy "public read safety items"
  on public.safety_items for select
  to anon, authenticated
  using (true);

create policy "admin insert safety items"
  on public.safety_items for insert
  to authenticated
  with check ((select public.is_shipyard_admin()));

create policy "admin update safety items"
  on public.safety_items for update
  to authenticated
  using ((select public.is_shipyard_admin()))
  with check ((select public.is_shipyard_admin()));

create policy "admin delete safety items"
  on public.safety_items for delete to authenticated using ((select public.is_shipyard_admin()));

create policy "public read safety tools"
  on public.safety_tools for select
  to anon, authenticated
  using (true);

create policy "admin insert safety tools"
  on public.safety_tools for insert
  to authenticated
  with check ((select public.is_shipyard_admin()));

create policy "admin update safety tools"
  on public.safety_tools for update
  to authenticated
  using ((select public.is_shipyard_admin()))
  with check ((select public.is_shipyard_admin()));

create policy "admin delete safety tools"
  on public.safety_tools for delete to authenticated using ((select public.is_shipyard_admin()));

create policy "public read safety pictograms"
  on public.safety_pictograms for select
  to anon, authenticated
  using (true);

create policy "admin insert safety pictograms"
  on public.safety_pictograms for insert
  to authenticated
  with check ((select public.is_shipyard_admin()));

create policy "admin update safety pictograms"
  on public.safety_pictograms for update
  to authenticated
  using ((select public.is_shipyard_admin()))
  with check ((select public.is_shipyard_admin()));

create policy "admin delete safety pictograms"
  on public.safety_pictograms for delete to authenticated using ((select public.is_shipyard_admin()));

create policy "public read safety ships"
  on public.safety_ships for select
  to anon, authenticated
  using (true);

create policy "admin insert safety ships"
  on public.safety_ships for insert
  to authenticated
  with check ((select public.is_shipyard_admin()));

create policy "admin update safety ships"
  on public.safety_ships for update
  to authenticated
  using ((select public.is_shipyard_admin()))
  with check ((select public.is_shipyard_admin()));

create policy "admin delete safety ships"
  on public.safety_ships for delete to authenticated using ((select public.is_shipyard_admin()));

create policy "public read safety inspections"
  on public.safety_inspections for select
  to anon, authenticated
  using (true);

create policy "public insert safety inspections"
  on public.safety_inspections for insert
  to anon, authenticated
  with check (
    length(trim(id)) between 8 and 128
    and (category_id is null or length(trim(category_id)) between 1 and 128)
    and length(trim(worker)) between 1 and 80
    and length(trim(ship_no)) between 1 and 80
    and date ~ '^\d{4}-\d{2}-\d{2}$'
    and time ~ '^\d{2}:\d{2}(:\d{2})?$'
    and status in ('완료', '미완료')
    and coalesce(warnings, 0) between 0 and 1000
    and coalesce(completion, 0) between 0 and 100
    and jsonb_typeof(tools) = 'array'
  );

create policy "admin update safety inspections"
  on public.safety_inspections for update
  to authenticated
  using ((select public.is_shipyard_admin()))
  with check ((select public.is_shipyard_admin()));

create policy "admin delete safety inspections"
  on public.safety_inspections for delete to authenticated using ((select public.is_shipyard_admin()));

create policy "public read safety inspection items"
  on public.safety_inspection_items for select
  to anon, authenticated
  using (true);

create policy "public insert safety inspection items"
  on public.safety_inspection_items for insert
  to anon, authenticated
  with check (
    length(trim(id)) between 8 and 128
    and length(trim(inspection_id)) between 8 and 128
    and (item_id is null or length(trim(item_id)) <= 128)
    and risk in ('low', 'medium', 'high')
    and (text is null or length(text) <= 500)
    and (section_title is null or length(section_title) <= 120)
  );

create policy "admin update safety inspection items"
  on public.safety_inspection_items for update
  to authenticated
  using ((select public.is_shipyard_admin()))
  with check ((select public.is_shipyard_admin()));

create policy "admin delete safety inspection items"
  on public.safety_inspection_items for delete to authenticated using ((select public.is_shipyard_admin()));

commit;
