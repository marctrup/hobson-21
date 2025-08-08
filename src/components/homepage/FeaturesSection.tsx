import { Card, CardContent } from "@/components/ui/card";
import { Brain, Search, Zap, Shield, Users, Globe } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Intelligent Analysis",
      description: "Advanced AI understands context and extracts meaningful insights from complex property documents."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant answers to complex questions that would take hours of manual research."
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find exactly what you need across thousands of documents with natural language queries."
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your sensitive property data is protected with enterprise-level security measures."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share insights and collaborate seamlessly across your entire property team."
    },
    {
      icon: Globe,
      title: "Cloud-Based",
      description: "Access your property intelligence from anywhere, on any device, at any time."
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/30" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 id="features-heading" className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Why Choose Hobson AI?
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-background/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-6 inline-flex p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};