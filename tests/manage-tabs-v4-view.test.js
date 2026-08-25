const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const ROOT = path.resolve(__dirname, "..");
const view = require(path.join(ROOT, "assets/js/manage-tabs-v4-view.js"));

test("관리 내부 탭 모듈은 다섯 순수 렌더러를 공개한다", () => {
  assert.deepEqual(Object.keys(view).sort(), [
    "renderPushManager",
    "renderSafetySettings",
    "renderWorkPrepDetail",
    "renderWorkTypes",
    "renderWorkersDevices",
  ]);
});

test("작업 유형은 기존 검색·선택·수정 계약과 모바일 상세를 유지한다", () => {
  const model = {
    categories: [{
      id: "type-1",
      label: "용접 <script>",
      meta: "2개 섹션",
      countLabel: "12개",
      searchText: "용접 2개 섹션",
      active: true,
    }],
    selected: {
      id: "type-1",
      label: "용접",
      meta: "2개 섹션 · 12개 항목",
      summaryHtml: '<div data-real-summary="true">실제 요약</div>',
      editHtml: '<form data-real-editor="true"></form>',
    },
    canEdit: true,
    mobileDetailOpen: true,
  };
  const readOnlyHtml = view.renderWorkTypes(model);
  assert.match(readOnlyHtml, /data-work-type-search/);
  assert.match(readOnlyHtml, /data-select-work-type="type-1"/);
  assert.match(readOnlyHtml, /data-work-type-search-item/);
  assert.match(readOnlyHtml, /data-action="back-work-type-list"/);
  assert.match(readOnlyHtml, /data-edit-category="type-1"/);
  assert.match(readOnlyHtml, /data-manage-tabs-read-only="true"/);
  assert.match(readOnlyHtml, /data-real-summary="true"/);
  assert.doesNotMatch(readOnlyHtml, /data-save-category/);
  assert.doesNotMatch(readOnlyHtml, /<script>/);

  const editingHtml = view.renderWorkTypes({ ...model, editing: true });
  assert.match(editingHtml, /data-real-editor="true"/);
  assert.match(editingHtml, /data-save-category="type-1"/);
  assert.match(editingHtml, /data-action="cancel-edit-category"/);
  assert.match(editingHtml, /data-manage-tabs-read-only="false"/);
});

test("작업자와 알림 기기는 목록 선택·기기 저장·삭제 계약을 유지한다", () => {
  const output = view.renderWorkersDevices({
    count: 1,
    workers: [{ id: "worker-1", name: "김작업", teamLine: "선행", active: true, badgesHtml: "<b>반장</b>" }],
    selected: {
      id: "worker-1",
      name: "김작업",
      teamLine: "선행 · 반장",
      summaryHtml: '<dl data-real-worker="true"></dl>',
      devices: [{ id: "device-1", enabled: true, deviceLabel: "현장 휴대폰", deviceMeta: "Chrome", lastSeen: "방금" }],
    },
    canEdit: true,
    canEditDevices: true,
    mobileDetailOpen: true,
  });
  assert.match(output, /data-worker-card-toggle="worker-1"/);
  assert.match(output, /data-action="back-manage-center-list"/);
  assert.match(output, /data-action="edit-worker-push-devices"/);
  assert.match(output, /data-worker-push-manage="worker-1"/);
  assert.match(output, /data-worker-push-device-enabled/);
  assert.match(output, /data-worker-push-device-id="device-1"/);
  assert.match(output, /data-action="save-worker-push-device"/);
  assert.match(output, /data-action="delete-worker-push-device"/);
  assert.match(output, /data-real-worker="true"/);
  assert.match(output, /data-manage-tabs-read-only="true"/);
});

test("작업지시서 상세는 실제 상세·이력 HTML과 기존 편집·보관 계약을 사용한다", () => {
  const output = view.renderWorkPrepDetail({
    recordId: "prep-1",
    shipNo: "H-101",
    categoryLabel: "배관",
    metaLine: "선행 · 8월 24일",
    statusChipHtml: '<span data-real-status="true">진행</span>',
    progressDone: 3,
    progressTotal: 5,
    progressPercent: 60,
    progressNote: "완료: 김작업",
    leaderName: "박반장",
    participantLine: "김작업 · 이작업",
    createdAtLabel: "2026. 8. 24. 09:00",
    toolBadgesHtml: '<div data-real-tools="true">그라인더</div>',
    timelineHtml: '<ol data-real-timeline="true"></ol>',
    detailHtml: '<div data-real-detail="true"></div>',
    canEdit: true,
    mobileDetailOpen: true,
  });
  assert.match(output, /data-work-prep-record-detail="prep-1"/);
  assert.match(output, /data-action="back-work-prep-list"/);
  assert.match(output, /aria-valuenow="60"/);
  assert.match(output, /data-real-tools="true"/);
  assert.match(output, /data-real-timeline="true"/);
  assert.match(output, /data-real-detail="true"/);
  assert.match(output, /data-action="edit-work-prep-record"/);
  assert.match(output, /data-action="delete-work-prep-record"/);
  assert.match(output, /data-work-prep-record-id="prep-1"/);
  assert.match(output, /data-manage-tabs-read-only="true"/);
});

