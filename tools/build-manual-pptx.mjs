import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const runtimeNodeModules = "C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const tempNodeModules = path.join(process.env.TEMP || process.env.TMP || "C:/Windows/Temp", "gs-manual-pptx-node", "node_modules");
const require = createRequire(import.meta.url);
const pptxgen = require(require.resolve("pptxgenjs", { paths: [tempNodeModules, runtimeNodeModules] }));

const root = path.resolve("C:/Users/User/GS_CHECKLIST/shipyard-checklist");
const manualPath = path.join(root, "docs/manual/gs-safety-checklist-user-manual-2026-05-25.md");
const outputPath = path.join(root, "docs/manual/gs-safety-checklist-user-manual-2026-05-25.pptx");

if (!fs.existsSync(manualPath)) {
  throw new Error(`Manual not found: ${manualPath}`);
}

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "GS Safety Checklist";
pptx.company = "(주)지에스";
pptx.subject = "GS 안전 체크리스트 웹페이지 사용설명서";
pptx.title = "GS 안전 체크리스트 사용설명서";
pptx.lang = "ko-KR";
pptx.theme = {
  headFontFace: "Malgun Gothic",
  bodyFontFace: "Malgun Gothic",
  lang: "ko-KR",
};
pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });

const C = {
  navy: "0F1E2C",
  navy2: "132A3A",
  teal: "0F766E",
  teal2: "0B8A82",
  mint: "E7F6F3",
  line: "D8E3EA",
  ink: "102033",
  muted: "587083",
  bg: "F7FAFC",
  white: "FFFFFF",
  amber: "F59E0B",
  red: "DC2626",
  purple: "6D5BD0",
};

const W = 13.333;
const H = 7.5;
const margin = 0.55;

