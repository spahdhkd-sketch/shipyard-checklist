import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);
const expectedCommitArg = rawArgs.find((arg) => arg.startsWith("--expected-commit="));
const expectedCommit = expectedCommitArg ? expectedCommitArg.split("=")[1] : "HEAD";
const runLive = args.has("--live");
const skipVerify = args.has("--skip-verify");
const strictGit = args.has("--strict-git");

const APP_VERSION = "1.3-20260618-stats-pledge";
const VERSION_LOADING_COPY = "버전 확인 중";
const ASSET_TOKEN = "20260618-stats-pledge-1";
const SW_CACHE = "gs-safety-20260618-stats-pledge-1";
const SUPABASE_PROJECT_REF = "yuuroocvxvzgmsdeeiws";
const PRODUCTION_ALIAS = "https://gs-safety-checklist.vercel.app";
const DUPLICATE_VERCEL_ALIASES = [
  "https://shipyard-checklist.vercel.app",
  "https://shipyard-checklist-spahdhkd-3161s-projects.vercel.app",
  "https://shipyard-checklist-git-main-spahdhkd-3161s-projects.vercel.app",
];
const PAGES = [
  "index.html",
  "check.html",
  "history.html",
  "items.html",
  "ships.html",
  "manage.html",
  "unsafe.html",
  "materials.html",
  "pledge.html",
  "analytics.html",
];

const result = {
  ok: true,
  baseline: {
    expectedCommit,
    productionAlias: PRODUCTION_ALIAS,
    supabaseProjectRef: SUPABASE_PROJECT_REF,
    appVersion: APP_VERSION,
    assetToken: ASSET_TOKEN,
    serviceWorkerCache: SW_CACHE,
  },
  checks: [],
  warnings: [],
};

function add(name, ok, detail = "") {
  result.checks.push({ name, ok, detail });
  if (!ok) result.ok = false;
}

function warn(name, detail = "") {
  result.warnings.push({ name, detail });
}

function run(command, commandArgs, options = {}) {
  return execFileSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });
}

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return existsSync(join(root, relativePath));
}

function assertContains(text, needle, label) {
  add(label, text.includes(needle), needle);
}

function assertNotContains(text, needle, label) {
  add(label, !text.includes(needle), needle);
}

function assertMatch(text, pattern, label) {
  add(label, pattern.test(text), String(pattern));
}

function assertMissing(relativePath) {
  add(`removed file absent: ${relativePath}`, !exists(relativePath), relativePath);
}

function gitDiffQuiet(commandArgs) {
  try {
    execFileSync("git", commandArgs, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "ignore", "ignore"],
    });
    return true;
  } catch {
    return false;
  }
}

function gitOutput(commandArgs) {
  return run("git", commandArgs).trim();
}

function runNpmVerify() {
  if (process.platform === "win32") {
    return run("cmd.exe", ["/c", "npm.cmd", "run", "verify"], { stdio: ["ignore", "pipe", "pipe"] });
  }
  return run("npm", ["run", "verify"], { stdio: ["ignore", "pipe", "pipe"] });
}

function checkGitState() {
  const branch = gitOutput(["branch", "--show-current"]);
  const head = gitOutput(["rev-parse", "--short", "HEAD"]);
  const status = gitOutput(["status", "--short", "--branch"]).replace(/\r?\n/g, " | ");
  const clean = gitDiffQuiet(["diff", "--quiet", "--ignore-cr-at-eol"]) &&
    gitDiffQuiet(["diff", "--cached", "--quiet", "--ignore-cr-at-eol"]);
  const deployDiffClean = gitDiffQuiet([
    "diff",
    "--quiet",
    "--ignore-cr-at-eol",
    expectedCommit,
    "--",
    ".",
    ":(exclude)docs",
  ]);

  result.git = { branch, head, status };
  add("git branch is main", branch === "main", branch);
  if (strictGit) {
    add("git working tree clean", clean, status);
    add("deploy-relevant files match expected commit", deployDiffClean, `HEAD ${head} compared to ${expectedCommit}`);
  } else {
    add("git state inspected", true, status || "clean");
    if (!clean) warn("working tree has local changes", status);
    if (!deployDiffClean) warn("deploy-relevant files differ from expected commit", `HEAD ${head} compared to ${expectedCommit}`);
  }
}

