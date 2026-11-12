// Voice note recording (complete WAV) and transcription via the prototype-transcribe function.
import { createParser } from "eventsource-parser";

function encodeWav(chunks: readonly Float32Array[], sampleRate: number): Blob {
  const length = chunks.reduce((s, c) => s + c.length, 0);
  const bytes = new ArrayBuffer(44 + length * 2);
  const v = new DataView(bytes);
  const tag = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  tag(0, "RIFF"); v.setUint32(4, 36 + length * 2, true); tag(8, "WAVE"); tag(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true); v.setUint32(28, sampleRate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  tag(36, "data"); v.setUint32(40, length * 2, true);
  let o = 44;
  for (const c of chunks) for (const x of c) { const s = Math.max(-1, Math.min(1, x)); v.setInt16(o, s * (s < 0 ? 32768 : 32767), true); o += 2; }
  return new Blob([bytes], { type: "audio/wav" });
}

export type Recording = { stop: () => Promise<File>; cancel: () => void; level: () => number };

export async function startRecording(): Promise<Recording> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const ctx = new AudioContext();
  await ctx.resume();
  const source = ctx.createMediaStreamSource(stream);
  const node = ctx.createScriptProcessor(4096, 1, 1);
  const chunks: Float32Array[] = [];
  let lvl = 0;
  node.onaudioprocess = (e) => {
    const d = new Float32Array(e.inputBuffer.getChannelData(0));
    chunks.push(d);
    let sum = 0; for (const x of d) sum += x * x;
    lvl = Math.min(1, Math.sqrt(sum / d.length) * 6);
  };
  source.connect(node); node.connect(ctx.destination);
  let done = false;
  const teardown = () => { done = true; stream.getTracks().forEach((t) => t.stop()); node.disconnect(); source.disconnect(); node.onaudioprocess = null; };
  return {
    level: () => lvl,
    cancel: () => { if (!done) { teardown(); void ctx.close(); } },
    async stop() {
      if (done) throw new Error("Recording already stopped");
      teardown();
      const blob = encodeWav(chunks, ctx.sampleRate);
      await ctx.close();
      if (blob.size < 2048) throw new Error("The recording was empty. Please record again.");
      return new File([blob], "voice-note.wav", { type: "audio/wav" });
    },
  };
}

export async function transcribeVoiceNote(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file, file.name);
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/prototype-transcribe`, {
    method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}` }, body: form,
  });
  if (!res.ok || !res.body) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? body?.error ?? body?.message ?? "I couldn't hear that recording. Please try again.");
  }
  let text = "", final: string | null = null, failure: string | null = null;
  const parser = createParser({
    onEvent: (ev) => {
      if (ev.data === "[DONE]") return;
      try {
        const d = JSON.parse(ev.data);
        if (d.type === "transcript.text.delta" && d.delta) text += d.delta;
        else if (d.type === "transcript.text.done") final = d.text ?? text;
        else if (d.type === "error" || d.error) failure = d.error?.message ?? d.message ?? "Transcription failed";
      } catch { /* ignore non-JSON */ }
    },
  });
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  for (;;) { const { done, value } = await reader.read(); if (done) break; parser.feed(dec.decode(value, { stream: true })); }
  if (failure) throw new Error(failure);
  const out = (final ?? text).trim();
  if (!out) throw new Error("I couldn't make out any words. Please record again.");
  return out;
}
