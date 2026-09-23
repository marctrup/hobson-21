#!/usr/bin/env bash
#
# Refresh everything search engines and AI chat crawlers read.
#
# Run this after ANY content, copy, metadata or structured-data change and
# before publishing:
#
#     bun run seo:update
#
# Steps:
#   1. build the site
#   2. regenerate the crawler snapshots in public/<route>/index.html
#   3. stamp today's date into sitemap.xml <lastmod> entries for changed pages
#   4. verify snapshots + sitemap (titles, canonicals, one h1, alt text, ...)
#   5. verify GEO/AEO signals (structured data, answer-first blocks, Q&A
#      markup, freshness, llms.txt, AI crawler access)
#
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> 1/5 Building site"
bunx vite build

echo "==> 2/5 Regenerating crawler snapshots"
python3 prerender.py

echo "==> 3/5 Refreshing sitemap lastmod dates"
python3 - <<'PY'
import datetime, re, pathlib
p = pathlib.Path("public/sitemap.xml")
today = datetime.date.today().isoformat()
xml = p.read_text(encoding="utf-8")
new = re.sub(r"<lastmod>\d{4}-\d{2}-\d{2}</lastmod>",
             f"<lastmod>{today}</lastmod>", xml)
if new != xml:
    p.write_text(new, encoding="utf-8")
    print(f"    sitemap lastmod set to {today}")
else:
    print("    sitemap lastmod already current")
PY

echo "==> 4/5 Verifying crawler output"
python3 scripts/verify-seo.py

echo "==> 5/5 Verifying GEO/AEO signals for AI assistants"
python3 scripts/verify-geo-aeo.py

echo
echo "Done. Publish the project so crawlers pick up the changes,"
echo "then resubmit the sitemap in Google Search Console if routes changed."
