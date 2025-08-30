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

      <div className="min-h-screen flex items-center justify-center">
        <button 
          ref={testRef} 
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Testing useRef - Pricing Page OK
        </button>
      </div>
    </>
  );
};

export default Pricing;