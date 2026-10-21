import type { PaperPlace, PaperPlacementAction, SuppliedPaper } from "./workGuidance";
import { SuppliedPaperDetails } from "./SuppliedPaperDetails";
import { useState } from "react";
import { ArrowLeft, Check, ChevronDown, FileText, Hand, Mail, MessageCircle, Pause, Play, Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeskActionButton } from "./DeskActionButton";
import { JobPapersMap } from "./JobPapersMap";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { createRenewalWork, startRenewalActivity, type RenewalActivity, type RenewalWork } from "./renewalWork";

type Step = "tenancy" | "rent" | "side-letter-check" | "history" | "summary" | "draft" | "approve" | "await";
type Evidence = "rent" | "end" | "variation" | "side-letter";
export type ApprovalStatus = "idle" | "awaiting" | "sent";

const findings = {
  rent: { label: "Original annual rent", value: "£24,000", found: "The original Business Lease records an annual rent of £24,000.", extract: "Annual rent: £24,000, payable in accordance with the terms of this lease." },
  end: { label: "Tenancy end date in the original lease", value: "31 December 2026", found: "The original Business Lease records a tenancy end date of 31 December 2026.", extract: "The tenancy term ends on 31 December 2026." },
};

const EMAIL_TO = "tenant@example.com";
const EMAIL_SUBJECT = "Stanley House, Flat 6 — Tenancy renewal";
/** Illustrative review state only — any edit clears readiness until the revised draft is explicitly reviewed. No keyword or legal assessment of the text. */

function PaperReference({ extract, name = "Business Lease" }: { extract: string; name?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <Button variant="ghost" size="sm" onClick={() => setOpen(!open)} aria-expanded={open} className="h-auto max-w-full justify-start gap-2 whitespace-normal px-0 text-xs text-muted-foreground">
        <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{name} · {open ? "Hide paper" : "View paper"}
      </Button>
      {open && <aside aria-label={`${name} illustrative extract`} className="mt-3 border-l-2 border-border bg-popover px-3 py-3">
        <p className="text-xs font-medium text-muted-foreground">{name} · Illustrative extract</p>
        <blockquote className="mt-2 text-sm leading-relaxed">{extract}</blockquote>
        <p className="mt-2 text-xs text-muted-foreground">Example paper only — not a document from your portfolio.</p>
      </aside>}
    </div>
  );
}

