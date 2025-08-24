import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { GlobalHeader } from "@/components/GlobalHeader";

const DataProtection = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Data Protection & Security Policy | Hobson AI - Property Management Software</title>
        <meta name="description" content="Learn about Hobson AI's data protection and security measures including GDPR compliance, encryption, and secure hosting." />
        <meta name="keywords" content="data protection, security policy, GDPR compliance, data encryption, secure hosting, AI property management" />
        <meta property="og:title" content="Data Protection & Security Policy | Hobson AI" />
        <meta property="og:description" content="Learn about Hobson AI's data protection and security measures including GDPR compliance, encryption, and secure hosting." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://hobsonschoice.ai/data-protection" />
      </Helmet>
      
      <GlobalHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Hobson AI – Privacy, Security & Data Protection Policy</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Last Updated: 23/08/2025</strong>
          </p>
          
          <p className="mb-8 text-muted-foreground leading-relaxed">
            At Hobson AI, we take the security, privacy, and integrity of client data seriously.
            This document explains how we handle, store, and process information when you use our services.
          </p>

          {/* On This Page - Table of Contents */}
          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">On This Page</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <a href="#who-we-are" className="text-primary hover:underline">1. Who We Are</a>
              <a href="#privacy-policy" className="text-primary hover:underline">2. Privacy Policy</a>
              <a href="#data-protection-security" className="text-primary hover:underline">3. Data Protection & Security Policy</a>
              <a href="#data-processing-agreement" className="text-primary hover:underline">4. Data Processing Agreement (DPA)</a>
              <a href="#cross-document-intelligence" className="text-primary hover:underline">5. Cross-Document Intelligence</a>
              <a href="#guardrails" className="text-primary hover:underline">6. Guardrails in Practice</a>
              <a href="#governing-law" className="text-primary hover:underline">7. Governing Law & Jurisdiction</a>
              <a href="#client-responsibilities" className="text-primary hover:underline">8. Client Responsibilities</a>
              <a href="#liability" className="text-primary hover:underline">9. Liability & Limitation of Liability</a>
              <a href="#international-transfers" className="text-primary hover:underline">10. International Data Transfers</a>
              <a href="#cookies" className="text-primary hover:underline">11. Cookies & Website Tracking</a>
              <a href="#industry-standards" className="text-primary hover:underline">12. Industry Standards</a>
            </div>
          </div>
          
          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section id="who-we-are">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Who We Are</h2>
              <p>
                Hobson AI operates through{" "}
                <a href="https://hobsonschoice.ai" className="text-primary hover:underline">hobsonschoice.ai</a>{" "}
                and provides AI-powered document intelligence and knowledge services.
              </p>
              <div className="mt-4">
                <p><strong>Business address:</strong></p>
                <p>5 Technology Park, Collindeep Lane, Collindale, London NW9 6BX</p>
                <p>Email: <a href="mailto:info@hobsonschoice.ai" className="text-primary hover:underline">info@hobsonschoice.ai</a></p>
              </div>
            </section>

            <section id="privacy-policy">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Privacy Policy</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">2.1 Data We Process</h3>
              <p>We process the following types of data provided by our clients:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>Business documents (e.g., leases, lending documents, planning applications, certificates).</li>
                <li>Metadata extracted from those documents (e.g., dates, amounts, obligations, guarantors).</li>
                <li>Limited client contact details for account management.</li>
              </ul>
              <p className="mt-4"><strong>We do not use client data for model training.</strong></p>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">2.2 AI Models</h3>
              <p>
                We use enterprise versions of OpenAI. Data processed via these models is not stored or used for training.
                More on OpenAI's privacy here:{" "}
                <a 
                  href="https://openai.com/enterprise-privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  OpenAI Privacy for Enterprise
                </a>.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">2.3 Data Retention</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>Documents and extracted data are stored only for the duration of the client contract.</li>
                <li>Data is securely deleted upon request or contract termination.</li>
              </ul>
            </section>

            <section id="data-protection-security">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Data Protection & Security Policy</h2>
              <p>Data is hosted securely on OVH Cloud (UK/EU) with redundancy and encryption.</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li><strong>Encryption:</strong> All data is encrypted both in transit (TLS) and at rest (AES-256).</li>
                <li><strong>Access Control:</strong> Only authorised staff have access to production data. Access is logged and monitored.</li>
                <li><strong>Monitoring:</strong> Systems are monitored for suspicious activity and vulnerabilities.</li>
                <li><strong>Backups:</strong> Regular encrypted backups are maintained for resilience.</li>
              </ul>
            </section>

            <section id="data-processing-agreement">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Data Processing Agreement (DPA)</h2>
              <p>Hobson AI acts as a Data Processor on behalf of its clients. Clients remain the Data Controller.</p>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">4.1 Processing Activities</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>Document ingestion</li>
                <li>Data extraction (via structured JSON pipelines)</li>
                <li>Storage and query resolution</li>
                <li>Optional retrieval-augmented generation (RAG) for contextual reasoning</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">4.2 Storage & Databases</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>MongoDB for structured JSON extraction results</li>
                <li>Vector databases for semantic retrieval</li>
                <li>Knowledge graphs for relationship mapping</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">4.3 Sub-Processors</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>OpenAI Enterprise (no training, no retention)</li>
                <li>OVH Cloud (primary hosting provider, UK/EU)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">4.4 Client Rights</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>Right of access, rectification, and erasure</li>
                <li>Right to restrict or object to processing</li>
                <li>Right to data portability</li>
              </ul>
            </section>

            <section id="cross-document-intelligence">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Cross-Document Intelligence</h2>
              <p>
                Hobson AI is designed to read across multiple document types (leases, lending files, development plans, compliance certificates) and extract consistent insights.
                Our safeguards ensure structured evidence is always cited with Document Type, Internal Source, and Internal Evidence for transparency.
              </p>
            </section>

            <section id="guardrails">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Guardrails in Practice</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>No fabrication of data</li>
                <li>Clear distinction between obligations (what documents say) and facts (what has occurred)</li>
                <li>Consistent schema across all outputs (tables, locators, and sources always present)</li>
              </ul>
            </section>

            <section id="governing-law">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Governing Law & Jurisdiction</h2>
              <p>
                This Policy and all related agreements are governed by the laws of England and Wales.
                Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section id="client-responsibilities">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Client Responsibilities</h2>
              <p>Clients are responsible for ensuring:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>Data they upload has been lawfully collected.</li>
                <li>Notices/consents have been obtained where required.</li>
                <li>Sensitive categories of data (health, children, financial accounts) are not uploaded unless contractually agreed.</li>
              </ul>
            </section>

            <section id="liability">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Liability & Limitation of Liability</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Hobson AI's liability is limited to fees paid in the 12 months prior to an incident.</li>
                <li>We are not liable for indirect or consequential damages (e.g., lost profits, goodwill).</li>
                <li>These limitations do not apply in cases of gross negligence, wilful misconduct, or where prohibited by law.</li>
              </ul>
            </section>

            <section id="international-transfers">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">10. International Data Transfers</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Data is primarily stored in the UK/EU (OVH Cloud).</li>
                <li>If data is transferred outside the UK/EU, Hobson AI uses approved mechanisms such as the UK IDTA and EU SCCs.</li>
              </ul>
            </section>

            <section id="cookies">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Cookies & Website Tracking</h2>
              <p>
                Our website (<a href="https://hobsonschoice.ai" className="text-primary hover:underline">hobsonschoice.ai</a>) may use cookies for:
              </p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>Essential site functionality</li>
                <li>Security monitoring</li>
                <li>Performance analytics</li>
              </ul>
              <p className="mt-4">Users may control cookies via browser settings. A separate Cookie Policy can be provided if required.</p>
            </section>

            <section id="industry-standards">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">12. Industry Standards</h2>
              <p>While not formally certified, our practices align with ISO 27001 and SOC 2 principles:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>Encryption</li>
                <li>Role-based access control</li>
                <li>Continuous monitoring</li>
                <li>Incident response and audit trails</li>
              </ul>
            </section>

            <div className="bg-muted/30 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Summary</h3>
              <p>
                Hobson AI provides enterprise-grade privacy, security, and transparency for all client data.
                By combining strong encryption, careful data handling, and OpenAI Enterprise safeguards, we give clients confidence that their information is accurately processed and securely protected.
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border">
            <Link 
              to="/" 
              className="inline-flex items-center text-primary hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataProtection;