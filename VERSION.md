# Version

Current version: `1.5-20260703`

Recorded at: `2026-07-03 (risk assessment checklist + safety signs release)`

Baseline commit: `dc3376c`

Production alias: `https://gs-safety-checklist.vercel.app/`

Notes:
- Checklist content replaced with 7 risk-assessment work standards (108 hazards / 145 items)
  seeded into safety_categories/sections/items; legacy content backed up locally.
- Check screen section cards redesigned: master checkbox, centered safety sign (48 sign assets),
  risk score + grade badges, accent-bar title, boxed items.
- Admin section editor now edits sign code (with preview), frequency, severity; total auto-computed.
- admin-mutations Edge Function v10 whitelists sign_code/frequency/severity/total_score.
- Issues a fresh asset token (`20260703-risk-signs-1`) and service-worker version
  (`1.5-20260703-risk-signs`) so installed clients auto-update.
