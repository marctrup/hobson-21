/** Fixed illustrative outcome, separate from every live demonstration attempt. */
export const roofCompletion = {
  outcome: "The roof repairs are complete",
  explanation: "The contractor has confirmed that the reported leak has been repaired.",
  summary: "The roof repairs have been completed, and I've received confirmation from the contractor. I've brought together the relevant papers and correspondence so you have a record of what happened.",
  outstanding: "The contractor has confirmed completion. I haven't independently verified the repairs.",
  next: "No further action is currently scheduled for this repair. The records will remain available if you need them.",
  accomplishments: [
    "Reviewed the reported leak and relevant papers.",
    "Arranged the contractor inspection.",
    "Brought together the findings needed for the repair decision.",
    "Recorded the authorised repair instruction.",
    "Received and recorded the contractor's completion confirmation.",
  ],
  records: [
    { id: "report", title: "Contractor repair completion report", text: "Example Contractor Ltd records that the reported roof leak has been repaired. This is the contractor's account of completion, not an independent verification." },
    { id: "email", title: "Confirmation email", text: "From: contractor@example.com. Subject: Burlington Gardens — Roof repair complete. We confirm that the reported leak has been repaired. The completion report is enclosed." },
    { id: "inspection", title: "Relevant inspection record", text: "Example Contractor Ltd inspected the area of the reported leak and recorded findings for the repair decision. This illustrative record does not establish legal repairing responsibility or independently verify the subsequent repair." },
    { id: "papers", title: "Relevant papers review", text: "The tenant's report and relevant Business Lease were reviewed and brought together with the inspection findings. No legal conclusion on repairing responsibility is represented by this sample record." },
    { id: "instruction", title: "Authorised repair instruction record", text: "In this separate completion example, the user authorised the specific repair instruction before it was issued to Example Contractor Ltd. This illustrative authority does not apply to the original investigation, insurer notification or any future action." },
  ],
  activities: [
    { id: "papers", title: "Reviewed the leak and relevant papers", outcome: "I brought the tenant's report and relevant papers together for the repair decision.", records: ["papers"] },
    { id: "inspection", title: "Arranged the contractor inspection", outcome: "The contractor inspected the reported leak. I received and recorded the inspection findings.", records: ["inspection"] },
    { id: "instruction", title: "Recorded the authorised repair instruction", outcome: "I recorded the user's authority for the repair instruction in this example. The contractor, not Hobson, carried out the repairs.", records: ["instruction", "inspection"] },
    { id: "confirmation", title: "Recorded the completion confirmation", outcome: "The contractor confirmed that the reported leak has been repaired. I received and recorded that confirmation; I have not independently verified the repairs.", records: ["report", "email"] },
  ],
};