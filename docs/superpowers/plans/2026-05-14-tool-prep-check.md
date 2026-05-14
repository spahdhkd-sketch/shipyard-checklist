# Tool Prep Check Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `사용 공기구와 준비물` pre-check flow that filters checklist items by selected tools, plus admin management for tools, item names, item-tool links, and custom pictograms.

**Architecture:** Keep the existing static multi-page app structure and extend `assets/js/app.js` state, renderers, and persistence helpers in place. Add focused CSS in `assets/css/styles.css` and extend the existing smoke test to cover the new flow. Avoid broad refactors while touching the large app file.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, localStorage/Supabase sync patterns already present, Node-based smoke test.

---

## Files

- Modify: `assets/js/app.js`
  - Add tool/prep state, persistence, filtering, admin management, item edit, and pictogram library behavior.
- Modify: `assets/css/styles.css`
  - Add compact mobile-first styles for prep page, tool cards, admin tool list, item edit controls, and pictogram management.
- Modify: `tools/browser-smoke.mjs`
  - Add browser checks for tool prep flow and item management where practical.
- Keep: `docs/superpowers/specs/2026-05-14-tool-prep-check-design.md`
  - Source of truth for requirements.

---

### Task 1: Add Data Shape And Migration Defaults

**Files:**
- Modify: `assets/js/app.js`

- [ ] **Step 1: Locate current state initialization and persistence maps**

Find the state object, DB mapping helpers, local storage keys, default category/section/item data, and `hydrate`/save routines.

- [ ] **Step 2: Add state fields**

Add:

```js
tools: [],
pictograms: [],
draft: { worker: "", shipNo: "", checks: {}, selectedToolIds: [], toolPrepComplete: false },
```

Preserve existing `draft` fields.

- [ ] **Step 3: Add default field migration**

Ensure each category has:

```js
requireToolCheck: true
```

Ensure each item has:

```js
toolIds: []
```

Ensure built-in pictograms are initialized from current `PICTOGRAMS`/`PICTOGRAM_ASSETS` with `source: "builtIn"`.

- [ ] **Step 4: Add helpers**

Implement small helpers:

```js
toolsFor(categoryId)
activeTools(categoryId)
pictogramLibrary()
toolById(id)
filteredChecklistItems(categoryId)
resetToolPrepDraft()
```

`filteredChecklistItems` must apply the spec rule: common items always display; linked items display only when at least one linked tool is selected.

- [ ] **Step 5: Run JS syntax check**

```powershell
node --check assets\js\app.js
```

---

### Task 2: Add User Prep Page Flow

**Files:**
- Modify: `assets/js/app.js`
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Add prep mode to check rendering**

When a category is selected:

- If it has no active tools, show checklist directly.
- If it has active tools and `state.draft.toolPrepComplete` is false, render `사용 공기구와 준비물`.
- If prep is complete, render checklist.

- [ ] **Step 2: Render prep page**

Add `renderToolPrep(cat)` with:

- page title `사용 공기구와 준비물`
- selected category name
- checkbox/card list of tools
- selected count
- back button
- `다음 점검으로` button

Button disabled only when category `requireToolCheck` is true and no tool is selected.

- [ ] **Step 3: Add event handlers**

Handle:

- `data-tool-prep-toggle`
- `data-action="continue-tool-prep"`
- back to category selection and reset draft tool state

- [ ] **Step 4: Use filtered items everywhere**

Replace checklist calculations for selected category:

- checked count
- high missing count
- completion
- submit eligibility
- rendered sections
- submitted inspection item list

All must use `filteredChecklistItems(cat.id)`.

- [ ] **Step 5: Store selected tools in inspection history**

On submit, save selected tool IDs/names in the inspection record, e.g.

```js
tools: selectedTools.map(({ id, name }) => ({ id, name }))
```

- [ ] **Step 6: Style mobile-first prep cards**

Add CSS for:

- `.tool-prep-grid`
- `.tool-prep-card`
- `.tool-prep-card.checked`
- `.tool-prep-actions`

Keep touch targets large and readable.

- [ ] **Step 7: Verify syntax**

```powershell
node --check assets\js\app.js
```

---

### Task 3: Add Admin Tool Management

**Files:**
- Modify: `assets/js/app.js`
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Add admin panel under pictogram edit**

In `renderItems()` category detail, below pictogram edit, render:

- `공기구/준비물 관리`
- input for new tool name
- add button
- ON/OFF control for `requireToolCheck`
- list of tools with edit/delete controls

