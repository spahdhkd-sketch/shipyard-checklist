-- Inspection history deletion is a server-owned, transactionally ordered action.
-- Durable tombstones and advisory-lock write guards prevent stale sync from
-- recreating a deleted parent or any of its child rows.

alter table public.safety_inspections
  add column if not exists deleted_at timestamptz;

create index if not exists safety_inspections_deleted_at_idx
  on public.safety_inspections (deleted_at);

-- The existing dedupe index predates soft deletion. Excluding tombstoned rows
-- allows a later, distinct inspection for the same work tuple.
drop index if exists public.safety_inspections_worker_ship_category_date_uidx;
create unique index safety_inspections_worker_ship_category_date_uidx
  on public.safety_inspections (worker_id, ship_no, category_id, date)
  where worker_id is not null
    and date >= date '2026-07-14'
    and deleted_at is null;

create table if not exists public.safety_inspection_deletions (
  inspection_id text primary key,
  deleted_at timestamptz not null default pg_catalog.now()
);

comment on table public.safety_inspection_deletions is
  'Durable exact-ID tombstones for deleted inspection history. Browser clients may read but never write these rows.';

alter table public.safety_inspection_deletions enable row level security;

revoke all on table public.safety_inspection_deletions from public, anon, authenticated;
grant select on table public.safety_inspection_deletions to anon, authenticated;
grant select, insert, update, delete on table public.safety_inspection_deletions to service_role;

drop policy if exists "public read safety inspection deletions" on public.safety_inspection_deletions;

create policy "public read safety inspection deletions"
  on public.safety_inspection_deletions
  for select to anon, authenticated
  using (true);

do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_publication
    where pubname = 'supabase_realtime'
  ) then
    create publication supabase_realtime;
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_publication p
    join pg_catalog.pg_publication_rel pr on pr.prpubid = p.oid
    join pg_catalog.pg_class c on c.oid = pr.prrelid
    join pg_catalog.pg_namespace n on n.oid = c.relnamespace
    where p.pubname = 'supabase_realtime'
      and n.nspname = 'public'
      and c.relname = 'safety_inspection_deletions'
  ) then
    alter publication supabase_realtime add table public.safety_inspection_deletions;
  end if;
end $$;

create or replace function public.guard_safety_inspection_delete_wins()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_inspection_id text;
  new_inspection_id text;
  guarded_ids text[];
  guarded_id text;
  has_tombstone boolean;
  has_live_parents boolean;
  has_existing_child boolean;
  old_row jsonb;
  new_row jsonb;
begin
  old_row := case when tg_op = 'INSERT' then null else pg_catalog.to_jsonb(old) end;
  new_row := case when tg_op = 'DELETE' then null else pg_catalog.to_jsonb(new) end;

  old_inspection_id := case
    when old_row is null then null
    when tg_table_name = 'safety_inspections' then old_row->>'id'
    else old_row->>'inspection_id'
  end;
  new_inspection_id := case
    when new_row is null then null
    when tg_table_name = 'safety_inspections' then new_row->>'id'
    else new_row->>'inspection_id'
  end;

  select coalesce(
    pg_catalog.array_agg(candidate.inspection_id order by candidate.inspection_id),
    array[]::text[]
  )
  into guarded_ids
  from (
    select distinct input.inspection_id
    from pg_catalog.unnest(array[old_inspection_id, new_inspection_id]) as input(inspection_id)
    where input.inspection_id is not null
  ) candidate;

  perform pg_catalog.pg_advisory_xact_lock_shared(
    pg_catalog.hashtextextended('safety_inspection_history_reset', 0)
  );

  -- Seed 1 is a separate namespace from the reset lock. Sorted acquisition
  -- also covers updates that move a child between inspection parents.
  foreach guarded_id in array guarded_ids loop
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(guarded_id, 1)
    );
  end loop;

  select exists (
    select 1
    from public.safety_inspection_deletions deletion
    where deletion.inspection_id = any(guarded_ids)
  )
  into has_tombstone;

  if tg_op = 'DELETE' then
    if tg_table_name = 'safety_inspections' then
      raise exception using
        errcode = '23514',
        message = 'safety inspection parents must be soft-deleted by the atomic RPC';
    end if;

    if not has_tombstone then
      raise exception using
        errcode = '23514',
        message = 'safety inspection children require a parent tombstone before deletion';
    end if;

    return old;
  end if;

  if has_tombstone then
    -- Only the RPC's one-column live-to-deleted parent transition is allowed
    -- after it has published the tombstone in the same transaction.
    if tg_table_name = 'safety_inspections'
      and tg_op = 'UPDATE'
      and old_inspection_id = new_inspection_id
      and old_row->>'deleted_at' is null
      and new_row->>'deleted_at' is not null
      and old_row - 'deleted_at' = new_row - 'deleted_at'
    then
      return new;
    end if;

    raise exception using
      errcode = '23514',
      message = 'deleted safety inspection history cannot be recreated';
  end if;

  if tg_table_name = 'safety_inspection_items'
    and tg_op in ('INSERT', 'UPDATE')
  then
    select not exists (
      select 1
      from pg_catalog.unnest(guarded_ids) as guarded(inspection_id)
      where not exists (
        select 1
        from public.safety_inspections parent
        where parent.id = guarded.inspection_id
          and parent.deleted_at is null
      )
    )
    into has_live_parents;

    if not has_live_parents then
      raise exception using
        errcode = '23503',
        message = 'safety inspection children require a live parent';
    end if;
  end if;

  if tg_table_name = 'safety_inspections'
    and tg_op = 'INSERT'
  then
    select exists (
      select 1
      from public.safety_inspection_items item
      where item.inspection_id = new_inspection_id
    )
    into has_existing_child;

    if has_existing_child then
      raise exception using
        errcode = '23514',
        message = 'safety inspection parents cannot attach to pre-existing children';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.guard_safety_inspection_delete_wins() from public, anon, authenticated;

