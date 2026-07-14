# Manual production cutovers

Files in this directory are intentionally excluded from the normal Supabase
migration push. Apply them only as a separately approved production step.

For the worker-mutation and private-photo change, deploy in this order:

1. Apply `20260715110000_add_worker_mutation_support.sql`, `20260715110500_atomic_worker_push_attempt.sql`, and `20260715111000_atomic_worker_inspection_submit.sql` in that order.
2. Deploy `admin-mutations` and `worker-push`.
3. Deploy the rebuilt client and verify worker, work-prep, admin, and photo flows.
4. Allow old cached clients to refresh and confirm no legacy direct writes remain.
5. Apply `20260715120000_secure_worker_mutations_private_issue_photos.sql` manually.
6. Verify anonymous writes are rejected and issue photos require signed URLs.
7. Move the applied SQL into `supabase/migrations`, run the same idempotent SQL once more, and record the migration version in normal deployment history.

Do not combine steps 1 and 5 in the same deployment.