function checkHtmlPages() {
  for (const page of PAGES) {
    const html = read(page);
    assertContains(html, `assets/dist/css/styles-v2.min.css?v=${ASSET_TOKEN}`, `${page} uses current CSS token`);
    assertContains(html, `assets/dist/css/20-component-table.min.css?v=${ASSET_TOKEN}`, `${page} uses current table CSS token`);
    assertContains(html, `assets/dist/css/30-feature-signature.min.css?v=${ASSET_TOKEN}`, `${page} uses current signature CSS token`);
    assertContains(html, `assets/dist/css/30-feature-push-management.min.css?v=${ASSET_TOKEN}`, `${page} uses current push management CSS token`);
    assertContains(html, `assets/dist/css/30-feature-monthly-worker.min.css?v=${ASSET_TOKEN}`, `${page} uses current monthly worker CSS token`);
    assertContains(html, `assets/dist/css/20-component-disabled-reason.min.css?v=${ASSET_TOKEN}`, `${page} uses current disabled-reason CSS token`);
    assertContains(html, `assets/dist/js/app-v2.min.js?v=${ASSET_TOKEN}`, `${page} uses current JS token`);
    assertContains(html, "assets/js/vendor/supabase-js-2.105.3.min.js", `${page} uses local Supabase vendor bundle`);
    assertContains(html, VERSION_LOADING_COPY, `${page} shows version loading copy before JS`);
    assertNotContains(html, "assets/css/styles.css", `${page} does not use legacy CSS`);
    assertNotContains(html, "assets/js/app.js", `${page} does not use legacy JS`);
    assertNotContains(html, "version 0.3", `${page} does not use stale fallback version`);
    assertNotContains(html, "cdn.jsdelivr.net", `${page} does not use removed CDN`);
    assertNotContains(html, "psatbyktzladtymdygwh.supabase.co", `${page} does not reference old Supabase project`);
  }

  const notFound = read("404.html");
  assertContains(notFound, `assets/dist/css/styles-v2.min.css?v=${ASSET_TOKEN}`, "404 uses current CSS token");
  assertContains(notFound, `assets/dist/css/30-feature-not-found.min.css?v=${ASSET_TOKEN}`, "404 uses current not-found CSS token");
  assertNotContains(notFound, "assets/css/styles.css", "404 does not use legacy CSS");
}

