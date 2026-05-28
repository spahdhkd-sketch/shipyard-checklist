# Verification Gate Report - 2026-05-28

Scope: Agent A verification gate ownership for the pre-refactor local/production safety gate. This report is based on the current scripts and static checks. Per orchestration constraints, I did not run the broad project-wide gate commands.

## `npm.cmd run verify` coverage

`package.json` defines `verify` as a local static/unit gate:

- Syntax checks:
  - `assets/js/app-v2.js`
  - `assets/js/checklist-rules.js`
  - `assets/js/issue-material-rules.js`
  - `tools/quality-harness.mjs`
  - `tools/claude-quality-harness.mjs`
- Rule tests:
  - `tests/checklist-rules.test.js`
  - `tests/issue-material-rules.test.js`
- Static recovery/config/security tests:
  - `tests/static-recovery.test.js`
  - `tests/harness-config.test.js`
  - `tests/worker-security-static.test.js`
  - `tests/admin-mutation-boundary-static.test.js`

What it protects:

- JavaScript parseability for the main app, shared rule files, and harness scripts.
- Checklist and issue/material rules behavior covered by their Node tests.
- Static app recovery invariants, including current Supabase/CSP references, remote table/realtime wiring, service worker references, UI fallback hooks, and migration/function presence checks.
- Harness command wiring, including `harness`, `harness:live`, `harness:strict`, and inclusion of harness checks in `verify`.
- Worker/admin security boundaries that are asserted by source and migration pattern checks.
- `safety_pictograms` metadata-only behavior through static assertions in `tests/admin-mutation-boundary-static.test.js` and related recovery checks.

What it does not prove:

- Browser rendering behavior.
- Live production deployment freshness.
- Real Supabase RLS/column-grant enforcement against a deployed database.
- Actual Edge Function HTTP behavior for `pictogram-image`.

## `npm.cmd run harness:live` coverage

`package.json` defines `harness:live` as:

```text
node tools/quality-harness.mjs --live
```

`tools/quality-harness.mjs` runs the local harness checks and then adds production probes against:

```text
https://gs-safety-checklist.vercel.app
```

What it protects locally:

- Static pages use the current CSS/JS asset token and local Supabase vendor bundle.
- Static pages do not reference legacy CSS/JS, stale fallback versions, old Supabase project refs, or the removed CDN.
- 404 page uses the current CSS token.
- Main app source contains the expected `APP_VERSION`, active Supabase project ref, remote sync/realtime/fallback logic, admin mutation path, and known UI recovery hooks.
- Service worker cache/version and expected precached assets exist.
- Removed legacy files remain absent.
- Shipyard illustration assets exist.

What `--live` adds:

- Production `index.html`, CSS, JS, service worker, and 404 fetches.
- Production index references the current CSS/JS asset token.
- Production JS contains the current `APP_VERSION`, active Supabase ref, worker admin pre-entry marker, and ship DATA card marker.
- Production CSS contains the compact ship date fix.
- Production service worker contains the current cache name.
- Duplicate Vercel aliases are closed by 404 or canonical 308 redirects for root and `/checklist`.

What it does not prove:

- A logged-in/admin workflow can mutate production data.
- Browser UI can load a custom pictogram image end to end.
- Supabase Storage object permissions or `pictogram-image` response headers are correct in production.
- Production DB schema/grants match the migrations, beyond indirect app/source/header probes.

## `safety_pictograms` metadata-only and lazy-image protection

Current protection is mostly static and split across app source, migrations, and tests.

Protected by `tests/admin-mutation-boundary-static.test.js`:

- `admin-mutations` must support `uploadPictogramImage`.
- `admin-mutations` must use the `safety-pictograms` Storage bucket.
- `admin-mutations` must write pictogram bytes through `supabase.storage.from(...).upload`.
- Frontend custom pictogram uploads must call `invokeAdminMutation("uploadPictogramImage")`.
- Remote pulls must use explicit `selectColumns`.
- `safety_pictograms` must select only:
  - `id,label,source,deleted,sort_order,storage_bucket,storage_path,mime_type,file_size`
- `fromDb` must not pull `row.src` into frontend state.
- Custom pictogram data URLs must not be saved directly into state.
- Migration checks require Storage metadata columns and revoke broad table select from browser roles.
- Metadata-only column grants must exclude legacy `src`.

Protected by `tests/static-recovery.test.js`:

- `safety_pictograms` remains in the realtime publication migration.
- Storage metadata migration exists for `safety-pictograms`.
- `pictogram-image` Edge Function reads `storage_bucket,storage_path,mime_type,src`, downloads from Storage, and keeps `parseDataUrl` fallback support.
- App still has `setupPictogramImageFallbacks()` and `.pictogram-image-fallback` styling.

Protected in `assets/js/app-v2.js` by the current implementation shape:

- `REMOTE_TABLES` config for `safety_pictograms` uses metadata-only `selectColumns`.
- `toDb` writes metadata fields: bucket, path, MIME type, and file size.
- `fromDb` maps metadata fields and does not map `src`.
- `pictogramAssetSrc()` returns built-in assets directly, but custom synced pictograms use `pictogramLazyImageSrc(row)`.
- `pictogramLazyImageSrc()` builds a lazy function URL: `/functions/v1/pictogram-image?id=...&v=...`.
- Rendered custom pictogram images use `loading="lazy"` and `decoding="async"`.
- New custom pictograms store returned image metadata in state instead of the uploaded data URL.

## Verification gaps before code movement

Close these before extracting or moving pictogram code:

1. Add a small characterization test for `pictogramAssetSrc()` / `pictogramLazyImageSrc()` behavior, or extract those functions behind a testable seam first. Current coverage is source-regex based and can pass while runtime URL generation breaks.
2. Add a DOM-level or browser smoke check that proves a custom pictogram renders as an `<img loading="lazy">` and falls back to `.pictogram-image-fallback` on image failure.
3. Add a live or mocked HTTP check for `supabase/functions/pictogram-image/index.ts` covering metadata lookup, Storage download, legacy `src` fallback, MIME type, and missing/invalid id responses.
4. Add a database/grant verification step for `safety_pictograms` proving anon/authenticated roles can select metadata columns but cannot select `src`.
5. Add a focused regression check that `pullRemote()` uses `config.selectColumns` for `safety_pictograms`; the current test confirms the source pattern, not an executed query.
6. Keep `npm.cmd run verify` and `npm.cmd run harness:live` as gates after the above additions, but do not treat them as sufficient proof of lazy-image runtime behavior on their own.

## Bottom line

`npm.cmd run verify` protects local syntax, unit/static recovery, and the current security/source invariants. `npm.cmd run harness:live` protects deployed static asset freshness, production alias closure, and selected production source/header invariants. The `safety_pictograms` metadata-only/lazy-image behavior is protected mainly by static regex checks today; before moving code, runtime characterization for lazy URL generation, DOM image behavior, Edge Function responses, and DB column grants should be added.
