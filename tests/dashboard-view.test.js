const assert = require("assert");
const fs = require("fs");
const path = require("path");

const dashboardView = require("../assets/js/dashboard-view.js");

const ROOT = path.join(__dirname, "..");
const ASSET_TOKEN = "20260826-v4-1";
const APP_SCRIPT = `assets/dist/js/app-v2.min.js?v=${ASSET_TOKEN}`;
const WORKER_HELPER_SCRIPT = `assets/dist/js/worker-helpers.min.js?v=${ASSET_TOKEN}`;
const DASHBOARD_VIEW_SCRIPT = `assets/dist/js/dashboard-view.min.js?v=${ASSET_TOKEN}`;

const html = dashboardView.renderDashboardView({
  todayCount: 4,
  todayDone: 3,
  todayPending: 1,
  todayCompletion: 75,
  unsafeCount: 2,
  openMaterials: 5,
  todayWorkCount: 6,
  todayWorkProgress: 4,
  appVersionLabel: "v1.12.4",
  syncStatus: "online",
  syncLabel: "온라인 · 동기화 완료",
  myCheck: {
    status: "ready",
    pending: 3,
    nextLabel: "H1201 · 탑재",
  },
}, {
  sectionHeading: (id, label) => `<h2 id="${id}">${label}</h2>`,
  navIcon: (name) => `<i data-icon="${name}"></i>`,
});

assert(html.includes('<main class="home-v4" aria-labelledby="homeV4Title">'));
assert(html.includes('<h1 id="homeV4Title">오늘의 안전 운영</h1>'));
assert(html.includes('<span class="home-v4__version">v1.12.4</span>'));
assert(html.includes('data-home-sync="online"'));
assert(html.includes("온라인 · 동기화 완료"));
assert.strictEqual((html.match(/<article class="home-v4__card">/g) || []).length, 4);
assert(html.includes("미점검 <strong>3</strong>건"));
assert(html.includes("다음 점검 · H1201 · 탑재"));
assert(html.includes('data-view="check"'));
assert(html.includes('data-view="unsafe"'));
assert(html.includes('data-view="materials"'));
assert(html.includes('data-view="manage" data-manage-center-card="operations"'));
assert(html.includes('data-view="items"'));
assert(html.includes("불안전요소 <strong>2</strong>건"));
assert(html.includes("자재누락 <strong>5</strong>건"));
assert(html.includes("작업지시 <strong>6</strong>건"));
assert(html.includes("진행 <strong>4</strong>건"));
assert(html.includes("관리 설정은 현장 실행과 분리"));
assert(html.includes('<i data-icon="settings"></i>'));
assert(!html.includes("현장 안전 홈"));
assert(!html.includes('class="home-v4__kicker'));

const unsafeZero = dashboardView.renderDashboardView({
  unsafeCount: 0,
  openMaterials: 0,
});
assert(unsafeZero.includes("불안전요소 <strong>0</strong>건"));
assert(unsafeZero.includes("자재누락 <strong>0</strong>건"));

const completedCheck = dashboardView.renderDashboardView({
  myCheck: { status: "done", pending: 0, total: 2 },
});
assert(completedCheck.includes('data-view="history"'));
assert(completedCheck.includes("2건 제출 완료"));

const lockedCheck = dashboardView.renderDashboardView({
  myCheck: { status: "locked", pending: 1, lockMessage: "07:00부터 시작 가능합니다" },
});
assert(lockedCheck.includes('disabled title="07:00부터 시작 가능합니다"'));

