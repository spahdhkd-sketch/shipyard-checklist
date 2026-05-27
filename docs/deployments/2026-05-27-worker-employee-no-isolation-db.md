# 2026-05-27 Worker Employee Number Isolation DB Change

## Scope

Applied the Phase 1 Supabase database hardening for worker employee number isolation and direct worker deletion blocking.

This was a database-only change. Vercel production has not been deployed for the matching frontend changes yet.

## Applied Migration

- Supabase project ref: `yuuroocvxvzgmsdeeiws`
- `20260527064035` / `worker_public_read_path`
  - Tracked SQL file: `supabase/migrations/20260527064035_worker_public_read_path.sql`
- `20260527071140` / `revoke_workers_delete`
  - Tracked SQL file: `supabase/migrations/20260527071140_revoke_workers_delete.sql`
- `20260527071213` / `enable_realtime_remote_tables`
  - Tracked SQL file: `supabase/migrations/20260527071213_enable_realtime_remote_tables.sql`

The local migration folder was also reconciled to include earlier remote ledger versions:

- `20260522004013_create_issue_photos_bucket.sql`
- `20260522004144_tighten_issue_photos_storage_policies.sql`
- `20260522082035_add_worker_position.sql`
- `20260523181216_worker_push_subscriptions.sql`

## Verification

Postgres privilege checks:

- `anon` can select `public.workers_public`: true
- `anon` can select `public.workers.employee_no`: false
- `anon` can insert `public.workers.employee_no`: false
- `anon` can update `public.workers.employee_no`: false
- `anon` can delete `public.workers`: false
- `authenticated` can delete `public.workers`: false
- `public.workers` delete policy exists: false
- `anon` can execute `public.verify_worker_login(text,text)`: true

`public.workers_public` columns:

- `id`
- `name`
- `team`
- `position`
- `active`
- `unsafe_push_target`
- `created_at`
- `updated_at`

REST probe with the public client:

- `workers_public` approved fields returned HTTP 200.
- Direct `workers.employee_no` read returned HTTP 401.
- No secret values were printed by the probe.

## Advisor Notes

Supabase advisors still report pre-existing broad RLS policies on several public tables. This Phase 1 change intentionally only isolates `workers.employee_no`; broader RLS tightening remains a later security phase.

Relevant remaining warnings include:

- Public `SECURITY DEFINER` execution warnings for `verify_worker_login` and `worker_push_subscription_status`.
- Broad `USING true` / `WITH CHECK true` warnings for operational tables such as safety records, issue/material records, and worker management.
- `worker_push_subscriptions` has RLS enabled with no direct table policies; access is expected to remain through the Edge Function path.

## Follow-Up

- Deploy the frontend change that reads workers through `workers_public` before relying on the new read path in production.
- Verify worker login and push registration in the browser after deployment.
- Worker deletion is intentionally removed from the browser path until a server-authorized admin mutation path exists.
- Continue Phase 2 design for server-validated admin mutations and tighter RLS.
