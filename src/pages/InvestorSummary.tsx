import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Search, Zap, Shield, Globe, TrendingUp, DollarSign, Mail, Users, Target, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import hobsonMascot from '@/assets/hobson-mascot.png';
import hobsonLogo from '@/assets/hobson-logo-purple.png';

const InvestorSummary = () => {
  return (
    <>
      <Helmet>
        <title>Investor Summary | Hobson AI</title>
        <meta name="description" content="Hobson AI - Specialised AI for the Property Industry. Investment teaser for real estate document intelligence." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Header with Logo */}
        <header className="px-6 py-6 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <img src={hobsonLogo} alt="Hobson" className="h-10 sm:h-12" />
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 py-16 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
          {/* Floating document icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-[10%] opacity-20 animate-bounce delay-100">
              <FileText className="w-8 h-8 text-primary/60" />
            </div>
            <div className="absolute top-32 right-[15%] opacity-15 animate-bounce delay-300">
              <FileText className="w-6 h-6 text-primary/50" />
            </div>
            <div className="absolute bottom-32 left-[20%] opacity-10 animate-bounce delay-500">
              <FileText className="w-10 h-10 text-primary/40" />
            </div>
            <div className="absolute top-40 right-[25%] opacity-10 animate-bounce delay-700">
              <FileText className="w-7 h-7 text-primary/30" />
            </div>
          </div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
              The Document Chaos<br />
              <span className="text-primary">No One Talks About</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-light">
              Real estate runs on documents.<br />
              <span className="text-muted-foreground/70">Documents run on chaos.</span>
            </p>
          </div>
        </section>

        {/* The Pain Section */}
        <section className="px-6 py-20 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                  Finding answers shouldn't feel like <span className="text-primary">detective work.</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Every day, operators lose time digging through leases, titles, reports, and emails…
                  or asking <span className="italic text-muted-foreground/70">"Does anyone know where that clause is?"</span>
                </p>
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                  <p className="text-xl text-foreground">
                    Real estate runs on knowledge.<br />
                    <span className="text-primary font-semibold">But that knowledge is buried.</span>
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10">
                  <Search className="w-20 h-20 text-primary/60" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Twist Section */}
        <section className="px-6 py-20 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-foreground">
              Most AI tools show up shouting:<br />
              <span className="text-destructive">"Replace everything!"</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Real estate says: <span className="font-semibold text-foreground">"Absolutely not."</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 my-12">
              <div className="bg-destructive/10 rounded-xl p-6 border border-destructive/20 flex items-center gap-4">
                <XCircle className="w-12 h-12 text-destructive" />
                <span className="text-muted-foreground">Disruptive AI</span>
              </div>
              <div className="text-3xl text-primary font-bold">→</div>
              <div className="bg-primary/10 rounded-xl p-6 border border-primary/30 flex items-center gap-4">
                <CheckCircle className="w-12 h-12 text-primary" />
                <span className="text-foreground font-medium">Hobson</span>
              </div>
            </div>
            
            <p className="text-xl text-foreground">
              Hobson takes a different path — <span className="text-primary font-semibold">innovation without disruption.</span>
            </p>
          </div>
        </section>

        {/* What Hobson Does Section - with Mascot */}
        <section className="px-6 py-20 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Mascot */}
              <div className="lg:w-1/3 flex justify-center">
                <img 
                  src={hobsonMascot} 
                  alt="Hobson the Owl" 
                  className="w-48 sm:w-64 lg:w-72 drop-shadow-2xl"
                />
              </div>
              
              {/* Content */}
              <div className="lg:w-2/3">
                <div className="text-center lg:text-left mb-10">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                    Your documents.<br />
                    Your workflows.<br />
                    <span className="text-primary">Instant clarity.</span>
                  </h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: FileText, text: "Upload documents → Hobson understands them" },
                    { icon: Zap, text: "Ask a question → Hobson answers instantly" },
                    { icon: Shield, text: "Always shows citations" },
                    { icon: Sparkles, text: "No onboarding, no integration, no drama" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-secondary/50 rounded-xl p-5 border border-border">
                      <item.icon className="w-6 h-6 text-primary flex-shrink-0" />
                      <span className="text-foreground text-sm sm:text-base">{item.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-semibold text-primary">
                    Finally: AI you can trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Market Opportunity Section */}
        <section className="px-6 py-20 bg-gradient-to-b from-background via-secondary/30 to-background">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                A massive, ignored,<br />
                <span className="text-primary">document-heavy category.</span>
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              {[
                { value: "235,200", label: "UK real estate companies", icon: Target },
                { value: "4.2M", label: "Global OECD target market", icon: Globe },
                { value: "0", label: "Category leaders in AI doc intelligence", icon: Users },
              ].map((stat, i) => (
                <div key={i} className="bg-card rounded-2xl p-8 border border-primary/20 text-center shadow-lg shadow-primary/5">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-xl text-foreground">
                The space is wide open.<br />
                <span className="text-primary font-semibold">We're early — by design.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Business Model Section */}
        <section className="px-6 py-20 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                SaaS the way SaaS <span className="text-primary">was meant to be.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-12">
              {[
                { value: "88–95%", label: "Margins" },
                { value: "£0", label: "Onboarding cost" },
                { value: "Instant", label: "Adoption" },
                { value: "<2mo", label: "CAC payback" },
                { value: "10×–40×", label: "LTV:CAC" },
              ].map((metric, i) => (
                <div key={i} className="bg-primary/5 rounded-xl p-4 text-center border border-primary/10">
                  <p className="text-xl sm:text-2xl font-bold text-primary mb-1">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-xl text-foreground">
                High margin. Low friction. <span className="text-primary font-semibold">Category-defining.</span>
              </p>
            </div>
          </div>
        </section>

        {/* The Raise Section */}
        <section className="px-6 py-20 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                We pilot in 2026.<br />
                <span className="text-primary">To scale, we raise in 2027.</span>
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { amount: "£1.2M", label: "Activation", desc: "Pilot → minimal launch" },
                { amount: "£1.5M", label: "Minimum", desc: "Stable UK launch (~18 months)" },
                { amount: "£1.8M", label: "Optimal", desc: "Best balance of runway + GTM", recommended: true },
                { amount: "£2.2M", label: "Accelerated", desc: "UK scale + early international" },
              ].map((option, i) => (
                <div 
                  key={i} 
                  className={`rounded-2xl p-6 text-center transition-all duration-300 ${
                    option.recommended 
                      ? 'bg-primary text-primary-foreground border-2 border-primary shadow-xl shadow-primary/30 scale-105' 
                      : 'bg-card border border-border hover:border-primary/30 hover:shadow-lg'
                  }`}
                >
                  {option.recommended && (
                    <span className="inline-block bg-primary-foreground text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      RECOMMENDED
                    </span>
                  )}
                  <p className={`text-2xl sm:text-3xl font-bold mb-2 ${option.recommended ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {option.amount}
                  </p>
                  <p className={`text-sm font-medium mb-2 ${option.recommended ? 'text-primary-foreground/90' : 'text-primary'}`}>
                    {option.label}
                  </p>
                  <p className={`text-xs ${option.recommended ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {option.desc}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-xl text-foreground">
                We're raising to bring <span className="text-primary font-semibold">clarity to global real estate.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="px-6 py-24 border-t border-border">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              Clarity shouldn't be a luxury.<br />
              <span className="text-primary">Hobson makes it instant.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Real estate has never been more ready.
            </p>
            
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <p className="text-lg text-foreground mb-6">Want the complete picture?</p>
              <a 
                href="mailto:Rochelle.t@hobsonschoice.ai"
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
              >
                <Mail className="w-5 h-5" />
                Contact Rochelle
              </a>
              <p className="text-sm text-muted-foreground mt-4">Rochelle.t@hobsonschoice.ai</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-border text-center bg-secondary/30">
          <img src={hobsonLogo} alt="Hobson" className="h-8 mx-auto mb-4 opacity-60" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Hobson AI. Confidential.
          </p>
        </footer>
      </div>
    </>
  );
};

export default InvestorSummary;
