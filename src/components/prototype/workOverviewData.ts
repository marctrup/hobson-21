import { roofLeakWork } from "./roofLeakWork";
export type ActivityState = "working" | "waiting" | "needs-you" | "on-hold" | "needs-clarification";
export type Activity = { label: string; state: ActivityState };

export const decisions = [
  {
    place: "Stanley House · Flat 8",
    title: "Rent review",
    decision: "Would you like me to use these comparables to prepare the proposed rent?",
    why: "I've reviewed the lease and comparable rents. I'd like you to check the proposed next step.",
  },
  {
    place: "5 Nugent Terrace · Shop",
    title: "An assessor for the new EPC",
    decision: "Please confirm the assessor and the instruction before anything is sent.",
    why: "I've checked the existing certificate and prepared an instruction for your usual assessor.",
  },
];

export type LookingAfterWork = { place: string; title: string; aim: string; summary: string; activities: Activity[] };

export const lookingAfter: LookingAfterWork[] = [
  {
    place: roofLeakWork.place,
    title: roofLeakWork.title,
    aim: roofLeakWork.aim,
    summary: "Checking repairing responsibility and waiting for the contractor.",
    activities: roofLeakWork.activities.map(({ label, state }) => ({ label, state })),
  },
  {
    place: "Stanley House · Flat 6",
    title: "Getting the tenancy renewal ready",
    aim: "Confirm the current tenancy position and prepare a renewal summary for your review.",
    summary: "Checking the rent and tenancy history.",
    activities: [
      { label: "Tenancy end date confirmed and renewal terms read", state: "waiting" },
      { label: "Checking the rent and tenancy history", state: "working" },
    ],
  },
  {
    place: "Stanley House · Flat 8",
    title: "Reviewing the rent",
    aim: "Compare the lease terms with comparable rents and bring you a proposed figure.",
    summary: "Comparing the lease terms with comparable rents.",
    activities: [
      { label: "Lease terms and review date read", state: "waiting" },
      { label: "Comparing the lease terms with comparable rents", state: "working" },
    ],
  },
  {
    place: "5 Nugent Terrace · Shop",
    title: "Arranging the new EPC",
    aim: "Prepare the assessor instruction so the new certificate is in place in good time.",
    summary: "Preparing the assessor instruction.",
    activities: [
      { label: "Existing certificate checked", state: "waiting" },
      { label: "Preparing the instruction for your usual assessor", state: "working" },
    ],
  },
  {
    place: "Across your portfolio",
    title: "Putting the compliance papers in order",
    aim: "Match every certificate to its unit and bring you a short list of gaps.",
    summary: "Checking which certificates are missing or out of date.",
    activities: [
      { label: "Gas safety certificates matched to their units", state: "waiting" },
      { label: "Checking which certificates are missing or out of date", state: "working" },
    ],
  },
  {
    place: "5 Nugent Terrace · Flats 1–3",
    title: "Making sense of the service charges",
    aim: "Set out any differences between the leases and the latest schedule, with the clauses beside them.",
    summary: "Comparing the leases with the latest service charge schedule.",
    activities: [
      { label: "Apportionment terms read in all three leases", state: "waiting" },
      { label: "Comparing the stated shares with the latest schedule", state: "working" },
    ],
  },
  {
    place: "Stanley House · Communal areas",
    title: "Preparing the maintenance instruction",
    aim: "Bring you the draft instruction before anything goes to the contractor.",
    summary: "Checking the proposed work against outstanding repairs.",
    activities: [
      { label: "Reported repairs and the contractor's quotation gathered", state: "waiting" },
      { label: "Checking the proposed work against the outstanding repairs", state: "working" },
    ],
  },
];

export const accomplished = [
  {
    place: "Stanley House · Flat 3",
    title: "The lease, made clear",
    outcome: "I've prepared a cited summary of the rent, key dates and obligations. The answers are now together in one place.",
    when: "Today, 09:15",
  },
  {
    place: "Across your portfolio",
    title: "Your key dates are together",
    outcome: "I've brought together the relevant review, break and expiry dates from your read papers, so you can see what is coming up.",
    when: "Yesterday, 16:40",
  },
  {
    place: "5 Nugent Terrace · Flat 2",
    title: "The deposit record is matched",
    outcome: "I've linked the protection certificate to the tenancy and noted the reference. You no longer need to search for it separately.",
    when: "Yesterday, 11:20",
  },
];
