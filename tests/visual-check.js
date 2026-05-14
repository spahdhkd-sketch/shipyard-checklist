const cp = require("child_process");
const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "visual-verification");
const chromePath = [
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((candidate) => fs.existsSync(candidate));

if (!chromePath) throw new Error("Chrome or Edge executable was not found.");

fs.mkdirSync(outDir, { recursive: true });

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
]);

const seed = {
  categories: [
    {
      id: "mounting",
      label: "탑재 작업",
      icon: "erection",
      color: "#1f6eb3",
      toolNature: "선행",
      requireToolCheck: true,
      order: 1,
    },
  ],
  sections: [
    { id: "mounting-lift", categoryId: "mounting", title: "인양 계획", order: 1 },
    { id: "mounting-zone", categoryId: "mounting", title: "배치 및 통제", order: 2 },
  ],
  items: [
    {
      id: "wire-pin",
      categoryId: "mounting",
      sectionId: "mounting-lift",
      text: "탑재용 와이어 / 샤클 안전핀 상태",
      risk: "high",
      required: true,
      active: true,
      visibilityCondition: "선행",
      toolIds: ["wire"],
      order: 1,
    },
    {
      id: "sling-damage",
      categoryId: "mounting",
      sectionId: "mounting-lift",
      text: "슬링벨트 손상 상태",
      risk: "medium",
      required: false,
      active: true,
      visibilityCondition: "선행",
      toolIds: ["sling"],
      order: 2,
    },
    {
      id: "housekeeping",
      categoryId: "mounting",
      sectionId: "mounting-zone",
      text: "탑재 위치 정리정돈",
      risk: "medium",
      required: false,
      active: true,
      visibilityCondition: "항상 표시",
      toolIds: [],
      order: 3,
    },
    {
      id: "narrow-space",
      categoryId: "mounting",
      sectionId: "mounting-zone",
      text: "협소 공간 접근 금지",
      risk: "high",
      required: true,
      active: true,
      visibilityCondition: "항상 표시",
      toolIds: [],
      order: 4,
    },
    {
      id: "under-load",
      categoryId: "mounting",
      sectionId: "mounting-zone",
      text: "권상물 하부 출입금지",
      risk: "high",
      required: true,
      active: true,
      visibilityCondition: "항상 표시",
      toolIds: [],
      order: 5,
    },
  ],
  tools: [
    { id: "wire", categoryId: null, name: "탑재용 와이어", nature: "선행", order: 1, deleted: false },
    { id: "sling", categoryId: null, name: "슬링벨트", nature: "선행", order: 2, deleted: false },
    { id: "platform", categoryId: null, name: "작업용 발판", nature: "선행", order: 3, deleted: false },
    { id: "post", categoryId: null, name: "후행용 공기구", nature: "후행", order: 4, deleted: false },
  ],
  pictograms: [],
  ships: [
    {
      id: "ship-101",
      no: "H-101",
      type: "CNTR",
      note: "",
      processStage: "mounting",
      deliveryType: "D/L",
      deliveryDate: "",
      lcDate: "2026-05-15",
      stDate: "",
      clDate: "",
      dlDate: "",
      createdAt: "2026-05-15T00:00:00.000Z",
      order: 1,
    },
  ],
  inspections: [],
  inspectionItems: [],
  draft: {
    worker: "",
    shipNo: "",
    safetyPledge: "",
    checks: {},
    selectedToolIds: [],
    toolPrepComplete: false,
  },
  shipSortMode: "stage",
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const target = path.normalize(path.join(root, pathname));
    if (!target.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    fs.readFile(target, (error, body) => {
      if (error) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "content-type": mimeTypes.get(path.extname(target)) || "application/octet-stream" });
      res.end(body);
    });
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.events = new Map();
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result || {});
      } else if (message.method && this.events.has(message.method)) {
        const listeners = this.events.get(message.method);
        this.events.delete(message.method);
        listeners.forEach((resolve) => resolve(message.params || {}));
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  once(method, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeoutMs);
      const wrapped = (params) => {
        clearTimeout(timer);
        resolve(params);
      };
      const listeners = this.events.get(method) || [];
      listeners.push(wrapped);
      this.events.set(method, listeners);
    });
  }

  close() {
    this.ws.close();
  }
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function waitForBrowser(port) {
  const url = `http://127.0.0.1:${port}/json/version`;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      return await fetchJson(url);
    } catch {
      await delay(100);
    }
  }
  throw new Error("Browser did not expose the DevTools endpoint.");
}

async function navigate(client, url) {
  const load = client.once("Page.loadEventFired");
  await client.send("Page.navigate", { url });
  await load;
  await delay(250);
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Runtime evaluation failed.");
  return result.result.value;
}

