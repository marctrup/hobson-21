// Unit tests for the invite-link origin whitelist.
// Mirrors the regex/whitelist from index.ts. If you change one, change the other.

import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const ALLOWED_EXACT_ORIGINS = new Set<string>([
  "https://hobsonschoice.ai",
  "https://www.hobsonschoice.ai",
  "https://pilot.hobsonschoice.ai",
  "https://app.hobsonschoice.ai",
  "https://hobson-21.lovable.app",
]);
const LOVABLE_APP_RE = /^https:\/\/[a-z0-9-]+\.lovable\.app$/i;
const LOVABLE_PROJECT_RE = /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/i;

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_EXACT_ORIGINS.has(origin)) return true;
  return LOVABLE_APP_RE.test(origin) || LOVABLE_PROJECT_RE.test(origin);
}

Deno.test("accepts production exact matches", () => {
  assertEquals(isAllowedOrigin("https://hobsonschoice.ai"), true);
  assertEquals(isAllowedOrigin("https://app.hobsonschoice.ai"), true);
});

Deno.test("accepts in-editor preview lovableproject.com", () => {
  assertEquals(
    isAllowedOrigin("https://73c620d6-7f2b-4d43-8b30-15a87c300f28.lovableproject.com"),
    true,
  );
});

Deno.test("accepts published lovable.app subdomains", () => {
  assertEquals(isAllowedOrigin("https://hobson-21.lovable.app"), true);
  assertEquals(isAllowedOrigin("https://anything-here.lovable.app"), true);
});

Deno.test("accepts id-preview--<uuid>.lovable.app", () => {
  assertEquals(
    isAllowedOrigin("https://id-preview--73c620d6-7f2b-4d43-8b30-15a87c300f28.lovable.app"),
    true,
  );
});

Deno.test("rejects suffix attack on production domain", () => {
  assertEquals(isAllowedOrigin("https://hobsonschoice.ai.evil.com"), false);
});

Deno.test("rejects suffix attack on lovable.app", () => {
  assertEquals(isAllowedOrigin("https://hobson-21.lovable.app.evil.com"), false);
});

Deno.test("rejects suffix attack on lovableproject.com", () => {
  assertEquals(isAllowedOrigin("https://abc.lovableproject.com.evil.com"), false);
});

Deno.test("rejects multi-level subdomain on lovable.app", () => {
  assertEquals(isAllowedOrigin("https://evil.foo.lovable.app"), false);
});

Deno.test("rejects multi-level subdomain on lovableproject.com", () => {
  assertEquals(isAllowedOrigin("https://evil.foo.lovableproject.com"), false);
});

Deno.test("rejects http:// (must be https)", () => {
  assertEquals(isAllowedOrigin("http://hobsonschoice.ai"), false);
  assertEquals(isAllowedOrigin("http://abc.lovableproject.com"), false);
});

Deno.test("rejects null and empty", () => {
  assertEquals(isAllowedOrigin(null), false);
  assertEquals(isAllowedOrigin(""), false);
});

Deno.test("rejects lookalike domain lovableproject.com.co", () => {
  assertEquals(isAllowedOrigin("https://abc.lovableproject.com.co"), false);
});
