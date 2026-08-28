const assert = require("node:assert");
const fs = require("node:fs");
const { renderShipsV4View, normalizeShipsV4Model } = require("../assets/js/ships-v4-view.js");

const model = {
  dataState: "ready",
  searchQuery: "H10",
  sortMode: "stage",
  sortOptions: [
    { value: "stage", label: "공정 상태순" },
    { value: "number", label: "호선 번호순" },
  ],
  stageOptions: [{ value: "lc", label: "L/C" }, { value: "st", label: "S/T" }],
  editable: true,
  importAction: "import-ships",
  exportAction: "export-ships",
  saveOrderAction: "save-ship-order",
  ships: [
    {
      id: "ship-1",
      no: "H1001",
      type: "LNG",
      processStage: "lc",
      scheduleLabel: "일정 기준 L/C",
      updatedLabel: "방금 확인",
      dates: [{ field: "lcDate", label: "L/C", value: "2026-08-24" }, { field: "dlDate", label: "D/L", value: "2027-02-12" }],
      facts: [{ label: "점검 이력", value: "4건" }, { label: "불안전요소", value: "1건" }],
      links: [{ label: "점검 이력 보기", action: "open-ship-data-target", target: "history" }],
    },
    { id: "ship-2", no: "H1002", type: "컨테이너", processStage: "st" },
  ],
  selectedId: "ship-1",
  list: { hasPreviousPage: false, hasNextPage: true, nextCursor: "next", pageAction: "page-ships-collection", label: "1 / 2" },
};

const normalized = normalizeShipsV4Model(model);
assert.equal(normalized.ships.length, 2);
assert.equal(normalized.selectedId, "ship-1");

const html = renderShipsV4View(model);
assert.match(html, /class="ships-v4"/);
assert.match(html, /data-ship-search/);
assert.match(html, /data-ship-sort-mode/);
assert.match(html, /data-action="import-ships"/);
assert.match(html, /data-action="export-ships"/);
assert.match(html, /data-action="save-ship-order"/);
assert.match(html, /class="ships-v4__utility-details" open/);
assert.match(html, /data-action="select-ship-v4" data-ship-id="ship-1"/);
assert.match(html, /data-ship-search-item/);
assert.match(html, /data-ship-date-field/);
assert.match(html, /data-ship-stage-field/);
assert.match(html, /data-action="open-ship-data-target" data-ship-id="ship-1" data-ship-data-target="history"/);
assert.match(html, /<strong>1<small>척/);
assert.doesNotMatch(html, /<strong>3<small>척/);
assert.match(html, /aria-current="true"/);
assert.match(html, /data-action="page-ships-collection" data-collection-cursor="next"/);

const unselected = renderShipsV4View({ ...model, selectedId: "" });
assert.match(unselected, /호선을 선택하세요/);

const mobile = renderShipsV4View({ ...model, mobile: true, mobileDetailOpen: true });
assert.match(mobile, /class="ships-v4__utility-details">/);
assert.doesNotMatch(mobile, /class="ships-v4__utility-details" open/);
assert.match(mobile, /is-mobile-fullscreen/);
assert.match(mobile, /data-action="back-ships-v4-list"/);
assert.match(mobile, /role="dialog" aria-modal="true"/);

const loading = renderShipsV4View({ dataState: "loading", ships: model.ships });
assert.match(loading, /aria-busy="true"/);
assert.doesNotMatch(loading, /H1001/);
const error = renderShipsV4View({ dataState: "error", retryAction: "retry-ships" });
assert.match(error, /data-action="retry-ships"/);
const empty = renderShipsV4View({ dataState: "empty", ships: [] });
assert.match(empty, /등록된 호선이 없습니다/);
const offline = renderShipsV4View({ dataState: "offline", ships: model.ships });
assert.match(offline, /오프라인 데이터를 표시합니다/);

const escaped = renderShipsV4View({
  ships: [{ id: '" autofocus onfocus=alert(1)', no: '<script>alert(1)</script>', processStage: "lc", facts: [{ label: "A&B", value: "<b>unsafe</b>" }] }],
  selectedId: '" autofocus onfocus=alert(1)',
});
assert.doesNotMatch(escaped, /<script>|<b>unsafe<\/b>/);
assert.match(escaped, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
assert.match(escaped, /A&amp;B/);
assert.match(escaped, /data-ship-id="&quot; autofocus onfocus=alert\(1\)"/);

const css = fs.readFileSync("assets/css/30-feature-ships-v4.css", "utf8");
assert.match(css, /min-block-size: 44px/);
assert.match(css, /@media \(max-width: 700px\)/);
assert.match(css, /\.ships-v4__detail\.is-mobile-fullscreen/);
assert.match(css, /body\.ships-v4-mobile-detail-open \{ overflow: hidden; \}/);
assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|rgba?\(/i);

console.log("ships v4 view tests passed");
