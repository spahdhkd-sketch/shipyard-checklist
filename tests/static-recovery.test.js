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

const app = read("assets/js/app-v2.js");
assert.match(app, /\{ id: "pledge", label: "서약"/);
assert.match(app, /\{ id: "analytics", label: "통계"/);
assert.match(app, /const MOBILE_NAV_IDS = new Set\(\["dashboard", "check", "ships", "history", "items"\]\)/);
assert.match(app, /return NAV\.filter\(\(nav\) => MOBILE_NAV_IDS\.has\(nav\.id\)\)/);
assert.match(app, /function renderCategoryToolPicker\(\{ groupId, selectedIds \}\)/);
assert.match(app, /function selectedCategoryToolIds\(groupId\)/);
assert.match(app, /function categoryAllowedToolIds\(categoryId\)/);
assert.match(app, /function visibleToolsForCategory\(categoryId\)/);
assert.match(app, /tool_ids: sanitizeToolIds\(row\.toolIds\)/);
assert.match(app, /toolIds: sanitizeToolIds\(row\.tool_ids\)/);
assert.match(app, /toolIds: selectedCategoryToolIds\("add_category"\)/);
assert.match(app, /toolIds: selectedCategoryToolIds\(`category_\$\{id\}`\)/);
assert.match(app, /"\/checklist": "check"/);
assert.match(app, /"\/admin": "manage"/);
assert.match(app, /createdAtMs: Date\.now\(\)/);
assert.match(app, /const PLEDGE_SIGNATURE_CACHE_KEY = "pledgeSignatureCache"/);
assert.match(app, /function signatureCacheDateKey\(\)/);
assert.match(app, /function cachedPledgeSignatureForWorker\(workerName\)/);
assert.match(app, /function savePledgeSignatureForWorker\(workerName, signature\)/);
assert.match(app, /function preloadCachedPledgeSignature\(\)/);

const css = read("assets/css/styles-v2.css");
assert.match(css, /--safe-area-bottom/);
assert.match(css, /grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/);
assert.match(css, /\.category-tool-picker/);
assert.match(css, /\.category-tool-options/);

const vercel = JSON.parse(read("vercel.json"));
const rewrites = vercel.rewrites.map((row) => row.source);
["/checklist", "/history", "/admin", "/pledge", "/analytics"].forEach((route) => {
  assert.ok(rewrites.includes(route), `${route} rewrite should exist`);
});

console.log("static recovery tests passed");
