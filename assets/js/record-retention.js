(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.RecordRetention = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  const ACTIONS = new Set(["archive", "restore", "purge_expired"]);
  const RESOURCE_TYPE_PATTERN = /^[a-z][a-z0-9_]{0,79}$/;
  const MAX_REASON_LENGTH = 500;
  const MAX_RETENTION_DAYS = 3650;

  class RetentionContractError extends Error {
    constructor(code) {
      super(code);
      this.name = "RetentionContractError";
      this.code = code;
    }
  }

  function fail(code) {
    throw new RetentionContractError(code);
  }

  function requiredText(value, code, maxLength = 120) {
    const text = typeof value === "string" ? value.trim() : "";
    if (!text) fail(code);
    if (text.length > maxLength) fail(`${code}_too_long`);
    return text;
  }

  function isoTimestamp(value, code) {
    const text = requiredText(value, code, 40);
    const timestamp = new Date(text);
    if (Number.isNaN(timestamp.getTime())) fail(code);
    return timestamp.toISOString();
  }

  function affectedCount(value) {
    if (!Number.isSafeInteger(value) || value < 1) fail("affected_count_invalid");
    return value;
  }

  function buildDangerActionPreview(input) {
    const data = input || {};
    const action = requiredText(data.action, "action_required", 40);
    if (!ACTIONS.has(action)) fail("action_unsupported");
    const resourceType = requiredText(data.resourceType, "resource_type_required", 80);
    if (!RESOURCE_TYPE_PATTERN.test(resourceType)) fail("resource_type_invalid");
    const count = affectedCount(data.affectedCount);
    const reason = requiredText(data.reason, "reason_required", MAX_REASON_LENGTH);
    let retentionExpiresAt = null;
    if (action === "archive") {
      if (!Number.isSafeInteger(data.retentionDays)
        || data.retentionDays < 1
        || data.retentionDays > MAX_RETENTION_DAYS) fail("retention_days_invalid");
      const now = data.now === undefined ? new Date().toISOString() : isoTimestamp(data.now, "now_invalid");
      retentionExpiresAt = new Date(new Date(now).getTime() + (data.retentionDays * 86400000)).toISOString();
    }
    const preview = {
      kind: "retention-danger-preview",
      action,
      resourceType,
      affectedCount: count,
      reason,
      reversible: action !== "purge_expired",
      requiresAffectedCountConfirmation: true,
      confirmationToken: `${action}:${count}`,
    };
    if (retentionExpiresAt) preview.retentionExpiresAt = retentionExpiresAt;
    return Object.freeze(preview);
  }

  function parseAuditMetadata(value) {
    const audit = value || {};
    const parsed = {
      actorRef: requiredText(audit.actorRef, "actor_ref_required"),
    };
    if (audit.mutationSessionId !== undefined) {
      parsed.mutationSessionId = requiredText(audit.mutationSessionId, "mutation_session_id_required");
    }
    parsed.requestId = requiredText(audit.requestId, "request_id_required");
    parsed.requestedAt = isoTimestamp(audit.requestedAt, "requested_at_invalid");
    return Object.freeze(parsed);
  }

  function confirmDangerAction(input) {
    const data = input || {};
    const preview = data.preview;
    if (!preview || preview.kind !== "retention-danger-preview") fail("preview_invalid");
    if (affectedCount(data.confirmedAffectedCount) !== preview.affectedCount) fail("affected_count_mismatch");
    return Object.freeze({
      kind: "retention-mutation",
      preview,
      audit: parseAuditMetadata(data.audit),
    });
  }

  function filterActiveRecords(records) {
    const list = Array.isArray(records) ? records : [];
    return list.filter((record) => !record || !record.retention || record.retention.status !== "archived");
  }

  function isRetentionExpired(record, now = new Date().toISOString()) {
    const retention = record && record.retention;
    if (!retention || retention.status !== "archived" || !retention.retentionExpiresAt) return false;
    const expiresAt = new Date(retention.retentionExpiresAt).getTime();
    const nowAt = new Date(now).getTime();
    return Number.isFinite(expiresAt) && Number.isFinite(nowAt) && expiresAt <= nowAt;
  }

  return {
    RetentionContractError,
    buildDangerActionPreview,
    confirmDangerAction,
    filterActiveRecords,
    isRetentionExpired,
  };
});
