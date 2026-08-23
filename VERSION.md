# Version

Current version: `1.12.4-20260814`

Recorded at: `2026-08-14 (Section editor safety release)`

Baseline commit: `this release commit`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
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
- Uses `20260818-fix-1` to refresh PWA assets after deployment.
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
- Issues asset token `20260818-fix-1` and service-worker version
  `1.12.4-20260814-editor-safety` so installed clients refresh safely.
