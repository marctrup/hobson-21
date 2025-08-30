import { useRef } from "react";
import { Helmet } from "react-helmet-async";

const Pricing = () => {
  const testRef = useRef(null);
  return (
    <>
      <Helmet>
        <title>Pricing - Pay for Work, Not Seats | Hobson's Choice AI</title>
        <meta name="description" content="Revolutionary pricing that charges for actual AI work, not users or properties. Start from £18.50/month with Hobson Energy Units (HEUs)." />
        <meta name="keywords" content="AI pricing, property management pricing, per-task billing, CRM alternative" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-8">Simple, Fair Pricing</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Pay for actual AI work, not seats or properties. Revolutionary pricing that scales with your usage.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-2xl font-bold mb-4">Starter</h3>
                <div className="text-3xl font-bold mb-2">£18.50</div>
                <div className="text-muted-foreground mb-6">per month</div>
                <ul className="space-y-2 text-left">
                  <li>✓ 100 HEU credits</li>
                  <li>✓ Basic document processing</li>
                  <li>✓ Email support</li>
                </ul>
              </div>
              
              <div className="bg-card rounded-lg border p-6 ring-2 ring-primary">
                <h3 className="text-2xl font-bold mb-4">Professional</h3>
                <div className="text-3xl font-bold mb-2">£75</div>
                <div className="text-muted-foreground mb-6">per month</div>
                <ul className="space-y-2 text-left">
                  <li>✓ 500 HEU credits</li>
                  <li>✓ Advanced AI features</li>
                  <li>✓ Priority support</li>
                  <li>✓ Custom integrations</li>
                </ul>
              </div>
              
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                <div className="text-3xl font-bold mb-2">Custom</div>
                <div className="text-muted-foreground mb-6">pricing</div>
                <ul className="space-y-2 text-left">
                  <li>✓ Unlimited HEU credits</li>
                  <li>✓ Dedicated support</li>
                  <li>✓ On-premise deployment</li>
                  <li>✓ SLA guarantees</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12">
              <button 
                ref={testRef} 
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;