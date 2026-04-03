import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, MessageSquareText, GitBranch, BookCheck } from "lucide-react";

const featureStrip = [
  {
    icon: FileText,
    title: "Reads any property document",
    body: "Leases, licences, deeds, compliance certificates, EPCs, surveys — Hobson ingests them and understands them. Not just stores them.",
  },
  {
    icon: MessageSquareText,
    title: "Answers questions instantly",
    body: 'Ask anything in plain English. "When is the next rent review?" "What are my repair obligations?" "Does this lease have a break clause?" Hobson answers from the document, with the source referenced.',
  },
  {
    icon: GitBranch,
    title: "Understands what supersedes what",
    body: "A lease is rarely one document. Deeds of variation, rent memorandums, licences and supplemental agreements all modify the original terms. Hobson reads the full document stack and understands the current legal position — not just what the original lease said.",
  },
  {
    icon: BookCheck,
    title: "Every answer is sourced and auditable",
    body: "Hobson never guesses. Every answer references the exact clause it came from. For regulated property decisions, that auditability is not optional — it is essential.",
  },
];

const personas = [
  {
    name: "Sarah",
    role: "Portfolio Manager",
    business: "Residential and commercial property management firm, 340 units across 12 landlord clients",
    quote: "Before Hobson, answering a simple question about a lease meant finding the document, opening it, searching through it and hoping you found the right clause. Multiply that by 340 units and you understand why my team spent more time reading documents than managing property.",
    questionLabel: "The question Sarah asks Hobson most",
    question: "What is the current rent review mechanism and notice period on this lease — taking into account any rent memorandums or deeds of variation?",
  },
  {
    name: "James",
    role: "Head of Property",
    business: "Regional retail operator, 47 stores across the UK",
    quote: "I am not a property lawyer. I am a retailer. But I am responsible for 47 leases and the obligations in them. Before Hobson, getting an answer to a basic lease question meant calling a solicitor and waiting two days. Now I ask Hobson.",
    questionLabel: "The question James asks Hobson most",
    question: "Which of my leases have a break clause in the next 18 months and what are the pre-conditions for each?",
  },
  {
    name: "Priya",
    role: "Operations Director",
    business: "Hospitality group, 23 restaurant and bar sites",
    quote: "Every one of our sites has a commercial lease. I needed to know what our repair obligations were across all 23 before our annual board review. My previous options were pay a solicitor to review them all or spend a week doing it myself. Hobson did it in an afternoon.",
    questionLabel: "The question Priya asks Hobson most",
    question: "What are our tenant repair obligations across all sites and which leases have full repairing and insuring terms?",
  },
  {
    name: "David",
    role: "COO",
    business: "Professional services firm, 8 regional offices",
    quote: "We were acquiring a smaller firm with 6 office leases. We needed to understand what we were taking on — break options, dilapidations exposure, assignment restrictions — across all 6 leases within 10 days. Hobson gave us the picture in 24 hours.",
    questionLabel: "The question David asks Hobson most",
    question: "What are the material obligations and restrictions across these leases and are there any upcoming critical dates?",
  },
];

