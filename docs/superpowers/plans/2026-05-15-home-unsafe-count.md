# Home Unsafe Count Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the home `위험 미확인` statistic into a clickable `불안전 요소` card backed by unsafe issue records in `접수` status.

**Architecture:** Keep the existing single-file app structure and add small helpers near the dashboard/history logic. Reuse `unsafeFilters`, `manageTab`, and the existing `manage.html` route so the card can open the received unsafe issue list without introducing a new page.

**Tech Stack:** Static HTML/CSS/JavaScript, localStorage state, Supabase sync paths already present, Node-based visual/browser smoke tests.

---

### Task 1: Review Existing Worker Changes

**Files:**
- Review: `assets/js/app.js`
- Review: `assets/css/styles.css`
- Review: `tests/visual-check.js`
- Review: `tools/browser-smoke.mjs`

- [ ] **Step 1: Inspect the current diff**

Run: `git diff -- assets/js/app.js assets/css/styles.css tests/visual-check.js tools/browser-smoke.mjs`

Expected: the diff contains only the already delegated work:

- editable work type labels in `assets/js/app.js`
- hidden unsafe detail photo count metadata in `assets/js/app.js`
- unsafe detail metadata grid CSS in `assets/css/styles.css`
- visual/browser smoke coverage for those behaviors

- [ ] **Step 2: Keep worker changes intact**

Do not revert or rewrite those changes while implementing the home unsafe count linkage.

### Task 2: Write the Failing Visual Test

**Files:**
- Modify: `tests/visual-check.js`

- [ ] **Step 1: Seed data that catches the old implementation**

Add one inspection with `warnings: 9` and multiple unsafe issues where only `접수` records should count.

Use this shape inside the existing `seed` object:

```javascript
inspections: [
  {
    id: "inspection-warning-count",
    categoryId: "mounting",
    shipNo: "H-101",
    worker: "김민수",
    date: "2026-05-15",
    status: "완료",
    warnings: 9,
    createdAt: "2026-05-15T07:30:00.000Z",
  },
],
unsafeIssues: [
  {
    id: "unsafe-detail-1",
    shipNo: "H-101",
    content: "용접 불티 차단막 미설치",
    workerId: "worker-1",
    workerNameSnapshot: "김민수",
    workerTeamSnapshot: "배관팀",
    status: "접수",
    adminMemo: "",
    createdAt: "2026-05-15T08:30:00.000Z",
    updatedAt: "2026-05-15T08:30:00.000Z",
    completedAt: "",
  },
  {
    id: "unsafe-in-progress-1",
    shipNo: "H-102",
    content: "조치중 기록은 홈 미확인 카운트에서 제외",
    workerId: "worker-1",
    workerNameSnapshot: "김민수",
    workerTeamSnapshot: "배관팀",
    status: "조치중",
    adminMemo: "",
    createdAt: "2026-05-15T08:40:00.000Z",
    updatedAt: "2026-05-15T08:40:00.000Z",
    completedAt: "",
  },
],
```

- [ ] **Step 2: Add assertions for the home card**

After the initial dashboard load in `tests/visual-check.js`, assert:

```javascript
const unsafeHomeStat = await evaluate(client, `(() => {
  const card = document.querySelector('[data-stat-scope="unsafe"]');
  return {
    label: card?.querySelector(".small")?.textContent?.trim() || "",
    value: card?.querySelector(".stat-value")?.textContent?.trim() || "",
    foot: card?.querySelector(".stat-foot")?.textContent?.trim() || "",
    oldRiskTabExists: Boolean(document.querySelector('[data-history-scope="risk"]')),
  };
})()`);
assertCheck("home unsafe stat is renamed", unsafeHomeStat.label === "불안전 요소");
assertCheck("home unsafe stat counts received unsafe issues only", unsafeHomeStat.value.includes("1"));
assertCheck("home unsafe stat keeps urgent helper text", unsafeHomeStat.foot === "즉시 확인 필요");
```

- [ ] **Step 3: Add assertions for card navigation and history tab removal**

Click the home unsafe stat and verify the manage unsafe tab opens with status `접수`:

```javascript
await click(client, '[data-stat-scope="unsafe"]');
const unsafeStatNavigation = await evaluate(client, `(() => ({
  currentPath: location.pathname.split("/").pop(),
  unsafeTabActive: document.querySelector('[data-manage-tab="unsafe"]')?.classList.contains("active") || false,
  statusFilter: document.querySelector('#unsafeStatusFilter')?.value || "",
  hasUnsafeRecord: Boolean(document.querySelector('[data-unsafe-record-detail="unsafe-detail-1"]')),
}))()`);
assertCheck("home unsafe stat opens manage page", unsafeStatNavigation.currentPath === "manage.html");
assertCheck("home unsafe stat opens unsafe manage tab", unsafeStatNavigation.unsafeTabActive);
assertCheck("home unsafe stat applies received status filter", unsafeStatNavigation.statusFilter === "접수");
assertCheck("home unsafe stat shows received unsafe records", unsafeStatNavigation.hasUnsafeRecord);
```

