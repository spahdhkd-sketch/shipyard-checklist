import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const UNSAFE_PUSH_TARGET_WORKER_NAMES = ["허지원", "김준혁", "김경제"];
const LEADER_WORKER_POSITION = "조장";

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

function normalizedWorkerName(value: unknown) {
  return String(value || "").trim().replace(/\s+/g, "");
}

function canSendPledgeNotifications(worker: Record<string, unknown>) {
  const team = cleanText(worker.team, 40);
  const position = cleanText(worker.position, 40);
  return position === LEADER_WORKER_POSITION || team === "관리" || team === "총무";
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

async function registerSubscription(payload: Record<string, unknown>) {
  const workerId = cleanText(payload.workerId, 80);
  const employeeNo = cleanText(payload.employeeNo, 80);
  const subscription = payload.subscription;
  if (!workerId || !employeeNo || !validSubscription(subscription)) {
    return jsonResponse({ error: "invalid_request" }, 400);
  }

  const { data: worker, error: workerError } = await supabase
    .from("workers")
    .select("id,name,active,employee_no")
    .eq("id", workerId)
    .eq("active", true)
    .maybeSingle();

  if (workerError) return jsonResponse({ error: workerError.message }, 500);
  if (!worker || String(worker.employee_no || "").trim() !== employeeNo) {
    return jsonResponse({ error: "worker_login_failed" }, 403);
  }

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
  return jsonResponse({ ok: true, workerId, workerName: worker.name });
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

  const { data: worker, error } = await supabase
    .from("workers")
    .select("id,name,team,position,active,employee_no")
    .eq("id", senderWorkerId)
    .eq("active", true)
    .maybeSingle();

  if (error) return { error: jsonResponse({ error: error.message }, 500) };
  if (!worker || normalizeEmployeeNo(worker.employee_no) !== senderEmployeeNo) {
    return { error: jsonResponse({ error: "sender_verification_failed" }, 403) };
  }
  return { worker: worker as Record<string, unknown> };
}

async function unsafeTargetWorkerIds() {
  const targetNames = new Set(UNSAFE_PUSH_TARGET_WORKER_NAMES.map(normalizedWorkerName));
  const { data, error } = await supabase
    .from("workers")
    .select("id,name,active")
    .eq("active", true);

  if (error) throw error;
  return new Set((data || [])
    .filter((worker) => targetNames.has(normalizedWorkerName(worker.name)))
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

  if (sendKind === "pledgePending") {
    return canSendPledgeNotifications(worker)
      ? null
      : jsonResponse({ error: "forbidden_sender" }, 403);
  }

  return jsonResponse({ error: "forbidden_send_kind" }, 403);
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
    icon: "/assets/icons/icon-192.png",
    badge: "/assets/icons/icon-192.png",
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
  if (action === "send") return sendNotification(payload);
  return jsonResponse({ error: "unknown_action" }, 400);
});
