import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const chromePath = process.argv[2];
const baseUrl = process.argv[3] || "http://127.0.0.1:4173";
const accessUrl = process.argv[4] || "";
const port = 9223;
const STORAGE_PREFIX = "shipyardSafetyV1.";

if (!chromePath) {
  throw new Error("Chrome executable path is required");
}

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--window-size=1280,900",
  "--no-first-run",
  "--no-default-browser-check",
  `--remote-debugging-port=${port}`,
  "about:blank",
], { stdio: "ignore" });

async function waitForJson() {
  for (let i = 0; i < 80; i += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json`);
      if (response.ok) return response.json();
    } catch {}
    await delay(100);
  }
  throw new Error("Chrome DevTools endpoint did not start");
}

function connect(wsUrl) {
  const socket = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();
  const listeners = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
      return;
    }
    const handlers = listeners.get(message.method) || [];
    handlers.forEach((handler) => handler(message.params || {}));
  });

  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    send(method, params = {}) {
      const id = nextId;
      nextId += 1;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    on(method, handler) {
      const handlers = listeners.get(method) || [];
      handlers.push(handler);
      listeners.set(method, handlers);
    },
    close() {
      socket.close();
    },
  };
}

function assert(condition, message, details = {}) {
  if (!condition) {
    const error = new Error(message);
    error.details = details;
    throw error;
  }
}

async function waitForValue(cdp, expression, predicate, description, timeoutMs = 5000) {
  const started = Date.now();
  let lastValue;
  while (Date.now() - started < timeoutMs) {
    const result = await cdp.send("Runtime.evaluate", {
      returnByValue: true,
      expression,
    });
    lastValue = result.result.value;
    if (predicate(lastValue)) return result;
    await delay(100);
  }
  assert(false, `Timed out waiting for ${description}`, lastValue);
}

const submitSmokeRestoreExpression = `(() => {
  const backup = JSON.parse(sessionStorage.getItem('submitSmokeBackup') || '{}');
  Object.entries(backup).forEach(([key, value]) => {
    const storageKey = '${STORAGE_PREFIX}' + key;
    if (value === null) localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, value);
  });
  sessionStorage.removeItem('submitSmokeBackup');
  if (Object.keys(backup).length) location.reload();
})()`;

let cdp;
let cdpIsOpen = false;

try {
  await waitForJson();
  const newTarget = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`, {
    method: "PUT",
  }).then((response) => response.json());
  const tab = newTarget;
  cdp = connect(tab.webSocketDebuggerUrl);
  await cdp.ready;
  cdpIsOpen = true;
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => {
      const originalFetch = window.fetch;
      window.fetch = (...args) => {
        const input = args[0];
        const url = typeof input === 'string' ? input : (input?.url || String(input || ''));
        if (url.includes('psatbyktzladtymdygwh.supabase.co')) {
          return Promise.reject(new Error('smoke-blocked-supabase'));
        }
        return originalFetch(...args);
      };
      const originalXhrOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this.__smokeBlockedUrl = String(url || '');
        return originalXhrOpen.call(this, method, url, ...rest);
      };
      const originalXhrSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function(...args) {
        if (this.__smokeBlockedUrl?.includes('psatbyktzladtymdygwh.supabase.co')) {
          setTimeout(() => this.dispatchEvent(new Event('error')), 0);
          return undefined;
        }
        return originalXhrSend.apply(this, args);
      };
    })();`,
  });

  if (accessUrl) {
    const accessLoaded = new Promise((resolve) => cdp.on("Page.loadEventFired", resolve));
    await cdp.send("Page.navigate", { url: accessUrl });
    await Promise.race([accessLoaded, delay(5000)]);
    await delay(1000);
  }

  const pages = ["index.html", "check.html", "history.html", "ships.html", "items.html"];
  const results = [];
  const runtimeErrors = [];
  cdp.on("Runtime.exceptionThrown", (params) => {
    runtimeErrors.push(params.exceptionDetails?.text || "runtime error");
  });

  for (const path of pages) {
    const errorStart = runtimeErrors.length;
    const loaded = new Promise((resolve) => cdp.on("Page.loadEventFired", resolve));
    await cdp.send("Page.navigate", { url: `${baseUrl}/${path}` });
    await Promise.race([loaded, delay(4000)]);
    await delay(1200);
    const evalResult = await cdp.send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => ({
        href: location.href,
        title: document.title,
        initialView: document.body.dataset.initialView,
        activeNav: document.querySelector('.nav-btn.active')?.textContent?.trim() || '',
        appbar: document.querySelector('#appbarTitle')?.textContent?.trim() || '',
        pageLength: document.querySelector('#page')?.innerHTML?.length || 0,
        hasToast: Boolean(document.querySelector('#toast')),
        stageSelects: document.querySelectorAll('[data-ship-stage-field]').length,
        deleteButtons: document.querySelectorAll('[data-delete-ship]').length,
        headerVisible: getComputedStyle(document.querySelector('#homeHeadline')).display !== 'none',
        bodyClass: document.body.className
      }))()`,
    });
    results.push({ path, ...evalResult.result.value, errors: runtimeErrors.slice(errorStart) });
  }

  async function clickNavFromHome(view) {
    const clickErrorsStart = runtimeErrors.length;
    const loaded = new Promise((resolve) => cdp.on("Page.loadEventFired", resolve));
    await cdp.send("Page.navigate", { url: `${baseUrl}/index.html` });
    await Promise.race([loaded, delay(4000)]);
    await delay(1000);
    await cdp.send("Runtime.evaluate", {
      expression: `document.querySelector('[data-view="${view}"]')?.click()`,
    });
    await delay(1600);
    const clickResult = await cdp.send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => ({
        href: location.href,
        activeNav: document.querySelector('.nav-btn.active')?.textContent?.trim() || '',
        pageLength: document.querySelector('#page')?.innerHTML?.length || 0
      }))()`,
    });
    return { ...clickResult.result.value, errors: runtimeErrors.slice(clickErrorsStart) };
  }

  const shipsClick = await clickNavFromHome("ships");
  const itemsClick = await clickNavFromHome("items");

  const itemsLoaded = new Promise((resolve) => cdp.on("Page.loadEventFired", resolve));
  await cdp.send("Page.navigate", { url: `${baseUrl}/items.html` });
  await Promise.race([itemsLoaded, delay(4000)]);
  await delay(1000);
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      localStorage.setItem('${STORAGE_PREFIX}tools', JSON.stringify([
        { id: 'items-smoke-tool-1', categoryId: null, name: 'Smoke Tool 1', nature: '선행', order: 1, deleted: false },
        { id: 'items-smoke-tool-2', categoryId: null, name: 'Smoke Tool 2', nature: '후행', order: 2, deleted: false },
        { id: 'items-smoke-tool-3', categoryId: null, name: 'Smoke Tool 3', nature: '선행/후행', order: 3, deleted: false }
      ]));
      sessionStorage.setItem('shipyardSafetyAdmin', 'true');
      location.reload();
    })()`,
  });
  await delay(1000);
  const itemsPageCheck = await cdp.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => ({
      pictogramImages: document.querySelectorAll('.pictogram-picker img.pictogram-art').length,
      pickerButtons: document.querySelectorAll('.pictogram-picker [data-pick-icon]').length,
      toolAdminCards: document.querySelectorAll('.tool-admin-card').length,
      toolAdminColumns: getComputedStyle(document.querySelector('.tool-admin-grid') || document.body).gridTemplateColumns.split(' ').filter(Boolean).length,
      toolNatureBadges: Array.from(document.querySelectorAll('.tool-admin-card .nature-badge')).map((node) => node.textContent.trim()).slice(0, 10),
      compactInputs: document.querySelectorAll('.tool-admin-card-compact input, .tool-admin-card-compact select').length,
      addOpenBefore: Boolean(document.querySelector('#newToolName')),
      expandedBefore: document.querySelectorAll('.tool-admin-card-expanded').length
    }))()`,
  });
  const itemsInteractionCheck = await cdp.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      document.querySelector('[data-action="toggle-tool-add"]')?.click();
      const addOpenAfter = Boolean(document.querySelector('#newToolName'));
      document.querySelector('[data-edit-tool="items-smoke-tool-2"]')?.click();
      const expanded = document.querySelector('.tool-admin-card-expanded');
      const input = expanded?.querySelector('input');
      const select = expanded?.querySelector('select');
      const expandedRect = expanded?.getBoundingClientRect();
      const inputRect = input?.getBoundingClientRect();
      const selectRect = select?.getBoundingClientRect();
      const inputInside = Boolean(expandedRect && inputRect && inputRect.left >= expandedRect.left && inputRect.right <= expandedRect.right);
      const selectInside = Boolean(expandedRect && selectRect && selectRect.left >= expandedRect.left && selectRect.right <= expandedRect.right);
      return {
        addOpenAfter,
        expandedCount: document.querySelectorAll('.tool-admin-card-expanded').length,
        compactCardsAfter: document.querySelectorAll('.tool-admin-card-compact').length,
        inputInside,
        selectInside
      };
    })()`,
  });

  const loaded = new Promise((resolve) => cdp.on("Page.loadEventFired", resolve));
  await cdp.send("Page.navigate", { url: `${baseUrl}/index.html` });
  await Promise.race([loaded, delay(4000)]);
  await delay(1000);

  const mobileErrorsStart = runtimeErrors.length;
  await cdp.send("Runtime.evaluate", {
    expression: `document.querySelector('[data-screen-mode="mobile"]')?.click()`,
  });
  await delay(500);
  const mobileResult = await cdp.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => ({
      bodyClass: document.body.className,
      activeToggle: Array.from(document.querySelectorAll('[data-screen-mode].active')).map((node) => node.textContent.trim()).join('|')
    }))()`,
  });

  const stageEditErrorsStart = runtimeErrors.length;
  const stageLoaded = new Promise((resolve) => cdp.on("Page.loadEventFired", resolve));
  await cdp.send("Page.navigate", { url: `${baseUrl}/ships.html` });
  await Promise.race([stageLoaded, delay(4000)]);
  await delay(1000);
  await cdp.send("Runtime.evaluate", {
    expression: `sessionStorage.setItem('shipyardSafetyAdmin', 'true'); location.reload();`,
  });
  await delay(1400);
  const stageEditResult = await cdp.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      sessionStorage.setItem('shipyardSafetyAdmin', 'true');
      const sortSelect = document.querySelector('[data-ship-sort-mode]');
      const saveOrderButton = document.querySelector('[data-action="save-ship-order"]');
      if (sortSelect) {
        sortSelect.value = 'number';
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const select = document.querySelector('[data-ship-stage-field]');
      const deleteButtons = document.querySelectorAll('[data-delete-ship]').length;
      if (!select) return { hasSelect: false, deleteButtons, hasSortSelect: Boolean(sortSelect), sortStored: localStorage.getItem('shipyardSafetyV1.shipSortMode'), hasSaveOrderButton: Boolean(saveOrderButton) };
      const before = select.value;
      select.disabled = false;
      select.value = before === 'lc' ? 'mounting' : 'lc';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      const stored = JSON.parse(localStorage.getItem('shipyardSafetyV1.ships') || '[]');
      const ship = stored.find((row) => row.id === select.dataset.shipId);
      return { hasSelect: true, before, after: select.value, storedStage: ship?.processStage || '', deleteButtons, hasSortSelect: Boolean(sortSelect), sortStored: localStorage.getItem('shipyardSafetyV1.shipSortMode'), hasSaveOrderButton: Boolean(saveOrderButton) };
    })()`,
  });

  const prepLoaded = new Promise((resolve) => cdp.on("Page.loadEventFired", resolve));
  await cdp.send("Page.navigate", { url: `${baseUrl}/check.html` });
  await Promise.race([prepLoaded, delay(4000)]);
  await delay(1000);
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const keys = ['categories', 'sections', 'items', 'tools', 'draft'];
      const backup = Object.fromEntries(keys.map((key) => [key, localStorage.getItem('${STORAGE_PREFIX}' + key)]));
      sessionStorage.setItem('prepSmokeBackup', JSON.stringify(backup));
      localStorage.setItem('${STORAGE_PREFIX}categories', JSON.stringify([
        { id: 'prep-smoke', label: 'Prep Smoke', icon: 'blockAssembly', color: '#1f6eb3', requireToolCheck: true, order: 1 }
      ]));
      localStorage.setItem('${STORAGE_PREFIX}sections', JSON.stringify([
        { id: 'prep-sec', categoryId: 'prep-smoke', title: 'Prep Section', order: 1 }
      ]));
      localStorage.setItem('${STORAGE_PREFIX}items', JSON.stringify([
        { id: 'prep-common', categoryId: 'prep-smoke', sectionId: 'prep-sec', text: 'Prep common item', risk: 'low', required: false, active: true, toolIds: [], order: 1 },
        { id: 'prep-linked', categoryId: 'prep-smoke', sectionId: 'prep-sec', text: 'Prep linked item', risk: 'high', required: true, active: true, toolIds: ['prep-tool'], order: 2 }
      ]));
      localStorage.setItem('${STORAGE_PREFIX}tools', JSON.stringify([
        { id: 'prep-tool', categoryId: 'prep-smoke', name: 'Prep tool', order: 1, deleted: false }
      ]));
      localStorage.setItem('${STORAGE_PREFIX}draft', JSON.stringify({
        worker: '',
        shipNo: '',
        checks: {},
        selectedToolIds: [],
        toolPrepComplete: false
      }));
      location.reload();
    })()`,
  });
  await delay(1500);
  await cdp.send("Runtime.evaluate", {
    expression: `document.querySelector('[data-select-category="prep-smoke"]')?.click()`,
  });
  await delay(500);
  const prepBefore = await cdp.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const nextButton = document.querySelector('[data-action="continue-tool-prep"]');
      return {
        prepTitle: document.querySelector('h1')?.textContent?.trim() || '',
        toolCards: document.querySelectorAll('[data-tool-prep-toggle]').length,
        nextDisabled: Boolean(nextButton?.disabled)
      };
    })()`,
  });
  await delay(400);
  await cdp.send("Runtime.evaluate", {
    expression: `document.querySelector('[data-tool-prep-toggle="prep-tool"]')?.click()`,
  });
  await delay(400);
  const prepAfterSelect = await cdp.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => ({
      nextDisabled: Boolean(document.querySelector('[data-action="continue-tool-prep"]')?.disabled),
      selectedCount: document.querySelectorAll('.tool-prep-card.checked').length
    }))()`,
  });
  await cdp.send("Runtime.evaluate", {
    expression: `document.querySelector('[data-action="continue-tool-prep"]')?.click()`,
  });
  await delay(500);
  const prepChecklist = await cdp.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => ({
      title: document.querySelector('h1')?.textContent?.trim() || '',
      checkItems: Array.from(document.querySelectorAll('[data-check-item]')).map((node) => node.parentElement?.textContent?.trim() || ''),
      prepVisible: Boolean(document.querySelector('[data-action="continue-tool-prep"]'))
    }))()`,
  });
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const backup = JSON.parse(sessionStorage.getItem('prepSmokeBackup') || '{}');
      Object.entries(backup).forEach(([key, value]) => {
        const storageKey = '${STORAGE_PREFIX}' + key;
        if (value === null) localStorage.removeItem(storageKey);
        else localStorage.setItem(storageKey, value);
      });
      sessionStorage.removeItem('prepSmokeBackup');
      location.reload();
    })()`,
  });
  await delay(1000);

  let submitFlow;
  let submitLayoutBefore;
  let submitReady;
  let submitAfter;
  try {
    const submitLoaded = new Promise((resolve) => cdp.on("Page.loadEventFired", resolve));
    await cdp.send("Page.navigate", { url: `${baseUrl}/check.html` });
    await Promise.race([submitLoaded, delay(4000)]);
    await delay(1000);
    submitFlow = await cdp.send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const keys = ['categories', 'sections', 'items', 'tools', 'ships', 'draft', 'inspections', 'inspectionItems'];
        const backup = Object.fromEntries(keys.map((key) => [key, localStorage.getItem('${STORAGE_PREFIX}' + key)]));
        sessionStorage.setItem('submitSmokeBackup', JSON.stringify(backup));
        localStorage.setItem('${STORAGE_PREFIX}categories', JSON.stringify([
          { id: 'submit-smoke', label: 'Submit Smoke', icon: 'blockAssembly', color: '#1f6eb3', requireToolCheck: false, order: 1 }
        ]));
        localStorage.setItem('${STORAGE_PREFIX}sections', JSON.stringify([
          { id: 'submit-sec-1', categoryId: 'submit-smoke', title: 'Submit Section', order: 1 }
        ]));
        localStorage.setItem('${STORAGE_PREFIX}items', JSON.stringify([
          { id: 'submit-item-1', categoryId: 'submit-smoke', sectionId: 'submit-sec-1', text: 'Submit required high', risk: 'high', required: true, active: true, toolIds: [], order: 1 },
          { id: 'submit-item-2', categoryId: 'submit-smoke', sectionId: 'submit-sec-1', text: 'Submit normal low', risk: 'low', required: false, active: true, toolIds: [], order: 2 }
        ]));
        localStorage.setItem('${STORAGE_PREFIX}tools', JSON.stringify([]));
        localStorage.setItem('${STORAGE_PREFIX}ships', JSON.stringify([
          { id: 'submit-ship-1', no: 'H-SMOKE', type: 'CNTR', processStage: 'mounting', lcDate: '2026-05-14', order: 1, createdAt: '2026-05-14T00:00:00.000Z' }
        ]));
        localStorage.setItem('${STORAGE_PREFIX}draft', JSON.stringify({ worker: '', shipNo: '', checks: {}, selectedToolIds: [], toolPrepComplete: false }));
        localStorage.setItem('${STORAGE_PREFIX}inspections', JSON.stringify([]));
        localStorage.setItem('${STORAGE_PREFIX}inspectionItems', JSON.stringify([]));
        return { injected: true };
      })()`,
    });
    const submitInjectedLoaded = new Promise((resolve) => cdp.on("Page.loadEventFired", resolve));
    await cdp.send("Page.navigate", { url: `${baseUrl}/check.html` });
    await Promise.race([submitInjectedLoaded, delay(4000)]);
    await waitForValue(
      cdp,
      `(() => ({ hasCategory: Boolean(document.querySelector('[data-select-category="submit-smoke"]')) }))()`,
      (value) => value.hasCategory,
      "submit smoke category button"
    );
    await cdp.send("Runtime.evaluate", {
      expression: `document.querySelector('[data-select-category="submit-smoke"]')?.click()`,
    });
    submitLayoutBefore = await waitForValue(
      cdp,
      `(() => {
        const submitButton = document.querySelector('[data-action="submit-inspection"]');
        const sections = Array.from(document.querySelectorAll('.check-section'));
        const lastSection = sections.at(-1);
        const submitRect = submitButton?.getBoundingClientRect();
        const sectionRect = lastSection?.getBoundingClientRect();
        return {
          hasSubmit: Boolean(submitButton),
          submitAfterSections: Boolean(submitRect && sectionRect && submitRect.top > sectionRect.bottom),
          submitInsideTopForm: Boolean(submitButton?.closest('.form-row')),
          disabledBeforeData: Boolean(submitButton?.disabled)
        };
      })()`,
      (value) => value.hasSubmit,
      "submit smoke checklist submit button"
    );
    assert(submitLayoutBefore.result.value.hasSubmit, "Checklist should render a submit button", submitLayoutBefore.result.value);
    assert(submitLayoutBefore.result.value.submitAfterSections, "Submit button should appear after checklist sections", submitLayoutBefore.result.value);
    assert(submitLayoutBefore.result.value.submitInsideTopForm === false, "Submit button should not remain in the top form row", submitLayoutBefore.result.value);
    assert(submitLayoutBefore.result.value.disabledBeforeData === true, "Submit should stay disabled before required data is complete", submitLayoutBefore.result.value);
    await cdp.send("Runtime.evaluate", {
      expression: `(() => {
        const firstUnchecked = Array.from(document.querySelectorAll('[data-check-item]')).find((node) => !node.checked);
        if (firstUnchecked) {
          firstUnchecked.checked = true;
          firstUnchecked.dispatchEvent(new Event('input', { bubbles: true }));
        }
      })()`,
    });
    await waitForValue(
      cdp,
      `(() => ({ checkedCount: document.querySelectorAll('[data-check-item]:checked').length }))()`,
      (value) => value.checkedCount === 1,
      "first submit smoke checkbox"
    );
    await cdp.send("Runtime.evaluate", {
      expression: `(() => {
        const firstUnchecked = Array.from(document.querySelectorAll('[data-check-item]')).find((node) => !node.checked);
        if (firstUnchecked) {
          firstUnchecked.checked = true;
          firstUnchecked.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const worker = document.querySelector('#worker');
        if (worker) {
          worker.value = 'Submit Smoke Worker';
          worker.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const ship = document.querySelector('#shipNo');
        if (ship) {
          ship.value = 'H-SMOKE';
          ship.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()`,
    });
    submitReady = await waitForValue(
      cdp,
      `(() => ({
        submitEnabledAfterData: document.querySelector('[data-action="submit-inspection"]')?.disabled === false,
        checkedCount: document.querySelectorAll('[data-check-item]:checked').length
      }))()`,
      (value) => value.submitEnabledAfterData && value.checkedCount === 2,
      "submit smoke ready state"
    );
    await cdp.send("Runtime.evaluate", {
      expression: `document.querySelector('[data-action="submit-inspection"]')?.click()`,
    });
    submitAfter = await waitForValue(
      cdp,
      `(() => ({
        href: location.href,
        title: document.querySelector('h1')?.textContent?.trim() || '',
        historyCards: document.querySelectorAll('.history-card').length,
        historySummary: document.querySelector('.history-card-summary')?.textContent?.trim() || '',
        localInspections: JSON.parse(localStorage.getItem('${STORAGE_PREFIX}inspections') || '[]').length,
        localInspectionItems: JSON.parse(localStorage.getItem('${STORAGE_PREFIX}inspectionItems') || '[]').length
      }))()`,
      (value) => value.historyCards === 1 && value.localInspections === 1 && value.localInspectionItems === 2,
      "submit smoke history save"
    );
  } finally {
    await cdp.send("Runtime.evaluate", { expression: submitSmokeRestoreExpression });
    await delay(1000);
  }

  assert(itemsPageCheck.result.value.pictogramImages > 0, "Items page should show pictogram images", itemsPageCheck.result.value);
  assert(itemsPageCheck.result.value.pickerButtons > 0, "Items page should show pictogram picker buttons", itemsPageCheck.result.value);
  assert(itemsPageCheck.result.value.toolAdminCards > 0, "Items page should show global tool cards", itemsPageCheck.result.value);
  assert(itemsPageCheck.result.value.toolAdminColumns === 4, "Global tool cards should render in four columns", itemsPageCheck.result.value);
  assert(itemsPageCheck.result.value.compactInputs === 0, "Compact tool cards should not show edit inputs", itemsPageCheck.result.value);
  assert(itemsPageCheck.result.value.addOpenBefore === false, "Tool add form should be collapsed by default", itemsPageCheck.result.value);
  assert(itemsInteractionCheck.result.value.addOpenAfter, "Tool add form should open on demand", itemsInteractionCheck.result.value);
  assert(itemsInteractionCheck.result.value.expandedCount === 1, "Exactly one tool card should expand for editing", itemsInteractionCheck.result.value);
  assert(itemsInteractionCheck.result.value.inputInside && itemsInteractionCheck.result.value.selectInside, "Tool edit inputs should stay inside expanded card", itemsInteractionCheck.result.value);
  assert(stageEditResult.result.value.hasSortSelect, "Ships page should show sort select", stageEditResult.result.value);
  assert(stageEditResult.result.value.hasSaveOrderButton, "Ships page should show save order button", stageEditResult.result.value);
  assert(stageEditResult.result.value.sortStored === '"number"', "Ships sort selection should persist", stageEditResult.result.value);
  assert(prepBefore.result.value.prepTitle.length > 0, "Selecting category should open tool prep page", prepBefore.result.value);
  assert(prepBefore.result.value.toolCards === 1, "Tool prep page should show injected tool", prepBefore.result.value);
  assert(prepBefore.result.value.nextDisabled === true, "Continue button should be disabled before selecting required tool", prepBefore.result.value);
  assert(prepAfterSelect.result.value.nextDisabled === false, "Continue button should enable after tool selection", prepAfterSelect.result.value);
  assert(prepAfterSelect.result.value.selectedCount === 1, "Selected tool should be reflected in UI", prepAfterSelect.result.value);
  assert(prepChecklist.result.value.title === "Prep Smoke", "Continuing should open checklist for selected category", prepChecklist.result.value);
  assert(prepChecklist.result.value.prepVisible === false, "Prep button should disappear on checklist page", prepChecklist.result.value);
  assert(prepChecklist.result.value.checkItems.some((text) => text.includes("Prep common item")), "Checklist should include common item", prepChecklist.result.value);
  assert(prepChecklist.result.value.checkItems.some((text) => text.includes("Prep linked item")), "Checklist should include linked item after selection", prepChecklist.result.value);

  assert(submitLayoutBefore.result.value.hasSubmit, "Checklist should render a submit button", submitLayoutBefore.result.value);
  assert(submitLayoutBefore.result.value.submitAfterSections, "Submit button should appear after checklist sections", submitLayoutBefore.result.value);
  assert(submitLayoutBefore.result.value.submitInsideTopForm === false, "Submit button should not remain in the top form row", submitLayoutBefore.result.value);
  assert(submitLayoutBefore.result.value.disabledBeforeData === true, "Submit should stay disabled before required data is complete", submitLayoutBefore.result.value);
  assert(submitReady.result.value.submitEnabledAfterData === true, "Submit should enable after checks, worker, and ship are complete", submitReady.result.value);
  assert(submitReady.result.value.checkedCount === 2, "Submit smoke should check all injected items", submitReady.result.value);
  assert(submitAfter.result.value.href.includes("history.html") || submitAfter.result.value.title === "기록", "Submit should show history after saving or local sync fallback", submitAfter.result.value);
  assert(submitAfter.result.value.historyCards === 1, "Submitted inspection should render as one history card", submitAfter.result.value);
  assert(submitAfter.result.value.historySummary.includes("Submit Smoke Worker"), "History card should show submitted worker", submitAfter.result.value);
  assert(submitAfter.result.value.localInspections === 1, "Submitted inspection should be saved locally", submitAfter.result.value);
  assert(submitAfter.result.value.localInspectionItems === 2, "Submitted inspection items should be saved locally", submitAfter.result.value);

  cdpIsOpen = false;
  cdp.close();
  console.log(JSON.stringify({
    pages: results,
    navigationClicks: {
      ships: shipsClick,
      items: itemsClick,
    },
    itemsPageCheck: itemsPageCheck.result.value,
    mobileToggle: { ...mobileResult.result.value, errors: runtimeErrors.slice(mobileErrorsStart) },
    stageEdit: { ...stageEditResult.result.value, errors: runtimeErrors.slice(stageEditErrorsStart) },
    prepFlow: {
      beforeSelection: prepBefore.result.value,
      afterSelection: prepAfterSelect.result.value,
      checklist: prepChecklist.result.value,
    },
    submitFlow: {
      started: submitFlow.result.value,
      layoutBefore: submitLayoutBefore.result.value,
      ready: submitReady.result.value,
      after: submitAfter.result.value,
    },
  }, null, 2));
} finally {
  if (cdp && cdpIsOpen) {
    try {
      await cdp.send("Runtime.evaluate", { expression: submitSmokeRestoreExpression });
    } catch {}
  }
  chrome.kill();
}
