// Regression tests for the has_role / has_crm_access RPCs.
// Anonymous calls must be denied before role data can be evaluated.

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;

const supabase = createClient(SUPABASE_URL, ANON_KEY);

// A random UUID that is guaranteed not to be an admin.
const RANDOM_UUID = "00000000-0000-0000-0000-000000000000";

Deno.test("has_role: anonymous execution is denied", async () => {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: RANDOM_UUID,
    _role: "admin",
  });
  assertEquals(data, null);
  assert(error);
  assertEquals(error.code, "42501");
});

Deno.test("has_crm_access: anonymous execution is denied", async () => {
  const { data, error } = await supabase.rpc("has_crm_access", {
    _user_id: RANDOM_UUID,
  });
  assertEquals(data, null);
  assert(error);
  assertEquals(error.code, "42501");
});
