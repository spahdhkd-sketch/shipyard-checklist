import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const runtimeNodeModules = "C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const tempNodeModules = path.join(process.env.TEMP || process.env.TMP || "C:/Windows/Temp", "gs-manual-pptx-node", "node_modules");
const require = createRequire(import.meta.url);
const pptxgen = require(require.resolve("pptxgenjs", { paths: [tempNodeModules, runtimeNodeModules] }));

const root = "C:/Users/User/GS_CHECKLIST/shipyard-checklist";
const claudeShots = "C:/Users/User/GS_CHECKLIST/CLAUDE_VERSION";
const prodShots = path.join(root, "docs/manual/screenshots/ppt-2026-05-25");
const outputPath = path.join(root, "docs/manual/GS_Safety_Checklist_사용설명서_따라하기_2026-05.pptx");

const shot = (dir, file) => path.join(dir, file);

const C = {
  navy: "0F1E2C",
  deep: "112A3A",
  teal: "0F766E",
  teal2: "0B8A82",
  mint: "E6F6F3",
  white: "FFFFFF",
  bg: "F6FAFC",
  ink: "102033",
  muted: "587083",
  line: "D8E3EA",
  red: "DC2626",
  amber: "F59E0B",
  purple: "6D5BD0",
  blue: "2563EB",
};

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "GS Safety Checklist";
pptx.company = "(주)지에스";
pptx.subject = "GS 안전 체크리스트 따라하기 사용설명서";
pptx.title = "GS Safety Checklist 따라하기 사용설명서";
pptx.lang = "ko-KR";
pptx.theme = {
  headFontFace: "Malgun Gothic",
  bodyFontFace: "Malgun Gothic",
  lang: "ko-KR",
};
pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });

function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) !== 0x89504e47) throw new Error(`Not a PNG: ${file}`);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function containRect(file, box) {
  const size = pngSize(file);
  const scale = Math.min(box.w / size.width, box.h / size.height);
  const w = size.width * scale;
  const h = size.height * scale;
  return {
    x: box.x + (box.w - w) / 2,
    y: box.y + (box.h - h) / 2,
    w,
    h,
  };
}

function footer(slide, num, label = "") {
  slide.addShape(pptx.ShapeType.line, {
    x: 0.55,
    y: 7.1,
    w: 12.25,
    h: 0,
    line: { color: C.line, width: 1 },
  });
  slide.addText("GS 안전 체크리스트 사용설명서", {
    x: 0.58,
    y: 7.18,
    w: 3.8,
    h: 0.16,
    fontFace: "Malgun Gothic",
    fontSize: 6.8,
    color: C.muted,
    margin: 0,
  });
  slide.addText(label, {
    x: 5.35,
    y: 7.18,
    w: 2.55,
    h: 0.16,
    fontFace: "Aptos",
    fontSize: 6.8,
    bold: true,
    color: C.teal,
    align: "center",
    margin: 0,
  });
  slide.addText(String(num).padStart(2, "0"), {
    x: 12.15,
    y: 7.12,
    w: 0.6,
    h: 0.25,
    fontFace: "Aptos",
    fontSize: 8,
    bold: true,
    color: C.teal,
    align: "right",
    margin: 0,
  });
}