function addFooter(slide, n, section = "") {
  slide.addShape(pptx.ShapeType.line, {
    x: margin,
    y: 7.08,
    w: W - margin * 2,
    h: 0,
    line: { color: C.line, width: 1 },
  });
  slide.addText("GS 안전 체크리스트 사용설명서", {
    x: margin,
    y: 7.16,
    w: 4.3,
    h: 0.18,
    fontFace: "Malgun Gothic",
    fontSize: 6.8,
    color: C.muted,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(section, {
    x: 5.0,
    y: 7.16,
    w: 3.3,
    h: 0.18,
    fontFace: "Malgun Gothic",
    fontSize: 6.8,
    color: C.muted,
    bold: true,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: 12.15,
    y: 7.11,
    w: 0.55,
    h: 0.28,
    fontFace: "Aptos",
    fontSize: 8,
    color: C.teal,
    bold: true,
    align: "right",
    margin: 0,
  });
}

function addHeader(slide, title, kicker = "USER MANUAL") {
  slide.addText(kicker, {
    x: margin,
    y: 0.28,
    w: 3.2,
    h: 0.22,
    fontFace: "Aptos",
    fontSize: 7.6,
    bold: true,
    color: C.teal,
    charSpace: 1.4,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(title, {
    x: margin,
    y: 0.55,
    w: 8.7,
    h: 0.45,
    fontFace: "Malgun Gothic",
    fontSize: 22,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
}

function addTag(slide, text, x, y, color = C.teal) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w: Math.max(1.1, text.length * 0.12 + 0.38),
    h: 0.28,
    rectRadius: 0.05,
    fill: { color: "FFFFFF", transparency: 0 },
    line: { color, transparency: 15 },
  });
  slide.addText(text, {
    x: x + 0.12,
    y: y + 0.065,
    w: Math.max(0.85, text.length * 0.12),
    h: 0.12,
    fontFace: "Malgun Gothic",
    fontSize: 6.9,
    bold: true,
    color,
    margin: 0,
    fit: "shrink",
  });
}

function bullet(slide, items, x, y, w, opts = {}) {
  const lineH = opts.lineH || 0.42;
  items.forEach((item, i) => {
    const yy = y + i * lineH;
    slide.addShape(pptx.ShapeType.ellipse, {
      x,
      y: yy + 0.09,
      w: 0.09,
      h: 0.09,
      fill: { color: opts.dot || C.teal },
      line: { color: opts.dot || C.teal },
    });
    slide.addText(item, {
      x: x + 0.18,
      y: yy,
      w,
      h: lineH * 0.86,
      fontFace: "Malgun Gothic",
      fontSize: opts.size || 12,
      color: opts.color || C.ink,
      breakLine: false,
      fit: "shrink",
      margin: 0,
      valign: "mid",
    });
  });
}

function card(slide, { x, y, w, h, title, body, color = C.teal, fill = "FFFFFF" }) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    fill: { color: fill },
    line: { color: C.line, width: 1 },
    shadow: { type: "outer", color: "B7C8D4", opacity: 0.13, blur: 1, angle: 45, distance: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w: 0.06,
    h,
    fill: { color },
    line: { color },
  });
  slide.addText(title, {
    x: x + 0.22,
    y: y + 0.18,
    w: w - 0.4,
    h: 0.24,
    fontFace: "Malgun Gothic",
    fontSize: 12,
    bold: true,
    color,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(body, {
    x: x + 0.22,
    y: y + 0.54,
    w: w - 0.38,
    h: h - 0.68,
    fontFace: "Malgun Gothic",
    fontSize: 9.2,
    color: C.ink,
    breakLine: false,
    fit: "shrink",
    margin: 0,
    valign: "top",
  });
}

function sectionSlide(n, title, subtitle, tags = []) {
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.navy }, line: { color: C.navy } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.22, h: H, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addText("GS SAFETY CHECKLIST", {
    x: 0.75,
    y: 1.1,
    w: 4.2,
    h: 0.28,
    fontFace: "Aptos",
    fontSize: 8,
    bold: true,
    color: "7BE0D4",
    charSpace: 1.8,
    margin: 0,
  });
  slide.addText(title, {
    x: 0.72,
    y: 1.55,
    w: 8.4,
    h: 1.0,
    fontFace: "Malgun Gothic",
    fontSize: 28,
    bold: true,
    color: C.white,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(subtitle, {
    x: 0.76,
    y: 2.75,
    w: 7.4,
    h: 0.78,
    fontFace: "Malgun Gothic",
    fontSize: 13,
    color: "CFE7EF",
    margin: 0,
    fit: "shrink",
  });
  tags.forEach((t, i) => addTag(slide, t, 0.76 + i * 1.5, 3.78, "7BE0D4"));
  slide.addText(String(n).padStart(2, "0"), {
    x: 10.9,
    y: 4.7,
    w: 1.5,
    h: 0.72,
    fontFace: "Aptos",
    fontSize: 34,
    bold: true,
    color: "244250",
    align: "right",
    margin: 0,
  });
  return slide;
}

function contentSlide(n, title, section, builder) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  addHeader(slide, title, section);
  builder(slide);
  addFooter(slide, n, section);
  return slide;
}

let n = 1;

{
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.navy }, line: { color: C.navy } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.35, y: 0.35, w: W - 0.7, h: H - 0.7, fill: { color: C.navy }, line: { color: "315164", width: 1.1 } });
  slide.addText("(주)지에스", { x: 0.85, y: 0.86, w: 2.0, h: 0.3, fontFace: "Malgun Gothic", fontSize: 12, bold: true, color: C.white, margin: 0 });
  slide.addText("안전 체크리스트", { x: 0.85, y: 1.2, w: 4.2, h: 0.44, fontFace: "Malgun Gothic", fontSize: 22, bold: true, color: C.white, margin: 0 });
  slide.addText("웹페이지 사용설명서", { x: 0.82, y: 2.15, w: 8.8, h: 0.78, fontFace: "Malgun Gothic", fontSize: 34, bold: true, color: C.white, margin: 0, fit: "shrink" });
  slide.addText("작업 전 점검 · 서약 · 불안전요소 · 자재누락 · 푸시 알림 운영", { x: 0.88, y: 3.16, w: 8.0, h: 0.35, fontFace: "Malgun Gothic", fontSize: 14, color: "CFE7EF", margin: 0, fit: "shrink" });
  card(slide, { x: 8.7, y: 1.06, w: 3.55, h: 3.15, title: "기준", body: "배포 주소\nhttps://gs-safety-checklist.vercel.app\n\n버전\n0.5-20260525\n\n작성일\n2026-05-25", color: "7BE0D4", fill: "102A3A" });
  slide.addText("현장 작업자와 운영 관리자가 같은 기준으로 사용하는 절차서", { x: 0.88, y: 5.82, w: 7.6, h: 0.34, fontFace: "Malgun Gothic", fontSize: 12, color: "D9EEF3", margin: 0, fit: "shrink" });
  addFooter(slide, n++, "OVERVIEW");
}

