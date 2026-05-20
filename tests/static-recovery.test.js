const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

[
  "index.html",
  "manifest.json",
  "sw.js",
  "assets/css/styles-v2.css",
  "assets/js/app-v2.js",
  "assets/js/vendor/supabase-js-2.105.3.min.js",
  "assets/icons/icon-192.png",
].forEach((file) => {
  assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
});

const html = read("index.html");
assert.match(html, /viewport-fit=cover/);
assert.match(html, /assets\/css\/styles-v2\.css/);
assert.match(html, /assets\/js\/vendor\/supabase-js-2\.105\.3\.min\.js/);
assert.match(html, /navigator\.serviceWorker\.register\("\/sw\.js"\)/);

[
  "check.html",
  "history.html",
  "items.html",
  "ships.html",
  "manage.html",
  "unsafe.html",
  "materials.html",
  "pledge.html",
  "analytics.html",
].forEach((file) => {
  const page = read(file);
  assert.match(page, /viewport-fit=cover/, `${file} should use the same viewport as index.html`);
  assert.match(page, /assets\/css\/styles-v2\.css/, `${file} should use v2 styles`);
  assert.match(page, /assets\/js\/vendor\/supabase-js-2\.105\.3\.min\.js/, `${file} should use the local Supabase vendor bundle`);
  assert.match(page, /assets\/js\/app-v2\.js/, `${file} should use the v2 app runtime`);
  assert.doesNotMatch(page, /assets\/css\/styles\.css/, `${file} should not use legacy styles`);
  assert.doesNotMatch(page, /assets\/js\/app\.js/, `${file} should not use legacy app runtime`);
  assert.doesNotMatch(page, /cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js/, `${file} should not use remote Supabase CDN`);
});

const app = read("assets/js/app-v2.js");
assert.match(app, /\{ id: "pledge", label: "서약"/);
assert.match(app, /\{ id: "analytics", label: "통계"/);
assert.match(app, /const MOBILE_NAV_IDS = new Set\(\["dashboard", "check", "ships", "history", "items"\]\)/);
assert.match(app, /return NAV\.filter\(\(nav\) => MOBILE_NAV_IDS\.has\(nav\.id\)\)/);
assert.match(app, /function renderCategoryToolPicker\(\{ groupId, selectedIds \}\)/);
assert.match(app, /function renderCategoryToolAssignments\(\)/);
assert.match(app, /function renderCategoryToolSummary\(toolIds\)/);
assert.match(app, /function toggleCategoryTools\(id\)/);
assert.match(app, /function selectedCategoryToolIds\(groupId\)/);
assert.match(app, /function categoryAllowedToolIds\(categoryId\)/);
assert.match(app, /function visibleToolsForCategory\(categoryId\)/);
assert.match(app, /tool_ids: sanitizeToolIds\(row\.toolIds\)/);
assert.match(app, /toolIds: sanitizeToolIds\(row\.tool_ids\)/);
assert.match(app, /data-save-category-tools="\$\{esc\(cat\.id\)\}"/);
assert.match(app, /data-toggle-category-tools="\$\{esc\(cat\.id\)\}"/);
assert.match(app, /if \(button\.dataset\.saveCategoryTools\) saveCategoryTools\(button\.dataset\.saveCategoryTools\)/);
assert.match(app, /if \(button\.dataset\.toggleCategoryTools\) toggleCategoryTools\(button\.dataset\.toggleCategoryTools\)/);
assert.match(app, /function saveCategoryTools\(id\)/);
assert.match(app, /toolIds: selectedCategoryToolIds\(`category_\$\{id\}`\)/);
assert.match(app, /작업 유형별 공기구 지정/);
assert.match(app, /"\/checklist": "check"/);
assert.match(app, /"\/admin": "manage"/);
assert.match(app, /createdAtMs: Date\.now\(\)/);
assert.match(app, /const PLEDGE_SIGNATURE_CACHE_KEY = "pledgeSignatureCache"/);
assert.match(app, /function signatureCacheDateKey\(\)/);
assert.match(app, /function cachedPledgeSignatureForWorker\(workerName\)/);
assert.match(app, /function savePledgeSignatureForWorker\(workerName, signature\)/);
assert.match(app, /function preloadCachedPledgeSignature\(\)/);
assert.match(app, /preloadCachedPledgeSignature\(\);[\s\S]*const submitState = buildCheckSubmitState/);
assert.match(app, /const previousWorker = state\.draft\.worker;/);
assert.match(app, /if \(normalizedWorkerName\(previousWorker\) !== normalizedWorkerName\(state\.draft\.worker\)\) state\.draft\.pledgeSignature = "";/);
assert.match(app, /savePledgeSignatureForWorker\(state\.draft\.worker, state\.draft\.pledgeSignature\)/);

const css = read("assets/css/styles-v2.css");
assert.match(css, /--safe-area-bottom/);
assert.match(css, /grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/);
assert.match(css, /\.category-tool-picker/);
assert.match(css, /\.category-tool-options/);
assert.match(css, /\.category-tool-assignment-panel/);
assert.match(css, /\.category-tool-assignment-row/);
assert.match(css, /\.category-tool-summary/);
assert.match(css, /\.category-tool-chip/);

const vercel = JSON.parse(read("vercel.json"));
const rewrites = vercel.rewrites.map((row) => row.source);
["/checklist", "/history", "/admin", "/pledge", "/analytics"].forEach((route) => {
  assert.ok(rewrites.includes(route), `${route} rewrite should exist`);
});

console.log("static recovery tests passed");
