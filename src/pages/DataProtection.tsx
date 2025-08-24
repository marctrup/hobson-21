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
          <h1 className="text-4xl font-bold mb-8 text-foreground">Hobson AI – Data Protection & Security Policy</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Effective Date: 23/08/2025</strong>
          </p>
          
          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <p>
              Hobson AI ("we", "our", "us") is committed to protecting client data and maintaining the highest standards of security. 
              This policy explains the measures we take to safeguard your data when you use our services at{" "}
              <a href="https://hobsonschoice.ai" className="text-primary hover:underline">hobsonschoice.ai</a>.
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Data Hosting & Storage</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>All client data is hosted securely on OVHcloud infrastructure in the UK and EU, ensuring compliance with GDPR and UK GDPR.</li>
                <li>Data is encrypted at rest (AES-256) and in transit (TLS 1.2+).</li>
                <li>OVHcloud provides ISO 27001-certified data centres, with strong physical and digital security controls.</li>
                <li>Backups are encrypted and maintained in secure environments with disaster recovery protocols.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Access Control & Authentication</h2>
              <div className="space-y-4">
                <p>Access to client data is restricted to authorised Hobson AI personnel on a need-to-know basis.</p>
                <p>All employee access requires:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Multi-factor authentication (MFA)</li>
                  <li>Role-based access control (RBAC)</li>
                  <li>Audit logging of all access attempts</li>
                </ul>
                <p>Access rights are regularly reviewed and revoked if no longer required.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Use of AI Models</h2>
              <div className="space-y-4">
                <ul className="list-disc ml-6 space-y-2">
                  <li>Hobson AI uses enterprise versions of OpenAI models.</li>
                  <li>No client data is retained by OpenAI; processing is transient.</li>
                </ul>
                <p>
                  For more details, see OpenAI's enterprise privacy commitments: {" "}
                  <a 
                    href="https://openai.com/enterprise-privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    OpenAI Privacy & Security
                  </a>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Data Protection Principles</h2>
              <p>We comply with the principles of GDPR and UK GDPR:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li><strong>Lawfulness, fairness, and transparency</strong> – We are clear about how data is processed.</li>
                <li><strong>Purpose limitation</strong> – Data is only used for agreed purposes.</li>
                <li><strong>Data minimisation</strong> – We only process what is necessary.</li>
                <li><strong>Accuracy</strong> – We take steps to keep data up to date.</li>
                <li><strong>Storage limitation</strong> – Data is retained only as long as required.</li>
                <li><strong>Integrity and confidentiality</strong> – Strong security practices are enforced.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Incident Response & Breach Notification</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>We maintain an Incident Response Plan to detect, respond to, and mitigate security incidents.</li>
                <li>In the event of a data breach, clients and regulators will be notified within 72 hours, in line with GDPR requirements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Third-Party Processors</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Only vetted third-party providers (e.g., OVHcloud for hosting, OpenAI for AI model processing) are used.</li>
                <li>All third parties are bound by data protection agreements ensuring GDPR and UK GDPR compliance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Client Responsibilities</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Clients remain responsible for ensuring their users maintain secure credentials.</li>
                <li>Clients must notify Hobson AI immediately of any suspected compromise of access credentials.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Contact Information</h2>
              <p>If you have any questions about this policy, please contact us:</p>
              <div className="mt-4 space-y-2">
                <p><strong>Hobson AI</strong></p>
                <p>5 Technology Park, Collindeep Lane<br />
                Colindale, London, NW9 6BX</p>
                <p>Email: <a href="mailto:info@hobsonschoice.ai" className="text-primary hover:underline">info@hobsonschoice.ai</a></p>
              </div>
            </section>
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