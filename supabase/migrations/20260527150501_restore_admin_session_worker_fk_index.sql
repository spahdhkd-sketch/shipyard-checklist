create index if not exists admin_mutation_sessions_worker_fk_idx
on public.admin_mutation_sessions (worker_id);

comment on index public.admin_mutation_sessions_worker_fk_idx is
  'Covers admin_mutation_sessions.worker_id foreign key to avoid worker delete/update scans on the session ledger.';