const analyticsHtml = dashboardView.renderAnalyticsDashboardView({
  dateLabel: "2026년 5월 28일",
  syncText: "동기화 완료",
  todayDone: 7,
  todayPending: 2,
  todayDeltaText: "어제 대비 +2건",
  unsafeOpen: 3,
  unsafeSummary: "1건 접수 · 2건 조치중",
  materialOpen: 4,
  materialSummary: "2건 접수 · 2건 확인중",
  shipCount: 8,
  processStageCount: 5,
  processSummary: "3/5단계 분포",
  processRows: [
    { info: { label: "탑재", stage: "mounting", color: "#123456" }, count: 2, percent: 25 },
  ],
  risk: {
    ng: { count: 2, percent: 20 },
    warn: { count: 3, percent: 30 },
    ok: { count: 5, percent: 50 },
  },
  weeklyAverage: "2.4",
  recent: [
    { id: "unsafe-1", kind: "unsafe", type: "불안전요소 등록", shipNo: "S-1", content: "긴 제목", worker: "홍길동", status: "접수", time: "2026-05-28T01:02:03.000Z" },
  ],
}, {
  analyticsKpi: (label, value, note, tone) => `<div class="analytics-kpi ${tone}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`,
  monthlyWorkerAnalyticsHtml: '<section data-test-monthly-worker>월간 작업자</section>',
  relativeRecordTime: () => "방금",
  shortUnsafeTitle: (value) => `요약:${value}`,
  statusChip: (value) => `<i data-status="${value}">${value}</i>`,
});
assert(analyticsHtml.includes('<section class="admin-board analytics-board analytics-v4">'));
assert(analyticsHtml.includes('data-export-records="analytics"'));
assert(analyticsHtml.includes("조치가 필요한 지점부터"));
assert(analyticsHtml.includes('class="analytics-action-grid"'));
assert(analyticsHtml.includes("오늘 미점검"));
assert(analyticsHtml.includes("미조치 불안전요소"));
assert(analyticsHtml.includes("미처리 자재"));
assert(analyticsHtml.includes("<strong>2</strong>"));
assert(analyticsHtml.includes('data-analytics-priority'));
assert(analyticsHtml.includes('data-analytics-priority-row="inspection"'));
assert(analyticsHtml.includes('data-analytics-priority-row="unsafe"'));
assert(analyticsHtml.includes('data-analytics-priority-row="material"'));
assert(analyticsHtml.includes("지표 기준 보기"));
assert(analyticsHtml.includes('class="analytics-utilities"'));
assert(analyticsHtml.includes("어제 대비 +2건"));
assert(analyticsHtml.includes("<section data-test-monthly-worker>월간 작업자</section>"));
assert(analyticsHtml.includes('aria-valuenow="25"'));
assert(analyticsHtml.includes("<em>Mounting</em>"));
assert(analyticsHtml.includes("위험 · NG"));
assert(analyticsHtml.includes("2.4건/일"));
assert(analyticsHtml.includes('class="analytics-risk-donut"'));
assert(!analyticsHtml.includes("analytics-eyebrow"));
assert(!analyticsHtml.includes("analytics-priority-item"));
assert(analyticsHtml.includes('data-action="open-analytics-filters"'));
assert(analyticsHtml.includes('data-analytics-record-kind="unsafe"'));
assert(analyticsHtml.includes('data-analytics-record-id="unsafe-1"'));
assert(analyticsHtml.includes("요약:긴 제목"));
assert(analyticsHtml.includes('<i data-status="접수">접수</i>'));
assert(analyticsHtml.indexOf('data-analytics-priority') < analyticsHtml.indexOf('class="analytics-action-grid"'));
assert(analyticsHtml.indexOf('class="analytics-action-grid"') < analyticsHtml.indexOf("현장 진행 현황"));
assert(analyticsHtml.indexOf("최근 현장 안전 기록") < analyticsHtml.indexOf('<section data-test-monthly-worker>'));
assert(analyticsHtml.indexOf('class="analytics-utilities"') > analyticsHtml.indexOf('<section data-test-monthly-worker>'));

const analyticsUnknownPendingHtml = dashboardView.renderAnalyticsDashboardView({
  unsafeOpen: 0,
  materialOpen: 0,
}, {
  analyticsKpi: (label, value, note, tone) => `<div class="analytics-kpi ${tone}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`,
});
assert(analyticsUnknownPendingHtml.includes("오늘 미점검"));
assert(analyticsUnknownPendingHtml.includes("<strong>—</strong>"), "missing pending count stays explicitly unknown instead of using a synthetic value");
assert(analyticsUnknownPendingHtml.includes('class="analytics-risk-donut is-empty"'), "zero recent safety signals use the neutral empty ring");

