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
assert.match(pkg.scripts.verify, /tests\/worker-security-static\.test\.js/);

assert.ok(exists("tools/quality-harness.mjs"), "quality harness should exist");
assert.ok(exists("tools/claude-quality-harness.mjs"), "legacy harness entrypoint should remain");

const harness = read("tools/quality-harness.mjs");
const legacyHarness = read("tools/claude-quality-harness.mjs");
const assetBuilder = read("tools/build-assets.mjs");
const vercelConfig = JSON.parse(read("vercel.json"));
const duplicateAliases = [
  "shipyard-checklist.vercel.app",
  "shipyard-checklist-spahdhkd-3161s-projects.vercel.app",
  "shipyard-checklist-git-main-spahdhkd-3161s-projects.vercel.app",
];

assert.match(harness, /GS Safety Quality Harness/);
assert.match(harness, /https:\/\/gs-safety-checklist\.vercel\.app/);
assert.match(harness, /yuuroocvxvzgmsdeeiws/);
assert.match(harness, /1\.11-20260809-delete-wins/);
assert.match(harness, /VERSION_LOADING_COPY/);
assert.doesNotMatch(harness, /version 0\.8/);
assert.match(harness, /20260809-delete-wins-1/);
assert.match(harness, /gs-safety-20260809-delete-wins-1/);
assert.match(harness, /ADMIN_PREENTRY_WORKER_POSITIONS/);
assert.match(harness, /canWorkerPreEnterAdminMode/);
assert.match(harness, /ship-date-field \\.input/);
assert.match(harness, /ship-sort-bar/);
assert.match(harness, /startRemoteRealtime/);
assert.match(harness, /remoteRealtimeConnected/);
assert.match(harness, /workers read through public safe view/);
assert.match(harness, /worker sync does not write employee_no/);
assert.match(harness, /worker sync does not read employee_no/);
assert.match(harness, /worker delete UI is available to administrators/);
assert.match(harness, /worker delete uses authenticated admin mutation/);
assert.match(harness, /worker delete protects the signed-in worker/);
assert.match(harness, /worker delete does not call anon REST directly/);
assert.match(harness, /DUPLICATE_VERCEL_ALIASES/);
assert.match(harness, /live duplicate alias root is closed/);
assert.match(harness, /--strict-git/);
assert.match(harness, /--live/);
assert.doesNotMatch(harness, /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/);

for (const alias of duplicateAliases) {
  assert.ok(
    vercelConfig.redirects.some(
      (redirect) =>
        redirect.source === "/" &&
        redirect.destination === "https://gs-safety-checklist.vercel.app/" &&
        redirect.has?.some((condition) => condition.type === "host" && condition.value === alias),
    ),
    `${alias} should redirect root to canonical production`,
  );
  assert.ok(
    vercelConfig.redirects.some(
      (redirect) =>
        redirect.source === "/:path*" &&
        redirect.destination === "https://gs-safety-checklist.vercel.app/:path*" &&
        redirect.has?.some((condition) => condition.type === "host" && condition.value === alias),
    ),
    `${alias} should redirect paths to canonical production`,
  );
}

assert.match(legacyHarness, /quality-harness\.mjs/);
assert.match(assetBuilder, /import \{ fileURLToPath \} from "node:url"/);
assert.match(assetBuilder, /fileURLToPath\(import\.meta\.url\)/);
assert.doesNotMatch(assetBuilder, /new URL\(import\.meta\.url\)\.pathname/);
