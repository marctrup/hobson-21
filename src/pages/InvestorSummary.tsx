import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Search, Zap, Globe, Mail, Target, CheckCircle, XCircle, Brain, Download, Loader2 } from 'lucide-react';
import hobsonMascot from '@/assets/hobson-mascot.png';
import { 
  downloadInvestorSummaryPdf, 
  InvestorSummarySection,
  HeroSection,
  PainSection,
  SolutionSection,
  MagicSection,
  MarketSection,
  BusinessModelSection,
  RaiseSection,
  ClosingSection
} from '@/utils/investorSummaryPdfGenerator';

// Define all section content for PDF generation
const heroSection: HeroSection = {
  type: "hero",
  brandName: "HOBSON AI",
  headline: "The Problem",
  highlightedHeadline: "No One Talks About",
  taglines: [
    "Real estate runs on documents.",
    "Documents run on chaos."
  ]
};

const painSection: PainSection = {
  type: "pain",
  description: "Every lease, title, report, and contract hides the answer someone needs right now — and 99% of the time, that answer is trapped in a PDF, a shared drive, or someone's head.",
  quote: "\"Why does finding one answer still take 20 minutes, 3 systems, and a colleague named Dave who knows where everything is?\"",
  conclusion: [
    "There had to be a better way.",
    "There wasn't."
  ],
  callToAction: "So we built one."
};

const solutionSection: SolutionSection = {
  type: "solution",
  title: "AI That Doesn't Cause a Riot",
  problemStatement: "Most AI startups show up and say:",
  response: "\"Replace everything! Change systems! Embrace the disruption!\"",
  keyMessage: "We innovate without disruption.",
  features: [
    "No onboarding",
    "No behaviour change"
  ],
  description: "You just upload your documents and ask a question. Hobson answers — instantly, accurately, with receipts. (Unlike your last intern.)"
};

const magicSection: MagicSection = {
  type: "magic",
  title: "The Magic Trick",
  subtitle: "(That Isn't Magic)",
  underTheHood: ["Document Intelligence", "AI Reasoning", "Instant Clarity"],
  userMessage: "\"Here's the answer. And here's exactly where I found it.\"",
  benefits: [
    "Hobson turns chaos into clarity and fragmented data into one clean, trusted source of truth.",
    "Real estate has never seen this before — but every operator who touches it says the same thing:"
  ],
  testimonial: "\"I'm not going back.\""
};

const marketSection: MarketSection = {
  type: "market",
  title: "Why This Market Bends in Our Favour",
  subtitle: "Real estate is drowning in document work — and it's costing a fortune.",
  stats: [
    { value: "£1.4B", label: "Annual efficiency loss in the UK" },
    { value: "£155.6B", label: "Annual efficiency loss across global OECD markets" }
  ],
  tamExplanation: "That's the TAM: The value trapped in admin, manual work, and document-chasing.",
  noItems: [
    "No incumbent",
    "No category leader",
    "No integrated AI document intelligence",
    "No low-friction tool like Hobson"
  ],
  positioning: [
    "We are early. We are differentiated. We are exactly on time.",
    "The sector is desperate for efficiency — 20% gains from AI are now baseline, not hype."
  ],
  conclusion: "Hobson is the clarity layer that unlocks those gains."
};

const businessModelSection: BusinessModelSection = {
  type: "businessModel",
  title: "The Business Model That Makes Investors Smile",
  features: [
    "Lightweight SaaS",
    "High gross margins (≈88–95%)",
    "Zero onboarding cost",
    "Tiny infrastructure spend",
    "Near-infinite scalability",
    "Pricing from £19.50/month"
  ],
  metrics: [
    { value: "<2 mo", label: "CAC Payback" },
    { value: ">10×", label: "LTV:CAC" }
  ],
  tagline: "This is SaaS the way SaaS is supposed to work.",
  referralNote: "Even better — the workflow spreads via referrals. Once one team adopts Hobson, everyone else wants it."
};

