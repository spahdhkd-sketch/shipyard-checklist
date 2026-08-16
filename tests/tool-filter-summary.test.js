const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const app = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "app-v2.js"), "utf8");

test("filtered checklists disclose excluded measures and retain the tool selection on return", () => {
  assert.match(app, /function renderToolFilterSummary\(category, visibleItems\)/);
  assert.match(app, /if \(!excludedItems\.length\) return "";/);
  assert.match(app, /data-tool-filter-summary/);
  assert.match(app, /안전대책 \$\{visibleItems\.length\}건 점검 · \$\{excludedItems\.length\}건은 미선택 공기구라 제외됨/);
  assert.match(app, /data-action="back-tool-prep"/);
  assert.match(app, /button\.dataset\.action === "back-tool-prep"[\s\S]*?state\.draft\.toolPrepComplete = false;/);
  assert.doesNotMatch(app, /back-tool-prep[\s\S]{0,180}resetToolPrepDraft/);
});
