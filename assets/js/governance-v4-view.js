(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.GovernanceV4View = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  "use strict";

  const SURFACE_STATES = new Set(["ready", "loading", "error", "empty", "stale", "offline"]);
  const PUSH_STEPS = ["compose", "targets", "confirm", "result"];

  function escapeHtml(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function cleanText(value) {
    return String(value === undefined || value === null ? "" : value).trim();
  }

  function numberOrZero(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? Math.floor(number) : 0;
  }

  function surfaceState(value) {
    return SURFACE_STATES.has(value) ? value : "ready";
  }

  function renderBlockingState(state, options = {}) {
    if (!["loading", "error", "empty"].includes(state)) return "";
    const copy = {
      loading: ["불러오는 중", "확정되지 않은 수치와 작업 버튼은 표시하지 않습니다."],
      error: ["정보를 불러오지 못했습니다", "다시 불러온 뒤 작업을 진행해 주세요."],
      empty: ["표시할 정보가 없습니다", options.emptyMessage || "먼저 필요한 데이터를 준비해 주세요."],
    }[state];
    const action = state === "error"
      ? '<button type="button" class="governance-v4__button" data-action="governance-retry">다시 불러오기</button>'
      : "";
    return `<div class="governance-v4__state" role="${state === "error" ? "alert" : "status"}" aria-live="polite">
      <strong>${copy[0]}</strong>
      <p>${escapeHtml(copy[1])}</p>
      ${action}
    </div>`;
  }

  function renderFreshness(state) {
    if (state === "stale") {
      return '<p class="governance-v4__notice" role="status"><strong>이전 정보</strong> 마지막으로 확인된 내용을 표시합니다. 새로고침 전에는 변경할 수 없습니다.</p>';
    }
    if (state === "offline") {
      return '<p class="governance-v4__notice" role="status"><strong>오프라인</strong> 조회만 가능합니다. 연결을 확인한 뒤 다시 시도해 주세요.</p>';
    }
    return "";
  }

  function renderSteps(activeStep) {
    const labels = ["작성", "대상", "확인", "결과"];
    const currentIndex = PUSH_STEPS.indexOf(activeStep);
    return `<ol class="governance-v4__steps" aria-label="푸시 발송 단계">
      ${labels.map((label, index) => {
        const state = index === currentIndex ? "current" : index < currentIndex ? "complete" : "upcoming";
        return `<li data-step-state="${state}"${state === "current" ? ' aria-current="step"' : ""}>
          <span aria-hidden="true">${index + 1}</span><strong>${label}</strong>
        </li>`;
      }).join("")}
    </ol>`;
  }

  function renderPushCompose(model, locked) {
    const message = model.message || {};
    const complete = Boolean(cleanText(message.title) && cleanText(message.body));
    return `<form class="governance-v4__form" data-governance-form="push-compose">
      <label>제목
        <input name="pushTitle" maxlength="80" value="${escapeHtml(message.title)}" ${locked ? "readonly" : ""}>
      </label>
      <label>내용
        <textarea name="pushBody" maxlength="220" ${locked ? "readonly" : ""}>${escapeHtml(message.body)}</textarea>
      </label>
      <label>연결 경로
        <input name="pushUrl" inputmode="url" value="${escapeHtml(message.url || "/")}" ${locked ? "readonly" : ""}>
      </label>
      <div class="governance-v4__actions">
        <button type="button" class="governance-v4__button governance-v4__button--primary" data-action="governance-push-next" data-next-step="targets" ${locked || !complete ? "disabled" : ""}>대상 선택으로</button>
      </div>
    </form>`;
  }

  function renderPushTargets(model, locked) {
    const recipients = Array.isArray(model.recipients) ? model.recipients : [];
    const counts = model.preflight && model.preflight.counts || {};
    const hasTargets = numberOrZero(counts.targeted) > 0;
    return `<div class="governance-v4__flow-panel">
      <dl class="governance-v4__summary">
        <div><dt>선택</dt><dd>${numberOrZero(counts.selected)}명</dd></div>
        <div><dt>발송 가능</dt><dd>${numberOrZero(counts.targeted)}명</dd></div>
        <div><dt>제외</dt><dd>${numberOrZero(counts.excluded)}명</dd></div>
        <div><dt>최근 발송</dt><dd>${numberOrZero(counts.recentlySent)}명</dd></div>
      </dl>
      <fieldset ${locked ? "disabled" : ""}>
        <legend>작업자 선택</legend>
        <div class="governance-v4__check-list">
          ${recipients.length ? recipients.map((recipient) => `<label>
            <input type="checkbox" name="pushRecipient" value="${escapeHtml(recipient.id)}" ${recipient.selected ? "checked" : ""} ${recipient.eligible === false ? "disabled" : ""}>
            <span><strong>${escapeHtml(recipient.label || recipient.id)}</strong>${recipient.reason ? `<small>${escapeHtml(recipient.reason)}</small>` : ""}</span>
          </label>`).join("") : '<p class="governance-v4__empty-row">선택할 수 있는 작업자가 없습니다.</p>'}
        </div>
      </fieldset>
      <div class="governance-v4__actions governance-v4__actions--split">
        <button type="button" class="governance-v4__button" data-action="governance-push-back" data-next-step="compose">작성으로</button>
        <button type="button" class="governance-v4__button governance-v4__button--primary" data-action="governance-push-next" data-next-step="confirm" ${locked || !hasTargets ? "disabled" : ""}>발송 내용 확인</button>
      </div>
    </div>`;
  }

  function renderPushConfirm(model, locked) {
    const preflight = model.preflight || {};
    const preview = preflight.preview || model.message || {};
    const acknowledgment = preflight.acknowledgment || {};
    const canSend = !locked && preflight.canSend === true && acknowledgment.accepted === true;
    return `<div class="governance-v4__flow-panel">
      <section class="governance-v4__preview" aria-labelledby="governance-push-preview-title">
        <h3 id="governance-push-preview-title">발송 내용</h3>
        <dl>
          <div><dt>제목</dt><dd>${escapeHtml(preview.title) || "—"}</dd></div>
          <div><dt>내용</dt><dd>${escapeHtml(preview.body) || "—"}</dd></div>
          <div><dt>대상</dt><dd>${numberOrZero(preflight.counts && preflight.counts.targeted)}명</dd></div>
        </dl>
      </section>
      <label class="governance-v4__acknowledgment">
        <input type="checkbox" name="pushAcknowledged" ${acknowledgment.accepted ? "checked" : ""} ${locked ? "disabled" : ""}>
        <span>발송 내용과 실제 수신 대상을 확인했습니다.</span>
      </label>
      <p class="governance-v4__disabled-reason" aria-live="polite">${canSend ? "발송할 수 있습니다." : "확인 체크와 발송 가능 대상을 모두 확인해야 합니다."}</p>
      <div class="governance-v4__actions governance-v4__actions--split">
        <button type="button" class="governance-v4__button" data-action="governance-push-back" data-next-step="targets">대상으로</button>
        <button type="button" class="governance-v4__button governance-v4__button--danger" data-action="governance-push-send" ${canSend ? "" : "disabled"}>푸시 발송 요청</button>
      </div>
    </div>`;
  }

  function renderPushResult(model) {
    const result = model.result || {};
    const succeeded = numberOrZero(result.succeeded);
    const failed = numberOrZero(result.failed);
    return `<div class="governance-v4__flow-panel" role="status" aria-live="polite">
      <h3>발송 결과</h3>
      <dl class="governance-v4__summary">
        <div><dt>성공</dt><dd>${succeeded}건</dd></div>
        <div><dt>실패</dt><dd>${failed}건</dd></div>
      </dl>
      ${result.message ? `<p>${escapeHtml(result.message)}</p>` : ""}
      <div class="governance-v4__actions">
        <button type="button" class="governance-v4__button" data-action="governance-push-reset">새 발송 작성</button>
      </div>
    </div>`;
  }

  function renderPushGovernance(input = {}) {
    const state = surfaceState(input.state);
    const blocked = renderBlockingState(state, { emptyMessage: "발송 대상 또는 메시지 정보가 없습니다." });
    const readOnly = input.readOnly !== false;
    const locked = readOnly || state !== "ready";
    const step = PUSH_STEPS.includes(input.step) ? input.step : "compose";
    const panels = {
      compose: renderPushCompose,
      targets: renderPushTargets,
      confirm: renderPushConfirm,
      result: renderPushResult,
    };
    return `<section class="governance-v4 governance-v4--push" data-governance-surface="push" data-state="${state}" aria-labelledby="governance-push-title">
      <header class="governance-v4__header">
        <div><h2 id="governance-push-title">푸시 발송</h2><p>작성한 내용과 실제 수신 대상을 확인한 뒤 발송합니다.</p></div>
        <span class="governance-v4__mode">${readOnly ? "조회 모드" : "작성 모드"}</span>
      </header>
      ${renderFreshness(state)}
      ${blocked || `${renderSteps(step)}${panels[step](input, locked)}`}
    </section>`;
  }

  function renderVersionList(versions, selectedVersion) {
    if (!versions.length) return '<p class="governance-v4__empty-row">비교할 게시 버전이 없습니다.</p>';
    return `<div class="governance-v4__version-list" role="list">
      ${versions.map((version) => `<button type="button" role="listitem" data-action="governance-safety-select-version" data-version="${escapeHtml(version.version)}" ${version.version === selectedVersion ? 'aria-current="true"' : ""}>
        <strong>${escapeHtml(version.version)}</strong>
        <span>${escapeHtml(version.effectiveAt || "적용일 미정")}</span>
      </button>`).join("")}
    </div>`;
  }

  function renderSafetyGovernance(input = {}) {
    const state = surfaceState(input.state);
    const blocked = renderBlockingState(state, { emptyMessage: "작성된 안전수칙 버전이 없습니다." });
    const readOnly = input.readOnly !== false;
    const locked = readOnly || state !== "ready";
    const snapshot = input.snapshot || {};
    const metadata = snapshot.metadata || {};
    const lifecycle = ["draft", "review", "published"].includes(snapshot.status) ? snapshot.status : "draft";
    const versions = Array.isArray(input.versions) ? input.versions : [];
    const selectedVersion = cleanText(input.selectedVersion);
    const compare = Array.isArray(input.compareRows) ? input.compareRows : [];
    const canRequestReview = !locked && lifecycle === "draft";
    const canPublish = !locked && lifecycle === "review" && input.publishAcknowledged === true;
    const rollbackTarget = versions.find((version) => version.version === selectedVersion);
    const canCreateRollbackDraft = !locked
      && lifecycle === "published"
      && Boolean(rollbackTarget)
      && selectedVersion !== metadata.version
      && input.rollbackAcknowledged === true;
    return `<section class="governance-v4 governance-v4--safety" data-governance-surface="safety-rules" data-state="${state}" aria-labelledby="governance-safety-title">
      <header class="governance-v4__header">
        <div><h2 id="governance-safety-title">안전수칙 설정</h2><p>초안 작성, 검토, 게시 순서로 적용 이력을 남깁니다.</p></div>
        <span class="governance-v4__mode">${readOnly ? "조회 모드" : "편집 모드"}</span>
      </header>
      ${renderFreshness(state)}
      ${blocked || `<div class="governance-v4__safety-layout">
        <section class="governance-v4__section" aria-labelledby="governance-current-version-title">
          <h3 id="governance-current-version-title">현재 작업본</h3>
          <dl class="governance-v4__detail-list">
            <div><dt>버전</dt><dd>${escapeHtml(metadata.version) || "—"}</dd></div>
            <div><dt>상태</dt><dd>${lifecycle === "draft" ? "초안" : lifecycle === "review" ? "검토 중" : "게시됨"}</dd></div>
            <div><dt>적용 시각</dt><dd>${escapeHtml(metadata.effectiveAt) || "—"}</dd></div>
            <div><dt>변경 사유</dt><dd>${escapeHtml(metadata.changeSummary) || "—"}</dd></div>
          </dl>
          <div class="governance-v4__actions">
            <button type="button" class="governance-v4__button" data-action="governance-safety-request-review" ${canRequestReview ? "" : "disabled"}>검토 요청</button>
            <button type="button" class="governance-v4__button governance-v4__button--primary" data-action="governance-safety-open-publish" ${!locked && lifecycle === "review" ? "" : "disabled"}>게시 확인</button>
          </div>
        </section>
        <section class="governance-v4__section" aria-labelledby="governance-version-history-title">
          <h3 id="governance-version-history-title">버전 이력</h3>
          ${renderVersionList(versions, selectedVersion)}
        </section>
        <section class="governance-v4__section governance-v4__section--compare" aria-labelledby="governance-version-compare-title">
          <h3 id="governance-version-compare-title">버전 비교</h3>
          ${selectedVersion ? `<p>현재 ${escapeHtml(metadata.version)}과 ${escapeHtml(selectedVersion)}의 차이입니다.</p>` : ""}
          ${compare.length ? `<table><thead><tr><th scope="col">항목</th><th scope="col">현재</th><th scope="col">선택 버전</th></tr></thead><tbody>${compare.map((row) => `<tr><th scope="row">${escapeHtml(row.label)}</th><td>${escapeHtml(row.current)}</td><td>${escapeHtml(row.selected)}</td></tr>`).join("")}</tbody></table>` : '<p class="governance-v4__empty-row">비교할 버전을 선택해 주세요.</p>'}
          <label class="governance-v4__acknowledgment">
            <input type="checkbox" name="rollbackAcknowledged" ${input.rollbackAcknowledged ? "checked" : ""} ${locked ? "disabled" : ""}>
            <span>선택한 버전으로 새 복구 초안을 만드는 것을 확인했습니다.</span>
          </label>
          <button type="button" class="governance-v4__button" data-action="governance-safety-create-rollback-draft" ${canCreateRollbackDraft ? "" : "disabled"}>복구 초안 만들기</button>
        </section>
      </div>
      <dialog class="governance-v4__dialog" data-governance-dialog="publish" ${input.publishDialogOpen ? "open" : ""} aria-labelledby="governance-publish-dialog-title">
        <form method="dialog">
          <h3 id="governance-publish-dialog-title">안전수칙 게시 확인</h3>
          <p>게시하면 지정한 적용 시각부터 현장 기준으로 사용됩니다.</p>
          <label class="governance-v4__acknowledgment">
            <input type="checkbox" name="publishAcknowledged" ${input.publishAcknowledged ? "checked" : ""} ${locked ? "disabled" : ""}>
            <span>버전, 적용 시각, 변경 사유를 확인했습니다.</span>
          </label>
          <div class="governance-v4__actions governance-v4__actions--split">
            <button type="submit" class="governance-v4__button" value="cancel">취소</button>
            <button type="button" class="governance-v4__button governance-v4__button--danger" data-action="governance-safety-publish" ${canPublish ? "" : "disabled"}>게시 요청</button>
          </div>
        </form>
      </dialog>`}
    </section>`;
  }

  function renderAuditHistory(entries) {
    if (!entries.length) return '<p class="governance-v4__empty-row">기록된 변경 이력이 없습니다.</p>';
    return `<ol class="governance-v4__audit-list">
      ${entries.map((entry) => `<li>
        <strong>${escapeHtml(entry.action || "변경")}</strong>
        <span>${escapeHtml(entry.at || "시각 미확인")}</span>
        ${entry.reason ? `<p>${escapeHtml(entry.reason)}</p>` : ""}
      </li>`).join("")}
    </ol>`;
  }

  function renderRetentionGovernance(input = {}) {
    const state = surfaceState(input.state);
    const blocked = renderBlockingState(state, { emptyMessage: "보관 또는 복구할 기록이 없습니다." });
    const readOnly = input.readOnly !== false;
    const locked = readOnly || state !== "ready";
    const action = input.action === "restore" ? "restore" : "archive";
    const actionLabel = action === "archive" ? "보관" : "복구";
    const affectedCount = numberOrZero(input.affectedCount);
    const confirmedCount = numberOrZero(input.confirmedAffectedCount);
    const reason = cleanText(input.reason);
    const countMatches = affectedCount > 0 && confirmedCount === affectedCount;
    const acknowledged = input.acknowledged === true;
    const canConfirm = !locked && Boolean(reason) && countMatches && acknowledged;
    const auditEntries = Array.isArray(input.auditEntries) ? input.auditEntries : [];
    return `<section class="governance-v4 governance-v4--retention" data-governance-surface="retention" data-state="${state}" aria-labelledby="governance-retention-title">
      <header class="governance-v4__header">
        <div><h2 id="governance-retention-title">기록 보관·복구</h2><p>기본은 조회 모드이며, 대상 건수와 사유를 확인한 요청만 처리합니다.</p></div>
        <span class="governance-v4__mode">${readOnly ? "조회 모드" : "변경 모드"}</span>
      </header>
      ${renderFreshness(state)}
      ${blocked || `<div class="governance-v4__retention-layout">
        <form class="governance-v4__form" data-governance-form="retention-confirmation">
          <fieldset ${locked ? "disabled" : ""}>
            <legend>작업 선택</legend>
            <label><input type="radio" name="retentionAction" value="archive" ${action === "archive" ? "checked" : ""}> 보관</label>
            <label><input type="radio" name="retentionAction" value="restore" ${action === "restore" ? "checked" : ""}> 복구</label>
          </fieldset>
          <dl class="governance-v4__detail-list">
            <div><dt>대상 유형</dt><dd>${escapeHtml(input.resourceLabel || input.resourceType) || "—"}</dd></div>
            <div><dt>예상 대상</dt><dd>${affectedCount || "—"}건</dd></div>
          </dl>
          <label>변경 사유
            <textarea name="retentionReason" maxlength="500" ${locked ? "readonly" : ""}>${escapeHtml(reason)}</textarea>
          </label>
          <label>예상 대상 건수 다시 입력
            <input name="confirmedAffectedCount" type="number" min="1" inputmode="numeric" value="${confirmedCount || ""}" ${locked ? "readonly" : ""}>
          </label>
          <label class="governance-v4__acknowledgment">
            <input type="checkbox" name="retentionAcknowledged" ${acknowledged ? "checked" : ""} ${locked ? "disabled" : ""}>
            <span>${affectedCount || 0}건에 ${actionLabel} 요청을 적용하는 것을 확인했습니다.</span>
          </label>
          <p class="governance-v4__disabled-reason" aria-live="polite">${canConfirm ? "최종 확인으로 이동할 수 있습니다." : "사유, 예상 건수, 확인 체크가 모두 필요합니다."}</p>
          <button type="button" class="governance-v4__button governance-v4__button--primary" data-action="governance-retention-open-confirmation" ${canConfirm ? "" : "disabled"}>${actionLabel} 최종 확인</button>
        </form>
        <section class="governance-v4__section" aria-labelledby="governance-audit-title">
          <h3 id="governance-audit-title">변경 이력</h3>
          ${renderAuditHistory(auditEntries)}
        </section>
      </div>
      <dialog class="governance-v4__dialog" data-governance-dialog="retention" ${input.confirmationOpen ? "open" : ""} aria-labelledby="governance-retention-dialog-title">
        <form method="dialog">
          <h3 id="governance-retention-dialog-title">${actionLabel} 요청 확인</h3>
          <p>${escapeHtml(input.resourceLabel || input.resourceType) || "선택 기록"} ${affectedCount}건을 ${actionLabel}하도록 요청합니다.</p>
          <dl class="governance-v4__detail-list">
            <div><dt>사유</dt><dd>${escapeHtml(reason) || "—"}</dd></div>
            <div><dt>확인 건수</dt><dd>${confirmedCount || "—"}건</dd></div>
          </dl>
          <div class="governance-v4__actions governance-v4__actions--split">
            <button type="submit" class="governance-v4__button" value="cancel">취소</button>
            <button type="button" class="governance-v4__button governance-v4__button--danger" data-action="governance-retention-confirm" ${canConfirm ? "" : "disabled"}>${actionLabel} 요청</button>
          </div>
        </form>
      </dialog>`}
    </section>`;
  }

  return {
    renderPushGovernance,
    renderSafetyGovernance,
    renderRetentionGovernance,
  };
});