const raiseSection: RaiseSection = {
  type: "raise",
  title: "What We're Raising (And Why It Matters)",
  subtitle: [
    "We can run pilots throughout 2026.",
    "We cannot unlock commercial scale without capital."
  ],
  options: [
    { amount: "£1.2M", label: "We launch", desc: "but nervously" },
    { amount: "£1.5M", label: "We launch", desc: "sustainably" },
    { amount: "£1.8M", label: "We launch", desc: "grow, and breathe", recommended: true },
    { amount: "£2.2M", label: "We launch", desc: "grow, expand, dominate" }
  ],
  recommendation: {
    amount: "£1.8M",
    description: "to build the category leader in AI document intelligence."
  },
  closingStatement: "Hobson isn't a feature. Hobson is the clarity layer real estate has been missing for decades."
};

const closingSection: ClosingSection = {
  type: "closing",
  title: "Come Build This With Us",
  philosophy: "If AI is going to reshape operational work, it should do it with empathy, trust, and transparency.",
  pitch: "Real estate doesn't need another shiny tool. It needs an expert — one that shows up instantly, answers truthfully, and never gets tired.",
  brandName: "That's Hobson.",
  callToAction: "Let's build the future of clarity together.",
  contactPrompt: "Want the full picture?",
  contactEmail: "rochelle.t@hobsonschoice.ai"
};

const allSections: InvestorSummarySection[] = [
  heroSection,
  painSection,
  solutionSection,
  magicSection,
  marketSection,
  businessModelSection,
  raiseSection,
  closingSection
];

