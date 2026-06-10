const assert = require("node:assert");
const xlsx = require("../assets/js/xlsx-helpers.js");

// xmlEscape
assert.strictEqual(xlsx.xmlEscape('a<b>&"c'), "a&lt;b&gt;&amp;&quot;c");
assert.strictEqual(xlsx.xmlEscape(null), "");

// excel column name/index roundtrip
assert.strictEqual(xlsx.excelColumnName(0), "A");
assert.strictEqual(xlsx.excelColumnName(25), "Z");
assert.strictEqual(xlsx.excelColumnName(26), "AA");
assert.strictEqual(xlsx.excelColumnIndex("A"), 0);
assert.strictEqual(xlsx.excelColumnIndex("AA"), 26);
for (let i = 0; i < 200; i += 7) {
  assert.strictEqual(xlsx.excelColumnIndex(xlsx.excelColumnName(i)), i);
}

// crc32 known vector
const ascii = (text) => new Uint8Array([...text].map((ch) => ch.charCodeAt(0)));
assert.strictEqual(xlsx.crc32(ascii("123456789")), 0xcbf43926);

// worksheetXml: header style + inlineStr/number cells
const sheet = xlsx.worksheetXml(["이름", "수량"], [{ "이름": "용접기 <A>", "수량": 3 }]);
assert.match(sheet, /<row r="1"><c r="A1" t="inlineStr" s="1">/);
assert.match(sheet, /용접기 &lt;A&gt;/);
assert.match(sheet, /<c r="B2"><v>3<\/v><\/c>/);
assert.match(sheet, /<dimension ref="A1:B2"\/>/);

// createZip -> unzipXlsxEntries roundtrip (STORED entries, no inflate needed)
(async () => {
  const files = [
    { name: "hello.txt", content: "안녕하세요" },
    { name: "dir/data.xml", content: "<x>1</x>" },
  ];
  const zipped = xlsx.createZip(files);
  assert.ok(zipped instanceof Uint8Array && zipped.length > 0);
  const entries = await xlsx.unzipXlsxEntries(zipped.buffer.slice(zipped.byteOffset, zipped.byteOffset + zipped.byteLength));
  assert.deepStrictEqual(Object.keys(entries).sort(), ["dir/data.xml", "hello.txt"]);
  assert.strictEqual(xlsx.zipText(entries["hello.txt"]), "안녕하세요");
  assert.strictEqual(xlsx.zipText(entries["dir/data.xml"]), "<x>1</x>");

  // createXlsxBlob: correct MIME + valid zip with expected parts
  const blob = xlsx.createXlsxBlob("자재", ["품명"], [{ "품명": "볼트" }]);
  assert.strictEqual(blob.type, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  const parts = await xlsx.unzipXlsxEntries(await blob.arrayBuffer());
  ["[Content_Types].xml", "_rels/.rels", "xl/workbook.xml", "xl/styles.xml", "xl/worksheets/sheet1.xml"].forEach((name) => {
    assert.ok(parts[name], `${name} should exist in xlsx`);
  });
  assert.match(xlsx.zipText(parts["xl/workbook.xml"]), /name="자재"/);
  assert.match(xlsx.zipText(parts["xl/worksheets/sheet1.xml"]), /볼트/);
  console.log("xlsx helper tests passed");
})().catch((error) => { console.error(error); process.exit(1); });
