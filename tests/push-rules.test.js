const assert = require("assert");

const {
  ADMIN_PUSH_STYLES,
  DEFAULT_PUSH_NOTIFICATION_TEMPLATES,
  adminPushStyleMeta,
  createAdminPushDraft,
  normalizeAdminPushTargetMode,
  normalizeAdminPushWorkerIds,
  normalizePushTemplate,
  normalizePushTemplateKind,
  normalizeWorkerPushDevice,
  normalizeWorkerPushSubscriptionStatus,
  pushNotificationFromTemplate,
  pushTemplateMeta,
  replacePushTemplateTokens,
  workerPushDeviceBrowserLabel,
  workerPushDevicePlatformLabel,
  workerPushSubscriptionBadgeMeta,
} = require("../assets/js/push-rules.js");

// 푸시 문구 종류 정규화
assert.strictEqual(normalizePushTemplateKind("pledgePending"), "pledgePending");
assert.strictEqual(normalizePushTemplateKind("unsafeIssue"), "unsafeIssue");
assert.strictEqual(normalizePushTemplateKind("adminManual"), "adminManual");
assert.strictEqual(normalizePushTemplateKind("bogus"), "", "정의되지 않은 종류는 빈 문자열을 반환한다");
assert.strictEqual(normalizePushTemplateKind(undefined), "");

// 푸시 문구 정규화 (빈 값은 기본 문구로 대체)
assert.deepStrictEqual(
  normalizePushTemplate({ title: "  제목  ", body: "내용" }, DEFAULT_PUSH_NOTIFICATION_TEMPLATES.pledgePending),
  { title: "제목", body: "내용" },
);
assert.deepStrictEqual(
  normalizePushTemplate({ title: "   ", body: null }, DEFAULT_PUSH_NOTIFICATION_TEMPLATES.pledgePending),
  DEFAULT_PUSH_NOTIFICATION_TEMPLATES.pledgePending,
  "빈 제목/내용은 기본 문구로 대체한다",
);
assert.deepStrictEqual(
  normalizePushTemplate("not-an-object", DEFAULT_PUSH_NOTIFICATION_TEMPLATES.adminManual),
  DEFAULT_PUSH_NOTIFICATION_TEMPLATES.adminManual,
);

// 토큰 치환
assert.strictEqual(
  replacePushTemplateTokens("{호선} · {등록자} · {내용}", { 호선: "호선 101", 등록자: "김준혁", 내용: "정리 필요" }),
  "호선 101 · 김준혁 · 정리 필요",
);
assert.strictEqual(
  replacePushTemplateTokens("{날짜} 안내 {미정의}", { 날짜: "2026.06.11" }),
  "2026.06.11 안내 {미정의}",
  "컨텍스트에 없는 토큰은 원문을 유지한다",
);
assert.strictEqual(replacePushTemplateTokens("{값} 표시", { 값: "" }), "{값} 표시", "빈 문자열 값은 토큰을 유지한다");
assert.strictEqual(replacePushTemplateTokens(null, {}), "");

// 저장된 문구 기반 알림 생성 (templates 주입)
const templates = {
  pledgePending: { title: "서약 {날짜}", body: "미완료 {인원}명" },
  unsafeIssue: { ...DEFAULT_PUSH_NOTIFICATION_TEMPLATES.unsafeIssue },
  adminManual: { ...DEFAULT_PUSH_NOTIFICATION_TEMPLATES.adminManual },
};
assert.deepStrictEqual(
  pushNotificationFromTemplate("pledgePending", { 날짜: "2026.06.11", 인원: 3 }, templates),
  { title: "서약 2026.06.11", body: "미완료 3명" },
);
assert.deepStrictEqual(
  pushNotificationFromTemplate("bogus", {}, templates),
  { title: "", body: "" },
  "정의되지 않은 종류는 빈 문구를 반환한다",
);

// 푸시 문구 메타 (미리보기 컨텍스트 주입)
const pledgeMeta = pushTemplateMeta("pledgePending", { todayLabel: "2026.06.11", pledgePendingCount: 4 });
assert.strictEqual(pledgeMeta.heading, "미완료자 알림 푸시 문구");
assert.deepStrictEqual(pledgeMeta.tokens, ["{날짜}", "{인원}"]);
assert.deepStrictEqual(pledgeMeta.previewContext, { 날짜: "2026.06.11", 인원: 4 });
const adminMeta = pushTemplateMeta("adminManual", { todayLabel: "2026.06.11", senderName: "김준혁" });
assert.deepStrictEqual(adminMeta.previewContext, { 날짜: "2026.06.11", 발신자: "김준혁", 대상수: 1 });
assert.strictEqual(pushTemplateMeta("unsafeIssue").previewContext.호선, "호선 101");
assert.strictEqual(pushTemplateMeta("bogus"), null);

