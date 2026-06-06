const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "assets/js/app-v2.js"), "utf8");

function extractFunction(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `${name} should exist`);
  const open = app.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < app.length; index += 1) {
    const char = app[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`${name} body was not closed`);
}

const context = {
  console,
  Date,
  Set,
  __restDays: new Set(),
};

vm.runInNewContext(`
  const DEFAULT_WORK_PREP_APPEARANCE_TIME = "15:00";
  const pad2 = (value) => String(value).padStart(2, "0");
  const localDate = (date) => {
    const parsed = new Date(date);
    return [parsed.getFullYear(), pad2(parsed.getMonth() + 1), pad2(parsed.getDate())].join("-");
  };
  function isMonthlyRestDay(date) {
    return globalThis.__restDays.has(date) ? { date } : null;
  }
  ${extractFunction("addDaysToLocalDate")}
  ${extractFunction("isWorkPrepRestDate")}
  ${extractFunction("workPrepOpenDate")}
  ${extractFunction("workPrepOpenDateTime")}
  ${extractFunction("shouldShowUpcomingWorkPrepRecord")}
  globalThis.helpers = {
    workPrepOpenDate,
    shouldShowUpcomingWorkPrepRecord,
  };
`, context);

const helpers = context.helpers;

assert.equal(helpers.workPrepOpenDate("2026-06-08"), "2026-06-05", "Monday work orders should open on the previous Friday");
assert.equal(helpers.workPrepOpenDate("2026-06-09"), "2026-06-08", "Tuesday work orders should open on Monday");

assert.equal(
  helpers.shouldShowUpcomingWorkPrepRecord({ workDate: "2026-06-08", appearanceTime: "15:00" }, new Date("2026-06-05T14:59:00")),
  false,
  "Monday work orders should stay hidden before Friday 15:00",
);
assert.equal(
  helpers.shouldShowUpcomingWorkPrepRecord({ workDate: "2026-06-08", appearanceTime: "15:00" }, new Date("2026-06-05T15:00:00")),
  true,
  "Monday work orders should be visible from Friday 15:00",
);
assert.equal(
  helpers.shouldShowUpcomingWorkPrepRecord({ workDate: "2026-06-08", appearanceTime: "15:00" }, new Date("2026-06-07T10:00:00")),
  true,
  "Visible Monday work orders should not disappear again over the weekend",
);

context.__restDays = new Set(["2026-06-05"]);
assert.equal(helpers.workPrepOpenDate("2026-06-08"), "2026-06-04", "Configured rest days should be skipped when opening upcoming work orders");

assert.match(app, /const dateOptions = workPrepVisibleDateOptions\(todayDate\)/);
assert.match(app, /const selectedDate = selectedWorkPrepDisplayDate\(dateOptions, firstUpcomingDate \|\| todayDate\)/);
assert.match(app, /renderWorkPrepDateSection\(selectedDate, selectedRecords, \{ next: selectedDate !== todayDate, force: true, dateOptions \}\)/);
assert.doesNotMatch(app, /const nextDate = addDaysToLocalDate\(todayDate, 1\)/);

assert.match(app, /function deleteWorkPrepRecord\(recordId\)/);
assert.match(app, /data-action="delete-work-prep-record"/);
assert.match(app, /deleteRemoteRows\("workPrepRecords", \[record\.id\]\)/);
assert.match(app, /"delete-work-prep-record": \(\) => deleteWorkPrepRecord\(workPrepRecordId\(\)\)/);
assert.match(app, /selectedWorkPrepDate: ""/);
assert.match(app, /workPrepDateManuallySelected: false/);
assert.match(app, /function workPrepVisibleDateOptions\(todayDate = today\(\)/);
assert.match(app, /function selectWorkPrepDate\(date\)/);
assert.match(app, /state\.workPrepDateManuallySelected = true/);
assert.match(app, /class="work-prep-date-nav"/);
assert.match(app, /data-action="select-work-prep-date"/);
assert.match(app, /data-work-prep-date="\$\{esc\(prevDate\)\}"/);
assert.match(app, /aria-label="이전 작업지시서 날짜"/);
assert.match(app, /aria-label="다음 작업지시서 날짜"/);
assert.match(app, /"select-work-prep-date": \(\) => selectWorkPrepDate\(event\.target\.closest\("\[data-work-prep-date\]"\)\?\.dataset\.workPrepDate \|\| ""\)/);
