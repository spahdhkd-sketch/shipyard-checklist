const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const {
  BULK_SCOPE_FILTERED,
  BULK_SCOPE_SELECTED,
  buildMaterialBulkResultSummary,
  buildMaterialBulkReview,
  createMaterialBulkSelectionState,
  reconcileMaterialBulkSelection,
  setMaterialBulkSelected,
} = require("../assets/js/material-bulk-selection.js");

const sourcePath = path.join(__dirname, "../assets/js/material-bulk-selection.js");
const browserRuntime = {};
const source = fs.readFileSync(sourcePath, "utf8");
vm.runInNewContext(source, { globalThis: browserRuntime });
assert.strictEqual(typeof browserRuntime.MaterialBulkSelection.buildMaterialBulkReview, "function");
assert.doesNotMatch(source, /\b(?:prompt|confirm|alert)\s*\(/, "domain module must not invoke browser prompt APIs");

const records = [
  { id: "m1", status: "접수", materialName: "볼트" },
  { id: "m2", status: "확인중", materialName: "밸브" },
  { id: "m3", status: "완료", materialName: "와셔" },
];

let selection = createMaterialBulkSelectionState(["m2", "m1", "m2", " "]);
assert.deepStrictEqual(selection, { selectedById: { m1: true, m2: true } });

selection = setMaterialBulkSelected(selection, "m3", true);
assert.deepStrictEqual(selection, { selectedById: { m1: true, m2: true, m3: true } });
selection = setMaterialBulkSelected(selection, "m2", false);
assert.deepStrictEqual(selection, { selectedById: { m1: true, m3: true } });

const selectedReview = buildMaterialBulkReview({
  records,
  filteredRecords: [records[0], records[1]],
  selectionState: selection,
  scope: BULK_SCOPE_SELECTED,
  targetStatus: "완료",
  memo: "입고 확인",
  memoRequired: true,
  validStatuses: ["접수", "확인중", "완료"],
});
assert.strictEqual(selectedReview.scope, BULK_SCOPE_SELECTED);
assert.deepStrictEqual(selectedReview.targetIds, ["m1", "m3"], "selected scope remains keyed by ID when a filter changes");
assert.deepStrictEqual(selectedReview.excludedRecords.map((record) => record.id), ["m2"]);
assert.strictEqual(selectedReview.targetCount, 2);
assert.deepStrictEqual(
  selectedReview.beforeAfter.map((item) => [item.id, item.beforeStatus, item.afterStatus, item.changed]),
  [["m1", "접수", "완료", true], ["m3", "완료", "완료", false]],
);
assert.strictEqual(selectedReview.memoRequired, true);
assert.strictEqual(selectedReview.memoProvided, true);
assert.strictEqual(selectedReview.canSubmit, true);

const filteredReview = buildMaterialBulkReview({
  records,
  filteredRecords: [records[1], records[2], records[1]],
  selectionState: selection,
  scope: BULK_SCOPE_FILTERED,
  targetStatus: "확인중",
  memo: "",
  memoRequired: true,
  validStatuses: ["접수", "확인중", "완료"],
});
assert.strictEqual(filteredReview.scope, BULK_SCOPE_FILTERED);
assert.deepStrictEqual(filteredReview.targetIds, ["m2", "m3"], "filtered scope is explicit and deduplicates record IDs");
assert.deepStrictEqual(filteredReview.excludedRecords.map((record) => record.id), ["m1"]);
assert.strictEqual(filteredReview.canSubmit, false);
assert.deepStrictEqual(filteredReview.validationErrors, ["memo_required"]);

const stale = reconcileMaterialBulkSelection(
  createMaterialBulkSelectionState(["m1", "gone", "m3"]),
  [records[0], records[2]],
);
assert.deepStrictEqual(stale.selectionState, { selectedById: { m1: true, m3: true } });
assert.deepStrictEqual(stale.staleIds, ["gone"]);

const staleReview = buildMaterialBulkReview({
  records,
  filteredRecords: records,
  selectionState: createMaterialBulkSelectionState(["m1", "gone"]),
  scope: BULK_SCOPE_SELECTED,
  targetStatus: "완료",
  memo: "처리",
});
assert.deepStrictEqual(staleReview.targetIds, ["m1"]);
assert.deepStrictEqual(staleReview.staleSelectedIds, ["gone"]);

const resultSummary = buildMaterialBulkResultSummary(selectedReview, [
  { id: "m1", ok: true },
  { id: "m3", ok: false, error: "권한 없음" },
]);
assert.strictEqual(resultSummary.targetCount, 2);
assert.strictEqual(resultSummary.succeededCount, 1);
assert.strictEqual(resultSummary.failedCount, 1);
assert.strictEqual(resultSummary.pendingCount, 0);
assert.strictEqual(resultSummary.partialFailure, true);
assert.deepStrictEqual(resultSummary.failedRecords.map((item) => [item.id, item.error]), [["m3", "권한 없음"]]);

console.log("material bulk selection tests passed");
