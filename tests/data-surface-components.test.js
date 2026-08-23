const assert = require("node:assert/strict");

const {
  renderDataContext,
  renderDataState,
  renderPledgeManagerView,
} = require("../assets/js/screen-views.js");

const count = (value, needle) => value.split(needle).length - 1;

// Given: untrusted text and trusted existing action markup.
// When: the data context is rendered.
// Then: text is escaped, markup is retained, and the page heading is singular.
const contextHtml = renderDataContext({
  eyebrow: "<script>",
  title: "<현황>",
  description: "A & B",
  businessDate: "2026-08-16",
  asOf: "10:30",
  status: "fresh",
  statusLabel: "<최신>",
  actionsHtml: '<button data-action="export">내보내기</button>',
});
assert.match(contextHtml, /<header class="data-context" data-status="fresh">/);
assert.strictEqual(count(contextHtml, "<h1"), 1);
assert.match(contextHtml, /&lt;script&gt;/);
assert.match(contextHtml, /&lt;현황&gt;/);
assert.match(contextHtml, /A &amp; B/);
assert.match(contextHtml, /<dl class="data-context__meta">/);
assert.match(contextHtml, /<dt>기준 날짜<\/dt><dd>2026-08-16<\/dd>/);
assert.match(contextHtml, /<dt>최종 반영<\/dt><dd>10:30<\/dd>/);
assert.match(contextHtml, /data-context__status is-fresh/);
assert.match(contextHtml, /&lt;최신&gt;/);
assert.match(contextHtml, /<button data-action="export">내보내기<\/button>/);

// Given: each supported freshness status.
// When: context is rendered.
// Then: the badge exposes the corresponding safe status class.
["fresh", "stale", "offline", "loading", "error", "empty", "unknown"].forEach((status) => {
  const statusHtml = renderDataContext({ status });
  assert.match(statusHtml, new RegExp(`<header class="data-context" data-status="${status}">`));
  assert.match(statusHtml, new RegExp(`data-context__status is-${status}`));
});
assert.match(renderDataContext({}), /<dt>기준 날짜<\/dt>/);
assert.match(renderDataContext({}), /<dt>최종 반영<\/dt>/);

// Given: a ready data surface.
// When: its state is rendered.
// Then: no state UI is added.
assert.strictEqual(renderDataState({ state: "ready" }), "");

// Given: a loading data surface.
// When: its state is rendered.
// Then: it announces progress and exposes three decorative skeleton rows.
const loadingHtml = renderDataState({ state: "loading", loadingLabel: "<불러오는 중>" });
assert.match(loadingHtml, /role="status"/);
assert.match(loadingHtml, /aria-live="polite"/);
assert.match(loadingHtml, /&lt;불러오는 중&gt;/);
assert.match(loadingHtml, /data-surface-state is-loading/);
assert.match(loadingHtml, /data-surface-state__skeleton/);
assert.strictEqual(count(loadingHtml, "data-surface-state__skeleton-row"), 3);
assert.strictEqual(count(loadingHtml, 'aria-hidden="true"'), 3);

// Given: an error with a retry action.
// When: its state is rendered.
// Then: the alert contains a scoped, escaped retry control.
const errorHtml = renderDataState({
  state: "error",
  errorLabel: "<불러오기 실패>",
  retryAction: "retry-data",
  retryLabel: "<다시 시도>",
});
assert.match(errorHtml, /role="alert"/);
assert.match(errorHtml, /&lt;불러오기 실패&gt;/);
assert.match(errorHtml, /class="data-surface-state__retry" data-action="retry-data" type="button">&lt;다시 시도&gt;<\/button>/);

// Given: empty, stale, offline, and offline-without-cache data states.
// When: each state is rendered.
// Then: it remains a nonblocking status, adding retry only when requested.
assert.match(renderDataState({ state: "empty", emptyLabel: "비어 있음" }), /role="status"/);
const staleHtml = renderDataState({ state: "stale", staleLabel: "이전 데이터", retryAction: "refresh-data" });
assert.match(staleHtml, /role="status"/);
assert.match(staleHtml, /data-action="refresh-data"/);
const offlineHtml = renderDataState({ state: "offline", offlineLabel: "오프라인" });
assert.match(offlineHtml, /role="status"/);
assert.doesNotMatch(offlineHtml, /data-surface-state__retry/);
const offlineEmptyHtml = renderDataState({ state: "offline-empty" });
assert.match(offlineEmptyHtml, /role="status"/);
assert.match(offlineEmptyHtml, /저장된 데이터가 없습니다/);

let contextModel;
let stateModel;
const blockingPledgeHtml = renderPledgeManagerView({
  context: { title: "서약 현황" },
  dataState: "error",
  actionsDisabled: true,
  dateLabel: "2026.08.16",
  viewDate: "2026-08-16",
  maxDate: "2026-08-16",
  kpiHtml: "CACHED_KPI",
  rows: [{ name: "CACHED_WORKER" }],
  weekBars: [{ label: "월", pct: 90, marker: "CACHED_WEEK" }],
}, {
  renderDataContext(model) {
    contextModel = model;
    return '<div data-test-context></div>';
  },
  renderDataState(model) {
    stateModel = model;
    return '<div data-test-state></div>';
  },
});
assert.deepStrictEqual(contextModel, { title: "서약 현황" });
assert.strictEqual(stateModel.state, "error");
assert.strictEqual(stateModel.retryAction, "retry-pledge-range");
assert.match(blockingPledgeHtml, /data-test-context/);
assert.match(blockingPledgeHtml, /data-test-state/);
assert.match(blockingPledgeHtml, /data-pledge-view-date/);
assert.match(blockingPledgeHtml, /data-export-records="pledge"[^>]*disabled/);
assert.doesNotMatch(blockingPledgeHtml, /CACHED_KPI|CACHED_WORKER|CACHED_WEEK/);

const stalePledgeHtml = renderPledgeManagerView({
  dataState: "stale",
  dateLabel: "2026.08.16",
  kpiHtml: "CACHED_STALE_KPI",
  rows: [{ name: "CACHED_STALE_WORKER" }],
  weekBars: [{ label: "월", pct: 90 }],
});
assert.match(stalePledgeHtml, /data-surface-state is-stale/);
assert.match(stalePledgeHtml, /CACHED_STALE_KPI/);
assert.match(stalePledgeHtml, /CACHED_STALE_WORKER/);

console.log("data surface component tests passed");
