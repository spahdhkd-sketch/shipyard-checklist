(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.PushRules = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  const DEFAULT_PUSH_NOTIFICATION_TEMPLATES = {
    pledgePending: {
      title: "안전 서약 미완료",
      body: "오늘 작업 전 안전 서약을 완료해주세요.",
    },
    unsafeIssue: {
      title: "불안전요소 등록",
      body: "{호선} · {등록자} · {내용}",
    },
    missingMaterial: {
      title: "누락자재 등록",
      body: "{호선} · {등록자} · {자재} {수량}",
    },
    adminManual: {
      title: "GS 안전 체크리스트 안내",
      body: "현장 안전 알림을 확인해주세요.",
    },
  };

  const ADMIN_PUSH_STYLES = [
    {
      id: "notice",
      label: "안내",
      description: "일반 공지",
      tone: "teal",
      titlePrefix: "",
      requireInteraction: false,
      renotify: true,
      vibrate: [80, 40, 80],
    },
    {
      id: "warning",
      label: "확인 요청",
      description: "확인할 때까지 유지",
      tone: "orange",
      titlePrefix: "[주의] ",
      requireInteraction: true,
      renotify: true,
      vibrate: [120, 60, 120],
    },
    {
      id: "urgent",
      label: "긴급 호출",
      description: "확인 유지 + 강한 진동",
      tone: "red",
      titlePrefix: "[긴급] ",
      requireInteraction: true,
      renotify: true,
      vibrate: [180, 80, 180, 80, 180],
    },
    {
      id: "done",
      label: "처리 완료",
      description: "완료 안내",
      tone: "green",
      titlePrefix: "[확인] ",
      requireInteraction: false,
      renotify: false,
      vibrate: [80],
    },
  ];

  function normalizePushTemplateKind(kind) {
    return Object.prototype.hasOwnProperty.call(DEFAULT_PUSH_NOTIFICATION_TEMPLATES, kind) ? kind : "";
  }

  function normalizePushTemplate(template, fallback) {
    const source = template && typeof template === "object" ? template : {};
    const title = String(source.title || "").trim() || fallback.title;
    const body = String(source.body || "").trim() || fallback.body;
    return { title, body };
  }

  function replacePushTemplateTokens(text, context = {}) {
    return String(text || "").replace(/\{([^{}]+)\}/g, (match, key) => {
      const value = context[String(key || "").trim()];
      return value === undefined || value === null || value === "" ? match : String(value);
    });
  }

  // templates: 저장소에서 읽어 정규화한 푸시 문구 맵 (app-v2의 pushNotificationTemplates() 결과 주입)
  function pushNotificationFromTemplate(kind, context = {}, templates = {}) {
    const templateKind = normalizePushTemplateKind(kind);
    const fallback = DEFAULT_PUSH_NOTIFICATION_TEMPLATES[templateKind] || { title: "", body: "" };
    const template = (templates && typeof templates === "object" && templates[templateKind]) || { title: "", body: "" };
    return {
      title: replacePushTemplateTokens(template.title, context).trim() || fallback.title,
      body: replacePushTemplateTokens(template.body, context).trim() || fallback.body,
    };
  }

  // preview: { todayLabel, pledgePendingCount, senderName } — 호출 측에서 상태 기반 값을 주입한다.
  function pushTemplateMeta(kind, preview = {}) {
    const source = preview && typeof preview === "object" ? preview : {};
    const meta = {
      pledgePending: {
        heading: "미완료자 알림 푸시 문구",
        description: "오늘 서약 현황에서 상태가 미완료인 작업자에게 발송됩니다.",
        tokens: ["{날짜}", "{인원}"],
        previewContext: { 날짜: source.todayLabel || "", 인원: source.pledgePendingCount || 1 },
      },
      unsafeIssue: {
        heading: "불안전요소 푸시 문구",
        description: "불안전요소가 등록되면 작업자 관리에서 알림 대상으로 지정한 작업자에게 발송됩니다.",
        tokens: ["{호선}", "{등록자}", "{내용}"],
        previewContext: { 호선: "호선 101", 등록자: "김준혁", 내용: "가스 호스 정리 필요" },
      },
      missingMaterial: {
        heading: "누락자재 푸시 문구",
        description: "누락자재가 등록되면 작업자 관리에서 알림 대상으로 지정한 작업자에게 발송됩니다.",
        tokens: ["{호선}", "{등록자}", "{자재}", "{수량}"],
        previewContext: {
          호선: "호선 101",
          등록자: "김준혁",
          자재: "밸브",
          수량: "2 EA",
        },
      },
      adminManual: {
        heading: "관리자 수동 푸시 문구",
        description: "관리 메뉴의 푸시 탭에서 직접 선택한 작업자에게 즉시 발송됩니다.",
        tokens: ["{날짜}", "{발신자}", "{대상수}"],
        previewContext: { 날짜: source.todayLabel || "", 발신자: source.senderName || "관리자", 대상수: 1 },
      },
    };
    return meta[normalizePushTemplateKind(kind)] || null;
  }

  // checkedAt: 호출 측 서버 시각(serverNow().toISOString()) 주입
  function normalizeWorkerPushSubscriptionStatus(workerId, row, checkedAt) {
    const source = row && typeof row === "object" ? row : {};
    return {
      workerId: String(source.workerId || source.worker_id || workerId || "").trim(),
      registered: Boolean(source.registered),
      subscriptionCount: Number(source.subscriptionCount || source.subscription_count || 0),
      checkedAt: String(checkedAt || ""),
    };
  }

  function normalizeWorkerPushDevice(row) {
    const source = row && typeof row === "object" ? row : {};
    return {
      id: String(source.id || "").trim(),
      workerId: String(source.workerId || source.worker_id || "").trim(),
      deviceLabel: String(source.deviceLabel || source.device_label || "알림 기기").trim() || "알림 기기",
      userAgent: String(source.userAgent || source.user_agent || "").trim(),
      enabled: source.enabled !== false,
      lastSeenAt: source.lastSeenAt || source.last_seen_at || "",
      lastSentAt: source.lastSentAt || source.last_sent_at || "",
      lastError: String(source.lastError || source.last_error || "").trim(),
      lastErrorAt: source.lastErrorAt || source.last_error_at || "",
      updatedAt: source.updatedAt || source.updated_at || "",
    };
  }

  function normalizeAdminPushTargetMode(value) {
    return "selected";
  }

  function normalizeAdminPushWorkerIds(value) {
    return [...new Set((Array.isArray(value) ? value : [])
      .map((id) => String(id || "").trim())
      .filter(Boolean))];
  }

  function adminPushStyleMeta(styleId) {
    return ADMIN_PUSH_STYLES.find((style) => style.id === styleId) || ADMIN_PUSH_STYLES[0];
  }

  function createAdminPushDraft(overrides = {}) {
    const source = overrides && typeof overrides === "object" ? overrides : {};
    const fallback = DEFAULT_PUSH_NOTIFICATION_TEMPLATES.adminManual;
    const style = adminPushStyleMeta(source.style);
    return {
      targetMode: "selected",
      selectedWorkerIds: normalizeAdminPushWorkerIds(source.selectedWorkerIds),
      title: String(source.title || "").trim() || fallback.title,
      body: String(source.body || "").trim() || fallback.body,
      url: String(source.url || "").trim() || "/index.html",
      style: style.id,
    };
  }

  function workerPushDeviceBrowserLabel(userAgent) {
    const ua = String(userAgent || "");
    if (/Whale/i.test(ua)) return "웨일";
    if (/Edg\//i.test(ua)) return "Edge";
    if (/Chrome/i.test(ua)) return "Chrome";
    if (/Safari/i.test(ua)) return "Safari";
    return "브라우저";
  }

  function workerPushDevicePlatformLabel(userAgent) {
    const ua = String(userAgent || "");
    if (/Android/i.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
    if (/Windows/i.test(ua)) return "Windows";
    if (/Macintosh|Mac OS/i.test(ua)) return "macOS";
    return "기기";
  }

  // status: workerPushSubscriptionStatusFor(workerId) 결과, checking: 상태 확인 중 여부 주입
  function workerPushSubscriptionBadgeMeta(status, checking) {
    const source = status && typeof status === "object" ? status : {};
    const checked = Boolean(source.checkedAt);
    const count = Number(source.subscriptionCount || 0);
    if (checking && !checked) {
      return {
        className: "is-checking",
        text: "알림 확인 중",
        title: "서버 알림 등록 상태를 확인하고 있습니다",
      };
    }
    if (source.registered) {
      const registeredCount = count || 1;
      return {
        className: "is-registered",
        text: `알림 ${registeredCount}대`,
        title: `서버에 등록된 브라우저 알림 ${registeredCount}건`,
      };
    }
    if (checked) {
      return {
        className: "is-empty",
        text: "알림 없음",
        title: "서버에 등록된 브라우저 알림이 없습니다",
      };
    }
    return {
      className: "is-unknown",
      text: "알림 확인 전",
      title: "아직 서버 알림 등록 상태를 확인하지 않았습니다",
    };
  }

  return {
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
  };
});
