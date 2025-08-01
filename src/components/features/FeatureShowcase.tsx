import { MessageCircle } from "lucide-react";
import PropertyMap from "./PropertyMap";
import { memo } from "react";

const FeatureShowcase = memo(() => {
  return (
    <div className="mb-20 overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Simple. Powerful. Intuitive.
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Chat with Hobson on the left, visualize your portfolio on the right. Everything you need in one seamless interface.
        </p>
      </div>
      
      {/* Angled Interface Display */}
      <div className="relative perspective-1000">
        <div className="relative transform rotate-y-12 scale-95 hover:scale-100 hover:rotate-y-6 transition-all duration-700 mx-auto max-w-7xl hover:transform-none">
          
          {/* Floating elements for depth */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          
          {/* Main Interface Container */}
          <div className="bg-background/90 backdrop-blur-xl rounded-2xl border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[400px] lg:h-[600px]">
              
              {/* Left Chat Panel */}
              <div className="w-full lg:w-1/2 bg-background/50 lg:border-r border-primary/10 border-b lg:border-b-0 p-4 lg:p-6 flex flex-col min-h-[400px] lg:min-h-0">
                {/* Chat Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/10">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/70 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Chat with Hobson</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">Online</span>
                    </div>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 space-y-4 mb-6">
                  <div className="bg-primary/10 rounded-lg p-4 max-w-[85%] animate-fade-in">
                    <p className="text-sm">👋 Hi there!</p>
                    <p className="text-sm">Ready to streamline your workload?</p>
                    <p className="text-sm">Let's make your tasks effortless.</p>
                  </div>
                  
                  {/* Suggested Actions */}
                  <div className="space-y-2 animate-fade-in delay-500">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Suggested actions:</p>
                    <div className="space-y-2">
                      <button className="w-full text-left p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors text-sm">
                        List key dates for Unit 2, Technology Park
                      </button>
                      <button className="w-full text-left p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors text-sm">
                        Summarise the rent review clause for Unit 2 Finchley Road
                      </button>
                      <button className="w-full text-left p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors text-sm">
                        Which leases have break clauses coming up?
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Chat Input */}
                <div className="border border-primary/20 rounded-lg p-3 bg-muted/20">
                  <p className="text-sm text-muted-foreground">Ask Hobson...</p>
                </div>
              </div>
              
              {/* Right Map Panel */}
              <PropertyMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

FeatureShowcase.displayName = 'FeatureShowcase';

export default FeatureShowcase;