import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "assets", "pictograms");
mkdirSync(outDir, { recursive: true });

const colors = {
  navy: "#10213d",
  mounting: "#c2410c",
  lc: "#1d4ed8",
  st: "#0f766e",
  cl: "#15803d",
  dl: "#7e22ce",
  danger: "#dc2626",
  warn: "#b45309",
  ok: "#15803d",
  muted: "#52657f",
};

const icons = [
  ["stage-mounting", "탑재", colors.mounting, `<path d="M12 52h40"/><path d="M19 52V32h26v20"/><path d="M14 32h36"/><path d="M32 10v22"/><path d="M23 19h18"/><path d="M32 10l10 10"/><path d="M32 10 22 20"/><rect x="25" y="40" width="14" height="12" rx="2"/>`],
  ["stage-lc", "L/C", colors.lc, `<path d="M12 45h40"/><path d="M18 45l5-23h18l5 23"/><path d="M24 31h16"/><path d="M21 38h22"/><path d="M47 22l5 5-5 5"/><path d="M42 27h10"/>`],
  ["stage-st", "S/T", colors.st, `<path d="M13 48h38"/><path d="M18 48V20h28v28"/><path d="M24 28h16"/><path d="M24 36h16"/><circle cx="32" cy="14" r="5"/><path d="M44 14h8"/><path d="M48 10v8"/>`],
  ["stage-cl", "C/L", colors.cl, `<path d="M12 44h40l-5 8H17z"/><path d="M21 44l4-18h18l4 18"/><path d="M25 33h14"/><path d="M18 56c4 3 8 3 12 0 4 3 8 3 12 0 4 3 8 3 12 0"/>`],
  ["stage-dl", "D/L", colors.dl, `<path d="M12 42h40l-7 10H19z"/><path d="M20 42l5-18h17l5 18"/><path d="M28 24V12h8v12"/><path d="M24 56h16"/><path d="M44 18l8 8"/><path d="M52 18l-8 8"/>`],
  ["work-mounting-check", "탑재 점검", colors.mounting, `<path d="M12 52h40"/><path d="M20 52V34h24v18"/><path d="M32 12v22"/><path d="M24 20h16"/><path d="M43 16l6 6"/><path d="m42 47 4 4 8-10"/>`],
  ["work-preinstall", "선행 설치", colors.mounting, `<path d="M15 46h34"/><path d="M21 46V25h22v21"/><path d="M18 25h28"/><path d="M27 35h10"/><path d="M46 17l5 5-9 9-5-5z"/>`],
  ["work-postinstall", "후행 설치", colors.lc, `<path d="M14 48h36"/><path d="M19 48V26h26v22"/><path d="M25 34h14"/><path d="M25 41h14"/><path d="M45 18l7 7"/><path d="M52 18l-7 7"/>`],
  ["work-dp-install", "DP 설치", colors.lc, `<rect x="15" y="18" width="34" height="28" rx="4"/><path d="M23 28h18"/><path d="M23 36h12"/><path d="M20 52h24"/><path d="M32 46v6"/><path d="M47 13l5 5"/><path d="M52 13l-5 5"/>`],
  ["work-dp-inspect", "DP 검사", colors.lc, `<rect x="15" y="14" width="30" height="38" rx="4"/><path d="M22 24h16"/><path d="M22 32h12"/><path d="m23 42 4 4 9-11"/><circle cx="47" cy="45" r="7"/><path d="m52 50 5 5"/>`],
  ["work-pressure-test", "압력 테스트", colors.lc, `<circle cx="32" cy="32" r="17"/><path d="M32 32 43 22"/><path d="M21 42h22"/><path d="M20 53h24"/><path d="M32 15v-5"/><path d="M24 10h16"/>`],
  ["work-survey", "선주선급검사", colors.st, `<rect x="14" y="14" width="28" height="38" rx="4"/><path d="M21 25h14"/><path d="M21 33h10"/><path d="m21 43 4 4 9-12"/><path d="M43 22h8"/><path d="M47 18v8"/><circle cx="48" cy="42" r="7"/>`],
  ["work-demo", "DEMO 체크", colors.st, `<rect x="14" y="16" width="36" height="32" rx="4"/><path d="m24 32 6 5 11-13"/><path d="M22 54h20"/><path d="M32 48v6"/><path d="M18 10h28"/>`],
  ["machine-crane", "골리앗 크레인", colors.navy, `<path d="M10 15h44"/><path d="M18 15v38"/><path d="M46 15v38"/><path d="M14 53h10"/><path d="M40 53h10"/><path d="M32 15v18"/><path d="M26 33h12"/><path d="M32 33v9"/><path d="m28 45 4 4 4-4"/>`],
  ["machine-welder", "용접기", colors.navy, `<rect x="14" y="20" width="28" height="25" rx="4"/><path d="M21 28h14"/><circle cx="23" cy="51" r="3"/><circle cx="37" cy="51" r="3"/><path d="M42 32c8 2 9 8 4 14"/><path d="M50 44l6 6"/><path d="M51 36l5-2"/><path d="M53 40h6"/>`],
  ["machine-grinder", "그라인더", colors.navy, `<circle cx="24" cy="40" r="11"/><path d="M32 32 47 17l7 7-15 15"/><path d="M16 48l-5 5"/><path d="M20 40h8"/><path d="M47 39l6 4"/><path d="M48 46l7 1"/>`],
  ["machine-airhose", "에어 호스", colors.navy, `<path d="M12 43c7-13 18 12 27 0 7-10-11-13-8-22 2-7 11-7 19-1"/><path d="m45 16 8 8"/><path d="m50 13 6 6"/><path d="M15 50h12"/><path d="M21 44v12"/>`],
  ["machine-lifting-jack", "리프팅 잭", colors.navy, `<path d="M16 50h32"/><path d="M22 50l8-25h11l-8 25"/><path d="M27 25h23"/><path d="M45 25l7-9"/><path d="M22 40h18"/><path d="M18 56h36"/>`],
  ["machine-spanner", "스패너", colors.navy, `<path d="M45 12a12 12 0 0 0-13 16L14 46l8 8 18-18a12 12 0 0 0 16-13l-8 8-10-10z"/>`],
  ["machine-hammer", "해머", colors.navy, `<path d="M24 14h18l9 9-8 8-8-8H24z"/><path d="M31 25 13 49l7 7 24-18"/><path d="M17 45l7 7"/>`],
  ["machine-measure", "측정기", colors.navy, `<rect x="13" y="35" width="38" height="14" rx="2"/><path d="M18 35v7"/><path d="M25 35v5"/><path d="M32 35v7"/><path d="M39 35v5"/><path d="M46 35v7"/><path d="M20 24h24"/><path d="m39 19 6 5-6 5"/>`],
  ["machine-drill", "드릴", colors.navy, `<path d="M14 23h28v14H14z"/><path d="M42 27h10l5 3-5 3H42"/><path d="M23 37v15h10V37"/><path d="M19 52h18"/><circle cx="22" cy="30" r="3"/>`],
  ["machine-paintgun", "도장 건", colors.navy, `<path d="M14 24h26v11H14z"/><path d="M40 27h8l6 5"/><path d="M23 35l-5 16h10l5-16"/><path d="M54 28c4 2 4 6 0 8"/><path d="M58 24c6 6 6 16 0 22"/>`],
  ["machine-pressure-washer", "고압 세척기", colors.navy, `<rect x="14" y="32" width="24" height="16" rx="3"/><circle cx="20" cy="52" r="3"/><circle cx="35" cy="52" r="3"/><path d="M38 36 53 21"/><path d="m50 18 6 6"/><path d="M49 30c5 3 5 8 0 11"/><path d="M55 27c7 6 7 14 0 20"/>`],
  ["status-public", "작업자 공개", colors.ok, `<path d="M8 32s9-14 24-14 24 14 24 14-9 14-24 14S8 32 8 32z"/><circle cx="32" cy="32" r="7"/>`],
  ["status-private", "비공개", colors.muted, `<rect x="17" y="28" width="30" height="22" rx="4"/><path d="M23 28v-7a9 9 0 0 1 18 0v7"/><path d="M32 36v6"/>`],
  ["status-online", "온라인", colors.ok, `<circle cx="32" cy="32" r="14"/><path d="M32 14v-5"/><path d="M32 55v-5"/><path d="M14 32H9"/><path d="M55 32h-5"/><path d="m21 21-4-4"/><path d="m47 47-4-4"/><path d="m43 21 4-4"/><path d="m17 47 4-4"/>`],
  ["status-danger", "위험", colors.danger, `<path d="M32 8 58 54H6z"/><path d="M32 23v15"/><path d="M32 45h.01"/>`],
  ["status-caution", "주의", colors.warn, `<circle cx="32" cy="32" r="23"/><path d="M32 18v17"/><path d="M32 43h.01"/>`],
  ["status-normal", "정상", colors.ok, `<circle cx="32" cy="32" r="23"/><path d="m21 33 7 7 16-18"/>`],
  ["status-delete", "삭제", colors.danger, `<path d="M18 21h28"/><path d="M25 21v-6h14v6"/><path d="M22 26l2 28h16l2-28"/><path d="M29 32v15"/><path d="M35 32v15"/>`],
  ["status-complete", "완료", colors.ok, `<rect x="15" y="12" width="34" height="42" rx="4"/><path d="M24 22h16"/><path d="M24 31h12"/><path d="m23 43 6 6 13-17"/>`],
];

