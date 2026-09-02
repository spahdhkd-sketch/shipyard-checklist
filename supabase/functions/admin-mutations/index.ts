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
const WORKER_TEAMS = new Set(["선행", "후행", "관리"]);
const WORKER_POSITIONS = new Set(["작업자", "조장", "반장", "대표", "관리", "총무"]);
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
const BUILT_IN_PICTOGRAM_IDS = new Set([
  "blockAssembly", "weldingWork", "hullPainting", "qualityInspection", "materialStorage",
  "shipDesign", "ncCutting", "curvedBlockProcessing", "steelPlateCutting", "scaffolding",
  "engineInstallation", "craneOperation", "cabinAssembly", "propellerInstallation", "electricalWork",
  "upperModuleInstallation", "materialTransport", "boardingWork", "cutInspection", "curvedBlockInspection",
  "yardTransfer", "namingCeremony", "gasCutting", "anchorInstallation", "hullGrinding",
  "insulationWork", "wasteDisposal", "safetyTraining", "remoteInspection", "ecoPainting",
  "launchPrep", "launchInspection", "seaTrial", "controlRoom", "sonarInstallation",
  "blockTransport", "weldingRobot", "smartLogistics", "environmentalProtection", "safetyGear",
  "pressureTest", "dpInstallation", "dpInspection", "classSurvey", "demoCheck",
  "lcWork", "stInspection", "dlWork",
]);
const LEGACY_PICTOGRAM_ALIASES = new Map([
  ["load", "upperModuleInstallation"],
  ["painting", "hullPainting"],
  ["launching", "launchPrep"],
  ["outfitting", "electricalWork"],
  ["cutting", "steelPlateCutting"],
  ["welding", "weldingWork"],
  ["goliathCrane", "craneOperation"],
  ["weldingMachine", "weldingWork"],
  ["grinder", "hullGrinding"],
  ["airHose", "pressureTest"],
  ["liftingJack", "yardTransfer"],
  ["spanner", "qualityInspection"],
  ["hammer", "steelPlateCutting"],
  ["measuringTool", "cutInspection"],
  ["drill", "ncCutting"],
  ["paintGun", "hullPainting"],
  ["pressureWasher", "pressureTest"],
  ["height", "scaffolding"],
  ["workAtHeights", "scaffolding"],
  ["mounting", "blockAssembly"],
  ["erection", "blockAssembly"],
  ["confined", "safetyGear"],
  ["confinedSpace", "safetyGear"],
  ["inspect", "qualityInspection"],
  ["pressure", "pressureTest"],
  ["fire", "safetyTraining"],
  ["crushingHazard", "safetyTraining"],
  ["fallingObjects", "safetyTraining"],
  ["firePrevention", "safetyTraining"],
  ["chemicalHandling", "wasteDisposal"],
  ["heavyLifting", "upperModuleInstallation"],
  ["hardHat", "safetyGear"],
  ["safetyGlasses", "safetyGear"],
  ["safetyGloves", "safetyGear"],
  ["hearingProtection", "safetyGear"],
  ["fallArrest", "safetyTraining"],
  ["fireAlarm", "safetyTraining"],
  ["W", "weldingWork"],
  ["H", "scaffolding"],
  ["M", "blockAssembly"],
  ["C", "safetyGear"],
]);
const ISSUE_PHOTO_BUCKET = "issue-photos";
const ISSUE_PHOTO_MAX_BYTES = 10 * 1024 * 1024;
const ISSUE_PHOTO_MAX_COUNT = 2;
const ISSUE_PHOTO_SIGNED_URL_TTL_SECONDS = 10 * 60;
const ISSUE_PHOTO_UPLOAD_RESERVATION_TTL_MS = (2 * 60 * 60 + 5 * 60) * 1000;
const WORK_PREP_STATUSES = new Set(["confirmed", "preparing", "ordered", "unregistered", "used"]);
const WORK_PREP_STATUS_LABELS = new Map([
  ["confirmed", "확정"],
  ["preparing", "점검 대기"],
  ["ordered", "작업지시"],
  ["unregistered", "미등록"],
  ["used", "점검 완료"],
]);
const WORK_PREP_LEADER_POSITIONS = new Set(["조장", "반장"]);
const WORK_PREP_PLACE_IDS = new Set([
  "DOCK-1", "DOCK-2", "DOCK-3", "DOCK-4", "DOCK-5", "DOCK-8", "DOCK-9", "DOCK-H",
  "QUAY-M1", "QUAY-M2", "QUAY-M4", "QUAY-M5", "QUAY-M7",
  "QUAY-J1", "QUAY-J2", "QUAY-J5", "QUAY-H1", "QUAY-H2", "QUAY-H3", "QUAY-H4", "QUAY-H5",
]);
const ISSUE_PHOTO_MIME_EXTENSIONS = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/heic", "heic"],
  ["image/heif", "heif"],
]);
const encoder = new TextEncoder();

type MutationScope = "worker" | "workPrep" | "admin";

type TableConfig = {
  table: string;
  columns: Set<string>;
};

type TokenPayload = {
  v: 1;
  sid: string;
  workerId: string;
  scope?: MutationScope;
  nonce: string;
  iat: number;
  exp: number;
};

type AuthorizedMutationSession = {
  worker: Record<string, unknown>;
  sessionId: string;
  scope: MutationScope;
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
      "is_foreign",
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
      "requires_triple_inspection",
      "is_non_routine",
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
      "sign_code",
      "frequency",
      "severity",
      "total_score",
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
      "sort_order",
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
      "worker_id",
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
      "material_type",
      "material_type_label",
      "spec",
      "quantity",
      "unit",
      "detail",
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
  ["workPrepRecords", {
    table: "work_prep_records",
    columns: new Set([
      "id",
      "work_date",
      "appearance_time",
      "team",
      "ship_no",
      "place_id",
      "site_survey_done",
      "category_id",
      "leader_worker_id",
      "worker_ids",
      "other_team_worker_ids",
      "tool_ids",
      "status",
      "status_history",
      "created_at",
      "updated_at",
    ]),
  }],
]);

const WORKER_SUBMIT_KEYS = new Set([
  "unsafeIssues",
  "missingMaterials",
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

function cleanInspectionIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(
    value
      .filter((id): id is string => typeof id === "string")
      .map((id) => id.trim())
      .filter((id) => id.length > 0 && id.length <= 120),
  )];
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

function mutationScope(value: unknown): MutationScope {
  if (value === "worker" || value === "workPrep") return value;
  return "admin";
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

async function verifyWorkerCredential(workerId: string, employeeNo: string, scope: MutationScope = "admin") {
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
  const workerRecord = worker as Record<string, unknown>;
  const allowed = scope === "worker"
    || (scope === "workPrep" && canMutateWorkPrep(workerRecord))
    || (scope === "admin" && isPrivilegedWorker(workerRecord));
  if (!allowed) {
    return { error: jsonResponse({ error: "admin_forbidden" }, 403) };
  }

  return { worker: workerRecord };
}

async function beginMutationAttempt(bucketKey: string, workerId: string) {
  const { data, error } = await supabase.rpc("begin_admin_mutation_attempt", {
    p_bucket_key: bucketKey,
    p_worker_id: workerId,
    p_max_attempts: MAX_FAILED_ATTEMPTS,
    p_window_seconds: Math.floor(ATTEMPT_WINDOW_MS / 1000),
    p_lock_seconds: Math.floor(ATTEMPT_LOCK_MS / 1000),
  });
  if (error) {
    console.error("admin attempt reservation failed", error);
    return { error: jsonResponse({ error: "admin_attempt_reservation_failed" }, 500) };
  }
  const attempt = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | null;
  if (!attempt?.allowed) {
    return { error: jsonResponse({ error: "admin_session_rate_limited" }, 429) };
  }
  return {};
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
  const scope = mutationScope(cleanText(payload.scope, 20));
  const bucketKey = `worker:${workerId}`;
  const attempt = await beginMutationAttempt(bucketKey, workerId);
  if ("error" in attempt) return attempt.error;

  const verification = await verifyWorkerCredential(workerId, employeeNo, scope);
  if (verification.error) return verification.error;

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
      scope,
    },
  });
}

