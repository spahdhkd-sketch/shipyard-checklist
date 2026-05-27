import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PRIVILEGED_POSITIONS = new Set(["대표", "관리", "총무"]);
const PRIVILEGED_TEAMS = new Set(["관리", "총무"]);

type TableConfig = {
  table: string;
  columns: Set<string>;
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
      "src",
      "source",
      "deleted",
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

async function verifiedAdminWorker(payload: Record<string, unknown>) {
  const auth = rowObject(payload.adminAuth) || {};
  const workerId = cleanText(auth.workerId, 120);
  const employeeNo = normalizeEmployeeNo(auth.employeeNo);
  if (!workerId || !employeeNo) {
    return { error: jsonResponse({ error: "admin_worker_required" }, 403) };
  }

  const { data: worker, error } = await supabase
    .from("workers")
    .select("id,name,team,position,active,employee_no")
    .eq("id", workerId)
    .eq("active", true)
    .maybeSingle();

  if (error) return { error: jsonResponse({ error: error.message }, 500) };
  if (!worker || normalizeEmployeeNo(worker.employee_no) !== employeeNo) {
    return { error: jsonResponse({ error: "admin_verification_failed" }, 403) };
  }

  const position = cleanText(worker.position, 80);
  const team = cleanText(worker.team, 80);
  if (!PRIVILEGED_POSITIONS.has(position) && !PRIVILEGED_TEAMS.has(team)) {
    return { error: jsonResponse({ error: "admin_forbidden" }, 403) };
  }

  return { worker };
}

async function upsertRows(payload: Record<string, unknown>) {
  const config = ADMIN_TABLES.get(cleanText(payload.key, 80));
  if (!config) return jsonResponse({ error: "unknown_key" }, 400);
  const rows = Array.isArray(payload.rows)
    ? payload.rows.map((row) => cleanRow(config, row)).filter(Boolean) as Record<string, unknown>[]
    : [];
  if (!rows.length) return jsonResponse({ ok: true, mutated: 0 });

  const authorization = await verifiedAdminWorker(payload);
  if (authorization.error) return authorization.error;

  const { error } = await supabase.from(config.table).upsert(rows, { onConflict: "id" });
  if (error) return jsonResponse({ error: error.message }, 500);
  return jsonResponse({ ok: true, mutated: rows.length });
}

async function deleteRows(payload: Record<string, unknown>) {
  const config = ADMIN_TABLES.get(cleanText(payload.key, 80));
  if (!config) return jsonResponse({ error: "unknown_key" }, 400);
  const ids = cleanIds(payload.ids);
  if (!ids.length) return jsonResponse({ ok: true, mutated: 0 });

  const authorization = await verifiedAdminWorker(payload);
  if (authorization.error) return authorization.error;

  const { error } = await supabase.from(config.table).delete().in("id", ids);
  if (error) return jsonResponse({ error: error.message }, 500);
  return jsonResponse({ ok: true, mutated: ids.length });
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
  if (action === "upsertRows") return upsertRows(payload);
  if (action === "deleteRows") return deleteRows(payload);
  if (action === "ping") return jsonResponse({ ok: true });
  return jsonResponse({ error: "unknown_action" }, 400);
});
