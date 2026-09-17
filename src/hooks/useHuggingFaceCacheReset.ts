import { useEffect } from 'react';

const HF_FLAG = "hf_cache_reset_v1";

export const useHuggingFaceCacheReset = () => {
  useEffect(() => {
    const resetHfCache = async () => {
      try {
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
          try { 
            indexedDB.deleteDatabase(name); 
          } catch (e) {
            // Silently fail for browsers that don't support IndexedDB
          }
        }
        
        console.log('Hugging Face cache reset completed');
      } catch (error) {
        console.warn('HF cache reset failed:', error);
      }
    };

    // Only run once per session
    if (typeof window !== "undefined" && !localStorage.getItem(HF_FLAG)) {
      resetHfCache().finally(() => {
        localStorage.setItem(HF_FLAG, "1");
      });
    }
  }, []);
};