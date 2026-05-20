# Inline Check Safety Pledge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a required inline safety pledge checklist and reusable same-day signature to the checklist writing screen.

**Architecture:** Reuse the existing `renderSafetyPledgeChecklist()` and submit validation in `assets/js/app-v2.js`, then add a local-only signature cache keyed by KST date and worker name. Keep Supabase schema unchanged and keep the existing section checklist behavior intact.

**Tech Stack:** Static vanilla SPA, browser `localStorage`, existing Node static tests, Playwright/mobile verification through `npm.cmd run verify`.

---

## File Structure

- Modify `assets/js/app-v2.js`: add signature cache helpers, preload cached signatures when worker/date matches, clear signature when worker changes, reset pledge checks on new inspection while allowing render-time signature restore.
- Modify `assets/css/styles-v2.css`: only if visual spacing is needed after checking the current mobile layout.
- Modify `tests/static-recovery.test.js`: assert signature cache helpers and inline pledge placement exist.
- Modify `tests/visual-check.js`: update the checklist screen assertion from the old `#safetyPledge` placeholder expectation to the inline `안전 서약` UI.

## Task 1: Add Same-Day Worker Signature Cache

**Files:**
- Modify: `assets/js/app-v2.js`
- Test: `tests/static-recovery.test.js`

- [ ] **Step 1: Write the failing static test**

Add these assertions after the existing `createdAtMs` assertion in `tests/static-recovery.test.js`:

```js
assert.match(app, /const PLEDGE_SIGNATURE_CACHE_KEY = "pledgeSignatureCache"/);
assert.match(app, /function signatureCacheDateKey\(\)/);
assert.match(app, /function cachedPledgeSignatureForWorker\(workerName\)/);
assert.match(app, /function savePledgeSignatureForWorker\(workerName, signature\)/);
assert.match(app, /function preloadCachedPledgeSignature\(\)/);
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm.cmd run test:static
```

Expected: FAIL because the cache helpers are not defined yet.

- [ ] **Step 3: Add cache helpers near signature helpers**

In `assets/js/app-v2.js`, after `function signatureLabel(...)`, add:

```js
    const PLEDGE_SIGNATURE_CACHE_KEY = "pledgeSignatureCache";

    function signatureCacheDateKey() {
      return today();
    }

    function normalizedWorkerName(workerName) {
      return String(workerName || "").trim();
    }

    function loadPledgeSignatureCache() {
      return loadJson(PLEDGE_SIGNATURE_CACHE_KEY, {});
    }

    function savePledgeSignatureCache(cache) {
      saveJson(PLEDGE_SIGNATURE_CACHE_KEY, cache && typeof cache === "object" ? cache : {});
    }

    function cachedPledgeSignatureForWorker(workerName) {
      const worker = normalizedWorkerName(workerName);
      if (!worker) return "";
      const cache = loadPledgeSignatureCache();
      const dayCache = cache[signatureCacheDateKey()];
      if (!dayCache || typeof dayCache !== "object") return "";
      return String(dayCache[worker] || "");
    }

    function savePledgeSignatureForWorker(workerName, signature) {
      const worker = normalizedWorkerName(workerName);
      const value = String(signature || "");
      if (!worker || !value) return;
      const cache = loadPledgeSignatureCache();
      const day = signatureCacheDateKey();
      cache[day] = cache[day] && typeof cache[day] === "object" ? cache[day] : {};
      cache[day][worker] = value;
      savePledgeSignatureCache(cache);
    }

    function preloadCachedPledgeSignature() {
      if (state.draft.pledgeSignature) return false;
      const cached = cachedPledgeSignatureForWorker(state.draft.worker);
      if (!cached) return false;
      state.draft.pledgeSignature = cached;
      saveJson("draft", state.draft);
      return true;
    }
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npm.cmd run test:static
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```powershell
git add assets/js/app-v2.js tests/static-recovery.test.js
git commit -m "feat: cache checklist pledge signatures"
```

## Task 2: Wire Cache Into Checklist Writing Flow

**Files:**
- Modify: `assets/js/app-v2.js`
- Test: `tests/static-recovery.test.js`

- [ ] **Step 1: Write the failing static test**

Add these assertions near the Task 1 assertions in `tests/static-recovery.test.js`:

```js
assert.match(app, /preloadCachedPledgeSignature\(\);[\s\S]*const submitState = buildCheckSubmitState/);
assert.match(app, /const previousWorker = state\.draft\.worker;/);
assert.match(app, /if \(normalizedWorkerName\(previousWorker\) !== normalizedWorkerName\(state\.draft\.worker\)\) state\.draft\.pledgeSignature = "";/);
assert.match(app, /savePledgeSignatureForWorker\(state\.draft\.worker, state\.draft\.pledgeSignature\)/);
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm.cmd run test:static
```

Expected: FAIL because render/input/save hooks are not wired yet.

- [ ] **Step 3: Preload cached signature before computing submit state**

In `renderCheck()`, after `const selectableShips = visibleWorkerShips();` and before `const submitState = buildCheckSubmitState(...)`, add:

```js
      preloadCachedPledgeSignature();
