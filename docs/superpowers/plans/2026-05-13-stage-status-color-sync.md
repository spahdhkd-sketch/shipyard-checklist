# Stage Status Color Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make ship stage status manually editable, remove the mounting-count auto rule, and unify stage/category colors across the app.

**Architecture:** Keep the static HTML structure. Update `assets/js/app.js` to use one stage metadata source for labels/colors and map checklist categories to those stage colors. Update `assets/css/styles.css` for high-contrast stage controls and always-visible mobile header context.

**Tech Stack:** Plain browser JavaScript, CSS, static HTML.

---

### Task 1: Stage Model

**Files:**
- Modify: `assets/js/app.js`

- [ ] Add a `STAGE_META` map for `mounting`, `lc`, `st`, `cl`, `dl`.
- [ ] Add a category-to-stage mapping for known category names and ids.
- [ ] Make `shipStageInfo`, `workAccent`, and dashboard stage UI read from those maps.

### Task 2: Ship Status Editing

**Files:**
- Modify: `assets/js/app.js`
- Modify: `assets/css/styles.css`

- [ ] Remove the `mountingInspectionCount >= 3` auto-transition behavior from `effectiveShipStage`.
- [ ] Add a right-side stage dropdown to each ship card.
- [ ] Persist dropdown changes through `updateShipProcess`.
- [ ] Remove user-facing copy that mentions mounting count auto classification.

### Task 3: Header and Toast Cleanup

**Files:**
- Modify: `assets/js/app.js`
- Modify: `assets/css/styles.css`

- [ ] Remove the success toast `서버 데이터를 가져왔습니다.`
- [ ] Keep server sync status badges.
- [ ] Show the mobile header date, greeting, and sync status on every view.

### Task 4: Verification

**Files:**
- Use: `tools/browser-smoke.mjs`

- [ ] Run `node --check assets/js/app.js`.
- [ ] Run local and browser smoke tests.
- [ ] Verify ships page contains stage dropdowns and items page still works.
- [ ] Verify no runtime errors.
