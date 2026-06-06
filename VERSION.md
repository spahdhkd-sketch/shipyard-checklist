# Version

Current version: `1.1-20260606`

Recorded at: `2026-06-06 21:27:11 +09:00`

Baseline commit: `bdb712d`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- This version redesigns mobile 점검이력 rows with a compact one-row card, stage-colored status, larger category icon treatment, and a tighter worker/status area.
- It fixes 작업 전 점검 작업지시서 visibility for upcoming workdays, adds date navigation, and allows mistaken work orders to be deleted before inspection starts.
- It adds 자재누락 상세보기 panels in 관리 메뉴 and opens the detail view by clicking the row/card content, matching 불안전요소 behavior.
- It adds regression coverage for work-prep visibility, work-order deletion, history row rendering, and material detail rendering.
- Future maintenance should start from this GitHub source baseline.

Release version rule:
- When the user says "배포 하자" or makes an equivalent deployment request, increment the minor version by `0.1`.
- Use the real current date at release time in `YYYYMMDD` format.
- Record the version as `<minor-version>-<YYYYMMDD>`.
- Example: if the current version is `0.1-20260520` and the release date is 2026-05-21, record `0.2-20260521`.
- Update this file, commit the version change, create a matching git tag prefixed with `v`, and push both `main` and the tag.
- After deployment, verify the production alias: `https://gs-safety-checklist.vercel.app/`.
