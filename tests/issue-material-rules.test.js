const assert = require("assert");

const {
  UNSAFE_STATUSES,
  MATERIAL_STATUSES,
  MAX_UNSAFE_PHOTOS,
  createWorkerSnapshot,
  filterRecords,
  groupMaterialsByShip,
  groupUnsafeByStatus,
  sortRecords,
  validateMaterialDraft,
  validateUnsafeDraft,
} = require("../assets/js/issue-material-rules.js");

const workers = [
  { id: "worker-1", name: "김민수", team: "배관팀" },
  { id: "worker-2", name: "이서연", team: "전장팀" },
];

const unsafeRecords = [
  { id: "u1", shipNo: "H-102", content: "통로 적치물", workerId: "worker-1", workerNameSnapshot: "김민수", status: "완료", createdAt: "2026-05-15T08:00:00.000Z" },
  { id: "u2", shipNo: "H-104", content: "난간 흔들림", workerId: "worker-2", workerNameSnapshot: "이서연", status: "접수", createdAt: "2026-05-15T10:00:00.000Z" },
  { id: "u3", shipNo: "H-102", content: "불티 위험", workerId: "worker-2", workerNameSnapshot: "이서연", status: "조치중", createdAt: "2026-05-15T09:00:00.000Z" },
];

const materialRecords = [
  { id: "m1", shipNo: "H-102", materialName: "배관 자재", workerId: "worker-1", workerNameSnapshot: "김민수", status: "확인중", createdAt: "2026-05-15T08:00:00.000Z" },
  { id: "m2", shipNo: "H-104", materialName: "밸브", workerId: "worker-2", workerNameSnapshot: "이서연", status: "접수", createdAt: "2026-05-15T10:00:00.000Z" },
  { id: "m3", shipNo: "H-102", materialName: "전선 트레이", workerId: "worker-2", workerNameSnapshot: "이서연", status: "완료", createdAt: "2026-05-15T09:00:00.000Z" },
];

assert.deepStrictEqual(UNSAFE_STATUSES, ["접수", "조치중", "완료"]);
assert.deepStrictEqual(MATERIAL_STATUSES, ["접수", "확인중", "완료"]);
assert.strictEqual(MAX_UNSAFE_PHOTOS, 3);

assert.deepStrictEqual(
  createWorkerSnapshot("worker-1", workers),
  { workerId: "worker-1", workerNameSnapshot: "김민수", workerTeamSnapshot: "배관팀" },
);

assert.deepStrictEqual(
  validateUnsafeDraft({ shipNo: "", content: "", workerId: "" }),
  ["호선을 선택하세요.", "내용을 입력하세요.", "등록자를 선택하세요."],
);

assert.deepStrictEqual(
  validateMaterialDraft({ shipNo: "H-102", materialName: "", content: "", workerId: "worker-1" }),
  ["자재명을 입력하세요.", "내용을 입력하세요."],
);

assert.deepStrictEqual(
  filterRecords(unsafeRecords, { shipNo: "H-102", status: "", workerId: "" }).map((row) => row.id),
  ["u1", "u3"],
);

assert.deepStrictEqual(
  sortRecords(unsafeRecords, "status", UNSAFE_STATUSES).map((row) => row.id),
  ["u2", "u3", "u1"],
);

assert.deepStrictEqual(
  groupUnsafeByStatus(unsafeRecords).map((group) => [group.status, group.records.map((row) => row.id)]),
  [["접수", ["u2"]], ["조치중", ["u3"]], ["완료", ["u1"]]],
);

assert.deepStrictEqual(
  groupMaterialsByShip(materialRecords).map((group) => [group.shipNo, group.records.map((row) => row.id)]),
  [["H-102", ["m1", "m3"]], ["H-104", ["m2"]]],
);

assert.deepStrictEqual(
  sortRecords(materialRecords, "materialName", MATERIAL_STATUSES).map((row) => row.id),
  ["m2", "m1", "m3"],
);

console.log("issue-material-rules tests passed");
