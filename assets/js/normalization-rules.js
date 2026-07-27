(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.NormalizationRules = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  // Pure data-shape normalizers extracted from app-v2. Side effects (id/clock)
  // are injected via deps so behaviour stays identical to the originals.

  function normalizePendingSyncQueue(value, deps) {
    const d = deps || {};
    const uid = d.uid || (() => "");
    const now = d.now || (() => new Date().toISOString());
    return (Array.isArray(value) ? value : [])
      .filter((job) => job && typeof job === "object" && ["rows", "full"].includes(job.type))
      .map((job) => {
        const keys = Array.isArray(job.keys) ? [...new Set(job.keys.map(String))] : [];
        const legacyFailure = job.type === "full"
          ? "이전 전체 동기화 작업은 안전하게 자동 전송할 수 없습니다."
          : keys.includes("issuePhotos")
            ? "사진은 별도 사진 재전송 화면에서 다시 선택해야 합니다."
            : "";
        const session = job.mutationSession && typeof job.mutationSession === "object"
          ? {
            token: String(job.mutationSession.token || ""),
            workerId: String(job.mutationSession.workerId || job.ownerWorkerId || ""),
            expiresAt: String(job.mutationSession.expiresAt || ""),
          }
          : null;
        return {
          id: job.id || uid("sync"),
          type: job.type,
          keys,
          rowIdsByKey: job.rowIdsByKey && typeof job.rowIdsByKey === "object" ? job.rowIdsByKey : {},
          ownerWorkerId: String(job.ownerWorkerId || ""),
          mutationSession: session?.token ? session : null,
          status: legacyFailure || job.status === "failed" ? "failed" : "pending",
          attempts: Math.max(0, Number(job.attempts) || 0),
          createdAt: job.createdAt || now(),
          nextRetryAt: job.nextRetryAt || "",
          lastError: String(job.lastError || legacyFailure),
          failedAt: String(job.failedAt || (legacyFailure ? now() : "")),
        };
      })
      .filter((job) => job.type === "full" || job.keys.length);
  }

  function pendingRowsForVersionRefresh(key, rows, queue) {
    const sourceRows = Array.isArray(rows) ? rows : [];
    const jobs = Array.isArray(queue) ? queue.filter((job) => job && typeof job === "object") : [];
    if (jobs.some((job) => job.type === "full")) return sourceRows;

    const pendingIds = new Set();
    jobs.forEach((job) => {
      if (job.type !== "rows") return;
      const ids = job.rowIdsByKey && typeof job.rowIdsByKey === "object"
        ? job.rowIdsByKey[key]
        : [];
      (Array.isArray(ids) ? ids : []).forEach((id) => pendingIds.add(String(id)));
    });
    if (!pendingIds.size) return [];
    return sourceRows.filter((row) => row && pendingIds.has(String(row.id)));
  }

  function normalizeStatusRecords(records, statuses, deps) {
    const d = deps || {};
    const now = d.now || (() => new Date().toISOString());
    const buildRecordTimeline = d.buildRecordTimeline || (() => []);
    const list = Array.isArray(statuses) ? statuses : [];
    return (Array.isArray(records) ? records : []).map((record) => {
      const row = record && typeof record === "object" ? record : {};
      const status = list.includes(row.status) ? row.status : list[0];
      const createdAt = row.createdAt || row.updatedAt || now();
      const updatedAt = row.updatedAt || createdAt;
      const normalized = {
        ...row,
        status,
        adminMemo: String(row.adminMemo || "").trim(),
        createdAt,
        updatedAt,
        completedAt: row.completedAt || "",
      };
      return {
        ...normalized,
        statusHistory: buildRecordTimeline(normalized, { initialStatus: list[0] }),
      };
    });
  }

  function normalizePendingPhotoUploads(records, deps) {
    const d = deps || {};
    const uid = d.uid || (() => "");
    const now = d.now || (() => new Date().toISOString());
    const photoDataUrlForStorage = d.photoDataUrlForStorage || ((value) => value);
    return (Array.isArray(records) ? records : [])
      .filter((row) => row && row.issueId)
      .map((row, index) => ({
        id: row.id || uid("pendingPhoto"),
        issueId: String(row.issueId || ""),
        ownerWorkerId: String(row.ownerWorkerId || ""),
        fileName: String(row.fileName || `photo-${index + 1}.jpg`),
        fileType: String(row.fileType || "image/jpeg"),
        fileSize: Number(row.fileSize || 0),
        dataUrl: photoDataUrlForStorage(row.dataUrl),
        status: row.status === "uploading" ? "failed" : String(row.status || "failed"),
        errorMessage: String(row.errorMessage || ""),
        createdAt: row.createdAt || now(),
        updatedAt: row.updatedAt || row.createdAt || now(),
      }));
  }

  return {
    normalizePendingSyncQueue,
    pendingRowsForVersionRefresh,
    normalizeStatusRecords,
    normalizePendingPhotoUploads,
  };
});
