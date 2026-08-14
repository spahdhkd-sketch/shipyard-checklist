const assert = require("assert");
const fs = require("fs");
const path = require("path");

const helpers = require("../assets/js/worker-helpers.js");

const ROOT = path.join(__dirname, "..");
const ASSET_TOKEN = "20260814-editor-safety-1";
const APP_SCRIPT = `assets/dist/js/app-v2.min.js?v=${ASSET_TOKEN}`;
const PICTOGRAM_HELPER_SCRIPT = `assets/dist/js/pictogram-helpers.min.js?v=${ASSET_TOKEN}`;
const SHIP_HELPER_SCRIPT = `assets/dist/js/ship-helpers.min.js?v=${ASSET_TOKEN}`;
const WORKER_HELPER_SCRIPT = `assets/dist/js/worker-helpers.min.js?v=${ASSET_TOKEN}`;

assert.strictEqual(helpers.normalizedWorkerName("  김민수  "), "김민수");
assert.strictEqual(helpers.normalizedWorkerName(null), "");

assert.strictEqual(helpers.normalizeWorkerPosition("대표"), "대표");
assert.strictEqual(helpers.normalizeWorkerPosition(" 조장 "), "조장");
assert.strictEqual(helpers.normalizeWorkerPosition(" 반장 "), "반장");
assert.strictEqual(helpers.normalizeWorkerPosition("bad-position"), "작업자");

assert.strictEqual(helpers.normalizeWorkerTeam("선행"), "선행");
assert.strictEqual(helpers.normalizeWorkerTeam(" 후행 "), "후행");
assert.strictEqual(helpers.normalizeWorkerTeam("총무"), "");

assert.strictEqual(helpers.loginWorkerGroup({ position: "대표", team: "후행" }), "대표");
assert.strictEqual(helpers.loginWorkerGroup({ position: "총무", team: "관리" }), "총무");
assert.strictEqual(helpers.loginWorkerGroup({ position: "작업자", team: "관리" }), "관리");
assert.strictEqual(helpers.loginWorkerGroup({ position: "작업자", team: "선행" }), "선행");
assert.strictEqual(helpers.loginWorkerGroup({ position: "작업자", team: "후행" }), "후행");
assert.strictEqual(helpers.loginWorkerGroup({ position: "작업자", team: "" }), "");

const workers = [
  { id: "w5", name: "최총무", position: "총무", team: "관리" },
  { id: "w4", name: "박후행", position: "작업자", team: "후행" },
  { id: "w2", name: "이관리", position: "관리", team: "선행" },
  { id: "w1", name: "김대표", position: "대표", team: "후행" },
  { id: "w3", name: "강선행", position: "작업자", team: "선행" },
  { id: "w6", name: "무소속", position: "작업자", team: "" },
];
assert.deepStrictEqual(helpers.sortWorkersForLogin(workers).map((worker) => worker.id), ["w1", "w2", "w3", "w4", "w5", "w6"]);
assert.deepStrictEqual(workers.map((worker) => worker.id), ["w5", "w4", "w2", "w1", "w3", "w6"], "sortWorkersForLogin does not mutate input");

assert.strictEqual(helpers.isLeaderWorker({ position: "조장" }), true);
assert.strictEqual(helpers.isLeaderWorker({ position: "반장" }), true);
assert.strictEqual(helpers.isLeaderWorker({ position: "관리" }), false);
assert.strictEqual(helpers.canWorkerPreEnterAdminMode({ position: "관리" }), true);
assert.strictEqual(helpers.canWorkerPreEnterAdminMode({ position: "반장" }), true);
assert.strictEqual(helpers.canWorkerPreEnterAdminMode({ position: "조장" }), false);
assert.strictEqual(helpers.canWorkerPreEnterAdminMode({ position: "작업자", team: "관리" }), true);
assert.strictEqual(helpers.workerAdminModeLabel({ name: "  김관리  " }), "김관리 권한");
assert.strictEqual(helpers.workerAdminModeLabel({}), "작업자 권한");

assert.strictEqual(helpers.workerTeamBadge(""), '<span class="worker-team-badge is-empty">소속 미지정</span>');
assert.strictEqual(helpers.workerTeamBadge("선행"), '<span class="worker-team-badge is-pre">선행</span>');
assert.strictEqual(helpers.workerTeamBadge("후행"), '<span class="worker-team-badge is-post">후행</span>');
assert.strictEqual(helpers.workerTeamBadge("<관리>"), '<span class="worker-team-badge is-neutral">&lt;관리&gt;</span>');

assert.strictEqual(helpers.workerRoleBadge({ position: "작업자" }), '<span class="worker-position-badge ">작업자</span>');
assert.strictEqual(helpers.workerRoleBadge({ position: "반장" }), '<span class="worker-position-badge is-leader">반장</span>');
assert.strictEqual(helpers.workerRoleBadge({ name: "백승기", position: "조장" }), '<span class="worker-position-badge is-leader">반장</span>');
assert.strictEqual(helpers.workerRoleBadge({ position: "총무" }), '<span class="worker-position-badge is-leader">총무</span>');
assert.strictEqual(helpers.workerRoleBadge({ position: "<bad>" }), '<span class="worker-position-badge ">작업자</span>');

const htmlFiles = fs.readdirSync(ROOT).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const appIndex = html.indexOf(APP_SCRIPT);
  if (appIndex === -1) continue;
  const pictogramIndex = html.indexOf(PICTOGRAM_HELPER_SCRIPT);
  const shipIndex = html.indexOf(SHIP_HELPER_SCRIPT);
  const workerIndex = html.indexOf(WORKER_HELPER_SCRIPT);
  assert(workerIndex !== -1, `${file} loads worker helper script`);
  assert(pictogramIndex !== -1, `${file} loads pictogram helper script`);
  assert(shipIndex !== -1, `${file} loads ship helper script`);
  assert(pictogramIndex < shipIndex, `${file} loads pictogram helper before ship helper`);
  assert(shipIndex < workerIndex, `${file} loads ship helper before worker helper`);
  assert(workerIndex < appIndex, `${file} loads worker helper before app-v2`);
}

const app = fs.readFileSync(path.join(ROOT, "assets/js/app-v2.js"), "utf8");
assert(app.includes("window.ShipyardWorkerHelpers"), "app-v2 reads worker helper global");
assert(app.includes("WORKER_HELPERS.sortWorkersForLogin"), "app-v2 delegates worker login sorting");
assert(app.includes("WORKER_HELPERS.workerRoleBadge"), "app-v2 delegates worker role badge");
assert(!app.includes('["permissions", "권한"]'), "app-v2 should not expose a dedicated worker permissions manage tab");
assert(!app.includes("function renderWorkerPermissionManager()"), "app-v2 should keep permission editing inside the worker manager");

const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
assert(sw.includes("/assets/dist/js/worker-helpers.min.js?v=${ASSET_TOKEN}"), "service worker caches worker helper");

console.log("worker helper tests passed");
