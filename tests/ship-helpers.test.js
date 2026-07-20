const assert = require("assert");
const fs = require("fs");
const path = require("path");

const helpers = require("../assets/js/ship-helpers.js");

const ROOT = path.join(__dirname, "..");
const ASSET_TOKEN = "20260721-secure-icons-1";
const APP_SCRIPT = `assets/dist/js/app-v2.min.js?v=${ASSET_TOKEN}`;
const SHIP_HELPER_SCRIPT = `assets/dist/js/ship-helpers.min.js?v=${ASSET_TOKEN}`;
const PICTOGRAM_HELPER_SCRIPT = `assets/dist/js/pictogram-helpers.min.js?v=${ASSET_TOKEN}`;

assert.deepStrictEqual(helpers.SHIP_WORKFLOW_STAGES, ["mounting", "lc", "st", "cl", "dl"]);
assert.strictEqual(helpers.normalizeShipStageInput("탑재"), "mounting");
assert.strictEqual(helpers.normalizeShipStageInput("mount"), "mounting");
assert.strictEqual(helpers.normalizeShipStageInput("L/C"), "lc");
assert.strictEqual(helpers.normalizeShipStageInput("S_T"), "st");
assert.strictEqual(helpers.normalizeShipStageInput("C-L"), "cl");
assert.strictEqual(helpers.normalizeShipStageInput("D L"), "dl");
assert.strictEqual(helpers.normalizeShipStageInput("unknown"), "");

assert.deepStrictEqual(helpers.shipStageInfo("lc"), {
  stage: "lc",
  label: "L/C",
  percent: 45,
  color: "#2E5DA6",
  bg: "#eff6ff",
});
assert.strictEqual(helpers.shipStageInfo("unknown").stage, "mounting");
assert.strictEqual(helpers.effectiveShipStage({ processStage: "cl" }).stage, "cl");
assert.strictEqual(helpers.effectiveShipStage({}).stage, "mounting");

const shipNumbers = [{ no: "10" }, { no: "2" }, { no: "A1" }, { no: "A10" }, { no: "A2" }];
assert.deepStrictEqual(shipNumbers.sort(helpers.compareShipNo).map((ship) => ship.no), ["2", "10", "A1", "A2", "A10"]);

const staged = [
  { no: "300", processStage: "dl" },
  { no: "100", processStage: "mounting" },
  { no: "200", processStage: "lc" },
  { no: "101", processStage: "mounting" },
];
assert.deepStrictEqual(staged.sort(helpers.compareShipStage).map((ship) => ship.no), ["100", "101", "200", "300"]);

const byDate = helpers.compareShipDate((ship) => ship.lcDate);
const dated = [
  { no: "3", lcDate: "" },
  { no: "2", lcDate: "2026-06-01T09:30:00+09:00" },
  { no: "1", lcDate: "2026-05-28" },
  { no: "4", lcDate: "" },
];
assert.deepStrictEqual(dated.sort(byDate).map((ship) => ship.no), ["1", "2", "3", "4"]);

assert.strictEqual(helpers.normalizeShipSortMode("number"), "number");
assert.strictEqual(helpers.normalizeShipSortMode("bad-mode"), "stage");
assert.strictEqual(helpers.normalizeShipSortMode(""), "stage");

const htmlFiles = fs.readdirSync(ROOT).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const appIndex = html.indexOf(APP_SCRIPT);
  if (appIndex === -1) continue;
  const pictogramIndex = html.indexOf(PICTOGRAM_HELPER_SCRIPT);
  const shipIndex = html.indexOf(SHIP_HELPER_SCRIPT);
  assert(shipIndex !== -1, `${file} loads ship helper script`);
  assert(pictogramIndex !== -1, `${file} loads pictogram helper script`);
  assert(pictogramIndex < shipIndex, `${file} loads pictogram helper before ship helper`);
  assert(shipIndex < appIndex, `${file} loads ship helper before app-v2`);
}

const app = fs.readFileSync(path.join(ROOT, "assets/js/app-v2.js"), "utf8");
assert(app.includes("window.ShipyardShipHelpers"), "app-v2 reads ship helper global");
assert(app.includes("SHIP_HELPERS.compareShipStage"), "app-v2 delegates ship stage compare");

const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
assert(sw.includes("/assets/dist/js/ship-helpers.min.js?v=${ASSET_TOKEN}"), "service worker caches ship helper");

console.log("ship helper tests passed");
