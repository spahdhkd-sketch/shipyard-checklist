# GS Safety Checklist — Project Brief

Last consolidated: `2026-08-27` (Asia/Seoul)

## Product purpose

GS Safety Checklist is a Korean-language field safety PWA for shipyard work. It helps workers complete pre-work checks on mobile devices and gives foremen and administrators a shared operational view for master data, work orders, safety records, notifications, retention, and reporting.

The product goal is to keep field work fast and understandable while making the resulting safety activity auditable. Poor connectivity, background synchronization, application upgrades, concurrent edits, and destructive administrative actions are treated as data-safety boundaries.

## Primary users and workflows

- **Workers:** sign in, review assigned work, complete pre-work safety checks, report unsafe conditions or missing materials, and sign safety pledges.
- **Foremen and administrators:** manage ships, workers, work types, tools, checklist content, pictograms, work orders, reports, notifications, safety settings, retention, and operational statistics.
- **Field environment:** Korean UI, mobile-first interaction, intermittent connectivity, installed PWA clients, and quick task completion are first-class constraints.

Core application routes:

| View | Main shell | Purpose |
|---|---|---|
| Home | `index.html` | Daily safety operations and entry points |
| Pre-work check | `check.html` | Work selection, checklist, signature, and submission flow |
| Ships | `ships.html` | Ship/process board and ship-level operations |
| History | `history.html` | Inspection search and read-only record detail |
| Quick menu / work types | `items.html` | Permission-filtered routes and work-type administration |
| Safety pledge | `pledge.html` | Daily pledge targeting, reminders, and completion tracking |
| Analytics | `analytics.html` | Safety signals, inspection statistics, and worker trends |
| Administration | `manage.html` | Workers, work orders, reports, push, settings, and retention |
| Unsafe issues | `unsafe.html` | Unsafe-condition list, detail, and timeline |
| Missing materials | `materials.html` | Missing-material list, detail, and timeline |

`vercel.json` rewrites extensionless application routes to the appropriate static shell. The shared runtime resolves the logical view and keeps navigation behavior consistent across direct URLs, desktop navigation, mobile bottom navigation, and browser-history-aware detail flows.

## Architecture

### Frontend

- Framework-free multi-page HTML, CSS, and JavaScript.
- Shared application orchestrator: `assets/js/app-v2.js`.
- Administrative runtime: `assets/js/admin-v2.js`, dynamically imported when required and emitted as `assets/dist/js/admin-v2.js`.
- Shared view rendering: `assets/js/screen-views.js` and `assets/js/dashboard-view.js`.
- Operational view modules cover auxiliary screens, governance, history, management, materials, quick menu, ships, and unsafe issues.
- Domain behavior is separated into focused models, helpers, and `*-rules.js` modules for analytics, inspections, issues/materials, navigation, notifications, retention, safety settings, state shape, workers, work preparation, and imports.
- Source styles live in `assets/css/`; source JavaScript lives in `assets/js/`.
- `tools/build-assets.mjs` minifies source files one-to-one into committed `assets/dist/` deploy artifacts without bundling.

Global script load order and existing public function names are compatibility contracts. Source files are the editing target; generated `assets/dist/` files are rebuilt and reviewed after source changes.

### State, synchronization, and data safety

- Supabase provides database storage, authentication/session support, Realtime, Storage, RPCs, and Edge Functions.
- The client maintains local state and pending/offline work, reconciles remote rows directly, and uses cursor-based polling when Realtime is unavailable.
- Remote synchronization starts only when the current session is allowed to access the relevant data. Pre-login reads are limited to the public master data needed for sign-in and checklist setup.
- Pending records must survive app updates and remain bound to the worker who created them.
- Editor drafts, destructive administrative operations, deletion events, retries, and service-worker controller changes require explicit preservation and rollback behavior.

### Backend

- Edge Functions live under `supabase/functions/`: `admin-mutations`, `pictogram-image`, `record-retention`, and `worker-push`.
- Normal schema changes live in `supabase/migrations/`.
- `supabase/cutovers/` contains separately approved production hardening steps and must not be applied as part of an ordinary migration push.
- Browser-visible configuration is not an authorization boundary. Sensitive mutations and notification delivery are validated by server-side functions and database policy.

