import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Search, Zap, Shield, Globe, Mail, Users, Target, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import hobsonMascot from '@/assets/hobson-mascot.png';

const InvestorSummary = () => {
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
        <section className="relative min-h-[45vh] sm:min-h-[55vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 overflow-hidden">
          {/* Floating document icons - fewer on mobile, more on desktop */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Mobile: fewer icons */}
            <FileText className="absolute top-8 left-[5%] w-6 h-6 sm:w-10 sm:h-10 text-primary/40 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '3s' }} />
            <FileText className="absolute top-12 right-[8%] w-5 h-5 sm:w-8 sm:h-8 text-primary/50 animate-bounce" style={{ animationDelay: '200ms', animationDuration: '2.5s' }} />
            <FileText className="absolute top-[30%] left-[3%] w-7 h-7 sm:w-11 sm:h-11 text-primary/35 animate-bounce" style={{ animationDelay: '400ms', animationDuration: '3.2s' }} />
            <FileText className="absolute top-[35%] right-[5%] w-6 h-6 sm:w-9 sm:h-9 text-primary/45 animate-bounce" style={{ animationDelay: '600ms', animationDuration: '2.8s' }} />
            <FileText className="absolute bottom-[30%] left-[8%] w-5 h-5 sm:w-8 sm:h-8 text-primary/50 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '3.1s' }} />
            <FileText className="absolute bottom-[25%] right-[3%] w-7 h-7 sm:w-10 sm:h-10 text-primary/40 animate-bounce" style={{ animationDelay: '500ms', animationDuration: '2.9s' }} />
            <FileText className="absolute bottom-16 left-[5%] w-6 h-6 sm:w-9 sm:h-9 text-primary/45 animate-bounce" style={{ animationDelay: '700ms', animationDuration: '3s' }} />
            <FileText className="absolute bottom-12 right-[10%] w-5 h-5 sm:w-7 sm:h-7 text-primary/55 animate-bounce" style={{ animationDelay: '100ms', animationDuration: '2.6s' }} />
            
            {/* Desktop only: additional icons */}
            <FileText className="hidden sm:block absolute top-6 left-[28%] w-12 h-12 text-primary/35 animate-bounce" style={{ animationDelay: '400ms', animationDuration: '3.2s' }} />
            <FileText className="hidden sm:block absolute top-14 right-[28%] w-9 h-9 text-primary/45 animate-bounce" style={{ animationDelay: '600ms', animationDuration: '2.8s' }} />
            <FileText className="hidden sm:block absolute top-[22%] left-[22%] w-7 h-7 text-primary/50 animate-bounce" style={{ animationDelay: '500ms', animationDuration: '3.3s' }} />
            <FileText className="hidden sm:block absolute top-[28%] right-[22%] w-10 h-10 text-primary/40 animate-bounce" style={{ animationDelay: '700ms', animationDuration: '2.7s' }} />
            <FileText className="hidden sm:block absolute top-[45%] left-[15%] w-6 h-6 text-primary/60 animate-bounce" style={{ animationDelay: '350ms', animationDuration: '2.4s' }} />
            <FileText className="hidden sm:block absolute top-[42%] right-[18%] w-8 h-8 text-primary/50 animate-bounce" style={{ animationDelay: '550ms', animationDuration: '3.2s' }} />
            <FileText className="hidden sm:block absolute top-[65%] left-[20%] w-8 h-8 text-primary/50 animate-bounce" style={{ animationDelay: '250ms', animationDuration: '3.1s' }} />
            <FileText className="hidden sm:block absolute top-[68%] right-[25%] w-10 h-10 text-primary/40 animate-bounce" style={{ animationDelay: '450ms', animationDuration: '2.6s' }} />
            <FileText className="hidden sm:block absolute bottom-20 left-[35%] w-8 h-8 text-primary/50 animate-bounce" style={{ animationDelay: '450ms', animationDuration: '2.5s' }} />
            <FileText className="hidden sm:block absolute bottom-16 right-[35%] w-9 h-9 text-primary/45 animate-bounce" style={{ animationDelay: '650ms', animationDuration: '3s' }} />
          </div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto px-2">
            <p className="text-primary font-semibold text-base sm:text-lg md:text-xl tracking-wide mb-3 sm:mb-4">HOBSON  A Specialist AI</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-foreground">
              The Document Chaos<br />
              <span className="text-primary">No One Talks About</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light">
              Real estate runs on documents.<br />
              <span className="text-muted-foreground/70">Documents run on chaos.</span>
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* The Pain Section */}
        <section className="px-4 sm:px-6 py-10 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10">
              <div className="flex-1 order-2 md:order-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5 text-foreground text-center md:text-left">
                  Finding answers shouldn't feel like <span className="text-primary">detective work.</span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-5 leading-relaxed text-center md:text-left">
                  Every day, operators lose time digging through leases, titles, reports, and emails…
                  or asking <span className="italic text-muted-foreground/70">"Does anyone know where that clause is?"</span>
                </p>
                <div className="bg-primary/5 rounded-lg p-4 sm:p-5 border-l-4 border-primary">
                  <p className="text-base sm:text-lg text-foreground text-center md:text-left">
                    Real estate runs on knowledge.<br />
                    <span className="text-primary font-semibold">But that knowledge is buried.</span>
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 order-1 md:order-2">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                  <Search className="w-10 h-10 sm:w-14 sm:h-14 text-primary/70" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* The Twist Section */}
        <section className="px-4 sm:px-6 py-10 sm:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-foreground">
              Most AI tools show up shouting:<br />
              <span className="text-destructive">"Replace everything!"</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
              Real estate says: <span className="font-semibold text-foreground">"Absolutely not."</span>
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
            
            <p className="text-base sm:text-lg text-foreground">
              Hobson takes a different path — <span className="text-primary font-semibold">innovation without disruption.</span>
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* What Hobson Does Section - with Mascot */}
        <section className="px-4 sm:px-6 py-10 sm:py-16">
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
                    Your documents. Your workflows.<br />
                    <span className="text-primary">Instant clarity.</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {[
                    { icon: FileText, text: "Upload documents → Hobson understands them" },
                    { icon: Zap, text: "Ask a question → Hobson answers instantly" },
                    { icon: Shield, text: "Always shows citations" },
                    { icon: Sparkles, text: "No onboarding, no integration, no drama" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 bg-secondary/50 rounded-lg p-3 sm:p-4 border border-border">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground text-xs sm:text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-semibold text-primary">
                    Finally: AI you can trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* How Big Is This Market Section */}
        <section className="px-4 sm:px-6 py-10 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-foreground">
                How Big Is This Market?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Bigger than you think.<br />
                Bigger than we thought.<br />
                <span className="italic">Honestly… bigger than anyone needs it to be.</span>
              </p>
            </div>
            
            {/* UK TAM */}
            <div className="bg-primary/5 rounded-xl p-5 sm:p-8 border border-primary/20 mb-4 sm:mb-6 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-2">UK TAM</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-3 sm:mb-4">£1.41B</p>
              <p className="text-sm sm:text-base text-foreground">
                That's a lot of documents.<br />
                <span className="text-muted-foreground">Enough to wallpaper every office. Twice.</span>
              </p>
            </div>
            
            {/* Global TAM */}
            <div className="bg-primary/10 rounded-xl p-5 sm:p-8 border border-primary/30 mb-6 sm:mb-10 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-2">Global TAM</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-3 sm:mb-4">£155.6B</p>
              <p className="text-sm sm:text-base text-foreground">
                Yes, you read that right.<br />
                <span className="text-muted-foreground">Apparently the whole world is drowning in PDFs. Who knew?</span>
              </p>
            </div>
            
            {/* Translation */}
            <div className="bg-card rounded-xl p-5 sm:p-6 border-l-4 border-primary text-center sm:text-left">
              <p className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-wider mb-2">Translation</p>
              <p className="text-base sm:text-lg text-foreground mb-3">
                There's a huge amount of value locked in documents.<br />
                All someone needs is a key.
              </p>
              <p className="text-lg sm:text-xl font-bold text-primary">
                Hobson is that key.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* Market Opportunity Section */}
        <section className="px-4 sm:px-6 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-foreground">
                A massive, ignored, <span className="text-primary">document-heavy category.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-10">
              {[
                { value: "235,200", label: "UK real estate companies", icon: Target },
                { value: "4.2M", label: "Global OECD target market", icon: Globe },
                { value: "0", label: "Category leaders in AI doc intelligence", icon: Users },
              ].map((stat, i) => (
                <div key={i} className="bg-card rounded-xl p-4 sm:p-6 border border-border text-center">
                  <stat.icon className="w-5 h-5 sm:w-7 sm:h-7 text-primary mx-auto mb-2 sm:mb-3" />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-base sm:text-lg text-foreground">
                The space is wide open. <span className="text-primary font-semibold">We're early — by design.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* Business Model Section */}
        <section className="px-4 sm:px-6 py-10 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-foreground">
                SaaS the way SaaS <span className="text-primary">was meant to be.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-6 sm:mb-10">
              {[
                { value: "88–95%", label: "Margins" },
                { value: "£0", label: "Onboarding" },
                { value: "Instant", label: "Adoption" },
                { value: "1.5–9 mo", label: "CAC Payback" },
                { value: "10×–40×", label: "LTV:CAC" },
              ].map((metric, i) => (
                <div key={i} className={`bg-primary/5 rounded-lg p-2 sm:p-3 text-center border border-primary/10 ${i >= 3 ? 'col-span-1 sm:col-span-1' : ''}`}>
                  <p className="text-sm sm:text-lg md:text-xl font-bold text-primary mb-0.5">{metric.value}</p>
                  <p className="text-[8px] sm:text-[10px] text-muted-foreground leading-tight">{metric.label}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-base sm:text-lg text-foreground">
                High margin. Low friction. <span className="text-primary font-semibold">Category-defining.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* The Raise Section */}
        <section className="px-4 sm:px-6 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-foreground">
                We pilot in 2026. <span className="text-primary">To scale, we raise for 2027.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
              {[
                { amount: "£1.2M", label: "Activation", desc: "Pilot → minimal launch" },
                { amount: "£1.5M", label: "Minimum", desc: "Stable UK launch" },
                { amount: "£1.8M", label: "Optimal", desc: "Best runway + GTM", recommended: true },
                { amount: "£2.2M", label: "Accelerated", desc: "UK + international" },
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
                    <span className="inline-block bg-primary-foreground text-primary text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full mb-1 sm:mb-2">
                      RECOMMENDED
                    </span>
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
            
            <div className="text-center">
              <p className="text-base sm:text-lg text-foreground">
                We're raising to bring <span className="text-primary font-semibold">clarity to global real estate.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 sm:max-w-3xl sm:mx-auto border-t border-border" />

        {/* Closing Section */}
        <section className="px-4 sm:px-6 py-10 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-foreground">
              Clarity shouldn't be a luxury.<br />
              <span className="text-primary">Hobson makes it instant.</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-10">
              Real estate has never been more ready.
            </p>
            
            <div className="bg-primary/5 rounded-xl p-5 sm:p-8 border-l-4 border-primary">
              <p className="text-sm sm:text-base text-foreground mb-4 sm:mb-5">Want the complete picture?</p>
              <a 
                href="mailto:rochelle.t@hobsonschoice.ai"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base"
              >
                <Mail className="w-4 h-4" />
                Contact Rochelle
              </a>
            </div>
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
