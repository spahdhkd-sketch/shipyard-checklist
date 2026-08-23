const assert = require("node:assert");
const {
  MOBILE_PARENTS,
  ROUTES,
  canAccessRoute,
  getActiveMobileParentId,
  getBreadcrumb,
  getMobileParent,
  getRoute,
  routesForMobileParent,
} = require("../assets/js/navigation-model.js");

assert.deepStrictEqual(MOBILE_PARENTS.map((parent) => parent.label), ["오늘", "점검", "현황", "신고", "더보기"]);
assert.strictEqual(new Set(ROUTES.map((route) => route.id)).size, ROUTES.length, "route IDs must be unique");
assert(ROUTES.every((route) => route.label && route.group && route.permission && route.mobileParent && route.url && route.title), "every route must describe IA metadata");

assert.strictEqual(getRoute("pledge").url, "pledge.html");
assert.strictEqual(getActiveMobileParentId("pledge"), "more");
assert.strictEqual(getActiveMobileParentId("analytics"), "more");
assert.strictEqual(canAccessRoute("pledge", "worker"), true);
assert.strictEqual(canAccessRoute("analytics", "worker"), false);
assert.strictEqual(canAccessRoute("analytics", "admin"), true);
assert.deepStrictEqual(routesForMobileParent("more", "admin").map((route) => route.id), ["items", "pledge", "analytics", "manage", "pledgeComplete"]);

assert.strictEqual(getMobileParent("unsafe").id, "report");
assert.strictEqual(getMobileParent("materials").id, "report");
assert.deepStrictEqual(getBreadcrumb("unsafe").map((crumb) => crumb.label), ["신고", "불안전요소 신고"]);
assert.deepStrictEqual(getBreadcrumb("dashboard").map((crumb) => crumb.label), ["오늘"]);
assert.strictEqual(getRoute("missing"), null);
assert.strictEqual(getActiveMobileParentId("missing"), "");
assert.deepStrictEqual(getBreadcrumb("missing"), []);

console.log("navigation model tests passed");
