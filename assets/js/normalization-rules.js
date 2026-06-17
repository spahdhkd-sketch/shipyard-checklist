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
      .map((job) => ({
        id: job.id || uid("sync"),
        type: job.type,
        keys: Array.isArray(job.keys) ? [...new Set(job.keys.map(String))] : [],
        rowIdsByKey: job.rowIdsByKey && typeof job.rowIdsByKey === "object" ? job.rowIdsByKey : {},
        attempts: Math.max(0, Number(job.attempts) || 0),
        createdAt: job.createdAt || now(),
        nextRetryAt: job.nextRetryAt || "",
      }))
      .filter((job) => job.type === "full" || job.keys.length);
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
    normalizeStatusRecords,
    normalizePendingPhotoUploads,
  };
});
