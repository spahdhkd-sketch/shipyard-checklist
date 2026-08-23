const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const app = fs.readFileSync(path.join(__dirname, "../assets/js/app-v2.js"), "utf8");

function section(startNeedle, endNeedle) {
  const start = app.indexOf(startNeedle);
  const end = app.indexOf(endNeedle, start + startNeedle.length);
  assert.ok(start >= 0 && end > start, `${startNeedle} section exists`);
  return app.slice(start, end);
}

function includesAll(source, needles, label) {
  needles.forEach((needle) => assert.ok(source.includes(needle), `${label}: ${needle}`));
}

const pledgeRender = section("function renderPledgeManager()", "function completionIcon(");
const pledgeSnapshot = section("function pledgeDataSnapshot(", "function pledgeActionModel(");
assert.strictEqual((pledgeRender.match(/dataSurfaceContext\(\{/g) || []).length, 1, "pledge owns one context model");
includesAll(pledgeSnapshot, [
  "Number(cohort.denominator?.value || 0) === 0 && rows.length === 0",
  "collections: [state.workers, state.workPrepRecords, rows]",
  "range: rangeEntry",
], "pledge authoritative snapshot contract");
includesAll(pledgeRender, [
  "businessDate: viewDate",
  "range: rangeEntry",
  "actionsDisabled: dataState !== \"ready\"",
  "renderDataContext: SCREEN_VIEWS.renderDataContext",
  "renderDataState: SCREEN_VIEWS.renderDataState",
], "pledge authoritative surface contract");

const analyticsModel = section("function buildAnalyticsDashboardModel()", "function renderAnalyticsDashboard()");
assert.strictEqual((analyticsModel.match(/dataSurfaceContext\(\{/g) || []).length, 1, "analytics owns one context model");
includesAll(analyticsModel, [
  "const dataState = analyticsDashboardDataState()",
  "actionsDisabled: dataState !== \"ready\"",
  "businessDate: today()",
], "analytics model contract");
const analyticsState = section("function analyticsRemoteKeys()", "// 분석 모델 빌더");
includesAll(analyticsState, [
  '["inspections", "unsafeIssues", "missingMaterials", "ships", "workers", "workPrepRecords"]',
  "empty: collections.every((rows) => rows.length === 0)",
  'keys: analyticsRemoteKeys(), reason: "analytics-retry"',
  "ensureInspectionRangeLoaded(range.start, range.end, true)",
], "analytics scoped data/retry contract");
const analyticsRender = section("function renderAnalyticsDashboard()", "function renderRecordFilters(");
includesAll(analyticsRender, [
  "renderDataContext: SCREEN_VIEWS.renderDataContext",
  "renderDataState: SCREEN_VIEWS.renderDataState",
], "analytics shared renderer deps");
const monthlyModel = section("function buildMonthlyWorkerAnalyticsModel()", "function renderMonthlyWorkerAnalytics()");
assert.ok(monthlyModel.includes('actionsDisabled: dataState !== "ready"'), "monthly actions follow authoritative range state");

const manageRender = section("function renderManage()", "function renderSafetySettingsAuthority()");
assert.strictEqual((manageRender.match(/dataSurfaceContext\(\{/g) || []).length, 1, "manage owns one context model");
includesAll(manageRender, [
  "keys: manageCenterRemoteKeys(state.manageTab)",
  "contentReadOnly: actionsDisabled",
  "selectedRecord",
  "mobileDetailOpen: Boolean(selectedRecord && isNarrowViewport())",
  'detailEnabled: ["unsafe", "materials", "workPrep"].includes(state.manageTab)',
  "renderDataContext: SCREEN_VIEWS.renderDataContext",
  "renderDataState: SCREEN_VIEWS.renderDataState",
], "manage model and shared renderer deps");

const selectedRecord = section("function manageCenterSelectedRecord(tab)", "function manageCenterDetailId(tab)");
includesAll(selectedRecord, [
  "html: renderUnsafeInlineDetail(row)",
  "html: renderMaterialInlineDetail(row)",
  "html: renderWorkPrepInlineDetail(row)",
], "manage selected detail derivation");
[
  ["function renderWorkPrepManager()", "function workPrepKpi("],
  ["function renderUnsafeManager()", "function renderUnsafeQueueItem("],
  ["function renderMaterialManager()", "function materialBulkReview("],
].forEach(([start, end]) => {
  const manager = section(start, end);
  assert.doesNotMatch(manager, /active \? render(?:WorkPrep|Unsafe|Material)InlineDetail/, `${start} does not duplicate inline detail`);
});

const manageBack = section("function manageCenterDetailId(tab)", "function selectManageCenterTab(tab)");
includesAll(manageBack, [
  'data-action="back-manage-center-list"',
  "getClientRects().length > 0",
  'trigger?.scrollIntoView({ block: "nearest" })',
  "trigger?.focus()",
  "(back || heading)?.focus()",
], "manage mobile focus lifecycle");
assert.ok(app.includes('button.dataset.action === "back-manage-center-list"'), "manage back action is delegated");
assert.ok(app.includes("button.dataset.manageCenterTab || button.dataset.manageTab"), "manage-center tab controls reach the existing tab state transition");
assert.ok(app.includes('pullRemote({ force: true, keys, reason: "manage-center-retry" })'), "manage retry remains active-tab scoped");

const mobileBodyState = section("function syncManageMobileDetailBodyClass()", "function applyScreenMode()");
includesAll(mobileBodyState, [
  'state.view === "manage"',
  "isNarrowViewport()",
  'document.body.classList.toggle("manage-mobile-detail-open", detailOpen)',
], "manage mobile body/nav clearance state");
const renderFunction = section("function render()", "function renderPreservingScroll()");
assert.ok(renderFunction.includes("syncManageMobileDetailBodyClass()"), "every render clears or reapplies the manage mobile body state");
assert.ok(renderFunction.includes("enforceManageReadOnlyControls()"), "every render applies native mutation guards to stale or offline manage content");
const readOnlyControls = section("function enforceManageReadOnlyControls()", "function applyScreenMode()");
includesAll(readOnlyControls, [
  'data-manage-content-read-only="true"',
  "control.disabled = true",
  'control.setAttribute("aria-disabled", "true")',
], "stale and offline manage content keeps record navigation while disabling native mutation controls");

console.log("data surface integration static tests passed");
