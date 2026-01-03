// Master English content - This is the source of truth
// When updating content here, also update translations in content-de.ts, content-fr.ts, etc.

export const CONTENT = {
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
    subtitle: "Your documents. Your truth. - Hobson is a specialised AI assistant trained on real estate documents that delivers quick, clear, and trusted answers every time.",
    ctaButton: "See pricing",
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
      pilotLink: "Join our pilot programme",
    },
    company: {
      title: "Company",
      investmentOpportunity: "Investment Opportunity",
      dataProtection: "AI Privacy & Data Protection Policy",
      breachProtocol: "Data Breach Protocol",
      refundPolicy: "Refund Policy",
    },
  },

  // Pricing Section
  pricing: {
    title: "Simple, transparent pricing",
    subtitle: "Start free, scale as you need",
    free: {
      title: "Free",
      price: "£0",
      period: "/month",
      description: "Perfect for trying Hobson",
      features: [
        "5 document uploads",
        "50 questions per month",
        "Basic document analysis",
        "Email support",
      ],
      button: "Start free",
    },
    pro: {
      title: "Pro",
      price: "£49",
      period: "/month",
      description: "For growing property businesses",
      features: [
        "Unlimited document uploads",
        "Unlimited questions",
        "Advanced AI analysis",
        "Priority support",
        "API access",
      ],
      button: "Start Pro",
    },
    enterprise: {
      title: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organisations",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "On-premise option",
      ],
      button: "Contact sales",
    },
  },

  // Features Section
  features: {
    title: "Powerful features for property professionals",
    subtitle: "Everything you need to transform your document workflows",
    items: [
      {
        title: "Document Analysis",
        description: "AI-powered analysis of leases, contracts, and property documents.",
      },
      {
        title: "Instant Answers",
        description: "Ask natural language questions and get accurate answers instantly.",
      },
      {
        title: "Source Citations",
        description: "Every answer includes full source citations for verification and trust.",
      },
      {
        title: "Batch Queries",
        description: "Analyse multiple documents at once with powerful batch operations.",
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
} as const;
