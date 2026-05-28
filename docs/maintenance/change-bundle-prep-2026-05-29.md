# Change Bundle Prep - 2026-05-29

## Scope

This bundle is a maintenance/refactor batch for the static shipyard checklist app.

Primary changes:

- JavaScript helper extraction:
  - `assets/js/pictogram-helpers.js`
  - `assets/js/ship-helpers.js`
  - `assets/js/worker-helpers.js`
  - `assets/js/dashboard-view.js`
- Dashboard rendering boundaries:
  - `renderDashboard()` delegates to `ShipyardDashboardView.renderDashboardView()`.
  - `renderAnalyticsDashboard()` builds a model and delegates analytics markup to `ShipyardDashboardView.renderAnalyticsDashboardView()`.
  - `renderMonthlyWorkerAnalytics()` builds a model and delegates monthly worker analytics markup to `ShipyardDashboardView.renderMonthlyWorkerAnalyticsView()`.
  - `renderManage()` delegates manage tab shell and read-only panel placement to `ShipyardDashboardView.renderManageShellView()`.
  - Unsafe/material manager record cards delegate shell markup to `ShipyardDashboardView.renderUnsafeRecordCardView()` and `ShipyardDashboardView.renderMaterialRecordCardView()`.
  - History load-more button shell delegates to `ShipyardDashboardView.renderHistoryLoadMoreView()`.
  - Unsafe detail full view shell delegates to `ShipyardDashboardView.renderUnsafeDetailView()`.
  - History inspection card grid delegates to `ShipyardDashboardView.renderHistoryTableView()`.
- CSS split batch:
  - `assets/css/30-feature-not-found.css`
  - `assets/css/30-feature-signature.css`
  - `assets/css/30-feature-push-management.css`
  - `assets/css/30-feature-monthly-worker.css`
  - `assets/css/20-component-disabled-reason.css`
  - `assets/css/20-component-table.css`
- Static entrypoints and service worker now load/cache the split JS/CSS files with the current asset token.
- Test coverage was extended for helper modules, dashboard view ownership, static recovery, visual checks, and harness checks.

## Current Git State

- Branch: `main`
- Base: `origin/main`
- Current working tree is intentionally dirty.
- Current status audit: 36 changed entries, 34 intended for this bundle, 2 excluded local notes.
- The bundle includes modified tracked HTML/app assets plus new helper, CSS, test, and maintenance-doc files.
- Unrelated pre-existing untracked notes should be reviewed before staging:
  - `codex-handoff-2026-05-27.md`
  - `supabase-egress-trace-2026-05-28.md`

## Commit Include/Exclude

Include these groups in the maintenance commit:

- Tracked HTML shell updates:
  - `404.html`
  - `analytics.html`
  - `check.html`
  - `history.html`
  - `index.html`
  - `items.html`
  - `manage.html`
  - `materials.html`
  - `pledge.html`
  - `redesign-v2.html`
  - `ships.html`
  - `unsafe.html`
- Tracked app/test/tool updates:
  - `assets/css/styles-v2.css`
  - `assets/js/app-v2.js`
  - `package.json`
  - `sw.js`
  - `tests/static-recovery.test.js`
  - `tests/visual-check.js`
  - `tools/quality-harness.mjs`
- New CSS slices:
  - `assets/css/20-component-disabled-reason.css`
  - `assets/css/20-component-table.css`
  - `assets/css/30-feature-monthly-worker.css`
  - `assets/css/30-feature-not-found.css`
  - `assets/css/30-feature-push-management.css`
  - `assets/css/30-feature-signature.css`
- New JS helper/view modules:
  - `assets/js/dashboard-view.js`
  - `assets/js/pictogram-helpers.js`
  - `assets/js/ship-helpers.js`
  - `assets/js/worker-helpers.js`
- New focused tests:
  - `tests/dashboard-view.test.js`
  - `tests/pictogram-helpers.test.js`
  - `tests/ship-helpers.test.js`
  - `tests/worker-helpers.test.js`
- Maintenance docs:
  - `docs/maintenance/`

Do not include these local notes in this commit:

- `codex-handoff-2026-05-27.md`
- `supabase-egress-trace-2026-05-28.md`

Exact staging command for this bundle:

