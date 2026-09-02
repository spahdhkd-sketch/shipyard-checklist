# Current handoff

Updated: 2026-09-02 (Asia/Seoul)

## Release state

- Active branch: `feat/claude-batch`
- Production release source commit: `0c1ae9810ff3f73176399f3ceba1f74c659fade6`
- Release branch: `feat/claude-batch` (pushed to `origin`)
- Production URL: `https://gs-safety-checklist.vercel.app`
- Application version: `1.14.5-20260902-v1`
- Asset token: `20260902-v2-1`
- Production deployment: `dpl_4HvtZxj6Xnuua1og2htDzZXpnvgW` (`READY`, target `production`)
- Deployment URL: `https://index-html-f0h2yhkvv-spahdhkd-3161s-projects.vercel.app`
- The production alias was explicitly assigned to this deployment and resolves to the same deployment ID.
- Cache-bypassed live checks confirmed `1.14.5-20260902-v1` and asset token `20260902-v2-1`. Local and production-alias SHA-256 hashes match for `index.html`, `VERSION.md`, `sw.js`, app, screen views, dashboard, control-map, and the two primary CSS runtimes.
- Fresh production browser checks passed at 1280 x 720 and 390 x 844 with the login entry visible, no horizontal overflow, no version failure, and zero browser log errors. Authenticated administrator behavior was covered by the full hermetic E2E and exact deployed-runtime hash proof; no live work order was created or changed during release QA.
- The generated deployment URL is protected by Vercel SSO for direct HTTP fetches; CLI inspection still resolves both the deployment URL and production alias to the same deployment ID, while the public production alias serves the verified release bytes.

## 2026-09-02 safety operations home dashboard production release

- Replaced the actual legacy administrator home route (`index.html` -> `dashboard` -> `renderDashboard`) with the KPI-first `안전 운영 대시보드`; the standalone proposal artifact was not used as the deployment source.
- Uses existing live work-order, pre-work check, and recent safety-signal records. Work orders without a matched map location remain visible as `장소 미지정`.
- Shows the risk-assessment execution confirmation as unavailable until the product defines a reliable confirmation event and denominator.
- Added the red danger, yellow caution, and green normal pin legend at the control map's top-left corner.
- `npm.cmd run build:assets`, `npm.cmd run verify`, the non-main quality harness, `git diff --check`, full browser E2E, PWA E2E, and the PC/430/390/360 home visual gate passed.
- Live browser checks passed at 1366 x 900 and 390 x 844 with four KPI cards, three legend items, no horizontal overflow, and no page errors.
- This dashboard is included in the current committed and pushed production release recorded above.

## 2026-09-02 dashboard responsive layout production hotfix

- Production deployment `dpl_H1bJK6sxWCQZZmFkciJNJNF7oHkp` now serves the responsive layout hotfix from `https://gs-safety-checklist.vercel.app`.
- At viewport widths up to 1100px, the dashboard KPI cards and primary-work shortcuts now use a 2 x 2 grid instead of retaining the compressed four-column desktop layout.
- Korean KPI and shortcut labels keep words together, and the danger/caution signal units no longer collide inside narrow cards.
- Added an 840px desktop-preview regression in addition to the existing PC, 430, 390, and 360 checks. The 920px horizontal canvas in PC preview mode remains intentional.
- `npm.cmd run build:assets`, `npm.cmd run verify`, the non-main quality harness, `git diff --check`, full browser E2E, PWA E2E, and the home-only design-token visual gate passed.
- Deployment used an audited runtime-only candidate with 346 files. It excluded `docs`, `tests`, `tools`, `supabase`, artifacts, environment files, and patch files; the candidate's seven key runtime hashes matched the source checkout before upload.
- Live QA passed at 840 x 900 and 390 x 844 with two KPI columns, two shortcut columns, the control map and legend visible, and no page errors.

## Supabase state

- Applied the record-retention foundation, safety-setting versions, and durable worker-push delivery idempotency migrations.
- Applied production migration `20260902074214_work_prep_map_classification_20260902`; the source migration is `supabase/migrations/20260902120000_work_prep_map_classification.sql`.
- `admin-mutations` version 20 is ACTIVE with JWT verification enabled.
- `record-retention` version 1 is ACTIVE with JWT verification enabled.
- `worker-push` version 12 is ACTIVE with JWT verification enabled.
- Post-migration advisors reported no new security or performance notice for the changed schema; existing INFO notices remain outside this release scope.

