// E2E 스모크 테스트 — 핵심 플로우가 실제 브라우저에서 동작하는지 검증
// 실행: npm run e2e  (최초 1회: npm i -D puppeteer-core)
// 크롬 경로: 1) PUPPETEER_EXECUTABLE_PATH 환경변수 2) @sparticuz/chromium 3) OS 기본 설치 경로
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8917;
const PRE = "shipyardSafetyV1.";
const PWA_ONLY = process.argv.includes("--pwa-only");
const DESIGN_TOKEN_VISUAL = process.argv.includes("--design-token-visual");
const HOME_VISUAL_ONLY = process.argv.includes("--home-visual-only");
const MANAGE_MOBILE_VISUAL_ONLY = process.argv.includes("--manage-mobile-visual-only");

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

const TEST_TIME_ZONE = "Asia/Seoul";

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
      if (p === "/sw.js" && !PWA_ONLY) { res.writeHead(404); res.end(""); return; }
      try {
        const data = readFileSync(join(ROOT, p));
        const headers = { "Content-Type": MIME[extname(p)] || "application/octet-stream" };
        if (p === "/sw.js") {
          headers["Cache-Control"] = "no-store, no-cache, must-revalidate";
          headers["Service-Worker-Allowed"] = "/";
        }
        res.writeHead(200, headers);
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
  const swSource = readFileSync(join(ROOT, "sw.js"), "utf8");
  const appVersion = (swSource.match(/APP_VERSION = "([^"]+)"/) || [])[1] || "";
  const assetToken = (swSource.match(/ASSET_TOKEN = "([^"]+)"/) || [])[1] || "";
  if (!appVersion || !assetToken) throw new Error("sw.js에서 APP_VERSION/ASSET_TOKEN을 확인할 수 없습니다.");
  const tz = TEST_TIME_ZONE;
  const todayStr = dateInTz(tz);
  const testNowMs = Date.parse(`${todayStr}T13:00:00+09:00`);
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
  let inspectionDeletionProbeRequests = 0;
  let inspectionSubmitMutationRequests = 0;
  const LOCAL_ORIGINS = [`http://localhost:${PORT}/`, `http://127.0.0.1:${PORT}/`];
  const makePage = async (options = {}) => {
    const pageBrowser = options.browserInstance || browser;
    const newPage = await pageBrowser.newPage();
    const mockRemoteRows = {
      safety_categories: [{
        id: "welding",
        label: "용접",
        icon: "",
        color: "#2E5DA6",
        require_tool_check: true,
        tool_nature: "선행/후행",
        tool_ids: ["t-welder", "t-grinder"],
        sort_order: 1,
      }],
      safety_tools: (seed[PRE + "tools"] || []).map((tool) => ({
        id: tool.id,
        category_id: tool.categoryId,
        name: tool.name,
        nature: tool.nature,
        deleted: tool.deleted,
        sort_order: tool.order,
      })),
      safety_ships: (seed[PRE + "ships"] || []).map((ship) => ({
        id: ship.id,
        no: ship.no,
        type: ship.type,
        note: JSON.stringify({
          _shipMeta: 1,
          note: ship.note || "",
          lcDate: ship.lcDate || "",
          stDate: ship.stDate || "",
          clDate: ship.clDate || "",
          dlDate: ship.dlDate || "",
          deliveryType: ship.deliveryType || "",
          deliveryDate: ship.deliveryDate || "",
        }),
        process_stage: ship.processStage,
        delivery_type: ship.deliveryType,
        delivery_date: ship.deliveryDate || null,
        created_at: ship.createdAt,
        sort_order: ship.order,
      })),
      workers_public: (seed[PRE + "workers"] || []).map((worker) => ({
        id: worker.id,
        name: worker.name,
        team: worker.team,
        position: worker.position,
        active: worker.active,
        unsafe_push_target: worker.unsafePushTarget,
        created_at: worker.createdAt,
        updated_at: worker.updatedAt,
      })),
      work_prep_records: (seed[PRE + "workPrepRecords"] || []).map((record) => ({
        id: record.id,
        work_date: record.workDate,
        appearance_time: record.appearanceTime,
        team: record.team,
        ship_no: record.shipNo,
        category_id: record.categoryId,
        leader_worker_id: record.leaderWorkerId,
        worker_ids: record.workerIds,
        other_team_worker_ids: record.otherTeamWorkerIds,
        tool_ids: record.toolIds,
        status: options.mockVisualRecords ? "confirmed" : record.status,
        status_history: record.statusHistory,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
        deleted_at: null,
      })),
      unsafe_issues: options.mockVisualRecords ? [{
        id: "visual-unsafe-1", ship_no: "2401", content: "통로 적치물 확인", worker_id: "w-hong", worker_name_snapshot: "홍길동", worker_team_snapshot: "선행", status: "접수", admin_memo: "", created_at: new Date(testNowMs).toISOString(), updated_at: new Date(testNowMs).toISOString(), completed_at: null, status_history: [],
      }] : [],
      missing_materials: options.mockVisualRecords ? [{
        id: "visual-material-1", ship_no: "2401", material_name: "안전 난간", quantity: 2, unit: "EA", worker_id: "w-hong", worker_name_snapshot: "홍길동", worker_team_snapshot: "선행", status: "접수", admin_memo: "", created_at: new Date(testNowMs).toISOString(), updated_at: new Date(testNowMs).toISOString(), completed_at: null, status_history: [],
      }] : [],
    };
    await newPage.emulateTimezone(tz);
    await newPage.evaluateOnNewDocument((nowMs) => {
      const NativeDate = Date;
      class TestDate extends NativeDate {
        constructor(...args) {
          super(...(args.length ? args : [nowMs]));
        }

        static now() {
          return nowMs;
        }
      }
      Object.setPrototypeOf(TestDate, NativeDate);
      globalThis.Date = TestDate;
    }, testNowMs);
    if (options.mockRealtime) {
      await newPage.evaluateOnNewDocument((realtimeInspectionRows, remoteRows, mutationDelayMs) => {
        const handlers = [];
        const statusCallbacks = [];
        const metrics = { reads: 0, removedChannels: 0, tables: [], channels: {}, timeline: [], mutations: [] };
        let socketConnected = true;
        const queryFor = (table) => {
          const query = {
            select() { return query; },
            order() { return query; },
            limit() { return query; },
            gt() { return query; },
            gte() { return query; },
            lte() { return query; },
            eq() { return query; },
            in() { return query; },
            then(resolve) {
              metrics.reads += 1;
              resolve({
                data: table === "safety_inspections" ? realtimeInspectionRows : (remoteRows[table] || []),
                error: null,
              });
            },
          };
          return query;
        };
        const client = {
          from: (table) => {
            metrics.timeline.push({ type: "from", table });
            return queryFor(table);
          },
          channel: (name) => {
            const channelState = metrics.channels[name] || (metrics.channels[name] = {
              on: [],
              statuses: [],
              subscribeCalls: 0,
              subscribed: false,
            });
            const channel = {
              __realtimeTestState: channelState,
              on(kind, filter, handler) {
                handlers.push({ channelState, table: filter.table, handler });
                channelState.on.push({ kind, filter });
                metrics.tables.push(filter.table);
                return channel;
              },
              subscribe(callback) {
                metrics.timeline.push({ type: "subscribe-call", channel: name });
                channelState.subscribeCalls += 1;
                channelState.subscribed = true;
                statusCallbacks.push({ channelState, callback });
                const notifySubscribed = () => {
                  channelState.statuses.push("SUBSCRIBED");
                  metrics.timeline.push({ type: "status", channel: name, status: "SUBSCRIBED" });
                  callback("SUBSCRIBED");
                };
                if (name === "gs-safety-inspection-deletions") setTimeout(notifySubscribed, 50);
                else queueMicrotask(notifySubscribed);
                return channel;
              },
            };
            return channel;
          },
          removeChannel(channel) {
            metrics.removedChannels += 1;
            if (channel?.__realtimeTestState) channel.__realtimeTestState.subscribed = false;
          },
          realtime: { isConnected: () => socketConnected },
          functions: {
            invoke: async (_slug, invokeOptions = {}) => {
              const body = invokeOptions?.body || {};
              metrics.mutations.push(String(body.action || "missing"));
              if (mutationDelayMs > 0) await new Promise((resolve) => setTimeout(resolve, mutationDelayMs));
              return {
                data: body.action === "updateWorkPrepStatus"
                  ? {
                    ok: true,
                    mutated: 1,
                    result: {
                      status: body.status,
                      status_history: [{ status: body.status, changedAt: new Date().toISOString(), actor: "E2E 관리자" }],
                      updated_at: new Date().toISOString(),
                    },
                  }
                  : { ok: true, mutated: 1 },
                error: null,
              };
            },
          },
        };
        const fakeSupabase = { createClient: () => client };
        Object.defineProperty(window, "supabase", {
          configurable: true,
          get: () => fakeSupabase,
          set: () => {},
        });
        window.__realtimeTest = {
          metrics,
          emit(table, payload) {
            handlers
              .filter((entry) => entry.channelState.subscribed && entry.table === table)
              .forEach((entry) => entry.handler(payload));
          },
          fail(status = "CHANNEL_ERROR") {
            socketConnected = false;
            statusCallbacks.forEach(({ channelState, callback }) => {
              channelState.statuses.push(status);
              callback(status);
            });
          },
        };
      }, options.realtimeInspectionRows || [], mockRemoteRows, Number(options.mockAdminMutationDelayMs || 0));
    }
    newPage.on("dialog", (d) => d.accept());
    await newPage.setRequestInterception(true);
    newPage.on("request", (req) => {
      const url = req.url();
      const isInspectionDeletionRead = url.includes(".supabase.co/rest/v1/safety_inspection_deletions");
      const isInspectionRead = url.includes(".supabase.co/rest/v1/safety_inspections");
      const remoteTable = (url.match(/\.supabase\.co\/rest\/v1\/([^?]+)/) || [])[1];
      if (options.mockSupabaseReads && req.method() === "GET" && remoteTable) {
        const requestHeaders = req.headers();
        req.respond({
          status: 200,
          contentType: "application/json",
          headers: {
            "Access-Control-Allow-Origin": requestHeaders.origin || `http://localhost:${PORT}`,
            "Access-Control-Allow-Headers": requestHeaders["access-control-request-headers"] || "authorization, x-client-info, apikey, content-type, prefer, x-retry-count, accept-profile, content-profile",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0-${Math.max(0, (mockRemoteRows[remoteTable] || []).length - 1)}/${(mockRemoteRows[remoteTable] || []).length}`,
          },
          body: JSON.stringify(mockRemoteRows[remoteTable] || []),
        }).catch(() => {});
        return;
      }
      if (options.mockSupabaseWrites
        && req.method() === "GET"
        && (isInspectionDeletionRead || isInspectionRead)) {
        const requestHeaders = req.headers();
        if (isInspectionDeletionRead) inspectionDeletionProbeRequests += 1;
        req.respond({
          status: 200,
          contentType: "application/json",
          headers: {
            "Access-Control-Allow-Origin": requestHeaders.origin || `http://localhost:${PORT}`,
            "Access-Control-Allow-Headers": requestHeaders["access-control-request-headers"] || "authorization, x-client-info, apikey, content-type, prefer, x-retry-count, accept-profile, content-profile",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Expose-Headers": "Content-Range",
          },
          body: "[]",
        }).catch(() => {});
        return;
      }
      if (options.mockSupabaseWrites && url.includes(".supabase.co/rest/v1/") && req.method() !== "GET") {
        const requestHeaders = req.headers();
        req.respond({
          status: req.method() === "OPTIONS" ? 200 : 201,
          contentType: "application/json",
          headers: {
            "Access-Control-Allow-Origin": requestHeaders.origin || `http://localhost:${PORT}`,
            "Access-Control-Allow-Headers": requestHeaders["access-control-request-headers"] || "authorization, x-client-info, apikey, content-type, prefer, x-retry-count, accept-profile, content-profile",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Expose-Headers": "Content-Range",
          },
          body: req.method() === "OPTIONS" ? "" : "[]",
        }).catch(() => {});
        return;
      }
      if ((options.mockAdminMutations || options.mockSupabaseWrites) && url.includes("/functions/v1/admin-mutations")) {
        let mutation = {};
        try {
          mutation = JSON.parse(req.postData() || "{}");
        } catch {}
        if (options.mockSupabaseWrites) {
          try {
            if (mutation.action === "submitInspection"
              && mutation.inspection
              && Array.isArray(mutation.items)
              && mutation.mutationSession?.token) inspectionSubmitMutationRequests += 1;
          } catch {}
        }
        const response = {
          status: 200,
          contentType: "application/json",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
          },
          body: req.method() === "OPTIONS" ? "ok" : JSON.stringify(mutation.action === "updateWorkPrepStatus"
            ? {
              ok: true,
              mutated: 1,
              result: {
                status: mutation.status,
                status_history: [{ status: mutation.status, changedAt: new Date().toISOString(), actor: "E2E 관리자" }],
                updated_at: new Date().toISOString(),
              },
            }
            : { ok: true, mutated: 1 }),
        };
        const respond = () => req.respond(response).catch(() => {});
        const delay = Number(options.mockAdminMutationDelayMs || 0);
        if (delay > 0) setTimeout(respond, delay);
        else respond();
        return;
      }
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
    await newPage.evaluateOnNewDocument((PRE, SEED, mockSupabaseWrites) => {
      for (const [k, v] of Object.entries(SEED)) localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
      sessionStorage.setItem(PRE + "workerSession", JSON.stringify({
        workerId: "w-hong",
        workerName: "홍길동",
        employeeNo: "1234",
        loggedInAt: new Date().toISOString(),
        mutationToken: mockSupabaseWrites ? "e2e-worker-mutation" : "",
        mutationExpiresAt: mockSupabaseWrites ? new Date(Date.now() + 60 * 60 * 1000).toISOString() : "",
      }));
    }, PRE, seed, Boolean(options.mockSupabaseWrites));
    return newPage;
  };
  let page = await makePage({ mockSupabaseWrites: true });

  const goto = async (path) => {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        await page.goto(`http://localhost:${PORT}/${path}`, { waitUntil: "domcontentloaded", timeout: 25000 });
        await wait(1500);
        await page.evaluate(() => document.body.innerText.length);
        return;
      } catch (error) {
        if (attempt === 1) throw error;
        await wait(1200);
      }
    }
  };

  const runDesignTokenViewportFlow = async () => {
    const allViewports = [
      { label: "PC", width: 1366, height: 768, mobile: false },
      { label: "430", width: 430, height: 932, mobile: true },
      { label: "390", width: 390, height: 844, mobile: true },
      { label: "360", width: 360, height: 800, mobile: true },
    ];
    const viewports = MANAGE_MOBILE_VISUAL_ONLY ? allViewports.filter((viewport) => viewport.mobile) : allViewports;
    const visualRoutes = [
      { label: "홈", path: "index.html", selector: ".home-v4", kpiSelector: ".home-v4__grid", home: true },
      { label: "작업 전 점검", path: "check.html", selector: ".check-flow-v4", kpiSelector: ".check-flow-steps", flow: true, kpiCount: 3, mobileColumns: 3 },
      { label: "서약", path: "pledge.html", selector: ".pledge-action-view", kpiSelector: ".pledge-action-kpis" },
      { label: "통계", path: "analytics.html", selector: ".analytics-board", kpiSelector: ".analytics-action-grid" },
      { label: "관리", path: "manage.html", selector: ".manage-center", surfaceOnly: true },
      { label: "호선", path: "ships.html", selector: ".ships-v4", surfaceOnly: true },
      { label: "점검 이력", path: "history.html", selector: ".history-v4", surfaceOnly: true },
      { label: "빠른 메뉴", path: "items.html", selector: ".quick-menu-v4", surfaceOnly: true },
      { label: "관리 불안전요소", path: "manage.html", query: "?__admin=0", manageTab: "unsafe", selector: ".unsafe-v4", surfaceOnly: true, screenshotKey: "manage-unsafe" },
      { label: "관리 자재 누락", path: "manage.html", manageTab: "materials", selector: ".materials-v4", surfaceOnly: true, screenshotKey: "manage-materials" },
      { label: "관리 푸시", path: "manage.html", manageTab: "push", selector: ".governance-v4--push", surfaceOnly: true, screenshotKey: "manage-push" },
      { label: "관리 안전수칙", path: "manage.html", manageTab: "safetySettings", selector: ".governance-v4--safety", surfaceOnly: true, screenshotKey: "manage-safety" },
    ];
    const routes = MANAGE_MOBILE_VISUAL_ONLY
      ? visualRoutes.filter((route) => route.path === "manage.html" && !route.manageTab)
      : HOME_VISUAL_ONLY
        ? visualRoutes.filter((route) => route.home)
        : visualRoutes;
    const evidenceDir = MANAGE_MOBILE_VISUAL_ONLY
      ? join(ROOT, "artifacts", "mobile-design")
      : join(ROOT, ".omo", "evidence", "design-token");
    if (DESIGN_TOKEN_VISUAL) mkdirSync(evidenceDir, { recursive: true });
    const results = [];
    const visualBrowser = await launchBrowser();
    try {
      for (const viewport of viewports) {
      const visualContext = await visualBrowser.createBrowserContext();
      const visualPage = await makePage({ browserInstance: visualContext, mockSupabaseWrites: true, mockSupabaseReads: true, mockVisualRecords: true });
      await visualPage.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });
      await visualPage.evaluateOnNewDocument((storagePrefix, screenMode) => {
        const visualParams = new URLSearchParams(window.location.search);
        const visualManageTab = visualParams.get("__manageTab") || "workers";
        const visualAdminEnabled = visualParams.get("__admin") !== "0";
        localStorage.setItem(storagePrefix + "screenMode", screenMode);
        localStorage.setItem(storagePrefix + "manageTab", JSON.stringify(visualManageTab));
        const workPrepRecords = JSON.parse(localStorage.getItem(storagePrefix + "workPrepRecords") || "[]");
        localStorage.setItem(storagePrefix + "workPrepRecords", JSON.stringify(workPrepRecords.map((record) => ({ ...record, status: "confirmed" }))));
        localStorage.setItem(storagePrefix + "unsafeIssues", JSON.stringify([{
          id: "visual-unsafe-1", shipNo: "2401", content: "통로 적치물 확인", workerNameSnapshot: "홍길동", status: "접수", createdAt: new Date().toISOString(), statusHistory: [],
        }]));
        localStorage.setItem(storagePrefix + "missingMaterials", JSON.stringify([{
          id: "visual-material-1", shipNo: "2401", materialName: "안전 난간", quantity: 2, unit: "EA", workerNameSnapshot: "홍길동", status: "접수", createdAt: new Date().toISOString(), statusHistory: [],
        }]));
        if (visualAdminEnabled) {
          sessionStorage.setItem(storagePrefix + "adminMode", "true");
          sessionStorage.setItem(storagePrefix + "adminAuthSource", "worker");
          sessionStorage.setItem(storagePrefix + "adminSession", JSON.stringify({
            token: "e2e-admin-session",
            workerId: "w-hong",
            expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          }));
        } else {
          sessionStorage.removeItem(storagePrefix + "adminMode");
          sessionStorage.removeItem(storagePrefix + "adminAuthSource");
          sessionStorage.removeItem(storagePrefix + "adminSession");
        }
      }, PRE, viewport.mobile ? "mobile" : "desktop");
      try {
        for (const route of routes) {
          const routeParams = new URLSearchParams(route.query || "");
          if (route.manageTab) routeParams.set("__manageTab", route.manageTab);
          const routeQuery = routeParams.toString();
          await visualPage.goto(`http://localhost:${PORT}/${route.path}${routeQuery ? `?${routeQuery}` : ""}`, { waitUntil: "domcontentloaded", timeout: 25000 });
          await wait(900);
          if (route.manageTab) {
            const selected = await visualPage.evaluate((tab) => {
              const button = [...document.querySelectorAll(`[data-manage-center-tab="${tab}"]`)]
                .find((candidate) => candidate.getClientRects().length > 0);
              button?.click();
              return Boolean(button);
            }, route.manageTab);
            if (!selected) throw new Error(`manage visual tab unavailable: ${route.manageTab}`);
            await visualPage.waitForSelector(route.selector, { visible: true, timeout: 8000 });
            await wait(1000);
            const stayedSelected = await visualPage.$eval(route.selector, (surface) => surface.getClientRects().length > 0).catch(() => false);
            if (!stayedSelected) {
              await visualPage.evaluate((tab) => document.querySelector(`[data-manage-center-tab="${tab}"]`)?.click(), route.manageTab);
              await visualPage.waitForSelector(route.selector, { visible: true, timeout: 8000 });
              await wait(300);
            }
          }
          await visualPage.waitForSelector(route.selector, { visible: true, timeout: 8000 });
          const pledgeReady = route.path !== "pledge.html" || await visualPage.waitForFunction(() => {
            const surface = document.querySelector(".pledge-action-view");
            return Boolean(
              surface
              && surface.getAttribute("aria-busy") !== "true"
              && surface.querySelectorAll(".pledge-action-kpi").length >= 3
              && surface.querySelectorAll(".pledge-action-table tbody tr").length > 0,
            );
          }, { timeout: 8000 }).then(() => true).catch(() => false);
          const observation = await visualPage.evaluate((selector, kpiSelector, mobile) => {
            const visible = (element) => {
              const rect = element?.getBoundingClientRect();
              const style = element ? getComputedStyle(element) : null;
              return Boolean(rect && style && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0);
            };
            const rootStyle = getComputedStyle(document.documentElement);
            const bodyStyle = getComputedStyle(document.body);
            const surface = document.querySelector(selector);
            const context = surface?.querySelector(".data-context");
            const kpiGrid = surface?.querySelector(kpiSelector);
            const bottomNav = document.querySelector(".bottom-nav");
            const main = document.querySelector(".main");
            const navVisible = visible(bottomNav);
            const navHeight = navVisible ? bottomNav.getBoundingClientRect().height : 0;
            const mainBottomPadding = main ? Number.parseFloat(getComputedStyle(main).paddingBottom) || 0 : 0;
            const undersized = surface
              ? [...surface.querySelectorAll("button, a, [role=button]")]
                .filter(visible)
                .map((element) => {
                  const rect = element.getBoundingClientRect();
                  return {
                    label: (element.innerText || element.getAttribute("aria-label") || "").trim().slice(0, 32),
                    className: element.className,
                    minHeight: getComputedStyle(element).minHeight,
                    width: rect.width,
                    height: rect.height,
                  };
                })
                .filter((control) => control.width < 44 || control.height < 44)
              : [];
            return {
              surfaceVisible: visible(surface),
              overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
              scrollWidth: document.documentElement.scrollWidth,
              viewportWidth: window.innerWidth,
              navVisible,
              navClear: !mobile || mainBottomPadding >= navHeight,
              homeTitleCount: surface ? surface.querySelectorAll("#homeV4Title").length : 0,
              homeSyncVisible: visible(surface?.querySelector("[data-home-sync]")),
              homeManagementVisible: visible(surface?.querySelector(".home-v4__management")),
              flowTitleCount: surface ? surface.querySelectorAll("h1").length : 0,
              surfaceTitleCount: surface ? surface.querySelectorAll("h1").length : 0,
              surfaceHeadingCount: surface ? surface.querySelectorAll(":scope > header h1, :scope > header h2").length : 0,
              contextVisible: visible(context),
              contextTitleCount: context ? context.querySelectorAll("h1").length : 0,
          hasBusinessDate: [...(context?.querySelectorAll("dt") || [])].some((node) => /기준 날짜|서약 기준일/.test(node.textContent)),
          hasAsOf: [...(context?.querySelectorAll("dt") || [])].some((node) => /최종 반영|데이터 기준/.test(node.textContent)),
              kpiItemCount: kpiGrid ? [...kpiGrid.children].filter(visible).length : 0,
              kpiColumnCount: kpiGrid ? getComputedStyle(kpiGrid).gridTemplateColumns.split(/\s+/).filter(Boolean).length : 0,
              fontFamily: bodyStyle.fontFamily,
              navy: rootStyle.getPropertyValue("--ds-color-navy-950").trim().toUpperCase(),
              teal: rootStyle.getPropertyValue("--ds-color-teal-700").trim().toUpperCase(),
              cream: rootStyle.getPropertyValue("--ds-color-cream-50").trim().toUpperCase(),
              undersized,
            };
          }, route.selector, route.kpiSelector, viewport.mobile);
          let manageDetail = null;
          if (viewport.mobile && route.path === "manage.html" && !route.manageTab) {
            const master = await visualPage.evaluate(() => {
              const visible = (element) => {
                const rect = element?.getBoundingClientRect();
                const style = element ? getComputedStyle(element) : null;
                return Boolean(rect && style && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0);
              };
              const menu = document.querySelector(".manage-center__mobile-menu");
              const desktopTabs = document.querySelector(".manage-center-v4 > .manage-center__tabs");
              const section = document.querySelector(".manage-center__mobile-section");
              const bottomNav = document.querySelector(".bottom-nav");
              return {
                menuVisible: visible(menu),
                rowCount: [...document.querySelectorAll(".manage-center__mobile-menu-row")].filter(visible).length,
                desktopTabsHidden: !visible(desktopTabs),
                sectionClosed: !section?.classList.contains("is-mobile-section-open") && !visible(section),
                bodyUnlocked: !document.body.classList.contains("manage-mobile-detail-open") && getComputedStyle(document.body).overflow !== "hidden",
                bottomNavVisible: visible(bottomNav),
                overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
              };
            });
            if (DESIGN_TOKEN_VISUAL) {
              await visualPage.screenshot({ path: join(evidenceDir, `manage-menu-${viewport.width}.png`), fullPage: true });
            }
            const tabSelection = await visualPage.evaluate((storagePrefix) => {
              const candidates = [...document.querySelectorAll('[data-manage-center-tab="workPrep"]')];
              const element = candidates.find((candidate) => {
                const rect = candidate.getBoundingClientRect();
                const style = getComputedStyle(candidate);
                return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
              });
              if (!element) return { requested: "workPrep", stored: localStorage.getItem(storagePrefix + "manageTab"), candidateCount: candidates.length, visible: false };
              let clickObserved = 0;
              element.addEventListener("click", () => { clickObserved += 1; });
              const rect = element.getBoundingClientRect();
              const hitTarget = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
              element.click();
              return {
                requested: element.getAttribute("data-manage-center-tab"),
                stored: localStorage.getItem(storagePrefix + "manageTab"),
                clickObserved,
                disabled: element.disabled,
                inertAncestor: Boolean(element.closest("[inert]")),
                visible: rect.width > 0 && rect.height > 0,
                hitSelf: hitTarget === element || Boolean(hitTarget && element.contains(hitTarget)),
              };
            }, PRE);
            const manageRowReady = await visualPage.waitForFunction(() => {
              const surface = document.querySelector(".manage-center");
              const state = surface?.getAttribute("data-manage-center-state");
              return ["ready", "stale", "offline"].includes(state)
                && surface.querySelector(".manage-center__mobile-section.is-mobile-section-open")
                && surface.querySelector("[data-work-prep-record-detail]");
            }, { timeout: 8000 }).then(() => true).catch(() => false);
            if (!manageRowReady) {
              const diagnostic = await visualPage.evaluate(() => ({
                state: document.querySelector(".manage-center")?.getAttribute("data-manage-center-state") || "missing",
                activeTab: document.querySelector('[data-manage-center-tab][aria-selected="true"]')?.getAttribute("data-manage-center-tab") || "missing",
                rowCount: document.querySelectorAll("[data-work-prep-record-detail]").length,
              }));
              throw new Error(`manage mobile detail fixture unavailable: ${JSON.stringify({ tabSelection, diagnostic })}`);
            }
            await visualPage.waitForFunction(() => document.activeElement?.matches('[data-action="back-manage-center-menu"]'), { timeout: 2000 }).catch(() => {});
            const sectionOpened = await visualPage.evaluate(() => {
              const visible = (element) => {
                const rect = element?.getBoundingClientRect();
                const style = element ? getComputedStyle(element) : null;
                return Boolean(rect && style && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0);
              };
              const section = document.querySelector(".manage-center__mobile-section.is-mobile-section-open");
              const back = document.querySelector('[data-action="back-manage-center-menu"]');
              const menu = document.querySelector(".manage-center__mobile-menu");
              const bottomNav = document.querySelector(".bottom-nav");
              const rect = section?.getBoundingClientRect();
              return {
                visible: visible(section),
                fillsViewport: Boolean(rect && rect.top <= 1 && rect.left <= 1 && rect.width >= window.innerWidth - 1 && rect.height >= window.innerHeight - 1),
                bodyLocked: document.body.classList.contains("manage-mobile-detail-open") && getComputedStyle(document.body).overflow === "hidden",
                backVisible: visible(back),
                focusOnBack: document.activeElement === back,
                activeElement: {
                  tag: document.activeElement?.tagName || "",
                  className: document.activeElement?.className || "",
                  action: document.activeElement?.getAttribute("data-action") || "",
                  manageTab: document.activeElement?.getAttribute("data-manage-center-tab") || "",
                },
                menuHidden: !visible(menu),
                bottomNavHidden: !visible(bottomNav),
                overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
              };
            });
            if (DESIGN_TOKEN_VISUAL) {
              await visualPage.screenshot({ path: join(evidenceDir, `manage-work-prep-${viewport.width}.png`), fullPage: false });
            }
            const listObservation = await visualPage.evaluate(() => {
              const visible = (element) => {
                const rect = element?.getBoundingClientRect();
                const style = element ? getComputedStyle(element) : null;
                return Boolean(rect && style && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0);
              };
              return [...document.querySelectorAll(".manage-center button, .manage-center a, .manage-center [role=button]")]
                .filter(visible)
                .map((element) => {
                  const rect = element.getBoundingClientRect();
                  return { label: (element.innerText || element.getAttribute("aria-label") || "").trim().slice(0, 32), width: rect.width, height: rect.height };
                })
                .filter((control) => control.width < 44 || control.height < 44);
            });
            const readOnlyGuard = await visualPage.evaluate(() => {
              const surface = document.querySelector(".manage-center");
              const state = surface?.getAttribute("data-manage-center-state") || "missing";
              const guardedControls = [...document.querySelectorAll('[data-manage-content-read-only="true"] button, [data-manage-content-read-only="true"] input, [data-manage-content-read-only="true"] select, [data-manage-content-read-only="true"] textarea')];
              const safeControlSelector = "[data-unsafe-record-detail], [data-material-record-detail], [data-work-prep-record-detail], [data-manage-center-page], [data-record-filter]";
              const enabledControls = guardedControls.filter((control) => !control.disabled);
              const unexpectedEnabledControls = enabledControls.filter((control) => !control.matches(safeControlSelector));
              const record = [...document.querySelectorAll("[data-work-prep-record-detail]")].find((element) => element.getClientRects().length > 0);
              return {
                state,
                guardedCount: guardedControls.length,
                enabledCount: enabledControls.length,
                unexpectedEnabledCount: unexpectedEnabledControls.length,
                recordNavigable: Boolean(record && record.getAttribute("tabindex") === "0"),
                ok: state === "ready" || (guardedControls.length > 0 && unexpectedEnabledControls.length === 0 && Boolean(record && record.getAttribute("tabindex") === "0")),
              };
            });
            const recordSelection = await visualPage.evaluate(() => {
              const candidates = [...document.querySelectorAll("[data-work-prep-record-detail]")];
              const element = candidates.find((candidate) => {
                const rect = candidate.getBoundingClientRect();
                const style = getComputedStyle(candidate);
                return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
              });
              if (!element) return { id: "", candidateCount: candidates.length, clicked: false };
              element.scrollIntoView({ block: "center" });
              element.focus();
              element.click();
              return { id: element.getAttribute("data-work-prep-record-detail"), candidateCount: candidates.length, clicked: true };
            });
            const recordId = recordSelection.id;
            const detailOpened = await visualPage.waitForFunction(() => document.body.classList.contains("manage-mobile-detail-open") && document.querySelector(".manage-center__detail.is-mobile-fullscreen"), { timeout: 8000 }).then(() => true).catch(() => false);
            if (!detailOpened) {
              const diagnostic = await visualPage.evaluate(() => ({
                bodyClass: document.body.className,
                detailId: document.querySelector("[data-manage-center-selected]")?.getAttribute("data-manage-center-selected") || "missing",
                fullscreenCount: document.querySelectorAll(".manage-center__detail.is-mobile-fullscreen").length,
              }));
              throw new Error(`manage mobile detail did not open: ${JSON.stringify({ tabSelection, recordSelection, diagnostic })}`);
            }
            await visualPage.waitForFunction(() => document.activeElement?.matches('[data-action="back-manage-center-list"],[data-action="back-work-prep-list"]'), { timeout: 2000 }).catch(() => {});
            const opened = await visualPage.evaluate(() => {
              const visible = (element) => {
                const rect = element?.getBoundingClientRect();
                const style = element ? getComputedStyle(element) : null;
                return Boolean(rect && style && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0);
              };
              const detail = document.querySelector(".manage-center__detail.is-mobile-fullscreen");
              const back = [...document.querySelectorAll('[data-action="back-manage-center-list"],[data-action="back-work-prep-list"]')]
                .find(visible);
              const bottomNav = document.querySelector(".bottom-nav");
              const rect = detail?.getBoundingClientRect();
              const undersized = detail
                ? [...detail.querySelectorAll("button, a, [role=button]")]
                  .filter(visible)
                  .map((element) => {
                    const controlRect = element.getBoundingClientRect();
                    return { label: (element.innerText || element.getAttribute("aria-label") || "").trim().slice(0, 32), width: controlRect.width, height: controlRect.height };
                  })
                  .filter((control) => control.width < 44 || control.height < 44)
                : [];
              return {
                bodyLocked: document.body.classList.contains("manage-mobile-detail-open") && getComputedStyle(document.body).overflow === "hidden",
                detailVisible: visible(detail),
                fillsViewport: Boolean(rect && rect.top <= 1 && rect.left <= 1 && rect.width >= window.innerWidth - 1 && rect.height >= window.innerHeight - 1),
                selectedCount: document.querySelectorAll(".manage-center__detail.is-mobile-fullscreen[data-manage-center-selected]").length,
                backVisible: visible(back),
                focusOnBack: document.activeElement === back,
                bottomNavHidden: !visible(bottomNav),
                overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
                undersized,
              };
            });
            if (DESIGN_TOKEN_VISUAL) {
              await visualPage.screenshot({ path: join(evidenceDir, `manage-detail-${viewport.width}.png`), fullPage: false });
            }
            const backSelection = await visualPage.evaluate(() => {
              const candidates = [...document.querySelectorAll('[data-action="back-manage-center-list"],[data-action="back-work-prep-list"]')];
              const element = candidates.find((candidate) => {
                const rect = candidate.getBoundingClientRect();
                const style = getComputedStyle(candidate);
                return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
              });
              if (!element) return { candidateCount: candidates.length, clicked: false };
              element.click();
              return { candidateCount: candidates.length, clicked: true };
            });
            const detailClosed = await visualPage.waitForFunction(() => (
              document.body.classList.contains("manage-mobile-detail-open")
              && !document.querySelector(".manage-center__detail.is-mobile-fullscreen")
              && document.querySelector(".manage-center__mobile-section.is-mobile-section-open")
            ), { timeout: 8000 }).then(() => true).catch(() => false);
            if (!detailClosed) {
              const diagnostic = await visualPage.evaluate(() => ({ bodyClass: document.body.className, fullscreenCount: document.querySelectorAll(".manage-center__detail.is-mobile-fullscreen").length }));
              throw new Error(`manage mobile detail did not close: ${JSON.stringify({ backSelection, diagnostic })}`);
            }
            await visualPage.waitForFunction((expectedId) => document.activeElement?.getAttribute("data-work-prep-record-detail") === expectedId, { timeout: 2000 }, recordId).catch(() => {});
            const returned = await visualPage.evaluate((expectedId) => {
              const visible = (element) => {
                const rect = element?.getBoundingClientRect();
                const style = element ? getComputedStyle(element) : null;
                return Boolean(rect && style && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0);
              };
              const trigger = document.querySelector(`[data-work-prep-record-detail="${CSS.escape(expectedId)}"]`);
              const nav = document.querySelector(".bottom-nav");
              const section = document.querySelector(".manage-center__mobile-section.is-mobile-section-open");
              const sectionBack = document.querySelector('[data-action="back-manage-center-menu"]');
              return {
                bodyLocked: document.body.classList.contains("manage-mobile-detail-open") && getComputedStyle(document.body).overflow === "hidden",
                focusRestored: document.activeElement === trigger,
                sectionVisible: visible(section),
                sectionBackVisible: visible(sectionBack),
                bottomNavHidden: !visible(nav),
                activeElement: {
                  tag: document.activeElement?.tagName || "",
                  action: document.activeElement?.getAttribute("data-action") || "",
                  recordId: document.activeElement?.getAttribute("data-work-prep-record-detail") || "",
                },
                triggerCount: document.querySelectorAll(`[data-work-prep-record-detail="${CSS.escape(expectedId)}"]`).length,
              };
            }, recordId);
            const sectionBackSelection = await visualPage.evaluate(() => {
              const element = [...document.querySelectorAll('[data-action="back-manage-center-menu"]')]
                .find((candidate) => candidate.getClientRects().length > 0);
              if (!element) return false;
              element.click();
              return true;
            });
            const menuReturned = await visualPage.waitForFunction(() => (
              !document.body.classList.contains("manage-mobile-detail-open")
              && !document.querySelector(".manage-center__mobile-section.is-mobile-section-open")
              && document.querySelector(".manage-center__mobile-menu")?.getClientRects().length > 0
            ), { timeout: 8000 }).then(() => true).catch(() => false);
            await visualPage.waitForFunction(() => document.activeElement?.matches('.manage-center__mobile-menu-row[data-manage-center-tab="workPrep"]'), { timeout: 2000 }).catch(() => {});
            const finalReturned = await visualPage.evaluate((menuReturnedOk) => {
              const visible = (element) => {
                const rect = element?.getBoundingClientRect();
                const style = element ? getComputedStyle(element) : null;
                return Boolean(rect && style && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0);
              };
              const trigger = document.querySelector('.manage-center__mobile-menu-row[data-manage-center-tab="workPrep"]');
              return {
                menuReturned: menuReturnedOk,
                bodyUnlocked: !document.body.classList.contains("manage-mobile-detail-open") && getComputedStyle(document.body).overflow !== "hidden",
                focusRestored: document.activeElement === trigger,
                bottomNavVisible: visible(document.querySelector(".bottom-nav")),
                overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
                activeElement: {
                  tag: document.activeElement?.tagName || "",
                  className: document.activeElement?.className || "",
                  action: document.activeElement?.getAttribute("data-action") || "",
                  manageTab: document.activeElement?.getAttribute("data-manage-center-tab") || "",
                },
              };
            }, menuReturned);
            manageDetail = {
              master,
              sectionOpened,
              listUndersized: listObservation,
              readOnlyGuard,
              opened,
              returned,
              finalReturned,
              ok: listObservation.length === 0
                && master.menuVisible
                && master.rowCount === 6
                && master.desktopTabsHidden
                && master.sectionClosed
                && master.bodyUnlocked
                && master.bottomNavVisible
                && !master.overflow
                && sectionOpened.visible
                && sectionOpened.fillsViewport
                && sectionOpened.bodyLocked
                && sectionOpened.backVisible
                && sectionOpened.menuHidden
                && sectionOpened.bottomNavHidden
                && !sectionOpened.overflow
                && readOnlyGuard.ok
                && opened.bodyLocked
                && opened.detailVisible
                && opened.fillsViewport
                && opened.selectedCount === 1
                && opened.backVisible
                && opened.focusOnBack
                && opened.bottomNavHidden
                && !opened.overflow
                && opened.undersized.length === 0
                && returned.bodyLocked
                && returned.focusRestored
                && returned.sectionVisible
                && returned.sectionBackVisible
                && returned.bottomNavHidden
                && sectionBackSelection
                && finalReturned.menuReturned
                && finalReturned.bodyUnlocked
                && finalReturned.bottomNavVisible
                && !finalReturned.overflow,
            };
          }
          const headingContractOk = route.home
            ? observation.homeTitleCount === 1 && !observation.homeSyncVisible && !observation.homeManagementVisible
            : route.flow
              ? observation.flowTitleCount === 1
            : route.surfaceOnly
              ? observation.surfaceTitleCount === 1 || observation.surfaceHeadingCount === 1
            : observation.contextVisible
              && observation.contextTitleCount === 1
              && observation.hasBusinessDate
              && observation.hasAsOf;
          const mobileManageSection = viewport.mobile && route.path === "manage.html" && Boolean(route.manageTab);
          const ok = pledgeReady
            && observation.surfaceVisible
            && !observation.overflow
            && observation.navVisible === (viewport.mobile && !mobileManageSection)
            && observation.navClear
            && headingContractOk
            && (route.surfaceOnly || observation.kpiItemCount === (route.kpiCount || 4))
            && (route.surfaceOnly || !viewport.mobile || observation.kpiColumnCount === (route.mobileColumns || 2))
            && observation.fontFamily.startsWith('"Noto Sans KR"')
            && observation.navy === "#07162F"
            && observation.teal === "#0F766E"
            && observation.cream === "#F8F1E8"
            && observation.undersized.length === 0
            && (!manageDetail || manageDetail.ok);
          results.push({ label: `${viewport.label} ${route.label}`, viewport, route: route.path, ok, pledgeReady, observation, manageDetail });
          if (DESIGN_TOKEN_VISUAL) {
            await visualPage.screenshot({ path: join(evidenceDir, `${route.screenshotKey || route.path.replace(".html", "")}-${viewport.width}.png`), fullPage: true });
          }
        }
      } finally {
        await visualPage.close();
        await visualContext.close();
      }
      }
    } finally {
      try { await withTimeout(visualBrowser.close(), 10000); } catch { try { visualBrowser.process()?.kill("SIGKILL"); } catch {} }
    }
    if (DESIGN_TOKEN_VISUAL) {
      writeFileSync(
        join(evidenceDir, "viewport-observations.json"),
        `${JSON.stringify({ generatedAt: new Date().toISOString(), viewports, routes, results }, null, 2)}\n`,
      );
    }
    return results;
  };

  const runIconPickerFlow = async () => {
    const iconPage = await makePage({ mockAdminMutations: true });
    await iconPage.evaluateOnNewDocument((storagePrefix) => {
      sessionStorage.setItem(storagePrefix + "adminMode", "true");
      sessionStorage.setItem(storagePrefix + "adminAuthSource", "worker");
      sessionStorage.setItem(storagePrefix + "adminSession", JSON.stringify({
        token: "e2e-admin-session",
        workerId: "w-hong",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }));
    }, PRE);
    await iconPage.goto(`http://localhost:${PORT}/items.html`, { waitUntil: "domcontentloaded", timeout: 25000 });
    const result = await iconPage.evaluate(() => {
      const editButton = document.querySelector("[data-edit-category]");
      editButton?.click();
      const input = document.querySelector('[id^="editCategoryIcon_"]');
      const current = input?.value || "";
      const choice = [...document.querySelectorAll("[data-pick-icon]")]
        .find((button) => button.dataset.pickIconTarget === input?.id && button.dataset.pickIcon !== current);
      choice?.click();
      return {
        categoryId: editButton?.dataset.editCategory || "",
        before: current,
        after: input?.value || "",
        active: Boolean(choice?.classList.contains("active")),
      };
    });
    await iconPage.click("[data-apply-category-icon]");
    await iconPage.waitForFunction(() => !document.querySelector("[data-apply-category-icon]"), { timeout: 5000 });
    const applied = await iconPage.evaluate((storagePrefix, categoryId, expectedIcon) => {
      const categories = JSON.parse(localStorage.getItem(storagePrefix + "categories") || "[]");
      return categories.find((row) => row.id === categoryId)?.icon === expectedIcon
        && document.body.innerText.includes("작업 유형 아이콘을 변경했습니다.");
    }, PRE, result.categoryId, result.after);
    await iconPage.close();
    return Boolean(result.before && result.after && result.before !== result.after && result.active && applied);
  };

  const runWorkerDeleteFlow = async () => {
    const workerPage = await makePage({ mockAdminMutations: true, mockRealtime: true });
    await workerPage.evaluateOnNewDocument((storagePrefix) => {
      sessionStorage.setItem(storagePrefix + "workerSession", JSON.stringify({
        workerId: "w-kim",
        workerName: "김조장",
        employeeNo: "1234",
        loggedInAt: new Date().toISOString(),
      }));
      sessionStorage.setItem(storagePrefix + "adminMode", "true");
      sessionStorage.setItem(storagePrefix + "adminAuthSource", "worker");
      sessionStorage.setItem(storagePrefix + "adminSession", JSON.stringify({
        token: "e2e-admin-session",
        workerId: "w-kim",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }));
    }, PRE);
    await workerPage.goto(`http://localhost:${PORT}/manage.html`, { waitUntil: "domcontentloaded", timeout: 25000 });
    await workerPage.waitForFunction(() => {
      const selfToggle = document.querySelector('[data-worker-card-toggle="w-kim"]');
      const targetToggle = document.querySelector('[data-worker-card-toggle="w-lee"]');
      return selfToggle && targetToggle && !selfToggle.disabled && !targetToggle.disabled;
    }, { timeout: 8000 });
    await wait(1000);
    const workerSectionOpened = await workerPage.evaluate(() => {
      const button = [...document.querySelectorAll('.manage-center__mobile-menu-row[data-manage-center-tab="workers"]')]
        .find((candidate) => candidate.getClientRects().length > 0);
      button?.click();
      return Boolean(button);
    });
    if (!workerSectionOpened) {
      await workerPage.close();
      return false;
    }
    await workerPage.waitForFunction(() => (
      document.querySelector(".manage-center__mobile-section.is-mobile-section-open")
      && document.querySelector('.manage-tabs-v4__master [data-worker-card-toggle="w-kim"]')?.getClientRects().length > 0
    ), { timeout: 8000 });
    await workerPage.evaluate(() => document.querySelector('.manage-tabs-v4__master [data-worker-card-toggle="w-kim"]')?.click());
    await workerPage.waitForSelector('.manage-tabs-v4__detail-head [data-worker-card-toggle="w-kim"]');
    await workerPage.click('.manage-tabs-v4__detail-head [data-worker-card-toggle="w-kim"]');
    const selfDeleteDisabled = await workerPage.$eval('[data-delete-worker="w-kim"]', (button) => button.disabled);
    await workerPage.evaluate(() => document.querySelector('.manage-tabs-v4__master [data-worker-card-toggle="w-lee"]')?.click());
    await workerPage.waitForSelector('.manage-tabs-v4__detail-head [data-worker-card-toggle="w-lee"]');
    await workerPage.click('.manage-tabs-v4__detail-head [data-worker-card-toggle="w-lee"]');
    await workerPage.click('[data-delete-worker="w-lee"]');
    await wait(250);
    const targetRemovedFromView = await workerPage.waitForFunction(
      () => !document.querySelector('[data-worker-card-toggle="w-lee"]'),
      { timeout: 5000 },
    ).then(() => true).catch(() => false);
    if (!targetRemovedFromView) {
      const diagnostic = await workerPage.evaluate((storagePrefix) => ({
        dataState: document.querySelector(".data-context")?.dataset.status || "",
        readOnlyGuard: Boolean(document.querySelector('[data-manage-content-read-only="true"]')),
        deleteDisabled: Boolean(document.querySelector('[data-delete-worker="w-lee"]')?.disabled),
        localWorkerCount: JSON.parse(localStorage.getItem(storagePrefix + "workers") || "[]").length,
        failureToast: document.body.innerText.includes("작업자 삭제에 실패했습니다."),
      }), PRE);
      console.log("  작업자 삭제 진단:", JSON.stringify(diagnostic));
    }
    const result = await workerPage.evaluate((storagePrefix) => {
      const workers = JSON.parse(localStorage.getItem(storagePrefix + "workers") || "[]");
      return {
        targetRemoved: !workers.some((worker) => worker.id === "w-lee"),
        countUpdated: document.querySelectorAll("[data-worker-card-toggle]").length === workers.length,
        toastShown: Boolean(document.querySelector("#toast.show")?.textContent?.includes("작업자를 삭제했습니다.")),
      };
    }, PRE);
    await workerPage.close();
    const ok = targetRemovedFromView && selfDeleteDisabled && result.targetRemoved && result.countUpdated && result.toastShown;
    if (!ok) console.log("  작업자 삭제 결과:", JSON.stringify({ targetRemovedFromView, selfDeleteDisabled, ...result }));
    return ok;
  };

  const runManageReadOnlyNavigationFlow = async () => {
    const readOnlyPage = await makePage({ mockSupabaseWrites: true });
    const unsafeId = "unsafe-read-only-e2e";
    const materialId = "material-read-only-e2e";
    await readOnlyPage.evaluateOnNewDocument((storagePrefix, now, unsafeRecordId, materialRecordId) => {
      localStorage.setItem(storagePrefix + "unsafeIssues", JSON.stringify([{
        id: unsafeRecordId,
        shipNo: "2401",
        content: "읽기 전용 불안전요소",
        workerId: "w-hong",
        workerNameSnapshot: "홍길동",
        workerTeamSnapshot: "선행",
        status: "접수",
        adminMemo: "",
        createdAt: now,
        updatedAt: now,
        completedAt: "",
        statusHistory: [],
      }]));
      localStorage.setItem(storagePrefix + "missingMaterials", JSON.stringify([{
        id: materialRecordId,
        shipNo: "2401",
        materialName: "읽기 전용 자재",
        quantity: 1,
        unit: "EA",
        workerId: "w-hong",
        workerNameSnapshot: "홍길동",
        workerTeamSnapshot: "선행",
        status: "접수",
        adminMemo: "",
        createdAt: now,
        updatedAt: now,
        completedAt: "",
        statusHistory: [],
      }]));
      sessionStorage.setItem(storagePrefix + "workerSession", JSON.stringify({
        workerId: "w-kim",
        workerName: "김조장",
        employeeNo: "1234",
        loggedInAt: now,
        mutationToken: "e2e-worker-mutation",
        mutationExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }));
      sessionStorage.setItem(storagePrefix + "adminMode", "true");
      sessionStorage.setItem(storagePrefix + "adminAuthSource", "worker");
      sessionStorage.setItem(storagePrefix + "adminSession", JSON.stringify({
        token: "e2e-admin-session",
        workerId: "w-kim",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }));
    }, PRE, new Date(testNowMs).toISOString(), unsafeId, materialId);

    const clickCurrent = async (selector) => readOnlyPage.evaluate((targetSelector) => {
      const target = [...document.querySelectorAll(targetSelector)].find((node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
      });
      if (!target) return false;
      target.click();
      return true;
    }, selector);

    const selectCachedTab = async (tab, rowSelector) => {
      const sectionOpen = await readOnlyPage.$(".manage-center__mobile-section.is-mobile-section-open");
      if (sectionOpen) {
        if (!await clickCurrent('[data-action="back-manage-center-menu"]')) {
          throw new Error("관리 저장본 메뉴 뒤로 버튼을 찾을 수 없습니다.");
        }
        await readOnlyPage.waitForFunction(() => (
          !document.querySelector(".manage-center__mobile-section.is-mobile-section-open")
          && document.querySelector(".manage-center__mobile-menu")?.getClientRects().length > 0
        ), { timeout: 8000 });
      }
      if (!await clickCurrent(`[data-manage-center-tab="${tab}"]`)) {
        throw new Error(`관리 저장본 탭을 찾을 수 없습니다: ${tab}`);
      }
      await readOnlyPage.waitForFunction((requestedTab, selector) => {
        const state = document.querySelector(".manage-center")?.dataset.manageCenterState || "";
        const tabButton = document.querySelector(`[data-manage-center-tab="${requestedTab}"]`);
        return ["stale", "offline"].includes(state)
          && tabButton?.getAttribute("aria-selected") === "true"
          && Boolean(document.querySelector(selector));
      }, { timeout: 8000 }, tab, rowSelector);
      await wait(250);
    };

    const openAndReturn = async (rowSelector, selectedId, detailSelector, backSelector) => {
      if (!await clickCurrent(rowSelector)) {
        throw new Error(`관리 저장본 행을 찾을 수 없습니다: ${rowSelector}`);
      }
      const detailOpened = await readOnlyPage.waitForFunction((recordId) => (
        document.body.classList.contains("manage-mobile-detail-open")
        && Boolean(document.querySelector(recordId))
      ), { timeout: 5000 }, detailSelector).then(() => true).catch(() => false);
      if (!detailOpened) {
        const diagnostic = await readOnlyPage.evaluate((selector) => ({
          bodyClass: document.body.className,
          selector,
          selectorCount: document.querySelectorAll(selector).length,
          visibleDetails: [...document.querySelectorAll('.manage-center__detail.is-mobile-fullscreen,.unsafe-v4__detail.is-mobile-fullscreen,.materials-v4__detail.is-mobile-fullscreen')]
            .map((node) => ({ className: node.className, id: node.getAttribute('data-manage-center-selected') || node.getAttribute('data-unsafe-v4-detail') || node.getAttribute('data-material-detail') || '' })),
        }), detailSelector);
        throw new Error(`관리 저장본 상세 열기 실패: ${JSON.stringify(diagnostic)}`);
      }
      const detailReadOnly = await readOnlyPage.evaluate((selector, navigationSelector) => {
        const guarded = document.querySelector(selector);
        const controls = [...(guarded?.querySelectorAll("button,input,select,textarea") || [])]
          .filter((control) => !control.matches(navigationSelector));
        return Boolean(guarded) && controls.length > 0 && controls.every((control) => control.disabled);
      }, detailSelector, backSelector);
      if (!await clickCurrent(backSelector)) {
        throw new Error("관리 저장본 상세의 뒤로 버튼을 찾을 수 없습니다.");
      }
      const detailClosed = await readOnlyPage.waitForFunction((selector) => (
        document.body.classList.contains("manage-mobile-detail-open")
        && !document.querySelector(selector)
        && document.querySelector(".manage-center__mobile-section.is-mobile-section-open")
      ), { timeout: 5000 }, detailSelector).then(() => true).catch(() => false);
      if (!detailClosed) {
        const diagnostic = await readOnlyPage.evaluate((selector) => ({
          bodyClass: document.body.className,
          selectorCount: document.querySelectorAll(selector).length,
          selectedMaterial: document.querySelector('.materials-v4__record-button[aria-pressed="true"]')?.getAttribute('data-material-record-detail') || '',
          visibleBackActions: [...document.querySelectorAll('[data-action^="back-"]')]
            .filter((node) => node.getClientRects().length > 0)
            .map((node) => node.getAttribute('data-action')),
        }), detailSelector);
        throw new Error(`관리 저장본 상세 닫기 실패: ${JSON.stringify(diagnostic)}`);
      }
      return detailReadOnly;
    };

    try {
      await readOnlyPage.goto(`http://localhost:${PORT}/manage.html`, { waitUntil: "domcontentloaded", timeout: 25000 });
      await selectCachedTab("unsafe", `[data-unsafe-record-detail="${unsafeId}"]`);
      const unsafeGuard = await readOnlyPage.evaluate((recordId) => {
        const guarded = document.querySelector('[data-manage-content-read-only="true"]');
        const row = guarded?.querySelector(`[data-unsafe-record-detail="${recordId}"]`);
        const navigationSelector = "[data-unsafe-record-detail], [data-material-record-detail], [data-work-prep-record-detail], [data-manage-center-page], [data-record-filter]";
        const mutationControls = [...(guarded?.querySelectorAll("button,input,select,textarea") || [])]
          .filter((control) => !control.matches(navigationSelector));
        return Boolean(row)
          && !row.disabled
          && row.getAttribute("aria-disabled") !== "true"
          && mutationControls.length > 0
          && mutationControls.every((control) => control.disabled);
      }, unsafeId);
      const unsafeDetail = await openAndReturn(
        `[data-unsafe-record-detail="${unsafeId}"]`,
        unsafeId,
        `[data-manage-center-selected="${unsafeId}"].is-mobile-fullscreen`,
        '[data-action="back-manage-center-list"]',
      );

      await selectCachedTab("materials", `[data-material-record-detail="${materialId}"]`);
      const materialDetail = await openAndReturn(
        `[data-material-record-detail="${materialId}"]`,
        materialId,
        `[data-material-detail="${materialId}"].is-mobile-fullscreen`,
        '[data-action="back-material-list"]',
      );

      await selectCachedTab("workPrep", "[data-work-prep-record-detail]");
      const workPrepId = await readOnlyPage.$eval("[data-work-prep-record-detail]", (row) => row.dataset.workPrepRecordDetail);
      const workPrepDetail = await openAndReturn(
        `[data-work-prep-record-detail="${workPrepId}"]`,
        workPrepId,
        `[data-manage-center-selected="${workPrepId}"].is-mobile-fullscreen`,
        '[data-action="back-manage-center-list"],[data-action="back-work-prep-list"]',
      );

      return unsafeGuard && unsafeDetail && materialDetail && workPrepDetail;
    } finally {
      await readOnlyPage.close().catch(() => {});
    }
  };

  const runRealtimeSyncFlow = async () => {
    const tombstoneInspectionId = "inspection-tombstone-e2e";
    const realtimePage = await makePage({
      mockRealtime: true,
      realtimeInspectionRows: [{
        id: tombstoneInspectionId,
        category_id: "welding",
        worker_id: "w-hong",
        worker: "홍길동",
        ship_no: "2401",
        date: todayStr,
        time: "13:00",
        status: "safe",
        warnings: 0,
        completion: 100,
        tools: [],
        safety_pledge: "",
        work_prep_record_id: "",
        work_prep_worker_id: "",
        created_at: new Date(testNowMs).toISOString(),
      }],
    });
    await realtimePage.goto(`http://localhost:${PORT}/unsafe.html`, { waitUntil: "domcontentloaded", timeout: 25000 });
    const expectedTables = ["missing_materials", "safety_inspection_deletions", "safety_inspections", "safety_ships", "unsafe_issues", "work_prep_records"].sort();
    await realtimePage.waitForFunction(
      (tables) => tables.every((table) => window.__realtimeTest?.metrics?.tables?.includes(table)),
      { timeout: 5000 },
      expectedTables,
    );
    const subscribedTables = await realtimePage.evaluate(() => [...new Set(window.__realtimeTest.metrics.tables)].sort());
    const subscriptionsOk = JSON.stringify(subscribedTables) === JSON.stringify(expectedTables);
    await realtimePage.waitForFunction(
      () => window.__realtimeTest?.metrics?.timeline?.some((entry) =>
        entry.type === "status"
        && entry.channel === "gs-safety-inspection-deletions"
        && entry.status === "SUBSCRIBED"),
      { timeout: 5000 },
    );
    await realtimePage.waitForFunction(
      () => window.__realtimeTest?.metrics?.timeline?.some((entry) => entry.type === "from"),
      { timeout: 5000 },
    );
    const tombstoneStatusBeforeFirstFromRead = await realtimePage.evaluate(() => {
      const timeline = window.__realtimeTest?.metrics?.timeline || [];
      const tombstoneStatusIndex = timeline.findIndex((entry) =>
        entry.type === "status"
        && entry.channel === "gs-safety-inspection-deletions"
        && entry.status === "SUBSCRIBED");
      const firstFromReadIndex = timeline.findIndex((entry) => entry.type === "from");
      return tombstoneStatusIndex >= 0 && firstFromReadIndex >= 0 && tombstoneStatusIndex < firstFromReadIndex;
    });
    if (!tombstoneStatusBeforeFirstFromRead) {
      const timeline = await realtimePage.evaluate(() => window.__realtimeTest?.metrics?.timeline || []);
      console.error(`Realtime startup ordering failed: ${JSON.stringify(timeline)}`);
    }
    const tombstoneChannelSubscriptionOk = await realtimePage.evaluate(() => {
      const channel = window.__realtimeTest?.metrics?.channels?.["gs-safety-inspection-deletions"];
      const expectedFilter = { event: "*", schema: "public", table: "safety_inspection_deletions" };
      return channel?.subscribeCalls === 1
        && channel?.subscribed === true
        && channel?.on?.length === 1
        && channel.on[0]?.kind === "postgres_changes"
        && JSON.stringify(channel.on[0]?.filter) === JSON.stringify(expectedFilter);
    });

    await realtimePage.evaluate((storagePrefix, createdAt) => {
      window.__realtimeTest.emit("unsafe_issues", {
        eventType: "INSERT",
        new: {
          id: "unsafe-realtime-e2e",
          ship_no: "2401",
          content: "Realtime E2E 위험요소",
          worker_id: "w-hong",
          worker_name_snapshot: "홍길동",
          worker_team_snapshot: "선행",
          status: "접수",
          admin_memo: "",
          created_at: createdAt,
          updated_at: createdAt,
          completed_at: null,
          status_history: [],
        },
        old: {},
      });
      window.__realtimeTest.insertVisible = JSON.parse(localStorage.getItem(storagePrefix + "unsafeIssues") || "[]")
        .some((row) => row.id === "unsafe-realtime-e2e");
    }, PRE, new Date(testNowMs).toISOString());
    const insertVisible = await realtimePage.evaluate(() => window.__realtimeTest.insertVisible === true);

    await realtimePage.evaluate((storagePrefix) => {
      window.__realtimeTest.emit("unsafe_issues", {
        eventType: "DELETE",
        new: {},
        old: { id: "unsafe-realtime-e2e" },
      });
      window.__realtimeTest.deleteVisible = !JSON.parse(localStorage.getItem(storagePrefix + "unsafeIssues") || "[]")
        .some((row) => row.id === "unsafe-realtime-e2e");
    }, PRE);
    const deleteVisible = await realtimePage.evaluate(() => window.__realtimeTest.deleteVisible === true);

    await realtimePage.evaluate((storagePrefix, inspectionId) => {
      window.__realtimeTest.emit("safety_inspection_deletions", {
        eventType: "INSERT",
        new: { inspection_id: inspectionId },
        old: {},
      });
      window.__realtimeTest.tombstoneDeleteVisible = !JSON.parse(localStorage.getItem(storagePrefix + "inspections") || "[]")
        .some((row) => row.id === inspectionId);
    }, PRE, tombstoneInspectionId);
    const tombstoneDeleteVisible = await realtimePage.evaluate(() => window.__realtimeTest.tombstoneDeleteVisible === true);

    await realtimePage.waitForFunction(() => window.__realtimeTest.metrics.reads > 0, { timeout: 5000 });
    const readsBeforeFailure = await realtimePage.evaluate(() => window.__realtimeTest.metrics.reads);
    await realtimePage.evaluate(() => window.__realtimeTest.fail("CHANNEL_ERROR"));
    await realtimePage.waitForFunction(
      (before) => window.__realtimeTest.metrics.removedChannels > 0 && window.__realtimeTest.metrics.reads > before,
      { timeout: 5000 },
      readsBeforeFailure,
    );
    const fallbackOk = await realtimePage.evaluate(() =>
      window.__realtimeTest.metrics.removedChannels > 0 && window.__realtimeTest.metrics.reads > 0);
    await realtimePage.close();
    return subscriptionsOk && tombstoneStatusBeforeFirstFromRead && tombstoneChannelSubscriptionOk && insertVisible && deleteVisible && tombstoneDeleteVisible && fallbackOk;
  };

  const runWorkPrepSyncFlow = async () => {
    const workPrepBrowser = await launchBrowser();
    const workPrepPage = await makePage({
      browserInstance: workPrepBrowser,
      mockAdminMutations: true,
      mockRealtime: true,
      mockSupabaseWrites: true,
      mockAdminMutationDelayMs: 800,
    });
    try {
      await workPrepPage.evaluateOnNewDocument((storagePrefix) => {
        localStorage.setItem(storagePrefix + "workPrepFilters", JSON.stringify({ shipNo: "2402", status: "", sort: "latest" }));
        sessionStorage.setItem(storagePrefix + "workerSession", JSON.stringify({
          workerId: "w-kim",
          workerName: "김조장",
          employeeNo: "1234",
          loggedInAt: new Date().toISOString(),
          mutationToken: "e2e-worker-mutation",
          mutationExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        }));
        sessionStorage.setItem(storagePrefix + "adminMode", "true");
        sessionStorage.setItem(storagePrefix + "adminAuthSource", "worker");
        sessionStorage.setItem(storagePrefix + "adminSession", JSON.stringify({
          token: "e2e-admin-session",
          workerId: "w-kim",
          expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        }));
      }, PRE);
      await workPrepPage.goto(`http://localhost:${PORT}/manage.html`, { waitUntil: "domcontentloaded", timeout: 25000 });
      await workPrepPage.waitForFunction(() => (
        document.querySelector(".data-context")?.dataset.status === "fresh"
        && !document.querySelector('[data-manage-center-tab="workPrep"]')?.disabled
      ), { timeout: 8000 });
      await wait(1000);
      const mobileMasterReady = await workPrepPage.evaluate(() => {
        const menu = document.querySelector(".manage-center__mobile-menu");
        const workPrepRow = document.querySelector('.manage-center__mobile-menu-row[data-manage-center-tab="workPrep"]');
        return Boolean(menu?.getClientRects().length && workPrepRow?.getClientRects().length)
          && !document.querySelector(".manage-center__mobile-section.is-mobile-section-open");
      });
      const openWorkPrepSection = () => workPrepPage.evaluate(() => {
        const button = document.querySelector('.manage-center__mobile-menu-row[data-manage-center-tab="workPrep"]');
        button?.click();
        return Boolean(button);
      });
      if (!await openWorkPrepSection()) return false;
      await workPrepPage.waitForFunction(() => document.querySelector('[data-manage-center-tab="workPrep"][aria-selected="true"]'));
      const mobileSectionReady = await workPrepPage.waitForFunction(() => (
        document.body.classList.contains("manage-mobile-detail-open")
        && document.querySelector(".manage-center__mobile-section.is-mobile-section-open")
        && document.querySelector('[data-action="back-manage-center-menu"]')?.getClientRects().length > 0
      ), { timeout: 8000 }).then(() => true).catch(() => false);
      const sectionBackClicked = await workPrepPage.evaluate(() => {
        const button = document.querySelector('[data-action="back-manage-center-menu"]');
        button?.click();
        return Boolean(button);
      });
      const mobileMenuReturned = await workPrepPage.waitForFunction(() => (
        !document.body.classList.contains("manage-mobile-detail-open")
        && !document.querySelector(".manage-center__mobile-section.is-mobile-section-open")
        && document.querySelector(".manage-center__mobile-menu")?.getClientRects().length > 0
      ), { timeout: 8000 }).then(() => true).catch(() => false);
      const menuFocusRestored = await workPrepPage.waitForFunction(() => (
        document.activeElement?.matches('.manage-center__mobile-menu-row[data-manage-center-tab="workPrep"]')
      ), { timeout: 2000 }).then(() => true).catch(() => false);
      if (!await openWorkPrepSection()) return false;
      await workPrepPage.waitForFunction(() => document.querySelector(".manage-center__mobile-section.is-mobile-section-open"), { timeout: 8000 });
      const defaultsToAllShips = await workPrepPage.$eval(
        '.material-ship-filter[data-record-filter="workPrep:shipNo"][value=""]',
        (button) => button.classList.contains("active"),
      ).catch(() => false);
      const newRegistrationRemoved = !await workPrepPage.$('[data-action="open-work-prep-register"]');
      const statusRecordId = seed[PRE + "workPrepRecords"]?.[0]?.id || "";
      const statusRequestsBefore = await workPrepPage.evaluate(() => (
        window.__realtimeTest?.metrics?.mutations?.filter((action) => action === "updateWorkPrepStatus").length || 0
      ));
      let initialStatus = "";
      let statusChanged = false;
      if (statusRecordId) {
        const statusSelector = `[data-work-prep-status="${statusRecordId}"]`;
        if (await workPrepPage.$(statusSelector)) {
          initialStatus = await workPrepPage.$eval(statusSelector, (select) => select.value);
          await workPrepPage.select(statusSelector, "used");
          statusChanged = await workPrepPage.waitForFunction((storagePrefix, recordId) => {
            const record = JSON.parse(localStorage.getItem(storagePrefix + "workPrepRecords") || "[]")
              .find((row) => row.id === recordId);
            const toastText = document.querySelector("#toast")?.textContent || "";
            const select = document.querySelector(`[data-work-prep-status="${recordId}"]`);
            return record?.status === "used"
              && select?.value === "used"
              && toastText.includes("작업지시서 상태를 변경했습니다.")
              && !toastText.includes("실패");
          }, { timeout: 5000 }, PRE, statusRecordId).then(() => true).catch(() => false);
        }
      }
      const statusMutationActions = await workPrepPage.evaluate(() => window.__realtimeTest?.metrics?.mutations || []);
      const dedicatedStatusMutation = statusMutationActions.filter((action) => action === "updateWorkPrepStatus").length > statusRequestsBefore;
      const archiveRecordId = seed[PRE + "workPrepRecords"]?.[0]?.id || "";
      let archived = { controlPresent: false, deleteLabel: false, localRemoved: false, tombstoneRemembered: false, cardRemoved: false };
      if (archiveRecordId) {
        await workPrepPage.goto(`http://localhost:${PORT}/check.html`, { waitUntil: "domcontentloaded", timeout: 25000 });
        await workPrepPage.waitForSelector(`[data-work-prep-record="${archiveRecordId}"]`, { visible: true });
        const archiveSelector = `[data-action="archive-work-prep-record"][data-work-prep-record-id="${archiveRecordId}"]`;
        const archiveControl = await workPrepPage.$eval(archiveSelector, (button) => ({ label: button.textContent.trim() })).catch(() => null);
        archived.controlPresent = Boolean(archiveControl);
        archived.deleteLabel = archiveControl?.label === "삭제";
        if (archived.controlPresent) {
          const acceptArchive = (dialog) => dialog.accept().catch(() => {});
          workPrepPage.on("dialog", acceptArchive);
          await workPrepPage.click(archiveSelector);
          await workPrepPage.waitForFunction((storagePrefix, recordId) => {
            const records = JSON.parse(localStorage.getItem(storagePrefix + "workPrepRecords") || "[]");
            const deletedIds = JSON.parse(localStorage.getItem(storagePrefix + "deletedWorkPrepRecordIds") || "[]");
            return !records.some((record) => record.id === recordId) && deletedIds.includes(recordId);
          }, { timeout: 5000 }, PRE, archiveRecordId).catch(() => {});
          workPrepPage.off("dialog", acceptArchive);
          archived = await workPrepPage.evaluate((storagePrefix, recordId, deleteLabel) => {
            const records = JSON.parse(localStorage.getItem(storagePrefix + "workPrepRecords") || "[]");
            const deletedIds = JSON.parse(localStorage.getItem(storagePrefix + "deletedWorkPrepRecordIds") || "[]");
            return {
              controlPresent: true,
              deleteLabel,
              localRemoved: !records.some((record) => record.id === recordId),
              tombstoneRemembered: deletedIds.includes(recordId),
              cardRemoved: !document.querySelector(`[data-work-prep-record="${recordId}"]`),
            };
          }, PRE, archiveRecordId, archived.deleteLabel);
        }
      }
      const archiveCompleted = Object.values(archived).every(Boolean);
      const ok = mobileMasterReady
        && mobileSectionReady
        && sectionBackClicked
        && mobileMenuReturned
        && defaultsToAllShips
        && newRegistrationRemoved
        && initialStatus === "preparing"
        && statusChanged
        && dedicatedStatusMutation
        && archiveCompleted;
      if (!ok) console.log("  작업지시서 상태·삭제 진단:", JSON.stringify({ mobileMasterReady, mobileSectionReady, sectionBackClicked, mobileMenuReturned, menuFocusRestored, defaultsToAllShips, newRegistrationRemoved, initialStatus, statusChanged, dedicatedStatusMutation, statusMutationActions, archived }));
      return ok;
    } finally {
      try { await workPrepPage.close(); } catch {}
      try { await withTimeout(workPrepBrowser.close(), 10000); } catch { try { workPrepBrowser.process()?.kill("SIGKILL"); } catch {} }
    }
  };

  const runPwaFlow = async () => {
    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForFunction(() => navigator.serviceWorker?.controller, { timeout: 15000 });
    const result = await page.evaluate(async (expectedVersion, expectedToken) => {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      const workerVersion = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("서비스워커 버전 응답 시간 초과")), 5000);
        const receive = (event) => {
          if (event.data?.type !== "GS_SW_VERSION") return;
          clearTimeout(timeout);
          navigator.serviceWorker.removeEventListener("message", receive);
          resolve(event.data);
        };
        navigator.serviceWorker.addEventListener("message", receive);
        registration.active?.postMessage({ type: "GS_GET_VERSION" });
      });
      const cacheNames = await caches.keys();
      return {
        controlled: Boolean(navigator.serviceWorker.controller),
        active: registration.active?.state === "activated",
        version: workerVersion.appVersion,
        cache: workerVersion.cache,
        hasCurrentCache: cacheNames.includes(`gs-safety-${expectedToken}`),
        hasStaleCache: cacheNames.some((name) =>
          name.startsWith("gs-safety-") && name !== `gs-safety-${expectedToken}`),
        manifestVersioned: document.querySelector('link[rel="manifest"]')?.href.includes(`v=${expectedToken}`),
        appAssetVersioned: [...document.scripts].some((script) =>
          script.src.includes("/assets/dist/js/app-v2.min.js") && script.src.includes(`v=${expectedToken}`)),
        expectedVersion,
      };
    }, appVersion, assetToken);
    const ok = result.controlled
      && result.active
      && result.version === result.expectedVersion
      && result.cache === `gs-safety-${assetToken}`
      && result.hasCurrentCache
      && !result.hasStaleCache
      && result.manifestVersioned
      && result.appAssetVersioned;
    if (!ok) console.log("  PWA 진단:", JSON.stringify(result));
    return ok;
  };

  console.log(`E2E 스모크 시작 (tz=${tz}, today=${todayStr}, app=${appVersion})`);
  if (process.argv.includes("--design-token-only")) {
    for (const result of await runDesignTokenViewportFlow()) {
      if (!result.ok) console.log("  디자인 토큰 진단:", result.label, JSON.stringify({ observation: result.observation, manageDetail: result.manageDetail }));
      check(`디자인 토큰: ${result.label} 셸·토큰·터치영역`, result.ok);
    }
    try { await withTimeout(browser.close(), 10000); } catch { try { browser.process()?.kill("SIGKILL"); } catch {} }
    srv.close();
    if (failures) throw new Error(`디자인 토큰 E2E 실패: ${failures}건`);
    console.log("디자인 토큰 E2E 통과");
    return;
  }
  if (PWA_ONLY) {
    check("PWA: 최신 서비스워커 활성화·캐시 교체·버전 자산 로드", await runPwaFlow());
    try { await withTimeout(browser.close(), 10000); } catch { try { browser.process()?.kill("SIGKILL"); } catch {} }
    srv.close();
    if (failures) throw new Error(`PWA E2E 실패: ${failures}건`);
    console.log("PWA E2E 통과");
    return;
  }
  if (process.argv.includes("--icon-picker-only")) {
    check("아이콘 관리: 선택·적용 후 저장값과 완료 안내 변경", await runIconPickerFlow());
    try { await withTimeout(browser.close(), 10000); } catch { try { browser.process()?.kill("SIGKILL"); } catch {} }
    srv.close();
    if (failures) throw new Error(`아이콘 E2E 실패: ${failures}건`);
    console.log("아이콘 E2E 통과");
    return;
  }
  if (process.argv.includes("--worker-delete-only")) {
    check("작업자 관리: 본인 삭제 방지·다른 작업자 삭제 후 목록 즉시 반영", await runWorkerDeleteFlow());
    try { await withTimeout(browser.close(), 10000); } catch { try { browser.process()?.kill("SIGKILL"); } catch {} }
    srv.close();
    if (failures) throw new Error(`작업자 삭제 E2E 실패: ${failures}건`);
    console.log("작업자 삭제 E2E 통과");
    return;
  }
  if (process.argv.includes("--manage-read-only-only")) {
    check("관리 저장본: 조회 행 이동 유지·변경 컨트롤 잠금", await runManageReadOnlyNavigationFlow());
    try { await withTimeout(browser.close(), 10000); } catch { try { browser.process()?.kill("SIGKILL"); } catch {} }
    srv.close();
    if (failures) throw new Error(`관리 저장본 E2E 실패: ${failures}건`);
    console.log("관리 저장본 E2E 통과");
    return;
  }
  if (process.argv.includes("--realtime-only")) {
    check("실시간 동기화: 핵심 구독·행 반영·삭제·폴링 폴백", await runRealtimeSyncFlow());
    try { await withTimeout(browser.close(), 10000); } catch { try { browser.process()?.kill("SIGKILL"); } catch {} }
    srv.close();
    if (failures) process.exit(1);
    console.log("실시간 동기화 E2E 통과");
    return;
  }
  if (process.argv.includes("--work-prep-sync-only")) {
    check("작업지시서: 전체 호선 기본값·상태 변경·즉시 서버 반영·삭제", await runWorkPrepSyncFlow());
    try { await withTimeout(browser.close(), 10000); } catch { try { browser.process()?.kill("SIGKILL"); } catch {} }
    srv.close();
    if (failures) throw new Error(`작업지시서 동기화 E2E 실패: ${failures}건`);
    console.log("작업지시서 동기화 E2E 통과");
    return;
  }

  check("작업지시서: 전체 호선 기본값·상태 변경·즉시 서버 반영·삭제", await runWorkPrepSyncFlow());

  await goto("index.html");
  const initialHome = await page.evaluate(() => ({
    title: document.querySelector("#homeV4Title")?.textContent?.trim() || "",
    cardCount: document.querySelectorAll(".home-v4__card").length,
    checkMetric: document.querySelector(".home-v4__metric")?.textContent?.replace(/\s+/g, " ").trim() || "",
  }));
  check("홈: 승인 v4 안전 운영 보드 표시", initialHome.title === "오늘의 안전 운영" && initialHome.cardCount === 4);
  check("홈: 로그인 작업자 미점검 수치 표시", initialHome.checkMetric === "미점검 1건");

  // 1-2. 추출된 뷰 모듈 화면 렌더 확인 (호선/서약/이력)
  await goto("ships.html");
  check("호선: v4 목록·상세 화면 렌더", await page.$(".ships-v4") !== null);
  await goto("pledge.html");
  check("서약: 오늘 작업 전 안전서약 화면 렌더", (await bodyText(page)).includes("오늘 작업 전 안전서약"));
  await goto("history.html");
  check("이력: v4 검색·상세 화면 렌더", await page.$(".history-v4") !== null);
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
  const checkSubmitEvidenceDir = join(ROOT, ".omo", "evidence", "check-submit-mobile");
  mkdirSync(checkSubmitEvidenceDir, { recursive: true });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await wait(350);
  const checkSubmitMobile = await page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const bounds = element.getBoundingClientRect();
      return { top: bounds.top, bottom: bounds.bottom, width: bounds.width, height: bounds.height };
    };
    const statusGrid = document.querySelector(".check-flow-mobile-status-grid");
    const pledgeDetail = document.querySelector(".pledge-mobile-detail");
    const submitDock = document.querySelector(".check-flow-v4 .material-flow-footer");
    const bottomNav = document.querySelector(".bottom-nav");
    const order = [
      ".check-flow-v4__context",
      ".check-flow-status-card",
      ".check-flow-v4__form",
      ".check-flow-v4__pledge",
    ].map((selector) => rect(selector)?.top ?? Number.POSITIVE_INFINITY);
    return {
      noOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
      ordered: order.every((top, index) => index === 0 || top >= order[index - 1]),
      contextCompact: (rect(".check-flow-v4__context")?.height ?? Number.POSITIVE_INFINITY) <= 110,
      statusCells: document.querySelectorAll(".check-flow-mobile-status-cell").length,
      statusColumns: statusGrid ? getComputedStyle(statusGrid).gridTemplateColumns.split(" ").length : 0,
      pledgeCollapsed: pledgeDetail ? getComputedStyle(pledgeDetail).display === "none" : false,
      submitFixed: submitDock ? getComputedStyle(submitDock).position === "fixed" : false,
      submitClearsNav: submitDock && bottomNav
        ? submitDock.getBoundingClientRect().bottom <= bottomNav.getBoundingClientRect().top + 1
        : false,
    };
  });
  const checkSubmitMobilePassed = Object.values(checkSubmitMobile).every((value) => value === true || value === 4 || value === 2);
  if (!checkSubmitMobilePassed) console.log(`  모바일 Step 3 진단: ${JSON.stringify(checkSubmitMobile)}`);
  check("점검: 모바일 Step 3 정보 순서·2x2 상태·접힌 서약·고정 제출", checkSubmitMobilePassed);
  await page.screenshot({ path: join(checkSubmitEvidenceDir, "check-submit-390.png"), fullPage: true });

  await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 });
  await wait(350);
  const checkSubmitDesktop = await page.evaluate(() => {
    const workspace = document.querySelector(".check-flow-v4__workspace");
    const mobileStatus = document.querySelector(".check-flow-mobile-status-grid");
    const mobilePledgeSummary = document.querySelector(".pledge-mobile-summary");
    const submitDock = document.querySelector(".check-flow-v4 .material-flow-footer");
    return {
      workspaceGrid: workspace ? getComputedStyle(workspace).display === "grid" : false,
      mobileStatusHidden: mobileStatus ? getComputedStyle(mobileStatus).display === "none" : false,
      mobilePledgeHidden: mobilePledgeSummary ? getComputedStyle(mobilePledgeSummary).display === "none" : false,
      submitStatic: submitDock ? getComputedStyle(submitDock).position === "static" : false,
    };
  });
  check("점검: PC Step 3 기존 작업공간·제출 배치 유지", Object.values(checkSubmitDesktop).every(Boolean));
  await page.screenshot({ path: join(checkSubmitEvidenceDir, "check-submit-1366.png"), fullPage: true });
  check("점검: [제출하기] 클릭", await clickBtn(page, "제출하기")); await wait(2200);
  const inspectionCompletionText = await bodyText(page);
  check("점검: 제출 완료 화면", inspectionCompletionText.includes("점검이 제출되었습니다"));
  check("점검: 제출 즉시 홈·이력 반영 안내", inspectionCompletionText.includes("홈과 점검 이력에 즉시 반영되었습니다"));
  const inspectionServerState = await page.evaluate(() => {
    const status = document.querySelector('[data-sync-kind="server"]');
    return { state: status?.dataset.syncState || "missing", text: status?.innerText.replace(/\s+/g, " ").trim() || "" };
  });
  check(`점검: 서버 반영 완료 안내 (${inspectionServerState.state}: ${inspectionServerState.text})`, inspectionServerState.state === "synced" && inspectionCompletionText.includes("서버 반영 완료"));
  check("점검: 삭제 tombstone capability 확인 후 submitInspection 계약", inspectionDeletionProbeRequests > 0 && inspectionSubmitMutationRequests > 0);
  const completionBottomNavHidden = await page.evaluate(() => {
    const nav = document.querySelector(".bottom-nav");
    return !nav || getComputedStyle(nav).display === "none";
  });
  check("점검: 완료 화면 하단 메뉴 미노출", completionBottomNavHidden);

  await goto("index.html");
  const completedHome = await page.evaluate(() => ({
    checkMetric: document.querySelector(".home-v4__metric")?.textContent?.replace(/\s+/g, " ").trim() || "",
    actionView: document.querySelector(".home-v4__card .home-v4__action")?.getAttribute("data-view") || "",
  }));
  check("홈: 점검 후 완료 상태 표시", completedHome.checkMetric === "미점검 0건" && completedHome.actionView === "history");

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

  check("아이콘 관리: 선택·적용 후 저장값과 완료 안내 변경", await runIconPickerFlow());
  check("작업자 관리: 본인 삭제 방지·다른 작업자 삭제 후 목록 즉시 반영", await runWorkerDeleteFlow());
  check("관리 저장본: 조회 행 이동 유지·변경 컨트롤 잠금", await runManageReadOnlyNavigationFlow());
  check("실시간 동기화: 핵심 구독·행 반영·삭제·폴링 폴백", await runRealtimeSyncFlow());

  for (const result of await runDesignTokenViewportFlow()) {
    if (!result.ok) console.log("  디자인 토큰 진단:", result.label, JSON.stringify({ observation: result.observation, manageDetail: result.manageDetail }));
    check(`디자인 토큰: ${result.label} 셸·토큰·터치영역`, result.ok);
  }

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
