import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const runtimeNodeModules = "C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const tempNodeModules = path.join(process.env.TEMP || process.env.TMP || "C:/Windows/Temp", "gs-manual-pptx-node", "node_modules");
const require = createRequire(import.meta.url);
const pptxgen = require(require.resolve("pptxgenjs", { paths: [tempNodeModules, runtimeNodeModules] }));

const root = path.resolve("C:/Users/User/GS_CHECKLIST/shipyard-checklist");
const screenshotDir = path.join(root, "docs/manual/screenshots/ppt-2026-05-25");
const outputPath = path.join(root, "docs/manual/GS_Safety_Checklist_사용안내_화면캡처_2026-05.pptx");

const shots = {
  login: "01-login.png",
  home: "02-home-dashboard.png",
  check: "03-work-check.png",
  unsafe: "04-unsafe-register.png",
  materials: "05-material-register.png",
  ships: "06-ships.png",
  history: "07-history.png",
  pledge: "08-pledge.png",
  analytics: "09-analytics.png",
  workers: "10-manage-workers.png",
  push: "11-manage-push.png",
  manageUnsafe: "12-manage-unsafe.png",
  contact: "contact-sheet.png",
};

for (const [key, file] of Object.entries(shots)) {
  const full = path.join(screenshotDir, file);
  if (!fs.existsSync(full)) throw new Error(`Missing screenshot ${key}: ${full}`);
  shots[key] = full;
}

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "GS Safety Checklist";
pptx.company = "(주)지에스";
pptx.subject = "GS 안전 체크리스트 화면 캡처 사용안내";
pptx.title = "GS Safety Checklist 화면 캡처 사용안내";
pptx.lang = "ko-KR";
pptx.theme = {
  headFontFace: "Malgun Gothic",
  bodyFontFace: "Malgun Gothic",
  lang: "ko-KR",
};
pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });

const W = 13.333;
const H = 7.5;
const C = {
  navy: "0F1E2C",
  navy2: "162B3A",
  teal: "0F766E",
  mint: "E7F6F3",
  bg: "F7FAFC",
  white: "FFFFFF",
  ink: "102033",
  muted: "587083",
  line: "D8E3EA",
  red: "DC2626",
  amber: "F59E0B",
  purple: "6D5BD0",
};

function addFooter(slide, n, section = "") {
  slide.addShape(pptx.ShapeType.line, {
    x: 0.55,
    y: 7.08,
    w: 12.23,
    h: 0,
    line: { color: C.line, width: 1 },
  });
  slide.addText("GS 안전 체크리스트 화면 캡처 사용안내", {
    x: 0.56,
    y: 7.17,
    w: 4.25,
    h: 0.16,
    fontFace: "Malgun Gothic",
    fontSize: 6.8,
    color: C.muted,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(section, {
    x: 5.15,
    y: 7.17,
    w: 3.05,
    h: 0.16,
    fontFace: "Aptos",
    fontSize: 6.8,
    color: C.teal,
    bold: true,
    align: "center",
    margin: 0,
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: 12.18,
    y: 7.11,
    w: 0.58,
    h: 0.26,
    fontFace: "Aptos",
    fontSize: 8,
    color: C.teal,
    bold: true,
    align: "right",
    margin: 0,
  });
}

function addHeader(slide, title, section) {
  slide.addText("GS SAFETY CHECKLIST", {
    x: 0.58,
    y: 0.28,
    w: 3.0,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 7.6,
    bold: true,
    color: C.teal,
    charSpace: 1.4,
    margin: 0,
  });
  slide.addText(title, {
    x: 0.56,
    y: 0.56,
    w: 7.6,
    h: 0.46,
    fontFace: "Malgun Gothic",
    fontSize: 21,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(section, {
    x: 10.25,
    y: 0.38,
    w: 2.45,
    h: 0.28,
    fontFace: "Aptos",
    fontSize: 8,
    bold: true,
    color: C.teal,
    align: "right",
    margin: 0,
  });
}

function addTag(slide, text, x, y, color = C.teal) {
  const w = Math.max(0.78, text.length * 0.115 + 0.35);
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.28,
    rectRadius: 0.05,
    fill: { color: C.white },
    line: { color, transparency: 12 },
  });
  slide.addText(text, {
    x: x + 0.12,
    y: y + 0.065,
    w: w - 0.22,
    h: 0.12,
    fontFace: "Malgun Gothic",
    fontSize: 6.7,
    bold: true,
    color,
    margin: 0,
    fit: "shrink",
  });
}

function addBulletList(slide, items, x, y, w, opts = {}) {
  items.forEach((item, i) => {
    const yy = y + i * (opts.lineH || 0.45);
    slide.addShape(pptx.ShapeType.ellipse, {
      x,
      y: yy + 0.1,
      w: 0.08,
      h: 0.08,
      fill: { color: opts.dot || C.teal },
      line: { color: opts.dot || C.teal },
    });
    slide.addText(item, {
      x: x + 0.18,
      y: yy,
      w,
      h: (opts.lineH || 0.45) * 0.86,
      fontFace: "Malgun Gothic",
      fontSize: opts.size || 11,
      color: opts.color || C.ink,
      margin: 0,
      fit: "shrink",
      valign: "mid",
    });
  });
}

function imgContain(slide, imagePath, x, y, w, h) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.05,
    fill: { color: "FFFFFF" },
    line: { color: C.line, width: 1 },
    shadow: { type: "outer", color: "B7C8D4", opacity: 0.16, blur: 1, angle: 45, distance: 1 },
  });
  slide.addImage({
    path: imagePath,
    x: x + 0.08,
    y: y + 0.08,
    w: w - 0.16,
    h: h - 0.16,
    sizing: { type: "contain", x: x + 0.08, y: y + 0.08, w: w - 0.16, h: h - 0.16 },
  });
}

