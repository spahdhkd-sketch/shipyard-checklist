"use strict";

const assert = require("assert");
const SafetySettings = require("../assets/js/safety-settings.js");

const authoredAt = "2026-08-15T01:00:00.000Z";
const reviewedAt = "2026-08-15T02:00:00.000Z";
const publishedAt = "2026-08-15T03:00:00.000Z";

const draft = SafetySettings.createDraft({
  version: "2026.08.1",
  effectiveAt: "2026-08-18T00:00:00.000Z",
  changeSummary: "휴무일 및 서약 기준 갱신",
  authorKey: "admin-audit-01",
  authoredAt,
  settings: {
    pledgeRules: { enabled: true, requireBeforeWork: true, renewal: "daily" },
    pushCopy: {
      pledgePending: { title: "안전 서약 미완료", body: "오늘 작업 전 서약을 완료해주세요." },
    },
    restDayCalendar: {
      timezone: "Asia/Seoul",
      dates: [
        { date: "2026-08-17", label: "대체 휴무" },
        { date: "2026-08-15", label: "광복절" },
        { date: "2026-08-15", label: "중복" },
      ],
    },
  },
});

assert.strictEqual(draft.status, "draft");
assert.strictEqual(draft.metadata.version, "2026.08.1");
assert.strictEqual(draft.metadata.changeSummary, "휴무일 및 서약 기준 갱신");
assert.strictEqual(draft.metadata.author.key, "admin-audit-01");
assert.strictEqual(draft.metadata.author.at, authoredAt);
assert.deepStrictEqual(
  draft.settings.restDayCalendar.dates.map((entry) => entry.date),
  ["2026-08-15", "2026-08-17"],
  "휴무일은 날짜순으로 정렬하고 같은 날짜는 한 번만 유지한다",
);

const review = SafetySettings.requestReview(draft, {
  reviewerKey: "admin-audit-02",
  reviewedAt,
});
assert.strictEqual(review.status, "review");
assert.deepStrictEqual(review.metadata.review, { key: "admin-audit-02", at: reviewedAt });
assert.throws(
  () => SafetySettings.publishSnapshot(draft, { publisherKey: "admin-audit-03", publishedAt }),
  /review snapshot/,
  "초안은 검토 단계를 건너뛰고 게시할 수 없다",
);

const published = SafetySettings.publishSnapshot(review, {
  publisherKey: "admin-audit-03",
  publishedAt,
});
assert.strictEqual(published.status, "published");
assert.strictEqual(published.metadata.publisher.key, "admin-audit-03");
assert.strictEqual(published.metadata.publisher.at, publishedAt);
assert(Object.isFrozen(published));
assert(Object.isFrozen(published.settings));
assert(Object.isFrozen(published.settings.pledgeRules), "게시된 설정의 중첩 값도 불변이어야 한다");
assert.throws(
  () => SafetySettings.requestReview(published, { reviewerKey: "x", reviewedAt }),
  /draft snapshot/,
  "게시된 스냅샷은 이전 단계로 되돌릴 수 없다",
);

const nextDraft = SafetySettings.createRevision(published, {
  version: "2026.08.2",
  effectiveAt: "2026-08-20T00:00:00.000Z",
  changeSummary: "다음 운영 기준 준비",
  authorKey: "admin-audit-04",
  authoredAt: "2026-08-16T01:00:00.000Z",
});
assert.strictEqual(nextDraft.status, "draft");
assert.strictEqual(nextDraft.metadata.baseVersion, "2026.08.1");
assert.deepStrictEqual(nextDraft.settings, published.settings);
assert.notStrictEqual(nextDraft.settings, published.settings, "새 초안은 게시본의 변경 가능한 복사본을 사용한다");

const olderPublished = SafetySettings.publishSnapshot(
  SafetySettings.requestReview(
    SafetySettings.createDraft({
      version: "2026.07.9",
      effectiveAt: "2026-07-01T00:00:00.000Z",
      changeSummary: "이전 안전 기준",
      authorKey: "admin-audit-01",
      authoredAt: "2026-07-01T01:00:00.000Z",
      settings: {
        pledgeRules: { enabled: true, requireBeforeWork: false, renewal: "daily" },
        pushCopy: {},
        restDayCalendar: { timezone: "Asia/Seoul", dates: [] },
      },
    }),
    { reviewerKey: "admin-audit-02", reviewedAt: "2026-07-01T02:00:00.000Z" },
  ),
  { publisherKey: "admin-audit-03", publishedAt: "2026-07-01T03:00:00.000Z" },
);

