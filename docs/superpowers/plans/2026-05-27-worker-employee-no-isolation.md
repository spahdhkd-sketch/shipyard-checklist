# Worker Employee Number Isolation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop ordinary browser sync and direct anonymous Data API reads from exposing `workers.employee_no`, while keeping worker login and push registration compatible.

**Architecture:** Add a public worker read view that omits `employee_no`, switch frontend worker pulls to that read source, remove `employeeNo` from the persistent worker list state, and tighten column-level grants so anon/authenticated clients cannot select, insert, or update `employee_no`. Keep the current static PWA and broad admin UI in place; full admin server authorization is a later phase.

**Tech Stack:** Static HTML/PWA, vanilla JavaScript in `assets/js/app-v2.js`, Supabase Postgres/RLS/RPC, Supabase Edge Function compatibility, Node-based static tests and quality harness.

---

## References Checked

- Supabase changelog on 2026-05-27: relevant recent item is the 2026-04-28 Data API exposure change; new public objects need explicit grants.
- Supabase RLS docs: exposed schema tables should have RLS enabled and policies/grants define API reachability.
- Supabase API security docs: grants decide object reachability; RLS decides row visibility.
- Supabase view docs: Postgres views are security definer by default; use `security_invoker = true` on Postgres 15+ when the caller's RLS/permissions should apply.
- Live project read-only facts: Postgres `17.6`; current `workers` has `employee_no`; `verify_worker_login(p_worker_id text, p_employee_no text)` exists as a public `SECURITY DEFINER` boolean RPC; current `workers` policies allow broad public CRUD.

## Scope

This plan implements Phase 1 only:

- Hide `employee_no` from normal browser worker sync.
- Prevent anon/authenticated direct column select/insert/update for `workers.employee_no`.
- Keep `verify_worker_login` working.
- Keep `worker-push` compatible because it uses service role inside the Edge Function.
- Do not remove the current client-side admin password gate yet.
- Do not bump `APP_VERSION` unless the user explicitly chooses to deploy this change.

## File Structure

- Modify `assets/js/app-v2.js`
  - Add `readTable` support for remote reads.
  - Make the `workers` remote config read from `workers_public` and write to `workers`.
  - Remove `employeeNo` from persisted worker-list rows.
  - Remove the worker edit panel's employee-number input for this phase.
  - Keep `state.workerSession.employeeNo` for login/push flow compatibility.

- Create `supabase/migrations/20260527064035_worker_public_read_path.sql`
  - Define `public.workers_public` with `security_invoker = true`.
  - Track the current `verify_worker_login` RPC source.
  - Revoke table/column privileges that expose or mutate `employee_no`.
  - Grant public read only for approved worker columns and the public view.

- Create `tests/worker-security-static.test.js`
  - Static regression tests for frontend worker sync and SQL migration.

- Modify `tests/static-recovery.test.js`
  - Replace old expectations that required frontend `employee_no` mapping.

- Modify `tests/harness-config.test.js`
  - Confirm `npm.cmd run verify` includes the new test.

- Modify `package.json`
  - Add the new security test to the `verify` script.

- Optionally modify `tools/quality-harness.mjs`
  - Add a deploy-time source check that `employee_no` is not mapped into worker sync.

## Task 1: Add Failing Static Security Test

**Files:**
- Create: `tests/worker-security-static.test.js`
- Modify: `package.json`
- Modify: `tests/harness-config.test.js`

- [ ] **Step 1: Create the failing test file**

Create `tests/worker-security-static.test.js` with this content:

```js
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const app = read("assets/js/app-v2.js");
const migration = read("supabase/migrations/20260527064035_worker_public_read_path.sql");

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
assert.match(migration, /grant update\s*\(\s*name,\s*team,\s*position,\s*active,\s*created_at,\s*updated_at,\s*unsafe_push_target\s*\)\s+on public\.workers to anon, authenticated/i, "workers update grant should omit employee_no while allowing Phase 1 upsert created_at");
assert.match(migration, /create or replace function public\.verify_worker_login\(p_worker_id text, p_employee_no text\)/i, "login RPC source should be tracked");
assert.match(migration, /security definer/i, "login RPC should keep current security-definer behavior for browser RPC compatibility");
assert.match(migration, /grant execute on function public\.verify_worker_login\(text, text\) to anon, authenticated/i, "browser clients should be able to execute login RPC");

console.log("worker security static tests passed");
```

