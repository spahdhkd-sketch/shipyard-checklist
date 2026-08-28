const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function sourceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(start, -1, `missing source marker: ${startMarker}`);
  assert.notEqual(end, -1, `missing source marker: ${endMarker}`);
  return source.slice(start, end);
}

const app = read("assets/js/app-v2.js");
const edge = read("supabase/functions/admin-mutations/index.ts");
const screenViews = read("assets/js/screen-views.js");
const e2e = read("tools/e2e-smoke.mjs");

const clientStatusUpdate = sourceBetween(
  app,
  "async function updateWorkPrepAdminStatus",
  "async function archiveWorkPrepRecord",
);
assert.match(
  clientStatusUpdate,
  /invokeAdminMutation\("updateWorkPrepStatus",\s*\{\s*recordId:\s*record\.id,\s*status:\s*normalized\s*\}\)/,
  "work-order status changes must call the dedicated status mutation",
);
assert.doesNotMatch(
  clientStatusUpdate,
  /upsertAdminRows\(/,
  "work-order status changes must not resubmit the full work-order row",
);

const serverStatusUpdate = sourceBetween(
  edge,
  "async function updateWorkPrepStatus",
  "async function upsertRows",
);
assert.match(
  serverStatusUpdate,
  /verifyMutationSession\(payload, "workPrep"\)/,
  "the status mutation must require a scoped work-order session",
);
assert.match(
  serverStatusUpdate,
  /\.from\("work_prep_records"\)[\s\S]*\.select\("id,leader_worker_id,status,status_history,deleted_at"\)/,
  "the status mutation must load the authoritative current status",
);
assert.match(
  serverStatusUpdate,
  /\.update\(\{[\s\S]*status,[\s\S]*status_history:[\s\S]*updated_at:/,
  "the status mutation must update only status timeline fields",
);
assert.doesNotMatch(
  serverStatusUpdate,
  /secureWorkPrepRows/,
  "status-only changes must not revalidate unrelated historical references",
);
assert.match(
  edge,
  /action === "updateWorkPrepStatus"\) return updateWorkPrepStatus\(payload\)/,
  "the Edge Function dispatcher must expose the dedicated status mutation",
);

const workPrepManagerView = sourceBetween(
  screenViews,
  "function renderWorkPrepManagerView",
  "function renderWorkPrepAdminRowView",
);
assert.doesNotMatch(
  workPrepManagerView,
  /open-work-prep-register|\+ 신규 등록/,
  "the Work Orders list must not expose a new registration action",
);

assert.match(
  e2e,
  /workPrepPage\.select\(statusSelector, "used"\)/,
  "browser coverage must change a waiting work order to completed",
);
assert.match(
  e2e,
  /record\?\.status === "used"[\s\S]*select\?\.value === "used"/,
  "browser coverage must verify the completed status in storage and the visible control",
);

const initialFilterReset = sourceBetween(
  app,
  "function prepareInitialManageFilters",
  "function unsafeReceivedCount",
);
assert.match(
  initialFilterReset,
  /state\.manageTab === "workPrep"\) resetWorkPrepShipFilter\(\)/,
  "opening Management on Work Orders must default to all ships",
);

const tabSelection = sourceBetween(
  app,
  "function selectManageCenterTab",
  "function retryManageCenterData",
);
assert.match(
  tabSelection,
  /state\.manageTab === "workPrep"\) resetWorkPrepShipFilter\(\)/,
  "selecting the Work Orders tab must default to all ships",
);

console.log("work-prep admin status sync tests passed");
