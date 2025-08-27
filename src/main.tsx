import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { env } from "@huggingface/transformers";

async function resetHuggingFaceBrowserCacheOnce() {
  // 1) Bypass cache for this run (so we fetch fresh files)
  env.useBrowserCache = false;      // stops using the browser cache
  env.allowLocalModels = false;     // ensures we fetch from HF hub/CDN

  // 2) Delete any existing Cache Storage entries related to transformers/models
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) =>
          /transformers|onnx|huggingface|models/i.test(k)
        )
        .map((k) => caches.delete(k))
    );
  }

  // 3) (Optional) Nuke specific IndexedDB databases if they exist
  // Safe: only targets likely names used by libs; wrapped in try/catch.
  const maybeDBs = ["transformers-cache", "models", "onnx-cache"];
  for (const name of maybeDBs) {
    try { indexedDB.deleteDatabase(name); } catch {}
  }
}

// Run it ONCE, then mark done so it won't slow future loads.
(async () => {
  const FLAG = "hf_cache_reset_v1";
  if (!localStorage.getItem(FLAG)) {
    await resetHuggingFaceBrowserCacheOnce();
    localStorage.setItem(FLAG, "1");
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
