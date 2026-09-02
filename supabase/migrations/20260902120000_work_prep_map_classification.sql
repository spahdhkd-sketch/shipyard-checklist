begin;

alter table public.work_prep_records
  add column if not exists place_id text,
  add column if not exists site_survey_done boolean not null default false;

create or replace function public.enforce_work_prep_site_survey_server_only()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  request_role text := coalesce(nullif(current_setting('request.jwt.claim.role', true), ''), 'postgres');
begin
  if request_role in ('anon', 'authenticated') then
    if tg_op = 'INSERT' and new.site_survey_done is true then
      raise exception 'work_prep_site_survey_requires_admin_mutation';
    end if;
    if tg_op = 'UPDATE' and new.site_survey_done is distinct from old.site_survey_done then
      raise exception 'work_prep_site_survey_requires_admin_mutation';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists work_prep_site_survey_server_only on public.work_prep_records;
create trigger work_prep_site_survey_server_only
before insert or update of site_survey_done on public.work_prep_records
for each row execute function public.enforce_work_prep_site_survey_server_only();

alter table public.safety_categories
  add column if not exists requires_triple_inspection boolean not null default false,
  add column if not exists is_non_routine boolean not null default false;

alter table public.workers
  add column if not exists is_foreign boolean not null default false;

alter table public.safety_categories
  drop constraint if exists safety_categories_non_routine_triple_check,
  drop constraint if exists safety_categories_triple_scope_check;

alter table public.safety_categories
  add constraint safety_categories_non_routine_triple_check
    check (not is_non_routine or requires_triple_inspection),
  add constraint safety_categories_triple_scope_check
    check (
      not requires_triple_inspection
      or is_non_routine
      or label ~* '(압력|co[[:space:]_-]*2|co₂|leak|리크|누설)'
    );

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
  updated_at,
  is_foreign
from public.workers
where active is true;

grant select (is_foreign) on public.workers to anon, authenticated;
grant select on table public.workers_public to anon, authenticated;

