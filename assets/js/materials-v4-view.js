(function attachMaterialsV4View(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardMaterialsV4View = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildMaterialsV4ViewApi() {
  const DEFAULT_STATUSES = ["접수", "확인중", "완료"];

  function esc(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    }[char]));
  }

  function text(value, fallback = "-") {
    const compact = String(value == null ? "" : value).trim();
    return compact || fallback;
  }

  function quantityText(record = {}) {
    if (record.quantityText) return text(record.quantityText);
    const quantity = text(record.quantity, "");
    const unit = text(record.unit, "");
    return quantity ? `${quantity}${unit ? ` ${unit}` : ""}` : "-";
  }

  function statusBadge(status) {
    return `<span class="materials-v4__status" data-status="${esc(text(status, "미정"))}">${esc(text(status, "미정"))}</span>`;
  }

  function renderDataState(dataState = "") {
    const state = String(dataState || "").trim();
    const copy = {
      loading: "자재 누락 기록을 불러오는 중입니다.",
      error: "기록을 불러오지 못했습니다. 연결을 확인한 뒤 다시 시도하세요.",
      empty: "표시할 자재 누락 기록이 없습니다.",
      stale: "이전 반영 기록을 표시하고 있습니다.",
      offline: "오프라인 상태입니다. 기기에 저장된 기록을 표시합니다.",
      "offline-empty": "오프라인 상태이며 표시할 저장 기록이 없습니다.",
    }[state];
    return copy ? `<div class="materials-v4__state" data-state="${esc(state)}" role="status">${esc(copy)}</div>` : "";
  }

  function renderRecord(record = {}, { selectedId = "", canEdit = false } = {}) {
    const id = text(record.id, "");
    if (!id) return "";
    const selected = id === String(selectedId || "");
    const name = text(record.materialName, "자재명 미지정");
    const shipNo = text(record.shipNo, "호선 미지정");
    const description = text(record.content, "요청 내용이 없습니다.");
    const requestedBy = text(record.workerNameSnapshot || record.requestedBy, "등록자 미지정");
    const checkbox = canEdit
      ? `<label class="materials-v4__select"><input data-material-bulk-select="${esc(id)}" type="checkbox" aria-label="${esc(`${name} 선택`)}"${record.selected ? " checked" : ""} /><span class="visually-hidden">선택</span></label>`
      : "";
    return `<article class="materials-v4__record${selected ? " is-selected" : ""}">
      ${checkbox}
      <button class="materials-v4__record-button" data-material-record-detail="${esc(id)}" type="button" aria-pressed="${selected ? "true" : "false"}" aria-label="${esc(`${shipNo} ${name} 상세 보기`)}">
        <span class="materials-v4__record-primary"><strong>${esc(name)}</strong><span>${esc(description)}</span></span>
        <span class="materials-v4__record-meta"><span>${esc(shipNo)}</span><span>${esc(quantityText(record))}</span><span>${esc(requestedBy)}</span></span>
        ${statusBadge(record.status)}
      </button>
    </article>`;
  }

  function renderTimeline(items = [], type = "status") {
    const rows = Array.isArray(items) ? items : [];
    const heading = type === "assignee" ? "담당자 이력" : "상태 이력";
    if (!rows.length) {
      return `<section class="materials-v4__history" aria-label="${heading}"><h3>${heading}</h3><p class="materials-v4__history-empty">${type === "assignee" ? "담당자 변경 기록이 없습니다." : "상태 변경 기록이 없습니다."}</p></section>`;
    }
    return `<section class="materials-v4__history" aria-label="${heading}"><h3>${heading}</h3><ol>${rows.map((entry = {}) => {
      const value = type === "assignee"
        ? text(entry.assigneeName || entry.assignee || entry.workerName || entry.name, "담당자 미지정")
        : text(entry.status, "상태 미지정");
      const actor = text(entry.changedByName || entry.workerName || entry.actor || entry.assigneeName, "변경자 미지정");
      const when = text(entry.changedAt || entry.createdAt || entry.at, "기록 시각 없음");
      const note = text(entry.note || entry.memo || entry.reason, "");
      return `<li><span>${esc(value)}</span><small>${esc(actor)} · ${esc(when)}</small>${note ? `<p>${esc(note)}</p>` : ""}</li>`;
    }).join("")}</ol></section>`;
  }

  function renderDetail(record, { statuses = DEFAULT_STATUSES, canEdit = false, mobileDetailOpen = false, controlsHtml = "" } = {}) {
    if (!record) {
      return `<aside class="materials-v4__detail materials-v4__detail--empty" aria-label="자재 누락 상세"><p>목록에서 기록을 선택하면 요청 내용과 처리 이력을 확인할 수 있습니다.</p></aside>`;
    }
    const id = text(record.id, "");
    const name = text(record.materialName, "자재명 미지정");
    const shipNo = text(record.shipNo, "호선 미지정");
    const disabled = canEdit ? "" : " disabled";
    return `<aside class="materials-v4__detail${mobileDetailOpen ? " is-mobile-fullscreen" : ""}" data-material-detail="${esc(id)}" aria-labelledby="materials-v4-detail-title" tabindex="-1">
      <header class="materials-v4__detail-header">
        <button class="materials-v4__back" data-action="back-material-list" type="button">목록</button>
        <div><span>${esc(shipNo)}</span><h2 id="materials-v4-detail-title">${esc(name)}</h2></div>
        ${statusBadge(record.status)}
      </header>
      <dl class="materials-v4__facts">
        <div><dt>수량</dt><dd>${esc(quantityText(record))}</dd></div>
        <div><dt>등록자</dt><dd>${esc(text(record.workerNameSnapshot || record.requestedBy, "등록자 미지정"))}</dd></div>
        <div><dt>등록 시각</dt><dd>${esc(text(record.createdAt, "기록 시각 없음"))}</dd></div>
        <div><dt>담당자</dt><dd>${esc(text(record.assigneeName || record.assignee, "미배정"))}</dd></div>
      </dl>
      <section class="materials-v4__request"><h3>요청 내용</h3><p>${esc(text(record.content, "요청 내용이 없습니다."))}</p>${record.detail ? `<p>${esc(record.detail)}</p>` : ""}</section>
      <section class="materials-v4__controls" aria-label="처리 기록">
        <h3>처리 기록</h3>
        <label>상태<select data-record-status="materials:${esc(id)}"${disabled}>${(Array.isArray(statuses) && statuses.length ? statuses : DEFAULT_STATUSES).map((status) => `<option value="${esc(status)}"${String(record.status) === String(status) ? " selected" : ""}>${esc(status)}</option>`).join("")}</select></label>
        <label>관리 메모<textarea data-record-memo="materials:${esc(id)}"${disabled}>${esc(record.adminMemo || "")}</textarea></label>
        <div class="materials-v4__control-actions"><button data-save-record="materials:${esc(id)}" type="button"${disabled}>변경 저장</button>${controlsHtml || ""}</div>
      </section>
      <div class="materials-v4__history-grid">${renderTimeline(record.statusHistory, "status")}${renderTimeline(record.assigneeHistory, "assignee")}</div>
    </aside>`;
  }

  function renderMissingMaterialsV4(model = {}) {
    const records = Array.isArray(model.records) ? model.records : [];
    const selectedId = String(model.selectedId || "");
    const selectedRecord = model.selectedRecord || records.find((record) => String(record.id || "") === selectedId) || null;
    const dataState = String(model.dataState || "");
    const canEdit = Boolean(model.canEdit);
    const selectedCount = records.filter((record) => record && record.selected).length;
    const countText = typeof model.visibleCount === "number" ? `${model.visibleCount}건` : `${records.length}건`;
    const showEmpty = !records.length && !["loading", "error", "offline-empty"].includes(dataState);
    return `<section class="materials-v4${model.mobileDetailOpen && selectedRecord ? " is-mobile-detail-open" : ""}" data-materials-v4-state="${esc(dataState || "ready")}">
      <header class="materials-v4__header"><div><h1>자재 누락</h1><p>요청을 확인하고 담당 조치와 변경 기록을 남깁니다.</p></div>${model.toolbarHtml || ""}</header>
      ${renderDataState(dataState)}
      <div class="materials-v4__toolbar">${model.filterHtml || ""}<span aria-live="polite">${esc(countText)} 표시</span></div>
      <div class="materials-v4__workspace">
        <section class="materials-v4__list" aria-label="자재 누락 목록"><header><h2>요청 목록</h2>${canEdit && selectedCount ? `<button data-action="bulk-material-status" type="button">선택 ${selectedCount}건 상태 변경</button>` : ""}</header>
          <div class="materials-v4__records">${records.map((record) => renderRecord(record, { selectedId, canEdit })).join("") || (showEmpty ? `<p class="materials-v4__empty">표시할 자재 누락 기록이 없습니다.</p>` : "")}</div>
        </section>
        ${renderDetail(selectedRecord, { statuses: model.statuses, canEdit, mobileDetailOpen: Boolean(model.mobileDetailOpen), controlsHtml: model.detailControlsHtml })}
      </div>
    </section>`;
  }

  return { renderMissingMaterialsV4 };
}));