const scenarios = [
  {
    title: "Lease Review Before Signing",
    situation: "A property manager at a regional managing agent was asked to review a new management instruction for a commercial portfolio. The landlord wanted to understand the key terms across 8 leases before formally appointing the agent. Manually reviewing 8 commercial leases to extract rent, review dates, break options, repair obligations and service charge provisions would typically take two to three days.",
    hobsonDid: "All 8 leases were added to Hobson. The manager asked a series of plain English questions across the portfolio — rent review mechanisms, break clause dates, repair obligations, alienation restrictions. Hobson answered each one, referencing the exact clause in each lease. A summary of key terms across all 8 leases was produced and ready for the client within three hours.",
    honestly: "Hobson did not draft any notices, instruct any solicitors or take any autonomous action. It read the documents and answered questions about them accurately and quickly. That alone saved approximately two days of manual review time and gave the manager confidence that nothing material had been missed.",
  },
  {
    title: "Acquisition Due Diligence",
    situation: "A professional services firm was acquiring a competitor with 6 office leases across 4 cities. The acquisition team needed to understand the property liability they were taking on — remaining terms, break options, dilapidations exposure, assignment restrictions, personal guarantee clauses — within a 10-day due diligence window. The cost of instructing solicitors to review all 6 leases would have been significant.",
    hobsonDid: "All 6 leases were added to Hobson. The team asked specific questions about each lease — break clause dates and notice periods, repair and reinstatement obligations, assignment and underletting restrictions, any unusual or onerous clauses. Hobson identified that one lease contained a keep-open obligation that would restrict the acquiring firm's use of the space, and that another had a personal guarantee clause requiring novation on acquisition. Both were flagged clearly with the relevant clause referenced.",
    honestly: "Hobson read the documents and answered questions about what was in them. The team still needed a solicitor to advise on the legal implications and draft the relevant acquisition documents. But Hobson told them what to look for and where — reducing the solicitor's review time significantly and ensuring nothing material was missed in the initial assessment.",
  },
  {
    title: "Portfolio Question Across Multiple Leases",
    situation: "A retail property manager needed to answer a question from a landlord client — which units in the portfolio had rent reviews due in the next 12 months, and what was the review mechanism for each. Answering that question manually meant opening every lease, finding the rent review clause, extracting the dates and mechanism, and compiling the results. With 22 units in the portfolio that was a full day's work.",
    hobsonDid: 'All 22 leases were already in Hobson. The manager asked: "Which units have rent reviews due in the next 12 months and what is the review mechanism for each?" Hobson answered across all 22 leases simultaneously, listing each unit, the review date, the mechanism — open market, RPI-linked or fixed uplift — and the relevant notice period, with every answer referenced to the specific lease clause.',
    honestly: "The question was answered in minutes rather than a day. Hobson did not initiate any rent review process, draft any notices or take any action — that is Phase 3 capability coming later this year. But knowing which reviews were coming and what the mechanism was gave the manager and the landlord client the information they needed to plan ahead.",
  },
  {
    title: "Understanding Compliance Obligations From Leases",
    situation: "A hospitality group operations director needed to understand what her lease obligations were regarding EPC compliance across 23 sites before a board presentation. The leases varied — some were full repairing and insuring, some were internal repairing only, and the EPC obligations differed accordingly. Understanding which sites carried tenant EPC responsibility versus landlord responsibility required reading 23 leases.",
    hobsonDid: 'All 23 leases were in Hobson. The director asked: "Which of our leases make the tenant responsible for EPC compliance and which place that obligation on the landlord?" Hobson answered across all 23 leases, identifying 14 where the tenant carried the EPC obligation and 9 where it sat with the landlord — with each answer referenced to the specific lease clause.',
    honestly: "Hobson identified the obligation from the lease. It did not build a compliance register, instruct contractors or manage any remediation workflow — that is Phase 3 capability. But knowing which sites carried which obligation, drawn directly from the lease terms, gave the director an accurate picture she could present to the board with confidence.",
  },
  {
    title: "When The Lease Is Not The Whole Story",
    situation: "A property manager inherited a portfolio of 18 commercial units from a retiring colleague. The files contained not just the original leases but years of subsequent documents — deeds of variation changing rents, licences to alter permitting fit-outs, rent memorandums confirming reviewed rents, and in two cases supplemental deeds extending the original terms. The manager needed to understand the current legal position on each unit. Reading only the original leases would have given the wrong answer on at least half of them.",
    hobsonDid: "All documents for each unit were added to Hobson — original leases and all subsequent documents together. When the manager asked what the current rent was on Unit 7, Hobson did not return the original rent from the lease. It identified that a rent memorandum had been executed following a rent review, and that a subsequent deed of variation had further modified the rent. It returned the current passing rent with every document in the chain referenced. The same logic applied across every unit — Hobson understood which documents superseded which and answered based on the current legal position, not the original one.",
    honestly: "This is one of the most important things Hobson does and one of the hardest to replicate. Reading a single document is straightforward. Understanding the legal hierarchy across a stack of documents — knowing that a deed of variation from 2019 changes repair obligations in a lease from 2011, and that a side letter from 2022 further qualifies those obligations — requires multi-document reasoning that generic AI tools cannot reliably deliver. Hobson is built for this from the ground up.",
  },
];


