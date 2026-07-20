# Version

Current version: `1.9-20260721`

Recorded at: `2026-07-21 (working icon controls and targeted pictogram saves)`

Baseline commit: `fb65c38`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
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
- Issues asset token `20260721-icon-controls-1` and service-worker version
  `1.9-20260721-icon-controls` so installed clients refresh safely.
