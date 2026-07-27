create or replace function public.app_server_time()
returns timestamptz
language sql
volatile
security invoker
set search_path = public
as $$
  select clock_timestamp();
$$;

revoke all on function public.app_server_time() from public;
grant execute on function public.app_server_time() to anon, authenticated, service_role;

create temporary table duplicate_inspection_ids on commit drop as
with ranked as (
  select
    id,
    row_number() over (
      partition by worker_id, ship_no, category_id, date
      order by created_at desc nulls last, id desc
    ) as duplicate_rank
  from public.safety_inspections
  where date >= date '2026-06-01'
    and date < date '2026-07-01'
)
select id
from ranked
where duplicate_rank > 1;

delete from public.safety_inspection_items item
using duplicate_inspection_ids duplicate
where item.inspection_id = duplicate.id;

delete from public.safety_inspections inspection
using duplicate_inspection_ids duplicate
where inspection.id = duplicate.id;

create unique index if not exists safety_inspections_worker_ship_category_date_uidx
  on public.safety_inspections (worker_id, ship_no, category_id, date)
  where worker_id is not null
    and date >= date '2026-07-14';
