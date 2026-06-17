# Version

Current version: `1.4-20260618`

Recorded at: `2026-06-18 (timeline redesign + auto-update release)`

Baseline commit: `7e5140a`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- Work-prep timeline redesigned around register / start / complete milestones with
  per-actor lists (worker ids); legacy entries normalize losslessly. Start-actor
  lists union-merge across devices on remote pull (multi-device safe).
- New app version auto-reloads controlled clients (service worker controllerchange)
  so phones pick up releases without a manual hard refresh.
- Remote merge adopts the server record on timestamp ties for deterministic convergence.
- Earlier in this cycle: extracted inspection-rules / normalization-rules /
  state-shape-rules / work-prep-timeline-rules modules from app-v2; hardened deploy-prod.bat.
- Issues a fresh asset token (`20260618-timeline-sync-1`) and service-worker version
  (`1.4-20260618-timeline-sync`) so browsers pick up the release.

Release version rule:
- When the user says "배포 하자" or makes an equivalent deployment request, increment the minor version by `0.1`.
- Use the real current date at release time in `YYYYMMDD` format.
- Record the version as `<minor-version>-<YYYYMMDD>`.
- Update this file, commit the version change, create a matching git tag prefixed with `v`, and push both `main` and the tag.
- After deployment, verify the production alias: `https://gs-safety-checklist.vercel.app/`.
