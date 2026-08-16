const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const app = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "app-v2.js"), "utf8");
const checkStart = app.indexOf("function renderCheck()");
const checkEnd = app.indexOf("function renderToolPrep");
const checkRenderer = app.slice(checkStart, checkEnd);

test("checklist keeps pledge and signature inside the final submission sheet", () => {
  assert.match(app, /function renderCheckSubmitBar\(items, checked, submitState\)/);
  assert.match(app, /function renderCheckSubmitSheet\(submitState\)/);
  assert.match(app, /data-action="open-check-submit-sheet"/);
  assert.match(app, /data-action="final-submit-inspection"/);
  assert.match(app, /\$\{renderSafetyPledgeChecklist\(\)\}/);
  assert.doesNotMatch(checkRenderer, /renderSafetyPledgeChecklist\(\)/);
  assert.match(checkRenderer, /renderCheckSubmitBar\(items, checked, submitState\)/);
  assert.match(checkRenderer, /renderCheckSubmitSheet\(submitState\)/);
});

test("submit sheet retains validation blockers and reports the draft save time", () => {
  assert.match(app, /checkSubmitSheetOpen: false/);
  assert.match(app, /key === "draft"[\s\S]*?value\.savedAt = new Date\(\)\.toISOString\(\)/);
  assert.match(app, /data-check-draft-saved-at/);
  assert.match(app, /"final-submit-inspection": submitInspection/);
  assert.match(app, /\["pledge", "signature"\]\.includes\(target\)[\s\S]*?state\.checkSubmitSheetOpen = true/);
});
