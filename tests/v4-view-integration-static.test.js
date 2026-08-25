const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "assets/js/app-v2.js"), "utf8");
const dashboard = fs.readFileSync(path.join(root, "assets/js/dashboard-view.js"), "utf8");

test("all isolated v4 view globals are bound without replacing the legacy fallback", () => {
  [
    "ShipyardShipsV4View",
    "ShipyardHistoryV4View",
    "ShipyardQuickMenuV4View",
    "ShipyardUnsafeV4View",
    "ShipyardMaterialsV4View",
    "ShipyardManageTabsV4View",
    "ShipyardAuxiliaryV4View",
    "GovernanceV4View",
  ].forEach((globalName) => assert.match(app, new RegExp(`window\\.${globalName}`)));
  assert.match(app, /typeof SHIPS_V4_VIEW\.renderShipsV4View === "function"/);
  assert.match(app, /typeof HISTORY_V4_VIEW\.renderHistoryV4View === "function"/);
  assert.match(app, /typeof QUICK_MENU_V4_VIEW\.renderQuickMenuV4 === "function"/);
});

test("ships and history use real collections, existing actions, filters, and mobile focus restoration", () => {
  assert.match(app, /SHIPS_V4_VIEW\.renderShipsV4View\(\{/);
  assert.match(app, /const ships = shipPage\.items\.map/);
  assert.match(app, /"select-ship-v4": \(\) => openShipsV4Detail/);
  assert.match(app, /"open-ship-data-target"/);
  assert.match(app, /state\.shipV4SelectedId = ""/);
  assert.match(app, /document\.body\.classList\.toggle\("ships-v4-mobile-detail-open"/);
  assert.match(app, /HISTORY_V4_VIEW\.renderHistoryV4View\(\{/);
  assert.match(app, /historyV4DateFrom/);
  assert.match(app, /historyV4DateTo/);
  assert.match(app, /historyV4Result/);
  assert.match(app, /closeHistoryV4Detail/);
  assert.match(app, /restoreV4ListFocus/);
});

test("home management shortcuts navigate before the management tab consumes the click", () => {
  assert.match(app, /function selectManageCenterTab\(tab\)[\s\S]*state\.view !== "manage"[\s\S]*changeView\("manage"\)/);
  assert.match(dashboard, /data-view="manage" data-manage-center-card="operations"/);
});

test("mobile detail selections participate in route history and restore visible list focus", () => {
  assert.match(app, /shipV4SelectedId: state\.view === "ships"/);
  assert.match(app, /manageDetailId: state\.view === "manage"/);
  assert.match(app, /state\.shipV4SelectedId = route\.shipV4SelectedId/);
  assert.match(app, /restoreManageCenterListFocus\(previousManageTab, previousManageDetailId\)/);
  assert.match(app, /Array\.from\(document\.querySelectorAll\(selector\)\)[\s\S]*getClientRects\(\)\.length > 0/);
  assert.match(app, /button\.dataset\.action === "back-work-prep-list"[\s\S]*closeManageCenterMobileDetail\("workPrep"\)/);
  assert.match(app, /mobileDetailOpen: isNarrowViewport\(\) && state\.workPrepDetailId === record\.id/);
});

test("quick menu, manage tabs, material records, login, and completion screens are live integrations", () => {
  assert.match(app, /QUICK_MENU_V4_VIEW\.buildQuickMenuEntries/);
  assert.match(app, /QUICK_MENU_V4_VIEW\.renderQuickMenuV4/);
  assert.match(app, /MANAGE_TABS_V4_VIEW\.renderWorkTypes/);
  assert.match(app, /MANAGE_TABS_V4_VIEW\.renderWorkersDevices/);
  assert.match(app, /MANAGE_TABS_V4_VIEW\.renderWorkPrepDetail/);
  assert.match(app, /MATERIALS_V4_VIEW\.renderMissingMaterialsV4/);
  assert.match(app, /data-record-filter=\"materials:status\"/);
  assert.match(app, /AUXILIARY_V4_VIEW\.renderLoginView/);
  assert.match(app, /AUXILIARY_V4_VIEW\.renderCompletionView/);
});

test("unsafe registration stays on persisted fields while the v4 board is read-only by default", () => {
  assert.match(app, /function renderUnsafe\(\)[\s\S]*renderUnsafeShipStep\(\)[\s\S]*renderUnsafeContentStep\(\)/);
  assert.match(app, /!state\.adminMode && typeof UNSAFE_V4_VIEW\.renderUnsafeV4View === "function"/);
  assert.match(app, /UNSAFE_V4_VIEW\.renderUnsafeV4View\(\{[\s\S]*readOnly: true/);
  assert.doesNotMatch(app, /if \(event\.target\.id === "unsafe(?:Severity|Location|ImmediateAction)"\)/);
});

test("push governance is a real four-step gate over the existing sender", () => {
  assert.match(app, /GOVERNANCE_V4_VIEW\.renderPushGovernance/);
  assert.match(app, /adminPushGovernanceStep: "compose"/);
  assert.match(app, /"governance-push-next": \(\) => setAdminPushGovernanceStep/);
  assert.match(app, /"governance-push-back": \(\) => setAdminPushGovernanceStep/);
  assert.match(app, /"governance-push-send": sendAdminPush/);
  assert.match(app, /state\.adminPushGovernanceStep !== "confirm" \|\| !state\.adminPushGovernanceAcknowledged/);
  assert.match(app, /sendWorkerPushNotification\(targets\.map\(\(worker\) => worker\.id\)/);
  assert.match(app, /state\.adminPushGovernanceStep = "result"/);
});

test("unsupported safety publishing and retention mutations render read-only, and work prep remains soft archive", () => {
  assert.match(app, /GOVERNANCE_V4_VIEW\.renderSafetyGovernance\(\{[\s\S]*readOnly: true/);
  assert.match(app, /GOVERNANCE_V4_VIEW\.renderRetentionGovernance\(\{[\s\S]*readOnly: true/);
  assert.doesNotMatch(app, /"governance-safety-(?:publish|request-review|create-rollback-draft)":/);
  assert.doesNotMatch(app, /"governance-retention-confirm":/);
  assert.match(app, /replace\(\/delete-work-prep-record\/g, "archive-work-prep-record"\)/);
  assert.match(app, /">보관 요청<"/);
  assert.match(app, /"archive-work-prep-record": \(\) => archiveWorkPrepRecord/);
});
