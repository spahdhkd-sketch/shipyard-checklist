# Project Memory

## 2026-05-27 Lesson: Fast Mode Must Split Hotfix From Hardening

When the user asks for fast mode, do not let the work silently expand into a full safety-hardening/review/deployment pipeline.

The 2026-05-27 v0.8 worker employee-number isolation work succeeded safely, but it took too long for fast mode. The main mistake was not calling out early that the scope had grown beyond fast mode.

Use this rule next time:

1. In the first 10 minutes, identify the smallest production-safety hotfix path.
2. For urgent production compatibility, ship the minimal fix first.
3. Limit fast-mode verification to `npm.cmd run verify` plus the smallest live probe that proves production is not broken.
4. Move migration-ledger cleanup, broad documentation, subagent reviews, and longer Supabase advisor work into a second phase unless they are immediate blockers.
5. If the work passes 20-30 minutes, stop and report a choice: continue deep hardening or deploy the minimal hotfix now.

Default fast-mode lane:

- Phase 1: production hotfix, version/cache bump if needed, deploy, live probe.
- Phase 2: review, docs, migration hygiene, advisor cleanup, follow-up security model.

Do not repeat the 2026-05-27 pattern of doing everything in one long run without explicitly switching out of fast mode.
