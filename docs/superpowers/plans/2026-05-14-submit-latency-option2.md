# Submit Latency Option 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make checklist submission faster by syncing only inspection history tables before navigation, and move the submit button to the bottom of the checklist page.

**Architecture:** Keep the current static multi-page app and vanilla JavaScript structure. Add one focused submit-sync helper in `assets/js/app.js`, reuse the existing `REMOTE_TABLES` mappings for database conversion, and keep broad `persistAndSync()` for admin/config changes. Update the smoke test to prove the submit button is rendered after checklist sections and a submitted record appears in history.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, localStorage, Supabase REST client through `@supabase/supabase-js`, Node-based Chrome DevTools smoke test.

---

## File Map

- Modify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\assets\js\app.js`
  - Move checklist submit button markup from the top form row to a bottom action area.
  - Add `remoteConfigByKey()` and `syncInspectionHistory()` helpers.
  - Change `submitInspection()` to sync only the newly created inspection and inspection items.
- Modify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\assets\css\styles.css`
  - Add small bottom submit action styling that is mobile-safe and does not disturb existing checklist cards.
- Modify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\tools\browser-smoke.mjs`
  - Add a submit-flow smoke check with injected local data and Supabase blocked.
  - Verify submit button appears after checklist sections.
  - Verify submitted history card appears after submit.

The workspace is not a git repository, so commit steps are intentionally omitted.

---

### Task 1: Add Failing Smoke Coverage for Submit Layout and History Creation

**Files:**
- Modify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\tools\browser-smoke.mjs`

- [ ] **Step 1: Add the smoke test setup before the existing prep-flow cleanup**

Insert a new block after the existing `prepChecklist` evaluation and before the block that restores `prepSmokeBackup`.

```js
  const submitFlow = await cdp.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const backupKeys = ['categories', 'sections', 'items', 'tools', 'ships', 'draft', 'inspections', 'inspectionItems'];
      const backup = Object.fromEntries(backupKeys.map((key) => [key, localStorage.getItem('${STORAGE_PREFIX}' + key)]));
      sessionStorage.setItem('submitSmokeBackup', JSON.stringify(backup));
      localStorage.setItem('${STORAGE_PREFIX}categories', JSON.stringify([
        { id: 'submit-smoke', label: 'Submit Smoke', icon: 'blockAssembly', color: '#1f6eb3', requireToolCheck: false, toolNature: '선행', order: 1 }
      ]));
      localStorage.setItem('${STORAGE_PREFIX}sections', JSON.stringify([
        { id: 'submit-sec-1', categoryId: 'submit-smoke', title: 'Submit Section', order: 1 }
      ]));
      localStorage.setItem('${STORAGE_PREFIX}items', JSON.stringify([
        { id: 'submit-item-1', categoryId: 'submit-smoke', sectionId: 'submit-sec-1', text: 'Submit required high', risk: 'high', required: true, active: true, toolIds: [], visibilityCondition: '항상 표시', order: 1 },
        { id: 'submit-item-2', categoryId: 'submit-smoke', sectionId: 'submit-sec-1', text: 'Submit normal low', risk: 'low', required: false, active: true, toolIds: [], visibilityCondition: '항상 표시', order: 2 }
      ]));
      localStorage.setItem('${STORAGE_PREFIX}tools', JSON.stringify([]));
      localStorage.setItem('${STORAGE_PREFIX}ships', JSON.stringify([
        { id: 'submit-ship-1', no: 'H-SMOKE', type: 'CNTR', processStage: 'mounting', lcDate: '2026-05-14', order: 1, createdAt: '2026-05-14T00:00:00.000Z' }
      ]));
      localStorage.setItem('${STORAGE_PREFIX}draft', JSON.stringify({ worker: '', shipNo: '', checks: {}, selectedToolIds: [], toolPrepComplete: false }));
      localStorage.setItem('${STORAGE_PREFIX}inspections', JSON.stringify([]));
      localStorage.setItem('${STORAGE_PREFIX}inspectionItems', JSON.stringify([]));
      location.href = 'check.html';
      return { started: true };
    })()`,
  });
  await delay(1400);
  await cdp.send("Runtime.evaluate", {
    expression: `document.querySelector('[data-select-category="submit-smoke"]')?.click()`,
  });
  await delay(700);
  const submitLayoutBefore = await cdp.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const submitButton = document.querySelector('[data-action="submit-inspection"]');
      const lastSection = Array.from(document.querySelectorAll('.check-section')).at(-1);
      const submitRect = submitButton?.getBoundingClientRect();
      const sectionRect = lastSection?.getBoundingClientRect();
      return {
        hasSubmit: Boolean(submitButton),
        submitAfterSections: Boolean(submitRect && sectionRect && submitRect.top > sectionRect.bottom),
        submitInsideTopForm: Boolean(submitButton?.closest('.form-row')),
        disabledBeforeData: Boolean(submitButton?.disabled)
      };
    })()`,
  });
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      document.querySelectorAll('[data-check-item]').forEach((node) => {
        if (!node.checked) node.click();
      });
      const worker = document.querySelector('#worker');
      worker.value = 'Submit Smoke Worker';
      worker.dispatchEvent(new Event('input', { bubbles: true }));
      const ship = document.querySelector('#shipNo');
      ship.value = 'H-SMOKE';
      ship.dispatchEvent(new Event('change', { bubbles: true }));
    })()`,
  });
  await delay(700);
  const submitReady = await cdp.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => ({
      disabledAfterData: Boolean(document.querySelector('[data-action="submit-inspection"]')?.disabled),
      checkedCount: document.querySelectorAll('[data-check-item]:checked').length
    }))()`,
  });
  await cdp.send("Runtime.evaluate", {
    expression: `document.querySelector('[data-action="submit-inspection"]')?.click()`,
  });
  await delay(1400);
  const submitAfter = await cdp.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => ({
      href: location.href,
      title: document.querySelector('h1')?.textContent?.trim() || '',
      historyCards: document.querySelectorAll('.history-card').length,
      historySummary: document.querySelector('.history-card-summary')?.textContent?.trim() || '',
      localInspections: JSON.parse(localStorage.getItem('${STORAGE_PREFIX}inspections') || '[]').length,
      localItems: JSON.parse(localStorage.getItem('${STORAGE_PREFIX}inspectionItems') || '[]').length
    }))()`,
  });
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const backup = JSON.parse(sessionStorage.getItem('submitSmokeBackup') || '{}');
      Object.entries(backup).forEach(([key, value]) => {
        const storageKey = '${STORAGE_PREFIX}' + key;
        if (value === null) localStorage.removeItem(storageKey);
        else localStorage.setItem(storageKey, value);
      });
      sessionStorage.removeItem('submitSmokeBackup');
    })()`,
  });
```

