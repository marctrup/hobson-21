import { CreditCard, Zap, BarChart3, Eye } from 'lucide-react';

export const HEUPricingVisual = () => {
  return (
    <div className="space-y-12 bg-white p-10 rounded-xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-black mb-3">
          HEU System, Pricing, and Transparent Usage
        </h2>
        <p className="text-xl text-gray-600">
          Fair, predictable pricing with complete transparency
        </p>
      </div>

      {/* HEU Explanation - Full Width Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-xl p-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-black mb-4">
              What is an HEU (Hobson Energy Unit)?
            </h3>
            <div className="space-y-3 text-lg text-gray-800">
              <p className="leading-relaxed">
                <strong>An HEU, Hobson's currency</strong> measures how much AI processing is used for each action.
              </p>
              <p className="leading-relaxed">
                This ensures <strong>fair, predictable pricing</strong> tied directly to value delivered.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans - Centered Grid */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
            <CreditCard className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-black">Pricing Plans</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          {/* Free Plan */}
          <div className="border-3 border-gray-300 rounded-xl p-6 hover:border-blue-600 transition-all hover:shadow-lg bg-white">
            <h4 className="font-bold text-2xl text-black mb-4 pb-3 border-b border-gray-200">Free</h4>
            <div className="space-y-2 text-center">
              <p className="text-3xl font-bold text-blue-600">18</p>
              <p className="text-sm text-gray-600">HEUs/month</p>
            </div>
          </div>

          {/* Essential Plan */}
          <div className="border-3 border-gray-300 rounded-xl p-6 hover:border-blue-600 transition-all hover:shadow-lg bg-white">
            <h4 className="font-bold text-2xl text-black mb-4 pb-3 border-b border-gray-200">Essential</h4>
            <div className="space-y-2 text-center">
              <p className="text-2xl font-bold text-black">£19.50</p>
              <p className="text-xs text-gray-500 mb-3">/month</p>
              <p className="text-3xl font-bold text-blue-600">275</p>
              <p className="text-sm text-gray-600">HEUs/month</p>
            </div>
          </div>

          {/* Essential Plus Plan */}
          <div className="border-3 border-blue-600 rounded-xl p-6 bg-white shadow-lg transform scale-105">
            <h4 className="font-bold text-2xl text-black mb-4 pb-3 border-b border-blue-600">Essential Plus</h4>
            <div className="space-y-2 text-center">
              <p className="text-2xl font-bold text-black">£49.75</p>
              <p className="text-xs text-gray-500 mb-3">/month</p>
              <p className="text-3xl font-bold text-blue-600">700</p>
              <p className="text-sm text-gray-600">HEUs/month</p>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="border-3 border-gray-300 rounded-xl p-6 hover:border-blue-600 transition-all hover:shadow-lg bg-white">
            <h4 className="font-bold text-2xl text-black mb-4 pb-3 border-b border-gray-200">Enterprise</h4>
            <div className="space-y-2 text-center">
              <p className="text-2xl font-bold text-black">£148.50</p>
              <p className="text-xs text-gray-500 mb-3">/month</p>
              <p className="text-3xl font-bold text-blue-600">2000</p>
              <p className="text-sm text-gray-600">HEUs/month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top-Up - Compact Banner */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black">Top-Up</h3>
                <p className="text-sm text-gray-600">One-time purchase</p>
              </div>
            </div>
            <div className="flex gap-8 items-center">
              <div className="text-right">
                <p className="text-2xl font-bold text-black">£15</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">150</p>
                <p className="text-sm text-gray-600">HEUs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transparency Section - Two Column */}
      <div className="pt-8 border-t-2 border-gray-200">
        <h3 className="text-3xl font-bold text-black mb-8 text-center">Complete Usage Transparency</h3>
        
        <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* HEU Bar Visual */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-black">Real-Time HEU Bar</h4>
            </div>
            
            <div className="space-y-6">
              <div className="relative w-full h-16 bg-gray-200 rounded-xl overflow-hidden border-2 border-gray-300 shadow-inner">
                <div 
                  className="absolute left-0 top-0 h-full bg-gray-400 flex items-center justify-center transition-all"
                  style={{ width: '60%' }}
                >
                  <span className="text-sm font-bold text-white">420 used</span>
                </div>
                <div 
                  className="absolute right-0 top-0 h-full bg-blue-600 flex items-center justify-center transition-all"
                  style={{ width: '40%' }}
                >
                  <span className="text-sm font-bold text-white">280 remaining</span>
                </div>
              </div>
              
              <div className="text-center py-2">
                <p className="text-lg font-bold text-black">700 total HEUs</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <p className="text-sm text-gray-800 leading-relaxed">
                  <strong className="text-black">Real-time tracking</strong> shows exactly how much you've used and what remains—no surprises.
                </p>
              </div>
            </div>
          </div>

          {/* Per-Message Transparency */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-black">Per-Message Cost</h4>
            </div>

            <div className="space-y-6">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-5 shadow-sm">
                <h5 className="font-bold text-black mb-4 text-sm uppercase tracking-wide">Message Usage Details</h5>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">HEU Cost:</span>
                    <span className="font-bold text-blue-600 text-lg">0.05</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Query Type:</span>
                    <span className="text-gray-900 font-medium">Simple extraction</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="text-gray-900 font-medium">1.2s</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Documents Searched:</span>
                    <span className="text-gray-900 font-medium">3 files</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3 mt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Before:</span>
                      <span className="text-gray-900 font-mono">420.45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">After:</span>
                      <span className="text-gray-900 font-mono">420.40</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <p className="text-sm text-gray-800 leading-relaxed">
                  Click <strong className="text-black">⋯</strong> on any message for detailed cost breakdown. <strong className="text-black">Every action is itemised</strong> for complete visibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
