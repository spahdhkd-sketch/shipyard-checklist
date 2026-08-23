"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const source = fs.readFileSync(
  path.resolve(__dirname, "../supabase/functions/admin-mutations/index.ts"),
  "utf8",
);

function functionSource(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `${name} must exist`);
  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`${name} is not balanced`);
}

const actions = [
  ["listSafetySettingVersions", "listSafetySettingVersions"],
  ["readSafetySettingVersion", "readSafetySettingVersion"],
  ["createSafetySettingDraft", "createSafetySettingDraft"],
  ["requestSafetySettingReview", "requestSafetySettingReview"],
  ["publishSafetySettingVersion", "publishSafetySettingVersion"],
  ["createSafetySettingRollbackDraft", "createSafetySettingRollbackDraft"],
];

for (const [action, handler] of actions) {
  assert.match(
    source,
    new RegExp(`action === "${action}"\\) return ${handler}\\(payload\\)`),
    `${action} must be routed without changing existing actions`,
  );
  const handlerSource = functionSource(handler);
  assert.match(handlerSource, /verifyMutationSession\(payload, "admin"\)/);
  assert(
    handlerSource.indexOf("verifyMutationSession") < handlerSource.indexOf('.from("safety_setting_versions")'),
    `${handler} must authorize before accessing safety-setting rows`,
  );
}

assert.match(source, /return `actor:v1:\$\{await sha256\(workerId\)\}`/);
assert.doesNotMatch(
  source.slice(source.indexOf("const SAFETY_SETTING_VERSION_PATTERN"), source.indexOf("async function uploadPictogramImage")),
  /service_role|SUPABASE_SERVICE_ROLE_KEY|sessionId|employee_no|employeeNo|\.name\b|\.team\b|\.position\b/,
  "the safety-setting authority must not return credentials, session identifiers, or worker identity metadata",
);
assert.match(functionSource("requestSafetySettingReview"), /eq\("lifecycle_status", "draft"\)/);
assert.match(functionSource("publishSafetySettingVersion"), /eq\("lifecycle_status", "review"\)/);
assert.match(
  functionSource("createSafetySettingRollbackDraft"),
  /eq\("lifecycle_status", "published"\)[\s\S]*lte\("effective_at", new Date\(\)\.toISOString\(\)\)[\s\S]*settings: target\.settings/,
);

const responseFunction = functionSource("safetySettingResponse")
  .replace("function safetySettingResponse(row: Record<string, unknown>, includeSettings = false)",
    "function safetySettingResponse(row, includeSettings = false)")
  .replace("const response: Record<string, unknown>", "const response");
const context = {
  cleanText(value, max = 200) {
    return String(value || "").trim().slice(0, max);
  },
  rowObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  },
};
vm.runInNewContext(`${responseFunction}; this.safetySettingResponse = safetySettingResponse;`, context);
const projected = context.safetySettingResponse({
  config_version: "2026.08.15-1",
  lifecycle_status: "published",
  effective_at: "2026-08-15T00:00:00.000Z",
  change_summary: "운영 기준",
  settings: { pledgeRules: {}, pushCopy: {}, restDayCalendar: {} },
  authored_by: "actor:v1:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  authored_at: "2026-08-14T00:00:00.000Z",
  reviewed_by: "actor:v1:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  reviewed_at: "2026-08-14T01:00:00.000Z",
  published_by: "actor:v1:ccccccccccccccccccccccccccccccccccccccccccc",
  published_at: "2026-08-14T02:00:00.000Z",
  worker_id: "worker-secret",
  employee_no: "private-number",
  name: "private-name",
}, true);
assert.strictEqual(projected.metadata.authored.actorKey.startsWith("actor:v1:"), true);
assert.deepStrictEqual(JSON.parse(JSON.stringify(projected.settings)), {
  pledgeRules: {}, pushCopy: {}, restDayCalendar: {},
});
assert.doesNotMatch(JSON.stringify(projected), /worker-secret|private-number|private-name/);

console.log("admin safety-settings authority static and projection behavior tests passed");
