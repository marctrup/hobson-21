import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

const STORAGE_KEY = "hobson-event-strip-dismissed";

/**
 * Slim exhibition announcement strip, shown above the main menu on every
 * page. Set SHOW_EVENT to false once the show has passed — the target
 * removal date is 13 November 2026 (Web Summit ends 12 November).
 */
const SHOW_EVENT = true;

export const EventStrip = () => {
  const [dismissed, setDismissed] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1"
  );
  const location = useLocation();

  if (!SHOW_EVENT || dismissed) return null;

  return (
    <div
      className="relative bg-ink border-y border-brass overflow-hidden"
      role="region"
      aria-label="Exhibition announcement"
    >
      {/* Stationery hairlines, inset from each edge */}
      <div className="absolute inset-y-0 left-2 w-px bg-brass/30 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-y-0 right-2 w-px bg-brass/30 pointer-events-none" aria-hidden="true" />

      <div className="relative container mx-auto px-10 py-3 lg:py-2.5 lg:pr-12">
        {/* On phones: the sentence on its own line, the link beneath it.
            From tablet up: everything on one line again. */}
        <div className="flex flex-col items-center justify-center gap-2.5 text-center lg:flex-row lg:gap-4">
          <p className="text-[13px] sm:text-sm font-serif text-bone-wash leading-snug min-w-0 tracking-wide">
            We shall be at{" "}
            <Link
              to="/web-summit"
              className="italic text-brass underline decoration-brass/40 underline-offset-4 hover:decoration-brass transition-all duration-300"
            >
              Web Summit Lisbon 2026
            </Link>
            <span className="mx-1.5 opacity-50 text-[10px]">—</span>
            <span className="hidden md:inline">9–12 November, MEO Arena</span>
            <span className="md:hidden">9–12 Nov</span>
            <span className="mx-1.5 opacity-50 text-[10px]">—</span>
            <span className="hidden md:inline">as an ALPHA startup.</span>
            <span className="md:hidden">ALPHA.</span>
          </p>
          <Link
            to="/web-summit#questions"
            onClick={(e) => {
              // Already on the page: the router won't re-navigate, so glide
              // to the questions section ourselves.
              if (location.pathname === "/web-summit") {
                e.preventDefault();
                document
                  .querySelector("#questions")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            className="shrink-0 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-brass border-b border-brass/60 pb-0.5 hover:border-brass transition-colors"
          >
            Where to meet me
          </Link>
        </div>

        {/* The cross stands apart on phones (absolutely positioned clear of
            the wrapped text) and joins the row from tablet up. */}
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem(STORAGE_KEY, "1");
            setDismissed(true);
          }}
          aria-label="Dismiss announcement"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-sm text-brass/60 hover:text-brass transition-colors lg:right-4 lg:p-1"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default EventStrip;
