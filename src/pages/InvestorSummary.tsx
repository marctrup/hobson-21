import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Search, Zap, Shield, Globe, TrendingUp, DollarSign, Mail, Users, Target, Sparkles, CheckCircle, XCircle } from 'lucide-react';

const InvestorSummary = () => {
  return (
    <>
      <Helmet>
        <title>Investor Summary | Hobson AI</title>
        <meta name="description" content="Hobson AI - Specialised AI for the Property Industry. Investment teaser for real estate document intelligence." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
            {/* Floating document icons */}
            <div className="absolute top-20 left-[10%] opacity-20 animate-bounce delay-100">
              <FileText className="w-8 h-8 text-primary/50" />
            </div>
            <div className="absolute top-32 right-[15%] opacity-15 animate-bounce delay-300">
              <FileText className="w-6 h-6 text-primary/40" />
            </div>
            <div className="absolute bottom-32 left-[20%] opacity-10 animate-bounce delay-500">
              <FileText className="w-10 h-10 text-primary/30" />
            </div>
          </div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              The Document Chaos<br />
              <span className="text-primary">No One Talks About</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 font-light">
              Real estate runs on documents.<br />
              <span className="text-gray-500">Documents run on chaos.</span>
            </p>
          </div>
        </section>

        {/* The Pain Section */}
        <section className="px-6 py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Finding answers shouldn't feel like <span className="text-primary">detective work.</span>
                </h2>
                <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                  Every day, operators lose time digging through leases, titles, reports, and emails…
                  or asking <span className="italic text-gray-500">"Does anyone know where that clause is?"</span>
                </p>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-xl text-gray-300">
                    Real estate runs on knowledge.<br />
                    <span className="text-primary font-semibold">But that knowledge is buried.</span>
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-purple-900/20 flex items-center justify-center">
                  <Search className="w-20 h-20 text-primary/60" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Twist Section */}
        <section className="px-6 py-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">
              Most AI tools show up shouting:<br />
              <span className="text-red-400">"Replace everything!"</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Real estate says: <span className="font-semibold text-gray-300">"Absolutely not."</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 my-12">
              <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20 flex items-center gap-4">
                <XCircle className="w-12 h-12 text-red-400" />
                <span className="text-gray-400">Disruptive AI</span>
              </div>
              <div className="text-3xl text-primary">→</div>
              <div className="bg-primary/10 rounded-xl p-6 border border-primary/20 flex items-center gap-4">
                <CheckCircle className="w-12 h-12 text-primary" />
                <span className="text-white font-medium">Hobson</span>
              </div>
            </div>
            
            <p className="text-xl text-gray-300">
              Hobson takes a different path — <span className="text-primary font-semibold">innovation without disruption.</span>
            </p>
          </div>
        </section>

        {/* What Hobson Does Section */}
        <section className="px-6 py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Your documents.<br />
                Your workflows.<br />
                <span className="text-primary">Instant clarity.</span>
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {[
                { icon: FileText, text: "Upload documents → Hobson understands them" },
                { icon: Zap, text: "Ask a question → Hobson answers instantly" },
                { icon: Shield, text: "Always shows citations" },
                { icon: Sparkles, text: "No onboarding, no integration, no drama" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 rounded-xl p-5 border border-white/10">
                  <item.icon className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-semibold text-primary">
                Finally: AI you can trust.
              </p>
            </div>
          </div>
        </section>

        {/* Market Opportunity Section */}
        <section className="px-6 py-20 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
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
                <div key={i} className="bg-gradient-to-br from-primary/10 to-purple-900/10 rounded-2xl p-8 border border-primary/20 text-center">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <p className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-xl text-gray-300">
                The space is wide open.<br />
                <span className="text-primary font-semibold">We're early — by design.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Business Model Section */}
        <section className="px-6 py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
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
                <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <p className="text-xl sm:text-2xl font-bold text-primary mb-1">{metric.value}</p>
                  <p className="text-xs text-gray-500">{metric.label}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-xl text-gray-300">
                High margin. Low friction. <span className="text-primary font-semibold">Category-defining.</span>
              </p>
            </div>
          </div>
        </section>

        {/* The Raise Section */}
        <section className="px-6 py-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
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
                      ? 'bg-gradient-to-br from-primary/30 to-purple-600/30 border-2 border-primary shadow-lg shadow-primary/20 scale-105' 
                      : 'bg-white/5 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {option.recommended && (
                    <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      RECOMMENDED
                    </span>
                  )}
                  <p className={`text-2xl sm:text-3xl font-bold mb-2 ${option.recommended ? 'text-white' : 'text-gray-200'}`}>
                    {option.amount}
                  </p>
                  <p className={`text-sm font-medium mb-2 ${option.recommended ? 'text-primary' : 'text-gray-400'}`}>
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-500">{option.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-xl text-gray-300">
                We're raising to bring <span className="text-primary font-semibold">clarity to global real estate.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="px-6 py-24 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Clarity shouldn't be a luxury.<br />
              <span className="text-primary">Hobson makes it instant.</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Real estate has never been more ready.
            </p>
            
            <div className="bg-gradient-to-br from-primary/20 to-purple-900/20 rounded-2xl p-8 border border-primary/30">
              <p className="text-lg text-gray-300 mb-6">Want the complete picture?</p>
              <a 
                href="mailto:Rochelle.t@hobsonschoice.ai"
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
              >
                <Mail className="w-5 h-5" />
                Contact Rochelle
              </a>
              <p className="text-sm text-gray-500 mt-4">Rochelle.t@hobsonschoice.ai</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-white/5 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Hobson AI. Confidential.
          </p>
        </footer>
      </div>
    </>
  );
};

export default InvestorSummary;
