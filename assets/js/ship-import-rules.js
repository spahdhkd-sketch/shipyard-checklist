(function attachShipImportRules(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardShipImportRules = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildShipImportRules() {
  // 호선 엑셀 가져오기 규칙 (app-v2.js에서 추출).
  // 순수 변환/검증만 담당: 헤더 별칭 매칭, 엑셀 직렬일 변환, 날짜 정규화,
  // 행 정규화(normalizeShipNo/normalizeShipStageInput는 deps로 주입), 날짜 충돌 검출.
  const pad2 = (value) => String(value).padStart(2, "0");

  function dateOnly(value) {
    return String(value || "").slice(0, 10);
  }

    const SHIP_IMPORT_DATE_FIELDS = [
      ["lcDate", "L/C", ["L/C", "LC", "L C"]],
      ["stDate", "S/T", ["S/T", "ST", "S T"]],
      ["clDate", "C/L", ["C/L", "CL", "C L"]],
      ["dlDate", "D/L", ["D/L", "DL", "D L"]],
    ];

    function importHeaderKey(value) {
      return String(value || "").trim().replace(/\s+/g, "").toLowerCase();
    }

    function importCell(row, aliases) {
      const wanted = new Set(aliases.map(importHeaderKey));
      const found = Object.entries(row).find(([key]) => wanted.has(importHeaderKey(key)));
      return String(found?.[1] || "").trim();
    }

    function excelSerialToDate(value) {
      const serial = Number(value);
      if (!Number.isFinite(serial) || serial < 20000 || serial > 80000) return "";
      const date = new Date(Math.round((serial - 25569) * 86400000));
      return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
    }

    function normalizeImportDate(value) {
      const raw = String(value || "").trim();
      if (!raw) return "";
      const serialDate = excelSerialToDate(raw);
      if (serialDate) return serialDate;
      const match = raw.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
      if (!match) return "";
      return `${match[1]}-${pad2(match[2])}-${pad2(match[3])}`;
    }

    function normalizeShipImportRow(row, deps = {}) {
      const no = deps.normalizeShipNo(importCell(row, ["호선명", "호선번호", "호선", "shipNo", "ship"]));
      if (!no) return null;
      const imported = {
        no,
        type: importCell(row, ["선종", "shipType", "type"]),
        processStage: deps.normalizeShipStageInput(importCell(row, ["상태", "호선상태", "공정상태", "현재상태", "stage", "processStage"])),
      };
      SHIP_IMPORT_DATE_FIELDS.forEach(([field, , aliases]) => {
        imported[field] = normalizeImportDate(importCell(row, aliases));
      });
      return imported;
    }

    function shipImportDateConflicts(importedRows, ships = []) {
      const existingByNo = new Map(ships.map((ship) => [ship.no, ship]));
      return importedRows.flatMap((imported) => {
        const existing = existingByNo.get(imported.no);
        if (!existing) return [];
        return SHIP_IMPORT_DATE_FIELDS
          .filter(([field]) => existing[field] && imported[field] && dateOnly(existing[field]) !== imported[field])
          .map(([field, label]) => ({ no: imported.no, label, before: dateOnly(existing[field]), after: imported[field] }));
      });
    }

  return {
    SHIP_IMPORT_DATE_FIELDS,
    importHeaderKey,
    importCell,
    excelSerialToDate,
    normalizeImportDate,
    normalizeShipImportRow,
    shipImportDateConflicts,
  };
}));
