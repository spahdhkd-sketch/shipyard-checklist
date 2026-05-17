# Issue And Material Detail Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `불안전요소 등록`, `호선자재 누락`, and admin-only `관리` workflows described in the approved detail-screen spec.

**Architecture:** Keep the existing static app pattern, but isolate new issue/material business rules in a small UMD helper that can be tested with Node. Add three new app views (`unsafe`, `materials`, `manage`) and three matching static entry pages. Persist new records locally first, then sync to Supabase tables and upload unsafe issue photos to Supabase Storage.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, Supabase JS v2, Node built-in `assert` tests, existing `tools/static-server.mjs` browser smoke tooling.

---

## Scope Check

The approved spec covers related workflows that share workers, ship selection, status handling, and admin management. Implement them as one feature plan because each registration screen depends on the same worker list and admin management model.

## File Structure

- Create `assets/js/issue-material-rules.js`
  - Owns constants, validation, sorting, filtering, grouping, snapshot helpers, and photo count rules for the two new workflows.
  - Exports through the same UMD pattern as `assets/js/checklist-rules.js` so Node tests and browser code can both use it.
- Modify `index.html`, `check.html`, `history.html`, `ships.html`, `items.html`
  - Add `<script src="assets/js/issue-material-rules.js" defer></script>` before `assets/js/app.js`.
- Create `unsafe.html`
  - Same shell as existing pages, with `body data-initial-view="unsafe"`.
- Create `materials.html`
  - Same shell as existing pages, with `body data-initial-view="materials"`.
- Create `manage.html`
  - Same shell as existing pages, with `body data-initial-view="manage"`.
- Modify `assets/js/app.js`
  - Add state keys for workers, unsafe issues, missing materials, issue photos, drafts, filters, and active manage tab.
  - Add remote table config for the new tables.
  - Add routes/views and render functions for unsafe registration, material registration, completion/detail, and admin management tabs.
  - Add Supabase Storage upload/delete helpers for unsafe issue photos.
- Modify `assets/css/styles.css`
  - Add compact form, photo picker, completion screen, grouped list, admin tab, and record card styles.
- Create `tests/issue-material-rules.test.js`
  - Covers helper behavior without browser dependencies.
- Modify `tests/visual-check.js`
  - Add a lightweight smoke flow for the new views after the main implementation is complete.
- Create `docs/supabase-schema-2026-05-15-issue-materials.sql`
  - Defines `workers`, `unsafe_issues`, `missing_materials`, `issue_photos`, and Storage policy notes for `issue-photos`.

## Data Shapes

Use these JavaScript shapes in `state` and localStorage.

```js
const worker = {
  id: "worker_abc",
  name: "김민수",
  team: "배관팀",
  createdAt: "2026-05-15T00:00:00.000Z",
  updatedAt: "2026-05-15T00:00:00.000Z",
};

const unsafeIssue = {
  id: "unsafe_abc",
  shipNo: "H-102",
  content: "용접장 주변 통로 적치물",
  workerId: "worker_abc",
  workerNameSnapshot: "김민수",
  workerTeamSnapshot: "배관팀",
  status: "접수",
  adminMemo: "",
  createdAt: "2026-05-15T00:00:00.000Z",
  updatedAt: "2026-05-15T00:00:00.000Z",
  completedAt: "",
};

const missingMaterial = {
  id: "material_abc",
  shipNo: "H-102",
  materialName: "배관 자재",
  content: "3번 블록 배관 자재 누락",
  workerId: "worker_abc",
  workerNameSnapshot: "김민수",
  workerTeamSnapshot: "배관팀",
  status: "접수",
  adminMemo: "",
  createdAt: "2026-05-15T00:00:00.000Z",
  updatedAt: "2026-05-15T00:00:00.000Z",
  completedAt: "",
};

const issuePhoto = {
  id: "photo_abc",
  targetType: "unsafe_issue",
  targetId: "unsafe_abc",
  storageBucket: "issue-photos",
  storagePath: "unsafe/unsafe_abc/original-1.jpg",
  sortOrder: 1,
  createdAt: "2026-05-15T00:00:00.000Z",
};
```

### Task 1: Helper Rules And Unit Tests

**Files:**
- Create: `assets/js/issue-material-rules.js`
- Create: `tests/issue-material-rules.test.js`

- [ ] **Step 1: Write the failing helper tests**

Create `tests/issue-material-rules.test.js` with:

```js
const assert = require("assert");

const {
  UNSAFE_STATUSES,
  MATERIAL_STATUSES,
  MAX_UNSAFE_PHOTOS,
  createWorkerSnapshot,
  filterRecords,
  groupMaterialsByShip,
  groupUnsafeByStatus,
  sortRecords,
  validateMaterialDraft,
  validateUnsafeDraft,
} = require("../assets/js/issue-material-rules.js");

const workers = [
  { id: "worker-1", name: "김민수", team: "배관팀" },
  { id: "worker-2", name: "이서연", team: "전장팀" },
];

const unsafeRecords = [
  { id: "u1", shipNo: "H-102", content: "통로 적치물", workerId: "worker-1", workerNameSnapshot: "김민수", status: "완료", createdAt: "2026-05-15T08:00:00.000Z" },
  { id: "u2", shipNo: "H-104", content: "난간 흔들림", workerId: "worker-2", workerNameSnapshot: "이서연", status: "접수", createdAt: "2026-05-15T10:00:00.000Z" },
  { id: "u3", shipNo: "H-102", content: "불티 위험", workerId: "worker-2", workerNameSnapshot: "이서연", status: "조치중", createdAt: "2026-05-15T09:00:00.000Z" },
];

const materialRecords = [
  { id: "m1", shipNo: "H-102", materialName: "배관 자재", workerId: "worker-1", workerNameSnapshot: "김민수", status: "확인중", createdAt: "2026-05-15T08:00:00.000Z" },
  { id: "m2", shipNo: "H-104", materialName: "밸브", workerId: "worker-2", workerNameSnapshot: "이서연", status: "접수", createdAt: "2026-05-15T10:00:00.000Z" },
  { id: "m3", shipNo: "H-102", materialName: "전선 트레이", workerId: "worker-2", workerNameSnapshot: "이서연", status: "완료", createdAt: "2026-05-15T09:00:00.000Z" },
];

assert.deepStrictEqual(UNSAFE_STATUSES, ["접수", "조치중", "완료"]);
assert.deepStrictEqual(MATERIAL_STATUSES, ["접수", "확인중", "완료"]);
assert.strictEqual(MAX_UNSAFE_PHOTOS, 3);

assert.deepStrictEqual(
  createWorkerSnapshot("worker-1", workers),
  { workerId: "worker-1", workerNameSnapshot: "김민수", workerTeamSnapshot: "배관팀" },
);

assert.deepStrictEqual(
  validateUnsafeDraft({ shipNo: "", content: "", workerId: "" }),
  ["호선을 선택하세요.", "내용을 입력하세요.", "등록자를 선택하세요."],
);

assert.deepStrictEqual(
  validateMaterialDraft({ shipNo: "H-102", materialName: "", content: "", workerId: "worker-1" }),
  ["자재명을 입력하세요.", "내용을 입력하세요."],
);

assert.deepStrictEqual(
  filterRecords(unsafeRecords, { shipNo: "H-102", status: "", workerId: "" }).map((row) => row.id),
  ["u1", "u3"],
);

assert.deepStrictEqual(
  sortRecords(unsafeRecords, "status", UNSAFE_STATUSES).map((row) => row.id),
  ["u2", "u3", "u1"],
);

assert.deepStrictEqual(
  groupUnsafeByStatus(unsafeRecords).map((group) => [group.status, group.records.map((row) => row.id)]),
  [["접수", ["u2"]], ["조치중", ["u3"]], ["완료", ["u1"]]],
);

assert.deepStrictEqual(
  groupMaterialsByShip(materialRecords).map((group) => [group.shipNo, group.records.map((row) => row.id)]),
  [["H-102", ["m1", "m3"]], ["H-104", ["m2"]]],
);

assert.deepStrictEqual(
  sortRecords(materialRecords, "materialName", MATERIAL_STATUSES).map((row) => row.id),
  ["m2", "m1", "m3"],
);

console.log("issue-material-rules tests passed");
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
node tests/issue-material-rules.test.js
```