async function verifyMutationSession(payload: Record<string, unknown>, requiredScope: MutationScope = "admin") {
  const session = rowObject(payload.mutationSession) || rowObject(payload.adminSession) || {};
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
  const tokenScope = mutationScope(tokenPayload.scope);
  const workerRecord = worker as Record<string, unknown>;
  const allowed = requiredScope === "worker"
    || (requiredScope === "workPrep"
      && (tokenScope === "admin" || tokenScope === "workPrep")
      && canMutateWorkPrep(workerRecord))
    || (requiredScope === "admin" && tokenScope === "admin" && isPrivilegedWorker(workerRecord));
  if (!allowed) {
    return { error: jsonResponse({ error: "admin_forbidden" }, 403) };
  }

  const { error: updateError } = await supabase
    .from("admin_mutation_sessions")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", tokenPayload.sid);
  if (updateError) console.error("admin session touch failed", updateError);

  return { worker: workerRecord, sessionId: tokenPayload.sid, scope: tokenScope };
}

async function revokeSession(payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload, "worker");
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

function normalizeWorkPrepStatus(value: unknown) {
  const status = cleanText(value, 40);
  return WORK_PREP_STATUSES.has(status) ? status : "";
}

function workPrepCounterpartTeam(value: unknown) {
  const team = cleanText(value, 80);
  if (team === "선행") return "후행";
  if (team === "후행") return "선행";
  return "";
}

function normalizedToolNature(value: unknown) {
  const nature = cleanText(value, 40).replace("선/후행", "선행/후행");
  return nature === "선행" || nature === "후행" || nature === "선행/후행" ? nature : "선행";
}

function toolMatchesWorkPrepCategory(tool: Record<string, unknown>, category: Record<string, unknown>) {
  const toolNature = normalizedToolNature(tool.nature);
  const categoryNature = normalizedToolNature(category.tool_nature);
  if (categoryNature === "선행") return toolNature === "선행" || toolNature === "선행/후행";
  if (categoryNature === "후행") return toolNature === "후행" || toolNature === "선행/후행";
  return true;
}

function workPrepStatusHistory(
  existing: Record<string, unknown> | undefined,
  status: string,
  now: string,
  actorName: string,
  leaderId: string,
  leaderName: string,
) {
  const history = Array.isArray(existing?.status_history) ? existing.status_history.slice(-199) : [];
  if (!existing) {
    return [{
      kind: "register",
      status: WORK_PREP_STATUS_LABELS.get(status) || status,
      changedAt: now,
      actorIds: leaderId ? [leaderId] : [],
      actorLabel: leaderName || actorName,
    }];
  }
  const previous = normalizeWorkPrepStatus(existing.status) || "ordered";
  if (previous === status) return history;
  return [...history, {
    status: WORK_PREP_STATUS_LABELS.get(status) || status,
    memo: `${WORK_PREP_STATUS_LABELS.get(previous) || previous} → ${WORK_PREP_STATUS_LABELS.get(status) || status}`,
    changedAt: now,
    actor: actorName,
  }];
}

async function secureWorkPrepRows(rows: Record<string, unknown>[], authorization: AuthorizedMutationSession) {
  const ids = rows.map((row) => cleanText(row.id, 120));
  const { data: existingData, error: existingError } = await supabase
    .from("work_prep_records")
    .select("id,leader_worker_id,status,status_history,created_at,deleted_at,site_survey_done")
    .in("id", ids);
  if (existingError) {
    console.error("work prep existing lookup failed", existingError);
    return { error: jsonResponse({ error: "work_prep_lookup_failed" }, 500) };
  }
  const existingById = new Map<string, Record<string, unknown>>();
  (existingData || []).forEach((row) => existingById.set(cleanText(row.id, 120), row as Record<string, unknown>));

  const requestedWorkerIds = [...new Set(rows.flatMap((row) => [
    cleanText(row.leader_worker_id, 120),
    ...cleanIds(row.worker_ids),
    ...cleanIds(row.other_team_worker_ids),
  ]).filter(Boolean))];
  const { data: workerData, error: workerError } = requestedWorkerIds.length
    ? await supabase.from("workers").select("id,name,team,position,active").in("id", requestedWorkerIds).eq("active", true)
    : { data: [], error: null };
  if (workerError) {
    console.error("work prep worker lookup failed", workerError);
    return { error: jsonResponse({ error: "work_prep_worker_lookup_failed" }, 500) };
  }
  const workersById = new Map<string, Record<string, unknown>>();
  (workerData || []).forEach((row) => workersById.set(cleanText(row.id, 120), row as Record<string, unknown>));

  const categoryIds = [...new Set(rows.map((row) => cleanText(row.category_id, 120)).filter(Boolean))];
  const { data: categoryData, error: categoryError } = categoryIds.length
    ? await supabase.from("safety_categories").select("id,tool_nature,tool_ids").in("id", categoryIds)
    : { data: [], error: null };
  if (categoryError) {
    console.error("work prep category lookup failed", categoryError);
    return { error: jsonResponse({ error: "work_prep_category_lookup_failed" }, 500) };
  }
  const categoriesById = new Map<string, Record<string, unknown>>();
  (categoryData || []).forEach((row) => categoriesById.set(cleanText(row.id, 120), row as Record<string, unknown>));

  const requestedToolIds = [...new Set(rows.flatMap((row) => cleanIds(row.tool_ids)))];
  const { data: toolData, error: toolError } = requestedToolIds.length
    ? await supabase.from("safety_tools").select("id,name,nature,deleted").in("id", requestedToolIds).eq("deleted", false)
    : { data: [], error: null };
  if (toolError) {
    console.error("work prep tool lookup failed", toolError);
    return { error: jsonResponse({ error: "work_prep_tool_lookup_failed" }, 500) };
  }
  const toolsById = new Map<string, Record<string, unknown>>();
  (toolData || []).forEach((row) => toolsById.set(cleanText(row.id, 120), row as Record<string, unknown>));

  const actorId = cleanText(authorization.worker.id, 120);
  const actorName = cleanText(authorization.worker.name, 180);
  const privileged = isPrivilegedWorker(authorization.worker);
  const now = new Date().toISOString();
  const securedRows: Record<string, unknown>[] = [];
  for (const row of rows) {
    const id = cleanText(row.id, 120);
    const existing = existingById.get(id);
    if (existing?.deleted_at) return { error: jsonResponse({ error: "work_prep_deleted" }, 409) };

    const workDate = cleanText(row.work_date, 10);
    const appearanceTime = cleanText(row.appearance_time, 5) || "15:00";
    const team = cleanText(row.team, 80);
    const shipNo = cleanText(row.ship_no, 120);
    const placeId = cleanText(row.place_id, 40).toUpperCase();
    const siteSurveyDone = privileged && Object.prototype.hasOwnProperty.call(row, "site_survey_done")
      ? row.site_survey_done === true
      : existing?.site_survey_done === true;
    const categoryId = cleanText(row.category_id, 120);
    const leaderId = cleanText(row.leader_worker_id, 120);
    const status = normalizeWorkPrepStatus(row.status);
    const workerIds = cleanIds(row.worker_ids).filter((workerId) => workerId !== leaderId);
    const otherTeamWorkerIds = cleanIds(row.other_team_worker_ids).filter((workerId) => workerId !== leaderId);
    const toolIds = cleanIds(row.tool_ids);
    const leader = workersById.get(leaderId);
    const category = categoriesById.get(categoryId);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(workDate)
      || !/^([01]\d|2[0-3]):[0-5]\d$/.test(appearanceTime)
      || !team || !shipNo || (placeId && !WORK_PREP_PLACE_IDS.has(placeId)) || !category || !leader || !status) {
      return { error: jsonResponse({ error: "work_prep_invalid" }, 400) };
    }
    if (privileged && (!placeId || siteSurveyDone !== true)) {
      return { error: jsonResponse({ error: "work_prep_issue_requirements_missing" }, 400) };
    }
    if (!WORK_PREP_LEADER_POSITIONS.has(cleanText(leader.position, 80)) || cleanText(leader.team, 80) !== team) {
      return { error: jsonResponse({ error: "work_prep_leader_invalid" }, 400) };
    }
    if (!privileged) {
      const existingLeaderId = cleanText(existing?.leader_worker_id, 120);
      if ((existing && existingLeaderId !== actorId) || leaderId !== actorId) {
        return { error: jsonResponse({ error: "work_prep_forbidden" }, 403) };
      }
    }

    const counterpartTeam = workPrepCounterpartTeam(team);
    if (workerIds.some((workerId) => cleanText(workersById.get(workerId)?.team, 80) !== team)
      || otherTeamWorkerIds.some((workerId) => !counterpartTeam || cleanText(workersById.get(workerId)?.team, 80) !== counterpartTeam)) {
      return { error: jsonResponse({ error: "work_prep_workers_invalid" }, 400) };
    }

    const categoryToolIds = cleanIds(category.tool_ids);
    const allowedToolIds = new Set([...toolsById.values()]
      .filter((tool) => toolMatchesWorkPrepCategory(tool, category))
      .filter((tool) => !categoryToolIds.length || categoryToolIds.includes(cleanText(tool.id, 120)))
      .map((tool) => cleanText(tool.id, 120)));
    if (toolIds.some((toolId) => !allowedToolIds.has(toolId))) {
      return { error: jsonResponse({ error: "work_prep_tools_invalid" }, 400) };
    }

    securedRows.push({
      id,
      work_date: workDate,
      appearance_time: appearanceTime,
      team,
      ship_no: shipNo,
      place_id: placeId || null,
      site_survey_done: siteSurveyDone,
      category_id: categoryId,
      leader_worker_id: leaderId,
      worker_ids: workerIds,
      other_team_worker_ids: otherTeamWorkerIds,
      tool_ids: toolIds,
      status: existing ? status : "preparing",
      status_history: workPrepStatusHistory(
        existing,
        existing ? status : "preparing",
        now,
        actorName,
        leaderId,
        cleanText(leader.name, 180),
      ),
      created_at: existing?.created_at || now,
      updated_at: now,
    });
  }
  return { rows: securedRows };
}

