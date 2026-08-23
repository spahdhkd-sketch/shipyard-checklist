import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PRIVILEGED_POSITIONS = new Set(["반장", "대표", "관리", "총무"]);
const PRIVILEGED_TEAMS = new Set(["관리", "총무"]);
const RESOURCE_TYPES = new Set([
  "safety_inspection",
  "work_prep_record",
  "unsafe_issue",
  "missing_material",
]);
const TRANSITION_ACTIONS = new Set(["archive", "restore", "purge_expired"]);
const RECORD_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$/;
const REQUEST_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$/;
const MAX_RECORD_IDS = 200;
const MAX_RETENTION_MS = 3650 * 86400000;
const encoder = new TextEncoder();

type TokenPayload = {
  v: number;
  sid: string;
  workerId: string;
  scope?: string;
  exp: number;
};

type AuthorizedSession = {
  sessionId: string;
  workerId: string;
};

type TransitionInput = {
  operation: string;
  resourceType: string;
  recordIds: string[];
  reason: string;
  requestId: string;
  retentionExpiresAt: string | null;
};

class RequestError extends Error {
  status: number;

  constructor(code: string, status = 400) {
    super(code);
    this.name = "RequestError";
    this.status = status;
  }
}

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

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function objectValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function requiredText(value: unknown, code: string, max: number) {
  if (typeof value !== "string") throw new RequestError(code);
  const text = value.trim();
  if (!text || text.length > max) throw new RequestError(code);
  return text;
}

function parseTimestamp(value: unknown, code: string) {
  const text = requiredText(value, code, 40);
  const timestamp = new Date(text);
  if (!Number.isFinite(timestamp.getTime())) throw new RequestError(code);
  return timestamp.toISOString();
}

function resourceType(value: unknown) {
  const parsed = requiredText(value, "resource_type_required", 80);
  if (!RESOURCE_TYPES.has(parsed)) throw new RequestError("resource_type_unsupported");
  return parsed;
}

function recordIds(value: unknown, allowEmpty = false) {
  if (allowEmpty && value === undefined) return [];
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_RECORD_IDS) {
    throw new RequestError("record_ids_invalid");
  }
  const parsed = value.map((item) => requiredText(item, "record_ids_invalid", 120));
  if (parsed.some((item) => !RECORD_ID_PATTERN.test(item)) || new Set(parsed).size !== parsed.length) {
    throw new RequestError("record_ids_invalid");
  }
  return parsed;
}

