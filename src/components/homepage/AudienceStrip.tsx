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
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30" aria-labelledby="audience-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2
              id="audience-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3"
            >
              Who can Benefit
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Hobson is purpose-built for every organisation where property documents matter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {audiences.map((item, i) => {
              const Icon = item.icon;
              const tone = palette[i % palette.length];
              return (
                <div
                  key={i}
                  className="text-center space-y-4 p-6 rounded-xl bg-background border border-border/50 hover:border-border hover:shadow-md transition-all duration-300"
                >
                  <div className={`w-14 h-14 mx-auto rounded-xl ${tone.bg} flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${tone.icon}`} />
                  </div>
                  <h3 className={`text-lg font-semibold ${tone.heading}`}>{item.label}</h3>
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
