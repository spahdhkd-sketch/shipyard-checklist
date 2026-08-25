const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "assets/js/app-v2.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "assets/css/styles-v2.css"), "utf8");

test("Step 3 keeps desktop layout while exposing the approved mobile structure", () => {
  assert.ok(/grid-template-areas:\s*"form status"/.test(styles), "desktop form/status layout must remain");
  assert.ok(/class="[^"]*check-flow-v4__context/.test(app), "mobile context wrapper must render");
  assert.ok(/effectiveScreenMode\(\) === "mobile" && !state\.mobilePledgeShipExpanded/.test(app), "selected mobile ship must collapse without changing desktop behavior");
  assert.ok(/ships\.find\(\(ship\) => sameShipNo\(ship\.no, state\.draft\.shipNo\)\)/.test(app), "ship selection must tolerate normalized H prefixes");
  assert.ok(/pledge-flow-card-ship-select[\s\S]*?pledge-ship-mobile-summary/.test(app), "selected ship must also collapse after a desktop-to-mobile viewport change");
  assert.ok(/\.pledge-flow-card-ship-select\.has-selection:not\(\.is-mobile-expanded\) \.pledge-ship-mobile-summary\s*\{\s*display:\s*grid/.test(styles), "mobile viewport changes must reveal the compact ship summary");
  assert.ok(/class="check-flow-v4__pledge"/.test(app), "pledge must have an independent order target");
  assert.ok(/class="check-flow-mobile-status-grid"/.test(app), "mobile status grid must render");
  assert.ok(/class="check-flow-status-basis">필수 항목 기준/.test(app), "mobile status heading must match the approved compact reference");
  assert.ok(/<small>위험 항목<\/small>/.test(app), "mobile risk status label must match the approved reference");
  assert.ok(/\.check-flow-v4 \.material-flow-progress\s*\{\s*display:\s*none/.test(styles), "redundant progress divider must be removed from every inspection step");
  assert.ok(/\.check-flow-v4 \.material-flow-head\s*\{[\s\S]*?border-bottom:\s*0/.test(styles), "redundant navy flow divider must be removed");
  assert.ok(/@media \(width <= 920px\)[\s\S]*?\.check-flow-v4__context\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/.test(styles), "worker and ship context must use two columns across the app's full mobile breakpoint");
  assert.ok(/matchMedia\("\(max-width: 920px\)"\)/.test(app), "JavaScript and CSS mobile breakpoints must stay aligned at 920px");
  assert.ok(/\.check-flow-v4__context\s*\{[\s\S]*?gap:\s*0;[\s\S]*?border:[\s\S]*?border-radius:/.test(styles), "worker and ship must share one compact mobile surface");
  assert.ok(/\.check-flow-v4__workspace\s*\{[\s\S]*?display:\s*flex;[\s\S]*?align-items:\s*stretch/.test(styles), "mobile context and status cards must fill the available width");
  assert.ok(/\.check-flow-mobile-status-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/.test(styles), "status cells must use a mobile 2x2 grid");
});

test("safety pictogram covers use one non-cropping square frame", () => {
  assert.ok(/\.check-section-sign\s*\{[\s\S]*?width:\s*104px;[\s\S]*?height:\s*104px;[\s\S]*?object-fit:\s*contain/.test(styles), "all safety signs must use the same 104px square frame without cropping");
});

test("completed pledge is collapsible on mobile without hiding incomplete input", () => {
  assert.ok(/const mobileExpanded = !complete \|\| !signed \|\| state\.mobileSafetyPledgeExpanded/.test(app), "incomplete pledge input must stay expanded");
  assert.ok(/data-action="toggle-mobile-safety-pledge"/.test(app), "mobile pledge toggle must render");
  assert.ok(/aria-controls="checkSafetyPledgeDetails"/.test(app), "pledge toggle must expose its controlled region");
  assert.ok(/\.pledge-flow-card-safety:not\(\.is-mobile-expanded\) \.pledge-mobile-detail\s*\{\s*display:\s*none/.test(styles), "completed pledge details must collapse on mobile");
});

test("mobile submit stays above navigation and preserves high-risk submission rules", () => {
  assert.ok(/\.check-flow-v4 \.material-flow-footer\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?bottom:\s*calc\(var\(--ds-layout-bottom-nav-clearance\)/.test(styles), "submit dock must stay above mobile navigation");
  assert.ok(/data-check-submit-mobile-label/.test(app), "mobile submit state label must render");
  assert.ok(/missingHighItems\.length === 0/.test(app), "existing high-risk submission boundary must remain");
  assert.ok(!/checked === items\.length\s*&&\s*missingHighItems\.length === 0/.test(app), "low-risk optional checks must not become a new submission requirement");
});