async function updateWorkPrepStatus(payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload, "workPrep");
  if (authorization.error) return authorization.error;

  const recordId = cleanText(payload.recordId, 120);
  const status = normalizeWorkPrepStatus(payload.status);
  if (!recordId || !status) return jsonResponse({ error: "work_prep_status_invalid" }, 400);

  const { data: existing, error: existingError } = await supabase
    .from("work_prep_records")
    .select("id,leader_worker_id,status,status_history,deleted_at")
    .eq("id", recordId)
    .maybeSingle();
  if (existingError) {
    console.error("work prep status lookup failed", existingError);
    return jsonResponse({ error: "work_prep_lookup_failed" }, 500);
  }
  if (!existing) return jsonResponse({ error: "work_prep_not_found" }, 404);
  if (existing.deleted_at) return jsonResponse({ error: "work_prep_deleted" }, 409);

  const actor = (authorization as AuthorizedMutationSession).worker;
  const actorId = cleanText(actor.id, 120);
  const actorName = cleanText(actor.name, 180);
  const leaderId = cleanText(existing.leader_worker_id, 120);
  if (!isPrivilegedWorker(actor) && leaderId !== actorId) {
    return jsonResponse({ error: "work_prep_forbidden" }, 403);
  }

  const now = new Date().toISOString();
  const statusHistory = workPrepStatusHistory(existing, status, now, actorName, leaderId, "");
  const { data, error } = await supabase
    .from("work_prep_records")
    .update({ status, status_history: statusHistory, updated_at: now })
    .eq("id", recordId)
    .is("deleted_at", null)
    .select("id,status,status_history,updated_at")
    .maybeSingle();
  if (error) {
    console.error("work prep status update failed", error);
    return jsonResponse({ error: "work_prep_status_update_failed" }, 500);
  }
  if (!data) return jsonResponse({ error: "work_prep_not_found" }, 404);
  return jsonResponse({ ok: true, mutated: 1, result: data });
}

