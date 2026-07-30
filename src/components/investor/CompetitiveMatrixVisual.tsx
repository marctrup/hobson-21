import React from 'react';

export const CompetitiveMatrixVisual = () => {
  return (
    <div className="w-full bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-bone">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
          Competitive Landscape
        </h2>
        <p className="text-lg text-charcoal max-w-4xl mx-auto">
          A landscape of traditional software, standalone AI, and generic tools—Hobson stands out as an integrated real estate AI solution.
        </p>
      </div>

      {/* Matrix Container */}
      <div className="relative max-w-5xl mx-auto">
        {/* Y-Axis Label */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90">
          <div className="flex items-center gap-8">
            <span className="text-sm font-medium text-ink-muted">Generic AI Tools</span>
            <span className="text-sm font-medium text-ink-muted">Real Estate Specific AI Tools</span>
          </div>
        </div>

        {/* X-Axis Label */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full">
          <div className="flex items-center justify-between px-8">
            <span className="text-sm font-medium text-ink-muted">Standalone Solution</span>
            <span className="text-sm font-medium text-ink-muted">Fully Integrated Solution</span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-0 border-2 border-bone rounded-lg overflow-hidden">
          
          {/* Top-Left Quadrant: Real Estate Specific, Standalone */}
          <div className="border-r-2 border-b-2 border-bone p-8 bg-paper min-h-[280px] flex flex-col">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-bone shadow-sm">
                  <span className="text-base font-semibold text-charcoal">RealPage</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-bone shadow-sm">
                  <span className="text-base font-semibold text-charcoal">MRI</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-bone shadow-sm">
                  <span className="text-base font-semibold text-charcoal">Arthur</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-bone shadow-sm">
                  <span className="text-base font-semibold text-charcoal">Aareon</span>
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-xs text-charcoal italic border-t border-bone pt-3">
                <strong>Standalone Tools:</strong> Fragmented solutions without AI-driven insights.
              </p>
            </div>
          </div>

          {/* Top-Right Quadrant: Real Estate Specific AI Tools + Fully Integrated */}
          <div className="border-b-2 border-bone p-8 bg-gradient-to-br from-success-bg to-success-bg min-h-[280px] flex flex-col">
            <div className="mb-6 flex flex-col gap-3">
              {/* Hobson - Largest and most prominent */}
              <div className="bg-gradient-to-r from-success-bg to-success-bg rounded-lg px-6 py-4 text-center border-2 border-success shadow-lg">
                <span className="text-2xl font-bold text-success">Hobson</span>
              </div>
              
              {/* Other AI tools */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg px-4 py-2.5 text-center border border-success-border shadow-sm">
                  <span className="text-sm font-semibold text-charcoal">Stan</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-2.5 text-center border border-success-border shadow-sm">
                  <span className="text-sm font-semibold text-charcoal">Kendal AI</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-2.5 text-center border border-success-border shadow-sm">
                  <span className="text-sm font-semibold text-charcoal">Trudi</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-2.5 text-center border border-success-border shadow-sm">
                  <span className="text-sm font-semibold text-charcoal">EliseAI</span>
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-xs text-success italic border-t border-success-border pt-3">
                <strong>AI Tools:</strong> Only two here are UK-based companies.
              </p>
            </div>
          </div>

          {/* Bottom-Left Quadrant: Generic AI Tools, Standalone */}
          <div className="border-r-2 border-bone p-8 bg-paper min-h-[280px] flex flex-col">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-bone shadow-sm">
                  <span className="text-base font-semibold text-charcoal">Salesforce</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-bone shadow-sm">
                  <span className="text-base font-semibold text-charcoal">HubSpot</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-bone shadow-sm col-span-2">
                  <span className="text-base font-semibold text-charcoal">ChatGPT</span>
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-xs text-charcoal italic border-t border-bone pt-3">
                <strong>Generic AI Tools:</strong> Limited understanding of real-estate-specific needs.
              </p>
            </div>
          </div>

          {/* Bottom-Right Quadrant: Empty - reinforcing uniqueness */}
          <div className="p-8 bg-white min-h-[280px] flex items-center justify-center">
            <div className="text-center max-w-xs">
              <div className="w-16 h-16 rounded-full bg-bone-wash mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <p className="text-sm text-ink-muted italic">
                No fully integrated, generic AI solutions in this space
              </p>
            </div>
          </div>
        </div>

        {/* Axis Arrows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
          <svg className="w-6 h-6 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6">
          <svg className="w-6 h-6 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>

      {/* Key Insight */}
      <div className="mt-16 max-w-3xl mx-auto bg-success-bg border-l-4 border-success p-6 rounded-r-lg">
        <p className="text-base text-ink leading-relaxed">
          <strong className="text-success">Key Insight:</strong> Only Hobson sits in the fully integrated, AI-native, real-estate-specific quadrant. Traditional solutions lack AI, generic AI tools lack industry context, and standalone real-estate tools lack integration.
        </p>
      </div>
    </div>
  );
};