- [ ] **Step 2: Wire the test into `package.json`**

Edit `package.json` so the `verify` script ends with the new test:

```json
{
  "scripts": {
    "verify": "node --check assets/js/app-v2.js && node --check assets/js/checklist-rules.js && node --check assets/js/issue-material-rules.js && node --check tools/quality-harness.mjs && node --check tools/claude-quality-harness.mjs && node tests/checklist-rules.test.js && node tests/issue-material-rules.test.js && node tests/static-recovery.test.js && node tests/harness-config.test.js && node tests/worker-security-static.test.js",
    "harness": "node tools/quality-harness.mjs",
    "harness:live": "node tools/quality-harness.mjs --live",
    "harness:strict": "node tools/quality-harness.mjs --strict-git --live",
    "serve": "node tools/static-server.mjs 4173"
  }
}
```

- [ ] **Step 3: Update harness config test**

In `tests/harness-config.test.js`, add this assertion after the existing `tests/harness-config.test.js` assertion:

```js
assert.match(pkg.scripts.verify, /tests\/worker-security-static\.test\.js/);
```

- [ ] **Step 4: Run the new test and confirm it fails**

Run:

```powershell
npm.cmd run verify
```

Expected: FAIL because `supabase/migrations/20260527064035_worker_public_read_path.sql` does not exist yet and `app-v2.js` still maps `employee_no`.

- [ ] **Step 5: Commit the failing test**

Do not commit if unrelated user changes appear staged. Commit only the test/script changes:

```powershell
git add -- package.json tests/harness-config.test.js tests/worker-security-static.test.js
git commit -m "test: cover worker employee number isolation"
```

## Task 2: Add Supabase Migration for Public Worker Read Path

**Files:**
- Create: `supabase/migrations/20260527064035_worker_public_read_path.sql`

- [ ] **Step 1: Create the migration file**

Prefer the Supabase CLI creation flow, then use the deterministic path in this plan:

```powershell
npx.cmd supabase migration new worker_public_read_path
```

If the CLI creates a different timestamped file, rename that generated file to:

```text
supabase/migrations/20260527064035_worker_public_read_path.sql
```

- [ ] **Step 2: Add the migration SQL**

Put this exact SQL into `supabase/migrations/20260527064035_worker_public_read_path.sql`:

```sql
-- Phase 1 security hardening:
-- - browser worker sync reads public worker fields through workers_public
-- - employee_no remains available only to server-side privileged code and verify_worker_login
-- - direct anon/authenticated select/insert/update of employee_no is removed

create or replace view public.workers_public
with (security_invoker = true)
as
select
  id,
  name,
  team,
  position,
  active,
  unsafe_push_target,
  created_at,
  updated_at
from public.workers;

grant select on table public.workers_public to anon, authenticated;

revoke select on table public.workers from public, anon, authenticated;
grant select (
  id,
  name,
  team,
  position,
  active,
  created_at,
  updated_at,
  unsafe_push_target
) on public.workers to anon, authenticated;

revoke insert, update on table public.workers from public, anon, authenticated;
grant insert (
  id,
  name,
  team,
  position,
  active,
  created_at,
  updated_at,
  unsafe_push_target
) on public.workers to anon, authenticated;
grant update (
  name,
  team,
  position,
  active,
  updated_at,
  unsafe_push_target
) on public.workers to anon, authenticated;

create or replace function public.verify_worker_login(p_worker_id text, p_employee_no text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workers
    where id = p_worker_id
      and active is true
      and nullif(btrim(employee_no), '') is not null
      and btrim(employee_no) = btrim(coalesce(p_employee_no, ''))
  );
$$;

revoke all on function public.verify_worker_login(text, text) from public;
grant execute on function public.verify_worker_login(text, text) to anon, authenticated;

comment on view public.workers_public is
  'Public browser-safe worker read model. Deliberately omits employee_no.';

comment on function public.verify_worker_login(text, text) is
  'Compares worker employee number inside Postgres so employee_no is not exposed through browser sync.';
```

