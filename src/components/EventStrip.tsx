import { useState } from "react";
import { Link } from "react-router-dom";
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

  if (!SHOW_EVENT || dismissed) return null;

  return (
    <div
      className="bg-brass/10 border-b border-brass/40"
      role="region"
      aria-label="Exhibition announcement"
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 sm:gap-4 text-center">
        <p className="text-xs sm:text-sm text-brass-text leading-snug min-w-0">
          I shall be at{" "}
          <Link
            to="/web-summit"
            className="font-medium text-brass-text underline decoration-brass/50 underline-offset-2 hover:decoration-brass"
          >
            Web Summit Lisbon 2026
          </Link>
          <span className="hidden sm:inline"> — 9–12 November, MEO Arena — as an ALPHA startup.</span>
          <span className="sm:hidden">, 9–12 November.</span>
        </p>
        <Link
          to="/web-summit"
          className="shrink-0 text-xs sm:text-sm font-medium text-brass-text underline underline-offset-2 hover:opacity-80"
        >
          Where to meet me
        </Link>
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem(STORAGE_KEY, "1");
            setDismissed(true);
          }}
          aria-label="Dismiss announcement"
          className="shrink-0 p-1 rounded-sm text-brass-text/70 hover:text-brass-text"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default EventStrip;