contentSlide(n++, "목차", "OVERVIEW", (slide) => {
  const items = [
    ["기본 사용", "접속, 로그인, 동기화, 브라우저 알림 등록"],
    ["현장 업무", "홈, 작업 전 점검, 불안전요소, 자재누락, 서약"],
    ["운영 관리", "호선, 작업자, 항목, 이력, 관리 탭"],
    ["푸시 알림", "대상 선택, 문구/스타일, 권한, 수신 테스트"],
    ["문제 해결", "동기화 차이, 알림 미수신, 관리자 버튼 비활성"],
  ];
  items.forEach((row, i) => card(slide, {
    x: 0.72 + (i % 2) * 5.85,
    y: 1.42 + Math.floor(i / 2) * 1.23,
    w: i === 4 ? 11.65 : 5.45,
    h: 0.95,
    title: row[0],
    body: row[1],
    color: i === 3 ? C.purple : C.teal,
  }));
});

contentSlide(n++, "사용자와 권한", "BASIC", (slide) => {
  card(slide, { x: 0.7, y: 1.35, w: 3.7, h: 3.9, title: "작업자", body: "본인 사번으로 로그인\n작업 전 점검 제출\n불안전요소/자재누락 등록\n본인 단말 알림 등록", color: C.teal });
  card(slide, { x: 4.82, y: 1.35, w: 3.7, h: 3.9, title: "조장", body: "작업자 기능 포함\n작업지시서 등록/관리\n서약 미완료자 알림 발송\n수동 푸시 발송 권한", color: C.amber });
  card(slide, { x: 8.94, y: 1.35, w: 3.7, h: 3.9, title: "총무/관리", body: "조장 발송 권한 포함\n관리자 수정 모드 운영\n작업자/알림 기기 관리\n접수 항목 상태 처리", color: C.purple });
  slide.addText("중요: 푸시 발송은 관리자 수정 모드와 조장/총무/관리 로그인 권한이 모두 필요합니다.", { x: 1.0, y: 5.82, w: 11.0, h: 0.38, fontFace: "Malgun Gothic", fontSize: 13, bold: true, color: C.red, margin: 0, fit: "shrink" });
});

contentSlide(n++, "접속 · 로그인 · 동기화", "BASIC", (slide) => {
  bullet(slide, [
    "사이트 접속 후 작업자 목록에서 본인 이름을 선택합니다.",
    "사번을 입력하면 서버의 작업자 로그인 검증을 거쳐 로그인됩니다.",
    "좌측 사이드바 또는 모바일 상단에서 작업자 이름과 로그아웃 버튼을 확인합니다.",
    "동기화 상태가 온라인인지 확인한 뒤 작업을 시작합니다.",
    "서버 확인 중 또는 로컬 저장 상태가 오래 지속되면 새로고침 후 다시 확인합니다.",
  ], 0.9, 1.42, 10.9, { size: 13, lineH: 0.58 });
  card(slide, { x: 8.55, y: 4.68, w: 3.55, h: 1.35, title: "동기화 기준", body: "작업자는 항상 원격 서버 기준 데이터를 우선 확인해야 합니다.", color: C.teal, fill: C.mint });
});

sectionSlide(n++, "현장 작업 흐름", "작업자는 홈에서 오늘 상태를 확인하고, 작업 전 점검과 현장 접수를 진행합니다.", ["작업자", "모바일", "현장"]);

contentSlide(n++, "홈 대시보드", "FIELD", (slide) => {
  card(slide, { x: 0.7, y: 1.32, w: 3.75, h: 1.5, title: "작업 전 점검 시작", body: "오늘 점검 또는 작업지시서 기반 점검으로 이동합니다.", color: C.teal });
  card(slide, { x: 4.8, y: 1.32, w: 3.75, h: 1.5, title: "불안전요소 등록", body: "현장 위험요소를 즉시 접수하고 관리자에게 전달합니다.", color: C.red });
  card(slide, { x: 8.9, y: 1.32, w: 3.75, h: 1.5, title: "자재누락 등록", body: "누락 자재를 호선 기준으로 접수합니다.", color: C.purple });
  bullet(slide, [
    "오늘 점검 대기/호선/완료율 확인",
    "불안전요소, 누락 자재, 인도 예정 수량 확인",
    "공정 현황에서 탑재, L/C, S/T, C/L, D/L 상태 확인",
  ], 0.95, 3.55, 10.8, { size: 13, lineH: 0.56 });
});

