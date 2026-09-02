# Version

Current version: `1.14.5-20260902`

Recorded at: `2026-09-02 (v1.14.5 work-order map classification release candidate)`

Baseline commit: `working tree based on 4f9fd5276eed3b4ece07b2c6e4ba3a4b5c94ef94`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- Adds `place_id` to work orders (`work_prep_records`) only; worker master records do not receive a place field.
- Adds the administrator-only `현장 사전 답사 완료` checkbox backed by `work_prep_records.site_survey_done`, defaulting existing and new unchecked work orders to `false`; an unchecked value shows the inline issuance warning and keeps the issue action disabled.
- Requires administrators to select a registered dock or quay and confirm the site survey before issuing a work order, with the same boundary enforced by the admin Edge Function.
- Shows the saved place and site-survey state in administrator work-order cards/details and in the linked work-order card inside inspection history.
- Limits the new work-order place selector and map classification details to administrator surfaces while preserving the existing worker screens and non-admin work-order flow.
- Adds work-type triple-inspection/non-routine flags and the worker foreign classification used by red and yellow control-map states.
- Aligns red, yellow, and green operational badges with the control-map legend palette and preserves the same classification after data reloads.
- Issues asset token `20260902-v2-1` and service-worker version `1.14.5-20260902-v1` so installed clients refresh the complete release safely.
- Reflows dashboard KPI cards and primary-work shortcuts into 2 x 2 grids at viewport widths up to 1100px, including the legacy 920px PC preview canvas.
- Keeps Korean operational labels together and prevents danger/caution values and units from colliding inside narrow cards.
- Replaces the administrator home summary with a KPI-first `안전 운영 대시보드` backed by the existing work-order, pre-work check, and recent safety-signal records.
- Keeps records without a matched control-map location visible as `장소 미지정`, and marks the risk-assessment execution rate unavailable until a reliable event and denominator exist.
- Adds a top-left control-map legend for red danger, yellow caution, and green normal pins while preserving existing quick actions and map interactions.
- Renders all 21 control-map banners with dock or quay names only; internal A-U aliases remain available for place-ID matching but are no longer shown on the map or detail panel.
- Opens a dedicated desktop control-map presentation window, prefers another monitor when the browser exposes screen details, and keeps a visible close action.
- Reflects pin and source-map edits immediately across open same-browser tabs through BroadcastChannel, localStorage, and the shared IndexedDB map asset.
- Continues to reflect work-order and status changes across connected devices through the existing Supabase Realtime record flow without adding a new database schema.
- Fits the full 4096 x 3072 map canvas inside desktop and mobile viewports, with touch pan and zoom on one continuous mobile surface.
- Matches work orders by place ID, lets administrators reposition zone banners and their leader-line anchor points with browser-local persistence, and exports both coordinates in PNG and JSON outputs.
- Shows the control map as the first administrator dashboard row above the 2 x 2 KPI grid while keeping it hidden from preceding and following workers.
- Routes the home intake action to the newest record across unsafe-factor and missing-material categories, opening that exact detail.
- Renames Quick Menu to `표준작업지도서/위험성평가 관리` and removes its duplicate visible heading while preserving an accessible page title.
- Adds explicit preview-and-merge flows for browser-only risk-assessment Excel results and existing work types, preserving current sections and skipping duplicate checklist text.
- Preserves the mobile Management Center master-menu and focused detail flow for reliable menu access at 360–430 px.
- Removes the Management Work Orders new-registration action and deploys the dedicated authenticated status mutation for all five work-order states.
- Defaults the Management Work Orders filter to all ships and persists status changes without showing a false synchronization failure.
- Keeps desktop route navigation active on Ships, Pledge, Analytics, and Management while preserving the existing mobile parent-group activation.
- Removes duplicate Management shortcut cards and reorganizes Work Orders, History, Ships, Materials, and Analytics for readable 360–430 px mobile layouts.
- Removes the two Home-only informational banners without changing synchronization, error handling, or Management entry paths.
- Presents the registered work-order destructive action as `삭제` in buttons, accessibility labels, confirmation copy, permission errors, and completion feedback while retaining the authenticated soft-delete boundary.
- Routes registered work-order cards through the authenticated soft-delete archive action so administrators can remove them from the active list.
- Defers operational record sync until a worker session exists while retaining the public master-data reads required for sign-in.
- Adds hermetic browser coverage for work-order archive removal, local deletion tombstones, and card disappearance.
- Replaces the primary Home, Work Preparation, Safety Pledge, Analytics, Management, Ships, History, Quick Menu, issue, material, login, and completion surfaces with the approved v4 responsive operations design.
- Keeps mobile KPI summaries in a 2×2 layout and uses list-to-full-screen detail flows at 360, 390, and 430 px.
- Makes mobile detail routes browser-history-aware and restores the originating list focus when the in-app return control is used.
- Routes the Home work-order shortcut to Management and renders Work Orders with the approved mobile full-screen detail and list-return control.
- Preserves every in-progress section editor field across realtime pulls and other background re-renders.
- Warns before discarding unsaved section changes and before reloading or closing the page.
- Keeps the editor open, restores the previous section, and prevents duplicate actions when a remote save fails or is still running.
- Derives the PWA E2E asset token from `sw.js` so release-token checks cannot drift from the deployed service worker.
- Replaces inline section-score and sign-image handlers with CSP-compatible delegated events.
- Uses a context-neutral empty-checklist message for both work-order and direct inspection flows.
- Hides checklist sections when all of their items are excluded by the work-order supply selection.
- Shows one page-level notice instead of rendering empty section titles with `0/0` counts.
- Opens section editing directly below the selected section row without leaving the work-type manager.
- Preserves danger-sign image proportions in the selection preview.
- Places item save, cancel, and delete actions on a compact horizontal row and removes oversized item-card whitespace.
- Uses `20260829-v4-1` to refresh PWA assets after deployment.
- Keeps the entire site on the light theme regardless of the device color-scheme preference.
- Replaces stacked work-type cards with a searchable desktop master-detail layout and a mobile list-to-detail flow.
- Separates basic information, tool assignments, and section/item administration into focused tabs.
- Adds staged copying of another work type's active tool assignments; changes apply only after explicit save.
- Expands one section and one item editor at a time to reduce form density and scrolling.
- Starts a constrained Realtime channel for inspections, work preparation, unsafe issues, missing materials, and ships.
- Applies INSERT/UPDATE/DELETE events directly and falls back to cursor-based polling after channel failures.
- Reconnects after tab wake and performs a cursor-based gap pull before continuing live updates.
- Forces service-worker update checks past HTTP caches and reloads existing controlled tabs once after activation.
- Reflects a completed inspection in local history and the home dashboard immediately after submission.
- Shows `서버 반영 중`, `서버 반영 완료`, or `서버 재전송 대기` on the completion screen.
- Keeps server synchronization running after the worker leaves the completion screen.
- Hides the fixed mobile navigation on the completion screen so its confirmation actions remain usable.
- Adds a prominent `선택한 아이콘 적용` action directly below the work-type icon picker.
- Separates custom pictogram `이름 저장` from work-type icon application and reports distinct completion messages.
- Browser coverage verifies select, apply, persisted category icon, and completion feedback in one flow.
- Saves only the selected active custom pictogram so deleted rows cannot make icon management fail with 404.
- Excludes deleted pictograms from every generic synchronization path.
- Applies the active DCP pictogram to the DRY POWDER category and canonicalizes legacy icon aliases.
- Rejects unknown category icon identifiers at the server boundary.
- Makes custom pictogram upload metadata-safe and custom pictogram deletion transactional with category fallback.
- Records category icon changes with timestamp and administrator identity.
- Rolls the category editor back when a remote save fails instead of leaving an unsaved icon on screen.
- Adds administrator-only new-employee registration with an initial employee number so new workers can sign in immediately.
- Keeps the initial employee number inside the authenticated Edge Function and excludes it from browser worker state and public worker reads.
- Rejects duplicate normalized employee numbers at the database boundary.
- Preserves pending offline records across application updates and binds retries to the originating worker.
- Routes worker submissions through authenticated Edge Functions and validates inspection data against server master records.
- Stores issue photos privately with short-lived signed URLs and guarded two-slot upload reservations.
- Retries missing-material notifications only after durable record persistence.
- Fixes common-tool registration for the database empty-category contract and prevents duplicate clicks or failed-save form resets.
- Issues asset token `20260829-v8-1` and service-worker version
  `1.14.3-20260829-v1` so installed clients refresh safely.
