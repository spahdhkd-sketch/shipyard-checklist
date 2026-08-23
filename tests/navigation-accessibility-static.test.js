const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const css = fs.readFileSync(path.join(__dirname, "../assets/css/styles-v2.css"), "utf8");
const mobileFoundation = css.slice(css.lastIndexOf("@media (max-width: 760px)"));

assert(mobileFoundation.includes(".work-type-manager button"), "mobile management buttons must have a scoped target rule");
assert(mobileFoundation.includes(".bottom-nav .nav-btn"), "mobile navigation buttons must have a scoped target rule");
assert.match(mobileFoundation, /min-width:\s*var\(--ds-touch-target-min\);/, "mobile controls need the documented touch-target minimum width");
assert.match(mobileFoundation, /min-height:\s*var\(--ds-touch-target-min\);/, "mobile controls need the documented touch-target minimum height");
assert(!mobileFoundation.includes("@media (pointer: coarse)"), "the mobile target rule must not depend on pointer type");
assert(mobileFoundation.includes(".item-actions.manage-actions .btn-danger"), "management danger controls need their own visual treatment");
assert(!/\n\s*button\s*\{/.test(mobileFoundation), "the mobile target rule must not enlarge every button globally");

console.log("navigation accessibility static tests passed");
