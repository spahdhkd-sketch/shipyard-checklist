# Render Boundary Report - 2026-05-28

Scope: read-only analysis of `assets/js/app-v2.js` for Agent C. This report identifies render/event boundaries to make screen layers thinner without changing runtime behavior.

Reference: `docs/maintenance/subagent-workplan-2026-05-28.md` lines 76-93 assign this work to the Rendering and Screen Boundary Owner.

## Summary

- `assets/js/app-v2.js` currently has about 947 detected function-like blocks, including 107 `render*` functions and 143 render/open/close/toggle/setup/handler-style functions.
- The most important boundary is not only `render()` itself. The larger risk is the combination of screen renderers that emit `data-action` hooks plus the central delegated event handlers around lines 8506-9290.
- Render extraction should start with small, read-only HTML helpers. Event and persistence extraction should wait until domain state ownership is documented.

## Screens Most Entangled With Business Logic

1. Admin/manage screens
   - `renderManage()` lines 5957-5993 reads `state.adminMode`, `state.manageTab`, `state.workers`, `state.unsafeIssues`, and `state.missingMaterials`, then fans out to worker, push, unsafe, and material managers.
   - `renderWorkerManager()` lines 5995-6022, `renderPushManager()` lines 6057-6133, `renderUnsafeManager()` lines 6378-6413, `renderMaterialManager()` lines 6587-6643, and `renderPledgeManager()` lines 6739-6818 mix admin state, KPI calculations, queue state, and `data-action` wiring.
   - These screens are strongly coupled because click actions dispatch directly into admin mutations such as `saveWorker()`, `saveAdminRecord()`, reset actions, push actions, and status updates.

2. Checklist/inspection submission flow
   - `renderCheck()` lines 4717-4774 reads draft/category/work-prep state and emits `submit-inspection`.
   - `submitInspection()` lines 9362-9450 builds the inspection record, updates inspection/work-prep state, calls `persist()`, syncs history, and changes view state.
   - This is user-critical, so its renderer should be made thinner only after pure submit-state builders and current UI snapshots are covered.

3. Unsafe issue and missing material flows
   - `renderUnsafeConfirmStep()` lines 5659-5683 emits `submit-unsafe`; `submitUnsafeIssue()` lines 9452-9497 mutates draft/issue/photo state, calls `persist()`, kicks `syncUnsafeIssue()`, and re-renders.
   - `renderMaterialConfirmStep()` lines 5835-5859 emits `submit-material`; `submitMissingMaterial()` lines 9499-9540 mutates material state, calls `persist()`, kicks `syncMissingMaterial()`, and re-renders.
   - These flows are entangled through drafts, route state, local persistence, and async sync side effects.

4. Analytics/dashboard screens
   - `renderDashboard()` lines 3642-3714 is already relatively thin because it delegates to `dashboardModel()`, `statPill()`, and `sectionHeading()`.
   - `renderAnalyticsDashboard()` lines 7210-7325 is heavier: it reads inspections, unsafe issues, materials, ships, sync text, dates, and worker analytics. It is suitable for a view-model boundary before view extraction.

5. Ship/items/admin configuration screens
   - `renderShips()` lines 5113-5169 emits admin actions such as add/import/export/save order/toggle admin and reads ship/admin/search state.
   - `renderItems()` lines 5417-5486 fans out to category, section, item, tool, and pictogram management.
   - `renderSectionManager()` lines 7520-7588, `renderToolManager()` lines 7786-7819, `renderToolCard()` lines 7821-7853, and `renderPictogramLibraryManager()` lines 7855-7880 are UI-heavy but wired to direct admin save/delete handlers.

## First Pure View Helper Candidates

Prioritize helpers that return markup from inputs and have no detected persistence, Supabase, or admin-write dependency.

- `renderWorkerHeatmapCell()` lines 7049-7051
- `renderMonthlyWorkerMonthMeta()` lines 7128-7130
- `renderWorkerPushDeviceManagerLoading()` lines 1714-1717
- `renderWorkerPositionOptions()` lines 6149-6152
- `renderWorkerTeamOptions()` lines 6159-6162
- `renderShipDataDetailRow()` lines 5324-5328
- `renderUnsafeInlineDetail()` lines 6424-6428
- `renderHistoryLoadMore()` lines 4916-4921
- `renderItemToolChips()` lines 7898-7903
- `renderNavButtons()` lines 3414-3420
- `renderLoginWorkerLabel()` lines 3555-3561
- `renderWorkerButton()` lines 3997-4003
- `renderMonthlyWorkerCardColumns()` lines 7120-7126
- `renderCompletionActions()` lines 7469-7475
- `renderShipDataRecent()` lines 5293-5300
- `renderShipFilterNotice()` lines 5330-5337
- `renderUnsafeQueueItem()` lines 6415-6422
- `renderUnsafePhotoSlot()` lines 6474-6481
- `renderPhotoUploadProgressPanel()` lines 6550-6557
- `renderPictogramPicker()` lines 3925-3933

Good next-step pattern: extract these as pure functions that accept explicit data and formatting helpers, then replace call sites one at a time. Avoid changing screen-level render order during the first pass.

## Event Handlers Calling Persistence, Supabase, Or Admin Mutations

Central dispatch and delegated DOM handlers:

- `document.addEventListener("submit", ...)` lines 8506-8517 calls `submitWorkerPushEmployeeNo()` and `submitWorkerLogin()`.
- `document.addEventListener("click", ...)` starts at line 8519 and handles many `data-*` actions directly.
- `dispatchAction()` starts at line 8440 and maps `data-action` values to functions including `submitInspection`, `submitUnsafeIssue`, `submitMissingMaterial`, `toggleAdminMode`, reset actions, history actions, and draft/save actions.
- The delegated click block directly calls mutation candidates around lines 8848-8957, including `saveWorker()`, `saveAdminRecord()`, `deleteAdminRecord()`, `deleteShip()`, `saveTool()`, `deleteTool()`, `savePictogram()`, `deletePictogram()`, `saveCategory()`, `saveCategoryTools()`, `deleteCategory()`, `saveSection()`, `deleteSection()`, `saveChecklistItem()`, and `deleteChecklistItem()`.
- `document.addEventListener("input", ...)` starts at line 9167 and saves draft state with `saveJson()` for inspection, unsafe, material, and pledge-signature inputs.
- `document.addEventListener("change", ...)` starts at line 9241 and updates admin push worker selection, unsafe draft fields, material draft fields, and related saved draft state.

Direct mutation/persistence/admin-write functions:

- `submitInspection()` lines 9362-9450 calls `persist()` and sync/history helpers.
- `submitUnsafeIssue()` lines 9452-9497 calls `persist()` and `syncUnsafeIssue()`.
- `submitMissingMaterial()` lines 9499-9540 calls `persist()` and `syncMissingMaterial()`.
- `saveWorker()` lines 9773-9797 calls `requireAdminWrite()` and `persistAndSync("workers")`.
- `saveAdminRecord()` lines 10673-10720 calls `requireAdminWrite()`, `persist()`, `upsertAdminRows()`, `render()`, and `toast()`.
- `deleteAdminRecord()` lines 10722-10740 calls `requireAdminWrite()`, `persist()`, and remote delete/upsert paths.
- `deleteShip()` lines 10876-10889 calls `requireAdminWrite()`, `deleteRemoteShips()` when sync is configured, then `persist()`.
- `saveCategory()` lines 10949-10971 calls `requireAdminWrite()` and `persistAndSync("categories")`.
- `deleteCategory()` lines 11002-11025 calls `requireAdminWrite()`, `invokeAdminMutation("deleteCategoryCascade")`, and `persist()`.
- `saveSection()` lines 11049-11062 calls `requireAdminWrite()` and `persistAndSync("sections")`.
- `deleteSection()` lines 11064-11085 calls `requireAdminWrite()`, `invokeAdminMutation("deleteSectionCascade")`, and `persist()`.
- `saveTool()` lines 11167-11178 and `deleteTool()` lines 11180-11193 call `persistAndSync()` for tool/category/item state.
- `savePictogram()` lines 11266-11274 and `deletePictogram()` lines 11276-11288 call `persistAndSync()` for pictogram/category state.
- Sync boundary functions include `persistAndSync()` line 11538, `pushRemote()` line 11730, `pullRemote()` line 11855, `upsertTable()` line 11983, and admin RPC/mutation routing through `invokeAdminMutation()` line 11709.

## Recommended Boundary Shape

- Screen renderer: receives a view model and returns markup. It should not read from Supabase, call persistence, or decide admin permission.
- View model builder: reads `state`, derives counts, labels, disabled reasons, visibility, and selected rows.
- Event adapter: converts DOM events and dataset tokens into command objects.
- Command handler: owns mutation, admin checks, persistence, sync, toast, and render invalidation.

Target split for one screen:

1. `build<Screen>ViewModel(state, helpers)`
2. `render<Screen>View(viewModel)`
3. `bind/dispatch<Screen>Action(action, payload)`
4. `handle<Screen>Command(command)` for `persist()`, `persistAndSync()`, Supabase, and admin mutation paths.

## UI Regression Risk-Minimizing Order

1. Start with leaf pure helpers.
   - Extract tiny markup helpers listed above first.
   - Keep generated class names, `data-*` attributes, and text exactly the same.
   - Verify with static render snapshots or DOM text probes, not a visual skim.

2. Add view-model builders for already-stable dashboards.
   - `renderDashboard()` is the safest screen-level candidate because it already delegates to `dashboardModel()`.
   - `renderAnalyticsDashboard()` should be split into `buildAnalyticsDashboardModel()` before moving markup because it mixes multiple domains.

3. Split admin manager renderers after state ownership is documented.
   - For `renderManage()` and manager subviews, extract read-only view models first.
   - Keep the central delegated event block unchanged until command handlers are isolated.

4. Move event dispatch after pure views are stable.
   - Introduce a mapping table for `data-action` and dataset commands.
   - Preserve existing `data-action` strings and dataset names to avoid CSS/test/browser regressions.

5. Extract mutation command handlers last.
   - Functions that call `requireAdminWrite()`, `persist()`, `persistAndSync()`, `invokeAdminMutation()`, `pullRemote()`, or Supabase table helpers should move only after admin mutation boundary tests and regression gates cover the path.
   - Highest-risk handlers: inspection submit, unsafe submit, material submit, admin record save/delete, category/section/tool/pictogram save/delete.

6. Only then thin `render()`.
   - `render()` lines 3037-3075 coordinates route/view rendering, focus preservation, sync status, header/nav, image fallback, signature pad setup, and push subscription refresh.
   - It should become an orchestration shell after individual screens have pure view helpers and command boundaries.

## Practical First PR Slice

- Extract 5-8 tiny helpers from the pure helper list into a view-helper section or module.
- Add a small static assertion that selected helper output still includes the same `data-*` hooks and visible labels.
- Do not touch submit/admin/sync handlers in that first slice.
- Next slice: build a view model for `renderDashboard()` or a single admin subpanel, then keep event dispatch unchanged.
