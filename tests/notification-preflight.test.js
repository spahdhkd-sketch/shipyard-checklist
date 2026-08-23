const assert = require("assert");
const {
  buildNotificationPreflight,
  normalizeNotificationPreview,
} = require("../assets/js/notification-preflight.js");

const now = Date.parse("2026-08-15T00:10:00.000Z");
const preflight = buildNotificationPreflight({
  now,
  cooldownMs: 5 * 60 * 1000,
  selectedWorkerIds: ["ready", "excluded", "recent", "unregistered", "missing"],
  recipients: [
    { id: "ready", eligible: true, subscriptionCount: 2 },
    { id: "excluded", eligible: false, exclusionReason: "completed" },
    { id: "recent", eligible: true, subscriptionCount: 1, lastSentAt: "2026-08-15T00:08:00.000Z" },
    { id: "unregistered", eligible: true, subscriptionCount: 0 },
  ],
  message: { title: "  안전 알림  ", body: " 확인해 주세요. ", url: "/pledge.html" },
  acknowledged: true,
});

assert.deepStrictEqual(preflight.counts, {
  selected: 5,
  eligible: 3,
  targeted: 1,
  excluded: 2,
  recentlySent: 1,
  unregistered: 1,
});
assert.deepStrictEqual(preflight.selected.map((row) => row.id), ["ready", "excluded", "recent", "unregistered", "missing"]);
assert.deepStrictEqual(preflight.targeted.map((row) => row.id), ["ready"]);
assert.deepStrictEqual(preflight.excluded.map((row) => [row.id, row.reason]), [
  ["excluded", "completed"],
  ["missing", "not_found"],
]);
assert.deepStrictEqual(preflight.recentlySent.map((row) => row.id), ["recent"]);
assert.deepStrictEqual(preflight.unregistered.map((row) => row.id), ["unregistered"]);
assert.deepStrictEqual(preflight.preview, {
  title: "안전 알림",
  body: "확인해 주세요.",
  url: "/pledge.html",
});
assert.strictEqual(preflight.acknowledgment.required, true);
assert.strictEqual(preflight.acknowledgment.accepted, true);
assert.strictEqual(preflight.canSend, true);

const blocked = buildNotificationPreflight({
  recipients: [{ id: "worker-1", eligible: true, registered: true }],
  selectedWorkerIds: ["worker-1"],
  message: { title: "안내", body: "내용" },
  acknowledged: false,
});
assert.strictEqual(blocked.canSend, false);
assert.strictEqual(blocked.disabledReason, "acknowledgment_required");

const emptyMessage = buildNotificationPreflight({
  recipients: [{ id: "worker-1", eligible: true, registered: true }],
  selectedWorkerIds: ["worker-1"],
  message: { title: "", body: "내용" },
  acknowledged: true,
});
assert.strictEqual(emptyMessage.canSend, false);
assert.strictEqual(emptyMessage.disabledReason, "message_required");

assert.deepStrictEqual(normalizeNotificationPreview({
  title: ` ${"가".repeat(90)} `,
  body: ` ${"나".repeat(230)} `,
  url: " javascript:alert(1) ",
}), {
  title: "가".repeat(80),
  body: "나".repeat(220),
  url: "/",
});

console.log("notification preflight tests passed");