## Verification

- `npm.cmd run build:assets`
- `node --test tests/*.test.js` (82 passed)
- `npm.cmd run verify`
- `npm.cmd run e2e`
- `npm.cmd run e2e:design-tokens`
- `npm.cmd run e2e:pwa`
- `node tools/quality-harness.mjs --skip-verify --allow-non-main`
- `git diff --check`

## 2026-08-31 control-map map-app redesign (local only)

- The real administrator Home control map now uses a map-first, non-overlapping hierarchy: a compact heading and filter row, a large map beside an inline desktop detail panel, and the same map followed by inline details on mobile. Controls and selected-place information no longer sit on top of the map.
- Existing location name banners carry the state signal. Warning and danger locations use a gentle edge pulse instead of adding another pin, with a static reduced-motion fallback.
- A linked order with exactly one deduplicated participant shows the orange `1인 작업` badge. A compatible `inspectionType` or `inspection_type` value of `3중점검` shows the blue `3중점검` badge. No database field or production persistence was added.
- Local browser QA covered the actual Home at PC/430/390/360 widths, including map visibility, the empty-place message, filters, badges, pulse, 44 px controls, and zero horizontal overflow. Current evidence is under `.omo/evidence/design-token/index-{1366,430,390,360}.png`.
- `npm.cmd run build:assets`, `npm.cmd run verify`, the 338-check non-main quality harness, focused control-map tests, the PC/430/390/360 Home visual gate, and `git diff --check` pass. The full E2E functional flow passed before its visual phase; one unrelated existing `390 관리 안전수칙` surface assertion remains outside this change.
- No commit, push, Preview/production deployment, Supabase migration, Edge Function deployment, or production-data mutation was performed.

## 2026-08-29 1.14.3 standard-work merge and control-map presentation release (production)

- The Quick Menu route is now `표준작업지도서/위험성평가 관리`; the risk-assessment surface preserves workbook state and requires a preview plus an explicit merge into the selected target work type. Existing work types can also be previewed and merged while normalized duplicate checklist text is skipped.
- The Home control map now opens in a dedicated presentation window suitable for a second screen. Presentation mode covers the full viewport, hides editing/detail chrome, keeps the map controls required for viewing, and can be closed from the presentation window.
- Administrators can move each location's name banner and leader-line anchor independently. Both coordinates are retained in the map model and included in JSON/PNG export behavior.
- Fresh browser QA confirmed the RA existing-work-type preview (`12` new sections and `16` new items), true 390 px mobile list-to-detail navigation with zero horizontal overflow, 21 editable anchor controls, and a 1366 x 768 full-viewport presentation window.
- `npm.cmd run verify`, the non-main quality harness, full browser E2E, PWA E2E, visual design-token E2E, and `git diff --check` passed before deployment. The deployment excludes local Playwright evidence, patch inputs, project documentation, and other preserved artifacts through `.vercelignore`.
- No Supabase migration, Edge Function deployment, production-data mutation, commit, or push was performed for this release.

## 2026-08-29 1.14.2 label-free fullscreen realtime-map release (production)

- Removed the visible A-U alphabet badges from all 21 dock and quay pins, selection details, and accessible pin labels. The alphabet aliases remain internal so existing work-order place IDs still resolve to the correct pin.
- Added a desktop-only map fullscreen control. Fullscreen mode keeps only the map and exit control visible; the existing touch pan and zoom behavior remains available on mobile without exposing the desktop control.
- Administrator pin moves and source-map edits now propagate immediately to other open tabs on the same browser and origin through `BroadcastChannel`, `localStorage`, and the shared IndexedDB map source. Existing Supabase Realtime work-order updates continue to refresh operational pin status across connected devices.
- Production manual QA confirmed 21 pins, zero visible alphabet badges, map-only fullscreen entry and exit, cross-tab pin movement, editor paint and undo, mobile touch movement without page overflow, latest-intake routing, and no control map for worker roles. No page errors were reported.
- No Supabase migration, Edge Function deployment, or production-data mutation was made for this release.

## 2026-08-29 standard-work/risk-assessment management and merge flow (production in 1.14.3)

