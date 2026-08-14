const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

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
assert.match(sectionHtml, /data-section-editor-field="title"/);
assert.match(sectionHtml, /data-section-editor-field="signCode"/);
assert.match(sectionHtml, /data-section-score-preview="editSectionTotal_section-1"/);
assert.doesNotMatch(sectionHtml, /onchange=|onerror=/);

const savingSectionHtml = renderSectionManagerView({
  sectionId: "section-1",
  sectionTitle: "끼임 위험",
  editing: true,
  saving: true,
  adminMode: true,
  rows: [],
});
assert.match(savingSectionHtml, /data-save-section="section-1" disabled[^>]*>저장 중</);
assert.match(savingSectionHtml, /data-action="cancel-edit-section" disabled/);
assert.match(savingSectionHtml, /data-section-editor-field="title" disabled/);
assert.match(savingSectionHtml, /data-section-editor-field="signCode"[^>]*disabled/);
assert.match(savingSectionHtml, /data-section-editor-field="frequency"[^>]*disabled/);
assert.match(savingSectionHtml, /data-section-editor-field="severity"[^>]*disabled/);

const expiredSessionSectionHtml = renderSectionManagerView({
  sectionId: "section-1",
  sectionTitle: "저장 전 초안",
  editing: true,
  saving: false,
  adminMode: false,
  rows: [],
});
assert.match(expiredSessionSectionHtml, /value="저장 전 초안"/);
assert.match(expiredSessionSectionHtml, /data-save-section="section-1" disabled/);
assert.doesNotMatch(expiredSessionSectionHtml, /data-action="cancel-edit-section" disabled/);

const appSource = fs.readFileSync(path.join(__dirname, "../assets/js/app-v2.js"), "utf8");
const styles = fs.readFileSync(path.join(__dirname, "../assets/css/styles-v2.css"), "utf8");

