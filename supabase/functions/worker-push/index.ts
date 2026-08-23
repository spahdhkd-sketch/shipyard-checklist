import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LEADER_WORKER_POSITION = "조장";
const FOREMAN_WORKER_POSITION = "반장";
const WORKER_PUSH_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const WORKER_PUSH_ATTEMPT_LOCK_MS = 15 * 60 * 1000;
const WORKER_PUSH_MAX_FAILED_ATTEMPTS = 5;
const SEND_IDEMPOTENCY_TTL_MS = 10 * 60 * 1000;
const SEND_IDEMPOTENCY_INFLIGHT_MS = 2 * 60 * 1000;
const encoder = new TextEncoder();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

let vapidConfigured = false;
let vapidConfigPromise: Promise<{ publicKey: string; privateKey: string; subject: string }> | null = null;

async function vaultSecret(name: string) {
  const { data } = await supabase.rpc("get_worker_push_secret", { secret_name: name });
  return typeof data === "string" ? data : "";
}

async function vapidConfig() {
  if (!vapidConfigPromise) {
    vapidConfigPromise = Promise.all([
      Deno.env.get("VAPID_PUBLIC_KEY") || vaultSecret("VAPID_PUBLIC_KEY"),
      Deno.env.get("VAPID_PRIVATE_KEY") || vaultSecret("VAPID_PRIVATE_KEY"),
      Deno.env.get("VAPID_SUBJECT") || vaultSecret("VAPID_SUBJECT"),
    ]).then(([publicKey, privateKey, subject]) => ({
      publicKey,
      privateKey,
      subject: subject || "https://gs-safety-checklist.vercel.app",
    }));
  }
  const config = await vapidConfigPromise;
  if (!vapidConfigured && config.publicKey && config.privateKey) {
    webpush.setVapidDetails(config.subject, config.publicKey, config.privateKey);
    vapidConfigured = true;
  }
  return config;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function cleanText(value: unknown, max = 180) {
  return String(value || "").trim().slice(0, max);
}

function objectValue(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sha256Base64Url(value: string) {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return base64UrlEncode(new Uint8Array(hash));
}

async function sha256Hex(value: string) {
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
  return [...hash].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function normalizeEmployeeNo(value: unknown) {
  return String(value || "").trim();
}

function booleanValue(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizedWorkerIds(values: unknown) {
  return [...new Set((Array.isArray(values) ? values : [])
    .map((value) => cleanText(value, 80))
    .filter(Boolean))];
}

function normalizeIdempotencyKey(value: unknown) {
  const key = String(value || "").trim();
  return /^[A-Za-z0-9][A-Za-z0-9:._-]{7,119}$/.test(key) ? key : "";
}

function resolveSendRecipientIds(
  sendKind: string,
  requestedWorkerIds: unknown,
  activeWorkerIds: unknown,
  policyWorkerIds: unknown,
) {
  const requested = normalizedWorkerIds(requestedWorkerIds);
  const active = new Set(normalizedWorkerIds(activeWorkerIds));
  const policy = normalizedWorkerIds(policyWorkerIds);
  if (sendKind === "missingMaterial" || sendKind === "unsafeIssue") return policy;
  if (sendKind === "pledgePending") {
    const pending = new Set(policy);
    return requested.filter((id) => active.has(id) && pending.has(id));
  }
  return requested.filter((id) => active.has(id));
}

function deliveryAuditCounts(targetWorkerIds: unknown, outcomes: Array<{ workerId: string; outcome: string }>) {
  const targetedIds = normalizedWorkerIds(targetWorkerIds);
  const outcomesByWorker = new Map<string, Set<string>>();
  for (const row of Array.isArray(outcomes) ? outcomes : []) {
    const workerId = cleanText(row?.workerId, 80);
    if (!workerId) continue;
    if (!outcomesByWorker.has(workerId)) outcomesByWorker.set(workerId, new Set());
    outcomesByWorker.get(workerId)?.add(cleanText(row?.outcome, 40));
  }
  const counts = { targeted: targetedIds.length, delivered: 0, unavailable: 0, failed: 0, skipped: 0 };
  for (const workerId of targetedIds) {
    const workerOutcomes = outcomesByWorker.get(workerId) || new Set();
    if (workerOutcomes.has("delivered")) counts.delivered += 1;
    else if (workerOutcomes.has("failed")) counts.failed += 1;
    else if (workerOutcomes.has("skipped")) counts.skipped += 1;
    else counts.unavailable += 1;
  }
  return counts;
}

function canSendPledgeNotifications(worker: Record<string, unknown>) {
  const team = cleanText(worker.team, 40);
  const position = cleanText(worker.position, 40);
  return [LEADER_WORKER_POSITION, FOREMAN_WORKER_POSITION, "관리", "총무"].includes(position) || team === "관리" || team === "총무";
}

async function verifyAdminDeviceSession(payload: Record<string, unknown>, senderWorkerId: string) {
  const session = objectValue(payload.adminSession) || objectValue(payload.mutationSession) || {};
  const token = cleanText(session.token, 4096);
  if (!token) return { error: jsonResponse({ error: "admin_session_required" }, 403) };

  const tokenHash = await sha256Base64Url(token);
  const { data: storedSession, error: sessionError } = await supabase
    .from("admin_mutation_sessions")
    .select("id,worker_id,expires_at,revoked_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();
  if (sessionError) return { error: jsonResponse({ error: "admin_session_lookup_failed" }, 500) };

  const expiresAt = Date.parse(String(storedSession?.expires_at || ""));
  if (!storedSession
    || storedSession.worker_id !== senderWorkerId
    || !Number.isFinite(expiresAt)
    || expiresAt <= Date.now()
    || storedSession.revoked_at) {
    return { error: jsonResponse({ error: "admin_session_invalid" }, 403) };
  }

  const { data: worker, error: workerError } = await supabase
    .from("workers")
    .select("id,team,position,active")
    .eq("id", senderWorkerId)
    .eq("active", true)
    .maybeSingle();
  if (workerError) return { error: jsonResponse({ error: "admin_lookup_failed" }, 500) };
  if (!worker || !canSendPledgeNotifications(worker as Record<string, unknown>)) {
    return { error: jsonResponse({ error: "admin_forbidden" }, 403) };
  }

  const { error: touchError } = await supabase
    .from("admin_mutation_sessions")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", storedSession.id);
  if (touchError) return { error: jsonResponse({ error: "admin_session_touch_failed" }, 500) };
  return { worker };
}

async function beginWorkerPushAttempt(bucketKey: string, workerId: string) {
  const { data, error } = await supabase.rpc("begin_worker_push_attempt", {
    p_bucket_key: bucketKey,
    p_worker_id: workerId,
    p_max_attempts: WORKER_PUSH_MAX_FAILED_ATTEMPTS,
    p_window_seconds: Math.floor(WORKER_PUSH_ATTEMPT_WINDOW_MS / 1000),
    p_lock_seconds: Math.floor(WORKER_PUSH_ATTEMPT_LOCK_MS / 1000),
  });
  if (error) {
    console.error("worker push attempt reservation failed", error);
    return { error: jsonResponse({ error: "worker_push_attempt_reservation_failed" }, 500) };
  }
  const attempt = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | null;
  return attempt?.allowed
    ? {}
    : { error: jsonResponse({ error: "worker_push_rate_limited" }, 429) };
}

async function clearWorkerPushAttempts(bucketKey: string) {
  const { error } = await supabase
    .from("worker_push_attempts")
    .delete()
    .eq("bucket_key", bucketKey);
  if (error) console.error("worker push attempt cleanup failed", error);
}

async function verifyWorkerPushCredential(workerId: string, employeeNo: string, failureCode = "worker_login_failed") {
  const bucketKey = `worker:${workerId}`;
  const attempt = await beginWorkerPushAttempt(bucketKey, workerId);
  if ("error" in attempt) return { error: attempt.error };

  const { data, error } = await supabase
    .from("workers")
    .select("id,name,team,position,active,employee_no")
    .eq("id", workerId)
    .eq("active", true)
    .maybeSingle();

  if (error) return { error: jsonResponse({ error: error.message }, 500) };
  const worker = data as Record<string, unknown> | null;
  if (!worker || normalizeEmployeeNo(worker.employee_no) !== employeeNo) {
    return { error: jsonResponse({ error: failureCode }, 403) };
  }

  await clearWorkerPushAttempts(bucketKey);
  return { worker };
}

function validSubscription(value: unknown) {
  const row = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const keys = row.keys && typeof row.keys === "object" ? row.keys as Record<string, unknown> : {};
  return Boolean(
    typeof row.endpoint === "string" &&
    row.endpoint.startsWith("https://") &&
    typeof keys.p256dh === "string" &&
    typeof keys.auth === "string",
  );
}

function serializeLoginWorker(worker: Record<string, unknown>) {
  return {
    id: cleanText(worker.id, 80),
    name: cleanText(worker.name, 120),
    team: cleanText(worker.team, 40),
    position: cleanText(worker.position, 40),
  };
}

async function verifyWorkerLogin(payload: Record<string, unknown>) {
  const workerId = cleanText(payload.workerId, 80);
  const employeeNo = normalizeEmployeeNo(payload.employeeNo);
  if (!workerId || !employeeNo) return jsonResponse({ error: "invalid_request" }, 400);

  const { worker, error } = await verifyWorkerPushCredential(workerId, employeeNo);
  if (error) return error;
  if (!worker) return jsonResponse({ error: "worker_login_failed" }, 403);
  return jsonResponse({ ok: true, worker: serializeLoginWorker(worker as Record<string, unknown>) });
}

async function registerSubscription(payload: Record<string, unknown>) {
  const workerId = cleanText(payload.workerId, 80);
  const employeeNo = normalizeEmployeeNo(payload.employeeNo);
  const subscription = payload.subscription;
  if (!workerId || !employeeNo || !validSubscription(subscription)) {
    return jsonResponse({ error: "invalid_request" }, 400);
  }

  const { worker, error: workerError } = await verifyWorkerPushCredential(workerId, employeeNo);
  if (workerError) return workerError;

  const sub = subscription as Record<string, unknown>;
  const { error } = await supabase
    .from("worker_push_subscriptions")
    .upsert({
      worker_id: workerId,
      endpoint: sub.endpoint,
      subscription: sub,
      user_agent: cleanText(payload.userAgent, 500),
      device_label: cleanText(payload.deviceLabel, 120),
      enabled: true,
      updated_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      last_error: null,
      last_error_at: null,
    }, { onConflict: "endpoint" });

  if (error) return jsonResponse({ error: error.message }, 500);
  return jsonResponse({ ok: true, workerId, workerName: cleanText(worker?.name, 120) });
}

async function markSubscriptionError(id: string, message: string, disabled = false) {
  const patch: Record<string, unknown> = {
    last_error: message,
    last_error_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  if (disabled) patch.enabled = false;
  await supabase
    .from("worker_push_subscriptions")
    .update(patch)
    .eq("id", id);
}

async function verifiedSender(payload: Record<string, unknown>) {
  const senderWorkerId = cleanText(payload.senderWorkerId, 80);
  const senderEmployeeNo = normalizeEmployeeNo(payload.senderEmployeeNo);
  if (!senderWorkerId || !senderEmployeeNo) {
    return { error: jsonResponse({ error: "sender_required" }, 403) };
  }

  return verifyWorkerPushCredential(senderWorkerId, senderEmployeeNo, "sender_verification_failed");
}

async function authorizeSourceRecord(payload: Record<string, unknown>, sendKind: string, senderWorkerId: string) {
  if (sendKind !== "unsafeIssue" && sendKind !== "missingMaterial") return {};
  const sourceRecordId = cleanText(payload.sourceRecordId, 120);
  if (!sourceRecordId) return { error: jsonResponse({ error: "source_record_required" }, 400) };
  const table = sendKind === "unsafeIssue" ? "unsafe_issues" : "missing_materials";
  const { data, error } = await supabase
    .from(table)
    .select("id,worker_id")
    .eq("id", sourceRecordId)
    .eq("worker_id", senderWorkerId)
    .maybeSingle();
  if (error) return { error: jsonResponse({ error: "source_record_lookup_failed" }, 500) };
  return data
    ? { sourceRecordId }
    : { error: jsonResponse({ error: "source_record_forbidden" }, 403) };
}

async function unsafeTargetWorkerIds() {
  const { data, error } = await supabase
    .from("workers")
    .select("id,unsafe_push_target,active")
    .eq("active", true)
    .eq("unsafe_push_target", true);

  if (error) throw error;
  return new Set((data || [])
    .map((worker) => cleanText(worker.id, 80))
    .filter(Boolean));
}

async function missingMaterialTargetWorkerIds() {
  const { data, error } = await supabase
    .from("workers")
    .select("id,unsafe_push_target,active")
    .eq("active", true)
    .eq("unsafe_push_target", true);

  if (error) throw error;
  return new Set((data || [])
    .map((worker) => cleanText(worker.id, 80))
    .filter(Boolean));
}

async function activeWorkerIds(workerIds: string[]) {
  if (!workerIds.length) return new Set<string>();
  const { data, error } = await supabase
    .from("workers")
    .select("id")
    .in("id", workerIds)
    .eq("active", true);
  if (error) throw error;
  return new Set(normalizedWorkerIds((data || []).map((worker) => worker.id)));
}

function seoulDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function pendingPledgeWorkerIds(workerIds: string[]) {
  if (!workerIds.length) return new Set<string>();
  const activeIds = await activeWorkerIds(workerIds);
  if (!activeIds.size) return activeIds;
  const { data, error } = await supabase
    .from("safety_inspections")
    .select("worker_id,work_prep_worker_id,safety_pledge")
    .eq("date", seoulDate());
  if (error) throw error;
  const completedIds = new Set((data || [])
    .filter((inspection) => cleanText(inspection.safety_pledge, 4000))
    .map((inspection) => cleanText(inspection.worker_id || inspection.work_prep_worker_id, 80))
    .filter(Boolean));
  return new Set([...activeIds].filter((id) => !completedIds.has(id)));
}

async function resolveSendWorkerIds(sendKind: string, requestedWorkerIds: string[]) {
  if (sendKind === "unsafeIssue") {
    const policyIds = [...await unsafeTargetWorkerIds()];
    return resolveSendRecipientIds(sendKind, requestedWorkerIds, [], policyIds);
  }
  if (sendKind === "missingMaterial") {
    const policyIds = [...await missingMaterialTargetWorkerIds()];
    return resolveSendRecipientIds(sendKind, requestedWorkerIds, [], policyIds);
  }
  const activeIds = [...await activeWorkerIds(requestedWorkerIds)];
  if (sendKind === "pledgePending") {
    const pendingIds = [...await pendingPledgeWorkerIds(requestedWorkerIds)];
    return resolveSendRecipientIds(sendKind, requestedWorkerIds, activeIds, pendingIds);
  }
  return resolveSendRecipientIds(sendKind, requestedWorkerIds, activeIds, []);
}

async function workerPushDeliveryFingerprint(input: {
  sendKind: string;
  sourceRecordId: string;
  workerIds: string[];
  notification: Record<string, unknown>;
}) {
  return sha256Hex(JSON.stringify({
    sendKind: input.sendKind,
    sourceRecordId: input.sourceRecordId,
    workerIds: [...input.workerIds].sort(),
    notification: input.notification,
  }));
}

async function reserveWorkerPushDelivery(
  senderWorkerId: string,
  sendKind: string,
  idempotencyKey: string,
  targetFingerprint: string,
) {
  const { data, error } = await supabase.rpc("reserve_worker_push_delivery", {
    p_sender_worker_id: senderWorkerId,
    p_send_kind: sendKind,
    p_idempotency_key: idempotencyKey,
    p_target_fingerprint: targetFingerprint,
    p_ttl_seconds: Math.floor(SEND_IDEMPOTENCY_TTL_MS / 1000),
    p_inflight_seconds: Math.floor(SEND_IDEMPOTENCY_INFLIGHT_MS / 1000),
  });
  if (error) return { error: jsonResponse({ error: "worker_push_reservation_failed" }, 500) };
  const reservation = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | null;
  const decision = cleanText(reservation?.decision, 40);
  if (decision === "replayed") {
    return { replayed: objectValue(reservation?.stored_response) || {} };
  }
  if (decision === "in_flight") return { error: jsonResponse({ error: "worker_push_in_flight" }, 409) };
  if (decision === "conflict") return { error: jsonResponse({ error: "idempotency_key_conflict" }, 409) };
  return decision === "reserved"
    ? {}
    : { error: jsonResponse({ error: "worker_push_reservation_failed" }, 500) };
}

async function completeWorkerPushDelivery(
  senderWorkerId: string,
  sendKind: string,
  idempotencyKey: string,
  targetFingerprint: string,
  responseBody: Record<string, unknown>,
) {
  const { data, error } = await supabase.rpc("complete_worker_push_delivery", {
    p_sender_worker_id: senderWorkerId,
    p_send_kind: sendKind,
    p_idempotency_key: idempotencyKey,
    p_target_fingerprint: targetFingerprint,
    p_response_body: responseBody,
  });
  return !error && data === true;
}

async function releaseWorkerPushDelivery(
  senderWorkerId: string,
  sendKind: string,
  idempotencyKey: string,
  targetFingerprint: string,
) {
  await supabase.rpc("release_worker_push_delivery", {
    p_sender_worker_id: senderWorkerId,
    p_send_kind: sendKind,
    p_idempotency_key: idempotencyKey,
    p_target_fingerprint: targetFingerprint,
  });
}

async function authorizeSendRequest(payload: Record<string, unknown>, workerIds: string[]) {
  const sendKind = cleanText(payload.sendKind, 40);
  const { worker, error } = await verifiedSender(payload);
  if (error) return { error };
  if (!worker) return { error: jsonResponse({ error: "sender_verification_failed" }, 403) };
  const senderWorkerId = cleanText(worker.id, 80);

  if (sendKind === "test") {
    return workerIds.length === 1 && workerIds[0] === senderWorkerId
      ? { worker }
      : { error: jsonResponse({ error: "forbidden_target" }, 403) };
  }

  if (sendKind === "unsafeIssue" || sendKind === "missingMaterial") {
    const sourceAuthorization = await authorizeSourceRecord(payload, sendKind, senderWorkerId);
    if (sourceAuthorization.error) return sourceAuthorization;
    try {
      const allowedIds = sendKind === "unsafeIssue"
        ? await unsafeTargetWorkerIds()
        : await missingMaterialTargetWorkerIds();
      return workerIds.every((id) => allowedIds.has(id))
        ? { worker, sourceRecordId: sourceAuthorization.sourceRecordId }
        : { error: jsonResponse({ error: "forbidden_target" }, 403) };
    } catch (error) {
      return { error: jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 500) };
    }
  }

  if (sendKind === "pledgePending" || sendKind === "adminManual") {
    return canSendPledgeNotifications(worker)
      ? { worker }
      : { error: jsonResponse({ error: "forbidden_sender" }, 403) };
  }

  return { error: jsonResponse({ error: "forbidden_send_kind" }, 403) };
}

async function authorizeStatusRequest(payload: Record<string, unknown>, workerIds: string[]) {
  const { worker, error } = await verifiedSender(payload);
  if (error) return { error };
  if (!worker) return { error: jsonResponse({ error: "sender_verification_failed" }, 403) };

  const senderWorkerId = cleanText(worker.id, 80);
  if (workerIds.length === 1 && workerIds[0] === senderWorkerId) return { worker };
  return verifyAdminDeviceSession(payload, senderWorkerId);
}

function serializeSubscriptionDevice(row: Record<string, unknown>) {
  return {
    id: cleanText(row.id, 80),
    workerId: cleanText(row.worker_id, 80),
    deviceLabel: cleanText(row.device_label, 120) || "알림 기기",
    userAgent: cleanText(row.user_agent, 500),
    enabled: row.enabled === true,
    lastSeenAt: cleanText(row.last_seen_at, 80),
    lastSentAt: cleanText(row.last_sent_at, 80),
    lastError: cleanText(row.last_error, 220),
    lastErrorAt: cleanText(row.last_error_at, 80),
    updatedAt: cleanText(row.updated_at, 80),
  };
}

async function subscriptionStatus(payload: Record<string, unknown>) {
  const workerIds = Array.isArray(payload.workerIds)
    ? [...new Set(payload.workerIds.map((id) => cleanText(id, 80)).filter(Boolean))]
    : [];
  if (!workerIds.length) return jsonResponse({ ok: true, statuses: [], targetWorkers: 0 });

  const authorization = await authorizeStatusRequest(payload, workerIds);
  if (authorization.error) return authorization.error;

  const { data, error } = await supabase
    .from("worker_push_subscriptions")
    .select("worker_id")
    .in("worker_id", workerIds)
    .eq("enabled", true);

  if (error) return jsonResponse({ error: error.message }, 500);

  const counts = new Map<string, number>();
  for (const row of data || []) {
    const workerId = cleanText(row.worker_id, 80);
    counts.set(workerId, (counts.get(workerId) || 0) + 1);
  }

  return jsonResponse({
    ok: true,
    targetWorkers: workerIds.length,
    statuses: workerIds.map((workerId) => {
      const subscriptionCount = counts.get(workerId) || 0;
      return {
        workerId,
        registered: subscriptionCount > 0,
        subscriptionCount,
      };
    }),
  });
}

async function subscriptionDevices(payload: Record<string, unknown>) {
  const workerId = cleanText(payload.workerId, 80);
  if (!workerId) return jsonResponse({ error: "invalid_worker" }, 400);

  const authorization = await authorizeStatusRequest(payload, [workerId]);
  if (authorization.error) return authorization.error;

  const { data, error } = await supabase
    .from("worker_push_subscriptions")
    .select("id,worker_id,device_label,user_agent,enabled,last_seen_at,last_sent_at,last_error,last_error_at,updated_at")
    .eq("worker_id", workerId)
    .order("updated_at", { ascending: false });

  if (error) return jsonResponse({ error: error.message }, 500);
  return jsonResponse({
    ok: true,
    workerId,
    devices: (data || []).map((row) => serializeSubscriptionDevice(row as Record<string, unknown>)),
  });
}

async function updateSubscriptionDevice(payload: Record<string, unknown>) {
  const workerId = cleanText(payload.workerId, 80);
  const subscriptionId = cleanText(payload.subscriptionId, 80);
  if (!workerId || !subscriptionId) return jsonResponse({ error: "invalid_request" }, 400);

  const authorization = await authorizeStatusRequest(payload, [workerId]);
  if (authorization.error) return authorization.error;

  const patch = {
    device_label: cleanText(payload.deviceLabel, 120) || "알림 기기",
    enabled: booleanValue(payload.enabled, true),
    updated_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("worker_push_subscriptions")
    .update(patch)
    .eq("id", subscriptionId)
    .eq("worker_id", workerId)
    .select("id,worker_id,device_label,user_agent,enabled,last_seen_at,last_sent_at,last_error,last_error_at,updated_at")
    .maybeSingle();

  if (error) return jsonResponse({ error: error.message }, 500);
  if (!data) return jsonResponse({ error: "device_not_found" }, 404);
  return jsonResponse({ ok: true, device: serializeSubscriptionDevice(data as Record<string, unknown>) });
}

async function deleteSubscriptionDevice(payload: Record<string, unknown>) {
  const workerId = cleanText(payload.workerId, 80);
  const subscriptionId = cleanText(payload.subscriptionId, 80);
  if (!workerId || !subscriptionId) return jsonResponse({ error: "invalid_request" }, 400);

  const authorization = await authorizeStatusRequest(payload, [workerId]);
  if (authorization.error) return authorization.error;

  const { error, count } = await supabase
    .from("worker_push_subscriptions")
    .delete({ count: "exact" })
    .eq("id", subscriptionId)
    .eq("worker_id", workerId);

  if (error) return jsonResponse({ error: error.message }, 500);
  if (!count) return jsonResponse({ error: "device_not_found" }, 404);
  return jsonResponse({ ok: true, workerId, deleted: subscriptionId });
}

async function sendNotification(payload: Record<string, unknown>) {
  const sendKind = cleanText(payload.sendKind, 40);
  const requestedWorkerIds = normalizedWorkerIds(payload.workerIds);
  const rawIdempotencyKey = String(payload.idempotencyKey || "").trim();
  const idempotencyKey = normalizeIdempotencyKey(rawIdempotencyKey);
  if (!rawIdempotencyKey) return jsonResponse({ error: "idempotency_key_required" }, 400);
  if (!idempotencyKey) return jsonResponse({ error: "invalid_idempotency_key" }, 400);

  let workerIds: string[];
  try {
    workerIds = await resolveSendWorkerIds(sendKind, requestedWorkerIds);
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 500);
  }

  const authorization = await authorizeSendRequest(payload, workerIds);
  if (authorization.error) return authorization.error;
  const senderWorkerId = cleanText(authorization.worker?.id, 80);
  if (!senderWorkerId) return jsonResponse({ error: "sender_verification_failed" }, 403);

  const targetWorkerIds = sendKind === "missingMaterial" || sendKind === "unsafeIssue"
    ? workerIds
    : requestedWorkerIds;
  const preDeliveryOutcomes = targetWorkerIds
    .filter((workerId) => !workerIds.includes(workerId))
    .map((workerId) => ({ workerId, outcome: "skipped" }));

  const notificationRaw = objectValue(payload.notification) || {};
  const notification = {
    title: cleanText(notificationRaw.title, 80) || "GS 안전 체크리스트",
    body: cleanText(notificationRaw.body, 220),
    tag: cleanText(notificationRaw.tag, 120) || `gs-${idempotencyKey}`,
    url: cleanText(notificationRaw.url, 240) || "/",
    style: cleanText(notificationRaw.style, 40),
    requireInteraction: booleanValue(notificationRaw.requireInteraction, false),
    renotify: booleanValue(notificationRaw.renotify, true),
    vibrate: Array.isArray(notificationRaw.vibrate)
      ? notificationRaw.vibrate.slice(0, 6).map((value) => Number(value) || 0).filter((value) => value >= 0 && value <= 1000)
      : undefined,
    icon: "/assets/icons/notification-icon.png",
    badge: "/assets/icons/notification-icon.png",
  };
  const sourceRecordId = cleanText(authorization.sourceRecordId, 120);
  const targetFingerprint = await workerPushDeliveryFingerprint({
    sendKind,
    sourceRecordId,
    workerIds,
    notification,
  });
  const reservation = await reserveWorkerPushDelivery(
    senderWorkerId,
    sendKind,
    idempotencyKey,
    targetFingerprint,
  );
  if (reservation.error) return reservation.error;
  if (reservation.replayed) return jsonResponse({ ...reservation.replayed, replayed: true });

  const emptyAudit = deliveryAuditCounts(targetWorkerIds, preDeliveryOutcomes);
  const emptyBody = {
    ok: true,
    sent: 0,
    failed: 0,
    targetWorkers: emptyAudit.targeted,
    subscribedWorkers: 0,
    ...emptyAudit,
    skippedSubscriptions: 0,
    idempotencyKeyAccepted: true,
    cooldownSeconds: Math.floor(SEND_IDEMPOTENCY_TTL_MS / 1000),
    reason: "no_targets",
  };
  if (!workerIds.length) {
    const completed = await completeWorkerPushDelivery(
      senderWorkerId,
      sendKind,
      idempotencyKey,
      targetFingerprint,
      emptyBody,
    );
    return completed
      ? jsonResponse(emptyBody)
      : jsonResponse({ error: "worker_push_completion_failed" }, 500);
  }

  const config = await vapidConfig();
  if (!config.publicKey || !config.privateKey) {
    await releaseWorkerPushDelivery(senderWorkerId, sendKind, idempotencyKey, targetFingerprint);
    return jsonResponse({ error: "vapid_not_configured" }, 500);
  }

  const { data: subscriptions, error } = await supabase
    .from("worker_push_subscriptions")
    .select("id,worker_id,subscription")
    .in("worker_id", workerIds)
    .eq("enabled", true);

  if (error) {
    await releaseWorkerPushDelivery(senderWorkerId, sendKind, idempotencyKey, targetFingerprint);
    return jsonResponse({ error: error.message }, 500);
  }

  const subscribedWorkers = new Set((subscriptions || []).map((row) => cleanText(row.worker_id, 80)).filter(Boolean)).size;
  let sent = 0;
  let failed = 0;
  const deliveryOutcomes = [...preDeliveryOutcomes];
  await Promise.all((subscriptions || []).map(async (row) => {
    const workerId = cleanText(row.worker_id, 80);
    try {
      await webpush.sendNotification(row.subscription, JSON.stringify(notification));
      sent += 1;
      deliveryOutcomes.push({ workerId, outcome: "delivered" });
      await supabase
        .from("worker_push_subscriptions")
        .update({
          last_sent_at: new Date().toISOString(),
          last_error: null,
          last_error_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
    } catch (error) {
      failed += 1;
      deliveryOutcomes.push({ workerId, outcome: "failed" });
      const statusCode = Number((error as { statusCode?: number }).statusCode || 0);
      await markSubscriptionError(row.id, error instanceof Error ? error.message : String(error), statusCode === 404 || statusCode === 410);
    }
  }));

  const audit = deliveryAuditCounts(targetWorkerIds, deliveryOutcomes);
  const body = {
    ok: true,
    sent,
    failed,
    targetWorkers: audit.targeted,
    subscribedWorkers,
    ...audit,
    skippedSubscriptions: 0,
    idempotencyKeyAccepted: true,
    cooldownSeconds: Math.floor(SEND_IDEMPOTENCY_TTL_MS / 1000),
  };
  const completed = await completeWorkerPushDelivery(
    senderWorkerId,
    sendKind,
    idempotencyKey,
    targetFingerprint,
    body,
  );
  return completed
    ? jsonResponse(body)
    : jsonResponse({ error: "worker_push_completion_failed" }, 500);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  const action = cleanText(payload.action, 40);
  if (action === "register") return registerSubscription(payload);
  if (action === "verifyWorker") return verifyWorkerLogin(payload);
  if (action === "status") return subscriptionStatus(payload);
  if (action === "devices") return subscriptionDevices(payload);
  if (action === "updateDevice") return updateSubscriptionDevice(payload);
  if (action === "deleteDevice") return deleteSubscriptionDevice(payload);
  if (action === "send") return sendNotification(payload);
  return jsonResponse({ error: "unknown_action" }, 400);
});
