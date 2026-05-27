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
const edge = read("supabase/functions/admin-mutations/index.ts");
const migration = read("supabase/migrations/20260527090000_admin_mutation_boundary.sql");
const pkg = JSON.parse(read("package.json"));

expectMatch(edge, /const ADMIN_TABLES = new Map/i, "admin-mutations must whitelist table keys");
expectMatch(edge, /function verifiedAdminWorker/i, "admin-mutations must verify privileged worker server-side");
expectMatch(edge, /SUPABASE_SERVICE_ROLE_KEY/, "admin-mutations must use service role only inside the Edge Function");
expectMatch(edge, /action === "upsertRows"/, "admin-mutations must support whitelisted upserts");
expectMatch(edge, /action === "deleteRows"/, "admin-mutations must support whitelisted deletes");
expectNoMatch(edge, /from\(table\)/, "admin-mutations must not use arbitrary table names");

expectMatch(app, /const ADMIN_REMOTE_KEYS = new Set\(/, "frontend must classify admin-managed remote keys");
expectMatch(app, /functions\.invoke\("admin-mutations"/, "frontend admin writes must invoke the Edge Function");
expectMatch(app, /function adminMutationAuthPayload\(/, "frontend must send worker-session auth for admin mutations");
expectNoMatch(app, /const ADMIN_PASSWORD\s*=/, "admin password must not remain as a hardcoded frontend constant after Phase 2A");
expectNoMatch(app, /const RECORD_RESET_PASSWORD\s*=/, "record reset password must not remain as a hardcoded frontend constant after Phase 2A");

[
  "workers",
  "safety_categories",
  "safety_sections",
  "safety_items",
  "safety_tools",
  "safety_pictograms",
  "safety_ships",
].forEach((table) => {
  expectMatch(
    migration,
    new RegExp(`revoke\\s+insert,\\s*update,\\s*delete\\s+on\\s+table\\s+public\\.${table}\\s+from\\s+public,\\s*anon,\\s*authenticated`, "i"),
    `${table} direct browser write grants should be revoked`,
  );
});

expectMatch(migration, /drop policy if exists "anon all safety categories"/i, "broad category policy should be dropped");
expectMatch(migration, /drop policy if exists "workers public insert"/i, "workers public insert policy should be dropped");
expectMatch(migration, /drop policy if exists "workers public update"/i, "workers public update policy should be dropped");
expectMatch(pkg.scripts.verify, /tests\/admin-mutation-boundary-static\.test\.js/, "verify script should include admin mutation boundary static test");

console.log("admin mutation boundary static tests passed");
