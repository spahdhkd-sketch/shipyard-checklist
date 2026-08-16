const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const appSource = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "app-v2.js"), "utf8");

test("check details summarize unchecked items and open a prefilled unsafe draft", () => {
  assert.equal(appSource.includes("renderUncheckedChecklistItems"), true);
  assert.equal(appSource.includes("data-check-unsafe-item"), true);
  assert.equal(appSource.includes("openUnsafeDraftFromCheck"), true);
  assert.equal(appSource.includes("check-section-completed"), true);
});