Expected: FAIL with a module not found error for `assets/js/issue-material-rules.js`.

- [ ] **Step 3: Create the helper module**

Create `assets/js/issue-material-rules.js` with:

```js
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.IssueMaterialRules = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  const UNSAFE_STATUSES = ["접수", "조치중", "완료"];
  const MATERIAL_STATUSES = ["접수", "확인중", "완료"];
  const MAX_UNSAFE_PHOTOS = 3;

  function compactText(value) {
    return String(value || "").trim();
  }

  function compareText(a, b) {
    return String(a || "").localeCompare(String(b || ""), "ko-KR", { numeric: true, sensitivity: "base" });
  }

  function compareDateDesc(a, b) {
    return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  }

  function statusIndex(status, statuses) {
    const index = statuses.indexOf(status);
    return index === -1 ? statuses.length : index;
  }

  function createWorkerSnapshot(workerId, workers) {
    const worker = (Array.isArray(workers) ? workers : []).find((row) => row.id === workerId);
    return {
      workerId: worker ? worker.id : "",
      workerNameSnapshot: worker ? worker.name : "",
      workerTeamSnapshot: worker ? worker.team || "" : "",
    };
  }

  function validateUnsafeDraft(draft) {
    const errors = [];
    if (!compactText(draft && draft.shipNo)) errors.push("호선을 선택하세요.");
    if (!compactText(draft && draft.content)) errors.push("내용을 입력하세요.");
    if (!compactText(draft && draft.workerId)) errors.push("등록자를 선택하세요.");
    return errors;
  }

  function validateMaterialDraft(draft) {
    const errors = [];
    if (!compactText(draft && draft.shipNo)) errors.push("호선을 선택하세요.");
    if (!compactText(draft && draft.materialName)) errors.push("자재명을 입력하세요.");
    if (!compactText(draft && draft.content)) errors.push("내용을 입력하세요.");
    if (!compactText(draft && draft.workerId)) errors.push("등록자를 선택하세요.");
    return errors;
  }

  function filterRecords(records, filters) {
    const shipNo = compactText(filters && filters.shipNo);
    const status = compactText(filters && filters.status);
    const workerId = compactText(filters && filters.workerId);
    const materialName = compactText(filters && filters.materialName);
    return (Array.isArray(records) ? records : []).filter((row) => {
      if (shipNo && row.shipNo !== shipNo) return false;
      if (status && row.status !== status) return false;
      if (workerId && row.workerId !== workerId) return false;
      if (materialName && !String(row.materialName || "").includes(materialName)) return false;
      return true;
    });
  }

  function sortRecords(records, mode, statuses) {
    const rows = [...(Array.isArray(records) ? records : [])];
    if (mode === "latest") return rows.sort(compareDateDesc);
    if (mode === "shipNo") return rows.sort((a, b) => compareText(a.shipNo, b.shipNo) || compareDateDesc(a, b));
    if (mode === "worker") return rows.sort((a, b) => compareText(a.workerNameSnapshot, b.workerNameSnapshot) || compareDateDesc(a, b));
    if (mode === "materialName") return rows.sort((a, b) => compareText(a.materialName, b.materialName) || compareDateDesc(a, b));
    return rows.sort((a, b) => (statusIndex(a.status, statuses) - statusIndex(b.status, statuses)) || compareDateDesc(a, b));
  }

  function groupUnsafeByStatus(records) {
    const sorted = sortRecords(records, "status", UNSAFE_STATUSES);
    return UNSAFE_STATUSES.map((status) => ({
      status,
      collapsed: status === "완료",
      records: sorted.filter((row) => row.status === status),
    }));
  }

  function groupMaterialsByShip(records) {
    const sorted = sortRecords(records, "status", MATERIAL_STATUSES);
    const shipNos = [...new Set(sorted.map((row) => row.shipNo).filter(Boolean))]
      .sort((a, b) => compareText(a, b));
    return shipNos.map((shipNo) => ({
      shipNo,
      records: sorted.filter((row) => row.shipNo === shipNo),
      completedCollapsed: true,
    }));
  }

  return {
    MATERIAL_STATUSES,
    MAX_UNSAFE_PHOTOS,
    UNSAFE_STATUSES,
    createWorkerSnapshot,
    filterRecords,
    groupMaterialsByShip,
    groupUnsafeByStatus,
    sortRecords,
    validateMaterialDraft,
    validateUnsafeDraft,
  };
});
```

- [ ] **Step 4: Run helper tests**

Run:

```powershell
node tests/issue-material-rules.test.js
```

Expected: PASS and output `issue-material-rules tests passed`.

- [ ] **Step 5: Commit helper module**

```powershell
git add assets/js/issue-material-rules.js tests/issue-material-rules.test.js
git commit -m "Add issue material helper rules"
```

### Task 2: Static Entries, State, And Routes

**Files:**
- Modify: `index.html`
- Modify: `check.html`
- Modify: `history.html`
- Modify: `ships.html`
- Modify: `items.html`
- Create: `unsafe.html`
- Create: `materials.html`
- Create: `manage.html`
- Modify: `assets/js/app.js`

- [ ] **Step 1: Add helper script to existing HTML pages**

In each existing page, insert this line between `checklist-rules.js` and `app.js`:

```html
<script src="assets/js/issue-material-rules.js" defer></script>
```

The script block should become:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.105.3" defer></script>
<script src="assets/js/checklist-rules.js" defer></script>
<script src="assets/js/issue-material-rules.js" defer></script>
<script src="assets/js/app.js" defer></script>
```

- [ ] **Step 2: Create the three new entry pages**

Copy `index.html` to `unsafe.html`, `materials.html`, and `manage.html`, changing only the body `data-initial-view`.

For `unsafe.html`:

```html
<body data-initial-view="unsafe">
```

For `materials.html`:

```html
<body data-initial-view="materials">
```

For `manage.html`:

```html
<body data-initial-view="manage">
```

Each new page must include `assets/js/issue-material-rules.js`.

- [ ] **Step 3: Extend navigation constants in `assets/js/app.js`**

Add the helper binding near `CHECKLIST_RULES`:

```js
const ISSUE_MATERIAL_RULES = window.IssueMaterialRules;
```

Add `manage` to `NAV` only when rendering, not as a permanent base item. Keep base `NAV`:

```js
const NAV = [
  { id: "dashboard", label: "홈", icon: "home" },
  { id: "check", label: "점검", icon: "noteCheck" },
  { id: "ships", label: "호선", icon: "ship" },
  { id: "history", label: "기록", icon: "book" },
  { id: "items", label: "더보기", icon: "menu" },
];
```

Add this helper before `renderNav()`:

```js
function visibleNavItems() {
  return state.adminMode
    ? [...NAV, { id: "manage", label: "관리", icon: "settings" }]
    : NAV;
}
```

Change `renderNav()` to map `visibleNavItems()` instead of `NAV`.

- [ ] **Step 4: Add new page routing**

Update `initialView()`:

```js
function initialView() {
  const view = document.body?.dataset?.initialView || "dashboard";
  return [...NAV, { id: "unsafe" }, { id: "materials" }, { id: "manage" }].some((nav) => nav.id === view) ? view : "dashboard";
}
```

Update `pageForView(view)`:

```js
function pageForView(view) {
  return {
    dashboard: "index.html",
    check: "check.html",
    ships: "ships.html",
    history: "history.html",
    items: "items.html",
    unsafe: "unsafe.html",
    materials: "materials.html",
    manage: "manage.html",
  }[view] || "index.html";
}
```

Update `restoreRouteState()` so `unsafe`, `materials`, and `manage` are accepted:

```js
const routeViews = [...NAV, { id: "unsafe" }, { id: "materials" }, { id: "manage" }];
state.view = routeViews.some((nav) => nav.id === route.view) ? route.view : "dashboard";
```

- [ ] **Step 5: Add state keys and draft creators**

Add draft helpers near `createDraft()`:

```js
function createUnsafeDraft(overrides = {}) {
  return {
    shipNo: "",
    content: "",
    workerId: "",
    photos: [],
    ...overrides,
  };
}

