const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const ROOT_DIR = __dirname;

// Contenido inicial del archivo (hardcodeado para Vercel)
let weightsContent = `0:2.7027027027027026
1:2.7027027027027026
2:2.7027027027027026
3:2.7027027027027026
4:2.7027027027027026
5:2.7027027027027026
6:2.7027027027027026
7:2.7027027027027026
8:2.7027027027027026
9:2.7027027027027026
10:2.7027027027027026
11:2.7027027027027026
12:2.7027027027027026
13:2.7027027027027026
14:2.7027027027027026
15:2.7027027027027026
16:2.7027027027027026
17:2.7027027027027026
18:2.7027027027027026
19:2.7027027027027026
20:2.7027027027027026
21:2.7027027027027026
22:2.7027027027027026
23:2.7027027027027026
24:2.7027027027027026
25:2.7027027027027026
26:2.7027027027027026
27:2.7027027027027026
28:2.7027027027027026
29:2.7027027027027026
30:2.7027027027027026
31:2.7027027027027026
32:2.7027027027027026
33:2.7027027027027026
34:2.7027027027027026
35:2.7027027027027026
36:2.7027027027027026`;

const server = http.createServer((req, res) => {
  const parsedUrl = require('url').parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Servir el contenido del .txt
  if (req.method === 'GET' && pathname === '/colores%20de%20ruleta.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(weightsContent);
    return;
  }

  // Endpoint para actualizar
  if (req.method === 'POST' && pathname === '/update-weights') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const weights = JSON.parse(body);
        weightsContent = Object.entries(weights).map(([num, prob]) => `${num}:${prob}`).join('\n');
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