create or replace function public.upsert_safety_categories_with_history(
  p_rows jsonb,
  p_actor_worker_id text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  previous_icon_value text;
  next_icon_value text;
  category_id_value text;
  actor_name_value text := '';
  changed_count integer := 0;
begin
  if jsonb_typeof(p_rows) <> 'array' then
    raise exception 'category_rows_must_be_array';
  end if;

  select coalesce(name, '')
    into actor_name_value
  from public.workers
  where id = p_actor_worker_id;

  for item in select value from jsonb_array_elements(p_rows)
  loop
    category_id_value := btrim(item->>'id');
    next_icon_value := btrim(item->>'icon');
    if category_id_value = '' or next_icon_value = '' then
      raise exception 'category_identity_invalid';
    end if;

    select icon into previous_icon_value
    from public.safety_categories
    where id = category_id_value;

    insert into public.safety_categories (
      id,
      label,
      icon,
      color,
      require_tool_check,
      tool_nature,
      tool_ids,
      requires_triple_inspection,
      is_non_routine,
      sort_order,
      updated_at
    ) values (
      category_id_value,
      item->>'label',
      next_icon_value,
      item->>'color',
      coalesce((item->>'require_tool_check')::boolean, true),
      item->>'tool_nature',
      coalesce(item->'tool_ids', '[]'::jsonb),
      coalesce((item->>'requires_triple_inspection')::boolean, false),
      coalesce((item->>'is_non_routine')::boolean, false),
      coalesce((item->>'sort_order')::integer, 0),
      now()
    )
    on conflict (id) do update set
      label = excluded.label,
      icon = excluded.icon,
      color = excluded.color,
      require_tool_check = excluded.require_tool_check,
      tool_nature = excluded.tool_nature,
      tool_ids = excluded.tool_ids,
      requires_triple_inspection = excluded.requires_triple_inspection,
      is_non_routine = excluded.is_non_routine,
      sort_order = excluded.sort_order,
      updated_at = now();

    if previous_icon_value is distinct from next_icon_value then
      insert into public.safety_icon_change_history (
        category_id,
        previous_icon,
        next_icon,
        action,
        changed_by_worker_id,
        changed_by_worker_name
      ) values (
        category_id_value,
        previous_icon_value,
        next_icon_value,
        case when previous_icon_value is null then 'create' else 'change' end,
        p_actor_worker_id,
        actor_name_value
      );
    end if;

    changed_count := changed_count + 1;
  end loop;

  return changed_count;
end;
$$;

drop policy if exists "public insert work prep records" on public.work_prep_records;
drop policy if exists "public update work prep records" on public.work_prep_records;

create policy "public insert work prep records"
  on public.work_prep_records
  for insert to anon, authenticated
  with check (
    deleted_at is null
    and id is not null
    and char_length(id) between 1 and 120
    and char_length(work_date) <= 40
    and char_length(coalesce(appearance_time, '')) <= 20
    and char_length(coalesce(team, '')) <= 80
    and char_length(coalesce(ship_no, '')) <= 120
    and (
      nullif(place_id, '') is null
      or place_id in (
        'DOCK-1', 'DOCK-2', 'DOCK-3', 'DOCK-4', 'DOCK-5', 'DOCK-8', 'DOCK-9', 'DOCK-H',
        'QUAY-M1', 'QUAY-M2', 'QUAY-M4', 'QUAY-M5', 'QUAY-M7',
        'QUAY-J1', 'QUAY-J2', 'QUAY-J5', 'QUAY-H1', 'QUAY-H2', 'QUAY-H3', 'QUAY-H4', 'QUAY-H5'
      )
    )
    and char_length(coalesce(category_id, '')) <= 120
    and char_length(coalesce(leader_worker_id, '')) <= 120
    and (worker_ids is null or jsonb_typeof(worker_ids) = 'array')
    and (other_team_worker_ids is null or jsonb_typeof(other_team_worker_ids) = 'array')
    and (tool_ids is null or jsonb_typeof(tool_ids) = 'array')
    and jsonb_typeof(status_history) = 'array'
    and coalesce(status, 'preparing') in ('confirmed', 'preparing', 'ordered', 'unregistered', 'used')
  );

create policy "public update work prep records"
  on public.work_prep_records
  for update to anon, authenticated
  using (
    deleted_at is null
    and id is not null
    and char_length(id) between 1 and 120
    and char_length(work_date) <= 40
    and char_length(coalesce(appearance_time, '')) <= 20
    and char_length(coalesce(team, '')) <= 80
    and char_length(coalesce(ship_no, '')) <= 120
    and (
      nullif(place_id, '') is null
      or place_id in (
        'DOCK-1', 'DOCK-2', 'DOCK-3', 'DOCK-4', 'DOCK-5', 'DOCK-8', 'DOCK-9', 'DOCK-H',
        'QUAY-M1', 'QUAY-M2', 'QUAY-M4', 'QUAY-M5', 'QUAY-M7',
        'QUAY-J1', 'QUAY-J2', 'QUAY-J5', 'QUAY-H1', 'QUAY-H2', 'QUAY-H3', 'QUAY-H4', 'QUAY-H5'
      )
    )
    and char_length(coalesce(category_id, '')) <= 120
    and char_length(coalesce(leader_worker_id, '')) <= 120
    and (worker_ids is null or jsonb_typeof(worker_ids) = 'array')
    and (other_team_worker_ids is null or jsonb_typeof(other_team_worker_ids) = 'array')
    and (tool_ids is null or jsonb_typeof(tool_ids) = 'array')
    and jsonb_typeof(status_history) = 'array'
    and coalesce(status, 'preparing') in ('confirmed', 'preparing', 'ordered', 'unregistered', 'used')
  )
  with check (
    deleted_at is null
    and id is not null
    and char_length(id) between 1 and 120
    and char_length(work_date) <= 40
    and char_length(coalesce(appearance_time, '')) <= 20
    and char_length(coalesce(team, '')) <= 80
    and char_length(coalesce(ship_no, '')) <= 120
    and (
      nullif(place_id, '') is null
      or place_id in (
        'DOCK-1', 'DOCK-2', 'DOCK-3', 'DOCK-4', 'DOCK-5', 'DOCK-8', 'DOCK-9', 'DOCK-H',
        'QUAY-M1', 'QUAY-M2', 'QUAY-M4', 'QUAY-M5', 'QUAY-M7',
        'QUAY-J1', 'QUAY-J2', 'QUAY-J5', 'QUAY-H1', 'QUAY-H2', 'QUAY-H3', 'QUAY-H4', 'QUAY-H5'
      )
    )
    and char_length(coalesce(category_id, '')) <= 120
    and char_length(coalesce(leader_worker_id, '')) <= 120
    and (worker_ids is null or jsonb_typeof(worker_ids) = 'array')
    and (other_team_worker_ids is null or jsonb_typeof(other_team_worker_ids) = 'array')
    and (tool_ids is null or jsonb_typeof(tool_ids) = 'array')
    and jsonb_typeof(status_history) = 'array'
    and coalesce(status, 'preparing') in ('confirmed', 'preparing', 'ordered', 'unregistered', 'used')
  );

comment on column public.work_prep_records.place_id is
  'Control-map dock or quay identifier linked to this work order.';
comment on column public.work_prep_records.site_survey_done is
  'Administrator-confirmed pre-work site survey completion flag.';
comment on column public.safety_categories.requires_triple_inspection is
  'Marks pressure, CO2 system, leak test, or non-routine work as a triple-inspection target.';
comment on column public.safety_categories.is_non_routine is
  'Marks the work type as non-routine; non-routine work always requires triple inspection.';
comment on column public.workers.is_foreign is
  'Operational flag used to identify a single foreign-worker assignment on the control map.';

commit;
