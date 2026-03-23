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
        boostDetail: "Add an AI Boost — A$10\n+25 extra AI questions\nInstant access. No plan change.",
      },
      essentialPlus: {
        ...(CONTENT.pricing.plans as any).essentialPlus,
        priceMonthly: 98.99,
        priceAnnual: 79.19,
      },
      enterprise: {
        ...CONTENT.pricing.plans.enterprise,
      },
    },
    aiBoost: {
      ...(CONTENT.pricing as any).aiBoost,
      price: "A$10 per Boost",
    },
  },
} as const;
