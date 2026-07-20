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

expectMatch(migration, /create unique index/i, "employee numbers must be unique at the database boundary");
expectMatch(migration, /btrim\(employee_no\)/i, "employee number uniqueness must use the normalized value");
expectMatch(migration, /where nullif\(btrim\(employee_no\), ''\) is not null/i, "blank legacy employee numbers must remain compatible");

console.log("worker onboarding static tests passed");
