import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { GlobalHeader } from "@/components/GlobalHeader";
import {
  Layers,
  GitBranch,
  MessageSquareText,
  BookCheck,
  Search,
  FileStack,
  Target,
  Plug,
  ShieldCheck,
  Brain,
  Building2,
} from "lucide-react";
import FeaturesHero from "@/components/features/FeaturesHero";
import FeaturesAnchorNav from "@/components/features/FeaturesAnchorNav";
import FeatureGroupSection from "@/components/features/FeatureGroupSection";
import FeaturesComingSoon from "@/components/features/FeaturesComingSoon";
import FeaturesCTA from "@/components/features/FeaturesCTA";

const documentIntelligenceFeatures = [
  {
    name: "Multi-Document Reasoning",
    icon: Layers,
    problem: "Most property questions cannot be answered from a single document. A rent review question requires the lease. A service charge question requires the lease, the budget and the actual cost schedule. A compliance question requires the certificate, the lease obligation and the regulatory requirement. Reading each document separately and connecting the dots manually is exactly the kind of work that consumes property teams.",
    does: "Hobson reads multiple documents simultaneously and reasons across them as a connected set. Ask a question that spans three documents and Hobson draws the answer from all three — identifying where the relevant information sits, how the documents relate to each other, and what the combined position means. It does not summarise each document separately. It answers the question.",
    matters: "Property decisions are never made from a single document. Hobson is built for the way property work actually happens — across a stack of connected documents — not for the way software usually handles it.",
  },
  {
    name: "Document Hierarchy Understanding",
    icon: GitBranch,
    problem: "A commercial lease from 2011 is not the whole story. A deed of variation from 2015 changed the permitted use. A rent memorandum from 2019 confirmed the reviewed rent. A side letter from 2022 qualified the repair obligations. Reading only the original lease gives the wrong answer. Understanding what the current legal position actually is requires reading every document in the stack and knowing which ones supersede which.",
    does: "Hobson understands document hierarchy. When multiple documents relate to the same property or obligation, Hobson identifies which are original and which are subsequent, reads them in the correct legal sequence, and returns the current position — not the historical one. If a deed of variation changes a repair obligation, Hobson applies the variation. If a rent memorandum confirms a reviewed rent, Hobson uses that figure. The answer always reflects the current legal reality.",
    matters: "This is one of the hardest things to get right in property AI and one of the most consequential to get wrong. A generic AI tool reads documents. Hobson understands the relationship between them.",
  },
  {
    name: "Plain English Querying",
    icon: MessageSquareText,
    problem: "Property documents are written in legal language. The people who need to act on them — operations directors, retail managers, hospitality COOs, asset managers — are not lawyers. Translating legal text into operational decisions has always required either legal training or expensive professional advice.",
    does: 'Hobson accepts questions in plain English and returns answers in plain English. There is no query language to learn, no search syntax to master and no training required. Ask the way you would ask a colleague — "What is the break clause on Unit 4 and what do I need to do to exercise it?" — and Hobson answers directly from the document. If the answer requires interpreting a complex legal clause, Hobson does the interpretation and explains what it means practically.',
    matters: "The value of property documents should not be locked behind legal expertise. Hobson makes every clause in every document accessible to everyone in the business who needs to act on it.",
  },
  {
    name: "Sourced and Auditable Answers",
    icon: BookCheck,
    problem: "For regulated property decisions — rent reviews, dilapidations, compliance obligations, lease renewals — getting the right answer is not enough. You need to be able to show where the answer came from, which clause supports it, and why the conclusion is correct. An answer you cannot audit is an answer you cannot rely on.",
    does: "Every answer Hobson provides is referenced to the exact document and clause it came from. Hobson never generates an answer from general knowledge or makes an inference without telling you it has done so. If the information is in your documents, Hobson cites it precisely. If it is not, Hobson tells you clearly rather than guessing. Every answer is a chain from question to source — traceable, verifiable and defensible.",
    matters: "In property, wrong answers have financial and legal consequences. Sourced answers are not a nice-to-have — they are the minimum standard for decisions that matter.",
    extraContent: (
      <Link to="/learn/smart-navigation" className="text-sm text-primary hover:underline transition-colors">
        Hobson always knows which part of your portfolio it is reading from. Learn how Smart Navigation works →
      </Link>
    ),
  },
];

