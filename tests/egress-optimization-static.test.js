const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function expectMatch(source, pattern, message) {
  if (!pattern.test(source)) throw new Error(message);
}

function expectNoMatch(source, pattern, message) {
  if (pattern.test(source)) throw new Error(message);
}

const app = read("assets/js/app-v2.js");
const edge = read("supabase/functions/admin-mutations/index.ts");
const pictogramImage = read("supabase/functions/pictogram-image/index.ts");
const egressMigration = read("supabase/migrations/20260528003000_egress_reduction_boundaries.sql");
const pkg = JSON.parse(read("package.json"));

expectNoMatch(app, /select\(config\.selectColumns \|\| "\*"\)/, "remote pulls must not fall back to select('*')");
expectMatch(app, /client\.from\(source\)\.select\(remoteSelectColumns\(config, fallback\)\)/, "remote pulls must use explicit projected columns");
expectMatch(app, /order\(config\.orderBy,\s*\{\s*ascending:\s*config\.ascending !== false/, "remote pulls should support ordered bounded reads");
expectMatch(app, /\.limit\(limit\)/, "remote pulls should support default row limits");
expectMatch(app, /pullOnStartup:\s*false,[\s\S]*key:\s*"inspectionItems"/, "inspection item rows should lazy-load for detail views");
expectMatch(app, /pullOnStartup:\s*false,[\s\S]*key:\s*"issuePhotos"/, "issue photo metadata should lazy-load for detail views");
expectNoMatch(app, /startRemoteSync\(\)\s*\{[\s\S]*startRemoteRealtime\(\)/, "automatic startup sync should not open realtime subscriptions");
expectNoMatch(app, /startRemoteSync\(\)\s*\{[\s\S]*startRemotePolling\(\)/, "automatic startup sync should not start interval polling");
expectMatch(app, /function compressUnsafePhotoFile\(/, "unsafe photo uploads should be compressed client-side");
expectMatch(app, /cacheControl:\s*"604800"/, "Storage uploads should use a cacheControl value");
expectNoMatch(app, /<img class="record-thumb"/, "admin issue lists should not auto-load Storage thumbnails");

expectNoMatch(edge, /"src",/, "admin pictogram writes should not whitelist legacy src bytes");
expectNoMatch(pictogramImage, /Response\.redirect\(src,\s*302\)/, "pictogram lazy image function should not redirect arbitrary legacy https URLs");
expectMatch(egressMigration, /name\s+like\s+'unsafe\/%'/i, "issue photo Storage inserts should be path-limited to unsafe uploads");
expectNoMatch(egressMigration, /for delete\s+to anon,\s*authenticated/i, "issue photo Storage deletes should not be public");

expectMatch(pkg.scripts.verify, /tests\/egress-optimization-static\.test\.js/, "verify script should include egress optimization static test");

console.log("egress optimization static tests passed");
