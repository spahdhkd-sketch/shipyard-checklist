const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "assets/js/app-v2.js"), "utf8");
const admin = fs.readFileSync(path.join(root, "assets/js/admin-v2.js"), "utf8");

function includesAll(source, values, label) {
  values.forEach((value) => assert(source.includes(value), `${label}: missing ${value}`));
}

includesAll(app, [
  "window.ShipyardOperationalCohort",
  "window.NotificationPreflight",
  "window.ShipyardPledgeActionView",
  "window.MaterialBulkSelection",
  "window.ShipyardPagedCollection",
  "window.SafetySettings",
  "window.ShipyardNavigationModel",
  "window.ShipyardManageCenterView",
], "P1 global integration");

includesAll(app, [
  "OPERATIONAL_COHORT.deriveTodayOperationalCohort",
  "OPERATIONAL_COHORT.deriveHistoricalOperationalCohort",
  "ANALYTICS_MODEL.buildCohortCompletionSummary",
  "todayPending: actionMetrics?.reliable",
  "operationalCohort: cohort",
], "operational cohort and analytics");

const reviewHandler = app.match(/"review-pledge-notifications": \(\) => \{([\s\S]*?)\n\s*\},\n\s*"close-pledge-preflight"/);
assert(reviewHandler, "review action is delegated");
assert(!reviewHandler[1].includes("sendWorkerPushNotification"), "first pledge CTA must only open review");
assert(!reviewHandler[1].includes("notifyPledgePendingWorkers"), "first pledge CTA must never send");
assert(reviewHandler[1].includes('uid("pledge_pending")'), "review creates one safe key for the confirmation attempt");
assert(reviewHandler[1].includes("pledgeNotificationPreflightSnapshot"), "review stores the exact date and recipient snapshot");
const pushSenderStart = app.indexOf("async function sendWorkerPushNotification");
const pushSenderEnd = app.indexOf("function updateAdminPushDraftField", pushSenderStart);
assert(pushSenderStart >= 0 && pushSenderEnd > pushSenderStart, "worker push sender exists");
const pushSender = app.slice(pushSenderStart, pushSenderEnd);
assert(pushSender.includes("idempotencyKey: options.idempotencyKey"), "worker push contract receives the attempt key");
const pledgeConfirmStart = app.indexOf('"complete-pledge-preflight": async () => {');
const pledgeConfirmEnd = app.indexOf('"filter-pledge-action"', pledgeConfirmStart);
assert(pledgeConfirmStart >= 0 && pledgeConfirmEnd > pledgeConfirmStart, "pledge confirm handler exists");
const pledgeConfirm = app.slice(pledgeConfirmStart, pledgeConfirmEnd);
const pledgeGuardIndex = pledgeConfirm.indexOf("if (state.pledgePreflightSending) return;");
const pledgeLockIndex = pledgeConfirm.indexOf("state.pledgePreflightSending = true;");
const pledgeRefreshIndex = pledgeConfirm.indexOf("await Promise.all");
const pledgeSnapshotCheckIndex = pledgeConfirm.indexOf("currentSnapshot !== state.pledgePreflightSnapshot");
const pledgeSendIndex = pledgeConfirm.indexOf("await notifyPledgePendingWorkers");
assert(pledgeGuardIndex >= 0 && pledgeGuardIndex < pledgeLockIndex, "pledge confirm rejects a repeated in-flight action");
assert(pledgeLockIndex >= 0 && pledgeLockIndex < pledgeRefreshIndex, "pledge confirm locks before its authoritative refresh");
assert(pledgeRefreshIndex >= 0 && pledgeRefreshIndex < pledgeSnapshotCheckIndex, "pledge confirm refreshes workers, work orders, and inspections before comparing targets");
assert(pledgeSnapshotCheckIndex >= 0 && pledgeSnapshotCheckIndex < pledgeSendIndex, "pledge confirm rejects changed targets before sending");
assert(pledgeConfirm.includes("{ idempotencyKey }"), "pledge confirm reuses its review attempt key");
includesAll(app, [
  "NOTIFICATION_PREFLIGHT.buildNotificationPreflight",
  '"complete-pledge-preflight"',
  "preflight.targeted.map",
  "state.pledgePreflightAcknowledged",
], "pledge preflight confirmation");

