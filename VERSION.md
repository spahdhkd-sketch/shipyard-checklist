# Version

Current version: `0.8-20260527`

Recorded at: `2026-05-27 15:50:35 +09:00`

Baseline commit: `e6e694390b4def2f5709bb8e056f9a3eca6d86fc`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- This version switches browser worker reads to the `workers_public` view, keeps `workers.employee_no` out of browser sync/direct anon reads, and refreshes service-worker assets so production clients load the compatible runtime.
- Future maintenance should start from this GitHub source baseline.

Release version rule:
- When the user says "배포 하자" or makes an equivalent deployment request, increment the minor version by `0.1`.
- Use the real current date at release time in `YYYYMMDD` format.
- Record the version as `<minor-version>-<YYYYMMDD>`.
- Example: if the current version is `0.1-20260520` and the release date is 2026-05-21, record `0.2-20260521`.
- Update this file, commit the version change, create a matching git tag prefixed with `v`, and push both `main` and the tag.
- After deployment, verify the production alias: `https://gs-safety-checklist.vercel.app/`.