contentSlide(n++, "작업 전 점검", "FIELD", (slide) => {
  card(slide, { x: 0.72, y: 1.28, w: 5.65, h: 4.42, title: "작업지시서 기반 점검", body: "1. 오늘 작업지시서를 선택합니다.\n2. 등록된 호선과 작업 유형을 확인합니다.\n3. STEP 2 공기구는 작업지시서 기준으로 표시되고 선택은 잠깁니다.\n4. STEP 3 호선은 작업지시서 호선과 일치합니다.\n5. 등록 인원이 모두 제출하면 점검 완료 상태가 됩니다.", color: C.teal });
  card(slide, { x: 6.82, y: 1.28, w: 5.65, h: 4.42, title: "직접 점검", body: "작업지시서가 없거나 즉시 점검이 필요한 경우 작업 유형과 호선을 직접 선택합니다.\n\n서약, 공기구, 체크 항목을 완료한 뒤 제출하면 점검 이력에 반영됩니다.", color: C.amber });
});

contentSlide(n++, "불안전요소 · 자재누락 등록", "FIELD", (slide) => {
  card(slide, { x: 0.72, y: 1.25, w: 5.65, h: 4.45, title: "불안전요소", body: "호선 선택\n위험 내용 입력\n사진 첨부\n확인 후 제출\n\n제출 후 관리 화면에 접수되고 지정 대상자에게 푸시가 발송됩니다.", color: C.red });
  card(slide, { x: 6.82, y: 1.25, w: 5.65, h: 4.45, title: "자재누락", body: "호선 선택\n누락 자재명 입력\n상세 내용 입력\n사진 첨부\n확인 후 제출\n\n처리 결과는 관리 화면과 관련 목록에서 확인합니다.", color: C.purple });
  slide.addText("호선 목록은 호선 관리에 등록된 원격 데이터를 기준으로 함께 반영됩니다.", { x: 0.95, y: 6.05, w: 11.2, h: 0.3, fontFace: "Malgun Gothic", fontSize: 12, bold: true, color: C.teal, margin: 0, fit: "shrink" });
});

contentSlide(n++, "서약 · 통계 · 이력", "FIELD", (slide) => {
  card(slide, { x: 0.7, y: 1.26, w: 3.7, h: 4.45, title: "서약", body: "오늘 작업자별 안전 서약 상태를 확인합니다.\n\n미완료자 알림은 표에서 미완료인 작업자에게만 발송됩니다.", color: C.teal });
  card(slide, { x: 4.82, y: 1.26, w: 3.7, h: 4.45, title: "통계", body: "점검, 서약, 불안전요소, 자재누락 데이터를 요약합니다.\n\n숫자가 이상하면 필터와 동기화 상태를 먼저 확인합니다.", color: C.purple });
  card(slide, { x: 8.94, y: 1.26, w: 3.7, h: 4.45, title: "점검 이력", body: "제출된 점검 결과를 날짜/작업자/호선 기준으로 확인합니다.\n\n관리자 수정 모드에서는 선택 삭제와 초기화가 가능합니다.", color: C.amber });
});

sectionSlide(n++, "운영 관리 흐름", "관리자는 호선, 작업자, 항목, 접수 기록을 최신 상태로 유지합니다.", ["관리자", "데스크톱", "데이터"]);

contentSlide(n++, "호선 · 빠른 메뉴", "ADMIN", (slide) => {
  card(slide, { x: 0.72, y: 1.25, w: 5.65, h: 4.6, title: "호선", body: "호선 추가/수정\n공정 상태와 날짜 관리\n표시 순서 저장\n데스크톱 엑셀 내보내기/불러오기\n\n불안전요소와 자재누락의 호선 선택 목록에도 반영됩니다.", color: C.teal });
  card(slide, { x: 6.82, y: 1.25, w: 5.65, h: 4.6, title: "빠른 메뉴", body: "작업 유형 관리\n섹션과 점검 항목 관리\n공기구 추가/수정/삭제\n작업 유형별 공기구 지정\n사용자 지정 픽토그램 관리", color: C.purple });
});

