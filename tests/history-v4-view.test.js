const assert = require("node:assert/strict");
const { renderHistoryV4View } = require("../assets/js/history-v4-view.js");

const model = {
  dataState: "ready",
  filters: {
    query: "탑재",
    dateFrom: "2026-08-01",
    dateTo: "2026-08-24",
    ship: "S-101",
    type: "assembly",
    result: "warning",
    ships: [{ value: "S-101", label: "S-101" }, { value: "S-102", label: "S-102" }],
    types: [{ value: "assembly", label: "탑재 작업" }],
    results: [{ value: "warning", label: "주의" }, { value: "completed", label: "완료" }],
  },
  rows: [{
    id: "inspection-1",
    date: "2026-08-24",
    time: "08:40",
    shipNo: "S-101",
    categoryLabel: "탑재 작업",
    worker: "점검자",
    workerTeam: "의장 1팀",
    status: "점검 완료",
    warnings: 2,
    completion: 92,
  }],
  pagination: { resultCount: 1, hasMore: true, moreAction: "load-history-page" },
  selected: { id: "inspection-1", title: "S-101 점검 기록", meta: "2026-08-24 08:40", html: "<p data-test-detail>읽기 전용 상세</p>" },
};

const html = renderHistoryV4View(model);
assert.match(html, /class="history-v4"/);
assert.match(html, /<h1>점검 이력<\/h1>/);
assert.match(html, /data-history-query[^>]*value="탑재"/);
assert.match(html, /data-history-date-from[^>]*value="2026-08-01"/);
assert.match(html, /data-history-date-to[^>]*value="2026-08-24"/);
assert.match(html, /data-history-ship-filter/);
assert.match(html, /data-history-type-filter/);
assert.match(html, /data-history-result-filter/);
assert.match(html, /data-action="reset-history-v4-filters"/);
assert.match(html, /class="history-v4__filter-details" open/);
assert.match(html, /<table class="history-v4__table">/);
assert.match(html, /data-history-detail-card="inspection-1"/);
assert.match(html, /주의 2건/);
assert.match(html, /완료 92%/);
assert.match(html, /data-test-detail/);
assert.match(html, /data-history-content-read-only="true"/);
assert.match(html, /data-action="load-history-page"/);
assert.doesNotMatch(html, /STEP|Action needed|관리 흐름/);

const mobileDetail = renderHistoryV4View({ ...model, mobile: true, mobileDetailOpen: true });
assert.match(mobileDetail, /class="history-v4__filter-details">/);
assert.doesNotMatch(mobileDetail, /class="history-v4__filter-details" open/);
assert.match(mobileDetail, /class="history-v4__active-filters"/);
assert.match(mobileDetail, /5개 적용/);
assert.match(mobileDetail, /history-v4__workspace is-mobile-detail-open/);
assert.match(mobileDetail, /history-v4__detail is-mobile-fullscreen/);
assert.match(mobileDetail, /data-action="back-history-list"/);
assert.match(mobileDetail, /tabindex="-1"/);

const withoutSelection = renderHistoryV4View({ ...model, selected: null });
assert.match(withoutSelection, /history-v4__detail is-empty/);
assert.match(withoutSelection, /점검 기록을 선택하세요/);

for (const dataState of ["loading", "error", "empty", "offline-empty"]) {
  const blocked = renderHistoryV4View({
    ...model,
    dataState,
    rows: [{ ...model.rows[0], shipNo: `BLOCKED_${dataState}` }],
    selected: { ...model.selected, title: `BLOCKED_${dataState}` },
  });
  assert.doesNotMatch(blocked, new RegExp(`BLOCKED_${dataState}`));
  assert.doesNotMatch(blocked, /history-v4__workspace/);
}

for (const dataState of ["stale", "offline"]) {
  const cached = renderHistoryV4View({ ...model, dataState, rows: [{ ...model.rows[0], shipNo: `CACHED_${dataState}` }] });
  assert.match(cached, new RegExp(`CACHED_${dataState}`));
  assert.match(cached, new RegExp(`data-history-v4-state="${dataState}"`));
}

let contextArgument;
let stateArgument;
const shared = renderHistoryV4View({ ...model, context: { route: "history" } }, {
  renderDataContext(context) {
    contextArgument = context;
    return '<header data-test-context>공통 컨텍스트</header>';
  },
  renderDataState(options) {
    stateArgument = options;
    return '<div data-test-state>공통 상태</div>';
  },
});
assert.deepStrictEqual(contextArgument, { route: "history" });
assert.strictEqual(stateArgument.retryAction, "retry-history");
assert.match(shared, /data-test-context/);
assert.match(shared, /data-test-state/);
assert.doesNotMatch(shared, /<h1>점검 이력<\/h1>/);

const escaped = renderHistoryV4View({
  ...model,
  filters: { ...model.filters, query: '<script>alert(1)</script>' },
  rows: [{ ...model.rows[0], id: '" autofocus onfocus=alert(1)', shipNo: "<img src=x>" }],
});
assert.doesNotMatch(escaped, /<script>|<img/);
assert.match(escaped, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
assert.match(escaped, /&quot; autofocus onfocus=alert\(1\)/);

console.log("history v4 view tests passed");
