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
expectMatch(app, /startRemoteSync\(\)\s*\{[\s\S]*startRemoteRealtime\(\)/, "automatic startup sync should open the constrained realtime subscription");
expectMatch(app, /const REALTIME_REMOTE_KEYS = new Set\(\[[\s\S]*"workPrepRecords"[\s\S]*\]\)/, "realtime subscriptions must use an explicit bounded table allowlist");
expectNoMatch(app.match(/const REALTIME_REMOTE_KEYS = new Set\(\[[\s\S]*?\]\);/)?.[0] || "", /"inspectionItems"|"issuePhotos"/, "high-volume detail tables must stay out of realtime");
expectMatch(app, /pullRealtimeGap\("poll"\)/, "polling fallback must use cursor-bounded reads for the realtime table allowlist");
expectMatch(app, /function compressUnsafePhotoFile\(/, "unsafe photo uploads should be compressed client-side");
expectMatch(app, /const ISSUE_PHOTO_PRIVATE_CACHE_SECONDS = 10 \* 60;/, "private photo cache must not outlive signed URLs");
expectMatch(app, /cacheControl:\s*String\(ISSUE_PHOTO_PRIVATE_CACHE_SECONDS\)/, "Storage uploads should use the private cache boundary");
expectNoMatch(app, /<img class="record-thumb"/, "admin issue lists should not auto-load Storage thumbnails");

expectNoMatch(edge, /"src",/, "admin pictogram writes should not whitelist legacy src bytes");
expectNoMatch(pictogramImage, /Response\.redirect\(src,\s*302\)/, "pictogram lazy image function should not redirect arbitrary legacy https URLs");
expectMatch(egressMigration, /name\s+like\s+'unsafe\/%'/i, "issue photo Storage inserts should be path-limited to unsafe uploads");
expectNoMatch(egressMigration, /for delete\s+to anon,\s*authenticated/i, "issue photo Storage deletes should not be public");

// 월간 통계/서약 지난 날짜 조회는 전체 테이블이 아닌 날짜 범위로만 추가 조회해야 한다.
expectMatch(app, /async function ensureInspectionRangeLoaded\(/, "analytics/pledge views should lazy-load inspection history by range");
expectMatch(app, /\.gte\("date", start\)[\s\S]{0,80}\.lte\("date", end\)/, "inspection range pulls must be date-bounded (gte/lte)");
expectMatch(app, /remoteLoadedInspectionRanges/, "inspection range pulls must be cached per session to avoid refetch loops");
expectMatch(app, /state\.archivedInspections = mergeRecordArrays\(outsideRange, rows, pendingRange\)/, "range rows must authoritatively refresh the read-only archive range while preserving offline rows");

expectMatch(pkg.scripts.verify, /tests\/egress-optimization-static\.test\.js/, "verify script should include egress optimization static test");

console.log("egress optimization static tests passed");