- [ ] **Step 2: Add assertions for the new smoke values**

Add these assertions near the other `assert(...)` calls:

```js
  assert(submitLayoutBefore.result.value.hasSubmit, "Checklist should render a submit button", submitLayoutBefore.result.value);
  assert(submitLayoutBefore.result.value.submitAfterSections, "Submit button should appear after checklist sections", submitLayoutBefore.result.value);
  assert(submitLayoutBefore.result.value.submitInsideTopForm === false, "Submit button should not remain in the top form row", submitLayoutBefore.result.value);
  assert(submitLayoutBefore.result.value.disabledBeforeData === true, "Submit should stay disabled before required data is complete", submitLayoutBefore.result.value);
  assert(submitReady.result.value.disabledAfterData === false, "Submit should enable after checks, worker, and ship are complete", submitReady.result.value);
  assert(submitReady.result.value.checkedCount === 2, "Submit smoke should check all injected items", submitReady.result.value);
  assert(submitAfter.result.value.href.includes("history.html"), "Submit should navigate to history after saving", submitAfter.result.value);
  assert(submitAfter.result.value.historyCards === 1, "Submitted inspection should render as one history card", submitAfter.result.value);
  assert(submitAfter.result.value.historySummary.includes("Submit Smoke Worker"), "History card should show submitted worker", submitAfter.result.value);
  assert(submitAfter.result.value.localInspections === 1, "Submitted inspection should be saved locally", submitAfter.result.value);
  assert(submitAfter.result.value.localItems === 2, "Submitted inspection items should be saved locally", submitAfter.result.value);
```

- [ ] **Step 3: Include submit smoke data in the final JSON output**

Add this property to the object passed to `console.log(JSON.stringify(...))`:

```js
    submitFlow: {
      started: submitFlow.result.value,
      layoutBefore: submitLayoutBefore.result.value,
      ready: submitReady.result.value,
      after: submitAfter.result.value,
    },
```

- [ ] **Step 4: Run the smoke test and confirm it fails for the right reason**

Run:

```powershell
node tools\browser-smoke.mjs "C:\Program Files\Google\Chrome\Application\chrome.exe" http://127.0.0.1:4173
```

Expected before implementation:

- The test fails.
- The failure is `Submit button should appear after checklist sections` or `Submit button should not remain in the top form row`.
- This confirms the test catches the current top-form placement.

---

### Task 2: Move Submit Button to the Bottom of the Checklist

**Files:**
- Modify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\assets\js\app.js`
- Modify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\assets\css\styles.css`

- [ ] **Step 1: Remove the top submit button from `renderCheck()`**

In `assets/js/app.js`, inside `renderCheck()`, replace this top form block:

```js
              <button class="btn" data-action="submit-inspection" ${canSubmit ? "" : "disabled"} type="button">제출하기</button>
```

with nothing. Leave worker and ship fields unchanged.

- [ ] **Step 2: Add the bottom submit action after checklist sections**

In the same template, replace:

```js
          ${renderChecklistSections(cat.id)}
```

with:

```js
          ${renderChecklistSections(cat.id)}
          <div class="check-submit-bar">
            <button class="btn check-submit-btn" data-action="submit-inspection" ${canSubmit ? "" : "disabled"} type="button">제출하기</button>
          </div>
```

- [ ] **Step 3: Add CSS for the bottom submit action**

In `assets/css/styles.css`, near the `.check-section` rules, add:

```css
    .check-submit-bar {
      margin-top: 12px;
      display: flex;
      justify-content: stretch;
    }

    .check-submit-btn {
      width: 100%;
      min-height: 52px;
      font-size: 16px;
      font-weight: 900;
    }
```

- [ ] **Step 4: Run the smoke test and confirm only sync-related expectations can remain**

Run:

```powershell
node tools\browser-smoke.mjs "C:\Program Files\Google\Chrome\Application\chrome.exe" http://127.0.0.1:4173
```

Expected:

- The submit placement assertions pass.
- If any failure remains, it should be unrelated to the button location and must be investigated before moving to Task 3.

---

### Task 3: Add Focused Inspection History Sync

**Files:**
- Modify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\assets\js\app.js`

- [ ] **Step 1: Add a helper to find remote table config by state key**

Place this helper near `persistAndSync()`:

```js
    function remoteConfigByKey(key) {
      return REMOTE_TABLES.find((config) => config.key === key);
    }
```

- [ ] **Step 2: Add `syncInspectionHistory()`**

Place this helper after `pushRemote()` or near the other Supabase helpers:

```js
    async function syncInspectionHistory(inspection, inspectionItems) {
      const client = supabaseClient();
      if (!client) {
        setSyncStatus("로컬 저장", "offline");
        return true;
      }

      const inspectionConfig = remoteConfigByKey("inspections");
      const itemConfig = remoteConfigByKey("inspectionItems");
      setSyncStatus("동기화 중", "pending");

      try {
        await upsertTable(client, inspectionConfig, [inspection]);
        await upsertTable(client, itemConfig, inspectionItems);
        setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("동기화에 실패했습니다. Supabase 테이블과 RLS 정책을 확인하세요.");
        return false;
      }
    }
```

- [ ] **Step 3: Guard `upsertTable()` against missing config**

Update `upsertTable()` to fail clearly if a config key is wrong:

```js
    async function upsertTable(client, config, rows) {
      if (!config) throw new Error("Remote table config is missing.");
      const targetRows = config.rows ? config.rows(rows) : rows;
      if (!targetRows.length) return;
      const { error } = await client.from(config.table).upsert(targetRows.map(config.toDb), { onConflict: "id" });
      if (error) throw error;
    }
```

- [ ] **Step 4: Run syntax check**

Run:

```powershell
node --check assets\js\app.js
```

Expected:

- Exit code `0`.
- No syntax errors.

---

### Task 4: Change `submitInspection()` to Use the Focused Sync Helper

**Files:**
- Modify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\assets\js\app.js`

- [ ] **Step 1: Store the new inspection and inspection items in local variables**

Inside `submitInspection()`, replace the direct `state.inspections.unshift({...})` and `state.inspectionItems.push(...items.map(...))` block with:

