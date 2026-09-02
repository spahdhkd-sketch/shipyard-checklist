const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const mapView = require(path.join(root, "assets/js/control-map-view.js"));
const dashboardView = require(path.join(root, "assets/js/dashboard-view.js"));
const mapSource = fs.readFileSync(path.join(root, "assets/js/control-map-view.js"), "utf8");
const mapCss = fs.readFileSync(path.join(root, "assets/css/30-feature-control-center.css"), "utf8");
const appSource = fs.readFileSync(path.join(root, "assets/js/app-v2.js"), "utf8");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");

assert.equal(Object.keys(mapView.LOCATIONS).length, 21);
assert.equal(mapView.recordPlaceId({ placeId: "DOCK-1" }), "DOCK-1");
assert.equal(mapView.recordPlaceId({ location: "H도크" }), "DOCK-H");
assert.equal(mapView.recordPlaceId({ place_id: "QUAY-J2" }), "QUAY-J2");
assert.equal(mapView.recordPlaceId({ location: "A구역" }), "DOCK-1");
assert.equal(mapView.recordPlaceId({ location: "M-5안벽" }), "QUAY-M5");
assert.equal(mapView.recordPlaceId({ location: "ZONE-U" }), "QUAY-H5");

const model = mapView.buildModel({
  canEdit: true,
  records: [
    { id: "one", placeId: "DOCK-1", shipNo: "2701", categoryLabel: "압력 테스트", requiresTripleInspection: true },
    { id: "two", locationId: "DOCK-H", shipNo: "3601", categoryLabel: "블록 탑재", inspectionComplete: true, total: 2, submitted: 2 },
    { id: "three", placeId: "UNKNOWN", shipNo: "9999", categoryLabel: "장소 미지정" },
  ],
});

assert.equal(model.matchedCount, 2);
assert.equal(model.unmatchedCount, 1);
assert.equal(model.locations.find((location) => location.id === "DOCK-1").severity, "danger");
assert.equal(model.locations.find((location) => location.id === "DOCK-H").severity, "ok");

const mapHtml = mapView.render({ canEdit: true, records: model.locations.flatMap((location) => location.workOrders) });
assert.equal((mapHtml.match(/data-map-pin=/g) || []).length, 21);
assert.equal((mapHtml.match(/data-map-line=/g) || []).length, 21);
assert.equal((mapHtml.match(/data-map-anchor=/g) || []).length, 21);
assert.match(mapHtml, /data-map-edit/);
assert.match(mapHtml, /data-map-source-edit/);
assert.match(mapHtml, /data-map-source/);
assert.match(mapHtml, /data-map-tool="eraser"/);
assert.match(mapHtml, /data-map-export-json/);
assert.match(mapHtml, /data-map-export-png/);
assert.match(mapHtml, /data-map-fit/);
assert.match(mapHtml, /data-map-presentation/);
assert.match(mapHtml, /발표 화면 열기/);
assert.match(mapHtml, /핀·기준점 편집/);
assert.doesNotMatch(mapHtml, /data-map-fullscreen/);
assert.equal(mapView.MAP_SOURCE, "/assets/images/control-map-base-white.png");
assert.match(mapHtml, /작업지시서 장소 ID/);
assert.match(mapHtml, /control-map__pin-label/);
assert.match(mapHtml, /class="control-map__legend"/);
assert.match(mapHtml, /빨강 · 3중점검/);
assert.match(mapHtml, /노랑 · 1인 작업/);
assert.match(mapHtml, /초록 · 점검 완료/);
assert.match(mapHtml, /압력·CO2 system·Leak test·비일상 작업/);
assert.match(mapHtml, /21개 도크·안벽/);
assert.doesNotMatch(mapHtml, /<i>[A-U]<\/i>/);
assert.doesNotMatch(mapHtml, /선택 구역/);

const attentionHtml = mapView.render({
  canEdit: true,
  records: [{
    id: "solo-triple",
    placeId: "DOCK-1",
    shipNo: "2701",
    categoryLabel: "탱크 점검",
    status: "preparing",
    leaderWorkerId: "worker-1",
    workerIds: ["worker-1"],
    otherTeamWorkerIds: [],
    requiresTripleInspection: true,
    isNonRoutine: true,
    isForeignSolo: true,
  }],
});
assert.match(attentionHtml, /control-map__status-filters/);
assert.match(attentionHtml, /data-map-filter="all"/);
assert.match(attentionHtml, /data-map-filter="danger"/);
assert.match(attentionHtml, /data-map-work-state="danger"/);
assert.match(attentionHtml, /control-map__order-badges/);
assert.match(attentionHtml, /외국인 1인 작업/);
assert.match(attentionHtml, /3중점검/);
assert.match(attentionHtml, /비일상작업/);
assert.match(attentionHtml, /<dt>참여<\/dt><dd>1명<\/dd>/);

const ordinaryHtml = mapView.render({
  canEdit: true,
  records: [{
    id: "ordinary",
    placeId: "DOCK-2",
    shipNo: "2702",
    categoryLabel: "블록 탑재",
    inspectionComplete: true,
    total: 2,
    submitted: 2,
    leaderWorkerId: "worker-1",
    workerIds: ["worker-2"],
    otherTeamWorkerIds: [],
  }],
});
assert.doesNotMatch(ordinaryHtml, /control-map__order-badge is-solo/);
assert.doesNotMatch(ordinaryHtml, /control-map__order-badge is-triple/);
assert.match(ordinaryHtml, /data-map-work-state="ok"/);

