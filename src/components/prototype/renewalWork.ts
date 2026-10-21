/** Session-only preparation and exact-message review; never live tenancy work. */
export const RENEWAL_EMAIL_BODY = `Dear Tenant,

I'm writing regarding the forthcoming end of your tenancy at Stanley House, Flat 6.

We would like to discuss the possibility of renewing the tenancy and would welcome an opportunity to talk through the next steps.

Please let us know a convenient time to discuss.

Kind regards,
Hobson`;
export type RenewalActivity = "terms" | "summary" | "communication";
export type RenewalWork = {
  summaryStarted: boolean;
  communicationStarted: boolean;
  approval: "idle" | "awaiting" | "sent";
  emailBody: string;
  edited: boolean;
  reviewed: boolean;
  history: string[];
};
export const createRenewalWork = (): RenewalWork => ({ summaryStarted: false, communicationStarted: false, approval: "idle", emailBody: RENEWAL_EMAIL_BODY, edited: false, reviewed: true, history: [] });
export function startRenewalActivity(work: RenewalWork, activity: "summary" | "communication", paused: boolean): RenewalWork {
  const key = activity === "summary" ? "summaryStarted" : "communicationStarted";
  if (paused || work[key]) return work;
  return { ...work, [key]: true, history: [...work.history, activity === "summary" ? "Asked me to begin preparing the renewal summary. The later-paper checks remain open." : "Asked me to begin preparing the tenant communication. No contact authorised or made."] };
}