async function upsertRows(payload: Record<string, unknown>) {
  const key = cleanText(payload.key, 80);
  const config = ADMIN_TABLES.get(key);
  if (!config) return jsonResponse({ error: "unknown_key" }, 400);
  const rows = Array.isArray(payload.rows)
    ? payload.rows.map((row) => cleanRow(config, row)).filter(Boolean) as Record<string, unknown>[]
    : [];
  if (!rows.length) return jsonResponse({ ok: true, mutated: 0 });

  const authorization = await verifyMutationSession(payload, key === "workPrepRecords" ? "workPrep" : "admin");
  if (authorization.error) return authorization.error;

  let securedRows = rows;
  if (key === "workPrepRecords") {
    const secured = await secureWorkPrepRows(rows, authorization as AuthorizedMutationSession);
    if ("error" in secured) return secured.error;
    securedRows = secured.rows;
  }

  if (key === "categories") {
    const validated = await validateCategoryIcons(rows);
    if ("error" in validated) return validated.error;
    const actorWorkerId = cleanText((authorization as AuthorizedMutationSession).worker.id, 120);
    const { data, error } = await supabase.rpc("upsert_safety_categories_with_history", {
      p_rows: validated.rows,
      p_actor_worker_id: actorWorkerId,
    });
    if (error) {
      console.error("category upsert with history failed", error);
      return jsonResponse({ error: "admin_upsert_failed" }, 500);
    }
    return jsonResponse({ ok: true, mutated: Number(data || validated.rows.length) });
  }

  if (key === "pictograms") {
    let mutated = 0;
    for (const row of rows) {
      const id = cleanText(row.id, 120);
      const label = cleanText(row.label, 180);
      const sortOrder = Math.max(0, Math.min(100000, Number(row.sort_order) || 0));
      if (!/^[a-zA-Z0-9_-]+$/.test(id) || !label) {
        return jsonResponse({ error: "invalid_pictogram_metadata" }, 400);
      }
      const { data, error } = await supabase
        .from("safety_pictograms")
        .update({ label, sort_order: sortOrder, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("source", "custom")
        .eq("deleted", false)
        .select("id");
      if (error || !data?.length) {
        console.error("admin pictogram metadata update failed", error);
        return jsonResponse({ error: "admin_upsert_failed" }, error ? 500 : 404);
      }
      mutated += data.length;
    }
    return jsonResponse({ ok: true, mutated });
  }

  if (key === "workers") {
    let mutated = 0;
    for (const row of securedRows) {
      const id = cleanText(row.id, 120);
      const { data, error } = await supabase
        .from("workers")
        .update({
          name: row.name,
          team: row.team,
          position: row.position,
          is_foreign: Boolean(row.is_foreign),
          unsafe_push_target: row.unsafe_push_target,
          updated_at: row.updated_at,
        })
        .eq("id", id)
        .eq("active", true)
        .select("id");
      if (error) {
        console.error("worker profile update failed", error);
        return jsonResponse({ error: "admin_upsert_failed" }, 500);
      }
      mutated += data?.length || 0;
    }
    return jsonResponse({ ok: true, mutated });
  }

  const { error } = await supabase.from(config.table).upsert(securedRows, { onConflict: "id" });
  if (error) {
    console.error("admin upsert failed", error);
    return jsonResponse({ error: "admin_upsert_failed" }, 500);
  }
  return jsonResponse({ ok: true, mutated: securedRows.length });
}

function canonicalPictogramId(value: unknown) {
  const id = cleanText(value, 120);
  return LEGACY_PICTOGRAM_ALIASES.get(id) || id;
}

async function validateCategoryIcons(rows: Record<string, unknown>[]) {
  const normalizedRows = rows.map((row) => ({ ...row, icon: canonicalPictogramId(row.icon) }));
  const customIds = [...new Set(normalizedRows
    .map((row) => cleanText(row.icon, 120))
    .filter((id) => id && !BUILT_IN_PICTOGRAM_IDS.has(id)))];
  if (!customIds.length) return { rows: normalizedRows };

  const { data, error } = await supabase
    .from("safety_pictograms")
    .select("id")
    .in("id", customIds)
    .eq("source", "custom")
    .eq("deleted", false);
  if (error) {
    console.error("category pictogram validation failed", error);
    return { error: jsonResponse({ error: "category_icon_validation_failed" }, 500) };
  }
  const validIds = new Set((data || []).map((row) => cleanText(row.id, 120)));
  if (customIds.some((id) => !validIds.has(id))) {
    return { error: jsonResponse({ error: "category_icon_invalid" }, 400) };
  }
  return { rows: normalizedRows };
}

async function createWorker(payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload, "admin");
  if (authorization.error) return authorization.error;

  const worker = rowObject(payload.worker) || {};
  const id = cleanText(worker.id, 120);
  const name = cleanText(worker.name, 180);
  const team = cleanText(worker.team, 40);
  const position = cleanText(worker.position, 40);
  const employeeNo = cleanText(worker.employeeNo, 40);
  const isForeign = Boolean(worker.isForeign);
  if (!/^worker_[A-Za-z0-9_-]{8,110}$/.test(id) || !name || !WORKER_TEAMS.has(team) || !WORKER_POSITIONS.has(position)) {
    return jsonResponse({ error: "worker_profile_invalid" }, 400);
  }
  if (!/^[A-Za-z0-9_-]{4,40}$/.test(employeeNo)) {
    return jsonResponse({ error: "worker_employee_no_invalid" }, 400);
  }

  const now = new Date().toISOString();
  const row = {
    id,
    name,
    team,
    position,
    employee_no: employeeNo,
    active: true,
    is_foreign: isForeign,
    unsafe_push_target: false,
    created_at: now,
    updated_at: now,
  };
  const { data, error } = await supabase
    .from("workers")
    .insert(row)
    .select("id,name,team,position,active,is_foreign,unsafe_push_target,created_at,updated_at")
    .single();
  if (error) {
    console.error("worker create failed", { code: error.code });
    if (error.code === "23505") {
      const { data: existing } = await supabase
        .from("workers")
        .select("id,name,team,position,active,is_foreign,unsafe_push_target,created_at,updated_at")
        .eq("id", id)
        .eq("employee_no", employeeNo)
        .eq("name", name)
        .eq("team", team)
        .eq("position", position)
        .maybeSingle();
      if (existing) {
        return jsonResponse({
          ok: true,
          worker: {
            id: existing.id,
            name: existing.name,
            team: existing.team || "",
            position: existing.position || "작업자",
            active: existing.active !== false,
            isForeign: Boolean(existing.is_foreign),
            unsafePushTarget: Boolean(existing.unsafe_push_target),
            createdAt: existing.created_at,
            updatedAt: existing.updated_at,
          },
        });
      }
      return jsonResponse({ error: "worker_employee_no_exists" }, 409);
    }
    return jsonResponse({ error: "worker_create_failed" }, 500);
  }

  return jsonResponse({
    ok: true,
    worker: {
      id: data.id,
      name: data.name,
      team: data.team || "",
      position: data.position || "작업자",
      active: data.active !== false,
      isForeign: Boolean(data.is_foreign),
      unsafePushTarget: Boolean(data.unsafe_push_target),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
  });
}

async function deleteWorker(payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload, "admin");
  if (authorization.error) return authorization.error;

  const workerId = cleanText(payload.workerId, 120);
  if (!/^[A-Za-z0-9_-]{1,120}$/.test(workerId)) {
    return jsonResponse({ error: "worker_id_invalid" }, 400);
  }
  const actorWorkerId = cleanText((authorization as AuthorizedMutationSession).worker.id, 120);
  const actorSessionId = cleanText((authorization as AuthorizedMutationSession).sessionId, 120);
  const { data, error } = await supabase.rpc("admin_deactivate_worker", {
    p_worker_id: workerId,
    p_actor_worker_id: actorWorkerId,
    p_actor_session_id: actorSessionId,
  });
  if (error) {
    console.error("worker delete failed", { code: error.code });
    return jsonResponse({ error: "worker_delete_failed" }, 500);
  }
  const result = rowObject(data) || {};
  if (result.error === "worker_self_delete_forbidden") {
    return jsonResponse({ error: "worker_self_delete_forbidden" }, 409);
  }
  if (result.error === "admin_session_invalid") {
    return jsonResponse({ error: "admin_session_invalid" }, 403);
  }
  return jsonResponse({
    ok: true,
    workerId,
    mutated: Number(result.mutated || 0),
  });
}

function safeCreatedAt(value: unknown, fallback: string) {
  const timestamp = parseTime(value);
  if (!timestamp || timestamp > Date.now() + 5 * 60 * 1000) return fallback;
  return new Date(timestamp).toISOString();
}

function initialStatusHistory(status: string, createdAt: string, workerName: string) {
  return [{ status, memo: "", changedAt: createdAt, actor: workerName }];
}

function cleanInspectionTools(value: unknown) {
  return (Array.isArray(value) ? value : []).slice(0, 100).map((item) => {
    const row = rowObject(item) || {};
    return { id: cleanText(row.id, 120) };
  }).filter((item) => item.id);
}

async function submitInspection(payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload, "worker");
  if (authorization.error) return authorization.error;
  const workerId = cleanText(authorization.worker?.id, 120);
  const workerName = cleanText(authorization.worker?.name, 180);
  const inspectionConfig = ADMIN_TABLES.get("inspections");
  const itemConfig = ADMIN_TABLES.get("inspectionItems");
  if (!inspectionConfig || !itemConfig) return jsonResponse({ error: "inspection_config_missing" }, 500);

  const inspection = cleanRow(inspectionConfig, payload.inspection) as Record<string, unknown> | null;
  const rawItems = (Array.isArray(payload.items) ? payload.items : []).slice(0, 500).map(rowObject);
  if (rawItems.some((item) => !item || typeof item.checked !== "boolean")) {
    return jsonResponse({ error: "inspection_item_checked_invalid" }, 400);
  }
  const items = rawItems.map((row) => cleanRow(itemConfig, row)).filter(Boolean) as Record<string, unknown>[];
  const inspectionId = cleanText(inspection?.id, 120);
  if (!inspection || !inspectionId || !items.length) {
    return jsonResponse({ error: "inspection_payload_required" }, 400);
  }
  if (items.some((item) => cleanText(item.inspection_id, 120) !== inspectionId)) {
    return jsonResponse({ error: "inspection_item_mismatch" }, 400);
  }

  const workPrepRecordId = cleanText(inspection.work_prep_record_id, 120);
  const securedInspection = {
    id: inspectionId,
    category_id: cleanText(inspection.category_id, 120),
    worker_id: workerId,
    worker: workerName,
    ship_no: cleanText(inspection.ship_no, 120),
    tools: cleanInspectionTools(inspection.tools),
    safety_pledge: cleanText(inspection.safety_pledge, 12000),
    work_prep_record_id: workPrepRecordId,
    work_prep_worker_id: workerId,
  };
  const securedItems = items.map((item) => ({
    id: cleanText(item.id, 120),
    inspection_id: inspectionId,
    item_id: cleanText(item.item_id, 120),
    checked: item.checked,
  }));
  if (securedItems.some((item) => !item.id || !item.item_id)) {
    return jsonResponse({ error: "inspection_item_identity_required" }, 400);
  }

  const { data, error } = await supabase.rpc("submit_worker_inspection", {
    p_inspection: securedInspection,
    p_items: securedItems,
  });
  if (error) {
    console.error("worker inspection submit failed", error);
    const message = cleanText(error.message, 500).toLowerCase();
    if (message.includes("inspection master changed") || message.includes("master section invalid")) {
      return jsonResponse({ error: "inspection_master_changed" }, 409);
    }
    if (message.includes("inspection conflict")) {
      return jsonResponse({ error: "inspection_conflict" }, 409);
    }
    if (message.includes("already submitted")) {
      return jsonResponse({ error: "inspection_already_submitted" }, 409);
    }
    if (message.includes("not started")) {
      return jsonResponse({ error: "inspection_not_started" }, 409);
    }
    if (message.includes("participant") || message.includes("owner mismatch") || message.includes("forbidden")) {
      return jsonResponse({ error: "worker_inspection_forbidden" }, 403);
    }
    if (/required|invalid|mismatch|unique|category|ship|tool|section|high-risk/.test(message)) {
      return jsonResponse({ error: "worker_inspection_rejected" }, 400);
    }
    return jsonResponse({ error: "worker_inspection_submit_failed" }, 500);
  }
  return jsonResponse({ ok: true, result: data || null, mutated: 1 + securedItems.length });
}