const portfolioToolsFeatures = [
  {
    name: "Cross-Portfolio Questioning",
    icon: Search,
    problem: 'A portfolio question — "which of my leases have a break clause in the next 12 months?" — sounds simple. But answering it manually means opening every lease, finding the relevant clause in each one, extracting the information and compiling the results. For a portfolio of 20 units that is a full day\'s work. For a portfolio of 200 units it is a week.',
    does: "Hobson answers questions across your entire portfolio simultaneously. Every lease in your account is available as a single queryable dataset. Ask one question and Hobson returns the answer from every relevant document at once — listing which units have break clauses, what the dates are, what the notice periods are and what the pre-conditions are. The same applies to rent review dates, EPC obligations, repair responsibilities or any other term that varies across your portfolio.",
    matters: "Portfolio-level insight is where Hobson delivers its most immediate time saving. Questions that previously took days take minutes.",
  },
  {
    name: "Document Type Breadth",
    icon: FileStack,
    problem: "Property portfolios contain many different types of document — not just leases. Compliance certificates, EPCs, surveys, licences, deeds, title documents, planning permissions, fire safety assessments — all of these contain information that property teams need to access and act on. Most document tools handle leases reasonably. Very few handle the full range of property documents with the same accuracy.",
    does: "Hobson is trained to read and reason across the full range of property documents — original leases and residential tenancy agreements, deeds of variation and supplemental deeds, licences to alter, rent memorandums, authorised guarantee agreements, EPC certificates, gas safety certificates, EICR reports, fire safety assessments, surveys and planning documents. New document types are added regularly as the platform develops.",
    matters: "Property obligations do not live only in leases. Hobson reads the full document set that defines what your business is actually required to do.",
  },
];

const trustSecurityFeatures = [
  {
    name: "98% Accuracy on Real Estate Datasets",
    icon: Target,
    problem: "Generic AI tools produce plausible answers. For most tasks that is acceptable. For property decisions — where a wrong answer about a break clause notice period can invalidate a legal right, and a wrong answer about an EPC obligation can result in regulatory action — plausible is not good enough. The accuracy threshold for regulated decisions is materially higher than for general information retrieval.",
    does: "Hobson is fine-tuned on proprietary real estate datasets — not adapted from a general-purpose language model. It is trained specifically for the language, structure and conventions of commercial and residential property documents in the UK. The result is 98% accuracy on industry-specific document reasoning tasks — a figure validated on real property documents, not synthetic benchmarks.",
    matters: "The difference between a general AI tool and a domain-specific one is not a matter of degree. For regulated property decisions, it is the difference between an answer you can act on and one you cannot.",
  },
  {
    name: "No Integration Required",
    icon: Plug,
    problem: "Most software implementations require integration work — connecting to existing systems, migrating data, retraining teams, updating workflows. For property teams already managing significant operational complexity, a new system that requires a six-month implementation project is not a practical option regardless of how good the product is.",
    does: "Hobson requires no integration with your existing systems to deliver value. Add your documents directly to Hobson and start asking questions. It works alongside whatever property management system, CRM or document storage you currently use — reading documents you add to it, answering questions about them, and fitting around your existing workflows rather than replacing them. There is no rip-and-replace. There is no migration. There is no implementation project. You are up and running in minutes.",
    matters: "The fastest route to value is no friction at all. Hobson is useful from the moment your first document is added.",
  },
  {
    name: "UK-Hosted, Encrypted and ISO 27001 Aligned",
    icon: ShieldCheck,
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
        <FeaturesHero />
        <FeaturesAnchorNav />

        <FeatureGroupSection
          id="document-intelligence"
          title="Document Intelligence"
          subtitle="How Hobson reads, connects and reasons across your property documents — not one at a time, but as a complete picture."
          icon={Brain}
          features={documentIntelligenceFeatures}
          bgClass="bg-background"
        />

        <FeatureGroupSection
          id="portfolio-tools"
          title="Portfolio Tools"
          subtitle="Ask one question. Get the answer across every document in your portfolio."
          icon={Building2}
          features={portfolioToolsFeatures}
          startReversed
          bgClass="bg-muted/30"
        />

        <FeatureGroupSection
          id="trust-and-security"
          title="Trust & Security"
          subtitle="Domain-specific accuracy, zero integration friction and enterprise-grade data protection."
          icon={ShieldCheck}
          features={trustSecurityFeatures}
          bgClass="bg-background"
        />

        <FeaturesComingSoon />
        <FeaturesCTA />
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

export default Features;