const analyticsContextCalls = [];
const analyticsStateCalls = [];
const analyticsContextHtml = dashboardView.renderAnalyticsDashboardView({
  context: { source: "inspection-cache" },
  dataState: "ready",
}, {
  renderDataContext: (context) => {
    analyticsContextCalls.push(context);
    return `<aside data-test-analytics-context="${context.source}"></aside>`;
  },
  renderDataState: (dataStateModel) => {
    analyticsStateCalls.push(dataStateModel);
    return `<aside data-test-analytics-state="${dataStateModel.state}"></aside>`;
  },
});
assert.deepStrictEqual(analyticsContextCalls, [{ source: "inspection-cache" }], "analytics forwards model context to the injected renderer");
assert.deepStrictEqual(analyticsStateCalls, [{
  state: "ready",
  loadingLabel: "분석 데이터를 불러오는 중입니다.",
  errorLabel: "분석 데이터를 불러오지 못했습니다. 연결 상태를 확인한 뒤 다시 시도해주세요.",
  emptyLabel: "표시할 분석 데이터가 없습니다.",
  staleLabel: "최신 데이터를 확인하지 못해 마지막으로 저장된 내용을 표시합니다.",
  offlineLabel: "오프라인 상태입니다. 마지막으로 저장된 내용을 읽기 전용으로 표시합니다.",
  retryAction: "retry-analytics-data",
  retryLabel: "다시 시도",
}], "analytics forwards the shared data-state options model to the injected renderer");
assert(analyticsContextHtml.includes('data-test-analytics-context="inspection-cache"'));
assert(analyticsContextHtml.includes('data-test-analytics-state="ready"'));

for (const dataState of ["loading", "error", "empty", "offline-empty"]) {
  const blockedAnalyticsHtml = dashboardView.renderAnalyticsDashboardView({
    dataState,
    todayDone: 40,
    todayPending: 43,
    unsafeOpen: 93,
    materialOpen: 88,
    processRows: [{ info: { label: "비공개 공정" }, count: 7, percent: 93 }],
    risk: { ng: { count: 93, percent: 93 } },
    recent: [{ id: "cached-record", kind: "unsafe", type: "비공개", content: "캐시 기록" }],
  }, {
    monthlyWorkerAnalyticsHtml: '<section data-test-monthly-worker>캐시 월간</section>',
    renderDataState: (dataStateModel) => `<aside data-test-analytics-state="${dataStateModel.state}"></aside>`,
  });
  assert(blockedAnalyticsHtml.includes(`data-test-analytics-state="${dataState}"`));
  assert(!blockedAnalyticsHtml.includes('class="analytics-action-grid"'), `${dataState} state hides action KPIs`);
  assert(!blockedAnalyticsHtml.includes('data-export-records="analytics"'), `${dataState} state hides exports`);
  assert(!blockedAnalyticsHtml.includes("93%"), `${dataState} state hides plausible cached rates`);
  assert(!blockedAnalyticsHtml.includes("캐시 기록"), `${dataState} state hides cached record lists`);
  assert(!blockedAnalyticsHtml.includes("캐시 월간"), `${dataState} state hides monthly cached content`);
}

for (const dataState of ["stale", "offline"]) {
  const cachedAnalyticsHtml = dashboardView.renderAnalyticsDashboardView({
    dataState,
    actionsDisabled: true,
    todayDone: 7,
    todayPending: 2,
    unsafeOpen: 3,
    materialOpen: 4,
    processRows: [{ info: { label: "탑재", stage: "mounting" }, count: 2, percent: 93 }],
    risk: { ng: { count: 5, percent: 20 }, warn: { count: 3, percent: 30 }, ok: { count: 8, percent: 50 } },
  }, {
    renderDataState: (dataStateModel) => `<aside data-test-analytics-state="${dataStateModel.state}"></aside>`,
  });
  assert(cachedAnalyticsHtml.includes(`data-test-analytics-state="${dataState}"`), `${dataState} state shows its data banner`);
  assert(cachedAnalyticsHtml.includes("93%"), `${dataState} state keeps cached read-only metrics visible`);
  assert(cachedAnalyticsHtml.includes('data-export-records="analytics"'), `${dataState} state keeps cached export access visible`);
  assert(cachedAnalyticsHtml.includes('data-view="check" type="button" disabled'), `${dataState} state disables the fresh inspection action`);
  assert(cachedAnalyticsHtml.includes('data-view="ships" type="button">자세히 →</button>'), `${dataState} state keeps navigation-only detail usable`);
}

