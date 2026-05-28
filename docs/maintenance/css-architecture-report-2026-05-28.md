# CSS Architecture Report - 2026-05-28

Role: Agent D - CSS Architecture Owner
Scope: read-only analysis of `assets/css/styles-v2.css`; no CSS or app code changes.

## Summary

`assets/css/styles-v2.css` is currently a single linked stylesheet from `index.html` and contains about 11.6k lines / 2.1k selector entries. It should not be split by arbitrary line ranges. The safer ownership model is:

1. Keep cascade order stable.
2. Move dense, self-contained selector families first.
3. Defer global element rules, mobile final overrides, and shared button/form/card rules until feature slices are proven visually stable.

The natural split should be by selector ownership:

- `00-tokens-base.css`
- `10-layout-shell.css`
- `20-components.css`
- `30-features/*.css`
- `40-admin-manage.css`
- `90-utilities-state.css`
- `99-responsive-overrides.css`

`styles-v2.css` can remain as the import manifest during migration, or `index.html` can link each stylesheet in the same order. Do not change load order while moving the first slices.

## Existing Natural CSS Sections

The file has very few explicit section comments. Existing comments mostly mark mobile refinements and final mobile overrides, so natural sections must be inferred from selector families and screen ownership.

| Ownership area | Current selector families | Current shape |
| --- | --- | --- |
| Tokens and base | `:root`, `*`, `html`, `body`, form controls, focus-visible, `[hidden]`, `.sr-only` | Cross-file foundation. It appears throughout later responsive blocks too, so defer moving until imports/order are settled. |
| Login and entry shell | `.login-*`, `.brand-*`, `.sidebar-*`, `.sync-*`, `.push-employee-*` | Early-file cluster with later mobile overrides. Own as login/onboarding plus shell session controls. |
| Home and operations dashboard | `.home-*`, `.ops-*`, `.ops-risk-*`, `.home-action-*` | Dashboard/home selectors are split between early dashboard rules and late responsive overrides. Own by dashboard screen, not by line range. |
| Pledge/signature flow | `.pledge-*`, `.signature-*`, `.worker-*` used by pledge | Mostly concentrated around the pledge flow, with later worker/admin overlap. Signature rules are a small low-risk sub-slice. |
| Work prep and checklist flow | `.work-*`, `.check-*`, `.check-item-*`, `.category-*`, `.tool-*`, `.pictogram-*` | Large feature area with shared checklist/category/tool UI. Split after component boundaries are clearer. |
| Material issue flow | `.material-*`, `.material-kpi-*`, `.analytics-*` used near material screens | High selector count and broad span. Treat as feature slice, but do not move first because it overlaps analytics and final mobile rules. |
| Unsafe/photo flow | `.unsafe-*`, `.photo-*`, `.record-*` for unsafe records | Broad span and many stateful photo/upload selectors. Own as unsafe/reporting plus photo components. Move after browser coverage exists. |
| Push templates/devices | `.push-*`, `.push-template-*`, `.push-employee-*` | Dense and relatively isolated around the push-management UI. Good first feature extraction candidate. |
| Monthly worker analytics | `.monthly-*` | Dense, narrow selector family. Good first feature extraction candidate after dashboard analytics route is screenshot-covered. |
| Ship/process/item management | `.ship-*`, `.process-*`, `.item-*`, `.manage-*` | Management data screens. Several selectors also appear in late responsive rules. Own by ship data/admin management. |
| History, records, tables | `.history-*`, `.record-*`, `.table`, `.toast`, `.notice-*` | History and record screens plus table component rules. Split table component only after history/records visual checks are available. |
| Not found route | `.not-found-*` | Very small and isolated. Lowest-risk extraction if route can be rendered directly. |
| Final responsive layer | `@media (max-width: 920px)`, `@media (max-width: 420px)`, `@media (max-width: 360px)`, final mobile priority overrides | This is cascade-sensitive. Keep as last layer until all feature slices are stable. |

## Global / Layout / Components / Features / Utilities Candidates

### Global Base

Candidate selectors:

- `:root`
- `*`, `html`, `body`
- `button`, `input`, `select`, `textarea`, `a`, headings, labels
- global focus-visible rules
- `[hidden]`, `.sr-only`

