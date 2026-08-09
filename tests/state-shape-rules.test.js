const assert = require("assert");

const {
  dedupeChecklistItems,
  dedupeTools,
  dedupeShips,
  copyCategoryToolIds,
  migrateOldChecklists,
  removeRemoteDeletedRows,
  missingRemoteRowIds,
  reconciledRemoteDeletedRowIds,
  syncJobContainsDeletedRows,
  syncJobRequiresInspectionDeleteWins,
} = require("../assets/js/state-shape-rules.js");

// --- dedupeChecklistItems ---
let items = dedupeChecklistItems([
  { id: 1, categoryId: "c", text: "점검 A" },
  { id: 2, categoryId: "c", text: " 점검   A " }, // dup (whitespace-normalized) -> inactive
  { id: 3, categoryId: "c", text: "" },            // empty -> inactive
  { id: 4, categoryId: "c", text: "B", active: false }, // already inactive -> untouched
  { id: 5, categoryId: "d", text: "점검 A" },      // different category -> kept
]);
assert.strictEqual(items[0].active, undefined);
assert.strictEqual(items[1].active, false);
assert.strictEqual(items[2].active, false);
assert.strictEqual(items[3].active, false);
assert.strictEqual(items[4].active, undefined);
assert.deepStrictEqual(dedupeChecklistItems(null), []);

// --- dedupeTools ---
const norm = (n) => String(n || "").trim().toLowerCase();
const cmp = () => 0;
let tools = dedupeTools([
  { id: "t1", name: "Wire" },
  { id: "t2", name: " wire " },     // dup name -> deleted
  { id: "t3", name: "Sling" },
  { id: "t4", name: "", },           // no key -> untouched
  { id: "t5", name: "Gone", deleted: true }, // already deleted -> untouched
], { normalizeToolName: norm, compareToolWrittenOrder: cmp });
assert.strictEqual(tools.find((t) => t.id === "t1").deleted, undefined);
assert.strictEqual(tools.find((t) => t.id === "t2").deleted, true);
assert.strictEqual(tools.find((t) => t.id === "t3").deleted, undefined);
assert.strictEqual(tools.find((t) => t.id === "t4").deleted, undefined);
assert.strictEqual(tools.find((t) => t.id === "t5").deleted, true);

assert.deepStrictEqual(copyCategoryToolIds(
  ["tool-2", "tool-1", "tool-2", "deleted-tool", "", null],
  ["tool-1", "tool-2", "tool-3"],
), ["tool-2", "tool-1"]);
assert.deepStrictEqual(copyCategoryToolIds(null, ["tool-1"]), []);
assert.deepStrictEqual(copyCategoryToolIds(["tool-1"], null), []);

// --- dedupeShips (in-place mutation + reference preserved) ---
const ships = [
  { no: " H1 " },
  { no: "H1" },                                  // dup -> dropped
  { no: "H2", deliveryType: "C/L", deliveryDate: "2026-07-01" },
  { no: "" },                                    // empty -> dropped
];
const ref = ships[0];
let out = dedupeShips(ships, { normalizeShipNo: (n) => String(n || "").trim(), workflowStages: ["mounting", "outfitting"] });
assert.strictEqual(out.length, 2);
assert.strictEqual(out[0].no, "H1");             // trimmed in place
assert.strictEqual(out[0] === ref, true);        // reference preserved
assert.strictEqual(out[0].processStage, "mounting");
assert.strictEqual(out[1].clDate, "2026-07-01"); // C/L -> clDate from deliveryDate
assert.strictEqual(out[1].dlDate, "");
assert.deepStrictEqual(dedupeShips(null, {}), []);

// --- migrateOldChecklists ---
const r = migrateOldChecklists(
  { cat1: { label: "용접", items: [{ text: "불꽃 확인", risk: "high" }, { text: "환기" }] } },
  { uid: (p) => `${p}-X`, colors: ["#123456"] }
);
assert.strictEqual(r.categories.length, 1);
assert.strictEqual(r.categories[0].id, "cat1");
assert.strictEqual(r.categories[0].label, "용접");
assert.strictEqual(r.categories[0].color, "#123456");
assert.strictEqual(r.sections[0].id, "cat1_default");
assert.strictEqual(r.items.length, 2);
assert.strictEqual(r.items[0].required, true);    // high -> required
assert.strictEqual(r.items[1].risk, "medium");    // default
assert.strictEqual(r.items[1].required, false);
assert.strictEqual(r.items[1].id, "item-X");      // injected uid
assert.deepStrictEqual(migrateOldChecklists(null, {}), { categories: [], sections: [], items: [] });