async function submitRows(payload: Record<string, unknown>) {
  const key = cleanText(payload.key, 80);
  if (!WORKER_SUBMIT_KEYS.has(key)) return jsonResponse({ error: "unknown_worker_submit_key" }, 400);
  const config = ADMIN_TABLES.get(key);
  if (!config) return jsonResponse({ error: "unknown_key" }, 400);

  const authorization = await verifyMutationSession(payload, "worker");
  if (authorization.error) return authorization.error;
  const workerId = cleanText(authorization.worker?.id, 120);
  const workerName = cleanText(authorization.worker?.name, 180);
  const workerTeam = cleanText(authorization.worker?.team, 180);
  const rows = Array.isArray(payload.rows)
    ? payload.rows.slice(0, 500).map((row) => cleanRow(config, row)).filter(Boolean) as Record<string, unknown>[]
    : [];
  if (!rows.length) return jsonResponse({ ok: true, mutated: 0 });

  const now = new Date().toISOString();
  const securedRows = rows.map((row) => {
    const createdAt = safeCreatedAt(row.created_at, now);
    const status = "접수";
    const base = {
      ...row,
      ship_no: cleanText(row.ship_no, 120),
      worker_id: workerId,
      worker_name_snapshot: workerName,
      worker_team_snapshot: workerTeam,
      status,
      admin_memo: "",
      created_at: createdAt,
      updated_at: createdAt,
      completed_at: null,
      status_history: initialStatusHistory(status, createdAt, workerName),
    };
    if (key === "unsafeIssues") {
      return { ...base, content: cleanText(row.content, 4000) };
    }
    return {
      ...base,
      material_name: cleanText(row.material_name, 240),
      content: cleanText(row.content, 4000),
      material_type: cleanText(row.material_type, 80),
      material_type_label: cleanText(row.material_type_label, 120),
      spec: cleanText(row.spec, 240),
      quantity: cleanText(row.quantity, 80),
      unit: cleanText(row.unit, 40) || "EA",
      detail: cleanText(row.detail, 2000),
    };
  });
  if (securedRows.some((row) => !cleanText(row.ship_no, 120) || !cleanText(row.content, 4000))) {
    return jsonResponse({ error: "worker_submit_required_fields" }, 400);
  }
  if (key === "missingMaterials" && securedRows.some((row) => !cleanText(row.material_name, 240))) {
    return jsonResponse({ error: "worker_submit_material_required" }, 400);
  }

  const { error } = await supabase
    .from(config.table)
    .upsert(securedRows, { onConflict: "id", ignoreDuplicates: true });
  if (error) {
    console.error("worker submit failed", error);
    return jsonResponse({ error: "worker_submit_failed" }, 500);
  }
  return jsonResponse({ ok: true, mutated: securedRows.length });
}

async function issuePhotoAuthorization(targetId: string, payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload, "worker");
  if (authorization.error) return authorization;
  const { data: issue, error } = await supabase
    .from("unsafe_issues")
    .select("id,worker_id")
    .eq("id", targetId)
    .maybeSingle();
  if (error) {
    console.error("unsafe issue ownership lookup failed", error);
    return { error: jsonResponse({ error: "unsafe_issue_lookup_failed" }, 500) };
  }
  if (!issue) return { error: jsonResponse({ error: "unsafe_issue_not_found" }, 404) };
  const ownsIssue = cleanText(issue.worker_id, 120) === cleanText(authorization.worker?.id, 120);
  if (!ownsIssue && authorization.scope !== "admin") {
    return { error: jsonResponse({ error: "unsafe_issue_forbidden" }, 403) };
  }
  return authorization;
}

async function releaseIssuePhotoReservation(photo: Record<string, unknown>) {
  const photoId = cleanText(photo.id, 120);
  if (!photoId) return false;
  const { data: claimed, error: claimError } = await supabase
    .from("issue_photos")
    .delete()
    .eq("id", photoId)
    .eq("storage_bucket", ISSUE_PHOTO_BUCKET)
    .eq("upload_status", "pending")
    .select("id,storage_bucket,storage_path")
    .maybeSingle();
  if (claimError) {
    console.error("issue photo reservation release failed", claimError);
    return false;
  }
  if (!claimed) return false;
  const storagePath = cleanText(claimed.storage_path, 500);
  if (!storagePath.startsWith("unsafe/")) return true;
  const { error } = await supabase.storage.from(ISSUE_PHOTO_BUCKET).remove([storagePath]);
  if (error) console.error("issue photo reserved object cleanup failed", error);
  return !error;
}

async function cleanupExpiredIssuePhotoReservations(targetId: string) {
  const now = new Date().toISOString();
  const { data: expired, error } = await supabase
    .from("issue_photos")
    .select("id,storage_bucket,storage_path")
    .eq("target_type", "unsafe_issue")
    .eq("target_id", targetId)
    .eq("upload_status", "pending")
    .lt("upload_expires_at", now);
  if (error) {
    console.error("issue photo expired reservation lookup failed", error);
    return;
  }
  for (const photo of expired || []) await releaseIssuePhotoReservation(photo);
}

async function reserveIssuePhotoSlot(targetId: string, workerId: string, extension: string) {
  await cleanupExpiredIssuePhotoReservations(targetId);
  const createdAt = new Date().toISOString();
  const uploadExpiresAt = new Date(Date.now() + ISSUE_PHOTO_UPLOAD_RESERVATION_TTL_MS).toISOString();
  for (let sortOrder = 1; sortOrder <= ISSUE_PHOTO_MAX_COUNT; sortOrder += 1) {
    const photoId = randomId("photo");
    const storagePath = ["unsafe", workerId, targetId, randomId("upload") + "." + extension].join("/");
    const reservation = {
      id: photoId,
      target_type: "unsafe_issue",
      target_id: targetId,
      storage_bucket: ISSUE_PHOTO_BUCKET,
      storage_path: storagePath,
      sort_order: sortOrder,
      upload_status: "pending",
      upload_expires_at: uploadExpiresAt,
      created_at: createdAt,
    };
    const { data, error } = await supabase
      .from("issue_photos")
      .insert(reservation)
      .select("id,target_type,target_id,storage_bucket,storage_path,sort_order,upload_status,upload_expires_at,created_at")
      .maybeSingle();
    if (!error && data) return { photo: data as Record<string, unknown> };
    if (error?.code !== "23505") {
      console.error("issue photo slot reservation failed", error);
      return { error: jsonResponse({ error: "issue_photo_reservation_failed" }, 500) };
    }
  }
  return { error: jsonResponse({ error: "issue_photo_limit" }, 409) };
}

async function createIssuePhotoUpload(payload: Record<string, unknown>) {
  const targetId = cleanText(payload.targetId, 120);
  const mimeType = cleanText(payload.mimeType, 120).toLowerCase();
  const fileSize = Number(payload.fileSize) || 0;
  const extension = ISSUE_PHOTO_MIME_EXTENSIONS.get(mimeType);
  if (!targetId || !extension || fileSize <= 0 || fileSize > ISSUE_PHOTO_MAX_BYTES) {
    return jsonResponse({ error: "issue_photo_invalid" }, 400);
  }
  const authorization = await issuePhotoAuthorization(targetId, payload);
  if (authorization.error) return authorization.error;

  const workerId = cleanText(authorization.worker?.id, 120);
  const reservation = await reserveIssuePhotoSlot(targetId, workerId, extension);
  if ("error" in reservation) return reservation.error;
  const photo = reservation.photo;
  const storagePath = cleanText(photo.storage_path, 500);
  const { data, error } = await supabase.storage
    .from(ISSUE_PHOTO_BUCKET)
    .createSignedUploadUrl(storagePath, { upsert: false });
  if (error || !data?.token) {
    console.error("issue photo signed upload create failed", error);
    await releaseIssuePhotoReservation(photo);
    return jsonResponse({ error: "issue_photo_upload_url_failed" }, 500);
  }
  return jsonResponse({
    ok: true,
    upload: {
      photoId: cleanText(photo.id, 120),
      bucket: ISSUE_PHOTO_BUCKET,
      path: storagePath,
      token: data.token,
    },
  });
}

async function issuePhotoCompletionResponse(photo: Record<string, unknown>) {
  const storagePath = cleanText(photo.storage_path, 500);
  const { data: signed, error: signedError } = await supabase.storage
    .from(ISSUE_PHOTO_BUCKET)
    .createSignedUrl(storagePath, ISSUE_PHOTO_SIGNED_URL_TTL_SECONDS);
  if (signedError) console.error("issue photo signed URL create failed after completion", signedError);
  return jsonResponse({
    ok: true,
    photo: {
      ...photo,
      signed_url: signed?.signedUrl || "",
      signed_url_expires_at: signed?.signedUrl
        ? new Date(Date.now() + ISSUE_PHOTO_SIGNED_URL_TTL_SECONDS * 1000).toISOString()
        : "",
    },
  });
}