function header(slide, title, eyebrow) {
  slide.addText("GS SAFETY CHECKLIST", {
    x: 0.55,
    y: 0.26,
    w: 2.65,
    h: 0.17,
    fontFace: "Aptos",
    fontSize: 7.2,
    bold: true,
    color: C.teal,
    charSpace: 1.4,
    margin: 0,
  });
  slide.addText(title, {
    x: 0.54,
    y: 0.52,
    w: 8.1,
    h: 0.46,
    fontFace: "Malgun Gothic",
    fontSize: 21,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(eyebrow, {
    x: 10.25,
    y: 0.36,
    w: 2.55,
    h: 0.25,
    fontFace: "Aptos",
    fontSize: 7.6,
    bold: true,
    color: C.teal,
    align: "right",
    margin: 0,
  });
}

function stepPanel(slide, title, steps, note = "") {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 9.36,
    y: 1.1,
    w: 3.45,
    h: note ? 4.72 : 5.3,
    rectRadius: 0.05,
    fill: { color: C.white },
    line: { color: C.line },
  });
  slide.addText(title, {
    x: 9.62,
    y: 1.34,
    w: 2.9,
    h: 0.28,
    fontFace: "Malgun Gothic",
    fontSize: 13,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  steps.forEach((step, i) => {
    const y = 1.88 + i * 0.78;
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 9.62,
      y: y + 0.03,
      w: 0.33,
      h: 0.33,
      fill: { color: step.color || C.teal },
      line: { color: step.color || C.teal },
    });
    slide.addText(String(i + 1), {
      x: 9.62,
      y: y + 0.105,
      w: 0.33,
      h: 0.12,
      fontFace: "Aptos",
      fontSize: 7.5,
      bold: true,
      color: C.white,
      align: "center",
      margin: 0,
    });
    slide.addText(step.text, {
      x: 10.08,
      y,
      w: 2.45,
      h: 0.47,
      fontFace: "Malgun Gothic",
      fontSize: 10.4,
      color: C.ink,
      margin: 0,
      fit: "shrink",
      valign: "mid",
    });
  });
  if (note) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 9.36,
      y: 6.02,
      w: 3.45,
      h: 0.78,
      rectRadius: 0.05,
      fill: { color: "FFF7ED" },
      line: { color: "FDBA74" },
    });
    slide.addText(note, {
      x: 9.58,
      y: 6.18,
      w: 3.02,
      h: 0.4,
      fontFace: "Malgun Gothic",
      fontSize: 9.1,
      bold: true,
      color: "9A3412",
      margin: 0,
      fit: "shrink",
      valign: "mid",
    });
  }
}

function screenshot(slide, file, box) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    rectRadius: 0.05,
    fill: { color: C.white },
    line: { color: C.line, width: 1 },
    shadow: { type: "outer", color: "9FB2C3", opacity: 0.15, blur: 1, angle: 45, distance: 1 },
  });
  const rect = containRect(file, { x: box.x + 0.08, y: box.y + 0.08, w: box.w - 0.16, h: box.h - 0.16 });
  slide.addImage({ path: file, x: rect.x, y: rect.y, w: rect.w, h: rect.h });
  return rect;
}

function badge(slide, n, x, y, color = C.red) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x: x - 0.16,
    y: y - 0.16,
    w: 0.32,
    h: 0.32,
    fill: { color },
    line: { color: C.white, width: 1.6 },
    shadow: { type: "outer", color: "334155", opacity: 0.25, blur: 1, angle: 45, distance: 1 },
  });
  slide.addText(String(n), {
    x: x - 0.16,
    y: y - 0.085,
    w: 0.32,
    h: 0.12,
    fontFace: "Aptos",
    fontSize: 8,
    bold: true,
    color: C.white,
    align: "center",
    margin: 0,
  });
}

function addCallouts(slide, rect, points) {
  points.forEach((pt, i) => {
    const x = rect.x + rect.w * pt.x;
    const y = rect.y + rect.h * pt.y;
    badge(slide, pt.n || i + 1, x, y, pt.color || C.red);
  });
}

function tip(slide, text, x = 0.72, y = 6.54, w = 8.35) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.35,
    rectRadius: 0.05,
    fill: { color: C.mint },
    line: { color: "A7D9D2" },
  });
  slide.addText(text, {
    x: x + 0.18,
    y: y + 0.085,
    w: w - 0.36,
    h: 0.12,
    fontFace: "Malgun Gothic",
    fontSize: 8.8,
    bold: true,
    color: C.teal,
    margin: 0,
    fit: "shrink",
  });
}

function followSlide(num, cfg) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  header(slide, cfg.title, cfg.section);
  const rect = screenshot(slide, cfg.image, cfg.box || { x: 0.58, y: 1.12, w: 8.52, h: 5.62 });
  addCallouts(slide, rect, cfg.points || []);
  stepPanel(slide, cfg.panelTitle || "따라하기", cfg.steps, cfg.note || "");
  if (cfg.tip) tip(slide, cfg.tip);
  footer(slide, num, cfg.section);
}

let n = 1;

