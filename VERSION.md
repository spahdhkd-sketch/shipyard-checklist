# Version

Current version: `1.2-20260608`

Recorded at: `2026-06-08 23:54:57 +09:00`

Baseline commit: `3de9c83`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- This version adds 작업지시서 관리 to the 관리 menu and stores/deletes work-prep records through the Supabase admin mutation boundary.
- It makes 작업지시서 filters functional, renames the completion filter to `완료`, and opens selected work orders in an inline detail drawer below the list row.
- It refines 작업지시서, 불안전요소, and 자재누락 inline detail drawers with clearer spacing and visual hierarchy.
- It prevents duplicate 처리 이력 synthesis for 불안전요소/자재누락 records and removes duplicate active-row processing controls.
- It adds regression coverage for work-prep admin management, filters, deletion, and processing history de-duplication.
- Future maintenance should start from this GitHub source baseline.

Release version rule:
- When the user says "배포 하자" or makes an equivalent deployment request, increment the minor version by `0.1`.
- Use the real current date at release time in `YYYYMMDD` format.
- Record the version as `<minor-version>-<YYYYMMDD>`.
- Example: if the current version is `0.1-20260520` and the release date is 2026-05-21, record `0.2-20260521`.
- Update this file, commit the version change, create a matching git tag prefixed with `v`, and push both `main` and the tag.
- After deployment, verify the production alias: `https://gs-safety-checklist.vercel.app/`.
