const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const appSource = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "app-v2.js"), "utf8");
const submitStateStart = appSource.indexOf("function buildCheckSubmitState");
const submitStateEnd = appSource.indexOf("function refreshCheckSubmitControls");
const submitStateSource = appSource.slice(submitStateStart, submitStateEnd);

test("submission blockers expose direct navigation while submission is unavailable", () => {
  assert.equal(/return\s*\{[\s\S]*?blockers,/.test(submitStateSource), true);
  assert.equal(/data-submit-blocker/.test(appSource), true);
  assert.equal(/scrollIntoView\(/.test(appSource), true);
});
