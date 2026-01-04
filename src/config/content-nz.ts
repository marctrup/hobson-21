// New Zealand English content - Currency localized
// Based on content.ts with NZD pricing

import { CONTENT } from './content';

export const CONTENT_NZ = {
  ...CONTENT,
  
  // Override pricing with NZD
  pricing: {
    ...CONTENT.pricing,
    currency: "NZ$",
    currencyPosition: "before" as const,
    plans: {
      free: {
        ...CONTENT.pricing.plans.free,
      },
      essential: {
        ...CONTENT.pricing.plans.essential,
        priceMonthly: 42,
        priceAnnual: 34,
      },
      essentialPlus: {
        ...CONTENT.pricing.plans.essentialPlus,
        priceMonthly: 109,
        priceAnnual: 87,
      },
      enterprise: {
        ...CONTENT.pricing.plans.enterprise,
        priceMonthly: 325,
        priceAnnual: 260,
      },
    },
  },
} as const;
