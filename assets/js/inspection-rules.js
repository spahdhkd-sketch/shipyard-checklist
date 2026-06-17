(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.InspectionRules = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  // Pure validation + summary logic extracted from app-v2 submitInspection.
  // Behaviour, messages and check order are preserved 1:1.

  function highRiskMissingCount(items, checks) {
    const list = Array.isArray(items) ? items : [];
    const map = checks || {};
    return list.filter((row) => row && row.risk === "high" && !map[row.id]).length;
  }

  // Returns the first blocking error message (string) or null when the draft
  // is submittable. Mirrors the guard order in submitInspection().
  function validateInspectionDraft(input) {
    const data = input || {};
    const items = Array.isArray(data.items) ? data.items : [];
    const checks = data.checks || {};
    const worker = String(data.worker || "").trim();
    if (!worker) return "담당자명을 입력하세요.";
    if (!data.shipNo) return "호선을 선택하세요.";
    if (data.pledgeCheckedCount !== data.pledgeRulesCount) return "안전 서약 항목을 모두 확인하세요.";
    if (!data.signatureText) return "서명을 입력하거나 손가락으로 서명하세요.";
    if (highRiskMissingCount(items, checks) > 0) return "위험 항목을 모두 확인해야 제출할 수 있습니다.";
    if (!items.length) return "등록된 점검 항목이 없습니다.";
    return null;
  }

  // Aggregates checklist progress for a submitted inspection.
  function summarizeInspectionChecks(items, checks) {
    const list = Array.isArray(items) ? items : [];
    const map = checks || {};
    const total = list.length;
    const checkedCount = list.filter((row) => row && Boolean(map[row.id])).length;
    const warnings = list.filter((row) => row && !map[row.id] && row.risk !== "low").length;
    const completion = total ? Math.round((checkedCount / total) * 100) : 0;
    const allComplete = total > 0 && checkedCount === total;
    return {
      total,
      checkedCount,
      warnings,
      completion,
      allComplete,
      status: allComplete ? "완료" : "미완료",
    };
  }

  return {
    highRiskMissingCount,
    validateInspectionDraft,
    summarizeInspectionChecks,
  };
});
