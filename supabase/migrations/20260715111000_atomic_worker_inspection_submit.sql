create or replace function public.submit_worker_inspection(
  p_inspection jsonb,
  p_items jsonb
)
returns table (
  inspection_id text,
  item_count integer
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_inspection_id text;
  v_worker_id text;
  v_worker_name text;
  v_category_id text;
  v_ship_no text;
  v_safety_pledge text;
  v_work_prep_record_id text;
  v_work_date text;
  v_work_prep_leader_id text;
  v_work_prep_worker_ids jsonb;
  v_work_prep_other_worker_ids jsonb;
  v_work_prep_tool_ids jsonb;
  v_category_nature text;
  v_category_tool_ids jsonb;
  v_category_tools_restricted boolean := false;
  v_require_tool_check boolean := false;
  v_tools_payload jsonb;
  v_raw_tool_ids text[] := '{}'::text[];
  v_selected_tool_ids text[] := '{}'::text[];
  v_expected_item_ids text[] := '{}'::text[];
  v_tools jsonb := '[]'::jsonb;
  v_total integer := 0;
  v_checked integer := 0;
  v_warnings integer := 0;
  v_visible_tool_count integer := 0;
  v_existing record;
  v_existing_item_count integer := 0;
  v_participant_count integer := 0;
  v_submitted_count integer := 0;
  v_submitted_worker_ids jsonb := '[]'::jsonb;
  v_now timestamptz := clock_timestamp();
begin
  if jsonb_typeof(p_inspection) is distinct from 'object' then
    raise exception 'inspection payload is invalid';
  end if;
  if jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'inspection items are invalid';
  end if;
  if jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 500 then
    raise exception 'inspection items are required';
  end if;

  v_inspection_id := nullif(trim(p_inspection->>'id'), '');
  v_worker_id := nullif(trim(p_inspection->>'worker_id'), '');
  v_worker_name := nullif(trim(p_inspection->>'worker'), '');
  v_safety_pledge := nullif(trim(p_inspection->>'safety_pledge'), '');
  v_work_prep_record_id := nullif(trim(p_inspection->>'work_prep_record_id'), '');
  if v_inspection_id is null or length(v_inspection_id) > 120
    or v_worker_id is null or length(v_worker_id) > 120
    or v_worker_name is null or v_safety_pledge is null then
    raise exception 'inspection identity and pledge are required';
  end if;

  v_tools_payload := coalesce(p_inspection->'tools', '[]'::jsonb);
  if jsonb_typeof(v_tools_payload) is distinct from 'array' then
    raise exception 'inspection tools are invalid';
  end if;
  if jsonb_array_length(v_tools_payload) > 100 then
    raise exception 'inspection tools are invalid';
  end if;
  if exists (
    select 1
    from jsonb_array_elements(v_tools_payload) tool
    where jsonb_typeof(tool) is distinct from 'object'
      or nullif(trim(tool->>'id'), '') is null
      or length(trim(tool->>'id')) > 120
  ) then
    raise exception 'inspection tools are invalid';
  end if;
  if exists (
    select tool->>'id'
    from jsonb_array_elements(v_tools_payload) tool
    group by tool->>'id'
    having count(*) > 1
  ) then
    raise exception 'inspection tools must be unique';
  end if;
  select coalesce(array_agg(trim(tool->>'id') order by ord), '{}'::text[])
  into v_raw_tool_ids
  from jsonb_array_elements(v_tools_payload) with ordinality submitted(tool, ord);

  if exists (
    select 1
    from jsonb_array_elements(p_items) item
    where jsonb_typeof(item) is distinct from 'object'
      or nullif(trim(item->>'inspection_id'), '') is distinct from v_inspection_id
      or nullif(trim(item->>'id'), '') is null
      or length(trim(item->>'id')) > 120
      or nullif(trim(item->>'item_id'), '') is null
      or length(trim(item->>'item_id')) > 120
      or jsonb_typeof(item->'checked') is distinct from 'boolean'
  ) then
    raise exception 'inspection item identity is invalid';
  end if;
  if exists (
    select item->>'id'
    from jsonb_array_elements(p_items) item
    group by item->>'id'
    having count(*) > 1
  ) then
    raise exception 'inspection item ids must be unique';
  end if;
  if exists (
    select item->>'item_id'
    from jsonb_array_elements(p_items) item
    group by item->>'item_id'
    having count(*) > 1
  ) then
    raise exception 'inspection master item ids must be unique';
  end if;

  perform pg_advisory_xact_lock(hashtext('inspection:' || v_inspection_id));
  select
    inspection.worker_id,
    inspection.category_id,
    inspection.ship_no,
    inspection.safety_pledge,
    inspection.work_prep_record_id,
    inspection.tools
  into v_existing
  from public.safety_inspections inspection
  where inspection.id = v_inspection_id;

  if found then
    if v_existing.worker_id is distinct from v_worker_id then
      raise exception 'inspection owner mismatch';
    end if;
    if jsonb_typeof(v_existing.tools) is distinct from 'array' then
      raise exception 'inspection conflict';
    end if;
    select count(*)::integer
    into v_existing_item_count
    from public.safety_inspection_items item
    where item.inspection_id = v_inspection_id;
    if nullif(trim(p_inspection->>'category_id'), '') is distinct from v_existing.category_id
      or trim(coalesce(p_inspection->>'ship_no', '')) is distinct from v_existing.ship_no
      or v_safety_pledge is distinct from v_existing.safety_pledge
      or v_work_prep_record_id is distinct from v_existing.work_prep_record_id
      or jsonb_array_length(v_existing.tools) <> cardinality(v_raw_tool_ids)
      or v_existing_item_count <> jsonb_array_length(p_items)
      or exists (
        select 1
        from unnest(v_raw_tool_ids) tool_id
        where not exists (
          select 1
          from jsonb_array_elements(v_existing.tools) tool
          where trim(tool->>'id') = tool_id
        )
      )
      or exists (
        select 1
        from jsonb_array_elements(p_items) submitted
        where not exists (
          select 1
          from public.safety_inspection_items stored
          where stored.inspection_id = v_inspection_id
            and stored.id = trim(submitted->>'id')
            and stored.item_id = trim(submitted->>'item_id')
            and stored.checked = (submitted->>'checked')::boolean
        )
      ) then
      raise exception 'inspection conflict';
    end if;
    return query select v_inspection_id, v_existing_item_count;
    return;
  end if;

  if v_work_prep_record_id is not null then
    select
      record.work_date,
      nullif(trim(record.category_id), ''),
      nullif(trim(record.ship_no), ''),
      nullif(trim(record.leader_worker_id), ''),
      coalesce(record.worker_ids, '[]'::jsonb),
      coalesce(record.other_team_worker_ids, '[]'::jsonb),
      coalesce(record.tool_ids, '[]'::jsonb)
    into
      v_work_date,
      v_category_id,
      v_ship_no,
      v_work_prep_leader_id,
      v_work_prep_worker_ids,
      v_work_prep_other_worker_ids,
      v_work_prep_tool_ids
    from public.work_prep_records record
    where record.id = v_work_prep_record_id
      and record.deleted_at is null
    for share;
    if not found
      or (
        v_worker_id is distinct from v_work_prep_leader_id
        and not (v_work_prep_worker_ids ? v_worker_id)
        and not (v_work_prep_other_worker_ids ? v_worker_id)
      ) then
      raise exception 'work prep participant forbidden';
    end if;
    if v_work_date is null
      or v_work_date !~ '^\d{4}-\d{2}-\d{2}$'
      or to_char(to_date(v_work_date, 'YYYY-MM-DD'), 'YYYY-MM-DD') <> v_work_date then
      raise exception 'work prep date invalid';
    end if;
    if v_now at time zone 'Asia/Seoul' < to_date(v_work_date, 'YYYY-MM-DD') + time '07:00' then
      raise exception 'work prep inspection not started';
    end if;
    if jsonb_typeof(v_work_prep_tool_ids) = 'array' then
      select coalesce(array_agg(tool_id order by first_ord), '{}'::text[])
      into v_raw_tool_ids
      from (
        select trim(value) as tool_id, min(ord) as first_ord
        from jsonb_array_elements_text(v_work_prep_tool_ids) with ordinality entry(value, ord)
        where nullif(trim(value), '') is not null
        group by trim(value)
      ) unique_tools;
    else
      v_raw_tool_ids := '{}'::text[];
    end if;
    perform pg_advisory_xact_lock(hashtext(v_work_prep_record_id), hashtext(v_worker_id));
    if exists (
      select 1
      from public.safety_inspections inspection
      where inspection.work_prep_record_id = v_work_prep_record_id
        and coalesce(inspection.worker_id, inspection.work_prep_worker_id) = v_worker_id
    ) then
      raise exception 'work prep inspection already submitted';
    end if;
  else
    v_category_id := nullif(trim(p_inspection->>'category_id'), '');
    v_ship_no := nullif(trim(p_inspection->>'ship_no'), '');
  end if;

  if v_category_id is null or v_ship_no is null then
    raise exception 'inspection category and ship are required';
  end if;
  select
    replace(trim(coalesce(category.tool_nature, '')), '선/후행', '선행/후행'),
    coalesce(category.tool_ids, '[]'::jsonb),
    category.require_tool_check
  into v_category_nature, v_category_tool_ids, v_require_tool_check
  from public.safety_categories category
  where category.id = v_category_id
  for share;
  if not found then
    raise exception 'inspection category is invalid';
  end if;
  if v_category_nature not in ('선행', '후행', '선행/후행') then
    v_category_nature := '선행';
  end if;
  if jsonb_typeof(v_category_tool_ids) = 'array' then
    v_category_tools_restricted := jsonb_array_length(v_category_tool_ids) > 0;
  end if;

  if v_work_prep_record_id is null and exists (
    select 1
    from unnest(v_raw_tool_ids) selected(tool_id)
    left join public.safety_tools tool on tool.id = selected.tool_id
    where tool.id is null
      or tool.deleted is true
      or (
        case v_category_nature
          when '선행' then replace(trim(tool.nature), '선/후행', '선행/후행') not in ('선행', '선행/후행')
          when '후행' then replace(trim(tool.nature), '선/후행', '선행/후행') not in ('후행', '선행/후행')
          else replace(trim(tool.nature), '선/후행', '선행/후행') not in ('선행', '후행', '선행/후행')
        end
      )
      or (v_category_tools_restricted and not (v_category_tool_ids ? tool.id))
  ) then
    raise exception 'inspection tool is invalid';
  end if;

  if v_work_prep_record_id is null then
    v_selected_tool_ids := v_raw_tool_ids;
  else
    select coalesce(array_agg(selected.tool_id order by selected.ord), '{}'::text[])
    into v_selected_tool_ids
    from unnest(v_raw_tool_ids) with ordinality selected(tool_id, ord)
    join public.safety_tools tool on tool.id = selected.tool_id
    where tool.deleted is false
      and (
        case v_category_nature
          when '선행' then replace(trim(tool.nature), '선/후행', '선행/후행') in ('선행', '선행/후행')
          when '후행' then replace(trim(tool.nature), '선/후행', '선행/후행') in ('후행', '선행/후행')
          else replace(trim(tool.nature), '선/후행', '선행/후행') in ('선행', '후행', '선행/후행')
        end
      )
      and (not v_category_tools_restricted or v_category_tool_ids ? tool.id);
  end if;

  select count(*)::integer
  into v_visible_tool_count
  from public.safety_tools tool
  where tool.deleted is false
    and (
      case v_category_nature
        when '선행' then replace(trim(tool.nature), '선/후행', '선행/후행') in ('선행', '선행/후행')
        when '후행' then replace(trim(tool.nature), '선/후행', '선행/후행') in ('후행', '선행/후행')
        else replace(trim(tool.nature), '선/후행', '선행/후행') in ('선행', '후행', '선행/후행')
      end
    )
    and (not v_category_tools_restricted or v_category_tool_ids ? tool.id);
  if v_require_tool_check and v_visible_tool_count > 0 and cardinality(v_selected_tool_ids) = 0 then
    raise exception 'inspection tools are required';
  end if;

  select coalesce(
    jsonb_agg(jsonb_build_object('id', tool.id, 'name', tool.name) order by selected.ord),
    '[]'::jsonb
  )
  into v_tools
  from unnest(v_selected_tool_ids) with ordinality selected(tool_id, ord)
  join public.safety_tools tool on tool.id = selected.tool_id;

  if exists (
    select 1
    from public.safety_items item
    left join public.safety_sections section
      on section.id = item.section_id
      and section.category_id = item.category_id
    where item.category_id = v_category_id
      and item.active is true
      and section.id is null
  ) then
    raise exception 'inspection master section invalid';
  end if;

  select coalesce(array_agg(item.id order by item.sort_order, item.id), '{}'::text[])
  into v_expected_item_ids
  from public.safety_items item
  join public.safety_sections section
    on section.id = item.section_id
    and section.category_id = item.category_id
  where item.category_id = v_category_id
    and item.active is true
    and (
      case
        when jsonb_typeof(item.tool_ids) = 'array' then
          jsonb_array_length(item.tool_ids) = 0
          or exists (
            select 1
            from jsonb_array_elements_text(item.tool_ids) linked(tool_id)
            where linked.tool_id = any(v_selected_tool_ids)
          )
        else true
      end
    )
    and (
      case replace(trim(coalesce(item.visibility_condition #>> '{}', '')), '선/후행', '선행/후행')
        when '선행' then exists (
          select 1
          from unnest(v_selected_tool_ids) selected(tool_id)
          join public.safety_tools tool on tool.id = selected.tool_id
          where replace(trim(tool.nature), '선/후행', '선행/후행') in ('선행', '선행/후행')
        )
        when '후행' then exists (
          select 1
          from unnest(v_selected_tool_ids) selected(tool_id)
          join public.safety_tools tool on tool.id = selected.tool_id
          where replace(trim(tool.nature), '선/후행', '선행/후행') in ('후행', '선행/후행')
        )
        when '선행/후행' then cardinality(v_selected_tool_ids) > 0
        else true
      end
    );

  v_total := cardinality(v_expected_item_ids);
  if v_total < 1 then
    raise exception 'inspection master items are required';
  end if;
  if jsonb_array_length(p_items) <> v_total
    or exists (
      select 1
      from jsonb_array_elements(p_items) submitted
      where not (trim(submitted->>'item_id') = any(v_expected_item_ids))
    ) then
    raise exception 'inspection master changed';
  end if;

  if exists (
    select 1
    from public.safety_items item
    join jsonb_array_elements(p_items) submitted
      on trim(submitted->>'item_id') = item.id
    where item.id = any(v_expected_item_ids)
      and item.risk = 'high'
      and not (submitted->>'checked')::boolean
  ) then
    raise exception 'inspection high-risk item is required';
  end if;

  select
    count(*)::integer,
    count(*) filter (where (submitted->>'checked')::boolean)::integer,
    count(*) filter (
      where not (submitted->>'checked')::boolean
        and item.risk <> 'low'
    )::integer
  into v_total, v_checked, v_warnings
  from public.safety_items item
  join jsonb_array_elements(p_items) submitted
    on trim(submitted->>'item_id') = item.id
  where item.id = any(v_expected_item_ids);

  insert into public.safety_inspections (
    id,
    category_id,
    worker_id,
    worker,
    ship_no,
    date,
    time,
    status,
    warnings,
    completion,
    tools,
    safety_pledge,
    work_prep_record_id,
    work_prep_worker_id,
    created_at
  )
  values (
    v_inspection_id,
    v_category_id,
    v_worker_id,
    v_worker_name,
    v_ship_no,
    (v_now at time zone 'Asia/Seoul')::date,
    to_char(v_now at time zone 'Asia/Seoul', 'HH24:MI'),
    case when v_checked = v_total then '완료' else '미완료' end,
    v_warnings,
    round(v_checked::numeric * 100 / v_total)::integer,
    v_tools,
    v_safety_pledge,
    v_work_prep_record_id,
    case when v_work_prep_record_id is null then null else v_worker_id end,
    v_now
  );

  insert into public.safety_inspection_items (
    id,
    inspection_id,
    item_id,
    checked,
    risk,
    text,
    section_title
  )
  select
    trim(submitted->>'id'),
    v_inspection_id,
    item.id,
    (submitted->>'checked')::boolean,
    item.risk,
    item.text,
    section.title
  from public.safety_items item
  join public.safety_sections section
    on section.id = item.section_id
    and section.category_id = item.category_id
  join jsonb_array_elements(p_items) submitted
    on trim(submitted->>'item_id') = item.id
  where item.id = any(v_expected_item_ids);

  if v_work_prep_record_id is not null then
    with participants as (
      select v_work_prep_leader_id as worker_id
      where v_work_prep_leader_id is not null
      union
      select value
      from jsonb_array_elements_text(
        case when jsonb_typeof(v_work_prep_worker_ids) = 'array' then v_work_prep_worker_ids else '[]'::jsonb end
      ) participant(value)
      where nullif(trim(value), '') is not null
      union
      select value
      from jsonb_array_elements_text(
        case when jsonb_typeof(v_work_prep_other_worker_ids) = 'array' then v_work_prep_other_worker_ids else '[]'::jsonb end
      ) participant(value)
      where nullif(trim(value), '') is not null
    ), submissions as (
      select distinct coalesce(inspection.worker_id, inspection.work_prep_worker_id) as worker_id
      from public.safety_inspections inspection
      join participants participant
        on participant.worker_id = coalesce(inspection.worker_id, inspection.work_prep_worker_id)
      where inspection.work_prep_record_id = v_work_prep_record_id
    )
    select
      (select count(*)::integer from participants),
      (select count(*)::integer from submissions),
      coalesce((select jsonb_agg(worker_id order by worker_id) from submissions), '[]'::jsonb)
    into v_participant_count, v_submitted_count, v_submitted_worker_ids;

    update public.work_prep_records
    set
      status = case when v_participant_count > 0 and v_submitted_count >= v_participant_count then 'used' else 'confirmed' end,
      status_history = case
        when status = case when v_participant_count > 0 and v_submitted_count >= v_participant_count then 'used' else 'confirmed' end
          then status_history
        else coalesce(status_history, '[]'::jsonb) || jsonb_build_array(jsonb_build_object(
          'kind', case when v_participant_count > 0 and v_submitted_count >= v_participant_count then 'complete' else 'start' end,
          'status', case when v_participant_count > 0 and v_submitted_count >= v_participant_count then '점검 완료' else '확정' end,
          'changedAt', v_now,
          'actorIds', case when v_participant_count > 0 and v_submitted_count >= v_participant_count then v_submitted_worker_ids else jsonb_build_array(v_worker_id) end,
          'actorLabel', v_worker_name
        ))
      end,
      updated_at = v_now
    where id = v_work_prep_record_id;
  end if;

  return query select v_inspection_id, v_total;
end;
$$;

revoke all on function public.submit_worker_inspection(jsonb, jsonb)
  from public, anon, authenticated;
grant execute on function public.submit_worker_inspection(jsonb, jsonb)
  to service_role;