- [ ] **Step 3: Run the migration-focused test and confirm this part passes**

Run:

```powershell
node tests/worker-security-static.test.js
```

Expected: still FAIL because `app-v2.js` has not been changed yet, but migration assertions should no longer be the failure.

- [ ] **Step 4: Commit the migration**

```powershell
git add -- supabase/migrations/20260527064035_worker_public_read_path.sql
git commit -m "chore: add worker public read path migration"
```

## Task 3: Update Frontend Worker Sync

**Files:**
- Modify: `assets/js/app-v2.js`
- Modify: `tests/static-recovery.test.js`

- [ ] **Step 1: Patch the workers remote config**

In `assets/js/app-v2.js`, replace the current workers config block:

```js
      {
        table: "workers",
        key: "workers",
        toDb: (row) => ({
          id: row.id,
          name: row.name,
          team: row.team || "",
          position: normalizeWorkerPosition(row.position),
          employee_no: normalizeEmployeeNo(row.employeeNo),
          unsafe_push_target: Boolean(row.unsafePushTarget),
          created_at: row.createdAt || serverNow().toISOString(),
          updated_at: row.updatedAt || row.createdAt || serverNow().toISOString(),
        }),
        fromDb: (row) => ({
          id: row.id,
          name: row.name,
          team: row.team || "",
          position: normalizeWorkerPosition(row.position),
          employeeNo: normalizeEmployeeNo(row.employee_no),
          unsafePushTarget: Boolean(row.unsafe_push_target),
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }),
      },
```

with:

```js
      {
        table: "workers",
        readTable: "workers_public",
        key: "workers",
        toDb: (row) => ({
          id: row.id,
          name: row.name,
          team: row.team || "",
          position: normalizeWorkerPosition(row.position),
          active: row.active !== false,
          unsafe_push_target: Boolean(row.unsafePushTarget),
          created_at: row.createdAt || serverNow().toISOString(),
          updated_at: row.updatedAt || row.createdAt || serverNow().toISOString(),
        }),
        fromDb: (row) => ({
          id: row.id,
          name: row.name,
          team: row.team || "",
          position: normalizeWorkerPosition(row.position),
          active: row.active !== false,
          unsafePushTarget: Boolean(row.unsafe_push_target),
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }),
      },
```

- [ ] **Step 2: Patch worker normalization**

In `normalizeDataShape()`, replace:

```js
      state.workers = (Array.isArray(state.workers) ? state.workers : []).map((worker) => ({
        id: worker.id || uid("worker"),
        name: String(worker.name || "").trim(),
        team: String(worker.team || "").trim(),
        position: normalizeWorkerPosition(worker.position),
        employeeNo: normalizeEmployeeNo(worker.employeeNo || worker.employee_no || ""),
        unsafePushTarget: Boolean(worker.unsafePushTarget || worker.unsafe_push_target),
        createdAt: worker.createdAt || serverNow().toISOString(),
        updatedAt: worker.updatedAt || worker.createdAt || serverNow().toISOString(),
      })).filter((worker) => worker.name);
```

with:

```js
      state.workers = (Array.isArray(state.workers) ? state.workers : []).map((worker) => ({
        id: worker.id || uid("worker"),
        name: String(worker.name || "").trim(),
        team: String(worker.team || "").trim(),
        position: normalizeWorkerPosition(worker.position),
        active: worker.active !== false,
        unsafePushTarget: Boolean(worker.unsafePushTarget || worker.unsafe_push_target),
        createdAt: worker.createdAt || serverNow().toISOString(),
        updatedAt: worker.updatedAt || worker.createdAt || serverNow().toISOString(),
      })).filter((worker) => worker.name);
```