function infoCard(slide, title, body, x, y, w, h, color = C.teal) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.05,
    fill: { color: C.white },
    line: { color: C.line },
  });
  slide.addShape(pptx.ShapeType.rect, { x, y, w: 0.06, h, fill: { color }, line: { color } });
  slide.addText(title, {
    x: x + 0.2,
    y: y + 0.16,
    w: w - 0.35,
    h: 0.22,
    fontFace: "Malgun Gothic",
    fontSize: 11.5,
    bold: true,
    color,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(body, {
    x: x + 0.2,
    y: y + 0.52,
    w: w - 0.35,
    h: h - 0.62,
    fontFace: "Malgun Gothic",
    fontSize: 9.1,
    color: C.ink,
    margin: 0,
    fit: "shrink",
    valign: "top",
  });
}

function screenshotSlide(n, title, section, imagePath, bullets, tags = []) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  addHeader(slide, title, section);
  imgContain(slide, imagePath, 4.65, 1.24, 8.05, 5.55);
  slide.addText("화면에서 확인할 것", {
    x: 0.68,
    y: 1.3,
    w: 3.2,
    h: 0.24,
    fontFace: "Malgun Gothic",
    fontSize: 12,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  addBulletList(slide, bullets, 0.75, 1.82, 3.3, { size: 10.9, lineH: 0.46 });
  tags.forEach((tag, i) => addTag(slide, tag, 0.72 + (i % 2) * 1.58, 5.85 + Math.floor(i / 2) * 0.38, i === 0 ? C.teal : C.purple));
  addFooter(slide, n, section);
}

let n = 1;

{
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.navy }, line: { color: C.navy } });
  slide.addText("GS", { x: 0.84, y: 0.76, w: 0.5, h: 0.22, fontFace: "Aptos", fontSize: 9, bold: true, color: "7BE0D4", margin: 0 });
  slide.addText("SAFETY CHECKLIST", { x: 1.36, y: 0.76, w: 2.65, h: 0.22, fontFace: "Aptos", fontSize: 8, bold: true, color: "7BE0D4", charSpace: 1.3, margin: 0 });
  slide.addText("화면 캡처 사용안내", { x: 0.82, y: 1.65, w: 7.0, h: 0.75, fontFace: "Malgun Gothic", fontSize: 34, bold: true, color: C.white, margin: 0, fit: "shrink" });
  slide.addText("실제 production 화면으로 보는 현장 작업자 · 관리자 운영 흐름", { x: 0.88, y: 2.62, w: 7.4, h: 0.34, fontFace: "Malgun Gothic", fontSize: 13.8, color: "CFE7EF", margin: 0, fit: "shrink" });
  infoCard(slide, "기준", "배포 주소\nhttps://gs-safety-checklist.vercel.app\n\n버전\n0.5-20260525\n\n화면 캡처\n2026-05-25 production", 8.25, 1.16, 3.92, 3.68, "7BE0D4");
  addTag(slide, "실제 화면", 0.88, 4.55, "7BE0D4");
  addTag(slide, "푸시 탭 포함", 2.18, 4.55, "7BE0D4");
  addTag(slide, "관리자 흐름", 3.76, 4.55, "7BE0D4");
  addFooter(slide, n++, "SCREEN GUIDE");
}

