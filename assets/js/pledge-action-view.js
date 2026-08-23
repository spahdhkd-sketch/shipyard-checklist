(function attachPledgeActionView(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardPledgeActionView = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildPledgeActionViewApi() {
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function count(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.round(number)) : 0;
  }

  function freshnessTone(status) {
    return status === "fresh" ? "fresh" : status === "stale" ? "stale" : "unknown";
  }

  function renderKpis(rawKpis) {
    const kpis = rawKpis || {};
    const rows = [
      ["대상", count(kpis.target), "명"],
      ["완료", count(kpis.completed), "명"],
      ["즉시 확인", count(kpis.actionNeeded), "명"],
      ["이행률", count(kpis.completionRate), "%"],
    ];
    return `<div class="pledge-action-kpis" aria-label="안전서약 핵심 지표">
      ${rows.map(([label, value, unit]) => `<article class="pledge-action-kpi">
        <span>${esc(label)}</span><strong>${esc(value)}<em>${esc(unit)}</em></strong>
      </article>`).join("")}
    </div>`;
  }

  function renderFilters(rawFilters) {
    const filters = Array.isArray(rawFilters) ? rawFilters : [];
    if (!filters.length) return "";
    return `<div class="pledge-action-filters" role="group" aria-label="즉시 확인 대상 필터">
      ${filters.map((filter) => `<button class="pledge-action-filter ${filter && filter.active ? "active" : ""}" data-action="filter-pledge-action" data-filter-value="${esc(filter && filter.value)}" type="button" aria-pressed="${filter && filter.active ? "true" : "false"}">${esc(filter && filter.label)} <span>${esc(count(filter && filter.count))}</span></button>`).join("")}
    </div>`;
  }

  function renderDesktopRows(rows) {
    return rows.map((row) => `<tr data-row-id="${esc(row && row.id)}">
      <th scope="row">${esc(row && row.subjectLabel)}</th>
      <td>${esc(row && row.assignmentLabel)}</td>
      <td><span class="pledge-action-status">${esc(row && row.statusLabel)}</span></td>
      <td>${esc(row && row.reasonLabel)}</td>
      <td>${esc(row && row.updatedLabel)}</td>
    </tr>`).join("");
  }

  function renderMobileRows(rows) {
    return rows.map((row) => `<article class="pledge-action-mobile-card" data-row-id="${esc(row && row.id)}">
      <header><strong>${esc(row && row.subjectLabel)}</strong><span>${esc(row && row.statusLabel)}</span></header>
      <dl>
        <div><dt>작업</dt><dd data-label="작업">${esc(row && row.assignmentLabel)}</dd></div>
        <div><dt>확인 사유</dt><dd data-label="확인 사유">${esc(row && row.reasonLabel)}</dd></div>
        <div><dt>갱신</dt><dd data-label="갱신">${esc(row && row.updatedLabel)}</dd></div>
      </dl>
    </article>`).join("");
  }

  function renderActionRows(rawRows) {
    const rows = Array.isArray(rawRows) ? rawRows : [];
    if (!rows.length) return `<p class="pledge-action-empty">확인이 필요한 대상이 없습니다.</p>`;
    return `<div class="pledge-action-table-wrap">
      <table class="pledge-action-table">
        <caption class="sr-only">즉시 확인이 필요한 안전서약 대상</caption>
        <thead><tr><th scope="col">대상</th><th scope="col">작업</th><th scope="col">상태</th><th scope="col">확인 사유</th><th scope="col">갱신</th></tr></thead>
        <tbody>${renderDesktopRows(rows)}</tbody>
      </table>
    </div>
    <div class="pledge-action-mobile-list" aria-label="즉시 확인 대상 카드">${renderMobileRows(rows)}</div>`;
  }

  function renderPreflight(rawPreflight, options = {}) {
    const preflight = rawPreflight || {};
    if (!preflight.open) return "";
    const checks = Array.isArray(preflight.checks) ? preflight.checks : [];
    const acknowledged = preflight.acknowledged === true;
    const reviewDisabled = options.reviewDisabled === true;
    return `<div class="pledge-preflight-backdrop">
      <section class="pledge-preflight-dialog" role="dialog" aria-modal="true" aria-labelledby="pledge-preflight-title" aria-describedby="pledge-preflight-description">
        <header><div><span>알림 검토</span><h2 id="pledge-preflight-title">알림 대상 사전 확인</h2></div><button data-action="close-pledge-preflight" type="button" aria-label="알림 검토 닫기">×</button></header>
        <p id="pledge-preflight-description">${esc(count(preflight.targetCount))}건의 대상과 알림 내용을 확인합니다.</p>
        <ul class="pledge-preflight-checks">${checks.map((check) => `<li class="${check && check.passed ? "passed" : "attention"}"><span aria-hidden="true">${check && check.passed ? "✓" : "!"}</span>${esc(check && check.label)}</li>`).join("")}</ul>
        <label class="pledge-preflight-ack"><input data-action="acknowledge-pledge-preflight" type="checkbox" ${acknowledged ? "checked" : ""}> <span>${esc(preflight.acknowledgmentLabel || "대상과 알림 내용을 확인했습니다.")}</span></label>
        <footer><button data-action="close-pledge-preflight" type="button">취소</button><button data-action="complete-pledge-preflight" type="button" ${acknowledged && !reviewDisabled ? "" : "disabled"}>검토 완료</button></footer>
      </section>
    </div>`;
  }

  function pledgeDataState(value) {
    return ["ready", "loading", "error", "empty", "stale", "offline", "offline-empty"].includes(value) ? value : "ready";
  }

  function fallbackDataContext(rawFreshness) {
    const freshness = rawFreshness || {};
    return `<header class="pledge-action-hero">
      <div><span class="pledge-action-eyebrow">안전서약 운영</span><h1>오늘 작업 전 안전서약</h1><p>대상 확인 → 알림 검토 → 완료 추적</p></div>
      <div class="pledge-action-freshness ${esc(freshnessTone(freshness.status))}" role="status"><span>서버 최신성</span><strong>${esc(freshness.label || "확인 필요")}</strong><small>${esc(freshness.detail)}</small></div>
    </header>`;
  }

  function fallbackDataState(dataState) {
    if (dataState === "loading") {
      return `<div class="pledge-data-state is-loading" role="status" aria-live="polite">오늘의 안전서약 데이터를 불러오는 중입니다.</div>`;
    }
    if (dataState === "error") {
      return `<div class="pledge-data-state is-error" role="alert"><p>오늘의 안전서약 데이터를 불러오지 못했습니다.</p><button class="btn-light" data-action="retry-pledge-range" type="button">다시 시도</button></div>`;
    }
    if (dataState === "empty") {
      return `<div class="pledge-data-state is-empty" role="status">오늘의 안전서약 대상이 없습니다.</div>`;
    }
    if (dataState === "stale") {
      return `<div class="pledge-data-state is-stale" role="status">마지막으로 확인한 안전서약 데이터를 표시합니다. 연결되면 최신 상태를 다시 확인하세요.</div>`;
    }
    if (dataState === "offline") {
      return `<div class="pledge-data-state is-offline" role="status">오프라인 상태입니다. 기기에 저장된 안전서약 데이터를 표시합니다.</div>`;
    }
    if (dataState === "offline-empty") {
      return `<div class="pledge-data-state is-offline-empty" role="status">오프라인 상태이며 이 기기에 저장된 안전서약 데이터가 없습니다.</div>`;
    }
    return "";
  }

  function renderPledgeActionView(rawModel, deps = {}) {
    const model = rawModel || {};
    const dataState = pledgeDataState(model.dataState);
    const freshness = model.freshness || {};
    const kpis = model.kpis || {};
    const rows = Array.isArray(model.actionRows) ? model.actionRows : [];
    const recent = model.recentSend || {};
    const utilities = model.utilities || {};
    const blockingState = ["loading", "error", "empty", "offline-empty"].includes(dataState);
    const reviewDisabled = dataState !== "ready" || freshness.status !== "fresh" || !count(kpis.actionNeeded) || !rows.length;
    const stateOptions = {
      dataState,
      state: dataState,
      retryAction: "retry-pledge-range",
      messages: {
        loading: "오늘의 안전서약 데이터를 불러오는 중입니다.",
        error: "오늘의 안전서약 데이터를 불러오지 못했습니다.",
        empty: "오늘의 안전서약 대상이 없습니다.",
        stale: "마지막으로 확인한 안전서약 데이터를 표시합니다. 연결되면 최신 상태를 다시 확인하세요.",
        offline: "오프라인 상태입니다. 기기에 저장된 안전서약 데이터를 표시합니다.",
        offlineEmpty: "오프라인 상태이며 이 기기에 저장된 안전서약 데이터가 없습니다.",
      },
    };
    const sharedContext = typeof deps.renderDataContext === "function" ? deps.renderDataContext(model.context) : null;
    const sharedState = typeof deps.renderDataState === "function" ? deps.renderDataState(stateOptions) : null;
    const contextHtml = typeof sharedContext === "string" ? sharedContext : fallbackDataContext(freshness);
    const dataStateHtml = typeof sharedState === "string" ? sharedState : fallbackDataState(dataState);
    return `<section class="pledge-action-view" data-pledge-action-state="${esc(dataState)}"${dataState === "loading" ? ' aria-busy="true"' : ""}>
      ${contextHtml}
      <div class="pledge-date-nav">
        <button class="btn-light" data-action="pledge-prev-day" type="button" aria-label="이전 날 서약 보기">◀ 이전 날</button>
        <input class="input pledge-date-input" type="date" data-pledge-view-date value="${esc(model.viewDate || "")}" max="${esc(model.maxDate || "")}" aria-label="서약 조회 날짜" />
        <button class="btn-light" data-action="pledge-next-day" type="button" aria-label="다음 날 서약 보기" disabled>다음 날 ▶</button>
      </div>
      ${dataStateHtml}
      ${blockingState ? "" : `
      <div class="pledge-action-basis"><span>확정 작업지시 기준</span><strong>${esc(model.denominatorLabel || "확정 작업지시 0명 기준")}</strong></div>
      ${renderKpis(kpis)}
      <section class="pledge-action-needed" aria-labelledby="pledge-action-needed-title">
        <header><div><span>Action needed</span><h2 id="pledge-action-needed-title">즉시 확인</h2></div>${renderFilters(model.filters)}</header>
        ${renderActionRows(rows)}
        <div class="pledge-action-review"><p>대상과 상태를 확인한 뒤 알림 검토 단계로 이동합니다.</p><button data-action="review-pledge-notifications" type="button" ${reviewDisabled ? "disabled" : ""}>알림 대상 검토</button></div>
      </section>
      <section class="pledge-action-followup" aria-label="알림 완료 추적과 관리">
        <article class="pledge-action-recent"><span>완료 추적</span><h2>${esc(recent.title || "최근 발송")}</h2><p>${esc(recent.summary || "발송 기록이 없습니다.")}</p><strong>${esc(recent.statusLabel || "-")}</strong></article>
        <nav class="pledge-action-utilities" aria-label="안전서약 알림 관리"><h2>기록과 설정</h2><button data-action="open-pledge-history" type="button">${esc(utilities.historyLabel || "발송 이력")}</button><button data-action="open-pledge-settings" type="button">${esc(utilities.settingsLabel || "알림 설정")}</button></nav>
      </section>
      ${renderPreflight(model.preflight, { reviewDisabled })}`}
    </section>`;
  }

  return { renderPledgeActionView };
}));
