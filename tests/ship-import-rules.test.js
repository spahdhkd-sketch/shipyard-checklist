const assert = require("node:assert");
const rules = require("../assets/js/ship-import-rules.js");

// header alias normalization
assert.strictEqual(rules.importHeaderKey("  호선 번호 "), "호선번호");
assert.strictEqual(rules.importHeaderKey("Ship No"), "shipno");

// importCell finds value by alias regardless of spacing/case
assert.strictEqual(rules.importCell({ "호선 번호": " 2491 " }, ["호선번호"]), "2491");
assert.strictEqual(rules.importCell({ "SHIP NO": "2491" }, ["shipNo"]), "2491");
assert.strictEqual(rules.importCell({ "기타": "x" }, ["호선번호"]), "");

// excel serial date conversion (45000 = 2023-03-15), out-of-range rejected
assert.strictEqual(rules.excelSerialToDate(45000), "2023-03-15");
assert.strictEqual(rules.excelSerialToDate(123), "");
assert.strictEqual(rules.excelSerialToDate("abc"), "");

// date normalization: serial, dotted, dashed, korean, invalid
assert.strictEqual(rules.normalizeImportDate("45000"), "2023-03-15");
assert.strictEqual(rules.normalizeImportDate("2026.6.11"), "2026-06-11");
assert.strictEqual(rules.normalizeImportDate("2026-06-11"), "2026-06-11");
assert.strictEqual(rules.normalizeImportDate("2026년 6월 1일"), "2026-06-01");
assert.strictEqual(rules.normalizeImportDate("없음"), "");
assert.strictEqual(rules.normalizeImportDate(""), "");

// row normalization with injected deps
const deps = {
  normalizeShipNo: (value) => String(value || "").trim().toUpperCase(),
  normalizeShipStageInput: (value) => (String(value || "").toLowerCase() === "탑재" ? "mounting" : ""),
};
const row = rules.normalizeShipImportRow({ "호선명": " h2491 ", "선종": "LNG", "상태": "탑재", "L/C": "2026.7.1" }, deps);
assert.deepStrictEqual(row, {
  no: "H2491", type: "LNG", processStage: "mounting",
  lcDate: "2026-07-01", stDate: "", clDate: "", dlDate: "",
});
assert.strictEqual(rules.normalizeShipImportRow({ "선종": "LNG" }, deps), null);

// date conflict detection against existing ships
const importedRows = [
  { no: "H1", lcDate: "2026-07-02", stDate: "", clDate: "", dlDate: "" },
  { no: "H2", lcDate: "2026-07-05", stDate: "", clDate: "", dlDate: "" },
  { no: "H9", lcDate: "2026-07-09", stDate: "", clDate: "", dlDate: "" },
];
const ships = [
  { no: "H1", lcDate: "2026-07-01T00:00:00" },
  { no: "H2", lcDate: "2026-07-05" },
];
const conflicts = rules.shipImportDateConflicts(importedRows, ships);
assert.deepStrictEqual(conflicts, [{ no: "H1", label: "L/C", before: "2026-07-01", after: "2026-07-02" }]);

// field table shape
assert.deepStrictEqual(rules.SHIP_IMPORT_DATE_FIELDS.map(([field]) => field), ["lcDate", "stDate", "clDate", "dlDate"]);

console.log("ship import rules tests passed");