const actionKpis = [];
dashboardView.renderAnalyticsDashboardView({
  todayDone: 7,
  todayPending: 2,
}, {
  analyticsKpi: (label, value, note, tone) => {
    actionKpis.push({ label, value, note, tone });
    return "";
  },
});
assert.strictEqual(actionKpis.length, 4, "analytics action grid exposes four KPI items for a mobile 2x2 layout");
assert.deepStrictEqual(actionKpis.map((item) => item.label), ["오늘 미점검", "미조치 불안전요소", "미처리 자재", "오늘 완료"]);
assert.strictEqual(actionKpis[3].value, 7);

const monthlyHtml = dashboardView.renderMonthlyWorkerAnalyticsView({
  monthText: "2026년 5월",
  monthHighlight: true,
  restOpen: true,
  range: {
    start: "2026-05-01",
    end: "2026-05-31",
    monthKey: "2026-05",
    dates: ["2026-05-01", "2026-05-02", "2026-05-03"],
    canGoNext: false,
    isCurrentMonth: true,
  },
  workers: [
    {
      key: "hong",
      name: "홍길동",
      team: "의장",
      rate: 80,
      counts: { done: 1, partial: 1, missing: 0, target: 2 },
      expanded: true,
      dayStatuses: [
        { date: "2026-05-01", day: 1, status: "done" },
        { date: "2026-05-02", day: 2, status: "partial" },
        { date: "2026-05-03", day: 3, status: "excluded" },
      ],
    },
  ],
  rate: 50,
  totals: { done: 1, target: 2, rest: 1 },
  dueLabel: "누락 작업자",
  dueMissing: 1,
  restPanel: {
    useKoreanPublicHolidays: true,
    start: "2026-05-01",
    end: "2026-05-31",
    holidayRows: [{ date: "2026-05-05", name: "어린이날" }],
    customRows: ["2026-05-06"],
  },
}, {
  analyticsKpi: (label, value, note, tone) => `<div class="analytics-kpi ${tone}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`,
});
assert(monthlyHtml.includes('<section class="analytics-panel monthly-worker-analytics">'));
assert(monthlyHtml.includes("월간 작업자 점검 현황"));
assert(monthlyHtml.includes("monthly-worker-month-label is-highlight"));
assert(monthlyHtml.includes('data-monthly-worker-month="next" disabled'));
assert(monthlyHtml.includes('data-export-records="monthly-worker-analytics"'));
assert(monthlyHtml.includes('data-monthly-worker-toggle="hong"'));
assert(monthlyHtml.includes('aria-expanded="true"'));
assert(monthlyHtml.includes('aria-label="홍길동 2026-05 점검 달력"'));
assert(monthlyHtml.includes("1일 완료"));
assert(monthlyHtml.includes("3일 제외")); // 작업지시서 미참여일은 누락이 아닌 제외로 표시
assert(monthlyHtml.includes("대한민국 국경일/공휴일/대체공휴일 자동 휴무 적용"));
assert(monthlyHtml.includes("05-05 · 어린이날"));
assert(monthlyHtml.includes('data-delete-monthly-rest-day="2026-05-06"'));

const monthlyLoadingHtml = dashboardView.renderMonthlyWorkerAnalyticsView({
  dataState: "loading",
  monthText: "2026년 5월",
  range: { start: "2026-05-01", end: "2026-05-31", canGoNext: false, isCurrentMonth: true },
  workers: [{ key: "cached", name: "캐시 작업자", rate: 93, counts: { done: 40, target: 43 } }],
  rate: 93,
  totals: { done: 40, target: 43 },
  dueMissing: 3,
}, {
  analyticsKpi: (label, value) => `<div class="analytics-kpi"><span>${label}</span><strong>${value}</strong></div>`,
});
assert(monthlyLoadingHtml.includes('data-monthly-worker-state="loading"'));
assert(monthlyLoadingHtml.includes('aria-live="polite"'));
assert(monthlyLoadingHtml.includes("월간 점검 데이터를 불러오는 중입니다."));
assert(monthlyLoadingHtml.includes('data-export-records="monthly-worker-analytics" disabled'));
assert(!monthlyLoadingHtml.includes("93%"), "loading view must not expose a plausible cached rate");
assert(!monthlyLoadingHtml.includes("40/43"), "loading view must not expose cached completion totals");
assert(!monthlyLoadingHtml.includes('data-monthly-worker-toggle="cached"'), "loading view must hide cached worker cards");

