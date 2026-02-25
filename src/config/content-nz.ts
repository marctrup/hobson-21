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
        priceMonthly: 42.50,
        priceAnnual: 33.99,
      },
      enterprise: {
        ...CONTENT.pricing.plans.enterprise,
      },
    },
  },
} as const;
