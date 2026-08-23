const assert = require("assert");
const collection = require("../assets/js/paged-collection.js");

function makeRows(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `row-${String(index + 1).padStart(3, "0")}`,
    shipNo: `S-${index % 10}`,
    team: index % 2 ? "의장팀" : "도장팀",
    status: index % 4 === 0 ? "완료" : "진행 중",
    workDate: `2026-08-${String(index % 28 + 1).padStart(2, "0")}`,
    workName: index % 3 ? "배관 작업" : "용접 작업",
    rank: Math.floor(index / 2),
  }));
}

function walkPages(rows, options) {
  const ids = [];
  const cursors = [];
  let cursor = null;
  do {
    const page = collection.queryPagedCollection(rows, Object.assign({}, options, { cursor }));
    ids.push(...page.items.map((row) => row.id));
    cursors.push(page.nextCursor);
    cursor = page.nextCursor;
  } while (cursor);
  return { ids, cursors };
}

assert.deepStrictEqual(collection.normalizeFilters({}), {
  search: "",
  ship: "",
  team: "",
  status: "진행 중",
  date: "",
});

const filterRows = makeRows(30);
assert.deepStrictEqual(
  collection.filterCollectionRecords(filterRows, { search: "용접", ship: "S-2", team: "도장", status: "완료", date: "2026-08-13" }).map((row) => row.id),
  ["row-013"],
  "search, ship, team, status, and date filters should compose before rendering",
);
assert.strictEqual(collection.filterCollectionRecords(filterRows, {}).length, 22, "the default status filter should be 진행 중");
assert.strictEqual(collection.filterCollectionRecords(filterRows, { status: "전체" }).length, 30, "전체 should intentionally remove the status restriction");

const urlFilters = { search: "용접 A", ship: "S-2", team: "의장팀", status: "진행 중", date: "2026-08-13" };
assert.deepStrictEqual(collection.parseCollectionFilters(collection.serializeCollectionFilters(urlFilters)), urlFilters, "filters should round-trip through the URL query string");
assert.strictEqual(collection.parseCollectionFilters("").status, "진행 중", "missing URL status should use the active-work default");

const stableRows = [
  { id: "a", status: "진행 중", rank: 1 },
  { id: "b", status: "진행 중", rank: 0 },
  { id: "c", status: "진행 중", rank: 1 },
  { id: "d", status: "진행 중", rank: 0 },
];
assert.deepStrictEqual(
  collection.stableSortRecords(stableRows, (left, right) => left.rank - right.rank).map((row) => row.id),
  ["b", "d", "a", "c"],
  "equal sort keys should retain their input order",
);

for (const count of [0, 25, 26, 200, 500]) {
  const rows = makeRows(count).map((row) => Object.assign({}, row, { status: "진행 중" }));
  const first = collection.queryPagedCollection(rows, { filters: { status: "진행 중" } });
  assert.strictEqual(first.resultCount, count, `${count} records should report an exact result count`);
  assert.strictEqual(first.items.length, Math.min(count, 25), `${count} records should use 25-item pages`);
  assert.strictEqual(Boolean(first.nextCursor), count > 25, `${count} records should expose next cursor only when another page exists`);
  const walked = walkPages(rows, { filters: { status: "진행 중" }, cursorKey: "stable-test" });
  assert.deepStrictEqual(walked.ids, rows.map((row) => row.id), `${count} records should walk without omissions or duplicates`);
  assert.strictEqual(new Set(walked.cursors.filter(Boolean)).size, walked.cursors.filter(Boolean).length, `${count} records should produce stable distinct next cursors`);
  if (count > 25) {
    const second = collection.queryPagedCollection(rows, { filters: { status: "진행 중" }, cursor: walked.cursors[0], cursorKey: "stable-test" });
    const previous = collection.queryPagedCollection(rows, { filters: { status: "진행 중" }, cursor: second.previousCursor, cursorKey: "stable-test" });
    assert.deepStrictEqual(previous.items.map((row) => row.id), first.items.map((row) => row.id), `${count} records should navigate back with the previous cursor`);
  }
}

const cursorRows = makeRows(26).map((row) => Object.assign({}, row, { status: "진행 중" }));
const cursorFirst = collection.queryPagedCollection(cursorRows, { filters: { status: "진행 중" }, cursorKey: "filter-contract" });
const wrongFilterCursor = collection.queryPagedCollection(cursorRows, { filters: { status: "전체" }, cursor: cursorFirst.nextCursor, cursorKey: "filter-contract" });
assert.strictEqual(wrongFilterCursor.cursorValid, false, "a cursor must not cross a changed filter query");
assert.strictEqual(wrongFilterCursor.pageIndex, 0, "an invalid query cursor should safely return the first page");

const fiveHundredRows = makeRows(500).map((row) => Object.assign({}, row, { status: "진행 중" }));
const startedAt = process.hrtime.bigint();
const performanceWalk = walkPages(fiveHundredRows, { filters: { status: "진행 중" }, cursorKey: "performance-walk" });
const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
assert.strictEqual(performanceWalk.ids.length, 500, "500-record cursor walk should return every record");
assert.ok(elapsedMs < 1000, `500-record cursor walk should remain responsive (was ${elapsedMs.toFixed(1)}ms)`);

let state = collection.createPagedCollectionState();
state = collection.selectCollectionRecord(state, "row-010");
state = collection.openCollectionEditor(state);
let detail = collection.collectionDetail(fiveHundredRows, state);
assert.strictEqual(detail.selectedRecord.id, "row-010", "one selected record should drive the detail view");
assert.strictEqual(detail.editorRecord.id, "row-010", "one selected record should drive the editor view");
state = collection.selectCollectionRecord(state, "row-011");
detail = collection.collectionDetail(fiveHundredRows, state);
assert.strictEqual(detail.selectedRecord.id, "row-011", "selecting a new record should replace the old detail");
assert.strictEqual(detail.editorRecord, null, "selecting a new record should close the prior editor");
state = collection.setCollectionFilters(state, { ship: "S-2", status: "진행 중" });
assert.strictEqual(state.cursor, null, "changing filters should reset the page cursor");

const model = collection.buildPagedCollection(fiveHundredRows, { state: collection.openCollectionEditor(collection.selectCollectionRecord(collection.createPagedCollectionState(), "row-020"), "row-020") });
assert.strictEqual(model.items.length, 25, "collection model should page records before a caller renders them");
assert.strictEqual(model.editorRecord.id, "row-020", "collection model should expose only the selected editor record");

console.log(`paged collection tests passed; 500-record cursor walk=${elapsedMs.toFixed(1)}ms, pages=${performanceWalk.cursors.length}`);
