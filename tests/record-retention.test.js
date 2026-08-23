const assert = require("assert");

const {
  RetentionContractError,
  buildDangerActionPreview,
  confirmDangerAction,
  filterActiveRecords,
  isRetentionExpired,
} = require("../assets/js/record-retention.js");

function expectContractError(code, action) {
  assert.throws(action, (error) => error instanceof RetentionContractError && error.code === code);
}

// Given an archive action with a deterministic clock
// When its danger preview is built
// Then it exposes the reversible retention boundary and exact count token.
{
  const preview = buildDangerActionPreview({
    action: "archive",
    resourceType: "safety_inspection",
    affectedCount: 3,
    reason: "Duplicate import cleanup",
    retentionDays: 30,
    now: "2026-08-15T00:00:00.000Z",
  });
  assert.deepStrictEqual(preview, {
    kind: "retention-danger-preview",
    action: "archive",
    resourceType: "safety_inspection",
    affectedCount: 3,
    reason: "Duplicate import cleanup",
    reversible: true,
    requiresAffectedCountConfirmation: true,
    confirmationToken: "archive:3",
    retentionExpiresAt: "2026-09-14T00:00:00.000Z",
  });
}

// Given an otherwise valid danger action without a reason
// When its preview is built
// Then the boundary rejects it with a typed error.
expectContractError("reason_required", () => buildDangerActionPreview({
  action: "restore",
  resourceType: "safety_inspection",
  affectedCount: 1,
  reason: " ",
}));

// Given a danger action with no affected records
// When its preview is built
// Then it is rejected before an empty audit event can be created.
expectContractError("affected_count_invalid", () => buildDangerActionPreview({
  action: "restore",
  resourceType: "safety_inspection",
  affectedCount: 0,
  reason: "No matching records",
}));

// Given a preview for three affected records
// When the operator confirms a different count
// Then no mutation contract is produced.
{
  const preview = buildDangerActionPreview({
    action: "restore",
    resourceType: "work_prep_record",
    affectedCount: 3,
    reason: "Archive was selected in error",
  });
  expectContractError("affected_count_mismatch", () => confirmDangerAction({
    preview,
    confirmedAffectedCount: 2,
    audit: {
      actorRef: "worker-ref",
      requestId: "request-1",
      requestedAt: "2026-08-15T01:00:00.000Z",
    },
  }));
}

// Given an exact count confirmation and complete audit metadata
// When the action is confirmed
// Then a typed adapter-ready mutation contract is returned.
{
  const preview = buildDangerActionPreview({
    action: "purge_expired",
    resourceType: "safety_inspection",
    affectedCount: 2,
    reason: "Retention window elapsed",
  });
  const contract = confirmDangerAction({
    preview,
    confirmedAffectedCount: 2,
    audit: {
      actorRef: "worker-ref",
      mutationSessionId: "session-ref",
      requestId: "request-2",
      requestedAt: "2026-08-15T01:00:00.000Z",
    },
  });
  assert.strictEqual(contract.kind, "retention-mutation");
  assert.strictEqual(contract.preview.reversible, false);
  assert.deepStrictEqual(contract.audit, {
    actorRef: "worker-ref",
    mutationSessionId: "session-ref",
    requestId: "request-2",
    requestedAt: "2026-08-15T01:00:00.000Z",
  });
}

// Given mixed active and archived records
// When the caller explicitly opts into active-only filtering
// Then archived records are excluded without mutating the source list.
{
  const records = [
    { id: "active" },
    { id: "archived", retention: { status: "archived" } },
    { id: "restored", retention: { status: "active" } },
  ];
  assert.deepStrictEqual(filterActiveRecords(records).map((record) => record.id), ["active", "restored"]);
  assert.strictEqual(records.length, 3);
}

// Given archived records on either side of the retention boundary
// When expiry is evaluated against an injected clock
// Then only the elapsed archive is eligible for purge.
{
  const now = "2026-08-15T00:00:00.000Z";
  assert.strictEqual(isRetentionExpired({
    retention: { status: "archived", retentionExpiresAt: "2026-08-14T23:59:59.000Z" },
  }, now), true);
  assert.strictEqual(isRetentionExpired({
    retention: { status: "archived", retentionExpiresAt: "2026-08-16T00:00:00.000Z" },
  }, now), false);
}

console.log("record-retention tests passed");
