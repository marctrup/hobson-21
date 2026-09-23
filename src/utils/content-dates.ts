/**
 * Freshness signals. Search engines and AI answer engines prefer content
 * they can date. Update the entry for a page whenever its copy changes.
 * Dates are ISO (YYYY-MM-DD).
 */
export const CONTENT_UPDATED: Record<string, string> = {
  "/": "2026-09-23",
  "/pricing": "2026-09-23",
  "/lease-management-software": "2026-09-23",
  "/property-management-software": "2026-09-23",
  "/property-portfolio-software": "2026-09-23",
  "/ai-lease-abstraction": "2026-09-23",
  "/learn/faq": "2026-09-23",
  "/learn/glossary": "2026-09-23",
};

export const DEFAULT_UPDATED = "2026-09-23";

export const getUpdatedDate = (path: string) =>
  CONTENT_UPDATED[path] ?? DEFAULT_UPDATED;

/** "23 September 2026" — UK English long form. */
export const formatUpdatedDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
