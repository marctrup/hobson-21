// Regression tests for send-contact-message edge function.
// Runs against the deployed function (live URL from .env).

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
const FN_URL = `${SUPABASE_URL}/functions/v1/send-contact-message`;

const baseHeaders = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${ANON_KEY}`,
  "apikey": ANON_KEY,
};

Deno.test("send-contact-message: rejects invalid payload with 400", async () => {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({ name: "", email: "not-an-email", reason: "" }),
  });
  const body = await res.text();
  assertEquals(res.status, 400, `Expected 400, got ${res.status}. Body: ${body}`);
});

Deno.test("send-contact-message: rejects missing fields with 400", async () => {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({}),
  });
  await res.text();
  assertEquals(res.status, 400);
});

Deno.test("send-contact-message: CORS preflight responds 200", async () => {
  const res = await fetch(FN_URL, { method: "OPTIONS", headers: baseHeaders });
  await res.text();
  assertEquals(res.status, 200);
});
