import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";

const documentCategories: { category: string; items: string[] }[] = [
  {
    category: "Agreement",
    items: ["Service Agreement", "Wayleave"],
  },
  {
    category: "Asset Record",
    items: ["O&M Manual", "TR1 Transfer", "Warranty", "White Goods Invoice"],
  },
  {
    category: "Certificate",
    items: [
      "Alarm",
      "Deposit",
      "EICR",
      "Emergency Lighting",
      "EPC",
      "Escalators",
      "Gas",
      "Lifts",
      "Of Incorporation",
      "PAT",
      "Smoke Detectors",
      "Sump Pump",
    ],
  },
  {
    category: "Deed",
    items: [
      "AGA",
      "Covenant",
      "Deposit",
      "Extension",
      "Guarantor",
      "Surrender",
      "Underlease",
      "Variation",
    ],
  },
  {
    category: "Lease",
    items: [
      "Commercial",
      "Head/Superior",
      "Managed Sublease",
      "Residential",
      "Reversionary",
      "Sublease",
      "Supplemental",
    ],
  },
  {
    category: "Licence",
    items: [
      "Alteration",
      "Assignment",
      "Change of Use",
      "HMO",
      "Occupational",
      "Sublet",
    ],
  },
  {
    category: "Memorandum",
    items: ["Rent"],
  },
  {
    category: "Notice",
    items: [
      "Breach",
      "LTA Exclusion 1954",
      "Rent changes",
      "Statutory Warning",
      "Vacate",
    ],
  },
  {
    category: "Report",
    items: ["Fire Doors", "Fire Risk", "Inventory"],
  },
  {
    category: "Side Letter",
    items: [
      "Capital Contribution",
      "Consent to alter",
      "Deposit Return",
      "Lease Change",
    ],
  },
  {
    category: "Sworn",
    items: ["Statutory Dec"],
  },
];

export const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      title: "Add your documents",
      description: "Add any lease, licence, deed, compliance certificate or property document. Hobson reads it thoroughly — understanding the legal meaning, the obligations, and how it relates to every other document in the same property."
    },
    {
      step: 2,
      title: "Ask in plain English",
      description: "Ask anything about your portfolio the way you would ask a colleague. \"Which leases have a break clause in the next 12 months?\" \"What are my EPC obligations on this site?\" No query language. No training required."
    },
    {
      step: 3,
      title: "Get the current legal position",
      description: "Every answer is sourced to the exact clause it came from. If a later document changes the original terms, Hobson knows — and tells you the current position, not the historical one."
    }
  ];

  const totalDocuments = documentCategories.reduce(
    (sum, c) => sum + c.items.length,
    0
  );

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">From document to answer in minutes</h2>
            <p className="text-xl text-muted-foreground">No training. No setup. No integration work required.</p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20"></div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((item, index) => (
                <div key={index} className="relative group text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Hobson is trained on */}
          <div className="mt-20">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Documents Hobson is trained on
              </h3>
              <p className="text-muted-foreground">
                {totalDocuments}+ document types across {documentCategories.length} categories — and growing daily
              </p>
            </div>

            <div className="max-w-3xl mx-auto bg-background rounded-xl border border-border shadow-sm p-2 sm:p-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="all-docs" className="border-none">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <span className="flex items-center gap-2 text-base font-semibold text-foreground">
                      <FileText className="w-5 h-5 text-primary" />
                      Browse all document types
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pb-2">
                    <Accordion type="multiple" className="w-full">
                      {documentCategories.map((cat) => (
                        <AccordionItem
                          key={cat.category}
                          value={cat.category}
                          className="border-b border-border/60 last:border-b-0"
                        >
                          <AccordionTrigger className="px-3 py-2.5 hover:no-underline">
                            <span className="flex items-center justify-between w-full pr-2">
                              <span className="font-medium text-foreground">
                                {cat.category}
                              </span>
                              <span className="text-xs text-muted-foreground ml-3">
                                {cat.items.length} type{cat.items.length === 1 ? "" : "s"}
                              </span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="px-3 pb-3">
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                              {cat.items.map((item) => (
                                <li
                                  key={item}
                                  className="text-sm text-muted-foreground flex items-start gap-2"
                                >
                                  <span className="text-primary mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
