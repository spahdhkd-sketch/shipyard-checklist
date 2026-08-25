const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const RUNTIME_MODULES = [
  "operational-cohort",
  "notification-preflight",
  "material-bulk-selection",
  "record-retention",
  "paged-collection",
  "safety-settings",
  "navigation-model",
  "pledge-action-view",
  "manage-center-view",
];
const RUNTIME_SHELL_PAGES = [
  "index.html",
  "check.html",
  "history.html",
  "items.html",
  "ships.html",
  "manage.html",
  "unsafe.html",
  "materials.html",
  "pledge.html",
  "analytics.html",
  "redesign-v2.html",
];

[
  "index.html",
  "manifest.json",
  "sw.js",
  "assets/css/styles-v2.css",
  "assets/css/20-component-table.css",
  "assets/css/20-component-disabled-reason.css",
  "assets/css/30-feature-not-found.css",
  "assets/css/30-feature-monthly-worker.css",
  "assets/css/30-feature-push-management.css",
  "assets/css/30-feature-signature.css",
  "assets/js/app-v2.js",
  "assets/js/dashboard-view.js",
  "assets/js/screen-views.js",
  ...RUNTIME_MODULES.map((name) => `assets/js/${name}.js`),
  "assets/js/push-rules.js",
  "assets/js/vendor/supabase-js-2.105.3.min.js",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "supabase/migrations/20260522004013_create_issue_photos_bucket.sql",
  "supabase/migrations/20260522004144_tighten_issue_photos_storage_policies.sql",
  "supabase/migrations/20260522082035_add_worker_position.sql",
  "supabase/migrations/20260523181216_worker_push_subscriptions.sql",
  "supabase/migrations/20260527064035_worker_public_read_path.sql",
  "supabase/migrations/20260527071140_revoke_workers_delete.sql",
  "supabase/migrations/20260527071213_enable_realtime_remote_tables.sql",
  "supabase/functions/worker-push/index.ts",
  "supabase/functions/worker-push/deno.json",
].forEach((file) => {
  assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
});

const html = read("index.html");
const vercelConfig = read("vercel.json");
assert.match(html, /viewport-fit=cover/);
assert.match(html, /assets\/dist\/css\/styles-v2\.min\.css\?v=20260826-v4-1/);
assert.match(html, /assets\/dist\/css\/20-component-table\.min\.css\?v=20260826-v4-1/);
assert.match(html, /assets\/dist\/css\/30-feature-signature\.min\.css\?v=20260826-v4-1/);
assert.match(html, /assets\/dist\/css\/30-feature-push-management\.min\.css\?v=20260826-v4-1/);
assert.match(html, /assets\/dist\/css\/30-feature-monthly-worker\.min\.css\?v=20260826-v4-1/);
assert.match(html, /assets\/dist\/css\/20-component-disabled-reason\.min\.css\?v=20260826-v4-1/);
assert.match(html, /assets\/js\/vendor\/supabase-js-2\.105\.3\.min\.js/);
assert.match(html, /assets\/dist\/js\/xlsx-helpers\.min\.js\?v=20260826-v4-1/);
assert.match(html, /assets\/dist\/js\/analytics-model\.min\.js\?v=20260826-v4-1/);
assert.match(html, /assets\/dist\/js\/ship-import-rules\.min\.js\?v=20260826-v4-1/);
assert.match(html, /assets\/dist\/js\/push-rules\.min\.js\?v=20260826-v4-1/);
assert.match(html, /assets\/dist\/js\/app-v2\.min\.js\?v=20260826-v4-1/);
RUNTIME_SHELL_PAGES.forEach((file) => {
  const page = read(file);
  const appOffset = page.indexOf("assets/dist/js/app-v2.min.js?v=20260826-v4-1");
  let previousOffset = -1;
  RUNTIME_MODULES.forEach((name) => {
    const runtimeAsset = `assets/dist/js/${name}.min.js?v=20260826-v4-1`;
    const offset = page.indexOf(runtimeAsset);
    assert.ok(offset > previousOffset && offset < appOffset, `${file} should load ${name} in dependency order before the v2 app runtime`);
    previousOffset = offset;
  });
});
assert.doesNotMatch(html, /http-equiv="Content-Security-Policy"/); // CSP single source of truth: vercel.json headers
assert.match(vercelConfig, /connect-src 'self' https:\/\/yuuroocvxvzgmsdeeiws\.supabase\.co wss:\/\/yuuroocvxvzgmsdeeiws\.supabase\.co/);
assert.match(html, /navigator\.serviceWorker\.register\("\/sw\.js", \{ updateViaCache: "none" \}\)/);
assert.match(html, /id="homeVersionLabel"/);
assert.match(html, /버전 확인 중/);
assert.doesNotMatch(html, /version 0\.3/);

[
  "check.html",
  "history.html",
  "items.html",
  "ships.html",
  "manage.html",
  "unsafe.html",
  "materials.html",
  "pledge.html",
  "analytics.html",
].forEach((file) => {
  const page = read(file);
  assert.match(page, /viewport-fit=cover/, `${file} should use the same viewport as index.html`);
  assert.match(page, /assets\/dist\/css\/styles-v2\.min\.css\?v=20260826-v4-1/, `${file} should use v2 styles with cache busting`);
  assert.match(page, /assets\/dist\/css\/20-component-table\.min\.css\?v=20260826-v4-1/, `${file} should use table component styles with cache busting`);
  assert.match(page, /assets\/dist\/css\/30-feature-signature\.min\.css\?v=20260826-v4-1/, `${file} should use signature feature styles with cache busting`);
  assert.match(page, /assets\/dist\/css\/30-feature-push-management\.min\.css\?v=20260826-v4-1/, `${file} should use push management feature styles with cache busting`);
  assert.match(page, /assets\/dist\/css\/30-feature-monthly-worker\.min\.css\?v=20260826-v4-1/, `${file} should use monthly worker feature styles with cache busting`);
  assert.match(page, /assets\/dist\/css\/20-component-disabled-reason\.min\.css\?v=20260826-v4-1/, `${file} should use disabled-reason component styles with cache busting`);
  assert.match(page, /assets\/js\/vendor\/supabase-js-2\.105\.3\.min\.js/, `${file} should use the local Supabase vendor bundle`);
  assert.match(page, /assets\/dist\/js\/push-rules\.min\.js\?v=20260826-v4-1/, `${file} should load push rules before the v2 app runtime`);
  assert.match(page, /assets\/dist\/js\/app-v2\.min\.js\?v=20260826-v4-1/, `${file} should use the v2 app runtime with cache busting`);
  assert.match(page, /id="homeVersionLabel"/, `${file} should use the current mobile header version badge`);
  assert.match(page, /home-date-row/, `${file} should use the current mobile home date layout`);
  assert.match(page, /버전 확인 중/, `${file} should show loading copy before JS writes APP_VERSION`);
  assert.doesNotMatch(page, /assets\/css\/styles\.css/, `${file} should not use legacy styles`);
  assert.doesNotMatch(page, /assets\/js\/app\.js/, `${file} should not use legacy app runtime`);
  assert.doesNotMatch(page, /version 0\.3/, `${file} should not use the stale static fallback version label`);
  assert.doesNotMatch(page, /cdn\.jsdelivr\.net/, `${file} should not use remote CDN assets`);
  assert.doesNotMatch(page, /psatbyktzladtymdygwh\.supabase\.co/, `${file} should not reference the old Supabase project`);
});

const notFound = read("404.html");
assert.match(notFound, /assets\/dist\/css\/styles-v2\.min\.css\?v=20260826-v4-1/);
assert.match(notFound, /assets\/dist\/css\/30-feature-not-found\.min\.css\?v=20260826-v4-1/);
assert.doesNotMatch(notFound, /assets\/css\/styles\.css/);
const redesignPreview = read("redesign-v2.html");
assert.match(redesignPreview, /assets\/dist\/css\/20-component-table\.min\.css\?v=20260826-v4-1/);
assert.match(redesignPreview, /assets\/dist\/css\/30-feature-signature\.min\.css\?v=20260826-v4-1/);
assert.match(redesignPreview, /assets\/dist\/css\/30-feature-push-management\.min\.css\?v=20260826-v4-1/);
assert.match(redesignPreview, /assets\/dist\/css\/30-feature-monthly-worker\.min\.css\?v=20260826-v4-1/);
assert.match(redesignPreview, /assets\/dist\/css\/20-component-disabled-reason\.min\.css\?v=20260826-v4-1/);
assert.match(redesignPreview, /assets\/js\/vendor\/supabase-js-2\.105\.3\.min\.js/);
assert.doesNotMatch(redesignPreview, /cdn\.jsdelivr\.net/);
[
  "assets/css/styles.css",
  "assets/js/app.js",
  "index.original.html",
  "tools/security-regression.mjs",
  "tools/split-static-html.ps1",
].forEach((file) => {
  assert.ok(!fs.existsSync(path.join(root, file)), `${file} should not remain after v2 cleanup`);
});
const illustrationDir = path.join(root, "assets/icons/shipyard/illustrations");
const illustrations = fs.existsSync(illustrationDir)
  ? fs.readdirSync(illustrationDir).filter((file) => file.endsWith(".png"))
  : [];
assert.ok(illustrations.length >= 40, "shipyard illustration PNGs should be generated from the source sheet");
["blockAssembly.png", "dpInstallation.png", "safetyGear.png"].forEach((file) => {
  assert.ok(fs.existsSync(path.join(illustrationDir, file)), `${file} should exist`);
});
assert.ok(fs.existsSync(path.join(root, "assets/icons/shipyard/shipyard-illustration-sheet.png")));

