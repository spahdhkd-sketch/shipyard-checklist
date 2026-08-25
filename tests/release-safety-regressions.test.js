const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "assets/js/app-v2.js"), "utf8");
const normalizer = fs.readFileSync(path.join(root, "assets/js/normalization-rules.js"), "utf8");

assert.strictEqual(
  /REMOTE_TABLES\.forEach\(\(config\) => localStorage\.removeItem\(storeKey\(config\.key\)\)\)/.test(app),
  false,
  "앱 버전 변경이 오프라인 원본 데이터 캐시를 삭제하면 안 됩니다.",
);

assert.strictEqual(
  /category_id:\s*row\.categoryId\s*\|\|\s*""/.test(app),
  true,
  "전체 공통 공기구는 DB의 빈 문자열 category_id 계약으로 저장해야 합니다.",
);

const addToolStart = app.indexOf("async function addTool()");
const addToolEnd = app.indexOf("async function saveTool", addToolStart);
assert.ok(addToolStart >= 0 && addToolEnd > addToolStart, "addTool 함수 범위를 찾을 수 없습니다.");
const addToolSource = app.slice(addToolStart, addToolEnd);
assert.match(app, /toolAddSubmitting:\s*false/);
assert.match(addToolSource, /if \(state\.toolAddSubmitting\) return;/);
assert.ok(
  addToolSource.indexOf("await persistAndSync(\"tools\")") < addToolSource.indexOf("input.value = \"\""),
  "공기구 입력값과 추가창은 서버 저장 성공 뒤에만 초기화해야 합니다.",
);
assert.ok(
  addToolSource.indexOf("setToolAddSubmitting(true)") < addToolSource.indexOf("await persistAndSync(\"tools\")"),
  "공기구 저장 요청 전에 중복 제출 잠금을 걸어야 합니다.",
);
assert.match(addToolSource, /finally\s*\{[\s\S]*if \(!saved\) state\.tools = state\.tools\.filter[\s\S]*setToolAddSubmitting\(false\)/);
const failedSavePrefix = addToolSource.slice(0, addToolSource.indexOf("if (!saved) return;"));
assert.doesNotMatch(
  failedSavePrefix,
  /\brender\(\)/,
  "공기구 저장 실패 시 입력 폼을 다시 그려 사용자가 입력한 값을 지우면 안 됩니다.",
);
assert.match(app, /state\.toolAddSubmitting \? "추가 중\.\.\." : "공기구 추가"/);
assert.match(app, /state\.adminMode && !state\.toolAddSubmitting/);

assert.match(app, /ownerWorkerId:\s*String\(state\.workerSession\?\.workerId/);
assert.match(app, /pendingSyncJobEligible\(item, workerId\)/);
assert.match(app, /pending_sync_worker_changed/);
assert.match(normalizer, /keys\.includes\("issuePhotos"\)[\s\S]*사진은 별도 사진 재전송 화면/);
assert.match(app, /hasFailed \? "전송 실패함"/);
assert.match(app, /queue\.some\(\(job\) => job\.type === "full"\)\) return rows/);
assert.doesNotMatch(app, /normalizePendingSyncQueue\(state\.pendingSyncQueue\)\.slice\(-80\)/);
assert.match(app, /\[\.\.\.ids\]\.some\(\(id\) => !rowsById\.has\(id\)\)/);
// 부팅 순서 보장: 대기 중인 로컬 전송과 알림을 먼저 올린 뒤에 원격을 당겨야 한다.
// 원격 풀 자체는 로그인 여부로 갈라지지만 이 순서는 바뀌면 안 된다.
assert.match(
  app,
  /await flushPendingSyncQueue\(\);\s*await flushPendingMissingMaterialNotifications\(\);[\s\S]{0,400}?await pullRemote\(isWorkerLoggedIn\(\)\s*\?\s*\{ force: true \}\s*:\s*\{ force: true, keys: PRE_LOGIN_REMOTE_KEYS/,
  "부팅은 대기 전송·알림 flush 후에 원격을 당겨야 하며, 로그인 전에는 제한된 키만 당겨야 합니다.",
);

// 로그인 전 원격 풀에 개인정보·현장 운영 기록 테이블이 들어가면 안 된다.
const preLoginKeys = app.match(/const PRE_LOGIN_REMOTE_KEYS = \[([\s\S]*?)\];/);
assert.ok(preLoginKeys, "PRE_LOGIN_REMOTE_KEYS 선언이 있어야 합니다.");
["inspections", "inspectionItems", "unsafeIssues", "missingMaterials", "workPrepRecords", "issuePhotos", "ships"].forEach((key) => {
  assert.ok(
    !new RegExp(`"${key}"`).test(preLoginKeys[1]),
    `로그인 전 원격 풀에 ${key}가 포함되면 안 됩니다.`,
  );
});
assert.match(preLoginKeys[1], /"workers"/, "로그인 드롭다운을 위해 workers는 로그인 전에도 필요합니다.");

// 로그인 성공 직후 나머지 원격 데이터를 채워야 한다.
assert.match(app, /reason: "post-login"/, "로그인 성공 후 전체 원격 풀이 있어야 합니다.");

console.log("release safety regressions: ok");
