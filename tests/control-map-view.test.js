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
    { id: "one", placeId: "DOCK-1", shipNo: "2701", categoryLabel: "탱크 점검", status: "unregistered", warnings: 1 },
    { id: "two", locationId: "DOCK-H", shipNo: "3601", categoryLabel: "블록 탑재", status: "confirmed" },
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
assert.match(mapHtml, /data-map-fullscreen/);
assert.equal(mapView.MAP_SOURCE, "/assets/images/control-map-base-white.png");
assert.match(mapHtml, /작업지시서 장소 ID/);
assert.match(mapHtml, /control-map__pin-label/);
assert.match(mapHtml, /21개 도크·안벽/);
assert.doesNotMatch(mapHtml, /<i>[A-U]<\/i>/);
assert.doesNotMatch(mapHtml, /선택 구역/);

const dashboardHtml = dashboardView.renderDashboardView({ controlMapHtml: mapHtml });
assert.match(dashboardHtml, /class="control-map"/);
assert.ok(dashboardHtml.indexOf('class="control-map"') < dashboardHtml.indexOf('class="home-v4__grid"'));
assert.match(dashboardHtml, /data-action="open-latest-intake"/);

assert.match(mapSource, /Math\.min\(viewport\.clientWidth \/ canvas\.offsetWidth, viewport\.clientHeight \/ canvas\.offsetHeight, 1\)/);
assert.match(mapSource, /localStorage\.setItem\(PIN_STORAGE_KEY/);
assert.match(mapSource, /indexedDB\.open\(MAP_DATABASE/);
assert.match(mapSource, /writeStoredMap\(await canvasBlob\(sourceCanvas\)/);
assert.match(mapSource, /new BroadcastChannel\(MAP_REALTIME_CHANNEL\)/);
assert.match(mapSource, /localStorage\.setItem\(MAP_REALTIME_KEY/);
assert.match(mapSource, /root\.requestFullscreen/);
assert.match(mapSource, /pointerdown/);
assert.match(mapCss, /touch-action:\s*none/);
assert.match(mapCss, /scale\(var\(--map-inverse-zoom/);
assert.match(mapCss, /\.control-map__pin-label\s*\{/);
assert.match(mapCss, /\.control-map:fullscreen/);
assert.match(mapCss, /\.control-map__fullscreen\s*\{/);
assert.match(mapCss, /\.control-map__leaders line\s*\{/);
assert.match(mapCss, /\.control-map\.is-source-editing \.control-map__source/);
assert.match(appSource, /state\.adminMode && typeof CONTROL_MAP_VIEW\.render/);
assert.match(sw, /assets\/images\/control-map-4k\.png/);
assert.match(sw, /assets\/images\/control-map-base-white\.png/);
assert.match(sw, /control-map-view\.min\.js/);

console.log("control map view tests passed");
