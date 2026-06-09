# Version

Current version: `1.2-20260610`

Recorded at: `2026-06-10 02:01:28 +09:00`

Baseline commit: `cfe3d4b`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- This version removes the dedicated 권한 tab and keeps worker permission edits inside 관리 > 작업자.
- Timeline history entries now use the logged-in worker or manager name instead of the generic 관리자 label.
- Work-prep start actions are locked until the work date 07:00, with the disabled-button guidance "작업당일 07:00부터 점검 시작 가능합니다".
- It issues a fresh asset token and service-worker version so browsers pick up the 2026-06-10 release.

Release version rule:
- When the user says "배포 하자" or makes an equivalent deployment request, increment the minor version by `0.1`.
- Use the real current date at release time in `YYYYMMDD` format.
- Record the version as `<minor-version>-<YYYYMMDD>`.
- Example: if the current version is `0.1-20260520` and the release date is 2026-05-21, record `0.2-20260521`.
- Update this file, commit the version change, create a matching git tag prefixed with `v`, and push both `main` and the tag.
- After deployment, verify the production alias: `https://gs-safety-checklist.vercel.app/`.
