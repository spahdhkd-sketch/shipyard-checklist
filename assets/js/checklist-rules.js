(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ChecklistRules = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  const TOOL_NATURES = ["선행", "후행", "선행/후행"];

  function sanitizeToolIds(toolIds) {
    return [...new Set((Array.isArray(toolIds) ? toolIds : [])
      .map((id) => String(id || "").trim())
      .filter(Boolean))];
  }

  function normalizeToolNature(value) {
    const text = String(value || "").trim().replace("선/후행", "선행/후행");
    return TOOL_NATURES.includes(text) ? text : "선행";
  }

  function normalizeVisibilityCondition(value) {
    const text = String(value || "").trim().replace("선/후행", "선행/후행");
    if (text === "항상 표시") return "항상 표시";
    return TOOL_NATURES.includes(text) ? text : "항상 표시";
  }

  function toolMatchesCategoryNature(tool, categoryNature) {
    const toolNature = normalizeToolNature(tool && tool.nature);
    const nature = normalizeToolNature(categoryNature);
    if (nature === "선행") return toolNature === "선행" || toolNature === "선행/후행";
    if (nature === "후행") return toolNature === "후행" || toolNature === "선행/후행";
    return TOOL_NATURES.includes(toolNature);
  }

  function visibleConditionsForTools(tools) {
    const allowed = new Set(["항상 표시"]);
    (Array.isArray(tools) ? tools : []).forEach((tool) => {
      const nature = normalizeToolNature(tool && tool.nature);
      if (nature === "선행") {
        allowed.add("선행");
        allowed.add("선행/후행");
      } else if (nature === "후행") {
        allowed.add("후행");
        allowed.add("선행/후행");
      } else {
        TOOL_NATURES.forEach((value) => allowed.add(value));
      }
    });
    return allowed;
  }

  function itemMatchesSelectedTools(item, selectedToolIds) {
    const linkedToolIds = sanitizeToolIds(item && item.toolIds);
    if (!linkedToolIds.length) return true;
    const selected = new Set(sanitizeToolIds(selectedToolIds));
    return linkedToolIds.some((id) => selected.has(id));
  }

  function filterChecklistItems({ items, tools, selectedToolIds, categoryNature }) {
    const selected = new Set(sanitizeToolIds(selectedToolIds));
    const selectedTools = (Array.isArray(tools) ? tools : [])
      .filter((tool) => selected.has(String(tool && tool.id || "")))
      .filter((tool) => toolMatchesCategoryNature(tool, categoryNature));
    const visibleConditions = visibleConditionsForTools(selectedTools);

    return (Array.isArray(items) ? items : []).filter((item) => {
      const condition = normalizeVisibilityCondition(item && item.visibilityCondition);
      return visibleConditions.has(condition) && itemMatchesSelectedTools(item, selectedToolIds);
    });
  }

  return {
    TOOL_NATURES,
    filterChecklistItems,
    itemMatchesSelectedTools,
    normalizeToolNature,
    normalizeVisibilityCondition,
    sanitizeToolIds,
    toolMatchesCategoryNature,
    visibleConditionsForTools,
  };
});
