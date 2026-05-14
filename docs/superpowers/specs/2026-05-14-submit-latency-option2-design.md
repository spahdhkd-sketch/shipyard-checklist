# Submit Latency Optimization - Option 2 Design

## Goal

Reduce the perceived delay after pressing the submit button while keeping server persistence stable enough for field use.

The chosen direction is option 2: save only inspection history data to Supabase before navigating to the history screen.

## Current Problem

The current submit flow calls the general sync path. That path attempts to upsert every remote table:

- categories
- sections
- checklist items
- tools
- pictograms
- ships
- inspections
- inspection items

For a checklist submission, only two tables must be written immediately:

- `safety_inspections`
- `safety_inspection_items`

Waiting for all tables makes submit slower than necessary.

## Selected Behavior

When the worker presses the submit button:

1. Validate worker name, ship number, checklist items, and high-risk checks.
2. Create the inspection record and inspection item records in memory.
3. Save the new records to `localStorage`.
4. Upsert only `safety_inspections` and `safety_inspection_items` to Supabase.
5. After those two writes succeed, navigate to `history.html`.
6. If the two-table server write fails, stay on a local history view and show a sync failure message while keeping the local record.

## Submit Button Placement

Move the submit button in checklist pages to the bottom of the checklist flow.

Current placement is near the worker and ship fields at the top of the checklist page. On mobile, this can make the submit action feel detached from the actual checklist work, and the worker may need to scroll back upward after checking items.

New placement:

1. Keep worker name and ship number inputs at the top.
2. Render all checklist sections and checklist items next.
3. Place the submit button after the last checklist section.
4. Keep the same validation rules and disabled state.
5. Keep the status summary panel if it remains useful, but the primary submit action should be at the end of the checklist, not in the top form row.

This is a layout-only change. It must not alter the data saved to Supabase or localStorage.

## Expected Latency

Measured against the deployed app with one inspection and 14 inspection items:

- Average visible wait: about 189 ms
- Median visible wait: about 189 ms
- Fastest observed: 175 ms
- Slowest observed: 210 ms

This is slower than optimistic background sync, but it confirms the important inspection data is on the server before the user leaves the submit flow.

## Data Flow

Use a dedicated submit sync helper instead of the broad `persistAndSync()` path.

Suggested helper:

```js
async function syncInspectionHistory(inspection, inspectionItems) {
  // upsert safety_inspections
  // upsert safety_inspection_items
  // return true/false
}
```

The helper should reuse the existing `REMOTE_TABLES` mapping for conversion where possible, so field names stay consistent with the current Supabase schema.

## Error Handling

If Supabase is unavailable or the request fails:

- Keep the submitted record in `localStorage`.
- Render the history view locally.
- Show a clear toast that says the inspection was saved locally but server sync failed.
- Keep sync status in the error state.

This preserves the worker's record and prevents the previous bug where navigation caused the new record to disappear.

## Scope

In scope:

- Change only the checklist submit path.
- Add a focused helper for inspection history sync.
- Move the checklist submit button to the bottom of the checklist page.
- Keep all existing broad sync behavior for admin edits, ship changes, tool changes, item changes, and resets.
- Extend smoke/benchmark coverage so a submitted inspection appears in history after submit.

Out of scope:

- Offline retry queue.
- Full conflict resolution.
- Schema changes.
- UI redesign.

## Verification

Run:

```powershell
node --check assets\js\app.js
node tools\browser-smoke.mjs "C:\Program Files\Google\Chrome\Application\chrome.exe" http://127.0.0.1:4173
```

Also perform one real submit-flow verification on the deployed URL after deployment, then delete the test inspection rows from Supabase.