Recommended file: `assets/css/00-tokens-base.css`

Risk: medium/high. These rules alter every screen. Move only after the stylesheet split mechanism is proven with low-risk feature slices.

### Layout Shell

Candidate selectors:

- `.app`
- `.sidebar-*`
- `.main`
- `.panel`
- `.screen-*`
- `.preview-*`
- `.mobile-header`
- `.bottom-nav`

Recommended file: `assets/css/10-layout-shell.css`

Risk: high on mobile. Layout and final responsive rules are interleaved, so shell extraction must preserve the final mobile override layer.

### Components

Candidate selectors:

- Buttons: `.btn`, `.btn-light`, `.btn-danger`, disabled button states
- Forms: `.field`, `.input`, `.select`, `.textarea`, labels
- Cards/panels: shared `.card`, `.panel`, `.empty`, `.notice-*`
- Tables: `.table`, `.table-wrap`
- Modal/overlay: `.modal-*`, `.push-template-overlay`, backdrop/panel patterns
- Badges/chips: `.badge`, `.sync-badge`, `.ship-chip`, status chips
- Toast/progress/loading: `.toast`, upload/progress panels, skeleton/spinner-like states

Recommended file: `assets/css/20-components.css`

Risk: medium. Move only components that are clearly shared and screenshot-covered. Avoid pulling feature-specific card variants into shared components too early.

### Feature Slices

Recommended feature files:

- `assets/css/features/login.css`: `.login-*`, `.brand-*`, login worker picker variants
- `assets/css/features/home-dashboard.css`: `.home-*`, `.ops-*`, `.ops-risk-*`
- `assets/css/features/pledge.css`: `.pledge-*`, `.signature-*`
- `assets/css/features/work-checklist.css`: `.work-*`, `.check-*`, `.check-item-*`
- `assets/css/features/materials.css`: `.material-*`, `.material-kpi-*`
- `assets/css/features/unsafe.css`: `.unsafe-*`, `.photo-*` when used only by unsafe reporting
- `assets/css/features/push.css`: `.push-*`, `.push-template-*`, push device/template UI
- `assets/css/features/monthly-worker.css`: `.monthly-*`
- `assets/css/features/ships-process.css`: `.ship-*`, `.process-*`, `.item-*`
- `assets/css/features/manage-admin.css`: `.manage-*`, `.admin-*`, `.worker-*` management rows
- `assets/css/features/history-records.css`: `.history-*`, `.record-*`, record timeline/card variants
- `assets/css/features/not-found.css`: `.not-found-*`

### Utilities and State

Candidate selectors:

- `.sr-only`
- `[hidden]`
- `.muted`, `.small`, `.empty`
- `.active`, `.disabled`, `.loading`, `.error`
- `.danger`, `.warning`, `.success`
- `.status-*`, `.risk-*`, `.tone-*`
- `.no-print` / print helpers if present

Recommended file: `assets/css/90-utilities-state.css`

Risk: medium. State classes often depend on component specificity. Move utility definitions late, but keep feature-owned state variants with their feature.

## Lowest Visual Regression Risk: Move First

Do these before any global/base/layout extraction:

1. `not-found` slice
   - Selectors: `.not-found-*`
   - Why first: tiny, isolated, direct route/screen ownership.
   - Keep in same cascade position through `@import` or equivalent.

2. `signature` sub-slice inside pledge
   - Selectors: `.signature-*`
   - Why early: narrow selector family and easy visual target.
   - Do not move broader `.pledge-*` yet.

3. `push-template` / push management slice
   - Selectors: `.push-template-*`, dense `.push-*` management selectors
   - Why early: strong prefix ownership and relatively compact selector cluster.
   - Keep `.push-employee-*` with login/session until ownership is clarified.

4. `monthly-worker` slice
   - Selectors: `.monthly-*`
   - Why early: dense and cohesive analytics/calendar selector family.
   - Needs desktop and mobile analytics screenshots.

5. `disabled-reason` helper slice
   - Selectors: `.disabled-reason-wrap*`
   - Why early: compact UI helper.
   - Treat as component utility, but verify tooltip/disabled button rendering.

