# Supabase Sync Speed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make field submissions feel immediate while keeping Supabase synchronization reliable.

**Architecture:** Store records locally first, show the completion UI immediately, then synchronize in the background through a small local retry queue. Throttle full remote pulls and add row-scoped sync helpers so common writes do not force every remote table to upload.

**Tech Stack:** Static vanilla SPA, localStorage, Supabase JS, Node static tests, Playwright screenshots.

---

### Task 1: Background Sync Queue

**Files:**
- Modify: `assets/js/app-v2.js`
- Test: `tests/static-recovery.test.js`

- [ ] Add `pendingSyncQueue` and `lastRemotePullAt` state loaded from localStorage.
- [ ] Persist the queue alongside the existing app data.
- [ ] Add queue helpers: enqueue, prune, schedule, flush, and targeted row sync.

### Task 2: Local-First Inspection Submit

**Files:**
- Modify: `assets/js/app-v2.js`
- Test: `tests/static-recovery.test.js`

- [ ] Keep the existing validation.
- [ ] Save inspection and items locally.
- [ ] Navigate to the completion screen before waiting for Supabase.
- [ ] Enqueue inspection sync and flush it in the background.

### Task 3: Pull Throttling

**Files:**
- Modify: `assets/js/app-v2.js`
- Test: `tests/static-recovery.test.js`

- [ ] Add a 60-second full pull throttle.
- [ ] Let background queue retries run independently from pull throttling.
- [ ] Keep the manual/full pull function available for boot after the throttle expires.

### Task 4: Targeted Sync Paths

**Files:**
- Modify: `assets/js/app-v2.js`
- Test: `tests/static-recovery.test.js`

- [ ] Let `persistAndSync()` accept specific table keys.
- [ ] Update common write paths for workers, ships, issue records, materials, tools, categories, sections, and items to enqueue only changed tables.
- [ ] Keep full push as fallback for broad or uncertain operations.

### Task 5: Verification And Deployment

**Files:**
- Modify: none

- [ ] Run `npm.cmd run verify`.
- [ ] Capture the mobile home/check flow if needed.
- [ ] Deploy with `cmd /c npx.cmd vercel@latest deploy --prod --yes`.
- [ ] Verify `https://gs-safety-checklist.vercel.app/` after deployment.
