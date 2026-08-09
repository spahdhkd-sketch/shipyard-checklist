const assert = require("assert");

const { renderWorkTypeManagerView } = require("../assets/js/screen-views.js");

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

console.log("work-type-manager-view tests passed");
