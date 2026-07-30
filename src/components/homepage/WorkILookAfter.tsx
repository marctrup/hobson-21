import React from "react";
import {
  Calendar,
  DoorOpen,
  FileClock,
  Leaf,
  ShieldCheck,
  Receipt,
  Home,
  MessageSquare,
  BellRing,
  ClipboardCheck,
  Hammer,
  FileSignature,
  Sparkles,
} from "lucide-react";

type Responsibility = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
  iconColor: string;
};

const RESPONSIBILITIES: Responsibility[] = [
  { label: "Rent Reviews", icon: FileClock, tint: "bg-paper", iconColor: "text-charcoal" },
  { label: "Break Clauses", icon: DoorOpen, tint: "bg-success-bg", iconColor: "text-success" },
  { label: "Lease Expiry Monitoring", icon: Calendar, tint: "bg-warning-bg", iconColor: "text-warning" },
  { label: "EPC Compliance", icon: Leaf, tint: "bg-success-bg", iconColor: "text-success" },
  { label: "Insurance Renewals", icon: ShieldCheck, tint: "bg-danger-bg", iconColor: "text-danger" },
  { label: "Service Charge Monitoring", icon: Receipt, tint: "bg-paper", iconColor: "text-charcoal" },
  { label: "Vacant Unit Monitoring", icon: Home, tint: "bg-paper", iconColor: "text-charcoal" },
  { label: "Tenant Communications", icon: MessageSquare, tint: "bg-warning-bg", iconColor: "text-warning" },
  { label: "Key Date Monitoring", icon: BellRing, tint: "bg-paper", iconColor: "text-charcoal" },
  { label: "Compliance Monitoring", icon: ClipboardCheck, tint: "bg-paper", iconColor: "text-charcoal" },
  { label: "Dilapidations", icon: Hammer, tint: "bg-paper", iconColor: "text-charcoal" },
  { label: "Licence Renewals", icon: FileSignature, tint: "bg-paper", iconColor: "text-charcoal" },
];

export const WorkILookAfter = () => {
  return (
    <section
      className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden"
      aria-labelledby="work-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-4">
              The work I look after
            </span>
            <h2
              id="work-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight"
            >
              Real work.{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Quietly taken care of.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              A responsibility is an area of your property work I continuously manage on your behalf. Here are some of the areas I can help with.
            </p>
          </div>

          {/* Responsibilities grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {RESPONSIBILITIES.map(({ label, icon: Icon, tint, iconColor }) => (
              <div
                key={label}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background p-4 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className={`shrink-0 w-10 h-10 rounded-lg ${tint} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <span className="text-sm font-medium text-foreground leading-tight">{label}</span>
              </div>
            ))}
            <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] p-4 text-sm font-medium text-muted-foreground col-span-2 sm:col-span-3 lg:col-span-4">
              <Sparkles className="w-4 h-4 text-primary" />
              …and many more. Tell me what your business needs.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
