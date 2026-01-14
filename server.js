const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const ROOT_DIR = __dirname;

const server = http.createServer((req, res) => {
  const parsedUrl = require('url').parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Servir el archivo .txt
  if (req.method === 'GET' && pathname === '/colores de ruleta.txt') {
    const filePath = path.join(ROOT_DIR, 'colores de ruleta.txt');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });
    return;
  }

  // Endpoint para actualizar pesos
  if (req.method === 'POST' && pathname === '/update-weights') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const weights = JSON.parse(body);
        const content = Object.entries(weights).map(([num, prob]) => `${num}:${prob}`).join('\n');
        fs.writeFileSync(path.join(ROOT_DIR, 'colores de ruleta.txt'), content);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Para otras rutas, 404
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});