const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const dashboardView = require("../assets/js/dashboard-view.js");

const appSource = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "app-v2.js"), "utf8");
const dashboardSource = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "dashboard-view.js"), "utf8");
const stylesSource = fs.readFileSync(path.join(__dirname, "..", "assets", "css", "styles-v2.css"), "utf8");
const badgeStart = appSource.indexOf("function historyRiskBadgeHtml");
const badgeEnd = appSource.indexOf("\n    function ", badgeStart + 1);
const badgeSource = appSource.slice(badgeStart, badgeEnd);
const historyRiskBadgeHtml = Function("esc", `${badgeSource}\nreturn historyRiskBadgeHtml;`)((value) => String(value));

test("history list renders the calculated risk badge with a non-color status cue", () => {
  assert.equal(appSource.includes("historyRiskBadgeHtml"), true);
  assert.equal(dashboardSource.includes("row.riskBadgeHtml"), true);
  assert.equal(stylesSource.includes(".history-risk-badge.is-complete"), true);
  assert.equal(stylesSource.includes(".history-risk-badge.is-caution"), true);
});

test("history risk badges pair complete and caution text with distinct symbols", () => {
  assert.match(historyRiskBadgeHtml({ label: "정상" }), /is-complete[\s\S]*✓[\s\S]*완료/);
  assert.match(historyRiskBadgeHtml({ label: "주의 2건" }), /is-caution[\s\S]*▲[\s\S]*주의 2건/);
});

test("history card keeps the visible risk badge beside its status", () => {
  const html = dashboardView.renderHistoryTableView({
    rows: [{
      id: "fixture",
      accent: "#1f6eb3",
      ariaLabel: "fixture",
      categoryVisualHtml: "",
      shipNo: "TEST-1",
      workLabel: "검증 작업",
      workerName: "검증 작업자",
      statusLabel: "점검 완료",
      riskBadgeHtml: historyRiskBadgeHtml({ label: "주의 2건" }),
    }],
  });
  assert.match(html, /history-status-btn[\s\S]*history-risk-badge is-caution/);
});
