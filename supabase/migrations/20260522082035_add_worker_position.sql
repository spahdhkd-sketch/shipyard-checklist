alter table public.workers
  add column if not exists position text not null default '작업자';