drop trigger if exists safety_inspections_delete_wins_guard on public.safety_inspections;
create trigger safety_inspections_delete_wins_guard
  before insert or update or delete on public.safety_inspections
  for each row execute function public.guard_safety_inspection_delete_wins();

drop trigger if exists safety_inspection_items_delete_wins_guard on public.safety_inspection_items;
create trigger safety_inspection_items_delete_wins_guard
  before insert or update or delete on public.safety_inspection_items
  for each row execute function public.guard_safety_inspection_delete_wins();

revoke update (deleted_at) on table public.safety_inspections from anon, authenticated;

drop policy if exists "public read safety inspections" on public.safety_inspections;
drop policy if exists "public insert safety inspections" on public.safety_inspections;
drop policy if exists "public read safety inspection items" on public.safety_inspection_items;
drop policy if exists "public insert safety inspection items" on public.safety_inspection_items;

create policy "public read safety inspections"
  on public.safety_inspections
  for select to anon, authenticated
  using (deleted_at is null);

create policy "public insert safety inspections"
  on public.safety_inspections
  for insert to anon, authenticated
  with check (
    deleted_at is null
    and id is not null
    and char_length(id) between 1 and 120
    and char_length(category_id) between 1 and 120
    and char_length(worker) between 1 and 200
    and char_length(ship_no) between 1 and 120
    and char_length(status) between 1 and 40
    and warnings >= 0
    and completion between 0 and 100
    and not exists (
      select 1
      from public.safety_inspection_deletions deletion
      where deletion.inspection_id = safety_inspections.id
    )
  );

create policy "public read safety inspection items"
  on public.safety_inspection_items
  for select to anon, authenticated
  using (
    exists (
      select 1
      from public.safety_inspections parent
      where parent.id = safety_inspection_items.inspection_id
        and parent.deleted_at is null
    )
    and not exists (
      select 1
      from public.safety_inspection_deletions deletion
      where deletion.inspection_id = safety_inspection_items.inspection_id
    )
  );

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
    and exists (
      select 1
      from public.safety_inspections parent
      where parent.id = safety_inspection_items.inspection_id
        and parent.deleted_at is null
    )
    and not exists (
      select 1
      from public.safety_inspection_deletions deletion
      where deletion.inspection_id = safety_inspection_items.inspection_id
    )
  );

create or replace function public.delete_safety_inspection_history(p_ids text[])
returns setof public.safety_inspection_deletions
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_ids text[];
  current_id text;
  deletion_time timestamptz := pg_catalog.statement_timestamp();
begin
  select coalesce(
    pg_catalog.array_agg(candidate.inspection_id order by candidate.inspection_id),
    array[]::text[]
  )
  into normalized_ids
  from (
    select distinct pg_catalog.btrim(raw_id) as inspection_id
    from pg_catalog.unnest(coalesce(p_ids, array[]::text[])) as input(raw_id)
    where raw_id is not null
      and pg_catalog.btrim(raw_id) <> ''
      and pg_catalog.char_length(pg_catalog.btrim(raw_id)) <= 120
  ) candidate;

  if pg_catalog.cardinality(normalized_ids) = 0 then
    return;
  end if;

  perform pg_catalog.pg_advisory_xact_lock_shared(
    pg_catalog.hashtextextended('safety_inspection_history_reset', 0)
  );

  foreach current_id in array normalized_ids loop
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(current_id, 1)
    );
  end loop;

  insert into public.safety_inspection_deletions (inspection_id, deleted_at)
  select id_value, deletion_time
  from pg_catalog.unnest(normalized_ids) as ids(id_value)
  on conflict (inspection_id) do nothing;

  update public.safety_inspections inspection
  set deleted_at = coalesce(inspection.deleted_at, deletion_time)
  where inspection.id = any(normalized_ids)
    and inspection.deleted_at is null;

  delete from public.safety_inspection_items item
  where item.inspection_id = any(normalized_ids);

  return query
  select deletion.inspection_id, deletion.deleted_at
  from public.safety_inspection_deletions deletion
  where deletion.inspection_id = any(normalized_ids)
  order by deletion.inspection_id;
end;
$$;

revoke all on function public.delete_safety_inspection_history(text[]) from public, anon, authenticated;
grant execute on function public.delete_safety_inspection_history(text[]) to service_role;

comment on function public.delete_safety_inspection_history(text[]) is
  'Service-role-only atomic inspection deletion: durable tombstones, parent soft delete, then child removal.';

create or replace function public.delete_all_safety_inspection_history()
returns setof public.safety_inspection_deletions
language plpgsql
security definer
set search_path = ''
as $$
declare
  active_ids text[];
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('safety_inspection_history_reset', 0)
  );

  select coalesce(
    pg_catalog.array_agg(candidate.inspection_id order by candidate.inspection_id),
    array[]::text[]
  )
  into active_ids
  from (
    select inspection.id as inspection_id
    from public.safety_inspections inspection
    where inspection.deleted_at is null
    union
    select item.inspection_id
    from public.safety_inspection_items item
  ) candidate;

  if pg_catalog.cardinality(active_ids) = 0 then
    return;
  end if;

  return query
  select *
  from public.delete_safety_inspection_history(active_ids);
end;
$$;

revoke all on function public.delete_all_safety_inspection_history() from public, anon, authenticated;
grant execute on function public.delete_all_safety_inspection_history() to service_role;

comment on function public.delete_all_safety_inspection_history() is
  'Service-role-only uncapped reset of every active inspection and orphan child ID through the atomic delete-wins RPC.';
