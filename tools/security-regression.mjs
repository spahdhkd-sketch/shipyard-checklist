import { readFileSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const htmlFiles = ["index.html", "check.html", "history.html", "ships.html", "items.html"];
const app = read("assets/js/app.js");
const migrationPath = "docs/supabase-security-hardening-2026-05-15.sql";
const migration = existsSync(new URL(migrationPath, root)) ? read(migrationPath) : "";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(!/ADMIN_PASSWORD/.test(app), "admin password must not exist in client JavaScript");
assert(!/shipyardSafetyAdmin/.test(app), "admin state must not be controlled by sessionStorage");
assert(!/prompt\("관리자 비밀번호/.test(app), "admin mode must not use a browser password prompt");
assert(/signInWithOtp/.test(app), "admin login must use Supabase Auth OTP");
assert(/auth\.getSession/.test(app), "admin mode must derive from a Supabase Auth session");
assert(/auth\.signOut/.test(app), "admin mode must support Supabase Auth sign-out");
assert(/rpc\("is_shipyard_admin"\)/.test(app), "admin authorization must call the database admin check RPC");

assert(migration.includes("shipyard_admins"), "RLS hardening migration must create an admin allowlist table");
assert(migration.includes("is_shipyard_admin"), "RLS hardening migration must expose the admin check function");
assert(/revoke\s+insert,\s*update,\s*delete\s+on\s+public\.safety_tools\s+from\s+anon/i.test(migration), "RLS migration must revoke anon writes on safety_tools");
assert(/revoke\s+insert,\s*update,\s*delete\s+on\s+public\.safety_pictograms\s+from\s+anon/i.test(migration), "RLS migration must revoke anon writes on safety_pictograms");
assert(/for\s+delete\s+to\s+authenticated\s+using\s+\(\(select\s+public\.is_shipyard_admin\(\)\)\)/i.test(migration), "RLS migration must restrict deletes to authenticated admins");

for (const file of htmlFiles) {
  const html = read(file);
  assert(html.includes('http-equiv="Content-Security-Policy"'), `${file} must define a CSP`);
  assert(html.includes("@supabase/supabase-js@2.105.3"), `${file} must pin supabase-js to an exact version`);
  assert(!html.includes("@supabase/supabase-js@2\""), `${file} must not use major-only supabase-js CDN URL`);
}

console.log("security regression checks passed");