Navigate to history and assert `risk` scope is gone:

```javascript
await navigate(client, `${baseUrl}/history.html`);
const historyScopeState = await evaluate(client, `(() => ({
  hasRiskScope: Boolean(document.querySelector('[data-history-scope="risk"]')),
}))()`);
assertCheck("history removes old risk scope", historyScopeState.hasRiskScope === false);
```

- [ ] **Step 4: Run the visual test and confirm RED**

Run: `node tests/visual-check.js`

Expected: FAIL because `[data-stat-scope="unsafe"]` does not exist and the home card still says `위험 미확인`.

### Task 3: Implement Home Unsafe Count Linkage

**Files:**
- Modify: `assets/js/app.js`

- [ ] **Step 1: Add helper functions**

Add helpers near `renderDashboard()`:

```javascript
function unsafeReceivedStatus() {
  return ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0];
}

function unsafeReceivedCount() {
  const received = unsafeReceivedStatus();
  return state.unsafeIssues.filter((row) => row.status === received).length;
}
```

- [ ] **Step 2: Change dashboard stat calculation**

Replace:

```javascript
const warnCount = state.inspections.reduce((sum, row) => sum + Number(row.warnings || 0), 0);
```

with:

```javascript
const unsafeCount = unsafeReceivedCount();
```

Replace the old stat pill:

```javascript
${statPill("위험 미확인", warnCount, "건", "#dc2626", "warning", "즉시 확인 필요", "risk")}
```

with:

```javascript
${statPill("불안전 요소", unsafeCount, "건", "#dc2626", "warning", "즉시 확인 필요", "unsafe")}
```

- [ ] **Step 3: Make the unsafe stat card route to the unsafe list**

Update `statPill()` so `scope === "unsafe"` renders:

```javascript
data-stat-scope="unsafe" data-action="view-unsafe-received"
```

Keep existing history scope behavior for `today`, `all`, and `delivery`.

Add a click action:

```javascript
if (button.dataset.action === "view-unsafe-received") {
  openUnsafeReceivedList();
}
```

Add:

```javascript
function openUnsafeReceivedList() {
  state.manageTab = "unsafe";
  state.unsafeDetailId = "";
  state.unsafeFilters = { ...state.unsafeFilters, status: unsafeReceivedStatus() };
  saveJson("manageTab", state.manageTab);
  saveJson("unsafeFilters", state.unsafeFilters);
  changeView("manage");
}
```

### Task 4: Remove the History Risk Scope

**Files:**
- Modify: `assets/js/app.js`

- [ ] **Step 1: Remove the `risk` tab**

Change `scopeButtons` in `renderHistory()` to:

```javascript
const scopeButtons = [
  ["all", "전체 이력"],
  ["today", "오늘 점검"],
  ["delivery", "인도 예정"],
];
```

- [ ] **Step 2: Normalize stale risk route state**

Add:

```javascript
function normalizeHistoryScope(scope) {
  return ["all", "today", "delivery"].includes(scope) ? scope : "all";
}
```

Use it when loading or restoring `state.historyScope`, and inside `renderHistory()` before reading labels.

- [ ] **Step 3: Remove risk filtering**

Delete the `state.historyScope === "risk"` filtering branch from `filteredHistoryRows()`.

### Task 5: Verify and Commit

**Files:**
- Verify: `assets/js/app.js`
- Verify: `assets/css/styles.css`
- Verify: `tests/visual-check.js`
- Verify: `tools/browser-smoke.mjs`

- [ ] **Step 1: Run syntax and focused tests**

Run:

```powershell
node --check assets\js\app.js
node --check tools\browser-smoke.mjs
node tests\issue-material-rules.test.js
node tests\checklist-rules.test.js
node tools\security-regression.mjs
node tests\visual-check.js
```

Expected: all pass.

- [ ] **Step 2: Run browser smoke if the local server is available**

Run:

```powershell
node tools\browser-smoke.mjs "C:\Program Files\Google\Chrome\Application\chrome.exe" http://127.0.0.1:4173
```

Expected: pass.

- [ ] **Step 3: Check diff hygiene**

Run:

```powershell
git diff --check -- assets/js/app.js assets/css/styles.css tests/visual-check.js tools/browser-smoke.mjs docs/superpowers/plans/2026-05-15-home-unsafe-count.md
git status --short --branch
```

Expected: only intended files plus pre-existing `.mcp.json` are modified.

- [ ] **Step 4: Commit implementation**

Stage all intended files except `.mcp.json`.

Run:

```powershell
git add -- assets/js/app.js assets/css/styles.css tests/visual-check.js tools/browser-smoke.mjs docs/superpowers/plans/2026-05-15-home-unsafe-count.md
git commit -m "Link home unsafe count to received issues"
```
