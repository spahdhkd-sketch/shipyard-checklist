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

  return {
    renderProcessBoardView,
    renderHistoryPledgeStatusView,
    renderPledgeManagerView,
  };
}));
