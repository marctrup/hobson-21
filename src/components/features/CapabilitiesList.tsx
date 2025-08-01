import { Search, Calendar, BarChart3, Shield, Zap, CheckCircle } from "lucide-react";
import { memo } from "react";

const CapabilitiesList = memo(() => {
  const capabilities = [
    { icon: Search, text: "Instant property search and filtering" },
    { icon: Calendar, text: "Automated calendar management" },
    { icon: BarChart3, text: "Real-time performance analytics" },
    { icon: Shield, text: "Enterprise-grade security" },
    { icon: Zap, text: "Lightning-fast response times" },
    { icon: CheckCircle, text: "99.9% uptime guarantee" }
  ];

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Core Capabilities
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Built on a foundation of reliability and performance that property professionals demand.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((capability, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 p-6 bg-background/50 rounded-lg border border-primary/10 hover:border-primary/20 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <capability.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-foreground font-medium">{capability.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

CapabilitiesList.displayName = 'CapabilitiesList';

export default CapabilitiesList;