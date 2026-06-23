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
const MISSING_MATERIAL_PUSH_TARGET_NAMES = new Set(["허지원", "김준혁", "김경제"].map(normalizedWorkerName));
const WORKER_PUSH_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const WORKER_PUSH_ATTEMPT_LOCK_MS = 15 * 60 * 1000;
const WORKER_PUSH_MAX_FAILED_ATTEMPTS = 5;

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

function normalizeEmployeeNo(value: unknown) {
  return String(value || "").trim();
}

function parseTime(value: unknown) {
  const time = Date.parse(cleanText(value, 80));
  return Number.isFinite(time) ? time : 0;
}

function normalizedWorkerName(value: unknown) {
  return String(value || "").trim().replace(/\s+/g, "");
}

function booleanValue(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function canSendPledgeNotifications(worker: Record<string, unknown>) {
  const team = cleanText(worker.team, 40);
  const position = cleanText(worker.position, 40);
  return [LEADER_WORKER_POSITION, FOREMAN_WORKER_POSITION, "관리", "총무"].includes(position) || team === "관리" || team === "총무";
}

async function readWorkerPushAttempt(bucketKey: string) {
  const { data, error } = await supabase
    .from("worker_push_attempts")
    .select("bucket_key,worker_id,fail_count,window_started_at,locked_until")
    .eq("bucket_key", bucketKey)
    .maybeSingle();
  if (error) {
    console.error("worker push attempt lookup failed", error);
    return { error: jsonResponse({ error: "worker_push_attempt_lookup_failed" }, 500) };
  }
  return { attempt: data as Record<string, unknown> | null };
}

async function assertWorkerPushAttemptAllowed(bucketKey: string) {
  const result = await readWorkerPushAttempt(bucketKey);
  if (result.error) return result;
  const lockedUntil = parseTime(result.attempt?.locked_until);
  if (lockedUntil && lockedUntil > Date.now()) {
    return { error: jsonResponse({ error: "worker_push_rate_limited" }, 429), attempt: result.attempt };
  }
  return result;
}

async function recordWorkerPushFailedAttempt(bucketKey: string, workerId: string, previous?: Record<string, unknown> | null) {
  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const previousWindowStarted = parseTime(previous?.window_started_at);
  const inWindow = Boolean(previousWindowStarted && now - previousWindowStarted < WORKER_PUSH_ATTEMPT_WINDOW_MS);
  const failCount = (inWindow ? Number(previous?.fail_count || 0) : 0) + 1;
  const { error } = await supabase
    .from("worker_push_attempts")
    .upsert({
      bucket_key: bucketKey,
      worker_id: workerId,
      fail_count: failCount,
      window_started_at: inWindow ? previous?.window_started_at : nowIso,
      locked_until: failCount >= WORKER_PUSH_MAX_FAILED_ATTEMPTS ? new Date(now + WORKER_PUSH_ATTEMPT_LOCK_MS).toISOString() : null,
      updated_at: nowIso,
    }, { onConflict: "bucket_key" });
  if (error) console.error("worker push failed attempt write failed", error);
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
  const attempt = await assertWorkerPushAttemptAllowed(bucketKey);
  if (attempt.error) return { error: attempt.error };

  const { data, error } = await supabase
    .from("workers")
    .select("id,name,team,position,active,employee_no")
    .eq("id", workerId)
    .eq("active", true)
    .maybeSingle();

  if (error) return { error: jsonResponse({ error: error.message }, 500) };
  const worker = data as Record<string, unknown> | null;
  if (!worker || normalizeEmployeeNo(worker.employee_no) !== employeeNo) {
    await recordWorkerPushFailedAttempt(bucketKey, workerId, attempt.attempt);
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
    .select("id,name,active")
    .eq("active", true);

  if (error) throw error;
  return new Set((data || [])
    .filter((worker) => MISSING_MATERIAL_PUSH_TARGET_NAMES.has(normalizedWorkerName(worker.name)))
    .map((worker) => cleanText(worker.id, 80))
    .filter(Boolean));
}

async function authorizeSendRequest(payload: Record<string, unknown>, workerIds: string[]) {
  const sendKind = cleanText(payload.sendKind, 40);
  const { worker, error } = await verifiedSender(payload);
  if (error) return error;
  if (!worker) return jsonResponse({ error: "sender_verification_failed" }, 403);

  if (sendKind === "test") {
    return workerIds.length === 1 && workerIds[0] === cleanText(worker.id, 80)
      ? null
      : jsonResponse({ error: "forbidden_target" }, 403);
  }

  if (sendKind === "unsafeIssue") {
    try {
      const allowedIds = await unsafeTargetWorkerIds();
      return workerIds.every((id) => allowedIds.has(id))
        ? null
        : jsonResponse({ error: "forbidden_target" }, 403);
    } catch (error) {
      return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 500);
    }
  }

  if (sendKind === "missingMaterial") {
    try {
      const allowedIds = await missingMaterialTargetWorkerIds();
      return workerIds.every((id) => allowedIds.has(id))
        ? null
        : jsonResponse({ error: "forbidden_target" }, 403);
    } catch (error) {
      return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 500);
    }
  }

  if (sendKind === "pledgePending" || sendKind === "adminManual") {
    return canSendPledgeNotifications(worker)
      ? null
      : jsonResponse({ error: "forbidden_sender" }, 403);
  }

  return jsonResponse({ error: "forbidden_send_kind" }, 403);
}

