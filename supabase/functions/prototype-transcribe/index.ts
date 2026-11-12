// Prototype Notes voice notes: forwards one recording to the Lovable AI Gateway
// for transcription and streams the written version back. Anonymous callers are
// rate-limited per IP and uploads are bounded before buffering.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const MAX_BYTES = 10 * 1024 * 1024;
const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: "Voice notes are not configured" }, 500);

  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > MAX_BYTES) return json({ error: "That recording is too long. Please keep voice notes under a few minutes." }, 413);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: ok, error: rlError } = await supabase.rpc("check_server_rate_limit", {
    p_identifier: ip, p_action_type: "prototype_transcribe", p_max_requests: 30, p_window_minutes: 15,
  });
  if (rlError) return json({ error: "Unable to accept the recording just now" }, 503);
  if (ok === false) return json({ error: "Too many voice notes for now. Please try again shortly." }, 429);

  const raw = await req.arrayBuffer();
  if (raw.byteLength > MAX_BYTES) return json({ error: "That recording is too long." }, 413);
  let file: File | null = null;
  try {
    const form = await new Response(raw, { headers: { "content-type": req.headers.get("content-type") ?? "" } }).formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch { /* handled below */ }
  if (!file || file.size < 2048 || !file.type.startsWith("audio/")) return json({ error: "The recording was empty. Please record again." }, 400);

  const upstreamForm = new FormData();
  upstreamForm.append("model", "openai/gpt-transcribe");
  upstreamForm.append("file", file, file.name || "recording.wav");
  upstreamForm.append("response_format", "json");
  upstreamForm.append("stream", "true");
  try {
    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body: upstreamForm, signal: req.signal,
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...corsHeaders, "Content-Type": upstream.headers.get("content-type") ?? "text/event-stream" },
    });
  } catch (err) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    console.error("transcribe failed", err);
    return json({ error: "I couldn't hear that recording. Please try again." }, 502);
  }
});
