(function attachAuxiliaryV4View(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardAuxiliaryV4View = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildAuxiliaryV4ViewApi() {
  const DATA_STATES = new Set(["ready", "loading", "error", "empty", "stale", "offline", "offline-empty"]);
  const SYNC_STATES = new Set(["saved", "synced", "pending", "retry", "failed", "offline"]);
  const integration = Object.freeze({
    login: "Use renderLoginView in app-v2 renderLogin; delegated login selectors remain unchanged.",
    completion: "Use renderCompletionView with factual local and server sync models plus existing action hooks.",
    state: "Use renderAuxiliaryState for loading, error, empty, stale, offline, and offline-empty provenance.",
  });

  function esc(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    }[character]));
  }

  function text(value) {
    return value === null || value === undefined ? "" : String(value);
  }

  function token(value, fallback) {
    const normalized = text(value).trim().replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
    return normalized || fallback;
  }

  function resolvedDataState(value) {
    return DATA_STATES.has(value) ? value : "ready";
  }

  function resolvedSyncState(value) {
    return SYNC_STATES.has(value) ? value : "pending";
  }

  function buttonHtml(rawAction, fallbackClass = "btn-light") {
    const action = rawAction || {};
    const label = text(action.label);
    if (!label) return "";
    const attrs = [
      `class="${esc(action.primary ? "btn auxiliary-v4__primary" : fallbackClass)}"`,
      "type=\"button\"",
    ];
    if (action.view) attrs.push(`data-view="${esc(action.view)}"`);
    if (action.action) attrs.push(`data-action="${esc(action.action)}"`);
    if (action.disabled) attrs.push("disabled");
    return `<button ${attrs.join(" ")}>${esc(label)}</button>`;
  }

  function renderAuxiliaryState(rawModel = {}) {
    const model = rawModel || {};
    const state = resolvedDataState(model.state || model.dataState);
    if (state === "ready") return "";
    const messages = {
      loading: model.loadingLabel || "데이터를 불러오는 중입니다.",
      error: model.errorLabel || "데이터를 불러오지 못했습니다.",
      empty: model.emptyLabel || "표시할 데이터가 없습니다.",
      stale: model.staleLabel || "현재 기기에 저장된 마지막 확인 정보를 표시합니다.",
      offline: model.offlineLabel || "오프라인 상태입니다. 현재 기기에 저장된 정보를 표시합니다.",
      "offline-empty": model.offlineEmptyLabel || "오프라인 상태이며 이 기기에 저장된 정보가 없습니다.",
    };
    const retryAction = text(model.retryAction || (state === "error" ? "retry-data" : ""));
    const retryHtml = retryAction && state !== "empty" && state !== "loading"
      ? `<button class="btn-light auxiliary-v4__state-retry" data-action="${esc(retryAction)}" type="button">${esc(model.retryLabel || "다시 시도")}</button>`
      : "";
    const provenance = text(model.provenance || model.asOf);
    const provenanceHtml = provenance
      ? `<small class="auxiliary-v4__state-provenance">${esc(provenance)}</small>`
      : "";
    if (state === "loading") {
      return `<section class="auxiliary-v4__state is-loading" data-auxiliary-state="loading" role="status" aria-live="polite" aria-busy="true">
        <p>${esc(messages.loading)}</p>
        <div class="auxiliary-v4__skeleton" aria-hidden="true"><span></span><span></span><span></span></div>
      </section>`;
    }
    const role = state === "error" ? "alert" : "status";
    return `<section class="auxiliary-v4__state is-${esc(state)}" data-auxiliary-state="${esc(state)}" role="${role}" aria-live="polite">
      <p>${esc(messages[state])}</p>${provenanceHtml}${retryHtml}
    </section>`;
  }

  function renderWorkerLabel(worker, placeholder = "작업자 선택") {
    if (!worker) return `<span class="auxiliary-v4__worker-placeholder">${esc(placeholder)}</span>`;
    const meta = [worker.team, worker.position].filter(Boolean).join(" · ");
    return `<span class="auxiliary-v4__worker-label"><strong>${esc(worker.name)}</strong>${meta ? `<small>${esc(meta)}</small>` : ""}</span>`;
  }

  function findWorker(workers, value) {
    const id = typeof value === "object" && value ? value.id : value;
    return workers.find((worker) => String(worker.id) === String(id || "")) || null;
  }

  function renderWorkerPicker(workers, model, effectiveWorker, disabled) {
    const pickerOpen = Boolean(model.pickerOpen || model.loginWorkerPickerOpen) && !disabled;
    const selectedWorker = findWorker(workers, model.selectedWorker || model.loginWorkerId);
    if (effectiveWorker) {
      const accountLabel = String(effectiveWorker.id) === String(model.rememberedWorkerId || "") ? "내 계정" : "선택한 작업자";
      return `<div class="login-worker-selector auxiliary-v4__worker-picker" data-login-worker-picker>
        <div class="login-account-strip auxiliary-v4__selected-worker">
          <div class="login-account-copy"><span>${esc(accountLabel)}</span>${renderWorkerLabel(effectiveWorker)}</div>
          <button class="btn auxiliary-v4__primary login-account-action" data-login-remember-worker="${esc(effectiveWorker.id)}" type="button"${disabled ? " disabled" : ""}>${esc(effectiveWorker.name)}으로 계속</button>
        </div>
        <button class="btn-light login-worker-change" data-action="toggle-login-worker-picker" type="button" aria-expanded="${pickerOpen ? "true" : "false"}"${disabled ? " disabled" : ""}>다른 작업자 선택</button>
        ${pickerOpen ? renderWorkerSearchPanel(workers, selectedWorker || effectiveWorker, model) : ""}
      </div>`;
    }
    return `<div class="login-worker-selector auxiliary-v4__worker-picker" data-login-worker-picker>
      <button class="login-worker-trigger" data-action="toggle-login-worker-picker" type="button" aria-haspopup="listbox" aria-expanded="${pickerOpen ? "true" : "false"}"${disabled ? " disabled" : ""}>${renderWorkerLabel(selectedWorker)}<span class="login-worker-chevron" aria-hidden="true"></span></button>
      ${pickerOpen ? renderWorkerSearchPanel(workers, selectedWorker, model) : ""}
    </div>`;
  }

  function renderWorkerSearchPanel(workers, selectedWorker, model) {
    const searchQuery = text(model.searchQuery || model.loginWorkerSearch);
    return `<div class="login-worker-search-panel auxiliary-v4__worker-search">
      <label for="loginWorkerSearch">작업자 검색</label>
      <input class="input login-worker-search-input" id="loginWorkerSearch" data-login-worker-search value="${esc(searchQuery)}" placeholder="이름 검색" autocomplete="off" />
      <div class="login-worker-options login-worker-options-inline" role="listbox" aria-label="작업자 선택">
        ${workers.map((worker) => `<button class="login-worker-option${String(worker.id) === String(selectedWorker?.id || "") ? " selected" : ""}" data-login-worker-select="${esc(worker.id)}" data-login-worker-search-item data-login-worker-search-text="${esc([worker.name, worker.team, worker.position].filter(Boolean).join(" "))}" type="button" role="option" aria-selected="${String(worker.id) === String(selectedWorker?.id || "") ? "true" : "false"}">${renderWorkerLabel(worker)}</button>`).join("")}
      </div>
      <p class="login-worker-empty" data-login-worker-search-empty hidden>검색 결과가 없습니다.</p>
    </div>`;
  }

  function renderLoginView(rawModel = {}) {
    const model = rawModel || {};
    const workers = (Array.isArray(model.workers) ? model.workers : []).filter((worker) => worker && worker.active !== false);
    const submitting = Boolean(model.submitting || model.loginSubmitting);
    const disabled = submitting || !workers.length;
    const selectedWorker = findWorker(workers, model.selectedWorker || model.loginWorkerId);
    const rememberedWorker = findWorker(workers, model.rememberedWorker || model.rememberedWorkerId || model.lastLoginWorkerId);
    const effectiveWorker = selectedWorker || rememberedWorker;
    const dataState = resolvedDataState(model.dataState || (workers.length ? "ready" : "loading"));
    const stateHtml = renderAuxiliaryState({
      state: dataState,
      loadingLabel: model.loadingLabel || "작업자 목록을 불러오는 중입니다.",
      errorLabel: model.errorLabel || "작업자 목록을 불러오지 못했습니다.",
      offlineLabel: model.offlineLabel || "오프라인 상태입니다. 기기에 저장된 작업자 목록을 표시합니다.",
      offlineEmptyLabel: model.offlineEmptyLabel || "오프라인 상태이며 기기에 저장된 작업자 목록이 없습니다.",
      retryAction: model.retryAction || "refresh-workers",
      retryLabel: model.retryLabel || "작업자 목록 다시 확인",
      provenance: model.provenance,
    });
    const headingId = "auxiliaryV4LoginTitle";
    return `<section class="auxiliary-v4 auxiliary-v4--login" data-auxiliary-login-state="${esc(dataState)}" aria-labelledby="${headingId}">
      <header class="auxiliary-v4__login-intro">
        <p class="auxiliary-v4__brand">GS Safety Checklist</p>
        <h1 id="${headingId}">작업자 로그인</h1>
        <p>등록된 작업자를 선택하고 사번을 입력하세요.</p>
      </header>
      <form class="auxiliary-v4__login-form" data-login-form${submitting ? ' aria-busy="true"' : ""}>
        ${stateHtml}
        <fieldset${disabled ? " disabled" : ""}>
          <legend class="sr-only">작업자 정보</legend>
          <div class="field login-worker-field">
            <label for="loginWorkerId">작업자</label>
            <input id="loginWorkerId" name="username" autocomplete="username" type="hidden" value="${esc(effectiveWorker?.id || "")}" required />
            ${renderWorkerPicker(workers, model, effectiveWorker, disabled)}
          </div>
          <div class="field">
            <label for="loginEmployeeNo">사번</label>
            <input class="input" id="loginEmployeeNo" type="password" inputmode="text" autocomplete="current-password" autocapitalize="characters" placeholder="${esc(model.employeeNoPlaceholder || "사번 입력")}"${effectiveWorker && !Boolean(model.pickerOpen || model.loginWorkerPickerOpen) ? " autofocus" : ""} required />
          </div>
          <button class="btn auxiliary-v4__primary login-submit" type="submit">${esc(submitting ? (model.submittingLabel || "확인 중") : (model.submitLabel || "로그인"))}</button>
        </fieldset>
        <button class="btn-light login-refresh" data-action="refresh-workers" type="button"${submitting ? " disabled" : ""}>${esc(model.refreshLabel || "작업자 목록 새로고침")}</button>
        <p class="auxiliary-v4__login-help">${esc(model.helpText || (workers.length ? "사번이 등록되지 않은 작업자는 관리자에게 사번 등록을 요청하세요." : "목록을 확인한 뒤 로그인할 수 있습니다."))}</p>
      </form>
    </section>`;
  }

  function renderSyncRow(kind, rawStatus) {
    const status = rawStatus || {};
    const state = resolvedSyncState(status.state);
    const label = text(status.label);
    if (!label) return "";
    const detail = text(status.detail);
    const retryHtml = status.retryAction
      ? `<button class="btn-light auxiliary-v4__sync-retry" data-action="${esc(status.retryAction)}" type="button">${esc(status.retryLabel || "다시 시도")}</button>`
      : "";
    return `<div class="auxiliary-v4__sync-row is-${esc(state)}" data-sync-kind="${esc(kind)}" data-sync-state="${esc(state)}">
      <span class="auxiliary-v4__sync-kind">${esc(kind === "local" ? "기기 저장" : "서버 반영")}</span>
      <div><strong>${esc(label)}</strong>${detail ? `<p>${esc(detail)}</p>` : ""}${retryHtml}</div>
    </div>`;
  }

  function renderSyncStatus(rawSync) {
    const sync = rawSync || {};
    const localHtml = renderSyncRow("local", sync.local);
    const serverHtml = renderSyncRow("server", sync.server || sync);
    if (!localHtml && !serverHtml) return "";
    return `<section class="auxiliary-v4__sync" aria-label="저장 및 서버 반영 상태" role="status" aria-live="polite">${localHtml}${serverHtml}</section>`;
  }

  function renderCompletionStats(rawStats) {
    const stats = Array.isArray(rawStats) ? rawStats.filter((stat) => stat && text(stat.label)) : [];
    if (!stats.length) return "";
    return `<dl class="auxiliary-v4__completion-stats">
      ${stats.map((stat) => `<div><dt>${esc(stat.label)}</dt><dd>${esc(stat.value)}</dd></div>`).join("")}
    </dl>`;
  }

  function renderCompletionView(rawModel = {}) {
    const model = rawModel || {};
    const type = token(model.type, "record");
    const title = text(model.title) || "처리가 완료되었습니다";
    const message = text(model.message);
    const headingId = `auxiliaryV4Completion-${type}`;
    const actions = Array.isArray(model.actions) ? model.actions : [];
    return `<section class="auxiliary-v4 auxiliary-v4--completion mobile-complete-screen" data-completion-type="${esc(type)}" aria-labelledby="${headingId}">
      <header class="auxiliary-v4__completion-heading">
        <h1 id="${headingId}">${esc(title)}</h1>
        ${message ? `<p>${esc(message)}</p>` : ""}
      </header>
      ${renderSyncStatus(model.sync)}
      ${renderCompletionStats(model.stats)}
      ${actions.length ? `<footer class="auxiliary-v4__completion-actions">${actions.map((action) => buttonHtml(action)).join("")}</footer>` : ""}
    </section>`;
  }

  return {
    integration,
    renderAuxiliaryState,
    renderLoginView,
    renderSyncStatus,
    renderCompletionView,
  };
}));
