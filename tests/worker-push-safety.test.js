const assert = require("assert");
const esbuild = require("esbuild");
const fs = require("fs");
const vm = require("vm");

const file = "supabase/functions/worker-push/index.ts";
let source = fs.readFileSync(file, "utf8")
  .replace(/^import .*;\r?\n/gm, "")
  .replace(/Deno\.serve\([\s\S]*$/m, "");
source += `\nglobalThis.__workerPushSafety = {
  normalizeIdempotencyKey,
  resolveSendRecipientIds,
  deliveryAuditCounts,
};`;

const compiled = esbuild.transformSync(source, { loader: "ts", format: "iife" }).code;
const sandbox = {
  console,
  Response,
  Date,
  Set,
  Map,
  JSON,
  Math,
  Number,
  String,
  Object,
  Array,
  TextEncoder,
  crypto,
  btoa,
  createClient: () => ({}),
  webpush: {},
  Deno: { env: { get: () => "" } },
};
vm.runInNewContext(compiled, sandbox, { filename: file });
const {
  normalizeIdempotencyKey,
  resolveSendRecipientIds,
  deliveryAuditCounts,
} = sandbox.__workerPushSafety;

assert.strictEqual(normalizeIdempotencyKey(" pledge:2026-08-15:abc "), "pledge:2026-08-15:abc");
assert.strictEqual(normalizeIdempotencyKey("bad key with spaces"), "");
assert.strictEqual(normalizeIdempotencyKey("x".repeat(121)), "");

assert.deepStrictEqual(
  Array.from(resolveSendRecipientIds("pledgePending", ["a", "b", "c"], ["a", "b"], ["b", "c"])),
  ["b"],
);
assert.deepStrictEqual(
  Array.from(resolveSendRecipientIds("adminManual", ["a", "inactive"], ["a"], [])),
  ["a"],
);
assert.deepStrictEqual(
  Array.from(resolveSendRecipientIds("unsafeIssue", ["policy-a", "injected"], ["a"], ["policy-a", "policy-b"])),
  ["policy-a", "policy-b"],
);
assert.deepStrictEqual(
  Array.from(resolveSendRecipientIds("test", ["self", "other"], ["self", "other"], [])),
  ["self", "other"],
);

assert.deepStrictEqual(
  JSON.parse(JSON.stringify(deliveryAuditCounts(
    ["delivered", "unavailable", "failed", "skipped"],
    [
      { workerId: "delivered", outcome: "delivered" },
      { workerId: "delivered", outcome: "failed" },
      { workerId: "failed", outcome: "failed" },
      { workerId: "skipped", outcome: "skipped" },
    ],
  ))),
  { targeted: 4, delivered: 1, unavailable: 1, failed: 1, skipped: 1 },
);

const appSource = fs.readFileSync("assets/js/app-v2.js", "utf8");
const migration = fs.readFileSync(
  "supabase/migrations/20260823122516_worker_push_delivery_idempotency.sql",
  "utf8",
);

assert.match(source, /source_record_required/);
assert.match(source, /\.eq\("worker_id", senderWorkerId\)/);
assert.match(source, /reserve_worker_push_delivery/);
assert.match(source, /complete_worker_push_delivery/);
assert.doesNotMatch(source, /sendIdempotencyCache/);
assert.match(source, /admin_session_required/);
assert.match(source, /storedSession\.worker_id !== senderWorkerId/);
assert.match(appSource, /sourceRecordId: options\.sourceRecordId \|\| ""/);
assert.ok(
  appSource.indexOf("const synced = await syncUnsafeIssue(row, files);")
    < appSource.indexOf("if (synced) await notifyUnsafeIssueRegistered(row);"),
  "unsafe issue notification must follow durable record synchronization",
);
assert.match(migration, /create table if not exists public\.worker_push_deliveries/);
assert.match(migration, /security definer/);
assert.match(migration, /revoke all on table public\.worker_push_deliveries from public, anon, authenticated/);
assert.match(migration, /grant execute on function public\.reserve_worker_push_delivery[\s\S]*to service_role/);

console.log("worker push safety tests passed");
