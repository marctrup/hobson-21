/**
 * Post-build prerender script
 * Launches a local server, visits key routes with Puppeteer,
 * and saves the rendered HTML as static files.
 */
const puppeteer = require('puppeteer');
const { createServer } = require('http');
const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { join, extname } = require('path');

const DIST = join(__dirname, 'dist');
const PORT = 4173;
const ROUTES = [
  '/',
  '/features',
  '/in-practice',
  '/pricing',
  '/blog',
  '/learn/faq',
  '/contact',
];

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.wasm': 'application/wasm',
  '.pdf': 'application/pdf',
  '.webp': 'image/webp',
};

// Simple static file server that serves dist/ and falls back to index.html for SPA routes
function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let url = req.url.split('?')[0];
      let filePath = join(DIST, url);
      
      // Try the exact path first
      if (existsSync(filePath) && !filePath.endsWith('/')) {
        const ext = extname(filePath);
        const mime = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(readFileSync(filePath));
        return;
      }
      
      // Try with index.html appended
      const indexPath = join(filePath, 'index.html');
      if (existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(readFileSync(indexPath));
        return;
      }
      
      // Fallback to SPA index.html
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(readFileSync(join(DIST, 'index.html')));
    });
    
    server.listen(PORT, () => {
      console.log(`Static server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function prerender() {
  console.log('\n🔍 Starting prerender...\n');
  
  const server = await startServer();
  
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${route}`;
    console.log(`  Rendering ${route}...`);
    
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait a bit extra for React Helmet to update <head>
    await page.waitForTimeout(2000);
    
    const html = await page.content();
    
    // Determine output path
    const outDir = route === '/' ? DIST : join(DIST, route);
    const outFile = join(outDir, 'index.html');
    
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    
    writeFileSync(outFile, html, 'utf-8');
    console.log(`  ✅ Saved ${outFile} (${(html.length / 1024).toFixed(1)} KB)`);
    
    await page.close();
  }

  await browser.close();
  server.close();
  
  console.log(`\n✅ Prerendered ${ROUTES.length} routes successfully!\n`);
}

prerender().catch((err) => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});