- [ ] **Step 3: Remove employee-number editing from worker cards**

In `renderWorkerEditPanel(worker)`, delete this field block:

```js
          <div class="field">
            <label for="${esc(workerFieldId(worker, "employeeNo"))}">사번/비밀번호</label>
            <input class="input" id="${esc(workerFieldId(worker, "employeeNo"))}" data-worker-edit="${esc(worker.id)}" data-worker-edit-field="employeeNo" value="${esc(worker.employeeNo || "")}" autocomplete="off" inputmode="text" />
          </div>
```

Immediately after the closing `</div>` for `worker-edit-grid`, add this explanatory inline note:

```js
        <p class="small muted worker-security-note">사번/비밀번호 변경은 보안 전환 중 서버 관리 경로로 이동합니다.</p>
```

- [ ] **Step 4: Stop adding and saving employeeNo on worker rows**

In `addWorker()`, replace:

```js
      state.workers.push({ id, name, team, position, employeeNo: "", createdAt: now, updatedAt: now });
```

with:

```js
      state.workers.push({ id, name, team, position, active: true, createdAt: now, updatedAt: now });
```

In `saveWorker(id)`, delete:

```js
      const cleanEmployeeNo = normalizeEmployeeNo(workerEditFieldValue(id, "employeeNo"));
```

Delete:

```js
      worker.employeeNo = cleanEmployeeNo;
```

Replace:

```js
        state.workerSession = { ...state.workerSession, workerName: cleanName, employeeNo: cleanEmployeeNo };
```

with:

```js
        state.workerSession = { ...state.workerSession, workerName: cleanName };
```

- [ ] **Step 5: Patch `selectTable()` to use `readTable`**

Replace:

```js
    async function selectTable(client, config) {
      const { data, error } = await client.from(config.table).select("*");
      if (error) throw error;
      return { key: config.key, rows: (data || []).map(config.fromDb) };
    }
```

with:

```js
    async function selectTable(client, config) {
      const source = config.readTable || config.table;
      const { data, error } = await client.from(source).select("*");
      if (error) throw error;
      return { key: config.key, rows: (data || []).map(config.fromDb) };
    }
```

- [ ] **Step 6: Update `tests/static-recovery.test.js`**

Replace the two old assertions:

```js
assert.match(app, /employee_no: normalizeEmployeeNo\(row\.employeeNo\)/);
assert.match(app, /employeeNo: normalizeEmployeeNo\(row\.employee_no\)/);
```

with:

```js
assert.match(app, /readTable: "workers_public"/);
assert.doesNotMatch(app, /employee_no: normalizeEmployeeNo\(row\.employeeNo\)/);
assert.doesNotMatch(app, /employeeNo: normalizeEmployeeNo\(row\.employee_no\)/);
```

- [ ] **Step 7: Run frontend static tests**

Run:

```powershell
npm.cmd run verify
```

Expected: PASS.

- [ ] **Step 8: Commit frontend changes**

```powershell
git add -- assets/js/app-v2.js tests/static-recovery.test.js
git commit -m "fix: isolate worker employee numbers from browser sync"
```

## Task 4: Add Harness Guard for Worker Secret Sync

**Files:**
- Modify: `tools/quality-harness.mjs`
- Modify: `tests/harness-config.test.js`

- [ ] **Step 1: Add source checks to the quality harness**

In `tools/quality-harness.mjs`, inside `checkRuntimeSource()` after the active Supabase ref check, add:

```js
  assertContains(app, 'readTable: "workers_public"', "workers read through public safe view");
  assertNotContains(app, "employee_no: normalizeEmployeeNo(row.employeeNo)", "worker sync does not write employee_no");
  assertNotContains(app, "employeeNo: normalizeEmployeeNo(row.employee_no)", "worker sync does not read employee_no");
  assertNotContains(app, 'data-worker-edit-field="employeeNo"', "worker edit UI does not expose employee_no");
```