{
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  addHeader(slide, "전체 화면 흐름", "OVERVIEW");
  imgContain(slide, shots.contact, 0.68, 1.24, 12.0, 5.55);
  addFooter(slide, n++, "OVERVIEW");
}

screenshotSlide(n++, "작업자 로그인", "BASIC", shots.login, [
  "작업자 선택 드롭다운에서 본인 이름을 선택합니다.",
  "사번 입력 후 로그인합니다.",
  "사번이 등록되지 않았으면 관리자에게 등록을 요청합니다.",
], ["로그인", "사번 검증"]);

screenshotSlide(n++, "홈 대시보드", "FIELD", shots.home, [
  "작업 전 점검, 불안전요소, 자재누락 진입 버튼을 확인합니다.",
  "오늘 점검 완료율과 대기/호선 수를 봅니다.",
  "공정 현황과 주요 경고 수치를 먼저 확인합니다.",
], ["오늘 상태", "동기화"]);

screenshotSlide(n++, "작업 전 점검", "FIELD", shots.check, [
  "작업지시서 목록에서 본인 작업을 선택합니다.",
  "등록 인원 점검 완료 수를 확인합니다.",
  "작업 준비가 없으면 직접 점검 흐름으로 진행합니다.",
], ["작업지시서", "점검 완료"]);

screenshotSlide(n++, "불안전요소 등록", "FIELD", shots.unsafe, [
  "호선을 선택하고 위험 내용을 등록합니다.",
  "필요하면 사진을 첨부합니다.",
  "제출 후 관리자 처리 목록에 즉시 접수됩니다.",
], ["위험 접수", "푸시 연동"]);

screenshotSlide(n++, "자재누락 등록", "FIELD", shots.materials, [
  "호선을 선택한 뒤 누락 자재 정보를 입력합니다.",
  "사진과 상세 내용을 함께 남길 수 있습니다.",
  "접수 후 관리 화면에서 처리 상태를 추적합니다.",
], ["누락 접수", "호선 기준"]);

screenshotSlide(n++, "호선 화면", "ADMIN", shots.ships, [
  "공정 단계별 호선 현황을 확인합니다.",
  "관리자 수정 모드에서 호선과 날짜를 수정합니다.",
  "호선 추가 내용은 접수 화면의 호선 목록에도 반영됩니다.",
], ["호선 관리", "공정 현황"]);

screenshotSlide(n++, "점검 이력", "ADMIN", shots.history, [
  "제출된 점검 내역을 카드와 목록으로 확인합니다.",
  "날짜, 작업자, 호선 기준으로 이력을 추적합니다.",
  "관리자 수정 모드에서 선택 삭제가 가능합니다.",
], ["이력 조회", "감사 기준"]);

screenshotSlide(n++, "서약", "FIELD", shots.pledge, [
  "오늘 서약 현황과 미완료자를 확인합니다.",
  "미완료자 알림은 표에서 미완료인 작업자에게만 발송됩니다.",
  "푸시 문구 수정으로 안내 문구를 운영 상황에 맞춥니다.",
], ["안전 서약", "미완료 알림"]);