const soloHtml = mapView.render({
  selectedPlaceId: "DOCK-3",
  records: [{ id: "solo", placeId: "DOCK-3", leaderWorkerId: "worker-1", total: 1 }],
});
assert.match(soloHtml, /data-map-work-state="warn"/);
assert.match(soloHtml, /control-map__order-badge is-solo">1인 작업</);

const pendingHtml = mapView.render({
  records: [{ id: "pending", placeId: "DOCK-4", leaderWorkerId: "worker-1", workerIds: ["worker-2"], total: 2, submitted: 1 }],
});
assert.match(pendingHtml, /data-map-work-state="idle"/);

const deselectedHtml = mapView.render({ selectedPlaceId: "", records: [] });
assert.match(deselectedHtml, /data-map-selection-empty/);
assert.match(deselectedHtml, /선택 안 함/);
assert.doesNotMatch(deselectedHtml, /control-map__pin[^>]*is-selected/);

const presentationHtml = mapView.render({ canEdit: true, presentationMode: true, records: [] });
assert.match(presentationHtml, /class="control-map is-map-presentation"/);
assert.match(presentationHtml, /발표 화면 닫기/);

const dashboardHtml = dashboardView.renderDashboardView({ isAdmin: true, controlMapHtml: mapHtml });
assert.match(dashboardHtml, /class="control-map"/);
assert.ok(dashboardHtml.indexOf('class="home-dashboard__shortcuts"') < dashboardHtml.indexOf('class="control-map"'));
assert.match(dashboardHtml, /data-action="open-latest-intake"/);

assert.match(mapSource, /Math\.min\(viewport\.clientWidth \/ canvas\.offsetWidth, viewport\.clientHeight \/ canvas\.offsetHeight, 1\)/);
assert.match(mapSource, /localStorage\.setItem\(PIN_STORAGE_KEY/);
assert.match(mapSource, /indexedDB\.open\(MAP_DATABASE/);
assert.match(mapSource, /writeStoredMap\(await canvasBlob\(sourceCanvas\)/);
assert.match(mapSource, /new BroadcastChannel\(MAP_REALTIME_CHANNEL\)/);
assert.match(mapSource, /localStorage\.setItem\(MAP_REALTIME_KEY/);
assert.match(mapSource, /window\.open\(/);
assert.match(mapSource, /window\.getScreenDetails/);
assert.match(mapSource, /PRESENTATION_QUERY_KEY/);
assert.match(mapSource, /sibling\.inert = true/);
assert.match(mapSource, /anchorX/);
assert.match(mapSource, /anchorY/);
assert.match(mapSource, /clearLocationSelection/);
assert.match(mapSource, /startedOnCanvas:\s*Boolean\(event\.target\.closest\("\[data-map-canvas\]"\)\)/);
assert.match(mapSource, /else if \(mapDrag\.startedOnCanvas\) clearLocationSelection\(\)/);
assert.match(appSource, /place_id: row\.placeId \|\| null/);
assert.match(appSource, /requires_triple_inspection/);
assert.match(appSource, /is_foreign/);
assert.match(mapSource, /closest\("button, a, input, select, textarea"\)/);
assert.match(mapSource, /pointerdown/);
assert.match(mapCss, /touch-action:\s*none/);
assert.match(mapCss, /scale\(var\(--map-inverse-zoom/);
assert.match(mapCss, /\.control-map__pin-label\s*\{/);
assert.match(mapCss, /\.control-map\.is-map-presentation/);
assert.match(mapCss, /\.control-map__presentation\s*\{/);
assert.match(mapCss, /\.control-map__legend\s*\{/);
assert.match(mapCss, /--control-map-danger-accent:\s*#f16d62/);
assert.match(mapCss, /--control-map-warn-accent:\s*#f3a53a/);
assert.match(mapCss, /--control-map-ok-accent:\s*#53c7b8/);
assert.match(mapCss, /\.control-map__order-badge\.is-triple,[\s\S]*\.control-map__order-badge\.is-non-routine[\s\S]*var\(--control-map-danger-accent\)/);
assert.match(mapCss, /\.control-map__order-badge\.is-solo[\s\S]*var\(--control-map-warn-accent\)/);
assert.match(mapCss, /\.work-type-classification-badges \.is-triple,[\s\S]*\.work-type-classification-badges \.is-non-routine[\s\S]*var\(--control-map-danger-accent\)/);
assert.match(mapCss, /\.control-map\.is-pin-editing \.control-map__anchor/);
assert.match(mapCss, /\.control-map__leaders line\s*\{/);
assert.match(mapCss, /\.control-map\.is-source-editing \.control-map__source/);
assert.match(mapCss, /@keyframes control-map-edge-pulse/);
assert.match(mapCss, /prefers-reduced-motion:\s*reduce/);
assert.match(mapCss, /\.control-map__layout\s*\{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s*300px;/);
assert.match(mapCss, /@media\s*\(max-width:\s*920px\)[\s\S]*?\.control-map__layout\s*\{[\s\S]*?display:\s*block;/);
assert.match(appSource, /state\.adminMode && typeof CONTROL_MAP_VIEW\.render/);
assert.match(sw, /assets\/images\/control-map-4k\.png/);
assert.match(sw, /assets\/images\/control-map-base-white\.png/);
assert.match(sw, /control-map-view\.min\.js/);

console.log("control map view tests passed");
