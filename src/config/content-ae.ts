// UAE English content - Based on UK English with AED currency
// Currency conversion: 1 GBP ≈ 4.6 AED (rounded for clean pricing)

export const CONTENT_AE = {
  // SEO and Meta
  seo: {
    title: "Hobson AI - Property management with AI Document Intelligence",
    description: "Let smart AI read your files and give you clear, instant answers. Built for property professionals - automate document tasks and surface critical insights.",
  },

  // Header
  header: {
    logoAlt: "Hobson",
    nav: {
      blog: "Blog",
      contact: "Contact",
      learn: "Learn",
    },
  },

  // Hero Section
  hero: {
    title: "Move toward clarity, simplicity, and affordable AI,",
    titleHighlight: "without replacing the tools you rely on.",
    subtitle: "Your documents. Your truth. - Hobson is a specialized AI assistant trained on real estate documents that delivers quick, clear, and trusted answers every time.",
    ctaButton: "See pricing",
  },

  // Hero Visualization
  heroVisualization: {
    mainHeading: "So many docs, one key date — here's how to find it",
    todaysProcess: {
      title: "Today's Process",
      subtitle: "Bulky. Complex. Expensive - Systems",
    },
    theChallenge: {
      title: "The Challenge",
      subtitle: "Overwhelming • Scattered • Complex",
      documents: {
        leaseAgreements: "20 × Lease Agreements",
        deedsOfVariation: "12 × Deeds of Variation",
        reversionaryLeases: "3 × Reversionary Leases",
        differentDates: "Over 85 different dates",
      },
    },
    hobsonAI: {
      title: "Hobson AI",
      subtitle: "Instant • Accurate • Intelligent",
      answer: "The next rent review date is 26/06/26 for Emirates Properties, Dubai Marina Tower 5",
      sources: "Sources:",
      leaseAgreement: "Lease Agreement",
      leaseAgreementRef: "(Page 5, Clause 3.2)",
      deedOfVariation: "Deed of Variation",
      deedOfVariationRef: "(Page 2, Clause 1.1)",
      askPlaceholder: "Ask Hobson",
    },
  },

  // How It Works Section
  howItWorks: {
    title: "How It Works",
    subtitle: "Gaining insight and information couldn't be easier",
    steps: [
      {
        title: "Upload & Connect",
        description: "Upload your documents or connect your existing systems. Our AI instantly begins processing and indexing your content.",
      },
      {
        title: "Ask Questions",
        description: "Ask natural language questions about your properties, leases, contracts, or any document content.",
      },
      {
        title: "Get Insights",
        description: "Receive instant, accurate answers with full source citations and actionable recommendations.",
      },
    ],
  },

  // CTA Section
  cta: {
    title: "Ready to introduce AI into your business?",
    subtitle: "Join our free pilot program and experience the power of AI-driven property intelligence",
    button: "Join our free pilot",
  },

  // Footer
  footer: {
    product: {
      title: "Product",
      pilotLink: "Join our pilot program",
    },
    company: {
      title: "Company",
      investmentOpportunity: "Investment Opportunity",
      dataProtection: "AI Privacy & Data Protection Policy",
      breachProtocol: "Data Breach Protocol",
      refundPolicy: "Refund Policy",
    },
  },

  // Pricing Section - AED Currency
  pricing: {
    title: "Choose Your AI Journey",
    subtitle: "Revolutionary pricing that charges for actual AI work, not users or properties. Scale seamlessly with unlimited users, assets and features.",
    description: "Forget per-user fees. Forget per-property fees. Hobson charges for the actual work our AI does — measured in",
    heuLabel: "Hobson Energy Units (HEUs)",
    currency: "AED",
    currencyPosition: "before",
    billingToggle: {
      monthly: "Monthly",
      annual: "Annual",
      save: "Save 20%",
    },
    videoSection: {
      title: "Understand more about our pricing philosophy with Sarah",
      subtitle: "(click on the HEU to play)",
    },
    plans: {
      free: {
        name: "Free",
        price: 0,
        heus: 18,
        tagline: "For light, occasional tasks.",
        features: ["All features", "Unlimited users", "Unlimited documents"],
        button: "Start Free",
      },
      essential: {
        name: "Essential",
        priceMonthly: 90,
        priceAnnual: 72,
        heus: 275,
        tagline: "For steady monthly workloads.",
        features: ["Everything in Free", "Priority support"],
        button: "Choose Essential",
      },
      essentialPlus: {
        name: "Essential Plus",
        priceMonthly: 230,
        priceAnnual: 185,
        heus: 700,
        tagline: "For heavy, frequent use.",
        features: ["Everything in Essential"],
        button: "Choose Essential +",
        popular: "⭐ Most Popular",
      },
      enterprise: {
        name: "Enterprise",
        priceMonthly: 685,
        priceAnnual: 550,
        heus: 2000,
        tagline: "For high-volume, daily demands.",
        features: ["Everything in Plus", "Build a knowledge base", "Dedicated support"],
        button: "Contact Sales",
      },
    },
    perMonth: "/month",
  },

  // Features Section
  features: {
    title: "Features",
    subtitle: "Talk to your documents on the left. See your portfolio come alive on the right. No menus, just flow",
    
    // Feature Showcase (Chat panel)
    showcase: {
      chatTitle: "Chat with Hobson",
      online: "Online",
      greeting: ["👋 Hi there!", "Ready to streamline your workload?", "Let's make your tasks effortless."],
      suggestedActions: "Suggested actions:",
      suggestions: [
        "List key dates for Unit 2, Business Bay",
        "Summarize the rent review clause for Tower A, DIFC",
        "Which leases have break clauses coming up?",
      ],
      inputPlaceholder: "Ask Hobson...",
    },
    
    // Feature Cards
    cards: [
      {
        title: "Intelligent Chat Interface",
        badge: "Beta",
        badgeType: "secondary",
        subtitle: "Natural language queries",
        description: "Ask Hobson anything about your assets. Get instant answers to complex questions with our conversational AI assistant.",
        features: ["24/7 availability", "Context-aware responses", "Multi-property insights"],
      },
      {
        title: "Interactive Property Mapping",
        badge: "On our wish list",
        badgeType: "outline",
        subtitle: "Geospatial intelligence",
        description: "Visualize your entire portfolio on an interactive map. See property locations, market data, and geographical insights at a glance.",
        features: ["Location-based analytics", "Market trend visualization", "Portfolio distribution insights"],
      },
      {
        title: "Smart Document Analysis",
        badge: "Beta",
        badgeType: "secondary",
        subtitle: "AI-powered extraction",
        description: "Upload lease agreements, surveys, and contracts. Hobson extracts key information and identifies important dates automatically.",
        features: ["Automated data entry", "Key date identification", "Document summarization"],
      },
      {
        title: "Predictive Analytics",
        badge: "On our wish list",
        badgeType: "outline",
        subtitle: "Future-focused insights",
        description: "Get ahead of market changes and lease renewals with AI-driven predictions and recommendations.",
        features: ["Management forecasting", "Market trend analysis", "Revenue optimization"],
      },
    ],
  },

  // Industry Teams Section
  industryTeams: {
    title: "Built for Property Professionals Across the Industry",
    subtitle: "Whether it's leases, sales contracts, or lending documents - they're all waiting to share their secrets",
    teams: [
      {
        name: "Property Management",
        description: "Streamline tenant documentation and lease analysis",
        icon: "Building2",
      },
      {
        name: "Property Sales",
        description: "Accelerate deal analysis and due diligence",
        icon: "TrendingUp",
      },
      {
        name: "Surveying",
        description: "Automate report generation and data extraction",
        icon: "MapPin",
      },
      {
        name: "Planning",
        description: "Process planning documents and regulatory requirements",
        icon: "PenTool",
      },
      {
        name: "Lending",
        description: "Speed up loan documentation and risk assessment",
        icon: "CreditCard",
      },
      {
        name: "Compliance",
        description: "Keep on top of repeat visits and documentation updates",
        icon: "Shield",
      },
    ],
  },

  // Key Benefits Section
  benefits: {
    automate: {
      title: "Automate Document Tasks",
      description: "Free up hours of admin work with instant AI responses.",
    },
    insights: {
      title: "Surface Critical Insights",
      description: "Ask questions or run batch queries—Hobson reads and responds in context.",
    },
  },

  // Form Section
  form: {
    title: "Apply to Join the Hobson AI Pilot",
    fields: {
      name: {
        label: "Name *",
        placeholder: "Your name",
      },
      company: {
        label: "Company *",
        placeholder: "Company name",
      },
      role: {
        label: "Role *",
        placeholder: "Your role",
      },
      email: {
        label: "Email *",
        placeholder: "your@email.com",
      },
      confirmEmail: {
        label: "Confirm Email *",
        placeholder: "Confirm your email",
      },
      phone: {
        label: "Phone Number *",
        placeholder: "Your phone number",
      },
      website: {
        label: "Website",
        placeholder: "yourcompany.com",
      },
      preferredContact: {
        label: "How would you prefer to be contacted? *",
        placeholder: "Select how you'd like to be contacted",
        options: [
          { value: "email", label: "Email" },
          { value: "phone", label: "Phone" },
          { value: "either", label: "Either Email or Phone" },
        ],
      },
      businessTypes: {
        label: "Business Type (Select all that apply) *",
        options: [
          "Property Management",
          "Property Sales",
          "Surveying",
          "Architecture and Planning",
          "Lending",
          "Compliance",
        ],
      },
      help: {
        label: "How can Hobson help your business? (Optional)",
        placeholder: "Tell us about your document challenges, workflows, or specific use cases...",
      },
    },
    submitButton: "Submit Application",
    emailExistsMessage: "This email has already been used for a pilot application. If you're the same person, please contact us directly at info@hobsonschoice.ai",
    checkingEmailMessage: "Checking email...",
  },

  // Dialogs
  dialogs: {
    success: {
      title: "Application Submitted Successfully!",
      message: "Thank you for your interest in the Hobson AI pilot. We'll review your application and get back to you soon with next steps.",
      closeButton: "Close",
    },
    antiBot: {
      title: "Quick Security Check",
      message: "Please solve this simple math problem to verify you're human:",
      submitButton: "Verify & Submit",
      placeholder: "Your answer",
    },
  },

  // Toast Messages
  toasts: {
    submissionFailed: {
      title: "Submission Failed",
      description: "There was an error submitting your application. Please try again.",
    },
    incorrectAnswer: {
      title: "Incorrect Answer",
      description: "Please solve the math problem correctly.",
    },
  },

  // Common
  common: {
    learnMore: "Learn more",
    getStarted: "Get started",
    contactUs: "Contact us",
  },

  // Contact Page
  contact: {
    title: "Contact Us",
    subtitle: "We would be delighted to talk to you!",
    form: {
      name: { label: "Name *", placeholder: "Your full name" },
      phone: { label: "Phone", placeholder: "Your phone number" },
      email: { label: "Email *", placeholder: "your.email@example.com" },
      confirmEmail: { label: "Confirm Email *", placeholder: "Confirm your email address" },
      reason: { label: "Reason for Enquiry *", placeholder: "Please describe your enquiry..." },
      submit: "Send Message",
      submitting: "Sending...",
    },
    validation: {
      missingInfo: { title: "Missing Information", description: "Please fill in all required fields." },
      emailMismatch: { title: "Email Mismatch", description: "Email addresses must match." },
      tooManyRequests: { title: "Too Many Requests", description: "Please wait a few minutes before submitting another message." },
      sendFailed: { title: "Failed to Send", description: "There was an error sending your message. Please try again." },
      incorrectAnswer: { title: "Incorrect Answer", description: "Please solve the math problem correctly." },
    },
    success: {
      title: "Message Sent!",
      description: "Thank you for your enquiry. We'll get back to you soon.",
    },
    antiBot: {
      title: "Quick Security Check",
      description: "Please solve this simple math problem to verify you're human:",
      cancel: "Cancel",
      submit: "Submit Message",
      submitting: "Submitting...",
    },
  },

  // Navigation (used in GlobalHeader and Homepage)
  navigation: {
    links: [
      { to: "/blog", label: "Blog", title: "Property Management Insights" },
      { to: "/contact", label: "Contact", title: "Contact Real Estate Software Support" },
      { to: "/learn", label: "Learn", title: "Learning Resources" },
    ],
  },

  // Shared Footer (used in HomepageFooter)
  sharedFooter: {
    product: "Product",
    features: "Features",
    joinPilot: "Join our pilot program",
    company: "Company",
    blog: "Blog",
    contact: "Contact",
    learn: "Learn",
    investmentOpportunity: "Investment Opportunity",
    dataProtection: "AI Privacy & Data Protection Policy",
    breachProtocol: "Data Breach Protocol",
    refundPolicy: "Refund Policy",
    copyright: "© 2024 Hobson's Choice AI. All rights reserved.",
  },

  // Chatbot UI
  chatbot: {
    title: "Hobson AI Help",
    welcomeMessage: "Hey there! What would you like to know about?",
    placeholder: "Ask about Hobson AI...",
    tooltip: "Need help? Chat with Hobson!",
    clearChat: "Chat cleared",
    clearChatDescription: "Starting fresh conversation",
    error: "Error",
    errorDescription: "Failed to get response. Please try again.",
    // Quick questions for chatbot (same as English)
    quickQuestions: [
      { full: "How are units, groups, portfolios, and documents arranged in Hobson?", short: "Organization?" },
      { full: "Which file types are supported?", short: "File types?" },
      { full: "What types of documents can Hobson read?", short: "Doc types?" },
      { full: "How to get documents to Hobson", short: "Upload docs?" },
      { full: "Does Hobson work on mobile?", short: "Mobile?" },
      { full: "Who owns the data and outputs?", short: "Data ownership?" },
      { full: "How does Hobson use OpenAI?", short: "OpenAI usage?" },
      { full: "Does OpenAI store my documents?", short: "Storage?" },
      { full: "Does OpenAI use my data to train their models?", short: "Training?" },
      { full: "What data does Hobson send to OpenAI?", short: "Data sent?" },
      { full: "Where are my documents actually stored?", short: "Storage?" },
      { full: "Why does Hobson need to send anything to OpenAI at all?", short: "Why OpenAI?" },
      { full: "Who can see my documents?", short: "Access?" },
      { full: "How does Hobson protect my data when using OpenAI?", short: "Protection?" },
      { full: "Does OpenAI know who I am or hold details of my property holdings?", short: "Privacy?" },
      { full: "What happens technically when a document is uploaded?", short: "Upload process?" },
      { full: "What happens when I ask a question?", short: "Question process?" },
      { full: "How long does Hobson take to read a document?", short: "Processing time?" },
      { full: "Can Hobson be trained on my company's information?", short: "Training?" },
      { full: "Can I add a unit manually without uploading a document?", short: "Manual units?" },
      { full: "Which level should I use when asking a question?", short: "Question levels?" },
      { full: "What should I do if I get a poor answer?", short: "Poor answers?" },
      { full: "How should I structure my prompts for the best results?", short: "Prompt tips?" },
      { full: "Can Hobson connect to our systems?", short: "Integrations?" },
      { full: "Can I control who has access?", short: "Access control?" },
      { full: "What is a HEU?", short: "HEU?" },
      { full: "How much do different tasks cost in HEUs?", short: "HEU costs?" },
      { full: "How can I upgrade my subscription?", short: "Upgrade?" },
      { full: "How can I downgrade my subscription?", short: "Downgrade?" },
      { full: "How can I cancel my subscription?", short: "Cancel?" },
      { full: "How can I change my billing information?", short: "Billing?" },
      { full: "How do I download my invoices?", short: "Invoices?" },
      { full: "How do I get more credits?", short: "More credits?" },
      { full: "When does my credit limit reset?", short: "Credit reset?" },
      { full: "How do I see the remaining credits in a workspace?", short: "Check credits?" },
      { full: "Can I get free credits?", short: "Free credits?" },
    ],
  },
} as const;
