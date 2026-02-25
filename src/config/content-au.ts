// Australian English content - Currency localized
// Based on content.ts with AUD pricing

import { CONTENT } from './content';

export const CONTENT_AU = {
  ...CONTENT,
  
  // Override pricing with AUD
  pricing: {
    ...CONTENT.pricing,
    currency: "A$",
    currencyPosition: "before" as const,
    plans: {
      free: {
        ...CONTENT.pricing.plans.free,
      },
      essential: {
        ...CONTENT.pricing.plans.essential,
        priceMonthly: 38.99,
        priceAnnual: 30.99,
      },
      enterprise: {
        ...CONTENT.pricing.plans.enterprise,
      },
    },
  },
} as const;
