(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.SafetySettings = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  "use strict";

  const SCHEMA_VERSION = 1;
  const FALLBACK_FORMAT = "gs-safety-settings-fallback";
  const VERSION_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;
  const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

  function cloneJson(value) {
    if (value === undefined) return undefined;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      throw new TypeError("settings must be JSON-compatible");
    }
  }

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  }

  function requiredText(value, field) {
    const text = String(value || "").trim();
    if (!text) throw new TypeError(`${field} is required`);
    return text;
  }

  function normalizeVersion(value) {
    const version = requiredText(value, "version");
    if (!VERSION_PATTERN.test(version)) throw new TypeError("version is invalid");
    return version;
  }

  function normalizeTimestamp(value, field) {
    const source = requiredText(value, field);
    const time = new Date(source);
    if (Number.isNaN(time.getTime())) throw new TypeError(`${field} is invalid`);
    return time.toISOString();
  }

  function normalizeCalendarDate(value) {
    const date = String(value || "").trim();
    if (!DATE_PATTERN.test(date)) throw new TypeError("rest-day date is invalid");
    const parsed = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
      throw new TypeError("rest-day date is invalid");
    }
    return date;
  }

  function normalizePledgeRules(value) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? cloneJson(value) : {};
    return {
      enabled: source.enabled !== false,
      requireBeforeWork: source.requireBeforeWork !== false,
      renewal: requiredText(source.renewal || "daily", "pledge renewal"),
      ...source,
    };
  }

  function normalizePushCopy(value) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    return Object.fromEntries(Object.entries(source).map(([kind, template]) => {
      const key = requiredText(kind, "push copy kind");
      const item = template && typeof template === "object" && !Array.isArray(template) ? template : {};
      return [key, {
        ...cloneJson(item),
        title: String(item.title || "").trim(),
        body: String(item.body || "").trim(),
      }];
    }));
  }

  function normalizeRestDayCalendar(value) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const uniqueDates = new Map();
    (Array.isArray(source.dates) ? source.dates : []).forEach((entry) => {
      const item = entry && typeof entry === "object" && !Array.isArray(entry) ? entry : {};
      const date = normalizeCalendarDate(item.date);
      if (!uniqueDates.has(date)) {
        uniqueDates.set(date, {
          ...cloneJson(item),
          date,
          label: String(item.label || "").trim(),
        });
      }
    });
    return {
      ...cloneJson(source),
      timezone: requiredText(source.timezone || "Asia/Seoul", "rest-day timezone"),
      dates: [...uniqueDates.values()].sort((a, b) => a.date.localeCompare(b.date)),
    };
  }

  function normalizeSettings(value) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    return {
      pledgeRules: normalizePledgeRules(source.pledgeRules),
      pushCopy: normalizePushCopy(source.pushCopy),
      restDayCalendar: normalizeRestDayCalendar(source.restDayCalendar),
    };
  }

  function normalizeAudit(key, at, label) {
    return {
      key: requiredText(key, `${label} key`),
      at: normalizeTimestamp(at, `${label} time`),
    };
  }

  function createDraft(input = {}) {
    return {
      schemaVersion: SCHEMA_VERSION,
      status: "draft",
      metadata: {
        version: normalizeVersion(input.version),
        effectiveAt: normalizeTimestamp(input.effectiveAt, "effective time"),
        changeSummary: requiredText(input.changeSummary, "change summary"),
        author: normalizeAudit(input.authorKey, input.authoredAt, "author"),
        ...(input.baseVersion ? { baseVersion: normalizeVersion(input.baseVersion) } : {}),
        ...(input.rollbackTargetVersion
          ? { rollbackTargetVersion: normalizeVersion(input.rollbackTargetVersion) }
          : {}),
      },
      settings: normalizeSettings(input.settings),
    };
  }

  function requestReview(snapshot, input = {}) {
    if (!snapshot || snapshot.status !== "draft") throw new TypeError("requestReview requires a draft snapshot");
    return {
      schemaVersion: SCHEMA_VERSION,
      status: "review",
      metadata: {
        ...cloneJson(snapshot.metadata),
        review: normalizeAudit(input.reviewerKey, input.reviewedAt, "reviewer"),
      },
      settings: normalizeSettings(snapshot.settings),
    };
  }

  function publishSnapshot(snapshot, input = {}) {
    if (!snapshot || snapshot.status !== "review") throw new TypeError("publishSnapshot requires a review snapshot");
    return deepFreeze({
      schemaVersion: SCHEMA_VERSION,
      status: "published",
      metadata: {
        ...cloneJson(snapshot.metadata),
        publisher: normalizeAudit(input.publisherKey, input.publishedAt, "publisher"),
      },
      settings: normalizeSettings(snapshot.settings),
    });
  }

  function requirePublished(snapshot, label) {
    if (!snapshot || snapshot.status !== "published") throw new TypeError(`${label} requires a published snapshot`);
  }

  function createRevision(snapshot, input = {}) {
    requirePublished(snapshot, "createRevision");
    return createDraft({
      ...input,
      baseVersion: snapshot.metadata.version,
      settings: input.settings === undefined ? snapshot.settings : input.settings,
    });
  }

  function createRollbackDraft(currentSnapshot, targetSnapshot, input = {}) {
    requirePublished(currentSnapshot, "createRollbackDraft current version");
    requirePublished(targetSnapshot, "createRollbackDraft target version");
    if (currentSnapshot.metadata.version === targetSnapshot.metadata.version) {
      throw new TypeError("rollback target must differ from the current version");
    }
    return createDraft({
      ...input,
      baseVersion: currentSnapshot.metadata.version,
      rollbackTargetVersion: targetSnapshot.metadata.version,
      settings: targetSnapshot.settings,
    });
  }

  function selectEffectiveSnapshot(snapshots, at) {
    const boundary = normalizeTimestamp(at, "effective selection time");
    return (Array.isArray(snapshots) ? snapshots : [])
      .filter((snapshot) => snapshot && snapshot.status === "published"
        && String(snapshot.metadata && snapshot.metadata.effectiveAt || "") <= boundary)
      .sort((a, b) => {
        const effectiveOrder = a.metadata.effectiveAt.localeCompare(b.metadata.effectiveAt);
        if (effectiveOrder) return effectiveOrder;
        return a.metadata.publisher.at.localeCompare(b.metadata.publisher.at);
      })
      .at(-1) || null;
  }

  function versionParts(value) {
    return String(value || "").split(/[._-]/).map((part) => /^\d+$/.test(part) ? Number(part) : part);
  }

  function compareVersions(left, right) {
    const a = versionParts(left);
    const b = versionParts(right);
    for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
      const av = a[index] === undefined ? 0 : a[index];
      const bv = b[index] === undefined ? 0 : b[index];
      if (av === bv) continue;
      if (typeof av === "number" && typeof bv === "number") return av < bv ? -1 : 1;
      return String(av).localeCompare(String(bv));
    }
    return 0;
  }

  function evaluateDeviceSync(state = {}, options = {}) {
    const deviceVersion = String(state.deviceVersion || "").trim();
    const publishedVersion = String(state.publishedVersion || "").trim();
    const checkedAt = String(state.checkedAt || "").trim();
    const online = state.online !== false;
    let versionState = "unknown";
    if (publishedVersion && !deviceVersion) versionState = "uninitialized";
    else if (publishedVersion && deviceVersion) {
      const comparison = compareVersions(deviceVersion, publishedVersion);
      versionState = comparison === 0 ? "current" : comparison < 0 ? "behind" : "ahead";
    }

    let freshness = "unknown";
    if (!online) freshness = "offline";
    else if (checkedAt) {
      const checkedTime = new Date(checkedAt).getTime();
      const nowTime = new Date(options.now || Date.now()).getTime();
      const maxAgeMs = Number.isFinite(options.maxAgeMs) && options.maxAgeMs >= 0
        ? options.maxAgeMs
        : 300000;
      freshness = Number.isNaN(checkedTime) || Number.isNaN(nowTime) || nowTime - checkedTime > maxAgeMs
        ? "stale"
        : "fresh";
    }
    return {
      deviceVersion,
      publishedVersion,
      lastSyncedAt: String(state.lastSyncedAt || "").trim(),
      checkedAt,
      online,
      versionState,
      freshness,
      needsSync: versionState === "behind" || versionState === "uninitialized" || freshness === "stale",
      authoritativeSource: "server",
    };
  }

  function toStorageRecord(snapshot) {
    if (!snapshot || !["draft", "review", "published"].includes(snapshot.status)) {
      throw new TypeError("snapshot lifecycle status is invalid");
    }
    const metadata = snapshot.metadata || {};
    return {
      config_version: normalizeVersion(metadata.version),
      lifecycle_status: snapshot.status,
      effective_at: normalizeTimestamp(metadata.effectiveAt, "effective time"),
      change_summary: requiredText(metadata.changeSummary, "change summary"),
      settings: normalizeSettings(snapshot.settings),
      authored_by: requiredText(metadata.author && metadata.author.key, "author key"),
      authored_at: normalizeTimestamp(metadata.author && metadata.author.at, "author time"),
      reviewed_by: metadata.review ? requiredText(metadata.review.key, "reviewer key") : null,
      reviewed_at: metadata.review ? normalizeTimestamp(metadata.review.at, "review time") : null,
      published_by: metadata.publisher ? requiredText(metadata.publisher.key, "publisher key") : null,
      published_at: metadata.publisher ? normalizeTimestamp(metadata.publisher.at, "publisher time") : null,
      base_version: metadata.baseVersion || null,
      rollback_target_version: metadata.rollbackTargetVersion || null,
    };
  }

  function fromStorageRow(row = {}) {
    const draft = createDraft({
      version: row.config_version,
      effectiveAt: row.effective_at,
      changeSummary: row.change_summary,
      authorKey: row.authored_by,
      authoredAt: row.authored_at,
      baseVersion: row.base_version,
      rollbackTargetVersion: row.rollback_target_version,
      settings: row.settings,
    });
    if (row.lifecycle_status === "draft") return draft;
    const review = requestReview(draft, { reviewerKey: row.reviewed_by, reviewedAt: row.reviewed_at });
    if (row.lifecycle_status === "review") return review;
    if (row.lifecycle_status === "published") {
      return publishSnapshot(review, { publisherKey: row.published_by, publishedAt: row.published_at });
    }
    throw new TypeError("storage lifecycle status is invalid");
  }

  function exportLocalFallback(snapshot, options = {}) {
    const record = toStorageRecord(snapshot);
    return JSON.stringify({
      format: FALLBACK_FORMAT,
      schemaVersion: SCHEMA_VERSION,
      authority: "migration-only",
      exportedAt: normalizeTimestamp(options.exportedAt || new Date().toISOString(), "export time"),
      snapshot: fromStorageRow(record),
    });
  }

  function importLocalFallback(serialized) {
    let envelope;
    try {
      envelope = typeof serialized === "string" ? JSON.parse(serialized) : cloneJson(serialized);
    } catch (_error) {
      throw new TypeError("local fallback format is invalid");
    }
    if (!envelope || envelope.format !== FALLBACK_FORMAT || envelope.schemaVersion !== SCHEMA_VERSION) {
      throw new TypeError("local fallback format is invalid");
    }
    const snapshot = envelope.snapshot || {};
    const record = {
      config_version: snapshot.metadata && snapshot.metadata.version,
      lifecycle_status: snapshot.status,
      effective_at: snapshot.metadata && snapshot.metadata.effectiveAt,
      change_summary: snapshot.metadata && snapshot.metadata.changeSummary,
      settings: snapshot.settings,
      authored_by: snapshot.metadata && snapshot.metadata.author && snapshot.metadata.author.key,
      authored_at: snapshot.metadata && snapshot.metadata.author && snapshot.metadata.author.at,
      reviewed_by: snapshot.metadata && snapshot.metadata.review && snapshot.metadata.review.key,
      reviewed_at: snapshot.metadata && snapshot.metadata.review && snapshot.metadata.review.at,
      published_by: snapshot.metadata && snapshot.metadata.publisher && snapshot.metadata.publisher.key,
      published_at: snapshot.metadata && snapshot.metadata.publisher && snapshot.metadata.publisher.at,
      base_version: snapshot.metadata && snapshot.metadata.baseVersion,
      rollback_target_version: snapshot.metadata && snapshot.metadata.rollbackTargetVersion,
    };
    return {
      authoritative: false,
      source: "local-fallback",
      exportedAt: normalizeTimestamp(envelope.exportedAt, "export time"),
      snapshot: fromStorageRow(record),
    };
  }

  return {
    FALLBACK_FORMAT,
    SCHEMA_VERSION,
    createDraft,
    createRevision,
    createRollbackDraft,
    evaluateDeviceSync,
    exportLocalFallback,
    fromStorageRow,
    importLocalFallback,
    normalizeSettings,
    publishSnapshot,
    requestReview,
    selectEffectiveSnapshot,
    toStorageRecord,
  };
});