const InvestorSummary = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      downloadInvestorSummaryPdf(allSections, hobsonMascot);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>Investor Summary | Hobson AI</title>
        <meta name="description" content="Hobson AI - Specialised AI for the Property Industry. Investment teaser for real estate document intelligence." />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Helmet>
      

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Hero Section */}
        <section data-pdf-section className="relative min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 overflow-hidden bg-background">
          {/* Floating document icons with extreme motion */}
          <style>{`
            @keyframes floatExtreme1 {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(35px, -50px) rotate(18deg); }
              50% { transform: translate(-25px, -80px) rotate(-12deg); }
              75% { transform: translate(45px, -30px) rotate(22deg); }
            }
            @keyframes floatExtreme2 {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(-45px, -60px) rotate(-22deg); }
              50% { transform: translate(35px, -90px) rotate(15deg); }
              75% { transform: translate(-55px, -40px) rotate(-18deg); }
            }
            @keyframes floatExtreme3 {
              0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
              25% { transform: translate(50px, -70px) rotate(25deg) scale(1.15); }
              50% { transform: translate(-35px, -100px) rotate(-18deg) scale(0.85); }
              75% { transform: translate(60px, -50px) rotate(28deg) scale(1.1); }
            }
            @keyframes floatExtreme4 {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              33% { transform: translate(-60px, -85px) rotate(-28deg); }
              66% { transform: translate(50px, -65px) rotate(22deg); }
            }
          `}</style>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <FileText className="absolute top-8 left-[5%] w-6 h-6 sm:w-10 sm:h-10 text-primary/40" style={{ animation: 'floatExtreme1 9s ease-in-out infinite', animationDelay: '0ms' }} />
            <FileText className="absolute top-12 right-[8%] w-5 h-5 sm:w-8 sm:h-8 text-primary/50" style={{ animation: 'floatExtreme2 10s ease-in-out infinite', animationDelay: '800ms' }} />
            <FileText className="absolute top-[30%] left-[3%] w-7 h-7 sm:w-11 sm:h-11 text-primary/35" style={{ animation: 'floatExtreme3 11s ease-in-out infinite', animationDelay: '1600ms' }} />
            <FileText className="absolute top-[35%] right-[5%] w-6 h-6 sm:w-9 sm:h-9 text-primary/45" style={{ animation: 'floatExtreme4 9.5s ease-in-out infinite', animationDelay: '2400ms' }} />
            <FileText className="absolute bottom-[30%] left-[8%] w-5 h-5 sm:w-8 sm:h-8 text-primary/50" style={{ animation: 'floatExtreme1 10.5s ease-in-out infinite', animationDelay: '1200ms' }} />
            <FileText className="absolute bottom-[25%] right-[3%] w-7 h-7 sm:w-10 sm:h-10 text-primary/40" style={{ animation: 'floatExtreme2 9.8s ease-in-out infinite', animationDelay: '2000ms' }} />
            <FileText className="absolute bottom-16 left-[5%] w-6 h-6 sm:w-9 sm:h-9 text-primary/45" style={{ animation: 'floatExtreme3 10.2s ease-in-out infinite', animationDelay: '2800ms' }} />
            <FileText className="absolute bottom-12 right-[10%] w-5 h-5 sm:w-7 sm:h-7 text-primary/55" style={{ animation: 'floatExtreme4 8.5s ease-in-out infinite', animationDelay: '400ms' }} />
            
            <FileText className="hidden sm:block absolute top-6 left-[28%] w-12 h-12 text-primary/35" style={{ animation: 'floatExtreme3 11.5s ease-in-out infinite', animationDelay: '1600ms' }} />
            <FileText className="hidden sm:block absolute top-14 right-[28%] w-9 h-9 text-primary/45" style={{ animation: 'floatExtreme1 9.8s ease-in-out infinite', animationDelay: '2400ms' }} />
            <FileText className="hidden sm:block absolute top-[22%] left-[22%] w-7 h-7 text-primary/50" style={{ animation: 'floatExtreme2 10.5s ease-in-out infinite', animationDelay: '2000ms' }} />
            <FileText className="hidden sm:block absolute top-[28%] right-[22%] w-10 h-10 text-primary/40" style={{ animation: 'floatExtreme4 9.6s ease-in-out infinite', animationDelay: '2800ms' }} />
            <FileText className="hidden sm:block absolute top-[45%] left-[15%] w-6 h-6 text-primary/60" style={{ animation: 'floatExtreme1 8.8s ease-in-out infinite', animationDelay: '1400ms' }} />
            <FileText className="hidden sm:block absolute top-[42%] right-[18%] w-8 h-8 text-primary/50" style={{ animation: 'floatExtreme3 10.2s ease-in-out infinite', animationDelay: '2200ms' }} />
            <FileText className="hidden sm:block absolute top-[65%] left-[20%] w-8 h-8 text-primary/50" style={{ animation: 'floatExtreme2 10s ease-in-out infinite', animationDelay: '1000ms' }} />
            <FileText className="hidden sm:block absolute top-[68%] right-[25%] w-10 h-10 text-primary/40" style={{ animation: 'floatExtreme4 9.2s ease-in-out infinite', animationDelay: '1800ms' }} />
            <FileText className="hidden sm:block absolute bottom-20 left-[35%] w-8 h-8 text-primary/50" style={{ animation: 'floatExtreme1 8.9s ease-in-out infinite', animationDelay: '1800ms' }} />
            <FileText className="hidden sm:block absolute bottom-16 right-[35%] w-9 h-9 text-primary/45" style={{ animation: 'floatExtreme3 9.8s ease-in-out infinite', animationDelay: '2600ms' }} />
          </div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto px-2">
            <p className="text-primary font-semibold text-base sm:text-lg md:text-xl tracking-wide mb-3 sm:mb-4">HOBSON AI</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-foreground">
              The Problem<br />
              <span className="text-primary">No One Talks About</span>
            </h1>
            <div className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light space-y-2">
              <p>Real estate runs on documents.</p>
              <p className="text-primary font-medium">Documents run on chaos.</p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* The Pain Section */}
        <section data-pdf-section className="px-4 sm:px-6 py-10 sm:py-16 bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10">
              <div className="flex-1 order-2 md:order-1">
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-5 leading-relaxed text-center md:text-left">
                  Every lease, title, report, and contract hides the answer someone needs <span className="text-primary font-semibold">right now</span> —
                  and 99% of the time, that answer is trapped in a PDF, a shared drive, or someone's head.
                </p>
                <div className="bg-primary/5 rounded-lg p-4 sm:p-5 border-l-4 border-primary mb-4 sm:mb-5">
                  <p className="text-base sm:text-lg text-foreground text-center md:text-left italic">
                    "Why does finding one answer still take 20 minutes, 3 systems, and a colleague named Dave who knows where everything is?"
                  </p>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground text-center md:text-left">
                  There had to be a better way.<br />
                  <span className="text-foreground font-medium">There wasn't.</span>
                </p>
                <p className="text-base sm:text-lg text-primary font-semibold mt-3 text-center md:text-left">
                  So we built one.
                </p>
              </div>
              <div className="flex-shrink-0 order-1 md:order-2">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-primary/70" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* AI That Doesn't Cause a Riot Section */}
        <section data-pdf-section className="px-4 sm:px-6 py-10 sm:py-16 bg-background">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-foreground">
              AI That Doesn't Cause a Riot
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-5">
              Most AI startups show up and say:
            </p>
            <p className="text-base sm:text-lg md:text-xl text-destructive font-semibold mb-4 sm:mb-5 italic">
              "Replace everything! Change systems! Embrace the disruption!"
            </p>
            <p className="text-sm sm:text-base text-foreground mb-6 sm:mb-8">
              Real estate people hear that and think: <span className="font-bold">"NOOOOO!"</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 my-6 sm:my-10">
              <div className="bg-destructive/10 rounded-lg p-4 sm:p-5 border border-destructive/20 flex items-center gap-2 sm:gap-3">
                <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" />
                <span className="text-sm sm:text-base text-muted-foreground">Disruptive AI</span>
              </div>
              <div className="text-xl sm:text-2xl text-primary font-bold rotate-90 sm:rotate-0">→</div>
              <div className="bg-primary/10 rounded-lg p-4 sm:p-5 border border-primary/30 flex items-center gap-2 sm:gap-3">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                <span className="text-sm sm:text-base text-foreground font-medium">Hobson</span>
              </div>
            </div>
            
            <p className="text-lg sm:text-xl text-primary font-semibold mb-6 sm:mb-8">
              We innovate without disruption.
            </p>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                "No onboarding",
                "No behaviour change",
              ].map((item, i) => (
                <div key={i} className="bg-secondary/50 rounded-lg p-3 sm:p-4 border border-border">
                  <span className="text-foreground text-xs sm:text-sm">{item}</span>
                </div>
              ))}
            </div>
            
            <p className="text-sm sm:text-base text-muted-foreground mt-6 sm:mt-8">
              You just upload your documents and ask a question.<br />
              <span className="text-primary font-medium">Hobson answers — instantly, accurately, with receipts.</span><br />
              <span className="italic text-muted-foreground/70">(Unlike your last intern.)</span>
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* The Magic Trick Section - with Mascot */}
        <section data-pdf-section className="px-4 sm:px-6 py-10 sm:py-16 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-6 sm:gap-10">
              {/* Mascot */}
              <div className="flex justify-center">
                <img 
                  src={hobsonMascot} 
                  alt="Hobson the Owl" 
                  className="w-32 sm:w-40 md:w-48 lg:w-56 drop-shadow-xl"
                />
              </div>
              
              {/* Content */}
              <div className="w-full">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-foreground">
                    The Magic Trick<br />
                    <span className="text-primary">(That Isn't Magic)</span>
                  </h2>
                </div>
                
                <div className="bg-card rounded-xl p-4 sm:p-6 border border-border mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3 text-center">Under the hood</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 text-foreground">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="text-sm sm:text-base">Document Intelligence</span>
                    </div>
                    <span className="text-primary font-bold hidden sm:inline">→</span>
                    <div className="flex items-center gap-2 text-foreground">
                      <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="text-sm sm:text-base">AI Reasoning</span>
                    </div>
                    <span className="text-primary font-bold hidden sm:inline">→</span>
                    <div className="flex items-center gap-2 text-foreground">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="text-sm sm:text-base">Instant Clarity</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 rounded-xl p-4 sm:p-6 border-l-4 border-primary mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-wider mb-2 text-center">To the user</p>
                  <p className="text-base sm:text-lg text-foreground text-center italic">
                    "Here's the answer. And here's exactly where I found it."
                  </p>
                </div>
                
                <div className="text-center space-y-3">
                  <p className="text-base sm:text-lg text-foreground">
                    Hobson turns <span className="text-primary font-semibold">chaos into clarity</span><br />
                    and fragmented data into one clean, trusted source of truth.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Real estate has never seen this before —<br />
                    but every operator who touches it says the same thing:
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-primary">
                    "I'm not going back."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* Why This Market Section */}
        <section data-pdf-section className="px-4 sm:px-6 py-10 sm:py-16 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-foreground">
                Why This Market <span className="text-primary">Bends in Our Favour</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Real estate is drowning in document work — and it's costing a fortune.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mb-4 sm:mb-6">
              {[
                { value: "£1.4B", label: "Annual efficiency loss in the UK", icon: Target },
                { value: "£155.6B", label: "Annual efficiency loss across global OECD markets", icon: Globe },
              ].map((stat, i) => (
                <div key={i} className="bg-primary/5 rounded-xl p-5 sm:p-8 border border-primary/20 text-center">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-muted-foreground mb-1">That's the <span className="text-primary font-semibold">TAM</span>:</p>
              <p className="text-sm sm:text-base text-foreground">
                The value trapped in admin, manual work, and document-chasing.
              </p>
            </div>
            
            <p className="text-base sm:text-lg text-center text-primary font-semibold mb-4 sm:mb-6">
              And here's the twist:
            </p>
            
            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border mb-6 sm:mb-8">
              <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-3 text-center">There is:</p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  "No incumbent",
                  "No category leader",
                  "No integrated AI document intelligence",
                  "No low-friction tool like Hobson",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2 sm:p-3">
                    <XCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground text-xs sm:text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-base sm:text-lg text-foreground">
                We are <span className="text-primary font-semibold">early</span>. We are <span className="text-primary font-semibold">differentiated</span>. We are <span className="text-primary font-semibold">exactly on time</span>.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground">
                The sector is desperate for efficiency —<br />
                <span className="text-foreground">20% gains from AI are now baseline, not hype.</span>
              </p>
              <p className="text-base sm:text-lg text-primary font-semibold mt-3">
                Hobson is the clarity layer that unlocks those gains.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* Business Model Section */}
        <section data-pdf-section className="px-4 sm:px-6 py-10 sm:py-16 bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-foreground">
                The Business Model That <span className="text-primary">Makes Investors Smile</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {[
                "Lightweight SaaS",
                "High gross margins (≈88–95%)",
                "Zero onboarding cost",
                "Tiny infrastructure spend",
                "Near-infinite scalability",
                "Pricing from £19.50/month",
              ].map((item, i) => (
                <div key={i} className="bg-secondary/50 rounded-lg p-3 sm:p-4 border border-border text-center">
                  <CheckCircle className="w-4 h-4 text-primary mx-auto mb-1" />
                  <span className="text-foreground text-xs sm:text-sm">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-primary/5 rounded-xl p-4 sm:p-6 border border-primary/20 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-wider mb-3 text-center">The kicker</p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">&lt;2 mo</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">CAC Payback</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">&gt;10×</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">LTV:CAC</p>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <p className="text-base sm:text-lg text-foreground">
                This is <span className="text-primary font-semibold">SaaS the way SaaS is supposed to work.</span>
              </p>
              <p className="text-sm sm:text-base text-muted-foreground">
                Even better — the workflow spreads via referrals.<br />
                <span className="text-foreground">Once one team adopts Hobson, everyone else wants it.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* The Raise Section */}
        <section data-pdf-section className="px-4 sm:px-6 py-10 sm:py-16 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-foreground">
                What We're Raising <span className="text-primary">(And Why It Matters)</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                We can run pilots throughout 2026.<br />
                <span className="text-foreground font-medium">We cannot unlock commercial scale without capital.</span>
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
              {[
                { amount: "£1.2M", label: "We launch", desc: "but nervously" },
                { amount: "£1.5M", label: "We launch", desc: "sustainably" },
                { amount: "£1.8M", label: "We launch", desc: "grow, and breathe", recommended: true },
                { amount: "£2.2M", label: "We launch", desc: "grow, expand, dominate" },
              ].map((option, i) => (
                <div 
                  key={i} 
                  className={`rounded-xl p-3 sm:p-5 text-center transition-all ${
                    option.recommended 
                      ? 'bg-primary text-primary-foreground border-2 border-primary' 
                      : 'bg-card border border-border'
                  }`}
                >
                  {option.recommended && (
                    <div className="flex justify-center mb-1 sm:mb-2">
                      <span className="inline-block bg-primary-foreground text-primary text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full">
                        PREFERRED
                      </span>
                    </div>
                  )}
                  <p className={`text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1 ${option.recommended ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {option.amount}
                  </p>
                  <p className={`text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 ${option.recommended ? 'text-primary-foreground/90' : 'text-primary'}`}>
                    {option.label}
                  </p>
                  <p className={`text-[8px] sm:text-[10px] leading-tight ${option.recommended ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {option.desc}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="bg-primary/5 rounded-xl p-4 sm:p-6 border-l-4 border-primary text-center">
              <p className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-wider mb-2">Our recommendation</p>
              <p className="text-base sm:text-lg text-foreground">
                <span className="text-primary font-bold text-xl sm:text-2xl">£1.8M</span> to build the category leader in AI document intelligence.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground mt-3">
                Hobson isn't a feature.<br />
                <span className="text-foreground font-medium">Hobson is the clarity layer real estate has been missing for decades.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* Closing Section */}
        <section data-pdf-section className="px-4 sm:px-6 py-10 sm:py-16 bg-background">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-foreground">
              Come Build This With Us
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              If AI is going to reshape operational work,<br />
              it should do it with <span className="text-foreground font-medium">empathy, trust, and transparency</span>.
            </p>
            <p className="text-base sm:text-lg text-foreground mb-6 sm:mb-8">
              Real estate doesn't need another shiny tool.<br />
              It needs an expert —<br />
              one that shows up instantly, answers truthfully, and never gets tired.
            </p>
            <p className="text-xl sm:text-2xl font-bold text-primary mb-6 sm:mb-8">
              That's Hobson.
            </p>
            
            <p className="text-lg sm:text-xl text-foreground mb-2">
              Let's build the future of clarity together.
            </p>
            
            <div className="bg-primary/5 rounded-xl p-5 sm:p-8 border-l-4 border-primary mt-6 sm:mt-10">
              <p className="text-sm sm:text-base text-foreground mb-4 sm:mb-5">Want the full picture?</p>
              <a 
                href="mailto:rochelle.t@hobsonschoice.ai"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base"
              >
                <Mail className="w-4 h-4" />
                Contact Rochelle
              </a>
            </div>
            
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              data-pdf-hide
              className="mt-6 inline-flex items-center gap-2 bg-background hover:bg-secondary text-foreground border border-border font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all disabled:opacity-70 text-sm sm:text-base"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 sm:px-6 py-6 sm:py-8 border-t border-border text-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            © {new Date().getFullYear()} Hobson AI. Confidential.
          </p>
        </footer>
      </div>
    </>
  );
};

export default InvestorSummary;
