export const CONTENT = {
  // SEO and Meta
  seo: {
    title: "Hobson AI - Property management with AI Document Intelligence",
    description: "Let smart AI read your files and give you clear, instant answers. Built for property professionals - automate document tasks and surface critical insights.",
  },

  // Header
  header: {
    logoAlt: "Hobson",
  },

  // Hero Section
  hero: {
    title: "AI-Powered Answers from the Source of Truth: Your Documents",
    subtitle: "Hobson is your AI assistant for property documents — delivering instant, verified answers with full citations, built to support confident, efficient decision-making.",
    ctaButton: "Join Property Management AI Pilot",
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

  // How It Works Section
  howItWorks: {
    title: "How It Works",
    steps: [
      "Upload or connect your documents.",
      "Ask questions or run batch insight queries.",
      "Get fast, cited, useful answers.", 
      "Apply to join our pilot if you haven't already.",
    ],
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
} as const;