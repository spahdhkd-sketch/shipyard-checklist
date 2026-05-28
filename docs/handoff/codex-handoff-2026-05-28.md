# Codex Handoff - GS Safety Checklist - 2026-05-28

Read the root handoff first:

```txt
codex-handoff-2026-05-28.md
```

This copy exists so future agents browsing `docs/handoff/` can find the current deployment handoff.

Current release:

- Branch: `codex/safety-pictograms-handoff-20260528`
- Tag: `v0.9-20260528`
- Production: `https://gs-safety-checklist.vercel.app`
- App version: `0.9-20260528`
- Asset token: `20260528-egress-signature-1`
- Service worker cache: `gs-safety-20260528-egress-signature-1`

Resume commands:

```powershell
git clone https://github.com/spahdhkd-sketch/shipyard-checklist.git
cd shipyard-checklist
git fetch origin --tags
git checkout codex/safety-pictograms-handoff-20260528
git pull
Get-Content .\codex-handoff-2026-05-28.md
npm.cmd run verify
```

Summary:

- Supabase egress was reduced by narrowing select columns, limiting startup pulls, lazy-loading detail/photo data, stopping automatic realtime/polling startup, and compressing uploaded photos.
- Work-prep worker leakage was fixed so new work orders do not inherit previous selected workers.
- Pledge signature clearing was fixed while preserving same-day reusable worker signatures.
- Vercel production deployment is complete and verified.
- Supabase Storage policy SQL was applied manually after removing only the optional `comment on policy` statement.

For full details, use the root handoff file.
