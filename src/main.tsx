import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize React first, then handle HF cache reset after React is ready
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Handle Hugging Face cache reset after React has initialized
async function resetHfCache() {
  try {
    // Dynamic import to avoid affecting React initialization
    const { env } = await import("@huggingface/transformers");
    
    // Bypass cache for a clean fetch
    env.useBrowserCache = false;
    env.allowLocalModels = false;

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
  } catch (error) {
    console.warn('HF cache reset failed:', error);
  }
}

// Run cache reset after React has mounted
const HF_FLAG = "hf_cache_reset_v1";
if (typeof window !== "undefined" && !localStorage.getItem(HF_FLAG)) {
  // Use setTimeout to ensure this runs after React's initial render
  setTimeout(() => {
    resetHfCache().finally(() => localStorage.setItem(HF_FLAG, "1"));
  }, 100);
}
