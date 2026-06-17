(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.StateShapeRules = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  // Collection de-duplication + legacy migration extracted from app-v2.
  // Each takes the source array/object and returns the new shape; side-effect
  // dependencies (id generator, palette, comparators) are injected via deps.
  // Behaviour matches the originals 1:1 (dedupeShips keeps in-place mutation
  // of ship objects so existing references stay valid).

  function dedupeChecklistItems(items) {
    const seen = new Set();
    return (Array.isArray(items) ? items : []).map((row) => {
      if (row.active === false) return row;
      const key = `${row.categoryId}::${String(row.text || "").trim().replace(/\s+/g, " ")}`;
      if (!String(row.text || "").trim() || seen.has(key)) return { ...row, active: false };
      seen.add(key);
      return row;
    });
  }

  function dedupeTools(tools, deps) {
    const d = deps || {};
    const normalizeToolName = d.normalizeToolName || ((name) => String(name || "").trim());
    const compareToolWrittenOrder = d.compareToolWrittenOrder || (() => 0);
    const list = Array.isArray(tools) ? tools : [];
    const keepers = new Map();
    const ranked = list
      .map((tool, index) => ({ tool, index, key: normalizeToolName(tool.name) }))
      .filter(({ tool, key }) => key && tool.deleted !== true)
      .sort((a, b) => compareToolWrittenOrder(a.tool, b.tool) || a.index - b.index);
    ranked.forEach(({ tool, key }) => {
      if (!keepers.has(key)) keepers.set(key, tool.id);
    });
    return list.map((tool) => {
      const key = normalizeToolName(tool.name);
      if (!key || tool.deleted === true) return tool;
      return keepers.get(key) === tool.id ? tool : { ...tool, deleted: true };
    });
  }

  function dedupeShips(ships, deps) {
    const d = deps || {};
    const normalizeShipNo = d.normalizeShipNo || ((no) => String(no || "").trim());
    const workflowStages = Array.isArray(d.workflowStages) ? d.workflowStages : [];
    const seen = new Set();
    return (Array.isArray(ships) ? ships : []).filter((ship) => {
      const no = normalizeShipNo(ship.no);
      if (!no || seen.has(no)) return false;
      seen.add(no);
      ship.no = no;
      ship.processStage = workflowStages.includes(ship.processStage) ? ship.processStage : "mounting";
      ship.deliveryType = ship.deliveryType || "";
      ship.deliveryDate = ship.deliveryDate || "";
      ship.lcDate = ship.lcDate || "";
      ship.stDate = ship.stDate || "";
      ship.clDate = ship.clDate || (ship.deliveryType === "C/L" ? ship.deliveryDate : "");
      ship.dlDate = ship.dlDate || (ship.deliveryType === "D/L" ? ship.deliveryDate : "");
      return true;
    });
  }

  function migrateOldChecklists(oldChecklists, deps) {
    const d = deps || {};
    const uid = d.uid || (() => "");
    const colors = Array.isArray(d.colors) ? d.colors : [];
    const categories = [];
    const sections = [];
    const items = [];
    Object.entries(oldChecklists || {}).forEach(([id, data], index) => {
      const categoryId = id || uid("cat");
      const sectionId = `${categoryId}_default`;
      const row = data || {};
      categories.push({
        id: categoryId,
        label: row.label || "작업 유형",
        icon: row.icon || String(index + 1),
        color: row.color || colors[index % colors.length],
        requireToolCheck: true,
        toolNature: "선행",
        order: index + 1,
      });
      sections.push({
        id: sectionId,
        categoryId,
        title: "기본 점검",
        order: 1,
      });
      (row.items || []).forEach((sourceItem, itemIndex) => {
        const si = sourceItem || {};
        items.push({
          id: si.id || uid("item"),
          categoryId,
          sectionId,
          text: si.text || "",
          risk: si.risk || "medium",
          required: (si.risk || "medium") === "high",
          active: true,
          toolIds: [],
          visibilityCondition: "항상 표시",
          order: itemIndex + 1,
        });
      });
    });
    return { categories, sections, items };
  }

  return {
    dedupeChecklistItems,
    dedupeTools,
    dedupeShips,
    migrateOldChecklists,
  };
});
