/** One illustrative source for the completed Flat 3 summary and its cited extracts. */
export const completedLease = {
  place: "Stanley House · Flat 3",
  title: "The lease, made clear",
  explanation: "I've brought together the rent, key dates and obligations from the lease, with references to the supporting paper.",
  findings: [
    { label: "Tenant", value: "Alex Morgan (illustrative tenant)", reference: "Parties" },
    { label: "Rent", value: "£18,000 per year, payable monthly at £1,500", reference: "Rent wording" },
    { label: "Term start", value: "1 January 2025", reference: "Term wording" },
    { label: "Term end", value: "31 December 2026", reference: "Term wording" },
    { label: "Relevant obligations", value: "Keep the interior in good condition, report repairs promptly and obtain written consent before alterations.", reference: "Obligations wording" },
  ],
  activities: [
    { id: "review", title: "Reviewed the lease", note: "I examined the named parties, premises, rent, term and tenant obligations in the sample Business Lease." },
    { id: "dates", title: "Identified the rent and key dates", note: "I brought the recorded rent and term dates together, with the relevant wording beside them." },
    { id: "summary", title: "Prepared the cited summary", note: "The requested lease summary is ready, with references to the supporting paper." },
  ],
} as const;

export type CompletedLeaseActivity = (typeof completedLease.activities)[number]["id"];
export const completedLeasePaper = `Illustrative Business Lease — ${completedLease.place}\n${completedLease.findings.map(item => `${item.reference}: ${item.value}`).join("\n")}`;