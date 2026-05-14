# Static HTML Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the single `index.html` app into multiple static HTML entry points while preserving the existing app behavior and local/Supabase data.

**Architecture:** Keep the app as a no-build static app. Move the existing inline CSS into `assets/css/styles.css` and the existing inline JavaScript into `assets/js/app.js`, then create one thin HTML shell per major view. The shared JavaScript reads `body[data-initial-view]` to choose the initial view and maps navigation actions to the matching HTML file.

**Tech Stack:** Plain HTML, CSS, browser JavaScript, Supabase CDN, localStorage/sessionStorage.

---

### Task 1: Extract Assets

**Files:**
- Create: `assets/css/styles.css`
- Create: `assets/js/app.js`
- Modify: `index.html`
- Create: `index.original.html`

- [ ] **Step 1: Back up the current single file**

Run: copy `index.html` to `index.original.html`.
Expected: original file remains available for comparison and rollback.

- [ ] **Step 2: Extract the inline style block**

Move all content between `<style>` and `</style>` into `assets/css/styles.css`.
Expected: no CSS rules are lost.

- [ ] **Step 3: Extract the inline app script**

Move all content inside the second `<script>` block into `assets/js/app.js`.
Expected: Supabase CDN remains in the HTML shell; app logic moves to the JS file.

### Task 2: Create Multiple HTML Entrypoints

**Files:**
- Modify: `index.html`
- Create: `check.html`
- Create: `history.html`
- Create: `ships.html`
- Create: `items.html`

- [ ] **Step 1: Build a shared shell**

Each page keeps the same app shell, links `assets/css/styles.css`, loads Supabase, and loads `assets/js/app.js` with `defer`.

- [ ] **Step 2: Set initial view per page**

Use:
```html
<body data-initial-view="dashboard">
```
for `index.html`, and matching values for `check`, `history`, `ships`, and `items`.

### Task 3: Preserve Navigation

**Files:**
- Modify: `assets/js/app.js`

- [ ] **Step 1: Initialize state from the page**

Set `state.view` from `document.body.dataset.initialView` when it matches a known navigation id.

- [ ] **Step 2: Map view navigation to HTML files**

Add a helper that maps `dashboard` to `index.html`, `check` to `check.html`, `history` to `history.html`, `ships` to `ships.html`, and `items` to `items.html`.

- [ ] **Step 3: Keep in-page state changes local**

Only navigate to another HTML file when the target view differs from the current page. Category selection, history filters, and detail views continue rendering in the current page.

### Task 4: Remove Low-Risk Dead Weight

**Files:**
- Modify: `assets/js/app.js`
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Remove route-state logic that only supported single-file SPA view switching**

Remove or simplify push/replace/restore logic that cannot restore cross-page state reliably.

- [ ] **Step 2: Keep required compatibility code**

Preserve localStorage migration, Supabase sync, admin checks, mobile preview, and all render functions.

### Task 5: Verify

**Files:**
- Read: all generated HTML/CSS/JS files

- [ ] **Step 1: Start a local static server**

Run: `python -m http.server 4173`
Expected: server listens on `http://localhost:4173`.

- [ ] **Step 2: Browser smoke test**

Open each page: `/`, `/check.html`, `/history.html`, `/ships.html`, `/items.html`.
Expected: pages load without console syntax errors and show their matching view.

- [ ] **Step 3: Interaction smoke test**

Test navigation buttons, mobile/desktop mode, history filters, and admin-gated items page.
Expected: interactions do not throw runtime errors.
