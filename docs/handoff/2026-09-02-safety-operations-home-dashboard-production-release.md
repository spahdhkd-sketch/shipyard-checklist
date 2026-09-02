# 2026-09-02 Safety Operations Home Dashboard Production Release

## Scope

- Deployment source: the working tree on `feat/claude-batch`, based on commit `4f9fd5276eed3b4ece07b2c6e4ba3a4b5c94ef94`.
- Operational surface: the actual legacy administrator home route, `index.html` -> `dashboard` -> `renderDashboard`.
- Application version: `1.14.4-20260902-v1`.
- Asset token: `20260902-v1-1`.
- No standalone proposal artifact was deployed.

## Delivered behavior

- KPI-first `안전 운영 대시보드` using existing work-order, pre-work check, and recent safety-signal records.
- Direct operational labels for work orders, pre-work check execution, risk-assessment execution confirmation, and safety signals.
- Truthful unavailable state for risk-assessment execution confirmation until its event and denominator are defined.
- Control-map legend at the top-left: red for danger or unaddressed work, yellow for check-needed conditions, and green for confirmed or completed work.
- Work orders without a matched map location remain visible as `장소 미지정`.

## Verification before deployment

- `npm.cmd run build:assets`: passed.
- `npm.cmd run verify`: passed.
- `node tools/quality-harness.mjs --skip-verify --allow-non-main`: passed with the expected dirty-working-tree and deploy-relevant-change warnings.
- `git diff --check`: passed; only existing Windows line-ending warnings were printed.
- `npm.cmd run e2e`: passed.
- `npm.cmd run e2e:pwa`: passed.
- `npm.cmd run e2e:design-tokens -- --home-visual-only`: passed at PC, 430, 390, and 360 widths.

## Production identity

- Vercel project: `index-html`.
- Deployment ID: `dpl_Ecetz4J3T25Rbbn9fF7KKd4UQb6L`.
- Deployment URL: `https://index-html-3vij553ym-spahdhkd-3161s-projects.vercel.app`.
- Production alias: `https://gs-safety-checklist.vercel.app`.
- The alias was assigned explicitly with `vercel alias set`.
- CLI inspection resolved both the deployment URL and production alias to the same `READY` production deployment ID.
- Direct public fetches to the generated deployment URL redirect to Vercel SSO; the public production alias is not protected and serves the release.

## Live evidence

- Cache-bypassed SHA-256 matched local files for `index.html`, `sw.js`, `assets/dist/js/app-v2.min.js`, `assets/dist/js/dashboard-view.min.js`, `assets/dist/js/control-map-view.min.js`, `assets/dist/css/styles-v2.min.css`, and `assets/dist/css/30-feature-control-center.min.css`.
- Live browser QA passed at 1366 x 900 and 390 x 844: title `안전 운영 대시보드`, four direct-label KPI cards, control map, three-item color legend, no horizontal overflow, and no page errors.
- Local evidence screenshots: `.omo/evidence/release-20260902/live-home-1366.png` and `.omo/evidence/release-20260902/live-home-390.png`.

## Boundaries

- No commit, push, branch change, Supabase migration, Edge Function deployment, or production-data mutation was performed.
- Existing unrelated working-tree changes were preserved.
