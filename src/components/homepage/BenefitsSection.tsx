import { MessageCircle, Map, FileText, TrendingUp } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: MessageCircle,
      title: "Intelligent Chat Interface",
      description: "Ask Hobson anything about your properties. Get instant answers to complex questions with our conversational AI assistant."
    },
    {
      icon: Map,
      title: "Interactive Property Mapping",
      description: "Visualize your entire portfolio on an interactive map. See property locations, market data, and geographical insights at a glance."
    },
    {
      icon: FileText,
      title: "Smart Document Analysis",
      description: "Upload lease agreements, surveys, and contracts. Hobson extracts key information and identifies important dates automatically."
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Get ahead of market changes and lease renewals with AI-driven predictions and recommendations."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Simple. Powerful. Intuitive.
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Talk to your documents on the left. See your portfolio come alive on the right. No menus, just flow
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};