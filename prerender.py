#!/usr/bin/env python3
"""
Post-build prerender.

Renders key public routes from the freshly built `dist/` folder and saves the
rendered HTML as crawler-friendly snapshots in `public/<route>/index.html`.

Important: the saved snapshots must NOT reference hashed build assets, because
those file names change on every build and the snapshots are committed to the
repo. Instead each snapshot ships a tiny bootstrap that reads the current
asset URLs from the freshly built root `/index.html` at runtime.

Usage:  bunx vite build && python3 prerender.py
"""

import asyncio
import http.server
import functools
import os
import re
import socketserver
import threading

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, "dist")
PUBLIC = os.path.join(ROOT, "public")
PORT = 4173

ROUTES = [
    "/pricing",
    "/blog",
    "/blog/how-ai-recognises-patterns-tenancy-agreements",
    "/contact",
    "/press",
    "/founder",
    "/learn",
    "/learn/faq",
    "/learn/glossary",
    "/learn/case-studies",
    "/learn/case-studies/mixed-use-owner",
    "/learn/case-studies/historic-leases",
    "/learn/what-is-lease-management-software",
    "/learn/how-much-does-property-management-software-cost",
    "/learn/best-property-management-software-uk",
    "/lease-management-software",
    "/property-management-software",
    "/property-portfolio-software",
    "/ai-lease-abstraction",
    "/privacy-policy",
    "/data-protection",
    "/refund-policy",
]

BOOTSTRAP = """<script>
/* Load the current build assets from the root document so this snapshot never
   goes stale when file hashes change. */
(function () {
  fetch('/', { headers: { 'accept': 'text/html' } })
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      doc.querySelectorAll('link[rel="stylesheet"]').forEach(function (l) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = l.getAttribute('href');
        document.head.appendChild(link);
      });
      doc.querySelectorAll('script[type="module"][src]').forEach(function (s) {
        var script = document.createElement('script');
        script.type = 'module';
        script.crossOrigin = 'anonymous';
        script.src = s.getAttribute('src');
        document.head.appendChild(script);
      });
    })
    .catch(function () {});
})();
</script>"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = path.split("?")[0].split("#")[0]
        # Always render app routes through the fresh Vite entry point. Public
        # snapshots are copied into dist during builds and must never become
        # the input for their own next generation.
        if path.rstrip("/") in ROUTES:
            return os.path.join(DIST, "index.html")
        full = os.path.join(DIST, path.lstrip("/"))
        if os.path.isfile(full):
            return full
        index = os.path.join(full, "index.html")
        if os.path.isfile(index):
            return index
        return os.path.join(DIST, "index.html")

    def log_message(self, *args):
        pass


def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), functools.partial(Handler))
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def strip_hashed_assets(html: str) -> str:
    html = re.sub(r'<link[^>]+rel="modulepreload"[^>]*>', "", html)
    html = re.sub(r'<link[^>]+href="/assets/[^"]+\.css"[^>]*>', "", html)
    html = re.sub(r'<script[^>]+src="/assets/[^"]+\.js"[^>]*>\s*</script>', "", html)
    return html.replace("</head>", BOOTSTRAP + "\n</head>", 1)


# Head keys that pages manage per-route via Helmet. The rendered DOM contains
# both the static index.html tag and Helmet's copy (marked data-rh="true");
# keep only Helmet's so crawlers never see duplicates.
HELMET_KEYS = [
    r'name="description"',
    r'name="twitter:card"',
    r'name="twitter:title"',
    r'name="twitter:description"',
    r'property="og:title"',
    r'property="og:description"',
    r'property="og:url"',
    r'property="og:type"',
]


def dedupe_helmet_head(html: str) -> str:
    for key in HELMET_KEYS:
        pattern = r'<meta[^>]*' + key + r'[^>]*>'
        tags = re.findall(pattern, html)
        helmet_tags = [t for t in tags if 'data-rh="true"' in t]
        if helmet_tags:
            for t in tags:
                if 'data-rh="true"' not in t:
                    html = html.replace(t, "", 1)
    canonical = r'<link[^>]+rel="canonical"[^>]*>'
    canonical_tags = re.findall(canonical, html)
    if any('data-rh="true"' in t for t in canonical_tags):
        for t in canonical_tags:
            if 'data-rh="true"' not in t:
                html = html.replace(t, "", 1)
    return html


async def main():
    from playwright.async_api import async_playwright

    httpd = start_server()
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(viewport={"width": 1280, "height": 1800})
            for route in ROUTES:
                page = await context.new_page()
                await page.goto(f"http://127.0.0.1:{PORT}{route}", wait_until="networkidle", timeout=60000)
                await page.wait_for_timeout(1200)
                html = dedupe_helmet_head(strip_hashed_assets(await page.content()))
                out_dir = os.path.join(PUBLIC, route.strip("/"))
                os.makedirs(out_dir, exist_ok=True)
                with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
                    f.write(html)
                print(f"  saved {route} ({len(html) / 1024:.1f} KB)")
                await page.close()
            await browser.close()
    finally:
        httpd.shutdown()
    print(f"\nPrerendered {len(ROUTES)} routes.")


asyncio.run(main())