- The visible duplicate `빠른 메뉴 / 필요한 업무로 바로 이동합니다` header is removed from the Quick Menu surface while a screen-reader-only page title preserves the accessibility contract.
- The `items` route is now named `표준작업지도서/위험성평가 관리` in the shared navigation model, legacy fallback, and accessible page-title fallback.
- The risk-assessment widget shell now lives outside the repeatedly replaced `#page` region. Upload results, checklist edits, and check states survive work-type selection and background app renders until the administrator explicitly closes the tool or leaves the surface.
- Opening the import surface captures the currently selected work type as the merge target. RA workbook results and a separately selected existing work type each show a merge preview and require an explicit `현재 작업 유형에 병합` action.
- Merge planning preserves existing sections and items, reuses sections with the same normalized title, and skips duplicate checklist text across the target work type. Existing-work-type imports preserve risk, required, tool, and visibility metadata without reusing source IDs.
- Desktop 1366 px and true mobile 390 px browser checks merged one new section and one new item from an existing work type while skipping one duplicate. `_sample_ra.xlsx` produced seven new sections and 41 new items; both widths saved 42 unique target items with no horizontal overflow and returned to the target's section tab.
- The full hermetic browser E2E suite passes. `npm.cmd run build:assets`, `npm.cmd run verify`, the non-main quality harness, focused regression tests, and `git diff --check` pass.
- This change is included in production deployment `dpl_8Pz7QuaV41kn1HvUwwzwZL3E97h4` with application version `1.14.3-20260829-v1` and asset token `20260829-v8-1`. No commit, push, Supabase change, Edge Function deployment, or production-data mutation was performed.

## 2026-08-29 1.14.1 21-zone control-map and latest-intake release (production)

- The complete Home control-map and latest-intake change is committed and pushed as `209397a685d1a5dd76445c70fbd3e80fe84a1223` on `feat/claude-batch`.
- The Home screen now draws a label-free white map base on a 4096 x 3072 canvas, fits the whole map by default, keeps one touch-pannable and zoomable mobile surface, and renders 21 compact A-U zone banners with leader lines.
- Work-order location matching accepts `placeId`, `place_id`, `locationId`, `location_id`, and location object/text aliases. Production work orders without one of these fields remain under `장소 미지정` until the upstream work-order data path supplies a location ID.
- Administrators can reposition zone banners, and the browser remembers coordinates in `shipyardSafetyV1.controlMapPinPositions.v1`. The browser-local source editor supports paint, white eraser, undo/redo, replacement images, and PNG/JSON export without uploading the edited map.
- The control map appears only for administrators as the first Home row above the 2 x 2 KPI grid. Preceding and following worker sessions retain the KPI dashboard without any map surface.
- The Home `접수 처리` action selects the newest non-deleted record across unsafe factors and missing materials, then opens the exact category and detail ID. Production synthetic QA resolved the newer material record to `/manage.html?tab=materials&detailId=material-newest`.
- Desktop and true 390 px mobile production checks confirmed 21 zones, M-5 place-ID matching, editor controls, touch pan/zoom, no page-level horizontal overflow, map-before-KPI ordering, worker map hiding, and zero page errors.
- No Supabase migration, cutover, Edge Function deployment, or production data mutation was performed for this release.

## 2026-08-29 mobile Management master-detail (production)

- Mobile Management now follows the Quick Menu Work Type Management structure: a six-row management menu opens the selected area as a full-screen workspace, and Work Orders keeps its nested full-screen record detail.
- The first Back action returns a Work Order detail to the Work Orders list; the second returns the list to the Management menu. Desktop underline tabs and the existing desktop list-detail workspace are unchanged.
- Hermetic browser checks passed at 430, 390, and 360 px with no horizontal overflow, undersized controls, or exposed bottom navigation while either mobile workspace is open. Focused worker deletion, cached read-only navigation, and Work Order status/delete scenarios also pass with the new hierarchy.
- Evidence is under `artifacts/mobile-design/`. `npm.cmd run build:assets`, `npm.cmd run verify`, the non-main quality harness, full browser E2E, the full responsive design-token suite, and `git diff --check` pass.
- This mobile Management change is part of production release `1.14.0-20260829-v1` at the deployment listed above. No Git push was performed in this task.

## 2026-08-29 work-order status production correction

