const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const styles = fs.readFileSync(path.join(__dirname, "../assets/css/styles-v2.css"), "utf8");
const analyticsStyles = fs.readFileSync(path.join(__dirname, "../assets/css/30-feature-monthly-worker.css"), "utf8");
const app = fs.readFileSync(path.join(__dirname, "../assets/js/app-v2.js"), "utf8");
const posterSystemStart = styles.lastIndexOf(".pledge-action-view,");
const posterSystemEnd = styles.indexOf("\n    @media (max-width: 760px) {\n      .mobile-admin-shortcut,", posterSystemStart);
assert(posterSystemStart >= 0 && posterSystemEnd > posterSystemStart, "P1 poster system boundaries must remain explicit");
const posterSystem = styles.slice(posterSystemStart, posterSystemEnd);
const analyticsSystem = analyticsStyles;
const analyticsRuleBlocks = [...analyticsStyles.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .filter((match) => /(?:analytics|monthly-worker)/i.test(match[1]))
  .map((match) => ({ selector: match[1].trim(), declarations: match[2] }));

function relativeLuminance(hex) {
  const [red, green, blue] = hex.slice(1).match(/.{2}/g)
    .map((part) => Number.parseInt(part, 16) / 255)
    .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function hasDirectVisualPrimitive(css) {
  return /^\s*(?:gap|margin(?:-(?:top|right|bottom|left))?|padding(?:-top)?|font-size|border-radius):\s*(?:\d+px(?:\s+\d+px){0,3}|999px);/m.test(css);
}

function hasDirectPosterBorderOrTouchPrimitive(css) {
  return /^\s*(?:(?:border(?:-(?:top|right|bottom|left))?|outline|outline-offset):\s*\d+px\b|min-height:\s*44px;)/m.test(css);
}

function rawAnalyticsPrimitives() {
  const visualProperty = /^(?:color|background(?:-color)?|border(?:-(?:top|right|bottom|left))?|outline(?:-color)?|box-shadow|(?:margin|padding)(?:-(?:top|right|bottom|left))?|gap|row-gap|column-gap|(?:min-|max-)?(?:width|height)|border-radius|font-size|letter-spacing)$/i;
  const rawColor = /#[0-9a-f]{3,8}\b|\brgba?\(|\b(?:black|white|red|orange)\b/i;
  const rawLength = /(?:^|[^-\w.])\d*\.?\d+(?:px|rem|em)\b/i;
  const exception = /\/\*\s*design-token-exception:\s*non-design-layout\s+[—-]\s*[^*]+\*\//i;
  const offenders = [];
  for (const { selector, declarations } of analyticsRuleBlocks) {
    for (const match of declarations.matchAll(/([a-z-]+)\s*:\s*([^;{}]+);/gi)) {
      const [, property, value] = match;
      if (!visualProperty.test(property)) continue;
      const hasRawPrimitive = rawColor.test(value) || rawLength.test(value);
      if (!hasRawPrimitive) continue;
      const preceding = declarations.slice(0, match.index);
      const isJustifiedLayoutException = /^(?:min-|max-)?(?:width|height)$/i.test(property)
        && exception.test(preceding.slice(Math.max(0, preceding.length - 220)));
      if (!isJustifiedLayoutException) offenders.push(`${selector} -> ${property}: ${value.trim()}`);
    }
  }
  return offenders;
}

assert.match(posterSystem, /--poster-navy:\s*var\(--ds-color-navy-800\);/, "pledge and management posters must use the global navy contract");
assert.match(posterSystem, /--poster-teal:\s*var\(--ds-color-teal-700\);/, "pledge and management posters must use the global teal contract");
assert.match(posterSystem, /--poster-amber:\s*var\(--ds-color-orange-700\);/, "pledge and management posters must use the global orange contract");
assert.match(posterSystem, /--poster-red:\s*var\(--ds-color-danger-800\);/, "pledge and management posters must use the global danger contract");
assert.match(posterSystem, /--poster-space-sm:\s*var\(--ds-space-8\);/, "pledge and management posters must use the global spacing contract");
assert.match(posterSystem, /--poster-radius-card:\s*var\(--ds-radius-16\);/, "pledge and management posters must use the global card radius");
assert.match(posterSystem, /--poster-radius-pill:\s*var\(--ds-radius-pill\);/, "pledge and management posters must use the global pill radius");
assert.match(posterSystem, /--poster-type-subtitle:\s*var\(--ds-type-subtitle\);/, "pledge and management posters must use the global typography contract");
assert.match(posterSystem, /--poster-shadow-card:\s*var\(--ds-shadow-card\);/, "pledge and management posters must use the global card shadow");
assert.match(posterSystem, /gap:\s*var\(--poster-space-sm\);/, "pledge and management posters must consume spacing tokens");
assert.match(posterSystem, /border-radius:\s*var\(--poster-radius-card\);/, "pledge and management posters must consume radius tokens");
assert.match(posterSystem, /box-shadow:\s*var\(--poster-shadow-card\);/, "pledge and management posters must consume shadow tokens");
assert(!hasDirectVisualPrimitive(posterSystem), "P1 pledge and management rules must not reintroduce direct spacing, type, or radius literals");
assert(!hasDirectPosterBorderOrTouchPrimitive(posterSystem), "P1 pledge and management rules must not reintroduce direct border, focus, or touch literals");
assert.match(posterSystem, /--poster-border-default:\s*var\(--ds-border-width-default\);/, "poster borders must use the global default border token");
assert.match(posterSystem, /--poster-border-accent:\s*var\(--ds-border-width-accent\);/, "poster accents must use the global accent border token");
assert.match(posterSystem, /--poster-touch-target:\s*var\(--ds-touch-target-min\);/, "poster controls must use the global touch target token");
assert.match(posterSystem, /\.pledge-action-table-wrap\s*\{[\s\S]*?overflow-x:\s*auto;/, "desktop pledge rows retain a contained table surface");
assert.match(posterSystem, /@media \(max-width: 760px\)\s*\{[\s\S]*?\.pledge-action-table-wrap\s*\{\s*display:\s*none;/, "mobile pledge rows must not depend on an inner horizontal table");
assert.match(posterSystem, /\.pledge-action-mobile-list\s*\{\s*display:\s*grid;/, "mobile pledge rows must render as labeled cards");
assert.match(styles, /\.manage-center-v4 \.manage-center__workspace\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1\.3fr\) minmax\(280px, \.9fr\) minmax\(220px, \.62fr\);/, "desktop management uses a compact list-detail-history layout");
assert.match(styles, /@media \(max-width: 920px\)\s*\{[\s\S]*?\.manage-center-v4 \.manage-center__workspace\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\);/, "management list-detail must stack at the tablet boundary");
assert.match(styles, /\.manage-center-v4 \.manage-center__danger-zone\s*\{[\s\S]*?border-left:\s*var\(--poster-border-default\) solid var\(--poster-line-danger\);/, "danger actions need an isolated boundary without a decorative accent stripe");
assert.match(app, /<section class="material-flow check-flow check-flow-v4">/, "inspection flow must use the approved responsive shell");
assert.match(app, /<ol class="check-flow-steps" aria-label="점검 작성 단계">/, "inspection progress must use an ordered step contract");
assert.doesNotMatch(app, /작업 전 점검 · STEP/, "inspection progress must not repeat an English step kicker");
assert.match(styles, /\.check-flow-v4\s*\{[\s\S]*?width:\s*min\(100%, var\(--ds-layout-home-content-max\)\);/, "inspection flow must expand to the shared desktop content width");
assert.match(styles, /\.check-flow-v4__workspace\s*\{[\s\S]*?grid-template-areas:\s*"form status";/, "inspection writing and submission status must use a desktop work-review layout");
assert.match(styles, /@media \(max-width: 920px\)\s*\{[\s\S]*?\.check-flow-v4__workspace\s*\{[\s\S]*?grid-template-areas:\s*"status" "form";/, "inspection work-review layout must become one column before mobile widths");
assert.match(posterSystem, /\.pledge-action-review button,[\s\S]*?\.pledge-action-utilities button\s*\{[\s\S]*?min-height:\s*var\(--poster-touch-target\);/, "pledge controls need the global touch target");
assert.match(analyticsSystem, /--poster-navy:\s*var\(--ds-color-navy-800\);/, "action-first analytics must share the global navy contract");
assert.match(analyticsSystem, /--poster-space-sm:\s*var\(--ds-space-8\);/, "action-first analytics must share the global spacing contract");
assert.match(analyticsSystem, /--poster-radius-card:\s*var\(--ds-radius-16\);/, "action-first analytics must share the global card radius");
assert.match(analyticsSystem, /--poster-radius-kpi:\s*var\(--ds-radius-14\);/, "action-first analytics must share the global KPI radius");
assert.match(analyticsSystem, /--poster-shadow-card:\s*var\(--ds-shadow-card\);/, "action-first analytics must share the global card shadow");
assert.match(analyticsSystem, /\.analytics-v4 > \.data-context\s*\{[\s\S]*?border-bottom:\s*var\(--poster-border-default\) solid var\(--poster-line\);[\s\S]*?background:\s*transparent;[\s\S]*?box-shadow:\s*none;/, "analytics uses one flat data context instead of a second masthead card");
assert.match(analyticsSystem, /\.analytics-v4 > \.data-context h1,[\s\S]*?color:\s*var\(--poster-navy\);/, "analytics context title must use the operational navy token");
assert.match(analyticsSystem, /padding:\s*var\(--poster-space-lg\);/, "action-first analytics must consume spacing tokens");
assert.match(analyticsSystem, /border-radius:\s*var\(--poster-radius-card\);/, "action-first analytics must consume radius tokens");
assert.match(analyticsSystem, /\.analytics-v4 \.analytics-priority,[\s\S]*?box-shadow:\s*none;/, "analytics v4 surfaces must not stack borders with decorative card shadows");
assert.deepStrictEqual(
  rawAnalyticsPrimitives(),
  [],
  "all active analytics action/poster selectors must be token-driven across the full cascade",
);
assert.match(analyticsSystem, /\.analytics-v4 \.analytics-action-grid \.analytics-kpi\s*\{[\s\S]*?border:\s*0;[\s\S]*?box-shadow:\s*none;/, "analytics KPI cells must share one 2x2 surface without nested cards");
assert.match(analyticsSystem, /\.analytics-risk-donut\s*\{[\s\S]*?background:\s*conic-gradient\([\s\S]*?var\(--poster-danger-text\)[\s\S]*?var\(--poster-amber\)[\s\S]*?var\(--poster-teal\)/, "analytics risk distribution must use the approved semantic token sequence");
assert.match(analyticsSystem, /\.analytics-utilities \.btn,[\s\S]*?\.analytics-board \.monthly-worker-toolbar \.btn-light\s*\{[\s\S]*?min-height:\s*var\(--ds-touch-target-min\);/, "analytics controls need the documented touch-target token");

console.log("p1 poster visual static tests passed");
