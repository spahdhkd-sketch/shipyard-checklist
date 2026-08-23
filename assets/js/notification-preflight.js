(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.NotificationPreflight = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  function cleanText(value, max) {
    return String(value || "").trim().slice(0, max);
  }

  function normalizeNotificationPreview(value) {
    const input = value && typeof value === "object" ? value : {};
    const rawUrl = cleanText(input.url, 240);
    return {
      title: cleanText(input.title, 80),
      body: cleanText(input.body, 220),
      url: /^\/(?!\/)/.test(rawUrl) || /^https:\/\//i.test(rawUrl) ? rawUrl : "/",
    };
  }

  function normalizeRecipient(value) {
    const input = value && typeof value === "object" ? value : {};
    const subscriptionCount = Math.max(0, Number(input.subscriptionCount || input.subscription_count || 0) || 0);
    return {
      ...input,
      id: cleanText(input.id || input.workerId || input.worker_id, 80),
      eligible: input.eligible !== false,
      exclusionReason: cleanText(input.exclusionReason || input.exclusion_reason, 80),
      subscriptionCount,
      registered: input.registered === true || subscriptionCount > 0,
      lastSentAt: cleanText(input.lastSentAt || input.last_sent_at, 80),
    };
  }

  function wasRecentlySent(recipient, now, cooldownMs) {
    const sentAt = Date.parse(recipient.lastSentAt);
    return Number.isFinite(sentAt) && sentAt <= now && now - sentAt < cooldownMs;
  }

  function buildNotificationPreflight(options = {}) {
    const recipients = (Array.isArray(options.recipients) ? options.recipients : [])
      .map(normalizeRecipient)
      .filter((recipient) => recipient.id);
    const byId = new Map(recipients.map((recipient) => [recipient.id, recipient]));
    const selectedIds = [...new Set((Array.isArray(options.selectedWorkerIds) ? options.selectedWorkerIds : [])
      .map((id) => cleanText(id, 80))
      .filter(Boolean))];
    const now = Number.isFinite(Number(options.now)) ? Number(options.now) : Date.now();
    const cooldownMs = Math.max(0, Number(options.cooldownMs) || 0);
    const selected = selectedIds.map((id) => byId.get(id) || { id, eligible: false, registered: false, subscriptionCount: 0 });
    const eligible = [];
    const targeted = [];
    const excluded = [];
    const recentlySent = [];
    const unregistered = [];

    selectedIds.forEach((id) => {
      const recipient = byId.get(id);
      if (!recipient) {
        excluded.push({ id, reason: "not_found" });
        return;
      }
      if (!recipient.eligible) {
        excluded.push({ ...recipient, reason: recipient.exclusionReason || "ineligible" });
        return;
      }
      eligible.push(recipient);
      if (wasRecentlySent(recipient, now, cooldownMs)) {
        recentlySent.push(recipient);
      } else if (!recipient.registered) {
        unregistered.push(recipient);
      } else {
        targeted.push(recipient);
      }
    });

    const preview = normalizeNotificationPreview(options.message);
    const acknowledgment = {
      required: options.requireAcknowledgment !== false,
      accepted: options.acknowledged === true,
    };
    let disabledReason = "";
    if (!preview.title || !preview.body) disabledReason = "message_required";
    else if (!targeted.length) disabledReason = "no_eligible_targets";
    else if (acknowledgment.required && !acknowledgment.accepted) disabledReason = "acknowledgment_required";

    return {
      selectedWorkerIds: selectedIds,
      selected,
      eligible,
      targeted,
      excluded,
      recentlySent,
      unregistered,
      counts: {
        selected: selectedIds.length,
        eligible: eligible.length,
        targeted: targeted.length,
        excluded: excluded.length,
        recentlySent: recentlySent.length,
        unregistered: unregistered.length,
      },
      preview,
      acknowledgment,
      canSend: !disabledReason,
      disabledReason,
    };
  }

  return {
    buildNotificationPreflight,
    normalizeNotificationPreview,
  };
});