function createMaterialDraft(overrides = {}) {
  return {
    shipNo: "",
    materialName: "",
    content: "",
    workerId: "",
    ...overrides,
  };
}
```

Add state keys:

```js
workers: loadJson("workers", []),
unsafeIssues: loadJson("unsafeIssues", []),
missingMaterials: loadJson("missingMaterials", []),
issuePhotos: loadJson("issuePhotos", []),
unsafeDraft: createUnsafeDraft(loadJson("unsafeDraft", {})),
materialDraft: createMaterialDraft(loadJson("materialDraft", {})),
unsafeFilters: loadJson("unsafeFilters", { shipNo: "", status: "", workerId: "", sort: "status" }),
materialFilters: loadJson("materialFilters", { shipNo: "", status: "", workerId: "", materialName: "", sort: "status" }),
manageTab: loadJson("manageTab", "workers"),
lastUnsafeIssueId: "",
lastMaterialId: "",
```

Update `persist()` to save all new local keys.

- [ ] **Step 6: Add route shell render functions**

Update the render map:

```js
page.innerHTML = {
  dashboard: renderDashboard,
  check: renderCheck,
  history: renderHistory,
  ships: renderShips,
  items: renderItems,
  unsafe: renderUnsafe,
  materials: renderMaterials,
  manage: renderManage,
}[state.view]();
```

Add route shell functions after `renderItems()`:

```js
function renderUnsafe() {
  return pageHead("불안전요소 등록", "현장 위험 요소를 빠르게 등록합니다.") + `<div class="empty">불안전요소 등록 화면 준비 중</div>`;
}

function renderMaterials() {
  return pageHead("호선자재 누락", "호선별 누락 자재를 등록하고 확인합니다.") + `<div class="empty">호선자재 누락 화면 준비 중</div>`;
}

function renderManage() {
  if (!state.adminMode) {
    return pageHead("관리", "관리자 모드에서 사용할 수 있습니다.", adminToggleButton()) + `<div class="notice danger">관리자 모드가 필요합니다.</div>`;
  }
  return pageHead("관리", "작업자와 접수 기록을 관리합니다.", adminToggleButton()) + `<div class="empty">관리 화면 준비 중</div>`;
}
```

Update `renderAppHeader()` titles for `unsafe`, `materials`, and `manage`.

- [ ] **Step 7: Wire home cards to new views**

Find the worker-added card buttons and change:

```html
data-action="open-unsafe-register"
```

to:

```html
data-view="unsafe"
```

Change:

```html
data-action="open-missing-materials"
```

to:

```html
data-view="materials"
```

Remove the temporary toast-only click handlers for those two actions if they exist.

- [ ] **Step 8: Run syntax and helper tests**

Run:

```powershell
node --check assets/js/app.js
node tests/issue-material-rules.test.js
```

Expected: both commands pass.

- [ ] **Step 9: Commit routing shell**

```powershell
git add index.html check.html history.html ships.html items.html unsafe.html materials.html manage.html assets/js/app.js
git commit -m "Add issue material view routes"
```

### Task 3: Supabase Schema And Remote Mapping

**Files:**
- Create: `docs/supabase-schema-2026-05-15-issue-materials.sql`
- Modify: `assets/js/app.js`

- [ ] **Step 1: Create schema SQL documentation**

Create `docs/supabase-schema-2026-05-15-issue-materials.sql`:

```sql
-- Supabase schema for unsafe issue and missing material workflows.

