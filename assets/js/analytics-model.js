(function attachAnalyticsModel(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardAnalyticsModel = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildAnalyticsModelApi() {
  // 분석 대시보드 모델 빌더 (app-v2.js에서 추출).
  // 순수 계산만 담당: state/document 접근 없음. 데이터와 헬퍼는 인자로 주입.
  // data: { now, todayValue, syncText, inspections, unsafeIssues, missingMaterials, ships }
  // deps: { localDate, formatKoreanDate, syncStatusLabel, shipStageInfo, effectiveShipStage,
  //         isVisibleWorkerName, unsafeStatuses, materialStatuses, workflowStages }
    function analyticsPercent(part, total) {
      return total ? Math.round(part / total * 100) : 0;
    }

    function buildAnalyticsDashboardModel(rawData, rawDeps) {
      const data = rawData || {};
      const deps = rawDeps || {};
      const inspections = Array.isArray(data.inspections) ? data.inspections : [];
      const unsafeIssues = Array.isArray(data.unsafeIssues) ? data.unsafeIssues : [];
      const missingMaterials = Array.isArray(data.missingMaterials) ? data.missingMaterials : [];
      const ships = Array.isArray(data.ships) ? data.ships : [];
      const todayValue = data.todayValue || "";
      const syncText = data.syncText || "로컬 저장";
      const {
        localDate,
        formatKoreanDate,
        syncStatusLabel,
        shipStageInfo,
        effectiveShipStage,
        isVisibleWorkerName,
        unsafeStatuses,
        materialStatuses,
        workflowStages,
      } = deps;
      const now = data.now instanceof Date ? data.now : new Date();
      const weekStart = new Date(now);
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - 6);
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayValue = localDate(yesterday);
      const dateInRange = (value) => {
        if (!value) return false;
        const date = new Date(String(value).includes("T") ? value : `${value}T00:00:00`);
        return !Number.isNaN(date.getTime()) && date >= weekStart && date <= now;
      };
      const deltaText = (current, previous) => {
        const diff = Number(current || 0) - Number(previous || 0);
        if (diff > 0) return `어제 대비 +${diff}건`;
        if (diff < 0) return `어제 대비 ${diff}건`;
        return "어제와 동일";
      };
      const todayRows = inspections.filter((row) => row.date === todayValue);
      const todayDone = todayRows.filter((row) => row.status === "완료").length;
      const yesterdayDone = inspections.filter((row) => row.date === yesterdayValue && row.status === "완료").length;
      const unsafeOpen = unsafeIssues.filter((row) => row.status !== unsafeStatuses[2]).length;
      const unsafeReceived = unsafeIssues.filter((row) => row.status === unsafeStatuses[0]).length;
      const unsafeProcessing = unsafeIssues.filter((row) => row.status === unsafeStatuses[1]).length;
      const materialOpen = missingMaterials.filter((row) => row.status !== materialStatuses[2]).length;
      const materialReceived = missingMaterials.filter((row) => row.status === materialStatuses[0]).length;
      const materialChecking = missingMaterials.filter((row) => row.status === materialStatuses[1]).length;
      const processRows = workflowStages.map((stage) => {
        const info = shipStageInfo(stage);
        const count = ships.filter((ship) => effectiveShipStage(ship).stage === stage).length;
        return { info, count };
      });
      const processTotal = Math.max(ships.length, 1);
      const weekInspections = inspections.filter((row) => dateInRange(row.date || row.createdAt));
      const weekUnsafe = unsafeIssues.filter((row) => dateInRange(row.createdAt));
      const weekMaterials = missingMaterials.filter((row) => dateInRange(row.createdAt));
      const riskNg = weekInspections.filter((row) => Number(row.warnings || 0) > 0).length
        + weekUnsafe.filter((row) => row.status !== unsafeStatuses[2]).length;
      const riskWarn = weekInspections.filter((row) => row.status !== "완료" && !Number(row.warnings || 0)).length
        + weekMaterials.filter((row) => row.status !== materialStatuses[2]).length;
      const riskOk = weekInspections.filter((row) => row.status === "완료" && !Number(row.warnings || 0)).length;
      const riskTotal = Math.max(riskNg + riskWarn + riskOk, 1);
      const activeProcessCount = processRows.filter(({ count }) => count > 0).length;
      const weeklyActivityCount = weekInspections.length + weekUnsafe.length + weekMaterials.length;
      const recent = [
        ...unsafeIssues.map((row) => ({ id: row.id, kind: "unsafe", type: "불안전요소 등록", shipNo: row.shipNo, content: row.content, worker: row.workerNameSnapshot, status: row.status, time: row.createdAt })),
        ...missingMaterials.map((row) => ({ id: row.id, kind: "materials", type: "자재누락", shipNo: row.shipNo, content: row.materialName || row.content, worker: row.workerNameSnapshot, status: row.status, time: row.createdAt })),
      ].filter((row) => isVisibleWorkerName(row.worker)).sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0)).slice(0, 5);
      return {
        dateLabel: formatKoreanDate(now),
        syncText: syncStatusLabel(syncText),
        todayDone,
        todayDeltaText: deltaText(todayDone, yesterdayDone),
        unsafeOpen,
        unsafeSummary: unsafeOpen ? `${unsafeReceived}건 접수 · ${unsafeProcessing}건 조치중` : "미확인 없음",
        materialOpen,
        materialSummary: materialOpen ? `${materialReceived}건 접수 · ${materialChecking}건 확인중` : "미처리 없음",
        shipCount: ships.length,
        processStageCount: workflowStages.length,
        processSummary: `${activeProcessCount}/${workflowStages.length}단계 분포`,
        processRows: processRows.map(({ info, count }) => ({
          info,
          count,
          percent: analyticsPercent(count, processTotal),
        })),
        risk: {
          ng: { count: riskNg, percent: analyticsPercent(riskNg, riskTotal) },
          warn: { count: riskWarn, percent: analyticsPercent(riskWarn, riskTotal) },
          ok: { count: riskOk, percent: analyticsPercent(riskOk, riskTotal) },
        },
        weeklyAverage: (Math.round(weeklyActivityCount / 7 * 10) / 10).toFixed(1),
        recent,
      };
    }

  return {
    analyticsPercent,
    buildAnalyticsDashboardModel,
  };
}));