- Management Work Orders no longer exposes the `+ 신규 등록` action. The five existing status values remain available: `확정`, `점검 대기`, `작업지시`, `미등록`, and `점검 완료`.
- The frontend persists status changes through the dedicated authenticated `updateWorkPrepStatus` mutation. `admin-mutations` version 18 adds the missing dispatcher and updates only the authoritative status, status history, and timestamp.
- A non-mutating production probe reached the deployed action and returned `admin_session_required` instead of the former `unknown_action`, proving the production dispatcher recognizes the action without changing a work-order row.
- The production alias was explicitly moved to `dpl_3TMBtVYsDFjrq6R3B3qgTWr25Tyv`; cache-bypassed version markers and JavaScript hashes match the local deploy artifacts.
- The logged-in production Management screen showed the Work Orders list with no new-registration action and exposed all five status choices across the existing status controls. No live work-order status was changed during verification.
- `npm.cmd run verify`, `npm.cmd run build:assets`, the non-main quality harness, the focused Work Orders browser E2E, PWA E2E, and `git diff --check` passed. Full E2E retained the four pre-existing Safety Pledge design-token failures at PC, 430 px, 390 px, and 360 px; all Work Orders scenarios passed.
- No commit or push was performed. Existing unrelated tracked and untracked work remains preserved.

## v1.13.2 work-order delete wording correction

- Registered work-order cards route their destructive control through the canonical authenticated archive action, but every user-facing control, accessibility label, confirmation, permission error, and completion message now says `삭제`.
- The server boundary continues to use soft-delete semantics so the field wording is clear without weakening the data-safety boundary.
- The release includes the previously verified `453ea37` and `c0df61c` pre-login synchronization restrictions from `feat/claude-batch`.
- Hermetic browser coverage confirms delete confirmation, local record removal, deletion tombstone storage, and card disappearance.
- The responsive visual harness now preloads the requested Management tab through the test URL so accumulated full-suite state cannot reset the Safety Settings surface during viewport checks.
- Release gates passed: `npm.cmd run build:assets`, `npm.cmd run verify`, the 335-check quality harness, full browser E2E, the 48-surface responsive visual gate, PWA E2E, and `git diff --check`.
- Vercel Preview deployment `dpl_6AjTFnmhZUvhvxsK2Mc7SNBUPaWJ` reported `READY` for exact Git SHA `6cecb51cd0d52d37d811bac000946676c9d7ee82` before production promotion.
- Production deployment `dpl_EgG33De81KBMr7qfiqUAwvyHmug9` is `READY`, targets production, and the `gs-safety-checklist.vercel.app` alias was explicitly assigned to it.
- A fresh anonymous production browser observed only `workers_public`, `safety_categories`, `safety_sections`, `safety_items`, `safety_tools`, and `safety_pictograms`; no operational record table was requested.
- A 390 px production browser rendered the synthetic work-order `삭제` control, `작업지시서 삭제` accessibility label, and `삭제할까요?` confirmation copy. The dialog was dismissed, so no live production row was changed.

## v4 responsive operations release