const rollback = SafetySettings.createRollbackDraft(published, olderPublished, {
  version: "2026.08.3",
  effectiveAt: "2026-08-21T00:00:00.000Z",
  changeSummary: "이전 안전 기준으로 롤백",
  authorKey: "admin-audit-04",
  authoredAt: "2026-08-16T02:00:00.000Z",
});
assert.strictEqual(rollback.metadata.baseVersion, "2026.08.1");
assert.strictEqual(rollback.metadata.rollbackTargetVersion, "2026.07.9");
assert.deepStrictEqual(rollback.settings, olderPublished.settings);

assert.strictEqual(
  SafetySettings.selectEffectiveSnapshot(
    [published, olderPublished],
    "2026-08-17T23:59:59.000Z",
  ).metadata.version,
  "2026.07.9",
  "효력 발생 전 게시본은 선택하지 않는다",
);
assert.strictEqual(
  SafetySettings.selectEffectiveSnapshot(
    [published, olderPublished],
    "2026-08-18T00:00:00.000Z",
  ).metadata.version,
  "2026.08.1",
);

assert.deepStrictEqual(
  SafetySettings.evaluateDeviceSync(
    {
      deviceVersion: "2026.07.9",
      publishedVersion: "2026.08.1",
      lastSyncedAt: "2026-08-15T03:00:00.000Z",
      checkedAt: "2026-08-15T03:04:00.000Z",
      online: true,
    },
    { now: "2026-08-15T03:05:00.000Z", maxAgeMs: 300000 },
  ),
  {
    deviceVersion: "2026.07.9",
    publishedVersion: "2026.08.1",
    lastSyncedAt: "2026-08-15T03:00:00.000Z",
    checkedAt: "2026-08-15T03:04:00.000Z",
    online: true,
    versionState: "behind",
    freshness: "fresh",
    needsSync: true,
    authoritativeSource: "server",
  },
);
assert.strictEqual(
  SafetySettings.evaluateDeviceSync(
    { deviceVersion: "2026.08.1", publishedVersion: "2026.08.1", checkedAt: reviewedAt, online: false },
    { now: publishedAt, maxAgeMs: 300000 },
  ).freshness,
  "offline",
);

const storageRecord = SafetySettings.toStorageRecord(review);
assert.strictEqual(storageRecord.config_version, "2026.08.1");
assert.strictEqual(storageRecord.lifecycle_status, "review");
assert.strictEqual(storageRecord.authored_by, "admin-audit-01");
assert.strictEqual(storageRecord.reviewed_by, "admin-audit-02");
assert.deepStrictEqual(storageRecord.settings, review.settings);
assert.deepStrictEqual(SafetySettings.fromStorageRow(storageRecord), review);

const fallbackJson = SafetySettings.exportLocalFallback(published, {
  exportedAt: "2026-08-15T04:00:00.000Z",
});
const fallback = SafetySettings.importLocalFallback(fallbackJson);
assert.strictEqual(fallback.authoritative, false);
assert.strictEqual(fallback.source, "local-fallback");
assert.strictEqual(fallback.snapshot.metadata.version, "2026.08.1");
assert.strictEqual(Object.isFrozen(fallback.snapshot), true);
assert.throws(
  () => SafetySettings.importLocalFallback(JSON.stringify({ format: "unknown" })),
  /fallback format/,
);

assert.throws(
  () => SafetySettings.createDraft({
    version: "bad version",
    effectiveAt: authoredAt,
    changeSummary: "invalid",
    authorKey: "admin",
    authoredAt,
    settings: {},
  }),
  /version/,
);
assert.throws(
  () => SafetySettings.createDraft({
    version: "2026.08.4",
    effectiveAt: authoredAt,
    changeSummary: "invalid rest day",
    authorKey: "admin",
    authoredAt,
    settings: { restDayCalendar: { dates: [{ date: "2026-02-30" }] } },
  }),
  /rest-day date/,
);

console.log("safety-settings tests passed");
