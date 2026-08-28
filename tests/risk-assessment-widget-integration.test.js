const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const app = read("assets/js/app-v2.js");
const css = read("assets/css/30-feature-control-center.css");
const html = read("items.html");
const sw = read("sw.js");
const widget = read("assets/js/vendor/hisafe-ra-widget.js");

assert.match(widget, /global\.HisafeRA\s*=\s*HisafeRA/);
assert.match(widget, /mount\(target, opts\)/);
assert.match(app, /data-action="open-ra-widget"/);
assert.match(app, /id="hisafeRaWidgetHost"/);
assert.match(app, /script\.src = "\/assets\/js\/vendor\/hisafe-ra-widget\.js"/);
assert.match(app, /HisafeRA\.mount\(host/);
assert.match(app, /파일은 서버로 전송하지 않고 현재 기기에서만 분석합니다/);
assert.doesNotMatch(html, /<script[^>]+hisafe-ra-widget\.js/);
assert.match(html, /30-feature-control-center\.min\.css/);
assert.match(sw, /\/assets\/js\/vendor\/hisafe-ra-widget\.js/);
assert.match(sw, /30-feature-control-center\.min\.css/);
assert.match(css, /body\.ra-widget-open \.bottom-nav/);
assert.match(css, /@media \(max-width: 600px\)/);

console.log("risk assessment widget integration tests passed");
