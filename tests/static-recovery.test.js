const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

[
  "index.html",
  "manifest.json",
  "sw.js",
  "assets/css/styles-v2.css",
  "assets/js/app-v2.js",
  "assets/js/vendor/supabase-js-2.105.3.min.js",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "supabase/migrations/202605240001_worker_push_subscriptions.sql",
  "supabase/migrations/20260525151649_enable_realtime_remote_tables.sql",
  "supabase/functions/worker-push/index.ts",
  "supabase/functions/worker-push/deno.json",
].forEach((file) => {
  assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
});

const html = read("index.html");
assert.match(html, /viewport-fit=cover/);
assert.match(html, /assets\/css\/styles-v2\.css\?v=20260526-worker-push-workprep-1/);
assert.match(html, /assets\/js\/vendor\/supabase-js-2\.105\.3\.min\.js/);
assert.match(html, /assets\/js\/app-v2\.js\?v=20260526-worker-push-workprep-1/);
assert.match(html, /navigator\.serviceWorker\.register\("\/sw\.js"\)/);
assert.match(html, /id="homeVersionLabel"/);
assert.match(html, /version 0\.6/);
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
  assert.match(page, /assets\/css\/styles-v2\.css\?v=20260526-worker-push-workprep-1/, `${file} should use v2 styles with cache busting`);
  assert.match(page, /assets\/js\/vendor\/supabase-js-2\.105\.3\.min\.js/, `${file} should use the local Supabase vendor bundle`);
  assert.match(page, /assets\/js\/app-v2\.js\?v=20260526-worker-push-workprep-1/, `${file} should use the v2 app runtime with cache busting`);
  assert.match(page, /id="homeVersionLabel"/, `${file} should use the current mobile header version badge`);
  assert.match(page, /home-date-row/, `${file} should use the current mobile home date layout`);
  assert.match(page, /version 0\.6/, `${file} should use the current static fallback version label`);
  assert.doesNotMatch(page, /assets\/css\/styles\.css/, `${file} should not use legacy styles`);
  assert.doesNotMatch(page, /assets\/js\/app\.js/, `${file} should not use legacy app runtime`);
  assert.doesNotMatch(page, /version 0\.3/, `${file} should not use the stale static fallback version label`);
  assert.doesNotMatch(page, /cdn\.jsdelivr\.net/, `${file} should not use remote CDN assets`);
  assert.doesNotMatch(page, /psatbyktzladtymdygwh\.supabase\.co/, `${file} should not reference the old Supabase project`);
});

const notFound = read("404.html");
assert.match(notFound, /assets\/css\/styles-v2\.css\?v=20260526-worker-push-workprep-1/);
assert.doesNotMatch(notFound, /assets\/css\/styles\.css/);
const redesignPreview = read("redesign-v2.html");
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

