(function attachScreenViews(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardScreenViews = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildScreenViews() {
  function esc(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // 호선: 공정 현황 보드 (읽기 전용 마크업)
  // model: { total, note, stages: [{ label, color, count, chips: [{ no, foot }], overflow, showAddTile }], legend: [{ label, color }] }
  // deps: { navIcon }
  function renderProcessBoardView(model = {}, deps = {}) {
    const navIcon = typeof deps.navIcon === "function" ? deps.navIcon : () => "";
    const stages = Array.isArray(model.stages) ? model.stages : [];
    const legend = Array.isArray(model.legend) ? model.legend : [];
    return `<div class="panel panel-pad process-board">
        <div class="section-title">호선 공정 현황 <span class="small muted">총 ${Number(model.total) || 0}척</span></div>
        <div class="ship-board-note">${esc(model.note || "")}</div>
        <div class="process-tabs">
          ${stages.map((stage) => `<div class="stage-tab" style="--stage:${esc(stage.color)}">${esc(stage.label)}</div>`).join("")}
        </div>
        <div class="process-lanes">
          ${stages.map((stage) => `<div class="process-lane">
              <div class="process-lane-head"><span>${esc(stage.label)}</span><span>${Number(stage.count) || 0}</span></div>
              ${(stage.chips || []).map((chip) => `<span class="ship-chip" style="--chip:${esc(stage.color)}">${navIcon("ship")}<strong>${esc(chip.no)}</strong><small>${esc(chip.foot)}</small></span>`).join("")}
              ${stage.overflow > 0
                ? `<span class="ship-tile" style="--chip:${esc(stage.color)}">+${Number(stage.overflow)}</span>`
                : `<button class="ship-tile add-ship-tile" style="--chip:${esc(stage.color)}" data-action="focus-ship-add" type="button">+<small>호선 추가</small></button>`}
            </div>`).join("")}
        </div>
        <div class="process-legend">
          ${legend.map((item) => `<span><i class="legend-dot" style="--dot:${esc(item.color)}"></i>${esc(item.label)}</span>`).join("")}
        </div>
      </div>`;
  }

  // 이력: 오늘 작업자 점검 현황 요약 (읽기 전용 마크업)
  // model: { completed, pending, rate }
  function renderHistoryPledgeStatusView(model = {}) {
    return `<section class="history-pledge-status" aria-label="오늘 작업자 점검 현황">
        <div class="history-pledge-head">
          <div>
            <strong>오늘 작업자 점검 현황</strong>
            <span>안전 서약 관리의 오늘 서약 현황 기준</span>
          </div>
          <button class="btn-light" data-view="pledge" type="button">상세 보기</button>
        </div>
        <div class="history-pledge-kpis">
          <div><strong>${Number(model.completed) || 0}</strong><span>점검 완료</span></div>
          <div><strong>${Number(model.pending) || 0}</strong><span>미점검</span></div>
          <div><strong>${Number(model.rate) || 0}%</strong><span>완료율</span></div>
        </div>
      </section>`;
  }

  // 서약: 안전 서약 관리 화면 (읽기 전용 마크업)
  // model: { dateLabel, rows: [{ name, team, shipNo, time, statusChipHtml }], totalCount, pendingCount,
  //          kpiHtml, canNotifyPledge, adminMode, editing, rules: [string], weekBars: [{ label, pct }], todayIso,
  //          viewDate, isToday, maxDate }
  function renderPledgeManagerView(model = {}, deps = {}) {
    const rows = Array.isArray(model.rows) ? model.rows : [];
    const rules = Array.isArray(model.rules) ? model.rules : [];
    const weekBars = Array.isArray(model.weekBars) ? model.weekBars : [];
    const isToday = model.isToday !== false;
    const canAdministerToday = isToday && Boolean(model.adminMode);
    const editing = canAdministerToday && Boolean(model.editing);
    const renderContext = typeof deps.renderDataContext === "function" ? deps.renderDataContext : renderDataContext;
    const renderState = typeof deps.renderDataState === "function" ? deps.renderDataState : renderDataState;
    const isLoading = model.dataState === "loading";
    const isBlockingDataState = ["loading", "error", "empty", "offline-empty"].includes(model.dataState);
    const actionDisabled = model.actionsDisabled ? " disabled" : "";
    const contextHtml = model.context ? renderContext(model.context) : "";
    const dataStateHtml = renderState({
      state: model.dataState,
      loadingLabel: model.loadingLabel || "선택한 날짜의 서약 데이터를 불러오는 중입니다.",
      errorLabel: model.errorLabel || "선택한 날짜의 서약 데이터를 불러오지 못했습니다.",
      emptyLabel: model.emptyLabel || "선택한 날짜에 표시할 서약 데이터가 없습니다.",
      staleLabel: model.staleLabel || "이전 서약 데이터를 표시하고 있습니다.",
      offlineLabel: model.offlineLabel || "오프라인 상태입니다. 이전 서약 데이터를 표시하고 있습니다.",
      retryAction: model.retryAction || "retry-pledge-range",
      retryLabel: model.retryLabel || "다시 시도",
    });
    return `<section class="admin-board pledge-board"${isLoading ? ' aria-busy="true"' : ""}>
        ${contextHtml}
        <div class="admin-board-top">
          <div>
            <h2>안전 서약 관리</h2>
            <p>${esc(model.dateLabel)} · ${isToday ? "오늘 서약 현황 실시간" : "지난 서약 기록 조회 (읽기 전용)"}</p>
          </div>
          <div class="admin-board-actions">
            <button class="btn-light" data-export-records="pledge"${actionDisabled} type="button">내보내기</button>
            ${canAdministerToday ? `<button class="btn" data-action="edit-pledge-template"${actionDisabled} type="button">서약 양식 편집</button>` : ""}
          </div>
        </div>
        <div class="pledge-date-nav">
          <button class="btn-light" data-action="pledge-prev-day" type="button" aria-label="이전 날 서약 보기">◀ 이전 날</button>
          <input class="input pledge-date-input" type="date" data-pledge-view-date value="${esc(model.viewDate || "")}" max="${esc(model.maxDate || "")}" aria-label="서약 조회 날짜" />
          <button class="btn-light" data-action="pledge-next-day" ${isToday ? "disabled" : ""} type="button" aria-label="다음 날 서약 보기">다음 날 ▶</button>
          ${isToday ? "" : `<button class="btn" data-action="pledge-view-today" type="button">오늘로</button>`}
        </div>
        ${dataStateHtml}
        ${isBlockingDataState ? "" : `<div class="pledge-kpi-grid">
          ${model.kpiHtml || ""}
        </div>
        <div class="pledge-layout">
          <section class="pledge-table-card">
            <div class="material-table-head">
              <div><strong>${isToday ? "오늘 서약 현황" : "서약 현황"}</strong><span>${esc(model.dateLabel)} · ${rows.length}명</span></div>
              ${model.canNotifyPledge || canAdministerToday ? `<div class="material-table-actions pledge-notify-actions">
                ${canAdministerToday ? `<button class="btn-light" data-action="edit-push-template" data-push-template-kind="pledgePending"${actionDisabled} type="button">푸시 문구 수정</button>` : ""}
                ${model.canNotifyPledge ? `<button class="btn" data-action="notify-pledge-pending" ${model.pendingCount && !model.actionsDisabled ? "" : "disabled"} title="${model.pendingCount ? "브라우저 알림을 발송합니다" : "미완료자가 없습니다"}" type="button">미완료자 알림 발송</button>` : ""}
              </div>` : ""}
            </div>
            <div class="pledge-table">
              <div class="pledge-row pledge-row-head"><span>작업자</span><span>팀</span><span>호선</span><span>서약 시각</span><span>상태</span></div>
              ${rows.length ? rows.map((row) => `<div class="pledge-row">
                <span><strong>${esc(row.name)}</strong></span>
                <span>${esc(row.team)}</span>
                <span><strong>${esc(row.shipNo)}</strong></span>
                <span>${esc(row.time)}</span>
                <span>${row.statusChipHtml || ""}</span>
              </div>`).join("") : `<div class="empty">${isToday ? "오늘" : "선택한 날짜에"} 표시할 작업자 정보가 없습니다.</div>`}
            </div>
          </section>
          <aside class="pledge-side">
            <section class="pledge-preview-card">
              <div class="material-table-head">
                <div><strong>${isToday ? "서약 양식 미리보기" : "현재 적용 양식 참고"}</strong>${isToday ? "" : "<span>지난 기록은 읽기 전용입니다.</span>"}</div>
                ${editing ? `<div class="material-table-actions"><button class="btn-light" data-action="cancel-pledge-template"${actionDisabled} type="button">취소</button><button class="btn" data-action="save-pledge-template"${actionDisabled} type="button">저장</button></div>` : canAdministerToday ? `<button class="btn-light" data-action="edit-pledge-template"${actionDisabled} type="button">편집</button>` : ""}
              </div>
              ${editing ? `<div class="pledge-editor">
                <label for="pledgeRulesInput">서약 수칙</label>
                <textarea class="textarea" id="pledgeRulesInput">${esc(rules.join("\n"))}</textarea>
                <p>각 줄이 서약서의 한 항목으로 저장됩니다.</p>
              </div>` : `<div class="pledge-paper">
                <h3>작업 전 안전 서약서</h3>
                <p>나 ________ (이)은 오늘 작업에 앞서 다음 안전 수칙을 준수할 것을 서약합니다.</p>
                <ol>
                  ${rules.map((rule) => `<li>${esc(rule)}</li>`).join("")}
                </ol>
                <div class="pledge-sign"><span>서명: ____________</span><span>날짜: ${esc(model.todayIso)}</span></div>
              </div>`}
            </section>
            <section class="pledge-weekly-card">
              <strong>주간 서약 완료율</strong>
              <div class="pledge-bars">
                ${weekBars.map((row) => `<div class="pledge-bar-row">
                  <span>${esc(row.label)}</span>
                  <i><b style="width:${Math.min(Number(row.pct) || 0, 100)}%"></b></i>
                  <strong>${Number(row.pct) || 0}%</strong>
                </div>`).join("")}
              </div>
            </section>
          </aside>
        </div>`}
      </section>`;
  }

  // 관리 > 작업자: 작업자 행 (읽기 전용 마크업)
  // row: { id, name, teamLine, expanded, canEditPush, badgesHtml, editPanelHtml }
  function renderWorkerRowView(row = {}) {
    return `<article class="item-row worker-row ${row.expanded ? "is-open" : ""}" data-worker-card-toggle="${esc(row.id)}" aria-expanded="${row.expanded ? "true" : "false"}">
        <div class="worker-card-head">
          <div class="item-main">
            <div class="item-name">${esc(row.name)}</div>
            <div class="small muted worker-team-line">${esc(row.teamLine)}</div>
          </div>
          <button class="btn-light worker-push-edit-btn" data-action="edit-worker-push-devices" data-worker-push-manage="${esc(row.id)}" ${row.canEditPush ? "" : "disabled"} type="button">알림수정</button>
        </div>
        <div class="worker-meta-line">
          ${row.badgesHtml || ""}
        </div>
        ${row.expanded ? row.editPanelHtml || "" : ""}
      </article>`;
  }

  // 관리 > 작업자: 목록 화면 (읽기 전용 마크업)
  // model: { count, teamOptionsHtml, positionOptionsHtml, rows: [rowModel] }
  function renderWorkerManagerView(model = {}) {
    const rows = Array.isArray(model.rows) ? model.rows : [];
    return `<section class="panel panel-pad">
        <div class="section-title">신입사원 등록 <span class="small muted">현재 ${Number(model.count) || 0}명</span></div>
        <p class="small muted">최초 사번은 로그인용으로 서버에만 저장되며 작업자 목록에는 표시되지 않습니다.</p>
        <div class="form-row worker-form">
          <div class="field">
            <label for="workerName">이름</label>
            <input class="input" id="workerName" placeholder="예) 김민수" />
          </div>
          <div class="field">
            <label for="workerTeam">팀 성격</label>
            <select class="select" id="workerTeam">
              ${model.teamOptionsHtml || ""}
            </select>
          </div>
          <div class="field">
            <label for="workerPosition">배지</label>
            <select class="select" id="workerPosition">
              ${model.positionOptionsHtml || ""}
            </select>
          </div>
          <div class="field">
            <label for="workerEmployeeNo">최초 사번</label>
            <input id="workerEmployeeNo" class="input" type="password" autocomplete="new-password" inputmode="text" maxlength="40" placeholder="영문·숫자 4자 이상" />
          </div>
          <label class="check-row" for="workerIsForeign">
            <input id="workerIsForeign" type="checkbox" />
            <span>외국인 작업자</span>
          </label>
          <button class="btn" data-action="add-worker" type="button">신입사원 등록</button>
        </div>
        <div class="section-title">작업자 목록</div>
        <div class="list worker-list">
          ${rows.length ? rows.map(renderWorkerRowView).join("") : `<div class="empty">등록된 작업자가 없습니다.</div>`}
        </div>
      </section>`;
  }

  // 관리 > 불안전요소: 처리 보드 셸 (읽기 전용 마크업)
  // model: { totalCount, openCount, adminMode, shipFilterNoticeHtml, rowsHtml }
  function renderUnsafeManagerView(model = {}) {
    return `<section class="admin-board unsafe-board">
        <div class="admin-board-top">
          <div>
            <h2>불안전요소 처리</h2>
            <p>${Number(model.totalCount) || 0}건 등록 · ${Number(model.openCount) || 0}건 미확인</p>
          </div>
          <div class="admin-board-actions">
            <button class="btn-light" data-export-records="unsafe" type="button">내보내기</button>
            <button class="btn-danger" data-action="reset-unsafe-records" ${model.adminMode ? "" : "disabled"} type="button">이력 초기화</button>
            <button class="btn-light" data-action="edit-push-template" data-push-template-kind="unsafeIssue" type="button">푸시 문구 수정</button>
            <button class="btn" data-view="unsafe" type="button">+ 신규</button>
          </div>
        </div>
        ${model.shipFilterNoticeHtml || ""}
        <div class="unsafe-split unsafe-split-inline">
          <aside class="unsafe-list-panel">
            <div class="unsafe-list-head">
              <div><strong>전체 목록</strong><span>상태별</span></div>
              <button class="btn-light" data-record-filter="unsafe:status" value="" type="button">필터</button>
            </div>
            <div class="unsafe-list-table">
              <div class="unsafe-list-row unsafe-list-row-head"><span>호선</span><span>제목</span><span>상태</span></div>
              ${model.rowsHtml || `<div class="empty">표시할 불안전요소가 없습니다.</div>`}
            </div>
          </aside>
        </div>
      </section>`;
  }

  // 관리 > 자재누락: 관리 보드 셸 (읽기 전용 마크업)
  // model: { totalCount, checkingCount, doneCount, adminMode, canEdit, kpiHtml, shipFilterNoticeHtml,
  //          filterPanelHtml, visibleCount, sortValue, sortLabel, rowsHtml }
  function renderMaterialManagerView(model = {}) {
    return `<section class="admin-board material-board">
        <div class="admin-board-top">
          <div>
            <h2>호선자재 누락 관리</h2>
            <p>${Number(model.totalCount) || 0}건 등록 · ${Number(model.checkingCount) || 0}건 확인중 · ${Number(model.doneCount) || 0}건 완료</p>
          </div>
          <div class="admin-board-actions">
            <button class="btn-light" data-export-records="materials" type="button">내보내기</button>
            <button class="btn-danger" data-action="reset-material-records" ${model.adminMode ? "" : "disabled"} type="button">이력 초기화</button>
            <button class="btn" data-view="materials" type="button">+ 신규 등록</button>
          </div>
        </div>
        <div class="material-kpi-grid">
          ${model.kpiHtml || ""}
        </div>
        ${model.shipFilterNoticeHtml || ""}
        <div class="material-layout">
          <aside class="material-filter-panel">
            <div class="section-title">호선별 필터</div>
            ${model.filterPanelHtml || ""}
          </aside>
          <section class="material-table-card">
            <div class="material-table-head">
              <div><strong>자재 누락 목록</strong><span>${Number(model.visibleCount) || 0}건 표시 중</span></div>
              <div class="material-table-actions">
                <button class="btn-light" data-record-filter="materials:sort" value="${esc(model.sortValue)}" type="button">정렬: ${esc(model.sortLabel)}</button>
                <button class="btn-light" data-action="bulk-material-status" ${model.canEdit ? "" : "disabled"} type="button">상태 일괄 변경</button>
              </div>
            </div>
            <div class="material-table">
              <div class="material-row material-row-head">
                <span></span><span>호선</span><span>자재명</span><span>수량</span><span>등록자</span><span>등록 시각</span><span>상태</span><span>액션</span>
              </div>
              ${model.rowsHtml || `<div class="empty">표시할 자재 누락 기록이 없습니다.</div>`}
            </div>
          </section>
        </div>
      </section>`;
  }


  // 관리: 푸시 발송 관리 화면 (읽기 전용 마크업)
  // model: { subscribedCount, workerCount, statusesChecking, draft: { title, body, url, style },
  //          styles: [{ id, label, description, tone }], preview: { title, body, url, style: { tone } },
  //          targetCount, canSend, disabledReason, sendButtonLabel, workersHtml }
  function renderPushManagerView(model = {}) {
    const draft = model.draft || {};
    const preview = model.preview || {};
    const previewStyle = preview.style || {};
    const styles = Array.isArray(model.styles) ? model.styles : [];
    return `<section class="panel panel-pad push-manager-panel">
        <div class="push-manager-head">
          <div>
            <div class="section-title">푸시 발송 관리 <span class="small muted">${model.subscribedCount}/${model.workerCount}명 구독</span></div>
            <p>브라우저 알림을 등록한 작업자 휴대폰으로 즉시 푸시를 발송합니다.</p>
          </div>
          <button class="btn-light" data-action="refresh-worker-push-statuses" ${model.statusesChecking ? "disabled" : ""} type="button">${model.statusesChecking ? "확인 중" : "구독 상태 새로고침"}</button>
        </div>

        <div class="push-manager-grid">
          <div class="push-compose-card">
            <div class="section-title compact">푸시 문구</div>
            <div class="field">
              <label for="adminPushTitle">제목</label>
              <input id="adminPushTitle" class="input" data-admin-push-field="title" value="${esc(draft.title)}" maxlength="80" />
            </div>
            <div class="field">
              <label for="adminPushBody">내용</label>
              <textarea id="adminPushBody" class="textarea" data-admin-push-field="body" rows="4" maxlength="220">${esc(draft.body)}</textarea>
            </div>
            <div class="field">
              <label for="adminPushUrl">클릭 시 이동 화면</label>
              <select id="adminPushUrl" class="select" data-admin-push-field="url">
                ${[["/index.html", "홈"], ["/check.html", "작업 전 점검"], ["/unsafe.html", "불안전요소"], ["/materials.html", "자재누락"], ["/history.html", "점검 이력"]]
                  .map(([url, label]) => `<option value="${esc(url)}" ${draft.url === url ? "selected" : ""}>${esc(label)}</option>`).join("")}
              </select>
            </div>
            <div class="push-token-help">사용 가능 문구: <code>{날짜}</code> <code>{발신자}</code> <code>{대상수}</code></div>
          </div>

          <div class="push-style-card">
              <div class="section-title compact">알림 유형</div>
              <p class="push-token-help">브라우저 푸시는 별도 템플릿이 아니라 제목, 내용, 아이콘, 배지, 진동, 클릭 이동 옵션 조합입니다.</p>
              <div class="push-style-grid">
                ${styles.map((style) => `<button class="push-style-option tone-${esc(style.tone)} ${draft.style === style.id ? "active" : ""}" data-action="set-admin-push-style" data-admin-push-style="${esc(style.id)}" type="button">
                  <strong>${esc(style.label)}</strong>
                  <span>${esc(style.description)}</span>
                </button>`).join("")}
              </div>
            <article class="push-preview tone-${esc(previewStyle.tone)}">
              <span>미리보기</span>
              <strong>${esc(preview.title)}</strong>
              <p>${esc(preview.body)}</p>
              <em>${esc(preview.url)}</em>
            </article>
          </div>
        </div>

        <div class="push-target-card">
          <div class="push-target-head">
            <div class="section-title compact">발송 대상 <span class="small muted">${model.targetCount}명</span></div>
            <button class="btn push-target-send-btn" data-action="send-admin-push" ${model.canSend ? "" : "disabled"} title="${esc(model.disabledReason || "즉시 푸시 발송")}" aria-label="${esc(model.disabledReason || "즉시 푸시 발송")}" type="button">${esc(model.sendButtonLabel)}</button>
          </div>
          <p class="push-token-help">발송할 작업자 카드를 직접 눌러 선택하세요. 알림 미등록 작업자는 선택해도 실제 수신되지 않습니다.</p>
          <div class="push-worker-grid">
            ${model.workersHtml || `<div class="empty">등록된 작업자가 없습니다.</div>`}
          </div>
        </div>
      </section>`;
  }

  // 관리: 푸시 발송 대상 작업자 카드 (읽기 전용 마크업)
  // model: { id, name, team, position, count, checked, badgeHtml }
  function renderPushTargetWorkerView(model = {}) {
    return `<label class="push-worker-card ${model.checked ? "checked" : ""} ${model.count ? "" : "is-empty"}">
        <input type="checkbox" data-admin-push-worker="${esc(model.id)}" ${model.checked ? "checked" : ""} />
        <span>
          <strong>${esc(model.name)}</strong>
          <em>${esc(model.team)} · ${esc(model.position)}</em>
        </span>
        ${model.badgeHtml || ""}
      </label>`;
  }

  // 관리: 작업자 알림 기기 행 (읽기 전용 마크업)
  // model: { id, enabled, saving, deviceLabel, deviceMeta, lastSeen, lastSentAt, lastSent, lastError }
  function renderWorkerPushDeviceRowView(model = {}) {
    const saving = Boolean(model.saving);
    return `<article class="push-device-row ${model.enabled ? "" : "is-disabled"}">
        <label class="push-device-toggle">
          <input type="checkbox" data-worker-push-device-enabled data-worker-push-device-id="${esc(model.id)}" ${model.enabled ? "checked" : ""} ${saving ? "disabled" : ""} />
          <span>수신</span>
        </label>
        <div class="push-device-main">
          <label class="sr-only" for="pushDeviceLabel_${esc(model.id)}">기기 이름</label>
          <input id="pushDeviceLabel_${esc(model.id)}" class="input push-device-label-input" data-worker-push-device-label data-worker-push-device-id="${esc(model.id)}" value="${esc(model.deviceLabel)}" ${saving ? "disabled" : ""} />
          <div class="small muted push-device-meta">${esc(model.deviceMeta)} · 최근 확인 ${esc(model.lastSeen)}</div>
          ${model.lastSentAt ? `<div class="small muted push-device-meta">최근 발송 ${esc(model.lastSent)}</div>` : ""}
          ${model.lastError ? `<div class="small danger push-device-error">최근 오류 ${esc(model.lastError)}</div>` : ""}
        </div>
        <div class="push-device-actions">
          <button class="btn-light" data-action="save-worker-push-device" data-worker-push-device-save="${esc(model.id)}" ${saving ? "disabled" : ""} type="button">${saving ? "저장 중" : "저장"}</button>
          <button class="btn-danger" data-action="delete-worker-push-device" data-worker-push-device-delete="${esc(model.id)}" ${saving ? "disabled" : ""} type="button">삭제</button>
        </div>
      </article>`;
  }

  // 관리: 작업자 알림 기기 관리 오버레이 (읽기 전용 마크업)
  // model: { workerName, deviceCount, enabledCount, loading, rowsHtml }
  function renderWorkerPushDeviceManagerView(model = {}) {
    return `<div class="push-device-overlay" role="dialog" aria-modal="true" aria-labelledby="pushDeviceTitle">
        <button class="push-device-backdrop" data-action="close-worker-push-devices" type="button" aria-label="알림 기기 관리 닫기"></button>
        <section class="push-device-panel">
          <div class="push-device-head">
            <div>
              <strong id="pushDeviceTitle">${esc(model.workerName)} 알림 기기</strong>
              <span>${model.deviceCount}대 등록 · 수신 ${model.enabledCount}대</span>
            </div>
            <button class="push-device-close" data-action="close-worker-push-devices" type="button" aria-label="닫기">×</button>
          </div>
          <p class="push-device-description">수신을 켠 기기에만 서약 미완료, 불안전요소, 누락자재 브라우저 알림이 발송됩니다.</p>
          <div class="push-device-list">
            ${model.loading ? `<div class="empty">알림 기기 상태를 확인하고 있습니다.</div>` : model.rowsHtml || `<div class="empty">등록된 알림 기기가 없습니다.</div>`}
          </div>
        </section>
      </div>`;
  }

  // 관리: 푸시 문구 편집 오버레이 (읽기 전용 마크업)
  // model: { heading, description, tokens: [string], title, body, previewTitle, previewBody }
  function renderPushTemplateEditorView(model = {}) {
    const tokens = Array.isArray(model.tokens) ? model.tokens : [];
    return `<div class="push-template-overlay" role="dialog" aria-modal="true" aria-labelledby="pushTemplateTitleText">
        <button class="push-template-backdrop" data-action="cancel-push-template" type="button" aria-label="푸시 문구 닫기"></button>
        <section class="push-template-panel">
          <div class="push-template-head">
            <div>
              <strong id="pushTemplateTitleText">${esc(model.heading || "푸시 문구 수정")}</strong>
              <span>${esc(model.description || "브라우저 푸시 알림에 표시될 문구입니다.")}</span>
            </div>
            <button class="push-template-close" data-action="cancel-push-template" type="button" aria-label="푸시 문구 닫기">닫기</button>
          </div>
          <div class="push-template-form">
            <label for="pushTemplateTitleInput">제목</label>
            <input id="pushTemplateTitleInput" class="input" value="${esc(model.title)}" autocomplete="off" />
            <label for="pushTemplateBodyInput">내용</label>
            <textarea id="pushTemplateBodyInput" class="textarea">${esc(model.body)}</textarea>
            <p>사용 가능 변수: ${esc(tokens.join(" "))}</p>
          </div>
          <div class="push-template-preview">
            <span>미리보기</span>
            <strong>${esc(model.previewTitle)}</strong>
            <p>${esc(model.previewBody)}</p>
          </div>
          <div class="push-template-actions">
            <button class="btn-light" data-action="reset-push-template" type="button">기본값</button>
            <button class="btn-light" data-action="cancel-push-template" type="button">취소</button>
            <button class="btn" data-action="save-push-template" type="button">저장</button>
          </div>
        </section>
      </div>`;
  }

  // 점검: 작업지시서 카드 (읽기 전용 마크업)
  // model: { status, recordId, ariaLabel, typeIconHtml, shipNo, categoryLabel, statusLabel, leaderName,
  //          leaderBadgeHtml, workerCount, progressDone, progressTotal, toolCount, team, showPlace, summaryKind,
  //          pendingNames: [string], canDelete, deleteDisabled, deleteAriaLabel, buttonLight,
  //          buttonDisabled, buttonHelp, buttonAction, buttonLabel }
  function renderWorkPrepCardView(model = {}) {
    const pendingNames = Array.isArray(model.pendingNames) ? model.pendingNames : [];
    const pendingNameLimit = 4;
    const hiddenPendingCount = Math.max(0, pendingNames.length - pendingNameLimit);
    const pendingNamesHtml = pendingNames.length
      ? `<span>${pendingNames.slice(0, pendingNameLimit).map(esc).join(" · ")}${hiddenPendingCount ? ` 외 ${hiddenPendingCount}명` : ""}</span>`
      : "";
    const summaryHtml = model.summaryKind === "ordered"
      ? `<div class="work-prep-submission-summary neutral"><strong>작업지시 전</strong></div>`
      : model.summaryKind === "done"
        ? `<div class="work-prep-submission-summary done"><strong>전원 점검 완료</strong></div>`
        : `<div class="work-prep-submission-summary pending"><strong>미점검 ${pendingNames.length}명</strong>${pendingNamesHtml}</div>`;
    const disabledAttrs = model.buttonDisabled
      ? `disabled${model.buttonHelp ? ` title="${esc(model.buttonHelp)}" aria-label="${esc(`${model.buttonLabel} - ${model.buttonHelp}`)}"` : ""}`
      : `data-action="${model.buttonAction}" data-work-prep-record-id="${esc(model.recordId)}"`;
    return `<article class="work-prep-record-card status-${esc(model.status)}" data-work-prep-record="${esc(model.recordId)}" role="button" tabindex="0" aria-label="${esc(model.ariaLabel)}">
        <div class="work-prep-record-top">
          <div class="work-prep-record-title-wrap">
            ${model.typeIconHtml || ""}
            <div>
              <strong>${esc(model.shipNo)}</strong>
              <span>${esc(model.categoryLabel)}</span>
            </div>
          </div>
          <em>${esc(model.statusLabel)}</em>
        </div>
        <div class="work-prep-record-meta">
          <span class="work-prep-record-worker"><strong>${esc(model.leaderName)}</strong>${model.leaderBadgeHtml || ""}</span>
          <span>같이 ${model.workerCount}명</span>
          <span class="work-prep-record-progress">점검 ${model.progressDone}/${model.progressTotal}명</span>
          <span>공기구 ${model.toolCount}개</span>
          ${model.showPlace ? `<span>장소 ${esc(model.placeLabel || "장소 미지정")}</span>` : ""}
          <span>${esc(model.team)}</span>
        </div>
        <div class="work-prep-record-actions">
          ${summaryHtml}
          <div class="work-prep-record-buttons">
            ${model.canDelete ? `<button class="btn-danger" ${model.deleteDisabled ? "disabled" : `data-action="delete-work-prep-record" data-work-prep-record-id="${esc(model.recordId)}"`} type="button" aria-label="${esc(model.deleteAriaLabel)}">삭제</button>` : ""}
            <button class="btn ${model.buttonLight ? "btn-light" : ""}" ${disabledAttrs} type="button">${esc(model.buttonLabel)}</button>
          </div>
        </div>
      </article>`;
  }

  // 점검/관리: 작업지시서 등록 화면 (읽기 전용 마크업)
  // model: { manageContext, activeStatus, statusSteps: [{ status, label }], appearanceBadgeHtml,
  //          workDate, team, teams: [string], shipNo, ships: [{ no, type }], showPlaceField, placeId, places,
  //          categories: [{ id, label }], leaderWorkerId, leaders: [{ id, name, team }], teamLabel,
  //          workerChoices: [{ id, name, checked, badgeHtml }], otherWorkersOpen, otherSelectedCount,
  //          otherWorkerChoices: [{ id, name, checked, badgeHtml }], toolCategoryLabel,
  //          tools: [{ id, name, natureLabel, checked }] }
  function renderWorkPrepRegisterView(model = {}) {
    const manageContext = Boolean(model.manageContext);
    const issueRequirementsEnabled = Boolean(model.showPlaceField || model.showSiteSurveyField);
    const issueBlocked = issueRequirementsEnabled && (!model.placeId || model.siteSurveyDone !== true);
    const statusSteps = Array.isArray(model.statusSteps) ? model.statusSteps : [];
    const teams = Array.isArray(model.teams) ? model.teams : [];
    const ships = Array.isArray(model.ships) ? model.ships : [];
    const places = Array.isArray(model.places) ? model.places : [];
    const categories = Array.isArray(model.categories) ? model.categories : [];
    const leaders = Array.isArray(model.leaders) ? model.leaders : [];
    const workerChoices = Array.isArray(model.workerChoices) ? model.workerChoices : [];
    const otherWorkerChoices = Array.isArray(model.otherWorkerChoices) ? model.otherWorkerChoices : [];
    const tools = Array.isArray(model.tools) ? model.tools : [];
    const body = `<div class="work-prep-status-strip" aria-label="작업지시서 상태">
        ${statusSteps.map((step) => `<span class="${step.status === model.activeStatus ? "active" : ""}">${esc(step.label)}</span>`).join("")}
      </div>
      <section class="work-prep-register-card">
        <div class="work-prep-register-card-head">
          <div class="section-title">작업지시 기본 정보</div>
          ${model.appearanceBadgeHtml || ""}
        </div>
        <div class="work-prep-register-grid">
          <div class="field material-flow-field">
            <label for="workPrepDate">작업일</label>
            <input class="input" id="workPrepDate" data-work-prep-field="workDate" type="date" value="${esc(model.workDate)}" />
          </div>
          <div class="field material-flow-field">
            <label for="workPrepTeam">팀/소속</label>
            <select class="select" id="workPrepTeam" data-work-prep-field="team">
              ${teams.map((team) => `<option value="${esc(team)}" ${team === model.team ? "selected" : ""}>${esc(team)}</option>`).join("")}
            </select>
          </div>
          <div class="field material-flow-field">
            <label for="workPrepShip">호선</label>
            <select class="select" id="workPrepShip" data-work-prep-field="shipNo">
              ${ships.map((ship) => `<option value="${esc(ship.no)}" ${ship.no === model.shipNo ? "selected" : ""}>${esc(ship.no)}${ship.type ? ` · ${esc(ship.type)}` : ""}</option>`).join("")}
            </select>
          </div>
          <div class="field material-flow-field">
            <label for="workPrepCategory">작업 유형</label>
            <select class="select" id="workPrepCategory" data-work-prep-field="categoryId">
              ${categories.map((cat) => `<option value="${esc(cat.id)}" ${cat.id === model.categoryId ? "selected" : ""}>${esc(cat.label)}</option>`).join("")}
            </select>
          </div>
          ${model.showPlaceField ? `<div class="field material-flow-field work-prep-register-place-field">
            <label for="workPrepPlace">작업 장소 <small class="work-prep-required-mark">필수</small></label>
            <select class="select" id="workPrepPlace" data-work-prep-field="placeId" required>
              <option value="">도크·안벽 선택</option>
              ${places.map((place) => `<option value="${esc(place.id)}" ${place.id === model.placeId ? "selected" : ""}>${esc(place.name)} · ${esc(place.id)}</option>`).join("")}
            </select>
          </div>` : ""}
        </div>
        ${model.showSiteSurveyField ? `<label class="work-prep-site-survey ${model.siteSurveyDone ? "is-complete" : "is-required"}" for="workPrepSiteSurvey">
          <input id="workPrepSiteSurvey" data-work-prep-field="siteSurveyDone" type="checkbox" aria-describedby="workPrepSiteSurveyWarning" required ${model.siteSurveyDone ? "checked" : ""} />
          <span><strong>현장 사전 답사 완료</strong><small>작업 시작 전 현장 위험요인과 작업 위치를 직접 확인했습니다.</small></span>
        </label>${model.siteSurveyDone ? "" : `<p class="work-prep-site-survey-warning" id="workPrepSiteSurveyWarning" aria-live="polite">현장 사전 답사 미진행시 작업지시서가 발행 되지 않습니다! 현장 사전 답사 후 지시서 발행 부탁드립니다</p>`}` : ""}
      </section>
      <section class="work-prep-register-card">
        <div class="section-title">조장 / 같이 작업자</div>
        <div class="field material-flow-field">
          <label for="workPrepLeader">조장 <small>선택 시 같이 작업자 목록에서 제외</small></label>
          <select class="select" id="workPrepLeader" data-work-prep-field="leaderWorkerId">
            ${leaders.map((worker) => `<option value="${esc(worker.id)}" ${worker.id === model.leaderWorkerId ? "selected" : ""}>${esc(worker.name)}${worker.team ? ` · ${esc(worker.team)}` : ""}</option>`).join("")}
          </select>
        </div>
        <div class="work-prep-worker-subhead">
          <strong>같이 작업자</strong>
          <span>${esc(model.teamLabel)} ${workerChoices.length}명</span>
        </div>
        <div class="work-prep-chip-grid" aria-label="같이 작업자 선택">
          ${workerChoices.map((worker) => `<label class="work-prep-chip ${worker.checked ? "checked" : ""}">
                <input type="checkbox" data-work-prep-worker="${esc(worker.id)}" ${worker.checked ? "checked" : ""} />
                <span>${esc(worker.name)}</span>
                ${worker.badgeHtml || ""}
              </label>`).join("")}
        </div>
        <div class="work-prep-other-workers-group ${model.otherWorkersOpen ? "open" : ""}" data-work-prep-other-workers-group role="button" tabindex="0" aria-expanded="${model.otherWorkersOpen ? "true" : "false"}">
          <div class="work-prep-other-workers-toggle" data-work-prep-other-workers-toggle>
            <strong>타 소속 작업자</strong>
            <em>${model.otherSelectedCount ? `${model.otherSelectedCount}명 선택` : `${otherWorkerChoices.length}명`}</em>
          </div>
          ${model.otherWorkersOpen ? `<div class="work-prep-chip-grid other-workers" aria-label="타 소속 작업자 선택">
            ${otherWorkerChoices.length ? otherWorkerChoices.map((worker) => `<label class="work-prep-chip ${worker.checked ? "checked" : ""}">
                <input type="checkbox" data-work-prep-other-worker="${esc(worker.id)}" ${worker.checked ? "checked" : ""} />
                <span>${esc(worker.name)}</span>
                ${worker.badgeHtml || ""}
              </label>`).join("") : `<div class="notice">추가할 타 소속 작업자가 없습니다.</div>`}
          </div>` : ""}
        </div>
      </section>
      <section class="work-prep-register-card">
        <div class="section-title">공기구 / 준비물 <span class="small muted">${esc(model.toolCategoryLabel)} 기준</span></div>
        ${tools.length ? `<div class="work-prep-chip-grid tools" aria-label="공기구 준비물 선택">
          ${tools.map((tool) => `<label class="work-prep-chip ${tool.checked ? "checked" : ""}">
            <input type="checkbox" data-work-prep-tool="${esc(tool.id)}" ${tool.checked ? "checked" : ""} />
            <span>${esc(tool.name)}</span>
            <em>${esc(tool.natureLabel)}</em>
          </label>`).join("")}
        </div>` : `<div class="notice">선택한 작업 유형에 지정된 공기구/준비물이 없습니다.</div>`}
      </section>`;

    const footer = `<button class="btn-light material-flow-secondary" data-action="close-work-prep-register" type="button">${manageContext ? "관리 목록으로" : "작업 선택으로"}</button>
        <button class="material-flow-primary" data-action="save-work-prep-registration" ${issueBlocked ? 'disabled aria-disabled="true" title="작업 장소 선택과 현장 사전 답사 확인이 필요합니다."' : ""} type="button">${issueRequirementsEnabled ? "작업지시서 발행" : "준비 시작"}</button>`;
    return `<section class="material-flow check-flow work-prep-register-flow">
        <div class="material-flow-head">
          <div class="material-flow-kicker">${manageContext ? "관리 · 작업지시서" : "작업 전 점검 · 작업지시서 등록"}</div>
          <div class="material-flow-title">
            <button class="material-back" data-action="close-work-prep-register" type="button" aria-label="${manageContext ? "작업지시서 관리 목록으로 돌아가기" : "작업 선택으로 돌아가기"}">‹</button>
            <h1>${manageContext ? "작업지시서 등록" : "작업지시서 등록"}</h1>
          </div>
          <p>${manageContext ? "작업일, 호선, 조장, 작업자, 공기구 기준을 한 번에 관리합니다." : "작업지시 기준으로 조장, 같이 작업자, 공기구/준비물을 먼저 정리합니다."}</p>
          <div class="material-flow-progress" role="progressbar" aria-label="작업지시서 등록 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25"><span style="width:25%"></span></div>
        </div>
        <div class="material-flow-body">${body}</div>
        <div class="material-flow-footer">${footer}</div>
      </section>`;
  }

  // 관리: 작업지시서 관리 보드 (읽기 전용 마크업)
  // model: { totalCount, progressCount, usedCount, canEdit, kpiHtml, allShipsActive, filterPanelCount,
  //          shipGroups: [{ shipNo, active, progressText, count }], filteredCount, rowsHtml }
  function renderWorkPrepManagerView(model = {}) {
    const shipGroups = Array.isArray(model.shipGroups) ? model.shipGroups : [];
    const statusOptions = Array.isArray(model.statusOptions) ? model.statusOptions : [];
    return `<section class="admin-board work-prep-board">
        <div class="admin-board-top">
          <div>
            <h2>작업지시서 관리</h2>
            <p>${model.totalCount}건 등록 · ${model.progressCount}건 진행 · ${model.usedCount}건 사용됨</p>
          </div>
        </div>
        <div class="work-prep-mobile-filter-bar" aria-label="작업지시서 목록 필터">
          <label><span>호선</span><select class="select" data-record-filter="workPrep:shipNo"><option value=""${model.activeShipNo ? "" : " selected"}>전체 호선</option>${shipGroups.map((group) => `<option value="${esc(group.shipNo)}"${model.activeShipNo === group.shipNo ? " selected" : ""}>${esc(group.shipNo)} · ${group.count}건</option>`).join("")}</select></label>
          <label><span>상태</span><select class="select" data-record-filter="workPrep:status"><option value=""${model.activeStatus ? "" : " selected"}>전체 상태</option>${statusOptions.map((status) => `<option value="${esc(status.value)}"${model.activeStatus === status.value ? " selected" : ""}>${esc(status.label)} · ${status.count}건</option>`).join("")}</select></label>
        </div>
        <div class="material-kpi-grid work-prep-kpi-grid">
          ${model.kpiHtml || ""}
        </div>
        <div class="material-layout work-prep-layout">
          <aside class="material-filter-panel">
            <div class="section-title">호선별 필터</div>
            <button class="material-ship-filter ${model.allShipsActive ? "active" : ""}" data-record-filter="workPrep:shipNo" value="" type="button">
              <span>전체 호선</span><strong>${model.filterPanelCount}</strong>
            </button>
            ${shipGroups.map((group) => `<button class="material-ship-filter ${group.active ? "active" : ""}" data-record-filter="workPrep:shipNo" value="${esc(group.shipNo)}" type="button">
              <span><strong>${esc(group.shipNo)}</strong><em>${esc(group.progressText)}</em></span><strong>${group.count}</strong>
            </button>`).join("")}
          </aside>
          <section class="material-table-card work-prep-table-card">
            <div class="material-table-head">
              <div><strong>작업지시서 목록</strong><span>${model.filteredCount}건 표시 중</span></div>
            </div>
            <div class="work-prep-admin-table work-prep-admin-card-list">
              ${model.rowsHtml || `<div class="empty">표시할 작업지시서가 없습니다.</div>`}
            </div>
          </section>
        </div>
      </section>`;
  }

  // 관리: 작업지시서 관리 행 카드 (읽기 전용 마크업)
  // model: { status, active, recordId, ariaLabel, typeIconHtml, shipNo, categoryLabel, leaderName,
  //          leaderBadgeHtml, participantNames, progressDone, progressTotal, toolCount, team, dateLabel,
  //          appearanceMeta, statusControlHtml, canEdit, deleteAriaLabel, timelineSummaryHtml }
  function renderWorkPrepAdminRowView(model = {}) {
    return `<div class="work-prep-admin-row work-prep-admin-card status-${esc(model.status)} ${model.active ? "active" : ""}" data-work-prep-record-detail="${esc(model.recordId)}" role="button" tabindex="0" aria-label="${esc(model.ariaLabel)}">
        <div class="work-prep-admin-card-main">
          <div class="work-prep-admin-card-mark">${model.typeIconHtml || ""}</div>
          <div class="work-prep-admin-card-content">
            <div class="work-prep-admin-card-title">
              <strong>${esc(model.shipNo)}</strong>
              <em>${esc(model.categoryLabel)}</em>
              <span class="work-prep-admin-card-status-label">${esc(model.statusLabel || model.status)}</span>
            </div>
            <div class="work-prep-admin-card-meta">
              <span><strong>${esc(model.leaderName)}</strong>${model.leaderBadgeHtml || ""}</span>
              <span>같이 ${esc(model.participantNames)}</span>
              <span class="work-prep-record-progress">점검 ${model.progressDone}/${model.progressTotal}명</span>
              <span>공기구 ${model.toolCount}개</span>
              <span>장소 ${esc(model.placeLabel || "장소 미지정")}</span>
              <span class="work-prep-survey-state ${model.siteSurveyDone ? "is-complete" : "is-pending"}">현장답사 ${model.siteSurveyDone ? "완료" : "미진행"}</span>
              <span>${esc(model.team)} · ${esc(model.dateLabel)}${model.appearanceMeta ? ` · ${esc(model.appearanceMeta)}` : ""}</span>
              <span class="work-prep-sync-state state-${esc(model.syncState)}" data-work-prep-sync-state="${esc(model.syncState)}" title="${esc(model.syncDetail)}">${esc(model.syncLabel)}</span>
            </div>
          </div>
        </div>
        <div class="work-prep-admin-card-side">
          ${model.statusControlHtml || ""}
          <button class="btn-danger" data-action="delete-work-prep-record" data-work-prep-record-id="${esc(model.recordId)}" ${model.canEdit ? "" : "disabled"} type="button" aria-label="${esc(model.deleteAriaLabel)}">삭제</button>
        </div>
        ${model.timelineSummaryHtml || ""}
      </div>`;
  }

  // 관리: 작업지시서 상세 (읽기 전용 마크업)
  // model: { shipNo, categoryLabel, metaLine, statusChipHtml, progressDone, progressTotal,
  //          progressPercent, progressNote, leaderName, participantLine, toolBadgesHtml, timelineHtml,
  //          createdAtLabel, canEdit, recordId }
  function renderWorkPrepDetailView(model = {}) {
    return `<section class="work-prep-detail">
        <div class="work-prep-detail-shell">
          <div class="work-prep-detail-head">
            <button class="work-prep-detail-back" data-action="back-work-prep-list" type="button">목록</button>
            <div class="work-prep-detail-title">
              <span>${esc(model.shipNo)}</span>
              <strong>${esc(model.categoryLabel)}</strong>
              <em>${esc(model.metaLine)}</em>
            </div>
            <div class="work-prep-detail-status">${model.statusChipHtml || ""}</div>
          </div>

          <div class="work-prep-detail-body">
            <section class="work-prep-detail-panel lead">
              <span class="work-prep-detail-label">점검 진행</span>
              <div class="work-prep-progress-line"><strong>${esc(model.progressDone)}</strong><span>/ ${esc(model.progressTotal)}</span></div>
              <div class="work-prep-progress-track" aria-label="${esc(`점검 진행 ${model.progressPercent}%`)}"><span style="width:${esc(model.progressPercent)}%"></span></div>
              <p>${esc(model.progressNote)}</p>
            </section>
            <section class="work-prep-detail-panel people">
              <span class="work-prep-detail-label">조장 / 참여</span>
              <strong>${esc(model.leaderName)}</strong>
              <p>${esc(model.participantLine)}</p>
            </section>
            <section class="work-prep-detail-panel tools">
              <span class="work-prep-detail-label">공기구 / 준비물</span>
              ${model.toolBadgesHtml || ""}
            </section>
          </div>

          ${model.timelineHtml || ""}

          <div class="work-prep-detail-foot">
            <span>등록 ${esc(model.createdAtLabel)}</span>
            <div class="work-prep-detail-actions">
              <button class="btn-light" data-action="edit-work-prep-record" data-work-prep-record-id="${esc(model.recordId)}" ${model.canEdit ? "" : "disabled"} type="button">수정</button>
              <button class="btn-danger" data-action="delete-work-prep-record" data-work-prep-record-id="${esc(model.recordId)}" ${model.canEdit ? "" : "disabled"} type="button">삭제</button>
            </div>
          </div>
        </div>
      </section>`;
  }

  // 이력: 점검 기록 상세 (읽기 전용 마크업)
  // model: { pageHeadHtml, miniCardHtml, worker, shipNo, dateTime, safetyPledge, signatureImage,
  //          toolNames: [string], sectionsHtml, accent, categoryVisualHtml, categoryLabelHtml,
  //          progressHtml, checkedCount, itemCount, statusBadgeHtml, warningBadgeHtml, completionBadgeHtml }
  function renderInspectionRecordView(model = {}) {
    const toolNames = Array.isArray(model.toolNames) ? model.toolNames : [];
    return `${model.pageHeadHtml || ""}
      <div class="split">
        <div>
          ${model.miniCardHtml || ""}
          <div class="panel panel-pad" style="margin-bottom:12px">
            <div class="form-row">
              <div class="field">
                <label>담당자명</label>
                <input class="input" value="${esc(model.worker)}" readonly />
              </div>
              <div class="field">
                <label>호선 번호</label>
                <input class="input" value="${esc(model.shipNo)}" readonly />
              </div>
              <div class="field">
                <label>점검 일시</label>
                <input class="input" value="${esc(model.dateTime)}" readonly />
              </div>
              <div class="field safety-pledge-field">
                <label>안전다짐</label>
                <textarea class="textarea" readonly>${esc(model.safetyPledge)}</textarea>
              </div>
            </div>
            ${model.signatureImage ? `<div class="signature-history">
              <span>서명 이미지</span>
              <img src="${esc(model.signatureImage)}" alt="서명 이미지" />
            </div>` : ""}
          </div>
          ${toolNames.length ? `<div class="panel panel-pad" style="margin-bottom:12px">
            <div class="section-title">사용 공기구와 준비물</div>
            <div class="tool-history-list">${toolNames.map((name) => `<span class="tool-history-chip">${esc(name)}</span>`).join("")}</div>
          </div>` : ""}
          ${model.sectionsHtml || `<div class="empty">이 기록에는 제출 당시 항목별 체크 내역이 저장되어 있지 않습니다.</div>`}
        </div>
        <aside class="panel panel-pad">
          <div class="section-title">점검 결과</div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
            <span class="work-icon" style="--accent:${esc(model.accent)};margin:0;flex:0 0 auto">${model.categoryVisualHtml || ""}</span>
            <div>
              <div style="font-size:18px;font-weight:900;color:#0f2440">${model.categoryLabelHtml || ""}</div>
              <div class="small muted">${esc(model.shipNo)} · ${esc(model.worker)}</div>
            </div>
          </div>
          ${model.progressHtml || ""}
          <div class="small muted" style="margin-top:8px">${model.checkedCount}/${model.itemCount} 항목 확인됨</div>
          <div class="list" style="margin-top:16px">
            ${model.statusBadgeHtml || ""}
            ${model.warningBadgeHtml || ""}
            ${model.completionBadgeHtml || ""}
          </div>
        </aside>
      </div>`;
  }

  // 이력: 점검 기록의 작업지시서 미니 카드 (읽기 전용 마크업)
  // model: { fallback, recordId, status, title, subtitle, statusLabel, leaderName, progressDone,
  //          progressTotal, toolCount, team }
  function renderInspectionWorkPrepMiniCardView(model = {}) {
    if (model.fallback) {
      return `<div class="inspection-work-prep-mini-card fallback">
          <strong>작업지시서 연결 기록만 남아 있습니다.</strong>
          <span>${esc(model.recordId)}</span>
        </div>`;
    }
    return `<section class="inspection-work-prep-mini-card status-${esc(model.status)}">
        <div class="inspection-work-prep-mini-top">
          <div>
            <strong>${esc(model.title)}</strong>
            <span>${esc(model.subtitle)}</span>
          </div>
          <em>${esc(model.statusLabel)}</em>
        </div>
        <div class="inspection-work-prep-mini-meta">
          <span>조장 ${esc(model.leaderName)}</span>
          <span>점검 ${model.progressDone}/${model.progressTotal}명</span>
          <span>공기구 ${model.toolCount}개</span>
          <span>장소 ${esc(model.placeLabel || "장소 미지정")}</span>
          <span class="work-prep-survey-state ${model.siteSurveyDone ? "is-complete" : "is-pending"}">현장답사 ${model.siteSurveyDone ? "완료" : "미진행"}</span>
          <span>${esc(model.team)}</span>
        </div>
      </section>`;
  }


  // 항목 관리: 공기구/작업 유형 통합 관리 홈 (읽기 전용 마크업)
  // model: { pageHeadHtml, sessionLabel, logoutButtonHtml, toolManagerShellHtml, adminMode, categoryAddOpen, colors, pictogramPickerHtml, categoryToolAssignmentsHtml }
  function renderItemManagerHomeView(model = {}) {
    const colors = Array.isArray(model.colors) ? model.colors : [];
    return `${model.pageHeadHtml}
        <div class="panel panel-pad login-session-panel" style="margin-bottom:14px">
          <div>
            <strong>${esc(model.sessionLabel)}</strong>
            <span>로그인 중</span>
          </div>
          ${model.logoutButtonHtml}
        </div>
        <div class="panel panel-pad" style="margin-bottom:14px">
          ${model.toolManagerShellHtml}
        </div>
        <div class="panel panel-pad category-tool-assignment-panel" style="margin-bottom:14px">
          <div class="section-title">
            작업 유형 관리
            <button class="btn" data-action="toggle-category-add" ${model.adminMode ? "" : "disabled"} type="button">${model.categoryAddOpen ? "추가 닫기" : "+ 작업 유형 추가"}</button>
          </div>
          <p class="section-help">왼쪽 목록에서 작업 유형을 선택한 뒤 기본 정보, 공기구, 섹션과 항목을 탭별로 관리하세요.</p>
          ${model.categoryAddOpen ? `
          <div class="collapsible-panel category-add-panel">
          <div class="form-row">
            <div class="field">
              <label for="catLabel">작업 유형명</label>
              <input class="input" id="catLabel" placeholder="예) 도장 작업" />
            </div>
            <div class="field">
              <label for="catIcon">아이콘/픽토그램</label>
              <input class="input" id="catIcon" value="blockAssembly" placeholder="픽토그램을 선택하세요" />
            </div>
            <div class="field">
              <span class="field-label">색상</span>
              <div class="color-row">${colors.map((color, index) => `<button class="color-dot ${index === 0 ? "active" : ""}" style="--dot:${color}" data-pick-color="${color}" type="button" aria-label="색상 선택"></button>`).join("")}</div>
              <input type="hidden" id="catColor" value="${colors[0]}" />
            </div>
            <button class="btn" data-action="add-category" ${model.adminMode ? "" : "disabled"} type="button">추가</button>
            <button class="btn-light" data-action="cancel-category-add" type="button">취소</button>
          </div>
          ${model.pictogramPickerHtml}
          </div>` : ""}
          ${model.categoryToolAssignmentsHtml}
        </div>`;
  }

  function renderWorkTypeManagerView(model = {}) {
    const categories = Array.isArray(model.categories) ? model.categories : [];
    return `<section class="work-type-manager ${model.mobileDetailOpen ? "is-mobile-detail-open" : ""}">
        <aside class="work-type-master" aria-label="작업 유형 목록">
          <div class="work-type-search-field">
            <label class="sr-only" for="workTypeSearch">작업 유형 검색</label>
            <input class="input" id="workTypeSearch" type="search" value="${esc(model.searchQuery)}" placeholder="작업 유형 검색" data-work-type-search />
            <span data-work-type-search-count>${categories.length}개</span>
          </div>
          <div class="work-type-list" role="listbox" aria-label="작업 유형 선택">
            ${categories.map((category) => `<button class="work-type-list-row ${category.active ? "active" : ""}" data-select-work-type="${esc(category.id)}" data-work-type-search-item data-work-type-search-text="${esc(category.searchText)}" type="button" role="option" aria-selected="${category.active ? "true" : "false"}" style="--accent:${esc(category.accent)}">
                <span class="work-type-list-icon">${category.iconHtml}</span>
                <span class="work-type-list-copy">
                  <strong>${esc(category.label)}</strong>
                  <span>${esc(category.meta)}</span>
                </span>
                <em>${esc(category.countLabel)}</em>
              </button>`).join("")}
            <div class="empty compact-empty" data-work-type-search-empty hidden>검색 결과가 없습니다.</div>
          </div>
        </aside>
        <div class="work-type-detail" aria-live="polite">${model.detailHtml}</div>
      </section>`;
  }

  // 항목 관리: 작업 유형별 섹션/항목 관리 화면 (읽기 전용 마크업)
  // model: { pageHeadHtml, adminMode, sectionsHtml }
  function renderItemManagerCategoryView(model = {}) {
    return `${model.pageHeadHtml}
      <div class="panel panel-pad">
        <div class="section-title">섹션 추가</div>
        <div class="form-row">
          <div class="field">
            <label for="newSectionTitle">섹션명</label>
            <input class="input" id="newSectionTitle" placeholder="예) 작업 전 준비" />
          </div>
          <button class="btn" data-action="add-section" ${model.adminMode ? "" : "disabled"} type="button">섹션 추가</button>
        </div>
      </div>
      <div class="list" style="margin-top:14px">
        ${model.sectionsHtml}
      </div>`;
  }

  // 섹션(위험요인) 표지/빈도/강도 편집 UI
  function renderSectionRiskEditor(model = {}) {
    const sid = model.sectionId;
    const signCode = String(model.signCode || "");
    const validSign = /^[PMSW]-(?:0[1-9]|1[0-2])$/.test(signCode);
    const signGroups = [
      { label: "금지", prefix: "P" },
      { label: "지시", prefix: "M" },
      { label: "안내", prefix: "S" },
      { label: "경고", prefix: "W" },
    ];
    const signOptions = signGroups.map((group) => {
      const opts = [];
      for (let i = 1; i <= 12; i++) {
        const code = `${group.prefix}-${String(i).padStart(2, "0")}`;
        opts.push(`<option value="${code}" ${signCode === code ? "selected" : ""}>${code}</option>`);
      }
      return `<optgroup label="${group.label}">${opts.join("")}</optgroup>`;
    }).join("");
    const scoreOptions = (selected) => {
      let html = `<option value="" ${selected == null ? "selected" : ""}>선택</option>`;
      for (let n = 1; n <= 5; n++) {
        html += `<option value="${n}" ${String(selected) === String(n) ? "selected" : ""}>${n}</option>`;
      }
      return html;
    };
    const freq = Number(model.frequency);
    const sev = Number(model.severity);
    const totalInit = (Number.isInteger(freq) && freq >= 1 && freq <= 5 && Number.isInteger(sev) && sev >= 1 && sev <= 5) ? freq * sev : "-";
    const signPreviewSrc = validSign ? `assets/pictograms/signs/${signCode}.png` : "";
    return `
      <div class="field" style="margin-top:8px">
        <label for="editSectionSign_${sid}">위험 표지</label>
        <select class="select" id="editSectionSign_${sid}" data-section-editor-id="${sid}" data-section-editor-field="signCode" data-section-sign-preview="editSectionSignPreview_${sid}" ${model.saving ? "disabled" : ""}>
          <option value="" ${!validSign ? "selected" : ""}>없음</option>
          ${signOptions}
        </select>
        <div class="section-sign-preview" id="editSectionSignPreview_${sid}" ${validSign ? "" : "hidden"}>
          <img alt="선택한 위험 표지 미리보기" src="${signPreviewSrc}" data-section-sign-image />
          <span>${validSign ? signCode : ""}</span>
        </div>
      </div>
      <div class="grid-2" style="margin-top:8px">
        <div class="field">
          <label for="editSectionFrequency_${sid}">빈도</label>
          <select class="select" id="editSectionFrequency_${sid}" data-section-editor-id="${sid}" data-section-editor-field="frequency" data-section-score-preview="editSectionTotal_${sid}" ${model.saving ? "disabled" : ""}>
            ${scoreOptions(model.frequency)}
          </select>
        </div>
        <div class="field">
          <label for="editSectionSeverity_${sid}">강도</label>
          <select class="select" id="editSectionSeverity_${sid}" data-section-editor-id="${sid}" data-section-editor-field="severity" data-section-score-preview="editSectionTotal_${sid}" ${model.saving ? "disabled" : ""}>
            ${scoreOptions(model.severity)}
          </select>
        </div>
        <div class="field">
          <label>종합 점수</label>
          <output class="small muted" id="editSectionTotal_${sid}">${totalInit}</output>
        </div>
      </div>`;
  }

  // 항목 관리: 섹션 카드 (읽기 전용 마크업)
  // model: { sectionId, sectionTitle, editing, addOpen, adminMode, moreToggleHtml, visibilityOptionsHtml, toolPickerHtml, rows: [{ html, text, requiredLabel, visibilityLabel, badgeHtml }] }
  function renderSectionManagerView(model = {}) {
    const rows = Array.isArray(model.rows) ? model.rows : [];
    return `<section class="section-card">
        <div class="section-card-head">
          ${model.editing ? `
            <div class="field section-card-info">
              <label for="editSectionTitle_${model.sectionId}">섹션명 수정</label>
              <input class="input" id="editSectionTitle_${model.sectionId}" value="${esc(model.sectionTitle)}" data-section-editor-id="${model.sectionId}" data-section-editor-field="title" ${model.saving ? "disabled" : ""} />
              ${renderSectionRiskEditor(model)}
            </div>
            <div class="item-actions manage-actions">
              <button class="btn" data-save-section="${model.sectionId}" ${model.saving || !model.adminMode ? "disabled" : ""} type="button">${model.saving ? "저장 중" : "저장"}</button>
              <button class="btn-light" data-action="cancel-edit-section" ${model.saving ? "disabled" : ""} type="button">취소</button>
            </div>` : `
            <div class="section-card-info">
              <div class="section-card-name" style="font-weight:800" title="${esc(model.sectionTitle)}">${esc(model.sectionTitle)}</div>
              <div class="small muted">${rows.length}개 항목</div>
            </div>
            <div class="item-actions manage-actions">
              <button class="btn-light section-expand-button" data-toggle-manage-section="${model.sectionId}" type="button" aria-expanded="${model.expanded ? "true" : "false"}">${model.expanded ? "접기" : "열기"}</button>
              <button class="btn-light" data-edit-section="${model.sectionId}" ${model.adminMode ? "" : "disabled"} type="button">수정</button>
              <button class="btn-danger" data-delete-section="${model.sectionId}" ${model.adminMode ? "" : "disabled"} type="button">섹션 삭제</button>
            </div>`}
        </div>
        ${model.expanded ? `<div class="section-card-body">
          ${model.moreToggleHtml}
          ${model.addOpen ? `<div class="inline-form item-add-form">
            <div class="field">
              <label for="itemText_${model.sectionId}">점검 항목</label>
              <input class="input" id="itemText_${model.sectionId}" placeholder="점검 내용을 입력하세요" />
            </div>
            <div class="field">
              <label for="itemRisk_${model.sectionId}">위험 등급</label>
              <select class="select" id="itemRisk_${model.sectionId}">
                <option value="high">위험</option>
                <option value="medium" selected>주의</option>
                <option value="low">정상</option>
              </select>
            </div>
            <div class="field">
              <label for="itemRequired_${model.sectionId}">필수 여부</label>
              <select class="select" id="itemRequired_${model.sectionId}">
                <option value="auto">위험만 필수</option>
                <option value="yes">항상 필수</option>
                <option value="no">필수 아님</option>
              </select>
            </div>
            <div class="field">
              <label for="itemVisibility_${model.sectionId}">표시 조건</label>
              <select class="select" id="itemVisibility_${model.sectionId}">
                ${model.visibilityOptionsHtml}
              </select>
            </div>
            ${model.toolPickerHtml}
            <button class="btn" data-add-item="${model.sectionId}" ${model.adminMode ? "" : "disabled"} type="button">항목 추가</button>
          </div>` : ""}
          <div class="list">
            ${rows.map((row) => model.adminMode ? row.html : `<div class="item-row manage-item-row">
              <div class="item-main">
                <div class="item-name" title="${esc(row.text)}">${esc(row.text)}</div>
                <div class="small muted" style="margin-top:5px">${row.requiredLabel}</div>
                <div class="small muted" style="margin-top:5px">${row.visibilityLabel}</div>
              </div>
              ${row.badgeHtml}
            </div>`).join("") || `<div class="empty">아직 항목이 없습니다.</div>`}
          </div>
        </div>` : ""}
      </section>`;
  }

  // 작업지시서: 관리자 상태 변경 셀렉트 (읽기 전용 마크업)
  // model: { status, recordId, ariaLabel, options: [{ value, label, selected }] }
  function renderWorkPrepStatusControlView(model = {}) {
    const options = Array.isArray(model.options) ? model.options : [];
    return `<label class="work-prep-status-control status-${esc(model.status)}">
        <span class="sr-only">작업지시서 상태</span>
        <select class="select work-prep-status-select" data-work-prep-status="${esc(model.recordId)}" aria-label="${esc(model.ariaLabel)}">
          ${options.map((option) => `<option value="${esc(option.value)}" ${option.selected ? "selected" : ""}>${esc(option.label)}</option>`).join("")}
        </select>
      </label>`;
  }

  // 작업지시서: 상태 타임라인 (읽기 전용 마크업)
  // model: { entries: [{ changedAt, changedAtLabel, statusBadgeHtml, actor, memo }] }
  function renderWorkPrepTimelineView(model = {}) {
    const entries = Array.isArray(model.entries) ? model.entries : [];
    if (!entries.length) return "";
    return `<section class="work-prep-detail-panel work-prep-timeline-panel">
        <span class="work-prep-detail-label">상태 타임라인</span>
        <ol class="record-timeline">
          ${entries.map((entry) => `<li>
            <time class="record-timeline-time" datetime="${esc(entry.changedAt)}">${esc(entry.changedAtLabel)}</time>
            <div class="record-timeline-main">
              ${entry.statusBadgeHtml}
              <span class="record-timeline-actor">${esc(entry.actor || "관리자")}</span>
            </div>
            ${entry.memo ? `<div class="record-timeline-note">${esc(entry.memo)}</div>` : ""}
          </li>`).join("")}
        </ol>
      </section>`;
  }

  function renderDataContext(model = {}) {
    const statusLabels = {
      fresh: "최신 데이터",
      stale: "이전 데이터",
      offline: "오프라인",
      "offline-empty": "오프라인 · 저장본 없음",
      loading: "불러오는 중",
      error: "불러오지 못했습니다",
      empty: "표시할 데이터가 없습니다",
      unknown: "상태 확인 필요",
    };
    const status = Object.hasOwn(statusLabels, model.status) ? model.status : "unknown";
    const businessDateLabel = model.businessDateLabel || "기준 날짜";
    const asOfLabel = model.asOfLabel || "최종 반영";
    const statusLabel = model.statusLabel || statusLabels[status];
    const actionsHtml = typeof model.actionsHtml === "string" ? model.actionsHtml : "";
    return `<header class="data-context" data-status="${status}">
      <div class="data-context__main">
        ${model.eyebrow ? `<p class="data-context__eyebrow">${esc(model.eyebrow)}</p>` : ""}
        <h1>${esc(model.title)}</h1>
        ${model.description ? `<p class="data-context__description">${esc(model.description)}</p>` : ""}
      </div>
      <dl class="data-context__meta">
        <div><dt>${esc(businessDateLabel)}</dt><dd>${esc(model.businessDate)}</dd></div>
        <div><dt>${esc(asOfLabel)}</dt><dd>${esc(model.asOf)}</dd></div>
        <div><dt>상태</dt><dd><span class="data-context__status is-${status}" role="status" aria-live="polite">${esc(statusLabel)}</span></dd></div>
      </dl>
      ${actionsHtml ? `<div class="data-context__actions">${actionsHtml}</div>` : ""}
    </header>`;
  }

  function renderDataState(model = {}) {
    const state = ["loading", "error", "empty", "stale", "offline", "offline-empty"].includes(model.state) ? model.state : "ready";
    if (state === "ready") return "";
    const retryButton = (fallbackAction = "") => {
      const action = model.retryAction || fallbackAction;
      return action
        ? `<button class="data-surface-state__retry" data-action="${esc(action)}" type="button">${esc(model.retryLabel || "다시 시도")}</button>`
        : "";
    };
    if (state === "loading") {
      return `<div class="data-surface-state is-loading" role="status" aria-live="polite">
        <p>${esc(model.loadingLabel || "데이터를 불러오는 중입니다.")}</p>
        <div class="data-surface-state__skeleton">
          <span class="data-surface-state__skeleton-row" aria-hidden="true"></span>
          <span class="data-surface-state__skeleton-row" aria-hidden="true"></span>
          <span class="data-surface-state__skeleton-row" aria-hidden="true"></span>
        </div>
      </div>`;
    }
    if (state === "error") {
      return `<div class="data-surface-state is-error" role="alert"><p>${esc(model.errorLabel || "데이터를 불러오지 못했습니다.")}</p>${retryButton("retry-data")}</div>`;
    }
    const labels = {
      empty: model.emptyLabel || "표시할 데이터가 없습니다.",
      stale: model.staleLabel || "이전 데이터를 표시하고 있습니다.",
      offline: model.offlineLabel || "오프라인 상태입니다.",
      "offline-empty": model.offlineEmptyLabel || "오프라인 상태이며 이 기기에 저장된 데이터가 없습니다.",
    };
    return `<div class="data-surface-state is-${state}" role="status" aria-live="polite"><p>${esc(labels[state])}</p>${state === "empty" ? "" : retryButton()}</div>`;
  }

  return {
    renderProcessBoardView,
    renderHistoryPledgeStatusView,
    renderPledgeManagerView,
    renderWorkerRowView,
    renderWorkerManagerView,
    renderUnsafeManagerView,
    renderMaterialManagerView,
    renderPushManagerView,
    renderPushTargetWorkerView,
    renderWorkerPushDeviceRowView,
    renderWorkerPushDeviceManagerView,
    renderPushTemplateEditorView,
    renderWorkPrepCardView,
    renderWorkPrepRegisterView,
    renderWorkPrepManagerView,
    renderWorkPrepAdminRowView,
    renderWorkPrepDetailView,
    renderInspectionRecordView,
    renderInspectionWorkPrepMiniCardView,
    renderItemManagerHomeView,
    renderWorkTypeManagerView,
    renderItemManagerCategoryView,
    renderSectionManagerView,
    renderWorkPrepStatusControlView,
    renderWorkPrepTimelineView,
    renderDataContext,
    renderDataState,
  };
}));
