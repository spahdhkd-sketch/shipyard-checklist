import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const tempNodeModules = path.join(process.env.TEMP || process.env.TMP || "C:/Windows/Temp", "gs-pw-smoke", "node_modules");
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve("playwright-core", { paths: [tempNodeModules] }));

const root = path.resolve("C:/Users/User/GS_CHECKLIST/shipyard-checklist");
const appPath = path.join(root, "assets/js/app-v2.js");
const outDir = path.join(root, "docs/manual/screenshots/ppt-2026-05-25");
const baseUrl = "https://gs-safety-checklist.vercel.app";
const chromePath = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";

fs.mkdirSync(outDir, { recursive: true });

const app = fs.readFileSync(appPath, "utf8");
const supabaseUrl = app.match(/SUPABASE_URL\s*=\s*"([^"]+)"/)?.[1];
const anonKey = app.match(/SUPABASE_ANON_KEY\s*=\s*"([^"]+)"/)?.[1];

if (!supabaseUrl || !anonKey) {
  throw new Error("Supabase config not found in app-v2.js");
}

async function rest(pathname) {
  const response = await fetch(`${supabaseUrl}${pathname}`, {
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${anonKey}`,
    },
  });
  if (!response.ok) throw new Error(`REST ${response.status}: ${pathname}`);
  return response.json();
}

function storageKey(name) {
  return `shipyardSafetyV1.${name}`;
}

const workers = await rest("/rest/v1/workers?select=id,name,team,position,employee_no&order=name.asc");
const sender = workers.find((worker) => ["관리", "총무"].includes(String(worker.team || "").trim()))
  || workers.find((worker) => String(worker.position || "").trim() === "조장")
  || workers[0];

if (!sender) {
  throw new Error("No worker found for screenshot session");
}

const session = {
  workerId: sender.id,
  workerName: sender.name || "작업자",
  employeeNo: String(sender.employee_no || "").trim(),
  loggedInAt: Date.now(),
};

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox"],
});

async function openPage({ file, view, manageTab, admin = false, mobile = false }) {
  const page = await browser.newPage({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1366, height: 768 },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  });

  await page.addInitScript(({ session, admin, manageTab }) => {
    sessionStorage.setItem("shipyardSafetyV1.workerSession", JSON.stringify(session));
    if (admin) sessionStorage.setItem("shipyardSafetyV1.adminMode", "true");
    else sessionStorage.removeItem("shipyardSafetyV1.adminMode");
    if (manageTab) localStorage.setItem("shipyardSafetyV1.manageTab", JSON.stringify(manageTab));
    localStorage.setItem("shipyardSafetyV1.screenMode", JSON.stringify("desktop"));
  }, { session, admin, manageTab });

  await page.goto(`${baseUrl}/${file}?manualCapture=${Date.now()}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#page", { timeout: 15000 });
  await page.waitForTimeout(2800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  return page;
}

const shots = [
  { id: "01-login", label: "작업자 로그인", file: "index.html", noSession: true },
  { id: "02-home-dashboard", label: "홈 대시보드", file: "index.html" },
  { id: "03-work-check", label: "작업 전 점검", file: "check.html" },
  { id: "04-unsafe-register", label: "불안전요소 등록", file: "unsafe.html" },
  { id: "05-material-register", label: "자재누락 등록", file: "materials.html" },
  { id: "06-ships", label: "호선", file: "ships.html", admin: true },
  { id: "07-history", label: "점검 이력", file: "history.html", admin: true },
  { id: "08-pledge", label: "서약", file: "pledge.html" },
  { id: "09-analytics", label: "통계", file: "analytics.html" },
  { id: "10-manage-workers", label: "관리 작업자", file: "manage.html", admin: true, manageTab: "workers" },
  { id: "11-manage-push", label: "관리 푸시", file: "manage.html", admin: true, manageTab: "push" },
  { id: "12-manage-unsafe", label: "관리 불안전요소", file: "manage.html", admin: true, manageTab: "unsafe" },
];

const outputs = [];
for (const shot of shots) {
  const page = await browser.newPage({
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 1,
  });
  if (!shot.noSession) {
    await page.addInitScript(({ session, admin, manageTab }) => {
      sessionStorage.setItem("shipyardSafetyV1.workerSession", JSON.stringify(session));
      if (admin) sessionStorage.setItem("shipyardSafetyV1.adminMode", "true");
      else sessionStorage.removeItem("shipyardSafetyV1.adminMode");
      if (manageTab) localStorage.setItem("shipyardSafetyV1.manageTab", JSON.stringify(manageTab));
      localStorage.setItem("shipyardSafetyV1.screenMode", JSON.stringify("desktop"));
    }, { session, admin: Boolean(shot.admin), manageTab: shot.manageTab || "" });
  }
  await page.goto(`${baseUrl}/${shot.file}?manualCapture=${Date.now()}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#page", { timeout: 15000 });
  await page.waitForTimeout(shot.noSession ? 1500 : 3200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const filePath = path.join(outDir, `${shot.id}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
  const title = await page.locator("#appbarTitle").textContent().catch(() => "");
  outputs.push({ ...shot, path: filePath, title: String(title || "").trim(), bytes: fs.statSync(filePath).size });
  await page.close();
}

await browser.close();

const manifestPath = path.join(outDir, "manifest.json");
fs.writeFileSync(manifestPath, `${JSON.stringify({
  capturedAt: new Date().toISOString(),
  baseUrl,
  sessionWorkerName: session.workerName,
  screenshots: outputs,
}, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  outDir,
  count: outputs.length,
  screenshots: outputs.map((shot) => ({ id: shot.id, label: shot.label, bytes: shot.bytes })),
}, null, 2));
