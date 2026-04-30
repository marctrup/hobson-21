// Shared helpers for CRM admin-gated edge functions.
// All CRM role-mutation functions verify JWT in code and check admin role
// via the has_role RPC against the database.

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

/** Service-role client (bypasses RLS). Use for trusted writes only. */
export function serviceClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Per-request client carrying the caller's JWT. RLS applies; auth.uid() is preserved. */
export function userClient(authHeader: string): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface AuthContext {
  userId: string;
  email: string;
  authHeader: string;
}

/** Resolves the caller from the Authorization header. Returns null on failure. */
export async function getCaller(req: Request): Promise<AuthContext | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const svc = serviceClient();
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const { data, error } = await svc.auth.getUser(token);
  if (error || !data?.user) return null;
  return { userId: data.user.id, email: data.user.email ?? "", authHeader };
}

/** True if the given user has admin role. Uses has_role RPC. */
export async function isAdmin(userId: string): Promise<boolean> {
  const svc = serviceClient();
  const { data, error } = await svc.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) {
    console.error("has_role check failed", error);
    return false;
  }
  return data === true;
}

/** SHA-256 hex hash via Web Crypto. */
export async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Generate a cryptographically random URL-safe token (43 chars, ~256 bits). */
export function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
