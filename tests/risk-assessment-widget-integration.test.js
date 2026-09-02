const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const section = (source, start, end) => source.slice(source.indexOf(start), source.indexOf(end));

const app = read("assets/js/app-v2.js");
const css = read("assets/css/30-feature-control-center.css");
const html = read("items.html");
const sw = read("sw.js");
const widget = read("assets/js/vendor/hisafe-ra-widget.js");

assert.match(widget, /global\.HisafeRA\s*=\s*HisafeRA/);
assert.match(widget, /mount\(target, opts\)/);
assert.match(app, /data-action="open-ra-widget"/);
assert.match(app, /id="hisafeRaWidgetHost"/);
assert.match(app, /script\.src = "\/assets\/js\/vendor\/hisafe-ra-widget\.js"/);
assert.match(app, /HisafeRA\.mount\(host/);
assert.match(app, /표준작업지도서\/위험성평가 관리/);
assert.match(app, /현재 기기에서 분석하고, 확인한 항목만 선택한 작업 유형에 병합합니다/);
assert.match(app, /function createRiskAssessmentMergePlan\(\)/);
assert.match(app, /function createExistingWorkTypeMergePlan\(sourceId\)/);
assert.match(app, /StateShapeRules\.planWorkTypeChecklistMerge/);
assert.match(app, /data-action="apply-ra-merge"/);
assert.match(app, /data-action="preview-existing-work-type-merge"/);
assert.match(app, /data-action="apply-existing-work-type-merge"/);
assert.match(app, /같은 문구의 항목은 추가하지 않습니다/);
assert.match(app, /function syncRiskAssessmentWidgetPanel\(\)/);
assert.match(app, /document\.body\.insertAdjacentHTML\("beforeend", renderRiskAssessmentWidgetPanel\(\)\)/);
assert.doesNotMatch(
  section(app, "function render()", "function renderPreservingScroll()"),
  /destroyRiskAssessmentWidget\(\)/,
  "ordinary app renders must not discard an open workbook and checklist state",
);
assert.match(
  section(app, "function render()", "function renderPreservingScroll()"),
  /if \(!loggedIn\) \{[\s\S]*syncRiskAssessmentWidgetPanel\(\);[\s\S]*return;/,
  "leaving an authenticated session must remove the persistent widget shell",
);
assert.match(
  section(app, "function setupRiskAssessmentWidget()", "function openRiskAssessmentWidget()"),
  /if \(riskAssessmentWidgetInstance\) return/,
  "an already mounted widget must survive unrelated app renders",
);
assert.doesNotMatch(html, /<script[^>]+hisafe-ra-widget\.js/);
assert.match(html, /30-feature-control-center\.min\.css/);
assert.match(sw, /\/assets\/js\/vendor\/hisafe-ra-widget\.js/);
assert.match(sw, /30-feature-control-center\.min\.css/);
assert.match(css, /body\.ra-widget-open \.bottom-nav/);
assert.match(css, /\.ra-widget-shell__body/);
assert.match(css, /\.ra-merge-panel/);
assert.match(css, /@media \(max-width: 600px\)/);

console.log("risk assessment widget integration tests passed");
