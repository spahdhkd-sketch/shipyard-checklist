# Supabase Egress Check - 2026-05-28

Use this checklist when checking whether the app is keeping Supabase egress low.
Do not paste Supabase keys, worker employee numbers, session tokens, or private payloads into reports.

## Browser Network Checks

1. Open DevTools > Network and enable Disable cache.
2. Load `manage.html`, `history.html`, and `analytics.html` once each.
3. Filter requests by the active Supabase project host.
4. Confirm startup table requests use explicit `select=` columns, not `select=*`.
5. Confirm the default history/admin data load returns about 20 recent rows for large record tables.
6. Confirm `safety_inspection_items` and `issue_photos` are not fetched on initial page load.
7. Open a single history detail and confirm only that inspection's item rows are fetched.
8. Open a single unsafe issue detail and confirm only that issue's photo metadata/images are fetched.
9. Confirm unsafe issue list cards do not auto-load Storage image URLs before detail click.
10. Upload a test photo and confirm the uploaded object is compressed client-side and sent with `cacheControl=604800`.

## Expected Request Shape

- Catalog tables: projected column selects only.
- Recent record tables: ordered, bounded selects, defaulting to 20 rows.
- Realtime: no automatic startup subscription in normal browsing.
- Images: no list thumbnail loads; detail-only image loads.
- Exports: full photo downloads happen only after the user clicks an export button.

## Dashboard Checks

In Supabase Dashboard, check these after deployment:

- Project Usage > Egress by day after normal field usage.
- Storage > `issue-photos` object sizes; target most new photos under 500 KB.
- Storage policies for `issue-photos`; public insert should be limited to `unsafe/%`.
- Edge Function logs for `admin-mutations`, `worker-push`, and `pictogram-image` error spikes.
- Database API logs for repeated identical table reads on page load.
