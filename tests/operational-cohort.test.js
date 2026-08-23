const assert = require("node:assert");
const {
  deriveHistoricalOperationalCohort,
  deriveTodayOperationalCohort,
} = require("../assets/js/operational-cohort.js");

const FRESH = {
  workers: { complete: true, fresh: true, asOf: "2026-08-15T00:05:00Z" },
  workPrepRecords: { complete: true, fresh: true, asOf: "2026-08-15T00:04:00Z" },
  inspections: { complete: true, fresh: true, asOf: "2026-08-15T00:03:00Z" },
};

function baseInput(overrides = {}) {
  return {
    date: "2026-08-15",
    asOf: "2026-08-15T00:06:00Z",
    workers: [
      { id: "worker-a", active: true },
      { id: "worker-b", active: true },
      { id: "worker-c", active: true },
      { id: "worker-old", active: false },
    ],
    workPrepRecords: [{
      id: "prep-1",
      workDate: "2026-08-15",
      status: "ordered",
      leaderWorkerId: "worker-a",
      workerIds: ["worker-b", "worker-old"],
      otherTeamWorkerIds: [],
    }],
    inspections: [],
    offShiftWorkerIds: [],
    excludedWorkerIds: [],
    restDates: [],
    freshness: FRESH,
    ...overrides,
  };
}

// Given an authoritative instruction plus current-day operating exceptions
// When today's cohort is derived
// Then only assigned, on-shift, non-excluded workers enter the denominator.
{
  const cohort = deriveTodayOperationalCohort(baseInput({
    offShiftWorkerIds: ["worker-b"],
    excludedWorkerIds: ["worker-old"],
  }));
  assert.deepStrictEqual(cohort.includedWorkerIds, ["worker-a"]);
  assert.strictEqual(cohort.denominator.value, 1);
  assert.strictEqual(cohort.memberByWorkerId["worker-b"].reason, "off_shift");
  assert.strictEqual(cohort.memberByWorkerId["worker-c"].reason, "unassigned");
  assert.strictEqual(cohort.memberByWorkerId["worker-old"].reason, "operationally_excluded");
}

// Given a site rest day
// When today's cohort is derived
// Then every otherwise assigned participant is excluded from a zero denominator.
{
  const cohort = deriveTodayOperationalCohort(baseInput({ restDates: ["2026-08-15"] }));
  assert.deepStrictEqual(cohort.includedWorkerIds, []);
  assert.strictEqual(cohort.denominator.value, 0);
  assert.strictEqual(cohort.memberByWorkerId["worker-a"].reason, "rest_day");
  assert.strictEqual(cohort.memberByWorkerId["worker-b"].reason, "rest_day");
}

// Given an old inactive worker and an inspection whose stable worker ID is no longer in the roster
// When a historical cohort is derived
// Then both remain represented instead of disappearing with the current roster.
{
  const cohort = deriveHistoricalOperationalCohort(baseInput({
    workPrepRecords: [{
      id: "prep-1",
      workDate: "2026-08-15",
      status: "ordered",
      leaderWorkerId: "worker-a",
      workerIds: ["worker-b"],
    }],
    inspections: [
      { id: "inspection-1", date: "2026-08-15", workPrepWorkerId: "history-only" },
      { id: "inspection-2", date: "2026-08-15", workPrepWorkerId: "worker-old" },
    ],
    offShiftWorkerIds: ["worker-old"],
    excludedWorkerIds: ["worker-old"],
  }));
  assert.deepStrictEqual(cohort.includedWorkerIds, ["history-only", "worker-a", "worker-b", "worker-old"]);
  assert.strictEqual(cohort.memberByWorkerId["worker-old"].reason, "historical_inspection");
  assert.strictEqual(cohort.memberByWorkerId["worker-old"].active, false);
  assert.strictEqual(cohort.memberByWorkerId["worker-old"].source, "inspection_history");
  assert.strictEqual(cohort.memberByWorkerId["history-only"].reason, "history_only_participant");
  assert.strictEqual(cohort.memberByWorkerId["history-only"].source, "inspection_history");
}

// Given incomplete or stale dependency snapshots
// When the cohort is derived
// Then membership remains inspectable but the denominator cannot be presented as authoritative.
{
  const cohort = deriveTodayOperationalCohort(baseInput({
    freshness: {
      ...FRESH,
      workers: { complete: true, fresh: false, asOf: "2026-08-14T00:00:00Z" },
      workPrepRecords: { complete: false, fresh: true, asOf: "2026-08-15T00:04:00Z" },
    },
  }));
  assert.strictEqual(cohort.freshness.status, "stale");
  assert.deepStrictEqual(cohort.freshness.staleDependencies, ["workers", "workPrepRecords"]);
  assert.strictEqual(cohort.denominator.reliable, false);
  assert.deepStrictEqual(cohort.denominator.reasonCodes, ["stale_dependencies"]);
}

// Given a draft instruction that has not reached the operational instruction stage
// When today's cohort is derived
// Then its participants remain unassigned for denominator purposes.
{
  const cohort = deriveTodayOperationalCohort(baseInput({
    workPrepRecords: [{
      id: "prep-draft",
      workDate: "2026-08-15",
      status: "preparing",
      leaderWorkerId: "worker-a",
      workerIds: ["worker-b"],
    }],
  }));
  assert.strictEqual(cohort.denominator.value, 0);
  assert.strictEqual(cohort.memberByWorkerId["worker-a"].reason, "unassigned");
}

console.log("operational cohort tests passed");
