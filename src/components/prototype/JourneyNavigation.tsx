import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

/** A compact journey chooser on phones; the full connected panel on desktop. */
export function JourneyNavigation({ children, label = "The Journey", selectedTitle }: { children: ReactNode; label?: string; selectedTitle?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <nav aria-label={label} className="min-w-0 rounded-2xl bg-muted px-4 py-3 lg:rounded-r-none lg:py-5">
    <h3 className="mb-5 hidden text-xs font-semibold text-muted-foreground lg:block">The Journey</h3>
    <Button variant="ghost" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id} className="h-auto min-h-11 w-full justify-between gap-3 whitespace-normal px-0 text-left lg:hidden">
      <span className="min-w-0"><span className="block text-xs font-semibold text-muted-foreground">The Journey</span><span className="mt-1 block text-sm leading-snug">{selectedTitle}</span></span>
      <ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
    </Button>
    <div id={id} className={`${open ? "mt-3 block" : "hidden"} lg:mt-0 lg:block`} onClick={(event) => { if ((event.target as HTMLElement).closest('button[aria-current], button:not([aria-expanded])')) setOpen(false); }}>{children}</div>
  </nav>;
}