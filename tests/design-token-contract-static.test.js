const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const styles = fs.readFileSync(path.join(root, "assets/css/styles-v2.css"), "utf8");
const analyticsStyles = fs.readFileSync(path.join(root, "assets/css/30-feature-monthly-worker.css"), "utf8");
const documentation = fs.readFileSync(path.join(root, "docs/design/DESIGN_TOKENS.md"), "utf8");

function declarationBlock(source, selector) {
  const start = source.indexOf(selector);
  assert(start >= 0, `${selector} must exist`);
  const open = source.indexOf("{", start);
  const close = source.indexOf("}", open);
  assert(open >= 0 && close > open, `${selector} must have a declaration block`);
  return source.slice(open + 1, close);
}

function customProperties(block) {
  return new Map(
    [...block.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)]
      .map((match) => [match[1], match[2].trim()]),
  );
}

function relativeLuminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g)
    .map((part) => Number.parseInt(part, 16) / 255)
    .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function resolveColor(token, tokens, seen = new Set()) {
  assert(!seen.has(token), `${token} must not form a token cycle`);
  seen.add(token);
  const value = tokens.get(token);
  assert(value, `${token} must resolve to a documented color`);
  const reference = value.match(/^var\((--[a-z0-9-]+)\)$/i);
  if (reference) return resolveColor(reference[1], tokens, seen);
  assert.match(value, /^#[0-9a-f]{6}$/i, `${token} must resolve to a six-digit color`);
  return value.toUpperCase();
}

function ruleBlocks(source, predicate) {
  const blocks = [];
  const matcher = /([^{}]+)\{([^{}]*)\}/g;
  for (const match of source.matchAll(matcher)) {
    const selector = match[1].trim();
    if (predicate(selector)) blocks.push({ selector, declarations: match[2] });
  }
  return blocks;
}

// Layout-only values (0, percentages, fr units, auto) are not visual primitives.
// A raw length may be exempted only by an adjacent, reviewable explanation:
// /* design-token-exception: non-design-layout — <why this value is intrinsic> */
function rawAnalyticsPrimitiveOffenders(source) {
  const analyticsRules = ruleBlocks(source, (selector) => /(?:analytics|monthly-worker)/i.test(selector));
  assert(analyticsRules.length > 0, "analytics action/poster rules must remain discoverable across the full cascade");
  const visualProperty = /^(?:color|background(?:-color)?|border(?:-(?:top|right|bottom|left))?|outline(?:-color)?|box-shadow|(?:margin|padding)(?:-(?:top|right|bottom|left))?|gap|row-gap|column-gap|(?:min-|max-)?(?:width|height)|border-radius|font-size|letter-spacing)$/i;
  const rawColor = /#[0-9a-f]{3,8}\b|\brgba?\(|\b(?:black|white|red|orange)\b/i;
  const rawLength = /(?:^|[^-\w.])\d*\.?\d+(?:px|rem|em)\b/i;
  const exception = /\/\*\s*design-token-exception:\s*non-design-layout\s+[—-]\s*[^*]+\*\//i;
  const offenders = [];

  for (const { selector, declarations } of analyticsRules) {
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

const globalTokens = customProperties(declarationBlock(styles, ":root"));
const expectedPrimitives = new Map([
  ["--ds-font-family-sans", '"Noto Sans KR", Arial, "Apple SD Gothic Neo", sans-serif'],
  ["--ds-color-navy-950", "#07162F"],
  ["--ds-color-navy-800", "#17324D"],
  ["--ds-color-cream-50", "#F8F1E8"],
  ["--ds-color-teal-700", "#0F766E"],
  ["--ds-color-orange-700", "#D97706"],
  ["--ds-color-success-700", "#3F7A50"],
  ["--ds-color-danger-800", "#B42318"],
  ["--ds-color-info-700", "#2E5DA6"],
  ["--ds-color-on-dark-line", "rgba(255, 255, 255, .24)"],
  ["--ds-color-on-dark-surface", "rgba(255, 255, 255, .08)"],
  ["--ds-space-8", "8px"],
  ["--ds-space-12", "12px"],
  ["--ds-space-16", "16px"],
  ["--ds-space-24", "24px"],
  ["--ds-space-32", "32px"],
  ["--ds-border-width-default", "1px"],
  ["--ds-border-width-section", "2px"],
  ["--ds-border-width-focus", "3px"],
  ["--ds-border-width-emphasis", "4px"],
  ["--ds-border-width-accent", "5px"],
  ["--ds-radius-10", "10px"],
  ["--ds-radius-16", "16px"],
  ["--ds-radius-pill", "999px"],
  ["--ds-shadow-card", "0 10px 24px rgba(23, 50, 77, .07)"],
  ["--ds-layout-field-max", "430px"],
  ["--ds-touch-target-min", "44px"],
]);

for (const [name, value] of expectedPrimitives) {
  assert.strictEqual(globalTokens.get(name), value, `${name} must keep its documented value`);
}

const expectedLegacyAliases = new Map([
  ["--color-brand-primary", "var(--ds-color-teal-700)"],
  ["--color-sidebar", "var(--ds-color-navy-950)"],
  ["--ink", "var(--ds-color-ink)"],
  ["--surface", "var(--ds-color-surface)"],
  ["--page", "var(--ds-color-page)"],
  ["--green", "var(--ds-color-success-700)"],
  ["--red", "var(--ds-color-danger-700)"],
  ["--shadow", "var(--ds-shadow-shell)"],
  ["--radius", "var(--ds-radius-10)"],
  ["--nav-width", "var(--ds-layout-sidebar-width)"],
]);

for (const [name, value] of expectedLegacyAliases) {
  assert.strictEqual(globalTokens.get(name), value, `${name} must remain a compatible global alias`);
}

const posterTokens = customProperties(declarationBlock(styles, ".pledge-action-view,"));
const analyticsTokens = customProperties(declarationBlock(analyticsStyles, ".analytics-board {"));
for (const [name, value] of posterTokens) {
  assert(value.startsWith("var(--ds-"), `${name} must resolve through the global token contract`);
}
for (const [name, value] of analyticsTokens) {
  assert(value.startsWith("var(--ds-"), `${name} must resolve through the global token contract`);
}

const posterColorTokens = new Map([...globalTokens, ...posterTokens]);
for (const [foreground, surface, label] of [
  ["--poster-teal", "--poster-teal-soft", "fresh status text on the success surface"],
  ["--poster-amber-text", "--poster-amber-soft", "warning status text on the warning surface"],
  ["--poster-danger-text", "--poster-danger-soft", "danger status text on the danger surface"],
]) {
  assert(
    contrastRatio(resolveColor(foreground, posterColorTokens), resolveColor(surface, posterColorTokens)) >= 4.5,
    `${label} must meet WCAG AA for normal text`,
  );
}
assert.match(declarationBlock(styles, ".pledge-action-freshness.is-stale strong"), /color:\s*var\(--poster-amber-text\);/);
assert.match(declarationBlock(styles, ".pledge-action-freshness.is-stale,"), /background:\s*var\(--poster-amber-soft\);/);

assert.deepStrictEqual(
  rawAnalyticsPrimitiveOffenders(analyticsStyles),
  [],
  "every active analytics action/poster rule must use design tokens; raw layout dimensions require an adjacent documented non-design-layout exception",
);

const dataContextBlock = declarationBlock(styles, ".data-context {");
assert(dataContextBlock.includes("border: var(--ds-border-width-default) solid var(--ds-color-line-poster);"));
assert(dataContextBlock.includes("border-radius: var(--ds-radius-16);"));
assert(dataContextBlock.includes("box-shadow: var(--ds-shadow-card);"));
assert(declarationBlock(styles, ".data-surface-state {").includes("border-radius: var(--ds-radius-16);"));
assert(styles.includes(".data-surface-state__skeleton"));
assert(/@media \(max-width: 420px\)[\s\S]*?\.pledge-action-kpis,[\s\S]*?\.manage-center__card-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/.test(styles));
assert(/@media \(max-width: 760px\)[\s\S]*?\.analytics-action-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/.test(analyticsStyles));
assert(declarationBlock(analyticsStyles, ".analytics-action-grid {").includes("grid-template-columns: repeat(4, minmax(0, 1fr));"));
assert(styles.includes("body.manage-mobile-detail-open"));
assert(styles.includes(".manage-center__workspace.is-mobile-detail-open > .manage-center__detail.is-mobile-fullscreen"));
assert(styles.includes("height: 100dvh;"));
assert(/\.manage-center button,[\s\S]*?min-height:\s*var\(--ds-touch-target-min\);/.test(styles));
assert(declarationBlock(styles, ".manage-center .work-prep-admin-card-side .btn-danger {").includes("min-height: var(--ds-touch-target-min);"));
assert(declarationBlock(styles, ".manage-center__workspace.is-single-pane {").includes("grid-template-columns: minmax(0, 1fr);"));
assert(/@media \(max-width: 760px\)[\s\S]*?\.manage-center \.work-prep-admin-card\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\);/.test(styles));

assert(declarationBlock(styles, "body {").includes("font-family: var(--ds-font-family-sans);"));
assert(declarationBlock(styles, ".sidebar {").includes("color: var(--ds-color-on-dark);"));
assert(styles.includes("box-shadow: var(--ds-shadow-bottom-nav);"));
assert(styles.includes("width: min(var(--ds-layout-field-max), 100%);"));
assert(/body\.screen-mobile \.worker-push-edit-btn,[\s\S]*?min-height:\s*var\(--ds-touch-target-min\);/.test(styles));
assert(!/@media\s*\([^)]*var\(--ds-/i.test(styles), "media queries must keep documented literal breakpoints");

assert(contrastRatio("#FFFFFF", "#07162F") >= 4.5, "white on shell navy must meet WCAG AA");
assert(contrastRatio("#17324D", "#F8F1E8") >= 4.5, "content navy on cream must meet WCAG AA");

for (const value of ["921px", "920px", "760px", "420px", "360px", "390px", "430px"]) {
  assert(documentation.includes(value), `design token documentation must include ${value}`);
}
assert(documentation.includes("assets/css/styles-v2.css"));
assert(documentation.includes("WCAG AA"));
assert(documentation.includes("data-context"));
assert(documentation.includes("data-surface-state"));
assert(documentation.includes("2×2"));
assert(documentation.includes("목록 → 전체화면 상세"));

console.log("design token contract static tests passed");
