const assert = require("node:assert");
const { renderPledgeActionView } = require("../assets/js/pledge-action-view.js");

const model = {
  viewDate: "2026-08-16",
  maxDate: "2026-08-16",
  freshness: {
    status: "fresh",
    label: "서버 최신",
    detail: "08:42 기준",
  },
  denominatorLabel: "확정 작업지시 12명 기준",
  kpis: {
    target: 12,
    completed: 9,
    actionNeeded: 3,
    completionRate: 75,
  },
  filters: [
    { value: "all", label: "전체", count: 3, active: true },
    { value: "pending", label: "미완료", count: 2, active: false },
  ],
  actionRows: [{
    id: "cohort-01",
    subjectLabel: "작업자 코드 A-01",
    assignmentLabel: "1호선 · 탑재",
    statusLabel: "미완료",
    reasonLabel: "서약 기록 없음",
    updatedLabel: "08:31 확인",
  }],
  recentSend: {
    title: "최근 발송",
    summary: "08:10 · 검토 대상 2건",
    statusLabel: "완료 추적 중",
  },
  utilities: {
    historyLabel: "발송 이력",
    settingsLabel: "알림 설정",
  },
  preflight: {
    open: true,
    targetCount: 3,
    acknowledged: false,
    checks: [
      { label: "확정 작업지시 대상", passed: true },
      { label: "서버 최신 상태", passed: true },
    ],
    acknowledgmentLabel: "대상과 알림 내용을 확인했습니다.",
  },
};

const html = renderPledgeActionView(model);

assert.ok(html.indexOf("오늘 작업 전 안전서약") < html.indexOf("대상 확인 → 알림 검토 → 완료 추적"));
assert.ok(html.indexOf("대상 확인 → 알림 검토 → 완료 추적") < html.indexOf("서버 최신"));
assert.ok(html.indexOf("서버 최신") < html.indexOf("확정 작업지시 12명 기준"));
assert.ok(html.indexOf("확정 작업지시 12명 기준") < html.indexOf("즉시 확인"));
assert.match(html, /data-action="pledge-prev-day"[^>]*>[^<]*이전 날<\/button>/);
assert.match(html, /data-pledge-view-date[^>]*value="2026-08-16"[^>]*max="2026-08-16"/);
assert.match(html, /data-action="pledge-next-day"[^>]*disabled/);
assert.match(html, /<table[^>]*class="pledge-action-table"/);
assert.match(html, /<th scope="col">대상<\/th>/);
assert.match(html, /class="pledge-action-mobile-card"/);
assert.match(html, /data-label="작업"/);
assert.match(html, /data-action="filter-pledge-action"/);
assert.match(html, /data-action="review-pledge-notifications"[^>]*>알림 대상 검토<\/button>/);
assert.doesNotMatch(html, /data-action="[^"]*(?:send|notify)[^"]*"/i);
assert.ok(html.indexOf("즉시 확인") < html.indexOf("알림 대상 검토"));
assert.ok(html.indexOf("알림 대상 검토") < html.indexOf("최근 발송"));
assert.ok(html.indexOf("최근 발송") < html.indexOf("발송 이력"));
assert.match(html, /role="dialog"/);
assert.match(html, /aria-modal="true"/);
assert.match(html, /data-action="acknowledge-pledge-preflight"/);
assert.match(html, /data-action="complete-pledge-preflight"[^>]*disabled/);
assert.match(html, /대상과 알림 내용을 확인했습니다\./);

const acknowledged = renderPledgeActionView({
  ...model,
  preflight: { ...model.preflight, acknowledged: true },
});
assert.doesNotMatch(acknowledged, /data-action="complete-pledge-preflight"[^>]*disabled/);
assert.match(acknowledged, /type="checkbox"[^>]*checked/);

const loading = renderPledgeActionView({
  ...model,
  dataState: "loading",
  denominatorLabel: "CACHED_TODAY_DENOMINATOR",
  actionRows: [{ ...model.actionRows[0], subjectLabel: "CACHED_TODAY_WORKER" }],
  recentSend: { ...model.recentSend, title: "CACHED_TODAY_RECENT" },
});
assert.match(loading, /aria-busy="true"/);
assert.match(loading, /role="status"[^>]*>오늘의 안전서약 데이터를 불러오는 중입니다\./);
assert.match(loading, /data-action="pledge-prev-day"/);
assert.doesNotMatch(loading, /CACHED_TODAY_DENOMINATOR|CACHED_TODAY_WORKER|CACHED_TODAY_RECENT/);
assert.doesNotMatch(loading, /role="dialog"/);

