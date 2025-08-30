import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { GlobalHeader } from "@/components/GlobalHeader";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | Hobson AI - Real Estate AI</title>
        <meta name="description" content="Privacy Policy for Hobson AI - Learn how we protect and handle your personal information and business data." />
        <meta name="keywords" content="privacy policy, data protection, security, AI property management, GDPR compliance" />
        <meta property="og:title" content="Privacy Policy | Hobson AI" />
        <meta property="og:description" content="Privacy Policy for Hobson AI - Learn how we protect and handle your personal information and business data." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://hobsonschoice.ai/privacy-policy" />
      </Helmet>
      
      <GlobalHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Effective Date: 23/08/2025</strong>
          </p>
          
          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <p>
              Hobson AI ("we", "our", "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we handle your personal information when you use our services.
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Who We Are</h2>
              <div className="space-y-2">
                <p><strong>Hobson AI</strong></p>
                <p>5 Technology Park<br />
                Collindeep Lane<br />
                Colindale<br />
                London NW9 6BX</p>
                <p>Email: <a href="mailto:info@hobsonschoice.ai" className="text-primary hover:underline">info@hobsonschoice.ai</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Information We Collect</h2>
              <p>We collect and process the following types of information:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li><strong>Business information</strong> you provide to us, such as company details, property data, or documentation shared for analysis.</li>
                <li><strong>Contact information</strong> (such as name, email address, and phone number) for communication and support.</li>
                <li><strong>Usage information</strong> about how you use our platform, to help us improve performance and reliability.</li>
              </ul>
              <p className="mt-4">
                <strong>We do not sell or share your data with third parties for marketing purposes.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>Provide our document analysis and AI-powered insights.</li>
                <li>Communicate with you about your account, updates, or support requests.</li>
                <li>Improve and maintain the quality of our services.</li>
                <li>Meet legal and regulatory obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. AI & Data Security</h2>
              <div className="space-y-4">
                <p>
                  We use enterprise versions of OpenAI technology, which means your data is processed securely 
                  and in compliance with strict enterprise standards.
                </p>
                <p>
                  <strong>No customer data is stored by OpenAI</strong> when using enterprise services. 
                  For more details, you can view OpenAI's Enterprise Privacy & Security page: {" "}
                  <a 
                    href="https://openai.com/enterprise-privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://openai.com/enterprise-privacy
                  </a>.
                </p>
                <p>
                  All documents and data you upload are stored securely in our systems and used only 
                  for the purpose of providing you with services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. How We Store Your Information</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Your data is stored in secure databases hosted within the UK/EU (or regions agreed contractually with clients).</li>
                <li>Access is restricted to authorised personnel only.</li>
                <li>We apply encryption and industry-standard security controls to protect your data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>Request a copy of the personal data we hold about you.</li>
                <li>Ask us to correct or update your personal data.</li>
                <li>Request that we delete your personal data, subject to any legal obligations to retain it.</li>
                <li>Object to our use of your personal data for certain purposes.</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact us at {" "}
                <a href="mailto:info@hobsonschoice.ai" className="text-primary hover:underline">
                  info@hobsonschoice.ai
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Data Retention</h2>
              <p>
                We retain your data only as long as necessary to provide our services and comply with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Updates to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we make changes, we will update 
                the "Effective Date" at the top of this page.
              </p>
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

export default PrivacyPolicy;