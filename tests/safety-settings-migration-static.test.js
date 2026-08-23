"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const migration = fs.readFileSync(
  path.resolve(__dirname, "../supabase/migrations/20260815121000_safety_setting_versions.sql"),
  "utf8",
);

assert.match(migration, /create table public\.safety_setting_versions/i);
assert.match(migration, /lifecycle_status in \('draft', 'review', 'published'\)/i);
assert.match(migration, /alter table public\.safety_setting_versions enable row level security/i);
assert.match(
  migration,
  /revoke all on table public\.safety_setting_versions from public, anon, authenticated/i,
  "browser roles must not access drafts, audit actor references, or direct writes",
);
assert.match(
  migration,
  /grant select, insert, update, delete on table public\.safety_setting_versions to service_role/i,
);
assert.match(
  migration,
  /create trigger safety_setting_versions_lifecycle_guard[\s\S]*before insert or update or delete/i,
);
assert.match(migration, /published_safety_settings_are_immutable/g);
assert.match(migration, /safety_settings_must_enter_review_before_publish/i);
assert.match(migration, /safety_settings_lifecycle_cannot_move_backward/i);
assert.match(migration, /safety_settings_review_snapshot_is_locked/i);
assert.match(migration, /safety_settings_rollback_target_must_be_published/i);
assert.match(
  migration,
  /authored_by ~ '\^actor:v1:\[A-Za-z0-9_-\]\{43\}\$'/i,
  "stored audit actors must be stable opaque keys rather than worker identity fields",
);

const publishedView = migration.match(
  /create view public\.safety_settings_published[\s\S]*?where lifecycle_status = 'published';/i,
);
assert(publishedView, "a published-only read projection is required");
assert.match(publishedView[0], /security_invoker = false/i);
assert.doesNotMatch(
  publishedView[0], /authored_by|reviewed_by|published_by/i,
  "the browser-readable projection must omit audit actor references",
);
assert.match(
  migration,
  /grant select on table public\.safety_settings_published to anon, authenticated/i,
);
assert.doesNotMatch(migration, /grant [^;]* on table public\.safety_setting_versions to (?:anon|authenticated)/i);
assert.doesNotMatch(migration, /\btruncate\b|\bdrop\s+table\b|\bdelete\s+from\b/i);
assert.match(migration, /Do not store names, employee numbers, email addresses, session tokens, or other PII/g);

console.log("safety-settings migration static tests passed");
