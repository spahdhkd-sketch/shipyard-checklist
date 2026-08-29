const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const assetToken = "20260829-v6-1";
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
  "redesign-v2.html",
];
const v4Styles = [
  "30-feature-ships-v4",
  "30-feature-history-v4",
  "30-feature-quick-menu-v4",
  "30-feature-unsafe-v4",
  "30-feature-materials-v4",
  "30-feature-manage-tabs-v4",
  "30-feature-governance-v4",
  "30-feature-auxiliary-v4",
];
const v4Views = [
  "ships-v4-view",
  "history-v4-view",
  "quick-menu-v4-view",
  "unsafe-v4-view",
  "materials-v4-view",
  "manage-tabs-v4-view",
  "governance-v4-view",
  "auxiliary-v4-view",
];

v4Styles.forEach((name) => {
  assert.ok(fs.existsSync(path.join(root, `assets/css/${name}.css`)), `${name} source stylesheet should exist`);
});
v4Views.forEach((name) => {
  assert.ok(fs.existsSync(path.join(root, `assets/js/${name}.js`)), `${name} source view should exist`);
});

appPages.forEach((file) => {
  const html = read(file);
  const appOffset = html.indexOf(`assets/dist/js/app-v2.min.js?v=${assetToken}`);
  assert.ok(appOffset >= 0, `${file} should load the current app runtime`);

  v4Styles.forEach((name) => {
    assert.ok(
      html.includes(`assets/dist/css/${name}.min.css?v=${assetToken}`),
      `${file} should load ${name} with the current asset token`,
    );
  });

  let previousOffset = -1;
  v4Views.forEach((name) => {
    const runtimeAsset = `assets/dist/js/${name}.min.js?v=${assetToken}`;
    const offset = html.indexOf(runtimeAsset);
    assert.ok(offset > previousOffset && offset < appOffset, `${file} should load ${name} before app-v2 in v4 dependency order`);
    previousOffset = offset;
  });
});

const sw = read("sw.js");
assert.ok(sw.includes('const APP_VERSION = "1.14.1-20260829-v1"'), "v4 asset wiring must not change APP_VERSION");
assert.ok(sw.includes(`const ASSET_TOKEN = "${assetToken}"`), "v4 asset wiring must not change ASSET_TOKEN");
v4Styles.forEach((name) => {
  assert.ok(
    sw.includes(`\`/assets/dist/css/${name}.min.css?v=\${ASSET_TOKEN}\``),
    `service worker should precache ${name}`,
  );
});
v4Views.forEach((name) => {
  assert.ok(
    sw.includes(`\`/assets/dist/js/${name}.min.js?v=\${ASSET_TOKEN}\``),
    `service worker should precache ${name}`,
  );
});
