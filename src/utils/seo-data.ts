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

  faqPage: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Hobson AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hobson AI is an AI-native platform built for property operators, occupiers and owners. It reads your leases and property documents, manages your compliance obligations and executes workflows automatically — delivering work, not just answers. It is purpose-built for real estate, not a generic AI tool adapted for it."
        }
      },
      {
        "@type": "Question",
        "name": "Who is Hobson AI for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hobson is for any business where property is a material operating cost — property managers, asset managers, retail operators, hospitality businesses, corporate real estate functions and anyone managing commercial leases, compliance obligations or property portfolios. If you have leases, break clauses, rent reviews or compliance deadlines, Hobson is built for you."
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
        "name": "How is Hobson different from generic AI tools like ChatGPT or Microsoft Copilot?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Generic AI tools produce plausible answers. Hobson produces correct, referenced and auditable ones — purpose-built for the regulated decisions that matter in real estate. It is fine-tuned on proprietary property datasets, designed for auditability and governance, and operates inside your existing workflows. It also learns your business specifically through the Knowledge Base — something no horizontal AI tool does."
        }
      },
      {
        "@type": "Question",
        "name": "How does Hobson pricing work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hobson offers four tiers billed monthly or annually upfront, with a 20% saving on annual billing. Tier 1 starts at £19.50 per month for a single seat with document query capability. Tiers 2 to 4 unlock the Knowledge Base, workflow automation and action memory, from £165 per month for 2 seats up to £450 per month for 10 seats. Additional document ingestion is charged at £0.30 per document, charged once only — the same document is never charged twice. Top-up question packs are available at £7.50 per 100 questions. Enterprise pricing is available for portfolios with more than 10 users."
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
