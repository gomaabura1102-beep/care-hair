const http = require("http");
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "out");
const port = Number(process.env.PORT || 3000);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8"
};

function resolveFile(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const normalizedPath = cleanPath === "/" ? "/index.html" : cleanPath;
  const directPath = path.join(outDir, normalizedPath);

  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    return directPath;
  }

  const htmlPath = path.join(outDir, `${normalizedPath}.html`);
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
    return htmlPath;
  }

  const nestedIndexPath = path.join(outDir, normalizedPath, "index.html");
  if (fs.existsSync(nestedIndexPath) && fs.statSync(nestedIndexPath).isFile()) {
    return nestedIndexPath;
  }

  return path.join(outDir, "404.html");
}

http
  .createServer((req, res) => {
    const filePath = resolveFile(req.url || "/");
    const ext = path.extname(filePath);
    res.writeHead(fs.existsSync(filePath) ? 200 : 404, {
      "Content-Type": contentTypes[ext] || "application/octet-stream"
    });
    fs.createReadStream(filePath).pipe(res);
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Care Hair preview: http://localhost:${port}`);
  });
