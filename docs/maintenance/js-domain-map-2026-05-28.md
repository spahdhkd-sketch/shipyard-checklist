# JavaScript Domain Map - Agent B - 2026-05-28

Scope: read-only map for `assets/js/app-v2.js`. This file is an extraction guide only; it does not change runtime behavior.

## Current Shape

- `assets/js/app-v2.js` is still a single runtime bundle around one large `state` object declared near `state = { ... }`.
- Existing extracted rule modules already exist:
  - `assets/js/checklist-rules.js` via `window.ChecklistRules`
  - `assets/js/issue-material-rules.js` via `window.IssueMaterialRules`
- Main shared-state keys crossing domains include `categories`, `sections`, `items`, `tools`, `pictograms`, `ships`, `inspections`, `inspectionItems`, `workers`, `unsafeIssues`, `missingMaterials`, `issuePhotos`, `pendingPhotoUploads`, route/filter keys, sync keys, admin/session keys, push keys, and draft keys.
- Automated static scan found 569 `function` declarations. The workplan's higher count likely includes arrow helpers and callbacks, so treat this as a conservative map, not a complete symbol index.

## Domain Function Candidates

### sync

Candidate extraction area: remote table IO, local persistence, sync queue, realtime refresh, and storage compaction.

- `supabaseClient`, `invokeAdminMutation`
- `persist`, `persistAndSync`, `pushRemote`, `pullRemote`
- `syncInspectionHistory`, `syncMobileHeaderState`
- `startRemoteRealtime`, `stopRemotePolling`, `scheduleRemoteRefresh`, `handleStorageSyncWake`
- `selectTable`, `upsertTable`, `deleteRemoteRows`, `deleteRemoteShips`, `deleteRemoteHistory`
- `applyRemoteTableRows`, `authoritativeRemoteRows`, `upsertAdminRows`
- `estimateLocalStorageKb`, `shouldWarnStorage`, `compactStoragePayloadsIfNeeded`
- `loadJson`, `saveJson`, `storeKey`
- Push-sync adjacent: `savePushSubscriptionState`, `savePushSubscriptionStatus`, `saveWorkerPushSubscriptionStatuses`, `saveWorkerPushDevice`, `deleteWorkerPushDevice`

Keep most of this in `app-v2.js` until a `state` adapter and Supabase client adapter exist. The safest sync extraction is metadata constants plus pure row normalization, not network calls.

### auth/admin

Candidate extraction area: admin mode/session, worker login, admin-only mutation boundaries, and admin push notification controls.

- `loadAdminModule`, `adminToggleButton`, `renderAdminRecordControls`
- `updateDesktopWorkerSession`, `currentWorkerSessionWorker`, `currentWorkerSessionLabel`
- `renderLogin`, `renderLoginWorkerLabel`, `renderLoginWorkerPicker`, `logoutButton`, `sortWorkersForLogin`
- `sendAdminPush`, `toggleAdminPushWorker`, `setAdminPushStyle`, `updateAdminPushDraftField`
- `createAdminPushDraft`, `adminPushNotificationPreview`, `adminPushWorkers`, `adminPushTargetWorkers`, `adminPushSubscribedWorkers`
- `normalizeAdminPushWorkerIds`, `normalizePushTemplate`, `pushTemplateMeta`
- `ensureBrowserNotificationPermission`, `registerWorkerPushNotifications`, `updatePushRegistrationControls`, `submitWorkerPushEmployeeNo`
- Boundary helpers: `upsertAdminRows`, `authoritativeRemoteRows`, `invokeAdminMutation`

Do not extract permission-changing code before `tests/admin-mutation-boundary-static.test.js` explicitly protects the moved API surface.

### pictograms

Candidate extraction area: built-in pictogram metadata, icon key normalization, asset URL derivation, and lazy image fallback behavior.

- Constants/data: `PICTOGRAMS`, `PICTOGRAM_ASSETS`, `BUILT_IN_PICTOGRAMS`, `PICTOGRAM_IMAGE_BUCKET`, `PICTOGRAM_IMAGE_MAX_BYTES`, `PICTOGRAM_IMAGE_MIME_TYPES`, `PICTOGRAM_IMAGE_ACCEPT`
- Pure or mostly pure helpers: `normalizeIconKey`, `lineIconName`, `pictogramLazyImageSrc`, `lineIcon`, `statIcon`, `completionIcon`, `workVisual`
- State-backed helpers: `pictogramAssetSrc`, `storedPictograms`, `pictogramLibrary`
- UI/renderers: `renderPictogramPicker`, `setupPictogramImageFallbacks`, `renderPictogramLibraryManager`