const monthlyErrorHtml = dashboardView.renderMonthlyWorkerAnalyticsView({
  dataState: "error",
  monthText: "2026년 5월",
  range: { start: "2026-05-01", end: "2026-05-31", canGoNext: false, isCurrentMonth: true },
  workers: [{ key: "cached", name: "캐시 작업자", rate: 93, counts: { done: 40, target: 43 } }],
  rate: 93,
  totals: { done: 40, target: 43 },
}, {
  analyticsKpi: (label, value) => `<div class="analytics-kpi"><span>${label}</span><strong>${value}</strong></div>`,
});
assert(monthlyErrorHtml.includes('data-monthly-worker-state="error"'));
assert(monthlyErrorHtml.includes("월간 점검 데이터를 불러오지 못했습니다."));
assert(monthlyErrorHtml.includes('data-action="retry-monthly-worker-analytics"'));
assert(monthlyErrorHtml.includes('data-export-records="monthly-worker-analytics" disabled'));
assert(!monthlyErrorHtml.includes("93%"), "error view must not present cached data as authoritative");
assert(!monthlyErrorHtml.includes('data-monthly-worker-toggle="cached"'), "error view must hide cached worker cards");

const monthlyDataStateModels = [];
dashboardView.renderMonthlyWorkerAnalyticsView({
  dataState: "loading",
  range: { canGoNext: false },
}, {
  renderDataState: (dataStateModel) => {
    monthlyDataStateModels.push(dataStateModel);
    return `<aside data-test-monthly-state="${dataStateModel.state}"></aside>`;
  },
});
assert.deepStrictEqual(monthlyDataStateModels, [{
  state: "loading",
  loadingLabel: "월간 점검 데이터를 불러오는 중입니다.",
  errorLabel: "월간 점검 데이터를 불러오지 못했습니다. 연결 상태를 확인한 뒤 다시 시도해주세요.",
  emptyLabel: "표시할 월간 점검 데이터가 없습니다.",
  staleLabel: "최신 월간 점검 데이터를 확인하지 못해 마지막으로 저장된 내용을 표시합니다.",
  offlineLabel: "오프라인 상태입니다. 마지막으로 저장된 월간 점검 내용을 읽기 전용으로 표시합니다.",
  retryAction: "retry-monthly-worker-analytics",
  retryLabel: "다시 시도",
}], "monthly analytics forwards the shared data-state options model");

const monthlyActionsDisabledHtml = dashboardView.renderMonthlyWorkerAnalyticsView({
  actionsDisabled: true,
  range: { canGoNext: false },
});
assert(monthlyActionsDisabledHtml.includes('data-export-records="monthly-worker-analytics" disabled'), "monthly export disables when fresh-only actions are unavailable");

const manageHtml = dashboardView.renderManageShellView({
  pageHeadHtml: '<header data-test-page-head>관리</header>',
  readOnlyNoticeHtml: '<div class="notice">읽기 전용</div>',
  tabs: [
    { id: "unsafe", label: "불안전요소", count: 3, active: true },
    { id: "materials", label: "자재누락", count: 2, active: false },
  ],
  activeTab: "unsafe",
  panels: {
    unsafe: '<div data-test-panel="unsafe">unsafe panel</div>',
    materials: '<div data-test-panel="materials">materials panel</div>',
  },
});
assert(manageHtml.includes('<header data-test-page-head>관리</header>'));
assert(manageHtml.includes('<div class="notice">읽기 전용</div>'));
assert(manageHtml.includes('<div class="manage-tabs" role="tablist" aria-label="관리 탭">'));
assert(manageHtml.includes('class="seg-btn active" data-manage-tab="unsafe"'));
assert(manageHtml.includes("불안전요소 <span>3</span>"));
assert(manageHtml.includes('<div class="manage-workspace">'));
assert(manageHtml.includes('data-test-panel="unsafe"'));
assert(!manageHtml.includes('data-test-panel="materials"'));

const workPrepManageHtml = dashboardView.renderManageShellView({
  tabs: [{ id: "workPrep", label: "작업지시서", count: 4, active: true }],
  activeTab: "workPrep",
  panels: { workPrep: '<div data-test-panel="workPrep">work prep panel</div>' },
});
assert(workPrepManageHtml.includes('data-manage-tab="workPrep"'));
assert(workPrepManageHtml.includes("작업지시서 <span>4</span>"));
assert(workPrepManageHtml.includes('data-test-panel="workPrep"'));

