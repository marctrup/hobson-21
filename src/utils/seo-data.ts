export const structuredData = {

  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hobson AI Limited",
    "url": "https://hobsonschoice.ai",
    "logo": "https://hobsonschoice.ai/logo.png",
    "sameAs": [
      "https://twitter.com/HobsonAI"
    ],
    "description": "Hobson AI delivers the property work every business has but nobody has time for. AI-native assistance to operators, occupiers and owners of real estate — reading leases, managing obligations and executing workflows automatically.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "rochelle.t@hobsonschoice.ai",
      "contactType": "customer support"
    }
  },

  softwareApplication: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Hobson AI",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, iOS, Android",
    "url": "https://hobsonschoice.ai",
    "description": "Hobson AI is the intelligence layer real estate runs on. Purpose-built for property operators, occupiers and owners — it reads leases, manages compliance obligations, executes workflows and delivers work autonomously. Not a document tool. Not a generic AI. An informed member of your team.",
    "offers": [
      {
        "@type": "Offer",
        "name": "Tier 1",
        "price": "19.50",
        "priceCurrency": "GBP",
        "priceSpecification": [
          {
            "@type": "UnitPriceSpecification",
            "price": "19.50",
            "priceCurrency": "GBP",
            "billingDuration": "P1M",
            "name": "Monthly",
            "description": "Billed monthly. 1 seat. Multi-document AI reasoning, plain English queries, sourced and auditable answers. 3 document extractions and 150 questions per month. No Knowledge Base."
          },
          {
            "@type": "UnitPriceSpecification",
            "price": "187.00",
            "priceCurrency": "GBP",
            "billingDuration": "P1Y",
            "name": "Annual",
            "description": "Billed annually upfront (equivalent to £15.60 per month). 20% saving vs monthly. Same features as monthly Tier 1."
          }
        ]
      },
      {
        "@type": "Offer",
        "name": "Tier 2",
        "price": "165.00",
        "priceCurrency": "GBP",
        "priceSpecification": [
          {
            "@type": "UnitPriceSpecification",
            "price": "165.00",
            "priceCurrency": "GBP",
            "billingDuration": "P1M",
            "name": "Monthly",
            "description": "Billed monthly. 2 seats. Full platform including Knowledge Base. Hobson learns your business — your contractors, contacts, policies, compliance obligations and preferences. 10 document extractions and 250 questions per month. Workflow automation included."
          },
          {
            "@type": "UnitPriceSpecification",
            "price": "1584.00",
            "priceCurrency": "GBP",
            "billingDuration": "P1Y",
            "name": "Annual",
            "description": "Billed annually upfront (equivalent to £132 per month). 20% saving vs monthly. Same features as monthly Tier 2."
          }
        ]
      },
      {
        "@type": "Offer",
        "name": "Tier 3",
        "price": "250.00",
        "priceCurrency": "GBP",
        "priceSpecification": [
          {
            "@type": "UnitPriceSpecification",
            "price": "250.00",
            "priceCurrency": "GBP",
            "billingDuration": "P1M",
            "name": "Monthly",
            "description": "Billed monthly. 5 seats. Full platform including Knowledge Base. 20 document extractions and 500 questions per month. Workflow automation, action memory, monthly impact summaries and personal shortcuts included."
          },
          {
            "@type": "UnitPriceSpecification",
            "price": "2400.00",
            "priceCurrency": "GBP",
            "billingDuration": "P1Y",
            "name": "Annual",
            "description": "Billed annually upfront (equivalent to £200 per month). 20% saving vs monthly. Same features as monthly Tier 3."
          }
        ]
      },
      {
        "@type": "Offer",
        "name": "Tier 4",
        "price": "450.00",
        "priceCurrency": "GBP",
        "priceSpecification": [
          {
            "@type": "UnitPriceSpecification",
            "price": "450.00",
            "priceCurrency": "GBP",
            "billingDuration": "P1M",
            "name": "Monthly",
            "description": "Billed monthly. 10 seats. Full platform including Knowledge Base. 40 document extractions and 750 questions per month. Workflow automation, action memory, monthly impact summaries and personal shortcuts included. Enterprise packages available for portfolios with more than 10 users."
          },
          {
            "@type": "UnitPriceSpecification",
            "price": "4320.00",
            "priceCurrency": "GBP",
            "billingDuration": "P1Y",
            "name": "Annual",
            "description": "Billed annually upfront (equivalent to £360 per month). 20% saving vs monthly. Same features as monthly Tier 4."
          }
        ]
      }
    ]
  },

  faqPageLearn: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Hobson AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hobson AI is an AI-native platform built for any business where property is a material operating cost. It reads your leases and property documents, manages your compliance obligations, executes workflows automatically and delivers work — not just answers. It is purpose-built for real estate, not a generic AI tool adapted for it."
        }
      },
      {
        "@type": "Question",
        "name": "Who is Hobson AI for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hobson is for any business where a commercial lease is a material liability — property managers, asset managers, retail operators managing multiple store leases, hospitality businesses, corporate real estate functions, and any organisation with compliance obligations tied to physical premises. If your business has leases, rent reviews, break clauses, EPC deadlines or compliance certificates to manage, Hobson is built for you."
        }
      },
      {
        "@type": "Question",
        "name": "What makes Hobson different from traditional property management software?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Traditional property management software stores documents and organises information, but still requires a human to read, interpret and act on everything it contains. Hobson reasons across your documents, learns how your business operates, and executes work autonomously. It reads the lease, checks the calendar, calculates the position, drafts the notice and routes it — without a human in the loop until a decision is required."
        }
      },
      {
        "@type": "Question",
        "name": "Is Hobson a generic AI tool like ChatGPT or Microsoft Copilot?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Generic AI tools produce plausible answers but are not fine-tuned for real estate decisions. Hobson is purpose-built for property — trained on proprietary real estate datasets, designed for auditability and governance, and built to produce correct, referenced and traceable answers. For regulated decisions like rent reviews, dilapidations and Building Safety Act compliance, plausible is not good enough."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Hobson Knowledge Base?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Knowledge Base is Hobson's persistent memory about your business. It stores information beyond your documents — your contractors, contacts, internal policies, compliance obligations, communication preferences and specific procedures. Every answer Hobson provides on Tier 2 and above is shaped by this stored knowledge. It transforms Hobson from a smart document tool into an AI that behaves like an informed member of your team."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if my lease has been varied or a new agreement changes the original terms?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hobson is built for exactly this. Commercial leases rarely exist as a single document — they typically comprise an original lease plus deeds of variation, rent memorandums, licences to alter, supplemental deeds and side letters that all change what the lease currently says. Hobson reads the full document stack together and understands what supersedes what — giving you the current legal position, not just what the original lease said."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take for the Knowledge Base to become useful?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Knowledge Base begins working from the moment you add information to it. You tell Hobson your contractors, your policies, your preferences, and it uses that information immediately. It becomes more comprehensive over time as more context is added, but it is useful from day one."
        }
      },
      {
        "@type": "Question",
        "name": "Is my Knowledge Base shared with other Hobson clients?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Every client's Knowledge Base is completely isolated. Your contractors, contacts, policies and procedures are never used to train shared models or inform answers for other clients. Hobson is UK-hosted, ISO 27001 aligned, and your data is never used for model training."
        }
      },
      {
        "@type": "Question",
        "name": "Where is my data stored and is it secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All data is encrypted and UK-hosted. Hobson is aligned to ISO 27001 standards. Your data is never used to train AI models. Your documents, your Knowledge Base and your business information remain entirely within your account and are never shared with or visible to other clients."
        }
      },
      {
        "@type": "Question",
        "name": "Does Hobson help with Building Safety Act and EPC compliance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Hobson reads your compliance certificates, builds a live register, flags upcoming deadlines at 90, 60 and 30 days, instructs contractors, verifies completed certificates and files the outcome automatically. This applies to EPC obligations, Building Safety Act requirements, fire safety, EICR, gas safety, HMO licensing, Legionella, asbestos and other compliance categories."
        }
      },
      {
        "@type": "Question",
        "name": "Can Hobson be trained on my company's information?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. This is what separates Tier 2, 3 and 4 from Tier 1. The Knowledge Base is Hobson's persistent memory about your business — your contractors, contacts, policies, compliance obligations, communication preferences and how you like things done. It is included in Tier 2, 3 and 4 plans, gets better over time, requires no technical skills to set up, and is completely isolated per client."
        }
      },
      {
        "@type": "Question",
        "name": "Which file formats does Hobson support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PDFs are supported currently. Common text files and CSV/Excel support are coming soon."
        }
      },
      {
        "@type": "Question",
        "name": "How long does Hobson take to read a document?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "High-complexity documents like leases take approximately 8 to 9 minutes. Medium-complexity documents like deeds take 2 to 3 minutes. Low-complexity documents like notices take 30 seconds to 1 minute."
        }
      },
      {
        "@type": "Question",
        "name": "How does Hobson navigate a property portfolio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hobson operates at three spatial levels — Portfolio (your entire estate), Property (a single building or site), and Unit (one lettable space). When you ask a question, Hobson checks where it should look for the answer before responding. It never guesses — if information does not exist it tells you clearly rather than generating a plausible but potentially incorrect answer."
        }
      },
      {
        "@type": "Question",
        "name": "How should I structure my prompts for the best results?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Choose the right level first — Portfolio, Unit Group or Unit. Be direct and clear. Use names or addresses when needed. Ask one thing at a time for the most precise answers."
        }
      }
    ]
  },

  faqPagePricing: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is there a free trial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Tier 1 comes with a free 3-day trial — no credit card required. You can upload your first document and start asking questions about it within minutes of signing up. Tier 2, 3 and 4 are available to join the waitlist ahead of their launch later this year, with founding member pricing locked in for early signups."
        }
      },
      {
        "@type": "Question",
        "name": "When will Tiers 2, 3 and 4 be available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tiers 2, 3 and 4 — which unlock the full Knowledge Base platform, workflow automation and action memory — are launching later this year. Join the waitlist now to be notified first and to lock in founding member pricing before public launch."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between Tier 1 and Tiers 2, 3 and 4?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tier 1 gives you Hobson's AI document reasoning — ask anything across your leases, contracts and compliance documents and get instant, sourced, auditable answers. It does not include the Knowledge Base. Tiers 2, 3 and 4 unlock the full platform — the Knowledge Base, workflow automation, action memory, monthly impact summaries and personal shortcuts. Every feature is identical across Tiers 2, 3 and 4. The only difference is how many seats you need."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Knowledge Base?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Knowledge Base is Hobson's persistent memory about your business. You tell Hobson who your contractors are, how you handle rent arrears, what your approval thresholds are, how you like your reports formatted — and it remembers permanently. Every answer and every action it takes reflects what it knows about how your business operates. It transforms Hobson from a smart document tool into an AI that behaves like an informed member of your team."
        }
      },
      {
        "@type": "Question",
        "name": "What happens to my Knowledge Base if I leave?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your data belongs to you and can be exported at any time. However the institutional memory Hobson has built about your business — your contractors, preferences and compliance history — does not transfer to another tool. The longer you use Hobson at Tier 2 or above, the more valuable that memory becomes."
        }
      },
      {
        "@type": "Question",
        "name": "Can I start on Tier 1 and upgrade later?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. When you upgrade to Tier 2 or above, everything you have already taught Hobson stays. Your documents remain in your account. Your Knowledge Base carries over. There is no reset, no re-upload and no loss of work."
        }
      },
      {
        "@type": "Question",
        "name": "What does annual billing mean and how does the 20% saving work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Annual billing means you pay for twelve months upfront in a single payment at a 20% discount. Tier 1 costs £187 upfront (£15.60 per month equivalent). Tier 2 costs £1,584 upfront (£132 per month equivalent). Tier 3 costs £2,400 upfront (£200 per month equivalent). Tier 4 costs £4,320 upfront (£360 per month equivalent). Monthly billing is available at the standard rate."
        }
      },
      {
        "@type": "Question",
        "name": "What if I need more documents or questions than my tier includes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Additional document ingestion is available at £0.30 per document, charged once only — the same document is never charged twice. Top-up question packs are available at £7.50 per 100 questions. You are always in control of what you spend."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use Hobson on my phone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Hobson has a mobile version available on Tier 1, giving you access to your portfolio documents and AI query capability from anywhere. No desktop required to get started."
        }
      },
      {
        "@type": "Question",
        "name": "What if I need more than 10 seats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Enterprise pricing is available for organisations with more than 10 users. Enterprise packages are based on usage and portfolio size rather than headcount, and include bespoke onboarding and dedicated support. Contact the team at rochelle.t@hobsonschoice.ai to discuss your requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need technical skills to set up or use Hobson?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Hobson is designed to be used in plain English. Ask questions the way you would ask a colleague — and Hobson answers directly from your documents and Knowledge Base. No technical training, no complex interfaces, no specialist knowledge required."
        }
      },
      {
        "@type": "Question",
        "name": "We are not a property management company — we are a retailer or hospitality business with leases. Is Hobson for us?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Hobson is built for any business where property is a material operating cost. A retailer with 30 store leases, a restaurant group with 15 sites, or a corporate with a regional office estate all face the same obligations — rent reviews, break clauses, EPC deadlines, compliance certificates — and Hobson manages all of them. You do not need to be in the property industry to benefit."
        }
      },
      {
        "@type": "Question",
        "name": "We already use property management software. Do we need to replace it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Hobson works alongside your existing systems. Your current software stores and organises information. Hobson reasons across it, acts on it and delivers the work your team currently does manually. There is no rip-and-replace requirement."
        }
      },
      {
        "@type": "Question",
        "name": "Does Hobson help with Building Safety Act and EPC compliance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Hobson reads your compliance certificates, builds a live register, flags upcoming deadlines at 90, 60 and 30 days, and files outcomes automatically. This applies to EPC obligations, Building Safety Act requirements, fire safety, EICR, gas safety, HMO licensing, Legionella, asbestos and other compliance categories."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if my lease has been varied or a new agreement changes the original terms?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hobson reads the full document stack together and understands what supersedes what — giving you the current legal position, not just what the original lease said. Deeds of variation, rent memorandums, licences to alter, supplemental deeds and side letters are all read in context."
        }
      },
      {
        "@type": "Question",
        "name": "Where is my data stored and is it secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All data is encrypted and UK-hosted. Hobson is aligned to ISO 27001 standards. Your data is never used to train AI models. Your documents and business information remain entirely within your account and are never shared with or visible to other clients."
        }
      }
    ]
  },

  blog: {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Hobson AI Blog",
    "url": "https://hobsonschoice.ai/blog",
    "description": "Insights on AI, property management, lease obligations, compliance and the future of real estate operations from the team at Hobson AI.",
    "publisher": {
      "@type": "Organization",
      "name": "Hobson AI Limited",
      "url": "https://hobsonschoice.ai"
    }
  }

};

// Breadcrumb helper
export const getBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});
