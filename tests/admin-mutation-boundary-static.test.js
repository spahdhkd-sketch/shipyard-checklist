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
const migration = read("supabase/migrations/20260527090832_admin_mutation_boundary.sql");
const lintCleanupMigration = read("supabase/migrations/20260527091242_admin_mutation_policy_lint_cleanup.sql");
const inspectionBoundaryMigration = read("supabase/migrations/20260527093146_inspection_history_insert_only_boundary.sql");
const workPrepBoundaryMigration = read("supabase/migrations/20260527142709_work_prep_records_rls_boundary.sql");
const workPrepUpdateShapeMigration = read("supabase/migrations/20260527142910_work_prep_records_update_shape_policy.sql");
const appStateBoundaryMigration = read("supabase/migrations/20260527143351_app_state_read_only_boundary.sql");
const issueInsertShapeMigration = read("supabase/migrations/20260527144011_issue_records_insert_shape_policies.sql");
const workerPushBoundaryMigration = read("supabase/migrations/20260527144418_worker_push_subscriptions_boundary.sql");
const performanceIndexCleanupMigration = read("supabase/migrations/20260527150339_drop_redundant_unused_indexes.sql");
const adminSessionFkIndexMigration = read("supabase/migrations/20260527150501_restore_admin_session_worker_fk_index.sql");
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
expectMatch(workPrepBoundaryMigration, /drop policy if exists "allow_all_work_prep_records"/i, "work prep records broad all-true policy should be dropped");
expectMatch(workPrepBoundaryMigration, /revoke\s+delete,\s*truncate,\s*references,\s*trigger\s+on\s+table\s+public\.work_prep_records\s+from\s+public,\s*anon,\s*authenticated/i, "work prep records destructive and schema-level public grants should be revoked");
expectMatch(workPrepBoundaryMigration, /grant\s+select,\s*insert,\s*update\s+on\s+table\s+public\.work_prep_records\s+to\s+anon,\s*authenticated/i, "work prep records should keep public select/insert/update for field registration sync");
expectMatch(workPrepBoundaryMigration, /create policy "public select work prep records"[\s\S]*for select[\s\S]*using \(true\)/i, "work prep records should keep public select policy");
expectMatch(workPrepBoundaryMigration, /create policy "public insert work prep records"[\s\S]*for insert[\s\S]*with check \([\s\S]*jsonb_typeof\(worker_ids\) = 'array'[\s\S]*coalesce\(status, 'preparing'\) in/i, "work prep records should keep public insert policy with shape checks");
expectMatch(workPrepBoundaryMigration, /create policy "public update work prep records"[\s\S]*for update[\s\S]*using \(true\)[\s\S]*with check \([\s\S]*jsonb_typeof\(worker_ids\) = 'array'[\s\S]*coalesce\(status, 'preparing'\) in/i, "work prep records should keep public update policy with shape checks");
expectNoMatch(workPrepBoundaryMigration, /create policy "[^"]*delete[^"]*"[\s\S]*on public\.work_prep_records/i, "work prep records should not expose a public delete policy");
expectMatch(workPrepUpdateShapeMigration, /drop policy if exists "public update work prep records"/i, "work prep update follow-up should replace the permissive update policy");
expectMatch(workPrepUpdateShapeMigration, /create policy "public update work prep records"[\s\S]*for update[\s\S]*using \([\s\S]*jsonb_typeof\(worker_ids\) = 'array'[\s\S]*coalesce\(status, 'preparing'\) in[\s\S]*with check \([\s\S]*jsonb_typeof\(worker_ids\) = 'array'[\s\S]*coalesce\(status, 'preparing'\) in/i, "work prep update policy should constrain both USING and WITH CHECK");
expectNoMatch(workPrepUpdateShapeMigration, /for update[\s\S]*using \(true\)/i, "work prep update follow-up should not leave an always-true UPDATE using clause");
expectNoMatch(app, /app_state/, "current frontend sync should not depend on legacy app_state writes");
expectMatch(appStateBoundaryMigration, /revoke\s+insert,\s*update,\s*delete,\s*truncate,\s*references,\s*trigger\s+on\s+table\s+public\.app_state\s+from\s+public,\s*anon,\s*authenticated/i, "app_state public writes and schema-level grants should be revoked");
expectMatch(appStateBoundaryMigration, /grant\s+select\s+on\s+table\s+public\.app_state\s+to\s+anon,\s*authenticated/i, "app_state should remain public read-only for legacy state reads");
expectMatch(appStateBoundaryMigration, /drop policy if exists "app_state_insert_public"/i, "app_state insert policy should be dropped");
expectMatch(appStateBoundaryMigration, /drop policy if exists "app_state_update_public"/i, "app_state update policy should be dropped");
expectMatch(appStateBoundaryMigration, /create policy "app_state_select_public"[\s\S]*for select[\s\S]*using \(\s*id = 'shipyard-safety'[\s\S]*jsonb_typeof\(data\) = 'object'/i, "app_state select should be limited to the legacy shipyard state row");
expectNoMatch(appStateBoundaryMigration, /for\s+(insert|update|delete)\b/i, "app_state migration should not create public write policies");
expectMatch(issueInsertShapeMigration, /revoke\s+truncate,\s*references,\s*trigger\s+on\s+table\s+public\.unsafe_issues\s+from\s+public,\s*anon,\s*authenticated/i, "unsafe issue schema-level grants should be revoked");
expectMatch(issueInsertShapeMigration, /revoke\s+truncate,\s*references,\s*trigger\s+on\s+table\s+public\.missing_materials\s+from\s+public,\s*anon,\s*authenticated/i, "missing material schema-level grants should be revoked");
expectMatch(issueInsertShapeMigration, /revoke\s+truncate,\s*references,\s*trigger\s+on\s+table\s+public\.issue_photos\s+from\s+public,\s*anon,\s*authenticated/i, "issue photo schema-level grants should be revoked");
expectMatch(issueInsertShapeMigration, /create policy "public insert unsafe issues"[\s\S]*for insert[\s\S]*with check \([\s\S]*status = '접수'[\s\S]*admin_memo = ''[\s\S]*completed_at is null[\s\S]*jsonb_typeof\(status_history\) = 'array'/i, "unsafe issue public insert should be shape-limited");
expectMatch(issueInsertShapeMigration, /create policy "public insert missing materials"[\s\S]*for insert[\s\S]*with check \([\s\S]*status = '접수'[\s\S]*admin_memo = ''[\s\S]*completed_at is null[\s\S]*jsonb_typeof\(status_history\) = 'array'/i, "missing material public insert should be shape-limited");
expectMatch(issueInsertShapeMigration, /create policy "public insert issue photos"[\s\S]*for insert[\s\S]*with check \([\s\S]*target_type = 'unsafe_issue'[\s\S]*storage_bucket = 'issue-photos'[\s\S]*storage_path like 'unsafe\/%'/i, "issue photo public insert should be shape-limited to unsafe issue uploads");
expectNoMatch(issueInsertShapeMigration, /with check \(true\)/i, "issue record insert policies should not keep always-true checks");
expectNoMatch(app, /from\("worker_push_subscriptions"\)/, "frontend must not directly access worker push subscription rows");
expectMatch(workerPushBoundaryMigration, /revoke\s+all\s+on\s+table\s+public\.worker_push_subscriptions\s+from\s+public,\s*anon,\s*authenticated/i, "worker push subscription table grants should be revoked from browser roles");
expectMatch(workerPushBoundaryMigration, /create policy "deny browser worker push subscriptions select"[\s\S]*for select[\s\S]*using \(false\)/i, "worker push subscription table should have an explicit deny select policy");
expectMatch(workerPushBoundaryMigration, /create policy "deny browser worker push subscriptions insert"[\s\S]*for insert[\s\S]*with check \(false\)/i, "worker push subscription table should have an explicit deny insert policy");
expectMatch(workerPushBoundaryMigration, /create policy "deny browser worker push subscriptions update"[\s\S]*for update[\s\S]*using \(false\)[\s\S]*with check \(false\)/i, "worker push subscription table should have an explicit deny update policy");
expectMatch(workerPushBoundaryMigration, /create policy "deny browser worker push subscriptions delete"[\s\S]*for delete[\s\S]*using \(false\)/i, "worker push subscription table should have an explicit deny delete policy");
[
  "safety_items_category_section_order_idx",
  "safety_sections_category_order_idx",
  "safety_inspection_items_inspection_idx",
  "unsafe_issues_status_created_idx",
  "unsafe_issues_ship_idx",
  "worker_push_subscriptions_endpoint_idx",
  "admin_mutation_sessions_worker_idx",
  "admin_mutation_attempts_worker_idx",
].forEach((indexName) => {
  expectMatch(
    performanceIndexCleanupMigration,
    new RegExp(`drop\\s+index\\s+if\\s+exists\\s+public\\.${indexName}`, "i"),
    `${indexName} should be dropped by the performance cleanup migration`,
  );
});
expectNoMatch(performanceIndexCleanupMigration, /drop\s+index\s+if\s+exists\s+public\.issue_photos_target_idx/i, "issue photo target lookup index should be retained for target metadata cleanup");
expectMatch(performanceIndexCleanupMigration, /comment on index public\.issue_photos_target_idx/i, "retained issue photo target index should document the service-role query path");
expectMatch(adminSessionFkIndexMigration, /create\s+index\s+if\s+not\s+exists\s+admin_mutation_sessions_worker_fk_idx\s+on\s+public\.admin_mutation_sessions\s*\(\s*worker_id\s*\)/i, "admin mutation sessions should keep a covering index for its worker_id foreign key");
expectMatch(adminSessionFkIndexMigration, /comment on index public\.admin_mutation_sessions_worker_fk_idx/i, "admin session worker FK index should document why it is retained");
expectMatch(pkg.scripts.verify, /tests\/admin-mutation-boundary-static\.test\.js/, "verify script should include admin mutation boundary static test");

console.log("admin mutation boundary static tests passed");
