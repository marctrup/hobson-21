

# Stripe Checkout Integration

## Summary
Wire the 4 pricing plan buttons to Stripe Checkout Sessions. An edge function creates checkout sessions using your Price IDs, and buttons redirect users to Stripe's hosted checkout page.

## Price ID Mapping

| Plan | Monthly | Annual |
|------|---------|--------|
| Free | price_1T3Cqd2NA0ttIOr0ndAG6xqA | (none) |
| Essential | price_1T3Cr12NA0ttIOr0adcLLIXl | price_1T3IZg2NA0ttIOr0DodJ00dP |
| Essential Plus | price_1T3CrJ2NA0ttIOr0PPxXPmVO | price_1T3Ia92NA0ttIOr0tqhYiiM1 |
| Enterprise | price_1T3Cri2NA0ttIOr0HUjHQLJF | price_1T3Iac2NA0ttIOr0oP6MsKev |

## Steps

### 1. Add Stripe Secret Key to Supabase Secrets
Your `STRIPE_API_KEY` needs to be stored as a Supabase secret so the edge function can use it. I'll prompt you to add it securely.

### 2. Create Edge Function: `create-checkout-session`
A new Supabase Edge Function that:
- Accepts POST with `{ priceId }`
- Creates a Stripe Checkout Session via the Stripe API (using `fetch`, no SDK)
- Sets `success_url` and `cancel_url` back to your site
- Returns `{ url }` for the frontend to redirect to
- Includes proper CORS headers
- No JWT required (public checkout)

### 3. Add Price IDs to Content Config
Add `stripePriceIds` to each plan in `src/config/content.ts`:

```text
free: { ..., stripePriceIds: { monthly: "price_1T3Cqd...", annual: null } }
essential: { ..., stripePriceIds: { monthly: "price_1T3Cr1...", annual: "price_1T3IZg..." } }
essentialPlus: { ..., stripePriceIds: { monthly: "price_1T3CrJ...", annual: "price_1T3Ia9..." } }
enterprise: { ..., stripePriceIds: { monthly: "price_1T3Cri...", annual: "price_1T3Iac..." } }
```

### 4. Update Pricing Section UI
In `src/components/homepage/PricingSection.tsx`:
- Add a `handleCheckout(priceId)` function that calls the edge function and redirects to the returned URL
- Wire each plan's button `onClick` to pass the correct Price ID based on the monthly/annual toggle state
- Add loading state on buttons while checkout session is being created
- For the Free plan, the annual toggle will be hidden (no annual option)

### 5. Update `supabase/config.toml`
Add the new function with `verify_jwt = false`.

## Files Changed/Created

| File | Action |
|------|--------|
| `supabase/functions/create-checkout-session/index.ts` | Create |
| `supabase/config.toml` | Edit (add function config) |
| `src/config/content.ts` | Edit (add Stripe Price IDs) |
| `src/components/homepage/PricingSection.tsx` | Edit (add checkout handlers + loading states) |

## Notes
- The Free plan button will use the monthly Price ID only (no annual toggle shown)
- Success/cancel URLs will redirect back to your homepage
- No database tables needed -- Stripe handles all payment data

