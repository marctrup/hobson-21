import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { env } from "@huggingface/transformers";

async function resetHfCache() {
  // Bypass cache for a clean fetch
  env.useBrowserCache = false;      // stop reading from browser cache
  env.allowLocalModels = false;     // force network fetch

  // Clear Cache Storage
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => /transformers|onnx|huggingface|models/i.test(k))
        .map((k) => caches.delete(k))
    );
  }

  // Clear likely IndexedDB databases (safe tries)
  for (const name of ["transformers-cache", "models", "onnx-cache"]) {
    try { indexedDB.deleteDatabase(name); } catch {}
  }
}

// Run ONCE then remember we did it
const HF_FLAG = "hf_cache_reset_v1";
if (typeof window !== "undefined" && !localStorage.getItem(HF_FLAG)) {
  window.addEventListener("load", () => {
    resetHfCache().finally(() => localStorage.setItem(HF_FLAG, "1"));
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
