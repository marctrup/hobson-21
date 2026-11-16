import { Building2, KeyRound } from "lucide-react";

const groups = [
  {
    icon: Building2,
    label: "Owners and Managers of a property business",
    examples: [
      "Asset managers",
      "Institutional owners",
      "Managing agents",
      "Funds and REITs",
      "Individual owners",
      "SMEs",
    ],
  },
  {
    icon: KeyRound,
    label: "Commercial Occupiers",
    examples: [
      "Retail chains",
      "Hospitality groups",
      "Corporate offices",
      "Healthcare and education",
      "Logistics and distribution",
      "Charities",
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
                  className="rounded-xl bg-wash border border-border/50 p-6 sm:p-8 flex flex-col hover:border-border hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                    {group.label}
                  </h3>

                  <div className="mt-6 pt-5 border-t border-border/60">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint whitespace-nowrap">
                        For example
                      </span>
                      <span aria-hidden="true" className="h-px flex-1 bg-border/70" />
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                      {group.examples.map((example) => (
                        <li
                          key={example}
                          className="flex items-center gap-2.5 text-sm text-foreground leading-snug"
                        >
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50"
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
            If your organisation has a filing cabinet of property-related papers, you belong in one
            of these two groups.
          </p>
        </div>
      </div>
    </section>
  );
};
