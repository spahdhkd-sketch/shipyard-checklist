do $$
declare
  realtime_table text;
  realtime_tables text[] := array[
    'safety_categories',
    'safety_sections',
    'safety_items',
    'safety_tools',
    'safety_pictograms',
    'safety_ships',
    'safety_inspections',
    'safety_inspection_items',
    'workers',
    'unsafe_issues',
    'missing_materials',
    'issue_photos',
    'work_prep_records'
  ];
begin
  if not exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) then
    create publication supabase_realtime;
  end if;

  foreach realtime_table in array realtime_tables loop
    if to_regclass(format('%I.%I', 'public', realtime_table)) is not null
      and not exists (
        select 1
        from pg_publication p
        join pg_publication_rel pr on pr.prpubid = p.oid
        join pg_class c on c.oid = pr.prrelid
        join pg_namespace n on n.oid = c.relnamespace
        where p.pubname = 'supabase_realtime'
          and n.nspname = 'public'
          and c.relname = realtime_table
      )
    then
      execute format('alter publication supabase_realtime add table %I.%I', 'public', realtime_table);
    end if;
  end loop;
end $$;
