(function attachUnsafeV4View(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardUnsafeV4View = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildUnsafeV4ViewApi() {
  const BLOCKED_STATES = new Set(["loading", "error", "stale", "offline", "offline-empty"]);
  const SEVERITIES = ["높음", "보통", "낮음"];

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

  function recordToken(id) {
    return `unsafe:${text(id).trim()}`;
  }

  function mutationBlocked(model = {}) {
    return Boolean(model.readOnly || BLOCKED_STATES.has(model.dataState));
  }

  function disabledAttr(disabled) {
    return disabled ? "disabled aria-disabled=\"true\"" : "";
  }

  function fieldValue(value, emptyLabel) {
    const valueText = text(value).trim();
    return valueText
      ? esc(valueText)
      : `<span class="unsafe-v4__unset">${esc(emptyLabel || "입력되지 않음")}</span>`;
  }

  function renderState(dataState, retryAction) {
    if (dataState === "loading") {
      return `<section class="unsafe-v4__state is-loading" role="status" aria-live="polite"><span></span><span></span><span></span><p>불안전요소 기록을 불러오는 중입니다.</p></section>`;
    }
    if (dataState === "error") {
      return `<section class="unsafe-v4__state is-error" role="alert"><h2>기록을 불러오지 못했습니다.</h2><p>연결 상태를 확인한 뒤 다시 시도해주세요.</p><button class="btn-light" data-action="${esc(retryAction)}" type="button">다시 시도</button></section>`;
    }
    if (dataState === "empty") {
      return `<section class="unsafe-v4__state is-empty" role="status"><h2>등록된 불안전요소가 없습니다.</h2><p>현장에서 확인한 위험요소를 등록하면 이 목록에서 조치 상태를 이어서 관리합니다.</p></section>`;
    }
    if (dataState === "stale") {
      return `<section class="unsafe-v4__state is-stale" role="status"><p>마지막으로 확인된 데이터를 표시합니다. 최신 상태를 확인할 때까지 읽기 전용이며 수정할 수 없습니다.</p><button class="btn-light" data-action="${esc(retryAction)}" type="button">최신 데이터 확인</button></section>`;
    }
    if (dataState === "offline") {
      return `<section class="unsafe-v4__state is-offline" role="status"><p>오프라인 상태입니다. 현재 기기에 저장된 기록을 읽기 전용으로 표시합니다.</p><button class="btn-light" data-action="${esc(retryAction)}" type="button">연결 다시 확인</button></section>`;
    }
    if (dataState === "offline-empty") {
      return `<section class="unsafe-v4__state is-offline-empty" role="status"><p>오프라인 상태이며 이 기기에 저장된 불안전요소 기록이 없습니다.</p><button class="btn-light" data-action="${esc(retryAction)}" type="button">연결 다시 확인</button></section>`;
    }
    return "";
  }

  function renderFlow(current) {
    const stages = [
      { id: "register", label: "등록" },
      { id: "review", label: "확인" },
      { id: "detail", label: "조치" },
    ];
    return `<ol class="unsafe-v4__flow" aria-label="불안전요소 처리 흐름">${stages.map((stage, index) => {
      const active = stage.id === current;
      const complete = stages.findIndex((item) => item.id === current) > index;
      return `<li class="${active ? "is-active" : ""}${complete ? " is-complete" : ""}" ${active ? "aria-current=\"step\"" : ""}><span>${index + 1}</span>${esc(stage.label)}</li>`;
    }).join("")}</ol>`;
  }

  function renderShipOptions(ships, selected) {
    const options = Array.isArray(ships) ? ships : [];
    return `<option value="">호선을 선택하세요</option>${options.map((ship) => {
      const value = typeof ship === "string" ? ship : ship && (ship.no || ship.value || ship.label);
      const label = typeof ship === "string" ? ship : ship && (ship.label || ship.no || ship.value);
      if (!value) return "";
      return `<option value="${esc(value)}" ${text(value) === text(selected) ? "selected" : ""}>${esc(label)}</option>`;
    }).join("")}`;
  }

  function renderSeverityOptions(selected) {
    return `<option value="">심각도를 선택하세요</option>${SEVERITIES.map((severity) => `<option value="${severity}" ${severity === selected ? "selected" : ""}>${severity}</option>`).join("")}`;
  }

  function renderRegistration(model = {}) {
    const draft = model.draft || {};
    const blocked = mutationBlocked(model);
    const ready = Boolean(
      text(draft.shipNo).trim()
      && text(draft.content).trim()
      && text(draft.severity).trim()
      && text(draft.location).trim()
      && text(draft.immediateAction).trim(),
    );
    return `<section class="unsafe-v4__registration" aria-labelledby="unsafeV4RegistrationHeading">
      <div class="unsafe-v4__section-heading"><div><h2 id="unsafeV4RegistrationHeading">현장 위험요소 등록</h2><p>위치와 즉시 조치를 함께 남겨 담당자가 현장을 확인할 수 있게 합니다.</p></div></div>
      <form class="unsafe-v4__form" data-unsafe-v4-form novalidate>
        <fieldset ${blocked ? "disabled" : ""}>
          <legend>발견 내용</legend>
          <div class="unsafe-v4__form-grid">
            <label class="field" for="unsafeShipNo"><span>호선 <b aria-hidden="true">*</b></span><select class="select" id="unsafeShipNo" required>${renderShipOptions(model.ships, draft.shipNo)}</select></label>
            <label class="field" for="unsafeSeverity"><span>심각도 <b aria-hidden="true">*</b></span><select class="select" id="unsafeSeverity" data-unsafe-severity required>${renderSeverityOptions(text(draft.severity).trim())}</select></label>
            <label class="field unsafe-v4__form-grid-full" for="unsafeContent"><span>불안전요소 내용 <b aria-hidden="true">*</b></span><textarea class="textarea" id="unsafeContent" maxlength="300" required placeholder="발견한 위험요소와 위험 상황을 적어주세요.">${esc(draft.content)}</textarea></label>
            <label class="field" for="unsafeLocation"><span>정확한 위치 <b aria-hidden="true">*</b></span><input class="input" id="unsafeLocation" data-unsafe-location type="text" value="${esc(draft.location)}" required placeholder="예: 3번 탱크 상부 통로" /></label>
            <label class="field" for="unsafeImmediateAction"><span>즉시 조치 <b aria-hidden="true">*</b></span><input class="input" id="unsafeImmediateAction" data-unsafe-immediate-action type="text" value="${esc(draft.immediateAction)}" required placeholder="예: 작업 중지 및 출입 통제" /></label>
          </div>
        </fieldset>
        <div class="unsafe-v4__form-footer"><p><b aria-hidden="true">*</b> 표시 항목은 접수 전에 입력해야 합니다.</p><button class="btn" data-unsafe-next type="button" ${disabledAttr(blocked || !ready)}>검토로 이동</button></div>
      </form>
    </section>`;
  }

  function renderReview(model = {}) {
    const draft = model.draft || {};
    const blocked = mutationBlocked(model);
    const ready = Boolean(text(draft.shipNo).trim() && text(draft.content).trim() && text(draft.severity).trim() && text(draft.location).trim() && text(draft.immediateAction).trim());
    return `<section class="unsafe-v4__review" aria-labelledby="unsafeV4ReviewHeading">
      <div class="unsafe-v4__section-heading"><div><h2 id="unsafeV4ReviewHeading">접수 내용 확인</h2><p>제출하면 담당 조치와 이력 관리로 이어집니다.</p></div><button class="btn-light" data-unsafe-edit-step="2" type="button" ${disabledAttr(blocked)}>수정</button></div>
      <dl class="unsafe-v4__summary">
        <div><dt>호선</dt><dd>${fieldValue(draft.shipNo, "선택되지 않음")}</dd></div>
        <div><dt>심각도</dt><dd>${fieldValue(draft.severity)}</dd></div>
        <div><dt>정확한 위치</dt><dd>${fieldValue(draft.location)}</dd></div>
        <div><dt>즉시 조치</dt><dd>${fieldValue(draft.immediateAction)}</dd></div>
        <div class="unsafe-v4__summary-full"><dt>불안전요소 내용</dt><dd>${fieldValue(draft.content)}</dd></div>
      </dl>
      <div class="unsafe-v4__review-actions"><button class="btn-light" data-unsafe-edit-step="2" type="button" ${disabledAttr(blocked)}>수정하기</button><button class="btn" data-action="submit-unsafe" type="button" ${disabledAttr(blocked || !ready)}>불안전요소 접수</button></div>
    </section>`;
  }

  function renderStatus(status) {
    return `<span class="unsafe-v4__status" data-unsafe-status="${esc(status || "")}">${fieldValue(status, "상태 미확인")}</span>`;
  }

  function renderRecordRow(record, selectedId) {
    const id = text(record && record.id).trim();
    if (!id) return "";
    const active = id === text(selectedId);
    return `<button class="unsafe-v4__record${active ? " is-active" : ""}" data-unsafe-record-detail="${esc(id)}" type="button" aria-current="${active ? "true" : "false"}" aria-label="${esc(record.shipNo || "호선 미지정")} 불안전요소 상세 보기">
      <span class="unsafe-v4__record-main"><strong>${fieldValue(record.shipNo, "호선 미지정")}</strong><span>${fieldValue(record.content, "내용 없음")}</span><small>${fieldValue(record.location, "위치 미입력")}</small></span>
      ${renderStatus(record.status)}
    </button>`;
  }

  function renderRecordList(model = {}) {
    const records = Array.isArray(model.records) ? model.records : [];
    return `<aside class="unsafe-v4__list" aria-label="불안전요소 목록"><div class="unsafe-v4__list-heading"><div><h2>접수 목록</h2><p>${records.length}건 표시</p></div><button class="btn-light" data-record-filter="unsafe:status" value="" type="button">상태 필터</button></div><div class="unsafe-v4__record-list">${records.length ? records.map((record) => renderRecordRow(record, model.selectedRecordId)).join("") : `<p class="unsafe-v4__list-empty">표시할 불안전요소가 없습니다.</p>`}</div></aside>`;
  }

  function renderTimeline(model = {}) {
    if (typeof model.timelineHtml === "string" && model.timelineHtml) {
      return model.timelineHtml;
    }
    const timeline = Array.isArray(model.timeline) ? model.timeline : [];
    if (!timeline.length) {
      return `<p class="unsafe-v4__timeline-empty">기록된 조치 이력이 없습니다.</p>`;
    }
    return `<ol class="unsafe-v4__timeline">${timeline.map((event) => `<li><strong>${fieldValue(event && event.title, "처리 내용 없음")}</strong><span>${fieldValue(event && event.meta, "기록 시각 없음")}</span>${text(event && event.note).trim() ? `<p>${esc(event.note)}</p>` : ""}</li>`).join("")}</ol>`;
  }

  function renderDetail(model = {}) {
    const record = model.selectedRecord || null;
    const blocked = mutationBlocked(model);
    const mobileOpen = Boolean(model.mobileDetailOpen && record);
    if (!record) {
      return `<section class="unsafe-v4__detail is-empty" aria-label="불안전요소 상세"><h2>목록에서 기록을 선택하세요.</h2><p>선택한 기록의 담당자, 기한, 조치 이력을 여기에서 확인합니다.</p></section>`;
    }
    const action = record.action || {};
    const token = recordToken(record.id);
    return `<article class="unsafe-v4__detail${mobileOpen ? " is-mobile-fullscreen" : ""}" data-unsafe-v4-detail="${esc(record.id)}" aria-label="${esc(record.shipNo || "")} 불안전요소 상세">
      <header class="unsafe-v4__detail-header"><button class="btn-light unsafe-v4__back" data-action="back-unsafe-list" type="button">목록</button><div><div>${renderStatus(record.status)}</div><h2>${fieldValue(record.content, "내용 없음")}</h2><p>${fieldValue(record.shipNo, "호선 미지정")} · ${fieldValue(record.createdAtText || record.createdAt, "등록 시각 없음")}</p></div></header>
      <dl class="unsafe-v4__detail-meta"><div><dt>심각도</dt><dd>${fieldValue(record.severity, "입력되지 않음")}</dd></div><div><dt>정확한 위치</dt><dd>${fieldValue(record.location, "입력되지 않음")}</dd></div><div><dt>즉시 조치</dt><dd>${fieldValue(record.immediateAction, "입력되지 않음")}</dd></div><div><dt>등록자</dt><dd>${fieldValue(record.workerName || record.workerNameSnapshot, "확인되지 않음")}</dd></div></dl>
      <section class="unsafe-v4__action" aria-labelledby="unsafeV4ActionHeading"><div class="unsafe-v4__section-heading"><div><h3 id="unsafeV4ActionHeading">조치 계획</h3><p>담당자와 기한을 정한 뒤 상태를 변경합니다.</p></div></div><fieldset ${blocked ? "disabled" : ""}><div class="unsafe-v4__action-grid"><label class="field" for="unsafeAssignee"><span>담당자 <b aria-hidden="true">*</b></span><input class="input" id="unsafeAssignee" data-record-assignee="${esc(token)}" type="text" value="${esc(action.assignee)}" required placeholder="담당자를 지정하세요" /></label><label class="field" for="unsafeDueDate"><span>조치 기한 <b aria-hidden="true">*</b></span><input class="input" id="unsafeDueDate" data-record-due-date="${esc(token)}" type="date" value="${esc(action.dueDate)}" required /></label><label class="field" for="unsafeStatus"><span>상태</span><select class="select" id="unsafeStatus" data-record-status="${esc(token)}" data-current-status="${esc(record.status || "")}"><option value="접수" ${record.status === "접수" ? "selected" : ""}>접수</option><option value="조치중" ${record.status === "조치중" ? "selected" : ""}>조치중</option><option value="완료" ${record.status === "완료" ? "selected" : ""}>완료</option></select></label></div><div class="unsafe-v4__action-controls"><button class="btn" data-save-record-status="${esc(token)}" type="button">조치 계획 저장</button></div></fieldset></section>
      <section class="unsafe-v4__history" aria-labelledby="unsafeV4HistoryHeading"><div class="unsafe-v4__section-heading"><div><h3 id="unsafeV4HistoryHeading">조치 이력</h3><p>상태 변경과 현장 조치 기록을 시간순으로 확인합니다.</p></div></div>${renderTimeline(record)}<div class="unsafe-v4__memo"><label class="field" for="unsafeMemo"><span>처리 메모</span><textarea class="textarea" id="unsafeMemo" data-record-memo="${esc(token)}" ${disabledAttr(blocked)} placeholder="현장 조치와 확인 내용을 기록하세요.">${esc(record.adminMemo)}</textarea></label><button class="btn-light" data-save-record="${esc(token)}" type="button" ${disabledAttr(blocked)}>기록 추가</button></div></section>
    </article>`;
  }

  function renderDesktopBoard(model = {}) {
    return `<div class="unsafe-v4__board${model.mobileDetailOpen ? " has-mobile-detail" : ""}">${renderRecordList(model)}${renderDetail(model)}</div>`;
  }

  function renderUnsafeV4View(model = {}) {
    const mode = ["register", "review", "detail"].includes(model.mode) ? model.mode : "detail";
    const state = text(model.dataState || "ready");
    const stateHtml = renderState(state, model.retryAction || "retry-unsafe-data");
    const stopForState = ["loading", "error", "empty", "offline-empty"].includes(state);
    const body = stopForState
      ? ""
      : mode === "register"
        ? renderRegistration(model)
        : mode === "review"
          ? renderReview(model)
          : renderDesktopBoard(model);
    return `<section class="unsafe-v4" data-unsafe-v4-state="${esc(state)}" data-unsafe-v4-mode="${esc(mode)}"><header class="unsafe-v4__masthead"><div><p>현장 안전 접수</p><h1>불안전요소</h1><span>발견부터 조치 완료까지 같은 기록으로 관리합니다.</span></div><button class="btn" data-view="unsafe" type="button" ${disabledAttr(mutationBlocked(model))}>새 위험요소 등록</button></header>${renderFlow(mode)}${stateHtml}${body}</section>`;
  }

  return {
    renderUnsafeV4View,
    renderUnsafeV4State: renderState,
    renderUnsafeV4Registration: renderRegistration,
    renderUnsafeV4Review: renderReview,
    renderUnsafeV4Detail: renderDetail,
  };
}));
