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
        priceMonthly: 35,
        priceAnnual: 28,
      },
      essentialPlus: {
        ...CONTENT.pricing.plans.essentialPlus,
        priceMonthly: 89,
        priceAnnual: 71,
      },
      enterprise: {
        ...CONTENT.pricing.plans.enterprise,
        priceMonthly: 265,
        priceAnnual: 212,
      },
    },
  },
} as const;
