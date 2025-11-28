import React from 'react';

export const CompetitiveMatrixVisual = () => {
  return (
    <div className="w-full bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-slate-200">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Competitive Landscape
        </h2>
        <p className="text-lg text-slate-600 max-w-4xl mx-auto">
          A landscape of traditional software, standalone AI, and generic tools—Hobson stands out as an integrated real estate AI solution.
        </p>
      </div>

      {/* Matrix Container */}
      <div className="relative max-w-5xl mx-auto">
        {/* Y-Axis Label */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90">
          <div className="flex items-center gap-8">
            <span className="text-sm font-medium text-slate-500">Generic AI Tools</span>
            <span className="text-sm font-medium text-slate-500">Real Estate Specific AI Tools</span>
          </div>
        </div>

        {/* X-Axis Label */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full">
          <div className="flex items-center justify-between px-8">
            <span className="text-sm font-medium text-slate-500">Standalone Solution</span>
            <span className="text-sm font-medium text-slate-500">Fully Integrated Solution</span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-0 border-2 border-slate-300 rounded-lg overflow-hidden">
          
          {/* Top-Left Quadrant: Real Estate Specific, Standalone */}
          <div className="border-r-2 border-b-2 border-slate-300 p-8 bg-slate-50 min-h-[280px] flex flex-col">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-slate-300 shadow-sm">
                  <span className="text-base font-semibold text-slate-700">RealPage</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-slate-300 shadow-sm">
                  <span className="text-base font-semibold text-slate-700">MRI</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-slate-300 shadow-sm">
                  <span className="text-base font-semibold text-slate-700">Arthur</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-slate-300 shadow-sm">
                  <span className="text-base font-semibold text-slate-700">Aareon</span>
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-xs text-slate-600 italic border-t border-slate-300 pt-3">
                <strong>Standalone Tools:</strong> Fragmented solutions without AI-driven insights.
              </p>
            </div>
          </div>

          {/* Top-Right Quadrant: Real Estate Specific AI Tools + Fully Integrated */}
          <div className="border-b-2 border-slate-300 p-8 bg-gradient-to-br from-emerald-50 to-green-50 min-h-[280px] flex flex-col">
            <div className="mb-6 flex flex-col gap-3">
              {/* Hobson - Largest and most prominent */}
              <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-lg px-6 py-4 text-center border-2 border-emerald-600 shadow-lg">
                <span className="text-2xl font-bold text-emerald-900">Hobson</span>
              </div>
              
              {/* Other AI tools */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg px-4 py-2.5 text-center border border-emerald-300 shadow-sm">
                  <span className="text-sm font-semibold text-slate-700">Stan</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-2.5 text-center border border-emerald-300 shadow-sm">
                  <span className="text-sm font-semibold text-slate-700">Kendal AI</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-2.5 text-center border border-emerald-300 shadow-sm">
                  <span className="text-sm font-semibold text-slate-700">Trudi</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-2.5 text-center border border-emerald-300 shadow-sm">
                  <span className="text-sm font-semibold text-slate-700">EliseAI</span>
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-xs text-emerald-800 italic border-t border-emerald-300 pt-3">
                <strong>AI Tools:</strong> Only two here are UK-based companies.
              </p>
            </div>
          </div>

          {/* Bottom-Left Quadrant: Generic AI Tools, Standalone */}
          <div className="border-r-2 border-slate-300 p-8 bg-slate-50 min-h-[280px] flex flex-col">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-slate-300 shadow-sm">
                  <span className="text-base font-semibold text-slate-700">Salesforce</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-slate-300 shadow-sm">
                  <span className="text-base font-semibold text-slate-700">HubSpot</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 text-center border border-slate-300 shadow-sm col-span-2">
                  <span className="text-base font-semibold text-slate-700">ChatGPT</span>
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-xs text-slate-600 italic border-t border-slate-300 pt-3">
                <strong>Generic AI Tools:</strong> Limited understanding of real-estate-specific needs.
              </p>
            </div>
          </div>

          {/* Bottom-Right Quadrant: Empty - reinforcing uniqueness */}
          <div className="p-8 bg-white min-h-[280px] flex items-center justify-center">
            <div className="text-center max-w-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <p className="text-sm text-slate-500 italic">
                No fully integrated, generic AI solutions in this space
              </p>
            </div>
          </div>
        </div>

        {/* Axis Arrows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>

      {/* Key Insight */}
      <div className="mt-16 max-w-3xl mx-auto bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-lg">
        <p className="text-base text-slate-800 leading-relaxed">
          <strong className="text-emerald-800">Key Insight:</strong> Only Hobson sits in the fully integrated, AI-native, real-estate-specific quadrant. Traditional solutions lack AI, generic AI tools lack industry context, and standalone real-estate tools lack integration.
        </p>
      </div>
    </div>
  );
};
