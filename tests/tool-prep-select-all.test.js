const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const app = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "app-v2.js"), "utf8");
const toolPrepStart = app.indexOf("function renderToolPrep");
const toolPrepEnd = app.indexOf("function checkFlowShell");
const toolPrep = app.slice(toolPrepStart, toolPrepEnd);

test("tool preparation exposes a direct all-select toggle without unlocking work-order tools", () => {
  assert.match(toolPrep, /const allToolsSelected = Boolean\(tools\.length\) && selectedCount === tools\.length;/);
  assert.match(toolPrep, /fromWorkPrepRecord \? "" : `.*data-action="toggle-all-tool-prep"/s);
  assert.match(toolPrep, /allToolsSelected \? "전체 해제" : "전체 선택"/);
  assert.match(app, /button\.dataset\.action === "toggle-all-tool-prep"[\s\S]*?if \(!category \|\| state\.draft\.workPrepRecordId\) return;/);
  assert.match(app, /toolIds\.every\(\(toolId\) => selected\.has\(toolId\)\)/);
  assert.match(app, /button\.dataset\.toolPrepToggle[\s\S]*?saveJson\("draft", state\.draft\)/);
});
