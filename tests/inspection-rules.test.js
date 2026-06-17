const assert = require("assert");

const {
  highRiskMissingCount,
  validateInspectionDraft,
  summarizeInspectionChecks,
} = require("../assets/js/inspection-rules.js");

const items = [
  { id: "a", risk: "high" },
  { id: "b", risk: "medium" },
  { id: "c", risk: "low" },
];

function baseValid() {
  return {
    worker: "홍길동",
    shipNo: "H1234",
    items,
    checks: { a: true, b: true, c: true },
    pledgeRulesCount: 2,
    pledgeCheckedCount: 2,
    signatureText: "홍길동",
  };
}

// --- highRiskMissingCount ---
assert.strictEqual(highRiskMissingCount(items, { a: true }), 0);
assert.strictEqual(highRiskMissingCount(items, {}), 1);
assert.strictEqual(highRiskMissingCount([], {}), 0);
assert.strictEqual(highRiskMissingCount(null, null), 0);

// --- validateInspectionDraft: 통과 ---
assert.strictEqual(validateInspectionDraft(baseValid()), null);

// --- validateInspectionDraft: 가드 순서/문구 (submitInspection과 1:1) ---
assert.strictEqual(
  validateInspectionDraft({ ...baseValid(), worker: "   " }),
  "담당자명을 입력하세요."
);
assert.strictEqual(
  validateInspectionDraft({ ...baseValid(), shipNo: "" }),
  "호선을 선택하세요."
);
assert.strictEqual(
  validateInspectionDraft({ ...baseValid(), pledgeCheckedCount: 1 }),
  "안전 서약 항목을 모두 확인하세요."
);
assert.strictEqual(
  validateInspectionDraft({ ...baseValid(), signatureText: "" }),
  "서명을 입력하거나 손가락으로 서명하세요."
);
assert.strictEqual(
  validateInspectionDraft({ ...baseValid(), checks: { b: true, c: true } }),
  "위험 항목을 모두 확인해야 제출할 수 있습니다."
);
assert.strictEqual(
  validateInspectionDraft({ ...baseValid(), items: [], checks: {} }),
  "등록된 점검 항목이 없습니다."
);

// 가드 우선순위: worker가 비면 다른 문제보다 worker 메시지가 먼저
assert.strictEqual(
  validateInspectionDraft({ ...baseValid(), worker: "", shipNo: "" }),
  "담당자명을 입력하세요."
);

// --- summarizeInspectionChecks ---
let s = summarizeInspectionChecks(items, { a: true, b: true, c: true });
assert.strictEqual(s.total, 3);
assert.strictEqual(s.checkedCount, 3);
assert.strictEqual(s.completion, 100);
assert.strictEqual(s.warnings, 0);
assert.strictEqual(s.allComplete, true);
assert.strictEqual(s.status, "완료");

s = summarizeInspectionChecks(items, { a: true });
assert.strictEqual(s.checkedCount, 1);
assert.strictEqual(s.completion, 33); // round(1/3*100)
assert.strictEqual(s.warnings, 1);    // b(medium) 미체크, c(low) 제외
assert.strictEqual(s.allComplete, false);
assert.strictEqual(s.status, "미완료");

// low 항목 미체크는 경고에서 제외
s = summarizeInspectionChecks([{ id: "x", risk: "low" }], {});
assert.strictEqual(s.warnings, 0);
assert.strictEqual(s.completion, 0);

// 빈 항목은 0으로 안전 처리 (NaN 방지)
s = summarizeInspectionChecks([], {});
assert.strictEqual(s.completion, 0);
assert.strictEqual(s.allComplete, false);
assert.strictEqual(s.status, "미완료");

console.log("inspection-rules tests passed");