- The approved v4 visual direction is deployed to the Home `오늘의 안전 운영` screen and the related operational routes.
- Home uses live inspection, unsafe issue, missing material, work-order, sync, and application-version data; no demo metrics are used.
- Mobile Home keeps a 2×2 action grid at 360, 390, and 430 px and uses a compact Home-only header so every action and the separated management entry remain above the bottom navigation.
- The Home cleanup removes the redundant eyebrow, category pills, tinted icon tiles, and sync-status halo while preserving the approved 2×2 layout.
- The same v4 direction is now applied locally to Safety Pledge: the operational flow remains `대상 확인 → 알림 검토 → 완료 추적`, KPI values use one 2×2 surface, desktop pairs the action list with the live safety-rule preview, and mobile omits empty row fields.
- Analytics now follows the approved `오늘의 안전 브리핑` direction: one data context, actual-count priority rows first, a token-driven recent-signal distribution, one shared 2×2 KPI surface, compact process indicators, and an explicitly expandable monthly worker section.
- Analytics shows an unknown pending count as `—`, uses a neutral ring when the recent-signal total is zero, and keeps loading/error/empty data from appearing as plausible metrics.
- Management now follows the approved compact operations-console direction: a flat data context followed immediately by underline tabs, a desktop list-detail-history workspace, an isolated danger boundary, and no duplicate live-count shortcut cards or decorative action copy.
- Management preserves read-only and stale/offline guards. At 360–430 px it uses sticky horizontal tabs, a two-filter Work Order row, compact list cards, full-screen selected-record detail, collapsed history/danger panels, a hidden bottom navigation while detail is open, and list-focus restoration after returning.
- Fresh Home, Pledge, Analytics, and Management evidence is under `.omo/evidence/design-token/{index,pledge,analytics,manage}-{1366,430,390,360}.png`; management detail evidence is under `manage-detail-{430,390,360}.png`. The responsive token gate passes at all four widths.
- Work Preparation Inspection now uses the approved field-operation flow: one ordered three-step header, a full-width desktop shell, a separate writing/status workspace, a one-column tablet/mobile flow, and no duplicated English `STEP` kicker. Existing category, tool, high-risk, signature, offline queue, and submit behavior is unchanged.
- The inspection route now enforces 44 px targets for registration, date navigation, record deletion, and inspection start controls. The real browser scenario completes work-prep selection, tool confirmation, checklist/signature entry, submission, local completion, and server-sync presentation.
- Fresh Work Preparation Inspection evidence is under `.omo/evidence/design-token/check-{1366,430,390,360}.png`; the responsive gate passes at all four widths with no horizontal overflow or undersized controls.
- Ships now uses the approved dense master-detail layout with real search, sorting, paging, process/date controls, related-record navigation, and mobile list-to-full-screen detail behavior.
- Inspection History now uses a compact search/date/ship/type/result workspace with real read-only detail loading. Quick Menu now renders permission-filtered real routes and keeps the existing `data-view` navigation contract.
- Unsafe Issues and Missing Materials now use the v4 list-detail/timeline surfaces where the existing persistence contract supports them. Unsafe registration keeps the existing saved fields until severity, exact location, immediate action, assignee, and due-date storage are added server-side.
- Management worker/device, work-order, push, safety-rule, and retention surfaces now default to read-oriented workflows. Push uses the existing authenticated sender through a four-step confirmation flow; safety publishing/rollback and generic retention mutations remain read-only because their production controller contracts are not present.
- Login and completion screens use the v4 auxiliary surface. Completion continues to expose separate device-save and server-sync states and keeps the mobile bottom navigation hidden.
- Browser regression caught and fixed two integration defects: stale/offline management content had disabled its own mobile Back control, and the History admin toggle was below the 44 px touch minimum.
- The Home `작업지시 보기` shortcut now reaches Management instead of being consumed on Home. Ships, History, and Management mobile details now share browser-history-aware Back behavior; Work Orders also receive the mobile full-screen state so their dedicated list-return control renders correctly.
- Fresh responsive evidence covers Home, Work Preparation Inspection, Safety Pledge, Analytics, Management, Ships, Inspection History, Quick Menu, Management Unsafe Issues, Management Missing Materials, Management Push, and Management Safety Rules at 1366, 430, 390, and 360 px under `.omo/evidence/design-token/`.
- After the full v4 integration, all 59 test files (82 tests), `npm run verify`, the non-main quality harness, hermetic browser E2E, the 48-surface responsive visual gate, PWA E2E, and `git diff --check` pass.
- Commit `804f51e37038703e74623173730051f7e21404b3` is pushed to `origin/feat/claude-batch`, its Vercel Preview passed the mobile work-order flow, and the same exact commit is deployed to the production alias.
- Production browser verification passed the 430 px Home → Work Orders → full-screen detail → list-return flow and all five bottom navigation routes.

## 2026-08-28 approved mobile layout simplification (production)