screenshotSlide(n++, "통계", "ADMIN", shots.analytics, [
  "점검, 서약, 불안전요소, 자재누락 수치를 요약합니다.",
  "월간 작업자 달력으로 누락/완료 상태를 봅니다.",
  "숫자가 이상하면 필터와 동기화 상태를 먼저 확인합니다.",
], ["통계", "월간 현황"]);

screenshotSlide(n++, "관리 > 작업자", "ADMIN", shots.workers, [
  "작업자 정보와 직책을 관리합니다.",
  "카드에서 작업자별 알림 구독 배지를 확인합니다.",
  "알림수정으로 기기명, 활성 상태, 삭제를 처리합니다.",
], ["작업자", "알림 기기"]);

screenshotSlide(n++, "관리 > 푸시", "PUSH", shots.push, [
  "구독/전체/선택 작업자 중 발송 대상을 고릅니다.",
  "제목, 내용, 클릭 이동 화면을 설정합니다.",
  "일반, 주의, 긴급, 완료 스타일을 선택합니다.",
  "즉시 발송 전 미리보기 문구를 확인합니다.",
], ["수동 푸시", "스타일"]);

screenshotSlide(n++, "관리 > 불안전요소", "ADMIN", shots.manageUnsafe, [
  "접수된 불안전요소 목록을 상태별로 관리합니다.",
  "처리 상태 변경, 내보내기, 이력 초기화를 사용합니다.",
  "푸시 문구 수정으로 등록 알림 문구를 조정합니다.",
], ["접수 처리", "내보내기"]);

{
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  addHeader(slide, "푸시 운영 권한", "PUSH");
  infoCard(slide, "발송 조건", "관리자 수정 모드 ON\n조장/총무/관리 작업자 로그인\n대상 작업자 알림 단말 등록\n제목/내용 입력 완료", 0.76, 1.28, 3.85, 4.65, C.red);
  infoCard(slide, "서버 차단 기준", "권한 없는 발송자: forbidden_sender\n전체 상태 무단 조회: forbidden_target\n허용되지 않은 발송 종류: forbidden_send_kind", 4.88, 1.28, 3.85, 4.65, C.purple);
  infoCard(slide, "실제 수신 확인", "관리 > 작업자 탭에서 구독 배지 확인\n관리 > 푸시 탭에서 대상 선택\n발송 후 기기 lastError 확인", 9.0, 1.28, 3.25, 4.65, C.teal);
  addFooter(slide, n++, "PUSH");
}

{
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.navy }, line: { color: C.navy } });
  slide.addText("운영 체크포인트", { x: 0.86, y: 1.05, w: 6.2, h: 0.58, fontFace: "Malgun Gothic", fontSize: 28, bold: true, color: C.white, margin: 0 });
  const items = [
    "좌측 동기화 상태가 온라인인지 확인",
    "작업자 로그인과 사번 검증 확인",
    "호선·작업지시서·작업자 정보 최신화",
    "푸시 대상자의 휴대폰 알림 등록 상태 확인",
    "운영 전 테스트 알림으로 실제 수신 확인",
  ];
  items.forEach((item, i) => {
    slide.addText(String(i + 1), { x: 1.0, y: 2.12 + i * 0.62, w: 0.28, h: 0.22, fontFace: "Aptos", fontSize: 10, bold: true, color: "7BE0D4", margin: 0, align: "center" });
    slide.addText(item, { x: 1.42, y: 2.06 + i * 0.62, w: 6.8, h: 0.28, fontFace: "Malgun Gothic", fontSize: 13, color: "D9EEF3", margin: 0, fit: "shrink" });
  });
  infoCard(slide, "최종 기준", "같은 원격 데이터\n같은 작업자 권한\n같은 알림 등록 상태", 8.45, 1.68, 3.45, 2.6, "7BE0D4");
  addFooter(slide, n++, "CHECKLIST");
}

await pptx.writeFile({ fileName: outputPath });
console.log(JSON.stringify({
  outputPath,
  slides: pptx._slides.length,
  bytes: fs.statSync(outputPath).size,
}, null, 2));