### Hosting and PWA

- Vercel serves the static application and defines redirects, rewrites, cache headers, and CSP through `vercel.json`.
- `manifest.json` defines the installable application.
- `sw.js` coordinates the application version, asset token, shell cache, update checks, and controlled-tab reload behavior.
- Release and cache-token history is recorded in `VERSION.md`.
- The GitHub default branch, a Vercel Preview, and the production alias are separate states. Never infer production from `main`, a passing Preview, or a `READY` deployment alone.

## Repository map

| Path | Responsibility |
|---|---|
| `assets/js/` | JavaScript source and domain/view modules |
| `assets/css/` | CSS source and responsive design tokens/components |
| `assets/dist/` | Generated, committed deployment artifacts |
| `supabase/functions/` | Authenticated server-side mutation and delivery boundaries |
| `supabase/migrations/` | Ordinary database schema evolution |
| `supabase/cutovers/` | Manually approved production-only hardening steps |
| `tests/` | Node-based regression tests |
| `tools/` | Asset build, quality, local server, and browser E2E tooling |
| `docs/handoff/` | Current and dated operational/release state |

The canonical GitHub repository is `spahdhkd-sketch/shipyard-checklist`. The active branch, exact SHA, deployment relationship, and open verification boundaries are intentionally maintained in `docs/handoff/CURRENT.md` rather than duplicated here.

## Verification model

- `npm run verify` runs the repository syntax and Node regression gate.
- `npm run build:assets` regenerates committed deployment artifacts from source.
- `node tools/quality-harness.mjs --skip-verify --allow-non-main` checks repository, release, HTML, security, synchronization, PWA, and deployment invariants on a feature branch.
- `npm run e2e` exercises hermetic browser flows and blocks live Supabase requests.
- `npm run e2e:design-tokens` verifies the responsive UI surface at desktop and field-mobile widths.
- `npm run e2e:pwa` checks service-worker and upgrade behavior.
- `git diff --check` guards whitespace and patch integrity.

Passing local tests is evidence for the tested code state, not proof of a production deployment, production alias, live notification receipt, or database cutover. Those surfaces require their own exact-SHA and live-state evidence.

## Engineering invariants

1. **Data safety first:** a UI failure, retry, Realtime event, polling response, or service-worker refresh must not silently delete, duplicate, or reassign records.
2. **Authentication and authorization are distinct:** client gating improves behavior, while server functions and database policy enforce authority.
3. **Preview is not production:** previews must not move `gs-safety-checklist.vercel.app` without explicit approval and exact-SHA verification.
4. **Source and dist stay aligned:** source edits require regenerated and reviewed deploy artifacts.
5. **Release tokens stay coordinated:** app version, service worker, HTML query tokens, tests, quality harness, and `VERSION.md` must agree for an approved release.
6. **Mobile is a primary surface:** affected workflows must remain usable at 360–430 px as well as desktop widths.
7. **The field UI remains Korean and light-theme-only:** do not introduce desktop-only interaction or implicit theme switching without an explicit product decision.
8. **Secrets and worker identifiers stay private:** reports and handoffs omit credentials, session material, employee numbers, and personally identifying worker data.
9. **Administrative writes are explicit:** destructive actions, live notification sends, production data mutations, and release operations require deliberate authorization and visible success/failure handling.
10. **Recovery artifacts stay isolated:** historical handoffs, patches, and prototypes are evidence, not automatically applicable source changes.

## Sources of truth

Use these documents together:

1. `docs/project/PROJECT_BRIEF.md` for durable product, architecture, repository, and engineering context.
2. `docs/handoff/CURRENT.md` for the active branch, release/deployment relationship, verified behavior, preserved inputs, open defects, and next work.
3. `VERSION.md` for the application release and coordinated PWA cache record.

Older root-level and dated handoff files remain historical evidence. When they conflict with `docs/handoff/CURRENT.md`, the current handoff governs.
