import { Building2, KeyRound } from "lucide-react";

const groups = [
  {
    icon: Building2,
    label: "You own and manage property",
    framing:
      "Property is the business. I keep the papers, the dates and the obligations in order across the portfolio.",
    examples: [
      "Asset managers and institutional owners",
      "Landlords and freeholders",
      "Managing agents",
      "Residential portfolios",
      "Funds and REITs",
    ],
  },
  {
    icon: KeyRound,
    label: "You occupy property",
    framing:
      "Property is a cost centre and a management complexity. I keep leases, rent reviews, break clauses and compliance obligations off your desk.",
    examples: [
      "Retail chains",
      "Hospitality groups",
      "Corporate offices",
      "Healthcare and education",
      "Logistics and distribution",
    ],
  },
];

export const AudienceStrip = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background" aria-labelledby="audience-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2
              id="audience-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-3"
            >
              Who I work for
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Every organisation I work for falls into one of two groups.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {groups.map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.label}
                  className="rounded-xl bg-wash border border-border/50 p-6 sm:p-8 space-y-5 hover:border-border hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                        {group.label}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {group.framing}
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint mb-3">
                      For example
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {group.examples.map((example) => (
                        <li
                          key={example}
                          className="flex items-baseline gap-2 text-sm text-foreground leading-snug"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
                          />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm sm:text-base text-muted-foreground mt-8 sm:mt-10 max-w-2xl mx-auto">
            If your organisation holds a lease, a licence or a filing cabinet of papers, you belong
            in one of these two groups.
          </p>
        </div>
      </div>
    </section>
  );
};
