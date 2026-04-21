import { MapPin, Shield, Ban, CreditCard } from "lucide-react";

const trustItems = [
  {
    icon: MapPin,
    label: "UK-hosted",
    description: "No data leaves UK jurisdiction",
  },
  {
    icon: Ban,
    label: "Never used for training",
    description: "Your data trains no model — ever",
  },
  {
    icon: CreditCard,
    label: "No card required to start",
    description: "Free 3-day trial on Tier 1",
  },
];

export const TrustStrip = () => {
  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {trustItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
