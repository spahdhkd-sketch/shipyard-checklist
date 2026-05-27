# Version

Current version: `0.7-20260527`

Recorded at: `2026-05-27 13:14:06 +09:00`

Baseline commit: `ae92a82b3c04f3118b60b8bc0b0f481169c2df22`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- This version preserves DB-driven unsafe push targets through local normalization, allows Supabase Realtime WebSocket connections in CSP, and refreshes deployment quality-harness baselines.
- Future maintenance should start from this GitHub source baseline.

Release version rule:
- When the user says "배포 하자" or makes an equivalent deployment request, increment the minor version by `0.1`.
- Use the real current date at release time in `YYYYMMDD` format.
- Record the version as `<minor-version>-<YYYYMMDD>`.
- Example: if the current version is `0.1-20260520` and the release date is 2026-05-21, record `0.2-20260521`.
- Update this file, commit the version change, create a matching git tag prefixed with `v`, and push both `main` and the tag.
- After deployment, verify the production alias: `https://gs-safety-checklist.vercel.app/`.
