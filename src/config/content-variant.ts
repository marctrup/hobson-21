export const CONTENT_VARIANT = {
  // SEO and Meta
  seo: {
    title: "Hobson AI - Property Management Software with AI Document Intelligence",
    description: "Stop wasting time on manual document review. Our AI-powered platform instantly extracts insights from your property files and delivers answers that drive decisions.",
  },

  // Header
  header: {
    logoAlt: "Hobson",
  },

  // Hero Section
  hero: {
    title: "Smart Documents That Want to Help You",
    subtitle: "AI gives them a voice — now your files can finally speak up and support you.",
    ctaButton: "Apply for Free Pilot Access",
  },

  // Industry Teams Section
  industryTeams: {
    title: "Pilot Partners from Leading Property Firms",
    subtitle: "We're working with select property professionals to develop the perfect document intelligence solution",
    teams: [
      {
        name: "Property Management",
        description: "Automate lease reviews and tenant document processing",
        icon: "Building2",
      },
      {
        name: "Property Sales",
        description: "Instant due diligence and contract analysis",
        icon: "TrendingUp",
      },
      {
        name: "Surveying",
        description: "Smart report analysis and data extraction",
        icon: "MapPin",
      },
      {
        name: "Planning",
        description: "Streamline regulatory document processing",
        icon: "PenTool",
      },
      {
        name: "Lending",
        description: "Accelerate loan documentation and risk evaluation",
        icon: "CreditCard",
      },
      {
        name: "Compliance",
        description: "Automated compliance monitoring and reporting",
        icon: "Shield",
      },
    ],
  },

  // Key Benefits Section
  benefits: {
    automate: {
      title: "Eliminate Manual Document Work",
      description: "Replace hours of reading with instant AI-powered analysis and extraction.",
    },
    insights: {
      title: "Make Faster Decisions", 
      description: "Get immediate answers to complex questions with full source citations and context.",
    },
  },

  // How It Works Section
  howItWorks: {
    title: "How It Works",
    steps: [
      "Connect your existing document systems or upload files.",
      "Ask specific questions or run automated analysis queries.",
      "Receive instant, accurate answers with source citations.", 
      "Join our exclusive pilot program for early access.",
    ],
  },

  // Form Section
  form: {
    title: "Apply for Free Pilot Access",
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
          "Planning",
          "Lending",
          "Compliance",
        ],
      },
      help: {
        label: "What's your biggest document challenge? (Optional)",
        placeholder: "Describe your current document workflow pain points, time-consuming tasks, or specific automation needs...",
      },
    },
    submitButton: "Apply for the Pilot Program",
    emailExistsMessage: "This email has already been used for an early access request. If you're the same person, please contact us directly at info@hobsonschoice.ai",
    checkingEmailMessage: "Checking email...",
  },

  // Dialogs
  dialogs: {
    success: {
      title: "Early Access Request Submitted!",
      message: "Thank you for your interest in Hobson AI. We'll review your request and contact you soon with early access details and next steps.",
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
      description: "There was an error submitting your request. Please try again.",
    },
    incorrectAnswer: {
      title: "Incorrect Answer", 
      description: "Please solve the math problem correctly.",
    },
  },
} as const;