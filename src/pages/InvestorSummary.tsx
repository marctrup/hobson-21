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
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[55vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
          {/* Many floating document icons - darker and more visible */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Row 1 - top */}
            <FileText className="absolute top-8 left-[5%] w-10 h-10 text-primary/40 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '3s' }} />
            <FileText className="absolute top-12 left-[15%] w-8 h-8 text-primary/50 animate-bounce" style={{ animationDelay: '200ms', animationDuration: '2.5s' }} />
            <FileText className="absolute top-6 left-[28%] w-12 h-12 text-primary/35 animate-bounce" style={{ animationDelay: '400ms', animationDuration: '3.2s' }} />
            <FileText className="absolute top-14 right-[28%] w-9 h-9 text-primary/45 animate-bounce" style={{ animationDelay: '600ms', animationDuration: '2.8s' }} />
            <FileText className="absolute top-8 right-[15%] w-11 h-11 text-primary/40 animate-bounce" style={{ animationDelay: '800ms', animationDuration: '3.1s' }} />
            <FileText className="absolute top-10 right-[5%] w-7 h-7 text-primary/55 animate-bounce" style={{ animationDelay: '100ms', animationDuration: '2.6s' }} />
            
            {/* Row 2 - upper middle */}
            <FileText className="absolute top-[25%] left-[8%] w-9 h-9 text-primary/45 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '2.9s' }} />
            <FileText className="absolute top-[22%] left-[22%] w-7 h-7 text-primary/50 animate-bounce" style={{ animationDelay: '500ms', animationDuration: '3.3s' }} />
            <FileText className="absolute top-[28%] right-[22%] w-10 h-10 text-primary/40 animate-bounce" style={{ animationDelay: '700ms', animationDuration: '2.7s' }} />
            <FileText className="absolute top-[24%] right-[8%] w-8 h-8 text-primary/55 animate-bounce" style={{ animationDelay: '900ms', animationDuration: '3s' }} />
            
            {/* Row 3 - middle */}
            <FileText className="absolute top-[45%] left-[3%] w-11 h-11 text-primary/35 animate-bounce" style={{ animationDelay: '150ms', animationDuration: '3.4s' }} />
            <FileText className="absolute top-[48%] left-[18%] w-6 h-6 text-primary/60 animate-bounce" style={{ animationDelay: '350ms', animationDuration: '2.4s' }} />
            <FileText className="absolute top-[42%] right-[18%] w-8 h-8 text-primary/50 animate-bounce" style={{ animationDelay: '550ms', animationDuration: '3.2s' }} />
            <FileText className="absolute top-[50%] right-[3%] w-10 h-10 text-primary/40 animate-bounce" style={{ animationDelay: '750ms', animationDuration: '2.8s' }} />
            
            {/* Row 4 - lower middle */}
            <FileText className="absolute top-[65%] left-[10%] w-8 h-8 text-primary/50 animate-bounce" style={{ animationDelay: '250ms', animationDuration: '3.1s' }} />
            <FileText className="absolute top-[68%] left-[25%] w-10 h-10 text-primary/40 animate-bounce" style={{ animationDelay: '450ms', animationDuration: '2.6s' }} />
            <FileText className="absolute top-[62%] right-[25%] w-7 h-7 text-primary/55 animate-bounce" style={{ animationDelay: '650ms', animationDuration: '3.3s' }} />
            <FileText className="absolute top-[70%] right-[10%] w-9 h-9 text-primary/45 animate-bounce" style={{ animationDelay: '850ms', animationDuration: '2.9s' }} />
            
            {/* Row 5 - bottom */}
            <FileText className="absolute bottom-16 left-[7%] w-7 h-7 text-primary/55 animate-bounce" style={{ animationDelay: '50ms', animationDuration: '2.7s' }} />
            <FileText className="absolute bottom-20 left-[20%] w-11 h-11 text-primary/35 animate-bounce" style={{ animationDelay: '250ms', animationDuration: '3.5s' }} />
            <FileText className="absolute bottom-12 left-[35%] w-8 h-8 text-primary/50 animate-bounce" style={{ animationDelay: '450ms', animationDuration: '2.5s' }} />
            <FileText className="absolute bottom-18 right-[35%] w-9 h-9 text-primary/45 animate-bounce" style={{ animationDelay: '650ms', animationDuration: '3s' }} />
            <FileText className="absolute bottom-14 right-[20%] w-6 h-6 text-primary/60 animate-bounce" style={{ animationDelay: '850ms', animationDuration: '2.8s' }} />
            <FileText className="absolute bottom-20 right-[7%] w-10 h-10 text-primary/40 animate-bounce" style={{ animationDelay: '150ms', animationDuration: '3.2s' }} />
          </div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <p className="text-primary font-semibold text-lg sm:text-xl tracking-wide mb-4">HOBSON AI</p>
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

        {/* Divider */}
        <div className="max-w-3xl mx-auto border-t border-border" />

        {/* The Pain Section */}
        <section className="px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-5 text-foreground">
                  Finding answers shouldn't feel like <span className="text-primary">detective work.</span>
                </h2>
                <p className="text-base text-muted-foreground mb-5 leading-relaxed">
                  Every day, operators lose time digging through leases, titles, reports, and emails…
                  or asking <span className="italic text-muted-foreground/70">"Does anyone know where that clause is?"</span>
                </p>
                <div className="bg-primary/5 rounded-lg p-5 border-l-4 border-primary">
                  <p className="text-lg text-foreground">
                    Real estate runs on knowledge.<br />
                    <span className="text-primary font-semibold">But that knowledge is buried.</span>
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                  <Search className="w-14 h-14 text-primary/70" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-3xl mx-auto border-t border-border" />

        {/* The Twist Section */}
        <section className="px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">
              Most AI tools show up shouting:<br />
              <span className="text-destructive">"Replace everything!"</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Real estate says: <span className="font-semibold text-foreground">"Absolutely not."</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-10">
              <div className="bg-destructive/10 rounded-lg p-5 border border-destructive/20 flex items-center gap-3">
                <XCircle className="w-10 h-10 text-destructive" />
                <span className="text-muted-foreground">Disruptive AI</span>
              </div>
              <div className="text-2xl text-primary font-bold">→</div>
              <div className="bg-primary/10 rounded-lg p-5 border border-primary/30 flex items-center gap-3">
                <CheckCircle className="w-10 h-10 text-primary" />
                <span className="text-foreground font-medium">Hobson</span>
              </div>
            </div>
            
            <p className="text-lg text-foreground">
              Hobson takes a different path — <span className="text-primary font-semibold">innovation without disruption.</span>
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-3xl mx-auto border-t border-border" />

        {/* What Hobson Does Section - with Mascot */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              {/* Mascot */}
              <div className="lg:w-1/3 flex justify-center">
                <img 
                  src={hobsonMascot} 
                  alt="Hobson the Owl" 
                  className="w-40 sm:w-48 lg:w-56 drop-shadow-xl"
                />
              </div>
              
              {/* Content */}
              <div className="lg:w-2/3">
                <div className="text-center lg:text-left mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
                    Your documents. Your workflows.<br />
                    <span className="text-primary">Instant clarity.</span>
                  </h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {[
                    { icon: FileText, text: "Upload documents → Hobson understands them" },
                    { icon: Zap, text: "Ask a question → Hobson answers instantly" },
                    { icon: Shield, text: "Always shows citations" },
                    { icon: Sparkles, text: "No onboarding, no integration, no drama" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-secondary/50 rounded-lg p-4 border border-border">
                      <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center lg:text-left">
                  <p className="text-xl font-semibold text-primary">
                    Finally: AI you can trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-3xl mx-auto border-t border-border" />

        {/* Market Opportunity Section */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
                A massive, ignored, <span className="text-primary">document-heavy category.</span>
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-5 mb-10">
              {[
                { value: "235,200", label: "UK real estate companies", icon: Target },
                { value: "4.2M", label: "Global OECD target market", icon: Globe },
                { value: "0", label: "Category leaders in AI doc intelligence", icon: Users },
              ].map((stat, i) => (
                <div key={i} className="bg-card rounded-xl p-6 border border-border text-center">
                  <stat.icon className="w-7 h-7 text-primary mx-auto mb-3" />
                  <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-lg text-foreground">
                The space is wide open. <span className="text-primary font-semibold">We're early — by design.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-3xl mx-auto border-t border-border" />

        {/* Business Model Section */}
        <section className="px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
                SaaS the way SaaS <span className="text-primary">was meant to be.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
              {[
                { value: "88–95%", label: "Margins" },
                { value: "£0", label: "Onboarding cost" },
                { value: "Instant", label: "Adoption" },
                { value: "<2mo", label: "CAC payback" },
                { value: "10×–40×", label: "LTV:CAC" },
              ].map((metric, i) => (
                <div key={i} className="bg-primary/5 rounded-lg p-3 text-center border border-primary/10">
                  <p className="text-lg sm:text-xl font-bold text-primary mb-0.5">{metric.value}</p>
                  <p className="text-[10px] text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-lg text-foreground">
                High margin. Low friction. <span className="text-primary font-semibold">Category-defining.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-3xl mx-auto border-t border-border" />

        {/* The Raise Section */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
                We pilot in 2026. <span className="text-primary">To scale, we raise in 2027.</span>
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {[
                { amount: "£1.2M", label: "Activation", desc: "Pilot → minimal launch" },
                { amount: "£1.5M", label: "Minimum", desc: "Stable UK launch (~18 months)" },
                { amount: "£1.8M", label: "Optimal", desc: "Best balance of runway + GTM", recommended: true },
                { amount: "£2.2M", label: "Accelerated", desc: "UK scale + early international" },
              ].map((option, i) => (
                <div 
                  key={i} 
                  className={`rounded-xl p-5 text-center transition-all ${
                    option.recommended 
                      ? 'bg-primary text-primary-foreground border-2 border-primary' 
                      : 'bg-card border border-border'
                  }`}
                >
                  {option.recommended && (
                    <span className="inline-block bg-primary-foreground text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2">
                      RECOMMENDED
                    </span>
                  )}
                  <p className={`text-xl sm:text-2xl font-bold mb-1 ${option.recommended ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {option.amount}
                  </p>
                  <p className={`text-xs font-medium mb-1 ${option.recommended ? 'text-primary-foreground/90' : 'text-primary'}`}>
                    {option.label}
                  </p>
                  <p className={`text-[10px] ${option.recommended ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {option.desc}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-lg text-foreground">
                We're raising to bring <span className="text-primary font-semibold">clarity to global real estate.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-3xl mx-auto border-t border-border" />

        {/* Closing Section */}
        <section className="px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
              Clarity shouldn't be a luxury.<br />
              <span className="text-primary">Hobson makes it instant.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Real estate has never been more ready.
            </p>
            
            <div className="bg-primary/5 rounded-xl p-8 border-l-4 border-primary">
              <p className="text-base text-foreground mb-5">Want the complete picture?</p>
              <a 
                href="mailto:Rochelle.t@hobsonschoice.ai"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-all"
              >
                <Mail className="w-4 h-4" />
                Contact Rochelle
              </a>
              <p className="text-sm text-muted-foreground mt-4">Rochelle.t@hobsonschoice.ai</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Hobson AI. Confidential.
          </p>
        </footer>
      </div>
    </>
  );
};

export default InvestorSummary;
