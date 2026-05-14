-- Supabase schema update for tool nature based checklist filtering.
-- Project ref in app: psatbyktzladtymdygwh

begin;

alter table public.safety_tools
  alter column category_id drop not null;

alter table public.safety_tools
  add column if not exists nature text not null default '선행';

alter table public.safety_categories
  add column if not exists tool_nature text not null default '선행';

alter table public.safety_items
  add column if not exists visibility_condition text not null default '항상 표시';

update public.safety_categories
set tool_nature = case
  when label ~ '압력\s*테스트|압력테스트' then '선행/후행'
  when label ~ '후행|DP|선주|선급|DEMO|Demo|demo' then '후행'
  when label ~ '탑재|선행' then '선행'
  else tool_nature
end;

update public.safety_items
set visibility_condition = '항상 표시'
where visibility_condition is null
   or visibility_condition not in ('항상 표시', '선행', '후행', '선행/후행');

update public.safety_tools
set nature = '선행'
where nature is null
   or nature not in ('선행', '후행', '선행/후행');

alter table public.safety_tools
  drop constraint if exists safety_tools_nature_check;

alter table public.safety_tools
  add constraint safety_tools_nature_check
  check (nature in ('선행', '후행', '선행/후행'));

alter table public.safety_categories
  drop constraint if exists safety_categories_tool_nature_check;

alter table public.safety_categories
  add constraint safety_categories_tool_nature_check
  check (tool_nature in ('선행', '후행', '선행/후행'));

alter table public.safety_items
  drop constraint if exists safety_items_visibility_condition_check;

alter table public.safety_items
  add constraint safety_items_visibility_condition_check
  check (visibility_condition in ('항상 표시', '선행', '후행', '선행/후행'));

commit;
