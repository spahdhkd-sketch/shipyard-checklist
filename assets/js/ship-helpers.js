(function attachShipHelpers(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardShipHelpers = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildShipHelpers() {
  const SHIP_WORKFLOW_STAGES = ["mounting", "lc", "st", "cl", "dl"];
  const SHIP_SORT_OPTIONS = [
    ["stage", "공정 상태순"],
    ["number", "호선 번호순"],
    ["lcDate", "L/C일 빠른순"],
    ["dlDate", "D/L일 빠른순"],
    ["recent", "최근 추가순"],
    ["saved", "저장된 순서"],
  ];
  const STAGE_META = {
    mounting: { stage: "mounting", label: "탑재", percent: 20, color: "#8F5E35", bg: "#F8F1E8" },
    lc: { stage: "lc", label: "L/C", percent: 45, color: "#1d4ed8", bg: "#eff6ff" },
    st: { stage: "st", label: "S/T", percent: 70, color: "#0f766e", bg: "#f0fdfa" },
    cl: { stage: "cl", label: "C/L", percent: 92, color: "#4F7A5C", bg: "#F1F6F2" },
    dl: { stage: "dl", label: "D/L", percent: 100, color: "#7e22ce", bg: "#faf5ff" },
  };

  function dateOnly(value) {
    return String(value || "").slice(0, 10);
  }

  function shipStageInfo(stage) {
    return STAGE_META[stage] || STAGE_META.mounting;
  }

  function normalizeShipStageInput(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    const compact = raw.toLowerCase().replace(/[\s/_-]+/g, "");
    const stage = SHIP_WORKFLOW_STAGES.find((item) => item === compact || STAGE_META[item].label.toLowerCase().replace(/[\s/_-]+/g, "") === compact);
    if (stage) return stage;
    if (["탑재", "mounting", "mount"].includes(compact)) return "mounting";
    if (compact === "lc") return "lc";
    if (compact === "st") return "st";
    if (compact === "cl") return "cl";
    if (compact === "dl") return "dl";
    return "";
  }

  function effectiveShipStage(ship) {
    return shipStageInfo(ship && ship.processStage || "mounting");
  }

  function compareShipNo(a, b) {
    return String(a && a.no || "").localeCompare(String(b && b.no || ""), "ko-KR", { numeric: true, sensitivity: "base" });
  }

  function compareShipDate(getDate) {
    return (a, b) => {
      const aDate = dateOnly(getDate(a));
      const bDate = dateOnly(getDate(b));
      if (aDate && bDate) return aDate.localeCompare(bDate) || compareShipNo(a, b);
      if (aDate) return -1;
      if (bDate) return 1;
      return compareShipNo(a, b);
    };
  }

  function compareShipStage(a, b) {
    const aStage = SHIP_WORKFLOW_STAGES.indexOf(effectiveShipStage(a).stage);
    const bStage = SHIP_WORKFLOW_STAGES.indexOf(effectiveShipStage(b).stage);
    return (aStage - bStage) || compareShipNo(a, b);
  }

  function normalizeShipSortMode(value) {
    const mode = String(value || "").trim();
    return SHIP_SORT_OPTIONS.some(([id]) => id === mode) ? mode : "stage";
  }

  return {
    SHIP_SORT_OPTIONS,
    SHIP_WORKFLOW_STAGES,
    STAGE_META,
    shipStageInfo,
    normalizeShipStageInput,
    effectiveShipStage,
    compareShipNo,
    compareShipDate,
    compareShipStage,
    normalizeShipSortMode,
  };
}));