const unsafeCardHtml = dashboardView.renderUnsafeRecordCardView({
  id: "unsafe-1",
  shipNo: "S-100",
  content: "작업 발판 난간 미설치",
  workerName: "홍길동",
  createdAtText: "2026-05-29 10:00",
  photoCount: 2,
  pendingPhotoCount: 1,
  uploading: true,
  adminMemo: "조치중",
  timelineHtml: '<ol data-test-timeline="unsafe"></ol>',
  adminControlsHtml: '<div data-test-controls="unsafe"></div>',
});
assert(unsafeCardHtml.includes('data-unsafe-record-detail="unsafe-1"'));
assert(unsafeCardHtml.includes('aria-label="S-100 불안전요소 상세 보기"'));
assert(unsafeCardHtml.includes("사진 2장"));
assert(unsafeCardHtml.includes("사진 업로드 중"));
assert(unsafeCardHtml.includes("사진 업로드 대기 1장"));
assert(unsafeCardHtml.includes("작업 발판 난간 미설치"));
assert(unsafeCardHtml.includes('data-test-timeline="unsafe"'));
assert(unsafeCardHtml.includes('data-test-controls="unsafe"'));

const unsafeDetailHtml = dashboardView.renderUnsafeDetailView({
  statusBadgeHtml: '<span class="badge medium">접수</span>',
  shipNo: "S-300",
  workerName: "박안전",
  createdAtText: "2026-05-29 12:00",
  photoCount: 1,
  content: "개구부 덮개 미설치",
  adminMemo: "현장 확인 중",
  photos: [{ url: "https://example.test/photo.jpg" }],
  pendingPhotoHtml: '<div data-test-pending-photo></div>',
  timelineHtml: '<ol data-test-detail-timeline></ol>',
  adminControlsHtml: '<div data-test-detail-controls></div>',
});
assert(unsafeDetailHtml.includes('<section class="panel panel-pad unsafe-detail">'));
assert(unsafeDetailHtml.includes('data-action="back-unsafe-list"'));
assert(unsafeDetailHtml.includes('<span class="badge medium">접수</span>'));
assert(unsafeDetailHtml.includes("<strong>S-300</strong>"));
assert(unsafeDetailHtml.includes("박안전"));
assert(unsafeDetailHtml.includes("개구부 덮개 미설치"));
assert(unsafeDetailHtml.includes('class="unsafe-detail-photo" src="https://example.test/photo.jpg"'));
assert(unsafeDetailHtml.includes("사진 1"));
assert(!unsafeDetailHtml.includes("현장 확인 중"));
assert(unsafeDetailHtml.includes("data-test-detail-timeline"));
assert(unsafeDetailHtml.includes("data-test-detail-controls"));

const materialCardHtml = dashboardView.renderMaterialRecordCardView({
  shipNo: "S-200",
  materialName: "볼트",
  workerName: "김자재",
  createdAtText: "2026-05-29 11:00",
  content: "M12 볼트 부족",
  adminMemo: "입고 예정",
  timelineHtml: '<ol data-test-timeline="materials"></ol>',
  adminControlsHtml: '<div data-test-controls="materials"></div>',
});
assert(materialCardHtml.includes("<strong>S-200 · 볼트</strong>"));
assert(materialCardHtml.includes("김자재 · 2026-05-29 11:00"));
assert(materialCardHtml.includes("M12 볼트 부족"));
assert(materialCardHtml.includes("메모: 입고 예정"));
assert(materialCardHtml.includes('data-test-timeline="materials"'));
assert(materialCardHtml.includes('data-test-controls="materials"'));

const materialDetailHtml = dashboardView.renderMaterialDetailView({
  statusBadgeHtml: '<span class="badge medium">확인중</span>',
  shipNo: "S-400",
  materialName: "와셔",
  quantityText: "12개",
  workerName: "이자재",
  createdAtText: "2026-05-29 13:00",
  content: "와셔 부족",
  adminMemo: "구매 요청 완료",
  timelineHtml: '<ol data-test-detail-timeline="materials"></ol>',
  adminControlsHtml: '<div data-test-detail-controls="materials"></div>',
});
assert(materialDetailHtml.includes('<section class="panel panel-pad material-detail">'));
assert(materialDetailHtml.includes('data-action="back-material-list"'));
assert(materialDetailHtml.includes('<span class="badge medium">확인중</span>'));
assert(materialDetailHtml.includes("<strong>S-400</strong>"));
assert(materialDetailHtml.includes("<strong>와셔</strong>"));
assert(materialDetailHtml.includes("<strong>12개</strong>"));
assert(materialDetailHtml.includes("와셔 부족"));
assert(!materialDetailHtml.includes("구매 요청 완료"));
assert(materialDetailHtml.includes('data-test-detail-timeline="materials"'));
assert(materialDetailHtml.includes('data-test-detail-controls="materials"'));

