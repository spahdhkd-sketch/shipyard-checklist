# Current handoff

Updated: 2026-08-26 (Asia/Seoul)

## Release state

- Active branch: `feat/claude-batch`
- Application release commit: `804f51e37038703e74623173730051f7e21404b3`
- Production URL: `https://gs-safety-checklist.vercel.app`
- Application version: `1.13.0-20260826-v4`
- Asset token: `20260826-v4-1`
- GitHub branch contains the application release commit; its newer branch head only adds release handoff documentation.
- Production HTML, service worker, version record, minified JavaScript, and minified CSS were fetched after alias promotion and matched the release worktree.

## Supabase state

- Applied the record-retention foundation, safety-setting versions, and durable worker-push delivery idempotency migrations.
- `admin-mutations` version 17 is ACTIVE with JWT verification enabled.
- `record-retention` version 1 is ACTIVE with JWT verification enabled.
- `worker-push` version 12 is ACTIVE with JWT verification enabled.
- Post-migration security and performance advisor checks reported no notices.

## Verification

- `npm.cmd run build:assets`
- `node --test tests/*.test.js` (82 passed)
- `npm.cmd run verify`
- `npm.cmd run e2e`
- `npm.cmd run e2e:design-tokens`
- `npm.cmd run e2e:pwa`
- `node tools/quality-harness.mjs --skip-verify --allow-non-main`
- `git diff --check`

## v4 responsive operations release

- The approved v4 visual direction is deployed to the Home `오늘의 안전 운영` screen and the related operational routes.
- Home uses live inspection, unsafe issue, missing material, work-order, sync, and application-version data; no demo metrics are used.
- Mobile Home keeps a 2×2 action grid at 360, 390, and 430 px and uses a compact Home-only header so every action and the separated management entry remain above the bottom navigation.
- The Home cleanup removes the redundant eyebrow, category pills, tinted icon tiles, and sync-status halo while preserving the approved 2×2 layout.
- The same v4 direction is now applied locally to Safety Pledge: the operational flow remains `대상 확인 → 알림 검토 → 완료 추적`, KPI values use one 2×2 surface, desktop pairs the action list with the live safety-rule preview, and mobile omits empty row fields.
- Analytics now follows the approved `오늘의 안전 브리핑` direction: one data context, actual-count priority rows first, a token-driven recent-signal distribution, one shared 2×2 KPI surface, compact process indicators, and an explicitly expandable monthly worker section.
- Analytics shows an unknown pending count as `—`, uses a neutral ring when the recent-signal total is zero, and keeps loading/error/empty data from appearing as plausible metrics.
- Management now follows the approved compact operations-console direction: a flat data context, four concise live-count shortcuts, underline tabs, a desktop list-detail-history workspace, an isolated danger boundary, and no repeated section kickers or decorative action copy.
- Management preserves read-only and stale/offline guards. At 360–430 px it keeps the 2×2 shortcut grid and opens a selected record as a full-screen detail, hides the bottom navigation, and restores focus to the originating list record after returning.
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

## Pre-login remote pull restriction

- Commits `453ea37` and `c0df61c` on `feat/claude-batch`. Not deployed to Preview or production.
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
- `docs/project/PROJECT_BRIEF.md` is absent from this recovery checkout and should be restored separately if it exists in the canonical project history.
- The hermetic browser E2E blocks live Supabase requests, so the pre-login request reduction in `453ea37` is covered only by static and unit assertions. Counting the actual anonymous requests requires a Preview deployment and a private browsing window.
- Work Preparation Inspection Step 2 and Step 3 were not re-verified after `453ea37`.
- Supabase Realtime WebSocket connections were observed failing repeatedly against production v1.13.0, both before and after worker login. The cursor-based polling fallback is healthy and all 11 tables report successful pulls. Whether the failure reproduces outside the observing browser environment is unconfirmed.