- [ ] **Step 2: Add harness-config assertions**

In `tests/harness-config.test.js`, after the existing harness assertions around Supabase/project/version, add:

```js
assert.match(harness, /workers read through public safe view/);
assert.match(harness, /worker sync does not write employee_no/);
assert.match(harness, /worker sync does not read employee_no/);
```

- [ ] **Step 3: Run verify and harness**

Run:

```powershell
npm.cmd run verify
npm.cmd run harness
```

Expected:

- `verify`: PASS
- `harness`: PASS, with a warning about any unrelated untracked handoff file still present.

- [ ] **Step 4: Commit harness guard**

```powershell
git add -- tools/quality-harness.mjs tests/harness-config.test.js
git commit -m "test: guard worker secret sync in harness"
```

## Task 5: Apply Supabase Migration and Verify Live DB Behavior

**Files:**
- No source edit if prior tasks are complete.

- [ ] **Step 1: Review SQL before applying**

Run:

```powershell
Get-Content -Raw supabase\migrations\20260527064035_worker_public_read_path.sql
```

Confirm:

- `workers_public` omits `employee_no`.
- `security_invoker = true` is present.
- anon/authenticated grants omit `employee_no` for select, insert, and update.
- `verify_worker_login` source is tracked.
- No secret values are present.

- [ ] **Step 2: Apply the migration through Supabase**

Use the Supabase MCP `apply_migration` tool with:

```text
project_id: yuuroocvxvzgmsdeeiws
name: worker_public_read_path
query: contents of supabase/migrations/20260527064035_worker_public_read_path.sql
```

Expected: migration succeeds without returning any data rows.

- [ ] **Step 3: Verify Postgres privileges**

Run this read-only SQL through Supabase MCP `execute_sql`:

```sql
select
  has_table_privilege('anon', 'public.workers_public', 'SELECT') as anon_can_select_workers_public,
  has_column_privilege('anon', 'public.workers', 'employee_no', 'SELECT') as anon_can_select_employee_no,
  has_column_privilege('anon', 'public.workers', 'employee_no', 'INSERT') as anon_can_insert_employee_no,
  has_column_privilege('anon', 'public.workers', 'employee_no', 'UPDATE') as anon_can_update_employee_no,
  has_function_privilege('anon', 'public.verify_worker_login(text,text)', 'EXECUTE') as anon_can_execute_login_rpc;
```

Expected:

```text
anon_can_select_workers_public = true
anon_can_select_employee_no = false
anon_can_insert_employee_no = false
anon_can_update_employee_no = false
anon_can_execute_login_rpc = true
```

- [ ] **Step 4: Verify the public view columns**

Run:

```sql
select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'workers_public'
order by ordinal_position;
```

Expected columns only:

```text
id
name
team
position
active
unsafe_push_target
created_at
updated_at
```

- [ ] **Step 5: Verify REST behavior without printing the anon key**

Run this local probe. It reads the public key from `app-v2.js` but prints only HTTP statuses and booleans:

```powershell
@'
const fs = require("fs");
const app = fs.readFileSync("assets/js/app-v2.js", "utf8");
const url = /const SUPABASE_URL = "([^"]+)"/.exec(app)?.[1];
const key = /const SUPABASE_ANON_KEY = "([^"]+)"/.exec(app)?.[1];
if (!url || !key) throw new Error("Supabase client config not found");

async function request(path) {
  const response = await fetch(`${url}${path}`, {
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
    },
  });
  const text = await response.text();
  return { status: response.status, text };
}

(async () => {
  const publicView = await request("/rest/v1/workers_public?select=id,name,team,position,unsafe_push_target&limit=1");
  const employeeNoRead = await request("/rest/v1/workers?select=id,name,employee_no&limit=1");
  console.log(JSON.stringify({
    workersPublicReadable: publicView.status === 200,
    employeeNoReadBlocked: employeeNoRead.status !== 200,
    employeeNoBodyContainsColumn: /employee_no/i.test(employeeNoRead.text),
  }, null, 2));
})();
'@ | node
```