create table if not exists public.workers (
  id text primary key,
  name text not null,
  team text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.unsafe_issues (
  id text primary key,
  ship_no text not null,
  content text not null,
  worker_id text,
  worker_name_snapshot text not null,
  worker_team_snapshot text not null default '',
  status text not null default '접수' check (status in ('접수', '조치중', '완료')),
  admin_memo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.missing_materials (
  id text primary key,
  ship_no text not null,
  material_name text not null,
  content text not null,
  worker_id text,
  worker_name_snapshot text not null,
  worker_team_snapshot text not null default '',
  status text not null default '접수' check (status in ('접수', '확인중', '완료')),
  admin_memo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.issue_photos (
  id text primary key,
  target_type text not null check (target_type in ('unsafe_issue')),
  target_id text not null,
  storage_bucket text not null default 'issue-photos',
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists unsafe_issues_status_created_idx
  on public.unsafe_issues (status, created_at desc);

create index if not exists unsafe_issues_ship_idx
  on public.unsafe_issues (ship_no);

create index if not exists missing_materials_ship_status_idx
  on public.missing_materials (ship_no, status, created_at desc);

create index if not exists issue_photos_target_idx
  on public.issue_photos (target_type, target_id, sort_order);

alter table public.workers enable row level security;
alter table public.unsafe_issues enable row level security;
alter table public.missing_materials enable row level security;
alter table public.issue_photos enable row level security;

grant select, insert, update, delete on public.workers to anon, authenticated;
grant select, insert, update, delete on public.unsafe_issues to anon, authenticated;
grant select, insert, update, delete on public.missing_materials to anon, authenticated;
grant select, insert, update, delete on public.issue_photos to anon, authenticated;

drop policy if exists "public all workers" on public.workers;
create policy "public all workers" on public.workers for all to anon, authenticated using (true) with check (true);

drop policy if exists "public all unsafe issues" on public.unsafe_issues;
create policy "public all unsafe issues" on public.unsafe_issues for all to anon, authenticated using (true) with check (true);

drop policy if exists "public all missing materials" on public.missing_materials;
create policy "public all missing materials" on public.missing_materials for all to anon, authenticated using (true) with check (true);

drop policy if exists "public all issue photos" on public.issue_photos;
create policy "public all issue photos" on public.issue_photos for all to anon, authenticated using (true) with check (true);

-- Storage bucket required:
-- insert into storage.buckets (id, name, public)
-- values ('issue-photos', 'issue-photos', true)
-- on conflict (id) do nothing;
--
-- Storage policies should allow anon/authenticated select, insert, update, delete
-- for bucket_id = 'issue-photos', matching the approved password-admin/anon-write model.
```

- [ ] **Step 2: Add remote table mappings**

In `REMOTE_TABLES`, add these configs after `safety_inspection_items`:

```js
{
  table: "workers",
  key: "workers",
  toDb: (row) => ({
    id: row.id,
    name: row.name,
    team: row.team || "",
    created_at: row.createdAt || serverNow().toISOString(),
    updated_at: row.updatedAt || row.createdAt || serverNow().toISOString(),
  }),
  fromDb: (row) => ({
    id: row.id,
    name: row.name,
    team: row.team || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }),
},
{
  table: "unsafe_issues",
  key: "unsafeIssues",
  toDb: (row) => ({
    id: row.id,
    ship_no: row.shipNo,
    content: row.content,
    worker_id: row.workerId || null,
    worker_name_snapshot: row.workerNameSnapshot || "",
    worker_team_snapshot: row.workerTeamSnapshot || "",
    status: row.status || "접수",
    admin_memo: row.adminMemo || "",
    created_at: row.createdAt || serverNow().toISOString(),
    updated_at: row.updatedAt || row.createdAt || serverNow().toISOString(),
    completed_at: row.completedAt || null,
  }),
  fromDb: (row) => ({
    id: row.id,
    shipNo: row.ship_no,
    content: row.content,
    workerId: row.worker_id || "",
    workerNameSnapshot: row.worker_name_snapshot || "",
    workerTeamSnapshot: row.worker_team_snapshot || "",
    status: row.status || "접수",
    adminMemo: row.admin_memo || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at || "",
  }),
},
{
  table: "missing_materials",
  key: "missingMaterials",
  toDb: (row) => ({
    id: row.id,
    ship_no: row.shipNo,
    material_name: row.materialName,
    content: row.content,
    worker_id: row.workerId || null,
    worker_name_snapshot: row.workerNameSnapshot || "",
    worker_team_snapshot: row.workerTeamSnapshot || "",
    status: row.status || "접수",
    admin_memo: row.adminMemo || "",
    created_at: row.createdAt || serverNow().toISOString(),
    updated_at: row.updatedAt || row.createdAt || serverNow().toISOString(),
    completed_at: row.completedAt || null,
  }),
  fromDb: (row) => ({
    id: row.id,
    shipNo: row.ship_no,
    materialName: row.material_name,
    content: row.content,
    workerId: row.worker_id || "",
    workerNameSnapshot: row.worker_name_snapshot || "",
    workerTeamSnapshot: row.worker_team_snapshot || "",
    status: row.status || "접수",
    adminMemo: row.admin_memo || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at || "",
  }),
},
{
  table: "issue_photos",
  key: "issuePhotos",
  toDb: (row) => ({
    id: row.id,
    target_type: row.targetType,
    target_id: row.targetId,
    storage_bucket: row.storageBucket || "issue-photos",
    storage_path: row.storagePath,
    sort_order: row.sortOrder || 0,
    created_at: row.createdAt || serverNow().toISOString(),
  }),
  fromDb: (row) => ({
    id: row.id,
    targetType: row.target_type,
    targetId: row.target_id,
    storageBucket: row.storage_bucket || "issue-photos",
    storagePath: row.storage_path,
    sortOrder: row.sort_order || 0,
    createdAt: row.created_at,
  }),
},
```

- [ ] **Step 3: Run syntax and helper tests**

Run:

```powershell
node --check assets/js/app.js
node tests/issue-material-rules.test.js
```

Expected: both pass.

- [ ] **Step 4: Commit schema and mapping**

```powershell
git add docs/supabase-schema-2026-05-15-issue-materials.sql assets/js/app.js
git commit -m "Add issue material remote mapping"
```

### Task 4: Worker Management Tab

**Files:**
- Modify: `assets/js/app.js`
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Add render function for manage tabs**

Replace the route shell `renderManage()` with:

```js
function renderManage() {
  if (!state.adminMode) {
    return pageHead("관리", "관리자 모드에서 사용할 수 있습니다.", adminToggleButton())
      + `<div class="notice danger">관리자 모드가 필요합니다.</div>`;
  }

  const tabs = [
    ["workers", "작업자"],
    ["unsafe", "불안전요소"],
    ["materials", "자재누락"],
  ];
  return `${pageHead("관리", "작업자와 접수 기록을 관리합니다.", adminToggleButton())}
    <div class="manage-tabs" role="tablist" aria-label="관리 탭">
      ${tabs.map(([id, label]) => `<button class="seg-btn ${state.manageTab === id ? "active" : ""}" data-manage-tab="${id}" type="button">${label}</button>`).join("")}
    </div>
    ${state.manageTab === "workers" ? renderWorkerManager() : ""}
    ${state.manageTab === "unsafe" ? renderUnsafeManager() : ""}
    ${state.manageTab === "materials" ? renderMaterialManager() : ""}`;
}
```

Add route shell functions for the two record tabs:

```js
function renderUnsafeManager() {
  return `<div class="empty">불안전요소 관리 화면 준비 중</div>`;
}

function renderMaterialManager() {
  return `<div class="empty">자재누락 관리 화면 준비 중</div>`;
}
```

- [ ] **Step 2: Add worker manager markup**

Add:

```js
function renderWorkerManager() {
  return `<section class="panel panel-pad">
    <div class="section-title">작업자 목록 <span class="small muted">${state.workers.length}명</span></div>
    <div class="form-row worker-form">
      <div class="field">
        <label for="workerName">이름</label>
        <input class="input" id="workerName" placeholder="예) 김민수" />
      </div>
      <div class="field">
        <label for="workerTeam">소속/팀</label>
        <input class="input" id="workerTeam" placeholder="예) 배관팀" />
      </div>
      <button class="btn" data-action="add-worker" type="button">추가</button>
    </div>
    <div class="list worker-list">
      ${state.workers.length ? state.workers.map(renderWorkerRow).join("") : `<div class="empty">등록된 작업자가 없습니다.</div>`}
    </div>
  </section>`;
}

function renderWorkerRow(worker) {
  return `<div class="item-row worker-row">
    <div class="item-main">
      <div class="item-name">${esc(worker.name)}</div>
      <div class="small muted">${esc(worker.team || "소속/팀 없음")}</div>
    </div>
    <div class="item-actions">
      <button class="btn-light" data-edit-worker="${esc(worker.id)}" type="button">수정</button>
      <button class="btn-danger" data-delete-worker="${esc(worker.id)}" type="button">삭제</button>
    </div>
  </div>`;
}
```

- [ ] **Step 3: Add worker actions**

Add click handlers:

```js
if (button.dataset.manageTab) {
  state.manageTab = button.dataset.manageTab;
  saveJson("manageTab", state.manageTab);
  render();
}
if (button.dataset.action === "add-worker") addWorker();
if (button.dataset.editWorker) editWorker(button.dataset.editWorker);
if (button.dataset.deleteWorker) deleteWorker(button.dataset.deleteWorker);
```

Add functions:

```js
function addWorker() {
  if (!requireAdmin()) return;
  const name = $("workerName").value.trim();
  const team = $("workerTeam").value.trim();
  if (!name) return toast("작업자 이름을 입력하세요.");
  const now = serverNow().toISOString();
  state.workers.push({ id: uid("worker"), name, team, createdAt: now, updatedAt: now });
  persistAndSync();
  render();
  toast("작업자를 추가했습니다.");
}

function editWorker(id) {
  if (!requireAdmin()) return;
  const worker = state.workers.find((row) => row.id === id);
  if (!worker) return;
  const name = prompt("작업자 이름", worker.name);
  if (name === null) return;
  const team = prompt("소속/팀", worker.team || "");
  if (team === null) return;
  const cleanName = name.trim();
  if (!cleanName) return toast("작업자 이름을 입력하세요.");
  worker.name = cleanName;
  worker.team = team.trim();
  worker.updatedAt = serverNow().toISOString();
  persistAndSync();
  render();
  toast("작업자를 수정했습니다.");
}

function deleteWorker(id) {
  if (!requireAdmin()) return;
  const worker = state.workers.find((row) => row.id === id);
  if (!worker) return;
  if (!confirm(`${worker.name} 작업자를 삭제할까요? 기존 기록의 등록자 정보는 유지됩니다.`)) return;
  state.workers = state.workers.filter((row) => row.id !== id);
  persistAndSync();
  render();
  toast("작업자를 삭제했습니다.");
}
```

- [ ] **Step 4: Add styles**

Add to `assets/css/styles.css`:

```css
.manage-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  margin-bottom: 14px;
  border-radius: var(--radius);
  background: #e7edf5;
  overflow-x: auto;
}

.manage-tabs .seg-btn {
  min-width: 94px;
}

.worker-form {
  align-items: end;
  margin-bottom: 14px;
}

.worker-row .item-main {
  min-width: 0;
}
```

- [ ] **Step 5: Run syntax and helper tests**

Run:

```powershell
node --check assets/js/app.js
node tests/issue-material-rules.test.js
```

Expected: both pass.

- [ ] **Step 6: Commit worker management**

```powershell
git add assets/js/app.js assets/css/styles.css
git commit -m "Add worker management tab"
```

### Task 5: Registration Forms And Completion Screens

**Files:**
- Modify: `assets/js/app.js`
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Add shared select helpers**

Add:

```js
function visibleWorkerOptions(selectedId = "") {
  return `<option value="">등록자 선택</option>${state.workers
    .map((worker) => `<option value="${esc(worker.id)}" ${worker.id === selectedId ? "selected" : ""}>${esc(worker.name)}${worker.team ? ` / ${esc(worker.team)}` : ""}</option>`)
    .join("")}`;
}

function visibleShipOptionsForIssues(selectedNo = "") {
  return `<option value="">호선 선택</option>${selectableShips()
    .map((ship) => `<option value="${esc(ship.no)}" ${ship.no === selectedNo ? "selected" : ""}>${esc(ship.no)}${ship.type ? ` / ${esc(ship.type)}` : ""}</option>`)
    .join("")}`;
}
```

- [ ] **Step 2: Implement unsafe registration render**

Replace `renderUnsafe()` with:

```js
function renderUnsafe() {
  const detail = state.lastUnsafeIssueId ? state.unsafeIssues.find((row) => row.id === state.lastUnsafeIssueId) : null;
  if (detail) return renderUnsafeComplete(detail);
  return `${pageHead("불안전요소 등록", "현장 위험 요소를 빠르게 등록합니다.")}
    <section class="panel panel-pad issue-form">
      ${selectableShips().length ? "" : `<div class="notice danger" style="margin-bottom:12px">작업자에게 공개된 호선이 없습니다.</div>`}
      ${state.workers.length ? "" : `<div class="notice" style="margin-bottom:12px">등록자 목록이 없습니다. 관리자 모드에서 작업자를 추가하세요.</div>`}
      <div class="form-row">
        <div class="field">
          <label for="unsafeShipNo">호선</label>
          <select class="select" id="unsafeShipNo">${visibleShipOptionsForIssues(state.unsafeDraft.shipNo)}</select>
        </div>
        <div class="field">
          <label for="unsafeWorkerId">등록자</label>
          <select class="select" id="unsafeWorkerId">${visibleWorkerOptions(state.unsafeDraft.workerId)}</select>
        </div>
      </div>
      <div class="field" style="margin-top:12px">
        <label for="unsafeContent">내용</label>
        <textarea class="textarea" id="unsafeContent" placeholder="불안전요소 내용을 입력하세요">${esc(state.unsafeDraft.content)}</textarea>
      </div>
      <div class="field" style="margin-top:12px">
        <label for="unsafePhotos">사진 권장, 최대 3장</label>
        <input class="input" id="unsafePhotos" type="file" accept="image/*" multiple />
        <div class="small muted">사진 없이도 확인 후 등록할 수 있습니다.</div>
      </div>
      <div class="form-actions">
        <button class="btn" data-action="submit-unsafe" type="button">등록</button>
      </div>
    </section>`;
}
```

- [ ] **Step 3: Implement material registration render**

Replace `renderMaterials()` with:

```js
function renderMaterials() {
  const detail = state.lastMaterialId ? state.missingMaterials.find((row) => row.id === state.lastMaterialId) : null;
  if (detail) return renderMaterialComplete(detail);
  return `${pageHead("호선자재 누락", "호선별 누락 자재를 등록합니다.")}
    <section class="panel panel-pad issue-form">
      ${selectableShips().length ? "" : `<div class="notice danger" style="margin-bottom:12px">작업자에게 공개된 호선이 없습니다.</div>`}
      ${state.workers.length ? "" : `<div class="notice" style="margin-bottom:12px">등록자 목록이 없습니다. 관리자 모드에서 작업자를 추가하세요.</div>`}
      <div class="form-row">
        <div class="field">
          <label for="materialShipNo">호선</label>
          <select class="select" id="materialShipNo">${visibleShipOptionsForIssues(state.materialDraft.shipNo)}</select>
        </div>
        <div class="field">
          <label for="materialWorkerId">등록자</label>
          <select class="select" id="materialWorkerId">${visibleWorkerOptions(state.materialDraft.workerId)}</select>
        </div>
      </div>
      <div class="field" style="margin-top:12px">
        <label for="materialName">자재명</label>
        <input class="input" id="materialName" value="${esc(state.materialDraft.materialName)}" placeholder="예) 배관 자재" />
      </div>
      <div class="field" style="margin-top:12px">
        <label for="materialContent">내용</label>
        <textarea class="textarea" id="materialContent" placeholder="누락 내용을 입력하세요">${esc(state.materialDraft.content)}</textarea>
      </div>
      <div class="form-actions">
        <button class="btn" data-action="submit-material" type="button">등록</button>
      </div>
    </section>`;
}
```

- [ ] **Step 4: Add completion screens**

Add:

```js
function renderCompletionActions(type) {
  return `<div class="completion-actions">
    <button class="btn" data-action="${type === "unsafe" ? "new-unsafe" : "new-material"}" type="button">추가 등록</button>
    <button class="btn-light" data-action="${type === "unsafe" ? "view-unsafe-list" : "view-material-list"}" type="button">목록 보기</button>
    <button class="btn-light" data-view="dashboard" type="button">홈으로</button>
  </div>`;
}

function renderUnsafeComplete(row) {
  const photos = state.issuePhotos.filter((photo) => photo.targetType === "unsafe_issue" && photo.targetId === row.id);
  return `${pageHead("불안전요소 등록 완료", "접수된 내용을 확인하세요.")}
    <section class="panel panel-pad completion-card">
      ${badge("medium", row.status)}
      <div class="detail-grid">
        <div><span class="small muted">호선</span><strong>${esc(row.shipNo)}</strong></div>
        <div><span class="small muted">등록자</span><strong>${esc(row.workerNameSnapshot)}</strong></div>
        <div><span class="small muted">등록일시</span><strong>${esc(formatDateTime(row.createdAt))}</strong></div>
        <div><span class="small muted">사진</span><strong>${photos.length ? `${photos.length}장 첨부` : "없음"}</strong></div>
      </div>
      <div class="field" style="margin-top:12px">
        <span class="field-label">내용</span>
        <div class="readonly-box">${esc(row.content)}</div>
      </div>
      ${renderCompletionActions("unsafe")}
    </section>`;
}

function renderMaterialComplete(row) {
  return `${pageHead("호선자재 누락 등록 완료", "접수된 내용을 확인하세요.")}
    <section class="panel panel-pad completion-card">
      ${badge("medium", row.status)}
      <div class="detail-grid">
        <div><span class="small muted">호선</span><strong>${esc(row.shipNo)}</strong></div>
        <div><span class="small muted">자재명</span><strong>${esc(row.materialName)}</strong></div>
        <div><span class="small muted">등록자</span><strong>${esc(row.workerNameSnapshot)}</strong></div>
        <div><span class="small muted">등록일시</span><strong>${esc(formatDateTime(row.createdAt))}</strong></div>
      </div>
      <div class="field" style="margin-top:12px">
        <span class="field-label">내용</span>
        <div class="readonly-box">${esc(row.content)}</div>
      </div>
      ${renderCompletionActions("materials")}
    </section>`;
}
```

Add helper:

```js
function formatDateTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}.${pad2(date.getMonth() + 1)}.${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}
```

- [ ] **Step 5: Add input and submit handlers**

Add input/change handlers:

```js
if (event.target.id === "unsafeShipNo") state.unsafeDraft.shipNo = event.target.value;
if (event.target.id === "unsafeWorkerId") state.unsafeDraft.workerId = event.target.value;
if (event.target.id === "unsafeContent") state.unsafeDraft.content = event.target.value;
if (event.target.id === "materialShipNo") state.materialDraft.shipNo = event.target.value;
if (event.target.id === "materialWorkerId") state.materialDraft.workerId = event.target.value;
if (event.target.id === "materialName") state.materialDraft.materialName = event.target.value;
if (event.target.id === "materialContent") state.materialDraft.content = event.target.value;
```

Add click handlers:

```js
if (button.dataset.action === "submit-unsafe") submitUnsafeIssue();
if (button.dataset.action === "submit-material") submitMissingMaterial();
if (button.dataset.action === "new-unsafe") {
  state.lastUnsafeIssueId = "";
  state.unsafeDraft = createUnsafeDraft();
  render();
}
if (button.dataset.action === "new-material") {
  state.lastMaterialId = "";
  state.materialDraft = createMaterialDraft();
  render();
}
if (button.dataset.action === "view-unsafe-list") {
  state.manageTab = "unsafe";
  changeView("manage");
}
if (button.dataset.action === "view-material-list") {
  state.manageTab = "materials";
  changeView("manage");
}
```

Add submit functions:

```js
async function submitUnsafeIssue() {
  const errors = ISSUE_MATERIAL_RULES.validateUnsafeDraft(state.unsafeDraft);
  if (errors.length) return toast(errors[0]);
  const input = $("unsafePhotos");
  const files = Array.from(input?.files || []);
  if (files.length > ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS) return toast("사진은 최대 3장까지 첨부할 수 있습니다.");
  if (!files.length && !confirm("사진 없이 등록하시겠습니까?")) return;
  const now = serverNow().toISOString();
  const id = uid("unsafe");
  const snapshot = ISSUE_MATERIAL_RULES.createWorkerSnapshot(state.unsafeDraft.workerId, state.workers);
  const row = {
    id,
    shipNo: state.unsafeDraft.shipNo,
    content: state.unsafeDraft.content.trim(),
    ...snapshot,
    status: "접수",
    adminMemo: "",
    createdAt: now,
    updatedAt: now,
    completedAt: "",
  };
  state.unsafeIssues.unshift(row);
  state.lastUnsafeIssueId = id;
  state.unsafeDraft = createUnsafeDraft();
  persist();
  await syncUnsafeIssue(row, files);
  render();
  replaceRouteState();
  toast("불안전요소가 접수되었습니다.");
}

async function submitMissingMaterial() {
  const errors = ISSUE_MATERIAL_RULES.validateMaterialDraft(state.materialDraft);
  if (errors.length) return toast(errors[0]);
  const now = serverNow().toISOString();
  const id = uid("material");
  const snapshot = ISSUE_MATERIAL_RULES.createWorkerSnapshot(state.materialDraft.workerId, state.workers);
  const row = {
    id,
    shipNo: state.materialDraft.shipNo,
    materialName: state.materialDraft.materialName.trim(),
    content: state.materialDraft.content.trim(),
    ...snapshot,
    status: "접수",
    adminMemo: "",
    createdAt: now,
    updatedAt: now,
    completedAt: "",
  };
  state.missingMaterials.unshift(row);
  state.lastMaterialId = id;
  state.materialDraft = createMaterialDraft();
  persist();
  await syncMissingMaterial(row);
  render();
  replaceRouteState();
  toast("호선자재 누락이 접수되었습니다.");
}
```

- [ ] **Step 6: Add temporary sync stubs**

Add these stubs; Task 7 replaces them with full Storage-aware behavior:

```js
async function syncUnsafeIssue(row, files) {
  const synced = await persistAndSync();
  if (!synced) toast("기록은 저장되었지만 서버 동기화에 실패했습니다.");
  return files;
}

async function syncMissingMaterial(row) {
  const synced = await persistAndSync();
  if (!synced) toast("기록은 저장되었지만 서버 동기화에 실패했습니다.");
  return row;
}
```

- [ ] **Step 7: Add styles**

Add:

```css
.issue-form .form-actions,
.completion-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.completion-actions .btn {
  flex: 1 1 180px;
}

.completion-actions .btn-light {
  flex: 1 1 120px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.detail-grid div {
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface-soft);
}

.detail-grid strong {
  display: block;
  margin-top: 4px;
}

.readonly-box {
  min-height: 54px;
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface-soft);
  line-height: 1.45;
}
```

- [ ] **Step 8: Run syntax and helper tests**

Run:

```powershell
node --check assets/js/app.js
node tests/issue-material-rules.test.js
```

Expected: both pass.

- [ ] **Step 9: Commit registration screens**

```powershell
git add assets/js/app.js assets/css/styles.css
git commit -m "Add issue material registration screens"
```

### Task 6: Admin Lists, Filters, Status, Memo, And Delete

**Files:**
- Modify: `assets/js/app.js`
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Render filter controls**

Add:

```js
function renderRecordFilters(kind) {
  const filters = kind === "unsafe" ? state.unsafeFilters : state.materialFilters;
  const statuses = kind === "unsafe" ? ISSUE_MATERIAL_RULES.UNSAFE_STATUSES : ISSUE_MATERIAL_RULES.MATERIAL_STATUSES;
  return `<div class="record-filters">
    <select class="select" data-record-filter="${kind}:shipNo">
      <option value="">전체 호선</option>
      ${selectableShips().map((ship) => `<option value="${esc(ship.no)}" ${filters.shipNo === ship.no ? "selected" : ""}>${esc(ship.no)}</option>`).join("")}
    </select>
    <select class="select" data-record-filter="${kind}:status">
      <option value="">전체 상태</option>
      ${statuses.map((status) => `<option value="${esc(status)}" ${filters.status === status ? "selected" : ""}>${esc(status)}</option>`).join("")}
    </select>
    <select class="select" data-record-filter="${kind}:workerId">
      <option value="">전체 등록자</option>
      ${state.workers.map((worker) => `<option value="${esc(worker.id)}" ${filters.workerId === worker.id ? "selected" : ""}>${esc(worker.name)}</option>`).join("")}
    </select>
    ${kind === "materials" ? `<input class="input" data-record-filter="materials:materialName" value="${esc(filters.materialName)}" placeholder="자재명 필터" />` : ""}
    <select class="select" data-record-filter="${kind}:sort">
      <option value="status" ${filters.sort === "status" ? "selected" : ""}>상태 우선순</option>
      <option value="latest" ${filters.sort === "latest" ? "selected" : ""}>최신 등록순</option>
      <option value="shipNo" ${filters.sort === "shipNo" ? "selected" : ""}>호선 번호순</option>
      <option value="worker" ${filters.sort === "worker" ? "selected" : ""}>등록자순</option>
      ${kind === "materials" ? `<option value="materialName" ${filters.sort === "materialName" ? "selected" : ""}>자재명순</option>` : ""}
    </select>
  </div>`;
}
```

- [ ] **Step 2: Render unsafe manager**

Replace `renderUnsafeManager()`:

```js
function renderUnsafeManager() {
  const filtered = ISSUE_MATERIAL_RULES.filterRecords(state.unsafeIssues, state.unsafeFilters);
  const sorted = ISSUE_MATERIAL_RULES.sortRecords(filtered, state.unsafeFilters.sort, ISSUE_MATERIAL_RULES.UNSAFE_STATUSES);
  const groups = ISSUE_MATERIAL_RULES.groupUnsafeByStatus(sorted);
  return `<section class="panel panel-pad">
    <div class="section-title">불안전요소 <span class="small muted">${filtered.length}건</span></div>
    ${renderRecordFilters("unsafe")}
    <div class="record-groups">
      ${groups.map((group) => renderUnsafeGroup(group)).join("")}
    </div>
  </section>`;
}

function renderUnsafeGroup(group) {
  const collapsed = group.status === "완료";
  return `<section class="record-group">
    <div class="record-group-head">
      <strong>${esc(group.status)}</strong>
      <span class="small muted">${group.records.length}건</span>
    </div>
    ${collapsed ? `<details><summary>완료 기록 보기</summary>${group.records.map((row) => renderUnsafeRecordCard(row)).join("")}</details>` : group.records.map((row) => renderUnsafeRecordCard(row)).join("")}
  </section>`;
}
```

- [ ] **Step 3: Render material manager**

Replace `renderMaterialManager()`:

```js
function renderMaterialManager() {
  const filtered = ISSUE_MATERIAL_RULES.filterRecords(state.missingMaterials, state.materialFilters);
  const sorted = ISSUE_MATERIAL_RULES.sortRecords(filtered, state.materialFilters.sort, ISSUE_MATERIAL_RULES.MATERIAL_STATUSES);
  const groups = ISSUE_MATERIAL_RULES.groupMaterialsByShip(sorted);
  return `<section class="panel panel-pad">
    <div class="section-title">호선자재 누락 <span class="small muted">${filtered.length}건</span></div>
    ${renderRecordFilters("materials")}
    <div class="record-groups">
      ${groups.map((group) => renderMaterialGroup(group)).join("")}
    </div>
  </section>`;
}

function renderMaterialGroup(group) {
  const openRows = group.records.filter((row) => row.status !== "완료");
  const doneRows = group.records.filter((row) => row.status === "완료");
  return `<section class="record-group">
    <div class="record-group-head">
      <strong>${esc(group.shipNo)}</strong>
      <span class="small muted">${group.records.length}건</span>
    </div>
    ${openRows.map((row) => renderMaterialRecordCard(row)).join("")}
    ${doneRows.length ? `<details><summary>완료 기록 ${doneRows.length}건 보기</summary>${doneRows.map((row) => renderMaterialRecordCard(row)).join("")}</details>` : ""}
  </section>`;
}
```

- [ ] **Step 4: Render record cards and admin edit controls**

Add:

```js
function renderAdminRecordControls(kind, row, statuses) {
  return `<div class="admin-record-controls">
    <select class="select" data-record-status="${kind}:${esc(row.id)}">
      ${statuses.map((status) => `<option value="${esc(status)}" ${row.status === status ? "selected" : ""}>${esc(status)}</option>`).join("")}
    </select>
    <textarea class="textarea" data-record-memo="${kind}:${esc(row.id)}" placeholder="조치/메모">${esc(row.adminMemo || "")}</textarea>
    <button class="btn-light" data-save-record="${kind}:${esc(row.id)}" type="button">저장</button>
    <button class="btn-danger" data-delete-record="${kind}:${esc(row.id)}" type="button">삭제</button>
  </div>`;
}

function renderUnsafeRecordCard(row) {
  return `<article class="record-card">
    <div class="record-card-main">
      <strong>${esc(row.shipNo)}</strong>
      <span class="small muted">${esc(row.workerNameSnapshot)} · ${esc(formatDateTime(row.createdAt))}</span>
      <p>${esc(row.content)}</p>
    </div>
    ${renderAdminRecordControls("unsafe", row, ISSUE_MATERIAL_RULES.UNSAFE_STATUSES)}
  </article>`;
}

function renderMaterialRecordCard(row) {
  return `<article class="record-card">
    <div class="record-card-main">
      <strong>${esc(row.shipNo)} · ${esc(row.materialName)}</strong>
      <span class="small muted">${esc(row.workerNameSnapshot)} · ${esc(formatDateTime(row.createdAt))}</span>
      <p>${esc(row.content)}</p>
    </div>
    ${renderAdminRecordControls("materials", row, ISSUE_MATERIAL_RULES.MATERIAL_STATUSES)}
  </article>`;
}
```

- [ ] **Step 5: Add filter and record handlers**

Add change handler:

```js
if (event.target.matches("[data-record-filter]")) {
  const [kind, key] = event.target.dataset.recordFilter.split(":");
  const target = kind === "unsafe" ? state.unsafeFilters : state.materialFilters;
  target[key] = event.target.value;
  saveJson(kind === "unsafe" ? "unsafeFilters" : "materialFilters", target);
  render();
}
```

Add click handlers:

```js
if (button.dataset.saveRecord) saveAdminRecord(button.dataset.saveRecord);
if (button.dataset.deleteRecord) deleteAdminRecord(button.dataset.deleteRecord);
```

Add functions:

```js
function saveAdminRecord(token) {
  if (!requireAdmin()) return;
  const [kind, id] = token.split(":");
  const rows = kind === "unsafe" ? state.unsafeIssues : state.missingMaterials;
  const row = rows.find((item) => item.id === id);
  if (!row) return;
  const status = document.querySelector(`[data-record-status="${CSS.escape(token)}"]`)?.value || row.status;
  const memo = document.querySelector(`[data-record-memo="${CSS.escape(token)}"]`)?.value || "";
  row.status = status;
  row.adminMemo = memo.trim();
  row.updatedAt = serverNow().toISOString();
  row.completedAt = status === "완료" ? (row.completedAt || row.updatedAt) : "";
  persistAndSync();
  render();
  toast("기록을 저장했습니다.");
}

async function deleteAdminRecord(token) {
  if (!requireAdmin()) return;
  const [kind, id] = token.split(":");
  const label = kind === "unsafe" ? "불안전요소" : "호선자재 누락";
  if (!confirm(`${label} 기록을 영구 삭제할까요?`)) return;
  if (kind === "unsafe") {
    await deleteUnsafePhotos(id);
    state.unsafeIssues = state.unsafeIssues.filter((row) => row.id !== id);
    state.issuePhotos = state.issuePhotos.filter((row) => row.targetId !== id);
  } else {
    state.missingMaterials = state.missingMaterials.filter((row) => row.id !== id);
  }
  persistAndSync();
  render();
  toast("기록을 삭제했습니다.");
}
```

Add a temporary photo deletion stub; Task 7 replaces it:

```js
async function deleteUnsafePhotos(id) {
  return id;
}
```

- [ ] **Step 6: Add styles**

Add:

```css
.record-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}

