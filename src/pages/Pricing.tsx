import React from "react";
import { Helmet } from "react-helmet-async";
import { GlobalHeader } from "@/components/GlobalHeader";

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>Pricing | Hobson AI</title>
        <meta name="description" content="Hobson AI pricing." />
        <link rel="canonical" href="https://hobsonschoice.ai/pricing" />
      </Helmet>

      <GlobalHeader />

      <main id="main-content" className="min-h-screen">
        {/* New pricing content goes here */}
      </main>
    </>
  );
}