{
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: C.navy }, line: { color: C.navy } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.22, h: 7.5, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addText("GS", { x: 0.86, y: 0.84, w: 0.52, h: 0.2, fontFace: "Aptos", fontSize: 9, bold: true, color: "7BE0D4", margin: 0 });
  slide.addText("SAFETY CHECKLIST", { x: 1.36, y: 0.84, w: 2.65, h: 0.2, fontFace: "Aptos", fontSize: 8, bold: true, color: "7BE0D4", charSpace: 1.4, margin: 0 });
  slide.addText("따라하기\n사용설명서", { x: 0.82, y: 1.55, w: 5.8, h: 1.35, fontFace: "Malgun Gothic", fontSize: 34, bold: true, color: C.white, margin: 0, fit: "shrink" });
  slide.addText("화면에 표시된 번호 순서대로 누르면 됩니다.", { x: 0.88, y: 3.12, w: 6.2, h: 0.32, fontFace: "Malgun Gothic", fontSize: 14, color: "CFE7EF", margin: 0, fit: "shrink" });
  slide.addShape(pptx.ShapeType.roundRect, { x: 8.05, y: 1.2, w: 3.95, h: 3.2, rectRadius: 0.05, fill: { color: C.deep }, line: { color: "315164" } });
  slide.addText("기준 화면", { x: 8.36, y: 1.52, w: 1.6, h: 0.22, fontFace: "Malgun Gothic", fontSize: 11, bold: true, color: "7BE0D4", margin: 0 });
  slide.addText("작업자 로그인\n작업 전 점검\n불안전요소 등록\n자재누락 등록\n점검 이력\n관리자 푸시 운영", { x: 8.36, y: 1.98, w: 3.12, h: 1.6, fontFace: "Malgun Gothic", fontSize: 12, color: C.white, margin: 0, fit: "shrink", breakLine: false });
  slide.addText("v0.5 · 2026.05 · gs-safety-checklist.vercel.app", { x: 0.88, y: 5.92, w: 5.6, h: 0.22, fontFace: "Aptos", fontSize: 9.5, color: "B9D5DE", margin: 0, fit: "shrink" });
  footer(slide, n++, "START");
}

{
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  header(slide, "전체 흐름", "OVERVIEW");
  const flows = [
    ["1", "로그인", "작업자 선택 + 사번 입력"],
    ["2", "홈", "오늘 점검 상태 확인"],
    ["3", "작업 전 점검", "작업지시서 또는 직접 점검"],
    ["4", "현장 접수", "불안전요소/자재누락 등록"],
    ["5", "이력 확인", "제출 결과와 처리 현황 조회"],
    ["6", "관리", "작업자/푸시/접수 상태 운영"],
  ];
  flows.forEach((row, i) => {
    const x = 0.75 + (i % 3) * 4.12;
    const y = 1.35 + Math.floor(i / 3) * 2.05;
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 3.55, h: 1.42, rectRadius: 0.05, fill: { color: C.white }, line: { color: C.line } });
    badge(slide, row[0], x + 0.42, y + 0.42, i === 5 ? C.purple : C.teal);
    slide.addText(row[1], { x: x + 0.86, y: y + 0.28, w: 2.3, h: 0.22, fontFace: "Malgun Gothic", fontSize: 13, bold: true, color: C.ink, margin: 0, fit: "shrink" });
    slide.addText(row[2], { x: x + 0.86, y: y + 0.72, w: 2.3, h: 0.28, fontFace: "Malgun Gothic", fontSize: 10, color: C.muted, margin: 0, fit: "shrink" });
  });
  tip(slide, "이 PPT는 기능 설명보다 실제 조작 순서를 우선합니다. 각 화면의 빨간 번호를 오른쪽 설명과 맞춰 보세요.", 0.9, 5.9, 11.25);
  footer(slide, n++, "OVERVIEW");
}

