(function attachOperationalCohort(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardOperationalCohort = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildOperationalCohortApi() {
  const OPERATIONAL_WORK_PREP_STATUSES = new Set(["ordered", "confirmed", "used"]);
  const REQUIRED_DEPENDENCIES = ["workers", "workPrepRecords", "inspections"];

  function stableId(value) {
    return String(value || "").trim();
  }

  function uniqueIds(values) {
    return [...new Set((Array.isArray(values) ? values : []).map(stableId).filter(Boolean))].sort();
  }

  function instructionParticipantIds(record) {
    return uniqueIds([
      record && record.leaderWorkerId,
      ...(Array.isArray(record && record.workerIds) ? record.workerIds : []),
      ...(Array.isArray(record && record.otherTeamWorkerIds) ? record.otherTeamWorkerIds : []),
    ]);
  }

  function qualifyingInstructions(input) {
    const date = String(input.date || "");
    return (Array.isArray(input.workPrepRecords) ? input.workPrepRecords : []).filter((record) => (
      record
      && String(record.workDate || "") === date
      && !record.deletedAt
      && OPERATIONAL_WORK_PREP_STATUSES.has(String(record.status || ""))
    ));
  }

  function inspectionWorkerId(row) {
    return stableId(row && (row.workPrepWorkerId || row.workerId));
  }

  function dependencyFreshness(rawFreshness) {
    const freshness = rawFreshness && typeof rawFreshness === "object" ? rawFreshness : {};
    const dependencies = {};
    REQUIRED_DEPENDENCIES.forEach((key) => {
      const raw = freshness[key] && typeof freshness[key] === "object" ? freshness[key] : {};
      dependencies[key] = {
        complete: raw.complete === true,
        fresh: raw.fresh === true,
        asOf: String(raw.asOf || ""),
      };
    });
    const staleDependencies = REQUIRED_DEPENDENCIES.filter((key) => (
      !dependencies[key].complete || !dependencies[key].fresh
    ));
    return {
      status: staleDependencies.length ? "stale" : "fresh",
      staleDependencies,
      dependencies,
    };
  }

  function deriveOperationalCohort(rawInput, scope) {
    const input = rawInput && typeof rawInput === "object" ? rawInput : {};
    const date = String(input.date || "");
    const workers = Array.isArray(input.workers) ? input.workers : [];
    const workerById = new Map();
    workers.forEach((worker) => {
      const workerId = stableId(worker && worker.id);
      if (workerId && !workerById.has(workerId)) workerById.set(workerId, worker);
    });

    const recordIdsByWorkerId = new Map();
    qualifyingInstructions(input).forEach((record) => {
      instructionParticipantIds(record).forEach((workerId) => {
        if (!recordIdsByWorkerId.has(workerId)) recordIdsByWorkerId.set(workerId, []);
        recordIdsByWorkerId.get(workerId).push(stableId(record.id));
      });
    });

    const historicalIds = new Set();
    if (scope === "historical") {
      (Array.isArray(input.inspections) ? input.inspections : []).forEach((row) => {
        if (!row || String(row.date || "") !== date) return;
        const workerId = inspectionWorkerId(row);
        if (workerId) historicalIds.add(workerId);
      });
    }

    const offShiftIds = new Set(uniqueIds(input.offShiftWorkerIds));
    const excludedIds = new Set(uniqueIds(input.excludedWorkerIds));
    const restDay = uniqueIds(input.restDates).includes(date);
    const candidateIds = uniqueIds([
      ...workerById.keys(),
      ...recordIdsByWorkerId.keys(),
      ...historicalIds,
    ]);

    const members = candidateIds.map((workerId) => {
      const worker = workerById.get(workerId);
      const assigned = recordIdsByWorkerId.has(workerId);
      const historical = historicalIds.has(workerId) && !assigned;
      const historyOnly = historical && !worker;
      let included = assigned || (scope === "historical" && historicalIds.has(workerId));
      let reason = assigned
        ? "confirmed_work_instruction"
        : historyOnly
          ? "history_only_participant"
          : historical
            ? "historical_inspection"
            : "unassigned";
      if (scope === "today") {
        if (restDay && assigned) {
          included = false;
          reason = "rest_day";
        } else if (excludedIds.has(workerId)) {
          included = false;
          reason = "operationally_excluded";
        } else if (offShiftIds.has(workerId) || (worker && worker.active === false)) {
          included = false;
          reason = "off_shift";
        }
      }
      return {
        workerId,
        included,
        reason,
        source: historical ? "inspection_history" : assigned ? "work_instruction" : "worker_roster",
        active: worker ? worker.active !== false : null,
        workPrepRecordIds: uniqueIds(recordIdsByWorkerId.get(workerId)),
      };
    });
    const includedWorkerIds = members.filter((member) => member.included).map((member) => member.workerId);
    const memberByWorkerId = {};
    members.forEach((member) => { memberByWorkerId[member.workerId] = member; });
    const freshness = dependencyFreshness(input.freshness);
    freshness.asOf = String(input.asOf || "");
    const reasonCodes = freshness.status === "stale"
      ? ["stale_dependencies"]
      : restDay && !includedWorkerIds.length
        ? ["rest_day"]
        : includedWorkerIds.length
          ? []
          : ["no_confirmed_work_instruction"];
    return {
      scope,
      date,
      members,
      memberByWorkerId,
      includedWorkerIds,
      excludedWorkerIds: members.filter((member) => !member.included).map((member) => member.workerId),
      denominator: {
        value: includedWorkerIds.length,
        reliable: freshness.status === "fresh",
        reasonCodes,
      },
      freshness,
    };
  }

  function deriveTodayOperationalCohort(input) {
    return deriveOperationalCohort(input, "today");
  }

  function deriveHistoricalOperationalCohort(input) {
    return deriveOperationalCohort(input, "historical");
  }

  return {
    OPERATIONAL_WORK_PREP_STATUSES: [...OPERATIONAL_WORK_PREP_STATUSES],
    deriveHistoricalOperationalCohort,
    deriveTodayOperationalCohort,
  };
}));
