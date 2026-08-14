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
const PWA_ONLY = process.argv.includes("--pwa-only");

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
      await newPage.evaluateOnNewDocument((realtimeInspectionRows) => {
        const handlers = [];
        const statusCallbacks = [];
        const metrics = { reads: 0, removedChannels: 0, tables: [], channels: {}, timeline: [] };
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
              resolve({ data: table === "safety_inspections" ? realtimeInspectionRows : [], error: null });
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
          functions: { invoke: async () => ({ data: { ok: true }, error: null }) },
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
      }, options.realtimeInspectionRows || []);
    }
    newPage.on("dialog", (d) => d.accept());
    await newPage.setRequestInterception(true);
    newPage.on("request", (req) => {
      const url = req.url();
      const isInspectionDeletionRead = url.includes(".supabase.co/rest/v1/safety_inspection_deletions");
      const isInspectionRead = url.includes(".supabase.co/rest/v1/safety_inspections");
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
        if (options.mockSupabaseWrites) {
          try {
            const mutation = JSON.parse(req.postData() || "{}");
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
          body: req.method() === "OPTIONS" ? "ok" : JSON.stringify({ ok: true, mutated: 1 }),
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
    const workerPage = await makePage({ mockAdminMutations: true });
    await workerPage.evaluateOnNewDocument((storagePrefix) => {
      sessionStorage.setItem(storagePrefix + "adminMode", "true");
      sessionStorage.setItem(storagePrefix + "adminAuthSource", "worker");
      sessionStorage.setItem(storagePrefix + "adminSession", JSON.stringify({
        token: "e2e-admin-session",
        workerId: "w-hong",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }));
    }, PRE);
    await workerPage.goto(`http://localhost:${PORT}/manage.html`, { waitUntil: "domcontentloaded", timeout: 25000 });
    await workerPage.evaluate(() => document.querySelector('[data-worker-card-toggle="w-hong"]')?.click());
    const selfDeleteDisabled = await workerPage.$eval('[data-delete-worker="w-hong"]', (button) => button.disabled);
    await workerPage.evaluate(() => document.querySelector('[data-worker-card-toggle="w-lee"]')?.click());
    await workerPage.evaluate(() => document.querySelector('[data-delete-worker="w-lee"]')?.click());
    await workerPage.waitForFunction(() => !document.querySelector('[data-worker-card-toggle="w-lee"]'), { timeout: 5000 });
    const result = await workerPage.evaluate((storagePrefix) => {
      const workers = JSON.parse(localStorage.getItem(storagePrefix + "workers") || "[]");
      return {
        targetRemoved: !workers.some((worker) => worker.id === "w-lee"),
        countUpdated: document.body.innerText.includes("현재 2명"),
        toastShown: document.body.innerText.includes("이순신 작업자를 삭제했습니다."),
      };
    }, PRE);
    await workerPage.close();
    return selfDeleteDisabled && result.targetRemoved && result.countUpdated && result.toastShown;
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
      mockSupabaseWrites: true,
      mockAdminMutationDelayMs: 800,
    });
    try {
      await workPrepPage.evaluateOnNewDocument((storagePrefix) => {
        sessionStorage.setItem(storagePrefix + "adminMode", "true");
        sessionStorage.setItem(storagePrefix + "adminAuthSource", "worker");
        sessionStorage.setItem(storagePrefix + "adminSession", JSON.stringify({
          token: "e2e-admin-session",
          workerId: "w-hong",
          expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        }));
      }, PRE);
      await workPrepPage.goto(`http://localhost:${PORT}/manage.html`, { waitUntil: "domcontentloaded", timeout: 25000 });
      if (!await clickBtn(workPrepPage, "작업지시서")) return false;
      await wait(300);
      if (!await clickBtn(workPrepPage, "+ 신규 등록")) return false;
      await wait(300);
      await workPrepPage.evaluate(() => {
        document.querySelector("[data-work-prep-tool]")?.click();
      });
      await wait(100);
      if (!await clickBtn(workPrepPage, "작업지시서 저장")) return false;
      await wait(100);
      const pendingState = await workPrepPage.evaluate(() => {
        const status = document.querySelector('[data-work-prep-sync-state="pending"]');
        return status?.textContent?.trim() || "";
      });
      await workPrepPage.waitForFunction(() => (
        !document.querySelector('[data-work-prep-sync-state="pending"]')
        && [...document.querySelectorAll('[data-work-prep-sync-state="synced"]')].length >= 2
      ), { timeout: 5000 });
      const completed = await workPrepPage.evaluate(() => ({
        syncedCount: [...document.querySelectorAll('[data-work-prep-sync-state="synced"]')].length,
        serverToast: document.body.innerText.includes("작업지시서가 서버에 반영되었습니다."),
        retryCount: [...document.querySelectorAll('[data-work-prep-sync-state="retry"]')].length,
        offlineCount: [...document.querySelectorAll('[data-work-prep-sync-state="offline"]')].length,
        pendingCount: [...document.querySelectorAll('[data-work-prep-sync-state="pending"]')].length,
      }));
      const ok = pendingState.includes("서버 반영 중") && completed.syncedCount >= 2 && completed.serverToast;
      if (!ok) console.log("  작업지시서 동기화 진단:", JSON.stringify({ pendingState, completed }));
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
  if (process.argv.includes("--realtime-only")) {
    check("실시간 동기화: 핵심 구독·행 반영·삭제·폴링 폴백", await runRealtimeSyncFlow());
    try { await withTimeout(browser.close(), 10000); } catch { try { browser.process()?.kill("SIGKILL"); } catch {} }
    srv.close();
    if (failures) process.exit(1);
    console.log("실시간 동기화 E2E 통과");
    return;
  }
  if (process.argv.includes("--work-prep-sync-only")) {
    check("작업지시서: 즉시 로컬 표시 후 서버 반영 완료 전환", await runWorkPrepSyncFlow());
    try { await withTimeout(browser.close(), 10000); } catch { try { browser.process()?.kill("SIGKILL"); } catch {} }
    srv.close();
    if (failures) throw new Error(`작업지시서 동기화 E2E 실패: ${failures}건`);
    console.log("작업지시서 동기화 E2E 통과");
    return;
  }

  check("작업지시서: 즉시 로컬 표시 후 서버 반영 완료 전환", await runWorkPrepSyncFlow());

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
  const inspectionCompletionText = await bodyText(page);
  check("점검: 제출 완료 화면", inspectionCompletionText.includes("점검이 제출되었습니다"));
  check("점검: 제출 즉시 홈·이력 반영 안내", inspectionCompletionText.includes("홈과 점검 이력에 즉시 반영되었습니다"));
  const inspectionServerState = await page.evaluate(() => {
    const status = document.querySelector("[data-inspection-sync-state]");
    return { state: status?.dataset.inspectionSyncState || "missing", text: status?.innerText.replace(/\s+/g, " ").trim() || "" };
  });
  check(`점검: 서버 반영 완료 안내 (${inspectionServerState.state}: ${inspectionServerState.text})`, inspectionServerState.state === "synced" && inspectionCompletionText.includes("서버 반영 완료"));
  check("점검: 삭제 tombstone capability 확인 후 submitInspection 계약", inspectionDeletionProbeRequests > 0 && inspectionSubmitMutationRequests > 0);
  const completionBottomNavHidden = await page.evaluate(() => {
    const nav = document.querySelector(".bottom-nav");
    return !nav || getComputedStyle(nav).display === "none";
  });
  check("점검: 완료 화면 하단 메뉴 미노출", completionBottomNavHidden);

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

  check("아이콘 관리: 선택·적용 후 저장값과 완료 안내 변경", await runIconPickerFlow());
  check("작업자 관리: 본인 삭제 방지·다른 작업자 삭제 후 목록 즉시 반영", await runWorkerDeleteFlow());
  check("실시간 동기화: 핵심 구독·행 반영·삭제·폴링 폴백", await runRealtimeSyncFlow());

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
