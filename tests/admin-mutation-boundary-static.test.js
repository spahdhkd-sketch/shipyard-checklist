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
const lintCleanupMigration = read("supabase/migrations/20260527091500_admin_mutation_policy_lint_cleanup.sql");
const inspectionBoundaryMigration = read("supabase/migrations/20260527093000_inspection_history_insert_only_boundary.sql");
const pkg = JSON.parse(read("package.json"));

expectMatch(edge, /const ADMIN_TABLES = new Map/i, "admin-mutations must whitelist table keys");
expectMatch(edge, /function verifyAdminSession/i, "admin-mutations must verify short-lived admin sessions server-side");
expectMatch(edge, /action === "createSession"/, "admin-mutations must issue server-side admin sessions");
expectMatch(edge, /SUPABASE_SERVICE_ROLE_KEY/, "admin-mutations must use service role only inside the Edge Function");
expectMatch(edge, /action === "upsertRows"/, "admin-mutations must support whitelisted upserts");
expectMatch(edge, /action === "deleteRows"/, "admin-mutations must support whitelisted deletes");
expectMatch(edge, /action === "deleteCategoryCascade"/, "admin-mutations must support category cascade deletes");
expectMatch(edge, /action === "deleteSectionCascade"/, "admin-mutations must support section cascade deletes");
expectMatch(edge, /\["inspections",\s*\{[\s\S]*table:\s*"safety_inspections"/, "admin-mutations must whitelist inspection history for admin deletion");
expectMatch(edge, /\["inspectionItems",\s*\{[\s\S]*table:\s*"safety_inspection_items"/, "admin-mutations must whitelist inspection item history for admin deletion");
expectNoMatch(edge, /from\(table\)/, "admin-mutations must not use arbitrary table names");
expectNoMatch(edge, /adminAuth/, "admin mutations must not accept replayable worker id plus employee number credentials");

expectMatch(app, /const ADMIN_REMOTE_KEYS = new Set\(/, "frontend must classify admin-managed remote keys");
expectMatch(app, /const PUBLIC_INSERT_ONLY_REMOTE_KEYS = new Set\(/, "frontend must keep worker-submitted records insert-only through public REST");
expectMatch(app, /const PUBLIC_INSERT_ONLY_REMOTE_KEYS = new Set\(\[[\s\S]*"inspections"[\s\S]*"inspectionItems"/, "inspection history should be public insert-only");
expectMatch(app, /functions\.invoke\("admin-mutations"/, "frontend admin writes must invoke the Edge Function");
expectMatch(app, /function adminMutationAuthPayload\(/, "frontend must send server-issued admin session auth for admin mutations");
expectMatch(app, /adminSessionToken/, "frontend must store an admin session token instead of replaying employee numbers");
expectNoMatch(app, /adminAuth:\s*adminMutationAuthPayload\(\)/, "frontend must not send replayable adminAuth credentials on each mutation");
expectNoMatch(app, /client\.from\("safety_inspections"\)\.delete\(/, "inspection history delete/reset must not use direct anon REST delete");
expectNoMatch(app, /client\.from\("safety_inspection_items"\)\.delete\(/, "inspection item history delete/reset must not use direct anon REST delete");
expectMatch(app, /async function deleteSelectedHistory\(/, "selected history deletion should await server authorization");
expectMatch(app, /async function resetHistory\(/, "history reset should await server authorization");
expectMatch(app, /if \(!requireAdminWrite\(\)\) return;[\s\S]*async function resetUnsafeIssueRecords/, "history reset should require server-backed admin write");
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

[
  "unsafe_issues",
  "missing_materials",
  "issue_photos",
].forEach((table) => {
  expectMatch(
    migration,
    new RegExp(`revoke\\s+update,\\s*delete\\s+on\\s+table\\s+public\\.${table}\\s+from\\s+public,\\s*anon,\\s*authenticated`, "i"),
    `${table} direct browser update/delete grants should be revoked`,
  );
  expectMatch(
    migration,
    new RegExp(`grant\\s+select,\\s*insert\\s+on\\s+table\\s+public\\.${table}\\s+to\\s+anon,\\s*authenticated`, "i"),
    `${table} should remain public select/insert for field submissions`,
  );
});

expectMatch(migration, /create table if not exists public\.admin_mutation_sessions/i, "migration should create admin mutation session ledger");
expectMatch(migration, /create table if not exists public\.admin_mutation_attempts/i, "migration should create admin mutation rate-limit ledger");
expectMatch(migration, /function public\.admin_delete_category_cascade/i, "migration should create transactional category cascade helper");
expectMatch(migration, /function public\.admin_delete_section_cascade/i, "migration should create transactional section cascade helper");
expectMatch(migration, /grant execute on function public\.admin_delete_category_cascade\(text\) to service_role/i, "category cascade helper should only be executable by service role");
expectMatch(migration, /grant execute on function public\.admin_delete_section_cascade\(text\) to service_role/i, "section cascade helper should only be executable by service role");
expectMatch(migration, /drop policy if exists "anon all safety categories"/i, "broad category policy should be dropped");
expectMatch(migration, /drop policy if exists "workers public insert"/i, "workers public insert policy should be dropped");
expectMatch(migration, /drop policy if exists "workers public update"/i, "workers public update policy should be dropped");
expectMatch(migration, /drop policy if exists "public all unsafe issues"/i, "broad unsafe issue policy should be dropped");
expectMatch(migration, /drop policy if exists "public all missing materials"/i, "broad missing material policy should be dropped");
expectMatch(migration, /drop policy if exists "public all issue photos"/i, "broad issue photo policy should be dropped");
expectMatch(lintCleanupMigration, /drop policy if exists "public read workers"/i, "follow-up migration should remove duplicate worker read policy");
expectMatch(lintCleanupMigration, /drop policy if exists "workers public select"/i, "follow-up migration should rebuild a single canonical worker read policy");
expectMatch(lintCleanupMigration, /create policy "workers public select"/i, "follow-up migration should keep one worker read policy");
expectMatch(lintCleanupMigration, /create policy "deny browser admin mutation sessions"/i, "session ledger should have an explicit deny policy for browser roles");
expectMatch(lintCleanupMigration, /create policy "deny browser admin mutation attempts"/i, "attempt ledger should have an explicit deny policy for browser roles");
expectMatch(inspectionBoundaryMigration, /revoke\s+update,\s*delete\s+on\s+table\s+public\.safety_inspections\s+from\s+public,\s*anon,\s*authenticated/i, "inspection history direct browser update/delete should be revoked");
expectMatch(inspectionBoundaryMigration, /revoke\s+update,\s*delete\s+on\s+table\s+public\.safety_inspection_items\s+from\s+public,\s*anon,\s*authenticated/i, "inspection item direct browser update/delete should be revoked");
expectMatch(inspectionBoundaryMigration, /create policy "public insert safety inspections"/i, "inspection history should keep public insert policy");
expectMatch(inspectionBoundaryMigration, /create policy "public insert safety inspection items"/i, "inspection items should keep public insert policy");
expectMatch(pkg.scripts.verify, /tests\/admin-mutation-boundary-static\.test\.js/, "verify script should include admin mutation boundary static test");

console.log("admin mutation boundary static tests passed");
