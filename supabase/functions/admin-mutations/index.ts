import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PRIVILEGED_POSITIONS = new Set(["\uBC18\uC7A5", "\uB300\uD45C", "\uAD00\uB9AC", "\uCD1D\uBB34"]);
const WORK_PREP_POSITIONS = new Set(["\uC870\uC7A5", "\uBC18\uC7A5", "\uB300\uD45C", "\uAD00\uB9AC", "\uCD1D\uBB34"]);
const PRIVILEGED_TEAMS = new Set(["\uAD00\uB9AC", "\uCD1D\uBB34"]);
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const ATTEMPT_LOCK_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const PICTOGRAM_IMAGE_BUCKET = "safety-pictograms";
const PICTOGRAM_IMAGE_MAX_BYTES = 768 * 1024;
const PICTOGRAM_IMAGE_MIME_EXTENSIONS = new Map<string, string>([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
]);
const encoder = new TextEncoder();

type TableConfig = {
  table: string;
  columns: Set<string>;
};

type TokenPayload = {
  v: 1;
  sid: string;
  workerId: string;
  scope?: "admin" | "workPrep";
  nonce: string;
  iat: number;
  exp: number;
};

const ADMIN_TABLES = new Map<string, TableConfig>([
  ["workers", {
    table: "workers",
    columns: new Set([
      "id",
      "name",
      "team",
      "position",
      "active",
      "unsafe_push_target",
      "created_at",
      "updated_at",
    ]),
  }],
  ["categories", {
    table: "safety_categories",
    columns: new Set([
      "id",
      "label",
      "icon",
      "color",
      "require_tool_check",
      "tool_nature",
      "tool_ids",
      "sort_order",
    ]),
  }],
  ["sections", {
    table: "safety_sections",
    columns: new Set([
      "id",
      "category_id",
      "title",
      "sort_order",
    ]),
  }],
  ["items", {
    table: "safety_items",
    columns: new Set([
      "id",
      "category_id",
      "section_id",
      "text",
      "risk",
      "required",
      "active",
      "tool_ids",
      "visibility_condition",
      "sort_order",
    ]),
  }],
  ["tools", {
    table: "safety_tools",
    columns: new Set([
      "id",
      "category_id",
      "name",
      "nature",
      "deleted",
      "sort_order",
    ]),
  }],
  ["pictograms", {
    table: "safety_pictograms",
    columns: new Set([
      "id",
      "label",
      "source",
      "deleted",
      "sort_order",
      "storage_bucket",
      "storage_path",
      "mime_type",
      "file_size",
    ]),
  }],
  ["ships", {
    table: "safety_ships",
    columns: new Set([
      "id",
      "no",
      "type",
      "note",
      "process_stage",
      "delivery_type",
      "delivery_date",
      "created_at",
      "sort_order",
    ]),
  }],
  ["inspections", {
    table: "safety_inspections",
    columns: new Set([
      "id",
      "category_id",
      "worker",
      "ship_no",
      "date",
      "time",
      "status",
      "warnings",
      "completion",
      "tools",
      "safety_pledge",
      "work_prep_record_id",
      "work_prep_worker_id",
      "created_at",
    ]),
  }],
  ["inspectionItems", {
    table: "safety_inspection_items",
    columns: new Set([
      "id",
      "inspection_id",
      "item_id",
      "checked",
      "risk",
      "text",
      "section_title",
    ]),
  }],
  ["unsafeIssues", {
    table: "unsafe_issues",
    columns: new Set([
      "id",
      "ship_no",
      "content",
      "worker_id",
      "worker_name_snapshot",
      "worker_team_snapshot",
      "status",
      "admin_memo",
      "created_at",
      "updated_at",
      "completed_at",
      "status_history",
    ]),
  }],
  ["missingMaterials", {
    table: "missing_materials",
    columns: new Set([
      "id",
      "ship_no",
      "material_name",
      "content",
      "worker_id",
      "worker_name_snapshot",
      "worker_team_snapshot",
      "status",
      "admin_memo",
      "created_at",
      "updated_at",
      "completed_at",
      "status_history",
    ]),
  }],
  ["issuePhotos", {
    table: "issue_photos",
    columns: new Set([
      "id",
      "target_type",
      "target_id",
      "storage_bucket",
      "storage_path",
      "sort_order",
      "created_at",
    ]),
  }],
  ["workPrepRecords", {
    table: "work_prep_records",
    columns: new Set([
      "id",
      "work_date",
      "appearance_time",
      "team",
      "ship_no",
      "category_id",
      "leader_worker_id",
      "worker_ids",
      "other_team_worker_ids",
      "tool_ids",
      "status",
      "created_at",
      "updated_at",
      "deleted_at",
    ]),
  }],
]);

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

