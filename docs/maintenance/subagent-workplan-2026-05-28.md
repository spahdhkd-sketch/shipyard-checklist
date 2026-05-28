# Subagent Workplan - GS Safety Checklist - 2026-05-28

## Order

User-selected order:

1. Subagent assignment and ownership
2. Operational verification
3. Feature-domain JavaScript split
4. Thin screen/rendering layer
5. CSS hierarchy split

## Coordination Rules

- The orchestrator owns final integration, full test runs, staging, commits, and pushes.
- Subagents must not stage files, create commits, push branches, or run broad project-wide test suites unless explicitly assigned.
- Prefer read-only reports first because `assets/js/app-v2.js` and `assets/css/styles-v2.css` are both large shared files.
- Code edits must use disjoint write scopes. If two agents need the same source file, only one may edit it at a time.
- Every proposal must include verification commands and the exact behavior it protects.

## Current Hotspots

- `assets/js/app-v2.js`: about 11,887 lines, 705 function declarations.
- `assets/css/styles-v2.css`: about 11,630 lines.
- Existing focused test areas:
  - `tests/checklist-rules.test.js`
  - `tests/issue-material-rules.test.js`
  - `tests/static-recovery.test.js`
  - `tests/worker-security-static.test.js`
  - `tests/admin-mutation-boundary-static.test.js`

## Subagent Assignments

### Agent A - Verification Gate Owner

Goal: prove the current production and local safety gates still hold before refactoring.

Owns:

- `package.json` scripts inspection
- `tools/quality-harness.mjs`
- `tools/claude-quality-harness.mjs`
- Existing tests under `tests/`

Deliverable:

- `docs/maintenance/verification-gate-report-2026-05-28.md`

Must answer:

- What does `npm.cmd run verify` cover?
- What does `npm.cmd run harness:live` cover?
- Which checks protect `safety_pictograms` metadata-only and lazy image behavior?
- Which gaps should be closed before moving code?

### Agent B - JavaScript Domain Map Owner

Goal: map `assets/js/app-v2.js` into extraction-ready domains without changing runtime behavior.

Owns:

- Read-only analysis of `assets/js/app-v2.js`
- Proposed future module boundaries under `assets/js/modules/`

Deliverable:

- `docs/maintenance/js-domain-map-2026-05-28.md`

Must answer:

- Which functions belong to `sync`, `auth/admin`, `pictograms`, `checklist`, `issue-materials`, `workers`, `ship/equipment`, and `rendering`?
- Which functions are safe first extraction candidates?
- Which functions must stay in `app-v2.js` until shared state is isolated?
- What tests should run after each extraction slice?

### Agent C - Rendering and Screen Boundary Owner

Goal: identify how to make screens thin after domain logic is separated.

Owns:

- Read-only analysis of render/open/close/toggle functions in `assets/js/app-v2.js`
- Event binding and state dependency mapping

Deliverable:

- `docs/maintenance/render-boundary-report-2026-05-28.md`

Must answer:

- Which screens are currently most entangled with business logic?
- Which render functions can become pure view helpers first?
- Which event handlers call persistence, Supabase, or admin mutations directly?
- What order minimizes UI regression risk?

### Agent D - CSS Architecture Owner

Goal: split the CSS safely by selectors and screen ownership, not by arbitrary line ranges.

Owns:

- Read-only analysis of `assets/css/styles-v2.css`
- Proposed future files under `assets/css/`

Deliverable:

- `docs/maintenance/css-architecture-report-2026-05-28.md`

Must answer:

- What are the natural CSS sections already present?
- Which selectors map to global base/layout/components/features/utilities?
- Which CSS can move first with lowest visual risk?
- What visual/browser checks are needed after each CSS slice?

## Local Orchestrator Work

While subagents run, the orchestrator should:

- Run the operational verification gate in the user-selected order.
- Keep current production behavior as the reference.
- Avoid starting large code moves until the reports define disjoint write scopes.
- Integrate reports into a single refactor sequence before any broad edit.

## Proposed Refactor Sequence

1. Confirm local and live verification are green.
2. Extract already-tested pure rules first, only if imports can be introduced without changing static asset loading.
3. Extract `pictograms` after confirming metadata-only/lazy-image tests protect the behavior.
4. Extract sync/admin helpers after permission-boundary tests are explicit.
5. Move render helpers after state ownership is documented.
6. Split CSS by global/layout/component/feature groups, one linked stylesheet or build step decision at a time.
