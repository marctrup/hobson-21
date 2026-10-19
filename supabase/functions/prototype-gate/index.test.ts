// Regression tests for the prototype-gate edge function.
// Runs against the deployed function (live URL from .env).

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL")!;
const ANON_KEY =
  Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
const FN_URL = `${SUPABASE_URL}/functions/v1/prototype-gate`;

const baseHeaders = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${ANON_KEY}`,
  "apikey": ANON_KEY,
};

Deno.test("prototype-gate: rejects a missing pass phrase with 400", async () => {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({}),
  });
  const body = await res.text();
  assertEquals(res.status, 400, `Expected 400, got ${res.status}. Body: ${body}`);
});

Deno.test("prototype-gate: rejects a blank pass phrase with 400", async () => {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({ passphrase: "   " }),
  });
  const body = await res.text();
  assertEquals(res.status, 400, `Expected 400, got ${res.status}. Body: ${body}`);
});

Deno.test("prototype-gate: rejects a non-string pass phrase with 400", async () => {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({ passphrase: { sneaky: true } }),
  });
  const body = await res.text();
  assertEquals(res.status, 400, `Expected 400, got ${res.status}. Body: ${body}`);
});

Deno.test("prototype-gate: an unrecognised phrase never opens the door", async () => {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({ passphrase: "definitely-not-the-phrase" }),
  });
  const body = await res.json();
  assertEquals(body.valid, false, `Expected valid:false, got ${JSON.stringify(body)}`);
});

Deno.test("prototype-gate: CORS preflight responds 200", async () => {
  const res = await fetch(FN_URL, { method: "OPTIONS", headers: baseHeaders });
  await res.text();
  assertEquals(res.status, 200);
});
