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
    if (mode === "materialName") return rows.sort((a, b) => (statusIndex(a.status, statuses) - statusIndex(b.status, statuses)) || compareText(a.materialName, b.materialName) || compareDateDesc(a, b));
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
    createWorkerSnapshot,
    filterRecords,
    groupMaterialsByShip,
    groupUnsafeByStatus,
    sortRecords,
    validateMaterialDraft,
    validateUnsafeDraft,
  };
});
