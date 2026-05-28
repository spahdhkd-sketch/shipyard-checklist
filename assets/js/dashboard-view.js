(function attachDashboardView(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardDashboardView = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildDashboardView() {
  function esc(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    }[char]));
  }

  function defaultSectionHeading(id, label) {
    return `<h2 class="sr-only" id="${esc(id)}">${esc(label)}</h2>`;
  }

  function defaultNavIcon(name) {
    return `<span aria-hidden="true">${esc(name)}</span>`;
  }

  function statIcon(name, deps = {}) {
    const navIcon = typeof deps.navIcon === "function" ? deps.navIcon : defaultNavIcon;
    const icons = {
      shield: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"></path><path d="M9 12l2 2 4-5"></path></svg>`,
      warning: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 18H2z"></path><path d="M12 9v5"></path><path d="M12 17h.01"></path></svg>`,
      clock: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6l4 2"></path></svg>`,
      board: navIcon("board"),
    };
    return icons[name] || icons.board;
  }

  function statPill(label, value, unit, color, icon = "board", foot = "", scope = "all", deps = {}) {
    const attrs = scope === "unsafe"
      ? `data-stat-scope="unsafe" data-action="view-unsafe-received"`
      : scope === "materials"
        ? `data-stat-scope="materials" data-action="view-material-list"`
        : `data-stat-scope="${esc(scope)}" data-history-scope="${esc(scope)}"`;
    const alertClass = scope === "unsafe" && Number(value) > 0 ? " is-alert" : "";
    const focusClass = ["today", "unsafe"].includes(scope) ? " is-focus" : "";
    return `<button class="stat-pill${focusClass}${alertClass}" style="--stat:${color}" ${attrs} type="button">
        <span class="stat-icon">${statIcon(icon, deps)}</span>
        <div class="stat-label small muted">${esc(label)}</div>
        <div class="stat-value" style="color:${color}">${esc(value)}<span class="stat-unit">${esc(unit)}</span></div>
        <div class="stat-foot ${foot ? "" : "is-empty"}">${foot ? esc(foot) : "&nbsp;"}</div>
      </button>`;
  }

  function renderDashboardView(model = {}, deps = {}) {
    const sectionHeading = typeof deps.sectionHeading === "function" ? deps.sectionHeading : defaultSectionHeading;
    const navIcon = typeof deps.navIcon === "function" ? deps.navIcon : defaultNavIcon;
    const {
      todayCount = 0,
      todayDone = 0,
      todayPending = 0,
      todayCompletion = 0,
      unsafeCount = 0,
      deliverySoon = 0,
      openMaterials = 0,
      activeShips = 0,
      processStages = [],
    } = model;

    return `<h1 class="sr-only">조선소 안전 체크리스트</h1>
      <section class="ops-hero" aria-labelledby="dashboardQuickHeading">
        ${sectionHeading("dashboardQuickHeading", "현장 빠른 실행")}
        <div class="ops-hero-main">
          <div class="ops-quick-actions" aria-label="현장 빠른 실행">
            <button class="ops-quick-action primary" data-view="check" type="button">
              <span>${navIcon("noteCheck")}</span>
              <strong>작업 전 점검 시작</strong>
            </button>
            <button class="ops-quick-action danger" data-view="unsafe" type="button">
              <span>${navIcon("warning")}</span>
              <strong>불안전요소 등록</strong>
            </button>
            <button class="ops-quick-action violet" data-view="materials" type="button">
              <span>${navIcon("board")}</span>
              <strong>자재누락 등록</strong>
            </button>
          </div>
        </div>
        <div class="ops-today-panel">
          <div class="ops-today-head">
            <span>오늘 점검</span>
            <strong>${todayDone}/${todayCount || 0}</strong>
          </div>
          <div class="ops-progress" role="progressbar" aria-label="오늘 점검 완료율" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${todayCompletion}">
            <span style="width:${todayCompletion}%"></span>
          </div>
          <div class="ops-today-grid">
            <div><span>대기</span><strong>${todayPending}</strong></div>
            <div><span>호선</span><strong>${activeShips}</strong></div>
            <div><span>완료율</span><strong>${todayCompletion}%</strong></div>
          </div>
        </div>
      </section>
      <section class="ops-status-grid" aria-labelledby="dashboardStatusHeading">
        ${sectionHeading("dashboardStatusHeading", "오늘 현장 상태")}
        ${statPill("오늘 점검", todayCount, "건", "#0f766e", "shield", "", "today", { navIcon })}
        ${statPill("불안전요소", unsafeCount, "건", "#dc2626", "warning", unsafeCount ? "즉시 확인" : "", "unsafe", { navIcon })}
        ${statPill("누락 자재", openMaterials, "건", "#7c3aed", "board", "", "materials", { navIcon })}
        ${statPill("인도 예정", deliverySoon, "척", "#f97316", "clock", deliverySoon ? "7일 이내" : "", "delivery", { navIcon })}
      </section>
      <section class="ops-grid" aria-labelledby="dashboardProcessHeading">
        ${sectionHeading("dashboardProcessHeading", "공정 현황")}
        <div class="panel panel-pad home-section ops-process-card ops-process-card-wide">
          <div class="section-title">공정 현황 <button class="btn-light" data-view="ships" type="button">보기</button></div>
          <div class="mini-process">
            ${processStages.map(({ info = {}, count = 0 }) => `<div class="mini-stage" style="--dot:${esc(info.color)}">
              <span class="mini-stage-dot"></span>
              <div class="mini-stage-count">${count}</div>
              <div class="small muted">${esc(info.label)}</div>
            </div>`).join("")}
          </div>
        </div>
      </section>`;
  }

  function defaultAnalyticsKpi(label, value, note, tone = "") {
    return `<div class="analytics-kpi ${esc(tone)}">
        <span>${esc(label)}</span>
        <strong>${esc(value)}</strong>
        <small>${esc(note)}</small>
      </div>`;
  }

  function renderAnalyticsDashboardView(model = {}, deps = {}) {
    const analyticsKpi = typeof deps.analyticsKpi === "function" ? deps.analyticsKpi : defaultAnalyticsKpi;
    const monthlyWorkerAnalyticsHtml = typeof deps.monthlyWorkerAnalyticsHtml === "string" ? deps.monthlyWorkerAnalyticsHtml : "";
    const relativeRecordTime = typeof deps.relativeRecordTime === "function" ? deps.relativeRecordTime : (value) => value || "";
    const shortUnsafeTitle = typeof deps.shortUnsafeTitle === "function" ? deps.shortUnsafeTitle : (value) => value || "";
    const statusChip = typeof deps.statusChip === "function" ? deps.statusChip : (value) => `<span>${esc(value || "-")}</span>`;
    const {
      dateLabel = "",
      syncText = "",
      todayDone = 0,
      todayDeltaText = "",
      unsafeOpen = 0,
      unsafeSummary = "",
      materialOpen = 0,
      materialSummary = "",
      shipCount = 0,
      processStageCount = 0,
      processSummary = "",
      processRows = [],
      risk = {},
      weeklyAverage = "0.0",
      recent = [],
    } = model;
    const riskNg = risk.ng || { count: 0, percent: 0 };
    const riskWarn = risk.warn || { count: 0, percent: 0 };
    const riskOk = risk.ok || { count: 0, percent: 0 };

    return `<section class="admin-board analytics-board">
        <div class="admin-board-top">
          <div>
            <h2>안전 관리 대시보드</h2>
            <p>${esc(dateLabel)} · ${esc(syncText)}</p>
          </div>
          <div class="admin-board-actions">
            <button class="btn-light" data-export-records="analytics" type="button">데이터 내보내기</button>
            <button class="btn" data-view="check" type="button">새 점검</button>
          </div>
        </div>
        <div class="analytics-kpi-grid">
          ${analyticsKpi("오늘 점검 완료", todayDone, todayDeltaText, "done")}
          ${analyticsKpi("불안전요소 · 미확인", unsafeOpen, unsafeSummary, "danger")}
          ${analyticsKpi("자재 누락", materialOpen, materialSummary, "warn")}
          ${analyticsKpi("호선 점검중", shipCount, processSummary, "ship")}
        </div>
        ${monthlyWorkerAnalyticsHtml}
        <div class="analytics-grid">
          <section class="analytics-panel">
            <div class="material-table-head">
              <div><strong>호선 공정 현황</strong><span>전체 ${shipCount}척 · ${processStageCount}단계 진행률</span></div>
              <button class="btn-light" data-view="ships" type="button">자세히 →</button>
            </div>
            <div class="analytics-process-list">
              ${processRows.map(({ info = {}, count = 0, percent = 0 }) => `<div class="analytics-process-row" style="--stage:${info.color || ""}">
                <span><i></i><strong>${esc(info.label)}</strong><em>${esc(info.stage === "mounting" ? "Mounting" : info.label)}</em></span>
                <b>${count}척</b>
                <div class="analytics-progress" role="progressbar" aria-label="${esc(info.label)} 공정 비율" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><i style="width:${percent}%"></i></div>
                <strong>${percent}%</strong>
              </div>`).join("")}
            </div>
          </section>
          <section class="analytics-panel">
            <div class="material-table-head">
              <div><strong>위험도 분포</strong><span>최근 7일 점검 결과</span></div>
            </div>
            <div class="risk-bars">
              <div class="risk-row danger"><span>위험 · NG</span><i><b style="width:${riskNg.percent}%"></b></i><strong>${riskNg.count}건 · ${riskNg.percent}%</strong></div>
              <div class="risk-row warn"><span>주의 · Warn</span><i><b style="width:${riskWarn.percent}%"></b></i><strong>${riskWarn.count}건 · ${riskWarn.percent}%</strong></div>
              <div class="risk-row ok"><span>정상 · OK</span><i><b style="width:${riskOk.percent}%"></b></i><strong>${riskOk.count}건 · ${riskOk.percent}%</strong></div>
            </div>
            <div class="risk-summary">
              <div><span>주간 평균</span><strong>${esc(weeklyAverage)}건/일</strong></div>
              <div><span>NG 비율</span><strong>${riskNg.percent}%</strong></div>
              <div><span>완료율</span><strong>${riskOk.percent}%</strong></div>
            </div>
          </section>
        </div>
        <section class="analytics-recent-card">
          <div class="material-table-head">
            <div><strong>최근 활동 · 불안전요소 등록 & 자재누락</strong><span>행을 선택하면 상세 화면으로 이동합니다</span></div>
            <div class="material-table-actions"><button class="btn-light" data-action="open-analytics-filters" type="button">필터</button><button class="btn" data-action="open-analytics-detail" type="button">상세 보기</button></div>
          </div>
          <div class="analytics-table">
            <div class="analytics-row analytics-row-head"><span>시각</span><span>호선</span><span>내용</span><span>작업자</span><span>상태</span></div>
            ${recent.length ? recent.map((row) => `<div class="analytics-row" data-analytics-record-kind="${esc(row.kind)}" data-analytics-record-id="${esc(row.id)}" role="button" tabindex="0" aria-label="${esc(row.shipNo || "-")} ${esc(row.type)} 상세 보기">
              <span>${esc(relativeRecordTime(row.time))}</span>
              <span><strong>${esc(row.shipNo || "-")}</strong></span>
              <span><strong>${esc(shortUnsafeTitle(row.content))}</strong><em>${esc(row.type)}</em></span>
              <span>${esc(row.worker || "-")}</span>
              <span>${statusChip(row.status)}</span>
            </div>`).join("") : `<div class="empty">최근 활동이 없습니다.</div>`}
          </div>
        </section>
      </section>`;
  }

  function monthlyStatusLabel(status) {
    return {
      done: "완료",
      partial: "미완료",
      missing: "누락",
      rest: "휴무",
      excluded: "제외",
    }[status] || status;
  }

  function renderWorkerHeatmapCell(status, day = "") {
    const label = day ? `${day}일 ${monthlyStatusLabel(status)}` : monthlyStatusLabel(status);
    return `<span class="monthly-worker-cell ${esc(status)}" title="${esc(label)}" aria-label="${esc(monthlyStatusLabel(status))}">${esc(day)}</span>`;
  }

  function renderMonthlyWorkerCalendar(worker = {}, range = {}) {
    const statuses = new Map((worker.dayStatuses || []).map((day) => [day.date, day]));
    const firstWeekday = (new Date(`${range.start}T00:00:00`).getDay() + 6) % 7;
    const days = [
      ...Array.from({ length: firstWeekday }, () => null),
      ...(range.dates || []),
    ];
    while (days.length % 7 !== 0) days.push(null);
    const weekdays = ["월", "화", "수", "목", "금", "토", "일"];
    return `<div class="monthly-worker-calendar" aria-label="${esc(worker.name)} ${esc(range.monthKey)} 점검 달력">
        <div class="monthly-worker-weekdays">${weekdays.map((day) => `<span>${day}</span>`).join("")}</div>
        <div class="monthly-worker-calendar-grid">
          ${days.map((date) => {
            if (!date) return `<span class="monthly-worker-calendar-cell blank" aria-hidden="true"></span>`;
            const day = statuses.get(date) || { day: Number(date.slice(8, 10)), status: "excluded" };
            const label = `${day.day}일 ${monthlyStatusLabel(day.status)}`;
            return `<span class="monthly-worker-calendar-cell ${esc(day.status)}" title="${esc(label)}" aria-label="${esc(label)}">${esc(day.day)}</span>`;
          }).join("")}
        </div>
      </div>`;
  }

  function renderMonthlyWorkerCard(worker = {}, range = {}) {
    const expanded = Boolean(worker.expanded);
    return `<article class="monthly-worker-card-item ${expanded ? "is-expanded" : ""}">
        <button class="monthly-worker-card" data-monthly-worker-toggle="${esc(worker.key || worker.name || "")}" aria-expanded="${expanded ? "true" : "false"}" type="button">
          <span class="monthly-worker-card-main">
            <span class="monthly-worker-card-person">
              <strong>${esc(worker.name)}</strong>
              <em>${esc(worker.team || "-")}</em>
            </span>
            <span class="monthly-worker-card-rate ${worker.rate >= 80 ? "good" : worker.rate >= 50 ? "warn" : "danger"}">${esc(worker.rate || 0)}%</span>
          </span>
          <span class="monthly-worker-card-summary">
            <span>완료 ${esc(worker.counts?.done || 0)}</span>
            <span>미완료 ${esc((worker.counts?.partial || 0) + (worker.counts?.missing || 0))}</span>
            <span>대상 ${esc(worker.counts?.target || 0)}</span>
          </span>
        </button>
        ${expanded ? renderMonthlyWorkerCalendar(worker, range) : ""}
      </article>`;
  }

  function renderMonthlyWorkerCardColumns(workers = [], range = {}) {
    const columns = [[], [], []];
    workers.forEach((worker, index) => {
      columns[index % columns.length].push(renderMonthlyWorkerCard(worker, range));
    });
    return columns.map((cards) => `<div class="monthly-worker-card-column">${cards.join("")}</div>`).join("");
  }

  function renderMonthlyWorkerMonthMeta(monthText, monthHighlight = false) {
    return `<span class="monthly-worker-month-meta"><b class="monthly-worker-month-label ${monthHighlight ? "is-highlight" : ""}">${esc(monthText)}</b><em>작업자별 일일 점검 이행 현황</em></span>`;
  }

  function renderMonthlyRestDaySettingsView(restPanel = {}) {
    const holidayRows = restPanel.holidayRows || [];
    const customRows = restPanel.customRows || [];
    return `<div class="monthly-rest-panel">
        <div class="monthly-rest-options">
          <label class="monthly-rest-toggle">
            <input type="checkbox" data-monthly-public-holiday-mode ${restPanel.useKoreanPublicHolidays ? "checked" : ""} />
            <span>대한민국 국경일/공휴일/대체공휴일 자동 휴무 적용</span>
          </label>
          <div class="monthly-rest-add">
            <input class="input" type="date" data-monthly-custom-rest-date min="${esc(restPanel.start)}" max="${esc(restPanel.end)}" value="${esc(restPanel.start)}" />
            <button class="btn-light" data-action="add-monthly-rest-day" type="button">현장 휴무 추가</button>
          </div>
        </div>
        <div class="monthly-rest-lists">
          <div>
            <strong>자동 휴무</strong>
            ${holidayRows.length ? holidayRows.map((day) => `<span class="monthly-rest-chip">${esc(day.date.slice(5))} · ${esc(day.name)}</span>`).join("") : `<em>선택 월의 자동 휴무가 없습니다.</em>`}
          </div>
          <div>
            <strong>현장 추가 휴무</strong>
            ${customRows.length ? customRows.map((date) => `<span class="monthly-rest-chip custom">${esc(date.slice(5))}<button data-delete-monthly-rest-day="${esc(date)}" type="button" aria-label="${esc(date)} 휴무 삭제">×</button></span>`).join("") : `<em>추가된 현장 휴무가 없습니다.</em>`}
          </div>
        </div>
      </div>`;
  }

  function renderMonthlyWorkerAnalyticsView(model = {}, deps = {}) {
    const analyticsKpi = typeof deps.analyticsKpi === "function" ? deps.analyticsKpi : defaultAnalyticsKpi;
    const {
      monthText = "",
      monthHighlight = false,
      restOpen = false,
      range = {},
      workers = [],
      rate = 0,
      totals = {},
      dueLabel = "누락 작업자",
      dueMissing = 0,
      restPanel = {},
    } = model;
    const meta = renderMonthlyWorkerMonthMeta(monthText, monthHighlight);
    const toolbar = `<div class="monthly-worker-toolbar">
              <button class="btn-light" data-monthly-worker-month="prev" type="button">이전 달</button>
              <button class="btn-light" data-monthly-worker-month="current" type="button">이번 달</button>
              <button class="btn-light" data-monthly-worker-month="next" ${range.canGoNext ? "" : "disabled"} type="button">다음 달</button>
              <button class="btn-light" data-action="toggle-monthly-rest-settings" type="button">${restOpen ? "휴무 설정 닫기" : "휴무 설정"}</button>
              <button class="btn" data-export-records="monthly-worker-analytics" type="button">월간 내보내기</button>
            </div>`;
    if (!workers.length) {
      return `<section class="analytics-panel monthly-worker-analytics">
          <div class="monthly-worker-head">
            <div><strong>월간 작업자 점검 현황</strong>${meta}</div>
            ${toolbar}
          </div>
          <div class="empty">등록된 작업자가 없습니다. 관리 메뉴에서 작업자를 먼저 추가하세요.</div>
          ${restOpen ? renderMonthlyRestDaySettingsView(restPanel) : ""}
        </section>`;
    }
    return `<section class="analytics-panel monthly-worker-analytics">
        <div class="monthly-worker-head">
          <div><strong>월간 작업자 점검 현황</strong>${meta}</div>
          ${toolbar}
        </div>
        <div class="monthly-worker-kpis">
          ${analyticsKpi("월간 점검률", `${rate}%`, `${totals.done || 0}/${totals.target || 0} 대상일 완료`, "done")}
          ${analyticsKpi(dueLabel, `${dueMissing}명`, `${range.isCurrentMonth ? "오늘" : "월말"} 기준 누락`, "danger")}
          ${analyticsKpi("대상 작업자", `${workers.length}명`, `휴무 ${totals.rest || 0}칸 제외`, "ship")}
        </div>
        <div class="monthly-worker-layout">
          <div class="monthly-worker-card-list">
            ${renderMonthlyWorkerCardColumns(workers, range)}
            <div class="monthly-worker-legend">
              ${["done", "partial", "missing", "rest", "excluded"].map((status) => `<span>${renderWorkerHeatmapCell(status)} ${monthlyStatusLabel(status)}</span>`).join("")}
            </div>
          </div>
        </div>
        ${restOpen ? renderMonthlyRestDaySettingsView(restPanel) : ""}
      </section>`;
  }

  function renderManageShellView(model = {}) {
    const {
      pageHeadHtml = "",
      readOnlyNoticeHtml = "",
      tabs = [],
      panels = {},
      activeTab = "",
    } = model;
    return `${pageHeadHtml}
      ${readOnlyNoticeHtml}
      <div class="manage-tabs" role="tablist" aria-label="관리 탭">
        ${tabs.map(({ id, label, count, active }) => `<button class="seg-btn ${active ? "active" : ""}" data-manage-tab="${esc(id)}" type="button">${esc(label)} <span>${esc(count || 0)}</span></button>`).join("")}
      </div>
      <div class="manage-workspace">
        ${activeTab === "workers" ? panels.workers || "" : ""}
        ${activeTab === "push" ? panels.push || "" : ""}
        ${activeTab === "unsafe" ? panels.unsafe || "" : ""}
        ${activeTab === "materials" ? panels.materials || "" : ""}
      </div>`;
  }

  function renderUnsafeRecordCardView(model = {}) {
    const {
      id = "",
      shipNo = "",
      content = "",
      workerName = "",
      createdAtText = "",
      photoCount = 0,
      pendingPhotoCount = 0,
      uploading = false,
      adminMemo = "",
      timelineHtml = "",
      adminControlsHtml = "",
    } = model;
    return `<article class="record-card clickable-record" data-unsafe-record-detail="${esc(id)}" tabindex="0" role="button" aria-label="${esc(shipNo)} 불안전요소 상세 보기">
        <div class="record-card-main">
          <div class="record-card-headline">
            <div>
              <strong>${esc(shipNo)}</strong>
              <span class="small muted">${esc(workerName)} · ${esc(createdAtText)}</span>
              ${photoCount > 1 ? `<span class="small muted">사진 ${esc(photoCount)}장</span>` : ""}
              ${uploading ? `<span class="small muted">사진 업로드 중</span>` : ""}
              ${pendingPhotoCount ? `<span class="small muted">사진 업로드 대기 ${esc(pendingPhotoCount)}장</span>` : ""}
            </div>
          </div>
          <p>${esc(content)}</p>
          ${adminMemo ? `<div class="small muted">메모: ${esc(adminMemo)}</div>` : ""}
          ${timelineHtml}
        </div>
        ${adminControlsHtml}
      </article>`;
  }

  function renderUnsafeDetailPhotoBlock(model = {}) {
    const photos = model.photos || [];
    if (photos.length) {
      return `<div class="unsafe-detail-photos">${photos.map((photo, index) => {
        if (!photo.url) return "";
        return `<figure><img class="unsafe-detail-photo" src="${esc(photo.url)}" alt="불안전요소 사진 ${index + 1}" /><figcaption>사진 ${index + 1}</figcaption></figure>`;
      }).join("")}</div>`;
    }
    if (model.uploadingHtml) return model.uploadingHtml;
    if (model.pendingPhotoHtml) return model.pendingPhotoHtml;
    return `<div class="empty">첨부된 사진이 없습니다.</div>`;
  }

  function renderUnsafeDetailView(model = {}) {
    const {
      statusBadgeHtml = "",
      shipNo = "",
      workerName = "",
      createdAtText = "",
      photoCount = 0,
      content = "",
      adminMemo = "",
      pendingPhotoHtml = "",
      timelineHtml = "",
      adminControlsHtml = "",
    } = model;
    return `<section class="panel panel-pad unsafe-detail">
        <div class="detail-header">
          <button class="btn-light" data-action="back-unsafe-list" type="button">목록</button>
          ${statusBadgeHtml}
        </div>
        <div class="section-title">불안전요소 상세 기록</div>
        <div class="detail-grid unsafe-detail-meta-grid">
          <div><span class="small muted">호선</span><strong>${esc(shipNo)}</strong></div>
          <div><span class="small muted">등록자</span><strong>${esc(workerName || "-")}</strong></div>
          <div class="unsafe-detail-date-meta"><span class="small muted">등록일시</span><strong>${esc(createdAtText)}</strong></div>
          <div class="unsafe-detail-photo-meta" aria-hidden="true"><span class="small muted">사진</span><strong>${photoCount ? `${esc(photoCount)}장` : "없음"}</strong></div>
        </div>
        <div class="field" style="margin-top:12px">
          <span class="field-label">내용</span>
          <div class="readonly-box">${esc(content)}</div>
        </div>
        <div class="field" style="margin-top:12px">
          <span class="field-label">첨부 사진</span>
          ${renderUnsafeDetailPhotoBlock(model)}
          ${photoCount ? pendingPhotoHtml : ""}
        </div>
        ${adminMemo ? `<div class="field" style="margin-top:12px"><span class="field-label">현재 조치/메모</span><div class="readonly-box">${esc(adminMemo)}</div></div>` : ""}
        <div class="field" style="margin-top:12px">
          <span class="field-label">처리 이력</span>
          ${timelineHtml}
        </div>
        ${adminControlsHtml}
      </section>`;
  }

  function renderMaterialRecordCardView(model = {}) {
    const {
      shipNo = "",
      materialName = "",
      workerName = "",
      createdAtText = "",
      content = "",
      adminMemo = "",
      timelineHtml = "",
      adminControlsHtml = "",
    } = model;
    return `<article class="record-card">
        <div class="record-card-main">
          <strong>${esc(shipNo)} · ${esc(materialName)}</strong>
          <span class="small muted">${esc(workerName)} · ${esc(createdAtText)}</span>
          <p>${esc(content)}</p>
          ${adminMemo ? `<div class="small muted">메모: ${esc(adminMemo)}</div>` : ""}
          ${timelineHtml}
        </div>
        ${adminControlsHtml}
      </article>`;
  }

  function renderHistoryLoadMoreView(model = {}) {
    if (!model.visible) return "";
    return `<div class="list-actions" style="margin-top:12px"><button class="btn-light" data-action="load-more-history" type="button">더 보기</button></div>`;
  }

  function renderHistoryTableView(model = {}) {
    const rows = model.rows || [];
    return `<div class="history-grid">
        ${rows.map((row) => `<article class="history-card" style="--accent:${esc(row.accent)}" data-history-detail-card="${esc(row.id)}" role="button" tabindex="0" aria-label="${esc(row.ariaLabel)}">
            <div class="history-card-main">
              <div class="history-card-top">
                <span class="history-card-icon">${row.categoryVisualHtml || ""}</span>
                <div class="history-card-actions">
                  ${row.canSelect ? `<input class="history-card-check" type="checkbox" aria-label="이력 선택" data-history-check="${esc(row.id)}" ${row.selected ? "checked" : ""}>` : ""}
                  <button class="history-detail-btn" data-history-detail="${esc(row.id)}" aria-label="점검 기록 화면 보기" title="점검 기록" type="button">›</button>
                </div>
              </div>
              <div class="history-card-title">${row.categoryLabelHtml || ""}</div>
              <div class="history-card-summary">${esc(row.summary)}</div>
              <div class="history-card-risk">
                <span class="history-completion-pill">완료율 ${esc(row.completion)}%</span>
                ${row.riskBadgeHtml || ""}
              </div>
              <div class="history-progress-track" role="progressbar" aria-label="점검 완료율" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${esc(row.completion)}"><span style="width:${esc(row.completion)}%"></span></div>
            </div>
          </article>`).join("")}
      </div>`;
  }

  return {
    renderAnalyticsDashboardView,
    renderDashboardView,
    renderHistoryLoadMoreView,
    renderHistoryTableView,
    renderManageShellView,
    renderMaterialRecordCardView,
    renderMonthlyWorkerAnalyticsView,
    renderUnsafeDetailView,
    renderUnsafeRecordCardView,
    statIcon,
    statPill,
  };
}));
