const assert = require("assert");
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const functionPath = path.resolve(
  __dirname,
  "../supabase/functions/record-retention/index.ts",
);
const source = fs.readFileSync(functionPath, "utf8");
for (const relativePath of [
  "../supabase/functions/record-retention/index.ts",
  "../supabase/functions/record-retention/deno.json",
  "../supabase/migrations/20260815120000_record_retention_foundation.sql",
  "./record-retention-migration-static.test.js",
  "./record-retention-function-static.test.js",
]) {
  const file = fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");
  assert.doesNotMatch(file, /[ \t]+$/m, `${relativePath} must not contain trailing whitespace`);
}
assert.doesNotThrow(
  () => esbuild.transformSync(source, { loader: "ts", format: "esm" }),
  "the Edge Function TypeScript must parse",
);

function expectMatch(pattern, message) {
  assert.match(source, pattern, message);
}

// Given an untrusted Edge Function request
// When it crosses the retention boundary
// Then an existing active privileged admin session is verified before dispatch.
expectMatch(/await verifyMutationSession\(payload\)[\s\S]*const action = requiredText/i, "authorization must precede dispatch");
expectMatch(/tokenPayload\.scope !== "admin"/i, "worker and work-prep sessions must be rejected");
expectMatch(/from\("admin_mutation_sessions"\)[\s\S]*eq\("token_hash", tokenHash\)/i, "the signed token must match its stored hash");
expectMatch(/from\("workers"\)[\s\S]*eq\("active", true\)[\s\S]*isPrivilegedWorker/i, "the current worker role must still be privileged");

// Given a retention operation
// When its resource and mutation are selected
// Then only fixed ledgers, fixed actions, and fixed resource types are reachable.
expectMatch(/const RESOURCE_TYPES = new Set\(\[[\s\S]*"safety_inspection"[\s\S]*"work_prep_record"[\s\S]*"unsafe_issue"[\s\S]*"missing_material"/i, "resource types must be allowlisted");
expectMatch(/const TRANSITION_ACTIONS = new Set\(\["archive", "restore", "purge_expired"\]\)/i, "transition actions must be allowlisted");
expectMatch(/from\("record_retention_states"\)/i, "preview and list must use the fixed state ledger");
expectMatch(/rpc\("record_retention_transition"/i, "mutations must use the transactional fixed-name RPC");
assert.doesNotMatch(source, /supabase\s*\.from\([^"']/i, "table names must never be caller-controlled");
assert.doesNotMatch(source, /\.delete\s*\(/i, "the function must not delete state or source records");

// Given a danger mutation
// When it is invoked
// Then reason, idempotency request ID, exact IDs, and count confirmation are mandatory.
expectMatch(/requiredText\(payload\.reason, "reason_required", 500\)/i, "reason is required");
expectMatch(/requiredText\(payload\.requestId, "request_id_required", 120\)/i, "request ID is required");
expectMatch(/confirmedAffectedCount\(payload\.confirmedAffectedCount\)/i, "affected count confirmation is required");
expectMatch(/input\.recordIds\.length !== affectedCount/i, "confirmed count must match the submitted IDs");

// Given successful responses
// When state or purge eligibility is returned
// Then only opaque record/state fields are exposed, not actor or reason data.
assert.doesNotMatch(source, /select\([^\n]*actor_ref/i, "actor references must not be returned");
assert.doesNotMatch(source, /select\([^\n]*last_reason/i, "free-text reasons must not be returned");
assert.doesNotMatch(source, /console\.(log|error|warn)/i, "requests and identifiers must not be logged");

console.log("record-retention function static tests passed");
