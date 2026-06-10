(function attachXlsxHelpers(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardXlsxHelpers = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildXlsxHelpers() {
  // XLSX 읽기/쓰기 코덱 (app-v2.js에서 추출).
  // 순수 데이터 변환만 담당: state/document/toast 의존 없음.
  // 쓰기: worksheetXml -> createZip(STORED) -> createXlsxBlob
  // 읽기: unzipXlsxEntries -> parseSharedStrings/worksheetObjectsFromXml(DOMParser 필요) -> readXlsxObjects
    function xmlEscape(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function excelColumnName(index) {
      let value = index + 1;
      let name = "";
      while (value > 0) {
        const mod = (value - 1) % 26;
        name = String.fromCharCode(65 + mod) + name;
        value = Math.floor((value - mod) / 26);
      }
      return name;
    }

    function excelCellXml(value, rowIndex, columnIndex, style = "") {
      const ref = `${excelColumnName(columnIndex)}${rowIndex + 1}`;
      if (typeof value === "number" && Number.isFinite(value)) {
        return `<c r="${ref}"${style}><v>${value}</v></c>`;
      }
      return `<c r="${ref}" t="inlineStr"${style}><is><t>${xmlEscape(value)}</t></is></c>`;
    }

    function worksheetXml(headers, rows) {
      const allRows = [headers, ...rows.map((row) => headers.map((key) => row[key] ?? ""))];
      const rowXml = allRows.map((values, rowIndex) => {
        const style = rowIndex === 0 ? ' s="1"' : "";
        return `<row r="${rowIndex + 1}">${values.map((value, columnIndex) => excelCellXml(value, rowIndex, columnIndex, style)).join("")}</row>`;
      }).join("");
      const dimension = `A1:${excelColumnName(Math.max(headers.length - 1, 0))}${Math.max(allRows.length, 1)}`;
      const cols = headers.map((header, index) => `<col min="${index + 1}" max="${index + 1}" width="${Math.min(Math.max(String(header).length + 6, 12), 34)}" customWidth="1"/>`).join("");
      return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="${dimension}"/>
  <cols>${cols}</cols>
  <sheetData>${rowXml}</sheetData>
</worksheet>`;
    }

    function excelColumnIndex(name) {
      return String(name || "").toUpperCase().split("").reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
    }

    function zipText(bytes) {
      return new TextDecoder("utf-8").decode(bytes);
    }

    async function inflateZipBytes(bytes) {
      if (typeof DecompressionStream !== "function") throw new Error("압축된 XLSX 파일을 이 브라우저에서 해제할 수 없습니다.");
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
      return new Uint8Array(await new Response(stream).arrayBuffer());
    }

    function findZipEnd(view) {
      for (let offset = view.byteLength - 22; offset >= 0; offset -= 1) {
        if (view.getUint32(offset, true) === 0x06054b50) return offset;
      }
      return -1;
    }

    async function unzipXlsxEntries(buffer) {
      const bytes = new Uint8Array(buffer);
      const view = new DataView(buffer);
      const endOffset = findZipEnd(view);
      if (endOffset < 0) throw new Error("XLSX 파일 구조를 읽을 수 없습니다.");
      const entryCount = view.getUint16(endOffset + 10, true);
      let centralOffset = view.getUint32(endOffset + 16, true);
      const entries = {};
      for (let index = 0; index < entryCount; index += 1) {
        if (view.getUint32(centralOffset, true) !== 0x02014b50) break;
        const method = view.getUint16(centralOffset + 10, true);
        const compressedSize = view.getUint32(centralOffset + 20, true);
        const nameLength = view.getUint16(centralOffset + 28, true);
        const extraLength = view.getUint16(centralOffset + 30, true);
        const commentLength = view.getUint16(centralOffset + 32, true);
        const localOffset = view.getUint32(centralOffset + 42, true);
        const name = zipText(bytes.slice(centralOffset + 46, centralOffset + 46 + nameLength));
        const localNameLength = view.getUint16(localOffset + 26, true);
        const localExtraLength = view.getUint16(localOffset + 28, true);
        const dataStart = localOffset + 30 + localNameLength + localExtraLength;
        const compressed = bytes.slice(dataStart, dataStart + compressedSize);
        if (method === 0) entries[name] = compressed;
        else if (method === 8) entries[name] = await inflateZipBytes(compressed);
        else throw new Error("지원하지 않는 XLSX 압축 방식입니다.");
        centralOffset += 46 + nameLength + extraLength + commentLength;
      }
      return entries;
    }

    function parseSharedStrings(xmlText) {
      if (!xmlText) return [];
      const doc = new DOMParser().parseFromString(xmlText, "application/xml");
      return Array.from(doc.getElementsByTagName("si")).map((item) =>
        Array.from(item.getElementsByTagName("t")).map((node) => node.textContent || "").join("")
      );
    }

    function readWorksheetCell(cell, sharedStrings) {
      const type = cell.getAttribute("t") || "";
      if (type === "inlineStr") return Array.from(cell.getElementsByTagName("t")).map((node) => node.textContent || "").join("");
      const raw = cell.getElementsByTagName("v")[0]?.textContent || "";
      if (type === "s") return sharedStrings[Number(raw)] || "";
      return raw;
    }

    function worksheetObjectsFromXml(xmlText, sharedStrings = []) {
      const doc = new DOMParser().parseFromString(xmlText, "application/xml");
      const rows = Array.from(doc.getElementsByTagName("row")).map((row) => {
        const values = [];
        Array.from(row.getElementsByTagName("c")).forEach((cell) => {
          const ref = cell.getAttribute("r") || "";
          const column = excelColumnIndex(ref.replace(/\d+/g, ""));
          if (column >= 0) values[column] = readWorksheetCell(cell, sharedStrings).trim();
        });
        return values.map((value) => value || "");
      }).filter((row) => row.some(Boolean));
      if (rows.length < 2) return [];
      const headers = rows[0].map((header) => String(header || "").trim());
      return rows.slice(1).map((row) => headers.reduce((object, header, index) => {
        if (header) object[header] = row[index] || "";
        return object;
      }, {}));
    }

    async function readXlsxObjects(file) {
      const entries = await unzipXlsxEntries(await file.arrayBuffer());
      const sheetName = Object.keys(entries).find((name) => name === "xl/worksheets/sheet1.xml") ||
        Object.keys(entries).find((name) => name.startsWith("xl/worksheets/") && name.endsWith(".xml"));
      if (!sheetName) throw new Error("첫 번째 시트를 찾을 수 없습니다.");
      const sharedStrings = parseSharedStrings(entries["xl/sharedStrings.xml"] ? zipText(entries["xl/sharedStrings.xml"]) : "");
      return worksheetObjectsFromXml(zipText(entries[sheetName]), sharedStrings);
    }

    function crc32(bytes) {
      if (!crc32.table) {
        crc32.table = Array.from({ length: 256 }, (_, index) => {
          let value = index;
          for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
          return value >>> 0;
        });
      }
      let crc = 0xffffffff;
      bytes.forEach((byte) => { crc = crc32.table[(crc ^ byte) & 0xff] ^ (crc >>> 8); });
      return (crc ^ 0xffffffff) >>> 0;
    }

    function uint16(value) {
      return [value & 0xff, (value >>> 8) & 0xff];
    }

    function uint32(value) {
      return [value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff];
    }

    function concatBytes(parts) {
      const size = parts.reduce((sum, part) => sum + part.length, 0);
      const output = new Uint8Array(size);
      let offset = 0;
      parts.forEach((part) => {
        output.set(part, offset);
        offset += part.length;
      });
      return output;
    }

    function zipEntryBytes(content, encoder) {
      if (content instanceof Uint8Array) return content;
      if (content instanceof ArrayBuffer) return new Uint8Array(content);
      return encoder.encode(String(content ?? ""));
    }

    function createZip(files) {
      const encoder = new TextEncoder();
      const localParts = [];
      const centralParts = [];
      let offset = 0;
      files.forEach((file) => {
        const name = encoder.encode(file.name);
        const data = zipEntryBytes(file.content, encoder);
        const crc = crc32(data);
        const localHeader = new Uint8Array([
          ...uint32(0x04034b50), ...uint16(20), ...uint16(0), ...uint16(0), ...uint16(0), ...uint16(0),
          ...uint32(crc), ...uint32(data.length), ...uint32(data.length), ...uint16(name.length), ...uint16(0),
        ]);
        localParts.push(localHeader, name, data);
        const centralHeader = new Uint8Array([
          ...uint32(0x02014b50), ...uint16(20), ...uint16(20), ...uint16(0), ...uint16(0), ...uint16(0), ...uint16(0),
          ...uint32(crc), ...uint32(data.length), ...uint32(data.length), ...uint16(name.length), ...uint16(0), ...uint16(0),
          ...uint16(0), ...uint16(0), ...uint32(0), ...uint32(offset),
        ]);
        centralParts.push(centralHeader, name);
        offset += localHeader.length + name.length + data.length;
      });
      const central = concatBytes(centralParts);
      const locals = concatBytes(localParts);
      const end = new Uint8Array([
        ...uint32(0x06054b50), ...uint16(0), ...uint16(0), ...uint16(files.length), ...uint16(files.length),
        ...uint32(central.length), ...uint32(locals.length), ...uint16(0),
      ]);
      return concatBytes([locals, central, end]);
    }

    function createXlsxBlob(sheetName, headers, rows) {
      const safeSheetName = xmlEscape(String(sheetName || "Data").slice(0, 31));
      const files = [
        {
          name: "[Content_Types].xml",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
        },
        {
          name: "_rels/.rels",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
        },
        {
          name: "xl/workbook.xml",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="${safeSheetName}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`,
        },
        {
          name: "xl/_rels/workbook.xml.rels",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
        },
        {
          name: "xl/styles.xml",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`,
        },
        { name: "xl/worksheets/sheet1.xml", content: worksheetXml(headers, rows) },
      ];
      return new Blob([createZip(files)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    }

  return {
    xmlEscape,
    excelColumnName,
    excelCellXml,
    worksheetXml,
    excelColumnIndex,
    zipText,
    inflateZipBytes,
    findZipEnd,
    unzipXlsxEntries,
    parseSharedStrings,
    readWorksheetCell,
    worksheetObjectsFromXml,
    readXlsxObjects,
    crc32,
    createZip,
    createXlsxBlob,
  };
}));