const offlineEmpty = renderPledgeActionView({
  ...model,
  dataState: "offline-empty",
  denominatorLabel: "CACHED_OFFLINE_DENOMINATOR",
  actionRows: [{ ...model.actionRows[0], subjectLabel: "CACHED_OFFLINE_WORKER" }],
  recentSend: { ...model.recentSend, title: "CACHED_OFFLINE_RECENT" },
});
assert.match(offlineEmpty, /저장된 안전서약 데이터가 없습니다/);
assert.doesNotMatch(offlineEmpty, /CACHED_OFFLINE_DENOMINATOR|CACHED_OFFLINE_WORKER|CACHED_OFFLINE_RECENT/);

const loadError = renderPledgeActionView({
  ...model,
  dataState: "error",
  denominatorLabel: "CACHED_TODAY_ERROR",
});
assert.match(loadError, /role="alert"/);
assert.match(loadError, /data-action="retry-pledge-range"/);
assert.doesNotMatch(loadError, /CACHED_TODAY_ERROR/);

const emptyData = renderPledgeActionView({
  ...model,
  dataState: "empty",
  denominatorLabel: "EMPTY_SHOULD_NOT_RENDER",
  actionRows: [{ ...model.actionRows[0], subjectLabel: "EMPTY_SHOULD_NOT_RENDER" }],
});
assert.match(emptyData, /data-pledge-action-state="empty"/);
assert.match(emptyData, /오늘의 안전서약 대상이 없습니다\./);
assert.doesNotMatch(emptyData, /EMPTY_SHOULD_NOT_RENDER|pledge-action-kpis|pledge-action-needed/);

for (const state of ["loading", "error", "empty", "offline-empty"]) {
  const blocked = renderPledgeActionView({
    ...model,
    dataState: state,
    denominatorLabel: `BLOCKED_${state}_COUNT_99`,
    actionRows: [{ ...model.actionRows[0], subjectLabel: `BLOCKED_${state}_ROW` }],
  });
  assert.doesNotMatch(blocked, new RegExp(`BLOCKED_${state}_(?:COUNT_99|ROW)`));
  assert.doesNotMatch(blocked, /pledge-action-kpis|pledge-action-needed/);
}

for (const state of ["stale", "offline"]) {
  const cached = renderPledgeActionView({
    ...model,
    dataState: state,
    freshness: { status: "fresh", label: "캐시", detail: "로컬" },
    denominatorLabel: `CACHED_${state}_COUNT_12`,
    actionRows: [{ ...model.actionRows[0], subjectLabel: `CACHED_${state}_ROW` }],
  });
  assert.match(cached, new RegExp(`pledge-data-state is-${state}`));
  assert.match(cached, new RegExp(`CACHED_${state}_COUNT_12`));
  assert.match(cached, new RegExp(`CACHED_${state}_ROW`));
  assert.match(cached, /data-action="review-pledge-notifications"[^>]*disabled/);
}

let contextArgument;
let stateArgument;
const sharedHtml = renderPledgeActionView({
  ...model,
  dataState: "stale",
  context: { route: "pledge", label: "공통 컨텍스트" },
}, {
  renderDataContext(context) {
    contextArgument = context;
    return '<header data-test-shared-context>공통 컨텍스트</header>';
  },
  renderDataState(options) {
    stateArgument = options;
    return '<div data-test-shared-state>공통 상태</div>';
  },
});
assert.deepStrictEqual(contextArgument, { route: "pledge", label: "공통 컨텍스트" });
assert.strictEqual(stateArgument.dataState, "stale");
assert.strictEqual(stateArgument.retryAction, "retry-pledge-range");
assert.match(sharedHtml, /data-test-shared-context/);
assert.match(sharedHtml, /data-test-shared-state/);
assert.doesNotMatch(sharedHtml, /오늘 작업 전 안전서약/);
assert.doesNotMatch(sharedHtml, /마지막으로 확인한 안전서약 데이터를 표시합니다/);

const escaped = renderPledgeActionView({
  ...model,
  denominatorLabel: "<img src=x onerror=alert(1)>",
  actionRows: [{
    id: "\" autofocus onfocus=alert(1)",
    subjectLabel: "<script>alert(1)</script>",
    assignmentLabel: "A&B",
    statusLabel: "미완료",
    reasonLabel: "<b>사유</b>",
    updatedLabel: "방금",
  }],
});
assert.doesNotMatch(escaped, /<script>|<img|<b>/);
assert.match(escaped, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
assert.match(escaped, /A&amp;B/);
assert.match(escaped, /data-row-id="&quot; autofocus onfocus=alert\(1\)"/);

const empty = renderPledgeActionView({
  freshness: { status: "stale", label: "확인 필요", detail: "동기화 지연" },
  denominatorLabel: "확정 작업지시 0명 기준",
  kpis: {},
  actionRows: [],
  filters: [],
  preflight: { open: false },
});
assert.match(empty, /확인이 필요한 대상이 없습니다\./);
assert.doesNotMatch(empty, /role="dialog"/);

console.log("pledge action view tests passed");
