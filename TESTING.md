# Regression Tests

Fast Vitest suite that guards the bits that matter most on the main site and CRM.
Supabase is fully mocked — no network, no DB.

## Run

```bash
bunx vitest run        # one-shot (CI-style)
bunx vitest            # watch mode
```

Or ask me ("run the regression tests") and I'll run them for you.

## What's covered

| File | What it locks in |
| --- | --- |
| `src/test/smoke/homepage.test.tsx` | Homepage mounts; the removed "Start free — no card required" CTA stays removed. |
| `src/test/smoke/pricing.test.tsx` | All 4 tiers render; every tier shows "Join the waitlist" CTA; the "Free 3-day trial / no card required" text stays removed. |
| `src/test/smoke/blog-card.test.tsx` | Blog cards render a "Read More" link pointing to `/blog/<slug>`; title links; slug encoding. (Regression guard for the recent Read More bug.) |
| `src/test/smoke/contact.test.tsx` | `/contact` form renders required Name + Email fields. |
| `src/test/smoke/crm-guard.test.tsx` | Unauthenticated visits to `/crm` redirect to `/auth` (never leak CRM content). |

## Adding new tests

1. Drop a `*.test.tsx` file under `src/test/smoke/` (or co-located with the component).
2. Use the helper:

```tsx
import { renderWithProviders } from "@/test/utils";
renderWithProviders(<MyComponent />, { route: "/some-path" });
```

3. Supabase calls are auto-mocked in `src/test/setup.ts` (returns empty data / null session). Extend that mock if a new test needs specific data.