async function click(client, selector) {
  const result = await evaluate(client, `(() => {
    const node = document.querySelector(${JSON.stringify(selector)});
    if (!node) return { ok: false, text: document.body.innerText.slice(0, 800) };
    node.click();
    return { ok: true, text: node.innerText || node.value || "" };
  })()`);
  if (!result.ok) throw new Error(`Missing selector ${selector}: ${result.text}`);
  await delay(250);
}

async function setViewport(client, width, height, mobile = false) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
}

async function screenshot(client, fileName) {
  const result = await client.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    fromSurface: true,
  });
  const target = path.join(outDir, fileName);
  fs.writeFileSync(target, Buffer.from(result.data, "base64"));
  return target;
}

function assertCheck(name, condition) {
  if (!condition) throw new Error(`Visual check assertion failed: ${name}`);
}

(async () => {
  const server = await startServer();
  const appPort = server.address().port;
  const debugPort = 9400 + Math.floor(Math.random() * 1000);
  const profileDir = path.join(outDir, `chrome-profile-${Date.now()}`);
  const browser = cp.spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-default-apps",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profileDir}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  let client;
  try {
    await waitForBrowser(debugPort);
    const target = await fetchJson(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: "PUT" });
    client = new CdpClient(target.webSocketDebuggerUrl);
    await client.open();
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    await client.send("Network.setBlockedURLs", {
      urls: ["https://cdn.jsdelivr.net/*", "https://psatbyktzladtymdygwh.supabase.co/*", "https://*.supabase.co/*"],
    });
    await setViewport(client, 1280, 900);

    const baseUrl = `http://127.0.0.1:${appPort}`;
    await navigate(client, `${baseUrl}/index.html`);
    await evaluate(client, `(() => {
      localStorage.clear();
      const prefix = "shipyardSafetyV1.";
      const seed = ${JSON.stringify(seed)};
      Object.entries(seed).forEach(([key, value]) => localStorage.setItem(prefix + key, JSON.stringify(value)));
    })()`);

    await navigate(client, `${baseUrl}/check.html`);
    await click(client, '[data-select-category="mounting"]');
    const prepState = await evaluate(client, `(() => {
      const text = document.body.innerText;
      return {
        hasPrepTitle: text.includes("사용 공기구와 준비물"),
        hasWire: text.includes("탑재용 와이어"),
        hasPostTool: text.includes("후행용 공기구"),
      };
    })()`);
    assertCheck("tool prep screen title", prepState.hasPrepTitle);
    assertCheck("category nature filters out post tool", !prepState.hasPostTool);
    const prepShot = await screenshot(client, "01-tool-prep-desktop.png");

    await click(client, '[data-tool-prep-toggle="wire"]');
    await click(client, '[data-action="continue-tool-prep"]');
    const checklistState = await evaluate(client, `(() => {
      const text = document.body.innerText;
      const pledge = document.querySelector("#safetyPledge");
      return {
        hasWireItem: text.includes("탑재용 와이어 / 샤클 안전핀 상태"),
        hasSlingItem: text.includes("슬링벨트 손상 상태"),
        hasCommonHousekeeping: text.includes("탑재 위치 정리정돈"),
        hasCommonUnderLoad: text.includes("권상물 하부 출입금지"),
        pledgePlaceholder: pledge ? pledge.getAttribute("placeholder") : "",
      };
    })()`);
    assertCheck("wire-specific item appears", checklistState.hasWireItem);
    assertCheck("unselected sling item is hidden", !checklistState.hasSlingItem);
    assertCheck("common housekeeping item appears", checklistState.hasCommonHousekeeping);
    assertCheck("common under-load item appears", checklistState.hasCommonUnderLoad);
    assertCheck("safety pledge placeholder", checklistState.pledgePlaceholder === "오늘 하루의 안전다짐 작성을 해주세요");
    const checklistShot = await screenshot(client, "02-checklist-wire-desktop.png");

    await setViewport(client, 390, 844, true);
    await delay(250);
    const mobileShot = await screenshot(client, "03-checklist-wire-mobile.png");

    await setViewport(client, 1280, 900);
    await navigate(client, `${baseUrl}/items.html`);
    await click(client, '[data-manage-category="mounting"]');
    const itemsState = await evaluate(client, `(() => {
      const text = document.body.innerText;
      return {
        hasToolPicker: text.includes("사용 공기구"),
        hasWireDescription: text.includes("탑재용 와이어 선택 시 표시"),
        hasCommonDescription: text.includes("공통 항목"),
      };
    })()`);
    assertCheck("item management tool picker appears", itemsState.hasToolPicker);
    assertCheck("linked tool description appears", itemsState.hasWireDescription);
    assertCheck("common item description appears", itemsState.hasCommonDescription);
    const itemsShot = await screenshot(client, "04-items-management-desktop.png");

    console.log(JSON.stringify({
      appUrl: baseUrl,
      screenshots: [prepShot, checklistShot, mobileShot, itemsShot],
      assertions: { prepState, checklistState, itemsState },
    }, null, 2));
  } finally {
    if (client) client.close();
    browser.kill();
    server.close();
  }
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
