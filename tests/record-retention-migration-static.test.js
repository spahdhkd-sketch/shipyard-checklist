const assert = require("assert");
const fs = require("fs");
const path = require("path");

const migrationPath = path.resolve(
  __dirname,
  "../supabase/migrations/20260815120000_record_retention_foundation.sql",
);
const migration = fs.readFileSync(migrationPath, "utf8");

function expectMatch(pattern, message) {
  assert.match(migration, pattern, message);
}

// Given the retention foundation migration
// When its state contract is inspected
// Then archive, restore, expiry, reason, and audit metadata are durable.
expectMatch(/create table if not exists public\.record_retention_states/i, "retention state ledger is required");
expectMatch(/status text not null[\s\S]*check \(status in \('archived', 'active'\)\)/i, "state must distinguish archived and restored records");
expectMatch(/retention_expires_at timestamptz/i, "archive expiry is required");
expectMatch(/last_reason text not null/i, "the latest transition reason is required");
expectMatch(/create table if not exists public\.record_retention_events/i, "append-only audit events are required");
expectMatch(/affected_count integer not null/i, "audit must capture the confirmed affected count");
expectMatch(/actor_ref text not null/i, "audit must capture an opaque actor reference");
expectMatch(/request_id text not null/i, "audit must capture an idempotency reference");
expectMatch(/function public\.record_retention_record_ids_valid\(p_record_ids text\[\]\)/i, "record IDs require a reusable validation boundary");
expectMatch(/count\(distinct pg_catalog\.btrim\(input\.record_id\)\)/i, "confirmed counts must not include duplicate record IDs");
expectMatch(/check \(public\.record_retention_record_ids_valid\(record_ids\)\)/i, "audit rows must enforce validated record IDs");

// Given existing application reads
// When the migration is introduced
// Then it neither changes existing read policies nor performs destructive SQL.
assert.doesNotMatch(migration, /\bdelete\s+from\b/i);
assert.doesNotMatch(migration, /\btruncate\b/i);
assert.doesNotMatch(migration, /\bdrop\s+table\b/i);
assert.doesNotMatch(migration, /create\s+policy[\s\S]*on\s+public\.(?!record_retention_)/i);

// Given retention data is an administrative boundary
// When grants are inspected
// Then browser roles cannot read or mutate the ledgers directly.
expectMatch(/revoke all on table public\.record_retention_states from public, anon, authenticated/i, "state must be service-owned");
expectMatch(/revoke all on table public\.record_retention_events from public, anon, authenticated/i, "events must be service-owned");
expectMatch(/grant select, insert, update, delete on table public\.record_retention_states to service_role/i, "service role must own state transitions");
expectMatch(/grant select, insert on table public\.record_retention_events to service_role/i, "audit events must be append-only");

// Given a confirmed transition request
// When archive or restore changes the state ledger
// Then the state mutation and append-only event share one service-only transaction boundary.
expectMatch(/function public\.record_retention_transition\([\s\S]*returns jsonb[\s\S]*security definer/i, "transitions require a security-definer RPC");
expectMatch(/pg_advisory_xact_lock/i, "transitions must serialize per resource type");
expectMatch(/if p_action = 'archive'[\s\S]*insert into public\.record_retention_states/i, "archive must upsert only the retention ledger");
expectMatch(/elsif p_action = 'restore'[\s\S]*update public\.record_retention_states/i, "restore must only change retention state");
expectMatch(/insert into public\.record_retention_events/i, "every transition must append an audit event");
expectMatch(/revoke all on function public\.record_retention_transition\([\s\S]*from public, anon, authenticated/i, "browser roles must not execute transitions");
expectMatch(/grant execute on function public\.record_retention_transition\([\s\S]*to service_role/i, "only the service role may execute transitions");
assert.doesNotMatch(migration, /delete\s+from\s+public\.(?!admin_mutation_attempts)/i, "retention must not hard-delete records");

console.log("record-retention migration static tests passed");