- Removed the duplicate four-card Management shortcut section so the tabbed workspace begins directly after the data context.
- Work Orders now keeps `전체 호선` and `전체 상태` as the two always-visible mobile filters, hides desktop KPI/sidebar chrome, compresses list rows, and uses the existing full-screen detail transition. The visible Work Order list-return button owns the Back action and receives focus after every relevant rerender.
- Inspection History keeps search visible and moves the remaining filters into one expandable mobile panel with applied-filter chips. Ships keeps search/sort visible and collapses import/export/order tools plus the add form. Change History and Danger Zone are collapsed on mobile. Analytics no longer renders the duplicate filter-opening card, and Materials exposes bulk status change only after a row is selected.
- Desktop list-detail behavior and navigation remain intact. Mobile horizontal overflow, bottom-navigation clearance, 44 px control sizing, detail focus/return focus, and the 48 responsive surfaces are covered at 1366, 430, 390, and 360 px.
- Evidence is under `artifacts/mobile-layout-qa/` and `.omo/evidence/design-token/`. `npm run build:assets`, the focused view/static tests, `npm run verify`, the 335-check non-main quality harness, `npm run e2e:design-tokens`, and the full hermetic `npm run e2e` pass.
- Production browser QA confirmed route-specific PC navigation for Ships, Safety Pledge, Analytics, and Management; the 390 px Management surface keeps the mobile `더보기` parent active, defaults Work Order filters to `전체 호선` and `전체 상태`, has no horizontal overflow, and exposes `H3600 작업지시서 삭제` without the previous `보관` accessibility wording.
- The final v3 working tree was deployed as `dpl_6mu38Pf2jcsjoNvYV6dBZEmqvFEJ`. No commit, push, Preview deployment, or Supabase production mutation was performed; unrelated tracked and untracked work remains preserved.

## Pre-login remote pull restriction

- Commits `453ea37` and `c0df61c` on `feat/claude-batch`, now included in production application commit `6cecb51cd0d52d37d811bac000946676c9d7ee82`.
- Measured against production v1.13.0 on 2026-08-26: an anonymous visit with no auth session issued 17 Supabase REST requests and stored workers, inspections, unsafe issues, missing materials, work preparation records and ships in local storage.
- `453ea37` gated only the boot `pullRemote` call. **That was not sufficient.** A clean-origin measurement still showed 116 requests covering every record table, because `startRemoteSync()` (realtime subscription, deletion channel, polling fallback), `handleSyncWake()`, `reconcileDeletedInspectionRows()` and `reconcileRemoteIds()` all query outside the `pullRemote` key filter.
- `c0df61c` defers the whole remote sync until a worker session exists: boot starts sync only when logged in, `submitWorkerLogin` starts it, `logoutWorker` calls the new `stopRemoteSync()`, `handleSyncWake` only reconnects when logged in, and `pullRemote` applies `allowedKeys` to both the table filter and the reconcile steps.
- Verified on a clean origin (`http://127.0.0.1:4173`, empty local storage, login screen shown, no worker session): only `workers_public`, `safety_categories`, `safety_sections`, `safety_items`, `safety_tools` and `safety_pictograms` are fetched. Every record table is absent. Requests drop from 116 to 73.
- Reads remain anon-level in PostgREST. Anonymous SELECT on the record tables is unchanged. This removes the pre-login fetches and is not a substitute for row level security.
- Gates at `c0df61c`: 82/82 tests, `npm run verify`, `npm run build:assets`, the non-main quality harness, `npm run e2e`, `npm run e2e:design-tokens`, `npm run e2e:pwa`, and `git diff --check`.

### Observations recorded while making this change

- The allowed tables are still each pulled about 12 times during startup and then settle. The same repetition exists on the previous code (9 times per table across all 13 tables), so it predates this change, but it is worth its own investigation as an egress cost.
- `e2e:design-tokens` failed the `360 관리` focus-restoration assertion on 2 of 6 runs with this change and 0 of 2 runs on the previous commit. The failing assertion is `returned.focusRestored` with `activeElement: BODY`, which is the already-open item in this document. The sample is too small to attribute the flake to this change, but the change does move record loading later, which affects the same re-render race.
- Editing note: rewriting `assets/js/app-v2.js` with an editor that replaces the whole file, and `git stash pop` under `core.autocrlf`, both convert it from LF to CRLF. `.gitattributes` uses `text=auto`, so the conversion produces no visible `git diff` but breaks source-fragment tests that match `},
`. Check line endings after either operation.

## Preserved local inputs

The following patch inputs remain untracked and were not included in commits or deployments:

- `01-touch-targets.patch`
- `02-history-risk-badge.patch`
- `03-manage-mobile.patch`
- `widget-integration-plan.html` (standalone visual plan; not referenced by the production app)

Current comparison result: all three fail both forward and reverse `git apply --check` against the integrated worktree. `01` is superseded by the token and responsive touch-target work, `02` is partially represented by the retained risk badge while its abandoned empty-section behavior remains excluded, and `03` is superseded by the current management center/mobile detail implementation. Do not apply these patches directly.

## Remaining verification boundary

