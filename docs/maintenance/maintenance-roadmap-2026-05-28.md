# Maintenance Roadmap - GS Safety Checklist - 2026-05-28

## Confirmed Order

1. Subagent assignment and ownership
2. Operational verification
3. Feature-domain JavaScript split
4. Thin screen/rendering layer
5. CSS hierarchy split

## Current Baseline

- Active branch: `main`
- Synced baseline: `origin/main` at `bbfa428`
- Production alias: `https://gs-safety-checklist.vercel.app`
- Supabase project ref: `yuuroocvxvzgmsdeeiws`

## Completed Gates

- `npm.cmd run verify`: PASS
- `npm.cmd run harness:live`: PASS
- Supabase Security Advisor: `lints: []`
- Anon REST boundary for `safety_pictograms`:
  - metadata columns select: HTTP 200
  - `src` select: HTTP 401 / Postgres code `42501`

## Subagent Deliverables

- `docs/maintenance/verification-gate-report-2026-05-28.md`
- `docs/maintenance/js-domain-map-2026-05-28.md`
- `docs/maintenance/render-boundary-report-2026-05-28.md`
- `docs/maintenance/css-architecture-report-2026-05-28.md`

## Execution Strategy

Do not split `assets/js/app-v2.js` and `assets/css/styles-v2.css` by line range. Split by behavior ownership and preserve current static loading until a build or multi-script loading decision is made.

The first implementation slice should be small, test-backed, and low risk:

1. Add characterization tests for pictogram pure helpers and lazy URL generation.
2. Extract only pictogram constants and pure helpers after tests are green.
3. Leave state-backed pictogram helpers and renderers in `app-v2.js` until `state.pictograms` can be passed explicitly.

## JavaScript Refactor Sequence

### Slice 1 - Pictogram Pure Helpers

Candidate helpers:

- `normalizeIconKey`
- `lineIconName`
- `pictogramLazyImageSrc`
- `lineIcon`
- `statIcon`
- `completionIcon`
- `workVisual`

Keep in `app-v2.js` for now:

- `pictogramAssetSrc`
- `storedPictograms`
- `pictogramLibrary`
- `renderPictogramPicker`
- `setupPictogramImageFallbacks`
- `renderPictogramLibraryManager`

Required verification before/after:

- Add focused tests for lazy image URL generation.
- Add or extend static test coverage that proves metadata-only pull uses `selectColumns`.
- Run `npm.cmd run verify`.
- Run `npm.cmd run harness:live` after any deploy-relevant change.

### Slice 2 - Ship and Equipment Pure Helpers

Candidate helpers:

- `normalizeShipNo`
- `normalizeShipStageInput`
- `effectiveShipStage`
- `shipScheduleStage`
- `compareShipStage`
- `shipSortOptions`
- `shipTypeOptions`

Required first step:

- Add characterization tests because these helpers affect dashboard, ship list, unsafe/material flows, and analytics.

### Slice 3 - Worker Label and Sort Helpers

Candidate helpers:

- `normalizedWorkerName`
- `normalizeWorkerPosition`
- `isLeaderWorker`
- `sortWorkersForLogin`
- `workerRoleBadge`

Keep session-aware worker helpers in `app-v2.js` until login/session ownership is separated.

### High-Risk Areas To Delay

- `sync`, `pullRemote`, `pushRemote`, `persist`, `persistAndSync`
- `auth/admin`, `requireAdminWrite`, `invokeAdminMutation`, admin save/delete handlers
- screen renderers that mutate state or call persistence directly

## Rendering Refactor Sequence

1. Start with leaf pure render helpers and preserve generated text, classes, and `data-*` hooks exactly.
2. Add view-model builders before moving larger screens.
3. Prefer `renderDashboard()` before `renderAnalyticsDashboard()` because dashboard already delegates more cleanly.
4. Keep the central delegated event block unchanged until command handlers are isolated.
5. Move mutation command handlers last.

Highest-risk handlers:

- inspection submit
- unsafe submit
- material submit
- admin record save/delete
- category, section, tool, and pictogram save/delete

## CSS Refactor Sequence

First low-risk candidates:

- `not-found`
- `signature`
- `push-template`
- `monthly-worker`
- `disabled-reason`
- `table`

Delay:

- `:root`
- global element rules
- layout shell
- broad responsive overrides
- utility/state classes used across many components

Preferred future layout:

- `assets/css/00-tokens-base.css`
- `assets/css/10-layout-shell.css`
- `assets/css/20-components.css`
- `assets/css/30-feature-*.css`
- `assets/css/90-utilities-state.css`
- `assets/css/99-responsive.css`

## Required Gaps Before First Code Move

Close these before extracting pictogram code:

1. Characterization tests for `pictogramLazyImageSrc()` behavior.
2. DOM/browser check proving a custom pictogram renders as lazy image and falls back correctly.
3. Edge Function check for `supabase/functions/pictogram-image/index.ts`.
4. Repeat DB grant verification after any migration touching `safety_pictograms`.
5. Regression check that `pullRemote()` uses `config.selectColumns` for `safety_pictograms`.

## Next Action

Completed implementation slices:

1. Pictogram helper slice:
   - Added `assets/js/pictogram-helpers.js`.
   - Added `tests/pictogram-helpers.test.js`.
   - `app-v2.js` delegates `normalizeIconKey`, `pictogramLazyImageSrc`, and `lineIconName`.

2. Ship helper slice:
   - Added `assets/js/ship-helpers.js`.
   - Added `tests/ship-helpers.test.js`.
   - `app-v2.js` delegates ship stage normalization, stage comparison, date comparison, number comparison, and sort mode normalization.

3. Worker helper slice:
   - Added `assets/js/worker-helpers.js`.
   - Added `tests/worker-helpers.test.js`.
   - `app-v2.js` delegates worker name, position, team, login grouping/sorting, leader/admin checks, admin labels, and worker badges.

4. Dashboard view slice:
   - Added `assets/js/dashboard-view.js`.
   - Added `tests/dashboard-view.test.js`.
   - `app-v2.js` delegates `renderDashboard()` markup to `ShipyardDashboardView.renderDashboardView(dashboardModel(), { sectionHeading, navIcon })`.
   - Moved dashboard-only `statPill()` and `statIcon()` out of `app-v2.js`.

5. Not-found CSS slice:
   - Added `assets/css/30-feature-not-found.css`.
   - Moved `.not-found-*` and related `404.html` responsive rules out of `assets/css/styles-v2.css`.
   - `404.html` loads the feature stylesheet after `styles-v2.css` with the current asset token.
   - `sw.js`, `tests/static-recovery.test.js`, and `tools/quality-harness.mjs` now cover the new 404 stylesheet.

6. Signature CSS slice:
   - Added `assets/css/30-feature-signature.css`.
   - Moved `.signature-*` rules out of `assets/css/styles-v2.css`.
   - Main app HTML entrypoints load the signature stylesheet after `styles-v2.css` with the current asset token.
   - `sw.js`, `tests/static-recovery.test.js`, and `tools/quality-harness.mjs` now cover the new signature stylesheet.

7. Disabled reason component CSS slice:
   - Added `assets/css/20-component-disabled-reason.css`.
   - Moved `.disabled-reason-*` helper rules out of `assets/css/styles-v2.css`, including reduced-motion and mobile width overrides.
   - Main app HTML entrypoints load the component stylesheet after the current split CSS files with the current asset token.
   - `sw.js`, `tests/static-recovery.test.js`, and `tools/quality-harness.mjs` now cover the new disabled-reason stylesheet.

