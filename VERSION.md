# Version

Current version: `1.6-20260715`

Recorded at: `2026-07-15 (sync safety, authenticated writes, private issue photos, and tool registration reliability)`

Baseline commit: `1cce226`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- Preserves pending offline records across application updates and binds retries to the originating worker.
- Routes worker submissions through authenticated Edge Functions and validates inspection data against server master records.
- Stores issue photos privately with short-lived signed URLs and guarded two-slot upload reservations.
- Retries missing-material notifications only after durable record persistence.
- Fixes common-tool registration for the database empty-category contract and prevents duplicate clicks or failed-save form resets.
- Issues asset token `20260715-security-sync-1` and service-worker version
  `1.6-20260715-security-sync` so installed clients refresh safely.
