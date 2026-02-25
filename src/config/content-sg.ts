// Singapore English content - Currency localized
// Based on content.ts with SGD pricing

import { CONTENT } from './content';

export const CONTENT_SG = {
  ...CONTENT,
  
  // Override pricing with SGD
  pricing: {
    ...CONTENT.pricing,
    currency: "S$",
    currencyPosition: "before" as const,
    plans: {
      free: {
        ...CONTENT.pricing.plans.free,
      },
      essential: {
        ...CONTENT.pricing.plans.essential,
        priceMonthly: 33.50,
        priceAnnual: 26.99,
      },
      enterprise: {
        ...CONTENT.pricing.plans.enterprise,
      },
    },
  },
} as const;
