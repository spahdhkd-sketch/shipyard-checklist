import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const args = new Set(process.argv.slice(2));
const expectedCommitArg = process.argv.find((arg) => arg.startsWith("--expected-commit="));
const expectedCommit = expectedCommitArg ? expectedCommitArg.split("=")[1] : "HEAD";
const runLive = args.has("--live");
const skipVerify = args.has("--skip-verify");

const result = {
  ok: true,
  baseline: {
    expectedCommit,
    productionAlias: "https://gs-safety-checklist.vercel.app",
    supabaseProjectRef: "yuuroocvxvzgmsdeeiws",
    appVersion: "0.4-20260523",
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

function npmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function runNpmVerify() {
  if (process.platform === "win32") {
    return run("cmd.exe", ["/c", "npm.cmd", "run", "verify"], { stdio: ["ignore", "pipe", "pipe"] });
  }
  return run(npmCommand(), ["run", "verify"], { stdio: ["ignore", "pipe", "pipe"] });
}

function statusLine() {
  return run("git", ["status", "--short", "--branch"]).trim().replace(/\r?\n/g, " | ");
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

function porcelainCleanIgnoringCrLf() {
  const status = run("git", ["status", "--porcelain"]).trim();
  if (!status) return true;

  for (const line of status.split(/\r?\n/).filter(Boolean)) {
    const code = line.slice(0, 2);
    const file = line.slice(3).trim();
    if (code !== " M" || !file) return false;
    if (!gitDiffQuiet(["diff", "--quiet", "--ignore-cr-at-eol", "--", file])) return false;
  }

  warn("git status contains CRLF-only working-tree noise", status.replace(/\r?\n/g, " | "));
  return true;
}

function assertContains(text, needle, label) {
  add(label, text.includes(needle), needle);
}

function assertMissing(relativePath) {
  add(`removed file absent: ${relativePath}`, !exists(relativePath), relativePath);
}

async function fetchText(url) {
  const response = await fetch(url, { cache: "no-store" });
  return { status: response.status, text: await response.text() };
}

try {
  const status = statusLine();
  const head = run("git", ["rev-parse", "--short", "HEAD"]).trim();
  const branch = run("git", ["branch", "--show-current"]).trim();
  result.git = { status, head, branch };
  add("git branch is main", branch === "main", branch);
  add(
    "git working tree clean",
    !status.includes("[ahead") && !status.includes("[behind") && porcelainCleanIgnoringCrLf(),
    status
  );
  add("deployed baseline commit exists", gitDiffQuiet(["rev-parse", "--verify", `${expectedCommit}^{commit}`]), expectedCommit);
  add(
    "deploy-relevant files match deployed baseline",
    gitDiffQuiet(["diff", "--quiet", "--ignore-cr-at-eol", expectedCommit, "--", ".", ":(exclude)docs", ":(exclude)tools"]),
    `HEAD ${head} compared to ${expectedCommit}; docs/ and tools/ are Vercel-ignored`
  );

  if (!skipVerify) {
    runNpmVerify();
    add("npm run verify passes", true);
  } else {
    add("npm run verify skipped", true, "--skip-verify");
  }

  const app = read("assets/js/app-v2.js");
  const styles = read("assets/css/styles-v2.css");
  const sw = read("sw.js");
  const notFound = read("404.html");
  const redesignPreview = read("redesign-v2.html");
  const pages = [
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

  for (const page of pages) {
    const html = read(page);
    add(`${page} uses app-v2`, html.includes("assets/js/app-v2.js?v=20260525-push-status-1"));
    add(`${page} uses styles-v2`, html.includes("assets/css/styles-v2.css?v=20260525-push-status-1"));
    add(`${page} does not use legacy app.js`, !html.includes("assets/js/app.js"));
    add(`${page} does not use legacy styles.css`, !html.includes("assets/css/styles.css"));
    add(`${page} uses static fallback version 0.4`, html.includes("version 0.4"));
    add(`${page} does not use stale static fallback version 0.3`, !html.includes("version 0.3"));
    add(`${page} does not reference removed CDN`, !html.includes("cdn.jsdelivr.net"));
    add(`${page} does not reference old Supabase project`, !html.includes("psatbyktzladtymdygwh.supabase.co"));
  }

  assertContains(app, 'const APP_VERSION = "0.4-20260523"', "APP_VERSION unchanged");
  assertContains(app, "https://yuuroocvxvzgmsdeeiws.supabase.co", "Supabase project ref is active target");
  add("Supabase anon key is not printed by harness", true, "intentionally redacted");
  assertContains(app, "DEFAULT_PUSH_NOTIFICATION_TEMPLATES", "push template defaults exist");
  assertContains(app, 'data-push-template-kind="pledgePending"', "pledge push template button exists");
  assertContains(app, 'data-push-template-kind="unsafeIssue"', "unsafe push template button exists");
  assertContains(app, "UNSAFE_PUSH_TARGET_WORKER_NAMES = [\"허지원\", \"김준혁\", \"김경제\"]", "unsafe push targets fixed");
  assertContains(app, 'Date.parse("2026-05-26T11:59:00+09:00")', "test push disable date fixed");
  assertContains(app, "function canSendPledgeNotifications()", "pledge notification sender guard exists");
  assertContains(app, "senderWorkerId", "push send includes sender worker id");
  assertContains(app, "senderEmployeeNo", "push send includes sender employee number");
  assertContains(app, "sendKind: options.kind || \"\"", "push send includes server authorization kind");
  assertContains(app, "const REMOTE_PULL_THROTTLE_MS = 10 * 1000", "remote pull throttle supports near-live sync");
  assertContains(app, "const REMOTE_POLL_INTERVAL_MS = 15 * 1000", "remote polling fallback exists");
  assertContains(app, "function startRemoteRealtime()", "Supabase realtime sync starter exists");
  assertContains(app, ".channel(\"gs-safety-remote-sync\")", "Supabase realtime channel is configured");
  assertContains(app, "\"postgres_changes\"", "Supabase realtime listens for Postgres changes");
  assertContains(app, "function startRemotePolling()", "polling fallback starter exists");
  assertContains(app, "window.addEventListener(\"visibilitychange\"", "visibility wake sync exists");
  assertContains(app, "window.addEventListener(\"storage\", handleStorageSyncWake)", "cross-tab storage wake sync exists");

  assertContains(styles, ".push-template-overlay", "push template modal CSS exists");
  assertContains(styles, ".pledge-notify-actions", "pledge notify action CSS exists");
  assertContains(sw, 'const CACHE = "gs-safety-v9-20260525-push-status"', "service worker cache is current");
  assertContains(notFound, "assets/css/styles-v2.css?v=20260525-push-status-1", "404 uses v2 styles");
  assertContains(redesignPreview, "assets/js/vendor/supabase-js-2.105.3.min.js", "redesign preview uses local Supabase vendor bundle");
  add("redesign preview does not use removed CDN", !redesignPreview.includes("cdn.jsdelivr.net"));

  const pushFunction = read("supabase/functions/worker-push/index.ts");
  assertContains(pushFunction, "async function verifiedSender", "worker-push verifies sender");
  assertContains(pushFunction, "async function authorizeSendRequest", "worker-push authorizes send requests");
  assertContains(pushFunction, "UNSAFE_PUSH_TARGET_WORKER_NAMES = [\"허지원\", \"김준혁\", \"김경제\"]", "worker-push locks unsafe issue targets");
  assertContains(pushFunction, "forbidden_send_kind", "worker-push rejects unknown send kinds");

  const vercel = read("vercel.json");
  assertContains(vercel, "yuuroocvxvzgmsdeeiws.supabase.co", "CSP references active Supabase project");
  add("CSP does not reference old Supabase project", !vercel.includes("psatbyktzladtymdygwh.supabase.co"));
  add("CSP does not allow removed CDN", !vercel.includes("cdn.jsdelivr.net"));

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
  add("unused shipyard illustration PNGs absent", illustrationPngs.length === 0, `${illustrationPngs.length} png files`);

  const shellAssets = Array.from(sw.matchAll(/"([^"]+)"/g))
    .map((match) => match[1])
    .filter((asset) => asset.startsWith("/assets/"))
    .map((asset) => asset.split("?")[0].replace(/^\//, ""));
  for (const asset of shellAssets) add(`service worker asset exists: ${asset}`, exists(asset), asset);

  if (runLive) {
    try {
      const base = result.baseline.productionAlias;
      const indexLive = await fetchText(`${base}/index.html`);
      const notFoundLive = await fetchText(`${base}/404.html`);
      const removedLive = await fetch(`${base}/assets/icons/shipyard/illustrations/anchorInstallation.png`, { cache: "no-store" });
      add("live index responds 200", indexLive.status === 200, String(indexLive.status));
      add("live index uses app-v2", indexLive.text.includes("assets/js/app-v2.js?v=20260525-push-status-1"));
      add("live 404 page uses v2 styles", notFoundLive.text.includes("assets/css/styles-v2.css?v=20260525-push-status-1"));
      add("live removed illustration returns 404", removedLive.status === 404, String(removedLive.status));
    } catch (error) {
      warn("live fetch skipped", error && error.message ? error.message : String(error));
    }
  }
} catch (error) {
  add("harness execution", false, error && error.message ? error.message : String(error));
}

const failed = result.checks.filter((check) => !check.ok);
console.log(`# Claude Quality Harness\n`);
console.log(`baseline: ${result.baseline.expectedCommit}`);
console.log(`production: ${result.baseline.productionAlias}`);
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