function cleanText(value: unknown, max = 200) {
  return String(value || "").trim().slice(0, max);
}

function normalizeEmployeeNo(value: unknown) {
  return String(value || "").trim();
}

function rowObject(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function cleanRow(config: TableConfig, value: unknown) {
  const row = rowObject(value);
  if (!row) return null;
  const id = cleanText(row.id, 120);
  if (!id) return null;
  const next: Record<string, unknown> = {};
  for (const column of config.columns) {
    if (Object.prototype.hasOwnProperty.call(row, column)) next[column] = row[column];
  }
  next.id = id;
  return next;
}

function cleanIds(value: unknown) {
  return Array.isArray(value)
    ? [...new Set(value.map((id) => cleanText(id, 120)).filter(Boolean))]
    : [];
}

function parseDataUrl(value: unknown) {
  const text = String(value || "");
  const match = text.match(/^data:([^;,]+);base64,([a-z0-9+/=\s]+)$/i);
  if (!match) return null;
  const mimeType = match[1].toLowerCase();
  if (!PICTOGRAM_IMAGE_MIME_EXTENSIONS.has(mimeType)) return null;
  const binary = atob(match[2].replace(/\s+/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  if (!bytes.length || bytes.length > PICTOGRAM_IMAGE_MAX_BYTES) return null;
  return { mimeType, bytes };
}

function parseTime(value: unknown) {
  const time = Date.parse(String(value || ""));
  return Number.isFinite(time) ? time : 0;
}

function isPrivilegedWorker(worker: Record<string, unknown>) {
  const position = cleanText(worker.position, 80);
  const team = cleanText(worker.team, 80);
  return PRIVILEGED_POSITIONS.has(position) || PRIVILEGED_TEAMS.has(team);
}

function canMutateWorkPrep(worker: Record<string, unknown>) {
  const position = cleanText(worker.position, 80);
  const team = cleanText(worker.team, 80);
  return WORK_PREP_POSITIONS.has(position) || PRIVILEGED_TEAMS.has(team);
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

function randomId(prefix: string) {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return `${prefix}_${base64UrlEncode(bytes)}`;
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

async function signToken(payload: TokenPayload) {
  const encodedPayload = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signature = await hmacSignature(encodedPayload);
  return `v1.${encodedPayload}.${signature}`;
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

async function verifyPrivilegedWorkerCredential(workerId: string, employeeNo: string, scope: "admin" | "workPrep" = "admin") {
  if (!workerId || !employeeNo) return { error: jsonResponse({ error: "admin_worker_required" }, 403) };

  const { data: worker, error } = await supabase
    .from("workers")
    .select("id,name,team,position,active,employee_no")
    .eq("id", workerId)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("admin worker lookup failed", error);
    return { error: jsonResponse({ error: "admin_lookup_failed" }, 500) };
  }
  if (!worker || normalizeEmployeeNo(worker.employee_no) !== employeeNo) {
    return { error: jsonResponse({ error: "admin_verification_failed" }, 403) };
  }
  const allowed = scope === "workPrep"
    ? canMutateWorkPrep(worker as Record<string, unknown>)
    : isPrivilegedWorker(worker as Record<string, unknown>);
  if (!allowed) {
    return { error: jsonResponse({ error: "admin_forbidden" }, 403) };
  }

  return { worker: worker as Record<string, unknown> };
}

async function readAttempt(bucketKey: string) {
  const { data, error } = await supabase
    .from("admin_mutation_attempts")
    .select("bucket_key,worker_id,fail_count,window_started_at,locked_until")
    .eq("bucket_key", bucketKey)
    .maybeSingle();
  if (error) {
    console.error("admin attempt lookup failed", error);
    return { error: jsonResponse({ error: "admin_attempt_lookup_failed" }, 500) };
  }
  return { attempt: data as Record<string, unknown> | null };
}

async function assertAttemptAllowed(bucketKey: string) {
  const result = await readAttempt(bucketKey);
  if (result.error) return result;
  const lockedUntil = parseTime(result.attempt?.locked_until);
  if (lockedUntil && lockedUntil > Date.now()) {
    return { error: jsonResponse({ error: "admin_session_rate_limited" }, 429), attempt: result.attempt };
  }
  return result;
}

async function recordFailedAttempt(bucketKey: string, workerId: string, previous?: Record<string, unknown> | null) {
  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const previousWindowStarted = parseTime(previous?.window_started_at);
  const inWindow = previousWindowStarted && now - previousWindowStarted < ATTEMPT_WINDOW_MS;
  const failCount = (inWindow ? Number(previous?.fail_count || 0) : 0) + 1;
  const { error } = await supabase
    .from("admin_mutation_attempts")
    .upsert({
      bucket_key: bucketKey,
      worker_id: workerId,
      fail_count: failCount,
      window_started_at: inWindow ? previous?.window_started_at : nowIso,
      locked_until: failCount >= MAX_FAILED_ATTEMPTS ? new Date(now + ATTEMPT_LOCK_MS).toISOString() : null,
      updated_at: nowIso,
    }, { onConflict: "bucket_key" });
  if (error) console.error("admin failed attempt write failed", error);
}

async function clearAttempts(bucketKey: string) {
  const { error } = await supabase
    .from("admin_mutation_attempts")
    .delete()
    .eq("bucket_key", bucketKey);
  if (error) console.error("admin attempt cleanup failed", error);
}

async function createSession(payload: Record<string, unknown>) {
  const workerId = cleanText(payload.workerId, 120);
  const employeeNo = normalizeEmployeeNo(payload.employeeNo);
  const scope = cleanText(payload.scope, 20) === "workPrep" ? "workPrep" : "admin";
  const bucketKey = `worker:${workerId}`;
  const attempt = await assertAttemptAllowed(bucketKey);
  if (attempt.error) return attempt.error;

  const verification = await verifyPrivilegedWorkerCredential(workerId, employeeNo, scope);
  if (verification.error) {
    if (workerId) await recordFailedAttempt(bucketKey, workerId, attempt.attempt);
    return verification.error;
  }

  await clearAttempts(bucketKey);
  const now = Date.now();
  const expiresAt = new Date(now + SESSION_TTL_MS).toISOString();
  const sessionId = randomId("adm");
  const token = await signToken({
    v: 1,
    sid: sessionId,
    workerId,
    scope,
    nonce: randomId("nonce"),
    iat: now,
    exp: now + SESSION_TTL_MS,
  });
  const tokenHash = await sha256(token);
  const { error } = await supabase
    .from("admin_mutation_sessions")
    .insert({
      id: sessionId,
      worker_id: workerId,
      token_hash: tokenHash,
      created_at: new Date(now).toISOString(),
      expires_at: expiresAt,
    });

  if (error) {
    console.error("admin session insert failed", error);
    return jsonResponse({ error: "admin_session_create_failed" }, 500);
  }

  return jsonResponse({
    ok: true,
    session: {
      token,
      workerId,
      expiresAt,
    },
  });
}

async function verifyAdminSession(payload: Record<string, unknown>, requiredScope: "admin" | "workPrep" = "admin") {
  const session = rowObject(payload.adminSession) || {};
  const token = cleanText(session.token, 4096);
  if (!token) return { error: jsonResponse({ error: "admin_session_required" }, 403) };

  let tokenPayload: TokenPayload | null = null;
  try {
    tokenPayload = await readToken(token);
  } catch (error) {
    console.error("admin token verification failed", error);
  }
  if (!tokenPayload) return { error: jsonResponse({ error: "admin_session_invalid" }, 403) };

  const tokenHash = await sha256(token);
  const { data: storedSession, error: sessionError } = await supabase
    .from("admin_mutation_sessions")
    .select("id,worker_id,expires_at,revoked_at")
    .eq("id", tokenPayload.sid)
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (sessionError) {
    console.error("admin session lookup failed", sessionError);
    return { error: jsonResponse({ error: "admin_session_lookup_failed" }, 500) };
  }
  if (
    !storedSession
    || storedSession.worker_id !== tokenPayload.workerId
    || parseTime(storedSession.expires_at) <= Date.now()
    || storedSession.revoked_at
  ) {
    return { error: jsonResponse({ error: "admin_session_invalid" }, 403) };
  }

  const { data: worker, error: workerError } = await supabase
    .from("workers")
    .select("id,name,team,position,active")
    .eq("id", tokenPayload.workerId)
    .eq("active", true)
    .maybeSingle();

  if (workerError) {
    console.error("admin session worker lookup failed", workerError);
    return { error: jsonResponse({ error: "admin_lookup_failed" }, 500) };
  }
  if (!worker) {
    return { error: jsonResponse({ error: "admin_forbidden" }, 403) };
  }
  const tokenScope = tokenPayload.scope || "admin";
  const workerRecord = worker as Record<string, unknown>;
  const allowed = requiredScope === "workPrep"
    ? (tokenScope === "admin" || tokenScope === "workPrep") && canMutateWorkPrep(workerRecord)
    : tokenScope === "admin" && isPrivilegedWorker(workerRecord);
  if (!allowed) {
    return { error: jsonResponse({ error: "admin_forbidden" }, 403) };
  }

  const { error: updateError } = await supabase
    .from("admin_mutation_sessions")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", tokenPayload.sid);
  if (updateError) console.error("admin session touch failed", updateError);

  return { worker: workerRecord, sessionId: tokenPayload.sid };
}

async function revokeSession(payload: Record<string, unknown>) {
  const authorization = await verifyAdminSession(payload, cleanText(payload.key, 80) === "workPrepRecords" ? "workPrep" : "admin");
  if (authorization.error) return authorization.error;
  const { error } = await supabase
    .from("admin_mutation_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", authorization.sessionId);
  if (error) {
    console.error("admin session revoke failed", error);
    return jsonResponse({ error: "admin_session_revoke_failed" }, 500);
  }
  return jsonResponse({ ok: true });
}

async function upsertRows(payload: Record<string, unknown>) {
  const config = ADMIN_TABLES.get(cleanText(payload.key, 80));
  if (!config) return jsonResponse({ error: "unknown_key" }, 400);
  const rows = Array.isArray(payload.rows)
    ? payload.rows.map((row) => cleanRow(config, row)).filter(Boolean) as Record<string, unknown>[]
    : [];
  if (!rows.length) return jsonResponse({ ok: true, mutated: 0 });

  const authorization = await verifyAdminSession(payload, cleanText(payload.key, 80) === "workPrepRecords" ? "workPrep" : "admin");
  if (authorization.error) return authorization.error;

  const { error } = await supabase.from(config.table).upsert(rows, { onConflict: "id" });
  if (error) {
    console.error("admin upsert failed", error);
    return jsonResponse({ error: "admin_upsert_failed" }, 500);
  }
  return jsonResponse({ ok: true, mutated: rows.length });
}

async function deleteRows(payload: Record<string, unknown>) {
  const config = ADMIN_TABLES.get(cleanText(payload.key, 80));
  if (!config) return jsonResponse({ error: "unknown_key" }, 400);
  const ids = cleanIds(payload.ids);
  if (!ids.length) return jsonResponse({ ok: true, mutated: 0 });

  const key = cleanText(payload.key, 80);
  const authorization = await verifyAdminSession(payload, key === "workPrepRecords" ? "workPrep" : "admin");
  if (authorization.error) return authorization.error;

  if (key === "workPrepRecords") {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from(config.table)
      .update({ deleted_at: now, updated_at: now })
      .in("id", ids);
    if (error) {
      console.error("admin work prep soft delete failed", error);
      return jsonResponse({ error: "admin_delete_failed" }, 500);
    }
    return jsonResponse({ ok: true, mutated: ids.length });
  }

  const { error } = await supabase.from(config.table).delete().in("id", ids);
  if (error) {
    console.error("admin delete failed", error);
    return jsonResponse({ error: "admin_delete_failed" }, 500);
  }
  return jsonResponse({ ok: true, mutated: ids.length });
}

async function deleteCategoryCascade(payload: Record<string, unknown>) {
  const categoryId = cleanText(payload.categoryId, 120);
  if (!categoryId) return jsonResponse({ error: "category_required" }, 400);
  const authorization = await verifyAdminSession(payload);
  if (authorization.error) return authorization.error;

  const { data, error } = await supabase.rpc("admin_delete_category_cascade", {
    p_category_id: categoryId,
  });
  if (error) {
    console.error("admin category cascade delete failed", error);
    return jsonResponse({ error: "admin_category_delete_failed" }, 500);
  }
  return jsonResponse({ ok: true, result: data || null });
}

async function deleteSectionCascade(payload: Record<string, unknown>) {
  const sectionId = cleanText(payload.sectionId, 120);
  if (!sectionId) return jsonResponse({ error: "section_required" }, 400);
  const authorization = await verifyAdminSession(payload);
  if (authorization.error) return authorization.error;

  const { data, error } = await supabase.rpc("admin_delete_section_cascade", {
    p_section_id: sectionId,
  });
  if (error) {
    console.error("admin section cascade delete failed", error);
    return jsonResponse({ error: "admin_section_delete_failed" }, 500);
  }
  return jsonResponse({ ok: true, result: data || null });
}

async function deleteIssuePhotos(payload: Record<string, unknown>) {
  const authorization = await verifyAdminSession(payload);
  if (authorization.error) return authorization.error;

  const ids = cleanIds(payload.ids);
  const targetIds = cleanIds(payload.targetIds);
  const targetType = cleanText(payload.targetType || "unsafe_issue", 80);
  if (!ids.length && !targetIds.length) return jsonResponse({ ok: true, mutated: 0 });

  let query = supabase
    .from("issue_photos")
    .select("id,target_type,target_id,storage_bucket,storage_path");
  if (ids.length) query = query.in("id", ids);
  if (targetIds.length) query = query.eq("target_type", targetType).in("target_id", targetIds);

  const { data: photos, error: selectError } = await query;
  if (selectError) {
    console.error("admin photo lookup failed", selectError);
    return jsonResponse({ error: "admin_photo_lookup_failed" }, 500);
  }
  const rows = (photos || []) as Record<string, unknown>[];
  if (!rows.length) return jsonResponse({ ok: true, mutated: 0 });

  const pathsByBucket = new Map<string, string[]>();
  rows.forEach((row) => {
    const bucket = cleanText(row.storage_bucket || "issue-photos", 120);
    const path = cleanText(row.storage_path, 500);
    if (!path) return;
    pathsByBucket.set(bucket, [...(pathsByBucket.get(bucket) || []), path]);
  });

  for (const [bucket, paths] of pathsByBucket.entries()) {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) {
      console.error("admin photo storage delete failed", error);
      return jsonResponse({ error: "admin_photo_storage_delete_failed" }, 500);
    }
  }

  const rowIds = rows.map((row) => cleanText(row.id, 120)).filter(Boolean);
  const { error: deleteError } = await supabase
    .from("issue_photos")
    .delete()
    .in("id", rowIds);
  if (deleteError) {
    console.error("admin photo metadata delete failed", deleteError);
    return jsonResponse({ error: "admin_photo_delete_failed" }, 500);
  }

  return jsonResponse({ ok: true, mutated: rowIds.length });
}

async function uploadPictogramImage(payload: Record<string, unknown>) {
  const pictogramId = cleanText(payload.pictogramId, 120);
  if (!/^[a-zA-Z0-9_-]+$/.test(pictogramId)) return jsonResponse({ error: "invalid_pictogram_id" }, 400);

  const authorization = await verifyAdminSession(payload);
  if (authorization.error) return authorization.error;

  const rawLength = String(payload.dataUrl || "").length;
  if (!rawLength || rawLength > PICTOGRAM_IMAGE_MAX_BYTES * 2) {
    return jsonResponse({ error: "invalid_pictogram_image" }, 413);
  }

  const parsed = parseDataUrl(payload.dataUrl);
  if (!parsed) return jsonResponse({ error: "invalid_pictogram_image" }, 400);

  const extension = PICTOGRAM_IMAGE_MIME_EXTENSIONS.get(parsed.mimeType) || "png";
  const storagePath = `custom/${pictogramId}.${extension}`;
  const { error } = await supabase.storage.from(PICTOGRAM_IMAGE_BUCKET).upload(storagePath, parsed.bytes, {
    upsert: true,
    contentType: parsed.mimeType,
    cacheControl: "3600",
  });

  if (error) {
    console.error("admin pictogram upload failed", error);
    return jsonResponse({ error: "admin_pictogram_upload_failed" }, 500);
  }

  return jsonResponse({
    ok: true,
    image: {
      storageBucket: PICTOGRAM_IMAGE_BUCKET,
      storagePath,
      mimeType: parsed.mimeType,
      fileSize: parsed.bytes.byteLength,
    },
  });
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

  const action = cleanText(payload.action, 80);
  if (action === "createSession") return createSession(payload);
  if (action === "revokeSession") return revokeSession(payload);
  if (action === "upsertRows") return upsertRows(payload);
  if (action === "deleteRows") return deleteRows(payload);
  if (action === "deleteCategoryCascade") return deleteCategoryCascade(payload);
  if (action === "deleteSectionCascade") return deleteSectionCascade(payload);
  if (action === "deleteIssuePhotos") return deleteIssuePhotos(payload);
  if (action === "uploadPictogramImage") return uploadPictogramImage(payload);
  if (action === "ping") return jsonResponse({ ok: true });
  return jsonResponse({ error: "unknown_action" }, 400);
});