contentSlide(n++, "관리 메뉴 구조", "ADMIN", (slide) => {
  const rows = [
    ["작업자", "작업자 정보, 직책, 조장 지정, 알림 기기 관리"],
    ["푸시", "수동 푸시 발송, 대상 선택, 문구/스타일 관리"],
    ["불안전요소", "접수 목록, 상태 처리, 사진 확인, 내보내기"],
    ["자재누락", "누락 자재 접수 목록, 상태 처리, 이력 초기화"],
  ];
  rows.forEach((row, i) => card(slide, {
    x: 0.78 + (i % 2) * 5.82,
    y: 1.36 + Math.floor(i / 2) * 1.65,
    w: 5.35,
    h: 1.22,
    title: row[0],
    body: row[1],
    color: i === 1 ? C.red : C.teal,
  }));
  slide.addText("관리자 수정 모드가 꺼져 있으면 일부 목록 조회만 가능하고 상태 변경/삭제/초기화는 제한됩니다.", { x: 0.95, y: 5.58, w: 11.0, h: 0.34, fontFace: "Malgun Gothic", fontSize: 12.6, bold: true, color: C.ink, margin: 0, fit: "shrink" });
});

contentSlide(n++, "작업자 관리", "ADMIN", (slide) => {
  bullet(slide, [
    "작업자 추가, 이름/팀/직책 수정, 삭제를 수행합니다.",
    "조장 지정 또는 작업자 변경으로 작업지시서/푸시 권한 흐름을 관리합니다.",
    "작업자 카드의 알림 배지로 대상자별 구독 상태를 확인합니다.",
    "`알림수정`에서 등록 기기명 수정, 활성/비활성, 삭제를 처리합니다.",
    "푸시 수신 문제는 먼저 해당 작업자의 등록 단말 수를 확인합니다.",
  ], 0.95, 1.42, 10.8, { size: 12.8, lineH: 0.58 });
});

sectionSlide(n++, "푸시 알림 운영", "작업자별 실제 휴대폰/PC 단말 등록 상태를 기준으로 안전 알림을 발송합니다.", ["푸시", "권한", "수신 확인"]);

contentSlide(n++, "알림 등록과 테스트", "PUSH", (slide) => {
  card(slide, { x: 0.72, y: 1.28, w: 5.65, h: 4.55, title: "작업자 단말 등록", body: "1. 작업자 본인으로 로그인합니다.\n2. 휴대폰/PC 알림 등록 버튼을 누릅니다.\n3. 브라우저 권한 팝업에서 허용합니다.\n4. 등록 완료 상태로 바뀌는지 확인합니다.", color: C.teal });
  card(slide, { x: 6.82, y: 1.28, w: 5.65, h: 4.55, title: "수신 테스트", body: "테스트 알림으로 현재 단말 수신 여부를 확인합니다.\n\n모바일은 OS 알림 권한, 브라우저 알림 권한, 홈 화면 추가 상태를 함께 확인합니다.", color: C.amber });
});

contentSlide(n++, "관리 > 푸시 탭", "PUSH", (slide) => {
  card(slide, { x: 0.72, y: 1.22, w: 3.65, h: 4.75, title: "발송 대상", body: "구독 작업자\n전체 작업자\n선택 작업자\n\n알림 미등록자는 대상에 있어도 실제 수신되지 않습니다.", color: C.teal });
  card(slide, { x: 4.84, y: 1.22, w: 3.65, h: 4.75, title: "문구", body: "제목\n내용\n클릭 이동 화면\n\n토큰\n{날짜}\n{발신자}\n{대상수}", color: C.purple });
  card(slide, { x: 8.96, y: 1.22, w: 3.65, h: 4.75, title: "스타일", body: "일반\n주의\n긴급\n완료\n\n모바일 알림 모양은 OS/브라우저 정책을 따르며, 스타일은 접두어/유지/진동에 반영됩니다.", color: C.red });
});