assert.match(appSource, /data-edit-work-type-section="\$\{esc\(section\.id\)\}"/);
assert.match(appSource, /class="work-type-section-inline-editor"/);
assert.match(appSource, /state\.editSectionId = closing \? null : sectionId/);
assert.match(appSource, /function isSectionEditorDirty\(sectionId = state\.editSectionId\)/);
assert.match(appSource, /function confirmSectionEditorDiscard\(button\)/);
assert.match(appSource, /저장하지 않은 섹션 변경사항이 있습니다/);
assert.match(appSource, /sectionEditorDraft: null/);
assert.match(appSource, /sectionSaveSubmittingId: ""/);
assert.match(appSource, /updateSectionEditorDraft\(event\.target\.dataset\.sectionEditorId/);
assert.match(appSource, /window\.addEventListener\("beforeunload"/);
assert.match(appSource, /if \(!state\.sectionSaveSubmittingId && !isSectionEditorDirty\(\)\) return;/);
assert.match(appSource, /if \(!saved\) \{[\s\S]*?previousSection[\s\S]*?render\(\);[\s\S]*?return;/);
assert.match(appSource, /if \(button && !confirmSectionEditorDiscard\(button\)\) \{[\s\S]*?event\.preventDefault\(\);[\s\S]*?return;/);
assert.match(appSource, /button\?\.dataset\.saveSection === sectionId \|\| button\?\.dataset\.action === "cancel-edit-section"/);
assert.match(appSource, /const preserveSectionEditor = !enabled && shouldPreserveSectionEditorOnAdminExit\(\)/);
assert.match(appSource, /if \(!preserveSectionEditor\) \{[\s\S]*?state\.editSectionId = null;[\s\S]*?clearSectionEditorDraft\(sectionEditorId\);/);
assert.match(appSource, /button\?\.dataset\.action === "toggle-admin" && !state\.adminMode/);
assert.doesNotMatch(appSource, /data-manage-section=/);
assert.doesNotMatch(appSource, /섹션·항목 관리 열기/);
assert.match(appSource, /\$\{expanded \? "접기" : "\+ 더보기"\}/);
assert.match(styles, /\.section-sign-preview img \{[\s\S]*width: auto;[\s\S]*height: auto;[\s\S]*object-fit: contain;/);
assert.match(styles, /\.compact-manage-item-row \{[\s\S]*grid-template-rows: auto;[\s\S]*min-height: 0;/);
assert.match(styles, /\.edit-item-row \{[\s\S]*display: grid;[\s\S]*grid-template-columns: minmax\(0, 1fr\);/);
assert.match(styles, /\.edit-item-row > \.item-actions\.manage-actions \{[\s\S]*border-top: 1px solid var\(--line\);/);

const editorHelperSource = appSource.match(
  /    function normalizeSectionEditorScore[\s\S]*?(?=\n    function renderEditableItemRow)/,
)?.[0];
assert.ok(editorHelperSource, "section editor discard helpers should remain executable");
let confirmResult = false;
let confirmCalls = 0;
let toastCalls = 0;
const editorContext = {
  state: {
    editSectionId: "section-1",
    sectionEditorDraft: null,
    sectionSaveSubmittingId: "",
    sections: [{ id: "section-1", title: "끼임 위험", signCode: "W-03", frequency: 2, severity: 3 }],
  },
  toast: () => {
    toastCalls += 1;
  },
  window: {
    confirm: () => {
      confirmCalls += 1;
      return confirmResult;
    },
  },
  helpers: null,
};
vm.runInNewContext(
  `${editorHelperSource}\nhelpers = { beginSectionEditor, updateSectionEditorDraft, isSectionEditorDirty, shouldPreserveSectionEditorOnAdminExit, confirmSectionEditorDiscard, normalizeSectionEditorSign };`,
  editorContext,
);
editorContext.helpers.beginSectionEditor(editorContext.state.sections[0]);
assert.equal(editorContext.helpers.isSectionEditorDirty(), false);
editorContext.helpers.updateSectionEditorDraft("section-1", "title", "끼임·충돌 위험");
assert.equal(editorContext.helpers.isSectionEditorDirty(), true);
assert.equal(editorContext.helpers.shouldPreserveSectionEditorOnAdminExit(), true);
assert.equal(editorContext.helpers.confirmSectionEditorDiscard({ dataset: { action: "toggle-admin" } }), true);
assert.equal(confirmCalls, 0, "re-authentication should not discard or prompt for the preserved draft");
assert.equal(editorContext.helpers.isSectionEditorDirty(), true);
assert.equal(editorContext.helpers.confirmSectionEditorDiscard({ dataset: { workTypeTab: "summary" } }), false);
assert.equal(confirmCalls, 1);
confirmResult = true;
assert.equal(editorContext.helpers.confirmSectionEditorDiscard({ dataset: { selectWorkType: "cat-2" } }), true);
assert.equal(confirmCalls, 2);
assert.equal(editorContext.state.sectionEditorDraft, null);
confirmResult = false;
editorContext.helpers.beginSectionEditor(editorContext.state.sections[0]);
editorContext.helpers.updateSectionEditorDraft("section-1", "severity", "4");
assert.equal(editorContext.helpers.confirmSectionEditorDiscard({ dataset: { saveSection: "section-1" } }), true);
assert.equal(editorContext.helpers.confirmSectionEditorDiscard({ dataset: { action: "cancel-edit-section" } }), true);
assert.equal(confirmCalls, 2, "save and explicit cancel should not show a discard confirmation");
editorContext.state.sectionSaveSubmittingId = "section-1";
editorContext.state.sections[0].severity = 4;
assert.equal(editorContext.helpers.isSectionEditorDirty(), false, "optimistic section state can temporarily match the draft");
assert.equal(editorContext.helpers.shouldPreserveSectionEditorOnAdminExit(), true, "an in-flight save must preserve the editor even when the optimistic state matches");
assert.equal(editorContext.helpers.confirmSectionEditorDiscard({ dataset: { workTypeTab: "summary" } }), false);
assert.equal(toastCalls, 1);
assert.equal(editorContext.helpers.normalizeSectionEditorSign("W-12"), "W-12");
assert.equal(editorContext.helpers.normalizeSectionEditorSign("W-13"), "");

console.log("work-type-manager-view tests passed");
