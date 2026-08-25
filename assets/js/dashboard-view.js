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
    const navIcon = typeof deps.navIcon === "function" ? deps.navIcon : defaultNavIcon;
    const {
      todayCount = 0,
      todayPending = 0,
      unsafeCount = 0,
      openMaterials = 0,
      todayWorkCount = 0,
      todayWorkProgress = 0,
      appVersionLabel = "",
      syncStatus = "offline",
      syncLabel = "오프라인 · 로컬 저장",
      syncDetail = "연결되면 자동으로 동기화합니다",
    } = model;

    const myCheck = model.myCheck || null;
    const checkPending = myCheck ? Number(myCheck.pending || 0) : Number(todayPending || 0);
    const checkAction = myCheck?.status === "done"
      ? { label: "이력 보기", view: "history", disabled: false }
      : { label: "점검 시작", view: "check", disabled: myCheck?.status === "locked" };
    const checkDetail = myCheck?.status === "locked"
      ? myCheck.lockMessage
      : myCheck?.status === "done"
        ? `${Number(myCheck.total || 0)}건 제출 완료`
        : myCheck?.nextLabel
          ? `다음 점검 · ${myCheck.nextLabel}`
          : todayCount
            ? "오늘 현장 전체 기준"
            : "등록된 오늘 점검이 없습니다";
    const syncTone = ["online", "loading", "offline", "error"].includes(syncStatus) ? syncStatus : "offline";

    return `<main class="home-v4" aria-labelledby="homeV4Title">
      <header class="home-v4__heading">
        <div>
          <h1 id="homeV4Title">오늘의 안전 운영</h1>
          <p>한 화면에는 오늘 해야 할 일만</p>
        </div>
        ${appVersionLabel ? `<span class="home-v4__version">${esc(appVersionLabel)}</span>` : ""}
      </header>

      <div class="home-v4__sync is-${esc(syncTone)}" data-home-sync="${esc(syncTone)}" role="status" aria-live="polite">
        <span class="home-v4__sync-dot" aria-hidden="true"></span>
        <strong>${esc(syncLabel)}</strong>
        <span>${esc(syncDetail)}</span>
      </div>

      <section class="home-v4__grid" aria-label="오늘의 안전 업무">
        <article class="home-v4__card">
          <div class="home-v4__card-top">
            <span class="home-v4__icon is-teal">${navIcon("noteCheck")}</span>
          </div>
          <h2>지금 해야 할 일</h2>
          <p class="home-v4__metric">미점검 <strong>${esc(checkPending)}</strong>건</p>
          <small>${esc(checkDetail)}</small>
          <button class="home-v4__action is-teal" data-view="${checkAction.view}" type="button" ${checkAction.disabled ? `disabled title="${esc(myCheck?.lockMessage || "점검을 시작할 수 없습니다")}"` : ""}>${navIcon("noteCheck")}<span>${checkAction.label}</span></button>
        </article>

        <article class="home-v4__card">
          <div class="home-v4__card-top">
            <span class="home-v4__icon is-orange">${navIcon("warning")}</span>
          </div>
          <h2>즉시 확인</h2>
          <div class="home-v4__dual-metric">
            <span>불안전요소 <strong>${esc(unsafeCount)}</strong>건</span>
            <span>자재누락 <strong>${esc(openMaterials)}</strong>건</span>
          </div>
          <button class="home-v4__action is-orange" data-view="manage" type="button">${navIcon("warning")}<span>접수 처리</span></button>
        </article>

        <article class="home-v4__card">
          <div class="home-v4__card-top">
            <span class="home-v4__icon is-navy">${navIcon("ship")}</span>
          </div>
          <h2>오늘 작업</h2>
          <div class="home-v4__work-metric">
            <span>작업지시 <strong>${esc(todayWorkCount)}</strong>건</span>
            <i aria-hidden="true"></i>
            <span>진행 <strong>${esc(todayWorkProgress)}</strong>건</span>
          </div>
          <button class="home-v4__action is-navy" data-view="manage" data-manage-center-card="operations" type="button">${navIcon("ship")}<span>작업지시 보기</span></button>
        </article>

        <article class="home-v4__card">
          <div class="home-v4__card-top">
            <span class="home-v4__icon is-teal-soft">${navIcon("board")}</span>
          </div>
          <h2>현장 신고</h2>
          <div class="home-v4__report-actions">
            <button data-view="unsafe" type="button">${navIcon("warning")}<span>불안전요소 등록</span></button>
            <button data-view="materials" type="button">${navIcon("board")}<span>자재누락 등록</span></button>
          </div>
        </article>
      </section>

      <button class="home-v4__management" data-view="items" type="button">
        <span>${navIcon("settings")}<strong>관리 설정은 현장 실행과 분리</strong></span>
        <span aria-hidden="true">›</span>
      </button>
    </main>`;
  }

  function defaultAnalyticsKpi(label, value, note, tone = "") {
    return `<div class="analytics-kpi ${esc(tone)}">
        <span>${esc(label)}</span>
        <strong>${esc(value)}</strong>
        <small>${esc(note)}</small>
      </div>`;
  }

  function defaultAnalyticsDataState(model = {}) {
    const dataState = model.state;
    const messages = {
      loading: model.loadingLabel || "분석 데이터를 불러오는 중입니다.",
      error: model.errorLabel || "분석 데이터를 불러오지 못했습니다. 연결 상태를 확인한 뒤 다시 시도해주세요.",
      empty: model.emptyLabel || "표시할 분석 데이터가 없습니다.",
      stale: model.staleLabel || "최신 데이터를 확인하지 못해 마지막으로 저장된 내용을 표시합니다.",
      offline: model.offlineLabel || "오프라인 상태입니다. 마지막으로 저장된 내용을 읽기 전용으로 표시합니다.",
    };
    const message = messages[dataState];
    const retryButton = dataState !== "loading" && dataState !== "empty" && model.retryAction
      ? `<button class="btn-light" data-action="${esc(model.retryAction)}" type="button">${esc(model.retryLabel || "다시 시도")}</button>`
      : "";
    return message
      ? `<div class="analytics-data-state" data-analytics-data-state="${esc(dataState)}" role="status" aria-live="polite">${esc(message)}${retryButton}</div>`
      : "";
  }

  function renderAnalyticsDashboardView(model = {}, deps = {}) {
    const analyticsKpi = typeof deps.analyticsKpi === "function" ? deps.analyticsKpi : defaultAnalyticsKpi;
    const renderDataContext = typeof deps.renderDataContext === "function" ? deps.renderDataContext : () => "";
    const renderDataState = typeof deps.renderDataState === "function" ? deps.renderDataState : defaultAnalyticsDataState;
    const monthlyWorkerAnalyticsHtml = typeof deps.monthlyWorkerAnalyticsHtml === "string" ? deps.monthlyWorkerAnalyticsHtml : "";
    const relativeRecordTime = typeof deps.relativeRecordTime === "function" ? deps.relativeRecordTime : (value) => value || "";
    const shortUnsafeTitle = typeof deps.shortUnsafeTitle === "function" ? deps.shortUnsafeTitle : (value) => value || "";
    const statusChip = typeof deps.statusChip === "function" ? deps.statusChip : (value) => `<span>${esc(value || "-")}</span>`;
    const {
      dateLabel = "",
      syncText = "",
      todayDone = 0,
      todayPending,
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
      dataState = "ready",
      actionsDisabled = false,
    } = model;
    const dataContextHtml = renderDataContext(model.context);
    const dataStateHtml = renderDataState({
      state: dataState,
      loadingLabel: "분석 데이터를 불러오는 중입니다.",
      errorLabel: "분석 데이터를 불러오지 못했습니다. 연결 상태를 확인한 뒤 다시 시도해주세요.",
      emptyLabel: "표시할 분석 데이터가 없습니다.",
      staleLabel: "최신 데이터를 확인하지 못해 마지막으로 저장된 내용을 표시합니다.",
      offlineLabel: "오프라인 상태입니다. 마지막으로 저장된 내용을 읽기 전용으로 표시합니다.",
      retryAction: "retry-analytics-data",
      retryLabel: "다시 시도",
    });
    const blockingDataState = ["loading", "error", "empty", "offline-empty"].includes(dataState);
    const freshActionsDisabled = Boolean(actionsDisabled);
    const analyticsStateAttribute = dataState === "ready" ? "" : ` data-analytics-state="${esc(dataState)}"`;
    const riskNg = risk.ng || { count: 0, percent: 0 };
    const riskWarn = risk.warn || { count: 0, percent: 0 };
    const riskOk = risk.ok || { count: 0, percent: 0 };
    const hasTodayPending = typeof todayPending === "number" && Number.isFinite(todayPending);
    const todayPendingValue = hasTodayPending ? todayPending : "—";
    const todayPendingNote = hasTodayPending ? "오늘 대상 점검 중 미완료" : "대상 점검 집계 대기";
    const priorityRows = [
      {
        key: "inspection",
        label: "오늘 미점검",
        count: hasTodayPending ? Math.max(0, todayPending) : null,
        note: todayPendingNote,
        tone: hasTodayPending ? (todayPending > 0 ? "high" : "clear") : "unknown",
        status: hasTodayPending ? (todayPending > 0 ? "조치 필요" : "확인 완료") : "집계 대기",
      },
      {
        key: "unsafe",
        label: "미조치 불안전요소",
        count: Math.max(0, Number(unsafeOpen) || 0),
        note: unsafeSummary,
        tone: unsafeOpen > 0 ? "high" : "clear",
        status: unsafeOpen > 0 ? "조치 필요" : "확인 완료",
      },
      {
        key: "material",
        label: "미처리 자재 요청",
        count: Math.max(0, Number(materialOpen) || 0),
        note: materialSummary,
        tone: materialOpen > 0 ? "medium" : "clear",
        status: materialOpen > 0 ? "확인 필요" : "확인 완료",
      },
    ].sort((a, b) => {
      if (a.count === null) return 1;
      if (b.count === null) return -1;
      return b.count - a.count;
    });
    const riskTotal = Number(riskNg.count || 0) + Number(riskWarn.count || 0) + Number(riskOk.count || 0);

    if (blockingDataState) {
      return `<section class="admin-board analytics-board analytics-v4"${analyticsStateAttribute}>
        ${dataContextHtml}
        ${dataStateHtml}
      </section>`;
    }

    return `<section class="admin-board analytics-board analytics-v4"${analyticsStateAttribute}>
        ${dataContextHtml}
        ${dataStateHtml}
        <section class="analytics-priority" data-analytics-priority aria-labelledby="analyticsPriorityHeading">
          <div class="analytics-v4-heading">
            <div>
              <h2 id="analyticsPriorityHeading">조치가 필요한 지점부터</h2>
            </div>
            <strong>${esc(todayDone)}건 점검 완료${todayDeltaText ? ` · ${esc(todayDeltaText)}` : ""}</strong>
          </div>
          <div class="analytics-priority-layout">
            <div class="analytics-priority-table" role="table" aria-label="조치 우선순위">
              <div class="analytics-priority-row is-head" role="row">
                <span role="columnheader">순위</span><span role="columnheader">대상</span><span role="columnheader">현재</span><span role="columnheader">판단</span>
              </div>
              ${priorityRows.map((row, index) => `<div class="analytics-priority-row is-${esc(row.tone)}" data-analytics-priority-row="${esc(row.key)}" role="row">
                <span class="analytics-priority-rank" role="cell">${index + 1}</span>
                <span class="analytics-priority-copy" role="cell"><strong>${esc(row.label)}</strong><small>${esc(row.note)}</small></span>
                <strong class="analytics-priority-count" role="cell">${row.count === null ? "—" : esc(row.count)}건</strong>
                <span class="analytics-priority-status" role="cell">${esc(row.status)}</span>
              </div>`).join("")}
            </div>
            <section class="analytics-risk-distribution" aria-labelledby="analyticsRiskHeading">
              <div class="analytics-risk-heading"><h3 id="analyticsRiskHeading">최근 7일 안전 신호</h3><span>${riskTotal}건</span></div>
              <div class="analytics-risk-body">
                <div class="analytics-risk-donut${riskTotal ? "" : " is-empty"}" style="--risk-ng:${riskNg.percent};--risk-warn:${riskWarn.percent}" role="img" aria-label="${riskTotal ? `위험 ${riskNg.percent}%, 주의 ${riskWarn.percent}%, 정상 ${riskOk.percent}%` : "최근 7일 안전 신호 없음"}"><span><strong>${riskTotal}</strong>총 신호</span></div>
                <dl class="analytics-risk-legend">
                  <div class="is-danger"><dt>위험 · NG</dt><dd>${riskNg.count}건 · ${riskNg.percent}%</dd></div>
                  <div class="is-warn"><dt>주의 · Warn</dt><dd>${riskWarn.count}건 · ${riskWarn.percent}%</dd></div>
                  <div class="is-ok"><dt>정상 · OK</dt><dd>${riskOk.count}건 · ${riskOk.percent}%</dd></div>
                </dl>
              </div>
            </section>
          </div>
        </section>
        <section class="analytics-action-first" aria-labelledby="analyticsActionHeading">
          <div class="analytics-section-heading">
            <div><h2 id="analyticsActionHeading">오늘 조치 현황</h2><p>확정된 운영 데이터만 표시합니다.</p></div>
          </div>
          <div class="analytics-action-grid">
            ${analyticsKpi("오늘 미점검", todayPendingValue, todayPendingNote, "danger")}
            ${analyticsKpi("미조치 불안전요소", unsafeOpen, unsafeSummary, "danger")}
            ${analyticsKpi("미처리 자재", materialOpen, materialSummary, "warn")}
            ${analyticsKpi("오늘 완료", todayDone, "오늘 완료한 점검", "done")}
          </div>
          <details class="analytics-metric-basis">
            <summary>지표 기준 보기</summary>
            <dl>
              <div><dt>오늘 미점검</dt><dd>오늘 대상 점검 중 아직 완료되지 않은 건수</dd></div>
              <div><dt>미조치 불안전요소</dt><dd>조치 완료 전인 불안전요소 접수 및 조치중 기록</dd></div>
              <div><dt>미처리 자재</dt><dd>처리 완료 전인 자재 누락 요청</dd></div>
              <div><dt>오늘 완료</dt><dd>오늘 완료 처리된 점검 건수</dd></div>
            </dl>
          </details>
        </section>
        <div class="analytics-grid">
          <section class="analytics-panel">
            <div class="material-table-head">
              <div><strong>현장 진행 현황</strong><span>전체 ${shipCount}척 · ${processStageCount}단계 진행률</span></div>
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
            <div class="risk-summary">
              <div><span>주간 평균</span><strong>${esc(weeklyAverage)}건/일</strong></div>
              <div><span>NG 비율</span><strong>${riskNg.percent}%</strong></div>
              <div><span>완료율</span><strong>${riskOk.percent}%</strong></div>
            </div>
          </section>
        </div>
        <section class="analytics-recent-card">
          <div class="material-table-head">
            <div><strong>최근 현장 안전 기록</strong><span>행을 선택하면 상세 화면으로 이동합니다</span></div>
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
        ${monthlyWorkerAnalyticsHtml ? `<details class="analytics-v4-monthly"><summary><span><strong>월간 작업자 점검 현황</strong><small>기간별 이행 현황과 작업자 달력</small></span><b>펼쳐 보기</b></summary><div class="analytics-v4-monthly-content">${monthlyWorkerAnalyticsHtml}</div></details>` : ""}
        <section class="analytics-utilities" aria-label="분석 도구">
          <button class="btn-light" data-export-records="analytics" type="button">데이터 내보내기</button>
          <button class="btn-light" data-action="open-analytics-filters" type="button">필터</button>
          <button class="btn-light" data-action="open-analytics-detail" type="button">상세 보기</button>
          <button class="btn" data-view="check" type="button"${freshActionsDisabled ? " disabled" : ""}>새 점검</button>
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
    const renderDataState = typeof deps.renderDataState === "function" ? deps.renderDataState : defaultAnalyticsDataState;
    const {
      dataState = "ready",
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
      actionsDisabled = false,
    } = model;
    const dataReady = dataState === "ready";
    const blockingDataState = ["loading", "error", "empty", "offline-empty"].includes(dataState);
    const dataStateHtml = renderDataState({
      state: dataState,
      loadingLabel: "월간 점검 데이터를 불러오는 중입니다.",
      errorLabel: "월간 점검 데이터를 불러오지 못했습니다. 연결 상태를 확인한 뒤 다시 시도해주세요.",
      emptyLabel: "표시할 월간 점검 데이터가 없습니다.",
      staleLabel: "최신 월간 점검 데이터를 확인하지 못해 마지막으로 저장된 내용을 표시합니다.",
      offlineLabel: "오프라인 상태입니다. 마지막으로 저장된 월간 점검 내용을 읽기 전용으로 표시합니다.",
      retryAction: "retry-monthly-worker-analytics",
      retryLabel: "다시 시도",
    });
    const meta = renderMonthlyWorkerMonthMeta(monthText, monthHighlight);
    const toolbar = `<div class="monthly-worker-toolbar">
              <button class="btn-light" data-monthly-worker-month="prev" type="button">이전 달</button>
              <button class="btn-light" data-monthly-worker-month="current" type="button">이번 달</button>
              <button class="btn-light" data-monthly-worker-month="next" ${range.canGoNext ? "" : "disabled"} type="button">다음 달</button>
              <button class="btn-light" data-action="toggle-monthly-rest-settings" type="button">${restOpen ? "휴무 설정 닫기" : "휴무 설정"}</button>
              <button class="btn" data-export-records="monthly-worker-analytics"${dataReady && !actionsDisabled ? "" : " disabled"} type="button">월간 내보내기</button>
            </div>`;
    if (blockingDataState) {
      return `<section class="analytics-panel monthly-worker-analytics" data-monthly-worker-state="${esc(dataState)}">
          <div class="monthly-worker-head">
            <div><strong>월간 작업자 점검 현황</strong>${meta}</div>
            ${toolbar}
          </div>
          ${dataStateHtml}
          ${restOpen ? renderMonthlyRestDaySettingsView(restPanel) : ""}
        </section>`;
    }
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
        ${activeTab === "workPrep" ? panels.workPrep || "" : ""}
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

  function renderMaterialDetailView(model = {}) {
    const {
      statusBadgeHtml = "",
      shipNo = "",
      materialName = "",
      quantityText = "",
      workerName = "",
      createdAtText = "",
      content = "",
      adminMemo = "",
      timelineHtml = "",
      adminControlsHtml = "",
    } = model;
    return `<section class="panel panel-pad material-detail">
        <div class="detail-header">
          <button class="btn-light" data-action="back-material-list" type="button">목록</button>
          ${statusBadgeHtml}
        </div>
        <div class="section-title">자재누락 상세 기록</div>
        <div class="detail-grid material-detail-meta-grid">
          <div><span class="small muted">호선</span><strong>${esc(shipNo)}</strong></div>
          <div><span class="small muted">자재명</span><strong>${esc(materialName || "-")}</strong></div>
          <div><span class="small muted">수량</span><strong>${esc(quantityText || "-")}</strong></div>
          <div><span class="small muted">등록자</span><strong>${esc(workerName || "-")}</strong></div>
          <div class="material-detail-date-meta"><span class="small muted">등록일시</span><strong>${esc(createdAtText)}</strong></div>
        </div>
        <div class="field" style="margin-top:12px">
          <span class="field-label">요청 내용</span>
          <div class="readonly-box">${esc(content || "내용 없음")}</div>
        </div>
        <div class="field" style="margin-top:12px">
          <span class="field-label">처리 이력</span>
          ${timelineHtml}
        </div>
        ${adminControlsHtml}
      </section>`;
  }

  function renderHistoryLoadMoreView(model = {}) {
    if (!model.visible) return "";
    return `<div class="list-actions" style="margin-top:12px"><button class="btn-light" data-action="load-more-history" type="button">더 보기</button></div>`;
  }

  function renderHistoryTableView(model = {}) {
    const rows = model.rows || [];
    return `<div class="history-list">
        ${rows.map((row) => {
          const teamClass = row.workerTeam === "선행"
            ? "is-pre"
            : row.workerTeam === "후행"
              ? "is-post"
              : row.workerTeam
                ? "is-neutral"
                : "";
          return `<div class="history-list-row ${row.canSelect ? "has-check" : ""}">
            ${row.canSelect ? `<input class="history-card-check" type="checkbox" aria-label="이력 선택" data-history-check="${esc(row.id)}" ${row.selected ? "checked" : ""}>` : ""}
            <article class="history-list-card" style="--accent:${esc(row.accent)};--stage:${esc(row.stageColor || row.accent)};--stage-bg:${esc(row.stageBg || "#fff")}" data-history-detail-card="${esc(row.id)}" role="button" tabindex="0" aria-label="${esc(row.ariaLabel)}">
              <span class="history-list-icon" aria-hidden="true">${row.categoryVisualHtml || ""}</span>
              <div class="history-list-main">
                <strong class="history-list-ship">${esc(row.shipNo || "-")}</strong>
                <div class="history-list-work">
                  <span>${esc(row.workLabel || "-")}</span>
                </div>
                <div class="history-list-worker">
                  ${row.workerTeam ? `<span class="history-worker-badge ${esc(teamClass)}">${esc(row.workerTeam)}</span>` : ""}
                  <strong>${esc(row.workerName || "-")}</strong>
                </div>
                <div class="history-list-status-stack">
                  <button class="history-status-btn" data-history-detail="${esc(row.id)}" type="button">${esc(row.statusLabel || "점검 완료")}</button>
                  ${row.riskBadgeHtml || ""}
                  <div class="history-list-time">
                    <strong>${row.timePeriod ? `${esc(row.timePeriod)} ` : ""}${esc(row.timeText || "시간 미기록")}</strong>
                    <span>${esc(row.dateText || "-")}</span>
                  </div>
                </div>
              </div>
            </article>
          </div>`;
        }).join("")}
      </div>`;
  }

  return {
    renderAnalyticsDashboardView,
    renderDashboardView,
    renderHistoryLoadMoreView,
    renderHistoryTableView,
    renderManageShellView,
    renderMaterialDetailView,
    renderMaterialRecordCardView,
    renderMonthlyWorkerAnalyticsView,
    renderUnsafeDetailView,
    renderUnsafeRecordCardView,
    statIcon,
    statPill,
  };
}));