contentSlide(n++, "푸시 발송 권한", "PUSH", (slide) => {
  bullet(slide, [
    "관리자 수정 모드가 켜져 있어야 합니다.",
    "로그인 작업자가 조장/총무/관리 권한이어야 합니다.",
    "대상 작업자에게 활성 알림 단말이 등록되어 있어야 합니다.",
    "제목과 내용이 비어 있지 않아야 합니다.",
    "권한이 없거나 허용되지 않은 발송 종류는 서버에서 차단됩니다.",
  ], 0.95, 1.4, 10.8, { size: 13, lineH: 0.58, dot: C.red });
  card(slide, { x: 1.05, y: 5.1, w: 10.9, h: 0.85, title: "운영 기준", body: "관리자 모드와 작업자 권한을 둘 다 만족해야 실제 푸시가 발송됩니다.", color: C.red, fill: "FFF5F5" });
});

sectionSlide(n++, "운영 점검과 문제 해결", "매일 같은 기준으로 동기화, 알림, 데이터 상태를 확인합니다.", ["점검", "장애 대응", "운영"]);

contentSlide(n++, "매일 운영 점검", "CHECKLIST", (slide) => {
  bullet(slide, [
    "좌측 동기화 상태가 온라인인지 확인합니다.",
    "작업자 로그인과 사번 검증이 되는지 확인합니다.",
    "홈의 오늘 점검 수치가 현장 상황과 맞는지 확인합니다.",
    "호선 목록과 작업지시서 등록 인원을 확인합니다.",
    "푸시가 필요한 작업자의 휴대폰 알림 등록 상태를 확인합니다.",
    "관리 > 푸시 탭에서 구독 작업자 수를 확인합니다.",
  ], 0.95, 1.35, 10.8, { size: 12.8, lineH: 0.54 });
});

contentSlide(n++, "문제 해결", "CHECKLIST", (slide) => {
  card(slide, { x: 0.72, y: 1.25, w: 3.7, h: 4.7, title: "화면 숫자가 다름", body: "동기화 상태 확인\n새로고침\n다른 브라우저/모바일 비교\n원격 데이터 기준 재확인", color: C.teal });
  card(slide, { x: 4.82, y: 1.25, w: 3.7, h: 4.7, title: "푸시가 오지 않음", body: "작업자 본인 로그인 확인\n알림 등록 상태 확인\nOS/브라우저 권한 확인\n관리 탭 알림 배지 확인", color: C.red });
  card(slide, { x: 8.92, y: 1.25, w: 3.7, h: 4.7, title: "버튼 비활성", body: "관리자 수정 모드 확인\n조장/총무/관리 권한 확인\n대상 선택 여부 확인\n등록 단말 수 확인", color: C.amber });
});

contentSlide(n++, "운영상 주의사항", "CHECKLIST", (slide) => {
  bullet(slide, [
    "관리자 비밀번호와 사번은 외부 문서에 공개하지 않습니다.",
    "이력 초기화와 삭제는 복구가 어려우므로 필요한 데이터는 먼저 내보냅니다.",
    "테스트 푸시와 운영 푸시 문구를 구분해서 사용합니다.",
    "한 작업자에게 여러 기기가 등록되어 있으면 모든 활성 기기에 발송됩니다.",
    "알림 표시 모양은 기기와 브라우저 정책에 따라 다르게 보일 수 있습니다.",
  ], 0.95, 1.36, 10.8, { size: 13, lineH: 0.58 });
});

{
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.navy }, line: { color: C.navy } });
  slide.addText("END", { x: 0.82, y: 0.92, w: 1.1, h: 0.26, fontFace: "Aptos", fontSize: 8, bold: true, color: "7BE0D4", charSpace: 2, margin: 0 });
  slide.addText("현장 운영 기준", { x: 0.82, y: 2.02, w: 5.8, h: 0.66, fontFace: "Malgun Gothic", fontSize: 30, bold: true, color: C.white, margin: 0 });
  slide.addText("같은 원격 데이터, 같은 권한 기준, 같은 알림 등록 상태를 확인합니다.", { x: 0.86, y: 3.02, w: 8.3, h: 0.34, fontFace: "Malgun Gothic", fontSize: 14, color: "CFE7EF", margin: 0, fit: "shrink" });
  card(slide, { x: 8.2, y: 1.35, w: 3.9, h: 3.4, title: "배포 주소", body: "https://gs-safety-checklist.vercel.app\n\n기준 버전\n0.5-20260525", color: "7BE0D4", fill: "102A3A" });
  addFooter(slide, n++, "END");
}

await pptx.writeFile({ fileName: outputPath });
console.log(JSON.stringify({ outputPath, slides: pptx._slides.length, bytes: fs.statSync(outputPath).size }, null, 2));
