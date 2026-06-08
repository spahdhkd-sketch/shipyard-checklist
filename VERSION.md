# Version

Current version: `1.3-20260609`

Recorded at: `2026-06-09 00:00:00 +09:00`

Baseline commit: `74d9ab7`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- This version fixes 작업지시서 deletion persistence so deleted records do not reappear after remote refresh.
- It records deleted work-prep IDs locally, removes matching pending sync upserts, and filters deleted IDs from pulled remote rows.
- It adds a scoped Supabase work-prep mutation session so 조장/관리 작업지시서 writes can be authorized without granting full admin mutation scope.
- It keeps 작업지시서 delete/upsert through the Supabase admin mutation boundary and adds regression coverage for the deletion path.
- Future maintenance should start from this GitHub source baseline.

Release version rule:
- When the user says "배포 하자" or makes an equivalent deployment request, increment the minor version by `0.1`.
- Use the real current date at release time in `YYYYMMDD` format.
- Record the version as `<minor-version>-<YYYYMMDD>`.
- Example: if the current version is `0.1-20260520` and the release date is 2026-05-21, record `0.2-20260521`.
- Update this file, commit the version change, create a matching git tag prefixed with `v`, and push both `main` and the tag.
- After deployment, verify the production alias: `https://gs-safety-checklist.vercel.app/`.
