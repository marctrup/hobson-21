// German translation of the homepage content
// Master content is in content.ts (English) - update German translations when English changes

export const CONTENT_DE = {
  // SEO and Meta
  seo: {
    title: "Hobson AI - Immobilienverwaltung mit KI-Dokumentenintelligenz",
    description: "Lassen Sie intelligente KI Ihre Dateien lesen und erhalten Sie klare, sofortige Antworten. Entwickelt für Immobilienprofis - automatisieren Sie Dokumentenaufgaben und gewinnen Sie wichtige Erkenntnisse.",
  },

  // Header
  header: {
    logoAlt: "Hobson",
    nav: {
      blog: "Blog",
      contact: "Kontakt",
      learn: "Lernen",
    },
  },

  // Hero Section
  hero: {
    title: "Bewegen Sie sich in Richtung Klarheit, Einfachheit und erschwinglicher KI,",
    titleHighlight: "ohne die Werkzeuge zu ersetzen, auf die Sie sich verlassen.",
    subtitle: "Ihre Dokumente. Ihre Wahrheit. - Hobson ist ein spezialisierter KI-Assistent, der auf Immobiliendokumenten trainiert wurde und jedes Mal schnelle, klare und vertrauenswürdige Antworten liefert.",
    ctaButton: "Preise ansehen",
  },

  // Hero Visualization
  heroVisualization: {
    mainHeading: "So viele Dokumente, ein wichtiges Datum — so finden Sie es",
    todaysProcess: {
      title: "Heutiger Prozess",
      subtitle: "Sperrig. Komplex. Teuer - Systeme",
    },
    theChallenge: {
      title: "Die Herausforderung",
      subtitle: "Überwältigend • Verstreut • Komplex",
      documents: {
        leaseAgreements: "20 × Mietverträge",
        deedsOfVariation: "12 × Änderungsurkunden",
        reversionaryLeases: "3 × Rückfall-Mietverträge",
        differentDates: "Über 85 verschiedene Termine",
      },
    },
    hobsonAI: {
      title: "Hobson AI",
      subtitle: "Sofort • Genau • Intelligent",
      answer: "Das nächste Mietüberprüfungsdatum ist der 26.06.26 für Knight Frank 23 Hampstead High Street NW3",
      sources: "Quellen:",
      leaseAgreement: "Mietvertrag",
      leaseAgreementRef: "(Seite 5, Klausel 3.2)",
      deedOfVariation: "Änderungsurkunde",
      deedOfVariationRef: "(Seite 2, Klausel 1.1)",
      askPlaceholder: "Hobson fragen",
    },
  },

  // How It Works Section
  howItWorks: {
    title: "So funktioniert es",
    subtitle: "Einblicke und Informationen zu gewinnen könnte nicht einfacher sein",
    steps: [
      {
        title: "Hochladen & Verbinden",
        description: "Laden Sie Ihre Dokumente hoch oder verbinden Sie Ihre bestehenden Systeme. Unsere KI beginnt sofort mit der Verarbeitung und Indexierung Ihrer Inhalte.",
      },
      {
        title: "Fragen stellen",
        description: "Stellen Sie Fragen in natürlicher Sprache zu Ihren Immobilien, Mietverträgen, Verträgen oder anderen Dokumenteninhalten.",
      },
      {
        title: "Erkenntnisse erhalten",
        description: "Erhalten Sie sofortige, genaue Antworten mit vollständigen Quellenangaben und umsetzbaren Empfehlungen.",
      },
    ],
  },

  // CTA Section
  cta: {
    title: "Bereit, KI in Ihr Unternehmen einzuführen?",
    subtitle: "Nehmen Sie an unserem kostenlosen Pilotprogramm teil und erleben Sie die Kraft der KI-gestützten Immobilienintelligenz",
    button: "An unserem kostenlosen Pilot teilnehmen",
  },

  // Footer
  footer: {
    product: {
      title: "Produkt",
      pilotLink: "An unserem Pilotprogramm teilnehmen",
    },
    company: {
      title: "Unternehmen",
      investmentOpportunity: "Investitionsmöglichkeit",
      dataProtection: "KI-Datenschutz & Datenschutzrichtlinie",
      breachProtocol: "Datenschutzverletzungsprotokoll",
      refundPolicy: "Rückerstattungsrichtlinie",
    },
  },

  // Pricing Section
  pricing: {
    title: "Wählen Sie Ihre KI-Reise",
    subtitle: "Revolutionäre Preisgestaltung, die für tatsächliche KI-Arbeit berechnet, nicht für Benutzer oder Immobilien. Skalieren Sie nahtlos mit unbegrenzten Benutzern, Assets und Funktionen.",
    description: "Vergessen Sie Gebühren pro Benutzer. Vergessen Sie Gebühren pro Immobilie. Hobson berechnet für die tatsächliche Arbeit, die unsere KI leistet — gemessen in",
    heuLabel: "Hobson Energy Units (HEUs)",
    currency: "€",
    currencyPosition: "after",
    billingToggle: {
      monthly: "Monatlich",
      annual: "Jährlich",
      save: "20% sparen",
    },
    videoSection: {
      title: "Erfahren Sie mehr über unsere Preisphilosophie mit Sarah",
      subtitle: "(klicken Sie auf das HEU zum Abspielen)",
    },
    plans: {
      free: {
        name: "Kostenlos",
        price: 0,
        tagline: "Für leichte, gelegentliche Aufgaben.",
        features: ["Alle Funktionen", "Bis zu 2 Dokumente hochladen", "Bis zu 5 Fragen pro Monat", "Unbegrenzte Benutzer", "Unbegrenzte Dokumente"],
        button: "Kostenlos starten",
        externalLink: "https://hobson-three.vercel.app/signup",
      },
      essential: {
        name: "Essential",
        priceMonthly: 59.00,
        priceAnnual: 47.20,
        tagline: "Für intensive, häufige Nutzung.",
        features: ["Alles in Essential", "Bis zu 10 Dokumente hochladen", "Bis zu 50 Fragen pro Monat"],
        button: "Essential wählen",
        popular: "⭐ Am beliebtesten",
        stripePriceIds: { monthly: "price_1T3CrJ2NA0ttIOr0PPxXPmVO", annual: "price_1T3Ia92NA0ttIOr0tqhYiiM1" },
      },
      enterprise: {
        name: "Enterprise",
        priceMonthly: 175.00,
        priceAnnual: 140.00,
        tagline: "Für hohe tägliche Anforderungen.",
        features: ["Alles in Essential", "Flexibles Dokumentenlimit", "Flexibles Fragenlimit", "Wissensdatenbank erstellen", "Dedizierter Support"],
        button: "Vertrieb kontaktieren",
        contactLink: true,
      },
    },
    perMonth: "/Monat",
  },

  // Features Section
  features: {
    title: "Funktionen",
    subtitle: "Sprechen Sie links mit Ihren Dokumenten. Sehen Sie rechts Ihr Portfolio zum Leben erwachen. Keine Menüs, nur Flow",
    
    // Feature Showcase (Chat panel)
    showcase: {
      chatTitle: "Mit Hobson chatten",
      online: "Online",
      greeting: ["👋 Hallo!", "Bereit, Ihre Arbeitslast zu optimieren?", "Lassen Sie uns Ihre Aufgaben mühelos gestalten."],
      suggestedActions: "Vorgeschlagene Aktionen:",
      suggestions: [
        "Wichtige Termine für Einheit 2, Technologiepark auflisten",
        "Die Mietüberprüfungsklausel für Einheit 2 Finchley Road zusammenfassen",
        "Welche Mietverträge haben bevorstehende Kündigungsklauseln?",
      ],
      inputPlaceholder: "Hobson fragen...",
    },
    
    // Feature Cards
    cards: [
      {
        title: "Intelligente Chat-Oberfläche",
        badge: "Beta",
        badgeType: "secondary",
        subtitle: "Natürlichsprachliche Abfragen",
        description: "Fragen Sie Hobson alles über Ihre Assets. Erhalten Sie sofortige Antworten auf komplexe Fragen mit unserem KI-Assistenten.",
        features: ["24/7 Verfügbarkeit", "Kontextbewusste Antworten", "Multi-Immobilien-Einblicke"],
      },
      {
        title: "Interaktive Immobilienkartierung",
        badge: "Auf unserer Wunschliste",
        badgeType: "outline",
        subtitle: "Geospatiale Intelligenz",
        description: "Visualisieren Sie Ihr gesamtes Portfolio auf einer interaktiven Karte. Sehen Sie Immobilienstandorte, Marktdaten und geografische Einblicke auf einen Blick.",
        features: ["Standortbasierte Analytik", "Markttrendvisualisierung", "Portfolio-Verteilungseinblicke"],
      },
      {
        title: "Intelligente Dokumentenanalyse",
        badge: "Beta",
        badgeType: "secondary",
        subtitle: "KI-gestützte Extraktion",
        description: "Laden Sie Mietverträge, Gutachten und Verträge hoch. Hobson extrahiert automatisch wichtige Informationen und identifiziert wichtige Termine.",
        features: ["Automatisierte Dateneingabe", "Identifikation wichtiger Termine", "Dokumentenzusammenfassung"],
      },
      {
        title: "Prädiktive Analytik",
        badge: "Auf unserer Wunschliste",
        badgeType: "outline",
        subtitle: "Zukunftsorientierte Einblicke",
        description: "Bleiben Sie Marktveränderungen und Mietvertragsverlängerungen mit KI-gestützten Vorhersagen und Empfehlungen voraus.",
        features: ["Management-Prognosen", "Markttrendanalyse", "Umsatzoptimierung"],
      },
    ],
  },

  // Industry Teams Section
  industryTeams: {
    title: "Entwickelt für Immobilienprofis in der gesamten Branche",
    subtitle: "Ob Mietverträge, Kaufverträge oder Kreditdokumente - sie alle warten darauf, ihre Geheimnisse zu teilen",
    teams: [
      {
        name: "Immobilienverwaltung",
        description: "Optimieren Sie Mieterdokumentation und Mietvertragsanalyse",
        icon: "Building2",
      },
      {
        name: "Immobilienverkauf",
        description: "Beschleunigen Sie Deal-Analysen und Due Diligence",
        icon: "TrendingUp",
      },
      {
        name: "Vermessung",
        description: "Automatisieren Sie Berichtserstellung und Datenextraktion",
        icon: "MapPin",
      },
      {
        name: "Planung",
        description: "Verarbeiten Sie Planungsdokumente und behördliche Anforderungen",
        icon: "PenTool",
      },
      {
        name: "Kreditvergabe",
        description: "Beschleunigen Sie Kreditdokumentation und Risikobewertung",
        icon: "CreditCard",
      },
      {
        name: "Compliance",
        description: "Behalten Sie wiederkehrende Besuche und Dokumentationsaktualisierungen im Blick",
        icon: "Shield",
      },
    ],
  },

  // Key Benefits Section
  benefits: {
    automate: {
      title: "Dokumentenaufgaben automatisieren",
      description: "Sparen Sie Stunden an Verwaltungsarbeit mit sofortigen KI-Antworten.",
    },
    insights: {
      title: "Kritische Erkenntnisse gewinnen",
      description: "Stellen Sie Fragen oder führen Sie Batch-Abfragen durch - Hobson liest und antwortet im Kontext.",
    },
  },

  // Form Section
  form: {
    title: "Bewerben Sie sich für das Hobson AI Pilot-Programm",
    fields: {
      name: {
        label: "Name *",
        placeholder: "Ihr Name",
      },
      company: {
        label: "Unternehmen *",
        placeholder: "Firmenname",
      },
      role: {
        label: "Position *",
        placeholder: "Ihre Position",
      },
      email: {
        label: "E-Mail *",
        placeholder: "ihre@email.com",
      },
      confirmEmail: {
        label: "E-Mail bestätigen *",
        placeholder: "Bestätigen Sie Ihre E-Mail",
      },
      phone: {
        label: "Telefonnummer *",
        placeholder: "Ihre Telefonnummer",
      },
      website: {
        label: "Website",
        placeholder: "ihrefirma.com",
      },
      preferredContact: {
        label: "Wie möchten Sie kontaktiert werden? *",
        placeholder: "Wählen Sie, wie Sie kontaktiert werden möchten",
        options: [
          { value: "email", label: "E-Mail" },
          { value: "phone", label: "Telefon" },
          { value: "either", label: "E-Mail oder Telefon" },
        ],
      },
      businessTypes: {
        label: "Geschäftsart (Mehrfachauswahl möglich) *",
        options: [
          "Immobilienverwaltung",
          "Immobilienverkauf",
          "Vermessung",
          "Architektur und Planung",
          "Kreditvergabe",
          "Compliance",
        ],
      },
      help: {
        label: "Wie kann Hobson Ihrem Unternehmen helfen? (Optional)",
        placeholder: "Erzählen Sie uns von Ihren Dokumentenherausforderungen, Arbeitsabläufen oder spezifischen Anwendungsfällen...",
      },
    },
    submitButton: "Bewerbung absenden",
    emailExistsMessage: "Diese E-Mail wurde bereits für eine Pilot-Bewerbung verwendet. Wenn Sie dieselbe Person sind, kontaktieren Sie uns bitte direkt unter info@hobsonschoice.ai",
    checkingEmailMessage: "E-Mail wird überprüft...",
  },

  // Dialogs
  dialogs: {
    success: {
      title: "Bewerbung erfolgreich eingereicht!",
      message: "Vielen Dank für Ihr Interesse am Hobson AI Pilot. Wir werden Ihre Bewerbung prüfen und uns bald mit den nächsten Schritten bei Ihnen melden.",
      closeButton: "Schließen",
    },
    antiBot: {
      title: "Kurze Sicherheitsüberprüfung",
      message: "Bitte lösen Sie diese einfache Rechenaufgabe, um zu bestätigen, dass Sie ein Mensch sind:",
      submitButton: "Bestätigen & Absenden",
      placeholder: "Ihre Antwort",
    },
  },

  // Toast Messages
  toasts: {
    submissionFailed: {
      title: "Einreichung fehlgeschlagen",
      description: "Bei der Einreichung Ihrer Bewerbung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    },
    incorrectAnswer: {
      title: "Falsche Antwort",
      description: "Bitte lösen Sie die Rechenaufgabe korrekt.",
    },
  },

  // Common
  common: {
    learnMore: "Mehr erfahren",
    getStarted: "Loslegen",
    contactUs: "Kontaktieren Sie uns",
  },

  // Contact Page
  contact: {
    title: "Kontakt",
    subtitle: "Wir freuen uns, von Ihnen zu hören!",
    form: {
      name: { label: "Name *", placeholder: "Ihr vollständiger Name" },
      phone: { label: "Telefon", placeholder: "Ihre Telefonnummer" },
      email: { label: "E-Mail *", placeholder: "ihre.email@beispiel.com" },
      confirmEmail: { label: "E-Mail bestätigen *", placeholder: "Bestätigen Sie Ihre E-Mail-Adresse" },
      reason: { label: "Grund der Anfrage *", placeholder: "Bitte beschreiben Sie Ihre Anfrage..." },
      submit: "Nachricht senden",
      submitting: "Wird gesendet...",
    },
    validation: {
      missingInfo: { title: "Fehlende Informationen", description: "Bitte füllen Sie alle erforderlichen Felder aus." },
      emailMismatch: { title: "E-Mail stimmt nicht überein", description: "Die E-Mail-Adressen müssen übereinstimmen." },
      tooManyRequests: { title: "Zu viele Anfragen", description: "Bitte warten Sie einige Minuten, bevor Sie eine weitere Nachricht senden." },
      sendFailed: { title: "Senden fehlgeschlagen", description: "Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut." },
      incorrectAnswer: { title: "Falsche Antwort", description: "Bitte lösen Sie die Rechenaufgabe korrekt." },
    },
    success: {
      title: "Nachricht gesendet!",
      description: "Vielen Dank für Ihre Anfrage. Wir werden uns bald bei Ihnen melden.",
    },
    antiBot: {
      title: "Kurze Sicherheitsüberprüfung",
      description: "Bitte lösen Sie diese einfache Rechenaufgabe, um zu bestätigen, dass Sie ein Mensch sind:",
      cancel: "Abbrechen",
      submit: "Nachricht absenden",
      submitting: "Wird gesendet...",
    },
  },

  // Navigation (used in GlobalHeader and Homepage)
  navigation: {
    links: [
      { to: "/blog", label: "Blog", title: "Einblicke in die Immobilienverwaltung" },
      { to: "/contact", label: "Kontakt", title: "Kontakt zum Immobiliensoftware-Support" },
      { to: "/learn", label: "Lernen", title: "Lernressourcen" },
    ],
  },

  // Shared Footer (used in HomepageFooter)
  sharedFooter: {
    product: "Produkt",
    features: "Funktionen",
    joinPilot: "Pilotprogramm beitreten",
    company: "Unternehmen",
    blog: "Blog",
    contact: "Kontakt",
    learn: "Lernen",
    investmentOpportunity: "Investitionsmöglichkeit",
    dataProtection: "KI-Datenschutzrichtlinie",
    breachProtocol: "Datenschutzverletzungsprotokoll",
    refundPolicy: "Rückerstattungsrichtlinie",
    copyright: "© 2024 Hobson's Choice AI. Alle Rechte vorbehalten.",
  },

  // Chatbot UI
  chatbot: {
    title: "Hobson KI-Hilfe",
    welcomeMessage: "Hallo! Was möchten Sie gerne wissen?",
    placeholder: "Fragen Sie über Hobson KI...",
    tooltip: "Brauchen Sie Hilfe? Chatten Sie mit Hobson!",
    clearChat: "Chat gelöscht",
    clearChatDescription: "Neues Gespräch starten",
    error: "Fehler",
    errorDescription: "Antwort konnte nicht abgerufen werden. Bitte versuchen Sie es erneut.",
    // Quick questions for chatbot (German translations)
    quickQuestions: [
      { full: "Wie sind Einheiten, Gruppen, Portfolios und Dokumente in Hobson angeordnet?", short: "Organisation?" },
      { full: "Welche Dateitypen werden unterstützt?", short: "Dateitypen?" },
      { full: "Welche Arten von Dokumenten kann Hobson lesen?", short: "Dokumenttypen?" },
      { full: "Wie bekomme ich Dokumente zu Hobson?", short: "Dokumente hochladen?" },
      { full: "Funktioniert Hobson auf dem Handy?", short: "Mobil?" },
      { full: "Wem gehören die Daten und Ausgaben?", short: "Dateneigentum?" },
      { full: "Wie nutzt Hobson OpenAI?", short: "OpenAI-Nutzung?" },
      { full: "Speichert OpenAI meine Dokumente?", short: "Speicherung?" },
      { full: "Verwendet OpenAI meine Daten zum Trainieren ihrer Modelle?", short: "Training?" },
      { full: "Welche Daten sendet Hobson an OpenAI?", short: "Gesendete Daten?" },
      { full: "Wo werden meine Dokumente tatsächlich gespeichert?", short: "Speicherort?" },
      { full: "Warum muss Hobson überhaupt etwas an OpenAI senden?", short: "Warum OpenAI?" },
      { full: "Wer kann meine Dokumente sehen?", short: "Zugang?" },
      { full: "Wie schützt Hobson meine Daten bei der Nutzung von OpenAI?", short: "Schutz?" },
      { full: "Weiß OpenAI, wer ich bin oder hat Details zu meinen Immobilienbeständen?", short: "Datenschutz?" },
      { full: "Was passiert technisch, wenn ein Dokument hochgeladen wird?", short: "Upload-Prozess?" },
      { full: "Was passiert, wenn ich eine Frage stelle?", short: "Frageprozess?" },
      { full: "Wie lange braucht Hobson, um ein Dokument zu lesen?", short: "Verarbeitungszeit?" },
      { full: "Kann Hobson auf die Informationen meines Unternehmens trainiert werden?", short: "Training?" },
      { full: "Kann ich eine Einheit manuell hinzufügen, ohne ein Dokument hochzuladen?", short: "Manuelle Einheiten?" },
      { full: "Welche Ebene sollte ich beim Stellen einer Frage verwenden?", short: "Frageebenen?" },
      { full: "Was soll ich tun, wenn ich eine schlechte Antwort bekomme?", short: "Schlechte Antworten?" },
      { full: "Wie sollte ich meine Prompts für die besten Ergebnisse strukturieren?", short: "Prompt-Tipps?" },
      { full: "Kann Hobson sich mit unseren Systemen verbinden?", short: "Integrationen?" },
      { full: "Kann ich den Zugang kontrollieren?", short: "Zugangskontrolle?" },
      { full: "Was ist ein HEU?", short: "HEU?" },
      { full: "Wie viel kosten verschiedene Aufgaben in HEUs?", short: "HEU-Kosten?" },
      { full: "Wie kann ich mein Abonnement upgraden?", short: "Upgrade?" },
      { full: "Wie kann ich mein Abonnement downgraden?", short: "Downgrade?" },
      { full: "Wie kann ich mein Abonnement kündigen?", short: "Kündigen?" },
      { full: "Wie kann ich meine Rechnungsinformationen ändern?", short: "Abrechnung?" },
      { full: "Wie lade ich meine Rechnungen herunter?", short: "Rechnungen?" },
      { full: "Wie bekomme ich mehr Credits?", short: "Mehr Credits?" },
      { full: "Wann wird mein Kreditlimit zurückgesetzt?", short: "Credit-Reset?" },
      { full: "Wie sehe ich die verbleibenden Credits in einem Workspace?", short: "Credits prüfen?" },
      { full: "Kann ich kostenlose Credits bekommen?", short: "Gratis Credits?" },
    ],
  },
} as const;
