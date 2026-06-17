const assert = require("assert");
const T = require("../assets/js/work-prep-timeline-rules.js");

// --- normalizeEntry: 구버전 무손실 ---
let n = T.normalizeEntry({ status: "확정", changedAt: "2026-06-18T02:00:00Z", actor: "관리자", memo: "점검 대기 → 확정" });
assert.strictEqual(n.kind, "status");
assert.strictEqual(n.actorLabel, "관리자");
assert.deepStrictEqual(n.actors, []);
assert.strictEqual(n.actor, "관리자"); // 하위호환
assert.strictEqual(T.normalizeEntry({ status: "", changedAt: "x" }), null);
assert.strictEqual(T.normalizeEntry(null), null);
// 마일스톤 kind 추론
assert.strictEqual(T.normalizeEntry({ status: "점검 시작", changedAt: "t" }).kind, "start");
assert.strictEqual(T.normalizeEntry({ status: "작업지시서 등록", changedAt: "t" }).kind, "register");
assert.strictEqual(T.normalizeEntry({ status: "점검 완료", changedAt: "t" }).kind, "complete");

// --- upsertMilestone: 등록 ---
let e = T.upsertMilestone([], { kind: "register", changedAt: "2026-06-18T01:00:00Z", actorIds: ["lead"], actorLabel: "조장" });
assert.strictEqual(e.length, 1);
assert.strictEqual(e[0].status, "작업지시서 등록");
assert.deepStrictEqual(e[0].actors, ["lead"]);

// --- 시작: 명단 누적 + 첫 시각 고정 ---
e = T.upsertMilestone(e, { kind: "start", changedAt: "2026-06-18T02:00:00Z", actorIds: ["w1"], actorLabel: "w1" });
e = T.upsertMilestone(e, { kind: "start", changedAt: "2026-06-18T03:00:00Z", actorIds: ["w2"] });
e = T.upsertMilestone(e, { kind: "start", changedAt: "2026-06-18T04:00:00Z", actorIds: ["w1"] }); // 중복 무시
const start = e.find((x) => x.kind === "start");
assert.deepStrictEqual(start.actors, ["w1", "w2"]);
assert.strictEqual(start.changedAt, "2026-06-18T02:00:00Z"); // 첫 시각 고정

// --- 완료: replaceActors (제출자 전체) ---
e = T.upsertMilestone(e, { kind: "complete", changedAt: "2026-06-18T05:00:00Z", actorIds: ["w1", "w2", "lead"], replaceActors: true });
const done = e.find((x) => x.kind === "complete");
assert.deepStrictEqual(done.actors, ["w1", "w2", "lead"]);
// 완료 갱신 시 교체
e = T.upsertMilestone(e, { kind: "complete", changedAt: "2026-06-18T06:00:00Z", actorIds: ["w1", "w2"], replaceActors: true });
assert.deepStrictEqual(e.find((x) => x.kind === "complete").actors, ["w1", "w2"]);

// --- 정렬 + 마일스톤 1줄 보장 ---
assert.strictEqual(e.filter((x) => x.kind === "start").length, 1);
assert.strictEqual(e.filter((x) => x.kind === "register").length, 1);
const times = e.map((x) => x.changedAt);
assert.deepStrictEqual(times, [...times].sort());

// --- uniqueEntries: 마일스톤 병합 + 일반 status 보존 ---
const merged = T.uniqueEntries([
  { status: "작업지시서 등록", changedAt: "t1", actors: ["a"] },
  { status: "작업지시서 등록", changedAt: "t0", actors: ["b"] }, // 같은 kind -> 병합, 이른 시각
  { status: "확정", changedAt: "t2", actor: "관리자" },
  { status: "확정", changedAt: "t2", actor: "관리자" },          // 중복 -> 1개
]);
const reg = merged.find((x) => x.kind === "register");
assert.deepStrictEqual(reg.actors.sort(), ["a", "b"]);
assert.strictEqual(reg.changedAt, "t0");
assert.strictEqual(merged.filter((x) => x.status === "확정").length, 1);

// --- 멀티 기기 수렴(union) + 멱등성 ---
// 각자 폰에서 시작 → 서버/로컬 합치면 시작자 명단이 합집합으로 모임
const devA = T.upsertMilestone([{ status: "작업지시서 등록", changedAt: "t0", actors: ["lead"] }], { kind: "start", changedAt: "t1", actorIds: ["A"] });
const devB = T.upsertMilestone([{ status: "작업지시서 등록", changedAt: "t0", actors: ["lead"] }], { kind: "start", changedAt: "t2", actorIds: ["B"] });
let conv = T.uniqueEntries([...devA, ...devB]);
let cs = conv.find((x) => x.kind === "start");
assert.deepStrictEqual([...cs.actors].sort(), ["A", "B"]); // 합집합
assert.strictEqual(cs.changedAt, "t1");                    // 첫 시작 시각 유지
assert.strictEqual(conv.filter((x) => x.kind === "register").length, 1); // 등록 1줄 유지
// 멱등: 같은 데이터를 또 합쳐도 변하지 않음
const conv2 = T.uniqueEntries([...conv, ...devA, ...devB]);
assert.deepStrictEqual([...conv2.find((x) => x.kind === "start").actors].sort(), ["A", "B"]);
assert.strictEqual(conv2.length, conv.length);

console.log("work-prep-timeline-rules tests passed");
