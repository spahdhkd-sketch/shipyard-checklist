revoke select on table public.safety_pictograms from public, anon, authenticated;

grant select (
  id,
  label,
  source,
  deleted,
  sort_order,
  storage_bucket,
  storage_path,
  mime_type,
  file_size
) on public.safety_pictograms to anon, authenticated;

comment on table public.safety_pictograms is
  'Browser clients can read pictogram metadata only. Legacy src bytes are served lazily through the pictogram-image Edge Function or Storage.';
