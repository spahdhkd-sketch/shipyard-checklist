const assert = require("assert");
const manageCenterView = require("../assets/js/manage-center-view.js");

const html = manageCenterView.renderManageCenterView({
  searchQuery: "호선 100",
  actionNeededOnly: true,
  tabs: [
    { id: "intake", label: "접수 처리", count: 3, active: true },
    { id: "operations", label: "작업 운영", count: 8 },
    { id: "people", label: "구성원", count: 5 },
    { id: "records", label: "기록", count: 11 },
  ],
  activeTab: "intake",
  panels: { intake: '<div data-test-current-panel>caller rendered panel</div>' },
  cards: [
    { id: "intake", count: 3 },
    { id: "operations", count: 8 },
    { id: "people", count: 5 },
    { id: "records", count: 11 },
  ],
  list: { label: "접수 목록", resultCount: 26, totalCount: 40, pageSize: 25, pageIndex: 0, hasNextPage: true },
  selectedRecord: { id: "selection-a", title: "선택한 항목", meta: "접수 · 조치 필요", html: '<div data-test-selected-body>detail</div>' },
  changeHistory: { count: 2, summary: "최근 변경 2건", html: '<ol data-test-history></ol>' },
  dangerZone: { description: "영향을 다시 확인하세요.", html: '<button data-test-danger-action type="button">별도 확인</button>' },
});

assert(html.includes('class="manage-center manage-center-v4"'));
assert(html.includes("관리 센터"));
assert(html.includes("찾고, 선택하고, 안전하게 처리"));
assert(html.includes("관리 업무"));
assert(!html.includes("관리 흐름"), "the management shell must not repeat a decorative section kicker");
assert(!html.includes("목록 보기"), "management lane buttons must not repeat their button behavior as copy");
assert(!html.includes("선택 상세"), "the selected record title must not be preceded by a redundant kicker");
assert(!html.includes("보호 구역"), "the danger boundary must be named directly");
assert(html.includes('data-manage-center-search'));
assert(html.includes('value="호선 100"'));
assert(html.includes('data-manage-center-action-needed type="checkbox" checked'));
assert(html.includes("접수 처리"));
assert(html.includes("작업 운영"));
assert(html.includes("구성원"));
assert(html.includes("기록"));
assert(html.includes('class="manage-center__tab is-active" id="manage-center-tab-intake"'));
assert(html.includes('role="tab" aria-selected="true" aria-controls="manage-center-panel-intake"'));
assert(html.includes('id="manage-center-panel-intake" role="tabpanel" aria-labelledby="manage-center-tab-intake"'));
assert(html.includes('role="tab" aria-selected="false" aria-controls="manage-center-panel-operations"'));
assert(html.includes('data-test-current-panel'));
assert(!html.includes("caller rendered panel</div></section><section"), "caller panel remains inside the active panel");
assert(html.includes("1–25</strong> / 26건 (전체 40건)"));
assert(html.includes('data-manage-center-page="previous" type="button" disabled'));
assert(html.includes('data-manage-center-page="next" type="button"'));

const cursorPageHtml = manageCenterView.renderManageCenterView({
  tabs: [{ id: "operations", label: "작업 운영", active: true }],
  activeTab: "operations",
  panels: { operations: '<div data-test-page-two>page two</div>' },
  list: {
    label: "작업지시서",
    resultCount: 60,
    totalCount: 185,
    pageSize: 25,
    pageIndex: 1,
    hasPreviousPage: true,
    hasNextPage: true,
    previousCursor: "previous-token",
    nextCursor: "next-token",
    pageAction: "page-work-prep-collection",
  },
});
assert(cursorPageHtml.includes("26–50</strong> / 60건 (전체 185건)"));
assert(cursorPageHtml.includes('data-action="page-work-prep-collection" data-collection-cursor="previous-token"'));
assert(cursorPageHtml.includes('data-action="page-work-prep-collection" data-collection-cursor="next-token"'));

const singlePageHtml = manageCenterView.renderManageCenterView({
  tabs: [{ id: "people", label: "구성원", active: true }],
  activeTab: "people",
  panels: { people: "한 페이지" },
  list: { label: "구성원", resultCount: 12, totalCount: 12, pageSize: 25, pageIndex: 0 },
});
assert(!singlePageHtml.includes('class="manage-center__pagination"'), "single-page management lists must not show inactive pagination controls");
assert(html.includes('data-manage-center-selected="selection-a"'));
assert(html.includes('data-test-selected-body'));
assert(html.includes("변경 이력"));
assert(html.includes('data-test-history'));
assert(html.includes("위험 작업"));
assert(html.includes('data-test-danger-action'));
assert(!html.includes("삭제"), "the renderer must not promote repeated deletion actions");
assert(!html.includes("홍길동"), "the renderer must not hardcode a record or personal data");

