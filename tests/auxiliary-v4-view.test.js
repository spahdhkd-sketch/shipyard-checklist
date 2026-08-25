const assert = require("assert");
const fs = require("fs");
const auxiliaryView = require("../assets/js/auxiliary-v4-view.js");

assert.strictEqual(typeof auxiliaryView.renderLoginView, "function");
assert.strictEqual(typeof auxiliaryView.renderCompletionView, "function");
assert.strictEqual(typeof auxiliaryView.renderAuxiliaryState, "function");
assert.match(auxiliaryView.integration.login, /renderLoginView/);
assert.match(auxiliaryView.integration.completion, /factual local and server sync/);

const loginHtml = auxiliaryView.renderLoginView({
  workers: [{ id: "worker-a", name: "<현장 작업자>", team: "1팀", position: "조장" }],
  selectedWorker: "worker-a",
  rememberedWorkerId: "worker-a",
  pickerOpen: true,
  searchQuery: "현장",
});
assert.match(loginHtml, /data-login-form/);
assert.match(loginHtml, /id="loginWorkerId" name="username" autocomplete="username" type="hidden" value="worker-a"/);
assert.match(loginHtml, /id="loginEmployeeNo" type="password" inputmode="text" autocomplete="current-password"/);
assert.match(loginHtml, /data-action="toggle-login-worker-picker"/);
assert.match(loginHtml, /data-login-worker-select="worker-a"/);
assert.match(loginHtml, /data-login-worker-search-item/);
assert.match(loginHtml, /data-action="refresh-workers"/);
assert.match(loginHtml, /&lt;현장 작업자&gt;/);
assert.doesNotMatch(loginHtml, /<현장 작업자>/);
assert.doesNotMatch(loginHtml, /김준혁|X239511/);

const submittingLoginHtml = auxiliaryView.renderLoginView({
  workers: [{ id: "worker-a", name: "작업자" }],
  selectedWorker: "worker-a",
  submitting: true,
});
assert.match(submittingLoginHtml, /data-login-form aria-busy="true"/);
assert.match(submittingLoginHtml, /<fieldset disabled>/);
assert.match(submittingLoginHtml, />확인 중<\/button>/);

const errorStateHtml = auxiliaryView.renderAuxiliaryState({
  state: "error",
  errorLabel: "연결을 확인하세요.",
  retryAction: "refresh-workers",
  provenance: "마지막 확인: 기기 저장본",
});
assert.match(errorStateHtml, /role="alert"/);
assert.match(errorStateHtml, /data-action="refresh-workers"/);
assert.match(errorStateHtml, /마지막 확인: 기기 저장본/);

const offlineStateHtml = auxiliaryView.renderAuxiliaryState({ state: "offline" });
assert.match(offlineStateHtml, /data-auxiliary-state="offline"/);
assert.match(offlineStateHtml, /기기에 저장된 정보를 표시합니다/);

const loadingHtml = auxiliaryView.renderAuxiliaryState({ state: "loading" });
assert.match(loadingHtml, /aria-busy="true"/);
assert.strictEqual((loadingHtml.match(/<span><\/span>/g) || []).length, 3);

const completionHtml = auxiliaryView.renderCompletionView({
  type: "inspection",
  title: "점검이 제출되었습니다",
  message: "기기 저장과 서버 반영 상태를 확인하세요.",
  sync: {
    local: { state: "saved", label: "기기에 저장됨", detail: "기록은 이 기기에 남아 있습니다." },
    server: { state: "retry", label: "서버 재전송 대기", detail: "연결되면 다시 전송합니다.", retryAction: "retry-sync-job", retryLabel: "전송 다시 시도" },
  },
  stats: [{ label: "확인 항목", value: "6" }],
  actions: [{ label: "홈으로", view: "dashboard", primary: true }, { label: "점검 이력", action: "open-history" }],
});
assert.match(completionHtml, /data-completion-type="inspection"/);
assert.match(completionHtml, /data-sync-kind="local" data-sync-state="saved"/);
assert.match(completionHtml, /data-sync-kind="server" data-sync-state="retry"/);
assert.match(completionHtml, /class="auxiliary-v4 auxiliary-v4--completion mobile-complete-screen"/);
assert.match(completionHtml, /data-action="retry-sync-job"/);
assert.match(completionHtml, /data-view="dashboard"/);
assert.match(completionHtml, /data-action="open-history"/);
assert.match(completionHtml, /<dt>확인 항목<\/dt><dd>6<\/dd>/);
assert.doesNotMatch(completionHtml, /v1\.|2026-|홍길동/);

const minimalCompletionHtml = auxiliaryView.renderCompletionView({ title: "제출 완료" });
assert.doesNotMatch(minimalCompletionHtml, /auxiliary-v4__sync/);
assert.doesNotMatch(minimalCompletionHtml, /auxiliary-v4__completion-stats/);

const css = fs.readFileSync("assets/css/30-feature-auxiliary-v4.css", "utf8");
assert.match(css, /var\(--ds-color-navy-950\)/);
assert.match(css, /var\(--ds-color-cream-25\)/);
assert.match(css, /min-height: var\(--ds-touch-target-min\)/);
assert.doesNotMatch(css, /#[0-9A-Fa-f]{3,8}/);
const disallowedEffects = new RegExp([
  ["linear", "gradient"].join("-"),
  ["radial", "gradient"].join("-"),
  ["box", "shadow"].join("-"),
  ["transition", "all"].join("-"),
  "999px",
].join("|"));
assert.doesNotMatch(css, disallowedEffects);
assert.doesNotMatch(css, /border-left:[^;]*(danger|teal|amber)/);

console.log("auxiliary v4 view tests passed");
