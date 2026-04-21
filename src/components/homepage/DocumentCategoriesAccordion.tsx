import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";
import owlReading from "@/assets/owl-reading.png";

const documentCategories: { category: string; items: string[] }[] = [
  { category: "Agreement", items: ["Service Agreement", "Wayleave"] },
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
      "Residential (APT)",
      "Residential (Non APT)",
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
  { category: "Memorandum", items: ["Rent"] },
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
  { category: "Report", items: ["Fire Doors", "Fire Risk", "Inventory"] },
  {
    category: "Side Letter",
    items: [
      "Capital Contribution",
      "Consent to alter",
      "Deposit Return",
      "Lease Change",
    ],
  },
  { category: "Sworn", items: ["Statutory Declaration"] },
];

export const DocumentCategoriesAccordion = () => {
  const totalDocuments = documentCategories.reduce(
    (sum, c) => sum + c.items.length,
    0
  );

  return (
    <div className="mt-16 sm:mt-20">
      <div className="text-center mb-6 sm:mb-8">
        <img
          src={owlReading}
          alt="Hobson the owl reading a book"
          className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 object-contain"
          loading="lazy"
        />
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Documents Hobson is trained to read and understand
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
                Browse current document types
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
                      <ul
                        className="grid grid-cols-1 sm:grid-flow-col sm:grid-cols-2 gap-x-4 gap-y-1.5"
                        style={{
                          gridTemplateRows: `repeat(${Math.ceil(cat.items.length / 2)}, minmax(0, auto))`,
                        }}
                      >
                        {cat.items.map((item) => (
                          <li
                            key={item}
                            className="text-sm text-muted-foreground flex items-baseline gap-2"
                          >
                            <span className="text-primary leading-none">•</span>
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
  );
};