const InPractice = () => {
  return (
    <>
      <Helmet>
        <title>In Practice | Hobson AI — Real property work, real results</title>
        <meta name="description" content="See how property managers, retail operators, hospitality businesses and corporate real estate teams use Hobson AI to manage lease obligations, compliance deadlines and property work — accurately and automatically." />
      </Helmet>

      <GlobalHeader />

      <main id="main-content" className="min-h-screen bg-background" role="main">

        {/* SECTION 1 — Page Header */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Your property documents, finally working for you.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Phase 1 of Hobson is live now. It reads your leases, compliance documents and property contracts — and makes every clause, obligation and date instantly queryable in plain English. No legal training required. No hours of manual review. Just answers.
            </p>
          </div>
        </section>

        {/* SECTION 2 — What Hobson Does Today */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featureStrip.map((f, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — Persona Cards */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-12">Who uses Hobson</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {personas.map((p, i) => (
                <Card key={i} className="border bg-card p-6 sm:p-8">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-foreground">{p.name}</h3>
                    <p className="text-sm font-medium text-primary">{p.role}</p>
                    <p className="text-sm text-muted-foreground mt-1">{p.business}</p>
                  </div>
                  <blockquote className="text-sm text-muted-foreground italic leading-relaxed mb-6">
                    "{p.quote}"
                  </blockquote>
                  <div className="border-l-2 border-primary bg-primary/5 rounded-r-lg p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">{p.questionLabel}</p>
                    <p className="text-sm text-foreground font-medium leading-relaxed">"{p.question}"</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — Scenarios */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-12">Real scenarios, real answers</h2>

            {scenarios.map((s, i) => (
              <div
                key={i}
                className={`py-12 sm:py-16 ${i % 2 === 1 ? "bg-muted/30 -mx-4 px-4 sm:-mx-8 sm:px-8 rounded-lg" : ""}`}
              >
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
                  {/* Chapter number */}
                  <div className="lg:w-24 flex-shrink-0">
                    <span className="text-5xl sm:text-6xl lg:text-7xl font-extralight text-primary/20 leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">{s.title}</h3>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">The situation</p>
                      <p className="text-base text-muted-foreground leading-relaxed">{s.situation}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">What Hobson did</p>
                      <p className="text-base text-foreground leading-relaxed">{s.hobsonDid}</p>
                    </div>

                    <div className="border-l-2 border-primary bg-primary/5 rounded-r-lg p-4 sm:p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">What this means honestly</p>
                      <p className="text-base text-muted-foreground leading-relaxed">{s.honestly}</p>
                    </div>
                  </div>
                </div>

                {i < scenarios.length - 1 && !(i % 2 === 1) && (
                  <div className="border-b border-border/30 mt-12 sm:mt-16" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5 — Coming Soon Strip */}
        <section className="py-12 sm:py-16 bg-muted/40 border-y border-border/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <Badge variant="outline" className="mb-6 text-xs tracking-widest">
              COMING LATER THIS YEAR
            </Badge>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Hobson is building next
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-3xl">
              Phase 1 is live now. Here is what is coming.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border bg-background p-6 space-y-4">
                <Badge className="w-fit bg-primary/10 text-primary border-0">Phase 2</Badge>
                <h3 className="text-xl font-bold text-foreground">The Knowledge Base</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Hobson learns how your business operates. Your contractors, contacts, policies, approval thresholds and communication preferences — stored permanently and applied to every answer. Hobson stops being a document tool and starts behaving like an informed member of your team.
                </p>
                <Link to="/pricing" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                  Join the waitlist <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
              <Card className="border-border bg-background p-6 space-y-4">
                <Badge className="w-fit bg-primary/10 text-primary border-0">Phase 3</Badge>
                <h3 className="text-xl font-bold text-foreground">The Application Layer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Hobson stops answering and starts acting. Rent reviews triggered automatically. Compliance deadlines flagged and actioned. Lease events managed end-to-end without a human in the loop until a decision is required. The work gets done.
                </p>
                <Link to="/pricing" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                  Join the waitlist <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            </div>
          </div>
        </section>


        {/* SECTION 7 — Closing CTA */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Phase 1 is live. Try it on your documents today.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Add your first document and ask your first question in minutes. No card required. No technical setup. Just answers from your leases — sourced, auditable and ready in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base px-8 py-4 h-auto">
                <Link to="/pricing">
                  Start free — no card required
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 py-4 h-auto">
                <Link to="/pricing">
                  Join the waitlist for Tier 2
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 border-t bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Hobson AI. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/data-protection" className="hover:text-foreground transition-colors">Data Protection</Link>
            <Link to="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default InPractice;