8. Push management CSS slice:
   - Added `assets/css/30-feature-push-management.css`.
   - Moved `.push-template-*`, `.push-device-*`, `.push-manager-*`, `.push-target-*`, `.push-style-*`, `.push-preview*`, `.push-token-*`, and `.push-worker-*` management rules out of `assets/css/styles-v2.css`.
   - Kept `.push-employee-*` in `styles-v2.css` because it still belongs to login/session ownership.
   - Main app HTML entrypoints load the push management stylesheet after signature styles and before disabled-reason styles with the current asset token.
   - `sw.js`, `tests/static-recovery.test.js`, and `tools/quality-harness.mjs` now cover the new push management stylesheet.

9. Monthly worker CSS slice:
   - Added `assets/css/30-feature-monthly-worker.css`.
   - Moved `.monthly-worker-*`, `.monthly-rest-*`, and `monthlyMonthPulse` rules out of `assets/css/styles-v2.css`.
   - Moved the monthly worker responsive grid and spacing overrides out of shared mobile media blocks.
   - Main app HTML entrypoints load the monthly worker stylesheet after push management styles and before disabled-reason styles with the current asset token.
   - `sw.js`, `tests/static-recovery.test.js`, and `tools/quality-harness.mjs` now cover the new monthly worker stylesheet.

10. Table component CSS slice:
   - Added `assets/css/20-component-table.css`.
   - Moved generic `.table` base, preview, mobile, and desktop reset rules out of `assets/css/styles-v2.css`.
   - Kept feature-owned table families such as `.material-table-*` and `.analytics-table-*` in `styles-v2.css`.
   - Main app HTML entrypoints load the table component stylesheet after `styles-v2.css` and before feature styles with the current asset token.
   - `sw.js`, `tests/static-recovery.test.js`, and `tools/quality-harness.mjs` now cover the new table component stylesheet.

11. Analytics dashboard model slice:
   - Added `buildAnalyticsDashboardModel()` inside `assets/js/app-v2.js`.
   - Moved `renderAnalyticsDashboard()` data derivation for KPI counts, process rows, risk distribution, weekly average, and recent activity into the model builder.
   - Kept the existing analytics dashboard markup in place for this slice.
   - Updated `tests/dashboard-view.test.js` to enforce that `renderAnalyticsDashboard()` delegates data derivation to the model and no longer reads `state` or workflow constants directly.

12. Analytics dashboard view slice:
   - Added `renderAnalyticsDashboardView(model, deps)` to `assets/js/dashboard-view.js`.
   - Moved analytics dashboard markup for KPI cards, process distribution, risk bars, and recent activity out of `assets/js/app-v2.js`.
   - Kept `renderMonthlyWorkerAnalytics()` in `app-v2.js` for now and pass its rendered HTML into the pure analytics view boundary.
   - Updated `tests/dashboard-view.test.js` and `tests/static-recovery.test.js` to assert the new analytics view ownership and `app-v2.js` delegation boundary.

13. Monthly worker analytics view slice:
   - Added `renderMonthlyWorkerAnalyticsView(model, deps)` to `assets/js/dashboard-view.js`.
   - Moved monthly worker analytics markup helpers for heatmap cells, worker cards, calendar grid, month meta, and rest-day settings out of `assets/js/app-v2.js`.
   - Added `buildMonthlyWorkerAnalyticsModel()` in `app-v2.js` to keep monthly stats, expanded-card state, and rest-day state derivation explicit.
   - Kept monthly worker card toggling, rest-day commands, export, persistence, and other mutation paths in `app-v2.js`.
   - Updated `tests/dashboard-view.test.js` and `tests/static-recovery.test.js` to assert the new monthly worker view ownership and `app-v2.js` delegation boundary.

14. Manage shell view slice:
   - Added `renderManageShellView(model)` to `assets/js/dashboard-view.js`.
   - Moved manage tab shell, read-only notice placement, and active-panel shell markup out of `assets/js/app-v2.js`.
   - Kept manage state selection, tab counts, subpanel rendering, admin checks, and all command handlers in `app-v2.js`.
   - Updated `tests/dashboard-view.test.js` and `tests/static-recovery.test.js` to assert the manage shell view ownership and `app-v2.js` delegation boundary.

