insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'safety-pictograms',
  'safety-pictograms',
  false,
  786432,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.safety_pictograms
  add column if not exists storage_bucket text not null default 'safety-pictograms',
  add column if not exists storage_path text,
  add column if not exists mime_type text,
  add column if not exists file_size bigint;

update public.safety_pictograms
set storage_bucket = 'safety-pictograms'
where storage_bucket is null or storage_bucket = '';

comment on column public.safety_pictograms.src is
  'Legacy image payload. Browser metadata pulls must not select this column; pictogram images are served through Storage or the pictogram-image lazy-load function.';
comment on column public.safety_pictograms.storage_bucket is
  'Storage bucket for custom pictogram image bytes.';
comment on column public.safety_pictograms.storage_path is
  'Storage object path for custom pictogram image bytes.';
comment on column public.safety_pictograms.mime_type is
  'Custom pictogram image MIME type.';
comment on column public.safety_pictograms.file_size is
  'Custom pictogram image size in bytes.';
