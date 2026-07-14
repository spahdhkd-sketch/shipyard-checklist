const assert = require("assert");

const {
  normalizePendingSyncQueue,
  pendingRowsForVersionRefresh,
  normalizeStatusRecords,
  normalizePendingPhotoUploads,
} = require("../assets/js/normalization-rules.js");

const FIXED = "2026-06-18T00:00:00.000Z";
const uid = (p) => `${p}-X`;
const now = () => FIXED;

// --- normalizePendingSyncQueue ---
let q = normalizePendingSyncQueue(
  [
    { type: "rows", keys: ["a", "a", "b"], rowIdsByKey: { a: [1] } },
    { type: "bad" },
    { type: "full" },
    { type: "rows", keys: [] },        // dropped: rows with no keys
    "garbage",
    { id: "keep", type: "rows", keys: ["c"], ownerWorkerId: "worker-2", attempts: -3, createdAt: "T0", nextRetryAt: "R" },
  ],
  { uid, now }
);
assert.strictEqual(q.length, 3);
assert.deepStrictEqual(q[0].keys, ["a", "b"]); // dedup + String
assert.strictEqual(q[0].id, "sync-X");          // injected uid
assert.strictEqual(q[0].createdAt, FIXED);       // injected now
assert.strictEqual(q[1].type, "full");           // full kept even w/o keys
assert.strictEqual(q[2].id, "keep");             // existing id kept
assert.strictEqual(q[2].attempts, 0);            // negative clamped to 0
assert.strictEqual(q[2].createdAt, "T0");        // existing createdAt kept
assert.strictEqual(q[2].nextRetryAt, "R");
assert.strictEqual(q[2].ownerWorkerId, "worker-2");
assert.deepStrictEqual(normalizePendingSyncQueue(null, { uid, now }), []);

const staleCachedRow = { id: "server-old", value: "stale" };
const offlinePendingRow = { id: "offline-1", value: "local pending" };
assert.deepStrictEqual(
  pendingRowsForVersionRefresh(
    "inspections",
    [staleCachedRow, offlinePendingRow],
    [{ type: "rows", keys: ["inspections"], rowIdsByKey: { inspections: ["offline-1"] } }],
  ),
  [offlinePendingRow],
);
assert.deepStrictEqual(
  pendingRowsForVersionRefresh(
    "inspections",
    [{ id: 7 }, { id: "8" }, { id: "9" }],
    [
      { type: "rows", keys: ["inspections"], rowIdsByKey: { inspections: [7] } },
      { type: "rows", keys: ["inspections"], rowIdsByKey: { inspections: ["8"] } },
    ],
  ),
  [{ id: 7 }, { id: "8" }],
);
assert.deepStrictEqual(pendingRowsForVersionRefresh("workers", [staleCachedRow], []), []);
assert.deepStrictEqual(
  pendingRowsForVersionRefresh("inspections", [staleCachedRow, offlinePendingRow], [{ type: "full" }]),
  [staleCachedRow, offlinePendingRow],
);

// --- normalizeStatusRecords ---
const STAT = ["접수", "조치중", "완료"];
const timeline = (rec, opt) => [{ status: rec.status, init: opt.initialStatus }];
let r = normalizeStatusRecords(
  [
    { status: "조치중", adminMemo: "  메모  " },
    { status: "이상한값" },        // falls back to statuses[0]
    null,                          // becomes {}
  ],
  STAT,
  { now, buildRecordTimeline: timeline }
);
assert.strictEqual(r.length, 3);
assert.strictEqual(r[0].status, "조치중");
assert.strictEqual(r[0].adminMemo, "메모");       // trimmed
assert.strictEqual(r[0].createdAt, FIXED);
assert.strictEqual(r[0].updatedAt, FIXED);
assert.strictEqual(r[0].completedAt, "");
assert.deepStrictEqual(r[0].statusHistory, [{ status: "조치중", init: "접수" }]);
assert.strictEqual(r[1].status, "접수");           // invalid -> first status
assert.strictEqual(r[2].status, "접수");           // null -> {} -> first status
// 기존 createdAt/updatedAt 보존
let r2 = normalizeStatusRecords([{ status: "완료", createdAt: "C0", updatedAt: "U0" }], STAT, { now, buildRecordTimeline: timeline });
assert.strictEqual(r2[0].createdAt, "C0");
assert.strictEqual(r2[0].updatedAt, "U0");

// --- normalizePendingPhotoUploads ---
let p = normalizePendingPhotoUploads(
  [
    { issueId: "i1", status: "uploading" },   // uploading -> failed
    { issueId: "i2", ownerWorkerId: "w2", status: "done", dataUrl: "D" },
    { noIssue: true },                         // dropped (no issueId)
  ],
  { uid, now, photoDataUrlForStorage: (v) => v || "EMPTY" }
);
assert.strictEqual(p.length, 2);
assert.strictEqual(p[0].id, "pendingPhoto-X");
assert.strictEqual(p[0].issueId, "i1");
assert.strictEqual(p[0].fileName, "photo-1.jpg");
assert.strictEqual(p[0].status, "failed");        // uploading coerced
assert.strictEqual(p[0].dataUrl, "EMPTY");        // injected transform
assert.strictEqual(p[0].createdAt, FIXED);
assert.strictEqual(p[1].status, "done");
assert.strictEqual(p[1].ownerWorkerId, "w2");
assert.strictEqual(p[1].dataUrl, "D");
assert.strictEqual(p[1].fileName, "photo-2.jpg"); // index-based default

console.log("normalization-rules tests passed");
