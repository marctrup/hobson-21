import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const features = [
  {
    name: "Multi-Document Reasoning",
    problem: "Most property questions cannot be answered from a single document. A rent review question requires the lease. A service charge question requires the lease, the budget and the actual cost schedule. A compliance question requires the certificate, the lease obligation and the regulatory requirement. Reading each document separately and connecting the dots manually is exactly the kind of work that consumes property teams.",
    does: "Hobson reads multiple documents simultaneously and reasons across them as a connected set. Ask a question that spans three documents and Hobson draws the answer from all three — identifying where the relevant information sits, how the documents relate to each other, and what the combined position means. It does not summarise each document separately. It answers the question.",
    matters: "Property decisions are never made from a single document. Hobson is built for the way property work actually happens — across a stack of connected documents — not for the way software usually handles it.",
  },
  {
    name: "Document Hierarchy Understanding",
    problem: "A commercial lease from 2011 is not the whole story. A deed of variation from 2015 changed the permitted use. A rent memorandum from 2019 confirmed the reviewed rent. A side letter from 2022 qualified the repair obligations. Reading only the original lease gives the wrong answer. Understanding what the current legal position actually is requires reading every document in the stack and knowing which ones supersede which.",
    does: "Hobson understands document hierarchy. When multiple documents relate to the same property or obligation, Hobson identifies which are original and which are subsequent, reads them in the correct legal sequence, and returns the current position — not the historical one. If a deed of variation changes a repair obligation, Hobson applies the variation. If a rent memorandum confirms a reviewed rent, Hobson uses that figure. The answer always reflects the current legal reality.",
    matters: "This is one of the hardest things to get right in property AI and one of the most consequential to get wrong. A generic AI tool reads documents. Hobson understands the relationship between them.",
  },
  {
    name: "Plain English Querying",
    problem: "Property documents are written in legal language. The people who need to act on them — operations directors, retail managers, hospitality COOs, asset managers — are not lawyers. Translating legal text into operational decisions has always required either legal training or expensive professional advice.",
    does: 'Hobson accepts questions in plain English and returns answers in plain English. There is no query language to learn, no search syntax to master and no training required. Ask the way you would ask a colleague — "What is the break clause on Unit 4 and what do I need to do to exercise it?" — and Hobson answers directly from the document. If the answer requires interpreting a complex legal clause, Hobson does the interpretation and explains what it means practically.',
    matters: "The value of property documents should not be locked behind legal expertise. Hobson makes every clause in every document accessible to everyone in the business who needs to act on it.",
  },
  {
    name: "Sourced and Auditable Answers",
    problem: "For regulated property decisions — rent reviews, dilapidations, compliance obligations, lease renewals — getting the right answer is not enough. You need to be able to show where the answer came from, which clause supports it, and why the conclusion is correct. An answer you cannot audit is an answer you cannot rely on.",
    does: "Every answer Hobson provides is referenced to the exact document and clause it came from. Hobson never generates an answer from general knowledge or makes an inference without telling you it has done so. If the information is in your documents, Hobson cites it precisely. If it is not, Hobson tells you clearly rather than guessing. Every answer is a chain from question to source — traceable, verifiable and defensible.",
    matters: "In property, wrong answers have financial and legal consequences. Sourced answers are not a nice-to-have — they are the minimum standard for decisions that matter.",
  },
  {
    name: "Cross-Portfolio Questioning",
    problem: 'A portfolio question — "which of my leases have a break clause in the next 12 months?" — sounds simple. But answering it manually means opening every lease, finding the relevant clause in each one, extracting the information and compiling the results. For a portfolio of 20 units that is a full day\'s work. For a portfolio of 200 units it is a week.',
    does: "Hobson answers questions across your entire portfolio simultaneously. Every lease in your account is available as a single queryable dataset. Ask one question and Hobson returns the answer from every relevant document at once — listing which units have break clauses, what the dates are, what the notice periods are and what the pre-conditions are. The same applies to rent review dates, EPC obligations, repair responsibilities or any other term that varies across your portfolio.",
    matters: "Portfolio-level insight is where Hobson delivers its most immediate time saving. Questions that previously took days take minutes.",
  },
  {
    name: "Document Type Breadth",
    problem: "Property portfolios contain many different types of document — not just leases. Compliance certificates, EPCs, surveys, licences, deeds, title documents, planning permissions, fire safety assessments — all of these contain information that property teams need to access and act on. Most document tools handle leases reasonably. Very few handle the full range of property documents with the same accuracy.",
    does: "Hobson is trained to read and reason across the full range of property documents — original leases and residential tenancy agreements, deeds of variation and supplemental deeds, licences to alter, rent memorandums, authorised guarantee agreements, EPC certificates, gas safety certificates, EICR reports, fire safety assessments, surveys and planning documents. New document types are added regularly as the platform develops.",
    matters: "Property obligations do not live only in leases. Hobson reads the full document set that defines what your business is actually required to do.",
  },
  {
    name: "98% Accuracy on Real Estate Datasets",
    problem: "Generic AI tools produce plausible answers. For most tasks that is acceptable. For property decisions — where a wrong answer about a break clause notice period can invalidate a legal right, and a wrong answer about an EPC obligation can result in regulatory action — plausible is not good enough. The accuracy threshold for regulated decisions is materially higher than for general information retrieval.",
    does: "Hobson is fine-tuned on proprietary real estate datasets — not adapted from a general-purpose language model. It is trained specifically for the language, structure and conventions of commercial and residential property documents in the UK. The result is 98% accuracy on industry-specific document reasoning tasks — a figure validated on real property documents, not synthetic benchmarks.",
    matters: "The difference between a general AI tool and a domain-specific one is not a matter of degree. For regulated property decisions, it is the difference between an answer you can act on and one you cannot.",
  },
  {
    name: "No Integration Required",
    problem: "Most software implementations require integration work — connecting to existing systems, migrating data, retraining teams, updating workflows. For property teams already managing significant operational complexity, a new system that requires a six-month implementation project is not a practical option regardless of how good the product is.",
    does: "Hobson requires no integration with your existing systems to deliver value. Add your documents directly to Hobson and start asking questions. It works alongside whatever property management system, CRM or document storage you currently use — reading documents you add to it, answering questions about them, and fitting around your existing workflows rather than replacing them. There is no rip-and-replace. There is no migration. There is no implementation project. You are up and running in minutes.",
    matters: "The fastest route to value is no friction at all. Hobson is useful from the moment your first document is added.",
  },
  {
    name: "UK-Hosted, Encrypted and ISO 27001 Aligned",
    problem: "Property documents contain commercially sensitive information — lease terms, rent figures, break clause positions, compliance status, acquisition strategies. Putting that information into a cloud AI tool raises legitimate questions about where it is stored, who can access it, and whether it is being used to train models that other organisations might benefit from.",
    does: "All data is encrypted in transit and at rest. Hobson is hosted entirely within the UK — no data leaves UK jurisdiction. Hobson is aligned to ISO 27001 standards for information security management. Your documents, your Knowledge Base and your business information are never used to train any AI model — not Hobson's and not any third-party model. Every client's data is completely isolated — your information is never accessible by or visible to any other client.",
    matters: "The organisations that trust Hobson with their most sensitive property documents need to know those documents are protected to the highest standard. That is not negotiable.",
  },
];

