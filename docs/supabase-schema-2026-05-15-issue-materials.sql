-- Supabase schema for unsafe issue and missing material workflows.

create table if not exists public.workers (
  id text primary key,
  name text not null,
  team text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.unsafe_issues (
  id text primary key,
  ship_no text not null,
  content text not null,
  worker_id text,
  worker_name_snapshot text not null,
  worker_team_snapshot text not null default '',
  status text not null default '접수' check (status in ('접수', '조치중', '완료')),
  admin_memo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.missing_materials (
  id text primary key,
  ship_no text not null,
  material_name text not null,
  content text not null,
  worker_id text,
  worker_name_snapshot text not null,
  worker_team_snapshot text not null default '',
  status text not null default '접수' check (status in ('접수', '확인중', '완료')),
  admin_memo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.issue_photos (
  id text primary key,
  target_type text not null check (target_type in ('unsafe_issue')),
  target_id text not null,
  storage_bucket text not null default 'issue-photos',
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists unsafe_issues_status_created_idx
  on public.unsafe_issues (status, created_at desc);

create index if not exists unsafe_issues_ship_idx
  on public.unsafe_issues (ship_no);

create index if not exists missing_materials_ship_status_idx
  on public.missing_materials (ship_no, status, created_at desc);

create index if not exists issue_photos_target_idx
  on public.issue_photos (target_type, target_id, sort_order);

alter table public.workers enable row level security;
alter table public.unsafe_issues enable row level security;
alter table public.missing_materials enable row level security;
alter table public.issue_photos enable row level security;

grant select, insert, update, delete on public.workers to anon, authenticated;
grant select, insert, update, delete on public.unsafe_issues to anon, authenticated;
grant select, insert, update, delete on public.missing_materials to anon, authenticated;
grant select, insert, update, delete on public.issue_photos to anon, authenticated;

drop policy if exists "public all workers" on public.workers;
create policy "public all workers" on public.workers for all to anon, authenticated using (true) with check (true);

drop policy if exists "public all unsafe issues" on public.unsafe_issues;
create policy "public all unsafe issues" on public.unsafe_issues for all to anon, authenticated using (true) with check (true);

drop policy if exists "public all missing materials" on public.missing_materials;
create policy "public all missing materials" on public.missing_materials for all to anon, authenticated using (true) with check (true);

drop policy if exists "public all issue photos" on public.issue_photos;
create policy "public all issue photos" on public.issue_photos for all to anon, authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('issue-photos', 'issue-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public read issue photos" on storage.objects;
create policy "public read issue photos" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'issue-photos');

drop policy if exists "public insert issue photos" on storage.objects;
create policy "public insert issue photos" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'issue-photos');

drop policy if exists "public update issue photos" on storage.objects;
create policy "public update issue photos" on storage.objects
  for update to anon, authenticated
  using (bucket_id = 'issue-photos')
  with check (bucket_id = 'issue-photos');

drop policy if exists "public delete issue photos" on storage.objects;
create policy "public delete issue photos" on storage.objects
  for delete to anon, authenticated
  using (bucket_id = 'issue-photos');
