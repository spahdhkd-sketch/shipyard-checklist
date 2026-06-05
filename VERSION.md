# Version

Current version: `1.0-20260529`

Recorded at: `2026-05-29 13:00:45 +09:00`

Baseline commit: `99e363e`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- This version updates work-prep participant selection so 선행/후행 조장 flows only show the counterpart production team and exclude 관리 from 타 소속 작업자.
- It adds 반장 as a 조장-equivalent role, while displaying 백승기 as 반장.
- It prevents completed participants from starting the same work-prep inspection again and shows 제출 완료 instead.
- It adds inline 미점검 인원/전원 점검 완료 status text to work order cards.
- Future maintenance should start from this GitHub source baseline.

Release version rule:
- When the user says "배포 하자" or makes an equivalent deployment request, increment the minor version by `0.1`.
- Use the real current date at release time in `YYYYMMDD` format.
- Record the version as `<minor-version>-<YYYYMMDD>`.
- Example: if the current version is `0.1-20260520` and the release date is 2026-05-21, record `0.2-20260521`.
- Update this file, commit the version change, create a matching git tag prefixed with `v`, and push both `main` and the tag.
- After deployment, verify the production alias: `https://gs-safety-checklist.vercel.app/`.
