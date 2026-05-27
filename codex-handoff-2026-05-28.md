# Codex Handoff - GS Safety Checklist - 2026-05-28

## Read First

- Workspace used here: `C:\Users\User\GS_CHECKLIST\CODEX_VERSION\shipyard-checklist`
- Branch: `main`
- User will continue from another desktop's Codex. Start by reading this file, then verify current git status and remote deployment state.
- Repository instructions require context-mode style work: avoid dumping raw command output; summarize via scripts/tools.
- Do not expose Supabase service role keys, employee numbers, session tokens, or other secrets.
- Do not bump `APP_VERSION` unless the user explicitly asks.

## Current Objective Completed

The last requested task was:

> Change `safety_pictograms` so the app pulls metadata only, and move image `src` out to Storage or a separate lazy-load path.

Implemented and deployed:

- `safety_pictograms` frontend pull now uses metadata-only columns:
  - `id,label,source,deleted,sort_order,storage_bucket,storage_path,mime_type,file_size`
- `src` is no longer selected into frontend state by the normal remote pull path.
- New custom pictogram uploads go through `admin-mutations` action `uploadPictogramImage`.
- Custom pictogram bytes are stored in Supabase Storage bucket `safety-pictograms`.
- Custom pictogram rendering uses the public lazy image function:
  - `https://yuuroocvxvzgmsdeeiws.supabase.co/functions/v1/pictogram-image?id=<pictogramId>`
- Browser roles can read pictogram metadata only; direct `src` select is revoked.

## Supabase State

- Project ref: `yuuroocvxvzgmsdeeiws`
- Applied migrations:
  - `20260528001000_safety_pictograms_storage_metadata.sql`
  - `20260528002000_safety_pictograms_metadata_select_grants.sql`
- Deployed Edge Functions:
  - `admin-mutations`
  - `pictogram-image` with `--no-verify-jwt`
- Verification already done:
  - `storage.buckets` has `safety-pictograms`
  - `public.safety_pictograms` has `storage_bucket`, `storage_path`, `mime_type`, `file_size`
  - anon REST metadata select returned 200
  - anon REST `select=src` returned 401 permission error
  - `pictogram-image?id=__codex_missing__` returned 404 without requiring JWT
  - Supabase Security Advisor returned `lints: []`

## Vercel State

- Real production alias: `https://gs-safety-checklist.vercel.app`
- Vercel project that must receive production deploys: `index-html`
- Latest deployment created in this task:
  - `https://index-html-23gdwz46a-spahdhkd-3161s-projects.vercel.app`
- Alias was explicitly moved:
  - `gs-safety-checklist.vercel.app` now points to `index-html-23gdwz46a-spahdhkd-3161s-projects.vercel.app`
- Important: there is another Vercel project named `shipyard-checklist`. Do not assume it is the real production target. Production alias belongs to `index-html`.

## Files Changed

Tracked modifications:

- `assets/js/app-v2.js`
- `supabase/functions/admin-mutations/index.ts`
- `tests/admin-mutation-boundary-static.test.js`
- `tests/static-recovery.test.js`
- `tests/worker-security-static.test.js`

New files:

- `supabase/functions/pictogram-image/index.ts`
- `supabase/functions/pictogram-image/deno.json`
- `supabase/migrations/20260528001000_safety_pictograms_storage_metadata.sql`
- `supabase/migrations/20260528002000_safety_pictograms_metadata_select_grants.sql`

Pre-existing/unrelated untracked files currently present:

- `codex-handoff-2026-05-27.md`
- `supabase-egress-trace-2026-05-28.md`

## Verification Already Run

All passed:

```powershell
npm.cmd run verify
npm.cmd run harness
npm.cmd run harness:live
```

Expected warnings:

- Dirty worktree warning
- Deploy-relevant files differ from expected commit

Those warnings are expected because changes are not committed/staged.

## Suggested Start Tomorrow

1. Read this handoff.
2. Run a concise status check:

```powershell
git status --short
```

3. Re-run validation if needed:

```powershell
npm.cmd run verify
npm.cmd run harness:live
```

4. If the user wants this preserved, commit the current changes. Do not stage unrelated files unless the user asks.

## Useful Checks

Confirm production JS has metadata-only/lazy path:

```powershell
npm.cmd run harness:live
```

If manually probing production JS, expect:

- Contains `selectColumns: "id,label,source,deleted,sort_order,storage_bucket,storage_path,mime_type,file_size"`
- Contains `/functions/v1/pictogram-image`
- Does not contain `src: String(reader.result || "")`
- Does not map `src: row.src` in `safety_pictograms` `fromDb`

Confirm Supabase advisor:

- Security Advisor should be empty: `lints: []`

Confirm REST grant boundary:

- Metadata select on `safety_pictograms` should succeed.
- `select=src` as anon should fail with permission error.

## Caveats

- Existing legacy `src` values may still exist in the database for old custom pictograms. They are no longer pulled by the frontend and are only used as a fallback by `pictogram-image` when no Storage path exists.
- The new Storage upload path is only for new custom pictograms. A later cleanup/migration could backfill legacy `src` payloads into Storage, but that was not requested or done.
- `pictogram-image` is public and intentionally has `--no-verify-jwt`, but it only serves active custom pictogram rows and returns 404 otherwise.
- The local `.vercel` project link may not expose `projectName` in `project.json`, but deploy output showed it is deploying to `spahdhkd-3161s-projects/index-html`. Still verify before future production deploys.
