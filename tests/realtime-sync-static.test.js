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
  /const remove = eventType === "DELETE"[\s\S]*applyDeletedRows\(config\.key, \[id\]\)/,
  "Realtime DELETE must use the exact-id local cascade",
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
expectMatch(
  /async function reconcileRemoteIds[\s\S]*selectAllRemoteIds\(client, config\)/,
  "limited tables must periodically reconcile complete server ID lists",
);
expectMatch(/REMOTE_RECONCILE_INTERVAL_MS/, "remote ID reconciliation must be throttled");
expectMatch(
  /remoteRows\.length < remoteListLimit\(key\)[\s\S]*authoritativeRemoteRows\(key, remoteRows\)/,
  "a complete limited response must authoritatively replace stale local rows",
);
expectMatch(
  /entry\.status === "loaded"[\s\S]*INSPECTION_RANGE_CACHE_TTL_MS/,
  "inspection range cache must expire instead of staying loaded for the full session",
);
expectMatch(
  /state\.remotePullHealth\[config\.key\][\s\S]*일부 데이터 동기화 실패/,
  "partial table failures must remain visible with per-table health",
);
expectMatch(/const INSPECTION_DELETION_TABLE = "safety_inspection_deletions"/, "inspection tombstones need a stable remote table contract");
expectMatch(/function applyRemoteInspectionTombstone\(payload\)/, "tombstone events must use an exact inspection ID");
expectMatch(/table: INSPECTION_DELETION_TABLE/, "inspection tombstones must have a realtime subscription");
expectMatch(
  /\.from\(INSPECTION_DELETION_TABLE\)[\s\S]{0,120}\.select\("inspection_id"\)[\s\S]{0,120}\.in\("inspection_id", chunk\)/,
  "reconciliation must query tombstones for exact cached inspection IDs",
);
expectMatch(/StateShapeRules\.reconciledRemoteDeletedRowIds/, "reconnect reconciliation must let tombstones win over pending uploads");
expectMatch(/state\.inspectionDeletionTableAvailable = true/, "a successful tombstone query must unlock inspection uploads");
expectMatch(/state\.inspectionDeletionTableAvailable = false/, "an old database must keep inspection uploads fail-closed");
expectMatch(
  /StateShapeRules\.syncJobRequiresInspectionDeleteWins\(item\)[\s\S]{0,120}state\.inspectionDeletionTableAvailable === true/,
  "queued inspection writes must wait for confirmed server delete-wins support",
);
expectMatch(/function abortActiveSyncRows\(key, ids\)/, "remote deletes must cancel matching in-flight uploads");
expectMatch(/job\.id !== state\.syncActiveJobId/, "new rows must not merge into an in-flight queue job");
expectMatch(/signal: abortController\?\.signal/, "queue uploads must receive the active abort signal");
expectMatch(/query\.retry\(false\)/, "aborted transport writes must not retry");
expectMatch(/invokeAdminMutation\("deleteInspectionHistory", \{ ids: inspectionIds \}\)/, "selected history deletion must use the atomic server action");
expectMatch(/invokeAdminMutation\("deleteAllInspectionHistory"\)/, "reset-all must use the uncapped atomic server action");
expectMatch(/state\.archivedInspections = \[\]/, "reset-all must clear the local period archive");
expectMatch(/applyDeletedRows\("inspections", inspectionIds\)/, "reset-all must cancel queued and active local inspection uploads");
expectMatch(
  /pullRealtimeGap\(reason = "reconnect"\)[\s\S]*reconcileDeletedInspectionRows\(client\)/,
  "Realtime reconnect gap recovery must also reconcile tombstones",
);

console.log("realtime sync static tests passed");
