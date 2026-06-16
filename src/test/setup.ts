import "@testing-library/jest-dom";
import { vi } from "vitest";

// jsdom matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// IntersectionObserver stub (used by LazyImage etc.)
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
(window as any).IntersectionObserver = IO;
(globalThis as any).IntersectionObserver = IO;

class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(window as any).ResizeObserver = RO;
(globalThis as any).ResizeObserver = RO;


// scrollTo stub
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

// Lightweight Supabase client mock — pages render without network
vi.mock("@/integrations/supabase/client", () => {
  const chain: any = {
    select: () => chain,
    insert: () => chain,
    update: () => chain,
    delete: () => chain,
    upsert: () => chain,
    eq: () => chain,
    neq: () => chain,
    in: () => chain,
    is: () => chain,
    or: () => chain,
    order: () => chain,
    limit: () => chain,
    range: () => chain,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb),
  };
  return {
    supabase: {
      from: () => chain,
      rpc: () => Promise.resolve({ data: null, error: null }),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: () => Promise.resolve({ error: null }),
      },
      functions: { invoke: () => Promise.resolve({ data: null, error: null }) },
      channel: () => {
        const ch: any = { on: () => ch, subscribe: () => ch, unsubscribe: () => {} };
        return ch;
      },

      removeChannel: () => {},
    },
  };
});
