import { CheckCircle, TrendingUp, Clock, Users } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Save Time",
      description: "Instantly find information across thousands of documents without manual searching"
    },
    {
      icon: TrendingUp,
      title: "Increase Accuracy",
      description: "Get precise answers with source citations, reducing errors and improving decision-making"
    },
    {
      icon: Users,
      title: "Scale Your Team",
      description: "Handle more properties and clients without proportionally increasing headcount"
    },
    {
      icon: CheckCircle,
      title: "Stay Compliant",
      description: "Never miss important dates, clauses, or requirements hidden in your documents"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Why Property Professionals Choose Hobson
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform how you work with property documents and unlock insights that drive better business outcomes
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