includesAll(app, [
  "MATERIAL_BULK_SELECTION.BULK_SCOPE_SELECTED",
  "data-material-bulk-select",
  "data-material-bulk-review",
  "review.targetRecords",
  '"apply-material-bulk-status"',
], "selected-only material bulk flow");
const bulkStart = app.indexOf("async function applyMaterialBulkStatus()");
const bulkEnd = app.indexOf("function editPledgeTemplate", bulkStart);
assert(bulkStart >= 0 && bulkEnd > bulkStart, "bulk apply handler exists");
assert(!app.slice(bulkStart, bulkEnd).includes("prompt("), "bulk apply must not use prompt or filtered-wide ambiguity");
includesAll(admin, [
  '"bulk-material-status": "bulkUpdateMaterialStatus"',
  '"apply-material-bulk-status": "applyMaterialBulkStatus"',
  '"cancel-material-bulk-review": "cancelMaterialBulkReview"',
], "admin bulk delegates");

assert((app.match(/pageSize: 25/g) || []).length >= 2, "ships and work prep use 25-item pages");
includesAll(app, [
  "PAGED_COLLECTION.buildPagedCollection(allShips",
  "PAGED_COLLECTION.buildPagedCollection(records",
  '"page-ships-collection"',
  '"page-work-prep-collection"',
  "PAGED_COLLECTION.selectCollectionRecord",
  "state.shipDataCardOpenIds = state.shipDataCardOpenIds?.[0] === shipId ? [] : [shipId]",
  "buildWorkPrepManagerCollection",
  'pageAction: "page-work-prep-collection"',
  "previousCursor: workPrepCollection.page.previousCursor",
  "nextCursor: workPrepCollection.page.nextCursor",
], "paged single-detail collections");

includesAll(app, [
  "NAVIGATION_MODEL.ROUTES",
  "NAVIGATION_MODEL.MOBILE_PARENTS",
  "NAVIGATION_MODEL.getActiveMobileParentId",
  "MANAGE_CENTER_VIEW.renderManageCenterView",
  "dataset.manageCenterTab",
  "dataset.manageCenterCard",
], "central navigation and management shell");

includesAll(app, [
  "SAFETY_SETTINGS.evaluateDeviceSync",
  "서버 게시본을 확인하지 못한 상태를 게시 완료로 표시하지 않습니다.",
  "이 화면은 읽기 전용입니다.",
], "read-only settings authority");

const archiveStart = app.indexOf("async function archiveWorkPrepRecord");
const archiveEnd = app.indexOf("const deleteWorkPrepRecord", archiveStart);
assert(archiveStart >= 0 && archiveEnd > archiveStart, "work-prep archive handler exists");
const archiveHandler = app.slice(archiveStart, archiveEnd);
const archiveRemoteIndex = archiveHandler.indexOf('await deleteRemoteRows("workPrepRecords", [record.id])');
const archiveLocalIndex = archiveHandler.indexOf("state.workPrepRecords = state.workPrepRecords.filter");
assert(archiveRemoteIndex >= 0 && archiveRemoteIndex < archiveLocalIndex, "archive waits for the server tombstone before hiding locally");
assert(!archiveHandler.includes(".delete("), "archive handler never directly performs a hard delete");
includesAll(app, [
  '"archive-work-prep-record"',
  "작업지시서를 삭제할까요?",
  ">삭제<",
], "work-prep archive presentation");
assert(!app.includes('"delete-work-prep-record": () =>'), "work-prep destructive control is not dispatched as ordinary delete");

console.log("P1 app integration static tests passed");
