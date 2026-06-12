const assert = require("node:assert");
const { analyticsPercent, buildAnalyticsDashboardModel, monthlyWorkerDayStatus, combineInspectionRows } = require("../assets/js/analytics-model.js");

assert.strictEqual(analyticsPercent(1, 4), 25);
assert.strictEqual(analyticsPercent(0, 0), 0);
assert.strictEqual(analyticsPercent(2, 3), 67);

const NOW = new Date("2026-06-11T10:00:00+09:00");
const UNSAFE = ["접수", "조치중", "완료"];
const MATERIAL = ["접수", "확인중", "처리완료"];
const deps = {
  localDate: (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },
  formatKoreanDate: () => "2026년 6월 11일",
  syncStatusLabel: (text) => `[${text}]`,
  shipStageInfo: (stage) => ({ stage, label: stage.toUpperCase() }),
  effectiveShipStage: (ship) => ({ stage: ship.processStage }),
  isVisibleWorkerName: (name) => name !== "숨김작업자",
  unsafeStatuses: UNSAFE,
  materialStatuses: MATERIAL,
  workflowStages: ["mounting", "lc", "st", "cl", "dl"],
};
const data = {
  now: NOW,
  todayValue: "2026-06-11",
  syncText: "온라인",
  inspections: [
    { date: "2026-06-11", status: "완료", warnings: 0 },
    { date: "2026-06-11", status: "진행중", warnings: 0 },
    { date: "2026-06-10", status: "완료", warnings: 1 },
    { date: "2026-06-01", status: "완료", warnings: 0 },
  ],
  unsafeIssues: [
    { id: "u1", status: UNSAFE[0], createdAt: "2026-06-11T09:00:00+09:00", workerNameSnapshot: "김작업", shipNo: "H1", content: "사다리 파손" },
    { id: "u2", status: UNSAFE[2], createdAt: "2026-06-09T09:00:00+09:00", workerNameSnapshot: "숨김작업자", shipNo: "H2", content: "완료건" },
  ],
  missingMaterials: [
    { id: "m1", status: MATERIAL[1], createdAt: "2026-06-10T09:00:00+09:00", workerNameSnapshot: "김작업", shipNo: "H1", materialName: "볼트" },
  ],
  ships: [
    { no: "H1", processStage: "mounting" },
    { no: "H2", processStage: "mounting" },
    { no: "H3", processStage: "dl" },
  ],
};
const model = buildAnalyticsDashboardModel(data, deps);

assert.strictEqual(model.dateLabel, "2026년 6월 11일");
assert.strictEqual(model.syncText, "[온라인]");
assert.strictEqual(model.todayDone, 1);
assert.strictEqual(model.todayDeltaText, "어제와 동일"); // 6/10 완료 1건
assert.strictEqual(model.unsafeOpen, 1);
assert.strictEqual(model.unsafeSummary, "1건 접수 · 0건 조치중");
assert.strictEqual(model.materialOpen, 1);
assert.strictEqual(model.shipCount, 3);
assert.strictEqual(model.processStageCount, 5);
assert.strictEqual(model.processSummary, "2/5단계 분포");
const mounting = model.processRows.find((row) => row.info.stage === "mounting");
assert.strictEqual(mounting.count, 2);
assert.strictEqual(mounting.percent, 67);
// 주간(6/5~6/11) 위험도: 점검 3건(완료2/진행1) + 불안전 2건(미완료1) + 자재 1건(미처리1)
assert.strictEqual(model.risk.ng.count, 2);   // warnings>0 점검 1 + 미완료 불안전 1
assert.strictEqual(model.risk.warn.count, 2); // 미완료 점검 1 + 미처리 자재 1
assert.strictEqual(model.risk.ok.count, 1);   // 주간 내 경고 없는 완료 점검 1 (6/10건은 경고 있음, 6/1건은 범위 밖)
assert.strictEqual(model.weeklyAverage, "0.9"); // 6건/7일
// recent: 숨김작업자 제외, 최신순
assert.deepStrictEqual(model.recent.map((row) => row.id), ["u1", "m1"]);
assert.strictEqual(model.recent[0].type, "불안전요소 등록");

// 월간 작업자 일별 상태 분류: 작업지시서 참여(점검 의무)가 있는 날만 대상으로 집계한다.
const doneRow = { status: "완료", completion: 100 };
const partialRow = { status: "진행중", completion: 40 };
// 의무 있음 + 점검 제출(완료) = done
assert.strictEqual(monthlyWorkerDayStatus({ isRestDay: false, isFuture: false, dayInspections: [doneRow], hasObligation: true }), "done");
// 의무 있음 + 미제출 = missing(누락)
assert.strictEqual(monthlyWorkerDayStatus({ isRestDay: false, isFuture: false, dayInspections: [], hasObligation: true }), "missing");
// 의무 있음 + 미완료 점검 = partial
assert.strictEqual(monthlyWorkerDayStatus({ isRestDay: false, isFuture: false, dayInspections: [partialRow], hasObligation: true }), "partial");
// 의무 없음(해당 일 작업지시서 미참여) = excluded(제외) — 누락 아님, 대상일에서 제외
assert.strictEqual(monthlyWorkerDayStatus({ isRestDay: false, isFuture: false, dayInspections: [], hasObligation: false }), "excluded");
// 의무 없어도 제출된 점검이 있으면 완료/미완료로 집계
assert.strictEqual(monthlyWorkerDayStatus({ isRestDay: false, isFuture: false, dayInspections: [doneRow], hasObligation: false }), "done");
assert.strictEqual(monthlyWorkerDayStatus({ isRestDay: false, isFuture: false, dayInspections: [partialRow], hasObligation: false }), "partial");
// 휴무일은 의무와 무관하게 rest
assert.strictEqual(monthlyWorkerDayStatus({ isRestDay: true, isFuture: false, dayInspections: [doneRow], hasObligation: true }), "rest");
// 미래일은 excluded
assert.strictEqual(monthlyWorkerDayStatus({ isRestDay: false, isFuture: true, dayInspections: [], hasObligation: true }), "excluded");

// 결합 점검 목록: 최근 목록(윈도) + 기간 캐시 병합. 본 목록 우선, id 중복 제거.
const windowRows = [
  { id: "i-new", date: "2026-06-11", status: "완료", completion: 100 },
  { id: "i-dup", date: "2026-06-09", status: "진행중", completion: 40 },
];
const archivedRows = [
  { id: "i-dup", date: "2026-06-09", status: "완료", completion: 100 }, // 본 목록 행이 이긴다
  { id: "i-old", date: "2026-06-02", status: "완료", completion: 100 }, // 윈도 밖 과거 행 추가
  { id: "", date: "2026-06-01" }, // id 없는 행은 무시
];
const combined = combineInspectionRows(windowRows, archivedRows);
assert.deepStrictEqual(combined.map((row) => row.id), ["i-new", "i-dup", "i-old"]);
assert.strictEqual(combined.find((row) => row.id === "i-dup").status, "진행중"); // 본 목록 우선
// 캐시가 비어 있으면 본 목록을 그대로 반환 (불필요한 복사 없음)
assert.strictEqual(combineInspectionRows(windowRows, []), windowRows);
assert.strictEqual(combineInspectionRows(windowRows, null), windowRows);
assert.deepStrictEqual(combineInspectionRows(null, archivedRows).map((row) => row.id), ["i-dup", "i-old"]);
// 입력 배열은 변경되지 않는다
assert.strictEqual(windowRows.length, 2);
assert.strictEqual(archivedRows.length, 3);

console.log("analytics model tests passed");
