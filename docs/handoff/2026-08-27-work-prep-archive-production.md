# 2026-08-27 work-order archive production checkpoint

## Release

- Branch: `feat/claude-batch`
- Application commit: `3ea0f567e848c8853d3698677aab9a720fe130b3`
- Application version: `1.13.1-20260827-v1`
- Asset token: `20260827-v1-1`
- Production URL: `https://gs-safety-checklist.vercel.app`
- Preview deployment: `dpl_FWv7oGjDnrJJUjgBCcv3vdwCaLZN`
- Production deployment: `dpl_4m5FebJnaPbY5ZUxy9q6QQpEsd1u`

## Shipped behavior

- Registered work-order cards use the canonical authenticated archive action and show `보관 요청` instead of an inert delete control.
- Archive confirmation continues through the existing server soft-delete boundary.
- Pre-login synchronization does not start operational record pulls; only the public master data required for sign-in is fetched.
- The accumulated responsive E2E suite preloads Management tab state so Safety Settings remains stable across all tested viewports.

## Verification evidence

- `npm.cmd run build:assets`
- `npm.cmd run verify`
- `node tools/quality-harness.mjs --skip-verify --allow-non-main` — 335 checks, 0 failures
- `npm.cmd run e2e`
- `npm.cmd run e2e:design-tokens` — 48 surfaces at 1366, 430, 390, and 360 px
- `npm.cmd run e2e:pwa`
- `git diff --check`
- Preview metadata reported exact Git SHA `3ea0f567e848c8853d3698677aab9a720fe130b3` and `READY`.
- Production `VERSION.md`, `sw.js`, `check.html`, and `assets/dist/js/app-v2.min.js` matched the release markers and committed minified asset.
- A fresh anonymous production browser requested only the six public sign-in/master-data tables and no operational record table.
- A 390 px production browser displayed the synthetic work-order `보관 요청` button and soft-delete confirmation. The confirmation was dismissed; no production row was changed.

## Preserved boundaries

- No pull request was created or merged.
- No Supabase migration, Edge Function deployment, or production data mutation was performed.
- No live push notification was sent.
- Existing untracked patch inputs and the standalone visual plan were not committed or deployed.
