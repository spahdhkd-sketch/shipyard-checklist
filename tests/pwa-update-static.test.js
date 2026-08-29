const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const appVersion = "1.14.2-20260829-v1";
const assetToken = "20260829-v7-1";
const appPages = [
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

appPages.forEach((file) => {
  const html = read(file);
  assert.ok(
    html.includes(`href="/manifest.json?v=${assetToken}"`),
    `${file} should cache-bust the web app manifest`,
  );
  assert.ok(
    html.includes('navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })'),
    `${file} should bypass the HTTP cache when checking the service worker`,
  );
  assert.ok(
    html.includes(`assets/dist/js/app-v2.min.js?v=${assetToken}`),
    `${file} should load the current app runtime`,
  );
});

const app = read("assets/js/app-v2.js");
assert.ok(app.includes(`const APP_VERSION = "${appVersion}"`));
assert.ok(app.includes('navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })'));
assert.match(app, /navigator\.serviceWorker\.addEventListener\("controllerchange", \(\) => \{/);
assert.match(app, /window\.location\.reload\(\)/);
assert.match(app, /registration\.update\?\.\(\)/);

const sw = read("sw.js");
assert.ok(sw.includes(`const APP_VERSION = "${appVersion}"`));
assert.ok(sw.includes(`const ASSET_TOKEN = "${assetToken}"`));
assert.ok(sw.includes("`/manifest.json?v=${ASSET_TOKEN}`"));
assert.match(sw, /\.then\(\(\) => self\.skipWaiting\(\)\)/);
assert.match(sw, /\.then\(\(\) => self\.clients\.claim\(\)\)/);
assert.match(sw, /fetch\(new Request\(event\.request, \{ cache: "no-store" \}\)\)/);
assert.match(sw, /keys\s*\.filter\(\(key\) => key\.startsWith\("gs-safety-"\) && key !== CACHE\)/);
assert.match(sw, /type: "GS_SW_VERSION"/);

const e2eSmoke = read("tools/e2e-smoke.mjs");
assert.ok(e2eSmoke.includes('const swSource = readFileSync(join(ROOT, "sw.js"), "utf8")'));
assert.ok(e2eSmoke.includes('swSource.match(/ASSET_TOKEN = "([^"]+)"/)'));
assert.ok(e2eSmoke.includes("}, appVersion, assetToken);"));
assert.ok(e2eSmoke.includes("result.cache === `gs-safety-${assetToken}`"));
assert.ok(!e2eSmoke.includes("light-only"));

const vercel = JSON.parse(read("vercel.json"));
const headerRules = vercel.headers || [];
const swHeaders = headerRules.find((rule) => rule.source === "/sw.js")?.headers || [];
assert.ok(swHeaders.some((header) =>
  header.key.toLowerCase() === "cache-control" && /no-store/.test(header.value)));
const csp = headerRules
  .flatMap((rule) => rule.headers || [])
  .find((header) => header.key === "Content-Security-Policy")?.value || "";
appPages.forEach((file) => {
  const registrationScript = [...read(file).matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .find((script) => script.includes("navigator.serviceWorker.register"));
  assert.ok(registrationScript, `${file} should contain a service worker registration script`);
  const registrationHash = crypto.createHash("sha256").update(registrationScript).digest("base64");
  assert.ok(csp.includes(`'sha256-${registrationHash}'`), `CSP should allow ${file} registration script`);
});

console.log("pwa update static tests passed");