async function completeIssuePhotoUpload(payload: Record<string, unknown>) {
  const targetId = cleanText(payload.targetId, 120);
  const photoId = cleanText(payload.photoId, 120);
  const storagePath = cleanText(payload.storagePath, 500);
  if (!targetId || !photoId || !storagePath) return jsonResponse({ error: "issue_photo_required" }, 400);
  const authorization = await issuePhotoAuthorization(targetId, payload);
  if (authorization.error) return authorization.error;
  const workerId = cleanText(authorization.worker?.id, 120);
  if (!storagePath.startsWith(`unsafe/${workerId}/${targetId}/`) && authorization.scope !== "admin") {
    return jsonResponse({ error: "issue_photo_path_forbidden" }, 403);
  }

  const { data: reservation, error: reservationError } = await supabase
    .from("issue_photos")
    .select("id,target_type,target_id,storage_bucket,storage_path,sort_order,upload_status,upload_expires_at,created_at")
    .eq("id", photoId)
    .eq("target_type", "unsafe_issue")
    .eq("target_id", targetId)
    .eq("storage_bucket", ISSUE_PHOTO_BUCKET)
    .eq("storage_path", storagePath)
    .eq("upload_status", "pending")
    .maybeSingle();
  if (reservationError) return jsonResponse({ error: "issue_photo_reservation_lookup_failed" }, 500);
  if (!reservation) {
    const { data: completed, error: completedError } = await supabase
      .from("issue_photos")
      .select("id,target_type,target_id,storage_bucket,storage_path,sort_order,created_at")
      .eq("id", photoId)
      .eq("target_type", "unsafe_issue")
      .eq("target_id", targetId)
      .eq("storage_bucket", ISSUE_PHOTO_BUCKET)
      .eq("storage_path", storagePath)
      .eq("upload_status", "ready")
      .maybeSingle();
    if (completedError) return jsonResponse({ error: "issue_photo_reservation_lookup_failed" }, 500);
    return completed
      ? issuePhotoCompletionResponse(completed)
      : jsonResponse({ error: "issue_photo_reservation_missing" }, 409);
  }
  if (parseTime(reservation.upload_expires_at) <= Date.now()) {
    await releaseIssuePhotoReservation(reservation);
    return jsonResponse({ error: "issue_photo_reservation_expired" }, 410);
  }

  const pathSeparator = storagePath.lastIndexOf("/");
  if (pathSeparator <= 0 || pathSeparator >= storagePath.length - 1) {
    return jsonResponse({ error: "issue_photo_path_invalid" }, 400);
  }
  const storageFolder = storagePath.slice(0, pathSeparator);
  const objectName = storagePath.slice(pathSeparator + 1);
  const { data: objects, error: objectError } = await supabase.storage
    .from(ISSUE_PHOTO_BUCKET)
    .list(storageFolder, { limit: 10, search: objectName });
  const object = (objects || []).find((candidate) => candidate.name === objectName);
  if (objectError || !object) return jsonResponse({ error: "issue_photo_object_missing" }, 400);

  const { data: photo, error: completeError } = await supabase
    .from("issue_photos")
    .update({ upload_status: "ready", upload_expires_at: null })
    .eq("id", photoId)
    .eq("upload_status", "pending")
    .select("id,target_type,target_id,storage_bucket,storage_path,sort_order,created_at")
    .maybeSingle();
  if (completeError || !photo) {
    console.error("issue photo reservation completion failed", completeError);
    return jsonResponse({ error: "issue_photo_complete_failed" }, 500);
  }
  return issuePhotoCompletionResponse(photo);
}

async function listIssuePhotos(payload: Record<string, unknown>) {
  const targetId = cleanText(payload.targetId, 120);
  if (!targetId) return jsonResponse({ error: "issue_photo_target_required" }, 400);
  const authorization = await verifyMutationSession(payload, "worker");
  if (authorization.error) return authorization.error;
  const { data: photos, error } = await supabase
    .from("issue_photos")
    .select("id,target_type,target_id,storage_bucket,storage_path,sort_order,created_at")
    .eq("target_type", "unsafe_issue")
    .eq("target_id", targetId)
    .eq("storage_bucket", ISSUE_PHOTO_BUCKET)
    .eq("upload_status", "ready")
    .order("sort_order", { ascending: true })
    .limit(ISSUE_PHOTO_MAX_COUNT);
  if (error) return jsonResponse({ error: "issue_photo_list_failed" }, 500);

  const expiresAt = new Date(Date.now() + ISSUE_PHOTO_SIGNED_URL_TTL_SECONDS * 1000).toISOString();
  const signedPhotos = [];
  for (const photo of photos || []) {
    const { data, error: signedError } = await supabase.storage
      .from(cleanText(photo.storage_bucket, 120) || ISSUE_PHOTO_BUCKET)
      .createSignedUrl(cleanText(photo.storage_path, 500), ISSUE_PHOTO_SIGNED_URL_TTL_SECONDS);
    if (signedError || !data?.signedUrl) {
      console.error("issue photo signed URL create failed", signedError);
      return jsonResponse({ error: "issue_photo_sign_failed" }, 500);
    }
    signedPhotos.push({ ...photo, signed_url: data.signedUrl, signed_url_expires_at: expiresAt });
  }
  return jsonResponse({ ok: true, photos: signedPhotos });
}

async function deleteInspectionIds(ids: string[], mutated = ids.length) {
  if (!ids.length) return jsonResponse({ ok: true, mutated, result: [] });
  const { data, error } = await supabase.rpc("delete_safety_inspection_history", {
    p_ids: ids,
  });
  if (error) {
    console.error("admin inspection history delete failed", error);
    return jsonResponse({ error: "admin_inspection_delete_failed" }, 500);
  }
  return jsonResponse({ ok: true, mutated, result: data || [] });
}

async function deleteInspectionHistory(payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload);
  if (authorization.error) return authorization.error;
  const ids = cleanInspectionIds(payload.ids);
  return deleteInspectionIds(ids);
}

async function deleteAllInspectionHistory(payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload);
  if (authorization.error) return authorization.error;

  const { data, error } = await supabase.rpc("delete_all_safety_inspection_history");
  if (error) {
    console.error("admin all inspection history delete failed", error);
    return jsonResponse({ error: "admin_inspection_delete_all_failed" }, 500);
  }
  return jsonResponse({
    ok: true,
    mutated: Array.isArray(data) ? data.length : 0,
    result: data || [],
  });
}

