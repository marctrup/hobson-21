export const getHomepageStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Hobson's Choice AI Property Management Software",
  "description": "AI-powered document intelligence for property management. Transform property documents with intelligent analysis, automated insights, and instant answers to complex property questions.",
  "url": "https://hobsonschoice.ai/property-management-software",
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
  ]
});