followSlide(n++, {
  section: "LOGIN",
  title: "1. 작업자 로그인",
  image: shot(claudeShots, "01-worker-login.png"),
  points: [{ x: 0.64, y: 0.30 }, { x: 0.64, y: 0.44 }, { x: 0.64, y: 0.58 }],
  panelTitle: "로그인 순서",
  steps: [
    { text: "작업자 선택에서 본인 이름을 고릅니다." },
    { text: "사번 입력 칸에 본인 사번을 입력합니다." },
    { text: "로그인을 눌러 홈 화면으로 들어갑니다." },
  ],
  tip: "사번이 없거나 틀리면 관리자에게 작업자 정보 등록 상태를 확인받습니다.",
});

followSlide(n++, {
  section: "HOME",
  title: "2. 홈에서 오늘 상태 확인",
  image: shot(claudeShots, "02-home-dashboard.png"),
  points: [{ x: 0.37, y: 0.20 }, { x: 0.54, y: 0.20 }, { x: 0.70, y: 0.20 }, { x: 0.83, y: 0.33 }, { x: 0.49, y: 0.69 }],
  panelTitle: "홈에서 할 일",
  steps: [
    { text: "작업 전 점검 시작을 누릅니다." },
    { text: "위험 발견 시 불안전요소 등록으로 갑니다." },
    { text: "자재가 없으면 자재누락 등록으로 갑니다." },
    { text: "오늘 점검 완료율을 확인합니다." },
    { text: "공정 현황에서 호선 상태를 확인합니다." },
  ],
});

followSlide(n++, {
  section: "CHECK",
  title: "3. 작업지시서에서 점검 시작",
  image: shot(claudeShots, "03-work-order-list.png"),
  points: [{ x: 0.52, y: 0.22 }, { x: 0.49, y: 0.43 }, { x: 0.79, y: 0.47 }],
  panelTitle: "작업지시서 점검",
  steps: [
    { text: "오늘 날짜의 작업지시서를 확인합니다." },
    { text: "본인이 포함된 작업 카드의 호선과 작업명을 봅니다." },
    { text: "점검 대기 버튼을 눌러 점검을 시작합니다." },
  ],
  tip: "작업지시서 등록 인원이 모두 제출하면 카드 상태가 점검 완료로 바뀝니다.",
});

followSlide(n++, {
  section: "CHECK",
  title: "4. 작업지시서가 없을 때 직접 선택",
  image: shot(claudeShots, "04-direct-work-select.png"),
  points: [{ x: 0.55, y: 0.33 }, { x: 0.54, y: 0.45 }, { x: 0.54, y: 0.57 }],
  panelTitle: "직접 점검",
  steps: [
    { text: "점검할 작업 유형을 선택합니다." },
    { text: "오늘 작업 호선을 선택합니다." },
    { text: "다음 단계로 넘어가 점검을 계속합니다." },
  ],
});

followSlide(n++, {
  section: "CHECK",
  title: "5. 작업 준비와 공기구 확인",
  image: shot(claudeShots, "05-tool-prep-confirm.png"),
  points: [{ x: 0.49, y: 0.28 }, { x: 0.50, y: 0.56 }, { x: 0.50, y: 0.81 }],
  panelTitle: "공기구 확인",
  steps: [
    { text: "작업 준비 안내 문구를 확인합니다." },
    { text: "필요 공기구와 장비를 현장에서 확인합니다." },
    { text: "준비가 끝나면 다음으로 이동합니다." },
  ],
  tip: "작업지시서 기반 점검에서는 등록된 공기구가 잠긴 상태로 표시됩니다.",
});

followSlide(n++, {
  section: "CHECK",
  title: "6. 체크리스트 작성 후 제출",
  image: shot(claudeShots, "06-checklist-write.png"),
  points: [{ x: 0.50, y: 0.25 }, { x: 0.50, y: 0.52 }, { x: 0.49, y: 0.82 }],
  panelTitle: "제출 순서",
  steps: [
    { text: "안전 서약과 점검 항목을 확인합니다." },
    { text: "해당 항목을 체크하고 필요한 내용을 입력합니다." },
    { text: "제출 버튼을 눌러 점검 이력에 저장합니다." },
  ],
});

