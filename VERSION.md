# Version

Current version: `1.4-20260609`

Recorded at: `2026-06-09 00:27:00 +09:00`

Baseline commit: `1120efb`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- This version makes 작업지시서 deletion server-persistent with a `deleted_at` tombstone instead of physical row deletion.
- It hides soft-deleted work-prep records from public reads and blocks stale public updates from reviving them.
- It updates the Supabase admin mutation boundary so 작업지시서 delete writes `deleted_at` while other admin deletes keep their existing behavior.
- It keeps local tombstone filtering as a client-side backup and adds regression coverage for the soft-delete path.
- Future maintenance should start from this GitHub source baseline.

Release version rule:
- When the user says "배포 하자" or makes an equivalent deployment request, increment the minor version by `0.1`.
- Use the real current date at release time in `YYYYMMDD` format.
- Record the version as `<minor-version>-<YYYYMMDD>`.
- Example: if the current version is `0.1-20260520` and the release date is 2026-05-21, record `0.2-20260521`.
- Update this file, commit the version change, create a matching git tag prefixed with `v`, and push both `main` and the tag.
- After deployment, verify the production alias: `https://gs-safety-checklist.vercel.app/`.
