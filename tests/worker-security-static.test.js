const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function expectMatch(source, pattern, message) {
  if (!pattern.test(source)) throw new Error(message);
}

function expectNoMatch(source, pattern, message) {
  if (pattern.test(source)) throw new Error(message);
}

const app = read("assets/js/app-v2.js");
const migration = read("supabase/migrations/20260527064035_worker_public_read_path.sql");
const deleteMigration = read("supabase/migrations/20260527071140_revoke_workers_delete.sql");
const rpcBoundaryMigration = read("supabase/migrations/20260527145253_security_definer_rpc_boundary.sql");
const manualScreenshots = read("tools/capture-manual-screenshots.mjs");
const workerPush = read("supabase/functions/worker-push/index.ts");
const workerPushAttempts = read("supabase/migrations/20260623163944_worker_push_attempt_rate_limit.sql");
const workerPushAttemptAtomic = read("supabase/migrations/20260715110500_atomic_worker_push_attempt.sql");

expectMatch(app, /table: "workers",\s*readTable: "workers_public",\s*key: "workers"/, "workers should read through workers_public");
expectMatch(app, /const source = config\.readTable \|\| config\.table/, "selectTable should support readTable");
expectMatch(app, /client\.from\(source\)\.select\(remoteSelectColumns\(config, fallback\)\)/, "selectTable should select from readTable source with explicit metadata-only columns");
expectNoMatch(app, /employeeNo: normalizeEmployeeNo\(row\.employee_no\)/, "worker fromDb must not map employee_no into browser worker rows");
expectNoMatch(app, /employee_no: normalizeEmployeeNo\(row\.employeeNo\)/, "worker toDb must not write employee_no from browser worker rows");
expectMatch(app, /table: "workers",[\s\S]*?toDb: \(row\) => \(\{[\s\S]*?created_at: row\.createdAt \|\| serverNow\(\)\.toISOString\(\)/, "worker toDb still includes created_at for Phase 1 upsert compatibility");
expectNoMatch(app, /data-worker-edit-field="employeeNo"/, "worker edit panel should not expose employeeNo editing in Phase 1");
expectMatch(app, /data-delete-worker=/, "worker manager should expose the authenticated worker delete action");
expectMatch(app, /invokeAdminMutation\("deleteWorker"/, "worker deletion must cross the authenticated Edge Function boundary");
expectNoMatch(app, /deleteRemoteRows\("workers"/, "browser runtime must not directly delete workers through anon REST");
expectMatch(app, /employeeNo,\s*loggedInAt: serverNow\(\)\.toISOString\(\)/, "worker session may still keep the typed employee number for push compatibility");
expectMatch(app, /createAdminSession\(workerId, employeeNo, "worker"\)/, "worker login should create a server mutation session");
expectNoMatch(app, /verify_worker_login/, "browser runtime must not directly execute the login SECURITY DEFINER RPC");
expectNoMatch(app, /worker_push_subscription_status/, "browser runtime must not directly execute the push status SECURITY DEFINER RPC");

expectMatch(migration, /create or replace view public\.workers_public\s+with\s*\(security_invoker\s*=\s*true\)/i, "workers_public view should be security_invoker");
expectMatch(migration, /select\s+id,\s*name,\s*team,\s*position,\s*active,\s*unsafe_push_target,\s*created_at,\s*updated_at\s+from public\.workers/i, "workers_public should omit employee_no");
expectMatch(migration, /revoke select on table public\.workers from public, anon, authenticated/i, "workers table select should be revoked before column grants");
expectMatch(migration, /grant select\s*\(\s*id,\s*name,\s*team,\s*position,\s*active,\s*created_at,\s*updated_at,\s*unsafe_push_target\s*\)\s+on public\.workers to anon, authenticated/i, "workers table select grant should omit employee_no");
expectMatch(migration, /grant select on table public\.workers_public to anon, authenticated/i, "workers_public should be selectable by browser clients");
expectMatch(migration, /revoke insert, update on table public\.workers from public, anon, authenticated/i, "workers insert/update should be reset before column grants");
expectMatch(migration, /grant insert\s*\(\s*id,\s*name,\s*team,\s*position,\s*active,\s*created_at,\s*updated_at,\s*unsafe_push_target\s*\)\s+on public\.workers to anon, authenticated/i, "workers insert grant should omit employee_no");
expectMatch(migration, /grant update\s*\(\s*name,\s*team,\s*position,\s*active,\s*created_at,\s*updated_at,\s*unsafe_push_target\s*\)\s+on public\.workers to anon, authenticated/i, "workers update grant should omit employee_no while allowing Phase 1 upsert created_at");
expectMatch(migration, /create or replace function public\.verify_worker_login\(p_worker_id text, p_employee_no text\)/i, "login RPC source should be tracked");
expectMatch(migration, /security definer/i, "login RPC source should remain visible in migration history");
expectMatch(rpcBoundaryMigration, /revoke all on function public\.verify_worker_login\(text, text\) from public, anon, authenticated/i, "login RPC execute should be revoked from browser roles");
expectMatch(rpcBoundaryMigration, /revoke all on function public\.worker_push_subscription_status\(text\) from public, anon, authenticated/i, "push status RPC execute should be revoked from browser roles");
expectMatch(rpcBoundaryMigration, /grant execute on function public\.verify_worker_login\(text, text\) to service_role/i, "login RPC should remain service-role executable");
expectMatch(rpcBoundaryMigration, /grant execute on function public\.worker_push_subscription_status\(text\) to service_role/i, "push status RPC should remain service-role executable");
expectNoMatch(rpcBoundaryMigration, /grant execute on function public\.(verify_worker_login|worker_push_subscription_status)\([^)]*\) to (anon|authenticated)/i, "boundary migration must not restore browser-role RPC execute");

expectMatch(deleteMigration, /revoke delete on table public\.workers from public, anon, authenticated/i, "workers delete privilege should be revoked from public browser roles");
expectMatch(deleteMigration, /drop policy if exists "workers public delete" on public\.workers/i, "broad workers delete policy should be removed");

expectMatch(manualScreenshots, /MANUAL_CAPTURE_EMPLOYEE_NO/, "manual screenshot capture should require an explicit local employee number");
expectMatch(manualScreenshots, /\/rest\/v1\/workers_public\?select=id,name,team,position&order=name\.asc/, "manual screenshot capture should read workers through workers_public");
expectNoMatch(manualScreenshots, /\/rest\/v1\/workers\?select=[^"`']*employee_no/, "manual screenshot capture must not read employee_no from workers through anon REST");
expectNoMatch(manualScreenshots, /sender\.employee_no/, "manual screenshot capture must not reuse employee_no from fetched worker rows");

expectMatch(workerPush, /MAX_FAILED_ATTEMPTS\s*=\s*5/, "worker push credential attempts should remain rate limited");
expectMatch(workerPush, /verifyWorkerPushCredential/, "worker push credential checks should share the rate limiter");
expectMatch(workerPushAttempts, /create table if not exists public\.worker_push_attempts/i, "worker push attempt table migration should be tracked");
expectMatch(workerPush, /begin_worker_push_attempt/, "worker push attempts should use the atomic database reservation");
expectNoMatch(workerPush, /async function readWorkerPushAttempt\(/, "worker push limiter must not use a read then write race");
expectMatch(workerPushAttemptAtomic, /create or replace function public\.begin_worker_push_attempt/i, "worker push attempt reservation function should be tracked");
expectNoMatch(workerPushAttemptAtomic, /\bcurrent_time\b/i, "worker push attempt reservation must not use PostgreSQL current_time as a PL/pgSQL variable");
expectMatch(workerPush, /MISSING_MATERIAL_PUSH_TARGET_NAMES/, "missing material recipients should be server controlled");
expectMatch(workerPush, /sendKind[\s\S]*?=== "missingMaterial"[\s\S]*?workerIds = \[\.\.\.await missingMaterialTargetWorkerIds\(\)\]/, "missing material sends should resolve all recipients on the server");
expectMatch(app, /toast\("호선자재 누락이 접수되었습니다\."\);\s*await syncMissingMaterial\(row\);/, "missing material submission should enter the durable save-then-notify flow");
expectMatch(app, /pendingMissingMaterialNotifications/, "missing material notification retries should be persisted");
expectMatch(app, /missing_material_push_incomplete/, "incomplete missing material sends should remain queued");
expectMatch(workerPush, /subscribedWorkers/, "push results should report recipient subscription coverage");

console.log("worker security static tests passed");
