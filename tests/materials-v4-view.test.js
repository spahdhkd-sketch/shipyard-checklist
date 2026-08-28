const assert = require("assert");
const fs = require("fs");
const path = require("path");
const materialsView = require("../assets/js/materials-v4-view.js");

const records = [
  {
    id: "m-1",
    shipNo: "H-102",
    materialName: "배관 자재",
    quantity: 4,
    unit: "EA",
    content: "작업 시작 전 반입이 필요합니다.",
    workerNameSnapshot: "홍길동",
    createdAt: "2026-08-24 08:30",
    status: "확인중",
    adminMemo: "구매팀 확인 중",
    assigneeName: "김관리",
    statusHistory: [
      { status: "접수", changedByName: "홍길동", changedAt: "2026-08-24 08:30" },
      { status: "확인중", changedByName: "김관리", changedAt: "2026-08-24 09:00" },
      { status: "확인중", changedByName: "김관리", changedAt: "2026-08-24 09:00" },
    ],
    assigneeHistory: [{ assigneeName: "김관리", changedByName: "관리자", changedAt: "2026-08-24 09:00" }],
  },
  { id: "m-2", shipNo: "H-104", materialName: "밸브", quantity: 2, unit: "EA", status: "접수" },
];

const html = materialsView.renderMissingMaterialsV4({
  records,
  selectedId: "m-1",
  statuses: ["접수", "확인중", "완료"],
  canEdit: true,
  filterHtml: '<button data-record-filter="materials:shipNo" value="H-102" type="button">H-102</button>',
});

assert.match(html, /data-material-record-detail="m-1"/);
assert.match(html, /data-material-bulk-select="m-1"/);
assert.match(html, /data-record-status="materials:m-1"/);
assert.match(html, /data-record-memo="materials:m-1"/);
assert.match(html, /data-save-record="materials:m-1"/);
assert.doesNotMatch(html, /data-action="bulk-material-status"/);
assert.match(html, /aria-label="자재 누락 목록"/);
assert.match(html, /<ol>/);
assert.match(html, /작업 시작 전 반입이 필요합니다/);
assert.strictEqual((html.match(/2026-08-24 09:00/g) || []).length, 3, "timeline entries are rendered once each, including faithful duplicates");
assert.match(html, /담당자 이력/);

const bulkSelection = materialsView.renderMissingMaterialsV4({
  records: [{ ...records[0], selected: true }, records[1]],
  canEdit: true,
});
assert.match(bulkSelection, /data-action="bulk-material-status"/);
assert.match(bulkSelection, /선택 1건 상태 변경/);

const readOnly = materialsView.renderMissingMaterialsV4({ records, selectedId: "m-1", canEdit: false });
assert.doesNotMatch(readOnly, /data-material-bulk-select=/);
assert.match(readOnly, /data-save-record="materials:m-1" type="button" disabled/);

const mobile = materialsView.renderMissingMaterialsV4({ records, selectedId: "m-1", mobileDetailOpen: true });
assert.match(mobile, /materials-v4 is-mobile-detail-open/);
assert.match(mobile, /materials-v4__detail is-mobile-fullscreen/);
assert.match(mobile, /data-action="back-material-list"/);

const states = ["loading", "error", "empty", "stale", "offline", "offline-empty"];
for (const dataState of states) {
  const stateHtml = materialsView.renderMissingMaterialsV4({ records: [], dataState });
  assert.match(stateHtml, new RegExp(`data-state="${dataState}"`));
}

const css = fs.readFileSync(path.join(__dirname, "../assets/css/30-feature-materials-v4.css"), "utf8");
assert.match(css, /min-height: 44px/);
assert.match(css, /@media \(max-width: 900px\)/);
assert.match(css, /\.materials-v4__detail\.is-mobile-fullscreen/);
assert.doesNotMatch(css, /#[0-9a-f]{3,8}/i, "the isolated feature stylesheet must use shared tokens only");

console.log("materials v4 view tests passed");
