-- Optional schema extension for issue/material processing timelines.
-- The app falls back safely when these columns are not present yet.

alter table if exists public.unsafe_issues
  add column if not exists status_history jsonb not null default '[]'::jsonb;

alter table if exists public.missing_materials
  add column if not exists status_history jsonb not null default '[]'::jsonb;
