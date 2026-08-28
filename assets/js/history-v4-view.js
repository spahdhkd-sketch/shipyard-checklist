(function attachHistoryV4View(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardHistoryV4View = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildHistoryV4ViewApi() {
  const DATA_STATES = new Set(["ready", "loading", "error", "empty", "stale", "offline", "offline-empty"]);

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function text(value) {
    return value == null ? "" : String(value);
  }

  function stateName(value) {
    return DATA_STATES.has(value) ? value : "ready";
  }

  function wholeCount(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.round(number)) : null;
  }

  function array(value) {
    return Array.isArray(value) ? value : [];
  }

  function selectOptions(rawOptions, selectedValue, fallbackLabel) {
    const options = array(rawOptions);
    if (!options.length) return "";
    const hasSelected = options.some((option) => text(option && (option.value ?? option.id)) === text(selectedValue));
    const optionHtml = options.map((option) => {
      const value = text(option && (option.value ?? option.id));
      const label = text(option && (option.label ?? option.name ?? option.value ?? option.id));
      const selected = value === text(selectedValue) ? " selected" : "";
      return `<option value="${esc(value)}"${selected}>${esc(label)}</option>`;
    }).join("");
    const allOption = hasSelected || !text(selectedValue)
      ? `<option value=""${text(selectedValue) ? "" : " selected"}>${esc(fallbackLabel)}</option>`
      : "";
    return `${allOption}${optionHtml}`;
  }

  function filterModel(rawModel) {
    const model = rawModel || {};
    const filters = model.filters || {};
    return {
      query: text(filters.query ?? model.query),
      dateFrom: text(filters.dateFrom ?? model.dateFrom),
      dateTo: text(filters.dateTo ?? model.dateTo),
      ship: text(filters.ship ?? filters.shipNo ?? model.ship),
      type: text(filters.type ?? filters.categoryId ?? model.type),
      result: text(filters.result ?? model.result),
      ships: array(filters.ships ?? model.ships),
      types: array(filters.types ?? filters.categories ?? model.types),
      results: array(filters.results ?? model.results),
    };
  }

  function renderFilters(rawModel, disabled) {
    const filters = filterModel(rawModel);
    const mobile = Boolean(rawModel && rawModel.mobile);
    const disabledAttr = disabled ? " disabled" : "";
    const shipOptions = selectOptions(filters.ships, filters.ship, "전체 호선");
    const typeOptions = selectOptions(filters.types, filters.type, "전체 작업 유형");
    const resultOptions = selectOptions(filters.results, filters.result, "전체 결과");
    const optionLabel = (options, value) => {
      const selected = array(options).find((option) => text(option && (option.value ?? option.id)) === text(value));
      return text(selected && (selected.label ?? selected.name ?? selected.value ?? selected.id)) || text(value);
    };
    const activeFilters = [
      filters.dateFrom ? `시작 ${filters.dateFrom}` : "",
      filters.dateTo ? `종료 ${filters.dateTo}` : "",
      filters.ship ? `호선 ${optionLabel(filters.ships, filters.ship)}` : "",
      filters.type ? `유형 ${optionLabel(filters.types, filters.type)}` : "",
      filters.result ? `결과 ${optionLabel(filters.results, filters.result)}` : "",
    ].filter(Boolean);
    return `<form class="history-v4__filters" data-history-v4-filters aria-label="점검 이력 조회 조건">
      <label class="history-v4__search"><span>검색</span><input class="input" data-history-query type="search" value="${esc(filters.query)}" placeholder="호선, 작업자, 작업 유형 검색" autocomplete="off"${disabledAttr}></label>
      <details class="history-v4__filter-details"${mobile ? "" : " open"}>
        <summary><strong>필터</strong><span>${activeFilters.length ? `${activeFilters.length}개 적용` : "전체"}</span></summary>
        <div class="history-v4__filter-fields">
          <label><span>시작일</span><input class="input" data-history-date-from type="date" value="${esc(filters.dateFrom)}"${disabledAttr}></label>
          <label><span>종료일</span><input class="input" data-history-date-to type="date" value="${esc(filters.dateTo)}"${disabledAttr}></label>
          ${shipOptions ? `<label><span>호선</span><select class="input" data-history-ship-filter${disabledAttr}>${shipOptions}</select></label>` : ""}
          ${typeOptions ? `<label><span>작업 유형</span><select class="input" data-history-type-filter${disabledAttr}>${typeOptions}</select></label>` : ""}
          ${resultOptions ? `<label><span>점검 결과</span><select class="input" data-history-result-filter${disabledAttr}>${resultOptions}</select></label>` : ""}
          <button class="btn-light history-v4__filter-reset" data-action="reset-history-v4-filters" type="button"${disabledAttr}>초기화</button>
        </div>
      </details>
      ${activeFilters.length ? `<div class="history-v4__active-filters" aria-label="적용된 필터">${activeFilters.map((label) => `<span>${esc(label)}</span>`).join("")}</div>` : ""}
    </form>`;
  }

  function resultText(row) {
    const explicit = text(row && (row.resultLabel ?? row.statusLabel ?? row.status));
    if (explicit) return explicit;
    return "-";
  }

  function riskText(row) {
    const explicit = text(row && row.riskLabel);
    if (explicit) return explicit;
    const warnings = wholeCount(row && row.warnings);
    return warnings && warnings > 0 ? `주의 ${warnings}건` : "";
  }

  function rowDateTime(row) {
    const date = text(row && (row.dateText ?? row.date));
    const time = text(row && (row.timeText ?? row.time));
    return [date, time].filter(Boolean).join(" ") || "-";
  }

  function rowType(row) {
    return text(row && (row.typeLabel ?? row.categoryLabel ?? row.workLabel)) || "-";
  }

  function rowWorker(row) {
    return text(row && (row.workerName ?? row.worker)) || "-";
  }

  function rowMeta(row) {
    return text(row && (row.workerTeam ?? row.workerPosition ?? row.team));
  }

  function renderRisk(row) {
    const label = riskText(row);
    return label ? `<span class="history-v4__risk">${esc(label)}</span>` : "";
  }

  function renderCompletion(row) {
    const explicit = text(row && row.completionLabel);
    const value = wholeCount(row && row.completion);
    const label = explicit || (value == null ? "" : `완료 ${value}%`);
    return label ? `<span class="history-v4__completion">${esc(label)}</span>` : "";
  }

  function rowAccessibleLabel(row) {
    const parts = [text(row && row.shipNo), rowType(row), rowWorker(row), rowDateTime(row), resultText(row)].filter(Boolean);
    return `${parts.join(" · ")} 점검 상세 보기`;
  }

  function renderTableRows(rows) {
    return rows.map((row) => `<tr data-history-detail-card="${esc(row && row.id)}" role="button" tabindex="0" aria-label="${esc(rowAccessibleLabel(row))}">
      <td class="history-v4__cell-date">${esc(rowDateTime(row))}</td>
      <th scope="row">${esc(row && row.shipNo || "-")}</th>
      <td>${esc(rowType(row))}</td>
      <td><strong>${esc(rowWorker(row))}</strong>${rowMeta(row) ? `<small>${esc(rowMeta(row))}</small>` : ""}</td>
      <td><span class="history-v4__result">${esc(resultText(row))}</span>${renderRisk(row)}</td>
      <td>${renderCompletion(row)}</td>
    </tr>`).join("");
  }

  function renderDesktopList(rows) {
    return `<div class="history-v4__table-wrap"><table class="history-v4__table">
      <caption class="sr-only">점검 이력 목록</caption>
      <thead><tr><th scope="col">일시</th><th scope="col">호선</th><th scope="col">작업 유형</th><th scope="col">점검자</th><th scope="col">결과</th><th scope="col">완료</th></tr></thead>
      <tbody>${renderTableRows(rows)}</tbody>
    </table></div>`;
  }

  function renderMobileList(rows) {
    return `<div class="history-v4__mobile-list" aria-label="점검 이력 카드 목록">${rows.map((row) => `<button class="history-v4__mobile-record" data-history-detail="${esc(row && row.id)}" data-history-detail-card="${esc(row && row.id)}" type="button" aria-label="${esc(rowAccessibleLabel(row))}">
        <span class="history-v4__mobile-top"><strong>${esc(row && row.shipNo || "-")}</strong><time>${esc(rowDateTime(row))}</time></span>
        <span class="history-v4__mobile-type">${esc(rowType(row))}</span>
        <span class="history-v4__mobile-bottom"><span>${esc(rowWorker(row))}${rowMeta(row) ? ` · ${esc(rowMeta(row))}` : ""}</span><span>${esc(resultText(row))}</span></span>
        ${riskText(row) || renderCompletion(row) ? `<span class="history-v4__mobile-signals">${renderRisk(row)}${renderCompletion(row)}</span>` : ""}
      </button>`).join("")}</div>`;
  }

  function renderList(rawRows) {
    const rows = array(rawRows);
    if (!rows.length) return `<p class="history-v4__empty-list" role="status">조건에 맞는 점검 이력이 없습니다.</p>`;
    return `${renderDesktopList(rows)}${renderMobileList(rows)}`;
  }

  function renderPagination(rawPagination) {
    const pagination = rawPagination || {};
    const count = wholeCount(pagination.resultCount ?? pagination.count);
    const pageText = text(pagination.label);
    const moreAction = text(pagination.moreAction || "load-more-history");
    const hasMore = pagination.hasMore === true;
    const summary = pageText || (count == null ? "" : `조회 결과 ${count}건`);
    return `<footer class="history-v4__list-footer">${summary ? `<p>${esc(summary)}</p>` : ""}${hasMore ? `<button class="btn-light" data-action="${esc(moreAction)}" type="button">더 보기</button>` : ""}</footer>`;
  }

  function renderDetail(rawSelected, options = {}) {
    const selected = rawSelected || null;
    if (!selected) {
      return `<aside class="history-v4__detail is-empty" aria-labelledby="historyV4DetailHeading"><h2 id="historyV4DetailHeading">점검 기록을 선택하세요</h2><p>목록에서 기록을 선택하면 제출 당시 내용을 읽기 전용으로 확인할 수 있습니다.</p></aside>`;
    }
    const mobileOpen = options.mobileDetailOpen === true;
    const detailHtml = typeof selected.html === "string" ? selected.html : typeof selected.detailHtml === "string" ? selected.detailHtml : "";
    return `<aside class="history-v4__detail${mobileOpen ? " is-mobile-fullscreen" : ""}" data-history-v4-selected="${esc(selected.id || "selected")}" aria-labelledby="historyV4DetailHeading"${mobileOpen ? ' tabindex="-1"' : ""}>
      ${mobileOpen ? '<button class="btn-light history-v4__mobile-back" data-action="back-history-list" type="button">목록으로</button>' : ""}
      <header><h2 id="historyV4DetailHeading">${esc(selected.title || selected.shipNo || "점검 기록")}</h2>${selected.meta ? `<p>${esc(selected.meta)}</p>` : ""}</header>
      <div class="history-v4__detail-body" data-history-content-read-only="true">${detailHtml}</div>
    </aside>`;
  }

  function fallbackContext() {
    return `<header class="history-v4__context"><h1>점검 이력</h1><p>점검 결과와 조치가 필요한 기록을 조회합니다.</p></header>`;
  }

  function fallbackState(dataState, retryAction) {
    if (dataState === "loading") return '<div class="history-v4__state is-loading" role="status" aria-live="polite">점검 이력을 불러오는 중입니다.</div>';
    if (dataState === "error") return `<div class="history-v4__state is-error" role="alert"><p>점검 이력을 불러오지 못했습니다.</p><button class="btn-light" data-action="${esc(retryAction)}" type="button">다시 시도</button></div>`;
    if (dataState === "empty") return '<div class="history-v4__state is-empty" role="status">표시할 점검 이력이 없습니다.</div>';
    if (dataState === "stale") return '<div class="history-v4__state is-stale" role="status">마지막으로 확인한 점검 이력을 표시합니다. 연결되면 최신 상태를 다시 확인하세요.</div>';
    if (dataState === "offline") return '<div class="history-v4__state is-offline" role="status">오프라인 상태입니다. 기기에 저장된 점검 이력을 표시합니다.</div>';
    if (dataState === "offline-empty") return '<div class="history-v4__state is-offline-empty" role="status">오프라인 상태이며 이 기기에 저장된 점검 이력이 없습니다.</div>';
    return "";
  }

  function renderHistoryV4View(rawModel, deps = {}) {
    const model = rawModel || {};
    const dataState = stateName(model.dataState);
    const blocking = ["loading", "error", "empty", "offline-empty"].includes(dataState);
    const rows = array(model.rows);
    const selected = model.selected || model.selectedRecord || null;
    const mobileDetailOpen = Boolean(selected && model.mobileDetailOpen);
    const stateOptions = {
      dataState,
      state: dataState,
      retryAction: model.retryAction || "retry-history",
      messages: {
        loading: "점검 이력을 불러오는 중입니다.",
        error: "점검 이력을 불러오지 못했습니다.",
        empty: "표시할 점검 이력이 없습니다.",
        stale: "마지막으로 확인한 점검 이력을 표시합니다. 연결되면 최신 상태를 다시 확인하세요.",
        offline: "오프라인 상태입니다. 기기에 저장된 점검 이력을 표시합니다.",
        offlineEmpty: "오프라인 상태이며 이 기기에 저장된 점검 이력이 없습니다.",
      },
    };
    const sharedContext = typeof deps.renderDataContext === "function" ? deps.renderDataContext(model.context) : null;
    const sharedState = typeof deps.renderDataState === "function" ? deps.renderDataState(stateOptions) : null;
    const contextHtml = typeof sharedContext === "string" ? sharedContext : fallbackContext();
    const stateHtml = typeof sharedState === "string" ? sharedState : fallbackState(dataState, stateOptions.retryAction);
    return `<section class="history-v4" data-history-v4-state="${esc(dataState)}"${dataState === "loading" ? ' aria-busy="true"' : ""}>
      <div class="history-v4__context-wrap">${contextHtml}</div>
      ${renderFilters(model, blocking)}
      ${stateHtml}
      ${blocking ? "" : `<div class="history-v4__workspace${mobileDetailOpen ? " is-mobile-detail-open" : ""}">
        <section class="history-v4__list" aria-labelledby="historyV4ListHeading"><header><h2 id="historyV4ListHeading">점검 기록</h2></header>${renderList(rows)}${renderPagination(model.pagination)}</section>
        ${renderDetail(selected, { mobileDetailOpen })}
      </div>`}
    </section>`;
  }

  return { renderHistoryV4View };
}));