function transitionInput(payload: Record<string, unknown>, operationValue: unknown): TransitionInput {
  const operation = requiredText(operationValue, "operation_required", 40);
  if (!TRANSITION_ACTIONS.has(operation)) throw new RequestError("operation_unsupported");
  const parsedResourceType = resourceType(payload.resourceType);
  const parsedRecordIds = recordIds(payload.recordIds, operation === "purge_expired");
  const reason = requiredText(payload.reason, "reason_required", 500);
  if (/[\u0000-\u001f\u007f]/.test(reason)) throw new RequestError("reason_invalid");
  const requestId = requiredText(payload.requestId, "request_id_required", 120);
  if (!REQUEST_ID_PATTERN.test(requestId)) throw new RequestError("request_id_invalid");

  let retentionExpiresAt: string | null = null;
  if (operation === "archive") {
    retentionExpiresAt = parseTimestamp(payload.retentionExpiresAt, "retention_expiry_invalid");
    const delta = Date.parse(retentionExpiresAt) - Date.now();
    if (delta <= 0 || delta > MAX_RETENTION_MS) throw new RequestError("retention_expiry_invalid");
  } else if (payload.retentionExpiresAt !== undefined && payload.retentionExpiresAt !== null) {
    throw new RequestError("retention_expiry_not_allowed");
  }

  return {
    operation,
    resourceType: parsedResourceType,
    recordIds: parsedRecordIds,
    reason,
    requestId,
    retentionExpiresAt,
  };
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function sessionSecret() {
  return Deno.env.get("ADMIN_SESSION_SECRET")
    || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    || "";
}

async function hmacSignature(value: string) {
  const secret = sessionSecret();
  if (!secret) throw new Error("missing_session_secret");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return base64UrlEncode(new Uint8Array(signature));
}

async function sha256(value: string) {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return base64UrlEncode(new Uint8Array(hash));
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

async function readToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;
  const expected = await hmacSignature(parts[1]);
  if (!timingSafeEqual(expected, parts[2])) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1]))) as TokenPayload;
    if (payload.v !== 1 || !payload.sid || !payload.workerId || !payload.exp) return null;
    if (payload.exp <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function isPrivilegedWorker(worker: Record<string, unknown>) {
  const position = typeof worker.position === "string" ? worker.position.trim() : "";
  const team = typeof worker.team === "string" ? worker.team.trim() : "";
  return PRIVILEGED_POSITIONS.has(position) || PRIVILEGED_TEAMS.has(team);
}

async function verifyMutationSession(payload: Record<string, unknown>): Promise<AuthorizedSession> {
  const session = objectValue(payload.mutationSession) || objectValue(payload.adminSession) || {};
  const token = typeof session.token === "string" ? session.token.trim() : "";
  if (!token || token.length > 4096) throw new RequestError("admin_session_required", 403);

  let tokenPayload: TokenPayload | null = null;
  try {
    tokenPayload = await readToken(token);
  } catch {
    throw new RequestError("admin_session_invalid", 403);
  }
  if (!tokenPayload || tokenPayload.scope !== "admin") {
    throw new RequestError("admin_session_invalid", 403);
  }

  const tokenHash = await sha256(token);
  const { data: storedSession, error: sessionError } = await supabase
    .from("admin_mutation_sessions")
    .select("id,worker_id,expires_at,revoked_at")
    .eq("id", tokenPayload.sid)
    .eq("token_hash", tokenHash)
    .maybeSingle();
  if (sessionError) throw new RequestError("admin_session_lookup_failed", 500);
  const storedExpiresAt = Date.parse(String(storedSession?.expires_at || ""));
  if (!storedSession
    || storedSession.worker_id !== tokenPayload.workerId
    || !Number.isFinite(storedExpiresAt)
    || storedExpiresAt <= Date.now()
    || storedSession.revoked_at) {
    throw new RequestError("admin_session_invalid", 403);
  }

  const { data: worker, error: workerError } = await supabase
    .from("workers")
    .select("id,team,position,active")
    .eq("id", tokenPayload.workerId)
    .eq("active", true)
    .maybeSingle();
  if (workerError) throw new RequestError("admin_lookup_failed", 500);
  if (!worker || !isPrivilegedWorker(worker as Record<string, unknown>)) {
    throw new RequestError("admin_forbidden", 403);
  }

  const { error: touchError } = await supabase
    .from("admin_mutation_sessions")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", tokenPayload.sid);
  if (touchError) throw new RequestError("admin_session_touch_failed", 500);
  return { sessionId: tokenPayload.sid, workerId: tokenPayload.workerId };
}

async function eligibleRecordIds(input: TransitionInput) {
  if (input.operation === "purge_expired" && input.recordIds.length === 0) {
    const { data, error } = await supabase
      .from("record_retention_states")
      .select("record_id")
      .eq("resource_type", input.resourceType)
      .eq("status", "archived")
      .lte("retention_expires_at", new Date().toISOString())
      .order("retention_expires_at", { ascending: true })
      .order("record_id", { ascending: true })
      .limit(MAX_RECORD_IDS);
    if (error) throw new RequestError("retention_preview_failed", 500);
    return (data || []).map((row) => String(row.record_id));
  }

  const { data, error } = await supabase
    .from("record_retention_states")
    .select("record_id,status,retention_expires_at")
    .eq("resource_type", input.resourceType)
    .in("record_id", input.recordIds);
  if (error) throw new RequestError("retention_preview_failed", 500);
  const states = new Map((data || []).map((row) => [String(row.record_id), row]));
  const now = Date.now();
  return input.recordIds.filter((id) => {
    const state = states.get(id);
    if (input.operation === "archive") return !state || state.status !== "archived";
    if (input.operation === "restore") return state?.status === "archived";
    return state?.status === "archived"
      && Date.parse(String(state.retention_expires_at || "")) <= now;
  });
}

async function preview(payload: Record<string, unknown>) {
  const input = transitionInput(payload, payload.operation);
  const eligibleIds = await eligibleRecordIds(input);
  return jsonResponse({
    ok: true,
    preview: {
      operation: input.operation,
      resourceType: input.resourceType,
      requestId: input.requestId,
      recordIds: eligibleIds,
      affectedCount: eligibleIds.length,
      retentionExpiresAt: input.retentionExpiresAt,
    },
  });
}

function confirmedAffectedCount(value: unknown) {
  if (!Number.isSafeInteger(value) || Number(value) < 1 || Number(value) > MAX_RECORD_IDS) {
    throw new RequestError("affected_count_invalid");
  }
  return Number(value);
}

function rpcError(error: { message?: string } | null) {
  const code = String(error?.message || "").match(/(action_unsupported|resource_type_unsupported|record_ids_invalid|affected_count_invalid|affected_count_mismatch|reason_invalid|request_id_invalid|request_id_conflict|actor_ref_invalid|mutation_session_id_invalid|retention_expiry_invalid|retention_expiry_not_allowed)/)?.[1];
  if (!code) return new RequestError("retention_transition_failed", 500);
  return new RequestError(code, code === "affected_count_mismatch" || code === "request_id_conflict" ? 409 : 400);
}

async function transition(payload: Record<string, unknown>, session: AuthorizedSession, operation: string) {
  const input = transitionInput(payload, operation);
  const affectedCount = confirmedAffectedCount(payload.confirmedAffectedCount);
  if (input.recordIds.length !== affectedCount) throw new RequestError("affected_count_mismatch", 409);
  const { data, error } = await supabase.rpc("record_retention_transition", {
    p_action: input.operation,
    p_resource_type: input.resourceType,
    p_record_ids: input.recordIds,
    p_reason: input.reason,
    p_expected_affected_count: affectedCount,
    p_request_id: input.requestId,
    p_actor_ref: session.workerId,
    p_mutation_session_id: session.sessionId,
    p_retention_expires_at: input.retentionExpiresAt,
  });
  if (error) throw rpcError(error);
  const result = objectValue(data);
  if (!result) throw new RequestError("retention_transition_failed", 500);
  return jsonResponse({
    ok: true,
    operation: input.operation,
    resourceType: input.resourceType,
    recordIds: Array.isArray(result.recordIds) ? result.recordIds.map(String) : [],
    affectedCount: Number(result.affectedCount) || 0,
    replayed: result.replayed === true,
  });
}

async function listStates(payload: Record<string, unknown>) {
  const parsedResourceType = resourceType(payload.resourceType);
  const status = payload.status === undefined ? "" : requiredText(payload.status, "status_invalid", 20);
  if (status && status !== "active" && status !== "archived") throw new RequestError("status_invalid");
  const limit = payload.limit === undefined ? 100 : Number(payload.limit);
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > MAX_RECORD_IDS) {
    throw new RequestError("limit_invalid");
  }
  const cursor = payload.cursor === undefined ? null : objectValue(payload.cursor);
  if (payload.cursor !== undefined && !cursor) throw new RequestError("cursor_invalid");
  const cursorUpdatedAt = cursor ? parseTimestamp(cursor.updatedAt, "cursor_invalid") : "";
  const cursorRecordId = cursor ? recordIds([cursor.recordId])[0] : "";
  let query = supabase
    .from("record_retention_states")
    .select("resource_type,record_id,status,archived_at,retention_expires_at,restored_at,updated_at")
    .eq("resource_type", parsedResourceType)
    .order("updated_at", { ascending: false })
    .order("record_id", { ascending: true })
    .limit(limit);
  if (status) query = query.eq("status", status);
  if (cursor) {
    query = query.or(
      `updated_at.lt.${cursorUpdatedAt},and(updated_at.eq.${cursorUpdatedAt},record_id.gt.${cursorRecordId})`,
    );
  }
  const { data, error } = await query;
  if (error) throw new RequestError("retention_list_failed", 500);
  const records = (data || []).map((row) => ({
    resourceType: row.resource_type,
    recordId: row.record_id,
    status: row.status,
    archivedAt: row.archived_at,
    retentionExpiresAt: row.retention_expires_at,
    restoredAt: row.restored_at,
    updatedAt: row.updated_at,
  }));
  return jsonResponse({
    ok: true,
    records,
    nextCursor: records.length === limit
      ? {
        updatedAt: records[records.length - 1]?.updatedAt || null,
        recordId: records[records.length - 1]?.recordId || null,
      }
      : null,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  try {
    let parsed: unknown;
    try {
      parsed = await req.json();
    } catch {
      throw new RequestError("invalid_json");
    }
    const payload = objectValue(parsed);
    if (!payload) throw new RequestError("invalid_json");
    const session = await verifyMutationSession(payload);
    const action = requiredText(payload.action, "action_required", 40);
    if (action === "preview") return await preview(payload);
    if (action === "list") return await listStates(payload);
    if (TRANSITION_ACTIONS.has(action)) return await transition(payload, session, action);
    throw new RequestError("unknown_action");
  } catch (error) {
    if (error instanceof RequestError) return jsonResponse({ error: error.message }, error.status);
    return jsonResponse({ error: "internal_error" }, 500);
  }
});