const Features = () => {
  return (
    <>
      <Helmet>
        <title>Features | Hobson AI — What Hobson does, how it works, why it matters</title>
        <meta name="description" content="Every Phase 1 feature explained — multi-document reasoning, document hierarchy understanding, plain English querying, sourced answers, cross-portfolio questioning and more. All live today." />
        <link rel="canonical" href="https://hobsonschoice.ai/features" />
      </Helmet>

      <GlobalHeader />

      <main id="main-content" className="min-h-screen bg-background" role="main">
        {/* SECTION 1 — Page Header */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              What Hobson does. How it works. Why it matters.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Every feature below is live in Phase 1 today. No waitlist. No setup. No technical knowledge required. Just add your first document and start asking questions.
            </p>
          </div>
        </section>

        {/* SECTION 2 — Feature Blocks */}
        {features.map((feature, index) => (
          <section
            key={index}
            className={`py-12 sm:py-16 ${index % 2 === 1 ? "bg-muted/30" : "bg-background"}`}
          >
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
                {feature.name}
              </h2>

              <div className="space-y-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    THE PROBLEM IT SOLVES
                  </p>
                  <p className="text-base sm:text-lg text-foreground leading-relaxed">
                    {feature.problem}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    WHAT HOBSON DOES
                  </p>
                  <p className="text-base sm:text-lg text-foreground leading-relaxed">
                    {feature.does}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    WHY IT MATTERS
                  </p>
                  <p className="text-base sm:text-lg text-foreground leading-relaxed">
                    {feature.matters}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* SECTION 3 — Coming Soon Strip */}
        <section className="py-12 sm:py-16 bg-foreground text-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <Badge variant="outline" className="mb-6 border-background/30 text-background/80 text-xs tracking-widest">
              COMING LATER THIS YEAR
            </Badge>

            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Phase 1 is the foundation. Here is what it enables.
            </h2>
            <p className="text-lg text-background/70 mb-10 max-w-3xl">
              The features above are live today. Phase 2 and Phase 3 build directly on them.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Phase 2 */}
              <Card className="border-background/20 bg-background/10 p-6 space-y-4">
                <Badge className="w-fit bg-primary/20 text-primary-foreground border-0">Phase 2</Badge>
                <h3 className="text-xl font-bold text-background">The Knowledge Base</h3>
                <p className="text-background/70 leading-relaxed">
                  Hobson learns how your business operates. Your contractors, contacts, policies, approval thresholds and communication preferences — stored permanently and applied to every answer. Every feature above becomes more powerful when Hobson knows your business, not just your documents.
                </p>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-1 text-primary-foreground font-medium hover:underline"
                >
                  Join the waitlist <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>

              {/* Phase 3 */}
              <Card className="border-background/20 bg-background/10 p-6 space-y-4">
                <Badge className="w-fit bg-primary/20 text-primary-foreground border-0">Phase 3</Badge>
                <h3 className="text-xl font-bold text-background">The Application Layer</h3>
                <p className="text-background/70 leading-relaxed">
                  Built on the accuracy of Phase 1 and the business context of Phase 2, Hobson executes workflows autonomously. Rent reviews triggered. Compliance deadlines actioned. Lease events managed end-to-end. The work gets done.
                </p>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-1 text-primary-foreground font-medium hover:underline"
                >
                  Join the waitlist <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Closing CTA */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Every feature above is live. Try them on your documents today.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              No card required. No technical setup. No integration work. Add your first document and ask your first question in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base px-8 py-4 h-auto">
                <Link to="/pricing">
                  Start free — no card required
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 py-4 h-auto">
                <Link to="/in-practice">
                  See it in practice
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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

export default Features;