15. Unsafe/material record card view slice:
   - Added `renderUnsafeRecordCardView(model)` and `renderMaterialRecordCardView(model)` to `assets/js/dashboard-view.js`.
   - Moved unsafe and material manager record-card shell markup out of `assets/js/app-v2.js`.
   - Kept photo counts, pending upload state, timeline rendering, admin controls, and status command handlers in `app-v2.js`.
   - Updated `tests/dashboard-view.test.js` and `tests/static-recovery.test.js` to assert record-card view ownership and `app-v2.js` delegation boundaries.

16. History load-more view slice:
   - Added `renderHistoryLoadMoreView(model)` to `assets/js/dashboard-view.js`.
   - Moved the history load-more button shell out of `assets/js/app-v2.js`.
   - Kept sync configuration checks, active history filters, and remote list limit logic in `app-v2.js`.
   - Updated `tests/dashboard-view.test.js` and `tests/static-recovery.test.js` to assert history load-more view ownership and delegation.

17. Unsafe detail view slice:
   - Added `renderUnsafeDetailView(model)` and `renderUnsafeDetailPhotoBlock(model)` to `assets/js/dashboard-view.js`.
   - Moved unsafe detail page shell, metadata grid, photo figure shell, memo field, timeline placement, and admin-control placement out of `assets/js/app-v2.js`.
   - Kept photo URL resolution, upload progress/pending panel rendering, timeline rendering, status badge rendering, admin controls, and all mutation handlers in `app-v2.js`.
   - Updated `tests/dashboard-view.test.js` and `tests/static-recovery.test.js` to assert unsafe detail view ownership and delegation.

18. History table view slice:
   - Added `renderHistoryTableView(model)` to `assets/js/dashboard-view.js`.
   - Moved the inspection history card grid and card shell markup out of `assets/js/app-v2.js`.
   - Kept category lookup, risk calculation, selected-history state, dashboard row limiting, and delivery-card rendering in `app-v2.js`.
   - Updated `tests/dashboard-view.test.js` and `tests/static-recovery.test.js` to assert history table view ownership and delegation.

Verification after the ship helper slice:

- `npm.cmd run verify`: PASS
- `npm.cmd run harness`: PASS
- `npm.cmd run harness:live`: PASS
- `node tests/visual-check.js`: PASS after updating the bootstrap and assertions to current login, admin, unsafe/material, and inline-detail flows.

Verification after the worker helper slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS
- `npm.cmd run harness:live`: PASS

Verification after the dashboard view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS
- `npm.cmd run harness:live`: PASS

Verification after the not-found CSS slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Verification after the signature CSS slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Verification after the disabled-reason CSS slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Verification after the push management CSS slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Verification after the monthly worker CSS slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Verification after the table component CSS slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Verification after the analytics dashboard model slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Verification after the analytics dashboard view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Verification after the monthly worker analytics view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Verification after the manage shell view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Verification after the unsafe/material record card view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Verification after the history load-more view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Verification after the unsafe detail view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Verification after the history table view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS with expected local-change/deploy-diff warnings.
- `npm.cmd run harness:live`: PASS with expected local-change/deploy-diff warnings.

Next implementation slice:

1. Treat the first low-risk CSS batch as complete: `not-found`, `signature`, `push-template`, `monthly-worker`, `disabled-reason`, and `table` are now split and test-covered.
2. Priority 3 read-only screen/subpanel boundaries are now covered for the planned first pass: dashboard, analytics, monthly worker analytics, manage shell, unsafe/material record cards, unsafe detail, and history table/load-more.
3. Start priority 4 by splitting event dispatch into action routing helpers without moving persistence.
4. Commit/PR/deploy can happen before the next code split if the current maintenance batch should be stabilized first.
4. Keep browser checks around:
   - home stat labels and values
   - unsafe stat received filter action
   - delivery stat link behavior
   - current icon sizing contract
5. Do not move submit/admin/sync command handlers yet.
