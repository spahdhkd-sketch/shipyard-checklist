import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "assets", "icons", "shipyard");
mkdirSync(outDir, { recursive: true });

const colors = {
  ink: "#10213d",
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
  ["stage-mounting", "탑재", colors.mounting, `<path d="M8 42h48"/><path d="M16 42V24h32v18"/><path d="M12 24h40"/><path d="M32 6v18"/><path d="M22 15h20"/><path d="M32 6l10 9"/><path d="M32 6l-10 9"/><rect x="25" y="32" width="14" height="10" rx="2"/>`],
  ["stage-lc", "L/C", colors.lc, `<path d="M9 43h46"/><path d="M16 43l6-26h20l6 26"/><path d="M23 27h18"/><path d="M20 35h24"/><path d="M47 17l8 8-8 8"/><path d="M40 25h15"/>`],
  ["stage-st", "S/T", colors.st, `<path d="M10 48h44"/><path d="M16 48V18h31v30"/><path d="M23 28h17"/><path d="M23 37h17"/><circle cx="32" cy="10" r="5"/><path d="M45 10h10"/><path d="M50 5v10"/>`],
  ["stage-cl", "C/L", colors.cl, `<path d="M8 43h48l-6 10H14z"/><path d="M18 43l5-21h20l5 21"/><path d="M24 32h16"/><path d="M11 57c5 3 10 3 15 0 5 3 10 3 15 0 5 3 10 3 15 0"/>`],
  ["stage-dl", "D/L", colors.dl, `<path d="M8 42h48l-8 11H16z"/><path d="M18 42l6-22h19l6 22"/><path d="M28 20V7h9v13"/><path d="M22 57h20"/><path d="M46 13l10 10"/><path d="M56 13 46 23"/>`],
  ["work-check", "점검", colors.mounting, `<path d="M9 45h46"/><path d="M16 45V27h28v18"/><path d="M32 8v19"/><path d="M23 17h18"/><path d="m42 39 5 5 10-13"/>`],
  ["work-preinstall", "선행 설치", colors.mounting, `<path d="M12 45h38"/><path d="M18 45V22h26v23"/><path d="M15 22h32"/><path d="M24 33h14"/><path d="M48 11l7 7-12 12-7-7z"/>`],
  ["work-postinstall", "후행 설치", colors.lc, `<path d="M10 48h44"/><path d="M16 48V21h31v27"/><path d="M23 31h17"/><path d="M23 40h17"/><path d="M47 10l9 9"/><path d="M56 10l-9 9"/>`],
  ["work-dp-install", "DP 설치", colors.lc, `<rect x="12" y="14" width="38" height="34" rx="5"/><path d="M21 25h20"/><path d="M21 35h13"/><path d="M18 56h28"/><path d="M32 48v8"/><path d="M48 8l8 8"/><path d="M56 8l-8 8"/>`],
  ["work-dp-inspect", "DP 검사", colors.lc, `<rect x="12" y="9" width="34" height="43" rx="5"/><path d="M20 21h17"/><path d="M20 31h13"/><path d="m21 43 5 5 11-14"/><circle cx="48" cy="45" r="8"/><path d="m54 51 6 6"/>`],
  ["work-pressure", "압력 테스트", colors.lc, `<circle cx="32" cy="31" r="19"/><path d="M32 31 45 19"/><path d="M19 43h26"/><path d="M17 56h30"/><path d="M32 12V6"/><path d="M23 6h18"/>`],
  ["work-survey", "선주선급검사", colors.st, `<rect x="11" y="10" width="33" height="43" rx="5"/><path d="M19 22h16"/><path d="M19 32h11"/><path d="m19 44 5 5 11-15"/><path d="M45 19h11"/><path d="M50.5 13.5v11"/><circle cx="50" cy="44" r="8"/>`],
  ["work-demo", "DEMO 체크", colors.st, `<rect x="10" y="13" width="44" height="36" rx="5"/><path d="m21 31 8 7 15-18"/><path d="M20 57h24"/><path d="M32 49v8"/><path d="M14 7h36"/>`],
  ["machine-crane", "크레인", colors.ink, `<path d="M7 12h50"/><path d="M16 12v43"/><path d="M48 12v43"/><path d="M11 55h13"/><path d="M40 55h13"/><path d="M32 12v21"/><path d="M25 33h14"/><path d="M32 33v10"/><path d="m27 47 5 5 5-5"/>`],
  ["machine-welder", "용접기", colors.ink, `<rect x="10" y="17" width="32" height="29" rx="5"/><path d="M18 27h16"/><circle cx="20" cy="53" r="3"/><circle cx="36" cy="53" r="3"/><path d="M43 31c9 3 10 11 4 17"/><path d="M51 46l7 7"/><path d="M53 36l6-3"/><path d="M55 41h7"/>`],
  ["machine-grinder", "그라인더", colors.ink, `<circle cx="22" cy="42" r="12"/><path d="M30 34 48 16l8 8-18 18"/><path d="M13 51 7 57"/><path d="M18 42h9"/><path d="M47 42l8 4"/><path d="M49 50l8 1"/>`],
  ["machine-hose", "에어 호스", colors.ink, `<path d="M8 44c8-15 20 13 31 0 8-10-12-15-8-26 3-8 13-8 23-1"/><path d="m49 13 9 9"/><path d="m55 9 7 7"/><path d="M12 54h15"/><path d="M20 47v14"/>`],
  ["machine-jack", "리프팅 잭", colors.ink, `<path d="M11 52h40"/><path d="M18 52l10-29h13L31 52"/><path d="M25 23h28"/><path d="M48 23l9-12"/><path d="M20 40h24"/><path d="M9 59h48"/>`],
  ["machine-spanner", "스패너", colors.ink, `<path d="M46 8a13 13 0 0 0-14 17L10 47l9 9 22-22A13 13 0 0 0 58 20l-10 10-10-10z"/>`],
  ["machine-hammer", "해머", colors.ink, `<path d="M22 10h21l11 10-9 9-10-9H22z"/><path d="M31 23 9 49l8 8 27-22"/><path d="M13 45l8 8"/>`],
  ["machine-measure", "측정기", colors.ink, `<rect x="8" y="37" width="46" height="15" rx="3"/><path d="M15 37v8"/><path d="M23 37v6"/><path d="M31 37v8"/><path d="M39 37v6"/><path d="M47 37v8"/><path d="M17 24h28"/><path d="m40 18 8 6-8 6"/>`],
  ["machine-drill", "드릴", colors.ink, `<path d="M9 20h33v16H9z"/><path d="M42 25h11l7 3-7 3H42"/><path d="M20 36v18h12V36"/><path d="M15 54h22"/><circle cx="19" cy="28" r="3"/>`],
  ["machine-paint", "도장 건", colors.ink, `<path d="M9 21h31v13H9z"/><path d="M40 25h9l8 6"/><path d="M20 34l-6 20h12l6-20"/><path d="M57 25c4 3 4 8 0 11"/><path d="M61 20c7 8 7 18 0 26"/>`],
  ["status-public", "공개", colors.ok, `<path d="M6 32s10-16 26-16 26 16 26 16-10 16-26 16S6 32 6 32z"/><circle cx="32" cy="32" r="8"/>`],
  ["status-private", "비공개", colors.muted, `<rect x="14" y="28" width="36" height="25" rx="5"/><path d="M21 28v-9a11 11 0 0 1 22 0v9"/><path d="M32 38v7"/>`],
  ["status-online", "온라인", colors.ok, `<circle cx="32" cy="32" r="16"/><path d="M32 11V5"/><path d="M32 59v-6"/><path d="M11 32H5"/><path d="M59 32h-6"/><path d="m19 19-5-5"/><path d="m50 50-5-5"/><path d="m45 19 5-5"/><path d="m14 50 5-5"/>`],
  ["status-danger", "위험", colors.danger, `<path d="M32 6 60 56H4z"/><path d="M32 23v17"/><path d="M32 48h.01"/>`],
  ["status-caution", "주의", colors.warn, `<circle cx="32" cy="32" r="26"/><path d="M32 16v20"/><path d="M32 46h.01"/>`],
  ["status-normal", "정상", colors.ok, `<circle cx="32" cy="32" r="26"/><path d="m19 33 8 8 18-20"/>`],
  ["status-delete", "삭제", colors.danger, `<path d="M17 19h30"/><path d="M24 19v-7h16v7"/><path d="M21 25l2 31h18l2-31"/><path d="M30 32v17"/><path d="M36 32v17"/>`],
  ["status-complete", "완료", colors.ok, `<rect x="13" y="8" width="38" height="48" rx="5"/><path d="M22 20h18"/><path d="M22 31h13"/><path d="m21 44 7 7 15-20"/>`],
];

