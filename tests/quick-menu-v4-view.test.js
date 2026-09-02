const assert = require("node:assert");
const quickMenu = require("../assets/js/quick-menu-v4-view.js");

const routes = [
  { id: "dashboard", label: "오늘", title: "오늘", group: "today", permission: "worker", url: "index.html" },
  { id: "check", label: "작업 전 점검", title: "작업 전 점검", group: "inspection", permission: "worker", url: "check.html" },
  { id: "unsafe", label: "불안전요소 신고", title: "불안전요소 신고", group: "report", permission: "worker", url: "unsafe.html" },
  { id: "analytics", label: "통계", title: "안전 통계", group: "more", permission: "admin", url: "analytics.html" },
  { id: "manage", label: "관리", title: "관리", group: "more", permission: "admin", url: "manage.html" },
  { id: "pledgeComplete", label: "완료", title: "완료", group: "more", permission: "worker", url: "pledge.html" },
];

const workerEntries = quickMenu.buildQuickMenuEntries(routes, { role: "worker", currentView: "items" });
assert.deepStrictEqual(workerEntries.map((entry) => entry.id), ["dashboard", "check", "unsafe"], "worker menu omits admin-only and completion routes");
assert.strictEqual(workerEntries[1].groupLabel, "점검");

const adminEntries = quickMenu.buildQuickMenuEntries(routes, { role: "admin", currentView: "items" });
assert.deepStrictEqual(adminEntries.map((entry) => entry.id), ["dashboard", "check", "unsafe", "analytics", "manage"], "admin menu keeps actual permitted routes");

const html = quickMenu.renderQuickMenuV4({
  entries: adminEntries,
  role: "admin",
  currentView: "items",
  heading: "표준작업지도서/위험성평가 관리",
  lead: "필요한 업무로 바로 이동합니다.",
});
assert(html.includes('<main class="quick-menu-v4" aria-labelledby="quickMenuV4Title" data-quick-menu-state="ready">'));
assert(html.includes('<h1 id="quickMenuV4Title">표준작업지도서/위험성평가 관리</h1>'));
assert(html.includes("오늘의 업무"));
assert(html.includes("점검"));
assert(html.includes("신고"));
assert(html.includes("관리와 설정"));
assert(html.includes('data-view="check" type="button"'));
assert(html.includes('data-view="manage" type="button"'));
assert(!html.includes("0건"), "the menu must not invent operational counts");
assert(!html.includes("홍길동"), "the menu must not hardcode worker data");

const headerlessHtml = quickMenu.renderQuickMenuV4({
  entries: adminEntries,
  role: "admin",
  currentView: "items",
  showHeader: false,
});
assert(!headerlessHtml.includes('class="quick-menu-v4__header"'), "the page can omit a heading already provided by the app shell");
assert(headerlessHtml.includes('<header class="sr-only">'), "the headerless surface keeps an accessible page name");
assert(headerlessHtml.includes('data-view="manage" type="button"'), "hiding the duplicate heading keeps the permitted menu actions");

const noSelfLink = quickMenu.renderQuickMenuV4({
  entries: [{ id: "items", label: "표준작업지도서/위험성평가 관리", permission: "worker" }, { id: "pledge", label: "안전 서약", permission: "worker" }],
  role: "worker",
  currentView: "items",
});
assert(!noSelfLink.includes('data-view="items"'), "the current route must not render as a redundant navigation target");
assert(noSelfLink.includes('data-view="pledge"'), "a permitted sibling route stays available");

const loadingHtml = quickMenu.renderQuickMenuV4({
  dataState: "loading",
  entries: adminEntries,
});
assert(loadingHtml.includes('role="status" aria-live="polite" aria-busy="true"'));
assert(loadingHtml.includes("메뉴를 불러오는 중입니다."));
assert(!loadingHtml.includes('data-view="manage"'), "loading must not expose unverified menu content");

const errorHtml = quickMenu.renderQuickMenuV4({ dataState: "error", retryAction: "retry-menu-test" });
assert(errorHtml.includes('role="alert"'));
assert(errorHtml.includes('data-action="retry-menu-test"'));

const offlineHtml = quickMenu.renderQuickMenuV4({ dataState: "offline", entries: workerEntries });
assert(offlineHtml.includes("오프라인 상태입니다."));
assert(offlineHtml.includes('data-view="check"'), "offline state preserves cached navigation");

const hiddenEntryHtml = quickMenu.renderQuickMenuV4({
  role: "worker",
  entries: [
    { id: "check", label: "작업 전 점검", permission: "worker" },
    { id: "manage", label: "관리", permission: "admin" },
    { id: "hidden", label: "숨김", permission: "worker", visible: false },
  ],
});
assert(hiddenEntryHtml.includes('data-view="check"'));
assert(!hiddenEntryHtml.includes('data-view="manage"'), "renderer enforces role access when raw entries are supplied");
assert(!hiddenEntryHtml.includes("숨김"), "renderer honors an explicitly hidden entry");

console.log("quick menu v4 view tests passed");
