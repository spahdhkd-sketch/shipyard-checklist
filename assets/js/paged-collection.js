(function attachPagedCollection(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardPagedCollection = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildPagedCollectionApi() {
  const DEFAULT_PAGE_SIZE = 25;
  const DEFAULT_STATUS_FILTER = "진행 중";
  const DEFAULT_FILTERS = Object.freeze({
    search: "",
    ship: "",
    team: "",
    status: DEFAULT_STATUS_FILTER,
    date: "",
  });
  const CURSOR_VERSION = 1;
  const DEFAULT_FIELDS = Object.freeze({
    id: ["id", "uuid", "recordId"],
    ship: ["shipNo", "ship", "shipName", "vesselNo"],
    team: ["team", "teamName", "workTeam", "department"],
    status: ["status", "state"],
    date: ["workDate", "date", "createdAt", "updatedAt"],
    search: ["id", "shipNo", "ship", "shipName", "team", "teamName", "workTeam", "department", "status", "state", "name", "title", "workName", "workType", "content"],
  });

  function text(value) {
    return value === null || value === undefined ? "" : String(value).trim();
  }

  function searchText(value) {
    return text(value).toLocaleLowerCase("ko-KR");
  }

  function normalizePageSize(value) {
    const pageSize = Number(value);
    return Number.isInteger(pageSize) && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
  }

  function normalizeFilters(rawFilters) {
    const filters = rawFilters || {};
    return {
      search: text(filters.search),
      ship: text(filters.ship),
      team: text(filters.team),
      status: filters.status === undefined || filters.status === null ? DEFAULT_STATUS_FILTER : text(filters.status),
      date: text(filters.date).slice(0, 10),
    };
  }

  function activeFilterValue(value) {
    const normalized = text(value);
    return normalized && normalized !== "전체" && normalized.toLowerCase() !== "all" ? normalized : "";
  }

  function fieldsFor(options) {
    return Object.assign({}, DEFAULT_FIELDS, options && options.fields || {});
  }

  function resolveField(record, definition) {
    if (!record) return "";
    if (typeof definition === "function") return definition(record);
    const names = Array.isArray(definition) ? definition : [definition];
    for (const name of names) {
      if (name && record[name] !== null && record[name] !== undefined) return record[name];
    }
    return "";
  }

  function resolveFieldValues(record, definition) {
    if (!record) return [];
    if (typeof definition === "function") {
      const value = definition(record);
      return Array.isArray(value) ? value : [value];
    }
    const names = Array.isArray(definition) ? definition : [definition];
    return names.map((name) => name ? record[name] : "").filter((value) => value !== null && value !== undefined);
  }

  function recordId(record, options) {
    return text(resolveField(record, fieldsFor(options).id));
  }

  function dateOnly(value) {
    return text(value).slice(0, 10);
  }

  function includesFilter(value, query) {
    const needle = searchText(query);
    return !needle || searchText(value).includes(needle);
  }

  function recordMatchesFilters(record, rawFilters, options) {
    const filters = normalizeFilters(rawFilters);
    const fields = fieldsFor(options);
    const ship = activeFilterValue(filters.ship);
    const team = activeFilterValue(filters.team);
    const status = activeFilterValue(filters.status);
    const date = activeFilterValue(filters.date);
    const search = activeFilterValue(filters.search);
    if (ship && !includesFilter(resolveField(record, fields.ship), ship)) return false;
    if (team && !includesFilter(resolveField(record, fields.team), team)) return false;
    if (status && text(resolveField(record, fields.status)) !== status) return false;
    if (date && dateOnly(resolveField(record, fields.date)) !== date) return false;
    if (search) {
      const values = resolveFieldValues(record, fields.search);
      if (!values.some((value) => includesFilter(value, search))) return false;
    }
    return true;
  }

  function filterCollectionRecords(records, rawFilters, options) {
    const rows = Array.isArray(records) ? records : [];
    return rows.filter((record) => recordMatchesFilters(record, rawFilters, options));
  }

  function stableSortRecords(records, compareRecords) {
    const rows = Array.isArray(records) ? records : [];
    if (typeof compareRecords !== "function") return rows.slice();
    return rows.map((record, index) => ({ record, index })).sort((left, right) => {
      const result = Number(compareRecords(left.record, right.record)) || 0;
      return result || left.index - right.index;
    }).map((entry) => entry.record);
  }

  function base64UrlEncode(value) {
    const source = String(value);
    if (typeof Buffer !== "undefined") return Buffer.from(source, "utf8").toString("base64url");
    return btoa(unescape(encodeURIComponent(source))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function base64UrlDecode(value) {
    const source = String(value || "");
    if (typeof Buffer !== "undefined") return Buffer.from(source, "base64url").toString("utf8");
    const padded = source.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((source.length + 3) % 4);
    return decodeURIComponent(escape(atob(padded)));
  }

  function cursorSignature(filters, pageSize, cursorKey) {
    return [serializeCollectionFilters(filters), pageSize, text(cursorKey)].join("|");
  }

  function encodeCursor(payload) {
    return base64UrlEncode(JSON.stringify(payload));
  }

  function decodeCursor(cursor) {
    if (!cursor) return null;
    try {
      const payload = JSON.parse(base64UrlDecode(cursor));
      if (!payload || payload.v !== CURSOR_VERSION || !Number.isInteger(payload.p) || payload.p < 0) return null;
      return payload;
    } catch (error) {
      return null;
    }
  }

  function cursorForPosition(position, signature) {
    return encodeCursor({ v: CURSOR_VERSION, p: position, s: signature });
  }

  function serializeCollectionFilters(rawFilters) {
    const filters = normalizeFilters(rawFilters);
    const params = new URLSearchParams();
    ["search", "ship", "team", "status", "date"].forEach((key) => {
      if (filters[key]) params.set(key, filters[key]);
    });
    return params.toString();
  }

  function parseCollectionFilters(value) {
    const raw = typeof value === "string" ? value.replace(/^\?/, "") : value;
    const params = raw instanceof URLSearchParams ? raw : new URLSearchParams(raw || "");
    return normalizeFilters({
      search: params.get("search"),
      ship: params.get("ship"),
      team: params.get("team"),
      status: params.has("status") ? params.get("status") : DEFAULT_STATUS_FILTER,
      date: params.get("date"),
    });
  }

  function queryPagedCollection(records, rawOptions) {
    const options = rawOptions || {};
    const filters = normalizeFilters(options.filters);
    const pageSize = normalizePageSize(options.pageSize);
    const filteredRecords = filterCollectionRecords(records, filters, options);
    const sortedRecords = stableSortRecords(filteredRecords, options.compareRecords || options.compare);
    const signature = cursorSignature(filters, pageSize, options.cursorKey);
    const decodedCursor = decodeCursor(options.cursor);
    const cursorValid = !options.cursor || Boolean(decodedCursor && decodedCursor.s === signature);
    const requestedPosition = cursorValid && decodedCursor ? decodedCursor.p : 0;
    const position = requestedPosition < sortedRecords.length ? requestedPosition : 0;
    const items = sortedRecords.slice(position, position + pageSize);
    const hasPreviousPage = position > 0;
    const hasNextPage = position + items.length < sortedRecords.length;
    return {
      items,
      records: items,
      filters,
      pageSize,
      totalCount: Array.isArray(records) ? records.length : 0,
      resultCount: sortedRecords.length,
      filteredCount: sortedRecords.length,
      pageIndex: Math.floor(position / pageSize),
      cursor: options.cursor || null,
      cursorValid,
      previousCursor: hasPreviousPage ? cursorForPosition(Math.max(0, position - pageSize), signature) : null,
      nextCursor: hasNextPage ? cursorForPosition(position + pageSize, signature) : null,
      hasPreviousPage,
      hasNextPage,
    };
  }

  function createPagedCollectionState(rawState) {
    const state = rawState || {};
    const editingRecordId = state.editingRecordId || null;
    return {
      filters: normalizeFilters(state.filters),
      cursor: state.cursor || null,
      selectedRecordId: editingRecordId || state.selectedRecordId || null,
      editingRecordId,
    };
  }

  function setCollectionFilters(rawState, rawFilters) {
    const state = createPagedCollectionState(rawState);
    return Object.assign({}, state, { filters: normalizeFilters(rawFilters), cursor: null });
  }

  function setCollectionCursor(rawState, cursor) {
    const state = createPagedCollectionState(rawState);
    return Object.assign({}, state, { cursor: cursor || null });
  }

  function selectCollectionRecord(rawState, recordIdValue) {
    const state = createPagedCollectionState(rawState);
    const selectedRecordId = text(recordIdValue) || null;
    return Object.assign({}, state, { selectedRecordId, editingRecordId: null });
  }

  function openCollectionEditor(rawState, recordIdValue) {
    const state = createPagedCollectionState(rawState);
    const selectedRecordId = text(recordIdValue || state.selectedRecordId) || null;
    return Object.assign({}, state, { selectedRecordId, editingRecordId: selectedRecordId });
  }

  function closeCollectionEditor(rawState) {
    const state = createPagedCollectionState(rawState);
    return Object.assign({}, state, { editingRecordId: null });
  }

  function clearCollectionSelection(rawState) {
    const state = createPagedCollectionState(rawState);
    return Object.assign({}, state, { selectedRecordId: null, editingRecordId: null });
  }

  function findCollectionRecord(records, selectedRecordId, options) {
    const target = text(selectedRecordId);
    if (!target) return null;
    return (Array.isArray(records) ? records : []).find((record) => recordId(record, options) === target) || null;
  }

  function collectionDetail(records, rawState, options) {
    const state = createPagedCollectionState(rawState);
    const selectedRecord = findCollectionRecord(records, state.selectedRecordId, options);
    const editorRecord = state.editingRecordId ? findCollectionRecord(records, state.editingRecordId, options) : null;
    return {
      selectedRecord,
      editorRecord,
      isDetailOpen: Boolean(selectedRecord),
      isEditorOpen: Boolean(editorRecord),
    };
  }

  function buildPagedCollection(records, rawOptions) {
    const options = rawOptions || {};
    const state = createPagedCollectionState(options.state || { filters: options.filters, cursor: options.cursor });
    const page = queryPagedCollection(records, Object.assign({}, options, { filters: state.filters, cursor: state.cursor }));
    return Object.assign({}, page, collectionDetail(records, state, options), { state });
  }

  return {
    DEFAULT_PAGE_SIZE,
    DEFAULT_STATUS_FILTER,
    DEFAULT_FILTERS,
    normalizeFilters,
    serializeCollectionFilters,
    parseCollectionFilters,
    recordId,
    recordMatchesFilters,
    filterCollectionRecords,
    stableSortRecords,
    encodeCursor,
    decodeCursor,
    queryPagedCollection,
    createPagedCollectionState,
    setCollectionFilters,
    setCollectionCursor,
    selectCollectionRecord,
    openCollectionEditor,
    closeCollectionEditor,
    clearCollectionSelection,
    findCollectionRecord,
    collectionDetail,
    buildPagedCollection,
  };
}));
