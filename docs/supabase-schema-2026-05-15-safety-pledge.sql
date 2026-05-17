-- Store the daily safety pledge submitted with each inspection record.
alter table if exists public.safety_inspections
add column if not exists safety_pledge text not null default '';