Expected:

```json
{
  "workersPublicReadable": true,
  "employeeNoReadBlocked": true,
  "employeeNoBodyContainsColumn": true
}
```

The last value may be true because the error message names the blocked column. It must not include any real employee number values.

- [ ] **Step 6: Commit a verification note if needed**

If the project convention requires a deployment or DB note, create `docs/deployments/2026-05-27-worker-employee-no-isolation-db.md` with only statuses and no secrets. Commit it separately:

```powershell
git add -- docs/deployments/2026-05-27-worker-employee-no-isolation-db.md
git commit -m "docs: record worker employee number db verification"
```

## Task 6: Browser and Production Readiness Verification

**Files:**
- No source edit expected.

- [ ] **Step 1: Run full local verification**

```powershell
npm.cmd run verify
npm.cmd run harness
```

Expected: both PASS. `harness` may warn about unrelated untracked docs; do not hide that warning.

- [ ] **Step 2: Start local server**

```powershell
npm.cmd run serve
```

Expected: server listens on `http://localhost:4173`.

- [ ] **Step 3: Browser smoke check**

Open `http://localhost:4173` and verify:

- Login screen still lists workers.
- Login still calls `verify_worker_login`.
- Worker manager still renders worker cards.
- Worker edit panel no longer shows the employee-number field.
- Push registration still asks for a typed employee number when the worker session lacks one.

- [x] **Step 4: Deployment approval/status**

User previously approved version-up/deploy work. After the DB migration, live REST `/workers?select=*` returned 401 while `/workers_public` returned 200, so frontend deployment is required for production compatibility.

## Task 7: Production Deployment Plan After Approval

- **Files:**
- Version/cache files changed because the live service worker already cached the previous 0.7 token without `workers_public`.

- [ ] **Step 1: Confirm versioning**

Version/cache values for this deployment:

```text
APP_VERSION: 0.8-20260527
Asset token: 20260527-v0-8-worker-public-1
SW cache: gs-safety-v20-20260527-worker-public
```

- [ ] **Step 2: Deploy**

```powershell
npx.cmd vercel --prod --yes
```

Copy the deployment URL exactly from the output.

- [ ] **Step 3: Alias production**

```powershell
$deploymentUrl = Read-Host "Paste the Vercel deployment URL from the previous command"
npx.cmd vercel alias set $deploymentUrl gs-safety-checklist.vercel.app
```

- [ ] **Step 4: Verify live production**

```powershell
npm.cmd run harness:live
```

Expected: PASS.

Also manually verify:

```text
https://gs-safety-checklist.vercel.app/sw.js
```

If no version/cache bump was requested, the cache name should remain unchanged.

## Rollback

If frontend deployment breaks worker list loading:

1. Revert the frontend commit that switches `workers` reads to `workers_public`.
2. Redeploy the previous Vercel production commit.
3. Keep the DB migration in place if REST employee-number reads are already blocked and the previous frontend can tolerate it; otherwise apply the rollback SQL below.

Rollback SQL for DB permissions:

```sql
grant select on table public.workers to anon, authenticated;
grant insert, update on table public.workers to anon, authenticated;
drop view if exists public.workers_public;
```

Use the rollback SQL only after confirming the frontend cannot be restored safely another way. It reopens the employee-number exposure and should be treated as temporary emergency rollback.

## Plan Self-Review

- Spec coverage: covers Phase 1 security baseline only, matching the approved staged design.
- Red-flag scan: no vague future-work markers or unspecified code steps remain.
- Type consistency: frontend uses `readTable`, `active`, `unsafePushTarget`, and existing `verify_worker_login` names consistently.
- Known limitation: admin worker password editing is intentionally removed from the browser UI in Phase 1. A server-side admin mutation path is required in the next security phase.