function svgIcon([id, label, color, paths], size = 64) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-labelledby="${id}-title">
  <title id="${id}-title">${label}</title>
  <g fill="none" stroke="${color}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
</svg>`;
}

for (const icon of icons) {
  writeFileSync(join(outDir, `${icon[0]}.svg`), svgIcon(icon), "utf8");
}

const cols = 6;
const cell = 110;
const width = cols * cell + 48;
const rows = Math.ceil(icons.length / cols);
const height = rows * cell + 92;
const sheetIcons = icons.map((icon, index) => {
  const x = 36 + (index % cols) * cell;
  const y = 72 + Math.floor(index / cols) * cell;
  return `<g transform="translate(${x} ${y})">
    ${svgIcon(icon, 64).replace(/<svg[^>]*>|<\/svg>/g, "")}
    <text x="32" y="84" text-anchor="middle" font-family="Arial, 'Noto Sans KR', sans-serif" font-size="12" font-weight="800" fill="#10213d">${icon[1]}</text>
  </g>`;
}).join("\n");

const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#f8fafc"/>
  <text x="24" y="40" font-family="Arial, 'Noto Sans KR', sans-serif" font-size="24" font-weight="900" fill="#10213d">조선소 아이콘 디자인</text>
  <text x="${width - 24}" y="40" text-anchor="end" font-family="Arial, 'Noto Sans KR', sans-serif" font-size="13" font-weight="700" fill="#52657f">64px SVG icon set</text>
  ${sheetIcons}
</svg>`;

writeFileSync(join(outDir, "shipyard-icon-sheet.svg"), sheet, "utf8");

console.log(`Generated ${icons.length} shipyard icons in ${outDir}`);
