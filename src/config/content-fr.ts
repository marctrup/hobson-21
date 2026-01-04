// French content - Translated from content.ts (English)
// Master content is in content.ts (English) - update French translations when English changes

export const CONTENT_FR = {
  // SEO and Meta
  seo: {
    title: "Hobson AI - Gestion immobilière avec Intelligence Documentaire IA",
    description: "Laissez une IA intelligente lire vos fichiers et vous donner des réponses claires et instantanées. Conçu pour les professionnels de l'immobilier - automatisez les tâches documentaires et révélez des informations critiques.",
  },

  // Header
  header: {
    logoAlt: "Hobson",
    nav: {
      blog: "Blog",
      contact: "Contact",
      learn: "Apprendre",
    },
  },

  // Hero Section
  hero: {
    title: "Avancez vers la clarté, la simplicité et une IA abordable,",
    titleHighlight: "sans remplacer les outils sur lesquels vous comptez.",
    subtitle: "Vos documents. Votre vérité. - Hobson est un assistant IA spécialisé formé sur les documents immobiliers qui fournit des réponses rapides, claires et fiables à chaque fois.",
    ctaButton: "Voir les tarifs",
  },

  // Hero Visualization
  heroVisualization: {
    mainHeading: "Tant de documents, une date clé — voici comment la trouver",
    todaysProcess: {
      title: "Le processus actuel",
      subtitle: "Des systèmes encombrants, complexes et coûteux",
    },
    theChallenge: {
      title: "Le défi",
      subtitle: "Écrasant • Dispersé • Complexe",
      documents: {
        leaseAgreements: "20 × Contrats de bail",
        deedsOfVariation: "12 × Avenants",
        reversionaryLeases: "3 × Baux réversionnaires",
        differentDates: "Plus de 85 dates différentes",
      },
    },
    hobsonAI: {
      title: "Hobson AI",
      subtitle: "Instantané • Précis • Intelligent",
      answer: "La prochaine date de révision de loyer est le 26/06/26 pour Knight Frank 23 Hampstead High Street NW3",
      sources: "Sources :",
      leaseAgreement: "Contrat de bail",
      leaseAgreementRef: "(Page 5, Clause 3.2)",
      deedOfVariation: "Avenant",
      deedOfVariationRef: "(Page 2, Clause 1.1)",
      askPlaceholder: "Demandez à Hobson",
    },
  },

  // How It Works Section
  howItWorks: {
    title: "Comment ça marche",
    subtitle: "Obtenir des informations et des perspectives n'a jamais été aussi simple",
    steps: [
      {
        title: "Téléchargez et connectez",
        description: "Téléchargez vos documents ou connectez vos systèmes existants. Notre IA commence instantanément à traiter et indexer votre contenu.",
      },
      {
        title: "Posez des questions",
        description: "Posez des questions en langage naturel sur vos propriétés, baux, contrats ou tout contenu documentaire.",
      },
      {
        title: "Obtenez des insights",
        description: "Recevez des réponses instantanées et précises avec des citations complètes des sources et des recommandations exploitables.",
      },
    ],
  },

  // CTA Section
  cta: {
    title: "Prêt à introduire l'IA dans votre entreprise ?",
    subtitle: "Rejoignez notre programme pilote gratuit et découvrez la puissance de l'intelligence immobilière pilotée par l'IA",
    button: "Rejoindre notre pilote gratuit",
  },

  // Footer
  footer: {
    product: {
      title: "Produit",
      pilotLink: "Rejoindre notre programme pilote",
    },
    company: {
      title: "Entreprise",
      investmentOpportunity: "Opportunité d'investissement",
      dataProtection: "Politique de confidentialité et de protection des données IA",
      breachProtocol: "Protocole de violation de données",
      refundPolicy: "Politique de remboursement",
    },
  },

  // Pricing Section
  pricing: {
    title: "Choisissez votre parcours IA",
    subtitle: "Une tarification révolutionnaire qui facture le travail réel de l'IA, pas les utilisateurs ou les propriétés. Évoluez facilement avec des utilisateurs, des actifs et des fonctionnalités illimités.",
    description: "Oubliez les frais par utilisateur. Oubliez les frais par propriété. Hobson facture le travail réel que notre IA effectue — mesuré en",
    heuLabel: "Unités d'Énergie Hobson (HEUs)",
    currency: "€",
    currencyPosition: "after",
    billingToggle: {
      monthly: "Mensuel",
      annual: "Annuel",
      save: "Économisez 20%",
    },
    videoSection: {
      title: "Comprenez mieux notre philosophie tarifaire avec Sarah",
      subtitle: "(cliquez sur le HEU pour lire)",
    },
    plans: {
      free: {
        name: "Gratuit",
        price: 0,
        heus: 18,
        tagline: "Pour les tâches légères et occasionnelles.",
        features: ["Toutes les fonctionnalités", "Utilisateurs illimités", "Documents illimités"],
        button: "Commencer gratuitement",
      },
      essential: {
        name: "Essentiel",
        priceMonthly: 22.50,
        priceAnnual: 18.00,
        heus: 275,
        tagline: "Pour des charges de travail mensuelles régulières.",
        features: ["Tout dans Gratuit", "Support prioritaire"],
        button: "Choisir Essentiel",
      },
      essentialPlus: {
        name: "Essentiel Plus",
        priceMonthly: 57.50,
        priceAnnual: 46.00,
        heus: 700,
        tagline: "Pour une utilisation intensive et fréquente.",
        features: ["Tout dans Essentiel"],
        button: "Choisir Essentiel +",
        popular: "⭐ Le plus populaire",
      },
      enterprise: {
        name: "Entreprise",
        priceMonthly: 172.00,
        priceAnnual: 137.50,
        heus: 2000,
        tagline: "Pour des demandes quotidiennes à haut volume.",
        features: ["Tout dans Plus", "Construire une base de connaissances", "Support dédié"],
        button: "Contacter les ventes",
      },
    },
    perMonth: "/mois",
  },

  // Features Section
  features: {
    title: "Fonctionnalités",
    subtitle: "Parlez à vos documents à gauche. Voyez votre portefeuille prendre vie à droite. Pas de menus, juste du flux",
    
    // Feature Showcase (Chat panel)
    showcase: {
      chatTitle: "Discutez avec Hobson",
      online: "En ligne",
      greeting: ["👋 Bonjour !", "Prêt à simplifier votre charge de travail ?", "Rendons vos tâches sans effort."],
      suggestedActions: "Actions suggérées :",
      suggestions: [
        "Lister les dates clés pour Unité 2, Parc Technologique",
        "Résumer la clause de révision de loyer pour Unité 2 Rue Finchley",
        "Quels baux ont des clauses de rupture à venir ?",
      ],
      inputPlaceholder: "Demandez à Hobson...",
    },
    
    // Feature Cards
    cards: [
      {
        title: "Interface de chat intelligente",
        badge: "Bêta",
        badgeType: "secondary",
        subtitle: "Requêtes en langage naturel",
        description: "Demandez n'importe quoi à Hobson sur vos actifs. Obtenez des réponses instantanées aux questions complexes avec notre assistant IA conversationnel.",
        features: ["Disponibilité 24h/24 7j/7", "Réponses contextuelles", "Insights multi-propriétés"],
      },
      {
        title: "Cartographie interactive des propriétés",
        badge: "Sur notre liste de souhaits",
        badgeType: "outline",
        subtitle: "Intelligence géospatiale",
        description: "Visualisez l'ensemble de votre portefeuille sur une carte interactive. Voyez les emplacements des propriétés, les données de marché et les insights géographiques en un coup d'œil.",
        features: ["Analyses basées sur la localisation", "Visualisation des tendances du marché", "Insights sur la distribution du portefeuille"],
      },
      {
        title: "Analyse documentaire intelligente",
        badge: "Bêta",
        badgeType: "secondary",
        subtitle: "Extraction alimentée par l'IA",
        description: "Téléchargez des contrats de bail, des études et des contrats. Hobson extrait automatiquement les informations clés et identifie les dates importantes.",
        features: ["Saisie automatique des données", "Identification des dates clés", "Résumé de documents"],
      },
      {
        title: "Analyses prédictives",
        badge: "Sur notre liste de souhaits",
        badgeType: "outline",
        subtitle: "Insights orientés vers l'avenir",
        description: "Anticipez les changements du marché et les renouvellements de baux avec des prédictions et recommandations pilotées par l'IA.",
        features: ["Prévisions de gestion", "Analyse des tendances du marché", "Optimisation des revenus"],
      },
    ],
  },

  // Industry Teams Section
  industryTeams: {
    title: "Conçu pour les professionnels de l'immobilier de toute l'industrie",
    subtitle: "Qu'il s'agisse de baux, de contrats de vente ou de documents de prêt - ils attendent tous de révéler leurs secrets",
    teams: [
      {
        name: "Gestion immobilière",
        description: "Simplifiez la documentation des locataires et l'analyse des baux",
        icon: "Building2",
      },
      {
        name: "Ventes immobilières",
        description: "Accélérez l'analyse des transactions et la due diligence",
        icon: "TrendingUp",
      },
      {
        name: "Expertise",
        description: "Automatisez la génération de rapports et l'extraction de données",
        icon: "MapPin",
      },
      {
        name: "Urbanisme",
        description: "Traitez les documents d'urbanisme et les exigences réglementaires",
        icon: "PenTool",
      },
      {
        name: "Financement",
        description: "Accélérez la documentation des prêts et l'évaluation des risques",
        icon: "CreditCard",
      },
      {
        name: "Conformité",
        description: "Restez au fait des visites récurrentes et des mises à jour documentaires",
        icon: "Shield",
      },
    ],
  },

  // Key Benefits Section
  benefits: {
    automate: {
      title: "Automatisez les tâches documentaires",
      description: "Libérez des heures de travail administratif avec des réponses IA instantanées.",
    },
    insights: {
      title: "Révélez des insights critiques",
      description: "Posez des questions ou lancez des requêtes par lots — Hobson lit et répond en contexte.",
    },
  },

  // Form Section
  form: {
    title: "Candidatez pour rejoindre le pilote Hobson AI",
    fields: {
      name: {
        label: "Nom *",
        placeholder: "Votre nom",
      },
      company: {
        label: "Entreprise *",
        placeholder: "Nom de l'entreprise",
      },
      role: {
        label: "Fonction *",
        placeholder: "Votre fonction",
      },
      email: {
        label: "Email *",
        placeholder: "votre@email.com",
      },
      confirmEmail: {
        label: "Confirmer l'email *",
        placeholder: "Confirmez votre email",
      },
      phone: {
        label: "Numéro de téléphone *",
        placeholder: "Votre numéro de téléphone",
      },
      website: {
        label: "Site web",
        placeholder: "votreentreprise.com",
      },
      preferredContact: {
        label: "Comment préférez-vous être contacté ? *",
        placeholder: "Sélectionnez comment vous souhaitez être contacté",
        options: [
          { value: "email", label: "Email" },
          { value: "phone", label: "Téléphone" },
          { value: "either", label: "Email ou téléphone" },
        ],
      },
      businessTypes: {
        label: "Type d'activité (Sélectionnez tout ce qui s'applique) *",
        options: [
          "Gestion immobilière",
          "Ventes immobilières",
          "Expertise",
          "Architecture et urbanisme",
          "Financement",
          "Conformité",
        ],
      },
      help: {
        label: "Comment Hobson peut-il aider votre entreprise ? (Optionnel)",
        placeholder: "Parlez-nous de vos défis documentaires, flux de travail ou cas d'usage spécifiques...",
      },
    },
    submitButton: "Soumettre la candidature",
    emailExistsMessage: "Cet email a déjà été utilisé pour une candidature pilote. Si vous êtes la même personne, veuillez nous contacter directement à info@hobsonschoice.ai",
    checkingEmailMessage: "Vérification de l'email...",
  },

  // Dialogs
  dialogs: {
    success: {
      title: "Candidature soumise avec succès !",
      message: "Merci de votre intérêt pour le pilote Hobson AI. Nous examinerons votre candidature et vous recontacterons bientôt avec les prochaines étapes.",
      closeButton: "Fermer",
    },
    antiBot: {
      title: "Vérification de sécurité rapide",
      message: "Veuillez résoudre ce simple problème mathématique pour vérifier que vous êtes humain :",
      submitButton: "Vérifier et soumettre",
      placeholder: "Votre réponse",
    },
  },

  // Toast Messages
  toasts: {
    submissionFailed: {
      title: "Échec de la soumission",
      description: "Une erreur s'est produite lors de la soumission de votre candidature. Veuillez réessayer.",
    },
    incorrectAnswer: {
      title: "Réponse incorrecte",
      description: "Veuillez résoudre correctement le problème mathématique.",
    },
  },

  // Common
  common: {
    learnMore: "En savoir plus",
    getStarted: "Commencer",
    contactUs: "Contactez-nous",
  },

  // Contact Page
  contact: {
    title: "Contactez-nous",
    subtitle: "Nous serions ravis de discuter avec vous !",
    form: {
      name: { label: "Nom *", placeholder: "Votre nom complet" },
      phone: { label: "Téléphone", placeholder: "Votre numéro de téléphone" },
      email: { label: "Email *", placeholder: "votre.email@exemple.com" },
      confirmEmail: { label: "Confirmer l'email *", placeholder: "Confirmez votre adresse email" },
      reason: { label: "Motif de la demande *", placeholder: "Veuillez décrire votre demande..." },
      submit: "Envoyer le message",
      submitting: "Envoi en cours...",
    },
    validation: {
      missingInfo: { title: "Informations manquantes", description: "Veuillez remplir tous les champs obligatoires." },
      emailMismatch: { title: "Emails différents", description: "Les adresses email doivent correspondre." },
      tooManyRequests: { title: "Trop de demandes", description: "Veuillez patienter quelques minutes avant de soumettre un autre message." },
      sendFailed: { title: "Échec de l'envoi", description: "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer." },
      incorrectAnswer: { title: "Réponse incorrecte", description: "Veuillez résoudre correctement le problème mathématique." },
    },
    success: {
      title: "Message envoyé !",
      description: "Merci pour votre demande. Nous vous répondrons bientôt.",
    },
    antiBot: {
      title: "Vérification de sécurité rapide",
      description: "Veuillez résoudre ce simple problème mathématique pour vérifier que vous êtes humain :",
      cancel: "Annuler",
      submit: "Envoyer le message",
      submitting: "Envoi en cours...",
    },
  },

  // Navigation (used in GlobalHeader and Homepage)
  navigation: {
    links: [
      { to: "/blog", label: "Blog", title: "Perspectives en gestion immobilière" },
      { to: "/contact", label: "Contact", title: "Contacter le support logiciel immobilier" },
      { to: "/learn", label: "Apprendre", title: "Ressources d'apprentissage" },
    ],
  },

  // Shared Footer (used in HomepageFooter)
  sharedFooter: {
    product: "Produit",
    features: "Fonctionnalités",
    joinPilot: "Rejoindre notre programme pilote",
    company: "Entreprise",
    blog: "Blog",
    contact: "Contact",
    learn: "Apprendre",
    investmentOpportunity: "Opportunité d'investissement",
    dataProtection: "Politique de confidentialité et de protection des données IA",
    breachProtocol: "Protocole de violation de données",
    refundPolicy: "Politique de remboursement",
    copyright: "© 2024 Hobson's Choice AI. Tous droits réservés.",
  },

  // Chatbot UI
  chatbot: {
    title: "Aide Hobson AI",
    welcomeMessage: "Bonjour ! Que souhaitez-vous savoir ?",
    placeholder: "Posez une question sur Hobson AI...",
    tooltip: "Besoin d'aide ? Discutez avec Hobson !",
    clearChat: "Chat effacé",
    clearChatDescription: "Nouvelle conversation",
    error: "Erreur",
    errorDescription: "Échec de la réponse. Veuillez réessayer.",
    // Quick questions for chatbot
    quickQuestions: [
      { full: "Comment les unités, groupes, portefeuilles et documents sont-ils organisés dans Hobson ?", short: "Organisation ?" },
      { full: "Quels types de fichiers sont pris en charge ?", short: "Types de fichiers ?" },
      { full: "Quels types de documents Hobson peut-il lire ?", short: "Types de docs ?" },
      { full: "Comment envoyer des documents à Hobson", short: "Télécharger des docs ?" },
      { full: "Hobson fonctionne-t-il sur mobile ?", short: "Mobile ?" },
      { full: "À qui appartiennent les données et les résultats ?", short: "Propriété des données ?" },
      { full: "Comment Hobson utilise-t-il OpenAI ?", short: "Utilisation d'OpenAI ?" },
      { full: "OpenAI stocke-t-il mes documents ?", short: "Stockage ?" },
      { full: "OpenAI utilise-t-il mes données pour entraîner ses modèles ?", short: "Entraînement ?" },
      { full: "Quelles données Hobson envoie-t-il à OpenAI ?", short: "Données envoyées ?" },
      { full: "Où mes documents sont-ils réellement stockés ?", short: "Stockage ?" },
      { full: "Pourquoi Hobson doit-il envoyer quoi que ce soit à OpenAI ?", short: "Pourquoi OpenAI ?" },
      { full: "Qui peut voir mes documents ?", short: "Accès ?" },
      { full: "Comment Hobson protège-t-il mes données lors de l'utilisation d'OpenAI ?", short: "Protection ?" },
      { full: "OpenAI connaît-il mon identité ou détient-il des détails sur mes biens immobiliers ?", short: "Confidentialité ?" },
      { full: "Que se passe-t-il techniquement lors du téléchargement d'un document ?", short: "Processus de téléchargement ?" },
      { full: "Que se passe-t-il quand je pose une question ?", short: "Processus de question ?" },
      { full: "Combien de temps Hobson met-il pour lire un document ?", short: "Temps de traitement ?" },
      { full: "Hobson peut-il être formé sur les informations de mon entreprise ?", short: "Formation ?" },
      { full: "Puis-je ajouter une unité manuellement sans télécharger de document ?", short: "Unités manuelles ?" },
      { full: "Quel niveau dois-je utiliser pour poser une question ?", short: "Niveaux de question ?" },
      { full: "Que faire si j'obtiens une mauvaise réponse ?", short: "Mauvaises réponses ?" },
      { full: "Comment structurer mes prompts pour de meilleurs résultats ?", short: "Conseils prompts ?" },
      { full: "Hobson peut-il se connecter à nos systèmes ?", short: "Intégrations ?" },
      { full: "Puis-je contrôler qui a accès ?", short: "Contrôle d'accès ?" },
      { full: "Qu'est-ce qu'un HEU ?", short: "HEU ?" },
      { full: "Combien coûtent les différentes tâches en HEUs ?", short: "Coûts HEU ?" },
      { full: "Comment puis-je mettre à niveau mon abonnement ?", short: "Mise à niveau ?" },
      { full: "Comment puis-je rétrograder mon abonnement ?", short: "Rétrogradation ?" },
      { full: "Comment puis-je annuler mon abonnement ?", short: "Annulation ?" },
      { full: "Comment puis-je modifier mes informations de facturation ?", short: "Facturation ?" },
      { full: "Comment télécharger mes factures ?", short: "Factures ?" },
      { full: "Comment obtenir plus de crédits ?", short: "Plus de crédits ?" },
      { full: "Quand ma limite de crédits se réinitialise-t-elle ?", short: "Réinitialisation ?" },
      { full: "Comment voir les crédits restants dans un espace de travail ?", short: "Vérifier crédits ?" },
      { full: "Puis-je obtenir des crédits gratuits ?", short: "Crédits gratuits ?" },
    ],
  },
} as const;
