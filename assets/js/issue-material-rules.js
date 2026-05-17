(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.IssueMaterialRules = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  const UNSAFE_STATUSES = ["접수", "조치중", "완료"];
  const MATERIAL_STATUSES = ["접수", "확인중", "완료"];
  const MAX_UNSAFE_PHOTOS = 3;

  function compactText(value) {
    return String(value || "").trim();
  }

  function compareText(a, b) {
    return String(a || "").localeCompare(String(b || ""), "ko-KR", { numeric: true, sensitivity: "base" });
  }

  function compareDateDesc(a, b) {
    return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  }

  function statusIndex(status, statuses) {
    const index = statuses.indexOf(status);
    return index === -1 ? statuses.length : index;
  }

  function normalizeTimelineEntry(entry) {
    if (!entry || typeof entry !== "object") return null;
    const status = compactText(entry.status);
    const changedAt = compactText(entry.changedAt);
    if (!status || !changedAt) return null;
    const actor = compactText(entry.actor) || "관리자";
    const memo = compactText(entry.memo);
    return {
      id: compactText(entry.id) || `${changedAt}:${status}:${actor}`,
      status,
      memo,
      changedAt,
      actor,
    };
  }

  function uniqueTimelineEntries(entries) {
    const seen = new Set();
    return entries
      .map(normalizeTimelineEntry)
      .filter(Boolean)
      .filter((entry) => {
        const key = `${entry.changedAt}\u0000${entry.status}\u0000${entry.memo}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => String(a.changedAt).localeCompare(String(b.changedAt)));
  }

  function buildRecordTimeline(record, options = {}) {
    const row = record && typeof record === "object" ? record : {};
    const initialStatus = compactText(options.initialStatus) || "접수";
    const entries = Array.isArray(row.statusHistory) ? [...row.statusHistory] : [];
    const createdAt = compactText(row.createdAt);
    const updatedAt = compactText(row.completedAt) || compactText(row.updatedAt);
    const currentStatus = compactText(row.status) || initialStatus;
    const memo = compactText(row.adminMemo);

    if (createdAt) {
      entries.push({
        status: initialStatus,
        memo: "",
        changedAt: createdAt,
        actor: compactText(row.workerNameSnapshot) || "작업자",
      });
    }

    if (updatedAt && (currentStatus !== initialStatus || memo)) {
      entries.push({
        status: currentStatus,
        memo,
        changedAt: updatedAt,
        actor: "관리자",
      });
    }

    return uniqueTimelineEntries(entries);
  }

  function appendStatusHistoryEntry(record, entry, options = {}) {
    const row = record && typeof record === "object" ? record : {};
    const existing = Array.isArray(row.statusHistory) ? row.statusHistory : buildRecordTimeline(row, options);
    return uniqueTimelineEntries([...existing, entry]);
  }

  function createWorkerSnapshot(workerId, workers) {
    const worker = (Array.isArray(workers) ? workers : []).find((row) => row.id === workerId);
    return {
      workerId: worker ? worker.id : "",
      workerNameSnapshot: worker ? worker.name : "",
      workerTeamSnapshot: worker ? worker.team || "" : "",
    };
  }

  function validateUnsafeDraft(draft) {
    const errors = [];
    if (!compactText(draft && draft.shipNo)) errors.push("호선을 선택하세요.");
    if (!compactText(draft && draft.content)) errors.push("내용을 입력하세요.");
    if (!compactText(draft && draft.workerId)) errors.push("등록자를 선택하세요.");
    return errors;
  }

  function validateMaterialDraft(draft) {
    const errors = [];
    if (!compactText(draft && draft.shipNo)) errors.push("호선을 선택하세요.");
    if (!compactText(draft && draft.materialName)) errors.push("자재명을 입력하세요.");
    if (!compactText(draft && draft.content)) errors.push("내용을 입력하세요.");
    if (!compactText(draft && draft.workerId)) errors.push("등록자를 선택하세요.");
    return errors;
  }

  function filterRecords(records, filters) {
    const shipNo = compactText(filters && filters.shipNo);
    const status = compactText(filters && filters.status);
    const workerId = compactText(filters && filters.workerId);
    const materialName = compactText(filters && filters.materialName);
    return (Array.isArray(records) ? records : []).filter((row) => {
      if (shipNo && row.shipNo !== shipNo) return false;
      if (status && row.status !== status) return false;
      if (workerId && row.workerId !== workerId) return false;
      if (materialName && !String(row.materialName || "").includes(materialName)) return false;
      return true;
    });
  }

  function sortRecords(records, mode, statuses) {
    const rows = [...(Array.isArray(records) ? records : [])];
    if (mode === "latest") return rows.sort(compareDateDesc);
    if (mode === "shipNo") return rows.sort((a, b) => compareText(a.shipNo, b.shipNo) || compareDateDesc(a, b));
    if (mode === "worker") return rows.sort((a, b) => compareText(a.workerNameSnapshot, b.workerNameSnapshot) || compareDateDesc(a, b));
    if (mode === "materialName") return rows.sort((a, b) => compareText(a.materialName, b.materialName) || compareDateDesc(a, b));
    return rows.sort((a, b) => (statusIndex(a.status, statuses) - statusIndex(b.status, statuses)) || compareDateDesc(a, b));
  }

  function groupUnsafeByStatus(records) {
    const sorted = sortRecords(records, "status", UNSAFE_STATUSES);
    return UNSAFE_STATUSES.map((status) => ({
      status,
      collapsed: status === "완료",
      records: sorted.filter((row) => row.status === status),
    }));
  }

  function groupMaterialsByShip(records) {
    const sorted = sortRecords(records, "status", MATERIAL_STATUSES);
    const shipNos = [...new Set(sorted.map((row) => row.shipNo).filter(Boolean))]
      .sort((a, b) => compareText(a, b));
    return shipNos.map((shipNo) => ({
      shipNo,
      records: sorted.filter((row) => row.shipNo === shipNo),
      completedCollapsed: true,
    }));
  }

  return {
    MATERIAL_STATUSES,
    MAX_UNSAFE_PHOTOS,
    UNSAFE_STATUSES,
    appendStatusHistoryEntry,
    buildRecordTimeline,
    createWorkerSnapshot,
    filterRecords,
    groupMaterialsByShip,
    groupUnsafeByStatus,
    sortRecords,
    validateMaterialDraft,
    validateUnsafeDraft,
  };
});