```

- [ ] **Step 4: Clear signature when worker changes through worker button**

Replace `selectPledgeWorker(id)` with:

```js
    function selectPledgeWorker(id) {
      const worker = state.workers.find((row) => row.id === id);
      if (!worker) return;
      const previousWorker = state.draft.worker;
      state.draft.worker = worker.name;
      if (normalizedWorkerName(previousWorker) !== normalizedWorkerName(state.draft.worker)) state.draft.pledgeSignature = "";
      preloadCachedPledgeSignature();
      saveJson("draft", state.draft);
      render();
    }
```

- [ ] **Step 5: Clear signature when worker changes through text input**

In the `document.addEventListener("input", ...)` handler, replace the one-line worker assignment with:

```js
      if (event.target.id === "worker") {
        const previousWorker = state.draft.worker;
        state.draft.worker = event.target.value;
        if (normalizedWorkerName(previousWorker) !== normalizedWorkerName(state.draft.worker)) state.draft.pledgeSignature = "";
        preloadCachedPledgeSignature();
        saveJson("draft", state.draft);
        refreshCheckSubmitControls();
      }
```

- [ ] **Step 6: Save typed signature to cache**

In the `pledgeSignatureText` input handler, after `state.draft.pledgeSignature = event.target.value;`, add:

```js
        savePledgeSignatureForWorker(state.draft.worker, state.draft.pledgeSignature);
```

- [ ] **Step 7: Save drawn signature to cache**

In `setupSignaturePad()` inside `saveDrawnSignature()`, after `state.draft.pledgeSignature = canvas.toDataURL("image/png");`, add:

```js
        savePledgeSignatureForWorker(state.draft.worker, state.draft.pledgeSignature);
```

- [ ] **Step 8: Preserve signature cache across successful submission only by local cache**

Keep the existing successful submission reset:

```js
        state.draft = createDraft();
```

Do not carry `pledgeChecks` into the new draft. Do not put the previous signature directly into the new draft. The next render will restore only when worker name and date match.

- [ ] **Step 9: Run test to verify it passes**

Run:

```powershell
npm.cmd run test:static
```

Expected: PASS.

- [ ] **Step 10: Commit**

Run:

```powershell
git add assets/js/app-v2.js tests/static-recovery.test.js
git commit -m "feat: reuse same-day pledge signatures"
```

## Task 3: Verify Inline Layout and Update Visual Tests

**Files:**
- Modify: `assets/js/app-v2.js`
- Modify: `assets/css/styles-v2.css` if spacing needs a small adjustment
- Modify: `tests/visual-check.js`

- [ ] **Step 1: Confirm current inline order in code**

Inspect `renderCheck()` and verify the order stays:

```js
          <div class="pledge-flow-grid">
            ${renderPledgeWorkerSelect()}
            ${renderPledgeShipSelect(selectableShips)}
            ${renderSafetyPledgeChecklist()}
          </div>