const appSource = read("assets/js/app-v2.js");
const app = [appSource, ...RUNTIME_MODULES.map((name) => read(`assets/js/${name}.js`))].join("\n");
const pushRules = read("assets/js/push-rules.js");
const screenViews = read("assets/js/screen-views.js");
const dashboardView = read("assets/js/dashboard-view.js");
const navigationModel = require(path.join(root, "assets/js/navigation-model.js"));
const styles = read("assets/css/styles-v2.css");
assert.doesNotMatch(styles, /@media\s*\(prefers-color-scheme:\s*dark\)/, "site should remain on the light theme regardless of OS preference");
assert.doesNotMatch(styles, /color-scheme:\s*dark/, "site should not opt native controls into dark mode");
const notFoundStyles = read("assets/css/30-feature-not-found.css");
const tableStyles = read("assets/css/20-component-table.css");
const signatureStyles = read("assets/css/30-feature-signature.css");
const pushManagementStyles = read("assets/css/30-feature-push-management.css");
const monthlyWorkerStyles = read("assets/css/30-feature-monthly-worker.css");
const disabledReasonStyles = read("assets/css/20-component-disabled-reason.css");
assert.match(app, /const APP_VERSION = "1\.13\.0-20260826-v4"/);
assert.match(app, /const STORAGE_VERSION_KEY = "storageVersion"/);
assert.match(app, /function refreshVersionedLocalCache\(\)/);
assert.match(app, /const savedVersion = localStorage\.getItem\(versionKey\)/);
assert.match(app, /if \(savedVersion === APP_VERSION\) return false/);
assert.match(app, /const legacyStorage = !savedVersion/);
assert.match(app, /NormalizationRules\.pendingRowsForVersionRefresh/);
assert.strictEqual(/REMOTE_TABLES\.forEach\(\(config\) => localStorage\.removeItem\(storeKey\(config\.key\)\)\)/.test(app), false);
assert.match(app, /localStorage\.removeItem\(storeKey\("lastRemotePullAt"\)\)/);
assert.match(app, /localStorage\.removeItem\(storeKey\("remoteListLimits"\)\)/);
assert.match(app, /localStorage\.setItem\(versionKey, APP_VERSION\)/);
assert.match(app, /if \(legacyStorage\) console\.info\("Legacy local cache refreshed for current app version\."\)/);
assert.match(app, /refreshVersionedLocalCache\(\)/);
assert.doesNotMatch(app, /localStorage\.clear\(\)/);
assert.match(app, /const REMOTE_PULL_THROTTLE_MS = 10 \* 1000/);
assert.match(app, /const REMOTE_POLL_INTERVAL_MS = 15 \* 1000/);
assert.match(app, /const REMOTE_REACTIVE_PULL_DELAY_MS = 700/);
assert.match(app, /const SYNC_RETRY_DELAY_MS = 8 \* 1000/);
assert.match(app, /const STORAGE_WARNING_KB = 4600/);
assert.match(app, /const STORAGE_COMPACT_KB = 3800/);
assert.match(app, /function issueSelectableShips\(\)/);
assert.match(app, /function visibleShipOptionsForIssues\(selectedNo = ""\) \{\s*return `<option value="">호선 선택<\/option>\$\{issueSelectableShips\(\)/);
assert.match(app, /function renderUnsafeShipStep\(\) \{\s*const ships = issueSelectableShips\(\)/);
assert.match(app, /function renderMaterialShipStep\(\) \{\s*const ships = issueSelectableShips\(\)/);
assert.match(app, /등록된 호선이 없습니다\. 호선 관리에서 먼저 호선을 추가하세요\./);
assert.match(app, /function isWorkerVisibleShip\(ship\) \{\s*return Boolean\(ship\.lcDate \|\| ship\.stDate \|\| ship\.clDate\);/);
assert.doesNotMatch(app, /L\/C일 입력 전 비공개/);
assert.doesNotMatch(app, /L\/C일이 입력된 호선만 작업자 점검 화면에 표시됩니다\./);
assert.doesNotMatch(app, /data-ship-search-count/);
assert.match(app, /<span>호선 정보 카드<\/span>/);
assert.match(app, /const PENDING_PHOTO_RETRY_MAX_BYTES = 240 \* 1024/);
assert.match(app, /function pendingPhotoDataUrlForStorage\(value\)/);
assert.match(app, /function compactStoragePayloadsIfNeeded\(\)/);
assert.match(app, /photoDataUrlForStorage: pendingPhotoDataUrlForStorage/);
assert.match(read("assets/js/normalization-rules.js"), /dataUrl: photoDataUrlForStorage\(row\.dataUrl\)/);
assert.match(app, /file\.size <= PENDING_PHOTO_RETRY_MAX_BYTES/);
[
  "categories",
  "sections",
  "items",
  "tools",
  "pictograms",
  "workers",
  "ships",
  "inspections",
  "inspectionItems",
  "unsafeIssues",
  "missingMaterials",
  "issuePhotos",
  "workPrepRecords",
].forEach((key) => {
  assert.match(app, new RegExp(`"${key}"`), `${key} should be remote-authoritative or synced`);
});
assert.match(app, /function pendingSyncRowsForKey\(key\)/);
assert.match(app, /function authoritativeRemoteRows\(key, remoteRows\)/);
assert.match(app, /function applyRemoteTableRows\(key, rows\)/);
assert.match(app, /REMOTE_AUTHORITATIVE_KEYS\.has\(key\)/);
assert.match(app, /const pullConfigs = REMOTE_TABLES\.filter\(\(config\) => config\.pullOnStartup !== false && \(!requestedKeys \|\| requestedKeys\.has\(config\.key\)\)\)/);
assert.match(app, /Promise\.allSettled\(pullConfigs\.map/);
assert.match(app, /pullRemote\(\{ force: true \}\)/);
assert.match(app, /function startRemoteRealtime\(\)/);
assert.match(app, /\.channel\("gs-safety-remote-sync"\)/);
assert.match(app, /"postgres_changes"/);
assert.match(app, /realtimeRemoteConfigs\(\)\.forEach\(\(config\) => \{/);
assert.match(app, /table: config\.table/);
assert.match(app, /function remoteRealtimeConnected\(\)/);
assert.match(app, /function stopRemotePolling\(\)/);
assert.match(app, /function startRemotePolling\(\)/);
assert.match(app, /state\.remotePollTimer \|\| remoteRealtimeConnected\(\)/);
assert.match(app, /if \(remoteRealtimeConnected\(\)\) \{\s*stopRemotePolling\(\);/);
assert.match(app, /if \(status === "SUBSCRIBED"\) \{[\s\S]*?stopRemotePolling\(\);[\s\S]*?startInspectionDeletionRealtime\(\)\.then\(\(\) => pullRealtimeGap\("subscribed"\)\);/);
assert.match(app, /startRemotePolling\(\);\s*scheduleRemoteRefresh\("realtime-fallback"/);
assert.match(app, /setInterval\(\(\) => \{/);
assert.match(app, /function captureFocusedFieldState\(\)/);
assert.match(app, /function restoreFocusedFieldState\(captured\)/);
assert.match(app, /const focusedFieldState = captureFocusedFieldState\(\)/);
assert.match(app, /restoreFocusedFieldState\(focusedFieldState\)/);
assert.match(app, /selectionStart/);
assert.match(app, /function scheduleRemoteRefresh\(reason = "change"/);
assert.match(app, /window\.addEventListener\("visibilitychange"/);
assert.match(app, /window\.addEventListener\("storage", handleStorageSyncWake\)/);
assert.match(app, /function appVersionLabel\(\)/);
assert.match(app, /const APP_VERSION_LABEL = `v\$\{APP_VERSION_SHORT\}`/);
assert.match(app, /return APP_VERSION_LABEL/);
assert.match(app, /pendingSyncQueue: normalizePendingSyncQueue\(loadJson\("pendingSyncQueue", \[\]\)\)/);
assert.match(app, /function enqueueSyncRows\(key, rows\)/);
assert.match(app, /async function flushPendingSyncQueue\(\)/);
assert.match(app, /async function persistAndSync\(keys = null, options = \{\}\)/);
assert.match(app, /syncInspectionHistory\(inspection, inspectionItems\);/);
assert.match(app, /Date\.now\(\) - state\.lastRemotePullAt < REMOTE_PULL_THROTTLE_MS/);
assert.match(app, /\{ id: "pledge", label: "서약"/);
assert.match(app, /\{ id: "analytics", label: "통계"/);
assert.deepStrictEqual(navigationModel.MOBILE_PARENTS.map((parent) => parent.id), ["today", "inspection", "status", "report", "more"], "mobile navigation should retain five parent destinations");
assert.strictEqual(navigationModel.getActiveMobileParentId("pledge"), "more", "pledge should remain reachable through the more mobile parent");
assert.strictEqual(navigationModel.getActiveMobileParentId("analytics"), "more", "analytics should remain reachable through the more mobile parent");
assert.ok(navigationModel.routesForMobileParent("more", "worker").some((route) => route.id === "pledge"), "worker more menu should expose pledge");
assert.ok(navigationModel.routesForMobileParent("more", "admin").some((route) => route.id === "analytics"), "admin more menu should expose analytics");
assert.doesNotMatch(app, /const MOBILE_NAV_IDS = new Set\(\["dashboard", "check", "ships", "history", "items"\]\)/, "mobile navigation should not remain hard-coded to the old five leaf routes");
assert.match(app, /function renderCategoryToolPicker\(\{ groupId, selectedIds \}\)/);
assert.match(app, /function renderCategoryToolAssignments\(\)/);
assert.match(app, /function renderWorkTypeDetail\(cat, selectedToolIds, categories\)/);
assert.match(app, /function renderWorkTypeToolsTab\(cat, selectedToolIds, categories\)/);
assert.match(app, /function copyCategoryTools\(targetId\)/);
assert.match(app, /function renderCategoryEditPanel\(cat\)/);
assert.match(app, /function renderCategoryToolSummary\(toolIds\)/);
assert.match(app, /toolManagerOpen: false/);
assert.match(app, /function renderToolManagerShell\(\)/);
assert.match(app, /data-action="toggle-tool-manager"/);
assert.match(app, /function applyWorkTypeSearchFilter\(\)/);
assert.match(app, /function applyCategoryToolSearchFilter\(\)/);
assert.match(app, /function selectedCategoryToolIds\(groupId\)/);
assert.match(app, /function selectedEditCategoryColor\(id, fallback\)/);
assert.match(app, /function categoryAllowedToolIds\(categoryId\)/);
assert.match(app, /function visibleToolsForCategory\(categoryId\)/);
assert.match(app, /SCREEN_VIEWS\.renderItemManagerHomeView\(\{/);
assert.match(app, /SCREEN_VIEWS\.renderItemManagerCategoryView\(\{/);
const renderItemsDefaultView = screenViews.slice(screenViews.indexOf("function renderItemManagerHomeView("), screenViews.indexOf("function renderItemManagerCategoryView("));
const toolManagerIndex = renderItemsDefaultView.indexOf("${model.toolManagerShellHtml}");
const sectionGuideIndex = renderItemsDefaultView.indexOf("섹션/점검 항목 관리");
const categoryToolIndex = renderItemsDefaultView.indexOf("category-tool-assignment-panel");
assert.ok(toolManagerIndex !== -1, "items view should include the tool manager panel");
assert.equal(sectionGuideIndex, -1, "items view should not include the non-interactive section/item guide panel");
assert.ok(categoryToolIndex !== -1, "items view should include the unified category management panel");
assert.ok(toolManagerIndex < categoryToolIndex, "category management should follow the tool manager");
assert.match(app, /tool_ids: sanitizeToolIds\(row\.toolIds\)/);
assert.match(app, /toolIds: sanitizeToolIds\(row\.tool_ids\)/);
assert.match(app, /data-save-category-tools="\$\{esc\(cat\.id\)\}"/);
assert.match(screenViews, /data-select-work-type="\$\{esc\(category\.id\)\}"/);
assert.match(app, /data-work-type-tab="\$\{id\}"/);
assert.match(app, /data-copy-category-tools="\$\{esc\(cat\.id\)\}"/);
assert.match(app, /data-edit-category-color-id="\$\{esc\(cat\.id\)\}"/);
assert.match(app, /data-edit-category-color="\$\{color\}"/);
assert.match(app, /data-save-category="\$\{esc\(cat\.id\)\}"/);
assert.match(app, /if \(button\.dataset\.saveCategoryTools\) saveCategoryTools\(button\.dataset\.saveCategoryTools\)/);
assert.match(app, /if \(button\.dataset\.copyCategoryTools\) copyCategoryTools\(button\.dataset\.copyCategoryTools\)/);
assert.match(app, /function saveCategoryTools\(id\)/);
assert.match(app, /categoryToolDrafts: \{\}/);
assert.match(app, /function categoryToolDraftIds\(categoryId, fallbackIds = \[\]\)/);
assert.match(app, /function updateCategoryToolDraft\(groupId, toolId, checked\)/);
assert.match(app, /categoryToolDraftIds\(selectedCategory\.id, selectedCategory\.toolIds\)/);
assert.match(app, /data-category-tool-group/);
assert.match(app, /updateCategoryToolDraft\(event\.target\.dataset\.categoryToolGroup, event\.target\.value, event\.target\.checked\)/);
assert.match(app, /const toolIds = selectedCategoryToolIds\(`category_\$\{id\}`\)/);
assert.match(app, /clearCategoryToolDraft\(id\)/);
assert.match(app, /const CATEGORY_TOOL_META_PREFIX = "__category_tools__"/);
assert.match(app, /function categoryToolMetaItemId\(categoryId\)/);
assert.match(app, /function syncCategoryToolMetaItem\(categoryId, toolIds\)/);
assert.match(app, /function applyCategoryToolMetaItems\(\)/);
assert.match(app, /persistAndSync\(\["categories", "items"\]\)/);
assert.doesNotMatch(app, /category-tool-toggle-mark/);
assert.doesNotMatch(app, /⌃|⌄/);
assert.doesNotMatch(app, /수정과 초기화는 관리자 이메일 로그인 후 사용할 수 있습니다/);
assert.match(screenViews, /작업 유형 관리/);
assert.match(app, /"\/checklist": "check"/);
assert.match(app, /"\/admin": "manage"/);
assert.match(app, /createdAtMs: Date\.now\(\)/);
assert.match(app, /const PLEDGE_SIGNATURE_CACHE_KEY = "pledgeSignatureCache"/);
assert.match(app, /function signatureCacheDateKey\(\)/);
assert.match(app, /function cachedPledgeSignatureForWorker\(workerName\)/);
assert.match(app, /function savePledgeSignatureForWorker\(workerName, signature\)/);
assert.match(app, /pledgeSignatureCleared: false/);
assert.match(app, /if \(state\.draft\.pledgeSignatureCleared\) return false/);
assert.match(app, /state\.draft\.pledgeSignatureCleared = true/);
assert.match(app, /state\.draft\.pledgeSignatureCleared = false/);
assert.doesNotMatch(app, /function clearPledgeSignatureForWorker\(workerName\)/);
assert.doesNotMatch(app, /delete cache\[day\]\[worker\]/);
assert.match(app, /const HIDDEN_PLEDGE_ANALYTICS_WORKER_IDS = new Set\(\["worker_001", "worker_002", "worker_007", "worker_013"\]\)/);
assert.match(app, /const HIDDEN_PLEDGE_ANALYTICS_WORKER_NAMES = new Set\(\["김광수", "허지원", "김준혁", "김경제"\]\)/);
assert.match(app, /function visiblePledgeAnalyticsWorkers\(\)/);
assert.match(app, /function visiblePledgeAnalyticsWorkerName\(name\)/);
assert.match(app, /function preloadCachedPledgeSignature\(\)/);
assert.match(app, /function browserNotificationsAvailable\(\)/);
assert.match(app, /async function ensureBrowserNotificationPermission\(\)/);
assert.match(app, /function showBrowserNotification\(title, options = \{\}\)/);
assert.match(app, /async function notifyPledgePendingWorkers\(targetWorkerIds = null, options = \{\}\)/);
assert.match(app, /async function notifyUnsafeIssueRegistered\(row\)/);
assert.match(app, /const PUSH_VAPID_PUBLIC_KEY = "/);
assert.match(app, /function unsafePushTargetWorkerIds\(\)/);
assert.match(app, /const PUSH_TEST_NOTIFICATION_DISABLE_AT = Date\.parse\("2026-05-26T11:59:00\+09:00"\)/);
assert.match(pushRules, /const DEFAULT_PUSH_NOTIFICATION_TEMPLATES = \{/);
assert.match(app, /const DEFAULT_PUSH_NOTIFICATION_TEMPLATES = PUSH_RULES\.DEFAULT_PUSH_NOTIFICATION_TEMPLATES/);
assert.match(pushRules, /pledgePending: \{[\s\S]*title: "안전 서약 미완료"/);
assert.match(pushRules, /unsafeIssue: \{[\s\S]*body: "\{호선\} · \{등록자\} · \{내용\}"/);
assert.match(pushRules, /adminManual: \{[\s\S]*title: "GS 안전 체크리스트 안내"/);
assert.match(pushRules, /const ADMIN_PUSH_STYLES = \[/);
assert.match(app, /const ADMIN_PUSH_STYLES = PUSH_RULES\.ADMIN_PUSH_STYLES/);
assert.match(app, /function pushNotificationsSupported\(\)/);
assert.match(app, /function pushRegisteredForCurrentDevice\(\)/);
assert.match(app, /function pushDeviceName\(\)/);
assert.match(app, /function pushTestNotificationEnabled\(\)/);
assert.match(app, /function normalizeWorkerPushSubscriptionStatus\(workerId, row\)/);
assert.match(app, /function workerPushSubscriptionBadgeMeta\(workerId\)/);
assert.match(app, /function renderWorkerPushSubscriptionStatusBadges\(\)/);
assert.match(app, /async function refreshWorkerPushSubscriptionStatuses\(options = \{\}\)/);
assert.match(app, /function scheduleWorkerPushSubscriptionStatusRefresh\(options = \{\}\)/);
assert.match(app, /function renderWorkerPushDeviceManager\(\)/);
assert.match(app, /function renderWorkerPushDeviceRow\(device\)/);
assert.match(app, /function renderPushManager\(\)/);
assert.match(app, /function adminPushTargetWorkers\(\)/);
assert.match(app, /async function sendAdminPush\(\)/);
assert.match(screenViews, /알림 유형/);
assert.match(screenViews, /브라우저 푸시는 별도 템플릿이 아니라 제목, 내용, 아이콘, 배지, 진동, 클릭 이동 옵션 조합입니다\./);
assert.match(screenViews, /발송할 작업자 카드를 직접 눌러 선택하세요/);
assert.match(app, /function adminPushTargetWorkers\(\) \{\s*const selected = new Set\(normalizeAdminPushWorkerIds\(state\.adminPushDraft\.selectedWorkerIds\)\);/);
assert.doesNotMatch(app + screenViews, /data-action="set-admin-push-target-mode"/);
assert.doesNotMatch(app + screenViews, /push-target-modes/);
assert.doesNotMatch(styles, /\.push-target-summary/);
assert.match(app, /async function saveWorkerPushDevice\(event\)/);
assert.match(app, /async function deleteWorkerPushDevice\(event\)/);
assert.match(app, /data-worker-push-badge/);
assert.match(app, /data-worker-push-manage/);
assert.match(app, /\["push", "푸시"\]/);
assert.match(screenViews, /data-action="send-admin-push"/);
assert.match(app, /sendKind: options\.kind \|\| ""/);
assert.match(app, /\{ kind: "adminManual" \}/);
assert.match(app, /action: "status"/);
assert.match(app, /button\.disabled = loggedIn && \(registered \|\| checking \|\| registering \|\| !supported\)/);
assert.match(app, /서버에 등록된 알림/);
assert.match(app, /notification-icon\.png/);
assert.match(app, /function setupPictogramImageFallbacks\(\)/);
assert.match(app, /data-fallback-icon/);
assert.match(app, /function timeoutAfter\(ms\)/);
assert.match(app, /function rejectAfter\(ms, message\)/);
assert.match(app, /Promise\.race\(\[navigator\.serviceWorker\.ready, timeoutAfter\(5000\)\]\)/);
assert.match(app, /async function createBrowserPushSubscription\(registration\)/);
assert.match(app, /pushRegistrationSubmitting: false/);
assert.match(app, /async function registerWorkerPushNotifications\(\)/);
assert.doesNotMatch(app, /휴대폰 알림 등록을 위해 사번을 다시 입력하세요/);
assert.match(app, /normalizeEmployeeNo\(state\.workerSession\?\.employeeNo \|\| ""\)/);
assert.match(app, /pushEmployeeNoPromptOpen: false/);
assert.match(app, /data-push-employee-no-form/);
assert.match(app, /needsEmployeeNo \? "사번 확인 후 등록"/);
assert.match(app, /registering \? "알림 등록 중"/);
assert.match(app, /async function fetchWorkerPushSubscriptionStatus\(workerId\)/);
assert.match(app, /async function refreshWorkerPushSubscriptionStatus\(options = \{\}\)/);
assert.match(app, /async function sendWorkerPushNotification\(workerIds, notification, options = \{\}\)/);
assert.match(app, /async function testCurrentWorkerPushNotification\(\)/);
assert.match(app, /function workerIdsForNames\(names\)/);
assert.match(app, /function unsafePushTargetWorkerIds\(\)/);
assert.match(app, /function pushNotificationTemplates\(\)/);
assert.match(app, /function pushNotificationFromTemplate\(kind, context = \{\}\)/);
assert.match(app, /function renderPushTemplateEditor\(\)/);
assert.match(app, /function openPushTemplateEditor\(event\)/);
assert.match(app, /pushNotificationFromTemplate\("pledgePending", \{/);
assert.match(app, /pushNotificationFromTemplate\("unsafeIssue", \{/);
assert.match(app, /\.filter\(\(w\) => w\.unsafePushTarget\)/);
assert.match(app, /function pledgeRowStatus\(row\)/);
assert.match(app, /function pledgePendingRows\(\)/);
assert.match(app, /function canSendPledgeNotifications\(\)/);
assert.match(app, /조장 또는 관리 담당자만 미완료자 알림을 발송할 수 있습니다/);
assert.match(app, /pledgeDashboardRows\(\)\.filter\(\(row\) => pledgeRowStatus\(row\) === "미완료"\)/);
assert.match(app, /status: done \? "완료" : "미완료"/);
assert.match(app, /pushSubscriptionStatus: loadJson\("pushSubscriptionStatus", \{\}\)/);
assert.doesNotMatch(app, /worker_push_subscription_status/);
assert.match(app, /senderWorkerId/);
assert.match(app, /senderEmployeeNo/);
assert.match(app, /sendKind: options\.kind \|\| ""/);
assert.match(app + screenViews, /data-action="notify-pledge-pending"/);
assert.match(app + screenViews, /data-action="edit-push-template" data-push-template-kind="pledgePending"/);
assert.match(app + screenViews, /data-action="edit-push-template" data-push-template-kind="unsafeIssue"/);
assert.match(app, /data-action="register-push-notifications"/);
assert.match(app, /data-action="test-push-notification"/);
assert.match(app, /"notify-pledge-pending": notifyPledgePendingWorkers/);

// 서약 화면 날짜 이동 (지난 서약 조회)
assert.match(app, /pledgeViewDate: ""/);
assert.match(app, /function pledgeDashboardRows\(date = today\(\)\)/);
assert.match(app, /const dateValue = dateOnly\(date\) \|\| today\(\);/);
assert.match(app, /combinedInspectionRows\(\)\.filter\(\(row\) => row\.date === dateValue\)/);
assert.match(app, /function pledgeWeekStats\(anchorDate = today\(\)\)/);
assert.match(app, /function manageCenterDataState\(tab\)/);
assert.match(app, /dataState,/);
assert.match(app, /function handleManageCenterButtonClick\(button\)/);
assert.match(app, /function pledgeViewDate\(\)/);
assert.match(app, /function setPledgeViewDate\(mode, value = ""\)/);
// 다음 날 이동은 오늘을 넘지 못한다
assert.match(app, /if \(mode === "next"\) nextDate = addDays\(selected, 1\) <= todayValue \? addDays\(selected, 1\) : selected;/);
// 날짜 직접 선택도 오늘 이후는 막는다
assert.match(app, /nextDate = picked && picked <= todayValue \? picked : selected;/);
assert.match(app, /const rows = pledgeDashboardRows\(viewDate\);/);
assert.match(app, /const week = pledgeWeekStats\(viewDate\);/);
// 지난 날짜에서는 미완료자 알림 발송 불가 (읽기 전용)
assert.match(app, /canNotifyPledge: canSendPledgeNotifications\(\) && isToday/);
assert.match(app, /"pledge-prev-day": \(\) => setPledgeViewDate\("prev"\)/);
assert.match(app, /"pledge-next-day": \(\) => setPledgeViewDate\("next"\)/);
assert.match(app, /"pledge-view-today": \(\) => setPledgeViewDate\("today"\)/);
assert.match(app, /dispatchPledgeManagerAction\(action, event\) \|\|/);
assert.match(app, /setPledgeViewDate\("pick", event\.target\.value\)/);
assert.match(screenViews, /data-action="pledge-prev-day"/);
assert.match(screenViews, /data-action="pledge-next-day"/);
assert.match(screenViews, /data-action="pledge-view-today"/);
assert.match(screenViews, /data-pledge-view-date value="\$\{esc\(model\.viewDate \|\| ""\)\}" max="\$\{esc\(model\.maxDate \|\| ""\)\}"/);
assert.match(app, /todayIso: viewDate/);
assert.match(read("assets/css/styles-v2.css"), /\.pledge-date-nav/);

// 서약 뷰 동작: 날짜 필터·읽기 전용·오늘 클램프
{
  const screenViewsApi = require(path.join(root, "assets/js/screen-views.js"));
  const pastHtml = screenViewsApi.renderPledgeManagerView({
    dateLabel: "2026.06.10",
    todayIso: "2026-06-10",
    viewDate: "2026-06-10",
    maxDate: "2026-06-12",
    isToday: false,
    rows: [{ name: "김민수", team: "용접", shipNo: "H-101", time: "08:10", statusChipHtml: "" }],
    pendingCount: 1,
    canNotifyPledge: false,
    adminMode: true,
    rules: [],
    weekBars: [],
  });
  assert.ok(pastHtml.includes("지난 서약 기록 조회 (읽기 전용)"));
  assert.ok(!pastHtml.includes('data-action="notify-pledge-pending"'), "past date must not offer notify action");
  assert.ok(!pastHtml.includes('data-action="edit-pledge-template"'), "past date must not offer pledge-template edits");
  assert.ok(!pastHtml.includes('data-action="edit-push-template"'), "past date must not offer push-template edits");
  assert.ok(pastHtml.includes("현재 적용 양식 참고"), "past date must identify the preview as a current-reference template");
  assert.ok(pastHtml.includes("날짜: 2026-06-10"), "pledge preview must use the selected date");
  assert.ok(pastHtml.includes('data-action="pledge-view-today"'), "past date must offer 오늘로 button");
  assert.ok(!pastHtml.includes('data-action="pledge-next-day" disabled'), "past date keeps 다음 날 enabled");
  assert.ok(pastHtml.includes('max="2026-06-12"'), "date picker must clamp at today");

  const loadingHtml = screenViewsApi.renderPledgeManagerView({
    dateLabel: "2026.06.10",
    todayIso: "2026-06-10",
    viewDate: "2026-06-10",
    maxDate: "2026-06-12",
    isToday: false,
    dataState: "loading",
    kpiHtml: '<div>CACHED_KPI_93</div>',
    rows: [{ name: "CACHED_WORKER", team: "용접", shipNo: "H-101", time: "08:10", statusChipHtml: "" }],
    pendingCount: 1,
    canNotifyPledge: false,
    adminMode: true,
    rules: [],
    weekBars: [{ label: "수", pct: 93, value: "CACHED_WEEK_93" }],
  });
  assert.ok(loadingHtml.includes('aria-busy="true"'), "historical pledge loading must expose a busy state");
  assert.ok(loadingHtml.includes('role="status"'), "historical pledge loading must announce progress");
  assert.ok(loadingHtml.includes("data-pledge-view-date"), "date navigation stays available while loading");
  assert.ok(!loadingHtml.includes("CACHED_KPI_93"), "loading must hide cached KPI values");
  assert.ok(!loadingHtml.includes("CACHED_WORKER"), "loading must hide cached worker rows");
  assert.ok(!loadingHtml.includes("CACHED_WEEK_93"), "loading must hide cached weekly chart values");

  const errorHtml = screenViewsApi.renderPledgeManagerView({
    dateLabel: "2026.06.10",
    todayIso: "2026-06-10",
    viewDate: "2026-06-10",
    maxDate: "2026-06-12",
    isToday: false,
    dataState: "error",
    kpiHtml: '<div>CACHED_ERROR_KPI</div>',
    rows: [{ name: "CACHED_ERROR_WORKER", team: "용접", shipNo: "H-101", time: "08:10", statusChipHtml: "" }],
    pendingCount: 1,
    canNotifyPledge: false,
    adminMode: true,
    rules: [],
    weekBars: [{ label: "수", pct: 93, value: "CACHED_ERROR_WEEK" }],
  });
  assert.ok(errorHtml.includes('role="alert"'), "historical pledge load failure must be announced");
  assert.ok(errorHtml.includes('data-action="retry-pledge-range"'), "historical pledge load failure must offer retry");
  assert.ok(errorHtml.includes("data-pledge-view-date"), "date navigation stays available after an error");
  assert.ok(!errorHtml.includes("CACHED_ERROR_KPI"), "error state must hide cached KPI values");
  assert.ok(!errorHtml.includes("CACHED_ERROR_WORKER"), "error state must hide cached worker rows");
  assert.ok(!errorHtml.includes("CACHED_ERROR_WEEK"), "error state must hide cached weekly chart values");

  const todayHtml = screenViewsApi.renderPledgeManagerView({
    dateLabel: "2026.06.12",
    todayIso: "2026-06-12",
    viewDate: "2026-06-12",
    maxDate: "2026-06-12",
    isToday: true,
    rows: [],
    pendingCount: 0,
    canNotifyPledge: true,
    adminMode: false,
    rules: [],
    weekBars: [],
  });
  assert.ok(todayHtml.includes('data-action="notify-pledge-pending"'), "today keeps notify action");
  assert.ok(todayHtml.includes('data-action="pledge-next-day" disabled'), "today disables 다음 날");
  assert.ok(!todayHtml.includes('data-action="pledge-view-today"'), "today hides 오늘로 button");
}
assert.match(app, /"edit-push-template": openPushTemplateEditor/);
assert.match(app, /"save-push-template": savePushTemplateEditor/);
assert.match(app, /"cancel-push-template": closePushTemplateEditor/);
assert.match(app, /"register-push-notifications": registerWorkerPushNotifications/);
assert.match(app, /"test-push-notification": testCurrentWorkerPushNotification/);
assert.match(app, /employeeNo,\s*loggedInAt: serverNow\(\)\.toISOString\(\)/);
assert.match(app, /notifyUnsafeIssueRegistered\(row\);/);
assert.match(app, /workerFallbackOpen: false/);
assert.match(app, /function workerMatchesCategoryNature\(worker, categoryNature\)/);
assert.match(app, /function checkWorkerGroups\(category\)/);
assert.match(app, /function renderOtherWorkerSelect\(otherWorkers\)/);
assert.match(app, /function renderLogin\(\)/);
assert.match(app, /const loadWorkerSession = \(\) =>/);
assert.match(app, /const loadAdminAuthSource = \(\) =>/);
assert.match(app, /sessionStorage\.getItem\(storeKey\("adminAuthSource"\)\)/);
assert.doesNotMatch(app, /verify_worker_login/);
assert.match(app, /createAdminSession\(workerId, employeeNo, "worker"\)/);
assert.match(app, /id="loginEmployeeNo" type="password" inputmode="text" autocomplete="current-password" autocapitalize="characters"/);
assert.match(app, /const DEFAULT_WORKER_POSITION = "작업자"/);
assert.match(app, /const LEADER_WORKER_POSITION = "조장"/);
assert.match(app, /const FOREMAN_WORKER_POSITION = "반장"/);
assert.match(app, /const WORKER_POSITIONS = \[DEFAULT_WORKER_POSITION, LEADER_WORKER_POSITION, FOREMAN_WORKER_POSITION, "대표", "관리", "총무"\]/);
assert.match(app, /const ADMIN_PREENTRY_WORKER_POSITIONS = new Set\(\[FOREMAN_WORKER_POSITION, "대표", "관리", "총무"\]\)/);
assert.match(app, /const LEADER_EQUIVALENT_WORKER_POSITIONS = new Set\(\[LEADER_WORKER_POSITION, FOREMAN_WORKER_POSITION\]\)/);
assert.match(app, /const WORKER_TEAM_OPTIONS = \["선행", "후행", "관리"\]/);
assert.match(app, /const LOGIN_WORKER_GROUP_ORDER = \["대표", "관리", "선행", "후행", "총무"\]/);
assert.match(app, /function normalizeWorkerPosition\(position\)/);
assert.match(app, /function workerDisplayPosition\(worker\)/);
assert.match(app, /name === "백승기" && position === LEADER_WORKER_POSITION/);
assert.match(app, /function canWorkerPreEnterAdminMode\(worker\)/);
assert.match(app, /ADMIN_PREENTRY_WORKER_POSITIONS\.has\(position\)/);
assert.match(app, /function workerAdminModeLabel\(worker\)/);
assert.match(app, /function loginWorkerGroup\(worker\)/);
assert.match(app, /function sortWorkersForLogin\(workers\)/);
assert.match(app, /function workPrepCounterpartTeam\(team\)/);
assert.match(app, /function hasSubmittedWorkPrepInspection\(record, workerId\)/);
assert.match(app, /이미 이 작업지시서 점검을 제출했습니다\./);
assert.match(screenViews, /work-prep-submission-summary pending/);
assert.match(screenViews, /미점검 \$\{pendingNames\.length\}명/);
assert.match(screenViews, /전원 점검 완료/);
assert.match(app, /\[\.\.\.sortWorkersForLogin\(state\.workers\)\]/);
assert.match(app, /setAdminMode\(true, workerAdminModeLabel\(worker\), "worker"\)/);
assert.match(app, /state\.adminAuthSource === "worker"/);
assert.match(app, /saveAdminMode\(state\.adminMode, state\.adminAuthSource\)/);
assert.match(app, /readTable: "workers_public"/);
assert.doesNotMatch(app, /employee_no: normalizeEmployeeNo\(row\.employeeNo\)/);
assert.doesNotMatch(app, /employeeNo: normalizeEmployeeNo\(row\.employee_no\)/);
assert.match(app, /unsafePushTarget: Boolean\(worker\.unsafePushTarget \|\| worker\.unsafe_push_target\)/);
assert.match(app, /position: normalizeWorkerPosition\(row\.position\)/);
assert.match(app + screenViews, /id="workerPosition"/);
assert.match(app, /workerEditCardId: ""/);
assert.match(app + screenViews, /data-worker-card-toggle/);
assert.match(app, /data-save-worker/);
assert.match(app, /function renderWorkerTeamOptions\(selectedTeam\)/);
assert.doesNotMatch(app, /data-toggle-worker-position/);
assert.doesNotMatch(app, /prompt\("작업자 이름"/);
assert.match(app, /lastLoginWorkerId: loadLastLoginWorkerId\(\)/);
assert.match(app, /saveLastLoginWorkerId\(worker\.id\)/);
assert.match(app, /function renderLoginWorkerSelector\(workers, selectedWorker, rememberedWorker, effectiveWorker, disabled\)/);
assert.match(app, /function rememberedLoginWorker\(workers\)/);
assert.match(app, /function workerRoleBadge/);
assert.match(app, /data-login-remember-worker/);
assert.match(app, /data-login-worker-search/);
assert.match(app, /data-login-worker-select/);
assert.match(styles, /\.login-account-strip \{/);
assert.match(styles, /\.login-worker-options-inline \{/);
assert.match(styles, /\.login-worker-role \{[\s\S]*color: #fff;/);
assert.doesNotMatch(app, /호선 추가\/삭제는 수정 모드를 ON으로 전환한 뒤 가능합니다/);
assert.doesNotMatch(app, /수정 모드를 켜면/);
assert.doesNotMatch(app, /관리자 로그인 후 가능합니다/);
assert.ok(app.includes('${value || state.adminMode ? "" : `<span class="ship-date-empty">미입력</span>`}'));
assert.match(app, /const bulkShipAddPanel = state\.adminMode \? `/);
assert.match(app, /<span>호선 일괄 추가<\/span>/);
assert.match(app, /\$\{bulkShipAddPanel\}[\s\S]*<span>호선 정보 카드<\/span>[\s\S]*\$\{adminToggleButton\(\)\}/);
assert.match(styles, /\.ship-date-field \.input \{[\s\S]*width: 100%;[\s\S]*min-width: 0;[\s\S]*max-width: 100%;/);
assert.match(styles, /\.ship-date-field \.input\[type="date"\] \{[\s\S]*font-size: 11px;/);
assert.match(styles, /@media \(max-width: 920px\) \{[\s\S]*\.ship-sort-bar \{[\s\S]*grid-template-columns: minmax\(0, 1fr\) minmax\(112px, 38%\);/);
assert.match(styles, /\.ship-sort-bar \.btn-light \{[\s\S]*grid-column: 1 \/ -1;/);
assert.match(app, /workPrepRegisterOpen: false/);
assert.match(app, /workDate: localDate\(new Date\(\)\)/);
assert.match(app, /function canOpenWorkPrepRegister\(\)/);
assert.match(app, /function openWorkPrepRegister\(\)/);
assert.match(app, /function updateWorkPrepDraftField\(field, value\)/);
assert.match(app, /function saveWorkPrepRegistration\(\)/);
assert.match(app, /function createFreshWorkPrepRegistrationDraft\(previous = \{\}\)/);
assert.match(app, /state\.workPrepDraft = createFreshWorkPrepRegistrationDraft\(draft\)/);
assert.match(app, /state\.workPrepDraft = createFreshWorkPrepRegistrationDraft\(\)/);
assert.doesNotMatch(app, /state\.workPrepDraft = createWorkPrepDraft\(\{ \.\.\.draft, id: saved\.id \}\)/);
assert.match(app, /function renderWorkPrepRegister\(\)/);
assert.match(app, /workPrepRegisterOpen: state\.view === "check" && state\.workPrepRegisterOpen/);
assert.match(app, /data-action="open-work-prep-register"/);
assert.match(screenViews, /data-action="close-work-prep-register"/);
assert.match(app, /data-work-prep-worker/);
assert.match(app, /data-work-prep-tool/);
assert.match(styles, /\.work-prep-entry-card/);
assert.match(styles, /\.work-prep-register-flow/);
assert.match(styles, /\.work-prep-status-strip/);
assert.match(styles, /\.work-prep-register-card-head \{[\s\S]*justify-content: space-between/);
assert.match(styles, /\.work-prep-appearance-badge \{[\s\S]*border-radius: 999px/);
assert.match(styles, /\.work-prep-date-section/);
assert.match(styles, /\.work-prep-record-card/);
assert.match(styles, /\.work-prep-record-title-wrap/);
assert.match(styles, /\.work-prep-record-type-icon/);
assert.match(styles, /\.worker-badge-row/);
assert.match(styles, /\.worker-team-badge/);
assert.match(pushManagementStyles, /\.push-manager-panel/);
assert.match(pushManagementStyles, /\.push-style-option/);
assert.match(pushManagementStyles, /\.push-worker-card/);
assert.match(pushManagementStyles, /\.push-target-send-btn/);
assert.match(screenViews, /class="section-title compact">발송 대상 <span class="small muted">\$\{model\.targetCount\}명<\/span>/);
assert.match(screenViews, /class="btn push-target-send-btn" data-action="send-admin-push"/);
assert.doesNotMatch(app + screenViews, /push-target-summary/);
assert.doesNotMatch(app, /push-send-bar/);
assert.doesNotMatch(app, /알림 등록 \$\{esc\(subscribedWorkers\.length\)\}명/);
assert.doesNotMatch(app, /\$\{esc\(targetWorkers\.length\)\}명 대상/);
assert.doesNotMatch(app, /선택한 작업자에게 즉시 푸시를 발송합니다\./);
assert.match(app, /function inspectionActualDate\(row\) \{[\s\S]*if \(row\?\.date\) return dateOnly\(row\.date\);[\s\S]*return Number\.isNaN\(createdAt\.getTime\(\)\) \? dateOnly\(row\.createdAt\) : localDate\(createdAt\);/);
assert.match(app, /id="unsafePhotoCamera" data-unsafe-photo-input="camera" type="file" accept="image\/\*" capture="environment"/);
assert.match(app, /id="unsafePhotoGallery" data-unsafe-photo-input="gallery" type="file" accept="image\/\*" multiple/);
assert.match(app, /카메라 촬영/);
assert.match(app, /갤러리 선택/);
assert.match(app, /첨부 파일 \$\{files\.length\}장 등록됨/);
assert.match(app, /선택된 파일 없음/);
assert.match(app, /function mergeUnsafePhotoFiles\(files\)/);
assert.match(app, /function removeUnsafePhotoFile\(index\)/);
assert.match(app, /unsafePhotoUploadingIds: \[\]/);
assert.match(app, /function markUnsafePhotoUploading\(issueId, uploading\)/);
assert.match(app, /사진 업로드 중/);
assert.match(app, /await syncUnsafeIssue\(row, files\)/);
assert.match(app, /toast\(`사진 \$\{photos\.length\}장 업로드가 완료되었습니다\.`\)/);
assert.match(app, /function normalizedPhotoFile\(file\)/);
assert.match(app, /fileType: photoMimeType\(file\)/);
assert.match(app, /contentType: photoMimeType\(file\)/);
assert.match(app, /data-retry-photo-file/);
assert.match(app, /function retryPendingPhotoUploadWithFiles\(issueId, selectedFiles\)/);
assert.match(app, /"담당 작업자"/);
assert.match(app, /action: "expand-pledge-worker"/);
assert.match(app, /로그인한 작업자로 자동 접수됩니다/);
assert.match(app, /preloadCachedPledgeSignature\(\);[\s\S]*const submitState = buildCheckSubmitState/);
assert.match(app, /const previousWorker = state\.draft\.worker;/);
assert.match(app, /if \(normalizedWorkerName\(previousWorker\) !== normalizedWorkerName\(state\.draft\.worker\)\) state\.draft\.pledgeSignature = "";/);
assert.match(app, /savePledgeSignatureForWorker\(state\.draft\.worker, state\.draft\.pledgeSignature\)/);
assert.match(app, /DASHBOARD_VIEW\.renderAnalyticsDashboardView\(buildAnalyticsDashboardModel\(\), \{/);
assert.doesNotMatch(app, /최근 활동 · 불안전요소 등록 & 자재누락/);
assert.match(dashboardView, /최근 활동이 없습니다\./);
assert.doesNotMatch(app, /data-analytics-record-kind="\$\{esc\(row\.kind\)\}"/);
assert.doesNotMatch(app, /data-analytics-record-id="\$\{esc\(row\.id\)\}"/);
assert.match(dashboardView, /data-analytics-record-kind="\$\{esc\(row\.kind\)\}"/);
assert.match(dashboardView, /data-analytics-record-id="\$\{esc\(row\.id\)\}"/);
assert.match(app, /function openAnalyticsRecord\(kind, id\)/);
assert.match(app, /DASHBOARD_VIEW\.renderDashboardView\(dashboardModel\(\), \{ sectionHeading, navIcon \}\)/);
assert.match(dashboardView, /<main class="home-v4" aria-labelledby="homeV4Title">/);
assert.match(dashboardView, /<h1 id="homeV4Title">오늘의 안전 운영<\/h1>/);
assert.match(dashboardView, /data-home-sync="\$\{esc\(syncTone\)\}"/);
assert.match(dashboardView, /<section class="home-v4__grid" aria-label="오늘의 안전 업무">/);
assert.match(dashboardView, /불안전요소 <strong>\$\{esc\(unsafeCount\)\}<\/strong>건/);
assert.match(dashboardView, /자재누락 <strong>\$\{esc\(openMaterials\)\}<\/strong>건/);
assert.match(dashboardView, /data-view="manage" data-manage-center-card="operations"/);
assert.match(dashboardView, /data-view="items"/);
assert.doesNotMatch(dashboardView, /unsafeCount \? "즉시 확인" : "접수 없음"/);
assert.doesNotMatch(app, /위험 발견 즉시 접수/);
assert.doesNotMatch(app, /호선 기준으로 요청/);
assert.doesNotMatch(app, /dashboardHistoryHeading/);
assert.match(app, /function renderUnsafeInlineDetail\(row\)/);
assert.match(app, /class="unsafe-inline-detail"/);
assert.match(app, /state\.unsafeDetailId === id \? "" : id/);
assert.match(app, /data-photo-viewer-src="\$\{esc\(url\)\}"/);
assert.match(app, /function renderPhotoViewer\(\)/);
assert.match(app, /function openPhotoViewer\(src, label\)/);
assert.match(app, /function closePhotoViewer\(\)/);
assert.match(app, /const readOnlyTabs = new Set\(\["unsafe", "materials", "safetySettings"\]\)/);
assert.match(app, /const visibleTabs = state\.adminMode \|\| previewAdmin \? tabs : tabs\.filter\(\(\[id\]\) => readOnlyTabs\.has\(id\)\)/);
assert.match(app, /MANAGE_CENTER_VIEW\.renderManageCenterView\(\{/);
assert.match(app, /\["workPrep", "작업지시서"\]/);
assert.match(app, /function renderWorkPrepManager\(\)/);
assert.match(app, /function renderWorkPrepAdminRow\(record, active = false\)/);
assert.match(app, /function renderWorkPrepTypeIcon\(category, className = "work-prep-record-type-icon"\)/);
assert.match(app, /work-prep-admin-type-icon/);
assert.match(app, /categoryVisual\(category\)/);
assert.match(screenViews, /class="work-prep-record-card status-/);
assert.match(screenViews, /class="work-prep-admin-card-main"/);
assert.match(app, /renderWorkPrepAdminTimelineSummary\(record\)/);
assert.match(app, /function renderWorkPrepStatusControl\(record, canEdit\)/);
assert.match(screenViews, /data-work-prep-status="\$\{esc\(model\.recordId\)\}"/);
assert.match(app, /function updateWorkPrepAdminStatus\(recordId, status\)/);
assert.match(app, /updateWorkPrepAdminStatus\(event\.target\.dataset\.workPrepStatus, event\.target\.value\)/);
assert.match(app, /function currentTimelineActorLabel\(fallback = "관리자"\)/);
assert.match(app, /actor: currentTimelineActorLabel\("관리자"\)/);
assert.match(app, /function buildWorkPrepTimeline\(record\)/);
assert.match(app, /function renderWorkPrepTimeline\(record\)/);
assert.match(app, /renderWorkPrepTimeline\(record\)/);
assert.match(app, /buttonLabel[\s\S]*: "점검 대기"/);
assert.match(app, /workPrepDetailId: ""/);
assert.match(app, /deletedWorkPrepRecordIds: loadJson\("deletedWorkPrepRecordIds", \[\]\)/);
assert.match(screenViews, /data-work-prep-record-detail="\$\{esc\(model\.recordId\)\}"/);
assert.match(app, /function renderWorkPrepInlineDetail\(record\)/);
assert.match(app, /function renderWorkPrepDetail\(record\)/);
assert.match(app, /function openWorkPrepDetail\(id\)/);
assert.match(app, /openWorkPrepDetail\(workPrepDetailRow\.dataset\.workPrepRecordDetail\)/);
assert.match(screenViews, /data-action="back-work-prep-list"/);
assert.match(app, /workPrep: state\.manageTab === "workPrep" \? renderWorkPrepManager\(\) : ""/);
assert.match(app, /"edit-work-prep-record": \(\) => openWorkPrepRecordForEdit\(workPrepRecordId\(\)\)/);
assert.match(app, /workPrepFilters: loadJson\("workPrepFilters", \{ shipNo: "", status: "", sort: "latest" \}\)/);
assert.match(screenViews, /data-record-filter="workPrep:shipNo"/);
assert.match(app, /data-record-filter="workPrep:status"/);
assert.doesNotMatch(app, /data-record-filter="workPrep:sort"/);
assert.match(app, /function filterWorkPrepRecords\(records, filters = \{\}\)/);
assert.match(app, /function workPrepParticipantNameSummary\(record\)/);
assert.match(app, /function renderWorkPrepToolBadges\(toolNames\)/);
assert.doesNotMatch(app, /<div class="manage-tabs" role="tablist" aria-label="관리 탭">/);
assert.match(dashboardView, /function renderManageShellView\(model = \{\}\)/);
assert.match(dashboardView, /<div class="manage-tabs" role="tablist" aria-label="관리 탭">/);
assert.match(dashboardView, /<div class="manage-workspace">/);
assert.match(dashboardView, /activeTab === "workPrep" \? panels\.workPrep \|\| "" : ""/);
assert.match(app, /DASHBOARD_VIEW\.renderUnsafeRecordCardView\(\{/);
assert.match(app, /DASHBOARD_VIEW\.renderMaterialRecordCardView\(\{/);
assert.match(dashboardView, /function renderUnsafeRecordCardView\(model = \{\}\)/);
assert.match(dashboardView, /data-unsafe-record-detail="\$\{esc\(id\)\}"/);
assert.match(app, /DASHBOARD_VIEW\.renderUnsafeDetailView\(\{/);
assert.doesNotMatch(app, /<section class="panel panel-pad unsafe-detail">/);
assert.match(dashboardView, /function renderUnsafeDetailView\(model = \{\}\)/);
assert.match(dashboardView, /<section class="panel panel-pad unsafe-detail">/);
assert.match(dashboardView, /function renderUnsafeDetailPhotoBlock\(model = \{\}\)/);
assert.match(dashboardView, /function renderMaterialRecordCardView\(model = \{\}\)/);
assert.match(app, /function renderMaterialInlineDetail\(row\)/);
assert.match(app, /function renderMaterialProcessingDetail\(row\)/);
assert.match(app, /DASHBOARD_VIEW\.renderMaterialDetailView\(\{/);
assert.match(app, /state\.materialDetailId === id \? "" : id/);
assert.match(app, /<div class="material-row \$\{active \? "active" : ""\}" data-material-record-detail="\$\{esc\(row\.id\)\}"/);
assert.match(app, /const materialCard = event\.target\.closest\("\[data-material-record-detail\]"\)/);
assert.match(app, /openMaterialDetail\(materialCard\.dataset\.materialRecordDetail\)/);
assert.doesNotMatch(app, /type="button">상세 →<\/button>/);
assert.match(dashboardView, /function renderMaterialDetailView\(model = \{\}\)/);
assert.match(dashboardView, /<section class="panel panel-pad material-detail">/);
assert.match(app, /DASHBOARD_VIEW\.renderHistoryLoadMoreView\(\{/);
assert.doesNotMatch(app, /data-action="load-more-history" type="button">더 보기/);
assert.match(dashboardView, /function renderHistoryLoadMoreView\(model = \{\}\)/);
assert.match(dashboardView, /data-action="load-more-history" type="button">더 보기/);
assert.match(app, /DASHBOARD_VIEW\.renderHistoryTableView\(\{/);
assert.doesNotMatch(app, /data-history-detail-card="\$\{esc\(row\.id\)\}"/);
assert.doesNotMatch(app, /data-history-scope="\$\{id\}"/);
assert.doesNotMatch(app, /data-history-filter="\$\{id\}"/);
assert.match(dashboardView, /function renderHistoryTableView\(model = \{\}\)/);
assert.match(dashboardView, /<div class="history-list">/);
assert.match(dashboardView, /class="history-list-card"/);
assert.match(dashboardView, /data-history-detail-card="\$\{esc\(row\.id\)\}"/);
assert.match(dashboardView, /history-worker-badge/);
assert.match(dashboardView, /history-list-status-stack/);
assert.match(app + screenViews, /data-action="bulk-material-status" \$\{model\.canEdit \? "" : "disabled"\}/);
assert.match(app, /data-record-status="\$\{esc\(token\)\}" \$\{canEdit \? "" : "disabled"\}/);
assert.match(app, /const filterPanelRows = ISSUE_MATERIAL_RULES\.filterRecords\(state\.missingMaterials, \{ \.\.\.state\.materialFilters, shipNo: "" \}\)/);
assert.match(app, /const filterGroups = ISSUE_MATERIAL_RULES\.groupMaterialsByShip/);
assert.doesNotMatch(app, /월간 작업자 점검 현황/);
assert.match(dashboardView, /월간 작업자 점검 현황/);
assert.match(app, /function currentMonthRange\(/);
assert.match(app, /function monthlyWorkerInspectionStats\(/);
assert.doesNotMatch(app, /attentionWorkers/);
assert.match(app, /visiblePledgeAnalyticsWorkers\(\)\.forEach\(\(worker\) =>/);
assert.doesNotMatch(app, /기록 기반/);
// recent 활동 필터는 analytics-model.js로 이동 (isVisibleWorkerName으로 주입)
const analyticsModelJs = read("assets/js/analytics-model.js");
assert.match(analyticsModelJs, /\]\.filter\(\(row\) => isVisibleWorkerName\(row\.worker\)\)\.sort/);
assert.match(app, /isVisibleWorkerName: visiblePledgeAnalyticsWorkerName/);
assert.match(app, /function workerDayInspectionStatus\(workerName, date\)/);
// 월간 작업자 점검 의무: 해당 일 작업지시서 참여자만 대상(누락 가능), 분류는 analytics-model의 순수 함수로 위임
assert.match(app, /function workerHasWorkPrepObligation\(workerName, date\)/);
assert.match(app, /ANALYTICS_MODEL\.monthlyWorkerDayStatus\(/);
assert.match(app, /hasObligation: workerHasWorkPrepObligation\(workerName, date\)/);
assert.match(analyticsModelJs, /function monthlyWorkerDayStatus\(rawInput\)/);
assert.match(app, /function buildMonthlyWorkerAnalyticsModel\(/);
assert.match(app, /function renderMonthlyWorkerAnalytics\(/);
assert.match(app, /DASHBOARD_VIEW\.renderMonthlyWorkerAnalyticsView\(buildMonthlyWorkerAnalyticsModel\(\), \{ analyticsKpi \}\)/);
assert.doesNotMatch(app, /function renderWorkerHeatmapCell\(status/);
assert.doesNotMatch(app, /function renderMonthlyWorkerCalendar\(worker, range\)/);
assert.doesNotMatch(app, /function renderMonthlyWorkerCard\(worker, range, expanded\)/);
assert.doesNotMatch(app, /function renderMonthlyWorkerCardColumns\(workers, range, expandedWorkers\)/);
assert.doesNotMatch(app, /function renderMonthlyWorkerMonthMeta\(monthText\)/);
assert.match(dashboardView, /function renderWorkerHeatmapCell\(status/);
assert.match(dashboardView, /function renderMonthlyWorkerCalendar\(worker = \{\}, range = \{\}\)/);
assert.match(dashboardView, /function renderMonthlyWorkerCard\(worker = \{\}, range = \{\}\)/);
assert.match(dashboardView, /function renderMonthlyWorkerCardColumns\(workers = \[\], range = \{\}\)/);
assert.match(dashboardView, /function renderMonthlyWorkerMonthMeta\(monthText, monthHighlight = false\)/);
assert.match(app, /monthlyWorkerMonthHighlight/);
assert.match(app, /monthlyWorkerMonthHighlightTimer/);
assert.doesNotMatch(app, /data-monthly-worker-toggle="\$\{esc\(key\)\}"/);
assert.match(dashboardView, /data-monthly-worker-toggle="\$\{esc\(worker\.key \|\| worker\.name \|\| ""\)\}"/);
assert.match(app, /toggleMonthlyWorkerCard\(button\.dataset\.monthlyWorkerToggle\)/);
assert.doesNotMatch(app, /function renderMonthlyRestDaySettings\(/);
assert.match(dashboardView, /function renderMonthlyRestDaySettingsView\(restPanel = \{\}\)/);
assert.match(app, /function koreanPublicHolidayInfo\(date\)/);
assert.match(app, /function isMonthlyRestDay\(date\)/);
assert.match(app, /function toggleMonthlyPublicHolidayMode\(/);
assert.match(app, /function addCustomMonthlyRestDay\(date\)/);
assert.match(app, /function deleteCustomMonthlyRestDay\(date\)/);
assert.match(app, /function exportMonthlyWorkerAnalytics\(/);
assert.match(app, /monthlyWorkerRestDays/);
assert.doesNotMatch(app, /data-export-records="monthly-worker-analytics"/);
assert.match(dashboardView, /data-export-records="monthly-worker-analytics"/);
assert.match(app, /monthly-worker-inspections-\$\{stats\.range\.monthKey\}\.xlsx/);
assert.match(app, /createXlsxBlob\("월간작업자점검"/);
assert.doesNotMatch(app, /현장 휴무 추가/);
assert.match(dashboardView, /휴무 설정/);
assert.match(dashboardView, /현장 휴무 추가/);
assert.doesNotMatch(app, /<span>위험도<\/span><span>액션<\/span>/);

const css = read("assets/css/styles-v2.css");
assert.match(css, /--safe-area-bottom/);
assert.match(css, /grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/);
assert.match(css, /\.category-tool-picker/);
assert.match(css, /\.category-tool-options/);
assert.match(css, /\.category-tool-assignment-panel/);
assert.match(css, /\.category-tool-assignment-row/);
assert.match(css, /\.category-tool-summary/);
assert.match(css, /\.category-tool-chip/);
assert.match(css, /\.category-tool-toggle-image/);
assert.match(css, /\.category-edit-panel/);
assert.match(css, /\.tool-manager-summary/);
assert.match(css, /\.tool-manager-body/);
assert.match(css, /\.tool-admin-grid > \.empty/);
assert.match(css, /\.analytics-row\[data-analytics-record-id\]/);
assert.match(css, /\.home-version-badge/);
assert.match(css, /\.home-version-badge\.online \.sync-dot[\s\S]*background: #4ade80/);
assert.match(css, /\.home-version-badge\.pending \.sync-dot[\s\S]*background: #fbbf24/);
assert.match(css, /\.home-version-badge\.error \.sync-dot[\s\S]*background: #fb7185/);
assert.match(css, /\.photo-retry-actions/);
assert.match(css, /\.photo-retry-input/);
assert.match(css, /\.unsafe-photo-actions/);
assert.match(css, /\.unsafe-photo-status/);
assert.match(css, /\.unsafe-photo-chip/);
assert.match(css, /body\.login-required \.app[\s\S]*linear-gradient\(135deg, #07162f 0%, #0f3d3a 100%\)/);
assert.match(css, /body\.login-required \.app[\s\S]*display: block !important/);
assert.match(css, /body\.login-required \.sidebar,[\s\S]*body\.login-required \.desktop-preview-toggle[\s\S]*display: none !important/);
assert.match(css, /body\.login-required \.main[\s\S]*padding: 0 !important/);
assert.match(css, /\.unsafe-inline-detail/);
assert.match(css, /body\.screen-mobile \.unsafe-inline-detail \.unsafe-photo-grid/);
assert.match(css, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\) !important/);
assert.match(css, /\.photo-viewer-overlay/);
assert.match(css, /height: min\(50vh, 430px\)/);
assert.match(pushManagementStyles, /\.push-template-overlay/);
assert.match(pushManagementStyles, /\.push-template-panel/);
assert.match(pushManagementStyles, /\.push-template-preview/);
assert.match(css, /\.pledge-notify-actions/);
assert.match(css, /\.worker-meta-line/);
assert.match(css, /\.worker-list \{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
assert.match(css, /body\.screen-mobile \.worker-list,[\s\S]*body\.preview-mobile \.worker-list \{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(css, /\.worker-edit-grid/);
assert.match(css, /\.worker-push-badge/);
assert.match(css, /\.worker-push-badge\.is-registered/);
assert.match(css, /\.worker-push-badge\.is-empty/);
assert.match(pushManagementStyles, /\.push-device-overlay/);
assert.match(pushManagementStyles, /\.push-device-row/);
assert.match(pushManagementStyles, /\.push-device-actions/);
assert.match(css, /body\.screen-mobile \.ops-status-grid \.stat-icon[\s\S]*width: 68px/);
assert.match(css, /body\.screen-mobile \.ops-status-grid \.stat-icon svg[\s\S]*width: 40px/);
assert.match(css, /body\.screen-mobile \.ops-status-grid \.stat-pill[\s\S]*min-height: 92px/);
assert.match(css, /"icon foot"/);
assert.match(css, /body\.screen-mobile \.ops-status-grid \.stat-label[\s\S]*white-space: nowrap/);
assert.match(css, /body\.screen-mobile \.ops-status-grid \.stat-label[\s\S]*transform: translateY\(4px\)/);
assert.match(css, /body\.screen-mobile \.ops-status-grid \.stat-value[\s\S]*transform: translateY\(10px\)/);
assert.match(css, /data-stat-scope="delivery"\] \.stat-foot[\s\S]*font-size: 75%/);
assert.match(css, /\.ops-status-grid \.stat-foot\.is-empty[\s\S]*visibility: hidden/);
assert.match(css, /\.ops-status-grid \.stat-pill \.stat-icon,[\s\S]*width: 54px/);
assert.match(css, /\.ops-status-grid \.stat-pill \.stat-icon svg,[\s\S]*width: 30px/);
assert.match(css, /\.ops-process-card \.mini-process[\s\S]*grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)[\s\S]*overflow-x: hidden/);
assert.match(css, /\.sidebar-session-panel[\s\S]*border: 1px solid rgba\(255,255,255,\.18\)[\s\S]*border-radius: var\(--radius\)/);
assert.match(css, /\.sync-badge[\s\S]*justify-content: space-between/);
assert.match(css, /\.sync-status-copy[\s\S]*display: inline-flex/);
assert.match(css, /\.sidebar-worker-session[\s\S]*border-top: 1px solid rgba\(255,255,255,\.13\)/);
assert.match(css, /\.sidebar-worker-session strong,[\s\S]*\.sidebar-worker-session span[\s\S]*display: block/);
assert.match(css, /body\.screen-mobile \.ops-process-card \.mini-process[\s\S]*grid-auto-flow: row/);
assert.match(css, /body\.screen-mobile \.ops-process-card \.mini-stage \.small[\s\S]*font-size: 15px[\s\S]*white-space: nowrap/);
assert.match(css, /\.bottom-nav \.nav-btn[\s\S]*font-size: 14px[\s\S]*white-space: nowrap/);
assert.match(css, /\.bottom-nav \.nav-icon[\s\S]*width: 38\.5px/);
assert.match(css, /\.bottom-nav \.nav-icon svg[\s\S]*width: 29px/);
assert.match(css, /\.material-board \.material-kpi-grid/);
assert.match(css, /\.material-board \.material-kpi\.active/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-analytics/);
assert.doesNotMatch(app, /monthly-worker-attention/);
assert.doesNotMatch(monthlyWorkerStyles, /monthly-worker-attention/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-card-list/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-card-column/);
assert.match(monthlyWorkerStyles, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-month-label\.is-highlight/);
assert.match(monthlyWorkerStyles, /@keyframes monthlyMonthPulse/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-card-item/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-calendar-grid/);
assert.match(monthlyWorkerStyles, /grid-template-columns: repeat\(7, minmax\(0, 1fr\)\)/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-calendar-cell\.done/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-calendar-cell\.partial/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-calendar-cell\.missing/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-calendar-cell\.rest/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-calendar-cell\.excluded/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-cell\.done/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-cell\.partial/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-cell\.missing/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-cell\.rest/);
assert.match(monthlyWorkerStyles, /\.monthly-worker-cell\.excluded/);
assert.match(css, /\.pictogram-image-fallback/);
assert.doesNotMatch(css, /\.not-found-/);
assert.doesNotMatch(css, /\.signature-/);
assert.doesNotMatch(css, /\.disabled-reason-/);
assert.doesNotMatch(css, /\.push-template-/);
assert.doesNotMatch(css, /\.push-device-/);
assert.doesNotMatch(css, /\.push-manager-/);
assert.doesNotMatch(css, /\.push-worker-/);
assert.doesNotMatch(css, /\.monthly-/);
assert.doesNotMatch(css, /(^|\n)\s*\.table\s*\{/);
assert.doesNotMatch(css, /(^|\n)\s*\.table th,/);
assert.doesNotMatch(css, /(^|\n)\s*\.table td\b/);
assert.doesNotMatch(css, /body\.preview-mobile \.table/);
assert.doesNotMatch(css, /body\.preview-desktop \.table/);
assert.doesNotMatch(css, /body:not\(\.preview-mobile\) \.table/);
assert.match(notFoundStyles, /\.not-found-page/);
assert.match(notFoundStyles, /\.not-found-main/);
assert.match(notFoundStyles, /\.not-found-message/);
assert.match(signatureStyles, /\.signature-pad/);
assert.match(signatureStyles, /\.signature-pad-placeholder/);
assert.match(signatureStyles, /\.signature-history img/);
assert.match(pushManagementStyles, /\.push-template-overlay/);
assert.match(pushManagementStyles, /\.push-device-overlay/);
assert.match(pushManagementStyles, /\.push-manager-grid/);
assert.match(pushManagementStyles, /\.push-worker-card/);
assert.match(monthlyWorkerStyles, /\.monthly-rest-panel/);
assert.match(monthlyWorkerStyles, /@media \(max-width: 920px\)/);
assert.match(monthlyWorkerStyles, /@media \(max-width: 520px\)/);
assert.match(tableStyles, /\.table \{/);
assert.match(tableStyles, /\.table th,/);
assert.match(tableStyles, /body\.preview-mobile \.table/);
assert.match(tableStyles, /body:not\(\.preview-mobile\) \.table/);
assert.match(tableStyles, /body\.preview-desktop \.table/);
assert.match(disabledReasonStyles, /\.disabled-reason-wrap/);
assert.match(disabledReasonStyles, /\.disabled-reason-wrap\[data-disabled-reason\]::after/);
assert.match(disabledReasonStyles, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(disabledReasonStyles, /@media \(max-width: 920px\)/);

const sw = read("sw.js");
assert.match(sw, /const APP_VERSION = "1\.13\.0-20260826-v4"/);
assert.match(sw, /const ASSET_TOKEN = "20260826-v4-1"/);
assert.match(sw, /const CACHE = `gs-safety-\$\{ASSET_TOKEN\}`/);
assert.match(sw, /styles-v2\.min\.css\?v=\$\{ASSET_TOKEN\}/);
assert.match(sw, /20-component-table\.min\.css\?v=\$\{ASSET_TOKEN\}/);
assert.match(sw, /30-feature-not-found\.min\.css\?v=\$\{ASSET_TOKEN\}/);
assert.match(sw, /30-feature-signature\.min\.css\?v=\$\{ASSET_TOKEN\}/);
assert.match(sw, /30-feature-push-management\.min\.css\?v=\$\{ASSET_TOKEN\}/);
assert.match(sw, /30-feature-monthly-worker\.min\.css\?v=\$\{ASSET_TOKEN\}/);
assert.match(sw, /20-component-disabled-reason\.min\.css\?v=\$\{ASSET_TOKEN\}/);
assert.match(sw, /xlsx-helpers\.min\.js\?v=\$\{ASSET_TOKEN\}/);
assert.match(sw, /analytics-model\.min\.js\?v=\$\{ASSET_TOKEN\}/);
assert.match(sw, /ship-import-rules\.min\.js\?v=\$\{ASSET_TOKEN\}/);
assert.match(sw, /app-v2\.min\.js\?v=\$\{ASSET_TOKEN\}/);
RUNTIME_MODULES.forEach((name) => {
  assert.match(sw, new RegExp(`${name}\\.min\\.js\\?v=\\$\\{ASSET_TOKEN\\}`), `service worker should cache ${name}`);
});
assert.match(sw, /self\.addEventListener\("push"/);
assert.match(sw, /self\.registration\.showNotification/);
assert.match(sw, /self\.addEventListener\("notificationclick"/);
assert.match(sw, /self\.addEventListener\("message"/);
assert.match(sw, /GS_SW_VERSION/);
assert.match(sw, /renotify: data\.renotify !== false/);
assert.match(sw, /requireInteraction: Boolean\(data\.requireInteraction\)/);
assert.match(sw, /Array\.isArray\(data\.vibrate\)/);
assert.match(sw, /style: data\.style \|\| "notice"/);
assert.match(sw, /if \(\s*\/\\\.\(css\|js\)\$\/\.test\(requestUrl\.pathname\)\s*\)/);
assert.match(sw, /fetch\(event\.request\)[\s\S]+cache\.put\(event\.request, copy\)/);
const swShellAssets = Array.from(sw.matchAll(/"([^"]+)"/g))
  .map((match) => match[1])
  .filter((asset) => asset.startsWith("/assets/"))
  .map((asset) => asset.split("?")[0].replace(/^\//, ""));
swShellAssets.forEach((asset) => {
  assert.ok(fs.existsSync(path.join(root, asset)), `service worker shell asset should exist: ${asset}`);
});

const bucketMigration = read("supabase/migrations/20260522004013_create_issue_photos_bucket.sql");
assert.match(bucketMigration, /insert into storage\.buckets/);
assert.match(bucketMigration, /'issue-photos'/);

const storagePolicyMigration = read("supabase/migrations/20260522004144_tighten_issue_photos_storage_policies.sql");
assert.match(storagePolicyMigration, /create policy "issue_photos_insert_public"/);
assert.match(storagePolicyMigration, /create policy "issue_photos_delete_public"/);

const pictogramStorageMigration = read("supabase/migrations/20260528001000_safety_pictograms_storage_metadata.sql");
assert.match(pictogramStorageMigration, /'safety-pictograms'/);
assert.match(pictogramStorageMigration, /add column if not exists storage_bucket text/i);
assert.match(pictogramStorageMigration, /add column if not exists storage_path text/i);

const workerPositionMigration = read("supabase/migrations/20260522082035_add_worker_position.sql");
assert.match(workerPositionMigration, /add column if not exists position text not null default '작업자'/);

const pushMigration = read("supabase/migrations/20260523181216_worker_push_subscriptions.sql");
assert.match(pushMigration, /create table if not exists public\.worker_push_subscriptions/);
assert.match(pushMigration, /alter table public\.worker_push_subscriptions enable row level security/);
assert.match(pushMigration, /create index if not exists worker_push_subscriptions_worker_idx/);
assert.match(pushMigration, /create or replace function public\.worker_push_subscription_status/);

const workerDeleteMigration = read("supabase/migrations/20260527071140_revoke_workers_delete.sql");
assert.match(workerDeleteMigration, /revoke delete on table public\.workers from public, anon, authenticated/);
assert.match(workerDeleteMigration, /drop policy if exists "workers public delete" on public\.workers/);

const realtimeMigration = read("supabase/migrations/20260527071213_enable_realtime_remote_tables.sql");
assert.match(realtimeMigration, /create publication supabase_realtime/);
assert.match(realtimeMigration, /alter publication supabase_realtime add table/);
[
  "safety_categories",
  "safety_sections",
  "safety_items",
  "safety_tools",
  "safety_pictograms",
  "safety_ships",
  "safety_inspections",
  "safety_inspection_items",
  "workers",
  "unsafe_issues",
  "missing_materials",
  "issue_photos",
  "work_prep_records",
].forEach((table) => {
  assert.match(realtimeMigration, new RegExp(`'${table}'`), `${table} should be in the realtime publication migration`);
});

const pushFunction = read("supabase/functions/worker-push/index.ts");
assert.match(pushFunction, /import webpush from "npm:web-push@3\.6\.7"/);
assert.match(pushFunction, /Deno\.env\.get\("SUPABASE_SERVICE_ROLE_KEY"\)/);
assert.match(pushFunction, /action === "register"/);
assert.match(pushFunction, /action === "verifyWorker"/);
assert.match(pushFunction, /action === "status"/);
assert.match(pushFunction, /action === "devices"/);
assert.match(pushFunction, /action === "updateDevice"/);
assert.match(pushFunction, /action === "deleteDevice"/);
assert.match(pushFunction, /action === "send"/);
assert.match(pushFunction, /subscriptionStatus/);
assert.match(pushFunction, /verifyWorkerLogin/);
assert.match(pushFunction, /subscriptionDevices/);
assert.match(pushFunction, /updateSubscriptionDevice/);
assert.match(pushFunction, /deleteSubscriptionDevice/);
assert.match(pushFunction, /sendNotification/);
assert.match(pushFunction, /unsafe_push_target/);
assert.match(pushFunction, /function canSendPledgeNotifications/);

const pictogramImageFunction = read("supabase/functions/pictogram-image/index.ts");
assert.match(pictogramImageFunction, /storage_bucket,storage_path,mime_type,src/);
assert.match(pictogramImageFunction, /supabase\.storage\.from\(bucket\)\.download\(storagePath\)/);
assert.match(pictogramImageFunction, /parseDataUrl/);
assert.match(pushFunction, /async function verifiedSender/);
assert.match(pushFunction, /async function authorizeSendRequest/);
assert.match(pushFunction, /senderWorkerId/);
assert.match(pushFunction, /senderEmployeeNo/);
assert.match(pushFunction, /sendKind/);
assert.match(pushFunction, /sendKind === "pledgePending" \|\| sendKind === "adminManual"/);
assert.match(pushFunction, /forbidden_send_kind/);
assert.match(pushFunction, /style: cleanText\(notificationRaw\.style, 40\)/);
assert.match(pushFunction, /requireInteraction: booleanValue\(notificationRaw\.requireInteraction, false\)/);
assert.match(pushFunction, /renotify: booleanValue\(notificationRaw\.renotify, true\)/);
assert.match(pushFunction, /vibrate: Array\.isArray\(notificationRaw\.vibrate\)/);

const vercel = JSON.parse(read("vercel.json"));
const rewrites = vercel.rewrites.map((row) => row.source);
["/checklist", "/check", "/history", "/admin", "/manage", "/ships", "/items", "/unsafe", "/materials", "/pledge", "/analytics"].forEach((route) => {
  assert.ok(rewrites.includes(route), `${route} rewrite should exist`);
});
const headerSources = vercel.headers.map((row) => row.source);
assert.ok(headerSources.includes("/sw.js"), "sw.js should have an explicit no-cache header");
assert.ok(headerSources.includes("/index.html"), "index.html should have an explicit no-cache header");
assert.ok(JSON.stringify(vercel.headers).includes("no-cache, no-store, must-revalidate"), "HTML and service worker should bypass stale HTTP caches");
assert.ok(JSON.stringify(vercel.headers).includes("yuuroocvxvzgmsdeeiws.supabase.co"), "CSP should reference the active Supabase project");
assert.ok(!JSON.stringify(vercel.headers).includes("psatbyktzladtymdygwh.supabase.co"), "CSP should not reference the old Supabase project");
assert.ok(!JSON.stringify(vercel.headers).includes("cdn.jsdelivr.net"), "CSP should not allow the removed Supabase CDN host");

console.log("static recovery tests passed");
