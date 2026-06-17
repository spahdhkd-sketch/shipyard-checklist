# Version

Current version: `1.3-20260618`

Recorded at: `2026-06-18 (stats/pledge/range-fetch release)`

Baseline commit: `70fdcdd`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- Monthly worker inspection stats now count only days with an assigned work-prep (work-free days and weekends are excluded).
- Pledge manager screen can browse past pledge data by date (read-only for past dates; no missing-pledge alert).
- Statistics and pledge screens range-fetch inspection history from Supabase into a read-only cache, independent of the 20-row history limit and without conflicting with pullRemote's authoritative replacement.
- Issues a fresh asset token (`20260618-stats-pledge-1`) and service-worker version (`1.3-20260618-stats-pledge`) so browsers pick up the release.

Release version rule:
- When the user says "배포 하자" or makes an equivalent deployment request, increment the minor version by `0.1`.
- Use the real current date at release time in `YYYYMMDD` format.
- Record the version as `<minor-version>-<YYYYMMDD>`.
- Example: if the current version is `0.1-20260520` and the release date is 2026-05-21, record `0.2-20260521`.
- Update this file, commit the version change, create a matching git tag prefixed with `v`, and push both `main` and the tag.
- After deployment, verify the production alias: `https://gs-safety-checklist.vercel.app/`.
