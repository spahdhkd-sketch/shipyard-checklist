# Tool Nature Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace per-item tool linking with tool nature based filtering for shipyard safety checks.

**Architecture:** Keep the existing static multi-page app structure. Extend the local state shape, Supabase mappings, and render functions in `assets/js/app.js`, then tighten the visual density in `assets/css/styles.css`.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, Supabase Postgres/REST, Vercel static deployment.

---

### Task 1: Data Model And Filtering

**Files:**
- Modify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\assets\js\app.js`

- [ ] Add constants for tool nature and visibility condition values.
- [ ] Add `nature` to tools, `toolNature` to categories, and `visibilityCondition` to checklist items.
- [ ] Change `filteredChecklistItems()` so selected tool natures determine which checklist items appear.
- [ ] Keep `tool_ids` only for compatibility and stop using it in filtering.

### Task 2: Management UI

**Files:**
- Modify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\assets\js\app.js`
- Modify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\assets\css\styles.css`

- [ ] Move tool management to the More screen top level.
- [ ] Add nature selectors to tool add/edit UI.
- [ ] Remove per-item tool checkbox UI.
- [ ] Add visibility condition selectors to item edit UI.
- [ ] Add category-level tool nature selector.
- [ ] Make tool cards compact with five cards per mobile row.

### Task 3: Supabase Schema And Sync

**Files:**
- Modify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\assets\js\app.js`
- Create: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\docs\supabase-schema-2026-05-14-tool-nature-filter.sql`

- [ ] Add Supabase mappings for `safety_tools.nature`, `safety_categories.tool_nature`, and `safety_items.visibility_condition`.
- [ ] Create SQL migration with `check` constraints for allowed values.
- [ ] Apply SQL through Supabase MCP.
- [ ] Verify REST access to the new columns.

### Task 4: Cleanup, Verification, Deployment

**Files:**
- Modify: `C:\Users\이보람\Documents\Codex\2026-05-11\index-html\tools\browser-smoke.mjs`

- [ ] Extend smoke checks for compact tool cards and prep filtering.
- [ ] Run `node --check assets\js\app.js`.
- [ ] Run local browser smoke against `http://127.0.0.1:4173`.
- [ ] Deploy to Vercel production.
- [ ] Run deployed browser smoke against the Vercel alias URL.
