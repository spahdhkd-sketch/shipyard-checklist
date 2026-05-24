# Claude Cowork Quality Review Prompt

## Role

You are a senior quality reviewer for the GS Safety Checklist static web app. Review the repository at the deployed baseline below and report defects, risky assumptions, missing tests, security problems, and maintainability issues. Prioritize concrete findings with file and line references.

## Baseline

- Repository: `https://github.com/spahdhkd-sketch/shipyard-checklist.git`
- Branch: `main`
- Deployed baseline commit: `0f56e64`
- Production alias: `https://gs-safety-checklist.vercel.app`
- Last deployment target observed: `https://index-html-82lyh9equ-spahdhkd-3161s-projects.vercel.app`
- App version must remain: `0.4-20260523`
- Active Supabase project ref: `yuuroocvxvzgmsdeeiws`
- Do not print or copy the full Supabase anon key in your response.

## Context

This is a static Vercel app backed by Supabase. The current production code uses:

- `assets/js/app-v2.js`
- `assets/css/styles-v2.css`
- `assets/js/checklist-rules.js`
- `assets/js/issue-material-rules.js`
- `sw.js`
- Supabase Edge Function: `worker-push`
- Supabase migration: `supabase/migrations/202605240001_worker_push_subscriptions.sql`

Recent changes to include in review:

- Browser push subscription flow for workers.
- Push notifications for pledge pending workers.
- Unsafe issue push notifications for `허지원`, `김준혁`, `김경제`.
- Editable push notification templates for pledge pending and unsafe issue messages.
- Test push button disabled after `2026-05-26 11:59 KST`.
- Cleanup of legacy static artifacts and unused shipyard illustration PNG assets.

## Required Harness

Run this from the repository root:

```powershell
node tools/claude-quality-harness.mjs --expected-commit=0f56e64 --live
```

If network access is unavailable, run:

```powershell
node tools/claude-quality-harness.mjs --expected-commit=0f56e64
```

Also run:

```powershell
npm.cmd run verify
```

Treat any harness or verify failure as a P0/P1 review finding.

## Review Focus

1. Push notification correctness:
   - Targeting rules for pledge pending workers and unsafe issue target workers.
   - Browser subscription registration state and worker identity handling.
   - Template editing persistence and token replacement behavior.
   - Service worker push and notification click behavior.

2. Supabase integration:
   - Client-side data sync and remote-authoritative tables.
   - Edge Function invocation payloads.
   - RLS/RPC assumptions around worker push subscriptions.
   - Avoid exposing secrets in docs, prompts, logs, or generated outputs.

3. Static app recovery and deployment safety:
   - Cache busting and service worker cache name consistency.
   - Deleted legacy files are not referenced.
   - Production alias serves the same asset family as the repository.

4. UI and workflow quality:
   - Korean worker/admin flows.
   - Mobile and desktop push controls.
   - Pledge page and unsafe issue management page button placement.
   - Failure toasts and disabled states.

5. Test coverage:
   - Static tests in `tests/static-recovery.test.js`.
   - Rule tests in `tests/checklist-rules.test.js` and `tests/issue-material-rules.test.js`.
   - Gaps where browser behavior or Supabase behavior is only manually verified.

## Output Format

Return findings first, ordered by severity:

- `P0`: production-breaking or data/security loss risk.
- `P1`: likely user-visible defect or incorrect notification/data behavior.
- `P2`: maintainability, test gap, or edge-case concern.

For each finding include:

- Title
- Severity
- File and line reference
- Why it matters
- Reproduction or reasoning
- Suggested fix

Then include:

- Harness summary
- Remaining risks
- Suggested next tests

Do not include the full Supabase anon key.
