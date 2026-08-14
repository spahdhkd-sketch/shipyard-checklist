const assert = require("assert");
const fs = require("fs");
const path = require("path");

const { renderSectionManagerView, renderWorkTypeManagerView } = require("../assets/js/screen-views.js");

const html = renderWorkTypeManagerView({
  searchQuery: "용접",
  mobileDetailOpen: true,
  categories: [
    {
      id: "cat-1",
      label: "용접 <작업>",
      meta: "3개 섹션 · 12개 항목",
      countLabel: "5개 지정",
      searchText: "용접 작업 선행",
      active: true,
      accent: "#1f6eb3",
      iconHtml: "<svg aria-hidden=\"true\"></svg>",
    },
  ],
  detailHtml: "<div data-detail-test>상세</div>",
});

assert.match(html, /class="work-type-manager is-mobile-detail-open"/);
assert.match(html, /data-work-type-search/);
assert.match(html, /value="용접"/);
assert.match(html, /data-select-work-type="cat-1"/);
assert.match(html, /aria-selected="true"/);
assert.match(html, /용접 &lt;작업&gt;/);
assert.match(html, /3개 섹션 · 12개 항목/);
assert.match(html, /data-detail-test/);

const sectionHtml = renderSectionManagerView({
  sectionId: "section-1",
  sectionTitle: "끼임 위험",
  signCode: "W-03",
  frequency: 2,
  severity: 3,
  editing: true,
  expanded: true,
  adminMode: true,
  rows: [],
});

assert.match(sectionHtml, /class="section-sign-preview"/);
assert.match(sectionHtml, /assets\/pictograms\/signs\/W-03\.png/);
assert.match(sectionHtml, /선택한 위험 표지 미리보기/);
assert.match(sectionHtml, /data-section-sign-preview="editSectionSignPreview_section-1"/);

const appSource = fs.readFileSync(path.join(__dirname, "../assets/js/app-v2.js"), "utf8");
const styles = fs.readFileSync(path.join(__dirname, "../assets/css/styles-v2.css"), "utf8");

assert.match(appSource, /data-edit-work-type-section="\$\{esc\(section\.id\)\}"/);
assert.match(appSource, /class="work-type-section-inline-editor"/);
assert.match(appSource, /state\.editSectionId = closing \? null : sectionId/);
assert.doesNotMatch(appSource, /data-manage-section=/);
assert.doesNotMatch(appSource, /섹션·항목 관리 열기/);
assert.match(appSource, /\$\{expanded \? "접기" : "\+ 더보기"\}/);
assert.match(styles, /\.section-sign-preview img \{[\s\S]*width: auto;[\s\S]*height: auto;[\s\S]*object-fit: contain;/);
assert.match(styles, /\.compact-manage-item-row \{[\s\S]*grid-template-rows: auto;[\s\S]*min-height: 0;/);
assert.match(styles, /\.edit-item-row \{[\s\S]*display: grid;[\s\S]*grid-template-columns: minmax\(0, 1fr\);/);
assert.match(styles, /\.edit-item-row > \.item-actions\.manage-actions \{[\s\S]*border-top: 1px solid var\(--line\);/);

console.log("work-type-manager-view tests passed");
