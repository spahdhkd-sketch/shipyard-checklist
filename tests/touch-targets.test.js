const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const styles = fs.readFileSync(path.join(__dirname, "..", "assets", "css", "styles-v2.css"), "utf8");
const app = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "app-v2.js"), "utf8");

test("common controls and inspection selection rows keep 44px touch targets", () => {
  assert.match(styles, /\.btn-icon,\s*\.seg-btn\s*\{\s*min-width: 44px;\s*min-height: 44px;/);
  assert.match(styles, /\.input,\s*\.select,\s*\.textarea\s*\{[\s\S]*?min-height: 44px;/);
  assert.match(styles, /\.history-detail-btn\s*\{\s*width: 44px;\s*height: 44px;/);
  assert.match(styles, /\.check-section-master\s*\{\s*width: 44px;\s*height: 44px;/);
  assert.match(styles, /\.item-tool-option\s*\{\s*min-width: 0;\s*min-height: 44px;/);
  assert.match(app, /<label class="check-section-master">[\s\S]*?data-check-section-master/);
});
