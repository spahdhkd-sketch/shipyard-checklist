#!/usr/bin/env node
// Per-file asset minifier (no bundling). Keeps load order and global structure
// intact: each source file is minified 1:1 into assets/dist/ with a .min suffix.
// References in HTML/SW are intentionally NOT changed here — this only produces
// build artifacts so we can later opt into serving them.
//
// Usage: node tools/build-assets.mjs   (or: npm run build)

import { build } from "esbuild";
import { mkdir, readdir, stat, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC_DIRS = [
  { dir: "assets/js", ext: ".js", loader: "js", out: "assets/dist/js" },
  { dir: "assets/css", ext: ".css", loader: "css", out: "assets/dist/css" },
];
// Skip files that are already minified or are vendored bundles.
const SKIP = [/\.min\./, /[\\/]vendor[\\/]/];

function kb(n) { return `${(n / 1024).toFixed(1)} KB`; }

async function listFiles(dir, ext) {
  const abs = path.join(root, dir);
  if (!existsSync(abs)) return [];
  const out = [];
  for (const name of await readdir(abs)) {
    const full = path.join(abs, name);
    if ((await stat(full)).isFile() && name.endsWith(ext) && !SKIP.some((re) => re.test(full))) {
      out.push(full);
    }
  }
  return out.sort();
}

async function run() {
  const distRoot = path.join(root, "assets/dist");
  if (existsSync(distRoot)) await rm(distRoot, { recursive: true, force: true });

  let totalBefore = 0, totalAfter = 0;
  const rows = [];

  for (const { dir, ext, loader, out } of SRC_DIRS) {
    const files = await listFiles(dir, ext);
    if (!files.length) continue;
    await mkdir(path.join(root, out), { recursive: true });

    for (const file of files) {
      const before = (await stat(file)).size;
      const base = path.basename(file, ext);
      const outfile = path.join(root, out, `${base}.min${ext}`);
      await build({
        entryPoints: [file],
        outfile,
        minify: true,
        bundle: false,
        loader: { [ext]: loader },
        legalComments: "none",
        logLevel: "warning",
      });
      const after = (await stat(outfile)).size;
      totalBefore += before; totalAfter += after;
      rows.push([path.relative(root, file), before, after]);
    }
  }

  rows.sort((a, b) => b[1] - a[1]);
  console.log("\n  source -> minified");
  console.log("  " + "-".repeat(58));
  for (const [name, b, a] of rows) {
    const pct = b ? (100 * (1 - a / b)).toFixed(0) : "0";
    console.log(`  ${name.padEnd(36)} ${kb(b).padStart(9)} -> ${kb(a).padStart(9)}  (-${pct}%)`);
  }
  console.log("  " + "-".repeat(58));
  const pct = totalBefore ? (100 * (1 - totalAfter / totalBefore)).toFixed(1) : "0";
  console.log(`  ${"TOTAL".padEnd(36)} ${kb(totalBefore).padStart(9)} -> ${kb(totalAfter).padStart(9)}  (-${pct}%)`);
  console.log(`\n  Artifacts written to assets/dist/ (not committed). References unchanged.\n`);
}

run().catch((err) => { console.error(err); process.exit(1); });