const sharedContextHtml = manageCenterView.renderManageCenterView({
  context: { title: "현장 관리", asOf: "2026-08-16T09:00:00+09:00" },
}, {
  renderDataContext(context) {
    assert.strictEqual(context.title, "현장 관리");
    return '<header data-test-shared-context>shared context</header>';
  },
});
assert(sharedContextHtml.includes('data-test-shared-context'), "a supplied shared context renderer should replace the fallback masthead");
assert(!sharedContextHtml.includes("찾고, 선택하고, 안전하게 처리"), "a supplied shared context should not leave the fallback masthead visible");

const fallbackContextHtml = manageCenterView.renderManageCenterView({});
assert(fallbackContextHtml.includes("찾고, 선택하고, 안전하게 처리"), "the masthead should remain usable without a shared context renderer");

const sharedLoadingHtml = manageCenterView.renderManageCenterView({
  dataState: "loading",
  cards: [{ id: "intake", count: 12 }],
  panels: { intake: '<div data-test-hidden-while-loading>hidden</div>' },
}, {
  renderDataState(stateModel) {
    assert.strictEqual(stateModel.state, "loading", "the shared data-state renderer must receive the normalized state");
    return '<div data-test-shared-data-state>shared loading</div>';
  },
});
assert(sharedLoadingHtml.includes('data-test-shared-data-state'), "a supplied shared data-state renderer should render its output");
assert(!sharedLoadingHtml.includes('data-test-hidden-while-loading'), "loading must still block caller panel content when a shared state renderer is supplied");
assert(!sharedLoadingHtml.includes("12<small>건</small>"), "loading must still block counts when a shared state renderer is supplied");

const loadingHtml = manageCenterView.renderManageCenterView({
  dataState: "loading",
  cards: [{ id: "intake", count: 12 }],
  panels: { intake: '<div data-test-stale-panel>stale</div>' },
});
assert(loadingHtml.includes('data-manage-center-state="loading"'));
assert(loadingHtml.includes('role="status" aria-live="polite"'));
assert(loadingHtml.includes("관리 데이터를 불러오는 중입니다."));
assert(!loadingHtml.includes('data-test-stale-panel'), "loading state must not show a stale caller panel");
assert(!loadingHtml.includes("12<small>건</small>"), "loading state must not expose an unverified card count");
assert(!loadingHtml.includes("선택된 목록"), "loading state must not show a stale list summary");
assert(!loadingHtml.includes('data-manage-center-search'), "search controls stay hidden until a live search handler is supplied");

const staleHtml = manageCenterView.renderManageCenterView({
  dataState: "stale",
  cards: [{ id: "intake", count: 12 }],
  panels: { intake: '<button data-test-offline-action type="button">로컬 작업</button>' },
});
assert(staleHtml.includes("현재 기기에 저장된 마지막 확인 데이터를 표시합니다."));
assert(staleHtml.includes('data-action="retry-manage-center"'));
assert(staleHtml.includes("12<small>건</small>"), "stale state may show labeled cached counts");
assert(staleHtml.includes('data-test-offline-action'), "stale state must preserve offline management controls");

const offlineReadOnlyHtml = manageCenterView.renderManageCenterView({
  dataState: "offline",
  contentReadOnly: true,
  cards: [{ id: "intake", count: 12 }],
  panels: { intake: '<button data-test-read-only-mutation type="button">로컬 작업</button>' },
  selectedRecord: { id: "offline-selected", title: "오프라인 선택", html: '<button data-test-read-only-detail-action type="button">상태 변경</button>' },
  dangerZone: { html: '<button data-test-read-only-danger-action type="button">삭제</button>' },
});
assert(offlineReadOnlyHtml.includes("오프라인 상태"), "offline state must expose a nonblocking offline banner");
assert(offlineReadOnlyHtml.includes("12<small>건</small>"), "offline state may show cached counts");
assert(offlineReadOnlyHtml.includes('data-test-read-only-mutation'), "read-only content remains visible for operational context");
assert(offlineReadOnlyHtml.includes('class="manage-center__read-only-content" data-manage-content-read-only="true"'), "read-only caller content must expose the native-control guard hook");
assert(offlineReadOnlyHtml.includes('class="manage-center__detail-body" data-manage-content-read-only="true"'), "read-only selected detail must stay navigable while exposing the mutation guard hook");
assert(!offlineReadOnlyHtml.includes('data-test-read-only-danger-action'), "read-only mode must omit danger-zone mutation content");

const offlineEmptyHtml = manageCenterView.renderManageCenterView({
  dataState: "offline-empty",
  cards: [{ id: "intake", count: 12 }],
  panels: { intake: '<div data-test-offline-empty-hidden>hidden</div>' },
});
assert(offlineEmptyHtml.includes("저장된 관리 데이터가 없습니다"), "offline without cache must explain the missing local snapshot");
assert(!offlineEmptyHtml.includes("12<small>건</small>"), "offline without cache must hide cached-looking counts");
assert(!offlineEmptyHtml.includes("data-test-offline-empty-hidden"), "offline without cache must hide management content");