- No live push notification was sent during release verification. Function deployment, JWT enforcement, database authorization, and idempotency contracts were verified, but a controlled device receipt still requires an explicitly approved test recipient and send.
- No pull request was created or merged. Production currently corresponds to the feature-branch application release commit above.
- `docs/project/PROJECT_BRIEF.md` was restored on 2026-08-27 from the consolidated historical brief and revalidated against the current repository structure, release record, and GitHub branch state.
- The pre-login request restriction was verified against production in a fresh browser after deployment; no operational record table was requested before login.
- Work Preparation Inspection Step 2 and Step 3 were re-verified in the hermetic full browser E2E after the synchronization change.
- No live production work-order deletion was executed during release verification; the deployed UI and exact asset hash were checked without mutating production data.
- Supabase Realtime WebSocket connections were observed failing repeatedly against production v1.13.0, both before and after worker login. The cursor-based polling fallback is healthy and all 11 tables report successful pulls. Whether the failure reproduces outside the observing browser environment is unconfirmed.

## 2026-09-02 work-prep map classification production release

- Production branch `feat/claude-batch` carries work-order `place_id` / `site_survey_done`, work-type `requires_triple_inspection` / `is_non_routine`, and worker `is_foreign` support across the legacy UI, remote adapters, and admin mutation boundary.
- The Home control map classifies red as eligible triple-inspection work, yellow as a one-person assignment (including one foreign worker), green as all assigned workers having completed their pre-work inspections, and gray as ordinary incomplete work.
- Clicking map background outside a dock or quay clears the selected location and renders the explicit `선택 안 함` detail state. Work-type cards and their editor expose `3중점검` and `비일상작업` classifications.
- Migration `supabase/migrations/20260902120000_work_prep_map_classification.sql` was applied to production as migration `20260902074214_work_prep_map_classification_20260902`. It adds the work-order place and administrator-confirmed site-survey fields together with the map classifications. Existing work orders still require a controlled `place_id` backfill before they can appear on the map.
- Release commits were pushed, `admin-mutations` version 20 was deployed with JWT verification enabled, and Vercel deployment `dpl_4HvtZxj6Xnuua1og2htDzZXpnvgW` was assigned to the production alias.
- Current-source verification passed: `npm.cmd run verify`, `npm.cmd run build:assets`, `npm.cmd run e2e`, `node tools/quality-harness.mjs --skip-verify --allow-non-main`, and `git diff --check`. The quality harness retained only the expected dirty-worktree and HEAD-difference warnings.
- Manual desktop and 390 px mobile QA artifacts are under `output/playwright/`, including the four pin states, the upper-left legend, background deselection, the 22-option place selector, and work-type classification badges.
- The operational badges now reuse the control-map legend palette: triple-inspection and non-routine are red, solo and foreign-worker classification are yellow, and completed work is green. The administrator worker list foreign badge resolves to the same yellow border `#f3a53a` and surface `#fff2df` used by the legend.
- `place_id` belongs only to `work_prep_records` (work orders), never to the worker master. Worker creation adds only `is_foreign`. The administrator Work Orders surface owns the new place selector, while worker login, pledge, work-order selection, work-order cards, and the existing non-admin work-order flow retain the current production layout and store an unspecified place as `null`.
- `site_survey_done` also belongs only to `work_prep_records`. The administrator Work Orders form owns the checkbox; public direct writes cannot change it, and non-admin work-order mutations preserve the existing value.
- Administrator work-order issuance is blocked until both a registered dock/quay and `현장 사전 답사 완료` are selected. Only the unchecked site-survey field shows an inline warning; the location field uses a required marker and disabled issue action without an extra warning popup.
- Administrator work-order cards/details and the inspection-history linked work-order card display both the saved location and the site-survey state. The status timeline remains limited to registration, start, and completion milestones.
- Worker normalization now preserves `isForeign` / `is_foreign` after local or remote reload so the administrator classification badge and yellow map rule remain stable across rerenders.
- Final fresh-browser evidence includes `output/playwright/admin-map-badges-aligned.png`, `worker-screen-existing-layout.png`, `worker-registration-existing-layout.png`, `admin-work-order-place-field.png`, and `admin-worker-foreign-classification-final.png`.
- Production schema verification confirmed all five columns, the site-survey trigger, both work-type constraints, both work-prep RLS policies, and the `security_invoker` worker view. All 283 existing work orders were preserved and remain unclassified until an administrator assigns a place and confirms the survey.
