const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { filterChecklistItems } = require("../assets/js/checklist-rules.js");

const app = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "app-v2.js"), "utf8");

test("tool-prep coverage uses the existing checklist filter for its displayed count", () => {
  const items = [
    { id: "always", visibilityCondition: "항상 표시", toolIds: [] },
    { id: "linked", visibilityCondition: "선행", toolIds: ["tool-a"] },
  ];
  const tools = [{ id: "tool-a", nature: "선행" }];
  assert.equal(filterChecklistItems({ items, tools, selectedToolIds: ["tool-a"], categoryNature: "선행" }).length, 2);
  assert.equal(filterChecklistItems({ items, tools, selectedToolIds: [], categoryNature: "선행" }).length, 1);
  assert.match(app, /function checklistItemsForSelectedTools\(categoryId, selectedToolIds\)/);
  assert.match(app, /const visibleItems = checklistItemsForSelectedTools\(category\.id, selectedToolIds\)/);
  assert.match(app, /data-tool-prep-coverage/);
  assert.match(app, /대책 \$\{linkedCount\}건 제외/);
});