export function WorkJourney({ paused, onPauseChange, onBack, onGuide, sideLetterRequested = false, suppliedPapers = [], paperPlaces = [], onPaperPlacement, approval = "idle", onApprovalChange, approvalOpen = false, work: suppliedWork, onWorkChange }: {
  paused: boolean;
  onPauseChange: (paused: boolean) => void;
  onBack: () => void;
  onGuide: (activity?: RenewalActivity) => void;
  sideLetterRequested?: boolean;
  suppliedPapers?: SuppliedPaper[];
  paperPlaces?: PaperPlace[];
  onPaperPlacement?: (id: string, action: PaperPlacementAction) => void;
  approval?: ApprovalStatus;
  onApprovalChange?: (status: ApprovalStatus) => void;
  approvalOpen?: boolean;
  work?: RenewalWork;
  onWorkChange?: (work: RenewalWork) => void;
}) {
  const [localWork, setLocalWork] = useState(createRenewalWork);
  const work = suppliedWork ?? localWork;
  const updateWork = (next: RenewalWork) => { if (onWorkChange) onWorkChange(next); else setLocalWork(next); };
  const effectiveApproval = suppliedWork ? work.approval : approval;
  const [activity, setActivity] = useState<RenewalActivity | null>(approvalOpen ? "communication" : null);
  const [selected, setSelected] = useState<Step>(approvalOpen ? "approve" : "history");
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [detailOpen, setDetailOpen] = useState(approvalOpen);
  const [editing, setEditing] = useState(false);
  const [draftBody, setDraftBody] = useState(work.emailBody);
  const [notice, setNotice] = useState<string | null>(null);
  const { emailBody, edited, reviewed } = work;
  const sent = effectiveApproval === "sent";
  const journeyExtended = effectiveApproval !== "idle";
  const needsReview = edited && !reviewed;
  const toggleEvidence = (id: Evidence) => setEvidence((active) => active === id ? null : id);
  const changeApproval = (status: ApprovalStatus) => { updateWork({ ...work, communicationStarted: true, approval: status }); onApprovalChange?.(status); };
  const openDemo = () => { if (paused) return; setSelected("approve"); setDetailOpen(true); setEvidence(null); changeApproval(sent ? "sent" : "awaiting"); };
  const returnToInvestigation = () => { setActivity("terms"); setSelected("history"); setDetailOpen(false); setEvidence(null); setEditing(false); };
  const approveAndSend = () => {
    if (sent || paused || needsReview || effectiveApproval !== "awaiting") return;
    updateWork({ ...work, approval: "sent", history: [...work.history, "Approved the exact displayed renewal email.", "Sent the approved renewal email inviting a discussion; no tenancy terms agreed."] });
    onApprovalChange?.("sent"); setEditing(false);
  };
  const saveEdit = () => { updateWork({ ...work, emailBody: draftBody, edited: true, reviewed: false }); setEditing(false); };
  const openActivity = (next: RenewalActivity) => { setActivity(next); setSelected(next === "terms" ? "history" : next === "summary" ? "summary" : "approve"); setDetailOpen(false); setEvidence(null); setEditing(false); setNotice(null); };
  const begin = (next: "summary" | "communication") => {
    const started = startRenewalActivity(work, next, paused);
    if (started === work) return;
    updateWork(started);
    setNotice(next === "summary" ? "I'll begin bringing the tenancy terms together. The later papers still need checking." : "I'll begin preparing the proposed message. Nothing has been approved or sent.");
  };

  const renderFinding = (id: "rent" | "end") => {
    const finding = findings[id];
    const open = evidence === id;
    return <div key={id}>
      <Button variant="ghost" onClick={() => toggleEvidence(id)} aria-expanded={open} aria-controls={`evidence-${id}`} className={`h-auto w-full justify-between gap-3 whitespace-normal rounded-sm px-2 py-2 text-left ${open ? "bg-muted/70" : ""}`}>
        <span><span className="block text-xs font-normal text-muted-foreground">{finding.label}</span><span className="mt-1 block text-sm font-medium">{finding.value}</span></span>
        <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>
      {open && <aside id={`evidence-${id}`} role="region" aria-label={`${finding.label} evidence`} className="my-2 border-l-2 border-border bg-popover px-3 py-3">
        <div className="flex items-center justify-between gap-2"><h6 className="text-xs font-semibold">What I found</h6><Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" aria-label="Close evidence" onClick={() => setEvidence(null)}><X className="h-3.5 w-3.5" /></Button></div>
        <p className="mt-2 text-sm leading-relaxed">{finding.found}</p>
        <p className="mt-3 text-xs font-semibold">Supporting paper</p><p className="mt-1 text-sm">Business Lease</p>
        <p className="mt-3 text-xs font-semibold">Supporting wording · Sample extract</p><blockquote className="mt-2 text-sm leading-relaxed">{finding.extract}</blockquote>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Illustrative wording only — not a quotation from your portfolio papers.</p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">This is what the original lease records. I'm still checking whether later papers changed these terms; the current position is not yet established.</p>
        <PaperReference extract={finding.extract} />
      </aside>}
    </div>;
  };

  const sideLetterFound = suppliedPapers.some((paper) => paper.progress === "effect-found");
  const investigationDesk = <>
    {selected === "history" && <>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{paused ? "I've paused the check of later papers against the original tenancy terms." : "I'm checking whether later papers have changed the original tenancy terms."}</p>
      <article className="mt-5 border-y border-border py-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><h5 className="flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-muted-foreground" />Business Lease</h5><span className="flex items-center gap-1 text-xs text-muted-foreground"><Check className="h-3 w-3" />Reviewed</span></div>
        <div className="mt-3 space-y-2">{renderFinding("rent")}{renderFinding("end")}</div>
        <PaperReference extract="Tenant: Example Tenant Ltd. Annual rent: £24,000. The tenancy term ends on 31 December 2026. These are the original lease terms; the effect of any later agreement has not yet been established." />
      </article>
      <article className="border-b border-border py-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><h5><Button variant="ghost" onClick={() => toggleEvidence("variation")} aria-expanded={evidence === "variation"} aria-controls="evidence-variation" className={`h-auto max-w-full gap-2 whitespace-normal rounded-sm px-2 py-2 text-left text-sm font-semibold ${evidence === "variation" ? "bg-muted/70" : ""}`}><FileText className="h-4 w-4 text-muted-foreground" />Deed of Variation<ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 text-muted-foreground ${evidence === "variation" ? "rotate-180" : ""}`} /></Button></h5><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${paused ? "bg-muted-foreground" : "bg-ring"}`} />{paused ? "Checking paused" : "Checking"}</span></div>
        {evidence === "variation" && <aside id="evidence-variation" role="region" aria-label="Deed of Variation investigation" className="mt-2 border-l-2 border-border bg-popover px-3 py-3">
          <div className="flex items-center justify-between gap-2"><h6 className="text-xs font-semibold">What I'm checking</h6><Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Close evidence" onClick={() => setEvidence(null)}><X className="h-3.5 w-3.5" /></Button></div>
          <p className="mt-2 text-sm leading-relaxed">I'm examining whether this paper changes the original tenancy terms.</p>
          <h6 className="mt-3 text-xs font-semibold">Not yet established</h6><p className="mt-2 text-sm leading-relaxed">I haven't completed this check, so I can't yet confirm whether the terms have changed.</p>
        </aside>}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Examining whether it changes the original tenancy terms.</p>
        <p className="mt-1 text-xs text-muted-foreground">No conclusion reached yet.</p>
        <PaperReference name="Deed of Variation" extract="This illustrative later agreement refers to variations to the Business Lease. Its effect on the rent and tenancy term has not yet been established; no changed terms are confirmed in this preview." />
      </article>
      {sideLetterRequested && suppliedPapers.length === 0 && <article aria-label="Side Letter — 2024" className="border-b border-border py-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><h5><Button variant="ghost" onClick={() => toggleEvidence("side-letter")} aria-expanded={evidence === "side-letter"} aria-controls="side-letter-next-action" className="h-auto gap-2 whitespace-normal px-2 py-2 text-left text-sm font-semibold"><FileText className="h-4 w-4 shrink-0 text-muted-foreground" />Side Letter — 2024<ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 text-muted-foreground ${evidence === "side-letter" ? "rotate-180" : ""}`} /></Button></h5><span className="text-xs text-muted-foreground">Awaiting paper</span></div>
        <p className="mt-3 text-sm text-muted-foreground">You mentioned this paper. I haven't located it yet.</p>
        {evidence === "side-letter" && <aside id="side-letter-next-action" className="mt-3 border-l-2 border-border pl-3 text-sm leading-relaxed">I'll look for the side letter among your papers. If I can't find it, I'll ask you for a copy.</aside>}
      </article>}
      {suppliedPapers.map((paper) => <SuppliedPaperDetails key={paper.id} paper={paper} places={paperPlaces} onPlacement={onPaperPlacement} />)}
      <div className="mt-5 border-l-2 border-ring pl-3"><h5 className="text-xs font-semibold">What I'm trying to establish</h5><p className="mt-2 text-sm leading-relaxed">Have any later papers changed the rent, tenancy end date or other relevant terms?</p></div>
    </>}
    {selected === "side-letter-check" && <>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">I've checked the Side Letter against the original lease. Both papers remain available for you to check.</p>
      {suppliedPapers.filter((paper) => paper.progress === "effect-found").map((paper) => <SuppliedPaperDetails key={paper.id} paper={paper} places={paperPlaces} onPlacement={onPaperPlacement} />)}
    </>}
    {selected === "summary" && sideLetterFound && <>
      <p className="mt-3 text-sm font-medium">Renewal summary — Updating</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The later Side Letter may change the rent information used in the renewal summary.</p>
      <p className="mt-4 text-sm leading-relaxed">I'll take the Side Letter into account, while checking whether any other papers — including the Deed of Variation, still under review — affect that position. The summary stays in progress until they're resolved. Tenant identification, unit details and the end date are unaffected and haven't been revisited.</p>
    </>}
    {selected === "tenancy" && <>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">I found the tenancy agreement and confirmed the parties and end date recorded in it.</p>
      <div className="mt-5 space-y-4 border-y border-border py-5 text-sm"><dl><dt className="text-xs text-muted-foreground">Tenant</dt><dd className="mt-1 font-medium">Example Tenant Ltd</dd></dl>{renderFinding("end")}</div>
      <PaperReference extract="Tenant: Example Tenant Ltd. The tenancy term ends on 31 December 2026." />
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Later papers are still being checked for changes to these terms.</p>
    </>}
    {selected === "rent" && <>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The lease records this annual rent.</p>
      <div className="mt-5 border-y border-border py-5">{renderFinding("rent")}</div>
      <PaperReference extract="Annual rent: £24,000, payable in accordance with the terms of this lease." />
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">This is the original lease figure, not a confirmed current rent. Later agreements are still being checked.</p>
      {suppliedPapers.map((paper) => <SuppliedPaperDetails key={paper.id} paper={paper} places={paperPlaces} onPlacement={onPaperPlacement} />)}
    </>}
    {selected === "summary" && !sideLetterFound && <>
      <p className="mt-3 text-xs font-medium text-muted-foreground">Not started</p>
      <p className="mt-5 text-sm leading-relaxed">I shall bring together the current terms and any changes I've found, ready for your review.</p>
      <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">{sideLetterRequested ? "The later papers, including the 2024 side letter, need checking before I prepare the renewal summary." : "The later papers need checking before I prepare the renewal summary."}</p>
      {suppliedPapers.length > 0 && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Waiting for an additional check: whether the Side Letter you supplied changes the rent.</p>}
    </>}
  </>;

  const approvalDesk = <>
    {selected === "draft" && <>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">I've drafted a short email to the tenant inviting a conversation about renewing the tenancy. Nothing has been sent.</p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">The draft is waiting under <span className="font-medium text-foreground">Approve sending the renewal email</span> for your decision.</p>
    </>}
    {selected === "await" && <>
      <p className="mt-3 text-xs font-medium text-muted-foreground">{sent ? "Waiting" : "Not started"}</p>
      <p className="mt-5 text-sm leading-relaxed">{sent ? "I'm waiting for the tenant's response and will bring it to you when it arrives." : "Once the email has gone, I'll wait for the tenant's response and bring it to you when it arrives."}</p>
    </>}
    {selected === "approve" && <>
      {sent ? <>
        <p role="status" className="mt-3 flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-muted-foreground" aria-hidden="true" />Email sent.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">I've sent the email inviting the tenant to discuss the renewal. No tenancy terms have been agreed.</p>
        <div className="mt-5 border-l-2 border-ring pl-3"><h5 className="text-xs font-semibold">What happens next</h5><p className="mt-2 text-sm leading-relaxed">I'll wait for the tenant's response and bring it to you when it arrives.</p></div>
      </> : <>
        <h5 className="mt-2 text-base font-semibold">May I send this email?</h5>
        <div className="mt-4 border-l-2 border-border pl-3">
          <h6 className="text-xs font-semibold">Why I'm asking</h6>
          <p className="mt-2 text-sm leading-relaxed">I've prepared an email inviting the tenant to discuss a possible renewal. It doesn't propose new rent or tenancy terms, so the remaining document checks don't prevent me from asking for a discussion.</p>
        </div>
        <div className="mt-4 border-l-2 border-border pl-3">
          <h6 className="text-xs font-semibold">Before I send</h6>
          {needsReview ? <>
            <p className="mt-2 text-sm font-medium">Needs another check</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">This version goes beyond inviting a discussion — it asks for something that depends on checks I haven't finished. I need to review the revised wording before I can present it as ready.</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => updateWork({ ...work, reviewed: true })}>Ask me to review this version</Button>
          </> : <>
            <p className="mt-2 text-sm font-medium">Ready for your approval</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">This email invites the tenant to discuss a possible renewal. It does not propose rent, tenancy terms or financial commitments.</p>
          </>}
          <p className="mt-3 text-sm font-medium">Still to establish</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{sideLetterFound ? "The Side Letter records a later rent of £27,000. This email proposes no rent figures, so it isn't affected; I haven't finished checking the Deed of Variation." : suppliedPapers.length ? "I haven't finished checking the Deed of Variation or examining the supplied 2024 Side Letter." : "I haven't finished checking the Deed of Variation or located the 2024 Side Letter."} These checks remain part of the ongoing investigation.</p>
        </div>
        <article aria-label="Draft email preview" className="mt-5 rounded-md border border-border bg-popover px-4 py-4">
          <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><Mail className="h-3.5 w-3.5" aria-hidden="true" />Draft email · not yet sent</p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex gap-2"><dt className="w-16 shrink-0 text-xs text-muted-foreground">To</dt><dd className="min-w-0 break-words font-medium">{EMAIL_TO}</dd></div>
            <div className="flex gap-2"><dt className="w-16 shrink-0 text-xs text-muted-foreground">Subject</dt><dd className="min-w-0 break-words font-medium">{EMAIL_SUBJECT}</dd></div>
          </dl>
          {editing ? <div className="mt-4">
            <label htmlFor="email-draft-edit" className="text-xs font-medium text-muted-foreground">Edit the email</label>
            <textarea id="email-draft-edit" value={draftBody} onChange={(event) => setDraftBody(event.target.value)} rows={10} className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed" />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={saveEdit}>Keep this version</Button>
              <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setDraftBody(emailBody); }}>Discard changes</Button>
            </div>
          </div> : <blockquote className="mt-4 whitespace-pre-line border-t border-border pt-4 text-sm leading-relaxed">{emailBody}</blockquote>}
          <p className="mt-4 border-t border-border pt-3 text-sm"><span className="min-w-0 break-words font-medium">Attachments:</span> None</p>
        </article>
        {edited && !editing && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">You've changed this draft. Approval applies to the latest version shown above.</p>}
        {!editing && <div className="mt-5 border-l-2 border-border pl-3">
          <h6 className="text-xs font-semibold">What approving this allows</h6>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed">
            <li>Send this exact email to the displayed recipient.</li>
            <li>Include only the displayed attachments.</li>
            <li>No authority to agree tenancy terms or financial commitments.</li>
            <li>No authority to send additional emails under this approval.</li>
          </ul>
        </div>}
      </>}
    </>}
  </>;

  const summaryActive = work.summaryStarted || sideLetterFound;
  const communicationActive = work.communicationStarted || effectiveApproval !== "idle";
  const unstarted = activity === "summary" ? !summaryActive : activity === "communication" ? !communicationActive : false;
  const titles: Record<RenewalActivity, string> = { terms: "Establish the current tenancy terms", summary: "Prepare the renewal summary", communication: "Prepare the tenant communication" };
  const intents: Record<RenewalActivity, string> = {
    terms: "Checking the Deed of Variation and later papers to establish whether the original terms have changed.",
    summary: "I'll bring together the established tenancy terms and identify anything that still needs checking before preparing the renewal summary.",
    communication: "I'll prepare the proposed message for your review. Nothing will be sent without your approval.",
  };
  const positions: Record<RenewalActivity, string> = {
    terms: paused ? "Checking paused" : "I'm working on this now",
    summary: summaryActive ? paused ? "Work paused" : "In progress — later-paper checks remain open" : "Not yet started",
    communication: sent ? "Email sent — awaiting a response" : effectiveApproval === "awaiting" ? "Needs your approval" : communicationActive ? paused ? "Work paused" : "Preparing — nothing sent" : "Not yet started",
  };
  const termsSteps: { id: Step; title: string; position: string }[] = [
    { id: "tenancy", title: "Review the original Business Lease", position: "Completed" },
    { id: "history", title: "Check the Deed of Variation", position: paused ? "Review paused" : "Reviewing — no conclusion reached" },
    { id: "side-letter-check", title: "Check the 2024 Side Letter", position: sideLetterFound ? "Effect checked — other later papers remain under review" : suppliedPapers.length ? "Checking its relationship and effect" : sideLetterRequested ? "Awaiting paper" : "Not yet checked" },
  ];
  const communicationSteps = [
    { id: "draft" as Step, title: "Prepare the proposed email", position: journeyExtended ? "Prepared" : "In progress" },
    { id: "approve" as Step, title: "Approve sending the renewal email", position: sent ? "Approved the displayed email" : journeyExtended ? "Needs your approval" : "Not yet started" },
    { id: "await" as Step, title: "Send the approved email and await a response", position: sent ? "Email sent — waiting for the tenant" : "Not yet started" },
  ];
  const showActionBar = activity === "communication" && detailOpen && selected === "approve" && effectiveApproval === "awaiting" && !editing;
  const showDetail = (step: Step) => { setSelected(step === "side-letter-check" && !sideLetterFound ? "history" : step); setDetailOpen(true); setEvidence(null); };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden" role="region" aria-label="Tenancy renewal work journey">
      <header className="shrink-0 border-b border-border px-5 pb-4 pt-4 [@container_work_(min-width:40rem)]:px-6">
        <Button variant="ghost" size="sm" onClick={activity ? () => { setActivity(null); setDetailOpen(false); setEvidence(null); setNotice(null); } : onBack} className="mb-4 gap-2 px-0 text-muted-foreground"><ArrowLeft className="h-4 w-4" />{activity ? "Back to tenancy renewal" : "Back to What I'm Up To"}</Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 basis-64">
            <p className="mb-2 text-xs text-muted-foreground">Stanley House · Flat 6</p>
            <h2 className="text-2xl font-semibold leading-tight">{activity ? titles[activity] : "Getting the tenancy renewal ready"}</h2>
            {activity && <p role="status" className="mt-3 text-sm text-muted-foreground">{positions[activity]}</p>}
            {!activity && paused && <p role="status" className="mt-3 text-sm text-muted-foreground">Work paused · What I've found is preserved</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <JobPapersMap job="renewal" sideLetterRequested={sideLetterRequested} suppliedPapers={suppliedPapers} />
            <Button variant="secondary" size="sm" onClick={() => onGuide(activity ?? undefined)} className="gap-2"><MessageCircle className="h-4 w-4" />Guide Hobson</Button>
            <DropdownMenu.Root modal={false}><DropdownMenu.Trigger asChild><Button variant="ghost" size="icon" aria-label="More work options" title="More work options" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenu.Trigger><DropdownMenu.Portal><DropdownMenu.Content align="end" className="z-[1500] min-w-36 rounded-md border border-border bg-popover p-1 shadow-md"><DropdownMenu.Item asChild onSelect={() => onPauseChange(!paused)}><Button variant="ghost" size="sm" className="w-full justify-start gap-2">{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{paused ? "Resume work" : "Pause work"}</Button></DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root>
          </div>
        </div>
      </header>
      <div className="hobson-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-5 py-7 [@container_work_(min-width:40rem)]:px-8">
          {!activity ? <>
            <section><h3 className="text-sm font-semibold">The plan</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Establish the current tenancy position, check whether later papers affect the original terms, and prepare a renewal summary for your review.</p></section>
            <section className="mt-7 border-t border-border pt-5"><h3 className="text-sm font-semibold">What's been done</h3><ul className="mt-3 space-y-2 text-sm leading-relaxed">
              <li>Found and reviewed the original Business Lease.</li><li>Recorded the original annual rent of £24,000.</li><li>Recorded the tenancy end date in the original lease as 31 December 2026.</li>
              {sideLetterFound && <li>The Side Letter records a later annual rent of £27,000 from 1 October 2024; other later papers still need checking.</li>}
              {journeyExtended && <li>Prepared an email inviting the tenant to discuss the renewal.</li>}
              {work.history.map((entry, index) => <li key={index}>{entry}</li>)}
            </ul><p className="mt-3 text-xs leading-relaxed text-muted-foreground">These are findings from the original paper, not a confirmed current tenancy position.</p></section>
            <section className="mt-7 border-t border-border pt-5"><h3 className="text-sm font-semibold">What's left</h3><div className="mt-3 divide-y divide-border">{(["terms", "summary", "communication"] as const).map(id => <Button key={id} variant="ghost" onClick={() => openActivity(id)} className="h-auto w-full justify-start whitespace-normal rounded-none px-0 py-4 text-left"><span className="block min-w-0"><span className="block text-sm font-semibold">{titles[id]}</span><span className="mt-1 block text-xs font-normal text-muted-foreground">{positions[id]}</span><span className="mt-2 block text-sm font-normal leading-relaxed text-muted-foreground">{id === "terms" ? intents.terms : id === "summary" ? "Bring together the established terms and any matters requiring your review." : "Prepare the proposed communication for your approval before anything is sent."}</span></span></Button>)}</div></section>
          </> : <>
            <section><h3 className="text-sm font-semibold">What I'm planning</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{intents[activity]}</p></section>
            {unstarted ? <Button className="mt-5" disabled={paused} onClick={() => { if (activity !== "terms") begin(activity); }}>Start this work</Button> : <>
              {notice && <p role="status" className="mt-4 text-sm leading-relaxed">{notice}</p>}
              <section aria-label="Subtask journey" className="mt-6 border-t border-border pt-5"><h3 className="text-sm font-semibold">The journey</h3>
                {activity === "summary" ? <ol className="mt-4 space-y-4 text-sm"><li><p className="font-medium">Bring together the recorded tenancy terms</p><p className="mt-1 text-xs text-muted-foreground">In progress — original findings retained{sideLetterFound ? "; later Side Letter position noted" : ""}.</p></li><li><p className="font-medium">Resolve the later-paper checks</p><p className="mt-1 text-xs text-muted-foreground">Still required — the Deed of Variation remains under review.</p></li><li><p className="font-medium">Prepare the renewal summary for review</p><p className="mt-1 text-xs text-muted-foreground">Not yet prepared.</p></li></ol> : <ol className="mt-4 divide-y divide-border">{(activity === "terms" ? termsSteps : communicationSteps).map(step => <li key={step.id} className="py-3"><p className="text-sm font-medium">{step.title}</p><p className="mt-1 text-xs text-muted-foreground">{step.position}</p>{(activity === "terms" || journeyExtended) && <Button variant="link" size="sm" onClick={() => showDetail(step.id)} className="mt-2 h-auto whitespace-normal p-0 text-left">{step.id === "approve" ? "Review decision" : "View supporting detail"}</Button>}</li>)}</ol>}
              </section>
              {activity === "communication" && <div className="mt-5 flex flex-wrap gap-2"><DeskActionButton demo icon={<Mail className="h-3.5 w-3.5" />} label="Preview approval stage" tooltip="See the existing exact-email approval demonstration." onClick={openDemo} />{journeyExtended && <DeskActionButton icon={<Undo2 className="h-3.5 w-3.5" />} label="Return to the investigation" tooltip="Return to the tenancy checks without changing the email." onClick={returnToInvestigation} />}</div>}
              {detailOpen && activity !== "summary" && <section aria-label="Supporting detail" className="mt-5 border-t border-border pt-5"><Button variant="ghost" size="sm" className="mb-3 px-0" onClick={() => { setDetailOpen(false); setEvidence(null); }}>Hide supporting detail</Button>{activity === "terms" ? <>
                <div className="mb-4 flex flex-wrap gap-2"><Button variant="outline" size="sm" aria-current={selected === "tenancy" ? "step" : undefined} onClick={() => showDetail("tenancy")}>Read the existing tenancy</Button><Button variant="outline" size="sm" aria-current={selected === "rent" ? "step" : undefined} onClick={() => showDetail("rent")}>Reviewed the rent</Button><Button variant="outline" size="sm" aria-current={selected === "history" ? "step" : undefined} onClick={() => showDetail("history")}>Checking the tenancy history</Button>{sideLetterFound && <Button variant="outline" size="sm" onClick={() => showDetail("side-letter-check")}>Checking the Side Letter</Button>}</div>
                {investigationDesk}
              </> : approvalDesk}
              {showActionBar && <div className="sticky bottom-0 mt-6 border-t border-border bg-background py-4"><div className="flex flex-wrap gap-2"><Button size="sm" onClick={approveAndSend} disabled={paused || needsReview}>Approve and send</Button><Button size="sm" variant="outline" onClick={() => { setDraftBody(emailBody); setEditing(true); }}>Change before sending</Button><Button size="sm" variant="ghost" onClick={returnToInvestigation}>Not now</Button></div><p className="mt-2 text-xs text-muted-foreground">{needsReview ? "Approval is unavailable until I've reviewed the revised draft." : "Not now leaves the email unsent and waiting for your decision."}</p></div>}
              </section>}
            </>}
          </>}
        </div>
        <footer className="border-t border-border px-5 py-4"><p className="text-xs text-muted-foreground">Illustrative work and paper extracts only — no live work is running.</p></footer>
      </div>
    </div>
  );
}
