// E2E 스모크 테스트 — 핵심 플로우가 실제 브라우저에서 동작하는지 검증
// 실행: npm run e2e  (최초 1회: npm i -D puppeteer-core)
// 크롬 경로: 1) PUPPETEER_EXECUTABLE_PATH 환경변수 2) @sparticuz/chromium 3) OS 기본 설치 경로
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8917;
const PRE = "shipyardSafetyV1.";

async function resolveChrome() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  try {
    const mod = await import("@sparticuz/chromium");
    const chromium = mod.default || mod;
    if (typeof chromium.executablePath === "function") return await chromium.executablePath();
  } catch {}
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    `${process.env.LOCALAPPDATA || ""}\\Google\\Chrome\\Application\\chrome.exe`,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
  ];
  const found = candidates.find((p) => p && existsSync(p));
  if (!found) throw new Error("Chrome 실행 파일을 찾지 못했습니다. PUPPETEER_EXECUTABLE_PATH를 설정하세요.");
  return found;
}

// 07:00 시작 게이트를 항상 통과하도록, 현지 시각이 오후가 되는 타임존을 고른다
function pickTimezone() {
  const utcH = new Date().getUTCHours();
  let offset = 13 - utcH; // 현지 13시 부근
  if (offset > 14) offset -= 24;
  if (offset < -12) offset += 24;
  return { tz: `Etc/GMT${offset <= 0 ? "+" : "-"}${Math.abs(offset)}`, offset };
}

function dateInTz(tz) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function buildSeed(todayStr) {
  const now = new Date().toISOString();
  // 실서버 동기화 환경에서 이전 실행의 제출 이력과 충돌하지 않도록 작업지시서 ID는 실행마다 고유하게 만든다
  const runId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const W = (id, name, team, position) => ({ id, name, team, position, active: true, unsafePushTarget: true, createdAt: now, updatedAt: now });
  const ship = (id, no, type, stage, order) => ({ id, no, type, note: "", processStage: stage, deliveryType: "", deliveryDate: "", lcDate: "2099-01-01", stDate: "", clDate: "", dlDate: "", createdAt: now, order });
  return {
    [PRE + "storageVersion"]: "__APP_VERSION__",
    [PRE + "workers"]: [W("w-kim", "김조장", "선행", "조장"), W("w-hong", "홍길동", "선행", "작업자"), W("w-lee", "이순신", "선행", "작업자")],
    [PRE + "ships"]: [ship("s-2401", "2401", "LNG운반선", "mounting", 1), ship("s-2402", "2402", "컨테이너선", "lc", 2)],
    [PRE + "tools"]: [
      { id: "t-welder", categoryId: "welding", name: "용접기", nature: "선행/후행", deleted: false, createdAt: now, order: 1 },
      { id: "t-grinder", categoryId: "welding", name: "그라인더", nature: "선행/후행", deleted: false, createdAt: now, order: 2 },
    ],
    [PRE + "workPrepRecords"]: [{
      id: `wp-e2e-${runId}`, workDate: todayStr, appearanceTime: "08:00", team: "선행", shipNo: "2401", categoryId: "welding",
      leaderWorkerId: "w-kim", workerIds: ["w-kim", "w-hong", "w-lee"], otherTeamWorkerIds: [], toolIds: ["t-welder", "t-grinder"],
      status: "preparing", statusHistory: [], createdAt: now, updatedAt: now, deletedAt: "",
    }],
  };
}

const MIME = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };

function startServer() {
  return new Promise((resolve) => {
    const srv = createServer((req, res) => {
      let p = decodeURIComponent(req.url.split("?")[0]);
      if (p === "/") p = "/index.html";
      if (p === "/sw.js") { res.writeHead(404); res.end(""); return; }
      try {
        const data = readFileSync(join(ROOT, p));
        res.writeHead(200, { "Content-Type": MIME[extname(p)] || "application/octet-stream" });
        res.end(data);
      } catch {
        res.writeHead(404); res.end("nf");
      }
    }).listen(PORT, () => resolve(srv));
  });
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// 단계가 영원히 멈추지 않도록(크래시된 탭의 evaluate 등) 시간 상한을 둔다
const withTimeout = (promise, ms, label = "단계 시간 초과") =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error(label)), ms))]);
let failures = 0;
function check(label, ok) {
  console.log(`${ok ? "  ✓" : "  ✗ FAIL"} ${label}`);
  if (!ok) failures += 1;
}

async function clickBtn(page, text) {
  return page.evaluate((t) => {
    const els = [...document.querySelectorAll("button,[role=button]")];
    const norm = (b) => b.innerText.replace(/\s+/g, " ").trim();
    let el = els.find((b) => b.offsetParent && !b.disabled && norm(b) === t);
    if (!el) el = els.find((b) => b.offsetParent && !b.disabled && norm(b).startsWith(t));
    if (!el) el = els.find((b) => b.offsetParent && !b.disabled && b.tagName === "BUTTON" && norm(b).includes(t));
    if (el) { el.click(); return true; }
    return false;
  }, text);
}

