import { CreditCard, Zap, BarChart3, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const HEUPricingVisual = () => {
  return (
    <div className="space-y-8 bg-white p-8 rounded-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">
          HEU System, Pricing, and Transparent Usage
        </h2>
        <p className="text-gray-700">
          Fair, predictable pricing with complete transparency
        </p>
      </div>

      {/* Top Section: HEU Explanation + Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1 — HEU Explanation */}
        <div className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-black">
              What is an HEU (Hobson Energy Unit)?
            </h3>
          </div>
          <ul className="space-y-3 text-gray-800">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
              <span>an HEU, Hobson's currency measures how much AI processing is used for each action.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
              <span>This ensures fair, predictable pricing tied directly to value delivered.</span>
            </li>
          </ul>
        </div>

        {/* Section 2 — Pricing Plans */}
        <div className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-black">Pricing Plans</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Free Plan */}
            <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-blue-600 transition-colors bg-white">
              <h4 className="font-bold text-lg text-black mb-2">Free</h4>
              <div className="space-y-1 text-sm text-gray-800">
                <p className="font-semibold text-blue-600">18 HEUs/month</p>
              </div>
            </div>

            {/* Essential Plan */}
            <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-blue-600 transition-colors bg-white">
              <h4 className="font-bold text-lg text-black mb-2">Essential</h4>
              <div className="space-y-1 text-sm text-gray-800">
                <p className="font-semibold text-blue-600">£19.50/month</p>
                <p className="font-semibold text-blue-600">275 HEUs/month</p>
              </div>
            </div>

            {/* Essential Plus Plan */}
            <div className="border-2 border-blue-600 rounded-lg p-4 bg-white">
              <h4 className="font-bold text-lg text-black mb-2">Essential Plus</h4>
              <div className="space-y-1 text-sm text-gray-800">
                <p className="font-semibold text-blue-600">£49.75/month</p>
                <p className="font-semibold text-blue-600">700 HEUs/month</p>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-blue-600 transition-colors bg-white">
              <h4 className="font-bold text-lg text-black mb-2">Enterprise</h4>
              <div className="space-y-1 text-sm text-gray-800">
                <p className="font-semibold text-blue-600">£148.50/month</p>
                <p className="font-semibold text-blue-600">2000 HEUs/month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 — Top-Up Pack */}
      <div className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-black mb-3">Top-Up</h3>
              <div className="flex gap-8 text-sm text-gray-800">
                <div>
                  <p className="font-semibold text-blue-600">£15</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-600">150 HEUs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Transparent Usage Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 4 — HEU Bar Visual */}
        <div className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-black">HEU Bar Visual</h3>
          </div>
          
          {/* HEU Bar Mockup */}
          <div className="space-y-4">
            <div className="relative w-full h-12 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
              {/* Used portion (60% = 420/700) */}
              <div 
                className="absolute left-0 top-0 h-full bg-gray-400 flex items-center justify-center"
                style={{ width: '60%' }}
              >
                <span className="text-sm font-semibold text-black">420 used</span>
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
              <p className="text-sm font-semibold text-black">700 total HEUs</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-800 leading-relaxed">
                <strong className="text-black">Real-time HEU bar</strong> shows exactly how much you've used and what remains—no surprises.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5 — Per-Message Cost Transparency */}
        <div className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-black">Per-Message Transparency</h3>
          </div>

          {/* Message Usage Mockup */}
          <div className="space-y-4">
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
              <h4 className="font-semibold text-black mb-3">Message Usage Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">HEU Cost:</span>
                  <span className="font-semibold text-blue-600">0.05 HEU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Query Type:</span>
                  <span className="text-gray-800">Simple extraction</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Time:</span>
                  <span className="text-gray-800">1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents Searched:</span>
                  <span className="text-gray-800">3 files</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">HEUs Before:</span>
                    <span className="text-gray-800">420.45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HEUs After:</span>
                    <span className="text-gray-800">420.40</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-800 leading-relaxed">
                Users can click the <strong className="text-black">⋯</strong> on any message to see detailed cost breakdown.
              </p>
              <p className="text-sm text-gray-800 leading-relaxed mt-2">
                <strong className="text-black">Every action is itemised</strong>, giving complete visibility into cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
