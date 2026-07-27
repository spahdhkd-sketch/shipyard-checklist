const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const app = read("assets/js/app-v2.js");
const views = read("assets/js/screen-views.js");
const edge = read("supabase/functions/admin-mutations/index.ts");
const migration = read("supabase/migrations/20260721113000_secure_icon_management.sql");
const historyPolicy = read("supabase/migrations/20260728151000_icon_history_authenticated_read.sql");
const historyIndex = read("supabase/migrations/20260728152000_icon_history_worker_index.sql");

const clientBuiltIns = [...(app.match(/const PICTOGRAMS = \[([\s\S]*?)\n    \];/)?.[1] || "").matchAll(/key: "([^"]+)"/g)]
  .map((match) => match[1])
  .sort();
const serverBuiltIns = [...(edge.match(/const BUILT_IN_PICTOGRAM_IDS = new Set\(\[([\s\S]*?)\n\]\);/)?.[1] || "").matchAll(/"([^"]+)"/g)]
  .map((match) => match[1])
  .sort();
assert.deepStrictEqual(serverBuiltIns, clientBuiltIns, "client and server built-in icon registries must stay aligned");

assert.match(views, /id="catIcon"[^>]*value="blockAssembly"/, "new categories must save the icon shown as selected");
assert.match(app, /const previousCategories = state\.categories;/, "category save must snapshot state before mutation");
assert.match(app, /state\.categories = previousCategories;[\s\S]*state\.editCategoryId = previousEditCategoryId;/, "failed category saves must restore icon state");
assert.match(app, /invokeAdminMutation\("deletePictogram"/, "custom icon deletion must use one server operation");
assert.match(app, /invokeAdminMutation\("uploadPictogramImage"[\s\S]*label[\s\S]*sortOrder/, "custom icon upload must create metadata on the server");
assert.match(app, /rows: \(rows\) => rows\.filter\(\(row\) => row\.source === "custom" && row\.deleted !== true\)/, "deleted pictograms must not re-enter generic synchronization");
assert.match(app, /async function savePictogram[\s\S]*upsertAdminRows\("pictograms", updatedPictogram\)/, "pictogram rename must save only the selected active row");
assert.match(app, /data-apply-category-icon=.*선택한 아이콘 적용/, "category editor must expose an icon-specific apply action beside the picker");
assert.match(app, /아이콘을 선택했습니다\.[\s\S]*선택한 아이콘 적용/, "icon selection must explain the save action");
assert.match(app, /픽토그램 이름만 수정했습니다/, "pictogram rename feedback must not imply category icon application");

assert.match(edge, /const BUILT_IN_PICTOGRAM_IDS = new Set/, "server must own the built-in icon allowlist");
assert.match(edge, /async function validateCategoryIcons/, "server must reject dangling category icon identifiers");
assert.doesNotMatch(edge, /\["pictograms",\s*\{[\s\S]*?"storage_bucket"[\s\S]*?\}\]/, "generic pictogram upserts must not accept storage locations");
assert.match(edge, /async function deletePictogram/, "server must coordinate custom icon deletion");
assert.match(edge, /\.rpc\("delete_safety_pictogram"/, "custom icon delete must update references transactionally");
assert.match(edge, /metadataError[\s\S]*\.remove\(\[storagePath\]\)[\s\S]*admin_pictogram_metadata_failed/, "failed metadata writes must compensate by removing uploaded objects");

assert.match(migration, /create table if not exists public\.safety_icon_change_history/i, "icon changes must have an audit table");
assert.match(migration, /create or replace function public\.upsert_safety_categories_with_history/i, "category writes and audit history must share a transaction");
assert.match(migration, /create or replace function public\.delete_safety_pictogram/i, "icon deletion and category fallback must share a transaction");
assert.match(migration, /set icon = selected\.id[\s\S]*where (?:safety_categories\.)?id = 'ra_std07'/i, "the active DCP icon must be linked without hardcoding its generated id");
assert.match(migration, /set icon = 'safetyGear'[\s\S]*where icon = 'C'/i, "legacy C aliases must be canonicalized");
assert.match(historyPolicy, /to authenticated[\s\S]*using \(true\)/i, "icon history must have an authenticated read policy without exposing it to anon");
assert.match(historyIndex, /safety_icon_change_history_changed_by_worker_id_idx/i, "icon history worker references must have a covering index");

console.log("icon management static tests passed");
