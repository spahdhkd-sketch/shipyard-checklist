(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MaterialBulkSelection = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  const BULK_SCOPE_SELECTED = "selected";
  const BULK_SCOPE_FILTERED = "filtered";

  function compactText(value) {
    return String(value == null ? "" : value).trim();
  }

  function recordId(value) {
    if (value && typeof value === "object") return compactText(value.id);
    return compactText(value);
  }

  function uniqueIds(values) {
    const ids = new Set();
    (Array.isArray(values) ? values : []).forEach((value) => {
      const id = recordId(value);
      if (id) ids.add(id);
    });
    return [...ids].sort((a, b) => a.localeCompare(b));
  }

  function selectedIdsFromState(selectionState) {
    if (Array.isArray(selectionState)) return uniqueIds(selectionState);
    const selectedById = selectionState && typeof selectionState === "object"
      ? selectionState.selectedById
      : null;
    if (!selectedById || typeof selectedById !== "object" || Array.isArray(selectedById)) return [];
    return Object.keys(selectedById)
      .filter((id) => selectedById[id] === true)
      .map(recordId)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }

  function createMaterialBulkSelectionState(seed) {
    const selectedById = {};
    selectedIdsFromState(seed).forEach((id) => {
      selectedById[id] = true;
    });
    return { selectedById };
  }

  function setMaterialBulkSelected(selectionState, id, selected) {
    const selectedById = { ...createMaterialBulkSelectionState(selectionState).selectedById };
    const normalizedId = recordId(id);
    if (!normalizedId) return { selectedById };
    if (selected) selectedById[normalizedId] = true;
    else delete selectedById[normalizedId];
    return { selectedById };
  }

  function clearMaterialBulkSelection() {
    return { selectedById: {} };
  }

  function recordsById(records) {
    const byId = new Map();
    (Array.isArray(records) ? records : []).forEach((record) => {
      const id = recordId(record);
      if (id && !byId.has(id)) byId.set(id, record);
    });
    return byId;
  }

  function canonicalRecords(records, sourceRecords) {
    const sourceById = recordsById(sourceRecords);
    const seen = new Set();
    return (Array.isArray(records) ? records : []).reduce((result, record) => {
      const id = recordId(record);
      if (!id || seen.has(id) || !sourceById.has(id)) return result;
      seen.add(id);
      result.push(sourceById.get(id));
      return result;
    }, []);
  }

  function normalizeScope(scope) {
    return scope === BULK_SCOPE_FILTERED ? BULK_SCOPE_FILTERED : BULK_SCOPE_SELECTED;
  }

  function reconcileMaterialBulkSelection(selectionState, records) {
    const availableIds = new Set(recordsById(records).keys());
    const selectedIds = selectedIdsFromState(selectionState);
    const keptIds = selectedIds.filter((id) => availableIds.has(id));
    return {
      selectionState: createMaterialBulkSelectionState(keptIds),
      selectedIds: keptIds,
      staleIds: selectedIds.filter((id) => !availableIds.has(id)),
    };
  }

  function validTargetStatus(targetStatus, validStatuses) {
    if (!targetStatus) return false;
    const statuses = uniqueIds(validStatuses);
    return !statuses.length || statuses.includes(targetStatus);
  }

  function buildMaterialBulkReview(options = {}) {
    const records = canonicalRecords(options.records, options.records);
    const recordById = recordsById(records);
    const filteredRecords = canonicalRecords(options.filteredRecords, records);
    const scope = normalizeScope(options.scope);
    const selectedIds = selectedIdsFromState(options.selectionState);
    const staleSelectedIds = selectedIds.filter((id) => !recordById.has(id));
    const selectedRecords = records.filter((record) => selectedIds.includes(recordId(record)));
    const targetRecords = scope === BULK_SCOPE_FILTERED ? filteredRecords : selectedRecords;
    const targetIds = targetRecords.map(recordId);
    const targetIdSet = new Set(targetIds);
    const targetStatus = compactText(options.targetStatus);
    const memo = compactText(options.memo);
    const memoRequired = options.memoRequired !== false;
    const statusValid = validTargetStatus(targetStatus, options.validStatuses);
    const validationErrors = [];
    if (!targetRecords.length) validationErrors.push("target_required");
    if (!targetStatus) validationErrors.push("status_required");
    else if (!statusValid) validationErrors.push("status_invalid");
    if (memoRequired && !memo) validationErrors.push("memo_required");

    return {
      scope,
      selectionState: reconcileMaterialBulkSelection(options.selectionState, records).selectionState,
      selectedIds,
      staleSelectedIds,
      selectedCount: selectedRecords.length,
      filteredCount: filteredRecords.length,
      targetIds,
      targetRecords,
      targetCount: targetRecords.length,
      excludedRecords: records.filter((record) => !targetIdSet.has(recordId(record))),
      excludedCount: records.length - targetRecords.length,
      targetStatus,
      memo,
      memoRequired,
      memoProvided: Boolean(memo),
      statusValid,
      beforeAfter: targetRecords.map((record) => ({
        id: recordId(record),
        record,
        beforeStatus: compactText(record.status),
        afterStatus: targetStatus,
        changed: compactText(record.status) !== targetStatus,
      })),
      validationErrors,
      canSubmit: validationErrors.length === 0,
    };
  }

  function resultSucceeded(result) {
    return Boolean(result && (result.ok === true || result.success === true || result.status === "fulfilled"));
  }

  function resultError(result) {
    if (!result) return "";
    if (result.error instanceof Error) return result.error.message;
    return compactText(result.error) || compactText(result.message) || "update_failed";
  }

  function buildMaterialBulkResultSummary(review, results) {
    const targetRecords = Array.isArray(review && review.targetRecords) ? review.targetRecords : [];
    const targetIds = uniqueIds(targetRecords);
    const targetIdSet = new Set(targetIds);
    const resultById = new Map();
    const ignoredResultIds = [];
    (Array.isArray(results) ? results : []).forEach((result) => {
      const id = recordId(result);
      if (!id) return;
      if (!targetIdSet.has(id)) {
        ignoredResultIds.push(id);
        return;
      }
      if (!resultById.has(id)) resultById.set(id, result);
    });

    const succeededRecords = [];
    const failedRecords = [];
    const pendingRecords = [];
    targetRecords.forEach((record) => {
      const id = recordId(record);
      const result = resultById.get(id);
      if (!result) {
        pendingRecords.push({ id, record });
      } else if (resultSucceeded(result)) {
        succeededRecords.push({ id, record, result });
      } else {
        failedRecords.push({ id, record, result, error: resultError(result) });
      }
    });

    return {
      targetCount: targetRecords.length,
      succeededCount: succeededRecords.length,
      failedCount: failedRecords.length,
      pendingCount: pendingRecords.length,
      succeededRecords,
      failedRecords,
      pendingRecords,
      ignoredResultIds: uniqueIds(ignoredResultIds),
      complete: failedRecords.length === 0 && pendingRecords.length === 0,
      partialFailure: succeededRecords.length > 0 && (failedRecords.length > 0 || pendingRecords.length > 0),
    };
  }

  return {
    BULK_SCOPE_FILTERED,
    BULK_SCOPE_SELECTED,
    buildMaterialBulkResultSummary,
    buildMaterialBulkReview,
    clearMaterialBulkSelection,
    createMaterialBulkSelectionState,
    reconcileMaterialBulkSelection,
    setMaterialBulkSelected,
  };
});