async function authorizeStatusRequest(payload: Record<string, unknown>, workerIds: string[]) {
  const { worker, error } = await verifiedSender(payload);
  if (error) return { error };
  if (!worker) return { error: jsonResponse({ error: "sender_verification_failed" }, 403) };

  const senderWorkerId = cleanText(worker.id, 80);
  if (workerIds.length === 1 && workerIds[0] === senderWorkerId) return { worker };
  if (canSendPledgeNotifications(worker)) return { worker };
  return { error: jsonResponse({ error: "forbidden_target" }, 403) };
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
  const workerIds = Array.isArray(payload.workerIds)
    ? [...new Set(payload.workerIds.map((id) => cleanText(id, 80)).filter(Boolean))]
    : [];
  if (!workerIds.length) return jsonResponse({ ok: true, sent: 0, failed: 0, reason: "no_targets" });

  const authorizationError = await authorizeSendRequest(payload, workerIds);
  if (authorizationError) return authorizationError;

  const config = await vapidConfig();
  if (!config.publicKey || !config.privateKey) return jsonResponse({ error: "vapid_not_configured" }, 500);

  const notificationRaw = payload.notification && typeof payload.notification === "object"
    ? payload.notification as Record<string, unknown>
    : {};
  const notification = {
    title: cleanText(notificationRaw.title, 80) || "GS 안전 체크리스트",
    body: cleanText(notificationRaw.body, 220),
    tag: cleanText(notificationRaw.tag, 120) || `gs-${Date.now()}`,
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

  const { data: subscriptions, error } = await supabase
    .from("worker_push_subscriptions")
    .select("id,worker_id,subscription")
    .in("worker_id", workerIds)
    .eq("enabled", true);

  if (error) return jsonResponse({ error: error.message }, 500);

  let sent = 0;
  let failed = 0;
  await Promise.all((subscriptions || []).map(async (row) => {
    try {
      await webpush.sendNotification(row.subscription, JSON.stringify(notification));
      sent += 1;
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
      const statusCode = Number((error as { statusCode?: number }).statusCode || 0);
      await markSubscriptionError(row.id, error instanceof Error ? error.message : String(error), statusCode === 404 || statusCode === 410);
    }
  }));

  return jsonResponse({ ok: true, sent, failed, targetWorkers: workerIds.length });
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
