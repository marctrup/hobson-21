import { Clock, FileText, DollarSign, TrendingDown } from "lucide-react";

export const AIProcessingVisual = () => {
  return (
    <div className="space-y-8">
      {/* Processing Time Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Processing Time (Per Document Type)</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Realistic averages based on real-world usage</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background border border-border rounded-lg p-5">
            <div className="text-sm font-medium text-muted-foreground mb-2">Complex Documents</div>
            <div className="text-xs text-muted-foreground mb-3">(e.g., Leases)</div>
            <div className="text-2xl font-bold text-primary">8–9 min</div>
            <div className="text-xs text-muted-foreground mt-2">to fully read, interpret, and structure</div>
          </div>
          
          <div className="bg-background border border-border rounded-lg p-5">
            <div className="text-sm font-medium text-muted-foreground mb-2">Medium Complexity</div>
            <div className="text-xs text-muted-foreground mb-3">(e.g., Deeds, Licences)</div>
            <div className="text-2xl font-bold text-primary">2–3 min</div>
          </div>
          
          <div className="bg-background border border-border rounded-lg p-5">
            <div className="text-sm font-medium text-muted-foreground mb-2">Low Complexity</div>
            <div className="text-xs text-muted-foreground mb-3">(e.g., Notices, Letters)</div>
            <div className="text-2xl font-bold text-primary">30s–1 min</div>
          </div>
        </div>
      </div>

      {/* Cost Examples Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Processing Cost Examples (Token-Based Pricing)</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Real customer data from EPAM and Draper extractions</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* EPAM Example */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-foreground mb-1">EPAM Example</h4>
                <p className="text-sm text-muted-foreground">29 Documents (Leases + Deeds)</p>
              </div>
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Total tokens:</span>
                <span className="font-mono text-sm font-medium">17,626,896</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Total cost:</span>
                <span className="text-xl font-bold text-primary">$10.51</span>
              </div>
              <div className="flex justify-between items-baseline pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Average per document:</span>
                <span className="font-semibold text-foreground">$0.36</span>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-2 pt-2">
                <div className="flex justify-between">
                  <span>1 Lease:</span>
                  <span className="font-medium">~$0.38</span>
                </div>
                <div className="flex justify-between">
                  <span>1 Deed:</span>
                  <span className="font-medium">~$0.12</span>
                </div>
                <p className="text-xs italic mt-3">
                  Leases cost more due to higher processing time and internal reasoning steps.
                </p>
              </div>
            </div>
          </div>

          {/* Drapers Example */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Drapers Example</h4>
                <p className="text-sm text-muted-foreground">19 Documents (Head Leases)</p>
              </div>
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Total tokens:</span>
                <span className="font-mono text-sm font-medium">19,099,980</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Total cost:</span>
                <span className="text-xl font-bold text-primary">$7.77</span>
              </div>
              <div className="flex justify-between items-baseline pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Average per document:</span>
                <span className="font-semibold text-foreground">$0.41</span>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-2 pt-2">
                <div className="flex justify-between">
                  <span>1 Lease:</span>
                  <span className="font-medium">~$0.41</span>
                </div>
                <div className="flex justify-between">
                  <span>Tokens per lease:</span>
                  <span className="font-medium">~1,005,262</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">What This Means for Hobson Users</h3>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span className="text-sm text-foreground">Document processing is fast, predictable, and inexpensive</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span className="text-sm text-foreground">AI can read an entire lease for less than 50 cents</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span className="text-sm text-foreground">Even heavy portfolios cost single-digit dollars to index</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span className="text-sm text-foreground">This efficiency underpins Hobson's HEU model and competitive pricing and good obtainable margins</span>
          </li>
        </ul>
      </div>
    </div>
  );
};