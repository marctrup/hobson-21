# Regression Tests

Two suites guard against regressions on the main site and CRM.
Trigger phrase: **"Run Regression Tests"** — I run both suites and report results.

## What runs

### Frontend (Vitest + React Testing Library, ~15s)

Supabase is mocked globally in `src/test/setup.ts` — no network, no DB.

| File | Layer | Locks in |
| --- | --- | --- |
| `src/test/smoke/main-routes.test.tsx` | Smoke | `/`, `/pricing`, `/contact`, `/blog`, `/investment-opportunity`, `/learn/faq` all mount without throwing |
| `src/test/smoke/crm-routes.test.tsx` | Smoke | `/crm`, `/crm/clients`, `/crm/pipeline`, `/crm/issues`, `/crm/tasks`, `/crm/settings` mount (with `useCrmAccess` mocked to admin) |
| `src/test/smoke/homepage.test.tsx` | Component | Removed "Start free — no card required" CTA stays removed |
| `src/test/smoke/pricing.test.tsx` | Component | All 4 tiers render; every tier shows "Join the waitlist"; "Free 3-day trial / no card required" stays removed |
| `src/test/smoke/blog-card.test.tsx` | Component | Blog cards render a "Read More" link pointing to `/blog/<slug>` (regression guard) |
| `src/test/smoke/contact.test.tsx` | Component | `/contact` form renders required Name + Email fields |
| `src/test/smoke/crm-guard.test.tsx` | Component | Unauthenticated `/crm` redirects to `/auth` |
| `src/test/component/crm-pipeline.test.tsx` | Component | Pipeline columns render in `sort_order`; `on_hold` is never a kanban column |
| `src/test/component/contact-form.test.tsx` | Component | Contact form wiring doesn't crash and respects validation gate |

### Edge functions (Deno, ~5s)

Run against the deployed Supabase project. Auth/contract assertions only — never writes test data to the DB.

| File | Locks in |
| --- | --- |
| `supabase/functions/send-contact-message/index.test.ts` | Invalid payload → 400; missing fields → 400; CORS preflight → 200 |
| `supabase/functions/crm-ingest-website/index.test.ts` | Missing HMAC → 401; bogus HMAC → 401; GET → 405; CORS preflight → 200 |
| `supabase/functions/_shared/has_role.test.ts` | Anon `has_role('admin')` → false; anon `has_crm_access` → false (no privilege leak) |

## Running manually

```bash
bunx vitest run                      # frontend, one-shot
bunx vitest                          # frontend, watch mode
```

Edge function tests run via the Lovable harness (`supabase--test_edge_functions`).

## Adding new tests

**Frontend** — drop a `*.test.tsx` file under `src/test/` and use:
```tsx
import { renderWithProviders } from "@/test/utils";
renderWithProviders(<MyComponent />, { route: "/some-path" });
```

**Edge function** — drop a `*_test.ts` file under `supabase/functions/<name>/` following the Deno test pattern in the existing files. The Run Regression Tests trigger picks it up automatically once you add the function name to the trigger memory rule.
