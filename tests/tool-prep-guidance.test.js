const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const appSource = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "app-v2.js"), "utf8");
const toolPrepStart = appSource.indexOf("function renderToolPrep");
const toolPrepEnd = appSource.indexOf("function checkFlowShell");
const toolPrepSource = appSource.slice(toolPrepStart, toolPrepEnd);

test("direct inspection guidance does not describe a work-order requirement", () => {
  assert.equal(/fromWorkPrepRecord\s*\?\s*"최소 1개의 공기구\/준비물이 작업지시서/.test(toolPrepSource), true);
  assert.equal(toolPrepSource.includes("공기구/준비물을 1개 이상 선택해야 점검표로 이동할 수 있습니다."), true);
});