6. `table` component slice
   - Selectors: `.table`, `.table th`, `.table td`, `.table-wrap`
   - Why later in first batch: compact, but used by history/records, so requires two screens checked.

Avoid moving these first:

- `:root`, global element rules, and form/button resets.
- `.app`, `.sidebar-*`, `.screen-*`, `.preview-*`, `.bottom-nav`.
- final mobile priority overrides.
- broad `.material-*`, `.unsafe-*`, `.pledge-*`, `.work-*`, `.ship-*` groups.

## Browser / Visual Checks Required After Each Slice

Every slice needs these baseline checks:

- Start the static app with `npm run serve`.
- Confirm stylesheet requests return 200 and load order is unchanged.
- Compare desktop viewport around `1366x768`.
- Compare mobile viewport around `390x844`.
- Confirm no horizontal overflow on mobile.
- Confirm focus-visible outlines still appear on keyboard navigation.

Slice-specific checks:

| Slice | Required browser/visual checks |
| --- | --- |
| `not-found` | Open an unknown route/path. Verify centered layout, primary action, sidebar/nav absence or expected shell behavior, desktop and mobile. |
| `signature` | Open pledge/signature flow. Verify empty signature placeholder, drawn/has-signature state, clear button, canvas sizing after mobile rotation/resize. |
| `push` | Open manage/admin push screens. Verify push template overlay/backdrop/panel, worker push device rows, subscription status badges, disabled/error states. |
| `monthly-worker` | Open analytics/monthly worker calendar. Verify calendar grid, heatmap cells, rest-day settings, compact mobile columns, long worker names. |
| `disabled-reason` | Verify disabled buttons in checklist/tool flows. Hover/focus tooltip on desktop, readable disabled reason on mobile, no clipping inside cards. |
| `table` | Open history table and admin/record table views. Verify headers, cell wrapping, horizontal scroll behavior, mobile card/table fallback if present. |
| `login` | Verify login screen, worker picker, sync badge states, push employee form, desktop and mobile. |
| `home-dashboard` | Verify dashboard KPIs, `.ops-risk-*` cards, home action rows, sync/offline/pending states, mobile top header. |
| `pledge` | Verify pledge checklist, worker/ship select states, completion screen, signature, admin-visible states. |
| `work-checklist` | Verify direct check section, category cards, pictograms, tool picker, checked/unchecked/disabled checklist rows. |
| `materials` | Verify material issue steps, KPI cards, quantity step, confirmation/completion screens, analytics cards that reuse material selectors. |
| `unsafe` | Verify unsafe report steps, photo picker, upload progress/pending retry panels, unsafe detail/record cards, completion screens. |
| `ships-process` | Verify ship list, sort/filter chips, process board lanes, expanded ship detail rows, item actions. |
| `manage-admin` | Verify worker manager rows/edit panel, admin board forms, unsafe/material/pledge managers, permission-gated controls. |
| `history-records` | Verify history cards, load-more, record filters, unsafe/material record cards, record timeline, toast/notice states. |
| `layout-shell` | Verify app shell, sidebar, main content, preview/mobile screen wrapper, bottom nav hide/show behavior, all breakpoints `920px`, `420px`, `360px`. |
| `base` | Full smoke pass across login, dashboard, check, materials, unsafe, history, manage, unknown route. Also verify form controls and keyboard focus states. |
| `responsive-overrides` | Mobile-first pass on every major route. Confirm final overrides remain last in cascade. |

## Recommended Migration Order

1. Add split mechanism without changing behavior: keep `styles-v2.css` as the manifest and import new files in exact cascade order, or add multiple links in `index.html` preserving order.
2. Extract `not-found`, `signature`, `push-template`, `monthly-worker`, `disabled-reason`, and `table` one slice at a time.
3. After each slice, run the matching browser/visual checks above before continuing.
4. Extract feature-owned files next: `login`, `home-dashboard`, `pledge`, `work-checklist`, `materials`, `unsafe`, `ships-process`, `manage-admin`, `history-records`.
5. Extract shared components only after at least two feature slices prove which rules are genuinely shared.
6. Extract layout shell and global base near the end.
7. Leave `99-responsive-overrides.css` last, and only split it after mobile screenshots are stable across all major routes.
