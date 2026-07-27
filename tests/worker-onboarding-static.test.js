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
const views = read("assets/js/screen-views.js");
const edge = read("supabase/functions/admin-mutations/index.ts");
const migration = read("supabase/migrations/20260721100000_worker_employee_no_unique.sql");
const deleteMigration = read("supabase/migrations/20260727110000_deactivate_workers.sql");

expectMatch(views, /id="workerEmployeeNo"[\s\S]*type="password"[\s\S]*autocomplete="new-password"/, "new worker form must collect the initial employee number without displaying it");
expectMatch(views, /신입사원 등록/, "worker manager must explain that the form onboards a new employee");
expectMatch(app, /invokeAdminMutation\("createWorker",\s*\{[\s\S]*worker:\s*\{\s*id:\s*requestId,[\s\S]*employeeNo/, "new workers must be created through the authenticated Edge Function with a retry-stable id");
expectMatch(app, /workerCreateRequest:\s*\{\s*fingerprint:\s*"",\s*id:\s*""\s*\}[\s\S]*state\.workerCreateRequest = \{ fingerprint: requestFingerprint, id: requestId \}/, "worker create retries must retain their request id across intervening renders");
expectMatch(app, /findIndex\(\(row\) => row\.id === result\.worker\.id\)[\s\S]*else state\.workers\.push\(result\.worker\)/, "browser state must upsert the sanitized worker by id");
expectMatch(app, /function authoritativeRemoteRows\(key, remoteRows\)[\s\S]*key === "workers"[\s\S]*pendingCreatedWorkers/, "stale authoritative pulls must preserve newly committed workers until the server row is observed");
expectMatch(app, /error\?\.context[\s\S]*await context\.json\(\)[\s\S]*errorPayload\?\.error/, "admin mutation errors must preserve structured Edge error codes");
expectMatch(app, /admin_forbidden[\s\S]*errorStatus === 401 \|\| errorStatus === 403/, "revoked or demoted admin sessions must clear stale browser admin state");
expectNoMatch(app, /state\.workers\.push\(\{[^}]*employeeNo/, "browser worker rows must never retain the initial employee number");

expectMatch(edge, /async function createWorker\(payload:/, "admin-mutations must expose a dedicated worker onboarding handler");
expectMatch(edge, /verifyMutationSession\(payload, "admin"\)/, "worker onboarding must require an admin mutation session");
expectMatch(edge, /employee_no:\s*employeeNo/, "the Edge Function must write the employee number server-side");
expectMatch(edge, /\.eq\("id", id\)[\s\S]*\.eq\("employee_no", employeeNo\)/, "worker creation retries must resolve the original committed row without exposing its credential");
expectMatch(edge, /action === "createWorker"/, "worker onboarding action must be routed explicitly");
expectNoMatch(edge, /worker:\s*\{[^}]*employee_no/s, "the Edge Function response must not expose the employee number");
expectNoMatch(edge, /worker:\s*\{[^}]*employeeNo/s, "the Edge Function response must not expose the employee number in camel case");

expectMatch(app, /data-delete-worker="\$\{esc\(worker\.id\)\}"/, "expanded worker cards must expose a delete action");
expectMatch(app, /async function deleteWorker\(workerId\)[\s\S]*invokeAdminMutation\("deleteWorker", \{ workerId: id \}\)/, "worker deletion must use the authenticated Edge Function");
expectMatch(app, /state\.workerSession\?\.workerId === id[\s\S]*현재 로그인한 본인은 삭제할 수 없습니다/, "the browser must prevent deleting the signed-in worker");
expectMatch(app, /state\.workers = state\.workers\.filter\(\(row\) => row\.id !== id\)/, "successful deletion must immediately remove the worker from browser state");
expectMatch(app, /state\.workerDeletionTombstones\.add\(id\)/, "successful deletion must create a stale-pull tombstone");
expectMatch(app, /state\.workerDeletionTombstones\.forEach\(\(id\) =>/, "remote worker pulls must honor deletion tombstones");
expectMatch(app, /key: "workers"[\s\S]*rows: \(rows\) => rows\.filter\(\(row\) => row\.active !== false\)/, "inactive workers must not return through remote synchronization");

expectMatch(edge, /async function deleteWorker\(payload:[\s\S]*verifyMutationSession\(payload, "admin"\)/, "worker deletion must require an admin mutation session");
expectMatch(edge, /supabase\.rpc\("admin_deactivate_worker"/, "worker deletion must use the atomic database boundary");
expectMatch(edge, /p_actor_session_id:\s*actorSessionId/, "worker deletion must bind the acting admin session to the database transaction");
expectMatch(edge, /\^\[A-Za-z0-9_-\]\{1,120\}\$[\s\S]*worker_id_invalid/, "worker deletion must accept legacy worker IDs");
expectMatch(edge, /key === "workers"[\s\S]*\.update\(\{[\s\S]*\.eq\("active", true\)[\s\S]*return jsonResponse\(\{ ok: true, mutated \}\)/, "worker synchronization must update active profiles only");
expectMatch(edge, /action === "deleteWorker"/, "worker deletion action must be routed explicitly");
expectMatch(deleteMigration, /from public\.workers[\s\S]*where active is true/, "the public worker directory must expose active workers only");
expectMatch(deleteMigration, /p_worker_id = p_actor_worker_id[\s\S]*worker_self_delete_forbidden/, "the database must prevent self-deletion");
expectMatch(deleteMigration, /update public\.workers[\s\S]*active = false/, "worker deletion must preserve the worker row as inactive");
expectMatch(deleteMigration, /update public\.admin_mutation_sessions[\s\S]*revoked_at/, "worker deletion must revoke active sessions");
expectMatch(deleteMigration, /delete from public\.worker_push_subscriptions/, "worker deletion must remove push subscriptions");
expectMatch(deleteMigration, /worker_push_subscriptions_worker_id_idx/, "worker deletion cleanup must have a worker lookup index");
expectMatch(deleteMigration, /p_actor_session_id[\s\S]*admin_mutation_sessions[\s\S]*for update of session, actor/, "worker deletion must revalidate and lock the acting session");
expectMatch(deleteMigration, /create trigger worker_push_subscription_active_worker[\s\S]*enforce_active_worker_push_subscription/, "push registration must lock and reject inactive workers");
expectMatch(deleteMigration, /enforce_active_worker_push_subscription[\s\S]*for share;/, "push registration lock must conflict with worker deactivation");

expectMatch(migration, /create unique index/i, "employee numbers must be unique at the database boundary");
expectMatch(migration, /btrim\(employee_no\)/i, "employee number uniqueness must use the normalized value");
expectMatch(migration, /where nullif\(btrim\(employee_no\), ''\) is not null/i, "blank legacy employee numbers must remain compatible");

console.log("worker onboarding static tests passed");
