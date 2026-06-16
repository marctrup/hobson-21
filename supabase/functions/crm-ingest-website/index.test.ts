// Regression tests for crm-ingest-website edge function.
// We only assert auth behaviour; we never actually create a CRM client from
// these tests (that would pollute the live DB).

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
const FN_URL = `${SUPABASE_URL}/functions/v1/crm-ingest-website`;

const baseHeaders = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${ANON_KEY}`,
  "apikey": ANON_KEY,
};

Deno.test("crm-ingest-website: rejects request with no HMAC signature (401)", async () => {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({ form_type: "website" }),
  });
  await res.text();
  assertEquals(res.status, 401);
});

Deno.test("crm-ingest-website: rejects request with a bogus HMAC signature (401)", async () => {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: { ...baseHeaders, "x-ingest-signature": "deadbeef".repeat(8) },
    body: JSON.stringify({ form_type: "website" }),
  });
  await res.text();
  assertEquals(res.status, 401);
});

Deno.test("crm-ingest-website: rejects GET (405)", async () => {
  const res = await fetch(FN_URL, { method: "GET", headers: baseHeaders });
  await res.text();
  assertEquals(res.status, 405);
});

Deno.test("crm-ingest-website: CORS preflight responds 200", async () => {
  const res = await fetch(FN_URL, { method: "OPTIONS", headers: baseHeaders });
  await res.text();
  assertEquals(res.status, 200);
});
