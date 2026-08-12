// Tiny static server for local preview. Not part of the build.
// Run:  node test-preview.js
// Then open http://localhost:4173/
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 4173;
const ROOT = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4':  'video/mp4',
  '.json': 'application/json; charset=utf-8',
  '.md':   'text/markdown; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  let url = decodeURI(req.url.split('?')[0]);
  if (url === '/' || url === '') url = '/index.html';
  const filePath = path.join(ROOT, url);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('forbidden'); return; }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404); res.end('not found: ' + url); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type':  MIME[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`▶ preview:  http://localhost:${PORT}/`);
  console.log(`▶ root:     ${ROOT}`);
});
