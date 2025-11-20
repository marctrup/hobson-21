import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { GlobalHeader } from "@/components/GlobalHeader";

const BreachProtocol = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Data Breach Protocol | Hobson AI - Property Management Software</title>
        <meta name="description" content="Learn about Hobson AI's data breach response protocol including incident response, customer notification, and security measures." />
        <meta name="keywords" content="data breach protocol, incident response, security breach, data protection, customer notification, security measures" />
        <meta property="og:title" content="Data Breach Protocol | Hobson AI" />
        <meta property="og:description" content="Learn about Hobson AI's data breach response protocol including incident response, customer notification, and security measures." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://hobsonschoice.ai/breach-protocol" />
      </Helmet>
      
      <GlobalHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Hobson – Data Breach Protocol</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            This Data Breach Protocol explains how Hobson will respond if a security incident affects customer documents, personal information or stored data. Our goal is to act quickly, transparently and responsibly to protect our users.
          </p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section id="what-we-consider">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. What We Consider a Data Breach</h2>
              <p>A data breach includes:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>unauthorised access to customer documents,</li>
                <li>accidental exposure of stored files,</li>
                <li>system intrusion or hacking,</li>
                <li>accidental sharing of information with someone who should not have access,</li>
                <li>loss or corruption of stored data,</li>
                <li>any event that puts customer privacy at risk.</li>
              </ul>
              <p className="mt-4">
                If we believe data may have been accessed, exposed or tampered with — even if the risk is small — we treat it as a breach.
              </p>
            </section>

            <section id="immediate-response">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Immediate Response Steps</h2>
              <p>As soon as we detect or suspect a breach, Hobson will:</p>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">a. Contain the Incident</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>restrict system access,</li>
                <li>shut down affected services temporarily,</li>
                <li>isolate compromised components to stop further exposure.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">b. Assess the Scope</h3>
              <p>We identify:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>what data was involved,</li>
                <li>which customer accounts were affected,</li>
                <li>how long the breach lasted,</li>
                <li>whether documents were viewed or downloaded.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">c. Secure the System</h3>
              <p>
                We apply patches, reset access keys, harden security settings and prevent the issue from continuing.
              </p>
            </section>

            <section id="notification">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Notification to Customers</h2>
              <p>We will contact affected customers as soon as possible after confirming the breach.</p>
              <p className="mt-4">Our message will:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>openly explain what happened,</li>
                <li>state which data was affected,</li>
                <li>outline the possible risks,</li>
                <li>clearly apologise,</li>
                <li>explain what we are doing to fix it,</li>
                <li>provide guidance on next steps.</li>
              </ul>
              <p className="mt-4">Our apology will be direct and simple:</p>
              <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                "We are truly sorry. Your data safety is our responsibility, and we did not meet the standard you deserve."
              </blockquote>
              <p>We will never minimise or hide the issue.</p>
            </section>

            <section id="compensation">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Compensation and Customer Support</h2>
              <p>Depending on the severity of the breach, Hobson may offer:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>account credits or service extensions,</li>
                <li>personal support to walk customers through the impact,</li>
                <li>re-processing of documents at no cost,</li>
                <li>identity protection tools (if personal data is involved),</li>
                <li>help assessing what actions they may need to take.</li>
              </ul>
              <p className="mt-4">Our goal is to protect customers and rebuild trust.</p>
            </section>

            <section id="legal-obligations">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Legal Obligations and Reporting</h2>
              <p>If required by relevant privacy laws, Hobson will:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>report the breach to the appropriate authority,</li>
                <li>cooperate fully with any regulatory investigation,</li>
                <li>document the incident, how it occurred and how it was resolved.</li>
              </ul>
            </section>

            <section id="post-incident">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Post-Incident Review</h2>
              <p>After containing the breach and notifying customers, we conduct an internal review to:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>understand the root cause,</li>
                <li>evaluate our response time,</li>
                <li>strengthen weak points,</li>
                <li>update policies and access controls,</li>
                <li>train the team on new procedures.</li>
              </ul>
              <p className="mt-4">We use each incident to improve our systems permanently.</p>
            </section>

            <section id="preventive-measures">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Preventive Measures Already in Place</h2>
              <p>To reduce the risk of a breach, Hobson uses:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>data minimisation (we only store what we need),</li>
                <li>encrypted storage and encrypted transfer of documents,</li>
                <li>strict access controls for staff,</li>
                <li>logging and monitoring of access,</li>
                <li>limited data sharing (only minimal text is sent to OpenAI),</li>
                <li>regular internal audits of document handling,</li>
                <li>secure deletion options for customers.</li>
              </ul>
              <p className="mt-4">These measures protect customer documents before a breach can occur.</p>
            </section>

            <section id="guarantee">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Our Guarantee</h2>
              <p>Hobson guarantees that:</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>we will always be transparent about security issues,</li>
                <li>we will always take responsibility rather than shifting blame,</li>
                <li>we will always notify customers promptly,</li>
                <li>we will always prioritise protecting your documents and privacy.</li>
              </ul>
              <p className="mt-4">
                Trust is central to Hobson, and we treat every document with the highest level of care.
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

export default BreachProtocol;