```

If the existing `안전다짐` field is present outside this block, keep it after `renderSafetyPledgeChecklist()`. If the current app only saves the generated pledge text and no longer renders a separate `#safetyPledge` textarea, do not reintroduce a duplicate textarea.

- [ ] **Step 2: Update visual test expectation**

In `tests/visual-check.js`, replace the old `#safetyPledge` placeholder check block:

```js
      const pledge = document.querySelector("#safetyPledge");
      return {
        hasWireItem: text.includes("탑재용 와이어 / 샤클 안전핀 상태"),
        hasSlingItem: text.includes("슬링벨트 손상 상태"),
        hasCommonHousekeeping: text.includes("탑재 위치 정리정돈"),
        hasCommonUnderLoad: text.includes("권상물 하부 출입금지"),
        pledgePlaceholder: pledge ? pledge.getAttribute("placeholder") : "",
      };
```

with:

```js
      const pledgeCard = Array.from(document.querySelectorAll(".pledge-flow-card"))
        .find((node) => node.textContent.includes("작업 전 안전 서약서"));
      return {
        hasWireItem: text.includes("탑재용 와이어 / 샤클 안전핀 상태"),
        hasSlingItem: text.includes("슬링벨트 손상 상태"),
        hasCommonHousekeeping: text.includes("탑재 위치 정리정돈"),
        hasCommonUnderLoad: text.includes("권상물 하부 출입금지"),
        hasInlinePledge: Boolean(pledgeCard),
        pledgeRuleCount: pledgeCard ? pledgeCard.querySelectorAll("[data-pledge-rule]").length : 0,
      };
```

Then replace:

```js
    assertCheck("safety pledge placeholder", checklistState.pledgePlaceholder === "오늘 하루의 안전다짐 작성을 해주세요");
```

with:

```js
    assertCheck("inline safety pledge appears", checklistState.hasInlinePledge);
    assertCheck("inline safety pledge has rules", checklistState.pledgeRuleCount > 0);
```

- [ ] **Step 3: Run full verification**

Run:

```powershell
npm.cmd run verify
```

Expected: PASS for JS syntax, legacy tests, Vitest, and Playwright mobile Chrome/Safari E2E.

- [ ] **Step 4: Mobile visual check on local app**

If `npm.cmd run verify` starts or requires a local server, use the same verified local URL. Otherwise start the existing static server command used by the project test harness, open the checklist flow on a mobile viewport, and confirm:

```text
담당자명
호선 번호
작업 전 안전 서약서
서명란
섹션별 점검 항목
제출하기
```

There must be no horizontal overflow.

- [ ] **Step 5: Commit**

Run:

```powershell
git add assets/js/app-v2.js assets/css/styles-v2.css tests/visual-check.js tests/static-recovery.test.js
git commit -m "test: cover inline checklist safety pledge"
```

## Final Verification Before Deployment

- [ ] Run:

```powershell
npm.cmd run verify
```

Expected: PASS.

- [ ] Check git status:

```powershell
git status --short
```

Expected: only intentional tracked changes, and do not touch `STATUS_FINAL.md`.

- [ ] If the user says `배포 하자` or equivalent, bump `VERSION.md` by `+0.1` with the real KST date, tag `v<version>`, push, deploy:

```powershell
cmd /c npx.cmd vercel@latest deploy --prod --yes
```

- [ ] After deploy, verify the actual alias, not the direct deployment URL:

```text
https://gs-safety-checklist.vercel.app/
```

## Self-Review

- Spec coverage: inline pledge placement, dynamic `pledgeRules()`, required checks, required signature, reset pledge checks, same-day worker signature reuse, worker-change clearing, no Supabase schema change, and existing checklist behavior are covered.
- Placeholder scan: no unfinished implementation markers or unspecified implementation placeholders remain.
- Type consistency: helper names and draft fields match the existing `state.draft.pledgeChecks`, `state.draft.pledgeSignature`, and `state.draft.worker` fields.
