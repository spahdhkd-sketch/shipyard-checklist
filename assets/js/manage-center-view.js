(function attachManageCenterView(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardManageCenterView = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildManageCenterViewApi() {
  const DEFAULT_CARDS = [
    { id: "intake", label: "접수 처리", description: "현장 요청을 확인하고 담당 조치를 이어갑니다." },
    { id: "operations", label: "작업 운영", description: "호선과 작업 준비 상태를 한곳에서 관리합니다." },
    { id: "people", label: "구성원", description: "작업자와 권한 상태를 확인합니다." },
    { id: "records", label: "기록", description: "점검과 조치 이력을 찾아봅니다." },
  ];

  function esc(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    }[char]));
  }

  function text(value) {
    return value === null || value === undefined ? "" : String(value);
  }

  function token(value, fallback) {
    const normalized = text(value).trim().replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
    return normalized || fallback;
  }

  function normalizeTabs(rawTabs) {
    const tabs = Array.isArray(rawTabs) && rawTabs.length ? rawTabs : DEFAULT_CARDS;
    return tabs.map((tab, index) => Object.assign({}, tab, {
      id: token(tab && tab.id, `tab-${index + 1}`),
      label: text(tab && tab.label) || `관리 탭 ${index + 1}`,
    }));
  }

  function activeTabId(tabs, requestedId) {
    const requested = text(requestedId);
    const explicit = tabs.find((tab) => tab.id === requested || tab.active);
    return (explicit || tabs[0] || { id: "intake" }).id;
  }

  function renderState(dataState, retryAction) {
    if (dataState === "loading") {
      return `<div class="manage-center__state is-loading" role="status" aria-live="polite">관리 데이터를 불러오는 중입니다.</div>`;
    }
    if (dataState === "error") {
      return `<div class="manage-center__state is-error" role="alert"><p>관리 데이터를 불러오지 못했습니다. 연결 상태를 확인한 뒤 다시 시도해주세요.</p><button class="btn-light" data-action="${esc(retryAction)}" type="button">다시 시도</button></div>`;
    }
    if (dataState === "empty") {
      return `<div class="manage-center__state is-empty" role="status">표시할 관리 항목이 없습니다.</div>`;
    }
    if (dataState === "stale") {
      return `<div class="manage-center__state is-stale" role="status"><p>현재 기기에 저장된 마지막 확인 데이터를 표시합니다. 연결되면 최신 상태를 다시 확인하세요.</p><button class="btn-light" data-action="${esc(retryAction)}" type="button">최신 데이터 확인</button></div>`;
    }
    if (dataState === "offline") {
      return `<div class="manage-center__state is-offline" role="status"><p>오프라인 상태입니다. 현재 기기에 저장된 마지막 확인 데이터를 표시합니다.</p><button class="btn-light" data-action="${esc(retryAction)}" type="button">연결 다시 확인</button></div>`;
    }
    if (dataState === "offline-empty") {
      return `<div class="manage-center__state is-offline-empty" role="status"><p>오프라인 상태이며 이 기기에 저장된 관리 데이터가 없습니다.</p><button class="btn-light" data-action="${esc(retryAction)}" type="button">연결 다시 확인</button></div>`;
    }
    return "";
  }

  function panelHtml(model, activeTab) {
    if (typeof model.panelHtml === "string") return model.panelHtml;
    const panels = model.panels || {};
    if (typeof panels[activeTab.id] === "string") return panels[activeTab.id];
    if (typeof activeTab.panelHtml === "string") return activeTab.panelHtml;
    return "";
  }

  function renderTabs(tabs, activeId) {
    return `<div class="manage-center__tabs" role="tablist" aria-label="관리센터 범주">
        ${tabs.map((tab) => {
          const active = tab.id === activeId;
          const tabId = `manage-center-tab-${tab.id}`;
          const panelId = `manage-center-panel-${tab.id}`;
          const count = Number.isFinite(Number(tab.count)) ? `<span class="manage-center__tab-count">${esc(tab.count)}</span>` : "";
          return `<button class="manage-center__tab${active ? " is-active" : ""}" id="${tabId}" data-manage-center-tab="${esc(tab.id)}" role="tab" aria-selected="${active ? "true" : "false"}" aria-controls="${panelId}" tabindex="${active ? "0" : "-1"}" type="button">${esc(tab.label)}${count}</button>`;
        }).join("")}
      </div>`;
  }

  function normalizeCards(rawCards) {
    const provided = Array.isArray(rawCards) ? rawCards : [];
    return DEFAULT_CARDS.map((fallback) => {
      const match = provided.find((card) => card && (card.id === fallback.id || card.label === fallback.label)) || {};
      return Object.assign({}, fallback, match, { id: token(match.id || fallback.id, fallback.id) });
    });
  }

  function renderCards(cards, showCounts = true) {
    return `<section class="manage-center__lanes" aria-labelledby="manageCenterLanesHeading">
        <div class="manage-center__section-heading"><h2 id="manageCenterLanesHeading">관리 업무</h2><p>필요한 영역으로 바로 이동합니다.</p></div>
        <div class="manage-center__card-grid">
          ${cards.map((card) => {
            const count = showCounts && Number.isFinite(Number(card.count)) ? `<strong class="manage-center__card-count">${esc(card.count)}<small>건</small></strong>` : "";
            const tone = token(card.tone || card.id, card.id);
            return `<button class="manage-center__card is-${tone}" data-manage-center-card="${esc(card.id)}" type="button">
                <span class="manage-center__card-label">${esc(card.label)}</span>
                ${count}
                <span class="manage-center__card-copy">${esc(card.description)}</span>
              </button>`;
          }).join("")}
        </div>
      </section>`;
  }

  function listSummary(list) {
    const resultCount = Math.max(0, Number(list.resultCount || list.count || 0));
    const pageSize = Math.max(1, Number(list.pageSize || 25));
    const pageIndex = Math.max(0, Number(list.pageIndex || 0));
    const from = resultCount ? pageIndex * pageSize + 1 : 0;
    const to = resultCount ? Math.min(resultCount, from + pageSize - 1) : 0;
    const totalCount = Math.max(resultCount, Number(list.totalCount || resultCount));
    return { resultCount, totalCount, from, to };
  }

  function renderListSummary(rawList) {
    const list = rawList || {};
    const summary = listSummary(list);
    const previousDisabled = list.hasPreviousPage ? "" : " disabled";
    const nextDisabled = list.hasNextPage ? "" : " disabled";
    const pageAction = text(list.pageAction);
    const paginationHtml = list.hasPreviousPage || list.hasNextPage ? `<div class="manage-center__pagination" aria-label="목록 페이지">
          <button class="btn-light"${pageAction ? ` data-action="${esc(pageAction)}" data-collection-cursor="${esc(list.previousCursor)}"` : ' data-manage-center-page="previous"'} type="button"${previousDisabled}>이전</button>
          <button class="btn-light"${pageAction ? ` data-action="${esc(pageAction)}" data-collection-cursor="${esc(list.nextCursor)}"` : ' data-manage-center-page="next"'} type="button"${nextDisabled}>다음</button>
        </div>` : "";
    return `<section class="manage-center__list-summary" aria-labelledby="manageCenterListHeading">
        <h2 id="manageCenterListHeading">${esc(list.label || "관리 항목")}</h2>
        <p class="manage-center__list-count"><strong>${summary.from}–${summary.to}</strong> / ${summary.resultCount}건${summary.totalCount > summary.resultCount ? ` (전체 ${summary.totalCount}건)` : ""}</p>
        ${paginationHtml}
      </section>`;
  }

  function renderSelectedDetail(rawSelected, options = {}) {
    const selected = rawSelected || null;
    if (!selected) {
      return `<aside class="manage-center__detail is-empty" aria-labelledby="manageCenterDetailHeading"><h2 id="manageCenterDetailHeading">항목을 선택하세요</h2><p>목록에서 한 항목을 선택하면 필요한 정보와 다음 조치를 확인할 수 있습니다.</p></aside>`;
    }
    const mobileDetailOpen = Boolean(options.mobileDetailOpen);
    const readOnly = Boolean(options.contentReadOnly);
    return `<aside class="manage-center__detail${mobileDetailOpen ? " is-mobile-fullscreen" : ""}" data-manage-center-selected="${esc(selected.id || "selected")}" aria-labelledby="manageCenterDetailHeading"${mobileDetailOpen ? ' tabindex="-1"' : ""}>
        ${mobileDetailOpen ? '<button class="btn-light manage-center__mobile-back" data-action="back-manage-center-list" type="button">목록으로</button>' : ""}
        <header class="manage-center__detail-heading"><h2 id="manageCenterDetailHeading">${esc(selected.title || "선택한 관리 항목")}</h2>${selected.meta ? `<span class="manage-center__detail-meta">${esc(selected.meta)}</span>` : ""}</header>
        <div class="manage-center__detail-body"${readOnly ? ' data-manage-content-read-only="true"' : ""}>${typeof selected.html === "string" ? selected.html : typeof selected.detailHtml === "string" ? selected.detailHtml : ""}</div>
      </aside>`;
  }

  function renderHistory(rawHistory, contentReadOnly) {
    const history = rawHistory || {};
    const count = Number.isFinite(Number(history.count)) ? `${esc(history.count)}건` : "최근 변경";
    return `<section class="manage-center__history" aria-labelledby="manageCenterHistoryHeading">
        <header><h2 id="manageCenterHistoryHeading">변경 이력</h2><span>${esc(history.label || count)}</span></header>
        <p>${esc(history.summary || "선택한 항목의 변경 내역을 확인합니다.")}</p>
        ${typeof history.html === "string" ? `<div class="manage-center__history-body"${contentReadOnly ? ' data-manage-content-read-only="true"' : ""}>${history.html}</div>` : ""}
      </section>`;
  }

  function renderDangerZone(rawDangerZone) {
    const dangerZone = rawDangerZone || {};
    return `<section class="manage-center__danger-zone" aria-labelledby="manageCenterDangerHeading">
        <h2 id="manageCenterDangerHeading">위험 작업</h2>
        <p>${esc(dangerZone.description || "복구하기 어려운 작업은 대상과 영향을 다시 확인한 뒤 진행하세요.")}</p>
        ${typeof dangerZone.html === "string" ? `<div class="manage-center__danger-actions">${dangerZone.html}</div>` : ""}
      </section>`;
  }

  function renderManageCenterView(rawModel, deps = {}) {
    const model = rawModel || {};
    const tabs = normalizeTabs(model.tabs);
    const activeId = activeTabId(tabs, model.activeTab);
    const activeTab = tabs.find((tab) => tab.id === activeId) || tabs[0];
    const dataState = text(model.dataState || "ready");
    const hasResolvedData = dataState === "ready" || dataState === "empty" || dataState === "stale" || dataState === "offline";
    const stateHtml = typeof deps.renderDataState === "function"
      ? text(deps.renderDataState(Object.assign({}, model, { state: dataState })))
      : renderState(dataState, model.retryAction || "retry-manage-center");
    const nonBlockingState = dataState === "stale" || dataState === "offline";
    const blockingStateHtml = nonBlockingState ? "" : stateHtml;
    const contentHtml = hasResolvedData ? panelHtml(model, activeTab) : "";
    const emptyPanel = hasResolvedData && !contentHtml
      ? `<div class="manage-center__state is-empty" role="status">선택한 관리 탭에 표시할 내용이 없습니다.</div>`
      : "";
    const query = text(model.searchQuery);
    const actionNeededOnly = Boolean(model.actionNeededOnly);
    const showToolbar = Object.prototype.hasOwnProperty.call(model, "searchQuery")
      || Object.prototype.hasOwnProperty.call(model, "actionNeededOnly");
    const panelId = `manage-center-panel-${activeId}`;
    const tabId = `manage-center-tab-${activeId}`;
    const contentReadOnly = Boolean(model.contentReadOnly);
    const detailEnabled = model.detailEnabled !== false;
    const selectedRecord = model.selectedRecord || model.selected;
    const mobileDetailOpen = Boolean(detailEnabled && selectedRecord && model.mobileDetailOpen);
    const contextHtml = typeof deps.renderDataContext === "function" ? text(deps.renderDataContext(model.context)) : "";
    const mastheadHtml = contextHtml || `<header class="manage-center__masthead">
          <h1>관리 센터</h1>
          <p class="manage-center__intro">찾고, 선택하고, 안전하게 처리합니다.</p>
        </header>`;
    const visibleContentHtml = contentReadOnly && contentHtml
      ? `<div class="manage-center__read-only-content" data-manage-content-read-only="true">${contentHtml}</div>`
      : contentHtml;
    const inactivePanelsHtml = tabs.filter((tab) => tab.id !== activeId).map((tab) => {
      const inactivePanelId = `manage-center-panel-${tab.id}`;
      const inactiveTabId = `manage-center-tab-${tab.id}`;
      return `<section class="manage-center__panel" id="${inactivePanelId}" role="tabpanel" aria-labelledby="${inactiveTabId}" hidden inert></section>`;
    }).join("");

    const historyHtml = hasResolvedData ? renderHistory(model.changeHistory, contentReadOnly) : "";
    return `<section class="manage-center manage-center-v4" data-manage-center-state="${esc(dataState)}">
        ${mastheadHtml}
        ${showToolbar ? `<div class="manage-center__toolbar">
          <label class="manage-center__search"><span class="sr-only">통합 검색</span><input class="input" data-manage-center-search type="search" value="${esc(query)}" placeholder="호선, 작업, 구성원, 기록 검색" autocomplete="off" /></label>
          <label class="manage-center__action-toggle"><input data-manage-center-action-needed type="checkbox"${actionNeededOnly ? " checked" : ""} /><span>조치 필요만 보기</span></label>
        </div>` : ""}
        ${renderCards(normalizeCards(model.cards), hasResolvedData)}
        ${renderTabs(tabs, activeId)}
        <div class="manage-center__workspace${detailEnabled ? "" : " is-single-pane"}${mobileDetailOpen ? " is-mobile-detail-open" : ""}">
          ${inactivePanelsHtml}
          <section class="manage-center__panel" id="${panelId}" role="tabpanel" aria-labelledby="${tabId}">
            ${hasResolvedData ? renderListSummary(model.list) : ""}
            ${nonBlockingState ? stateHtml : ""}
            <div class="manage-center__panel-content">${blockingStateHtml || emptyPanel || visibleContentHtml}</div>
          </section>
          ${hasResolvedData && detailEnabled ? renderSelectedDetail(selectedRecord, { mobileDetailOpen, contentReadOnly }) : ""}
          ${detailEnabled ? historyHtml : ""}
        </div>
        ${detailEnabled ? "" : historyHtml}
        ${hasResolvedData && !contentReadOnly ? renderDangerZone(model.dangerZone) : ""}
      </section>`;
  }

  return { renderManageCenterView };
}));
