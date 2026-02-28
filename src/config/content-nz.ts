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
        boostDetail: "Add an AI Boost — NZ$11\n+25 extra AI questions\nInstant access. No plan change.",
      },
      enterprise: {
        ...CONTENT.pricing.plans.enterprise,
      },
    },
    aiBoost: {
      ...(CONTENT.pricing as any).aiBoost,
      price: "NZ$11 per Boost",
    },
  },
} as const;