async function deleteRows(payload: Record<string, unknown>) {
  const key = cleanText(payload.key, 80);
  const config = ADMIN_TABLES.get(key);
  if (!config) return jsonResponse({ error: "unknown_key" }, 400);
  const ids = key === "inspections" || key === "inspectionItems"
    ? cleanInspectionIds(payload.ids)
    : cleanIds(payload.ids);
  if (!ids.length) return jsonResponse({ ok: true, mutated: 0 });

  const authorization = await verifyMutationSession(payload, key === "workPrepRecords" ? "workPrep" : "admin");
  if (authorization.error) return authorization.error;

  if (key === "inspections") return deleteInspectionIds(ids);

  if (key === "inspectionItems") {
    const parentIds: string[] = [];
    for (let offset = 0; offset < ids.length; offset += 200) {
      const { data: items, error: lookupError } = await supabase
        .from("safety_inspection_items")
        .select("inspection_id")
        .in("id", ids.slice(offset, offset + 200));
      if (lookupError) {
        console.error("admin inspection item parent lookup failed", lookupError);
        return jsonResponse({ error: "admin_inspection_item_lookup_failed" }, 500);
      }
      (items || []).forEach((item) => parentIds.push(item.inspection_id));
    }
    const inspectionIds = cleanInspectionIds(parentIds);
    return deleteInspectionIds(inspectionIds, ids.length);
  }

  if (key === "workPrepRecords") {
    const { data: records, error: lookupError } = await supabase
      .from(config.table)
      .select("id,leader_worker_id,deleted_at")
      .in("id", ids);
    if (lookupError) {
      console.error("work prep delete lookup failed", lookupError);
      return jsonResponse({ error: "work_prep_lookup_failed" }, 500);
    }
    const worker = authorization.worker as Record<string, unknown>;
    const workerId = cleanText(worker.id, 120);
    if (!isPrivilegedWorker(worker)
      && (records || []).some((record) => cleanText(record.leader_worker_id, 120) !== workerId)) {
      return jsonResponse({ error: "work_prep_forbidden" }, 403);
    }
    const now = new Date().toISOString();
    const { data: deleted, error } = await supabase
      .from(config.table)
      .update({ deleted_at: now, updated_at: now })
      .in("id", ids)
      .is("deleted_at", null)
      .select("id");
    if (error) {
      console.error("admin work prep soft delete failed", error);
      return jsonResponse({ error: "admin_delete_failed" }, 500);
    }
    return jsonResponse({ ok: true, mutated: (deleted || []).length });
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
  const authorization = await verifyMutationSession(payload);
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
  const authorization = await verifyMutationSession(payload);
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
  const authorization = await verifyMutationSession(payload);
  if (authorization.error) return authorization.error;

  const ids = cleanIds(payload.ids);
  const targetIds = cleanIds(payload.targetIds);
  const targetType = cleanText(payload.targetType || "unsafe_issue", 80);
  if (!ids.length && !targetIds.length) return jsonResponse({ ok: true, mutated: 0 });

  let query = supabase
    .from("issue_photos")
    .select("id,target_type,target_id,storage_bucket,storage_path")
    .eq("storage_bucket", ISSUE_PHOTO_BUCKET)
    .like("storage_path", "unsafe/%");
  if (ids.length) query = query.in("id", ids);
  if (targetIds.length) query = query.eq("target_type", targetType).in("target_id", targetIds);

  const { data: photos, error: selectError } = await query;
  if (selectError) {
    console.error("admin photo lookup failed", selectError);
    return jsonResponse({ error: "admin_photo_lookup_failed" }, 500);
  }
  const rows = (photos || []) as Record<string, unknown>[];
  if (!rows.length) return jsonResponse({ ok: true, mutated: 0 });

  const paths = rows.flatMap((row) => {
    const path = cleanText(row.storage_path, 500);
    return path.startsWith("unsafe/") ? [path] : [];
  });

  if (paths.length) {
    const { error } = await supabase.storage.from(ISSUE_PHOTO_BUCKET).remove(paths);
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

const SAFETY_SETTING_VERSION_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;
const SAFETY_SETTING_STATUSES = new Set(["draft", "review", "published"]);
const SAFETY_SETTING_COLUMNS = [
  "config_version",
  "lifecycle_status",
  "effective_at",
  "change_summary",
  "settings",
  "authored_by",
  "authored_at",
  "reviewed_by",
  "reviewed_at",
  "published_by",
  "published_at",
  "base_version",
  "rollback_target_version",
  "created_at",
  "updated_at",
].join(",");

function safetySettingVersion(value: unknown) {
  const version = cleanText(value, 80);
  return SAFETY_SETTING_VERSION_PATTERN.test(version) ? version : "";
}

function safetySettingTimestamp(value: unknown) {
  const time = Date.parse(cleanText(value, 80));
  return Number.isFinite(time) ? new Date(time).toISOString() : "";
}

function safetySettingPayload(value: unknown) {
  const settings = rowObject(value);
  return settings
    && rowObject(settings.pledgeRules)
    && rowObject(settings.pushCopy)
    && rowObject(settings.restDayCalendar)
    ? settings
    : null;
}

function safetySettingResponse(row: Record<string, unknown>, includeSettings = false) {
  const response: Record<string, unknown> = {
    configVersion: cleanText(row.config_version, 80),
    lifecycleStatus: cleanText(row.lifecycle_status, 20),
    effectiveAt: cleanText(row.effective_at, 80),
    changeSummary: cleanText(row.change_summary, 1000),
    metadata: {
      authored: {
        actorKey: cleanText(row.authored_by, 80),
        at: cleanText(row.authored_at, 80),
      },
      reviewed: row.reviewed_by
        ? { actorKey: cleanText(row.reviewed_by, 80), at: cleanText(row.reviewed_at, 80) }
        : null,
      published: row.published_by
        ? { actorKey: cleanText(row.published_by, 80), at: cleanText(row.published_at, 80) }
        : null,
      baseVersion: cleanText(row.base_version, 80) || null,
      rollbackTargetVersion: cleanText(row.rollback_target_version, 80) || null,
      createdAt: cleanText(row.created_at, 80),
      updatedAt: cleanText(row.updated_at, 80),
    },
  };
  if (includeSettings) response.settings = rowObject(row.settings) || {};
  return response;
}

async function safetySettingActorKey(authorization: AuthorizedMutationSession) {
  const workerId = cleanText(authorization.worker.id, 120);
  return `actor:v1:${await sha256(workerId)}`;
}

function safetySettingError(label: string, error: { code?: unknown } | null) {
  console.error(label, { code: cleanText(error?.code, 20) });
}

async function listSafetySettingVersions(payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload, "admin");
  if (authorization.error) return authorization.error;

  const limit = Math.max(1, Math.min(100, Math.trunc(Number(payload.limit) || 50)));
  const offset = Math.max(0, Math.trunc(Number(payload.offset) || 0));
  const status = cleanText(payload.lifecycleStatus, 20);
  if (status && !SAFETY_SETTING_STATUSES.has(status)) {
    return jsonResponse({ error: "safety_setting_status_invalid" }, 400);
  }

  let query = supabase
    .from("safety_setting_versions")
    .select(SAFETY_SETTING_COLUMNS, { count: "exact" })
    .order("effective_at", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (status) query = query.eq("lifecycle_status", status);
  const { data, error, count } = await query;
  if (error) {
    safetySettingError("safety setting list failed", error);
    return jsonResponse({ error: "safety_setting_list_failed" }, 500);
  }
  return jsonResponse({
    ok: true,
    versions: (data || []).map((row) => safetySettingResponse(row as Record<string, unknown>)),
    page: { offset, limit, total: Number(count || 0) },
  });
}

async function readSafetySettingVersion(payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload, "admin");
  if (authorization.error) return authorization.error;
  const configVersion = safetySettingVersion(payload.configVersion);
  if (!configVersion) return jsonResponse({ error: "safety_setting_version_invalid" }, 400);

  const { data, error } = await supabase
    .from("safety_setting_versions")
    .select(SAFETY_SETTING_COLUMNS)
    .eq("config_version", configVersion)
    .maybeSingle();
  if (error) {
    safetySettingError("safety setting read failed", error);
    return jsonResponse({ error: "safety_setting_read_failed" }, 500);
  }
  if (!data) return jsonResponse({ error: "safety_setting_not_found" }, 404);
  return jsonResponse({ ok: true, version: safetySettingResponse(data as Record<string, unknown>, true) });
}

async function createSafetySettingDraft(payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload, "admin");
  if (authorization.error) return authorization.error;
  const configVersion = safetySettingVersion(payload.configVersion);
  const effectiveAt = safetySettingTimestamp(payload.effectiveAt);
  const changeSummary = cleanText(payload.changeSummary, 1000);
  const settings = safetySettingPayload(payload.settings);
  const baseVersion = payload.baseVersion === undefined || payload.baseVersion === null
    ? null
    : safetySettingVersion(payload.baseVersion);
  if (!configVersion || !effectiveAt || !changeSummary || !settings || (payload.baseVersion && !baseVersion)) {
    return jsonResponse({ error: "safety_setting_draft_invalid" }, 400);
  }

  const actorKey = await safetySettingActorKey(authorization as AuthorizedMutationSession);
  const { data, error } = await supabase
    .from("safety_setting_versions")
    .insert({
      config_version: configVersion,
      lifecycle_status: "draft",
      effective_at: effectiveAt,
      change_summary: changeSummary,
      settings,
      authored_by: actorKey,
      base_version: baseVersion,
    })
    .select(SAFETY_SETTING_COLUMNS)
    .single();
  if (error) {
    safetySettingError("safety setting draft create failed", error);
    if (cleanText(error.code, 20) === "23505") {
      return jsonResponse({ error: "safety_setting_version_exists" }, 409);
    }
    return jsonResponse({ error: "safety_setting_draft_create_failed" }, 500);
  }
  return jsonResponse({ ok: true, version: safetySettingResponse(data as Record<string, unknown>, true) }, 201);
}

async function requestSafetySettingReview(payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload, "admin");
  if (authorization.error) return authorization.error;
  const configVersion = safetySettingVersion(payload.configVersion);
  if (!configVersion) return jsonResponse({ error: "safety_setting_version_invalid" }, 400);
  const actorKey = await safetySettingActorKey(authorization as AuthorizedMutationSession);
  const { data, error } = await supabase
    .from("safety_setting_versions")
    .update({ lifecycle_status: "review", reviewed_by: actorKey, reviewed_at: new Date().toISOString() })
    .eq("config_version", configVersion)
    .eq("lifecycle_status", "draft")
    .select(SAFETY_SETTING_COLUMNS)
    .maybeSingle();
  if (error) {
    safetySettingError("safety setting review request failed", error);
    return jsonResponse({ error: "safety_setting_review_failed" }, 500);
  }
  if (!data) return jsonResponse({ error: "safety_setting_not_draft" }, 409);
  return jsonResponse({ ok: true, version: safetySettingResponse(data as Record<string, unknown>, true) });
}

async function publishSafetySettingVersion(payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload, "admin");
  if (authorization.error) return authorization.error;
  const configVersion = safetySettingVersion(payload.configVersion);
  if (!configVersion) return jsonResponse({ error: "safety_setting_version_invalid" }, 400);
  const actorKey = await safetySettingActorKey(authorization as AuthorizedMutationSession);
  const { data, error } = await supabase
    .from("safety_setting_versions")
    .update({ lifecycle_status: "published", published_by: actorKey, published_at: new Date().toISOString() })
    .eq("config_version", configVersion)
    .eq("lifecycle_status", "review")
    .select(SAFETY_SETTING_COLUMNS)
    .maybeSingle();
  if (error) {
    safetySettingError("safety setting publish failed", error);
    return jsonResponse({ error: "safety_setting_publish_failed" }, 500);
  }
  if (!data) return jsonResponse({ error: "safety_setting_not_in_review" }, 409);
  return jsonResponse({ ok: true, version: safetySettingResponse(data as Record<string, unknown>, true) });
}

