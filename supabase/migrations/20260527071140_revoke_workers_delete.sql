-- Phase 1 follow-up:
-- - ordinary browser clients must not be able to remove worker rows
-- - worker deletion needs a future server-authorized admin mutation path

revoke delete on table public.workers from public, anon, authenticated;

drop policy if exists "workers public delete" on public.workers;