const historyLoadMoreHtml = dashboardView.renderHistoryLoadMoreView({ visible: true });
assert(historyLoadMoreHtml.includes('data-action="load-more-history"'));
assert(historyLoadMoreHtml.includes("더 보기"));
assert.equal(dashboardView.renderHistoryLoadMoreView({ visible: false }), "");

const historyTableHtml = dashboardView.renderHistoryTableView({
  rows: [
    {
      id: "history-1",
      accent: "#123456",
      stageColor: "#8F5E35",
      stageBg: "#F8F1E8",
      ariaLabel: "화기 작업 점검 상세내역 보기",
      categoryVisualHtml: '<span data-test-icon>🔥</span>',
      canSelect: true,
      selected: true,
      shipNo: "S-400",
      workLabel: "화기 작업",
      workerName: "김작업",
      workerTeam: "선행",
      dateText: "2026-05-29",
      timePeriod: "오후",
      timeText: "6:24",
      statusLabel: "점검 완료",
      completion: 80,
    },
  ],
});
assert(historyTableHtml.includes('<div class="history-list">'));
assert(historyTableHtml.includes('class="history-list-card"'));
assert(historyTableHtml.includes('data-history-detail-card="history-1"'));
assert(historyTableHtml.includes('aria-label="화기 작업 점검 상세내역 보기"'));
assert(historyTableHtml.includes('style="--accent:#123456;--stage:#8F5E35;--stage-bg:#F8F1E8"'));
assert(historyTableHtml.includes('data-history-check="history-1" checked'));
assert(historyTableHtml.includes('data-history-detail="history-1"'));
assert(historyTableHtml.includes('<span data-test-icon>🔥</span>'));
assert(historyTableHtml.includes("history-worker-badge is-pre"));
assert(historyTableHtml.includes("history-list-status-stack"));
assert(historyTableHtml.includes("S-400"));
assert(historyTableHtml.includes("화기 작업"));
assert(historyTableHtml.includes("김작업"));
assert(historyTableHtml.includes("선행"));
assert(!historyTableHtml.includes("조장"));
assert(historyTableHtml.includes("오후 6:24"));
assert(historyTableHtml.includes("2026-05-29"));
assert(historyTableHtml.includes("점검 완료"));

const htmlFiles = fs.readdirSync(ROOT).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const page = fs.readFileSync(path.join(ROOT, file), "utf8");
  const appIndex = page.indexOf(APP_SCRIPT);
  if (appIndex === -1) continue;
  const workerIndex = page.indexOf(WORKER_HELPER_SCRIPT);
  const dashboardIndex = page.indexOf(DASHBOARD_VIEW_SCRIPT);
  assert(dashboardIndex !== -1, `${file} loads dashboard view script`);
  assert(workerIndex !== -1, `${file} loads worker helper script`);
  assert(workerIndex < dashboardIndex, `${file} loads worker helper before dashboard view`);
  assert(dashboardIndex < appIndex, `${file} loads dashboard view before app-v2`);
}

