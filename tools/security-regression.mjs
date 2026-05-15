import { readFileSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const htmlFiles = ["index.html", "check.html", "history.html", "ships.html", "items.html", "unsafe.html", "materials.html", "manage.html"];
const app = read("assets/js/app.js");
const vercelConfig = read("vercel.json");
const passwordMigrationPath = "docs/supabase-password-admin-rls-2026-05-15.sql";
const passwordMigration = existsSync(new URL(passwordMigrationPath, root)) ? read(passwordMigrationPath) : "";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(/const ADMIN_PASSWORD = "gs2026";/.test(app), "admin password must be the requested gs2026 value");
assert(/prompt\("관리자 비밀번호/.test(app), "admin mode must use the local password prompt");
assert(!/signInWithOtp/.test(app), "admin mode must not use Supabase Auth OTP");
assert(!/auth\.getSession/.test(app), "admin mode must not derive from a Supabase Auth session");
assert(!/auth\.signOut/.test(app), "admin mode must not sign out through Supabase Auth");
assert(!/rpc\("is_shipyard_admin"\)/.test(app), "admin mode must not call the database admin check RPC");

assert(passwordMigration.includes("Password-based admin mode"), "password admin RLS migration must document the auth tradeoff");
assert(/grant\s+insert,\s*update,\s*delete\s+on[\s\S]*public\.safety_tools[\s\S]*to\s+anon,\s*authenticated/i.test(passwordMigration), "password admin migration must grant anon writes on admin tables");
assert(/create\s+policy\s+"password admin write safety tools"[\s\S]*for\s+all[\s\S]*to\s+anon/i.test(passwordMigration), "password admin migration must open anon writes on safety_tools");
assert(/create\s+policy\s+"password admin update safety inspections"[\s\S]*for\s+update[\s\S]*to\s+anon/i.test(passwordMigration), "password admin migration must allow anon history updates");
assert(/create\s+policy\s+"password admin delete safety inspection items"[\s\S]*for\s+delete[\s\S]*to\s+anon/i.test(passwordMigration), "password admin migration must allow anon history-item deletes");

for (const file of htmlFiles) {
  const html = read(file);
  assert(html.includes('http-equiv="Content-Security-Policy"'), `${file} must define a CSP`);
  assert(html.includes("img-src 'self' data: blob: https://psatbyktzladtymdygwh.supabase.co https://*.supabase.co"), `${file} CSP must allow Supabase-hosted images`);
  assert(html.includes("@supabase/supabase-js@2.105.3"), `${file} must pin supabase-js to an exact version`);
  assert(!html.includes("@supabase/supabase-js@2\""), `${file} must not use major-only supabase-js CDN URL`);
}

assert(vercelConfig.includes("img-src 'self' data: blob: https://psatbyktzladtymdygwh.supabase.co https://*.supabase.co"), "Vercel CSP header must allow Supabase-hosted images");

console.log("security regression checks passed");
