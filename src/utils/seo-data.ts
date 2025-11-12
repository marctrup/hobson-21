export const getOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hobson's Choice AI",
  "legalName": "Hobson's Choice AI Ltd",
  "url": "https://hobsonschoice.ai",
  "logo": {
    "@type": "ImageObject",
    "url": "https://hobsonschoice.ai/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png",
    "width": 200,
    "height": 200
  },
  "description": "AI-powered document intelligence and automation platform for property management professionals. Transform property documents with intelligent analysis and instant answers.",
  "foundingDate": "2024",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "url": "https://hobsonschoice.ai/contact",
    "availableLanguage": ["English"]
  },
  "sameAs": [
    "https://twitter.com/HobsonAI",
    "https://www.linkedin.com/company/hobsons-choice-ai"
  ]
});

export const getHomepageStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Hobson's Choice AI Property Management Software",
  "description": "AI-powered document intelligence for property management. Transform property documents with intelligent analysis, automated insights, and instant answers to complex property questions.",
  "url": "https://hobsonschoice.ai",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "price": "0",
    "priceCurrency": "GBP",
    "description": "Free pilot program available"
  },
  "provider": {
    "@type": "Organization",
    "name": "Hobson's Choice AI",
    "url": "https://hobsonschoice.ai"
  },
  "featureList": [
    "AI Document Analysis",
    "Natural Language Query",
    "Property Intelligence",
    "Automated Insights",
    "Enterprise Security",
    "24/7 Availability"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "45",
    "bestRating": "5"
  }
});

export const getHomepageFAQStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Hobson's Choice AI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Hobson's Choice AI is an AI-powered document intelligence platform for property management professionals. It analyzes property documents, provides automated insights, and answers complex property questions instantly using advanced natural language processing."
      }
    },
    {
      "@type": "Question",
      "name": "How does AI document analysis work for property management?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI analyzes property documents including leases, tenancy agreements, and property records. It extracts key information, identifies important dates and clauses, and provides instant answers to questions about your property portfolio using natural language queries."
      }
    },
    {
      "@type": "Question",
      "name": "Is Hobson AI secure for property data?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Hobson AI uses enterprise-grade security with encryption, secure data storage, and compliance with data protection regulations. All property documents and data are handled with the highest security standards."
      }
    },
    {
      "@type": "Question",
      "name": "What types of property documents can Hobson AI analyze?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Hobson AI can analyze tenancy agreements, leases, deeds of variation, reversionary leases, property schedules, rent review documentation, and other property management documents. The AI understands complex legal language and property-specific terminology."
      }
    },
    {
      "@type": "Question",
      "name": "How much does Hobson AI cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Hobson AI offers a free pilot program for property management professionals. Contact us to learn about our pricing plans and get started with transforming your property document management."
      }
    }
  ]
});

export const getBlogStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Hobson's Choice AI Blog",
  "description": "Latest insights, updates, and expert tips for property management professionals using AI-powered document intelligence and automation tools.",
  "url": "https://hobsonschoice.ai/blog",
  "publisher": {
    "@type": "Organization",
    "name": "Hobson's Choice AI",
    "logo": {
      "@type": "ImageObject",
      "url": "https://hobsonschoice.ai/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png"
    }
  }
});

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