// 구독 상태 정규화 (checkedAt 주입)
assert.deepStrictEqual(
  normalizeWorkerPushSubscriptionStatus("w1", { registered: true, subscription_count: "2" }, "2026-06-11T00:00:00.000Z"),
  { workerId: "w1", registered: true, subscriptionCount: 2, checkedAt: "2026-06-11T00:00:00.000Z" },
);
assert.deepStrictEqual(
  normalizeWorkerPushSubscriptionStatus(" w2 ", null, "2026-06-11T00:00:00.000Z"),
  { workerId: "w2", registered: false, subscriptionCount: 0, checkedAt: "2026-06-11T00:00:00.000Z" },
  "row가 없으면 workerId 인자 기준으로 기본 상태를 만든다",
);

// 알림 기기 정규화
const device = normalizeWorkerPushDevice({
  id: " d1 ",
  worker_id: "w1",
  device_label: "  ",
  user_agent: "Mozilla/5.0 (Linux; Android 14) Chrome/120",
  enabled: false,
  last_seen_at: "2026-06-10T01:00:00Z",
  last_error: " 410 gone ",
});
assert.strictEqual(device.id, "d1");
assert.strictEqual(device.workerId, "w1");
assert.strictEqual(device.deviceLabel, "알림 기기", "빈 라벨은 기본 라벨로 대체한다");
assert.strictEqual(device.enabled, false);
assert.strictEqual(device.lastSeenAt, "2026-06-10T01:00:00Z");
assert.strictEqual(device.lastError, "410 gone");
assert.strictEqual(normalizeWorkerPushDevice(null).enabled, true, "enabled 기본값은 true");

// 관리자 푸시 대상/스타일 정규화
assert.strictEqual(normalizeAdminPushTargetMode("everyone"), "selected");
assert.deepStrictEqual(normalizeAdminPushWorkerIds([" w1 ", "w1", "", null, "w2"]), ["w1", "w2"]);
assert.deepStrictEqual(normalizeAdminPushWorkerIds("not-an-array"), []);
assert.strictEqual(adminPushStyleMeta("urgent").id, "urgent");
assert.strictEqual(adminPushStyleMeta("bogus").id, ADMIN_PUSH_STYLES[0].id, "알 수 없는 스타일은 첫 번째 스타일로 대체한다");

// 관리자 푸시 초안 생성
const draft = createAdminPushDraft({ selectedWorkerIds: ["w1", "w1"], title: " 제목 ", style: "warning" });
assert.deepStrictEqual(draft.selectedWorkerIds, ["w1"]);
assert.strictEqual(draft.title, "제목");
assert.strictEqual(draft.body, DEFAULT_PUSH_NOTIFICATION_TEMPLATES.adminManual.body);
assert.strictEqual(draft.url, "/index.html");
assert.strictEqual(draft.style, "warning");
assert.strictEqual(draft.targetMode, "selected");
assert.strictEqual(createAdminPushDraft().style, ADMIN_PUSH_STYLES[0].id);

// 기기 라벨 추론
assert.strictEqual(workerPushDeviceBrowserLabel("... Whale/3.0 ..."), "웨일");
assert.strictEqual(workerPushDeviceBrowserLabel("... Chrome/120 Edg/120 ..."), "Edge");
assert.strictEqual(workerPushDeviceBrowserLabel("... Chrome/120 Safari/537 ..."), "Chrome");
assert.strictEqual(workerPushDeviceBrowserLabel(""), "브라우저");
assert.strictEqual(workerPushDevicePlatformLabel("Mozilla/5.0 (Linux; Android 14)"), "Android");
assert.strictEqual(workerPushDevicePlatformLabel("Mozilla/5.0 (iPhone; CPU iPhone OS)"), "iOS");
assert.strictEqual(workerPushDevicePlatformLabel("Mozilla/5.0 (Windows NT 10.0)"), "Windows");
assert.strictEqual(workerPushDevicePlatformLabel(""), "기기");

// 구독 상태 배지 메타 (status, checking 주입)
assert.strictEqual(workerPushSubscriptionBadgeMeta({}, true).className, "is-checking", "확인 중 + 미확인 상태");
assert.strictEqual(workerPushSubscriptionBadgeMeta({ registered: true, subscriptionCount: 2, checkedAt: "t" }, false).text, "알림 2대");
assert.strictEqual(workerPushSubscriptionBadgeMeta({ registered: true, subscriptionCount: 0, checkedAt: "t" }, false).text, "알림 1대", "등록 상태에서 0건이면 1건으로 표시한다");
assert.strictEqual(workerPushSubscriptionBadgeMeta({ registered: false, checkedAt: "t" }, false).className, "is-empty");
assert.strictEqual(workerPushSubscriptionBadgeMeta({}, false).className, "is-unknown");
assert.strictEqual(workerPushSubscriptionBadgeMeta({ registered: true, checkedAt: "t" }, true).className, "is-registered", "확인 완료 상태면 확인 중이어도 결과를 보여준다");

console.log("push-rules tests passed");
