const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

const pkg = JSON.parse(read("package.json"));

assert.equal(pkg.scripts.harness, "node tools/quality-harness.mjs");
assert.equal(pkg.scripts["harness:live"], "node tools/quality-harness.mjs --live");
assert.equal(pkg.scripts["harness:strict"], "node tools/quality-harness.mjs --strict-git --live");
assert.equal(pkg.scripts.serve, "node tools/static-server.mjs 4173");
assert.match(pkg.scripts.verify, /node --check tools\/quality-harness\.mjs/);
assert.match(pkg.scripts.verify, /node --check tools\/claude-quality-harness\.mjs/);
assert.match(pkg.scripts.verify, /tests\/harness-config\.test\.js/);

assert.ok(exists("tools/quality-harness.mjs"), "quality harness should exist");
assert.ok(exists("tools/claude-quality-harness.mjs"), "legacy harness entrypoint should remain");

const harness = read("tools/quality-harness.mjs");
const legacyHarness = read("tools/claude-quality-harness.mjs");

assert.match(harness, /GS Safety Quality Harness/);
assert.match(harness, /https:\/\/gs-safety-checklist\.vercel\.app/);
assert.match(harness, /yuuroocvxvzgmsdeeiws/);
assert.match(harness, /0\.6-20260526/);
assert.match(harness, /20260527-unsafe-push-db-1/);
assert.match(harness, /gs-safety-v18-20260527-unsafe-push-db/);
assert.match(harness, /ADMIN_PREENTRY_WORKER_POSITIONS/);
assert.match(harness, /canWorkerPreEnterAdminMode/);
assert.match(harness, /ship-date-field \\.input/);
assert.match(harness, /ship-sort-bar/);
assert.match(harness, /startRemoteRealtime/);
assert.match(harness, /remoteRealtimeConnected/);
assert.match(harness, /--strict-git/);
assert.match(harness, /--live/);
assert.doesNotMatch(harness, /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/);

assert.match(legacyHarness, /quality-harness\.mjs/);
