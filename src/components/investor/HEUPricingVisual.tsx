import { CreditCard, Zap, BarChart3, Eye } from 'lucide-react';

export const HEUPricingVisual = () => {
  return (
    <div className="space-y-8 bg-purple-50 p-8 rounded-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          HEU System, Pricing, and Transparent Usage
        </h2>
        <p className="text-sm text-gray-600">
          Fair, predictable pricing with complete transparency
        </p>
      </div>

      {/* HEU Explanation - Compact Banner */}
      <div className="bg-white border border-purple-200 rounded-lg p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              What is an HEU (Hobson Energy Unit)?
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <strong>An HEU, Hobson's currency</strong> measures how much AI processing is used for each action.
              </p>
              <p>
                This ensures <strong>fair, predictable pricing</strong> tied directly to value delivered.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans - Compact Grid */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Pricing Plans</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {/* Free Plan */}
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <h4 className="font-bold text-base text-gray-900 mb-3 pb-2 border-b border-gray-200">Free</h4>
            <div className="space-y-1 text-center">
              <p className="text-base font-bold text-gray-900">£0.00</p>
              <p className="text-xs text-gray-500">/month</p>
              <p className="text-xl font-bold text-purple-600 mt-2">18</p>
              <p className="text-xs text-gray-600">HEUs/month</p>
            </div>
          </div>

          {/* Essential Plan */}
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <h4 className="font-bold text-base text-gray-900 mb-3 pb-2 border-b border-gray-200">Essential</h4>
            <div className="space-y-1 text-center">
              <p className="text-base font-bold text-gray-900">£19.50</p>
              <p className="text-xs text-gray-500">/month</p>
              <p className="text-xl font-bold text-purple-600 mt-2">275</p>
              <p className="text-xs text-gray-600">HEUs/month</p>
            </div>
          </div>

          {/* Essential Plus Plan */}
          <div className="border-2 border-purple-400 rounded-lg p-4 bg-white">
            <h4 className="font-bold text-base text-gray-900 mb-3 pb-2 border-b border-purple-400">Essential Plus</h4>
            <div className="space-y-1 text-center">
              <p className="text-base font-bold text-gray-900">£49.75</p>
              <p className="text-xs text-gray-500">/month</p>
              <p className="text-xl font-bold text-purple-600 mt-2">700</p>
              <p className="text-xs text-gray-600">HEUs/month</p>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <h4 className="font-bold text-base text-gray-900 mb-3 pb-2 border-b border-gray-200">Enterprise</h4>
            <div className="space-y-1 text-center">
              <p className="text-base font-bold text-gray-900">£148.50</p>
              <p className="text-xs text-gray-500">/month</p>
              <p className="text-xl font-bold text-purple-600 mt-2">2000</p>
              <p className="text-xs text-gray-600">HEUs/month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top-Up - Compact */}
      <div className="bg-white border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Top-Up</h3>
              <p className="text-xs text-gray-600">One-time purchase</p>
            </div>
          </div>
          <div className="flex gap-8 items-center whitespace-nowrap">
            <p className="text-base font-bold text-gray-900">£15</p>
            <p className="text-base font-bold text-purple-600">150 HEUs</p>
          </div>
        </div>
      </div>

      {/* Transparency Section */}
      <div className="pt-4 border-t border-purple-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Complete Usage Transparency</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* HEU Bar Visual */}
          <div className="bg-white border border-purple-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Real-Time HEU Bar</h4>
            </div>
            
            <div className="space-y-3">
              <div className="relative w-full h-10 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                <div 
                  className="absolute left-0 top-0 h-full bg-gray-400 flex items-center justify-center"
                  style={{ width: '60%' }}
                >
                  <span className="text-xs font-semibold text-white">420 used</span>
                </div>
                <div 
                  className="absolute right-0 top-0 h-full bg-purple-500 flex items-center justify-center"
                  style={{ width: '40%' }}
                >
                  <span className="text-xs font-semibold text-white">280 remaining</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-900">700 total HEUs</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <p className="text-xs text-gray-700 leading-relaxed">
                  <strong>Real-time tracking</strong> shows exactly how much you've used and what remains.
                </p>
              </div>
            </div>
          </div>

          {/* Per-Message Transparency */}
          <div className="bg-white border border-purple-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Eye className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Per-Message Cost</h4>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h5 className="font-semibold text-gray-900 mb-2 text-xs">Message Usage Details</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-gray-200">
                    <span className="text-gray-600">HEU Cost:</span>
                    <span className="font-bold text-purple-600">0.05</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-600">Query Type:</span>
                    <span className="text-gray-900">Simple extraction</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="text-gray-900">1.2s</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-600">Documents:</span>
                    <span className="text-gray-900">3 files</span>
                  </div>
                  <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
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

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <p className="text-xs text-gray-700 leading-relaxed">
                  Click <strong>⋯</strong> on any message for detailed breakdown. <strong>Every action is itemised</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
