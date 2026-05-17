-- Password-based admin mode intentionally does not use Supabase Auth.
-- Because the static app still writes with the public anon key, these policies
-- allow anon writes for the admin-managed data that the in-app password unlocks.
--
-- Security note: this is weaker than Supabase Auth + RLS admin allowlisting.
-- Anyone who can inspect the deployed client can find the password and call the
-- public Data API with the anon key.

grant insert, update, delete on
  public.safety_categories,
  public.safety_sections,
  public.safety_items,
  public.safety_tools,
  public.safety_pictograms,
  public.safety_ships
to anon, authenticated;

grant update, delete on
  public.safety_inspections,
  public.safety_inspection_items
to anon, authenticated;

drop policy if exists "password admin write safety categories" on public.safety_categories;
create policy "password admin write safety categories"
on public.safety_categories
for all
to anon
using (true)
with check (true);

drop policy if exists "password admin write safety sections" on public.safety_sections;
create policy "password admin write safety sections"
on public.safety_sections
for all
to anon
using (true)
with check (true);

drop policy if exists "password admin write safety items" on public.safety_items;
create policy "password admin write safety items"
on public.safety_items
for all
to anon
using (true)
with check (true);

drop policy if exists "password admin write safety tools" on public.safety_tools;
create policy "password admin write safety tools"
on public.safety_tools
for all
to anon
using (true)
with check (true);

drop policy if exists "password admin write safety pictograms" on public.safety_pictograms;
create policy "password admin write safety pictograms"
on public.safety_pictograms
for all
to anon
using (true)
with check (true);

drop policy if exists "password admin write safety ships" on public.safety_ships;
create policy "password admin write safety ships"
on public.safety_ships
for all
to anon
using (true)
with check (true);

drop policy if exists "password admin update safety inspections" on public.safety_inspections;
create policy "password admin update safety inspections"
on public.safety_inspections
for update
to anon
using (true)
with check (true);

drop policy if exists "password admin delete safety inspections" on public.safety_inspections;
create policy "password admin delete safety inspections"
on public.safety_inspections
for delete
to anon
using (true);

drop policy if exists "password admin update safety inspection items" on public.safety_inspection_items;
create policy "password admin update safety inspection items"
on public.safety_inspection_items
for update
to anon
using (true)
with check (true);

drop policy if exists "password admin delete safety inspection items" on public.safety_inspection_items;
create policy "password admin delete safety inspection items"
on public.safety_inspection_items
for delete
to anon
using (true);
