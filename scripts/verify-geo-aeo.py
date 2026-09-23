#!/usr/bin/env python3
"""
Verify the GEO (Generative Engine Optimization) and AEO (Answer Engine
Optimization) signals — the things AI assistants such as ChatGPT, Claude,
Perplexity and Google's AI answers rely on.

Checks:
  - every crawler snapshot carries at least one JSON-LD block
  - every snapshot has enough readable text to be quotable
  - key pages open with an answer-first "In short" summary
  - solution pages and the FAQ carry Question/Answer markup
  - the glossary carries DefinedTermSet / DefinedTerm markup
  - pages that show a "Last updated" freshness signal still do
  - llms.txt exists and lists the key pages
  - robots.txt explicitly welcomes the AI crawlers

Exit code 0 = all good, 1 = problems found (they are printed).
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
APEX = "https://hobsonschoice.ai"

# Read the route list straight out of prerender.py (importing it would run it).
_src = open(os.path.join(ROOT, "prerender.py"), encoding="utf-8").read()
_block = re.search(r"ROUTES\s*=\s*\[(.*?)\]", _src, re.S).group(1)
ROUTES = re.findall(r'"([^"]+)"', _block)

SOLUTION_PAGES = [
    "/lease-management-software",
    "/property-management-software",
    "/property-portfolio-software",
    "/ai-lease-abstraction",
]

# Pages that must open with an answer-first "In short" summary.
ANSWER_FIRST = SOLUTION_PAGES + [
    "/pricing",
    "/learn",
    "/learn/faq",
    "/learn/glossary",
]

# Pages that must carry Question/Answer (FAQPage) markup.
QA_MARKUP = SOLUTION_PAGES + ["/learn/faq"]

# Pages that must show a freshness signal.
FRESHNESS = SOLUTION_PAGES + ["/learn/faq", "/learn/glossary"]

# Pages llms.txt must point at.
LLMS_REQUIRED = [
    "/", "/pricing", "/contact", "/learn", "/learn/faq", "/learn/glossary",
] + SOLUTION_PAGES

AI_CRAWLERS = [
    "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot",
    "PerplexityBot", "Google-Extended", "Applebot-Extended",
]

# Short, purely functional pages (forms, legal boilerplate) are exempt.
SHORT_PAGE_EXEMPT = ["/contact"]

MIN_WORDS = 120

problems = []


def snapshot(route):
    path = os.path.join(PUBLIC, route.strip("/"), "index.html")
    if not os.path.exists(path):
        return None
    return open(path, encoding="utf-8").read()


def visible_words(html):
    text = re.sub(r"<script\b.*?</script>", " ", html, flags=re.S | re.I)
    text = re.sub(r"<style\b.*?</style>", " ", text, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return len(re.findall(r"[A-Za-z']+", text))


for route in ROUTES:
    html = snapshot(route)
    if html is None:
        problems.append(f"{route}: snapshot missing")
        continue

    if 'application/ld+json' not in html:
        problems.append(f"{route}: no JSON-LD structured data")

    words = visible_words(html)
    if words < MIN_WORDS and route not in SHORT_PAGE_EXEMPT:
        problems.append(
            f"{route}: only {words} words of readable text "
            f"(AI assistants need at least {MIN_WORDS} to quote a page)")

    if route in ANSWER_FIRST and "In short" not in html:
        problems.append(f"{route}: missing the answer-first 'In short' summary")

    if route in QA_MARKUP and '"FAQPage"' not in html.replace(" ", ""):
        problems.append(f"{route}: missing Question/Answer (FAQPage) markup")

    if route in FRESHNESS and "Last updated" not in html:
        problems.append(f"{route}: missing the 'Last updated' freshness signal")

glossary = snapshot("/learn/glossary")
if glossary is not None:
    if '"DefinedTermSet"' not in glossary.replace(" ", ""):
        problems.append("/learn/glossary: missing DefinedTermSet markup")
    terms = len(re.findall(r'"DefinedTerm"', glossary.replace(" ", "")))
    if terms < 10:
        problems.append(
            f"/learn/glossary: only {terms} DefinedTerm entries marked up")

llms_path = os.path.join(PUBLIC, "llms.txt")
if not os.path.exists(llms_path):
    problems.append("llms.txt is missing (the file AI assistants look for)")
else:
    llms = open(llms_path, encoding="utf-8").read()
    for route in LLMS_REQUIRED:
        if f"{APEX}{route}" not in llms:
            problems.append(f"{route}: not listed in llms.txt")

robots_path = os.path.join(PUBLIC, "robots.txt")
if not os.path.exists(robots_path):
    problems.append("robots.txt is missing")
else:
    robots = open(robots_path, encoding="utf-8").read()
    for bot in AI_CRAWLERS:
        if not re.search(rf"User-agent:\s*{re.escape(bot)}\b", robots, re.I):
            problems.append(f"robots.txt: {bot} is not explicitly allowed")

if problems:
    print(f"\nGEO/AEO verification found {len(problems)} problem(s):\n")
    for p in problems:
        print("  x " + p)
    print()
    sys.exit(1)

print(f"GEO/AEO verification passed: {len(ROUTES)} snapshots, llms.txt "
      "and robots.txt are AI-ready.")
