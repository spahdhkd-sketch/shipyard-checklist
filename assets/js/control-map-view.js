(function attachControlMapView(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.ShipyardControlMapView = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function buildControlMapView() {
  const PIN_STORAGE_KEY = "shipyardSafetyV1.controlMapPinPositions.v1";
  const LOCATIONS = Object.freeze({
    "DOCK-H": { name: "H도크", kind: "dock", x: 67, y: 27 },
    "DOCK-8": { name: "8도크", kind: "dock", x: 29, y: 43 },
    "DOCK-9": { name: "9도크", kind: "dock", x: 28, y: 47 },
    "DOCK-1": { name: "1도크", kind: "dock", x: 57, y: 66 },
    "DOCK-2": { name: "2도크", kind: "dock", x: 69, y: 68 },
    "DOCK-3": { name: "3도크", kind: "dock", x: 55, y: 62 },
    "DOCK-4": { name: "4도크", kind: "dock", x: 70, y: 83 },
    "DOCK-5": { name: "5도크", kind: "dock", x: 70, y: 87 },
    "QUAY-J2": { name: "J-2안벽", kind: "quay", x: 77, y: 75 },
  });
  const PLACE_ALIASES = Object.freeze(Object.entries(LOCATIONS).reduce((aliases, [id, location]) => {
    aliases[id] = id;
    aliases[location.name.toUpperCase()] = id;
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
    const status = String(record.status || "").trim().toLowerCase();
    if (Number(record.warnings || 0) > 0 || status === "unregistered" || status.includes("미등록")) return "danger";
    if (["used", "confirmed", "완료", "점검 완료", "확정"].includes(status)) return "ok";
    return "warn";
  }

  function strongestSeverity(records) {
    if (records.some((record) => recordSeverity(record) === "danger")) return "danger";
    if (records.some((record) => recordSeverity(record) === "warn")) return "warn";
    return records.length ? "ok" : "idle";
  }

  function normalizeRecord(record = {}) {
    return {
      id: String(record.id || ""),
      placeId: recordPlaceId(record),
      shipNo: String(record.shipNo || record.ship_no || "-").trim() || "-",
      task: String(record.categoryLabel || record.task || record.workLabel || "작업지시").trim() || "작업지시",
      status: String(record.statusLabel || record.status || "확인 필요").trim() || "확인 필요",
      warnings: Math.max(0, Number(record.warnings || 0)),
      people: Array.isArray(record.workerIds) ? record.workerIds.length : Math.max(0, Number(record.people || 0)),
      submitted: Math.max(0, Number(record.submitted || 0)),
      total: Math.max(0, Number(record.total || 0)),
      severity: recordSeverity(record),
    };
  }

  function buildModel(input = {}) {
    const records = (Array.isArray(input.records) ? input.records : []).map(normalizeRecord);
    const locations = Object.entries(LOCATIONS).map(([id, location]) => {
      const workOrders = records.filter((record) => record.placeId === id);
      return { id, ...location, workOrders, severity: strongestSeverity(workOrders) };
    });
    const matchedCount = locations.reduce((total, location) => total + location.workOrders.length, 0);
    const preferred = String(input.selectedPlaceId || activeModel?.selectedPlaceId || "");
    const selectedPlaceId = LOCATIONS[preferred]
      ? preferred
      : locations.find((location) => location.workOrders.length)?.id || "DOCK-H";
    return {
      canEdit: Boolean(input.canEdit),
      locations,
      matchedCount,
      unmatchedCount: Math.max(0, records.length - matchedCount),
      selectedPlaceId,
    };
  }

  function detailHtml(location) {
    if (!location) return "";
    const orders = location.workOrders;
    const people = orders.reduce((total, order) => total + order.people, 0);
    const warnings = orders.reduce((total, order) => total + order.warnings, 0);
    const orderList = orders.length
      ? `<div class="control-map__order-list">${orders.slice(0, 4).map((order) => `<article class="control-map__order is-${esc(order.severity)}">
          <span>${esc(order.shipNo)}</span>
          <div><strong>${esc(order.task)}</strong><small>${esc(order.status)}${order.total ? ` · 점검 ${esc(order.submitted)}/${esc(order.total)}` : ""}</small></div>
        </article>`).join("")}${orders.length > 4 ? `<p>외 ${orders.length - 4}건</p>` : ""}</div>`
      : `<div class="control-map__empty">장소 ID가 연결된 오늘 작업지시서가 없습니다.</div>`;
    return `<div class="control-map__detail-head"><span>선택 구역</span><h3>${esc(location.name)}</h3><em class="is-${esc(location.severity)}">${location.severity === "danger" ? "조치 필요" : location.severity === "warn" ? "확인 필요" : location.severity === "ok" ? "정상" : "작업 없음"}</em></div>
      <dl class="control-map__detail-stats"><div><dt>작업지시</dt><dd>${orders.length}건</dd></div><div><dt>참여</dt><dd>${people}명</dd></div><div><dt>위험</dt><dd>${warnings}건</dd></div></dl>
      ${orderList}
      <button class="btn control-map__detail-action" data-view="manage" data-manage-center-card="operations" type="button">작업지시서에서 확인</button>`;
  }

  function render(input = {}) {
    activeModel = buildModel(input);
    const selected = activeModel.locations.find((location) => location.id === activeModel.selectedPlaceId);
    const activeLocations = activeModel.locations.filter((location) => location.workOrders.length).length;
    return `<section class="control-map" data-control-map aria-labelledby="controlMapTitle">
      <header class="control-map__heading">
        <div><span>LIVE WORK AREA</span><h2 id="controlMapTitle">작업구역 관제지도</h2><p>작업지시서 장소 ID를 도크 핀과 연결해 오늘의 작업을 표시합니다.</p></div>
        <dl><div><dt>작업 구역</dt><dd>${activeLocations}</dd></div><div><dt>연결 작업</dt><dd>${activeModel.matchedCount}</dd></div>${activeModel.unmatchedCount ? `<div class="is-warn"><dt>장소 미지정</dt><dd>${activeModel.unmatchedCount}</dd></div>` : ""}</dl>
      </header>
      <div class="control-map__toolbar">
        <p data-map-state>${activeModel.canEdit ? "관리자 위치 편집을 켜면 핀을 끌어 놓을 수 있습니다." : "핀을 선택하면 해당 구역의 작업을 확인할 수 있습니다."}</p>
        <div>
          ${activeModel.canEdit ? '<button class="btn-light" data-map-edit type="button" aria-pressed="false">핀 위치 편집</button>' : ""}
          <div class="control-map__zoom" role="group" aria-label="지도 확대 축소">
            <button class="btn-light" data-map-zoom="out" type="button" aria-label="지도 축소">−</button>
            <button class="btn-light" data-map-fit type="button">전체 보기</button>
            <button class="btn-light" data-map-zoom="in" type="button" aria-label="지도 확대">＋</button>
          </div>
        </div>
      </div>
      <div class="control-map__layout">
        <div class="control-map__viewport" data-map-viewport tabindex="0" aria-label="작업구역 지도. 터치하거나 마우스로 끌어 이동할 수 있습니다.">
          <div class="control-map__canvas" data-map-canvas>
            <img src="/assets/images/control-map-4k.png" alt="도크와 안벽을 표시한 작업구역 배치도" draggable="false" />
            <div class="control-map__pins">${activeModel.locations.map((location) => `<button class="control-map__pin is-${esc(location.severity)}${location.id === activeModel.selectedPlaceId ? " is-selected" : ""}" data-map-pin="${esc(location.id)}" style="--pin-x:${location.x}%;--pin-y:${location.y}%" type="button" aria-label="${esc(location.name)} ${location.workOrders.length}건">
                <span>${location.workOrders.length || "·"}</span><b>${esc(location.name)}</b>
              </button>`).join("")}</div>
          </div>
          <span class="control-map__pan-hint">지도를 터치해 이동 · 핀을 눌러 구역 선택</span>
        </div>
        <aside class="control-map__detail" data-map-detail aria-live="polite">${detailHtml(selected)}</aside>
      </div>
    </section>`;
  }

  function loadPositions() {
    try {
      const parsed = JSON.parse(localStorage.getItem(PIN_STORAGE_KEY) || "{}");
      return Object.fromEntries(Object.entries(parsed).filter(([id, point]) => (
        LOCATIONS[id]
        && Number.isFinite(Number(point?.x))
        && Number.isFinite(Number(point?.y))
        && Number(point.x) >= 0 && Number(point.x) <= 100
        && Number(point.y) >= 0 && Number(point.y) <= 100
      )));
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
    if (!root || !viewport || !canvas || !activeModel) return;

    const positions = loadPositions();
    const cleanups = [];
    const view = { x: 0, y: 0, zoom: 1, minZoom: 0.25, maxZoom: 1.55 };
    let mapDrag = null;
    let pinDrag = null;
    let editing = false;
    runtime = { cleanups };

    const listen = (target, type, handler, options) => {
      target.addEventListener(type, handler, options);
      cleanups.push(() => target.removeEventListener(type, handler, options));
    };
    const applyPositions = () => {
      root.querySelectorAll("[data-map-pin]").forEach((pin) => {
        const fallback = LOCATIONS[pin.dataset.mapPin];
        const point = positions[pin.dataset.mapPin] || fallback;
        pin.style.setProperty("--pin-x", `${point.x}%`);
        pin.style.setProperty("--pin-y", `${point.y}%`);
      });
    };
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
    const selectLocation = (placeId) => {
      const location = activeModel.locations.find((item) => item.id === placeId);
      if (!location) return;
      activeModel.selectedPlaceId = placeId;
      root.querySelectorAll("[data-map-pin]").forEach((pin) => pin.classList.toggle("is-selected", pin.dataset.mapPin === placeId));
      const detail = root.querySelector("[data-map-detail]");
      if (detail) detail.innerHTML = detailHtml(location);
    };

    applyPositions();
    listen(root, "click", (event) => {
      const pin = event.target.closest("[data-map-pin]");
      if (pin && !pinDrag) selectLocation(pin.dataset.mapPin);
      const zoom = event.target.closest("[data-map-zoom]")?.dataset.mapZoom;
      if (zoom) zoomBy(zoom === "in" ? 0.18 : -0.18);
      if (event.target.closest("[data-map-fit]")) fitMap();
      const editButton = event.target.closest("[data-map-edit]");
      if (editButton) {
        editing = !editing;
        root.classList.toggle("is-pin-editing", editing);
        editButton.setAttribute("aria-pressed", String(editing));
        editButton.textContent = editing ? "위치 편집 완료" : "핀 위치 편집";
        const status = root.querySelector("[data-map-state]");
        if (status) status.textContent = editing ? "핀을 원하는 위치로 끌어 놓으세요. 위치는 이 기기에 자동 저장됩니다." : "핀 위치가 이 기기에 저장됐습니다.";
      }
    });
    listen(viewport, "pointerdown", (event) => {
      const pin = event.target.closest("[data-map-pin]");
      if (pin && editing) {
        event.preventDefault();
        event.stopPropagation();
        pinDrag = { pin, pointerId: event.pointerId, moved: false };
        pin.setPointerCapture(event.pointerId);
        return;
      }
      if (pin || (event.pointerType === "mouse" && event.button !== 0)) return;
      mapDrag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: view.x, y: view.y };
      viewport.setPointerCapture(event.pointerId);
      root.classList.add("is-panning");
    });
    listen(viewport, "pointermove", (event) => {
      if (pinDrag?.pointerId === event.pointerId) {
        const rect = canvas.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left) / rect.width * 100, 0, 100);
        const y = clamp((event.clientY - rect.top) / rect.height * 100, 0, 100);
        pinDrag.pin.style.setProperty("--pin-x", `${x}%`);
        pinDrag.pin.style.setProperty("--pin-y", `${y}%`);
        pinDrag.moved = true;
        return;
      }
      if (!mapDrag || mapDrag.pointerId !== event.pointerId) return;
      view.x = mapDrag.x + event.clientX - mapDrag.startX;
      view.y = mapDrag.y + event.clientY - mapDrag.startY;
      applyView();
    });
    const finishPointer = (event) => {
      if (pinDrag?.pointerId === event.pointerId) {
        const pin = pinDrag.pin;
        const x = parseFloat(pin.style.getPropertyValue("--pin-x"));
        const y = parseFloat(pin.style.getPropertyValue("--pin-y"));
        positions[pin.dataset.mapPin] = { x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) };
        savePositions(positions);
        if (pin.hasPointerCapture(event.pointerId)) pin.releasePointerCapture(event.pointerId);
        pinDrag = null;
      }
      if (mapDrag?.pointerId === event.pointerId) {
        if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
        mapDrag = null;
        root.classList.remove("is-panning");
      }
    };
    listen(viewport, "pointerup", finishPointer);
    listen(viewport, "pointercancel", finishPointer);
    listen(viewport, "keydown", (event) => {
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
    PIN_STORAGE_KEY,
    buildModel,
    destroy,
    hydrate,
    recordPlaceId,
    render,
  };
}));
