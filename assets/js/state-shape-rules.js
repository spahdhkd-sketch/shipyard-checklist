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

  function planWorkTypeChecklistMerge(input, deps) {
    const source = input || {};
    const targetCategoryId = String(source.targetCategoryId || "");
    const emptyPlan = { sections: [], items: [], skippedItemCount: 0 };
    if (!targetCategoryId) return emptyPlan;

    const d = deps || {};
    let generatedId = 0;
    const makeId = typeof d.uid === "function"
      ? d.uid
      : (prefix) => `${prefix}-merge-${Date.now()}-${++generatedId}`;
    const normalize = (value) => String(value || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("ko-KR");
    const clean = (value) => String(value || "").trim().replace(/\s+/g, " ");
    const targetSections = (Array.isArray(source.targetSections) ? source.targetSections : [])
      .filter((row) => String(row.categoryId || "") === targetCategoryId);
    const targetItems = (Array.isArray(source.targetItems) ? source.targetItems : [])
      .filter((row) => String(row.categoryId || "") === targetCategoryId && row.active !== false);
    const additions = [];
    const itemAdditions = [];
    const sectionByTitle = new Map();
    const sectionIdBySourceKey = new Map();
    let nextSectionOrder = targetSections.reduce((max, row) => Math.max(max, Number(row.order || 0)), 0);

    targetSections.forEach((row) => {
      const titleKey = normalize(row.title);
      if (titleKey && !sectionByTitle.has(titleKey)) sectionByTitle.set(titleKey, row);
    });

    const ensureSection = (row) => {
      const title = clean(row?.title) || "기본 점검";
      const titleKey = normalize(title);
      let section = sectionByTitle.get(titleKey);
      if (!section) {
        section = {
          id: makeId("section"),
          categoryId: targetCategoryId,
          title,
          order: ++nextSectionOrder,
        };
        additions.push(section);
        sectionByTitle.set(titleKey, section);
      }
      const sourceKey = String(row?.key || row?.id || titleKey);
      sectionIdBySourceKey.set(sourceKey, section.id);
      return section;
    };

    (Array.isArray(source.incomingSections) ? source.incomingSections : []).forEach(ensureSection);
    const seenItemTexts = new Set(targetItems.map((row) => normalize(row.text)).filter(Boolean));
    const nextItemOrderBySection = new Map();
    targetItems.forEach((row) => {
      const sectionId = String(row.sectionId || "");
      nextItemOrderBySection.set(sectionId, Math.max(nextItemOrderBySection.get(sectionId) || 0, Number(row.order || 0)));
    });

    let skippedItemCount = 0;
    (Array.isArray(source.incomingItems) ? source.incomingItems : []).forEach((row) => {
      const text = clean(row?.text);
      const textKey = normalize(text);
      if (!textKey || seenItemTexts.has(textKey)) {
        skippedItemCount += 1;
        return;
      }
      const sourceKey = String(row?.sectionKey || "");
      const section = sectionIdBySourceKey.has(sourceKey)
        ? { id: sectionIdBySourceKey.get(sourceKey) }
        : ensureSection({ key: sourceKey || "__default__", title: row?.sectionTitle || "기본 점검" });
      const nextOrder = (nextItemOrderBySection.get(section.id) || 0) + 1;
      nextItemOrderBySection.set(section.id, nextOrder);
      seenItemTexts.add(textKey);
      itemAdditions.push({
        id: makeId("item"),
        categoryId: targetCategoryId,
        sectionId: section.id,
        text,
        risk: ["low", "medium", "high"].includes(row?.risk) ? row.risk : "low",
        required: row?.required === true,
        active: true,
        toolIds: Array.isArray(row?.toolIds) ? Array.from(new Set(row.toolIds.filter(Boolean))) : [],
        visibilityCondition: row?.visibilityCondition || null,
        order: nextOrder,
      });
    });

    return { sections: additions, items: itemAdditions, skippedItemCount };
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

  function normalizedIdSet(values) {
    return new Set((Array.isArray(values) ? values : [values])
      .map((value) => String(value || "").trim())
      .filter(Boolean));
  }

  function copyCategoryToolIds(sourceToolIds, availableToolIds) {
    const available = normalizedIdSet(Array.isArray(availableToolIds) ? availableToolIds : []);
    const seen = new Set();
    return (Array.isArray(sourceToolIds) ? sourceToolIds : [])
      .map((value) => String(value || "").trim())
      .filter((id) => id && available.has(id) && !seen.has(id) && seen.add(id));
  }

  function missingRemoteRowIds(cachedRows, existingIds, pendingIds) {
    const existing = normalizedIdSet(existingIds);
    const pending = normalizedIdSet(pendingIds);
    const missing = [];
    const seen = new Set();
    (Array.isArray(cachedRows) ? cachedRows : []).forEach((row) => {
      const id = String(row?.id || "").trim();
      if (!id || seen.has(id) || existing.has(id) || pending.has(id)) return;
      seen.add(id);
      missing.push(id);
    });
    return missing;
  }

  function reconciledRemoteDeletedRowIds({
    cachedRows,
    tombstoneIds,
    existingIds,
    pendingIds,
    preserveUnconfirmedMissing = false,
  } = {}) {
    const tombstones = normalizedIdSet(tombstoneIds);
    const deletedIds = [];
    const seen = new Set();
    (Array.isArray(cachedRows) ? cachedRows : []).forEach((row) => {
      const id = String(row?.id || "").trim();
      if (!id || seen.has(id) || !tombstones.has(id)) return;
      seen.add(id);
      deletedIds.push(id);
    });
    if (preserveUnconfirmedMissing) return deletedIds;
    missingRemoteRowIds(cachedRows, existingIds, pendingIds).forEach((id) => {
      if (seen.has(id)) return;
      seen.add(id);
      deletedIds.push(id);
    });
    return deletedIds;
  }

  function syncJobRequiresInspectionDeleteWins(job) {
    if (!job) return false;
    if (job.type === "full") return true;
    const keys = Array.isArray(job.keys) ? job.keys : [];
    return keys.some((key) => key === "inspections" || key === "inspectionItems");
  }

  function syncJobContainsDeletedRows(job, key, deletedIds) {
    const targetKey = String(key || "").trim();
    const removeIds = normalizedIdSet(deletedIds);
    if (!job || !targetKey || !removeIds.size) return false;
    if (job.type === "full") return true;
    const jobIds = Array.isArray(job.rowIdsByKey?.[targetKey]) ? job.rowIdsByKey[targetKey] : [];
    return jobIds.some((id) => removeIds.has(String(id || "").trim()));
  }

  function removeRemoteDeletedRows(snapshot, key, deletedIds) {
    const source = snapshot && typeof snapshot === "object" ? snapshot : {};
    const removeIds = normalizedIdSet(deletedIds);
    const rows = Array.isArray(source.rows) ? source.rows : [];
    const archivedInspections = Array.isArray(source.archivedInspections) ? source.archivedInspections : [];
    const inspectionItems = Array.isArray(source.inspectionItems) ? source.inspectionItems : [];
    const selectedHistoryIds = Array.isArray(source.selectedHistoryIds) ? source.selectedHistoryIds : [];
    const base = {
      rows,
      archivedInspections,
      inspectionItems,
      selectedHistoryIds,
      historyDetailId: source.historyDetailId || null,
      removedItemIds: [],
      changed: false,
    };
    if (!String(key || "").trim() || !removeIds.size) return base;

    const nextRows = rows.filter((row) => !removeIds.has(String(row?.id || "")));
    if (key !== "inspections") {
      return {
        ...base,
        rows: nextRows,
        changed: nextRows.length !== rows.length,
      };
    }

    const removedItems = inspectionItems.filter((row) => removeIds.has(String(row?.inspectionId || "")));
    const nextArchivedInspections = archivedInspections.filter((row) => !removeIds.has(String(row?.id || "")));
    const nextInspectionItems = inspectionItems.filter((row) => !removeIds.has(String(row?.inspectionId || "")));
    const nextSelectedHistoryIds = selectedHistoryIds.filter((id) => !removeIds.has(String(id || "")));
    const nextHistoryDetailId = removeIds.has(String(source.historyDetailId || "")) ? null : (source.historyDetailId || null);
    return {
      rows: nextRows,
      archivedInspections: nextArchivedInspections,
      inspectionItems: nextInspectionItems,
      selectedHistoryIds: nextSelectedHistoryIds,
      historyDetailId: nextHistoryDetailId,
      removedItemIds: removedItems.map((row) => row.id).filter(Boolean),
      changed: nextRows.length !== rows.length
        || nextArchivedInspections.length !== archivedInspections.length
        || nextInspectionItems.length !== inspectionItems.length
        || nextSelectedHistoryIds.length !== selectedHistoryIds.length
        || nextHistoryDetailId !== (source.historyDetailId || null),
    };
  }

  return {
    dedupeChecklistItems,
    planWorkTypeChecklistMerge,
    dedupeTools,
    dedupeShips,
    copyCategoryToolIds,
    migrateOldChecklists,
    missingRemoteRowIds,
    reconciledRemoteDeletedRowIds,
    removeRemoteDeletedRows,
    syncJobContainsDeletedRows,
    syncJobRequiresInspectionDeleteWins,
  };
});