.record-groups {
  display: grid;
  gap: 12px;
}

.record-group {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface-soft);
  padding: 12px;
}

.record-group-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.record-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 320px);
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  margin-top: 8px;
}

.record-card-main p {
  margin: 8px 0 0;
  line-height: 1.45;
}

.admin-record-controls {
  display: grid;
  gap: 8px;
}

@media (max-width: 920px) {
  .record-card {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Run syntax and helper tests**

Run:

```powershell
node --check assets/js/app.js
node tests/issue-material-rules.test.js
```

Expected: both pass.

- [ ] **Step 8: Commit admin record management**

```powershell
git add assets/js/app.js assets/css/styles.css
git commit -m "Add issue material admin management"
```

### Task 7: Supabase Storage Photo Upload And Delete

**Files:**
- Modify: `assets/js/app.js`

- [ ] **Step 1: Add Storage helpers**

Add:

```js
const ISSUE_PHOTO_BUCKET = "issue-photos";

function photoExtension(file) {
  const name = String(file && file.name || "").toLowerCase();
  const ext = name.split(".").pop();
  return ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
}

async function uploadUnsafePhotos(issueId, files) {
  const client = supabaseClient();
  if (!client || !files.length) return [];
  const uploaded = [];
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const storagePath = `unsafe/${issueId}/original-${index + 1}.${photoExtension(file)}`;
    const { error } = await client.storage.from(ISSUE_PHOTO_BUCKET).upload(storagePath, file, { upsert: true });
    if (error) throw error;
    uploaded.push({
      id: uid("photo"),
      targetType: "unsafe_issue",
      targetId: issueId,
      storageBucket: ISSUE_PHOTO_BUCKET,
      storagePath,
      sortOrder: index + 1,
      createdAt: serverNow().toISOString(),
    });
  }
  return uploaded;
}

function publicPhotoUrl(photo) {
  const client = supabaseClient();
  if (!client || !photo.storagePath) return "";
  return client.storage.from(photo.storageBucket || ISSUE_PHOTO_BUCKET).getPublicUrl(photo.storagePath).data.publicUrl || "";
}
```

- [ ] **Step 2: Replace `syncUnsafeIssue()`**

Replace the stub with:

```js
async function syncUnsafeIssue(row, files) {
  try {
    const photos = await uploadUnsafePhotos(row.id, files);
    state.issuePhotos.push(...photos);
    persist();
    const synced = await persistAndSync();
    if (!synced) toast("기록은 저장되었지만 서버 동기화에 실패했습니다.");
    return true;
  } catch (error) {
    console.error(error);
    setSyncStatus("동기화 오류", "error");
    toast("사진 업로드에 실패했습니다. 기록은 로컬에 저장되었습니다.");
    return false;
  }
}
```

- [ ] **Step 3: Render photo thumbnails**

In `renderUnsafeComplete(row)`, after calculating `photos`, add:

```js
const photoHtml = photos.length
  ? `<div class="photo-strip">${photos.map((photo) => {
      const url = publicPhotoUrl(photo);
      return url ? `<img src="${esc(url)}" alt="불안전요소 사진" />` : "";
    }).join("")}</div>`
  : "";
```

Place `${photoHtml}` before completion actions.

In `renderUnsafeRecordCard(row)`, add a representative thumbnail:

```js
const photo = state.issuePhotos.find((item) => item.targetType === "unsafe_issue" && item.targetId === row.id);
const photoUrl = photo ? publicPhotoUrl(photo) : "";
```

Then include:

```html
${photoUrl ? `<img class="record-thumb" src="${esc(photoUrl)}" alt="불안전요소 사진" />` : ""}
```

- [ ] **Step 4: Replace `deleteUnsafePhotos()`**

Replace the stub with:

```js
async function deleteUnsafePhotos(id) {
  const client = supabaseClient();
  const photos = state.issuePhotos.filter((row) => row.targetType === "unsafe_issue" && row.targetId === id);
  if (!client || !photos.length) return;
  const paths = photos.map((photo) => photo.storagePath).filter(Boolean);
  if (!paths.length) return;
  const { error } = await client.storage.from(ISSUE_PHOTO_BUCKET).remove(paths);
  if (error) {
    console.error(error);
    toast("사진 삭제에 실패했습니다. Storage 정책을 확인하세요.");
  }
}
```

- [ ] **Step 5: Add photo styles**

Add:

```css
.photo-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.photo-strip img,
.record-thumb {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--surface-soft);
}

.record-thumb {
  max-width: 92px;
}
```

- [ ] **Step 6: Run syntax and helper tests**

Run:

```powershell
node --check assets/js/app.js
node tests/issue-material-rules.test.js
```

Expected: both pass.

- [ ] **Step 7: Commit photo storage**

```powershell
git add assets/js/app.js assets/css/styles.css
git commit -m "Add unsafe issue photo storage"
```

### Task 8: Visual Smoke Test And Final Verification

**Files:**
- Modify: `tests/visual-check.js`

- [ ] **Step 1: Add seeded new-feature data to visual smoke**

In the `seed` object in `tests/visual-check.js`, add:

```js
workers: [
  { id: "worker-1", name: "김민수", team: "배관팀", createdAt: "2026-05-15T00:00:00.000Z", updatedAt: "2026-05-15T00:00:00.000Z" },
],
unsafeIssues: [],
missingMaterials: [],
issuePhotos: [],
unsafeDraft: { shipNo: "", content: "", workerId: "", photos: [] },
materialDraft: { shipNo: "", materialName: "", content: "", workerId: "" },
unsafeFilters: { shipNo: "", status: "", workerId: "", sort: "status" },
materialFilters: { shipNo: "", status: "", workerId: "", materialName: "", sort: "status" },
manageTab: "workers",
```

- [ ] **Step 2: Add browser smoke assertions**

After existing navigation smoke checks, add:

```js
await navigate(client, `${baseUrl}/unsafe.html`);
const unsafeState = await evaluate(client, `(() => {
  return {
    hasTitle: document.body.innerText.includes("불안전요소 등록"),
    hasShipSelect: Boolean(document.querySelector("#unsafeShipNo")),
    hasWorkerSelect: Boolean(document.querySelector("#unsafeWorkerId")),
  };
})()`);
assertCheck("unsafe registration title", unsafeState.hasTitle);
assertCheck("unsafe ship select", unsafeState.hasShipSelect);
assertCheck("unsafe worker select", unsafeState.hasWorkerSelect);
const unsafeShot = await screenshot(client, "07-unsafe-registration-desktop.png");

await navigate(client, `${baseUrl}/materials.html`);
const materialState = await evaluate(client, `(() => {
  return {
    hasTitle: document.body.innerText.includes("호선자재 누락"),
    hasMaterialName: Boolean(document.querySelector("#materialName")),
    hasWorkerSelect: Boolean(document.querySelector("#materialWorkerId")),
  };
})()`);
assertCheck("material registration title", materialState.hasTitle);
assertCheck("material name input", materialState.hasMaterialName);
assertCheck("material worker select", materialState.hasWorkerSelect);
const materialShot = await screenshot(client, "08-material-registration-desktop.png");

await navigate(client, `${baseUrl}/manage.html`);
await evaluate(client, `(() => {
  window.prompt = () => "gs2026";
})()`);
await click(client, '[data-action="toggle-admin"]');
const manageState = await evaluate(client, `(() => {
  return {
    hasManageTitle: document.body.innerText.includes("관리"),
    hasWorkersTab: document.body.innerText.includes("작업자"),
    hasWorkerNameInput: Boolean(document.querySelector("#workerName")),
  };
})()`);
assertCheck("manage title", manageState.hasManageTitle);
assertCheck("workers tab", manageState.hasWorkersTab);
assertCheck("worker name input", manageState.hasWorkerNameInput);
const manageShot = await screenshot(client, "09-manage-workers-desktop.png");
```

Add the three screenshots to the JSON `screenshots` array.

- [ ] **Step 3: Run all available checks**

Run:

```powershell
node --check assets/js/app.js
node tests/checklist-rules.test.js
node tests/issue-material-rules.test.js
node tests/visual-check.js
```

Expected:

- `node --check assets/js/app.js` exits 0.
- `checklist-rules tests passed`.
- `issue-material-rules tests passed`.
- `visual-check.js` exits 0 and prints screenshot paths.

- [ ] **Step 4: Inspect git status and final diff**

Run:

```powershell
git status --short
git diff --stat
```

Expected: only intended feature files are modified.

- [ ] **Step 5: Commit verification updates**

```powershell
git add tests/visual-check.js
git commit -m "Add issue material visual smoke checks"
```

## Final Notes

- Do not implement `issue_timeline_events` in this feature. Keep the timeline extension documented in the approved spec for a future feature.
- Do not switch the app to Supabase Auth. Keep the existing `gs2026` password admin mode.
- The current approved security model allows `anon` writes and can trigger Supabase advisor warnings. Match the existing project decision unless the user explicitly changes the security model.
- Keep PNG mockups as design artifacts; do not create new HTML mockups.
