(function attachManageTabsV4(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardManageTabsV4View = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildManageTabsV4View() {
  function esc(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function html(value) {
    return typeof value === "string" ? value : "";
  }

  function number(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function stateMessage(state) {
    const messages = {
      loading: "관리 데이터를 불러오는 중입니다.",
      error: "관리 데이터를 불러오지 못했습니다.",
      empty: "표시할 관리 데이터가 없습니다.",
      stale: "마지막 확인 데이터를 표시합니다. 최신 상태를 다시 확인하세요.",
      offline: "오프라인 상태입니다. 이 기기에 저장된 마지막 확인 데이터를 표시합니다.",
      "offline-empty": "오프라인 상태이며 이 기기에 저장된 관리 데이터가 없습니다.",
    };
    return messages[state] || "";
  }

  function renderState(model = {}) {
    const state = model.dataState || "ready";
    if (state === "ready") return "";
    const retryAction = model.retryAction ? ` data-action="${esc(model.retryAction)}"` : "";
    const retry = ["error", "stale", "offline", "offline-empty"].includes(state) && retryAction
      ? `<button class="manage-tabs-v4__button"${retryAction} type="button">다시 확인</button>`
      : "";
    return `<div class="manage-tabs-v4__state is-${esc(state)}" role="${state === "error" ? "alert" : "status"}" data-manage-tabs-state="${esc(state)}">
        <p>${esc(stateMessage(state))}</p>${retry}
      </div>`;
  }

  function blocksContent(model = {}) {
    return ["loading", "error", "empty", "offline-empty"].includes(model.dataState || "ready");
  }

  function shell(kind, model, content) {
    const state = model.dataState || "ready";
    return `<section class="manage-tabs-v4 manage-tabs-v4--${esc(kind)}" data-manage-tabs-view="${esc(kind)}" data-manage-tabs-state="${esc(state)}">
        ${renderState(model)}
        ${blocksContent(model) ? "" : content}
      </section>`;
  }

  function renderWorkTypes(model = {}) {
    const categories = Array.isArray(model.categories) ? model.categories : [];
    const selected = model.selected && typeof model.selected === "object" ? model.selected : null;
    const editing = model.editing === true;
    const detailOpen = Boolean(model.mobileDetailOpen && selected);
    const list = categories.length
      ? categories.map((category) => `<button class="manage-tabs-v4__list-row${category.active ? " is-active" : ""}" data-select-work-type="${esc(category.id)}" data-work-type-search-item data-work-type-search-text="${esc(category.searchText || [category.label, category.meta].filter(Boolean).join(" "))}" type="button" role="option" aria-selected="${category.active ? "true" : "false"}">
          <span>${html(category.iconHtml)}<strong>${esc(category.label)}</strong>${html(category.badgesHtml)}<small>${esc(category.meta)}</small></span>
          <em>${esc(category.countLabel)}</em>
        </button>`).join("")
      : '<div class="manage-tabs-v4__empty">등록된 작업 유형이 없습니다.</div>';
    const detail = selected
      ? `<article class="manage-tabs-v4__detail${detailOpen ? " is-mobile-fullscreen" : ""}" data-manage-tabs-selected="${esc(selected.id)}" aria-labelledby="manageWorkTypeTitle"${detailOpen ? ' tabindex="-1"' : ""}>
          ${detailOpen ? '<button class="manage-tabs-v4__back" data-action="back-work-type-list" type="button">작업 유형 목록</button>' : ""}
          <header class="manage-tabs-v4__detail-head">
            <div><h2 id="manageWorkTypeTitle">${esc(selected.label)}</h2>${html(selected.badgesHtml)}<p>${esc(selected.meta)}</p></div>
            ${model.canEdit && !editing ? `<button class="manage-tabs-v4__button" data-edit-category="${esc(selected.id)}" type="button">기본 정보 수정</button>` : ""}
          </header>
          <div class="manage-tabs-v4__detail-body" data-manage-tabs-read-only="${editing ? "false" : "true"}">${editing ? html(selected.editHtml) : html(selected.summaryHtml || selected.detailHtml)}</div>
          ${editing ? `<div class="manage-tabs-v4__actions"><button class="manage-tabs-v4__button is-primary" data-save-category="${esc(selected.id)}" type="button">변경사항 저장</button><button class="manage-tabs-v4__button" data-action="cancel-edit-category" type="button">취소</button></div>` : ""}
        </article>`
      : '<div class="manage-tabs-v4__detail manage-tabs-v4__empty-detail"><p>목록에서 작업 유형을 선택하세요.</p></div>';
    return shell("work-types", model, `<div class="manage-tabs-v4__master-detail${detailOpen ? " is-mobile-detail-open" : ""}">
        <aside class="manage-tabs-v4__master" aria-label="작업 유형 목록">
          <label class="manage-tabs-v4__search"><span class="sr-only">작업 유형 검색</span><input class="input" type="search" value="${esc(model.searchQuery)}" placeholder="작업 유형 검색" data-work-type-search /><span data-work-type-search-count>${categories.length}개</span></label>
          <div class="manage-tabs-v4__list" role="listbox" aria-label="작업 유형 선택">${list}<div class="manage-tabs-v4__empty" data-work-type-search-empty hidden>검색 결과가 없습니다.</div></div>
        </aside>${detail}
      </div>`);
  }

  function renderDevice(device = {}) {
    const saving = Boolean(device.saving);
    return `<article class="manage-tabs-v4__device${device.enabled ? "" : " is-disabled"}">
        <label><input type="checkbox" data-worker-push-device-enabled data-worker-push-device-id="${esc(device.id)}"${device.enabled ? " checked" : ""}${saving ? " disabled" : ""} /><span>수신</span></label>
        <div><strong>${esc(device.deviceLabel || "이름 없는 기기")}</strong><p>${esc(device.deviceMeta)}</p>${device.lastSeen ? `<small>최근 확인 ${esc(device.lastSeen)}</small>` : ""}${device.lastError ? `<small class="is-danger">최근 오류 ${esc(device.lastError)}</small>` : ""}</div>
        <div class="manage-tabs-v4__actions"><button class="manage-tabs-v4__button" data-action="save-worker-push-device" data-worker-push-device-save="${esc(device.id)}"${saving ? " disabled" : ""} type="button">${saving ? "저장 중" : "저장"}</button><button class="manage-tabs-v4__button is-danger" data-action="delete-worker-push-device" data-worker-push-device-delete="${esc(device.id)}"${saving ? " disabled" : ""} type="button">삭제</button></div>
      </article>`;
  }

  function renderWorkersDevices(model = {}) {
    const workers = Array.isArray(model.workers) ? model.workers : [];
    const selected = model.selected && typeof model.selected === "object" ? model.selected : null;
    const devices = selected && Array.isArray(selected.devices) ? selected.devices : [];
    const detailOpen = Boolean(model.mobileDetailOpen && selected);
    const list = workers.length
      ? workers.map((worker) => `<button class="manage-tabs-v4__list-row${worker.active ? " is-active" : ""}" data-worker-card-toggle="${esc(worker.id)}" type="button" aria-pressed="${worker.active ? "true" : "false"}"><span><strong>${esc(worker.name)}</strong><small>${esc(worker.teamLine)}</small></span><span>${html(worker.badgesHtml)}</span></button>`).join("")
      : '<div class="manage-tabs-v4__empty">등록된 작업자가 없습니다.</div>';
    const detail = selected
      ? `<article class="manage-tabs-v4__detail${detailOpen ? " is-mobile-fullscreen" : ""}" data-manage-tabs-selected="${esc(selected.id)}" aria-labelledby="manageWorkerTitle"${detailOpen ? ' tabindex="-1"' : ""}>
          ${detailOpen ? '<button class="manage-tabs-v4__back" data-action="back-manage-center-list" type="button">작업자 목록</button>' : ""}
          <header class="manage-tabs-v4__detail-head"><div><h2 id="manageWorkerTitle">${esc(selected.name)}</h2><p>${esc(selected.teamLine)}</p></div>${model.canEdit ? `<button class="manage-tabs-v4__button" data-worker-card-toggle="${esc(selected.id)}" type="button">${model.editing ? "조회로 돌아가기" : "정보 수정"}</button>` : ""}</header>
          <div class="manage-tabs-v4__detail-body" data-manage-tabs-read-only="${model.editing ? "false" : "true"}">${model.editing ? html(selected.editPanelHtml) : html(selected.summaryHtml)}</div>
          <section class="manage-tabs-v4__subsection" aria-labelledby="manageWorkerDevicesTitle"><div class="manage-tabs-v4__subsection-head"><h3 id="manageWorkerDevicesTitle">알림 기기</h3><button class="manage-tabs-v4__button" data-action="edit-worker-push-devices" data-worker-push-manage="${esc(selected.id)}"${model.canEditDevices ? "" : " disabled"} type="button">기기 관리</button></div>${devices.length ? devices.map(renderDevice).join("") : '<div class="manage-tabs-v4__empty">등록된 알림 기기가 없습니다.</div>'}</section>
        </article>`
      : '<div class="manage-tabs-v4__detail manage-tabs-v4__empty-detail"><p>목록에서 작업자를 선택하세요.</p></div>';
    return shell("workers", model, `<div class="manage-tabs-v4__master-detail${detailOpen ? " is-mobile-detail-open" : ""}"><aside class="manage-tabs-v4__master" aria-label="작업자 목록"><div class="manage-tabs-v4__list-head"><h2>작업자</h2><span>${number(model.count || workers.length)}명</span></div><div class="manage-tabs-v4__list">${list}</div></aside>${detail}</div>`);
  }

  function renderWorkPrepDetail(model = {}) {
    const editing = model.editing === true;
    const mobileDetailOpen = model.mobileDetailOpen === true;
    const content = `<article class="manage-tabs-v4__record-detail${mobileDetailOpen ? " is-mobile-fullscreen" : ""}" data-work-prep-record-detail="${esc(model.recordId)}" aria-labelledby="manageWorkPrepTitle"${mobileDetailOpen ? ' tabindex="-1"' : ""}>
        ${mobileDetailOpen ? '<button class="manage-tabs-v4__back" data-action="back-work-prep-list" type="button">작업지시서 목록</button>' : ""}
        <header class="manage-tabs-v4__detail-head"><div><h2 id="manageWorkPrepTitle">${esc(model.shipNo)}</h2><p>${esc(model.categoryLabel)}${model.metaLine ? ` · ${esc(model.metaLine)}` : ""}</p></div>${html(model.statusChipHtml)}</header>
        <dl class="manage-tabs-v4__facts"><div><dt>점검 진행</dt><dd>${number(model.progressDone)}/${number(model.progressTotal)}명</dd></div><div><dt>작업반장</dt><dd>${esc(model.leaderName)}</dd></div><div><dt>참여 작업자</dt><dd>${esc(model.participantLine)}</dd></div><div><dt>등록 시각</dt><dd>${esc(model.createdAtLabel)}</dd></div></dl>
        <div class="manage-tabs-v4__progress" role="progressbar" aria-label="${esc(`점검 진행 ${number(model.progressPercent)}%`)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${number(model.progressPercent)}"><i style="--manage-progress:${Math.min(100, Math.max(0, number(model.progressPercent)))}%"></i></div>
        ${model.progressNote ? `<p class="manage-tabs-v4__note">${esc(model.progressNote)}</p>` : ""}
        <section class="manage-tabs-v4__subsection"><h3>공기구·준비물</h3>${html(model.toolBadgesHtml)}</section>
        ${html(model.timelineHtml)}
        <div class="manage-tabs-v4__detail-body" data-manage-tabs-read-only="${editing ? "false" : "true"}">${editing ? html(model.editHtml) : html(model.detailHtml)}</div>
        ${model.canEdit ? `<div class="manage-tabs-v4__actions">${editing ? html(model.editActionsHtml) : `<button class="manage-tabs-v4__button is-primary" data-action="edit-work-prep-record" data-work-prep-record-id="${esc(model.recordId)}" type="button">수정</button>`}<button class="manage-tabs-v4__button is-danger" data-action="delete-work-prep-record" data-work-prep-record-id="${esc(model.recordId)}" type="button">보관</button></div>` : ""}
      </article>`;
    return shell("work-prep", model, content);
  }

  function renderPushWorker(worker = {}, disabled = false) {
    return `<label class="manage-tabs-v4__target${worker.checked ? " is-selected" : ""}${worker.count ? "" : " is-unregistered"}"><input type="checkbox" data-admin-push-worker="${esc(worker.id)}"${worker.checked ? " checked" : ""}${disabled ? " disabled" : ""} /><span><strong>${esc(worker.name)}</strong><small>${esc([worker.team, worker.position].filter(Boolean).join(" · "))}</small></span>${html(worker.badgeHtml)}</label>`;
  }

  function renderPushManager(model = {}) {
    const draft = model.draft || {};
    const styles = Array.isArray(model.styles) ? model.styles : [];
    const workers = Array.isArray(model.workers) ? model.workers : [];
    const preview = model.preview || {};
    const editing = model.editing === true;
    const content = `<header class="manage-tabs-v4__page-head"><div><h2>푸시 발송</h2><p>${number(model.subscribedCount)}/${number(model.workerCount)}명 구독</p></div><button class="manage-tabs-v4__button" data-action="refresh-worker-push-statuses"${model.statusesChecking ? " disabled" : ""} type="button">${model.statusesChecking ? "확인 중" : "구독 상태 새로고침"}</button></header>
      <ol class="manage-tabs-v4__steps" aria-label="푸시 발송 단계"><li class="is-current">1 작성</li><li>2 대상</li><li>3 확인</li><li>4 결과</li></ol>
      <div class="manage-tabs-v4__push-grid">
        <section class="manage-tabs-v4__subsection" data-manage-tabs-read-only="${editing ? "false" : "true"}"><div class="manage-tabs-v4__subsection-head"><h3>알림 작성</h3>${model.canEdit && !editing ? '<button class="manage-tabs-v4__button" data-action="edit-admin-push" type="button">작성 시작</button>' : ""}</div><label>제목<input class="input" data-admin-push-field="title" value="${esc(draft.title)}" maxlength="80"${editing ? "" : " disabled"} /></label><label>내용<textarea class="textarea" data-admin-push-field="body" rows="4" maxlength="220"${editing ? "" : " disabled"}>${esc(draft.body)}</textarea></label><label>클릭 시 이동 화면<select class="select" data-admin-push-field="url"${editing ? "" : " disabled"}>${html(model.urlOptionsHtml)}</select></label><div class="manage-tabs-v4__choice-list">${styles.map((style) => `<button class="manage-tabs-v4__choice${draft.style === style.id ? " is-selected" : ""}" data-action="set-admin-push-style" data-admin-push-style="${esc(style.id)}"${editing ? "" : " disabled"} type="button"><strong>${esc(style.label)}</strong><small>${esc(style.description)}</small></button>`).join("")}</div></section>
        <section class="manage-tabs-v4__subsection"><div class="manage-tabs-v4__subsection-head"><h3>발송 대상</h3><span>${number(model.targetCount)}명 선택</span></div><div class="manage-tabs-v4__target-list">${workers.length ? workers.map((worker) => renderPushWorker(worker, !editing)).join("") : html(model.workersHtml) || '<div class="manage-tabs-v4__empty">등록된 작업자가 없습니다.</div>'}</div></section>
        <section class="manage-tabs-v4__subsection manage-tabs-v4__push-review"><h3>최종 확인</h3><dl class="manage-tabs-v4__facts"><div><dt>제목</dt><dd>${esc(preview.title)}</dd></div><div><dt>내용</dt><dd>${esc(preview.body)}</dd></div><div><dt>이동 화면</dt><dd>${esc(preview.url)}</dd></div><div><dt>발송 대상</dt><dd>${number(model.targetCount)}명</dd></div></dl>${model.disabledReason ? `<p class="manage-tabs-v4__note">${esc(model.disabledReason)}</p>` : ""}<button class="manage-tabs-v4__button is-primary" data-action="send-admin-push"${model.canSend ? "" : " disabled"} type="button">${esc(model.sendButtonLabel || "발송")}</button>${html(model.resultHtml)}</section>
      </div>`;
    return shell("push", model, content);
  }

  function renderSafetySettings(model = {}) {
    const sync = model.sync || {};
    const entries = Array.isArray(model.entries) ? model.entries : [];
    const content = `<header class="manage-tabs-v4__page-head"><div><h2>안전수칙 설정</h2><p>서버 게시본을 기준으로 적용 상태를 확인합니다.</p></div>${html(model.actionsHtml)}</header>
      <div class="manage-tabs-v4__settings-layout">
        <section class="manage-tabs-v4__subsection" aria-labelledby="safetySettingsAuthorityTitle"><h3 id="safetySettingsAuthorityTitle">권위와 동기화</h3><dl class="manage-tabs-v4__facts"><div><dt>권위 원본</dt><dd>${esc(sync.authoritativeSource)}</dd></div><div><dt>게시 버전</dt><dd>${esc(sync.publishedVersion)}</dd></div><div><dt>기기 버전</dt><dd>${esc(sync.deviceVersion)}</dd></div><div><dt>동기화 최신성</dt><dd>${esc(sync.freshness)}</dd></div><div><dt>마지막 동기화</dt><dd>${esc(sync.lastSyncedAt)}</dd></div></dl><p class="manage-tabs-v4__note">서버 게시본을 확인하지 못한 상태는 게시 완료로 표시하지 않습니다.</p></section>
        <section class="manage-tabs-v4__subsection" aria-labelledby="safetySettingsItemsTitle"><h3 id="safetySettingsItemsTitle">수칙 항목</h3>${entries.length ? `<ol class="manage-tabs-v4__rule-list">${entries.map((entry) => `<li><span>${esc(entry.order)}</span><div><strong>${esc(entry.title)}</strong>${entry.description ? `<p>${esc(entry.description)}</p>` : ""}</div><small>${esc(entry.status)}</small></li>`).join("")}</ol>` : html(model.itemsHtml) || '<div class="manage-tabs-v4__empty">확인된 안전수칙 항목이 없습니다.</div>'}</section>
        ${html(model.versionHistoryHtml) ? `<section class="manage-tabs-v4__subsection manage-tabs-v4__history" aria-labelledby="safetySettingsHistoryTitle"><h3 id="safetySettingsHistoryTitle">버전 이력</h3>${html(model.versionHistoryHtml)}</section>` : ""}
      </div>`;
    return shell("safety-settings", model, content);
  }

  return {
    renderWorkTypes,
    renderWorkersDevices,
    renderWorkPrepDetail,
    renderPushManager,
    renderSafetySettings,
  };
}));
