const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const appSource = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "app-v2.js"), "utf8");
const shipSelectStart = appSource.indexOf("function renderPledgeShipSelect");
const shipSelectEnd = appSource.indexOf("function renderSafetyPledgeChecklist");
const shipSelectSource = appSource.slice(shipSelectStart, shipSelectEnd);
const deliveryHelpers = appSource.match(/function shipDeliveryType[\s\S]*?function shipDeliveryDate[\s\S]*?\n    }/)[0];
const shipDeliveryMeta = Function(`${deliveryHelpers}\nreturn shipDeliveryMeta;`)();

test("ship selection uses the recorded delivery label instead of a fixed one", () => {
  assert.equal(shipSelectSource.includes("shipDeliveryMeta("), true);
  assert.equal(shipSelectSource.includes("D/L ${shipDeliveryDate"), false);
});

test("delivery metadata preserves C/L and D/L while leaving untyped ships neutral", () => {
  assert.equal(shipDeliveryMeta({ clDate: "2026-08-17" }), "C/L 2026-08-17");
  assert.equal(shipDeliveryMeta({ dlDate: "2026-08-18" }), "D/L 2026-08-18");
  assert.equal(shipDeliveryMeta({ deliveryDate: "2026-08-19" }), "2026-08-19");
});
