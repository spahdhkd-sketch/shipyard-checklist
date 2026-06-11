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
  //          kpiHtml, canNotifyPledge, adminMode, editing, rules: [string], weekBars: [{ label, pct }], todayIso }
  function renderPledgeManagerView(model = {}) {
    const rows = Array.isArray(model.rows) ? model.rows : [];
    const rules = Array.isArray(model.rules) ? model.rules : [];
    const weekBars = Array.isArray(model.weekBars) ? model.weekBars : [];
    return `<section class="admin-board pledge-board">
        <div class="admin-board-top">
          <div>
            <h2>안전 서약 관리</h2>
            <p>${esc(model.dateLabel)} · 오늘 서약 현황 실시간</p>
          </div>
          <div class="admin-board-actions">
            <button class="btn-light" data-export-records="pledge" type="button">내보내기</button>
            <button class="btn" data-action="edit-pledge-template" type="button">서약 양식 편집</button>
          </div>
        </div>
        <div class="pledge-kpi-grid">
          ${model.kpiHtml || ""}
        </div>
        <div class="pledge-layout">
          <section class="pledge-table-card">
            <div class="material-table-head">
              <div><strong>오늘 서약 현황</strong><span>${esc(model.dateLabel)} · ${rows.length}명</span></div>
              ${model.canNotifyPledge || model.adminMode ? `<div class="material-table-actions pledge-notify-actions">
                ${model.adminMode ? `<button class="btn-light" data-action="edit-push-template" data-push-template-kind="pledgePending" type="button">푸시 문구 수정</button>` : ""}
                ${model.canNotifyPledge ? `<button class="btn" data-action="notify-pledge-pending" ${model.pendingCount ? "" : "disabled"} title="${model.pendingCount ? "브라우저 알림을 발송합니다" : "미완료자가 없습니다"}" type="button">미완료자 알림 발송</button>` : ""}
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
              </div>`).join("") : `<div class="empty">오늘 표시할 작업자 정보가 없습니다.</div>`}
            </div>
          </section>
          <aside class="pledge-side">
            <section class="pledge-preview-card">
              <div class="material-table-head">
                <div><strong>서약 양식 미리보기</strong></div>
                ${model.editing ? `<div class="material-table-actions"><button class="btn-light" data-action="cancel-pledge-template" type="button">취소</button><button class="btn" data-action="save-pledge-template" type="button">저장</button></div>` : `<button class="btn-light" data-action="edit-pledge-template" type="button">편집</button>`}
              </div>
              ${model.editing ? `<div class="pledge-editor">
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
        </div>
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
        <div class="section-title">작업자 목록 <span class="small muted">${Number(model.count) || 0}명</span></div>
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
          <button class="btn" data-action="add-worker" type="button">추가</button>
        </div>
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
          <p class="push-device-description">수신을 켠 기기에만 서약 미완료와 불안전요소 브라우저 알림이 발송됩니다.</p>
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
  };
}));
