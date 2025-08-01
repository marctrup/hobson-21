import { Card, CardContent } from "@/components/ui/card";
import { Building2, TrendingUp, MapPin, PenTool, CreditCard, Shield } from "lucide-react";

export const SolutionsSection = () => {
  const solutions = [
    {
      icon: Building2,
      name: "Property Management",
      description: "Streamline tenant documentation and lease analysis"
    },
    {
      icon: TrendingUp,
      name: "Property Sales",
      description: "Accelerate deal analysis and due diligence"
    },
    {
      icon: MapPin,
      name: "Surveying",
      description: "Automate report generation and data extraction"
    },
    {
      icon: PenTool,
      name: "Planning",
      description: "Process planning documents and regulatory requirements"
    },
    {
      icon: CreditCard,
      name: "Lending",
      description: "Speed up loan documentation and risk assessment"
    },
    {
      icon: Shield,
      name: "Compliance",
      description: "Keep on top of repeat visits and documentation updates"
    }
  ];

  return (
    <section id="solutions" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Property Intelligence for the Industry
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            One AI assistant for all your property documentation needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {solutions.map((solution, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              <Card className="relative border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 hover:scale-105 h-full">
                <CardContent className="p-8">
                  <div className="mb-6 inline-flex p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
                    <solution.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">{solution.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{solution.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};