const deletedInspection = removeRemoteDeletedRows({
  rows: [{ id: "i-test" }, { id: "i-keep" }],
  archivedInspections: [{ id: "i-old" }, { id: "i-test" }],
  inspectionItems: [
    { id: "ii-test-1", inspectionId: "i-test" },
    { id: "ii-keep", inspectionId: "i-keep" },
  ],
  selectedHistoryIds: ["i-test", "i-keep"],
  historyDetailId: "i-test",
}, "inspections", ["i-test"]);
assert.deepStrictEqual(deletedInspection.rows.map((row) => row.id), ["i-keep"]);
assert.deepStrictEqual(deletedInspection.archivedInspections.map((row) => row.id), ["i-old"]);
assert.deepStrictEqual(deletedInspection.inspectionItems.map((row) => row.id), ["ii-keep"]);
assert.deepStrictEqual(deletedInspection.removedItemIds, ["ii-test-1"]);
assert.deepStrictEqual(deletedInspection.selectedHistoryIds, ["i-keep"]);
assert.strictEqual(deletedInspection.historyDetailId, null);
assert.strictEqual(deletedInspection.changed, true);

const deletedGeneric = removeRemoteDeletedRows({ rows: [{ id: "a" }, { id: "b" }] }, "ships", "a");
assert.deepStrictEqual(deletedGeneric.rows.map((row) => row.id), ["b"]);
assert.strictEqual(deletedGeneric.changed, true);

const ignoredDelete = removeRemoteDeletedRows({ rows: [{ id: "a" }] }, "inspections", "");
assert.deepStrictEqual(ignoredDelete.rows.map((row) => row.id), ["a"]);
assert.strictEqual(ignoredDelete.changed, false);

assert.deepStrictEqual(missingRemoteRowIds(
  [{ id: "i-deleted" }, { id: "i-existing" }, { id: "i-pending" }],
  ["i-existing"],
  ["i-pending"],
), ["i-deleted"]);
assert.deepStrictEqual(missingRemoteRowIds(null, [], []), []);

assert.deepStrictEqual(reconciledRemoteDeletedRowIds({
  cachedRows: [{ id: "i-missing" }, { id: "i-existing" }, { id: "i-pending-deleted" }],
  tombstoneIds: ["i-pending-deleted", "i-not-cached"],
  existingIds: ["i-existing"],
  pendingIds: ["i-pending-deleted"],
}), ["i-pending-deleted", "i-missing"]);
assert.deepStrictEqual(reconciledRemoteDeletedRowIds({
  cachedRows: [{ id: "i-missing" }, { id: "i-pending-deleted" }],
  tombstoneIds: ["i-pending-deleted"],
  existingIds: [],
  pendingIds: ["i-pending-deleted"],
  preserveUnconfirmedMissing: true,
}), ["i-pending-deleted"]);

assert.strictEqual(syncJobContainsDeletedRows({
  type: "rows",
  rowIdsByKey: { inspections: ["i-keep", "i-deleted"] },
}, "inspections", ["i-deleted"]), true);
assert.strictEqual(syncJobContainsDeletedRows({
  type: "rows",
  rowIdsByKey: { inspections: ["i-keep"] },
}, "inspections", ["i-deleted"]), false);
assert.strictEqual(syncJobContainsDeletedRows({ type: "full" }, "inspections", ["i-deleted"]), true);
assert.strictEqual(syncJobContainsDeletedRows({ type: "full" }, "", ["i-deleted"]), false);
assert.strictEqual(syncJobRequiresInspectionDeleteWins({ type: "full", keys: [] }), true);
assert.strictEqual(syncJobRequiresInspectionDeleteWins({ type: "rows", keys: ["inspections"] }), true);
assert.strictEqual(syncJobRequiresInspectionDeleteWins({ type: "rows", keys: ["inspectionItems"] }), true);
assert.strictEqual(syncJobRequiresInspectionDeleteWins({ type: "rows", keys: ["workPrepRecords"] }), false);
assert.strictEqual(syncJobRequiresInspectionDeleteWins(null), false);

console.log("state-shape-rules tests passed");
