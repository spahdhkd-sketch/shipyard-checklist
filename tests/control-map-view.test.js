const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const mapView = require(path.join(root, "assets/js/control-map-view.js"));
const dashboardView = require(path.join(root, "assets/js/dashboard-view.js"));
const mapSource = fs.readFileSync(path.join(root, "assets/js/control-map-view.js"), "utf8");
const mapCss = fs.readFileSync(path.join(root, "assets/css/30-feature-control-center.css"), "utf8");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");

assert.equal(Object.keys(mapView.LOCATIONS).length, 9);
assert.equal(mapView.recordPlaceId({ placeId: "DOCK-1" }), "DOCK-1");
assert.equal(mapView.recordPlaceId({ location: "H도크" }), "DOCK-H");
assert.equal(mapView.recordPlaceId({ place_id: "QUAY-J2" }), "QUAY-J2");

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
assert.equal((mapHtml.match(/data-map-pin=/g) || []).length, 9);
assert.match(mapHtml, /data-map-edit/);
assert.match(mapHtml, /data-map-fit/);
assert.match(mapHtml, /assets\/images\/control-map-4k\.png/);
assert.match(mapHtml, /작업지시서 장소 ID/);

const dashboardHtml = dashboardView.renderDashboardView({ controlMapHtml: mapHtml });
assert.match(dashboardHtml, /class="control-map"/);
assert.ok(dashboardHtml.indexOf('class="home-v4__grid"') < dashboardHtml.indexOf('class="control-map"'));

assert.match(mapSource, /Math\.min\(viewport\.clientWidth \/ canvas\.offsetWidth, viewport\.clientHeight \/ canvas\.offsetHeight, 1\)/);
assert.match(mapSource, /localStorage\.setItem\(PIN_STORAGE_KEY/);
assert.match(mapSource, /pointerdown/);
assert.match(mapCss, /touch-action:\s*none/);
assert.match(mapCss, /scale\(var\(--map-inverse-zoom/);
assert.match(sw, /assets\/images\/control-map-4k\.png/);
assert.match(sw, /control-map-view\.min\.js/);

console.log("control map view tests passed");