const errorHtml = manageCenterView.renderManageCenterView({ dataState: "error", retryAction: "retry-test-manage" });
assert(errorHtml.includes('role="alert"'));
assert(errorHtml.includes('data-action="retry-test-manage"'));
assert(!errorHtml.includes("삭제"));

const emptyHtml = manageCenterView.renderManageCenterView({
  tabs: [{ id: "records", label: "기록", active: true }],
  activeTab: "records",
  dataState: "empty",
});
assert(emptyHtml.includes("표시할 관리 항목이 없습니다."));
assert(emptyHtml.includes("항목을 선택하세요"));

const inactivePanelHtml = manageCenterView.renderManageCenterView({
  tabs: [{ id: "intake", label: "접수 처리" }, { id: "records", label: "기록", active: true }],
  activeTab: "records",
  panels: { intake: '<div data-test-inactive-panel></div>', records: '<div data-test-active-panel></div>' },
});
assert(inactivePanelHtml.includes('data-test-active-panel'));
assert(!inactivePanelHtml.includes('data-test-inactive-panel'), "only the selected tab panel should render");

const tabControls = [...inactivePanelHtml.matchAll(/role="tab"[^>]*aria-controls="([^"]+)"/g)].map((match) => match[1]);
const tabPanels = [...inactivePanelHtml.matchAll(/<section class="manage-center__panel" id="([^"]+)" role="tabpanel"/g)].map((match) => match[1]);
assert.deepStrictEqual(tabControls.sort(), tabPanels.sort(), "every tab aria-controls value must resolve to a tabpanel");
assert(inactivePanelHtml.includes('id="manage-center-panel-intake" role="tabpanel" aria-labelledby="manage-center-tab-intake" hidden inert'), "inactive tabpanel should be hidden and inert");
assert.strictEqual((inactivePanelHtml.match(/data-test-active-panel/g) || []).length, 1, "active panel content should render once");
assert.strictEqual((inactivePanelHtml.match(/data-test-inactive-panel/g) || []).length, 0, "inactive panel content should stay unrendered");

const mobileDetailHtml = manageCenterView.renderManageCenterView({
  mobileDetailOpen: true,
  selectedRecord: { id: "selected-only", title: "선택한 한 건", html: '<div data-test-selected-only>detail</div>' },
  panels: { intake: '<div data-test-list-item>list</div><div data-test-unselected-record>other</div>' },
});
assert(mobileDetailHtml.includes('class="manage-center__workspace is-mobile-detail-open"'), "a selected mobile detail must mark the workspace as open");
assert(mobileDetailHtml.includes('class="manage-center__detail is-mobile-fullscreen"'), "a selected mobile detail must carry the full-screen semantic class");
assert(mobileDetailHtml.includes('data-action="back-manage-center-list"'), "a selected mobile detail must expose a back action");
assert(mobileDetailHtml.includes('class="btn-light manage-center__mobile-back"'), "the mobile detail back control must carry the coordinated semantic class");
assert(mobileDetailHtml.includes('>목록으로</button>'), "the mobile detail back control must have the requested label");
assert(mobileDetailHtml.includes('tabindex="-1"'), "the mobile detail must expose a programmatic focus target");
assert.strictEqual((mobileDetailHtml.match(/data-manage-center-selected="selected-only"/g) || []).length, 1, "only the selected record detail should render");

const desktopDetailHtml = manageCenterView.renderManageCenterView({
  selectedRecord: { id: "desktop-selected", title: "데스크톱 선택" },
});
assert(!desktopDetailHtml.includes('is-mobile-detail-open'), "desktop list-detail layout must remain unchanged");
assert(!desktopDetailHtml.includes('is-mobile-fullscreen'), "desktop detail must not become full-screen");
assert(!desktopDetailHtml.includes('data-action="back-manage-center-list"'), "desktop detail must not render a mobile-only back action");

const emptyMobileDetailHtml = manageCenterView.renderManageCenterView({ mobileDetailOpen: true });
assert(!emptyMobileDetailHtml.includes('is-mobile-detail-open'), "an empty selection must not open the mobile detail state");
assert(!emptyMobileDetailHtml.includes('is-mobile-fullscreen'), "an empty selection must not render a full-screen detail");
assert(!emptyMobileDetailHtml.includes('data-action="back-manage-center-list"'), "an empty selection must not expose a list back action");

const singlePaneHtml = manageCenterView.renderManageCenterView({
  detailEnabled: false,
  panels: { intake: '<div data-test-single-pane>worker content</div>' },
});
assert(singlePaneHtml.includes('class="manage-center__workspace is-single-pane"'), "tabs without selectable detail records must use the full-width workspace");
assert(singlePaneHtml.includes("data-test-single-pane"), "single-pane content must remain visible");
assert(!singlePaneHtml.includes('class="manage-center__detail'), "single-pane tabs must not reserve an empty detail column");

console.log("manage-center view tests passed");
