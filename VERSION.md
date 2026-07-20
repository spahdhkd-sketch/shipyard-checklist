# Version

Current version: `1.7-20260721`

Recorded at: `2026-07-21 (secure new-employee onboarding and login readiness)`

Baseline commit: `1cce226`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- Adds administrator-only new-employee registration with an initial employee number so new workers can sign in immediately.
- Keeps the initial employee number inside the authenticated Edge Function and excludes it from browser worker state and public worker reads.
- Rejects duplicate normalized employee numbers at the database boundary.
- Preserves pending offline records across application updates and binds retries to the originating worker.
- Routes worker submissions through authenticated Edge Functions and validates inspection data against server master records.
- Stores issue photos privately with short-lived signed URLs and guarded two-slot upload reservations.
- Retries missing-material notifications only after durable record persistence.
- Fixes common-tool registration for the database empty-category contract and prevents duplicate clicks or failed-save form resets.
- Issues asset token `20260721-worker-onboarding-1` and service-worker version
  `1.7-20260721-worker-onboarding` so installed clients refresh safely.
