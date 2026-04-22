import { Building2, ShoppingBag, UtensilsCrossed, Briefcase } from "lucide-react";

const audiences = [
  {
    icon: Building2,
    label: "Property and asset managers",
    description: "Managing portfolios, lease events and compliance across residential and commercial property.",
  },
  {
    icon: ShoppingBag,
    label: "Retail operators",
    description: "Managing store leases, rent reviews, break clauses and EPC obligations across a multi-site estate.",
  },
  {
    icon: UtensilsCrossed,
    label: "Hospitality businesses",
    description: "Managing site leases, compliance certificates and operational obligations across restaurants, pubs and hotels.",
  },
  {
    icon: Briefcase,
    label: "Corporate occupiers",
    description: "Managing office, industrial and mixed-use leases where property is a material operating cost but not the core business.",
  },
];

const palette = [
  { icon: "text-primary", bg: "bg-primary/10", heading: "text-primary" },
  { icon: "text-accent-teal", bg: "bg-accent-teal/10", heading: "text-accent-teal" },
  { icon: "text-accent-amber", bg: "bg-accent-amber/15", heading: "text-accent-amber" },
  { icon: "text-accent-rose", bg: "bg-accent-rose/10", heading: "text-accent-rose" },
];

export const AudienceStrip = () => {
  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {audiences.map((item, i) => {
              const Icon = item.icon;
              const tone = palette[i % palette.length];
              return (
                <div key={i} className="text-center space-y-3">
                  <div className={`w-12 h-12 mx-auto rounded-xl ${tone.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${tone.icon}`} />
                  </div>
                  <h3 className={`text-base font-semibold ${tone.heading}`}>{item.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
