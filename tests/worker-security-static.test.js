const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const app = read("assets/js/app-v2.js");
const migration = read("supabase/migrations/20260527001000_worker_public_read_path.sql");

assert.match(app, /table: "workers",\s*readTable: "workers_public",\s*key: "workers"/, "workers should read through workers_public");
assert.match(app, /const source = config\.readTable \|\| config\.table/, "selectTable should support readTable");
assert.match(app, /client\.from\(source\)\.select\("\*"\)/, "selectTable should select from readTable source");
assert.doesNotMatch(app, /employeeNo: normalizeEmployeeNo\(row\.employee_no\)/, "worker fromDb must not map employee_no into browser worker rows");
assert.doesNotMatch(app, /employee_no: normalizeEmployeeNo\(row\.employeeNo\)/, "worker toDb must not write employee_no from browser worker rows");
assert.doesNotMatch(app, /data-worker-edit-field="employeeNo"/, "worker edit panel should not expose employeeNo editing in Phase 1");
assert.match(app, /employeeNo,\s*loggedInAt: serverNow\(\)\.toISOString\(\)/, "worker session may still keep the typed employee number for push compatibility");
assert.match(app, /p_employee_no: employeeNo/, "verify_worker_login should still send the typed employee number to the RPC");

assert.match(migration, /create or replace view public\.workers_public\s+with\s*\(security_invoker\s*=\s*true\)/i, "workers_public view should be security_invoker");
assert.match(migration, /select\s+id,\s*name,\s*team,\s*position,\s*active,\s*unsafe_push_target,\s*created_at,\s*updated_at\s+from public\.workers/i, "workers_public should omit employee_no");
assert.match(migration, /revoke select on table public\.workers from public, anon, authenticated/i, "workers table select should be revoked before column grants");
assert.match(migration, /grant select\s*\(\s*id,\s*name,\s*team,\s*position,\s*active,\s*created_at,\s*updated_at,\s*unsafe_push_target\s*\)\s+on public\.workers to anon, authenticated/i, "workers table select grant should omit employee_no");
assert.match(migration, /grant select on table public\.workers_public to anon, authenticated/i, "workers_public should be selectable by browser clients");
assert.match(migration, /revoke insert, update on table public\.workers from public, anon, authenticated/i, "workers insert/update should be reset before column grants");
assert.match(migration, /grant insert\s*\(\s*id,\s*name,\s*team,\s*position,\s*active,\s*created_at,\s*updated_at,\s*unsafe_push_target\s*\)\s+on public\.workers to anon, authenticated/i, "workers insert grant should omit employee_no");
assert.match(migration, /grant update\s*\(\s*name,\s*team,\s*position,\s*active,\s*updated_at,\s*unsafe_push_target\s*\)\s+on public\.workers to anon, authenticated/i, "workers update grant should omit employee_no");
assert.match(migration, /create or replace function public\.verify_worker_login\(p_worker_id text, p_employee_no text\)/i, "login RPC source should be tracked");
assert.match(migration, /security definer/i, "login RPC should keep current security-definer behavior for browser RPC compatibility");
assert.match(migration, /grant execute on function public\.verify_worker_login\(text, text\) to anon, authenticated/i, "browser clients should be able to execute login RPC");

console.log("worker security static tests passed");
