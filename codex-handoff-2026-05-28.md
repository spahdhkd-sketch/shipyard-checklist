# Codex Handoff - GS Safety Checklist - 2026-05-28

## Read First

- Continue from this repository: `https://github.com/spahdhkd-sketch/shipyard-checklist.git`
- Current working branch: `codex/safety-pictograms-handoff-20260528`
- Current release tag: `v0.9-20260528`
- Production URL: `https://gs-safety-checklist.vercel.app`
- Vercel project: `index-html`
- Supabase project ref: `yuuroocvxvzgmsdeeiws`
- Before doing new work, read this file, then run `git status --short --branch`.
- Do not expose Supabase service role keys, employee numbers, session tokens, or other secrets.
- Do not bump `APP_VERSION` unless the user explicitly asks for another deployment.

## How To Resume On Another Desktop

```powershell
git clone https://github.com/spahdhkd-sketch/shipyard-checklist.git
cd shipyard-checklist
git fetch origin --tags
git checkout codex/safety-pictograms-handoff-20260528
git pull
Get-Content .\codex-handoff-2026-05-28.md
npm.cmd run verify
```

If the user asks for the exact deployed release snapshot:

```powershell
git checkout v0.9-20260528
Get-Content .\codex-handoff-2026-05-28.md
```

## Current Production Release

- App version: `0.9-20260528`
- Release tag: `v0.9-20260528`
- Production deployment id: `dpl_AwXMLiHCgGBA5uEJQzFCvpC5mvBe`
- Production deployment URL: `https://index-html-nof5fts49-spahdhkd-3161s-projects.vercel.app`
- Production alias: `https://gs-safety-checklist.vercel.app`
- Asset token: `20260528-egress-signature-1`
- Service worker cache: `gs-safety-20260528-egress-signature-1`

Verified after deployment:

- Production `index.html` returns current asset token.
- Production `assets/js/app-v2.js` contains `APP_VERSION = "0.9-20260528"`.
- Production `sw.js` contains `gs-safety-20260528-egress-signature-1`.
- `npm.cmd run verify` passed.
- Vercel deployment status is `READY`.

## Completed Work On 2026-05-28

- Reduced Supabase egress:
  - Narrowed frontend Supabase selects to explicit columns.
  - Limited startup pulls for large tables.
  - Stopped pulling inspection detail rows and issue photo rows on startup.
  - Added lazy detail loaders for inspection items and issue photos.
  - Removed automatic realtime/polling startup refresh loops.
  - Added administrator/history "load more" behavior.
- Reduced Storage image egress:
  - Removed automatic unsafe issue thumbnails from list rows.
  - Load issue photos only when detail is opened.
  - Compress unsafe issue photos before upload.
  - Upload issue photos with `cacheControl: "604800"`.
- Fixed work-prep worker leakage:
  - New work order registration no longer inherits selected workers/tools/id from the previous registration draft.
- Fixed pledge signature clearing:
  - The signature pad clear action now clears the current draft signature.
  - Same-day reusable worker signature cache is preserved, so another work order can preload the existing signature.
- Hardened pictogram and admin mutation boundaries:
  - Removed legacy arbitrary pictogram `src` paths from admin mutation allowlist/redirect handling.
- Added egress operation guide:
  - `docs/ops/supabase-egress-checklist-2026-05-28.md`
- Added static regression coverage:
  - `tests/egress-optimization-static.test.js`
  - Updated harness/static tests for the current release token and version.

## Supabase Remote State

The following Storage policy migration file was added:

```txt
supabase/migrations/20260528003000_egress_reduction_boundaries.sql
```

The user manually applied the functional SQL in Supabase SQL Editor on 2026-05-28.

Important note:

- The original `comment on policy ...` statement failed with `ERROR: 42501: must be owner of relation objects`.
- The user removed only that comment statement and reran the rest successfully.
- The comment is documentation-only and is not required for behavior.

Applied policy intent:

- Allow browser inserts only into `issue-photos` bucket paths matching `unsafe/%`.
- Reject object names containing `..`.
- Remove broad public update/delete policies for issue photos.
- Keep photo deletion/update behind controlled app/admin paths.

If reapplying manually, use this reduced SQL:

```sql
drop policy if exists "issue_photos_insert_public" on storage.objects;
drop policy if exists "issue_photos_delete_public" on storage.objects;
drop policy if exists "public update issue photos" on storage.objects;
drop policy if exists "public delete issue photos" on storage.objects;

create policy "issue_photos_insert_public"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'issue-photos'
    and name like 'unsafe/%'
    and position('..' in name) = 0
  );
```

## Files To Know

- Main app runtime: `assets/js/app-v2.js`
- Service worker: `sw.js`
- Release record: `VERSION.md`
- Vercel config: `vercel.json`
- Egress guide: `docs/ops/supabase-egress-checklist-2026-05-28.md`
- Storage policy migration: `supabase/migrations/20260528003000_egress_reduction_boundaries.sql`
- Static egress tests: `tests/egress-optimization-static.test.js`
- Quality harness: `tools/quality-harness.mjs`

## Local Workspace Caveat

The local workspace may contain an untracked `outputs/` folder from PowerPoint work. It was intentionally not committed and should not be included in app deployment commits unless the user explicitly asks.

## Recommended Next Checks

```powershell
git status --short --branch
npm.cmd run verify
npm.cmd run harness:live
```

`npm.cmd run harness:live` may fail the "git branch is main" check while working on `codex/safety-pictograms-handoff-20260528`; that is expected for this handoff branch. Production asset/version checks should pass.