async function checkAllBoxes(page) {
  for (let i = 0; i < 40; i += 1) {
    const did = await page.evaluate(() => {
      const cb = [...document.querySelectorAll("input[type=checkbox]")].find((c) => !c.checked && !c.disabled);
      if (cb) { cb.click(); return true; }
      return false;
    });
    if (!did) break;
    await wait(180);
  }
}

const bodyText = (page) => page.evaluate(() => document.body.innerText.replace(/\s+/g, " "));

async function main() {
  const appVersion = (readFileSync(join(ROOT, "sw.js"), "utf8").match(/APP_VERSION = "([^"]+)"/) || [])[1] || "";
  const { tz } = pickTimezone();
  const todayStr = dateInTz(tz);
  const seed = JSON.parse(JSON.stringify(buildSeed(todayStr)).replace("__APP_VERSION__", appVersion));

  const puppeteer = (await import("puppeteer-core")).default;
  const executablePath = await resolveChrome();
  const isServerlessChromium = /chromium|\/tmp\//.test(executablePath);
  const srv = await startServer();
  const launchBrowser = () => puppeteer.launch({
    executablePath, headless: true,
    args: [
      "--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--lang=ko-KR",
      ...(isServerlessChromium ? ["--single-process", "--no-zygote"] : []),
    ],
    defaultViewport: { width: 390, height: 844 },
  });
  let browser = await launchBrowser();
  // 헤르메틱 가드 — 실서버(Supabase)로의 모든 요청을 차단해 실데이터 오염/유입을 막는다.
  // 차단(abort)은 샌드박스 프록시 차단과 동일하게 동작하며, 앱은 로컬 데이터로 정상 폴백한다(pullRemote catch).
  let blockedBackendRequests = 0;
  const LOCAL_ORIGINS = [`http://localhost:${PORT}/`, `http://127.0.0.1:${PORT}/`];
  const makePage = async () => {
    const newPage = await browser.newPage();
    await newPage.emulateTimezone(tz);
    newPage.on("dialog", (d) => d.accept());
    await newPage.setRequestInterception(true);
    newPage.on("request", (req) => {
      const url = req.url();
      if (LOCAL_ORIGINS.some((o) => url.startsWith(o)) || url.startsWith("data:") || url.startsWith("blob:")) {
        req.continue().catch(() => {});
        return;
      }
      if (/supabase\./i.test(url)) blockedBackendRequests += 1;
      req.abort("failed").catch(() => {});
    });
    // WebSocket(realtime)은 요청 인터셉션 대상이 아니므로, 실서버 주소를 닿을 수 없는 로컬 포트로 돌린다
    await newPage.evaluateOnNewDocument(() => {
      const NativeWebSocket = window.WebSocket;
      window.WebSocket = new Proxy(NativeWebSocket, {
        construct(target, args) {
          if (/supabase\./i.test(String(args[0] || ""))) {
            return new target("ws://127.0.0.1:9/", ...args.slice(1));
          }
          return new target(...args);
        },
      });
    });
    await newPage.evaluateOnNewDocument((PRE, SEED) => {
      for (const [k, v] of Object.entries(SEED)) localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
      sessionStorage.setItem(PRE + "workerSession", JSON.stringify({ workerId: "w-hong", workerName: "홍길동", employeeNo: "1234", loggedInAt: new Date().toISOString() }));
    }, PRE, seed);
    return newPage;
  };
  let page = await makePage();

  const goto = async (path) => {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        await page.goto(`http://localhost:${PORT}/${path}`, { waitUntil: "networkidle2", timeout: 25000 });
        await wait(1500);
        await page.evaluate(() => document.body.innerText.length);
        return;
      } catch (error) {
        if (attempt === 1) throw error;
        await wait(1200);
      }
    }
  };

  console.log(`E2E 스모크 시작 (tz=${tz}, today=${todayStr}, app=${appVersion})`);

  // 1. 홈 — 오늘 내 점검 카드
  await goto("index.html");
  let text = await bodyText(page);
  check("홈: '오늘 내 점검' 카드 표시", text.includes("오늘 내 점검"));
  check("홈: 로그인 작업자 미점검 안내", /홍길동님, 미점검 1건/.test(text));

  // 1-2. 추출된 뷰 모듈 화면 렌더 확인 (호선/서약/이력)
  await goto("ships.html");
  check("호선: 공정 현황 보드 렌더", (await bodyText(page)).includes("호선 공정 현황"));
  await goto("pledge.html");
  check("서약: 관리 화면 렌더", (await bodyText(page)).includes("안전 서약 관리"));
  await goto("history.html");
  check("이력: 점검 현황 요약 렌더", (await bodyText(page)).includes("오늘 작업자 점검 현황"));
  await goto("manage.html");
  check("관리: 접수 현황 화면 렌더", (await bodyText(page)).includes("불안전요소"));


  // 2. 작업 전 점검 제출 플로우
  await goto("check.html");
  check("점검: 작업지시서 카드 표시", (await bodyText(page)).includes("작업지시서"));
  check("점검: [점검 시작] 클릭", await clickBtn(page, "점검 시작")); await wait(1500);
  check("점검: STEP 2 공기구 확인 진입", (await bodyText(page)).includes("공기구 확인"));
  check("점검: [다음 점검표로] 클릭", await clickBtn(page, "다음 점검표로")); await wait(1500);
  await checkAllBoxes(page);
  await page.click("#pledgeSignatureText");
  await page.keyboard.type("홍길동", { delay: 40 });
  await page.evaluate(() => {
    const el = document.querySelector("#pledgeSignatureText");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.blur();
  });
  await wait(700);
  check("점검: [제출하기] 클릭", await clickBtn(page, "제출하기")); await wait(2200);
  check("점검: 제출 완료 화면", (await bodyText(page)).includes("점검이 제출되었습니다"));

  // 3. 홈 카드가 '완료'로 바뀌는지
  await goto("index.html");
  check("홈: 점검 후 '모두 마쳤습니다' 표시", (await bodyText(page)).includes("오늘 점검을 모두 마쳤습니다"));

  // 4. 불안전요소 등록 플로우
  await goto("unsafe.html");
  await page.evaluate(() => {
    const sel = [...document.querySelectorAll("select")].find((s) => s.offsetParent);
    const opt = [...sel.options].find((o) => /2401/.test(o.textContent));
    sel.value = opt.value; sel.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await wait(700);
  check("불안전: 호선 선택 후 다음", await clickBtn(page, "선택 → 다음")); await wait(1300);
  await page.evaluate(() => { [...document.querySelectorAll("textarea")].find((t) => t.offsetParent).focus(); });
  await page.keyboard.type("E2E 자동 점검용 위험요소", { delay: 10 });
  await wait(500);
  check("불안전: 최종 확인 이동", await clickBtn(page, "다음 → 최종 확인")); await wait(1300);
  check("불안전: 접수 클릭", await clickBtn(page, "불안전요소 접수")); await wait(1800);
  check("불안전: 접수 완료 화면", (await bodyText(page)).includes("신고가 접수되었습니다"));

  // 5. 헤르메틱 검증 — 앱이 실서버 요청을 시도했고, 전부 인터셉터에서 차단되었는지
  check(`차단: Supabase 요청 인터셉트 동작 (${blockedBackendRequests}건 차단)`, blockedBackendRequests > 0);

  // 6. 자재누락 등록 플로우 (불안정 환경 대비 1회 재시도)
  const runMaterialsFlow = async () => {
    await goto("materials.html");
    await page.evaluate(() => {
      const sel = [...document.querySelectorAll("select")].find((x) => x.offsetParent);
      const opt = [...sel.options].find((o) => /2402/.test(o.textContent));
      sel.value = opt.value; sel.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await wait(700);
    if (!await clickBtn(page, "선택 → 다음")) return false; await wait(1300);
    await clickBtn(page, "용접 소모품"); await wait(400);
    await page.evaluate(() => { [...document.querySelectorAll("input")].find((i) => i.offsetParent && (i.placeholder || "").includes("볼트")).focus(); });
    await page.keyboard.type("용접봉 E7016", { delay: 10 }); await wait(400);
    if (!await clickBtn(page, "다음 → 수량")) return false; await wait(1300);
    await page.evaluate(() => { [...document.querySelectorAll("input")].find((i) => i.offsetParent).focus(); });
    await page.keyboard.type("5", { delay: 20 }); await wait(400);
    if (!await clickBtn(page, "다음 → 최종 확인")) return false; await wait(1300);
    if (!await clickBtn(page, "누락 자재 등록")) return false; await wait(1800);
    return (await bodyText(page)).includes("자재 누락이 등록되었습니다");
  };
  let materialsOk = false;
  for (let attempt = 0; attempt < 2 && !materialsOk; attempt += 1) {
    try { await withTimeout(page.close(), 10000); } catch {}
    try { page = await withTimeout(makePage(), 20000); } catch {
      try { await withTimeout(browser.close(), 10000); } catch {}
      try { browser.process()?.kill("SIGKILL"); } catch {}
      browser = await launchBrowser();
      page = await makePage();
    }
    try { materialsOk = await withTimeout(runMaterialsFlow(), 120000); } catch { materialsOk = false; }
  }
  check("자재: 등록 플로우 완료", materialsOk);

  try { await withTimeout(browser.close(), 10000); } catch { try { browser.process()?.kill("SIGKILL"); } catch {} }
  srv.close();
  if (failures) {
    console.error(`\nE2E 실패: ${failures}건`);
    process.exit(1);
  }
  console.log("\nE2E 스모크 전체 통과");
  process.exit(0);
}

main().catch((error) => { console.error("E2E 오류:", error.message); process.exit(1); });