Best first pictogram slice: constants plus `normalizeIconKey`, `lineIconName`, `pictogramLazyImageSrc`, `lineIcon`, `statIcon`, `completionIcon`, and `workVisual`. Leave `pictogramAssetSrc`, `storedPictograms`, and library manager rendering until `state.pictograms` is injected.

### checklist

Candidate extraction area: checklist item visibility, draft creation, inspection flow, pledge/work-prep, and inspection record display.

- Already extracted rules: `sanitizeToolIds`, `normalizeToolNature`, `normalizeVisibilityCondition`, `toolMatchesCategoryNature`, `visibleConditionsForTools`, `itemMatchesSelectedTools`, `filterChecklistItems`
- Draft/model helpers: `createDraft`, `createWorkPrepDraft`, `createFreshWorkPrepRegistrationDraft`, `inspectionWorkPrepWorkerId`, `workPrepRecordForInspection`
- Flow/renderers: `renderCheck`, `renderChecklistSections`, `renderSafetyPledgeChecklist`, `renderInspectionRecord`, `renderInspectionRecordSections`
- Work-prep: `openWorkPrepRegister`, `startCheckFromWorkPrepRecord`, `renderWorkPrepRegister`, `renderDirectCheckSection`, `renderInspectionWorkPrepMiniCard`, `renderWorkPrepCard`, `renderWorkPrepDateSection`
- History/detail: `loadInspectionItemsForDetail`, `syncInspectionHistory`, `workerDayInspectionStatus`, `monthlyWorkerInspectionStats`
- Admin checklist management: `renderSectionManager`, `renderCategoryEditPanel`, `migrateOldChecklists`, `sectionsFor`

The pure rules module is the safest checklist boundary. Flow/render functions should stay until draft state, route state, and renderer dependencies are injectable.

### issue-materials

Candidate extraction area: unsafe issue registration, missing material registration, timeline/status rules, filtering, grouping, and manager screens.

- Already extracted rules: `compactText`, `compareText`, `compareDateDesc`, `statusIndex`, `normalizeTimelineEntry`, `uniqueTimelineEntries`, `buildRecordTimeline`, `appendStatusHistoryEntry`, `createWorkerSnapshot`, `validateUnsafeDraft`, `validateMaterialDraft`, `filterRecords`, `sortRecords`, `groupUnsafeByStatus`, `groupMaterialsByShip`
- Draft factories: `createUnsafeDraft`, `createMaterialDraft`
- Unsafe flow: `renderUnsafeShipStep`, `renderUnsafeContentStep`, `renderUnsafeConfirmStep`, `renderUnsafeComplete`, `unsafeFlowShell`, `notifyUnsafeIssueRegistered`
- Materials flow: `renderMaterialShipStep`, `renderMaterialInfoStep`, `renderMaterialQuantityStep`, `renderMaterialConfirmStep`, `renderMaterialComplete`, `materialFlowShell`, `renderMaterials`
- Manager/detail: `renderUnsafeManager`, `renderUnsafeProcessingDetail`, `renderUnsafeDetail`, `renderUnsafeRecordCard`, `renderUnsafeQueueItem`, `renderMaterialManager`, `renderMaterialTableRow`, `renderMaterialRecordCard`
- Filters/state: `resetMaterialShipFilter`, `renderRecordFilters`

Next safe slice is more rule-level extraction around draft validation and filter/group logic. UI flows depend on `state.unsafeDraft`, `state.materialDraft`, `state.ships`, `state.workers`, `state.issuePhotos`, and admin mode.

### workers

Candidate extraction area: worker identity/session, login picker, pledge target selection, monthly worker analytics, and push-device management.

- Identity/session: `currentWorkerSessionWorker`, `currentWorkerSessionLabel`, `updateDesktopWorkerSession`, `renderLogin`, `renderLoginWorkerPicker`
- Selection helpers: `renderWorkerButton`, `renderOtherWorkerSelect`, `renderPledgeWorkerSelect`, `sameTeamWorkPrepWorkers`, `otherTeamWorkPrepWorkers`, `visibleWorkerOptions`
- Analytics: `visiblePledgeAnalyticsWorkers`, `hiddenPledgeAnalyticsWorkerName`, `monthlyWorkerInspectionStats`, `renderMonthlyWorkerAnalytics`, `renderMonthlyWorkerCard`, `exportMonthlyWorkerAnalytics`
- Push device/admin: `openWorkerPushDeviceManager`, `closeWorkerPushDeviceManager`, `renderWorkerPushDeviceManagerLoading`, `renderWorkerPushDeviceRow`, `saveWorkerPushDevice`, `deleteWorkerPushDevice`
- Admin worker manager: `renderWorkerManager`, `workerRoleBadge`