```js
      const inspection = {
        id: inspectionId,
        categoryId: cat.id,
        worker: state.draft.worker.trim(),
        shipNo: state.draft.shipNo,
        date: localDate(now),
        time: recordTime(now),
        status: checkedCount === items.length ? "완료" : "미완료",
        warnings,
        completion,
        tools: selectedTools,
        createdAt: now.toISOString(),
      };
      const inspectionItems = items.map((row) => ({
        id: uid("inspectionItem"),
        inspectionId,
        itemId: row.id,
        checked: Boolean(state.draft.checks[row.id]),
        risk: row.risk,
        text: row.text,
        sectionTitle: sectionsFor(cat.id).find((section) => section.id === row.sectionId)?.title || "",
      }));

      state.inspections.unshift(inspection);
      state.inspectionItems.push(...inspectionItems);
```

- [ ] **Step 2: Replace broad sync with focused sync**

Replace:

```js
      const synced = await persistAndSync();
```

with:

```js
      persist();
      const synced = await syncInspectionHistory(inspection, inspectionItems);
```

- [ ] **Step 3: Keep failure fallback unchanged**

Confirm this existing fallback remains after the new sync call:

```js
      state.view = "history";
      state.historyScope = "all";
      state.historyFilter = "all";
      state.historyDetailId = null;
      render();
      replaceRouteState();
      toast("점검 이력은 저장되었지만 서버 동기화에 실패했습니다.");
```

- [ ] **Step 4: Run syntax check**

Run:

```powershell
node --check assets\js\app.js
```

Expected:

- Exit code `0`.
- No syntax errors.

---

### Task 5: Verify Locally and Against Supabase Behavior

**Files:**
- Test: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\tools\browser-smoke.mjs`
- Verify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\assets\js\app.js`

- [ ] **Step 1: Run full local smoke test**

Run:

```powershell
node tools\browser-smoke.mjs "C:\Program Files\Google\Chrome\Application\chrome.exe" http://127.0.0.1:4173
```

Expected:

- Exit code `0`.
- `submitFlow.layoutBefore.submitAfterSections` is `true`.
- `submitFlow.layoutBefore.submitInsideTopForm` is `false`.
- `submitFlow.after.localInspections` is `1`.
- `submitFlow.after.localItems` is `2`.

- [ ] **Step 2: Measure local submit speed manually if needed**

Use the existing latency benchmark approach from the prior measurement if the user asks for updated numbers. The expected visible wait for option 2 remains around 175-210 ms on current network conditions.

- [ ] **Step 3: Deploy to Vercel**

Run:

```powershell
npx.cmd --yes vercel@latest deploy --prod --yes
```

Expected:

- Command exits `0`.
- Output includes a `Production:` URL.
- Output includes `Aliased: https://index-html-nu-dun-35.vercel.app`.

- [ ] **Step 4: Inspect deployment**

Run:

```powershell
npx.cmd --yes vercel@latest inspect <production-url-from-step-3>
```

Expected:

- `status` is `Ready`.
- Alias includes `https://index-html-nu-dun-35.vercel.app`.

- [ ] **Step 5: Run deployed smoke test**

Run:

```powershell
node tools\browser-smoke.mjs "C:\Program Files\Google\Chrome\Application\chrome.exe" https://index-html-nu-dun-35.vercel.app
```

Expected:

- Exit code `0`.
- Submit layout and local history creation assertions pass.

- [ ] **Step 6: Perform one real deployed submit verification and clean up**

Use a worker name prefix such as `CodexSubmitOption2_`.

After verification, delete test rows from Supabase:

```sql
with target as (
  select id from public.safety_inspections where worker like 'CodexSubmitOption2_%'
), deleted_items as (
  delete from public.safety_inspection_items where inspection_id in (select id from target) returning id
), deleted_inspections as (
  delete from public.safety_inspections where id in (select id from target) returning id
)
select (select count(*) from deleted_inspections)::int as deleted_inspections,
       (select count(*) from deleted_items)::int as deleted_items;
```

Confirm cleanup:

```sql
select count(*)::int as remaining_submit_option2_rows
from public.safety_inspections
where worker like 'CodexSubmitOption2_%';
```

Expected:

- Real deployed submit shows a new history card.
- Cleanup query reports `remaining_submit_option2_rows = 0`.

---

## Self-Review

- Spec coverage: The plan covers option 2 focused two-table sync, submit-button bottom placement, failure fallback, local smoke coverage, deployment, and test-data cleanup.
- Placeholder scan: No `TBD`, `TODO`, or vague implementation-only steps remain.
- Type consistency: Helper names are consistent: `remoteConfigByKey`, `syncInspectionHistory`, `upsertTable`, `inspection`, and `inspectionItems`.
- Scope check: Offline retry queue, schema changes, and UI redesign are not included.
