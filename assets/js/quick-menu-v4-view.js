(function attachQuickMenuV4View(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.ShipyardQuickMenuV4View = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function buildQuickMenuV4View() {
  const ROLE_RANK = Object.freeze({ worker: 1, admin: 2 });
  const GROUP_LABELS = Object.freeze({
    today: "오늘의 업무",
    inspection: "점검",
    status: "현황과 이력",
    report: "신고",
    more: "관리와 설정",
  });
  const BLOCKING_STATES = new Set(["loading", "error", "empty", "offline-empty"]);

  function esc(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function canAccessEntry(entry = {}, role = "worker") {
    if (entry.visible === false) return false;
    const required = ROLE_RANK[entry.permission] || ROLE_RANK.worker;
    return (ROLE_RANK[role] || 0) >= required;
  }

  function entryGroupLabel(entry = {}) {
    return String(entry.groupLabel || entry.section || GROUP_LABELS[entry.group] || "바로가기");
  }

  function buildQuickMenuEntries(routes = [], { role = "worker", currentView = "", includeCurrent = false } = {}) {
    return (Array.isArray(routes) ? routes : [])
      .filter((route) => route && route.id !== "pledgeComplete")
      .filter((route) => includeCurrent || route.id !== currentView)
      .filter((route) => canAccessEntry(route, role))
      .map((route) => ({
        id: String(route.id || ""),
        label: String(route.label || route.title || ""),
        description: String(route.description || route.title || ""),
        view: String(route.id || ""),
        url: String(route.url || ""),
        permission: String(route.permission || "worker"),
        group: String(route.group || ""),
        groupLabel: entryGroupLabel(route),
      }))
      .filter((entry) => entry.id && entry.label);
  }

  function visibleEntries(entries, { role = "worker", currentView = "", includeCurrent = false } = {}) {
    return (Array.isArray(entries) ? entries : [])
      .filter((entry) => entry && (includeCurrent || entry.id !== currentView))
      .filter((entry) => canAccessEntry(entry, role))
      .map((entry) => ({ ...entry, view: entry.view || entry.id, groupLabel: entryGroupLabel(entry) }))
      .filter((entry) => entry.id && entry.label);
  }

  function groupEntries(entries) {
    const groups = [];
    const byLabel = new Map();
    entries.forEach((entry) => {
      const label = entry.groupLabel;
      if (!byLabel.has(label)) {
        const group = { label, entries: [] };
        byLabel.set(label, group);
        groups.push(group);
      }
      byLabel.get(label).entries.push(entry);
    });
    return groups;
  }

  function renderState(state, model) {
    if (!state || state === "ready") return "";
    const retryAction = esc(model.retryAction || "retry-quick-menu");
    if (state === "loading") {
      return `<section class="quick-menu-v4__state quick-menu-v4__state--loading" role="status" aria-live="polite" aria-busy="true">
        <p>${esc(model.loadingLabel || "메뉴를 불러오는 중입니다.")}</p>
        <div class="quick-menu-v4__skeletons" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      </section>`;
    }
    if (state === "error") {
      return `<section class="quick-menu-v4__state quick-menu-v4__state--error" role="alert">
        <p>${esc(model.errorLabel || "메뉴를 불러오지 못했습니다. 연결 상태를 확인한 뒤 다시 시도해주세요.")}</p>
        <button class="btn-light" data-action="${retryAction}" type="button">${esc(model.retryLabel || "다시 시도")}</button>
      </section>`;
    }
    if (state === "offline-empty") {
      return `<section class="quick-menu-v4__state" role="status" aria-live="polite"><p>${esc(model.offlineEmptyLabel || "오프라인 상태이며 표시할 메뉴 정보가 없습니다.")}</p></section>`;
    }
    if (state === "empty") {
      return `<section class="quick-menu-v4__state" role="status" aria-live="polite"><p>${esc(model.emptyLabel || "현재 권한으로 표시할 메뉴가 없습니다.")}</p></section>`;
    }
    if (state === "stale" || state === "offline") {
      return `<aside class="quick-menu-v4__notice" role="status" aria-live="polite">${esc(model.offlineLabel || "오프라인 상태입니다. 마지막으로 확인한 메뉴를 표시합니다.")}</aside>`;
    }
    return "";
  }

  function renderEntry(entry) {
    const description = entry.description && entry.description !== entry.label
      ? `<span class="quick-menu-v4__entry-description">${esc(entry.description)}</span>`
      : "";
    const attrs = entry.view
      ? `data-view="${esc(entry.view)}"`
      : entry.url
        ? `data-quick-menu-url="${esc(entry.url)}"`
        : "disabled";
    return `<li class="quick-menu-v4__entry">
      <button class="quick-menu-v4__entry-button" ${attrs} type="button">
        <span class="quick-menu-v4__entry-copy"><strong>${esc(entry.label)}</strong>${description}</span>
        <span class="quick-menu-v4__entry-arrow" aria-hidden="true">→</span>
      </button>
    </li>`;
  }

  function renderQuickMenuV4(model = {}) {
    const state = String(model.dataState || "ready");
    const entries = visibleEntries(model.entries, model);
    const contentBlocked = BLOCKING_STATES.has(state);
    const groups = groupEntries(entries);
    const heading = model.heading || "표준작업지도서/위험성평가 관리";
    const lead = model.lead || "필요한 업무로 바로 이동합니다.";
    const stateHtml = renderState(state, model);
    const headerHtml = model.showHeader === false ? `<header class="sr-only">
        <h1 id="quickMenuV4Title">${esc(heading)}</h1>
      </header>` : `<header class="quick-menu-v4__header">
        <h1 id="quickMenuV4Title">${esc(heading)}</h1>
        <p>${esc(lead)}</p>
      </header>`;
    const groupsHtml = groups.map((group) => `<section class="quick-menu-v4__group" aria-labelledby="quickMenuGroup_${esc(group.label)}">
      <h2 id="quickMenuGroup_${esc(group.label)}">${esc(group.label)}</h2>
      <ul class="quick-menu-v4__entries">${group.entries.map(renderEntry).join("")}</ul>
    </section>`).join("");

    return `<main class="quick-menu-v4" aria-labelledby="quickMenuV4Title" data-quick-menu-state="${esc(state)}">
      ${headerHtml}
      ${stateHtml}
      ${contentBlocked ? "" : `<div class="quick-menu-v4__groups">${groupsHtml || `<section class="quick-menu-v4__state" role="status" aria-live="polite"><p>${esc(model.emptyLabel || "현재 권한으로 표시할 메뉴가 없습니다.")}</p></section>`}</div>`}
    </main>`;
  }

  return {
    ROLE_RANK,
    GROUP_LABELS,
    buildQuickMenuEntries,
    canAccessEntry,
    renderQuickMenuV4,
    visibleEntries,
  };
}));
