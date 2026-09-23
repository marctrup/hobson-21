#!/usr/bin/env python3
"""
Verify the crawler snapshots in public/<route>/index.html.

Checks, per snapshot:
  - exactly one <title>, <meta name="description"> and <link rel="canonical">
  - title length <= 70 characters
  - canonical points at https://hobsonschoice.ai
  - exactly one <h1>
  - every <img> has a non-empty alt attribute

Plus: every prerendered route appears in public/sitemap.xml.

Exit code 0 = all good, 1 = problems found (they are printed).
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
APEX = "https://hobsonschoice.ai"
MAX_TITLE = 70

sys.path.insert(0, ROOT)
from prerender import ROUTES  # noqa: E402

problems = []


def check_snapshot(route: str) -> None:
    path = os.path.join(PUBLIC, route.strip("/"), "index.html")
    if not os.path.exists(path):
        problems.append(f"{route}: snapshot missing ({path})")
        return

    with open(path, encoding="utf-8") as fh:
        html = fh.read()

    titles = re.findall(r"<title[^>]*>(.*?)</title>", html, re.S | re.I)
    descs = re.findall(
        r'<meta[^>]+name=["\']description["\'][^>]*>', html, re.I)
    canons = re.findall(
        r'<link[^>]+rel=["\']canonical["\'][^>]*>', html, re.I)
    h1s = re.findall(r"<h1[\s>]", html, re.I)

    if len(titles) != 1:
        problems.append(f"{route}: expected 1 <title>, found {len(titles)}")
    elif len(titles[0].strip()) > MAX_TITLE:
        problems.append(
            f"{route}: title is {len(titles[0].strip())} chars (max {MAX_TITLE})")

    if len(descs) != 1:
        problems.append(
            f"{route}: expected 1 meta description, found {len(descs)}")

    if len(canons) != 1:
        problems.append(f"{route}: expected 1 canonical, found {len(canons)}")
    else:
        href = re.search(r'href=["\']([^"\']+)["\']', canons[0])
        if not href or not href.group(1).startswith(APEX):
            problems.append(
                f"{route}: canonical does not point at {APEX} ({canons[0]})")

    if len(h1s) != 1:
        problems.append(f"{route}: expected 1 <h1>, found {len(h1s)}")

    for img in re.findall(r"<img\b[^>]*>", html, re.I):
        alt = re.search(r'alt=["\']([^"\']*)["\']', img, re.I)
        if not alt or not alt.group(1).strip():
            problems.append(f"{route}: image without alt text -> {img[:90]}")


def check_sitemap() -> None:
    path = os.path.join(PUBLIC, "sitemap.xml")
    if not os.path.exists(path):
        problems.append("sitemap.xml is missing")
        return
    with open(path, encoding="utf-8") as fh:
        sitemap = fh.read()
    for route in ROUTES:
        if f"{APEX}{route}<" not in sitemap and f"{APEX}{route}/" not in sitemap:
            problems.append(f"{route}: not listed in sitemap.xml")


for r in ROUTES:
    check_snapshot(r)
check_sitemap()

if problems:
    print(f"\nSEO verification found {len(problems)} problem(s):\n")
    for p in problems:
        print("  x " + p)
    print()
    sys.exit(1)

print(f"SEO verification passed: {len(ROUTES)} snapshots + sitemap are clean.")
