import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const args = new Set(process.argv.slice(2));
const expectedCommitArg = process.argv.find((arg) => arg.startsWith("--expected-commit="));
const expectedCommit = expectedCommitArg ? expectedCommitArg.split("=")[1] : "0f56e64";
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
};

function add(name, ok, detail = "") {
  result.checks.push({ name, ok, detail });
  if (!ok) result.ok = false;
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
  add("git working tree clean", status === "## main...origin/main", status);
  add("deployed baseline commit exists", gitDiffQuiet(["rev-parse", "--verify", `${expectedCommit}^{commit}`]), expectedCommit);
  add(
    "deploy-relevant files match deployed baseline",
    gitDiffQuiet(["diff", "--quiet", expectedCommit, "--", ".", ":(exclude)docs", ":(exclude)tools"]),
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
    add(`${page} uses app-v2`, html.includes("assets/js/app-v2.js?v=20260522-nav-font-14"));
    add(`${page} uses styles-v2`, html.includes("assets/css/styles-v2.css?v=20260522-nav-font-14"));
    add(`${page} does not use legacy app.js`, !html.includes("assets/js/app.js"));
    add(`${page} does not use legacy styles.css`, !html.includes("assets/css/styles.css"));
  }

  assertContains(app, 'const APP_VERSION = "0.4-20260523"', "APP_VERSION unchanged");
  assertContains(app, "https://yuuroocvxvzgmsdeeiws.supabase.co", "Supabase project ref is active target");
  add("Supabase anon key is not printed by harness", true, "intentionally redacted");
  assertContains(app, "DEFAULT_PUSH_NOTIFICATION_TEMPLATES", "push template defaults exist");
  assertContains(app, 'data-push-template-kind="pledgePending"', "pledge push template button exists");
  assertContains(app, 'data-push-template-kind="unsafeIssue"', "unsafe push template button exists");
  assertContains(app, "UNSAFE_PUSH_TARGET_WORKER_NAMES = [\"허지원\", \"김준혁\", \"김경제\"]", "unsafe push targets fixed");
  assertContains(app, 'Date.parse("2026-05-26T11:59:00+09:00")', "test push disable date fixed");

  assertContains(styles, ".push-template-overlay", "push template modal CSS exists");
  assertContains(styles, ".pledge-notify-actions", "pledge notify action CSS exists");
  assertContains(sw, 'const CACHE = "gs-safety-v6-20260524"', "service worker cache is current");
  assertContains(notFound, "assets/css/styles-v2.css?v=20260522-nav-font-14", "404 uses v2 styles");

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
    const base = result.baseline.productionAlias;
    const indexLive = await fetchText(`${base}/index.html`);
    const notFoundLive = await fetchText(`${base}/404.html`);
    const removedLive = await fetch(`${base}/assets/icons/shipyard/illustrations/anchorInstallation.png`, { cache: "no-store" });
    add("live index responds 200", indexLive.status === 200, String(indexLive.status));
    add("live index uses app-v2", indexLive.text.includes("assets/js/app-v2.js?v=20260522-nav-font-14"));
    add("live 404 page uses v2 styles", notFoundLive.text.includes("assets/css/styles-v2.css?v=20260522-nav-font-14"));
    add("live removed illustration returns 404", removedLive.status === 404, String(removedLive.status));
  }
} catch (error) {
  add("harness execution", false, error && error.message ? error.message : String(error));
}

const failed = result.checks.filter((check) => !check.ok);
console.log(`# Claude Quality Harness\n`);
console.log(`baseline: ${result.baseline.expectedCommit}`);
console.log(`production: ${result.baseline.productionAlias}`);
console.log(`checks: ${result.checks.length}`);
console.log(`failed: ${failed.length}\n`);
for (const check of result.checks) {
  console.log(`${check.ok ? "PASS" : "FAIL"} ${check.name}${check.detail ? ` :: ${check.detail}` : ""}`);
}

if (failed.length) process.exitCode = 1;
