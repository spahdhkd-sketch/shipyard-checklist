const assert = require("assert");
const fs = require("fs");
const path = require("path");

const dashboardView = require("../assets/js/dashboard-view.js");

const ROOT = path.join(__dirname, "..");
const ASSET_TOKEN = "20260609-work-prep-type-icons-1";
const APP_SCRIPT = `assets/js/app-v2.js?v=${ASSET_TOKEN}`;
const WORKER_HELPER_SCRIPT = `assets/js/worker-helpers.js?v=${ASSET_TOKEN}`;
const DASHBOARD_VIEW_SCRIPT = `assets/js/dashboard-view.js?v=${ASSET_TOKEN}`;

const html = dashboardView.renderDashboardView({
  todayCount: 4,
  todayDone: 3,
  todayPending: 1,
  todayCompletion: 75,
  unsafeCount: 2,
  deliverySoon: 1,
  openMaterials: 5,
  activeShips: 9,
  processStages: [
    { info: { label: "탑재", color: "#111111" }, count: 7 },
    { info: { label: "L/C", color: "#222222" }, count: 3 },
  ],
}, {
  sectionHeading: (id, label) => `<h2 id="${id}">${label}</h2>`,
  navIcon: (name) => `<i data-icon="${name}"></i>`,
});

assert(html.includes('<section class="ops-hero" aria-labelledby="dashboardQuickHeading">'));
assert(html.includes('data-view="check"'));
assert(html.includes('data-view="unsafe"'));
assert(html.includes('data-view="materials"'));
assert(html.includes('aria-valuenow="75"'));
assert(html.includes("<strong>3/4</strong>"));
assert(html.includes('data-stat-scope="today" data-history-scope="today"'));
assert(html.includes('data-stat-scope="unsafe" data-action="view-unsafe-received"'));
assert(html.includes('data-stat-scope="materials" data-action="view-material-list"'));
assert(html.includes('data-stat-scope="delivery" data-history-scope="delivery"'));
assert(html.includes("불안전요소"));
assert(html.includes("즉시 확인"));
assert(html.includes("누락 자재"));
assert(html.includes("인도 예정"));
assert(html.includes('<div class="mini-stage" style="--dot:#111111">'));
assert(html.includes('<div class="small muted">탑재</div>'));
assert(html.includes('<i data-icon="board"></i>'));

const unsafeZero = dashboardView.renderDashboardView({
  unsafeCount: 0,
  processStages: [],
});
assert(unsafeZero.includes('<div class="stat-foot is-empty">&nbsp;</div>'));

const analyticsHtml = dashboardView.renderAnalyticsDashboardView({
  dateLabel: "2026년 5월 28일",
  syncText: "동기화 완료",
  todayDone: 7,
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
assert(analyticsHtml.includes('<section class="admin-board analytics-board">'));
assert(analyticsHtml.includes("2026년 5월 28일 · 동기화 완료"));
assert(analyticsHtml.includes('data-export-records="analytics"'));
assert(analyticsHtml.includes("어제 대비 +2건"));
assert(analyticsHtml.includes("<section data-test-monthly-worker>월간 작업자</section>"));
assert(analyticsHtml.includes('aria-valuenow="25"'));
assert(analyticsHtml.includes("<em>Mounting</em>"));
assert(analyticsHtml.includes("위험 · NG"));
assert(analyticsHtml.includes("2.4건/일"));
assert(analyticsHtml.includes('data-action="open-analytics-filters"'));
assert(analyticsHtml.includes('data-analytics-record-kind="unsafe"'));
assert(analyticsHtml.includes('data-analytics-record-id="unsafe-1"'));
assert(analyticsHtml.includes("요약:긴 제목"));
assert(analyticsHtml.includes('<i data-status="접수">접수</i>'));

const monthlyHtml = dashboardView.renderMonthlyWorkerAnalyticsView({
  monthText: "2026년 5월",
  monthHighlight: true,
  restOpen: true,
  range: {
    start: "2026-05-01",
    end: "2026-05-31",
    monthKey: "2026-05",
    dates: ["2026-05-01", "2026-05-02"],
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
assert(monthlyHtml.includes("대한민국 국경일/공휴일/대체공휴일 자동 휴무 적용"));
assert(monthlyHtml.includes("05-05 · 어린이날"));
assert(monthlyHtml.includes('data-delete-monthly-rest-day="2026-05-06"'));

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
const analyticsModel = extractFunction(app, "buildAnalyticsDashboardModel");
const analyticsRender = extractFunction(app, "renderAnalyticsDashboard");
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
assert(!analyticsRender.includes("state."), "analytics render does not read application state directly");
assert(!analyticsRender.includes("SHIP_WORKFLOW_STAGES"), "analytics render does not derive workflow stage counts directly");
assert(!analyticsRender.includes("analytics-process-row"), "analytics process markup moved out of app-v2");
assert(!analyticsRender.includes("analytics-recent-card"), "analytics recent markup moved out of app-v2");
assert(!app.includes("function statPill("), "statPill moved out of app-v2");
assert(!app.includes("function statIcon("), "statIcon moved out of app-v2");

const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
assert(sw.includes("/assets/js/dashboard-view.js?v=${ASSET_TOKEN}"), "service worker caches dashboard view");

console.log("dashboard view tests passed");
