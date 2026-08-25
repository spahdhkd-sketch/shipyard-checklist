const assert = require("assert");
const fs = require("fs");
const unsafeV4View = require("../assets/js/unsafe-v4-view.js");

const registrationHtml = unsafeV4View.renderUnsafeV4View({
  mode: "register",
  ships: [{ no: "S-101", label: "S-101 · 상부" }],
  draft: {
    shipNo: "S-101",
    severity: "높음",
    content: "개구부 덮개가 없습니다.",
    location: "3번 탱크 상부 통로",
    immediateAction: "작업 중지 및 출입 통제",
  },
});

assert(registrationHtml.includes('class="unsafe-v4"'));
assert(registrationHtml.includes('data-unsafe-v4-mode="register"'));
assert(registrationHtml.includes('for="unsafeShipNo"'));
assert(registrationHtml.includes('id="unsafeSeverity" data-unsafe-severity'));
assert(registrationHtml.includes('id="unsafeLocation" data-unsafe-location'));
assert(registrationHtml.includes('id="unsafeImmediateAction" data-unsafe-immediate-action'));
assert(registrationHtml.includes('data-unsafe-next type="button"'));
assert(!registrationHtml.includes('data-action="submit-unsafe"'), "registration advances to review before it can submit");
assert(!registrationHtml.includes("홍길동"), "the pure registration renderer must not invent worker data");

const incompleteReviewHtml = unsafeV4View.renderUnsafeV4View({
  mode: "review",
  draft: { shipNo: "S-101", content: "개구부" },
});
assert(/data-action="submit-unsafe" type="button"\s+disabled aria-disabled="true"/.test(incompleteReviewHtml));
assert(incompleteReviewHtml.includes("입력되지 않음"), "missing required values must be shown as missing, not fabricated");
assert(incompleteReviewHtml.includes('data-unsafe-edit-step="2"'));

const detailHtml = unsafeV4View.renderUnsafeV4View({
  mode: "detail",
  records: [
    { id: "unsafe-1", shipNo: "S-101", content: "개구부 덮개 미설치", location: "3번 탱크", status: "접수" },
    { id: "unsafe-2", shipNo: "S-202", content: "난간 훼손", location: "기관실", status: "조치중" },
  ],
  selectedRecordId: "unsafe-1",
  selectedRecord: {
    id: "unsafe-1",
    shipNo: "S-101",
    content: "개구부 덮개 미설치",
    severity: "높음",
    location: "3번 탱크",
    immediateAction: "작업 중지 및 출입 통제",
    workerNameSnapshot: "박안전",
    createdAtText: "2026-08-24 09:10",
    status: "접수",
    action: { assignee: "김관리", dueDate: "2026-08-25" },
    timeline: [{ title: "접수", meta: "2026-08-24 09:10", note: "현장 확인 대기" }],
  },
});

assert(detailHtml.includes('data-unsafe-record-detail="unsafe-1"'));
assert(detailHtml.includes('class="unsafe-v4__record is-active"'));
assert(detailHtml.includes('data-record-assignee="unsafe:unsafe-1"'));
assert(detailHtml.includes('data-record-due-date="unsafe:unsafe-1"'));
assert(detailHtml.includes('data-record-status="unsafe:unsafe-1"'));
assert(detailHtml.includes('data-save-record-status="unsafe:unsafe-1"'));
assert(detailHtml.includes('data-record-memo="unsafe:unsafe-1"'));
assert(detailHtml.includes('data-save-record="unsafe:unsafe-1"'));
assert(detailHtml.includes("현장 확인 대기"));
assert(detailHtml.includes("김관리"));
assert(!detailHtml.includes("이영희"), "the pure detail renderer must only show supplied people");

const mobileDetailHtml = unsafeV4View.renderUnsafeV4View({
  mode: "detail",
  mobileDetailOpen: true,
  selectedRecord: { id: "unsafe-3", shipNo: "S-303", content: "통로 적치물", status: "접수" },
});
assert(mobileDetailHtml.includes('class="unsafe-v4__detail is-mobile-fullscreen"'));
assert(mobileDetailHtml.includes('data-action="back-unsafe-list"'));

const staleHtml = unsafeV4View.renderUnsafeV4View({
  mode: "detail",
  dataState: "stale",
  selectedRecord: { id: "unsafe-4", content: "기록", status: "접수" },
});
assert(staleHtml.includes("마지막으로 확인된 데이터를 표시합니다"));
assert(staleHtml.includes("읽기 전용"), "stale records must communicate the mutation guard");
assert(staleHtml.includes("<fieldset disabled>"));
assert(/data-save-record="unsafe:unsafe-4" type="button"\s+disabled aria-disabled="true"/.test(staleHtml));

const loadingHtml = unsafeV4View.renderUnsafeV4View({ dataState: "loading", mode: "detail" });
assert(loadingHtml.includes('class="unsafe-v4__state is-loading"'));
assert(!loadingHtml.includes("접수 목록"), "loading must not show placeholder record counts as real data");

const source = fs.readFileSync("assets/js/unsafe-v4-view.js", "utf8");
const css = fs.readFileSync("assets/css/30-feature-unsafe-v4.css", "utf8");
assert(!/\b(fetch|localStorage|sessionStorage|deleteRemoteRows)\b/.test(source), "the pure renderer must not create network, storage, or delete behavior");
assert(css.includes("var(--ds-touch-target-min)"), "interactive controls must use the shared 44px touch target token");
assert(!/#(?:[\da-f]{3}){1,2}\b|\brgba?\(/i.test(css), "unsafe v4 colors must use the shared design tokens");
assert(css.includes(".unsafe-v4__detail.is-mobile-fullscreen"));
assert(css.includes("body.unsafe-v4-mobile-detail-open"));

console.log("unsafe-v4 view tests passed");
