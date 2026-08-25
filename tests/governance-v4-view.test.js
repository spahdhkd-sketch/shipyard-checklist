const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  renderPushGovernance,
  renderRetentionGovernance,
  renderSafetyGovernance,
} = require("../assets/js/governance-v4-view.js");

function actionTag(html, action) {
  const match = html.match(new RegExp(`<button[^>]*data-action="${action}"[^>]*>`));
  assert.ok(match, `missing action: ${action}`);
  return match[0];
}

test("push flow requires message, targets, and explicit acknowledgment before send", () => {
  const base = {
    state: "ready",
    readOnly: false,
    step: "confirm",
    preflight: {
      counts: { selected: 3, targeted: 2, excluded: 1, recentlySent: 0 },
      preview: { title: "작업 알림", body: "점검을 확인해 주세요.", url: "/" },
      canSend: true,
      acknowledgment: { required: true, accepted: false },
    },
  };

  const blocked = renderPushGovernance(base);
  assert.match(actionTag(blocked, "governance-push-send"), /disabled/);
  assert.match(blocked, /작성[\s\S]*대상[\s\S]*확인[\s\S]*결과/);

  const ready = renderPushGovernance({
    ...base,
    preflight: {
      ...base.preflight,
      acknowledgment: { required: true, accepted: true },
    },
  });
  assert.doesNotMatch(actionTag(ready, "governance-push-send"), /disabled/);

  const readOnly = renderPushGovernance({ ...base, readOnly: true });
  assert.match(actionTag(readOnly, "governance-push-send"), /disabled/);
});

test("safety rules preserve draft-review-publish order and gate publish", () => {
  const snapshot = {
    status: "review",
    metadata: {
      version: "2026.08.4",
      effectiveAt: "2026-08-25T00:00:00.000Z",
      changeSummary: "현장 수칙 갱신",
    },
  };
  const base = {
    state: "ready",
    readOnly: false,
    snapshot,
    versions: [{ version: "2026.08.3", effectiveAt: "2026-08-20" }],
    selectedVersion: "2026.08.3",
    publishDialogOpen: true,
  };

  const blocked = renderSafetyGovernance(base);
  assert.match(actionTag(blocked, "governance-safety-publish"), /disabled/);
  assert.match(actionTag(blocked, "governance-safety-request-review"), /disabled/);
  assert.match(blocked, /<dialog[^>]*data-governance-dialog="publish"[^>]*open/);

  const ready = renderSafetyGovernance({ ...base, publishAcknowledged: true });
  assert.doesNotMatch(actionTag(ready, "governance-safety-publish"), /disabled/);
});

test("version rollback is represented only as a new draft", () => {
  const html = renderSafetyGovernance({
    state: "ready",
    readOnly: false,
    snapshot: {
      status: "published",
      metadata: { version: "2026.08.4", effectiveAt: "2026-08-25", changeSummary: "현행" },
    },
    versions: [{ version: "2026.08.3", effectiveAt: "2026-08-20" }],
    selectedVersion: "2026.08.3",
    rollbackAcknowledged: true,
    compareRows: [{ label: "서약 갱신", current: "매일", selected: "매주" }],
  });

  assert.doesNotMatch(actionTag(html, "governance-safety-create-rollback-draft"), /disabled/);
  assert.match(html, /복구 초안 만들기/);
  assert.doesNotMatch(html, /즉시 복구|바로 적용/);
});

test("archive and restore require reason, matching expected count, and acknowledgment", () => {
  const base = {
    state: "ready",
    readOnly: false,
    action: "archive",
    resourceType: "work_records",
    resourceLabel: "작업 기록",
    affectedCount: 3,
    reason: "중복 등록 기록 정리",
    confirmedAffectedCount: 2,
    acknowledged: true,
    confirmationOpen: true,
  };

  const mismatch = renderRetentionGovernance(base);
  assert.match(actionTag(mismatch, "governance-retention-open-confirmation"), /disabled/);
  assert.match(actionTag(mismatch, "governance-retention-confirm"), /disabled/);

  const ready = renderRetentionGovernance({ ...base, confirmedAffectedCount: 3 });
  assert.doesNotMatch(actionTag(ready, "governance-retention-open-confirmation"), /disabled/);
  assert.doesNotMatch(actionTag(ready, "governance-retention-confirm"), /disabled/);
  assert.match(ready, /<dialog[^>]*data-governance-dialog="retention"[^>]*open/);

  const readOnly = renderRetentionGovernance({ ...base, readOnly: true, confirmedAffectedCount: 3 });
  assert.match(actionTag(readOnly, "governance-retention-confirm"), /disabled/);
});

test("governance surfaces render loading, error, empty, stale, and offline safely", () => {
  const renderers = [renderPushGovernance, renderSafetyGovernance, renderRetentionGovernance];
  ["loading", "error", "empty", "stale", "offline"].forEach((state) => {
    renderers.forEach((render) => {
      const html = render({ state, readOnly: false });
      assert.match(html, new RegExp(`data-state="${state}"`));
      if (["loading", "error", "empty"].includes(state)) {
        assert.match(html, /role="(?:status|alert)"/);
      }
    });
  });

  const stalePush = renderPushGovernance({ state: "stale", readOnly: false, step: "confirm" });
  assert.match(actionTag(stalePush, "governance-push-send"), /disabled/);
  const offlineRetention = renderRetentionGovernance({ state: "offline", readOnly: false });
  assert.match(actionTag(offlineRetention, "governance-retention-confirm"), /disabled/);
});

test("renderer exposes audit history without a hard-delete control", () => {
  const html = renderRetentionGovernance({
    state: "ready",
    auditEntries: [{ action: "보관", at: "2026-08-24 10:00", reason: "중복 기록" }],
  });
  const source = fs.readFileSync(path.join(__dirname, "../assets/js/governance-v4-view.js"), "utf8");

  assert.match(html, /변경 이력/);
  assert.match(html, /중복 기록/);
  assert.doesNotMatch(`${source}\n${html}`, /hard[-_ ]?delete|purge_expired|영구삭제|영구 삭제/i);
});

test("governance CSS uses design tokens and preserves 44px touch targets", () => {
  const css = fs.readFileSync(path.join(__dirname, "../assets/css/30-feature-governance-v4.css"), "utf8");
  assert.match(css, /min-height:\s*var\(--ds-touch-target-min\)/);
  assert.match(css, /var\(--ds-color-navy-950\)/);
  assert.match(css, /var\(--ds-space-24\)/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}|rgba?\(/i);
  assert.doesNotMatch(css, /linear-gradient|radial-gradient|backdrop-filter|transition-all/i);
});
