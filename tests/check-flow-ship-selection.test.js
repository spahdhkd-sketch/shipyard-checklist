const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const app = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "app-v2.js"), "utf8");
const pickerStart = app.indexOf("function renderDirectCheckShipSelect");
const pickerEnd = app.indexOf("function renderToolFilterSummary");
const picker = app.slice(pickerStart, pickerEnd);

test("direct inspection keeps work and ship selection together in STEP 1", () => {
  assert.match(picker, /checkFlowShell\(1, "작업과 호선 선택"/);
  assert.match(picker, /data-ship-search/);
  assert.match(picker, /data-ship-search-item/);
  assert.match(picker, /check-flow-recent-ships/);
  assert.match(picker, /data-select-check-ship/);
  assert.match(picker, /shipDeliveryMeta\(ship\)/);
  assert.match(picker, /stage\.label/);
  assert.match(picker, /data-action="continue-check-ship"/);
});

test("direct flow cannot enter STEP 2 until a ship is selected, while work-prep remains locked", () => {
  assert.match(app, /!state\.draft\.workPrepRecordId && !state\.draft\.directShipSelectionComplete/);
  assert.match(app, /button\.dataset\.selectCheckShip[\s\S]*?state\.draft\.shipNo = button\.dataset\.selectCheckShip/);
  assert.match(app, /button\.dataset\.action === "continue-check-ship"[\s\S]*?state\.draft\.directShipSelectionComplete = true/);
  assert.match(app, /button\.dataset\.action === "back-check-ship"[\s\S]*?state\.draft\.directShipSelectionComplete = false/);
  assert.match(app, /fromWorkPrepRecord \? "back-check-types" : "back-check-ship"/);
  assert.match(app, /renderPledgeShipSelect[\s\S]*?locked: fromWorkPrepRecord/);
});
