const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const app = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "app-v2.js"), "utf8");

test("checklist rendering omits sections emptied by the selected-tool filter", () => {
  const renderer = app.slice(app.indexOf("function renderChecklistSections"), app.indexOf("function renderChecklistItem"));
  assert.match(renderer, /items: visibleItems\.filter\(\(row\) => row\.sectionId === section\.id\)/);
  assert.match(renderer, /\.filter\(\(\{ items \}\) => items\.length\)/);
  assert.doesNotMatch(renderer, /check-section-empty|이 섹션에는 항목이 없습니다/);
});