async function createSafetySettingRollbackDraft(payload: Record<string, unknown>) {
  const authorization = await verifyMutationSession(payload, "admin");
  if (authorization.error) return authorization.error;
  const configVersion = safetySettingVersion(payload.configVersion);
  const rollbackTargetVersion = safetySettingVersion(payload.rollbackTargetVersion);
  const effectiveAt = safetySettingTimestamp(payload.effectiveAt);
  const changeSummary = cleanText(payload.changeSummary, 1000);
  if (!configVersion || !rollbackTargetVersion || !effectiveAt || !changeSummary) {
    return jsonResponse({ error: "safety_setting_rollback_invalid" }, 400);
  }

  const { data: target, error: targetError } = await supabase
    .from("safety_setting_versions")
    .select("config_version,settings")
    .eq("config_version", rollbackTargetVersion)
    .eq("lifecycle_status", "published")
    .maybeSingle();
  if (targetError) {
    safetySettingError("safety setting rollback target lookup failed", targetError);
    return jsonResponse({ error: "safety_setting_rollback_lookup_failed" }, 500);
  }
  if (!target) return jsonResponse({ error: "safety_setting_rollback_target_not_published" }, 409);

  const { data: current, error: currentError } = await supabase
    .from("safety_setting_versions")
    .select("config_version")
    .eq("lifecycle_status", "published")
    .lte("effective_at", new Date().toISOString())
    .order("effective_at", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (currentError) {
    safetySettingError("safety setting current version lookup failed", currentError);
    return jsonResponse({ error: "safety_setting_rollback_lookup_failed" }, 500);
  }

  const actorKey = await safetySettingActorKey(authorization as AuthorizedMutationSession);
  const { data, error } = await supabase
    .from("safety_setting_versions")
    .insert({
      config_version: configVersion,
      lifecycle_status: "draft",
      effective_at: effectiveAt,
      change_summary: changeSummary,
      settings: target.settings,
      authored_by: actorKey,
      base_version: cleanText(current?.config_version, 80) || rollbackTargetVersion,
      rollback_target_version: rollbackTargetVersion,
    })
    .select(SAFETY_SETTING_COLUMNS)
    .single();
  if (error) {
    safetySettingError("safety setting rollback draft create failed", error);
    if (cleanText(error.code, 20) === "23505") {
      return jsonResponse({ error: "safety_setting_version_exists" }, 409);
    }
    return jsonResponse({ error: "safety_setting_rollback_create_failed" }, 500);
  }
  return jsonResponse({ ok: true, version: safetySettingResponse(data as Record<string, unknown>, true) }, 201);
}

async function uploadPictogramImage(payload: Record<string, unknown>) {
  const pictogramId = cleanText(payload.pictogramId, 120);
  if (!/^[a-zA-Z0-9_-]+$/.test(pictogramId)) return jsonResponse({ error: "invalid_pictogram_id" }, 400);

  const label = cleanText(payload.label, 180);
  const sortOrder = Math.max(0, Math.min(100000, Number(payload.sortOrder) || 0));
  if (!label) return jsonResponse({ error: "invalid_pictogram_label" }, 400);

  const authorization = await verifyMutationSession(payload);
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

  const pictogram = {
    id: pictogramId,
    label,
    source: "custom",
    src: "",
    deleted: false,
    sort_order: sortOrder,
    storage_bucket: PICTOGRAM_IMAGE_BUCKET,
    storage_path: storagePath,
    mime_type: parsed.mimeType,
    file_size: parsed.bytes.byteLength,
    updated_at: new Date().toISOString(),
  };
  const { error: metadataError } = await supabase
    .from("safety_pictograms")
    .upsert(pictogram, { onConflict: "id" });
  if (metadataError) {
    console.error("admin pictogram metadata write failed", metadataError);
    const { error: cleanupError } = await supabase.storage
      .from(PICTOGRAM_IMAGE_BUCKET)
      .remove([storagePath]);
    if (cleanupError) console.error("admin pictogram upload cleanup failed", cleanupError);
    return jsonResponse({ error: "admin_pictogram_metadata_failed" }, 500);
  }

  return jsonResponse({
    ok: true,
    pictogram: {
      id: pictogram.id,
      label: pictogram.label,
      source: pictogram.source,
      deleted: pictogram.deleted,
      order: pictogram.sort_order,
      storageBucket: pictogram.storage_bucket,
      storagePath: pictogram.storage_path,
      mimeType: pictogram.mime_type,
      fileSize: pictogram.file_size,
    },
  });
}

async function deletePictogram(payload: Record<string, unknown>) {
  const pictogramId = cleanText(payload.pictogramId, 120);
  const fallbackIcon = canonicalPictogramId(payload.fallbackIcon || "blockAssembly");
  if (!/^[a-zA-Z0-9_-]+$/.test(pictogramId) || !BUILT_IN_PICTOGRAM_IDS.has(fallbackIcon)) {
    return jsonResponse({ error: "invalid_pictogram_delete" }, 400);
  }

  const authorization = await verifyMutationSession(payload);
  if (authorization.error) return authorization.error;
  const actorWorkerId = cleanText((authorization as AuthorizedMutationSession).worker.id, 120);
  const { data, error } = await supabase.rpc("delete_safety_pictogram", {
    p_id: pictogramId,
    p_fallback_icon: fallbackIcon,
    p_actor_worker_id: actorWorkerId,
  });
  if (error) {
    console.error("admin pictogram delete failed", error);
    return jsonResponse({ error: "admin_pictogram_delete_failed" }, 500);
  }

  const deleted = rowObject(data) || {};
  const storageBucket = cleanText(deleted.storageBucket, 120);
  const storagePath = cleanText(deleted.storagePath, 500);
  const expectedPath = new RegExp(`^custom/${pictogramId}\\.(png|jpe?g|webp)$`, "i");
  let storageDeleted = true;
  if (storagePath && storageBucket === PICTOGRAM_IMAGE_BUCKET && expectedPath.test(storagePath)) {
    const { error: storageError } = await supabase.storage.from(PICTOGRAM_IMAGE_BUCKET).remove([storagePath]);
    if (storageError) {
      storageDeleted = false;
      console.error("admin pictogram storage cleanup failed", storageError);
    }
  }
  return jsonResponse({ ok: true, storageDeleted });
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
  if (action === "createWorker") return createWorker(payload);
  if (action === "deleteWorker") return deleteWorker(payload);
  if (action === "updateWorkPrepStatus") return updateWorkPrepStatus(payload);
  if (action === "upsertRows") return upsertRows(payload);
  if (action === "submitInspection") return submitInspection(payload);
  if (action === "submitRows") return submitRows(payload);
  if (action === "createIssuePhotoUpload") return createIssuePhotoUpload(payload);
  if (action === "completeIssuePhotoUpload") return completeIssuePhotoUpload(payload);
  if (action === "listIssuePhotos") return listIssuePhotos(payload);
  if (action === "deleteRows") return deleteRows(payload);
  if (action === "deleteInspectionHistory") return deleteInspectionHistory(payload);
  if (action === "deleteAllInspectionHistory") return deleteAllInspectionHistory(payload);
  if (action === "deleteCategoryCascade") return deleteCategoryCascade(payload);
  if (action === "deleteSectionCascade") return deleteSectionCascade(payload);
  if (action === "deleteIssuePhotos") return deleteIssuePhotos(payload);
  if (action === "listSafetySettingVersions") return listSafetySettingVersions(payload);
  if (action === "readSafetySettingVersion") return readSafetySettingVersion(payload);
  if (action === "createSafetySettingDraft") return createSafetySettingDraft(payload);
  if (action === "requestSafetySettingReview") return requestSafetySettingReview(payload);
  if (action === "publishSafetySettingVersion") return publishSafetySettingVersion(payload);
  if (action === "createSafetySettingRollbackDraft") return createSafetySettingRollbackDraft(payload);
  if (action === "uploadPictogramImage") return uploadPictogramImage(payload);
  if (action === "deletePictogram") return deletePictogram(payload);
  if (action === "ping") return jsonResponse({ ok: true });
  return jsonResponse({ error: "unknown_action" }, 400);
});