followSlide(n++, {
  section: "UNSAFE",
  title: "7. 불안전요소 호선 선택",
  image: shot(claudeShots, "07-unsafe-ship-select.png"),
  points: [{ x: 0.55, y: 0.39 }, { x: 0.55, y: 0.62 }],
  panelTitle: "위험 접수 시작",
  steps: [
    { text: "불안전요소가 발생한 호선을 선택합니다." },
    { text: "다음 단계로 이동해 내용을 입력합니다." },
  ],
});

followSlide(n++, {
  section: "UNSAFE",
  title: "8. 불안전요소 내용 입력",
  image: shot(claudeShots, "08-unsafe-content-input.png"),
  points: [{ x: 0.50, y: 0.31 }, { x: 0.50, y: 0.57 }, { x: 0.50, y: 0.83 }],
  panelTitle: "내용 입력",
  steps: [
    { text: "위험 내용을 구체적으로 입력합니다." },
    { text: "필요하면 사진을 첨부합니다." },
    { text: "확인 단계로 넘어갑니다." },
  ],
  tip: "등록 후 지정된 작업자에게 불안전요소 푸시가 발송됩니다.",
});

followSlide(n++, {
  section: "UNSAFE",
  title: "9. 불안전요소 확인 후 제출",
  image: shot(claudeShots, "09-unsafe-confirm.png"),
  points: [{ x: 0.50, y: 0.38 }, { x: 0.50, y: 0.78 }],
  panelTitle: "제출 전 확인",
  steps: [
    { text: "호선, 내용, 사진이 맞는지 확인합니다." },
    { text: "제출 버튼을 눌러 관리자 처리 목록에 접수합니다." },
  ],
});

followSlide(n++, {
  section: "MATERIAL",
  title: "10. 자재누락 호선 선택",
  image: shot(claudeShots, "10-material-ship-select.png"),
  points: [{ x: 0.55, y: 0.40 }, { x: 0.55, y: 0.62 }],
  panelTitle: "누락 접수 시작",
  steps: [
    { text: "자재가 누락된 호선을 선택합니다." },
    { text: "다음 단계로 이동해 자재 정보를 입력합니다." },
  ],
});

followSlide(n++, {
  section: "MATERIAL",
  title: "11. 자재누락 정보 입력",
  image: shot(claudeShots, "11-material-info-input.png"),
  points: [{ x: 0.50, y: 0.31 }, { x: 0.50, y: 0.48 }, { x: 0.50, y: 0.70 }],
  panelTitle: "자재 정보",
  steps: [
    { text: "누락 자재명을 입력합니다." },
    { text: "수량과 상세 내용을 입력합니다." },
    { text: "필요하면 사진을 첨부하고 확인 단계로 이동합니다." },
  ],
});

followSlide(n++, {
  section: "MATERIAL",
  title: "12. 자재누락 확인 후 제출",
  image: shot(claudeShots, "12-material-confirm.png"),
  points: [{ x: 0.50, y: 0.38 }, { x: 0.50, y: 0.80 }],
  panelTitle: "제출 전 확인",
  steps: [
    { text: "호선, 자재명, 내용이 맞는지 확인합니다." },
    { text: "제출 버튼을 눌러 관리자 처리 목록에 접수합니다." },
  ],
});

followSlide(n++, {
  section: "HISTORY",
  title: "13. 점검 이력 조회",
  image: shot(claudeShots, "13-history-list.png"),
  points: [{ x: 0.45, y: 0.26 }, { x: 0.50, y: 0.49 }, { x: 0.50, y: 0.74 }],
  panelTitle: "이력 확인",
  steps: [
    { text: "점검 이력 메뉴로 이동합니다." },
    { text: "날짜, 작업자, 호선 기준으로 확인합니다." },
    { text: "카드를 열어 제출 내용을 확인합니다." },
  ],
});

followSlide(n++, {
  section: "PLEDGE",
  title: "14. 서약 미완료자 알림",
  image: shot(prodShots, "08-pledge.png"),
  points: [{ x: 0.48, y: 0.33 }, { x: 0.86, y: 0.33 }, { x: 0.78, y: 0.25 }],
  panelTitle: "서약 관리",
  steps: [
    { text: "오늘 서약 현황 표에서 미완료자를 확인합니다." },
    { text: "미완료자 알림 발송을 누릅니다." },
    { text: "푸시 문구 수정으로 안내 문구를 바꿉니다." },
  ],
  tip: "알림은 표에서 미완료 상태인 작업자에게만 발송됩니다.",
});

