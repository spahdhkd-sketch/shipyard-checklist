const assert = require("assert");

const {
  filterChecklistItems,
  toolMatchesCategoryNature,
} = require("../assets/js/checklist-rules.js");

const tools = [
  { id: "wire", name: "탑재용 와이어", nature: "선행" },
  { id: "sling", name: "슬링벨트", nature: "선행" },
  { id: "platform", name: "작업용 발판", nature: "선행" },
  { id: "post", name: "후행용 공기구", nature: "후행" },
  { id: "both", name: "공용 공기구", nature: "선행/후행" },
];

const items = [
  { id: "wire-pin", text: "탑재용 와이어 / 샤클 안전핀 상태", visibilityCondition: "선행", toolIds: ["wire"] },
  { id: "sling-damage", text: "슬링벨트 손상 상태", visibilityCondition: "선행", toolIds: ["sling"] },
  { id: "housekeeping", text: "탑재 위치 정리정돈", visibilityCondition: "항상 표시", toolIds: [] },
  { id: "no-under-load", text: "권상물 하부 출입금지", visibilityCondition: "항상 표시" },
  { id: "post-only", text: "후행 공기구 점검", visibilityCondition: "후행", toolIds: ["post"] },
];

function visibleIds(selectedToolIds, categoryNature = "선행") {
  return filterChecklistItems({ items, tools, selectedToolIds, categoryNature }).map((row) => row.id);
}

assert.deepStrictEqual(
  visibleIds(["wire"]),
  ["wire-pin", "housekeeping", "no-under-load"],
  "탑재용 와이어를 선택하면 와이어 점검 항목과 공통 항목만 표시한다",
);

assert.deepStrictEqual(
  visibleIds(["sling", "platform"]),
  ["sling-damage", "housekeeping", "no-under-load"],
  "슬링벨트/작업용 발판 선택 시 와이어 전용 항목은 제외한다",
);

assert.deepStrictEqual(
  visibleIds(["wire", "sling"]),
  ["wire-pin", "sling-damage", "housekeeping", "no-under-load"],
  "여러 공기구를 선택하면 각각 연결된 항목과 공통 항목을 함께 표시한다",
);

assert.strictEqual(toolMatchesCategoryNature({ nature: "후행" }, "선행"), false);
assert.strictEqual(toolMatchesCategoryNature({ nature: "선행/후행" }, "선행"), true);
assert.strictEqual(toolMatchesCategoryNature({ nature: "후행" }, "선행/후행"), true);

console.log("checklist-rules tests passed");