function checkRuntimeSource() {
  const app = read("assets/js/app-v2.js");
  const styles = read("assets/css/styles-v2.css");
  const sw = read("sw.js");
  const vercel = read("vercel.json");

  assertContains(app, `const APP_VERSION = "${APP_VERSION}"`, "APP_VERSION is current");
  assertContains(app, `https://${SUPABASE_PROJECT_REF}.supabase.co`, "Supabase project ref is active target");
  assertContains(app, 'readTable: "workers_public"', "workers read through public safe view");
  assertNotContains(app, "employee_no: normalizeEmployeeNo(row.employeeNo)", "worker sync does not write employee_no");
  assertNotContains(app, "employeeNo: normalizeEmployeeNo(row.employee_no)", "worker sync does not read employee_no");
  assertNotContains(app, 'data-worker-edit-field="employeeNo"', "worker edit UI does not expose employee_no");
  assertNotContains(app, "data-delete-worker=", "worker delete UI does not expose direct browser deletion");
  assertNotContains(app, 'deleteRemoteRows("workers"', "worker delete does not call anon REST directly");
  add("Supabase anon key is not printed by harness", true, "only project ref is reported");

  assertContains(app, "function startRemoteRealtime()", "Supabase realtime sync starter exists");
  assertContains(app, '.channel("gs-safety-remote-sync")', "Supabase realtime channel is configured");
  assertContains(app, '"postgres_changes"', "Supabase realtime listens for table changes");
  assertContains(app, "function remoteRealtimeConnected()", "realtime connected guard exists");
  assertContains(app, "function startRemotePolling()", "polling fallback starter exists");
  assertContains(app, "function stopRemotePolling()", "polling fallback stopper exists");
  assertMatch(app, /if \(remoteRealtimeConnected\(\)\) \{\s*stopRemotePolling\(\);/, "polling stops while realtime is connected");
  assertMatch(app, /if \(status === "SUBSCRIBED"\) \{\s*stopRemotePolling\(\);\s*return;\s*\}/, "polling stops on realtime subscription");
  assertMatch(app, /startRemotePolling\(\);\s*scheduleRemoteRefresh\("realtime-fallback", REMOTE_REACTIVE_PULL_DELAY_MS\);/, "polling restarts on realtime fallback");

  assertContains(app, "function captureFocusedFieldState()", "focused input capture exists");
  assertContains(app, "function restoreFocusedFieldState(captured)", "focused input restore exists");
  assertContains(app, "const focusedFieldState = captureFocusedFieldState()", "render preserves focused field state");
  assertContains(app, "restoreFocusedFieldState(focusedFieldState)", "render restores focused field state");

  assertContains(app, 'const ADMIN_PREENTRY_WORKER_POSITIONS = new Set([FOREMAN_WORKER_POSITION, "대표", "관리", "총무"])', "worker admin preentry badges are configured");
  assertContains(app, "function canWorkerPreEnterAdminMode(worker)", "worker admin preentry predicate exists");
  assertContains(app, "ADMIN_PREENTRY_WORKER_POSITIONS.has(position)", "worker admin preentry checks badge");
  assertContains(app, "function workerAdminModeLabel(worker)", "worker admin mode label exists");
  assertContains(app, 'setAdminMode(true, workerAdminModeLabel(worker), "worker")', "eligible worker login enables admin mode");
  assertContains(app, 'state.adminAuthSource === "worker"', "worker-sourced admin mode is tracked");

  assertContains(app, "function renderShipRow(ship)", "ship DATA card renderer exists");
  assertContains(app, "ship-data-card", "ship DATA card class exists");
  assertContains(app, "function renderShipDataKpis(ship, summary)", "ship DATA dashboard KPI renderer exists");
  assertContains(app, 'data-ship-data-target="history"', "ship DATA today inspection card navigates with ship filter");
  assertContains(app, 'data-ship-data-target="unsafe"', "ship DATA unsafe card navigates with ship filter");
  assertContains(app, 'data-ship-data-target="materials"', "ship DATA material card navigates with ship filter");
  assertContains(app, "function renderShipFilterNotice(kind, shipNo)", "ship filtered destination notice exists");
  assertContains(app, "function shipDateField(ship, field, label)", "ship date field renderer exists");
  assertContains(app, 'value="${esc(displayValue)}" placeholder="미입력"', "admin ship date inputs avoid overlay labels");

  assertContains(app, 'workPrepRegisterOpen: false', "work prep register state exists");
  assertContains(app, 'workPrepRegisterOpen: state.view === "check" && state.workPrepRegisterOpen', "work prep register route state is preserved");
  assertContains(app, "work-prep-appearance-badge", "work prep appearance time badge exists");
  assertContains(app, "작업지시 기본 정보", "work prep basic info section exists");

  assertNotContains(app, "L/C일 입력 전 비공개", "old L/C private helper text removed");
  assertNotContains(app, "호선 추가/삭제는 수정 모드를 ON으로 전환", "old ship edit notice removed");
  assertNotContains(app, "수정 모드를 켜면", "old edit mode helper text removed");

  assertMatch(styles, /\.ship-date-field \.input \{[\s\S]*width: 100%;[\s\S]*min-width: 0;[\s\S]*max-width: 100%;/, "ship-date-field .input prevents admin date overlap");
  assertMatch(styles, /\.ship-date-field \.input\[type="date"\] \{[\s\S]*font-size: 11px;/, "admin date input text is compact");
  assertMatch(styles, /@media \(max-width: 920px\) \{[\s\S]*\.ship-sort-bar \{[\s\S]*grid-template-columns: minmax\(0, 1fr\) minmax\(112px, 38%\);/, "mobile ship search and sort share one row");
  assertMatch(styles, /\.ship-sort-bar \.btn-light \{[\s\S]*grid-column: 1 \/ -1;/, "ship save-order button stays below search/sort");

  assertContains(sw, `const APP_VERSION = "${APP_VERSION}"`, "service worker app version is current");
  assertContains(sw, `const ASSET_TOKEN = "${ASSET_TOKEN}"`, "service worker asset token is current");
  assertContains(sw, "const CACHE = `gs-safety-${ASSET_TOKEN}`", "service worker cache is derived from asset token");
  assertContains(sw, "GS_SW_VERSION", "service worker exposes version message");
  assertContains(sw, "styles-v2.min.css?v=${ASSET_TOKEN}", "service worker caches CSS through asset token");
  assertContains(sw, "20-component-table.min.css?v=${ASSET_TOKEN}", "service worker caches table CSS through asset token");
  assertContains(sw, "30-feature-not-found.min.css?v=${ASSET_TOKEN}", "service worker caches not-found CSS through asset token");
  assertContains(sw, "30-feature-signature.min.css?v=${ASSET_TOKEN}", "service worker caches signature CSS through asset token");
  assertContains(sw, "30-feature-push-management.min.css?v=${ASSET_TOKEN}", "service worker caches push management CSS through asset token");
  assertContains(sw, "30-feature-monthly-worker.min.css?v=${ASSET_TOKEN}", "service worker caches monthly worker CSS through asset token");
  assertContains(sw, "20-component-disabled-reason.min.css?v=${ASSET_TOKEN}", "service worker caches disabled-reason CSS through asset token");
  assertContains(sw, "app-v2.min.js?v=${ASSET_TOKEN}", "service worker caches JS through asset token");
  const shellAssets = Array.from(sw.matchAll(/"([^"]+)"/g))
    .map((match) => match[1])
    .filter((asset) => asset.startsWith("/assets/"))
    .map((asset) => asset.split("?")[0].replace(/^\//, ""));
  for (const asset of shellAssets) add(`service worker asset exists: ${asset}`, exists(asset), asset);

  assertContains(vercel, `${SUPABASE_PROJECT_REF}.supabase.co`, "Vercel CSP references active Supabase project");
  assertNotContains(vercel, "psatbyktzladtymdygwh.supabase.co", "Vercel CSP does not reference old Supabase project");
  assertNotContains(vercel, "cdn.jsdelivr.net", "Vercel CSP does not allow removed CDN");
}

function checkRemovedFilesAndAssets() {
  [
    "assets/css/styles.css",
    "assets/js/app.js",
    "index.original.html",
    "tools/security-regression.mjs",
    "tools/split-static-html.ps1",
  ].forEach(assertMissing);

  const illustrationDir = join(root, "assets/icons/shipyard/illustrations");
  const illustrationPngs = existsSync(illustrationDir)
    ? readdirSync(illustrationDir).filter((file) => file.endsWith(".png"))
    : [];
  add("shipyard illustration PNGs generated", illustrationPngs.length >= 40, `${illustrationPngs.length} png files`);
  add("shipyard illustration source sheet exists", exists("assets/icons/shipyard/shipyard-illustration-sheet.png"));
}

async function fetchText(url) {
  const response = await fetch(url, { cache: "no-store" });
  return { status: response.status, text: await response.text() };
}

async function fetchRedirect(url) {
  const response = await fetch(url, { cache: "no-store", redirect: "manual" });
  return {
    status: response.status,
    location: response.headers.get("location") || "",
  };
}

function duplicateAliasIsClosed(redirect, expectedCanonicalUrl) {
  return redirect.status === 404 || (redirect.status === 308 && redirect.location === expectedCanonicalUrl);
}

async function checkLiveProduction() {
  const stamp = Date.now();
  try {
    const indexLive = await fetchText(`${PRODUCTION_ALIAS}/index.html?__harness=${stamp}`);
    const cssLive = await fetchText(`${PRODUCTION_ALIAS}/assets/dist/css/styles-v2.min.css?v=${ASSET_TOKEN}&__harness=${stamp}`);
    const jsLive = await fetchText(`${PRODUCTION_ALIAS}/assets/dist/js/app-v2.min.js?v=${ASSET_TOKEN}&__harness=${stamp}`);
    const swLive = await fetchText(`${PRODUCTION_ALIAS}/sw.js?__harness=${stamp}`);
    const notFoundLive = await fetchText(`${PRODUCTION_ALIAS}/404.html?__harness=${stamp}`);

    add("live index responds 200", indexLive.status === 200, String(indexLive.status));
    add("live index uses current CSS token", indexLive.text.includes(`assets/dist/css/styles-v2.min.css?v=${ASSET_TOKEN}`));
    add("live index uses current JS token", indexLive.text.includes(`assets/dist/js/app-v2.min.js?v=${ASSET_TOKEN}`));
    add("live JS responds 200", jsLive.status === 200, String(jsLive.status));
    add("live JS has current APP_VERSION", jsLive.text.includes(`const APP_VERSION = "${APP_VERSION}"`));
    add("live JS has active Supabase ref", jsLive.text.includes(`https://${SUPABASE_PROJECT_REF}.supabase.co`));
    add("live JS has worker admin preentry", jsLive.text.includes("ADMIN_PREENTRY_WORKER_POSITIONS"));
    add("live JS has ship DATA card", jsLive.text.includes("ship-data-card"));
    add("live CSS responds 200", cssLive.status === 200, String(cssLive.status));
    add("live CSS has compact ship date fix", /\.ship-date-field \.input \{[\s\S]*max-width: 100%;/.test(cssLive.text));
    add("live service worker responds 200", swLive.status === 200, String(swLive.status));
    add("live service worker app version is current", swLive.text.includes(`const APP_VERSION = "${APP_VERSION}"`));
    add("live service worker asset token is current", swLive.text.includes(`const ASSET_TOKEN = "${ASSET_TOKEN}"`));
    add("live service worker exposes version message", swLive.text.includes("GS_SW_VERSION"));
    add("live 404 uses current CSS token", notFoundLive.text.includes(`assets/dist/css/styles-v2.min.css?v=${ASSET_TOKEN}`));

    const duplicateRootRedirects = await Promise.all(
      DUPLICATE_VERCEL_ALIASES.map((alias) => fetchRedirect(`${alias}/?__harness=${stamp}`)),
    );
    const duplicatePathRedirects = await Promise.all(
      DUPLICATE_VERCEL_ALIASES.map((alias) => fetchRedirect(`${alias}/checklist?__harness=${stamp}`)),
    );
    add(
      "live duplicate alias root is closed",
      duplicateRootRedirects.every((redirect) =>
        duplicateAliasIsClosed(redirect, `${PRODUCTION_ALIAS}/?__harness=${stamp}`),
      ),
      duplicateRootRedirects.map((redirect) => `${redirect.status} ${redirect.location}`).join(" | "),
    );
    add(
      "live duplicate alias paths are closed",
      duplicatePathRedirects.every((redirect) =>
        duplicateAliasIsClosed(redirect, `${PRODUCTION_ALIAS}/checklist?__harness=${stamp}`),
      ),
      duplicatePathRedirects.map((redirect) => `${redirect.status} ${redirect.location}`).join(" | "),
    );
  } catch (error) {
    add("live production fetch", false, error && error.message ? error.message : String(error));
  }
}

try {
  checkGitState();

  if (!skipVerify) {
    runNpmVerify();
    add("npm run verify passes", true);
  } else {
    add("npm run verify skipped", true, "--skip-verify");
  }

  checkHtmlPages();
  checkRuntimeSource();
  checkRemovedFilesAndAssets();

  if (runLive) {
    await checkLiveProduction();
  }
} catch (error) {
  add("harness execution", false, error && error.message ? error.message : String(error));
}

const failed = result.checks.filter((check) => !check.ok);
console.log("# GS Safety Quality Harness\n");
console.log(`baseline: ${result.baseline.expectedCommit}`);
console.log(`production: ${result.baseline.productionAlias}`);
console.log(`app version: ${result.baseline.appVersion}`);
console.log(`asset token: ${result.baseline.assetToken}`);
console.log(`service worker: ${result.baseline.serviceWorkerCache}`);
console.log(`checks: ${result.checks.length}`);
console.log(`failed: ${failed.length}`);
console.log(`warnings: ${result.warnings.length}\n`);

for (const check of result.checks) {
  console.log(`${check.ok ? "PASS" : "FAIL"} ${check.name}${check.detail ? ` :: ${check.detail}` : ""}`);
}
for (const warning of result.warnings) {
  console.log(`WARN ${warning.name}${warning.detail ? ` :: ${warning.detail}` : ""}`);
}

if (failed.length) process.exitCode = 1;