- [ ] **Step 2: Add handlers**

Implement:

- add tool
- save tool name
- delete tool
- toggle `requireToolCheck`

Deletion should mark `deleted: true` and remove that ID from future active tool lists. Also remove deleted IDs from items when saving or filtering.

- [ ] **Step 3: Preserve admin gating**

All mutation controls must be disabled unless `state.adminMode` is true.

- [ ] **Step 4: Style management list**

Add compact styles for tool rows that fit mobile.

- [ ] **Step 5: Verify syntax**

```powershell
node --check assets\js\app.js
```

---

### Task 4: Add Item Name Editing And Tool Links

**Files:**
- Modify: `assets/js/app.js`
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Inspect `renderSectionManager`**

Find current item row rendering and add edit controls without breaking existing add/delete behavior.

- [ ] **Step 2: Add item name edit UI**

For each item row in admin mode, show:

- text input with current item text
- risk select or existing risk control
- save button

For non-admin mode, keep read-only display.

- [ ] **Step 3: Add related tool checkboxes**

For each item row, show active tools for that category with checkboxes. Checked values update the item `toolIds`.

If no tools exist, show a small note that the item is treated as common.

- [ ] **Step 4: Add save handler**

Implement save item update:

- item text
- risk
- `toolIds`

Validate non-empty item text.

- [ ] **Step 5: Keep common item behavior obvious**

Add microcopy: `공기구를 선택하지 않으면 공통 점검 항목으로 항상 표시됩니다.`

- [ ] **Step 6: Verify syntax**

```powershell
node --check assets\js\app.js
```

---

### Task 5: Add Pictogram Library Management

**Files:**
- Modify: `assets/js/app.js`
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Convert picker to library source**

Make `renderPictogramPicker()` use `pictogramLibrary()` instead of only the constant `PICTOGRAMS`.

- [ ] **Step 2: Render library admin controls**

In category detail management, add:

- file input for image upload
- label input
- add pictogram button
- custom pictogram list with preview/name/delete

- [ ] **Step 3: Add file upload handler**

Read selected image as Data URL using `FileReader`.

Store custom pictogram:

```js
{ id, label, src, source: "custom", order, deleted: false }
```

- [ ] **Step 4: Add custom pictogram rename/delete**

Do not allow deletion of built-in pictograms. When deleting a custom pictogram used by categories, reset those categories to a default built-in icon and show a toast.

- [ ] **Step 5: Update `workVisual`**

If icon key matches a custom pictogram, render its `src` image. Otherwise keep existing built-in behavior.

- [ ] **Step 6: Verify syntax**

```powershell
node --check assets\js\app.js
```

---

### Task 6: Update Inspection History Detail

**Files:**
- Modify: `assets/js/app.js`
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Locate inspection detail renderer**

Find `renderInspectionRecord`.

- [ ] **Step 2: Show selected tools**

If a record has selected tools, show a compact `사용 공기구와 준비물` section before checklist details.

- [ ] **Step 3: Handle old records**

If tools are missing, render nothing extra.

- [ ] **Step 4: Verify syntax**

```powershell
node --check assets\js\app.js
```

---

### Task 7: Extend Smoke Tests

**Files:**
- Modify: `tools/browser-smoke.mjs`

- [ ] **Step 1: Add checks for items page**

Verify that `items.html` still loads and includes pictogram picker images.

- [ ] **Step 2: Add minimal prep flow check**

If default data does not have tools, inject a temporary tool and linked item through localStorage or page evaluation, then verify:

- selecting category shows prep page
- next button disabled when required and no selected tool
- selecting tool enables next
- continuing shows checklist

- [ ] **Step 3: Run smoke test**

```powershell
node tools\browser-smoke.mjs "C:\Program Files\Google\Chrome\Application\chrome.exe" http://127.0.0.1:4173
```

---

### Task 8: Final Verification

**Files:**
- Modify as needed from previous tasks.

- [ ] **Step 1: Run syntax check**

```powershell
node --check assets\js\app.js
```

- [ ] **Step 2: Run browser smoke**

```powershell
node tools\browser-smoke.mjs "C:\Program Files\Google\Chrome\Application\chrome.exe" http://127.0.0.1:4173
```

- [ ] **Step 3: Capture mobile check screenshot**

Use local `http://127.0.0.1:4173/check.html` at a mobile viewport and confirm the prep page and checklist are readable.

- [ ] **Step 4: Summarize changed files and verification output**

Report:

- files changed
- whether syntax and browser smoke passed
- any known limitations
