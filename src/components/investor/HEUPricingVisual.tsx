import { CreditCard, Zap, BarChart3, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const HEUPricingVisual = () => {
  return (
    <div className="space-y-8 bg-background">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          HEU System, Pricing, and Transparent Usage
        </h2>
        <p className="text-muted-foreground">
          Fair, predictable pricing with complete transparency
        </p>
      </div>

      {/* Top Section: HEU Explanation + Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1 — HEU Explanation */}
        <Card className="p-6 border-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              What is an HEU (Hobson Energy Unit)?
            </h3>
          </div>
          <ul className="space-y-3 text-foreground">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
              <span>An HEU measures how much AI processing is used for each action.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
              <span>Every search, extraction, summary, or query consumes a small number of HEUs based on complexity.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
              <span>This ensures fair, predictable pricing tied directly to value delivered.</span>
            </li>
          </ul>
        </Card>

        {/* Section 2 — Pricing Plans */}
        <Card className="p-6 border-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Pricing Plans</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Free Plan */}
            <div className="border-2 rounded-lg p-4 hover:border-primary/50 transition-colors">
              <h4 className="font-bold text-lg text-foreground mb-2">Free</h4>
              <div className="space-y-1 text-sm text-foreground">
                <p className="font-semibold text-primary">18 HEUs/month</p>
                <p>Unlimited members</p>
                <p>Unlimited documents</p>
              </div>
            </div>

            {/* Essential Plan */}
            <div className="border-2 rounded-lg p-4 hover:border-primary/50 transition-colors">
              <h4 className="font-bold text-lg text-foreground mb-2">Essential</h4>
              <div className="space-y-1 text-sm text-foreground">
                <p className="font-semibold text-primary">275 HEUs/month</p>
                <p>Everything in Free</p>
                <p>Priority support</p>
              </div>
            </div>

            {/* Essential Plus Plan */}
            <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-lg text-foreground">Essential Plus</h4>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Most Popular</span>
              </div>
              <div className="space-y-1 text-sm text-foreground">
                <p className="font-semibold text-primary">700 HEUs/month</p>
                <p>Everything in Essential</p>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="border-2 rounded-lg p-4 hover:border-primary/50 transition-colors">
              <h4 className="font-bold text-lg text-foreground mb-2">Enterprise</h4>
              <div className="space-y-1 text-sm text-foreground">
                <p className="font-semibold text-primary">2000 HEUs/month</p>
                <p>Everything in Essential Plus</p>
                <p>Dedicated support</p>
                <p>Business knowledgebase</p>
                <p>Bespoke integrations</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Section 3 — Top-Up Pack */}
      <Card className="p-6 border-2 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-3">Top-Up Pack</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm text-foreground">
                <div>
                  <p className="font-semibold text-primary mb-1">£15 one-off purchase</p>
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
      </Card>

      {/* Bottom Section: Transparent Usage Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 4 — HEU Bar Visual */}
        <Card className="p-6 border-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">HEU Bar Visual</h3>
          </div>
          
          {/* HEU Bar Mockup */}
          <div className="space-y-4">
            <div className="relative w-full h-12 bg-muted rounded-lg overflow-hidden border-2 border-border">
              {/* Used portion (60% = 420/700) */}
              <div 
                className="absolute left-0 top-0 h-full bg-muted-foreground/40 flex items-center justify-center"
                style={{ width: '60%' }}
              >
                <span className="text-sm font-semibold text-foreground">420 used</span>
              </div>
              {/* Remaining portion */}
              <div 
                className="absolute right-0 top-0 h-full bg-primary/60 flex items-center justify-center"
                style={{ width: '40%' }}
              >
                <span className="text-sm font-semibold text-primary-foreground">280 remaining</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">700 total HEUs</p>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-foreground leading-relaxed">
                <strong>Real-time HEU bar</strong> shows exactly how much you've used and what remains—no surprises.
              </p>
            </div>
          </div>
        </Card>

        {/* Section 5 — Per-Message Cost Transparency */}
        <Card className="p-6 border-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Per-Message Transparency</h3>
          </div>

          {/* Message Usage Mockup */}
          <div className="space-y-4">
            <div className="border-2 rounded-lg p-4 bg-background">
              <h4 className="font-semibold text-foreground mb-3">Message Usage Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">HEU Cost:</span>
                  <span className="font-semibold text-primary">0.05 HEU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Query Type:</span>
                  <span className="text-foreground">Simple extraction</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Time:</span>
                  <span className="text-foreground">1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documents Searched:</span>
                  <span className="text-foreground">3 files</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HEUs Before:</span>
                    <span className="text-foreground">420.45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HEUs After:</span>
                    <span className="text-foreground">420.40</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-foreground leading-relaxed">
                Users can click the <strong>⋯</strong> on any message to see detailed cost breakdown.
              </p>
              <p className="text-sm text-foreground leading-relaxed mt-2">
                <strong>Every action is itemised</strong>, giving complete visibility into cost.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Summary Box */}
      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-3">
            Why This Pricing Model Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-foreground">
            <div>
              <p className="font-semibold text-primary mb-1">Fair & Transparent</p>
              <p>Pay only for what you use with complete visibility</p>
            </div>
            <div>
              <p className="font-semibold text-primary mb-1">Predictable Costs</p>
              <p>HEU system makes budgeting simple and accurate</p>
            </div>
            <div>
              <p className="font-semibold text-primary mb-1">No Hidden Fees</p>
              <p>Every action itemised and tracked in real-time</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
