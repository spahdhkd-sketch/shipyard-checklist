(function attachControlMapView(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.ShipyardControlMapView = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function buildControlMapView() {
  const PIN_STORAGE_KEY = "shipyardSafetyV1.controlMapPinPositions.v1";
  const MAP_REALTIME_KEY = "shipyardSafetyV1.controlMapRealtime.v1";
  const MAP_REALTIME_CHANNEL = "shipyard-control-map";
  const PRESENTATION_QUERY_KEY = "controlMapPresentation";
  const PRESENTATION_WINDOW_NAME = "shipyard-control-map-presentation";
  const MAP_DATABASE = "shipyardSafetyControlMap";
  const MAP_STORE = "assets";
  const MAP_KEY = "baseMap.v1";
  const MAP_WIDTH = 4096;
  const MAP_HEIGHT = 3072;
  const MAP_SOURCE = "/assets/images/control-map-base-white.png";
  const MAP_NAME = "control-map-base-white.png";
  const MAP_PALETTE = ["#ffffff", "#f3f4f4", "#dceeff", "#6f999c", "#f47b20", "#0b2f58"];
  const LOCATIONS = Object.freeze({
    "DOCK-1": { label: "A", name: "1도크", kind: "dock", x: 56.21, y: 68.34, labelDx: -4.4, labelDy: 8.1 },
    "DOCK-2": { label: "B", name: "2도크", kind: "dock", x: 67.98, y: 68.67, labelDx: 0, labelDy: -5.5 },
    "DOCK-3": { label: "C", name: "3도크", kind: "dock", x: 54.56, y: 63.62, labelDx: 3, labelDy: -7.4 },
    "DOCK-4": { label: "D", name: "4도크", kind: "dock", x: 69.54, y: 80.98, labelDx: -5, labelDy: -6.2 },
    "DOCK-5": { label: "E", name: "5도크", kind: "dock", x: 69.63, y: 86.7, labelDx: -9, labelDy: 6 },
    "DOCK-8": { label: "F", name: "8도크", kind: "dock", x: 28.96, y: 42.07, labelDx: -6.2, labelDy: -8.8 },
    "DOCK-9": { label: "G", name: "9도크", kind: "dock", x: 27.89, y: 46.69, labelDx: -11.3, labelDy: -3.7 },
    "DOCK-H": { label: "H", name: "H도크", kind: "dock", x: 67.49, y: 27.01, labelDx: 0, labelDy: -6 },
    "QUAY-M1": { label: "I", name: "M-1안벽", kind: "quay", x: 44.68, y: 69.99, labelDx: -11, labelDy: 5.3 },
    "QUAY-M2": { label: "J", name: "M-2안벽", kind: "quay", x: 33.65, y: 59.44, labelDx: -10.8, labelDy: 1.6 },
    "QUAY-M4": { label: "K", name: "M-4안벽", kind: "quay", x: 40.4, y: 50.54, labelDx: -2.6, labelDy: -16.5 },
    "QUAY-M5": { label: "L", name: "M-5안벽", kind: "quay", x: 44.35, y: 52.62, labelDx: 4.3, labelDy: -14.2 },
    "QUAY-M7": { label: "M", name: "M-7안벽", kind: "quay", x: 48.06, y: 57.24, labelDx: 7, labelDy: -10.7 },
    "QUAY-J1": { label: "N", name: "J-1안벽", kind: "quay", x: 78.85, y: 89.01, labelDx: 0.8, labelDy: 6.2 },
    "QUAY-J2": { label: "O", name: "J-2안벽", kind: "quay", x: 73.33, y: 76.04, labelDx: 6.4, labelDy: -7 },
    "QUAY-J5": { label: "P", name: "J-5안벽", kind: "quay", x: 85.6, y: 79.34, labelDx: 8.6, labelDy: -3.3 },
    "QUAY-H1": { label: "Q", name: "H-1안벽", kind: "quay", x: 94.57, y: 27.67, labelDx: -0.4, labelDy: -9.5 },
    "QUAY-H2": { label: "R", name: "H-2안벽", kind: "quay", x: 89.63, y: 27.45, labelDx: -8.9, labelDy: -8.5 },
    "QUAY-H3": { label: "S", name: "H-3안벽", kind: "quay", x: 88.23, y: 34.71, labelDx: 5, labelDy: 11.4 },
    "QUAY-H4": { label: "T", name: "H-4안벽", kind: "quay", x: 85.1, y: 34.6, labelDx: -5.9, labelDy: 10.3 },
    "QUAY-H5": { label: "U", name: "H-5안벽", kind: "quay", x: 75.14, y: 30.42, labelDx: -8.4, labelDy: 5.5 },
  });
  const PLACE_ALIASES = Object.freeze(Object.entries(LOCATIONS).reduce((aliases, [id, location]) => {
    const name = location.name.toUpperCase();
    aliases[id] = id;
    aliases[name] = id;
    aliases[name.replace(/-/g, "")] = id;
    aliases[location.label] = id;
    aliases[`${location.label}구역`] = id;
    aliases[`ZONE-${location.label}`] = id;
    return aliases;
  }, {}));

  let activeModel = null;
  let runtime = null;

  function esc(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    }[char]));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function defaultPinPoint(location) {
    return {
      x: clamp(location.x + location.labelDx, 0, 100),
      y: clamp(location.y + location.labelDy, 0, 100),
    };
  }

  function defaultPlacement(location) {
    const pin = defaultPinPoint(location);
    return { x: pin.x, y: pin.y, anchorX: location.x, anchorY: location.y };
  }

  function normalizedPercent(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 && number <= 100
      ? Number(number.toFixed(3))
      : Number(fallback);
  }

  function normalizePlacement(id, placement) {
    const location = LOCATIONS[id];
    const x = Number(placement?.x);
    const y = Number(placement?.y);
    if (!location || !Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 100 || y < 0 || y > 100) return null;
    return {
      x: Number(x.toFixed(3)),
      y: Number(y.toFixed(3)),
      anchorX: normalizedPercent(placement?.anchorX, location.x),
      anchorY: normalizedPercent(placement?.anchorY, location.y),
    };
  }

  function isPresentationMode() {
    if (typeof window === "undefined") return false;
    try {
      return new URLSearchParams(window.location.search).get(PRESENTATION_QUERY_KEY) === "1";
    } catch {
      return false;
    }
  }

  function recordPlaceId(record = {}) {
    const raw = record.placeId
      || record.place_id
      || record.locationId
      || record.location_id
      || record.location?.id
      || record.location
      || "";
    const normalized = String(raw).trim().toUpperCase();
    return PLACE_ALIASES[normalized] || normalized;
  }

  function recordSeverity(record = {}) {
    const people = recordPeopleCount(record);
    const inspectionType = recordInspectionType(record).replace(/\s+/g, "");
    const triple = Boolean(record.requiresTripleInspection || record.requires_triple_inspection || record.isTripleInspection)
      || inspectionType === "3중점검";
    const total = Math.max(0, Number(record.total || 0));
    const submitted = Math.max(0, Number(record.submitted || 0));
    const complete = Boolean(record.inspectionComplete || record.inspection_complete)
      || Boolean(total) && submitted >= total;
    if (triple) return "danger";
    if (people === 1) return "warn";
    if (complete) return "ok";
    return "idle";
  }

  function strongestSeverity(records) {
    if (records.some((record) => (record.mapState || recordSeverity(record)) === "danger")) return "danger";
    if (records.some((record) => (record.mapState || recordSeverity(record)) === "warn")) return "warn";
    if (records.some((record) => (record.mapState || recordSeverity(record)) === "ok")) return "ok";
    return "idle";
  }

  function recordPeopleCount(record = {}) {
    const ids = [
      record.leaderWorkerId || record.leader_worker_id,
      ...(Array.isArray(record.workerIds) ? record.workerIds : Array.isArray(record.worker_ids) ? record.worker_ids : []),
      ...(Array.isArray(record.otherTeamWorkerIds) ? record.otherTeamWorkerIds : Array.isArray(record.other_team_worker_ids) ? record.other_team_worker_ids : []),
    ].map((id) => String(id || "").trim()).filter(Boolean);
    return ids.length ? new Set(ids).size : Math.max(0, Number(record.people || 0));
  }

  function recordInspectionType(record = {}) {
    return String(record.inspectionType || record.inspection_type || "").trim();
  }

  function normalizeRecord(record = {}) {
    const people = recordPeopleCount(record);
    const inspectionType = recordInspectionType(record);
    const severity = recordSeverity(record);
    const isSolo = people === 1;
    const isTripleInspection = Boolean(record.requiresTripleInspection || record.requires_triple_inspection || record.isTripleInspection)
      || inspectionType.replace(/\s+/g, "") === "3중점검";
    const isNonRoutine = Boolean(record.isNonRoutine || record.is_non_routine);
    const isForeignSolo = isSolo && Boolean(record.isForeignSolo || record.is_foreign_solo);
    const isInspectionComplete = severity === "ok";
    return {
      id: String(record.id || ""),
      placeId: recordPlaceId(record),
      shipNo: String(record.shipNo || record.ship_no || "-").trim() || "-",
      task: String(record.categoryLabel || record.task || record.workLabel || "작업지시").trim() || "작업지시",
      status: String(record.statusLabel || record.status || "확인 필요").trim() || "확인 필요",
      warnings: Math.max(0, Number(record.warnings || 0)),
      people,
      submitted: Math.max(0, Number(record.submitted || 0)),
      total: Math.max(0, Number(record.total || 0)),
      severity,
      inspectionType,
      isSolo,
      isForeignSolo,
      isTripleInspection,
      isNonRoutine,
      isInspectionComplete,
      mapState: severity,
    };
  }

  function buildModel(input = {}) {
    const records = (Array.isArray(input.records) ? input.records : []).map(normalizeRecord);
    const locations = Object.entries(LOCATIONS).map(([id, location]) => {
      const workOrders = records.filter((record) => record.placeId === id);
      return { id, ...location, workOrders, severity: strongestSeverity(workOrders) };
    });
    const matchedCount = locations.reduce((total, location) => total + location.workOrders.length, 0);
    const preferred = Object.prototype.hasOwnProperty.call(input, "selectedPlaceId")
      ? String(input.selectedPlaceId || "")
      : activeModel && Object.prototype.hasOwnProperty.call(activeModel, "selectedPlaceId")
        ? String(activeModel.selectedPlaceId || "")
        : null;
    const selectedPlaceId = preferred === ""
      ? ""
      : LOCATIONS[preferred]
        ? preferred
        : locations.find((location) => location.workOrders.length)?.id || "DOCK-1";
    const statusCounts = locations.reduce((counts, location) => {
      location.workOrders.forEach((record) => {
        counts[record.mapState] = (counts[record.mapState] || 0) + 1;
      });
      return counts;
    }, { ok: 0, warn: 0, danger: 0, idle: 0 });
    return {
      canEdit: Boolean(input.canEdit),
      locations,
      matchedCount,
      unmatchedCount: Math.max(0, records.length - matchedCount),
      selectedPlaceId,
      statusCounts,
    };
  }

  function detailHtml(location) {
    if (!location) return `<div class="control-map__detail-empty" data-map-selection-empty>
      <span>선택 위치</span>
      <h3>선택 안 함</h3>
      <p>도크·안벽 핀을 선택하면 연결된 작업지시서가 표시됩니다.</p>
    </div>`;
    const orders = location.workOrders;
    const people = orders.reduce((total, order) => total + order.people, 0);
    const tripleCount = orders.filter((order) => order.isTripleInspection).length;
    const orderList = orders.length
      ? `<div class="control-map__order-list">${orders.slice(0, 4).map((order) => `<article class="control-map__order is-${esc(order.mapState)}">
          <span>${esc(order.shipNo)}</span>
          <div class="control-map__order-main"><strong>${esc(order.task)}</strong><small>${esc(order.status)}${order.total ? ` · 점검 ${esc(order.submitted)}/${esc(order.total)}` : ""} · 참여 ${esc(order.people)}명</small></div>
          ${order.isSolo || order.isTripleInspection || order.isNonRoutine ? `<div class="control-map__order-badges">${order.isSolo ? `<em class="control-map__order-badge is-solo">${order.isForeignSolo ? "외국인 1인 작업" : "1인 작업"}</em>` : ""}${order.isTripleInspection ? '<em class="control-map__order-badge is-triple">3중점검</em>' : ""}${order.isNonRoutine ? '<em class="control-map__order-badge is-non-routine">비일상작업</em>' : ""}</div>` : ""}
        </article>`).join("")}${orders.length > 4 ? `<p>외 ${orders.length - 4}건</p>` : ""}</div>`
      : `<div class="control-map__empty">장소 ID가 연결된 오늘 작업지시서가 없습니다.</div>`;
    return `<div class="control-map__detail-head"><span>선택 위치</span><h3>${esc(location.name)}</h3><em class="is-${esc(location.severity)}">${location.severity === "danger" ? "3중점검" : location.severity === "warn" ? "1인 작업" : location.severity === "ok" ? "점검 완료" : "점검 전"}</em></div>
      <dl class="control-map__detail-stats"><div><dt>작업지시</dt><dd>${orders.length}건</dd></div><div><dt>참여</dt><dd>${people}명</dd></div><div><dt>3중점검</dt><dd>${tripleCount}건</dd></div></dl>
      ${orderList}
      <button class="btn control-map__detail-action" data-view="manage" data-manage-center-card="operations" type="button">작업지시서에서 확인</button>`;
  }

  function renderEditor() {
    return `<div class="control-map__editor" data-map-editor hidden>
        <div class="control-map__editor-group" role="group" aria-label="원본 지도 도구">
          <strong>원본 지도 편집</strong>
          <label class="btn-light control-map__file-button">이미지 교체<input data-map-file type="file" accept="image/*" /></label>
          <button class="btn-light" data-map-tool="brush" type="button" aria-pressed="false">브러시</button>
          <button class="btn-light is-active" data-map-tool="eraser" type="button" aria-pressed="true">흰색 지우개</button>
          <button class="btn-light" data-map-tool="eyedropper" type="button" aria-pressed="false">색 추출</button>
        </div>
        <div class="control-map__editor-group" aria-label="브러시 설정">
          <label class="control-map__color-input"><span>색상</span><input data-map-color type="color" value="#087f73" /></label>
          <div class="control-map__palette" aria-label="지도 색상 팔레트">${MAP_PALETTE.map((color) => `<button data-map-color-choice="${color}" type="button" style="--map-color:${color}" aria-label="${color} 색상"></button>`).join("")}</div>
          <label class="control-map__brush-size"><span>굵기 <b data-map-brush-value>28</b></span><input data-map-brush type="range" min="8" max="120" step="2" value="28" /></label>
        </div>
        <div class="control-map__editor-group control-map__editor-actions">
          <button class="btn-light" data-map-undo type="button" disabled>실행 취소</button>
          <button class="btn-light" data-map-redo type="button" disabled>다시 실행</button>
          <button class="btn-light" data-map-reset type="button">원본 초기화</button>
          <button class="btn-light" data-map-save-source type="button">원본 PNG 저장</button>
          <button class="btn-light" data-map-export-png type="button">핀 포함 4K PNG</button>
        </div>
        <div class="control-map__editor-group control-map__editor-actions">
          <button class="btn-light" data-map-export-json type="button">핀 좌표 저장</button>
          <label class="btn-light control-map__file-button">핀 좌표 불러오기<input data-map-import-json type="file" accept="application/json,.json" /></label>
        </div>
      </div>`;
  }

  function render(input = {}) {
    activeModel = buildModel(input);
    const presentationMode = Boolean(input.presentationMode) || isPresentationMode();
    const selected = activeModel.locations.find((location) => location.id === activeModel.selectedPlaceId);
    const activeLocations = activeModel.locations.filter((location) => location.workOrders.length).length;
    return `<section class="control-map${presentationMode ? " is-map-presentation" : ""}" data-control-map aria-labelledby="controlMapTitle">
      <header class="control-map__heading">
        <div><span>LIVE WORK AREA</span><h2 id="controlMapTitle">작업구역 관제지도</h2><p>21개 도크·안벽의 작업지시서 장소 ID를 기준으로 3중점검, 1인 작업, 점검 완료를 확인합니다.${activeModel.unmatchedCount ? ` · 장소 미지정 ${activeModel.unmatchedCount}건` : ""}</p></div>
        <dl class="control-map__status-summary"><div><dt>오늘 작업</dt><dd>${activeModel.matchedCount}</dd></div><div class="is-danger"><dt>3중점검</dt><dd>${activeModel.statusCounts.danger}</dd></div><div class="is-warn"><dt>1인 작업</dt><dd>${activeModel.statusCounts.warn}</dd></div><div class="is-ok"><dt>점검 완료</dt><dd>${activeModel.statusCounts.ok}</dd></div></dl>
        <div class="control-map__status-filters" role="group" aria-label="지도 작업상태 필터">
          <button type="button" data-map-filter="all" aria-pressed="true">전체 위치 <b>${activeLocations}</b></button>
          <button type="button" data-map-filter="danger" aria-pressed="false">3중점검 <b>${activeModel.statusCounts.danger}</b></button>
          <button type="button" data-map-filter="warn" aria-pressed="false">1인 작업 <b>${activeModel.statusCounts.warn}</b></button>
          <button type="button" data-map-filter="ok" aria-pressed="false">점검 완료 <b>${activeModel.statusCounts.ok}</b></button>
        </div>
      </header>
      <div class="control-map__toolbar">
        <p data-map-state aria-live="polite">${activeModel.canEdit ? "핀 또는 지도 편집은 자동 저장되며 열린 화면에 실시간 반영됩니다." : "작업지시 변경사항을 실시간으로 반영하고 있습니다."}</p>
        <div class="control-map__toolbar-actions">
          ${activeModel.canEdit ? '<button class="btn-light" data-map-edit type="button" aria-pressed="false">핀·기준점 편집</button><button class="btn-light" data-map-source-edit type="button" aria-expanded="false">원본 지도 편집</button>' : ""}
          <div class="control-map__zoom" role="group" aria-label="지도 확대 축소">
            <button class="btn-light" data-map-zoom="out" type="button" aria-label="지도 축소">−</button>
            <button class="btn-light" data-map-fit type="button">전체 보기</button>
            <button class="btn-light" data-map-zoom="in" type="button" aria-label="지도 확대">＋</button>
          </div>
        </div>
      </div>
      ${activeModel.canEdit ? renderEditor() : ""}
      <div class="control-map__layout">
        <div class="control-map__viewport" data-map-viewport tabindex="0" aria-label="작업구역 지도. 터치하거나 마우스로 끌어 이동할 수 있습니다.">
          <aside class="control-map__legend" aria-label="지도 핀 상태 범례">
            <strong>핀 상태 범례</strong>
            <ul>
              <li class="is-danger"><i aria-hidden="true"></i><span><b>빨강 · 3중점검</b><small>압력·CO2 system·Leak test·비일상 작업</small></span></li>
              <li class="is-warn"><i aria-hidden="true"></i><span><b>노랑 · 1인 작업</b><small>단독 작업 또는 외국인 1인 작업</small></span></li>
              <li class="is-ok"><i aria-hidden="true"></i><span><b>초록 · 점검 완료</b><small>작업 전 점검 전원 완료</small></span></li>
            </ul>
          </aside>
          <button class="btn-light control-map__presentation" data-map-presentation type="button">${presentationMode ? "발표 화면 닫기" : "발표 화면 열기"}</button>
          <div class="control-map__canvas" data-map-canvas>
            <canvas class="control-map__source" data-map-source width="${MAP_WIDTH}" height="${MAP_HEIGHT}" aria-label="편집 가능한 작업구역 원본 지도"></canvas>
            <svg class="control-map__leaders" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${activeModel.locations.map((location) => {
              const point = defaultPinPoint(location);
              return `<line data-map-line="${esc(location.id)}" x1="${location.x}" y1="${location.y}" x2="${point.x}" y2="${point.y}" vector-effect="non-scaling-stroke"></line>`;
            }).join("")}</svg>
            <div class="control-map__anchors">${activeModel.locations.map((location) => `<span class="control-map__anchor" data-map-anchor="${esc(location.id)}" style="--anchor-x:${location.x}%;--anchor-y:${location.y}%" tabindex="-1" aria-label="${esc(location.name)} 기준점" aria-hidden="true"></span>`).join("")}</div>
            <div class="control-map__pins">${activeModel.locations.map((location) => {
              const point = defaultPinPoint(location);
              return `<button class="control-map__pin is-${esc(location.severity)}${location.workOrders.length ? " has-work" : ""}${location.id === activeModel.selectedPlaceId ? " is-selected" : ""}" data-map-pin="${esc(location.id)}" data-map-work-state="${esc(location.severity)}" style="--pin-x:${point.x}%;--pin-y:${point.y}%" type="button" aria-label="${esc(location.name)} ${location.workOrders.length}건">
                <span class="control-map__pin-label"><b>${esc(location.name)}</b>${location.workOrders.length ? `<em class="control-map__pin-count">${location.workOrders.length}</em>` : ""}</span>
              </button>`;
            }).join("")}</div>
          </div>
          <span class="control-map__pan-hint" data-map-hint>지도를 터치해 이동 · 핀을 눌러 위치 선택</span>
        </div>
        <aside class="control-map__detail" data-map-detail aria-live="polite">${detailHtml(selected)}</aside>
      </div>
    </section>`;
  }

  function loadPositions() {
    try {
      const parsed = JSON.parse(localStorage.getItem(PIN_STORAGE_KEY) || "{}");
      return Object.fromEntries(Object.entries(parsed).map(([id, point]) => [id, normalizePlacement(id, point)]).filter(([, point]) => point));
    } catch {
      return {};
    }
  }

  function savePositions(positions) {
    try {
      localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(positions));
      return true;
    } catch {
      return false;
    }
  }

  function openMapDatabase() {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === "undefined") {
        reject(new Error("IndexedDB is unavailable"));
        return;
      }
      const request = indexedDB.open(MAP_DATABASE, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(MAP_STORE)) request.result.createObjectStore(MAP_STORE);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Map database open failed"));
    });
  }

  async function readStoredMap() {
    const database = await openMapDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(MAP_STORE, "readonly").objectStore(MAP_STORE).get(MAP_KEY);
      request.onsuccess = () => {
        database.close();
        resolve(request.result || null);
      };
      request.onerror = () => {
        database.close();
        reject(request.error || new Error("Stored map read failed"));
      };
    });
  }

  async function writeStoredMap(blob, name) {
    const database = await openMapDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(MAP_STORE, "readwrite").objectStore(MAP_STORE).put({ blob, name, savedAt: Date.now() }, MAP_KEY);
      request.onsuccess = () => {
        database.close();
        resolve(true);
      };
      request.onerror = () => {
        database.close();
        reject(request.error || new Error("Stored map write failed"));
      };
    });
  }

  async function deleteStoredMap() {
    const database = await openMapDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(MAP_STORE, "readwrite").objectStore(MAP_STORE).delete(MAP_KEY);
      request.onsuccess = () => {
        database.close();
        resolve(true);
      };
      request.onerror = () => {
        database.close();
        reject(request.error || new Error("Stored map delete failed"));
      };
    });
  }

  function loadImage(source) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Map image load failed"));
      image.src = source;
    });
  }

  function canvasBlob(canvas) {
    return new Promise((resolve, reject) => canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas export failed"));
    }, "image/png"));
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function roundRect(context, x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.arcTo(x + width, y, x + width, y + height, safeRadius);
    context.arcTo(x + width, y + height, x, y + height, safeRadius);
    context.arcTo(x, y + height, x, y, safeRadius);
    context.arcTo(x, y, x + width, y, safeRadius);
    context.closePath();
  }

  function destroy() {
    if (!runtime) return;
    runtime.cleanups.forEach((cleanup) => cleanup());
    runtime = null;
  }

  function hydrate() {
    destroy();
    const root = document.querySelector("[data-control-map]");
    const viewport = root?.querySelector("[data-map-viewport]");
    const canvas = root?.querySelector("[data-map-canvas]");
    const sourceCanvas = root?.querySelector("[data-map-source]");
    const sourceContext = sourceCanvas?.getContext("2d");
    if (!root || !viewport || !canvas || !sourceCanvas || !sourceContext || !activeModel) return;

    const positions = loadPositions();
    const cleanups = [];
    const view = { x: 0, y: 0, zoom: 1, minZoom: 0.25, maxZoom: 1.8 };
    const undo = [];
    const redo = [];
    let mapDrag = null;
    let pinDrag = null;
    let paintDrag = null;
    let pinEditing = false;
    let sourceEditing = false;
    let suppressMapBackgroundClick = false;
    let paintTool = "eraser";
    let brushColor = "#087f73";
    let brushSize = 28;
    let mapName = MAP_NAME;
    runtime = { cleanups };

    const listen = (target, type, handler, options) => {
      if (!target) return;
      target.addEventListener(type, handler, options);
      cleanups.push(() => target.removeEventListener(type, handler, options));
    };
    const setStatus = (message) => {
      const status = root.querySelector("[data-map-state]");
      if (status) status.textContent = message;
    };
    const updateHistoryButtons = () => {
      const undoButton = root.querySelector("[data-map-undo]");
      const redoButton = root.querySelector("[data-map-redo]");
      if (undoButton) undoButton.disabled = !undo.length;
      if (redoButton) redoButton.disabled = !redo.length;
    };
    const rememberMapSnapshot = () => {
      undo.push(sourceCanvas.toDataURL("image/png"));
      if (undo.length > 8) undo.shift();
      redo.length = 0;
      updateHistoryButtons();
    };
    const drawSource = async (source) => {
      const objectUrl = source instanceof Blob ? URL.createObjectURL(source) : null;
      try {
        const image = await loadImage(objectUrl || source);
        sourceContext.save();
        sourceContext.fillStyle = "#ffffff";
        sourceContext.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
        sourceContext.drawImage(image, 0, 0, MAP_WIDTH, MAP_HEIGHT);
        sourceContext.restore();
      } finally {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      }
    };
    const persistMap = async (message) => {
      try {
        await writeStoredMap(await canvasBlob(sourceCanvas), mapName);
        publishRealtimeChange("source");
        setStatus(message);
      } catch {
        setStatus("지도는 수정됐지만 브라우저 저장소에 보관하지 못했습니다. PNG로 저장해 주세요.");
      }
    };
    const initializeMap = async () => {
      try {
        const stored = await readStoredMap();
        if (stored?.blob) {
          mapName = stored.name || MAP_NAME;
          await drawSource(stored.blob);
          setStatus("이 기기에 저장된 원본 지도와 핀 위치를 불러왔습니다.");
          return;
        }
      } catch {}
      try {
        await drawSource(MAP_SOURCE);
      } catch {
        setStatus("원본 지도를 불러오지 못했습니다. 새로고침 후 다시 확인해 주세요.");
      }
    };
    const applyPositions = () => {
      root.querySelectorAll("[data-map-pin]").forEach((pin) => {
        const fallback = LOCATIONS[pin.dataset.mapPin];
        const point = positions[pin.dataset.mapPin] || defaultPlacement(fallback);
        pin.style.setProperty("--pin-x", `${point.x}%`);
        pin.style.setProperty("--pin-y", `${point.y}%`);
        const line = root.querySelector(`[data-map-line="${pin.dataset.mapPin}"]`);
        if (line) {
          line.setAttribute("x1", String(point.anchorX));
          line.setAttribute("y1", String(point.anchorY));
          line.setAttribute("x2", String(point.x));
          line.setAttribute("y2", String(point.y));
        }
        const anchor = root.querySelector(`[data-map-anchor="${pin.dataset.mapPin}"]`);
        if (anchor) {
          anchor.style.setProperty("--anchor-x", `${point.anchorX}%`);
          anchor.style.setProperty("--anchor-y", `${point.anchorY}%`);
        }
      });
    };
    const syncSourceId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    let syncChannel = null;
    const replacePositions = (nextPositions) => {
      Object.keys(positions).forEach((id) => delete positions[id]);
      Object.entries(nextPositions || {}).forEach(([id, point]) => {
        const placement = normalizePlacement(id, point);
        if (placement) positions[id] = placement;
      });
      applyPositions();
    };
    const applyRealtimeChange = async (message) => {
      if (!message || message.sourceId === syncSourceId) return;
      if (message.type === "positions") {
        replacePositions(message.positions);
        setStatus("핀과 기준점 변경사항을 실시간으로 반영했습니다.");
        return;
      }
      if (message.type !== "source") return;
      try {
        const stored = await readStoredMap();
        if (!stored?.blob) return;
        mapName = stored.name || MAP_NAME;
        await drawSource(stored.blob);
        setStatus("원본 지도 변경사항을 실시간으로 반영했습니다.");
      } catch {}
    };
    const publishRealtimeChange = (type, payload = {}) => {
      const message = { sourceId: syncSourceId, type, ...payload, savedAt: Date.now() };
      try { syncChannel?.postMessage(message); } catch {}
      try { localStorage.setItem(MAP_REALTIME_KEY, JSON.stringify(message)); } catch {}
    };
    if (typeof BroadcastChannel !== "undefined") {
      try {
        syncChannel = new BroadcastChannel(MAP_REALTIME_CHANNEL);
        listen(syncChannel, "message", (event) => void applyRealtimeChange(event.data));
        cleanups.push(() => syncChannel?.close());
      } catch {}
    }
    listen(window, "storage", (event) => {
      if (event.key === PIN_STORAGE_KEY) {
        replacePositions(loadPositions());
        setStatus("핀과 기준점 변경사항을 실시간으로 반영했습니다.");
        return;
      }
      if (event.key !== MAP_REALTIME_KEY || !event.newValue) return;
      try { void applyRealtimeChange(JSON.parse(event.newValue)); } catch {}
    });
    const clampView = () => {
      const width = canvas.offsetWidth * view.zoom;
      const height = canvas.offsetHeight * view.zoom;
      view.x = width <= viewport.clientWidth ? (viewport.clientWidth - width) / 2 : clamp(view.x, viewport.clientWidth - width, 0);
      view.y = height <= viewport.clientHeight ? (viewport.clientHeight - height) / 2 : clamp(view.y, viewport.clientHeight - height, 0);
    };
    const applyView = () => {
      clampView();
      root.style.setProperty("--map-inverse-zoom", String(1 / view.zoom));
      canvas.style.transform = `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.zoom})`;
    };
    const fitMap = () => {
      view.minZoom = Math.min(viewport.clientWidth / canvas.offsetWidth, viewport.clientHeight / canvas.offsetHeight, 1);
      view.zoom = view.minZoom;
      view.x = 0;
      view.y = 0;
      applyView();
    };
    const zoomBy = (amount) => {
      const oldZoom = view.zoom;
      const nextZoom = clamp(oldZoom + amount, view.minZoom, view.maxZoom);
      const centerX = viewport.clientWidth / 2;
      const centerY = viewport.clientHeight / 2;
      const mapX = (centerX - view.x) / oldZoom;
      const mapY = (centerY - view.y) / oldZoom;
      view.zoom = nextZoom;
      view.x = centerX - mapX * nextZoom;
      view.y = centerY - mapY * nextZoom;
      applyView();
    };
    const presentationMode = isPresentationMode();
    const presentationButton = root.querySelector("[data-map-presentation]");
    const screenBounds = (screenInfo = window.screen) => ({
      left: Number(screenInfo?.availLeft ?? screenInfo?.left ?? 0),
      top: Number(screenInfo?.availTop ?? screenInfo?.top ?? 0),
      width: Math.max(960, Number(screenInfo?.availWidth ?? screenInfo?.width ?? 1440)),
      height: Math.max(640, Number(screenInfo?.availHeight ?? screenInfo?.height ?? 900)),
    });
    const presentationUrl = () => {
      const url = new URL(window.location.href);
      url.searchParams.set(PRESENTATION_QUERY_KEY, "1");
      url.hash = "";
      return url.toString();
    };
    const positionPresentationWindow = (popup, screenInfo) => {
      const bounds = screenBounds(screenInfo);
      try {
        popup.moveTo(bounds.left, bounds.top);
        popup.resizeTo(bounds.width, bounds.height);
        popup.focus();
      } catch {}
    };
    const openPresentationWindow = async () => {
      const initial = screenBounds();
      const features = `popup=yes,resizable=yes,scrollbars=no,left=${initial.left},top=${initial.top},width=${initial.width},height=${initial.height}`;
      const popup = window.open(presentationUrl(), PRESENTATION_WINDOW_NAME, features);
      if (!popup) {
        setStatus("발표 화면을 열지 못했습니다. 브라우저의 팝업 허용 설정을 확인해 주세요.");
        return;
      }
      positionPresentationWindow(popup, window.screen);
      let targetScreen = null;
      let openedOnOtherScreen = false;
      if (typeof window.getScreenDetails === "function") {
        try {
          const details = await window.getScreenDetails();
          const screens = Array.from(details?.screens || []);
          const otherScreen = screens.find((screen) => screen !== details.currentScreen) || null;
          targetScreen = otherScreen || details.currentScreen || null;
          openedOnOtherScreen = Boolean(otherScreen);
        } catch {}
      }
      if (popup.closed) return;
      if (targetScreen) positionPresentationWindow(popup, targetScreen);
      setStatus(openedOnOtherScreen
        ? "관제지도 발표 화면을 다른 모니터에 열었습니다. 지도 변경사항도 실시간 반영됩니다."
        : "관제지도 전용 발표 창을 열었습니다. 필요하면 창을 발표 모니터로 옮겨 주세요.");
    };
    if (presentationMode) {
      const suppressed = [];
      let presentationNode = root;
      while (presentationNode.parentElement) {
        const parent = presentationNode.parentElement;
        Array.from(parent.children).forEach((sibling) => {
          if (sibling === presentationNode || !(sibling instanceof HTMLElement)) return;
          suppressed.push({
            element: sibling,
            inert: sibling.hasAttribute("inert"),
            ariaHidden: sibling.getAttribute("aria-hidden"),
          });
          sibling.inert = true;
          sibling.setAttribute("aria-hidden", "true");
        });
        if (parent === document.body) break;
        presentationNode = parent;
      }
      root.classList.add("is-map-presentation");
      document.documentElement.classList.add("has-map-presentation");
      document.body?.classList.add("has-map-presentation");
      cleanups.push(() => {
        suppressed.forEach(({ element, inert, ariaHidden }) => {
          if (inert) element.setAttribute("inert", "");
          else element.removeAttribute("inert");
          if (ariaHidden === null) element.removeAttribute("aria-hidden");
          else element.setAttribute("aria-hidden", ariaHidden);
        });
        document.documentElement.classList.remove("has-map-presentation");
        document.body?.classList.remove("has-map-presentation");
      });
    }
    listen(presentationButton, "click", () => {
      if (!presentationMode) {
        void openPresentationWindow();
        return;
      }
      if (window.opener) {
        window.close();
        return;
      }
      const url = new URL(window.location.href);
      url.searchParams.delete(PRESENTATION_QUERY_KEY);
      window.location.replace(url.toString());
    });
    const selectLocation = (placeId) => {
      const location = activeModel.locations.find((item) => item.id === placeId);
      if (!location) return;
      activeModel.selectedPlaceId = placeId;
      root.querySelectorAll("[data-map-pin]").forEach((pin) => pin.classList.toggle("is-selected", pin.dataset.mapPin === placeId));
      const detail = root.querySelector("[data-map-detail]");
      if (detail) detail.innerHTML = detailHtml(location);
      applyStatusFilter(root.dataset.mapFilter || "all");
    };
    const clearLocationSelection = () => {
      activeModel.selectedPlaceId = "";
      root.querySelectorAll("[data-map-pin]").forEach((pin) => pin.classList.remove("is-selected"));
      const detail = root.querySelector("[data-map-detail]");
      if (detail) detail.innerHTML = detailHtml(null);
      applyStatusFilter(root.dataset.mapFilter || "all");
      setStatus("도크·안벽 밖을 선택해 위치 선택을 해제했습니다.");
    };
    const applyStatusFilter = (filter = "all") => {
      root.dataset.mapFilter = filter;
      root.querySelectorAll("[data-map-filter]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.mapFilter === filter));
      });
      root.querySelectorAll("[data-map-pin]").forEach((pin) => {
        const matches = filter === "all" || pin.dataset.mapWorkState === filter;
        pin.classList.toggle("is-filter-muted", !matches && !pin.classList.contains("is-selected"));
      });
    };
    const setPinEditing = (enabled) => {
      pinEditing = enabled;
      root.classList.toggle("is-pin-editing", pinEditing);
      const button = root.querySelector("[data-map-edit]");
      if (button) {
        button.setAttribute("aria-pressed", String(pinEditing));
        button.textContent = pinEditing ? "편집 완료" : "핀·기준점 편집";
      }
      root.querySelectorAll("[data-map-anchor]").forEach((anchor) => {
        anchor.tabIndex = pinEditing ? 0 : -1;
        anchor.setAttribute("aria-hidden", String(!pinEditing));
        if (pinEditing) anchor.setAttribute("role", "button");
        else anchor.removeAttribute("role");
      });
      const hint = root.querySelector("[data-map-hint]");
      if (hint && !sourceEditing) hint.textContent = pinEditing
        ? "이름 배너 또는 작은 기준점을 끌어 위치 조정"
        : "지도를 터치해 이동 · 핀을 눌러 위치 선택";
    };
    const setSourceEditing = (enabled) => {
      sourceEditing = enabled;
      if (sourceEditing) setPinEditing(false);
      root.classList.toggle("is-source-editing", sourceEditing);
      const panel = root.querySelector("[data-map-editor]");
      const button = root.querySelector("[data-map-source-edit]");
      const hint = root.querySelector("[data-map-hint]");
      if (panel) panel.hidden = !sourceEditing;
      if (button) {
        button.setAttribute("aria-expanded", String(sourceEditing));
        button.textContent = sourceEditing ? "지도 편집 닫기" : "원본 지도 편집";
      }
      if (hint) hint.textContent = sourceEditing ? "지도에 직접 그리기 · 흰색 지우개로 색상 제거" : "지도를 터치해 이동 · 핀을 눌러 위치 선택";
      setStatus(sourceEditing ? "원본 지도 편집 모드입니다. 브러시 도구를 선택해 지도에 직접 표시하세요." : "원본 지도 편집을 닫았습니다. 지도 이동과 핀 선택을 사용할 수 있습니다.");
    };
    const setPaintTool = (tool) => {
      paintTool = tool;
      root.querySelectorAll("[data-map-tool]").forEach((button) => {
        const active = button.dataset.mapTool === paintTool;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    };
    const paintPoint = (event) => {
      const rect = sourceCanvas.getBoundingClientRect();
      return {
        x: clamp((event.clientX - rect.left) / rect.width * MAP_WIDTH, 0, MAP_WIDTH),
        y: clamp((event.clientY - rect.top) / rect.height * MAP_HEIGHT, 0, MAP_HEIGHT),
      };
    };
    const drawSegment = (from, to) => {
      const color = paintTool === "eraser" ? "#ffffff" : brushColor;
      sourceContext.save();
      sourceContext.globalCompositeOperation = "source-over";
      sourceContext.strokeStyle = color;
      sourceContext.fillStyle = color;
      sourceContext.lineWidth = brushSize;
      sourceContext.lineCap = "round";
      sourceContext.lineJoin = "round";
      sourceContext.beginPath();
      sourceContext.moveTo(from.x, from.y);
      sourceContext.lineTo(to.x, to.y);
      sourceContext.stroke();
      if (from.x === to.x && from.y === to.y) {
        sourceContext.beginPath();
        sourceContext.arc(to.x, to.y, brushSize / 2, 0, Math.PI * 2);
        sourceContext.fill();
      }
      sourceContext.restore();
    };
    const restoreSnapshot = async (snapshot) => {
      await drawSource(snapshot);
      await persistMap("원본 지도 편집 이력을 적용했습니다.");
      updateHistoryButtons();
    };
    const exportPositions = () => {
      const zones = activeModel.locations.map((location) => {
        const point = positions[location.id] || defaultPlacement(LOCATIONS[location.id]);
        return {
          id: location.id,
          label: location.label,
          name: location.name,
          kind: location.kind,
          x: point.x,
          y: point.y,
          anchorX: point.anchorX,
          anchorY: point.anchorY,
        };
      });
      downloadBlob(new Blob([JSON.stringify({ version: 2, savedAt: new Date().toISOString(), zones }, null, 2)], { type: "application/json;charset=utf-8" }), "작업-구역-핀-좌표.json");
      setStatus("21개 위치의 핀과 기준점 좌표 JSON을 저장했습니다.");
    };
    const exportCombinedMap = async () => {
      try {
        if (document.fonts?.ready) await document.fonts.ready;
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = MAP_WIDTH;
        exportCanvas.height = MAP_HEIGHT;
        const context = exportCanvas.getContext("2d");
        context.drawImage(sourceCanvas, 0, 0, MAP_WIDTH, MAP_HEIGHT);
        activeModel.locations.forEach((location) => {
          const point = positions[location.id] || defaultPlacement(LOCATIONS[location.id]);
          const x = point.x / 100 * MAP_WIDTH;
          const y = point.y / 100 * MAP_HEIGHT;
          const anchorX = point.anchorX / 100 * MAP_WIDTH;
          const anchorY = point.anchorY / 100 * MAP_HEIGHT;
          const text = location.name;
          context.save();
          context.beginPath();
          context.moveTo(anchorX, anchorY);
          context.lineTo(x, y);
          context.strokeStyle = "#65aaa5";
          context.lineWidth = 5;
          context.lineCap = "round";
          context.stroke();
          context.beginPath();
          context.arc(anchorX, anchorY, 12, 0, Math.PI * 2);
          context.fillStyle = "#087f73";
          context.fill();
          context.lineWidth = 6;
          context.strokeStyle = "#ffffff";
          context.stroke();
          context.font = '800 34px "Malgun Gothic", sans-serif';
          const width = Math.max(150, context.measureText(text).width + 54);
          const height = 62;
          const left = clamp(x - width / 2, 18, MAP_WIDTH - width - 18);
          const top = clamp(y - height / 2, 18, MAP_HEIGHT - height - 18);
          context.shadowColor = "rgba(7, 22, 47, 0.28)";
          context.shadowBlur = 12;
          context.shadowOffsetY = 5;
          roundRect(context, left, top, width, height, 12);
          context.fillStyle = "#087f73";
          context.fill();
          context.shadowColor = "transparent";
          context.lineWidth = 5;
          context.strokeStyle = "#ffffff";
          context.stroke();
          context.fillStyle = "#ffffff";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(text, left + width / 2, top + height / 2 + 1);
          context.restore();
        });
        downloadBlob(await canvasBlob(exportCanvas), "작업-구역-관제지도-4K.png");
        setStatus("현재 핀 위치를 포함한 4K 관제지도 PNG를 저장했습니다.");
      } catch {
        setStatus("핀 포함 4K PNG를 만들지 못했습니다.");
      }
    };

    applyPositions();
    void initializeMap();
    listen(root, "click", (event) => {
      const pin = event.target.closest("[data-map-pin]");
      if (pin && !pinDrag && !sourceEditing) selectLocation(pin.dataset.mapPin);
      else if (event.target.closest("[data-map-canvas]") && !pinEditing && !sourceEditing && !suppressMapBackgroundClick) clearLocationSelection();
      const filter = event.target.closest("[data-map-filter]")?.dataset.mapFilter;
      if (filter) applyStatusFilter(filter);
      const zoom = event.target.closest("[data-map-zoom]")?.dataset.mapZoom;
      if (zoom && !sourceEditing) zoomBy(zoom === "in" ? 0.18 : -0.18);
      if (event.target.closest("[data-map-fit]") && !sourceEditing) fitMap();
      if (event.target.closest("[data-map-edit]")) {
        if (sourceEditing) setSourceEditing(false);
        setPinEditing(!pinEditing);
        setStatus(pinEditing ? "이름 배너와 작은 기준점을 각각 원하는 위치로 끌어 놓으세요." : "핀과 기준점 위치가 이 기기에 저장됐습니다.");
      }
      if (event.target.closest("[data-map-source-edit]")) setSourceEditing(!sourceEditing);
      const tool = event.target.closest("[data-map-tool]")?.dataset.mapTool;
      if (tool) {
        setPaintTool(tool);
        setStatus(tool === "eraser" ? "흰색 지우개를 선택했습니다." : tool === "eyedropper" ? "지도에서 가져올 색상을 눌러 주세요." : "브러시를 선택했습니다.");
      }
      const colorChoice = event.target.closest("[data-map-color-choice]")?.dataset.mapColorChoice;
      if (colorChoice) {
        brushColor = colorChoice;
        const colorInput = root.querySelector("[data-map-color]");
        if (colorInput) colorInput.value = colorChoice;
        setPaintTool("brush");
      }
      if (event.target.closest("[data-map-undo]") && undo.length) {
        const current = sourceCanvas.toDataURL("image/png");
        const previous = undo.pop();
        redo.push(current);
        if (redo.length > 8) redo.shift();
        void restoreSnapshot(previous);
      }
      if (event.target.closest("[data-map-redo]") && redo.length) {
        const current = sourceCanvas.toDataURL("image/png");
        const next = redo.pop();
        undo.push(current);
        if (undo.length > 8) undo.shift();
        void restoreSnapshot(next);
      }
      if (event.target.closest("[data-map-reset]")) {
        rememberMapSnapshot();
        mapName = MAP_NAME;
        void drawSource(MAP_SOURCE).then(async () => {
          try {
            await deleteStoredMap();
            setStatus("원본 지도를 파란 영역이 제거된 기본 흰색 지도로 초기화했습니다.");
          } catch {
            setStatus("화면의 지도는 초기화했지만 저장된 지도는 지우지 못했습니다.");
          }
        });
      }
      if (event.target.closest("[data-map-save-source]")) {
        void canvasBlob(sourceCanvas).then((blob) => {
          downloadBlob(blob, "수정-원본-지도-4K.png");
          setStatus("핀을 제외한 수정 원본 지도 4K PNG를 저장했습니다.");
        }).catch(() => setStatus("수정 원본 지도 PNG를 만들지 못했습니다."));
      }
      if (event.target.closest("[data-map-export-png]")) void exportCombinedMap();
      if (event.target.closest("[data-map-export-json]")) exportPositions();
    });
    listen(root.querySelector("[data-map-color]"), "input", (event) => {
      brushColor = event.target.value;
      setPaintTool("brush");
    });
    listen(root.querySelector("[data-map-brush]"), "input", (event) => {
      brushSize = Number(event.target.value);
      const value = root.querySelector("[data-map-brush-value]");
      if (value) value.textContent = String(brushSize);
    });
    listen(root.querySelector("[data-map-file]"), "change", async (event) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      try {
        rememberMapSnapshot();
        mapName = file.name;
        await drawSource(file);
        await persistMap(`${file.name}을 원본 지도로 불러와 이 기기에 저장했습니다.`);
      } catch {
        setStatus("선택한 이미지를 원본 지도로 불러오지 못했습니다.");
      }
    });
    listen(root.querySelector("[data-map-import-json]"), "change", async (event) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        const zones = Array.isArray(parsed?.zones) ? parsed.zones : [];
        let imported = 0;
        zones.forEach((zone) => {
          const id = String(zone?.id || "");
          const placement = normalizePlacement(id, {
            x: zone?.x,
            y: zone?.y,
            anchorX: zone?.anchorX ?? positions[id]?.anchorX,
            anchorY: zone?.anchorY ?? positions[id]?.anchorY,
          });
          if (!placement) return;
          positions[id] = placement;
          imported += 1;
        });
        if (!imported) throw new Error("No valid zones");
        savePositions(positions);
        publishRealtimeChange("positions", { positions: { ...positions } });
        applyPositions();
        setStatus(`${file.name}에서 ${imported}개 위치의 핀과 기준점 좌표를 불러왔습니다.`);
      } catch {
        setStatus("핀 좌표 JSON을 읽지 못했습니다.");
      }
    });
    listen(sourceCanvas, "pointerdown", (event) => {
      if (!sourceEditing) return;
      event.preventDefault();
      const point = paintPoint(event);
      if (paintTool === "eyedropper") {
        const pixel = sourceContext.getImageData(Math.floor(point.x), Math.floor(point.y), 1, 1).data;
        brushColor = `#${[pixel[0], pixel[1], pixel[2]].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
        const colorInput = root.querySelector("[data-map-color]");
        if (colorInput) colorInput.value = brushColor;
        setPaintTool("brush");
        setStatus(`${brushColor} 색상을 지도에서 추출했습니다.`);
        return;
      }
      rememberMapSnapshot();
      sourceCanvas.setPointerCapture(event.pointerId);
      paintDrag = { pointerId: event.pointerId, point };
      drawSegment(point, point);
    });
    listen(sourceCanvas, "pointermove", (event) => {
      if (!paintDrag || paintDrag.pointerId !== event.pointerId) return;
      event.preventDefault();
      const point = paintPoint(event);
      drawSegment(paintDrag.point, point);
      paintDrag.point = point;
    });
    const finishPaint = (event) => {
      if (!paintDrag || paintDrag.pointerId !== event.pointerId) return;
      if (sourceCanvas.hasPointerCapture(event.pointerId)) sourceCanvas.releasePointerCapture(event.pointerId);
      paintDrag = null;
      void persistMap("수정한 원본 지도를 이 기기에 자동 저장했습니다.");
    };
    listen(sourceCanvas, "pointerup", finishPaint);
    listen(sourceCanvas, "pointercancel", finishPaint);
    listen(viewport, "pointerdown", (event) => {
      if (sourceEditing) return;
      const pin = event.target.closest("[data-map-pin]");
      const anchor = event.target.closest("[data-map-anchor]");
      const interactive = event.target.closest("button, a, input, select, textarea");
      const marker = anchor || pin;
      if (marker && pinEditing) {
        event.preventDefault();
        event.stopPropagation();
        pinDrag = {
          marker,
          placeId: marker.dataset.mapAnchor || marker.dataset.mapPin,
          kind: anchor ? "anchor" : "pin",
          pointerId: event.pointerId,
        };
        marker.setPointerCapture(event.pointerId);
        return;
      }
      if (interactive || (event.pointerType === "mouse" && event.button !== 0)) return;
      mapDrag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        x: view.x,
        y: view.y,
        moved: false,
        startedOnCanvas: Boolean(event.target.closest("[data-map-canvas]")),
      };
      viewport.setPointerCapture(event.pointerId);
      root.classList.add("is-panning");
    });
    listen(viewport, "pointermove", (event) => {
      if (pinDrag?.pointerId === event.pointerId) {
        const rect = canvas.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left) / rect.width * 100, 0, 100);
        const y = clamp((event.clientY - rect.top) / rect.height * 100, 0, 100);
        const line = root.querySelector(`[data-map-line="${pinDrag.placeId}"]`);
        if (pinDrag.kind === "anchor") {
          pinDrag.marker.style.setProperty("--anchor-x", `${x}%`);
          pinDrag.marker.style.setProperty("--anchor-y", `${y}%`);
          if (line) {
            line.setAttribute("x1", String(x));
            line.setAttribute("y1", String(y));
          }
        } else {
          pinDrag.marker.style.setProperty("--pin-x", `${x}%`);
          pinDrag.marker.style.setProperty("--pin-y", `${y}%`);
          if (line) {
            line.setAttribute("x2", String(x));
            line.setAttribute("y2", String(y));
          }
        }
        return;
      }
      if (!mapDrag || mapDrag.pointerId !== event.pointerId) return;
      if (Math.hypot(event.clientX - mapDrag.startX, event.clientY - mapDrag.startY) > 5) mapDrag.moved = true;
      view.x = mapDrag.x + event.clientX - mapDrag.startX;
      view.y = mapDrag.y + event.clientY - mapDrag.startY;
      applyView();
    });
    const finishPointer = (event) => {
      if (pinDrag?.pointerId === event.pointerId) {
        const { marker, placeId, kind } = pinDrag;
        const current = positions[placeId] || defaultPlacement(LOCATIONS[placeId]);
        if (kind === "anchor") {
          current.anchorX = Number(parseFloat(marker.style.getPropertyValue("--anchor-x")).toFixed(3));
          current.anchorY = Number(parseFloat(marker.style.getPropertyValue("--anchor-y")).toFixed(3));
        } else {
          current.x = Number(parseFloat(marker.style.getPropertyValue("--pin-x")).toFixed(3));
          current.y = Number(parseFloat(marker.style.getPropertyValue("--pin-y")).toFixed(3));
        }
        positions[placeId] = current;
        savePositions(positions);
        publishRealtimeChange("positions", { positions: { ...positions } });
        if (marker.hasPointerCapture(event.pointerId)) marker.releasePointerCapture(event.pointerId);
        pinDrag = null;
        setStatus(`${LOCATIONS[placeId].name} ${kind === "anchor" ? "기준점" : "핀 배너"} 위치를 저장하고 열린 화면에 반영했습니다.`);
      }
      if (mapDrag?.pointerId === event.pointerId) {
        if (mapDrag.moved) {
          suppressMapBackgroundClick = true;
          setTimeout(() => { suppressMapBackgroundClick = false; }, 0);
        } else if (mapDrag.startedOnCanvas) clearLocationSelection();
        if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
        mapDrag = null;
        root.classList.remove("is-panning");
      }
    };
    listen(viewport, "pointerup", finishPointer);
    listen(viewport, "pointercancel", finishPointer);
    listen(viewport, "keydown", (event) => {
      if (sourceEditing) return;
      const delta = 30;
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "ArrowLeft") view.x += delta;
      if (event.key === "ArrowRight") view.x -= delta;
      if (event.key === "ArrowUp") view.y += delta;
      if (event.key === "ArrowDown") view.y -= delta;
      applyView();
    });
    const handleResize = () => fitMap();
    listen(window, "resize", handleResize);
    requestAnimationFrame(fitMap);
  }

  return {
    LOCATIONS,
    MAP_SOURCE,
    PIN_STORAGE_KEY,
    buildModel,
    destroy,
    hydrate,
    recordPlaceId,
    render,
  };
}));
