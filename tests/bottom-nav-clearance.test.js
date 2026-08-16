const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const styles = fs.readFileSync(path.join(__dirname, "..", "assets", "css", "styles-v2.css"), "utf8");

test("mobile content clearance is derived from one bottom navigation token", () => {
  assert.match(styles, /--bottom-nav-h: 84\.5px;/);
  assert.match(styles, /--bottom-nav-clearance: calc\(var\(--bottom-nav-h\) \+ var\(--safe-area-bottom\) \+ 16px\);/);
  assert.match(styles, /\.bottom-nav\s*\{\s*min-height: var\(--bottom-nav-h\);/);
  assert.match(styles, /\.main\s*\{\s*padding-bottom: var\(--bottom-nav-clearance\) !important;/);
  assert.match(styles, /body\.screen-mobile \.main,\s*body\.preview-mobile \.main\s*\{\s*padding-bottom: var\(--bottom-nav-clearance\) !important;/);
});
