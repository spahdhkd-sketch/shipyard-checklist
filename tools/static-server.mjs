import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.argv[2] || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

// Single source of truth: serve the same CSP locally that Vercel sends in
// production (vercel.json "/(.*)" headers). Inline <meta> CSP was removed.
const csp = (() => {
  try {
    const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
    for (const rule of vercel.headers || []) {
      const hit = (rule.headers || []).find((h) => h.key === "Content-Security-Policy");
      if (hit) return hit.value;
    }
  } catch {}
  return null;
})();

createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = normalize(join(root, decodeURIComponent(requested)));
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  const headers = { "content-type": types[extname(file)] || "application/octet-stream" };
  if (csp && extname(file) === ".html") headers["content-security-policy"] = csp;
  res.writeHead(200, headers);
  createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${port}`);
});
