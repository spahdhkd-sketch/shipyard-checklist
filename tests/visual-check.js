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
  inspections: [
    {
      id: "inspection-warning-count",
      categoryId: "mounting",
      shipNo: "H-101",
      worker: "김민수",
      date: "2026-05-15",
      status: "완료",
      warnings: 9,
      createdAt: "2026-05-15T07:30:00.000Z",
    },
  ],
  inspectionItems: [],
  draft: {
    worker: "",
    shipNo: "",
    safetyPledge: "",
    checks: {},
    selectedToolIds: [],
    toolPrepComplete: false,
  },
  workers: [
    { id: "worker-1", name: "김민수", team: "배관팀", createdAt: "2026-05-15T00:00:00.000Z", updatedAt: "2026-05-15T00:00:00.000Z" },
  ],
  unsafeIssues: [
    {
      id: "unsafe-detail-1",
      shipNo: "H-101",
      content: "용접 불티 차단막 미설치",
      workerId: "worker-1",
      workerNameSnapshot: "김민수",
      workerTeamSnapshot: "배관팀",
      status: "접수",
      adminMemo: "",
      createdAt: "2026-05-15T08:30:00.000Z",
      updatedAt: "2026-05-15T08:30:00.000Z",
      completedAt: "",
    },
  ],
  missingMaterials: [],
  issuePhotos: [
    {
      id: "photo-1",
      targetType: "unsafe_issue",
      targetId: "unsafe-detail-1",
      storageBucket: "issue-photos",
      storagePath: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 120'%3E%3Crect width='160' height='120' fill='%23dbeafe'/%3E%3Ctext x='80' y='66' text-anchor='middle' font-size='18' fill='%231d4ed8'%3E1%3C/text%3E%3C/svg%3E",
      sortOrder: 1,
      createdAt: "2026-05-15T08:30:01.000Z",
    },
    {
      id: "photo-2",
      targetType: "unsafe_issue",
      targetId: "unsafe-detail-1",
      storageBucket: "issue-photos",
      storagePath: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 120'%3E%3Crect width='160' height='120' fill='%23dcfce7'/%3E%3Ctext x='80' y='66' text-anchor='middle' font-size='18' fill='%2315803d'%3E2%3C/text%3E%3C/svg%3E",
      sortOrder: 2,
      createdAt: "2026-05-15T08:30:02.000Z",
    },
    {
      id: "photo-3",
      targetType: "unsafe_issue",
      targetId: "unsafe-detail-1",
      storageBucket: "issue-photos",
      storagePath: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 120'%3E%3Crect width='160' height='120' fill='%23fee2e2'/%3E%3Ctext x='80' y='66' text-anchor='middle' font-size='18' fill='%23b91c1c'%3E3%3C/text%3E%3C/svg%3E",
      sortOrder: 3,
      createdAt: "2026-05-15T08:30:03.000Z",
    },
  ],
  unsafeDraft: { shipNo: "", content: "", workerId: "", photos: [] },
  materialDraft: { shipNo: "", materialName: "", content: "", workerId: "" },
  unsafeFilters: { shipNo: "", status: "", workerId: "", sort: "status" },
  materialFilters: { shipNo: "", status: "", workerId: "", materialName: "", sort: "status" },
  manageTab: "workers",
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

    await navigate(client, `${baseUrl}/index.html`);
    await evaluate(client, `(() => {
      const prefix = "shipyardSafetyV1.";
      const statuses = window.IssueMaterialRules.UNSAFE_STATUSES;
      const issues = JSON.parse(localStorage.getItem(prefix + "unsafeIssues") || "[]");
      if (issues[0]) issues[0].status = statuses[0];
      issues.push({
        id: "unsafe-in-progress-1",
        shipNo: "H-102",
        content: "조치중 기록은 홈 카운트에서 제외",
        workerId: "worker-1",
        workerNameSnapshot: "김민수",
        workerTeamSnapshot: "배관팀",
        status: statuses[1],
        adminMemo: "",
        createdAt: "2026-05-15T08:40:00.000Z",
        updatedAt: "2026-05-15T08:40:00.000Z",
        completedAt: "",
      });
      localStorage.setItem(prefix + "unsafeIssues", JSON.stringify(issues));
    })()`);
    await navigate(client, `${baseUrl}/index.html`);
    const unsafeHomeStat = await evaluate(client, `(() => {
      const todayCard = document.querySelector('[data-stat-scope="today"]');
      const card = document.querySelector('[data-stat-scope="unsafe"]');
      const deliveryCard = document.querySelector('[data-stat-scope="delivery"]');
      const todayIcon = todayCard?.querySelector(".stat-icon svg");
      const unsafeIcon = card?.querySelector(".stat-icon svg");
      const deliveryIcon = deliveryCard?.querySelector(".stat-icon svg");
      return {
        todayFoot: todayCard?.querySelector(".stat-foot")?.textContent?.trim() || "",
        todayIconWidth: todayIcon ? Number.parseFloat(getComputedStyle(todayIcon).width) : 0,
        label: card?.querySelector(".small")?.textContent?.trim() || "",
        value: card?.querySelector(".stat-value")?.textContent?.trim() || "",
        foot: card?.querySelector(".stat-foot")?.textContent?.trim() || "",
        highlighted: card?.classList.contains("is-alert") || false,
        unsafeIconWidth: unsafeIcon ? Number.parseFloat(getComputedStyle(unsafeIcon).width) : 0,
        deliveryIconWidth: deliveryIcon ? Number.parseFloat(getComputedStyle(deliveryIcon).width) : 0,
        alertAnimation: getComputedStyle(card).animationName || "",
      };
    })()`);
    assertCheck("home today stat hides completion helper text", unsafeHomeStat.todayFoot === "");
    assertCheck("home today stat uses larger symbol", unsafeHomeStat.todayIconWidth > unsafeHomeStat.deliveryIconWidth);
    assertCheck("home unsafe stat is renamed", unsafeHomeStat.label === "불안전 요소");
    assertCheck("home unsafe stat counts received unsafe issues only", unsafeHomeStat.value.includes("1"));
    assertCheck("home unsafe stat keeps urgent helper text", unsafeHomeStat.foot === "즉시 확인 필요");
    assertCheck("home unsafe stat highlights when received issues exist", unsafeHomeStat.highlighted);
    assertCheck("home unsafe stat uses larger symbol", unsafeHomeStat.unsafeIconWidth > unsafeHomeStat.deliveryIconWidth);
    assertCheck("home unsafe stat pulses alert highlight", unsafeHomeStat.alertAnimation.includes("unsafeStatPulse"));
    await setViewport(client, 1440, 960);
    await delay(250);
    const home1440Shot = await screenshot(client, "00-home-desktop-1440.png");
    await setViewport(client, 1280, 900);
    await delay(250);
    await evaluate(client, `(() => {
      const prefix = "shipyardSafetyV1.";
      const statuses = window.IssueMaterialRules.UNSAFE_STATUSES;
      const issues = JSON.parse(localStorage.getItem(prefix + "unsafeIssues") || "[]")
        .map((row) => ({ ...row, status: statuses[1] }));
      localStorage.setItem(prefix + "unsafeIssues", JSON.stringify(issues));
    })()`);
    await navigate(client, `${baseUrl}/index.html`);
    const unsafeZeroHomeStat = await evaluate(client, `(() => {
      const card = document.querySelector('[data-stat-scope="unsafe"]');
      return {
        value: card?.querySelector(".stat-value")?.textContent?.trim() || "",
        foot: card?.querySelector(".stat-foot")?.textContent?.trim() || "",
        highlighted: card?.classList.contains("is-alert") || false,
        alertAnimation: getComputedStyle(card).animationName || "",
      };
    })()`);
    assertCheck("home unsafe stat shows zero when no received issues exist", unsafeZeroHomeStat.value.includes("0"));
    assertCheck("home unsafe stat hides urgent helper text at zero", unsafeZeroHomeStat.foot === "");
    assertCheck("home unsafe stat removes highlight at zero", !unsafeZeroHomeStat.highlighted);
    assertCheck("home unsafe stat removes alert pulse at zero", unsafeZeroHomeStat.alertAnimation === "none");
    await evaluate(client, `(() => {
      const prefix = "shipyardSafetyV1.";
      const statuses = window.IssueMaterialRules.UNSAFE_STATUSES;
      const issues = JSON.parse(localStorage.getItem(prefix + "unsafeIssues") || "[]")
        .map((row) => ({ ...row, status: row.id === "unsafe-detail-1" ? statuses[0] : statuses[1] }));
      localStorage.setItem(prefix + "unsafeIssues", JSON.stringify(issues));
    })()`);
    await navigate(client, `${baseUrl}/index.html`);
    await click(client, '[data-stat-scope="unsafe"]');
    const unsafeStatNavigation = await evaluate(client, `(() => ({
      currentPath: location.pathname.split("/").pop(),
      unsafeTabActive: document.querySelector('[data-manage-tab="unsafe"]')?.classList.contains("active") || false,
      statusFilter: document.querySelector('[data-record-filter="unsafe:status"]')?.value || "",
      receivedStatus: window.IssueMaterialRules.UNSAFE_STATUSES[0],
      statusControlDisabled: document.querySelector('[data-record-status^="unsafe:"]')?.disabled || false,
      hasUnsafeRecord: Boolean(document.querySelector('[data-unsafe-record-detail="unsafe-detail-1"]')),
    }))()`);
    assertCheck("home unsafe stat opens manage page", unsafeStatNavigation.currentPath === "manage.html");
    assertCheck("home unsafe stat opens unsafe manage tab", unsafeStatNavigation.unsafeTabActive);
    assertCheck("home unsafe stat applies received status filter", unsafeStatNavigation.statusFilter === unsafeStatNavigation.receivedStatus);
    assertCheck("home unsafe stat keeps status changes admin-only", unsafeStatNavigation.statusControlDisabled);
    assertCheck("home unsafe stat shows received unsafe records", unsafeStatNavigation.hasUnsafeRecord);

    await navigate(client, `${baseUrl}/history.html`);
    const historyScopeState = await evaluate(client, `(() => ({
      hasRiskScope: Boolean(document.querySelector('[data-history-scope="risk"]')),
    }))()`);
    assertCheck("history removes old risk scope", historyScopeState.hasRiskScope === false);

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
      const pledgeCard = Array.from(document.querySelectorAll(".pledge-flow-card"))
        .find((node) => node.textContent.includes("작업 전 안전 서약서"));
      return {
        hasWireItem: text.includes("탑재용 와이어 / 샤클 안전핀 상태"),
        hasSlingItem: text.includes("슬링벨트 손상 상태"),
        hasCommonHousekeeping: text.includes("탑재 위치 정리정돈"),
        hasCommonUnderLoad: text.includes("권상물 하부 출입금지"),
        hasInlinePledge: Boolean(pledgeCard),
        pledgeRuleCount: pledgeCard ? pledgeCard.querySelectorAll("[data-pledge-rule]").length : 0,
      };
    })()`);
    assertCheck("wire-specific item appears", checklistState.hasWireItem);
    assertCheck("unselected sling item is hidden", !checklistState.hasSlingItem);
    assertCheck("common housekeeping item appears", checklistState.hasCommonHousekeeping);
    assertCheck("common under-load item appears", checklistState.hasCommonUnderLoad);
    assertCheck("inline safety pledge appears", checklistState.hasInlinePledge);
    assertCheck("inline safety pledge has rules", checklistState.pledgeRuleCount > 0);
    const checklistShot = await screenshot(client, "02-checklist-wire-desktop.png");

    await setViewport(client, 420, 844, true);
    await delay(250);
    const mobileShot = await screenshot(client, "03-checklist-wire-mobile.png");

    await setViewport(client, 1280, 900);
    await navigate(client, `${baseUrl}/items.html`);
    await click(client, '[data-manage-category="mounting"]');
    const itemsState = await evaluate(client, `(() => {
      const text = document.body.innerText;
      return {
        hasCollapsedAddItemForm: !document.querySelector('[id^="itemText_"]'),
        hasAddItemMoreToggle: Boolean(document.querySelector('[data-toggle-add-item="mounting-lift"]')),
        hasCollapsedIconEditor: !document.querySelector("#editCatIcon"),
        hasIconEditorMoreToggle: Boolean(document.querySelector("[data-toggle-category-visual]")),
        hasAdminToggle: Boolean(document.querySelector('[data-action="toggle-admin"]')),
        hasWireDescription: text.includes("탑재용 와이어 선택 시 표시"),
        hasCommonDescription: text.includes("공통 항목"),
      };
    })()`);
    assertCheck("item add form is collapsed on entry", itemsState.hasCollapsedAddItemForm);
    assertCheck("item add form more toggle appears", itemsState.hasAddItemMoreToggle);
    assertCheck("icon editor is collapsed on entry", itemsState.hasCollapsedIconEditor);
    assertCheck("icon editor more toggle appears", itemsState.hasIconEditorMoreToggle);
    assertCheck("item management admin toggle appears", itemsState.hasAdminToggle);
    assertCheck("linked tool description appears", itemsState.hasWireDescription);
    assertCheck("common item description appears", itemsState.hasCommonDescription);
    const itemsCollapsedShot = await screenshot(client, "04-items-management-collapsed-desktop.png");
    await setViewport(client, 420, 844, true);
    await delay(250);
    const itemsMobileCollapsedShot = await screenshot(client, "05-items-management-collapsed-mobile.png");
    await setViewport(client, 1280, 900);
    await delay(250);
    await click(client, '[data-toggle-add-item="mounting-lift"]');
    await click(client, "[data-toggle-category-visual]");
    const expandedItemsState = await evaluate(client, `(() => {
      const text = document.body.innerText;
      return {
        hasToolPicker: text.includes("사용 공기구"),
        hasItemTextField: Boolean(document.querySelector("#itemText_mounting-lift")),
        hasIconField: Boolean(document.querySelector("#editCatIcon")),
        hasPictogramPicker: Boolean(document.querySelector(".pictogram-picker")),
      };
    })()`);
    assertCheck("item add form expands from more toggle", expandedItemsState.hasItemTextField);
    assertCheck("item management tool picker appears after expand", expandedItemsState.hasToolPicker);
    assertCheck("icon editor expands from more toggle", expandedItemsState.hasIconField);
    assertCheck("pictogram picker appears after expand", expandedItemsState.hasPictogramPicker);
    await evaluate(client, `(() => {
      window.__adminPromptMessages = [];
      window.prompt = (message) => {
        window.__adminPromptMessages.push(String(message || ""));
        return "gs2026";
      };
    })()`);
    await click(client, '[data-action="toggle-admin"]');
    const adminState = await evaluate(client, `(() => {
      const toggle = document.querySelector('[data-action="toggle-admin"]');
      return {
        promptMessages: window.__adminPromptMessages || [],
        togglePressed: toggle ? toggle.getAttribute("aria-pressed") : "",
        hasAdminNotice: document.body.innerText.includes("관리자 수정 모드가 켜졌습니다"),
      };
    })()`);
    assertCheck("admin password prompt appears", adminState.promptMessages.some((message) => message.includes("관리자 비밀번호")));
    assertCheck("admin mode turns on after password", adminState.togglePressed === "true");
    const itemsShot = await screenshot(client, "06-items-management-expanded-desktop.png");

    await navigate(client, `${baseUrl}/unsafe.html`);
    const unsafeState = await evaluate(client, `(() => {
      return {
        hasTitle: document.body.innerText.includes("불안전요소 등록"),
        hasShipSelect: Boolean(document.querySelector("#unsafeShipNo")),
        hasWorkerSelect: Boolean(document.querySelector("#unsafeWorkerId")),
      };
    })()`);
    assertCheck("unsafe registration title", unsafeState.hasTitle);
    assertCheck("unsafe ship select", unsafeState.hasShipSelect);
    assertCheck("unsafe worker select", unsafeState.hasWorkerSelect);
    const unsafeShot = await screenshot(client, "07-unsafe-registration-desktop.png");

    await navigate(client, `${baseUrl}/materials.html`);
    const materialState = await evaluate(client, `(() => {
      return {
        hasTitle: document.body.innerText.includes("호선자재 누락"),
        hasMaterialName: Boolean(document.querySelector("#materialName")),
        hasWorkerSelect: Boolean(document.querySelector("#materialWorkerId")),
      };
    })()`);
    assertCheck("material registration title", materialState.hasTitle);
    assertCheck("material name input", materialState.hasMaterialName);
    assertCheck("material worker select", materialState.hasWorkerSelect);
    const materialShot = await screenshot(client, "08-material-registration-desktop.png");

    await evaluate(client, `(() => {
      sessionStorage.removeItem("shipyardSafetyV1.adminMode");
    })()`);
    await navigate(client, `${baseUrl}/manage.html`);
    await evaluate(client, `(() => {
      window.prompt = () => "gs2026";
    })()`);
    await click(client, '[data-action="toggle-admin"]');
    await click(client, '[data-manage-tab="workers"]');
    const manageState = await evaluate(client, `(() => {
      return {
        hasManageTitle: document.body.innerText.includes("관리"),
        hasWorkersTab: document.body.innerText.includes("작업자"),
        hasWorkerNameInput: Boolean(document.querySelector("#workerName")),
      };
    })()`);
    assertCheck("manage title", manageState.hasManageTitle);
    assertCheck("workers tab", manageState.hasWorkersTab);
    assertCheck("worker name input", manageState.hasWorkerNameInput);
    const manageShot = await screenshot(client, "09-manage-workers-desktop.png");

    await click(client, '[data-manage-tab="unsafe"]');
    await click(client, '[data-unsafe-record-detail="unsafe-detail-1"]');
    const unsafeDetailState = await evaluate(client, `(() => {
      const images = Array.from(document.querySelectorAll(".unsafe-detail-photo"));
      const allMetaCards = Array.from(document.querySelectorAll(".unsafe-detail .detail-grid > div"));
      const metaCards = allMetaCards.filter((card) => getComputedStyle(card).display !== "none");
      const metaLabels = metaCards.map((card) => card.querySelector(".small")?.textContent?.trim() || "");
      const dateCard = metaCards.find((card) => card.querySelector(".small")?.textContent?.trim() === "등록일시");
      const dateStyle = dateCard ? getComputedStyle(dateCard) : null;
      const hiddenPhotoMetaCard = allMetaCards.find((card) => card.querySelector(".small")?.textContent?.trim() === "사진");
      return {
        hasDetailTitle: document.body.innerText.includes("불안전요소 상세 기록"),
        hasBackButton: Boolean(document.querySelector('[data-action="back-unsafe-list"]')),
        metaLabels,
        metaCardCount: metaCards.length,
        hasPhotoMetaCard: metaLabels.includes("사진"),
        hiddenPhotoMetaCardExists: Boolean(hiddenPhotoMetaCard),
        hiddenPhotoMetaCardVisible: hiddenPhotoMetaCard ? getComputedStyle(hiddenPhotoMetaCard).display !== "none" : false,
        dateSpansFullWidth: Boolean(dateStyle && dateStyle.gridColumnStart === "1" && dateStyle.gridColumnEnd === "-1"),
        photoCount: images.length,
        allPhotosLoaded: images.every((img) => img.complete && img.naturalWidth > 0),
        hasContent: document.body.innerText.includes("용접 불티 차단막 미설치"),
      };
    })()`);
    assertCheck("unsafe detail title appears after card click", unsafeDetailState.hasDetailTitle);
    assertCheck("unsafe detail has back button", unsafeDetailState.hasBackButton);
    assertCheck("unsafe detail hides photo count from meta cards", unsafeDetailState.hasPhotoMetaCard === false);
    assertCheck("unsafe detail keeps photo count meta hidden in DOM", unsafeDetailState.hiddenPhotoMetaCardExists && !unsafeDetailState.hiddenPhotoMetaCardVisible);
    assertCheck("unsafe detail meta grid has no empty fourth card", unsafeDetailState.metaCardCount === 3);
    assertCheck("unsafe detail date meta spans full width", unsafeDetailState.dateSpansFullWidth);
    assertCheck("unsafe detail shows every attached photo", unsafeDetailState.photoCount === 3);
    assertCheck("unsafe detail photos load", unsafeDetailState.allPhotosLoaded);
    assertCheck("unsafe detail keeps original content", unsafeDetailState.hasContent);
    const unsafeDetailShot = await screenshot(client, "10-unsafe-detail-desktop.png");

    console.log(JSON.stringify({
      appUrl: baseUrl,
      screenshots: [home1440Shot, prepShot, checklistShot, mobileShot, itemsCollapsedShot, itemsMobileCollapsedShot, itemsShot, unsafeShot, materialShot, manageShot, unsafeDetailShot],
      assertions: { prepState, checklistState, itemsState, expandedItemsState, unsafeState, materialState, manageState, unsafeDetailState },
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
