# 2026-09-02 Safety Operations Dashboard Responsive Layout Production Hotfix

## Scope

- Operational surface: the actual legacy administrator home route, `index.html` -> `dashboard` -> `renderDashboard`.
- Application version: `1.14.4-20260902-v2`.
- Asset token: `20260902-v1-2`.
- Change: reflow compressed dashboard KPI cards and primary-work shortcuts into 2 x 2 grids at viewport widths up to 1100px.
- Korean labels keep words together, and danger/caution values and units no longer collide inside narrow cards.

## Candidate boundary

- Direct deployment from the dirty source checkout was rejected because it contained unrelated and untracked files.
- A new isolated candidate was created with 346 runtime files only: application HTML, `manifest.json`, `sw.js`, Vercel configuration, package metadata, `VERSION.md`, and `assets`.
- The candidate excluded `docs`, `tests`, `tools`, `supabase`, artifacts, environment files, and patch files.
- SHA-256 matched the source checkout for `index.html`, `sw.js`, app, dashboard, control-map, and the two dashboard/control-map CSS runtimes before deployment.

## Verification before deployment

- `npm.cmd run build:assets`: passed.
- `npm.cmd run verify`: passed.
- `node tools/quality-harness.mjs --skip-verify --allow-non-main`: passed with the expected dirty-working-tree and deploy-relevant-change warnings.
- `git diff --check`: passed; only existing Windows line-ending warnings were printed.
- `npm.cmd run e2e`: passed.
- `npm.cmd run e2e:pwa`: passed for `1.14.4-20260902-v2`.
- `npm.cmd run e2e:design-tokens -- --home-visual-only`: passed at PC, 840, 430, 390, and 360 widths.

## Production identity

- Vercel project: `index-html`.
- Deployment ID: `dpl_H1bJK6sxWCQZZmFkciJNJNF7oHkp`.
- Deployment URL: `https://index-html-c4f6wwpi9-spahdhkd-3161s-projects.vercel.app`.
- Production alias: `https://gs-safety-checklist.vercel.app`.
- The alias was assigned explicitly and CLI inspection resolved the deployment URL and production alias to the same `READY` production deployment ID.

## Live evidence

- Cache-bypassed production SHA-256 matched the isolated candidate for all seven key runtime files.
- Live 840 x 900 PC-preview QA reported four KPI cards in two columns, four shortcuts in two columns, the control map and three-item legend visible, and no page errors. The existing 920px PC-preview canvas remains intentional.
- Live 390 x 844 mobile QA reported the same 2 x 2 layouts without horizontal overflow or page errors.
- Screenshots: `.omo/evidence/release-20260902/live-home-v2-840.png` and `.omo/evidence/release-20260902/live-home-v2-390.png`.

## Boundaries

- No commit, push, branch change, Supabase migration, Edge Function deployment, or production-data mutation was performed.
- Existing unrelated working-tree changes were preserved.
