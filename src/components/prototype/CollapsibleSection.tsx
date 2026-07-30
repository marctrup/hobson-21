import React, { useId, useState } from "react";

/**
 * Shared Admin collapse pattern. Used for every piece of built/created content
 * across agents (Broker contact groups, Magician workflow cards, Inspector
 * groups, etc.). Collapsed by default; chevron rotates; keyboard accessible.
 */
export interface CollapsibleSectionProps {
  /** Rendered inside the header — the summary line shown when collapsed. */
  summary: React.ReactNode;
  /** Content shown only when expanded. */
  children: React.ReactNode;
  /** Default open state. Defaults to false (collapsed). */
  defaultOpen?: boolean;
  /** Outer wrapper className. */
  className?: string;
  /** Header button className override. */
  headerClassName?: string;
  /** Expanded content className. */
  contentClassName?: string;
  /** Accessible label for the toggle. */
  ariaLabel?: string;
}

export function CollapsibleSection({
  summary,
  children,
  defaultOpen = false,
  className,
  headerClassName,
  contentClassName,
  ariaLabel,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <section className={className ?? "rounded-xl border border-bone bg-white"}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className={
          headerClassName ??
          "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-[#56514A] rounded-xl"
        }
      >
        <svg
          className={`w-4 h-4 text-[#56514A] shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
        <div className="min-w-0 flex-1">{summary}</div>
      </button>
      {open && (
        <div id={panelId} className={contentClassName ?? "px-4 pb-4 pt-1 border-t border-faint-rule"}>
          {children}
        </div>
      )}
    </section>
  );
}

export default CollapsibleSection;