test("푸시 관리는 조회 기본 상태에서 작성·대상·확인·결과 계약을 한 번에 드러낸다", () => {
  const model = {
    subscribedCount: 1,
    workerCount: 2,
    targetCount: 1,
    canEdit: true,
    canSend: false,
    disabledReason: "최종 확인이 필요합니다.",
    sendButtonLabel: "발송",
    draft: { title: "안전 알림", body: "점검 바랍니다.", url: "/check.html", style: "warning" },
    styles: [{ id: "warning", label: "주의", description: "주의가 필요한 알림" }],
    workers: [{ id: "worker-1", name: "김작업", team: "선행", position: "작업자", count: 1, checked: true }],
    preview: { title: "[주의] 안전 알림", body: "점검 바랍니다.", url: "/check.html" },
    urlOptionsHtml: '<option value="/check.html" selected>작업 전 점검</option>',
  };
  const readOnlyHtml = view.renderPushManager(model);
  assert.match(readOnlyHtml, /1 작성/);
  assert.match(readOnlyHtml, /2 대상/);
  assert.match(readOnlyHtml, /3 확인/);
  assert.match(readOnlyHtml, /4 결과/);
  assert.match(readOnlyHtml, /data-action="edit-admin-push"/);
  assert.match(readOnlyHtml, /data-admin-push-field="title"[^>]* disabled/);
  assert.match(readOnlyHtml, /data-action="set-admin-push-style"[^>]* disabled/);
  assert.match(readOnlyHtml, /data-admin-push-worker="worker-1"[^>]* disabled/);
  assert.match(readOnlyHtml, /data-action="send-admin-push" disabled/);
  assert.match(readOnlyHtml, /최종 확인이 필요합니다/);

  const editingHtml = view.renderPushManager({ ...model, editing: true });
  assert.doesNotMatch(editingHtml, /data-admin-push-field="title"[^>]* disabled/);
  assert.doesNotMatch(editingHtml, /data-admin-push-worker="worker-1"[^>]* disabled/);
});

test("안전수칙 설정은 서버 권위·버전·실제 항목을 조회 전용으로 표시한다", () => {
  const output = view.renderSafetySettings({
    sync: {
      authoritativeSource: "서버 게시본",
      publishedVersion: "v3",
      deviceVersion: "v2",
      freshness: "stale",
      lastSyncedAt: "2026. 8. 24. 09:00",
    },
    entries: [{ order: 1, title: "보호구 착용 <필수>", description: "작업 전 확인", status: "게시" }],
    versionHistoryHtml: '<ol data-real-versions="true"></ol>',
  });
  assert.match(output, /id="safetySettingsAuthorityTitle"/);
  assert.match(output, /서버 게시본/);
  assert.match(output, /v3/);
  assert.match(output, /보호구 착용 &lt;필수&gt;/);
  assert.match(output, /data-real-versions="true"/);
  assert.doesNotMatch(output, /data-action="(?:save|publish)-/);
  assert.doesNotMatch(output, /<button[^>]*>\s*(?:저장|게시)/);
});

test("데이터 상태는 임시 수치를 노출하지 않고 재시도 계약을 제공한다", () => {
  const loading = view.renderWorkTypes({
    dataState: "loading",
    categories: [{ id: "must-hide", label: "숨겨야 함" }],
  });
  assert.match(loading, /data-manage-tabs-state="loading"/);
  assert.doesNotMatch(loading, /숨겨야 함/);

  const stale = view.renderWorkersDevices({
    dataState: "stale",
    retryAction: "retry-workers",
    workers: [{ id: "worker-1", name: "캐시 작업자" }],
  });
  assert.match(stale, /data-action="retry-workers"/);
  assert.match(stale, /캐시 작업자/);
});

test("관리 내부 탭 CSS는 디자인 토큰·44px 터치·모바일 전체화면 계약만 사용한다", () => {
  const css = fs.readFileSync(path.join(ROOT, "assets/css/30-feature-manage-tabs-v4.css"), "utf8");
  assert.match(css, /var\(--ds-color-navy-950\)/);
  assert.match(css, /var\(--ds-space-16\)/);
  assert.match(css, /min-block-size:\s*max\(44px, var\(--ds-control-height\)\)/);
  assert.match(css, /\.manage-tabs-v4__detail\.is-mobile-fullscreen/);
  assert.match(css, /position:\s*fixed/);
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i);
  assert.doesNotMatch(css, /box-shadow:/);
});
