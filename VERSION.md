# Version

Current version: `1.1-20260609`

Recorded at: `2026-06-09 01:05:00 +09:00`

Baseline commit: `c929f31`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- This version removes the 20-row remote fetch cap from 작업지시서 관리 so the full work-prep list can load.
- It keeps the server-side deletion tombstone protections from the previous build, but the visible symptom was the fetch cap rather than failed deletion.
- It downgrades the displayed release line to `1.1-20260609` as requested while issuing a fresh asset token to avoid stale browser cache.
- Future maintenance should start from this GitHub source baseline.

Release version rule:
- When the user says "배포 하자" or makes an equivalent deployment request, increment the minor version by `0.1`.
- Use the real current date at release time in `YYYYMMDD` format.
- Record the version as `<minor-version>-<YYYYMMDD>`.
- Example: if the current version is `0.1-20260520` and the release date is 2026-05-21, record `0.2-20260521`.
- Update this file, commit the version change, create a matching git tag prefixed with `v`, and push both `main` and the tag.
- After deployment, verify the production alias: `https://gs-safety-checklist.vercel.app/`.
