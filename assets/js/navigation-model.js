(function attachNavigationModel(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.ShipyardNavigationModel = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function buildNavigationModel() {
  const MOBILE_PARENTS = Object.freeze([
    Object.freeze({ id: "today", label: "오늘", url: "index.html", title: "오늘" }),
    Object.freeze({ id: "inspection", label: "점검", url: "check.html", title: "작업 전 점검" }),
    Object.freeze({ id: "status", label: "현황", url: "history.html", title: "점검 현황" }),
    Object.freeze({ id: "report", label: "신고", url: "unsafe.html", title: "안전 신고" }),
    Object.freeze({ id: "more", label: "더보기", url: "items.html", title: "더보기" }),
  ]);

  const ROUTES = Object.freeze([
    Object.freeze({ id: "dashboard", label: "오늘", group: "today", permission: "worker", mobileParent: "today", url: "index.html", title: "오늘" }),
    Object.freeze({ id: "check", label: "작업 전 점검", group: "inspection", permission: "worker", mobileParent: "inspection", url: "check.html", title: "작업 전 점검" }),
    Object.freeze({ id: "history", label: "점검 이력", group: "status", permission: "worker", mobileParent: "status", url: "history.html", title: "점검 이력" }),
    Object.freeze({ id: "ships", label: "호선", group: "status", permission: "worker", mobileParent: "status", url: "ships.html", title: "호선 현황" }),
    Object.freeze({ id: "unsafe", label: "불안전요소 신고", group: "report", permission: "worker", mobileParent: "report", url: "unsafe.html", title: "불안전요소 신고" }),
    Object.freeze({ id: "materials", label: "자재 누락 신고", group: "report", permission: "worker", mobileParent: "report", url: "materials.html", title: "자재 누락 신고" }),
    Object.freeze({ id: "items", label: "빠른 메뉴", group: "more", permission: "worker", mobileParent: "more", url: "items.html", title: "빠른 메뉴" }),
    Object.freeze({ id: "pledge", label: "안전 서약", group: "more", permission: "worker", mobileParent: "more", url: "pledge.html", title: "안전 서약" }),
    Object.freeze({ id: "analytics", label: "통계", group: "more", permission: "admin", mobileParent: "more", url: "analytics.html", title: "안전 통계" }),
    Object.freeze({ id: "manage", label: "관리", group: "more", permission: "admin", mobileParent: "more", url: "manage.html", title: "관리" }),
    Object.freeze({ id: "pledgeComplete", label: "안전 서약 완료", group: "more", permission: "worker", mobileParent: "more", url: "pledge.html", title: "안전 서약 완료" }),
  ]);

  const routeById = new Map(ROUTES.map((route) => [route.id, route]));
  const mobileParentById = new Map(MOBILE_PARENTS.map((parent) => [parent.id, parent]));
  const permissionRank = Object.freeze({ worker: 1, admin: 2 });

  function getRoute(routeId) {
    return routeById.get(String(routeId || "").trim()) || null;
  }

  function getMobileParent(routeId) {
    const route = getRoute(routeId);
    return route ? mobileParentById.get(route.mobileParent) || null : null;
  }

  function getActiveMobileParentId(routeId) {
    return getMobileParent(routeId)?.id || "";
  }

  function getBreadcrumb(routeId) {
    const route = getRoute(routeId);
    const parent = getMobileParent(routeId);
    if (!route || !parent) return [];
    const parentCrumb = { id: parent.id, label: parent.label, title: parent.title, url: parent.url, active: route.id === "dashboard" };
    if (route.id === "dashboard") return [parentCrumb];
    return [parentCrumb, { id: route.id, label: route.label, title: route.title, url: route.url, active: true }];
  }

  function canAccessRoute(routeId, role) {
    const route = getRoute(routeId);
    return Boolean(route && (permissionRank[role] || 0) >= permissionRank[route.permission]);
  }

  function routesForMobileParent(parentId, role) {
    return ROUTES.filter((route) => route.mobileParent === parentId && (!role || canAccessRoute(route.id, role)));
  }

  return {
    MOBILE_PARENTS,
    ROUTES,
    canAccessRoute,
    getActiveMobileParentId,
    getBreadcrumb,
    getMobileParent,
    getRoute,
    routesForMobileParent,
  };
}));
