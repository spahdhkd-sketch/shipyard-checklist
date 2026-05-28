# Version

Current version: `0.9-20260528`

Recorded at: `2026-05-28 18:24:54 +09:00`

Baseline commit: `99e363e`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- This version reduces Supabase egress by narrowing browser selects, limiting startup pulls, lazy-loading detail rows/photos, disabling automatic realtime/polling startup, compressing uploaded issue photos, and adding an operations checklist.
- It fixes work-prep draft leakage so a newly created work order does not inherit the previous work order's selected workers.
- It fixes pledge signature clearing so the current signature pad can be cleared without deleting the worker's reusable same-day signature cache.
- It tightens pictogram/admin mutation and issue-photo storage boundaries.
- Future maintenance should start from this GitHub source baseline.

Release version rule:
- When the user says "배포 하자" or makes an equivalent deployment request, increment the minor version by `0.1`.
- Use the real current date at release time in `YYYYMMDD` format.
- Record the version as `<minor-version>-<YYYYMMDD>`.
- Example: if the current version is `0.1-20260520` and the release date is 2026-05-21, record `0.2-20260521`.
- Update this file, commit the version change, create a matching git tag prefixed with `v`, and push both `main` and the tag.
- After deployment, verify the production alias: `https://gs-safety-checklist.vercel.app/`.