followSlide(n++, {
  section: "ADMIN",
  title: "15. 작업자와 알림 기기 관리",
  image: shot(prodShots, "10-manage-workers.png"),
  points: [{ x: 0.42, y: 0.19 }, { x: 0.79, y: 0.32 }, { x: 0.88, y: 0.41 }],
  panelTitle: "작업자 관리",
  steps: [
    { text: "관리 메뉴에서 작업자 탭을 엽니다." },
    { text: "작업자 카드의 알림 배지를 확인합니다." },
    { text: "알림수정으로 기기명/상태/삭제를 관리합니다." },
  ],
});

followSlide(n++, {
  section: "PUSH",
  title: "16. 관리 > 푸시 발송",
  image: shot(prodShots, "11-manage-push.png"),
  points: [{ x: 0.49, y: 0.31 }, { x: 0.75, y: 0.32 }, { x: 0.75, y: 0.72 }, { x: 0.91, y: 0.87 }],
  panelTitle: "수동 푸시",
  steps: [
    { text: "제목과 내용을 입력합니다." },
    { text: "일반/주의/긴급/완료 스타일을 선택합니다." },
    { text: "구독/전체/선택 작업자 중 대상을 고릅니다." },
    { text: "미리보기 확인 후 즉시 발송합니다." },
  ],
  tip: "관리자 수정 모드와 조장/총무/관리 권한이 모두 필요합니다.",
});

followSlide(n++, {
  section: "ADMIN",
  title: "17. 불안전요소 처리",
  image: shot(prodShots, "12-manage-unsafe.png"),
  points: [{ x: 0.42, y: 0.20 }, { x: 0.78, y: 0.23 }, { x: 0.86, y: 0.23 }],
  panelTitle: "접수 처리",
  steps: [
    { text: "관리 메뉴에서 불안전요소 탭을 엽니다." },
    { text: "내보내기 또는 이력 초기화를 수행합니다." },
    { text: "신규 버튼으로 관리자 직접 등록도 가능합니다." },
  ],
});

{
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: C.navy }, line: { color: C.navy } });
  slide.addText("운영 전 마지막 확인", { x: 0.82, y: 0.92, w: 6.4, h: 0.5, fontFace: "Malgun Gothic", fontSize: 27, bold: true, color: C.white, margin: 0 });
  const checks = [
    "좌측 상태가 온라인인지 확인",
    "작업자 로그인과 사번 검증 확인",
    "오늘 호선과 작업지시서가 맞는지 확인",
    "푸시 대상 작업자의 휴대폰 알림 등록 확인",
    "운영 푸시는 테스트 문구와 구분해서 발송",
  ];
  checks.forEach((text, i) => {
    badge(slide, i + 1, 1.04, 2.08 + i * 0.63, C.teal);
    slide.addText(text, { x: 1.42, y: 1.98 + i * 0.63, w: 6.5, h: 0.28, fontFace: "Malgun Gothic", fontSize: 13, color: "D9EEF3", margin: 0, fit: "shrink" });
  });
  slide.addShape(pptx.ShapeType.roundRect, { x: 8.24, y: 1.48, w: 3.65, h: 2.35, rectRadius: 0.05, fill: { color: C.deep }, line: { color: "315164" } });
  slide.addText("기준 주소", { x: 8.52, y: 1.84, w: 1.2, h: 0.2, fontFace: "Malgun Gothic", fontSize: 10.5, bold: true, color: "7BE0D4", margin: 0 });
  slide.addText("https://gs-safety-checklist.vercel.app\n\nversion 0.5", { x: 8.52, y: 2.25, w: 3.0, h: 0.7, fontFace: "Aptos", fontSize: 11, color: C.white, margin: 0, fit: "shrink" });
  footer(slide, n++, "CHECKLIST");
}

await pptx.writeFile({ fileName: outputPath });
console.log(JSON.stringify({ outputPath, slides: pptx._slides.length, bytes: fs.statSync(outputPath).size }, null, 2));
