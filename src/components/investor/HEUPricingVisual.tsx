import { CreditCard, Zap, BarChart3, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const HEUPricingVisual = () => {
  return (
    <div className="space-y-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          HEU System, Pricing, and Transparent Usage
        </h2>
        <p className="text-slate-300">
          Fair, predictable pricing with complete transparency
        </p>
      </div>

      {/* Top Section: HEU Explanation + Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1 — HEU Explanation */}
        <div className="p-6 border-2 border-slate-700 rounded-xl bg-slate-800/50 backdrop-blur">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">
              What is an HEU (Hobson Energy Unit)?
            </h3>
          </div>
          <ul className="space-y-3 text-slate-200">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
              <span>An HEU measures how much AI processing is used for each action.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
              <span>Every search, extraction, summary, or query consumes a small number of HEUs based on complexity.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
              <span>This ensures fair, predictable pricing tied directly to value delivered.</span>
            </li>
          </ul>
        </div>

        {/* Section 2 — Pricing Plans */}
        <div className="p-6 border-2 border-slate-700 rounded-xl bg-slate-800/50 backdrop-blur">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Pricing Plans</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Free Plan */}
            <div className="border-2 border-slate-600 rounded-lg p-4 hover:border-blue-400 transition-colors bg-slate-900/50">
              <h4 className="font-bold text-lg text-white mb-2">Free</h4>
              <div className="space-y-1 text-sm text-slate-200">
                <p className="font-semibold text-blue-400">18 HEUs/month</p>
                <p>Unlimited members</p>
                <p>Unlimited documents</p>
              </div>
            </div>

            {/* Essential Plan */}
            <div className="border-2 border-slate-600 rounded-lg p-4 hover:border-blue-400 transition-colors bg-slate-900/50">
              <h4 className="font-bold text-lg text-white mb-2">Essential</h4>
              <div className="space-y-1 text-sm text-slate-200">
                <p className="font-semibold text-blue-400">275 HEUs/month</p>
                <p>Everything in Free</p>
                <p>Priority support</p>
              </div>
            </div>

            {/* Essential Plus Plan */}
            <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-500/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-lg text-white">Essential Plus</h4>
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Most Popular</span>
              </div>
              <div className="space-y-1 text-sm text-slate-200">
                <p className="font-semibold text-blue-400">700 HEUs/month</p>
                <p>Everything in Essential</p>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="border-2 border-slate-600 rounded-lg p-4 hover:border-blue-400 transition-colors bg-slate-900/50">
              <h4 className="font-bold text-lg text-white mb-2">Enterprise</h4>
              <div className="space-y-1 text-sm text-slate-200">
                <p className="font-semibold text-blue-400">2000 HEUs/month</p>
                <p>Everything in Essential Plus</p>
                <p>Dedicated support</p>
                <p>Business knowledgebase</p>
                <p>Bespoke integrations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 — Top-Up Pack */}
      <div className="p-6 border-2 border-slate-700 rounded-xl bg-slate-800/30 backdrop-blur">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3">Top-Up Pack</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm text-slate-200">
                <div>
                  <p className="font-semibold text-blue-400 mb-1">£15 one-off purchase</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Adds 150 HEUs</p>
                </div>
                <div>
                  <p>Covers extraction, indexing, and Q&A</p>
                </div>
                <div>
                  <p>Non-rollover (expires at end of billing period)</p>
                </div>
                <div>
                  <p>Works instantly with any paid plan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Transparent Usage Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 4 — HEU Bar Visual */}
        <div className="p-6 border-2 border-slate-700 rounded-xl bg-slate-800/50 backdrop-blur">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">HEU Bar Visual</h3>
          </div>
          
          {/* HEU Bar Mockup */}
          <div className="space-y-4">
            <div className="relative w-full h-12 bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-600">
              {/* Used portion (60% = 420/700) */}
              <div 
                className="absolute left-0 top-0 h-full bg-slate-600 flex items-center justify-center"
                style={{ width: '60%' }}
              >
                <span className="text-sm font-semibold text-white">420 used</span>
              </div>
              {/* Remaining portion */}
              <div 
                className="absolute right-0 top-0 h-full bg-blue-500 flex items-center justify-center"
                style={{ width: '40%' }}
              >
                <span className="text-sm font-semibold text-white">280 remaining</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-semibold text-white">700 total HEUs</p>
            </div>

            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
              <p className="text-sm text-slate-200 leading-relaxed">
                <strong className="text-white">Real-time HEU bar</strong> shows exactly how much you've used and what remains—no surprises.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5 — Per-Message Cost Transparency */}
        <div className="p-6 border-2 border-slate-700 rounded-xl bg-slate-800/50 backdrop-blur">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Per-Message Transparency</h3>
          </div>

          {/* Message Usage Mockup */}
          <div className="space-y-4">
            <div className="border-2 border-slate-600 rounded-lg p-4 bg-slate-900/50">
              <h4 className="font-semibold text-white mb-3">Message Usage Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">HEU Cost:</span>
                  <span className="font-semibold text-blue-400">0.05 HEU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Query Type:</span>
                  <span className="text-slate-200">Simple extraction</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Processing Time:</span>
                  <span className="text-slate-200">1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Documents Searched:</span>
                  <span className="text-slate-200">3 files</span>
                </div>
                <div className="border-t border-slate-600 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">HEUs Before:</span>
                    <span className="text-slate-200">420.45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">HEUs After:</span>
                    <span className="text-slate-200">420.40</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
              <p className="text-sm text-slate-200 leading-relaxed">
                Users can click the <strong className="text-white">⋯</strong> on any message to see detailed cost breakdown.
              </p>
              <p className="text-sm text-slate-200 leading-relaxed mt-2">
                <strong className="text-white">Every action is itemised</strong>, giving complete visibility into cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
