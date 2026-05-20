# Version

Current version: `0.1-20260520`

Recorded at: `2026-05-20 12:18:45 +09:00`

Baseline commit: `0871874cbf0862ec94dded89c552cec8bc37ef40`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- This version marks the restored production checklist baseline.
- Future maintenance should start from this GitHub source baseline.

Release version rule:
- When the user says "배포 하자" or makes an equivalent deployment request, increment the minor version by `0.1`.
- Use the real current date at release time in `YYYYMMDD` format.
- Record the version as `<minor-version>-<YYYYMMDD>`.
- Example: if the current version is `0.1-20260520` and the release date is 2026-05-21, record `0.2-20260521`.
- Update this file, commit the version change, create a matching git tag prefixed with `v`, and push both `main` and the tag.
- After deployment, verify the production alias: `https://gs-safety-checklist.vercel.app/`.
