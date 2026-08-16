const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "assets", "js", "app-v2.js"), "utf8");
const dashboard = fs.readFileSync(path.join(root, "assets", "js", "dashboard-view.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "assets", "css", "styles-v2.css"), "utf8");

test("mobile management keeps the read-only boundary and applies filters only after confirmation", () => {
  assert.match(app, /function isMobileManageReadOnly\(\)/);
  assert.match(app, /function effectiveScreenMode\(\) \{\s*if \(isNarrowViewport\(\)\) return "mobile";/);
  assert.match(app, /조회 모드<\/strong><span>수정과 승인은 PC에서<\/span>/);
  assert.match(app, /data-action="open-manage-mobile-filter"/);
  assert.match(app, /function renderManageMobileFilterSheet\(\)/);
  assert.match(app, /data-manage-mobile-filter="shipNo"/);
  assert.match(app, /data-manage-mobile-filter="status"/);
  assert.match(app, /data-action="apply-manage-mobile-filter"[^>]*>\$\{esc\(count\)\}건 보기/);
  assert.match(app, /function applyManageMobileFilter\(\)[\s\S]*?Object\.assign\(target, filters\)[\s\S]*?saveJson\(/);
  assert.match(app, /"manage-mobile-notify": \(\) => toast\("담당자 알림 발송은 PC에서 문구·대상·최종 확인 후 진행합니다\."\)/);
});

test("management shell and mobile styles present cards, reachable tabs, and no edit controls", () => {
  assert.match(dashboard, /manage-shell \$\{mobileReadOnly \? "manage-mobile-readonly" : ""\}/);
  assert.match(dashboard, /aria-pressed="\$\{active \? "true" : "false"\}"/);
  assert.match(styles, /\.manage-mobile-readonly \.manage-tabs \{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);[\s\S]*?overflow: visible;/);
  assert.match(styles, /\.manage-mobile-readonly \[data-action\],[\s\S]*?display: none !important;/);
  assert.match(styles, /\.manage-mobile-readonly \.worker-form,[\s\S]*?\.manage-mobile-readonly \.material-row-actions \{[\s\S]*?display: none !important;/);
  assert.match(styles, /\.manage-mobile-filter-sheet \{[\s\S]*?position: fixed;[\s\S]*?inset: 0;[\s\S]*?min-height: 100dvh;/);
  assert.match(styles, /\.manage-mobile-readonly \.material-row \{[\s\S]*?grid-template-areas:/);
});