const app = fs.readFileSync(path.join(ROOT, "assets/js/app-v2.js"), "utf8");
const extractFunction = (source, name) => {
  const start = source.indexOf(`function ${name}`);
  assert(start !== -1, `${name} exists`);
  let depth = 0;
  let seenBody = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") {
      depth += 1;
      seenBody = true;
    } else if (char === "}") {
      depth -= 1;
      if (seenBody && depth === 0) return source.slice(start, index + 1);
    }
  }
  assert.fail(`${name} has a complete function body`);
};
// 모델 빌더는 assets/js/analytics-model.js로 추출됨 — 특성 검증도 모듈 소스를 본다.
const analyticsModelSource = fs.readFileSync(path.join(ROOT, "assets/js/analytics-model.js"), "utf8");
const analyticsModel = extractFunction(analyticsModelSource, "buildAnalyticsDashboardModel");
const analyticsAppWrapper = extractFunction(app, "buildAnalyticsDashboardModel");
assert(analyticsAppWrapper.includes("ANALYTICS_MODEL.buildAnalyticsDashboardModel("), "app-v2 delegates analytics model building to analytics-model module");
assert(app.includes("window.ShipyardAnalyticsModel"), "app-v2 reads analytics model global");
const analyticsRender = extractFunction(app, "renderAnalyticsDashboard");
const monthlyAnalyticsModel = extractFunction(app, "buildMonthlyWorkerAnalyticsModel");
const monthlyWorkerDataState = extractFunction(app, "monthlyWorkerInspectionDataState");
const inspectionRangeLoadEntry = extractFunction(app, "inspectionRangeLoadEntry");
const inspectionRangeLoader = extractFunction(app, "ensureInspectionRangeLoaded");
assert(app.includes("window.ShipyardDashboardView"), "app-v2 reads dashboard view global");
assert(app.includes("DASHBOARD_VIEW.renderDashboardView(dashboardModel(), { sectionHeading, navIcon })"), "renderDashboard delegates to dashboard view");
assert(analyticsModel.includes("dateLabel: formatKoreanDate(now)"), "analytics model owns date label derivation");
assert(analyticsModel.includes("processRows: processRows.map"), "analytics model owns process row derivation");
assert(analyticsModel.includes("risk: {"), "analytics model owns risk distribution derivation");
assert(analyticsModel.includes("weeklyAverage:"), "analytics model owns weekly average derivation");
assert(analyticsModel.includes("recent,"), "analytics model owns recent activity derivation");
assert(dashboardView.renderAnalyticsDashboardView, "dashboard view exports analytics dashboard renderer");
assert(analyticsRender.includes("DASHBOARD_VIEW.renderAnalyticsDashboardView(buildAnalyticsDashboardModel(), {"), "analytics render delegates markup to dashboard view");
assert(analyticsRender.includes("monthlyWorkerAnalyticsHtml: renderMonthlyWorkerAnalytics()"), "analytics render passes monthly analytics markup into the view");
assert(monthlyAnalyticsModel.includes("const dataState = monthlyWorkerInspectionDataState(stats.range);"), "monthly analytics derives the selected range load state once");
assert(monthlyAnalyticsModel.includes("dataState,"), "monthly analytics exposes the selected range load state");
assert(monthlyAnalyticsModel.includes('actionsDisabled: dataState !== "ready"'), "monthly analytics disables fresh-only actions outside a ready state");
assert(monthlyWorkerDataState.includes('if (!isSyncConfigured()) return "ready";'), "local-only monthly analytics remains immediately available");
assert(monthlyWorkerDataState.includes("dataSurfaceState({"), "remote monthly analytics derives a shared data-surface state");
assert(monthlyWorkerDataState.includes("range: inspectionRangeLoadEntry(range)"), "remote monthly analytics waits for an authoritative range load");
assert(inspectionRangeLoadEntry.includes('{ status: "error", at: Date.now() }'), "remote monthly analytics exposes invalid range failures");
assert(/status: "error"[\s\S]*?renderPreservingScroll\(\)/.test(inspectionRangeLoader), "range load failure re-renders the explicit error state");
assert(inspectionRangeLoader.includes("force = false"), "range loader supports explicit error recovery");
assert(app.includes('button.dataset.action === "retry-monthly-worker-analytics"'), "monthly analytics exposes an explicit retry action");
assert(app.includes("ensureInspectionRangeLoaded(range.start, range.end, true)"), "monthly analytics retry bypasses the error cooldown");
assert(!analyticsRender.includes("state."), "analytics render does not read application state directly");
assert(!analyticsRender.includes("SHIP_WORKFLOW_STAGES"), "analytics render does not derive workflow stage counts directly");
assert(!analyticsRender.includes("analytics-process-row"), "analytics process markup moved out of app-v2");
assert(!analyticsRender.includes("analytics-recent-card"), "analytics recent markup moved out of app-v2");
assert(!app.includes("function statPill("), "statPill moved out of app-v2");
assert(!app.includes("function statIcon("), "statIcon moved out of app-v2");

const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
assert(sw.includes("/assets/dist/js/dashboard-view.min.js?v=${ASSET_TOKEN}"), "service worker caches dashboard view");

console.log("dashboard view tests passed");
