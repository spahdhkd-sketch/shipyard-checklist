const assert = require("assert");
const fs = require("fs");
const path = require("path");

const helpers = require("../assets/js/pictogram-helpers.js");

const ROOT = path.join(__dirname, "..");
const ASSET_TOKEN = "20260809-delete-wins-2";
const APP_SCRIPT = `assets/dist/js/app-v2.min.js?v=${ASSET_TOKEN}`;
const HELPER_SCRIPT = `assets/dist/js/pictogram-helpers.min.js?v=${ASSET_TOKEN}`;

assert.strictEqual(helpers.normalizeIconKey("load"), "upperModuleInstallation");
assert.strictEqual(helpers.normalizeIconKey("confinedSpace"), "safetyGear");
assert.strictEqual(helpers.normalizeIconKey("custom-icon"), "custom-icon");

assert.strictEqual(
  helpers.pictogramLazyImageSrc(
    { id: " custom id/1 ", storagePath: "folder/custom image.png" },
    { supabaseUrl: "https://yuuroocvxvzgmsdeeiws.supabase.co/", syncConfigured: true }
  ),
  "https://yuuroocvxvzgmsdeeiws.supabase.co/functions/v1/pictogram-image?id=custom%20id%2F1&v=folder%2Fcustom%20image.png"
);
assert.strictEqual(
  helpers.pictogramLazyImageSrc(
    { id: "custom-id", updatedAt: "2026-05-28T00:00:00+09:00" },
    { supabaseUrl: "https://yuuroocvxvzgmsdeeiws.supabase.co", syncConfigured: () => true }
  ),
  "https://yuuroocvxvzgmsdeeiws.supabase.co/functions/v1/pictogram-image?id=custom-id&v=2026-05-28T00%3A00%3A00%2B09%3A00"
);
assert.strictEqual(
  helpers.pictogramLazyImageSrc(
    { id: "custom-id", storagePath: "folder/custom.png" },
    { supabaseUrl: "https://yuuroocvxvzgmsdeeiws.supabase.co", syncConfigured: false }
  ),
  ""
);
assert.strictEqual(
  helpers.pictogramLazyImageSrc(
    { id: "custom-id", storagePath: "folder/custom.png" },
    { supabaseUrl: "", syncConfigured: true }
  ),
  ""
);

assert.strictEqual(helpers.lineIconName("classSurvey"), "award");
assert.strictEqual(helpers.lineIconName("pressureTest"), "gauge");
assert.strictEqual(helpers.lineIconName("dpInspection"), "clipboardCheck");
assert.strictEqual(helpers.lineIconName("weldingWork"), "flame");
assert.strictEqual(helpers.lineIconName("unknown"), "shieldCheck");

const htmlFiles = fs.readdirSync(ROOT).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const appIndex = html.indexOf(APP_SCRIPT);
  if (appIndex === -1) continue;
  const helperIndex = html.indexOf(HELPER_SCRIPT);
  assert(helperIndex !== -1, `${file} loads pictogram helper script`);
  assert(helperIndex < appIndex, `${file} loads pictogram helper before app-v2`);
}

const app = fs.readFileSync(path.join(ROOT, "assets/js/app-v2.js"), "utf8");
assert(app.includes("window.ShipyardPictogramHelpers"), "app-v2 reads pictogram helper global");
assert(app.includes("PICTOGRAM_HELPERS.pictogramLazyImageSrc"), "app-v2 delegates lazy image src");

const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
assert(sw.includes("/assets/dist/js/pictogram-helpers.min.js?v=${ASSET_TOKEN}"), "service worker caches pictogram helper");

console.log("pictogram helper tests passed");