function iconSvg([id, label, color, paths], size = 96) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 96 118" role="img" aria-labelledby="${id}-title">
  <title id="${id}-title">${label}</title>
  <rect x="8" y="8" width="80" height="80" rx="16" fill="#f8fafc" stroke="${color}" stroke-width="4"/>
  <g transform="translate(16 16)" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
  <text x="48" y="108" text-anchor="middle" font-family="Arial, 'Noto Sans KR', sans-serif" font-size="12" font-weight="800" fill="#10213d">${label}</text>
</svg>`;
}

for (const icon of icons) {
  writeFileSync(join(outDir, `${icon[0]}.svg`), iconSvg(icon), "utf8");
}

const cols = 4;
const cellW = 132;
const cellH = 152;
const width = cols * cellW + 48;
const rows = Math.ceil(icons.length / cols);
const height = rows * cellH + 96;
const sheetIcons = icons.map((icon, index) => {
  const x = 24 + (index % cols) * cellW;
  const y = 68 + Math.floor(index / cols) * cellH;
  return `<g transform="translate(${x} ${y})">${iconSvg(icon, 112).replace(/<svg[^>]*>|<\/svg>/g, "")}</g>`;
}).join("\n");

const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#eef3f7"/>
  <text x="24" y="38" font-family="Arial, 'Noto Sans KR', sans-serif" font-size="24" font-weight="900" fill="#10213d">조선소 작업 픽토그램 디자인</text>
  ${sheetIcons}
</svg>`;

writeFileSync(join(outDir, "shipyard-pictogram-sheet.svg"), sheet, "utf8");

console.log(`Generated ${icons.length} pictograms in ${outDir}`);