Most worker functions should stay until worker session and admin push state are isolated. Low-risk extraction candidates are pure label/sort/normalization helpers.

### ship/equipment

Candidate extraction area: ship metadata, search/sort/filtering, stage derivation, process-board rendering, and ship-aware issue/material flows.

- Stage/model helpers: `normalizeShipNo`, `normalizeShipStageInput`, `effectiveShipStage`, `shipScheduleStage`, `shipStageInfo`, `shipStageForNo`, `compareShipStage`, `shipSortOptions`, `shipTypeOptions`
- Collections/search: `dedupeShips`, `sortedShips`, `visibleWorkerShips`, `issueSelectableShips`, `upcomingDeliveryShips`, `checkFlowShipsForDraft`, `applyShipSearchFilter`, `setShipSortMode`
- Renderers: `renderShips`, `renderProcessBoard`, `renderDeliveryCards`, `renderPledgeShipSelect`, `renderUnsafeShipStep`, `renderMaterialShipStep`, `renderShipFilterNotice`
- Admin/export/sync: `shipStageField`, `openShipDataTarget`, `exportShips`, `cleanupDeliveredShips`, `deleteRemoteShips`

Pure stage and sort helpers are good candidates after characterization tests. Ship renderers should stay until `state.ships`, route filters, and DOM search fields are passed in.

### rendering

Candidate extraction area: top-level view router, common UI primitives, page heads, dashboard, tables, cards, modals, and DOM safety.

- Top-level: `render`, `renderPreservingScroll`, `changeView`, `renderAppHeader`, `renderNav`, `renderNavButtons`
- Dashboard/analytics: `dashboardModel`, `renderDashboard`, `renderAnalyticsDashboard`, `analyticsKpi`, `analyticsPercent`
- Common UI primitives: `badge`, `statPill`, `moreToggle`, `pageHead`, `toast`, `disabledReasonWrap`, `firstSpaceBreakHtml`, `esc`
- Modal/detail screens: `renderPhotoViewer`, `renderUnsafeDetail`, `renderUnsafeProcessingDetail`, `renderMaterialManager`, `renderPushManager`
- Forms/tables/cards: `renderHistoryTable`, `renderRecordFilters`, `renderToolCard`, `renderItems`, `renderSectionManager`, `renderCategoryToolAssignments`
- DOM-bound utilities: `applyShipSearchFilter`, `applyToolSearchFilter`, `setupSignaturePad`, `setupPictogramImageFallbacks`, `ensureRenderedAccessibility`

Rendering should be the last large extraction. It currently coordinates route state, focus restoration, DOM queries, admin mode, draft state, and every feature-domain renderer.

## Safe First Extraction Candidates

1. Pictogram metadata and pure icon helpers:
   - Move constants and helpers that do not read `state` or `document`: `normalizeIconKey`, `lineIconName`, `pictogramLazyImageSrc`, `lineIcon`, `statIcon`, `completionIcon`, `workVisual`.
   - Leave `pictogramAssetSrc`, `storedPictograms`, `pictogramLibrary`, and rendering in place until `state.pictograms` is passed as an argument.

2. Ship/equipment pure stage helpers:
   - Candidate helpers: `normalizeShipNo`, `normalizeShipStageInput`, `effectiveShipStage`, `shipScheduleStage`, `compareShipStage`, `shipSortOptions`, `shipTypeOptions`.
   - Add characterization tests first because these rules affect dashboard, ship list, unsafe/material flows, and monthly analytics.

3. Worker pure label/sort helpers:
   - Candidate helpers: `normalizedWorkerName`, `normalizeWorkerPosition`, `isLeaderWorker`, `sortWorkersForLogin`, `workerRoleBadge`.
   - Keep session-aware helpers in `app-v2.js`.

4. Already-extracted rules hardening:
   - `checklist-rules.js` and `issue-material-rules.js` are already separate. Prefer extending those tests and consuming them more explicitly before moving higher-level UI flows.

## Functions To Keep In app-v2.js For Now