const app = read("assets/js/app-v2.js");
const styles = read("assets/css/styles-v2.css");
assert.match(app, /const APP_VERSION = "0\.6-20260526"/);
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
assert.match(app, /dataUrl: pendingPhotoDataUrlForStorage\(row\.dataUrl\)/);
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
assert.match(app, /results\.forEach\(\(\{ key, rows \}\) => applyRemoteTableRows\(key, rows\)\)/);
assert.match(app, /pullRemote\(\{ force: true \}\)/);
assert.match(app, /function startRemoteRealtime\(\)/);
assert.match(app, /\.channel\("gs-safety-remote-sync"\)/);
assert.match(app, /"postgres_changes"/);
assert.match(app, /REMOTE_TABLES\.forEach\(\(config\) => \{/);
assert.match(app, /table: config\.table/);
assert.match(app, /function remoteRealtimeConnected\(\)/);
assert.match(app, /function stopRemotePolling\(\)/);
assert.match(app, /function startRemotePolling\(\)/);
assert.match(app, /state\.remotePollTimer \|\| remoteRealtimeConnected\(\)/);
assert.match(app, /if \(remoteRealtimeConnected\(\)\) \{\s*stopRemotePolling\(\);/);
assert.match(app, /if \(status === "SUBSCRIBED"\) \{\s*stopRemotePolling\(\);/);
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
assert.match(app, /version \$\{String\(APP_VERSION\)\.split\("-"\)\[0\]\}/);
assert.match(app, /pendingSyncQueue: normalizePendingSyncQueue\(loadJson\("pendingSyncQueue", \[\]\)\)/);
assert.match(app, /function enqueueSyncRows\(key, rows\)/);
assert.match(app, /async function flushPendingSyncQueue\(\)/);
assert.match(app, /async function persistAndSync\(keys = null\)/);
assert.match(app, /syncInspectionHistory\(inspection, inspectionItems\);/);
assert.match(app, /Date\.now\(\) - state\.lastRemotePullAt < REMOTE_PULL_THROTTLE_MS/);
assert.match(app, /\{ id: "pledge", label: "서약"/);
assert.match(app, /\{ id: "analytics", label: "통계"/);
assert.match(app, /const MOBILE_NAV_IDS = new Set\(\["dashboard", "check", "ships", "history", "items"\]\)/);
assert.match(app, /return NAV\.filter\(\(nav\) => MOBILE_NAV_IDS\.has\(nav\.id\)\)/);
assert.match(app, /function renderCategoryToolPicker\(\{ groupId, selectedIds \}\)/);
assert.match(app, /function renderCategoryToolAssignments\(\)/);
assert.match(app, /function renderCategoryToggleImage\(expanded, cat\)/);
assert.match(app, /function renderCategoryEditPanel\(cat\)/);
assert.match(app, /function renderCategoryToolSummary\(toolIds\)/);
assert.match(app, /toolManagerOpen: false/);
assert.match(app, /function renderToolManagerShell\(\)/);
assert.match(app, /data-action="toggle-tool-manager"/);
assert.match(app, /function toggleCategoryTools\(id\)/);
assert.match(app, /function selectedCategoryToolIds\(groupId\)/);
assert.match(app, /function selectedEditCategoryColor\(id, fallback\)/);
assert.match(app, /function categoryAllowedToolIds\(categoryId\)/);
assert.match(app, /function visibleToolsForCategory\(categoryId\)/);
const renderItemsDefaultView = app.slice(app.indexOf("function renderItems()"), app.indexOf("const cat = categoryById(state.manageCategoryId);"));
const toolManagerIndex = renderItemsDefaultView.indexOf("${renderToolManagerShell()}");
const sectionGuideIndex = renderItemsDefaultView.indexOf("섹션/점검 항목 관리");
const categoryToolIndex = renderItemsDefaultView.indexOf("category-tool-assignment-panel");
assert.ok(toolManagerIndex !== -1, "items view should include the tool manager panel");
assert.ok(sectionGuideIndex !== -1, "items view should include the section/item guide panel");
assert.ok(categoryToolIndex !== -1, "items view should include the unified category management panel");
assert.ok(toolManagerIndex < sectionGuideIndex, "section/item guide should follow the tool manager");
assert.ok(sectionGuideIndex < categoryToolIndex, "category management should follow the section/item guide");
assert.match(app, /tool_ids: sanitizeToolIds\(row\.toolIds\)/);
assert.match(app, /toolIds: sanitizeToolIds\(row\.tool_ids\)/);
assert.match(app, /data-save-category-tools="\$\{esc\(cat\.id\)\}"/);
assert.match(app, /data-toggle-category-tools="\$\{esc\(cat\.id\)\}"/);
assert.match(app, /data-edit-category-color-id="\$\{esc\(cat\.id\)\}"/);
assert.match(app, /data-edit-category-color="\$\{color\}"/);
assert.match(app, /data-save-category="\$\{esc\(cat\.id\)\}"/);
assert.match(app, /if \(button\.dataset\.saveCategoryTools\) saveCategoryTools\(button\.dataset\.saveCategoryTools\)/);
assert.match(app, /const categoryToolRow = event\.target\.closest\("\.category-tool-assignment-row\[data-toggle-category-tools\]"\)/);
assert.match(app, /function saveCategoryTools\(id\)/);
assert.match(app, /categoryToolDrafts: \{\}/);
assert.match(app, /function categoryToolDraftIds\(categoryId, fallbackIds = \[\]\)/);
assert.match(app, /function updateCategoryToolDraft\(groupId, toolId, checked\)/);
assert.match(app, /categoryToolDraftIds\(cat\.id, cat\.toolIds\)/);
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
assert.match(app, /작업 유형 관리/);
assert.match(app, /"\/checklist": "check"/);
assert.match(app, /"\/admin": "manage"/);
assert.match(app, /createdAtMs: Date\.now\(\)/);
assert.match(app, /const PLEDGE_SIGNATURE_CACHE_KEY = "pledgeSignatureCache"/);
assert.match(app, /function signatureCacheDateKey\(\)/);
assert.match(app, /function cachedPledgeSignatureForWorker\(workerName\)/);
assert.match(app, /function savePledgeSignatureForWorker\(workerName, signature\)/);
assert.match(app, /const HIDDEN_PLEDGE_ANALYTICS_WORKER_IDS = new Set\(\["worker_001", "worker_002", "worker_007", "worker_013"\]\)/);
assert.match(app, /const HIDDEN_PLEDGE_ANALYTICS_WORKER_NAMES = new Set\(\["김광수", "허지원", "김준혁", "김경제"\]\)/);
assert.match(app, /function visiblePledgeAnalyticsWorkers\(\)/);
assert.match(app, /function visiblePledgeAnalyticsWorkerName\(name\)/);
assert.match(app, /function preloadCachedPledgeSignature\(\)/);
assert.match(app, /function browserNotificationsAvailable\(\)/);
assert.match(app, /async function ensureBrowserNotificationPermission\(\)/);
assert.match(app, /function showBrowserNotification\(title, options = \{\}\)/);
assert.match(app, /async function notifyPledgePendingWorkers\(\)/);
assert.match(app, /async function notifyUnsafeIssueRegistered\(row\)/);
assert.match(app, /const PUSH_VAPID_PUBLIC_KEY = "/);
assert.match(app, /const UNSAFE_PUSH_TARGET_WORKER_NAMES = \["허지원", "김준혁", "김경제"\]/);
assert.match(app, /const PUSH_TEST_NOTIFICATION_DISABLE_AT = Date\.parse\("2026-05-26T11:59:00\+09:00"\)/);
assert.match(app, /const DEFAULT_PUSH_NOTIFICATION_TEMPLATES = \{/);
assert.match(app, /pledgePending: \{[\s\S]*title: "안전 서약 미완료"/);
assert.match(app, /unsafeIssue: \{[\s\S]*body: "\{호선\} · \{등록자\} · \{내용\}"/);
assert.match(app, /adminManual: \{[\s\S]*title: "GS 안전 체크리스트 안내"/);
assert.match(app, /const ADMIN_PUSH_STYLES = \[/);
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
assert.match(app, /알림 유형/);
assert.match(app, /브라우저 푸시는 별도 템플릿이 아니라 제목, 내용, 아이콘, 배지, 진동, 클릭 이동 옵션 조합입니다\./);
assert.match(app, /발송할 작업자 카드를 직접 눌러 선택하세요/);
assert.match(app, /function adminPushTargetWorkers\(\) \{\s*const selected = new Set\(normalizeAdminPushWorkerIds\(state\.adminPushDraft\.selectedWorkerIds\)\);/);
assert.doesNotMatch(app, /data-action="set-admin-push-target-mode"/);
assert.doesNotMatch(app, /push-target-modes/);
assert.doesNotMatch(styles, /\.push-target-summary/);
assert.match(app, /async function saveWorkerPushDevice\(event\)/);
assert.match(app, /async function deleteWorkerPushDevice\(event\)/);
assert.match(app, /data-worker-push-badge/);
assert.match(app, /data-worker-push-manage/);
assert.match(app, /\["push", "푸시"\]/);
assert.match(app, /data-action="send-admin-push"/);
assert.match(app, /sendKind: options\.kind \|\| ""/);
assert.match(app, /\{ kind: "adminManual" \}/);
assert.match(app, /action: "status"/);
assert.match(app, /button\.disabled = loggedIn && \(registered \|\| checking \|\| registering \|\| !supported\)/);
assert.match(app, /Supabase에 등록된 알림 구독/);
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
assert.match(app, /workerIdsForNames\(UNSAFE_PUSH_TARGET_WORKER_NAMES\)/);
assert.match(app, /function pledgeRowStatus\(row\)/);
assert.match(app, /function pledgePendingRows\(\)/);
assert.match(app, /function canSendPledgeNotifications\(\)/);
assert.match(app, /조장 또는 관리 담당자만 미완료자 알림을 발송할 수 있습니다/);
assert.match(app, /pledgeDashboardRows\(\)\.filter\(\(row\) => pledgeRowStatus\(row\) === "미완료"\)/);
assert.match(app, /status: done \? "완료" : "미완료"/);
assert.match(app, /pushSubscriptionStatus: loadJson\("pushSubscriptionStatus", \{\}\)/);
assert.match(app, /worker_push_subscription_status/);
assert.match(app, /senderWorkerId/);
assert.match(app, /senderEmployeeNo/);
assert.match(app, /sendKind: options\.kind \|\| ""/);
assert.match(app, /data-action="notify-pledge-pending"/);
assert.match(app, /data-action="edit-push-template" data-push-template-kind="pledgePending"/);
assert.match(app, /data-action="edit-push-template" data-push-template-kind="unsafeIssue"/);
assert.match(app, /data-action="register-push-notifications"/);
assert.match(app, /data-action="test-push-notification"/);
assert.match(app, /"notify-pledge-pending": notifyPledgePendingWorkers/);
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
assert.match(app, /verify_worker_login/);
assert.match(app, /id="loginEmployeeNo" type="password" inputmode="text" autocomplete="current-password" autocapitalize="characters"/);
assert.match(app, /const DEFAULT_WORKER_POSITION = "작업자"/);
assert.match(app, /const LEADER_WORKER_POSITION = "조장"/);
assert.match(app, /const WORKER_POSITIONS = \[DEFAULT_WORKER_POSITION, LEADER_WORKER_POSITION, "대표", "관리", "총무"\]/);
assert.match(app, /const WORKER_TEAM_OPTIONS = \["선행", "후행", "관리"\]/);
assert.match(app, /const LOGIN_WORKER_GROUP_ORDER = \["대표", "관리", "선행", "후행", "총무"\]/);
assert.match(app, /function normalizeWorkerPosition\(position\)/);
assert.match(app, /function loginWorkerGroup\(worker\)/);
assert.match(app, /function sortWorkersForLogin\(workers\)/);
assert.match(app, /\[\.\.\.sortWorkersForLogin\(state\.workers\)\]/);
assert.match(app, /employee_no: normalizeEmployeeNo\(row\.employeeNo\)/);
assert.match(app, /employeeNo: normalizeEmployeeNo\(row\.employee_no\)/);
assert.match(app, /position: normalizeWorkerPosition\(row\.position\)/);
assert.match(app, /id="workerPosition"/);
assert.match(app, /workerEditCardId: ""/);
assert.match(app, /data-worker-card-toggle/);
assert.match(app, /data-save-worker/);
assert.match(app, /function renderWorkerTeamOptions\(selectedTeam\)/);
assert.doesNotMatch(app, /data-toggle-worker-position/);
assert.doesNotMatch(app, /prompt\("작업자 이름"/);
assert.match(app, /function renderLoginWorkerPicker\(workers, selectedWorker, disabled\)/);
assert.match(app, /function workerRoleBadge/);
assert.match(app, /data-login-worker-select/);
assert.match(styles, /\.login-worker-role \{[\s\S]*color: #fff;/);
assert.match(app, /workPrepRegisterOpen: false/);
assert.match(app, /workDate: localDate\(new Date\(\)\)/);
assert.match(app, /function canOpenWorkPrepRegister\(\)/);
assert.match(app, /function openWorkPrepRegister\(\)/);
assert.match(app, /function updateWorkPrepDraftField\(field, value\)/);
assert.match(app, /function saveWorkPrepRegistration\(\)/);
assert.match(app, /function renderWorkPrepRegister\(\)/);
assert.match(app, /workPrepRegisterOpen: state\.view === "check" && state\.workPrepRegisterOpen/);
assert.match(app, /data-action="open-work-prep-register"/);
assert.match(app, /data-action="close-work-prep-register"/);
assert.match(app, /data-work-prep-worker/);
assert.match(app, /data-work-prep-tool/);
assert.match(styles, /\.work-prep-entry-card/);
assert.match(styles, /\.work-prep-register-flow/);
assert.match(styles, /\.work-prep-status-strip/);
assert.match(styles, /\.work-prep-register-card-head \{[\s\S]*justify-content: space-between/);
assert.match(styles, /\.work-prep-appearance-badge \{[\s\S]*border-radius: 999px/);
assert.match(styles, /\.work-prep-date-section/);
assert.match(styles, /\.work-prep-record-card/);
assert.match(styles, /\.work-prep-record-meta/);
assert.match(styles, /\.work-prep-order-strip/);
assert.match(styles, /\.worker-badge-row/);
assert.match(styles, /\.worker-team-badge/);
assert.match(styles, /\.push-manager-panel/);
assert.match(styles, /\.push-style-option/);
assert.match(styles, /\.push-worker-card/);
assert.match(styles, /\.push-target-send-btn/);
assert.match(app, /class="section-title compact">발송 대상 <span class="small muted">\$\{targetWorkers\.length\}명<\/span>/);
assert.match(app, /class="btn push-target-send-btn" data-action="send-admin-push"/);
assert.doesNotMatch(app, /push-target-summary/);
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
assert.match(app, /최근 활동 · 불안전요소 등록 & 자재누락/);
assert.match(app, /data-analytics-record-kind="\$\{esc\(row\.kind\)\}"/);
assert.match(app, /data-analytics-record-id="\$\{esc\(row\.id\)\}"/);
assert.match(app, /function openAnalyticsRecord\(kind, id\)/);
assert.match(app, /data-stat-scope="unsafe" data-action="view-unsafe-list"/);
assert.match(app, /unsafeCount \? "즉시 확인" : ""/);
assert.doesNotMatch(app, /unsafeCount \? "즉시 확인" : "접수 없음"/);
assert.match(app, /<div><span>완료율<\/span><strong>\$\{todayCompletion\}%<\/strong><\/div>/);
assert.match(app, /statPill\(".*?", deliverySoon, ".*?", "#f97316", "clock", deliverySoon \? ".*?" : "", "delivery"\)/);
assert.match(app, /data-stat-scope="\$\{esc\(scope\)\}" data-history-scope="\$\{esc\(scope\)\}"/);
assert.match(app, /data-stat-scope="materials" data-action="view-material-list"/);
assert.doesNotMatch(app, /data-stat-scope="unsafe" data-view="unsafe"/);
assert.doesNotMatch(app, /data-stat-scope="materials" data-view="materials"/);
assert.match(app, /stat-foot \$\{foot \? "" : "is-empty"\}/);
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
assert.match(app, /const readOnlyTabs = new Set\(\["unsafe", "materials"\]\)/);
assert.match(app, /const visibleTabs = state\.adminMode \|\| previewAdmin \? tabs : tabs\.filter\(\(\[id\]\) => readOnlyTabs\.has\(id\)\)/);
assert.match(app, /data-action="bulk-material-status" \$\{canEdit \? "" : "disabled"\}/);
assert.match(app, /data-record-status="\$\{esc\(token\)\}" \$\{canEdit \? "" : "disabled"\}/);
assert.match(app, /const filterPanelRows = ISSUE_MATERIAL_RULES\.filterRecords\(state\.missingMaterials, \{ \.\.\.state\.materialFilters, shipNo: "" \}\)/);
assert.match(app, /const filterGroups = ISSUE_MATERIAL_RULES\.groupMaterialsByShip/);
assert.match(app, /월간 작업자 점검 현황/);
assert.match(app, /function currentMonthRange\(/);
assert.match(app, /function monthlyWorkerInspectionStats\(/);
assert.doesNotMatch(app, /attentionWorkers/);
assert.match(app, /visiblePledgeAnalyticsWorkers\(\)\.forEach\(\(worker\) =>/);
assert.doesNotMatch(app, /기록 기반/);
assert.match(app, /\]\.filter\(\(row\) => visiblePledgeAnalyticsWorkerName\(row\.worker\)\)\.sort/);
assert.match(app, /function workerDayInspectionStatus\(workerName, date\)/);
assert.match(app, /function renderMonthlyWorkerAnalytics\(/);
assert.match(app, /function renderWorkerHeatmapCell\(status/);
assert.match(app, /function renderMonthlyWorkerCalendar\(worker, range\)/);
assert.match(app, /function renderMonthlyWorkerCard\(worker, range, expanded\)/);
assert.match(app, /function renderMonthlyWorkerCardColumns\(workers, range, expandedWorkers\)/);
assert.match(app, /columns\[index % columns\.length\]\.push\(renderMonthlyWorkerCard/);
assert.match(app, /function renderMonthlyWorkerMonthMeta\(monthText\)/);
assert.match(app, /monthlyWorkerMonthHighlight/);
assert.match(app, /monthlyWorkerMonthHighlightTimer/);
assert.match(app, /data-monthly-worker-toggle="\$\{esc\(key\)\}"/);
assert.match(app, /toggleMonthlyWorkerCard\(button\.dataset\.monthlyWorkerToggle\)/);
assert.match(app, /function renderMonthlyRestDaySettings\(/);
assert.match(app, /function koreanPublicHolidayInfo\(date\)/);
assert.match(app, /function isMonthlyRestDay\(date\)/);
assert.match(app, /function toggleMonthlyPublicHolidayMode\(/);
assert.match(app, /function addCustomMonthlyRestDay\(date\)/);
assert.match(app, /function deleteCustomMonthlyRestDay\(date\)/);
assert.match(app, /function exportMonthlyWorkerAnalytics\(/);
assert.match(app, /monthlyWorkerRestDays/);
assert.match(app, /data-export-records="monthly-worker-analytics"/);
assert.match(app, /monthly-worker-inspections-\$\{stats\.range\.monthKey\}\.xlsx/);
assert.match(app, /createXlsxBlob\("월간작업자점검"/);
assert.match(app, /휴무 설정/);
assert.match(app, /현장 휴무 추가/);
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
assert.match(css, /\.push-template-overlay/);
assert.match(css, /\.push-template-panel/);
assert.match(css, /\.push-template-preview/);
assert.match(css, /\.pledge-notify-actions/);
assert.match(css, /\.worker-meta-line/);
assert.match(css, /\.worker-list \{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
assert.match(css, /body\.screen-mobile \.worker-list,[\s\S]*body\.preview-mobile \.worker-list \{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(css, /\.worker-edit-grid/);
assert.match(css, /\.worker-push-badge/);
assert.match(css, /\.worker-push-badge\.is-registered/);
assert.match(css, /\.worker-push-badge\.is-empty/);
assert.match(css, /\.push-device-overlay/);
assert.match(css, /\.push-device-row/);
assert.match(css, /\.push-device-actions/);
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
assert.match(css, /\.sidebar-session-panel[\s\S]*border: 1px solid rgba\(255,255,255,\.18\)[\s\S]*border-radius: 8px/);
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
assert.match(css, /\.monthly-worker-analytics/);
assert.doesNotMatch(app, /monthly-worker-attention/);
assert.doesNotMatch(css, /monthly-worker-attention/);
assert.match(css, /\.monthly-worker-card-list/);
assert.match(css, /\.monthly-worker-card-column/);
assert.match(css, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
assert.match(css, /\.monthly-worker-month-label\.is-highlight/);
assert.match(css, /@keyframes monthlyMonthPulse/);
assert.match(css, /\.monthly-worker-card-item/);
assert.match(css, /\.monthly-worker-calendar-grid/);
assert.match(css, /grid-template-columns: repeat\(7, minmax\(0, 1fr\)\)/);
assert.match(css, /\.monthly-worker-calendar-cell\.done/);
assert.match(css, /\.monthly-worker-calendar-cell\.partial/);
assert.match(css, /\.monthly-worker-calendar-cell\.missing/);
assert.match(css, /\.monthly-worker-calendar-cell\.rest/);
assert.match(css, /\.monthly-worker-calendar-cell\.excluded/);
assert.match(css, /\.monthly-worker-cell\.done/);
assert.match(css, /\.monthly-worker-cell\.partial/);
assert.match(css, /\.monthly-worker-cell\.missing/);
assert.match(css, /\.monthly-worker-cell\.rest/);
assert.match(css, /\.monthly-worker-cell\.excluded/);
assert.match(css, /\.pictogram-image-fallback/);

const sw = read("sw.js");
assert.match(sw, /const CACHE = "gs-safety-v16-20260526-worker-push-workprep"/);
assert.match(sw, /styles-v2\.css\?v=20260526-worker-push-workprep-1/);
assert.match(sw, /app-v2\.js\?v=20260526-worker-push-workprep-1/);
assert.match(sw, /self\.addEventListener\("push"/);
assert.match(sw, /self\.registration\.showNotification/);
assert.match(sw, /self\.addEventListener\("notificationclick"/);
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

const pushMigration = read("supabase/migrations/202605240001_worker_push_subscriptions.sql");
assert.match(pushMigration, /create table if not exists public\.worker_push_subscriptions/);
assert.match(pushMigration, /alter table public\.worker_push_subscriptions enable row level security/);
assert.match(pushMigration, /create index if not exists worker_push_subscriptions_worker_idx/);
assert.match(pushMigration, /create or replace function public\.worker_push_subscription_status/);

const realtimeMigration = read("supabase/migrations/20260525151649_enable_realtime_remote_tables.sql");
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
assert.match(pushFunction, /action === "status"/);
assert.match(pushFunction, /action === "devices"/);
assert.match(pushFunction, /action === "updateDevice"/);
assert.match(pushFunction, /action === "deleteDevice"/);
assert.match(pushFunction, /action === "send"/);
assert.match(pushFunction, /subscriptionStatus/);
assert.match(pushFunction, /subscriptionDevices/);
assert.match(pushFunction, /updateSubscriptionDevice/);
assert.match(pushFunction, /deleteSubscriptionDevice/);
assert.match(pushFunction, /sendNotification/);
assert.match(pushFunction, /UNSAFE_PUSH_TARGET_WORKER_NAMES = \["허지원", "김준혁", "김경제"\]/);
assert.match(pushFunction, /function canSendPledgeNotifications/);
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
