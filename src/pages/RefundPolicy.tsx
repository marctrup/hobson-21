import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { GlobalHeader } from "@/components/GlobalHeader";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Refund Policy | Hobson AI - Property Management Software</title>
        <meta name="description" content="Learn about Hobson AI's refund policy including eligibility, process, and our commitment to customer satisfaction." />
        <meta name="keywords" content="refund policy, customer satisfaction, billing, service credits, Hobson AI" />
        <meta property="og:title" content="Refund Policy | Hobson AI" />
        <meta property="og:description" content="Learn about Hobson AI's refund policy including eligibility, process, and our commitment to customer satisfaction." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://hobsonschoice.ai/refund-policy" />
      </Helmet>
      
      <GlobalHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Hobson AI Refund Policy</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Last Updated: 12th November 2025</strong>
          </p>
          
          <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg mb-8">
            <p className="text-foreground font-medium">
              <a 
                href="/Hobson_AI_Refund_Policy.pdf" 
                download 
                className="text-primary hover:underline inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Refund Policy (PDF)
              </a>
            </p>
          </div>

          {/* On This Page - Table of Contents */}
          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">On This Page</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <a href="#scope" className="text-primary hover:underline">1. Scope of This Policy</a>
              <a href="#promise" className="text-primary hover:underline">2. Our Promise</a>
              <a href="#eligibility" className="text-primary hover:underline">3. Eligibility for Refunds</a>
              <a href="#request" className="text-primary hover:underline">4. How to Request a Refund</a>
              <a href="#method" className="text-primary hover:underline">5. Refund Method</a>
              <a href="#credits" className="text-primary hover:underline">6. Service Credits as an Alternative</a>
              <a href="#contact" className="text-primary hover:underline">7. Contact & Support</a>
              <a href="#updates" className="text-primary hover:underline">8. Policy Updates</a>
            </div>
          </div>
          
          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section id="scope">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Scope of This Policy</h2>
              <p>
                This policy applies to all paid Hobson AI services, including subscriptions, document credits, 
                and usage-based billing, purchased directly from Hobson AI Limited or through our website. 
                If you purchased through a third-party platform (e.g., Apple App Store or Google Play), 
                that platform's refund process will apply.
              </p>
            </section>

            <section id="promise">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Our Promise</h2>
              <p>
                We believe in treating our customers fairly. If something doesn't work as expected or you 
                experience issues we cannot resolve quickly, we will make it right — through technical 
                support, service credit, or a refund where appropriate.
              </p>
            </section>

            <section id="eligibility">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Eligibility for Refunds</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">You may be eligible for a refund in the following cases:</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Technical or Service Issues:</strong> A confirmed fault or persistent error that 
                  prevents normal use of Hobson AI despite reasonable troubleshooting.
                </li>
                <li>
                  <strong>Duplicate Payments or Billing Errors:</strong> Accidental double billing or 
                  incorrect charges caused by our system.
                </li>
                <li>
                  <strong>Early Cancellation:</strong> If you cancel a paid plan shortly after renewal and 
                  have not used the service materially during the new billing period.
                </li>
                <li>
                  <strong>Unsatisfactory Experience:</strong> If the product or service does not meet 
                  reasonable expectations and our support team cannot resolve the issue promptly.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">Refunds are not normally granted for:</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>Change of mind after use.</li>
                <li>Minor dissatisfaction without an identifiable service issue.</li>
                <li>Misuse or violation of terms of service.</li>
              </ul>
            </section>

            <section id="request">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. How to Request a Refund</h2>
              <p>To request a refund, please contact us at:</p>
              <p className="mt-4">
                <a href="mailto:support@hobsonschoice.ai" className="text-primary hover:underline font-medium">
                  support@hobsonschoice.ai
                </a>
              </p>
              <p className="mt-4">
                Include your full name, account email, date and amount of payment, and a short explanation 
                of the issue. We aim to respond within 2 business days and resolve most refund requests 
                within 5–10 business days.
              </p>
            </section>

            <section id="method">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Refund Method</h2>
              <p>
                Refunds will be processed using the original payment method. Depending on your bank or payment 
                provider, it may take 3–10 business days for the refund to appear in your account.
              </p>
            </section>

            <section id="credits">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Service Credits as an Alternative</h2>
              <p>
                In some cases, we may offer service credits instead of a cash refund — for example, when the 
                issue is minor or the user prefers to continue using Hobson AI. These credits never expire and 
                can be used toward future subscriptions or document processing.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Contact & Support</h2>
              <p>
                If you are unsure whether your situation qualifies for a refund, please contact our support 
                team — we will always review your case with understanding and goodwill.
              </p>
              <div className="mt-4 bg-muted/30 p-4 rounded-lg">
                <p><strong>Email:</strong> <a href="mailto:support@hobsonschoice.ai" className="text-primary hover:underline">support@hobsonschoice.ai</a></p>
                <p className="mt-2"><strong>Address:</strong><br />Hobson AI Limited<br />5 Technology Park<br />Collindeep Lane<br />NW9 6BX</p>
              </div>
            </section>

            <section id="updates">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Policy Updates</h2>
              <p>
                We may update this Refund Policy periodically to reflect improvements or legal requirements. 
                Any significant changes will be posted on our website, and where appropriate, communicated 
                directly to users.
              </p>
            </section>

            <div className="bg-muted/30 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Our Goal</h3>
              <p>
                To handle every request quickly, fairly, and transparently — just as we would want to be 
                treated ourselves.
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

export default RefundPolicy;