Keep these until shared state and adapters are isolated:

- Global state/root rendering: `state`, `render`, `renderPreservingScroll`, `changeView`, `restoreRouteState`, `routeState`, `applyRouteFiltersFromQuery`
- Persistence/sync: `persist`, `normalizeDataShape`, `migrateIfNeeded`, `persistAndSync`, `pushRemote`, `pullRemote`, `startRemoteRealtime`, `scheduleRemoteRefresh`
- Auth/admin boundary: `invokeAdminMutation`, `upsertAdminRows`, `loadAdminModule`, `sendAdminPush`, `renderPushManager`, `registerWorkerPushNotifications`
- Checklist flow: `renderCheck`, `openWorkPrepRegister`, `startCheckFromWorkPrepRecord`, `renderWorkPrepRegister`, `setupSignaturePad`
- History/dashboard: `dashboardModel`, `renderDashboard`, `renderAnalyticsDashboard`, `renderHistory`, `filteredHistoryRows`
- Issue/material UI: `renderUnsafeManager`, `renderMaterialManager`, `renderUnsafeComplete`, `renderMaterialComplete`, `renderRecordFilters`
- Ship/workers UI: `renderShips`, `openShipDataTarget`, `renderWorkerManager`, `openWorkerPushDeviceManager`
- Pictogram state/UI: `pictogramAssetSrc`, `storedPictograms`, `pictogramLibrary`, `renderPictogramLibraryManager`, `setupPictogramImageFallbacks`

Reason: these functions combine at least two of `state.*`, `document/window`, Supabase, local/session storage, route state, focus preservation, or admin permissions.

## Tests After Each Extraction Slice

Run from the repo root.

### Baseline for every slice

```shell
npm run verify
```

This currently covers syntax checks for `app-v2.js`, extracted rule modules, harnesses, and the existing static/unit tests.

### checklist slice

```shell
node --check assets/js/app-v2.js
node --check assets/js/checklist-rules.js
node tests/checklist-rules.test.js
node tests/static-recovery.test.js
npm run harness
```

Add or update checklist rule tests before moving flow helpers beyond the existing pure rule module.

### issue-materials slice

```shell
node --check assets/js/app-v2.js
node --check assets/js/issue-material-rules.js
node tests/issue-material-rules.test.js
node tests/static-recovery.test.js
npm run harness
```

If UI flows move, also run `node tests/visual-check.js` against the affected unsafe/material screens.

### pictograms slice

```shell
node --check assets/js/app-v2.js
npm run verify
node tests/visual-check.js
```

Before extraction, add a focused static/unit test for icon key normalization, built-in metadata shape, asset source fallback, and lazy image behavior. The current test list does not show a pictogram-specific guard.

### ship/equipment slice

```shell
node --check assets/js/app-v2.js
npm run verify
node tests/visual-check.js
```

Add characterization coverage for stage normalization, sorting, and ship filtering before moving helpers used by dashboard, issue/material flows, and analytics.

### workers slice

```shell
node --check assets/js/app-v2.js
node tests/worker-security-static.test.js
npm run verify
```

If login/session or push-device behavior moves, also run admin boundary tests because worker identity feeds admin shortcuts and push targeting.

### auth/admin slice

```shell
node --check assets/js/app-v2.js
node tests/admin-mutation-boundary-static.test.js
node tests/worker-security-static.test.js
npm run verify
```

Do not move admin mutation or Supabase permission code unless this gate stays green.

### sync slice

```shell
node --check assets/js/app-v2.js
node tests/egress-optimization-static.test.js
node tests/static-recovery.test.js
npm run verify
```

If a live Supabase path is touched, run the configured live harness separately after the static gate:

```shell
npm run harness:live
```

### rendering slice

```shell
node --check assets/js/app-v2.js
npm run verify
node tests/visual-check.js
```

Rendering extraction needs browser/visual checks for dashboard, checklist, ships, history, unsafe, materials, manage, pledge, and analytics because `render()` coordinates the full view router and focus restoration.

## Recommended Refactor Order

1. Strengthen tests around existing extracted rule modules.
2. Extract pictogram pure metadata/helpers.
3. Extract ship/equipment pure stage and sort helpers.
4. Extract worker pure label/sort helpers.
5. Extract issue-material/checklist non-render rules only when tests exist.
6. Introduce explicit adapters for `state`, DOM, storage, Supabase, and routing.
7. Extract sync/admin/rendering slices only after adapter seams and permission tests are stable.