```powershell
git add -- 404.html analytics.html check.html history.html index.html items.html manage.html materials.html pledge.html redesign-v2.html ships.html unsafe.html assets/css/styles-v2.css assets/css/20-component-disabled-reason.css assets/css/20-component-table.css assets/css/30-feature-monthly-worker.css assets/css/30-feature-not-found.css assets/css/30-feature-push-management.css assets/css/30-feature-signature.css assets/js/app-v2.js assets/js/dashboard-view.js assets/js/pictogram-helpers.js assets/js/ship-helpers.js assets/js/worker-helpers.js package.json sw.js tests/static-recovery.test.js tests/visual-check.js tests/dashboard-view.test.js tests/pictogram-helpers.test.js tests/ship-helpers.test.js tests/worker-helpers.test.js tools/quality-harness.mjs docs/maintenance/
```

## Suggested Commit Shape

Use one PR for the whole maintenance batch. If splitting commits inside that PR, keep the order below:

1. `refactor: extract checklist helper modules`
   - pictogram, ship, worker, dashboard-view JS helpers
   - helper unit tests
2. `refactor: split low-risk css slices`
   - new component/feature CSS files
   - HTML and service-worker asset loading
   - static/harness coverage
3. `refactor: isolate dashboard view rendering`
   - dashboard and analytics view/model boundaries
   - dashboard-view/static/visual test updates
4. `docs: record maintenance roadmap and prep notes`
   - maintenance reports, roadmap, and this prep document

If keeping a single commit, use:

```text
refactor: split helpers, styles, and view shells
```

## Verification Gates

Latest commit-prep verification:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS, 231 checks, failed 0, warnings 2
- `npm.cmd run harness:live`: PASS, 246 checks, failed 0, warnings 2
- `git diff --check`: PASS

The two harness warnings are expected while the worktree is uncommitted and production still differs from the local bundle:

- working tree has local changes
- deploy-relevant files differ from expected commit

`git diff --check` exits 0. Git also reports CRLF normalization notices for some tracked files on this Windows checkout; these are not whitespace-error failures.

Latest verified gates after the analytics dashboard view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS, expected local-change/deploy-diff warnings
- `npm.cmd run harness:live`: PASS, expected local-change/deploy-diff warnings
- `git diff --check`: PASS

Latest verified gates after the monthly worker analytics view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS, expected local-change/deploy-diff warnings
- `npm.cmd run harness:live`: PASS, expected local-change/deploy-diff warnings

Latest verified gates after the manage shell view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS, expected local-change/deploy-diff warnings
- `npm.cmd run harness:live`: PASS, expected local-change/deploy-diff warnings

Latest verified gates after the unsafe/material record card view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS, expected local-change/deploy-diff warnings
- `npm.cmd run harness:live`: PASS, expected local-change/deploy-diff warnings

Latest verified gates after the history load-more view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS, expected local-change/deploy-diff warnings
- `npm.cmd run harness:live`: PASS, expected local-change/deploy-diff warnings

Latest verified gates after the unsafe detail view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS, expected local-change/deploy-diff warnings
- `npm.cmd run harness:live`: PASS, expected local-change/deploy-diff warnings

Latest verified gates after the history table view slice:

- `npm.cmd run verify`: PASS
- `node tests/visual-check.js`: PASS
- `npm.cmd run harness`: PASS, expected local-change/deploy-diff warnings
- `npm.cmd run harness:live`: PASS, expected local-change/deploy-diff warnings

The two harness warnings are expected while the worktree is uncommitted and production still differs from the local bundle:

- working tree has local changes
- deploy-relevant files differ from expected commit

## PR Checklist

- Confirm no unrelated untracked notes are staged unless intentionally included.
- Re-run `npm.cmd run verify`.
- Re-run `node tests/visual-check.js`.
- Re-run `npm.cmd run harness`.
- Re-run `npm.cmd run harness:live`.
- Include the expected harness warnings in the PR description.
- Mention that production deployment should happen after merge or after an explicit production deploy from this exact bundle.

## Deployment Prep

Before production deploy:

1. Ensure the final commit includes all split asset files referenced by HTML and `sw.js`.
2. Confirm `sw.js` cache token remains `gs-safety-20260528-egress-signature-1` unless intentionally bumping cache/version.
3. Confirm `ASSET_TOKEN` expectations in `tools/quality-harness.mjs` match the HTML/SW asset URLs.
4. Deploy only after `harness:live` is green against the target production alias or after intentionally updating the live baseline.

## Next Refactor Direction

Continue with event dispatch boundary work:

- Split event dispatch into action routing helpers before moving command handlers or persistence.
- Keep command handlers, Supabase calls, `persist()`, `persistAndSync()`, `pullRemote()`, and admin mutation calls in `app-v2.js` until routing tests cover the event-to-command boundary.
- Do not move submit/admin/sync/persist command handlers in the next slice.
