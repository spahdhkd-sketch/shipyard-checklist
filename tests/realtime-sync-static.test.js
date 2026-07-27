const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const app = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "app-v2.js"), "utf8");

function expectMatch(pattern, message) {
  assert.match(app, pattern, message);
}

expectMatch(
  /const REALTIME_REMOTE_KEYS = new Set\(\[[\s\S]*"ships"[\s\S]*"inspections"[\s\S]*"unsafeIssues"[\s\S]*"missingMaterials"[\s\S]*"workPrepRecords"[\s\S]*\]\)/,
  "Realtime must subscribe only to the five high-value top-level tables",
);
assert.doesNotMatch(
  app.match(/const REALTIME_REMOTE_KEYS = new Set\(\[[\s\S]*?\]\);/)?.[0] || "",
  /"workers"|"inspectionItems"/,
  "Realtime must not expose worker credentials or ingest high-volume inspection item events",
);
expectMatch(
  /function startRemoteSync\(\) \{[\s\S]*startRemoteRealtime\(\)[\s\S]*startRemotePolling\(\)/,
  "boot synchronization must start Realtime and retain polling fallback",
);
expectMatch(
  /realtimeRemoteConfigs\(\)\.forEach\(\(config\) =>[\s\S]*postgres_changes[\s\S]*handleRemoteRealtimeChange\(config, payload\)/,
  "Realtime events must be applied row-by-row instead of triggering a full pull",
);
expectMatch(
  /eventType === "DELETE"[\s\S]*\.filter\(\(row\) => String\(row\?\.id \|\| ""\) !== id\)/,
  "Realtime DELETE must remove the local row",
);
expectMatch(
  /\.gt\(column, cursor\)[\s\S]*\.order\(column, \{ ascending: true \}\)/,
  "Reconnect reconciliation must query rows after the per-table cursor",
);
expectMatch(
  /async function handleSyncWake\(\)[\s\S]*ensureRemoteRealtimeConnection\(\)[\s\S]*pullRemote\(\{ force: true/,
  "tab wake must restore Realtime and refresh non-Realtime tables",
);
expectMatch(
  /status === "CHANNEL_ERROR" \|\| status === "TIMED_OUT" \|\| status === "CLOSED"[\s\S]*startRemotePolling\(\)[\s\S]*scheduleRemoteRealtimeRetry\(\)/,
  "Realtime failures must start polling and schedule a reconnect",
);
expectMatch(
  /state\.remotePullQueuedOptions = \{[\s\S]*queueMicrotask\(\(\) => pullRemote\(queuedOptions\)\)/,
  "a pull requested during an in-flight pull must run afterward",
);
expectMatch(
  /pullRealtimeGap\("poll"\)/,
  "polling fallback must use cursor-bounded Realtime gap reads",
);

console.log("realtime sync static tests passed");
