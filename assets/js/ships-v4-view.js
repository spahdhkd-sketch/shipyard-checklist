(function attachShipsV4View(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardShipsV4View = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildShipsV4ViewApi() {
  const STAGE_LABELS = {
    mounting: "탑재",
    lc: "L/C",
    st: "S/T",
    cl: "C/L",
    dl: "D/L",
  };

  function text(value) {
    return value === null || value === undefined ? "" : String(value);
  }

  function esc(value = "") {
    return text(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    }[char]));
  }

  function token(value, fallback) {
    const normalized = text(value).trim().replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
    return normalized || fallback;
  }

  function stageMeta(value) {
    const raw = text(value).trim();
    const id = token(raw.toLowerCase(), "unknown");
    return { id, label: STAGE_LABELS[id] || raw || "공정 미지정" };
  }

  function normalizeShip(rawShip, index) {
    const ship = rawShip || {};
    const id = text(ship.id) || `ship-${index + 1}`;
    const stage = stageMeta(ship.processStage || ship.stage);
    return {
      id,
      no: text(ship.no || ship.name || id),
      type: text(ship.type),
      stage,
      scheduleLabel: text(ship.scheduleLabel || ship.scheduleStageLabel),
      updatedLabel: text(ship.updatedLabel),
      dates: Array.isArray(ship.dates) ? ship.dates.filter(Boolean).map((date) => ({
        field: token(date.field, ""),
        label: text(date.label),
        value: text(date.value),
      })).filter((date) => date.label || date.value) : [],
      facts: Array.isArray(ship.facts) ? ship.facts.filter(Boolean).map((fact) => ({
        label: text(fact.label),
        value: text(fact.value),
      })).filter((fact) => fact.label || fact.value) : [],
      links: Array.isArray(ship.links) ? ship.links.filter(Boolean).map((link) => ({
        label: text(link.label),
        action: text(link.action),
        target: text(link.target),
      })).filter((link) => link.label && link.action) : [],
      description: text(ship.description),
    };
  }

  function renderState(state, retryAction) {
    if (state === "loading") {
      return `<section class="ships-v4__state is-loading" role="status" aria-live="polite" aria-busy="true"><span></span><span></span><span class="sr-only">호선 데이터를 불러오는 중입니다.</span></section>`;
    }
    if (state === "error") {
      return `<section class="ships-v4__state is-error" role="alert"><h2>호선 데이터를 불러오지 못했습니다.</h2><p>연결 상태를 확인한 뒤 다시 시도하세요.</p><button class="btn-light" data-action="${esc(retryAction)}" type="button">다시 시도</button></section>`;
    }
    if (state === "offline-empty") {
      return `<section class="ships-v4__state is-offline" role="status"><h2>오프라인 상태입니다.</h2><p>이 기기에 저장된 호선 데이터가 없습니다.</p><button class="btn-light" data-action="${esc(retryAction)}" type="button">연결 다시 확인</button></section>`;
    }
    if (state === "empty") {
      return `<section class="ships-v4__state is-empty" role="status"><h2>등록된 호선이 없습니다.</h2><p>호선을 등록하면 공정과 현장 기록을 함께 확인할 수 있습니다.</p></section>`;
    }
    if (state === "stale" || state === "offline") {
      const title = state === "stale" ? "이전 확인 데이터를 표시합니다." : "오프라인 데이터를 표시합니다.";
      return `<section class="ships-v4__state is-notice" role="status"><p>${title} 연결되면 최신 상태를 다시 확인하세요.</p><button class="btn-light" data-action="${esc(retryAction)}" type="button">최신 데이터 확인</button></section>`;
    }
    return "";
  }

  function renderStageSummary(ships) {
    const stages = [];
    ships.forEach((ship) => {
      const match = stages.find((stage) => stage.id === ship.stage.id);
      if (match) match.count += 1;
      else stages.push({ id: ship.stage.id, label: ship.stage.label, count: 1 });
    });
    if (!stages.length) return "";
    return `<section class="ships-v4__summary" aria-label="공정 현황">${stages.map((stage) => `<div class="ships-v4__summary-item is-${esc(stage.id)}"><span>${esc(stage.label)}</span><strong>${esc(stage.count)}<small>척</small></strong></div>`).join("")}</section>`;
  }

  function renderControls(model) {
    if (model.showControls === false) return "";
    const sortOptions = Array.isArray(model.sortOptions) ? model.sortOptions : [];
    const exportDisabled = model.ships.length ? "" : " disabled";
    const utilitiesHtml = `${model.importAction ? `<button class="btn-light" data-action="${esc(model.importAction)}" type="button">엑셀 불러오기</button>` : ""}${model.exportAction ? `<button class="btn-light" data-action="${esc(model.exportAction)}"${exportDisabled} type="button">엑셀 내보내기</button>` : ""}${model.saveOrderAction ? `<button class="btn-light" data-action="${esc(model.saveOrderAction)}"${model.contentReadOnly || !model.ships.length ? " disabled" : ""} type="button">현재 순서 저장</button>` : ""}`;
    return `<section class="ships-v4__controls" aria-label="호선 목록 조건">
        <label class="ships-v4__search"><span>호선 검색</span><input class="input search-input" id="shipSearch" data-ship-search type="search" value="${esc(model.searchQuery)}" placeholder="예) H3481" autocomplete="off" /></label>
        ${sortOptions.length ? `<label class="ships-v4__sort"><span>정렬</span><select class="select" id="shipSortMode" data-ship-sort-mode>${sortOptions.map((option) => `<option value="${esc(option.value)}"${option.value === model.sortMode ? " selected" : ""}>${esc(option.label)}</option>`).join("")}</select></label>` : ""}
        ${utilitiesHtml ? `<details class="ships-v4__utility-details"${model.mobile ? "" : " open"}><summary><strong>목록 도구</strong><span>추가·가져오기·내보내기</span></summary><div class="ships-v4__utilities">${utilitiesHtml}</div></details>` : ""}
      </section>`;
  }

  function renderListItem(ship, selectedId, selectAction) {
    const selected = ship.id === selectedId;
    return `<li><button class="ships-v4__row${selected ? " is-selected" : ""}" data-action="${esc(selectAction)}" data-ship-id="${esc(ship.id)}" data-ship-search-item data-ship-search-text="${esc(ship.no.toLowerCase())}" type="button" aria-current="${selected ? "true" : "false"}">
        <span class="ships-v4__row-primary"><strong>${esc(ship.no)}</strong>${ship.type ? `<small>${esc(ship.type)}</small>` : ""}</span>
        <span class="ships-v4__row-status"><b class="ships-v4__stage is-${esc(ship.stage.id)}">${esc(ship.stage.label)}</b>${ship.scheduleLabel ? `<small>${esc(ship.scheduleLabel)}</small>` : ""}</span>
      </button></li>`;
  }

  function renderPagination(list) {
    if (!list || (!list.hasPreviousPage && !list.hasNextPage)) return "";
    const action = text(list.pageAction) || "page-ships-collection";
    return `<nav class="ships-v4__pagination" aria-label="호선 페이지"><button class="btn-light" data-action="${esc(action)}" data-collection-cursor="${esc(list.previousCursor)}"${list.hasPreviousPage ? "" : " disabled"} type="button">이전</button><span>${esc(list.label || "목록 페이지")}</span><button class="btn-light" data-action="${esc(action)}" data-collection-cursor="${esc(list.nextCursor)}"${list.hasNextPage ? "" : " disabled"} type="button">다음</button></nav>`;
  }

  function renderList(model) {
    if (!model.ships.length) return `<section class="ships-v4__list"><div class="ships-v4__empty-list" data-ship-search-empty>검색 결과가 없습니다.</div></section>`;
    return `<section class="ships-v4__list" aria-labelledby="shipsV4ListHeading"><header><h2 id="shipsV4ListHeading">호선 목록</h2><span>${esc(model.ships.length)}척</span></header><ol>${model.ships.map((ship) => renderListItem(ship, model.selectedId, model.selectAction)).join("")}</ol>${renderPagination(model.list)}</section>`;
  }

  function renderDetailFacts(model, ship) {
    const groups = [];
    if (ship.dates.length) groups.push(`<dl class="ships-v4__detail-grid">${ship.dates.map((date) => `<div><dt>${esc(date.label)}</dt><dd>${date.field ? `<input class="input" id="${esc(date.field)}_${esc(ship.id)}" data-ship-date-field="${esc(date.field)}" data-ship-id="${esc(ship.id)}" type="${model.editable ? "date" : "text"}" value="${esc(date.value)}" placeholder="미입력"${model.editable && !model.contentReadOnly ? "" : " disabled"} />` : esc(date.value || "미입력")}</dd></div>`).join("")}</dl>`);
    if (ship.facts.length) groups.push(`<dl class="ships-v4__detail-facts">${ship.facts.map((fact) => `<div><dt>${esc(fact.label)}</dt><dd>${esc(fact.value)}</dd></div>`).join("")}</dl>`);
    return groups.join("");
  }

  function renderDetail(model) {
    const ship = model.ships.find((item) => item.id === model.selectedId);
    if (!ship) return `<aside class="ships-v4__detail is-empty" aria-labelledby="shipsV4DetailHeading"><h2 id="shipsV4DetailHeading">호선을 선택하세요</h2><p>목록에서 호선을 선택하면 공정과 관련 기록을 확인할 수 있습니다.</p></aside>`;
    const mobile = model.mobileDetailOpen;
    return `<aside class="ships-v4__detail${mobile ? " is-mobile-fullscreen" : ""}" data-ships-v4-selected="${esc(ship.id)}" aria-labelledby="shipsV4DetailHeading"${mobile ? ' role="dialog" aria-modal="true" tabindex="-1"' : ""}>
        ${mobile ? '<button class="btn-light ships-v4__mobile-back" data-action="back-ships-v4-list" type="button">목록으로</button>' : ""}
        <header class="ships-v4__detail-heading"><div>${model.stageOptions.length ? `<label class="ships-v4__stage-field"><span>공정</span><select class="stage-select" id="processStage_${esc(ship.id)}" data-ship-stage-field data-ship-id="${esc(ship.id)}"${model.editable && !model.contentReadOnly ? "" : " disabled"}>${model.stageOptions.map((option) => `<option value="${esc(option.value)}"${option.value === ship.stage.id ? " selected" : ""}>${esc(option.label)}</option>`).join("")}</select></label>` : `<p>${esc(ship.stage.label)}</p>`}<h2 id="shipsV4DetailHeading">${esc(ship.no)}</h2>${ship.type ? `<span>${esc(ship.type)}</span>` : ""}</div>${ship.updatedLabel ? `<small>${esc(ship.updatedLabel)}</small>` : ""}</header>
        ${ship.description ? `<p class="ships-v4__detail-description">${esc(ship.description)}</p>` : ""}
        ${renderDetailFacts(model, ship)}
        ${ship.links.length ? `<nav class="ships-v4__detail-links" aria-label="${esc(ship.no)} 관련 기록">${ship.links.map((link) => `<button class="btn-light" data-action="${esc(link.action)}" data-ship-id="${esc(ship.id)}"${link.target ? ` data-ship-data-target="${esc(link.target)}"` : ""} type="button">${esc(link.label)}</button>`).join("")}</nav>` : ""}
      </aside>`;
  }

  function normalizeModel(rawModel) {
    const raw = rawModel || {};
    const ships = Array.isArray(raw.ships) ? raw.ships.map(normalizeShip) : [];
    const selected = ships.find((ship) => ship.id === text(raw.selectedId)) || null;
    return {
      title: text(raw.title) || "호선",
      intro: text(raw.intro) || "작업 구역과 공정 상태를 확인합니다.",
      dataState: text(raw.dataState) || "ready",
      retryAction: text(raw.retryAction) || "retry-ships",
      searchQuery: text(raw.searchQuery),
      sortMode: text(raw.sortMode),
      sortOptions: Array.isArray(raw.sortOptions) ? raw.sortOptions.map((option) => ({ value: text(option && option.value), label: text(option && option.label) })).filter((option) => option.value && option.label) : [],
      stageOptions: Array.isArray(raw.stageOptions) ? raw.stageOptions.map((option) => ({ value: text(option && option.value), label: text(option && option.label) })).filter((option) => option.value && option.label) : [],
      ships,
      selectedId: selected ? selected.id : "",
      selectAction: text(raw.selectAction) || "select-ship-v4",
      mobile: Boolean(raw.mobile),
      mobileDetailOpen: Boolean(selected && raw.mobileDetailOpen),
      editable: Boolean(raw.editable),
      contentReadOnly: Boolean(raw.contentReadOnly),
      showControls: raw.showControls !== false,
      importAction: text(raw.importAction),
      exportAction: text(raw.exportAction),
      saveOrderAction: text(raw.saveOrderAction),
      list: raw.list || null,
    };
  }

  function renderShipsV4View(rawModel) {
    const model = normalizeModel(rawModel);
    const stateHtml = renderState(model.dataState, model.retryAction);
    const isNonBlocking = model.dataState === "stale" || model.dataState === "offline";
    const canShowRecords = model.dataState === "ready" || isNonBlocking;
    const body = canShowRecords ? `<div class="ships-v4__workspace${model.mobileDetailOpen ? " is-mobile-detail-open" : ""}">${renderList(model)}${renderDetail(model)}</div>` : "";
    return `<section class="ships-v4" data-ships-v4-state="${esc(model.dataState)}">
        <header class="ships-v4__masthead"><div><h1>${esc(model.title)}</h1><p>${esc(model.intro)}</p></div><span>${model.contentReadOnly ? "조회 전용" : ""}</span></header>
        ${isNonBlocking ? stateHtml : ""}
        ${canShowRecords ? `${renderStageSummary(model.ships)}${renderControls(model)}${body}` : stateHtml}
      </section>`;
  }

  return { renderShipsV4View, normalizeShipsV4Model: normalizeModel };
}));
