#!/usr/bin/env python3
"""
Verify the public blog can actually show posts before publishing.

Asks the database for published blog posts exactly the way the live blog
page does (anon key, status = published, link_location = blog). Fails if
the request is refused or comes back empty — this catches missing table
grants and broken role-check permissions, which otherwise surface only as
a silent "No posts available" on the live site.

Exit code 0 = posts are reachable, 1 = problem found (it is printed).
"""

import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_env():
    env = {}
    path = os.path.join(ROOT, ".env")
    if not os.path.exists(path):
        return env
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def main() -> int:
    env = load_env()
    url = env.get("VITE_SUPABASE_URL", "")
    key = env.get("VITE_SUPABASE_PUBLISHABLE_KEY", "")
    if not url or not key:
        print("Blog check skipped: VITE_SUPABASE_URL / "
              "VITE_SUPABASE_PUBLISHABLE_KEY not found in .env")
        return 0

    endpoint = (
        f"{url}/rest/v1/blog_posts"
        "?select=id,title&status=eq.published&link_location=eq.blog&limit=5"
    )
    req = urllib.request.Request(endpoint, headers={
        "apikey": key,
        "Authorization": f"Bearer {key}",
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            posts = json.loads(resp.read().decode("utf-8"))
    except Exception as exc:  # noqa: BLE001 - report any failure plainly
        print(f"Blog check FAILED: could not fetch published posts ({exc})")
        return 1

    if not isinstance(posts, list) or not posts:
        print("Blog check FAILED: no published posts came back — the live "
              "blog would show 'No posts available'. Check table grants and "
              "the has_role execute permission.")
        return 1

    print(f"Blog check passed: {len(posts)} published post(s) reachable "
          f"anonymously (e.g. \"{posts[0].get('title', '?')}\").")
    return 0


if __name__ == "__main__":
    sys.exit(main())
