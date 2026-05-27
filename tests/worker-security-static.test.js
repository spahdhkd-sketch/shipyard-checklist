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
const manualScreenshots = read("tools/capture-manual-screenshots.mjs");

expectMatch(app, /table: "workers",\s*readTable: "workers_public",\s*key: "workers"/, "workers should read through workers_public");
expectMatch(app, /const source = config\.readTable \|\| config\.table/, "selectTable should support readTable");
expectMatch(app, /client\.from\(source\)\.select\("\*"\)/, "selectTable should select from readTable source");
expectNoMatch(app, /employeeNo: normalizeEmployeeNo\(row\.employee_no\)/, "worker fromDb must not map employee_no into browser worker rows");
expectNoMatch(app, /employee_no: normalizeEmployeeNo\(row\.employeeNo\)/, "worker toDb must not write employee_no from browser worker rows");
expectMatch(app, /table: "workers",[\s\S]*?toDb: \(row\) => \(\{[\s\S]*?created_at: row\.createdAt \|\| serverNow\(\)\.toISOString\(\)/, "worker toDb still includes created_at for Phase 1 upsert compatibility");
expectNoMatch(app, /data-worker-edit-field="employeeNo"/, "worker edit panel should not expose employeeNo editing in Phase 1");
expectMatch(app, /employeeNo,\s*loggedInAt: serverNow\(\)\.toISOString\(\)/, "worker session may still keep the typed employee number for push compatibility");
expectMatch(app, /p_employee_no: employeeNo/, "verify_worker_login should still send the typed employee number to the RPC");

expectMatch(migration, /create or replace view public\.workers_public\s+with\s*\(security_invoker\s*=\s*true\)/i, "workers_public view should be security_invoker");
expectMatch(migration, /select\s+id,\s*name,\s*team,\s*position,\s*active,\s*unsafe_push_target,\s*created_at,\s*updated_at\s+from public\.workers/i, "workers_public should omit employee_no");
expectMatch(migration, /revoke select on table public\.workers from public, anon, authenticated/i, "workers table select should be revoked before column grants");
expectMatch(migration, /grant select\s*\(\s*id,\s*name,\s*team,\s*position,\s*active,\s*created_at,\s*updated_at,\s*unsafe_push_target\s*\)\s+on public\.workers to anon, authenticated/i, "workers table select grant should omit employee_no");
expectMatch(migration, /grant select on table public\.workers_public to anon, authenticated/i, "workers_public should be selectable by browser clients");
expectMatch(migration, /revoke insert, update on table public\.workers from public, anon, authenticated/i, "workers insert/update should be reset before column grants");
expectMatch(migration, /grant insert\s*\(\s*id,\s*name,\s*team,\s*position,\s*active,\s*created_at,\s*updated_at,\s*unsafe_push_target\s*\)\s+on public\.workers to anon, authenticated/i, "workers insert grant should omit employee_no");
expectMatch(migration, /grant update\s*\(\s*name,\s*team,\s*position,\s*active,\s*created_at,\s*updated_at,\s*unsafe_push_target\s*\)\s+on public\.workers to anon, authenticated/i, "workers update grant should omit employee_no while allowing Phase 1 upsert created_at");
expectMatch(migration, /create or replace function public\.verify_worker_login\(p_worker_id text, p_employee_no text\)/i, "login RPC source should be tracked");
expectMatch(migration, /security definer/i, "login RPC should keep current security-definer behavior for browser RPC compatibility");
expectMatch(migration, /grant execute on function public\.verify_worker_login\(text, text\) to anon, authenticated/i, "browser clients should be able to execute login RPC");

expectMatch(manualScreenshots, /MANUAL_CAPTURE_EMPLOYEE_NO/, "manual screenshot capture should require an explicit local employee number");
expectMatch(manualScreenshots, /\/rest\/v1\/workers_public\?select=id,name,team,position&order=name\.asc/, "manual screenshot capture should read workers through workers_public");
expectNoMatch(manualScreenshots, /\/rest\/v1\/workers\?select=[^"`']*employee_no/, "manual screenshot capture must not read employee_no from workers through anon REST");
expectNoMatch(manualScreenshots, /sender\.employee_no/, "manual screenshot capture must not reuse employee_no from fetched worker rows");

console.log("worker security static tests passed");
