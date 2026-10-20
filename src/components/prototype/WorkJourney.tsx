import type { PaperPlace, PaperPlacementAction, SuppliedPaper } from "./workGuidance";
import { SuppliedPaperDetails } from "./SuppliedPaperDetails";
import { JourneyNavigation } from "./JourneyNavigation";
import { useState } from "react";
import { ArrowLeft, Check, ChevronDown, FileText, Hand, Mail, MessageCircle, Pause, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobPapersMap } from "./JobPapersMap";
import owlReading from "@/assets/prototype/owl-reading.png";

type Step = "tenancy" | "rent" | "history" | "summary" | "draft" | "approve" | "await";
type Evidence = "rent" | "end" | "variation" | "side-letter";
export type ApprovalStatus = "idle" | "awaiting" | "sent";

const findings = {
  rent: { label: "Original annual rent", value: "£24,000", found: "The original Business Lease records an annual rent of £24,000.", extract: "Annual rent: £24,000, payable in accordance with the terms of this lease." },
  end: { label: "Tenancy end date in the original lease", value: "31 December 2026", found: "The original Business Lease records a tenancy end date of 31 December 2026.", extract: "The tenancy term ends on 31 December 2026." },
};

const EMAIL_TO = "tenant@example.com";
const EMAIL_SUBJECT = "Stanley House, Flat 6 — Tenancy renewal";
const EMAIL_BODY = `Dear Tenant,

I'm writing regarding the forthcoming end of your tenancy at Stanley House, Flat 6.

We would like to discuss the possibility of renewing the tenancy and would welcome an opportunity to talk through the next steps.

Please let us know a convenient time to discuss.

Kind regards,
Hobson`;

/** Illustrative review state only — any edit clears readiness until the revised draft is explicitly reviewed. No keyword or legal assessment of the text. */

type StepDef = { id: Step; title: string; note: string; group?: string };

const baseSteps: StepDef[] = [
  { id: "tenancy", title: "Read the existing tenancy", note: "Confirmed the parties and end date.", group: "Completed" },
  { id: "rent", title: "Reviewed the rent", note: "Found £24,000 annually in the original lease." },
  { id: "history", title: "Checking the tenancy history", note: "Looking for changes in later papers.", group: "Working now" },
  { id: "summary", title: "Prepare renewal summary", note: "Not started.", group: "Next" },
];
const withSuppliedPaper = (steps: StepDef[], supplied: boolean) => supplied ? steps.map((step) => step.id === "summary" ? { ...step, note: "Waiting for the Side Letter check." } : step) : steps;

const extendedSteps = (sent: boolean, sideLetter: boolean): StepDef[] => [
  { id: "tenancy", title: "Read the existing tenancy", note: "Confirmed the parties and end date.", group: "Completed" },
  { id: "rent", title: "Reviewed the rent", note: "Found £24,000 annually in the original lease." },
  { id: "history", title: "Checking the tenancy history", note: sideLetter ? "2024 side letter added to the investigation at your request." : "Looking for changes in later papers.", group: "Investigation in progress" },
  { id: "draft", title: "Drafted email to discuss the tenancy renewal", note: "Ready for your review.", group: "Prepared" },
  { id: "approve", title: "Approve sending the renewal email", note: sent ? "Email sent." : "Waiting for your decision.", group: sent ? "Completed" : "Needs you" },
  { id: "await", title: "Await tenant response", note: sent ? "Waiting for the tenant." : "Not started.", group: "Next" },
];

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

export function WorkJourney({ paused, onPauseChange, onBack, onGuide, sideLetterRequested = false, suppliedPapers = [], paperPlaces = [], onPaperPlacement, approval = "idle", onApprovalChange, approvalOpen = false }: {
  paused: boolean;
  onPauseChange: (paused: boolean) => void;
  onBack: () => void;
  onGuide: () => void;
  sideLetterRequested?: boolean;
  suppliedPapers?: SuppliedPaper[];
  paperPlaces?: PaperPlace[];
  onPaperPlacement?: (id: string, action: PaperPlacementAction) => void;
  approval?: ApprovalStatus;
  onApprovalChange?: (status: ApprovalStatus) => void;
  approvalOpen?: boolean;
}) {
  const [selected, setSelected] = useState<Step>(approvalOpen ? "approve" : "history");
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [journeyExtended, setJourneyExtended] = useState(approvalOpen);
  const [emailBody, setEmailBody] = useState(EMAIL_BODY);
  const [editing, setEditing] = useState(false);
  const [draftBody, setDraftBody] = useState(EMAIL_BODY);
  const [edited, setEdited] = useState(false);
  const [reviewed, setReviewed] = useState(true);
  const toggleEvidence = (id: Evidence) => setEvidence((active) => active === id ? null : id);
  const sent = approval === "sent";
  const needsReview = edited && !reviewed;

  const openDemo = () => { setJourneyExtended(true); setSelected("approve"); setEvidence(null); onApprovalChange?.(sent ? "sent" : "awaiting"); };
  const returnToInvestigation = () => { setSelected("history"); setEvidence(null); setEditing(false); };
  const approveAndSend = () => { if (sent || needsReview) return; onApprovalChange?.("sent"); setEditing(false); };
  const saveEdit = () => { setEmailBody(draftBody); setEditing(false); setEdited(true); setReviewed(false); onApprovalChange?.(sent ? "sent" : "awaiting"); };

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

  const steps = journeyExtended ? extendedSteps(sent, sideLetterRequested) : withSuppliedPaper(baseSteps, suppliedPapers.length > 0);
  const selectedStep = steps.find((step) => step.id === selected);

  const stepIcon = (id: Step) => {
    if (id === "tenancy" || id === "rent" || id === "draft" || (id === "approve" && sent)) return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
    if (id === "approve") return <Hand className="h-3.5 w-3.5 text-ring" />;
    return <span className={`h-2 w-2 rounded-full ${id === "history" ? paused ? "bg-muted-foreground" : "bg-ring" : "border border-muted-foreground"}`} />;
  };

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
    {selected === "summary" && <>
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
            <Button size="sm" variant="outline" className="mt-3" onClick={() => setReviewed(true)}>Ask me to review this version</Button>
          </> : <>
            <p className="mt-2 text-sm font-medium">Ready for your approval</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">This email invites the tenant to discuss a possible renewal. It does not propose rent, tenancy terms or financial commitments.</p>
          </>}
          <p className="mt-3 text-sm font-medium">Still to establish</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{suppliedPapers.length ? "I haven't finished checking the Deed of Variation or examining the supplied 2024 Side Letter." : "I haven't finished checking the Deed of Variation or located the 2024 Side Letter."} These checks remain part of the ongoing investigation.</p>
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

  const showActionBar = selected === "approve" && !sent && !editing;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto [@container_work_(min-width:48rem)]:overflow-hidden" role="region" aria-label="Tenancy renewal work journey">
      <header className="shrink-0 border-b border-border px-5 pb-5 pt-4 [@container_work_(min-width:40rem)]:px-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2 px-0 text-muted-foreground"><ArrowLeft className="h-4 w-4" />Back to What I'm Up To</Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 basis-64">
            <p className="mb-2 text-xs text-muted-foreground">Stanley House · Flat 6</p>
            <h2 className="text-2xl font-semibold leading-tight">Getting the tenancy renewal ready</h2>
          </div>
          <div className="flex min-w-0 w-full flex-wrap items-center gap-2 [@container_work_(min-width:48rem)]:w-auto [@container_work_(min-width:48rem)]:shrink-0">
            <JobPapersMap job="renewal" sideLetterRequested={sideLetterRequested} suppliedPapers={suppliedPapers} />
            <Button variant="outline" size="sm" onClick={() => onPauseChange(!paused)} className="shrink-0 gap-2">{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{paused ? "Resume work" : "Pause work"}</Button>
            <Button variant="secondary" size="sm" onClick={onGuide} className="gap-2"><MessageCircle className="h-4 w-4" />Guide Hobson</Button>
            {journeyExtended
              ? <Button variant="ghost" size="sm" onClick={returnToInvestigation} className="gap-2">Return to the investigation</Button>
              : <Button variant="ghost" size="sm" onClick={openDemo} className="gap-2 text-muted-foreground">Preview approval stage</Button>}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <img src={owlReading} alt="Hobson reading" className="h-10 w-10 shrink-0 object-contain" />
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{journeyExtended ? "I've prepared an email to the tenant about the renewal. I'd like your approval before anything is sent." : "I'm reviewing the existing tenancy and its history so I can prepare a renewal summary for you."}</p>
        </div>
        <p role="status" className="mt-3 flex items-center gap-2 text-xs font-medium"><span className={`h-1.5 w-1.5 rounded-full ${paused ? "bg-muted-foreground" : "bg-ring"}`} aria-hidden="true" />{paused ? "Work paused · What I've found is preserved" : journeyExtended && !sent ? "Waiting for your approval" : "I'm working on this now"}</p>
      </header>

      <div className="hobson-scroll min-h-0 shrink-0 [@container_work_(min-width:48rem)]:flex-1 [@container_work_(min-width:48rem)]:overflow-y-auto">
        <div className="grid grid-cols-1 items-stretch gap-3 p-3 [@container_work_(min-width:40rem)]:p-5 [@container_work_(min-width:48rem)]:min-h-full [@container_work_(min-width:48rem)]:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] [@container_work_(min-width:48rem)]:gap-0">
          <JourneyNavigation label="The Journey" selectedTitle={selectedStep?.title}>
              <div className="relative">
              <div aria-hidden="true" className="absolute bottom-7 left-3 top-8 w-px bg-border" />
              {steps.map((step) => <div key={step.id}>
                {step.group && <p className="relative mb-2 mt-4 bg-muted text-xs font-medium text-muted-foreground first:mt-0">{step.id === "history" && paused ? "Paused here" : step.group}</p>}
                <Button variant="ghost" aria-current={selected === step.id ? "step" : undefined} onClick={() => { setSelected(step.id); setEvidence(null); }} className={`relative mb-2 h-auto w-full items-start justify-start gap-2 rounded-md border px-2 py-3 text-left whitespace-normal ${selected === step.id ? "border-border bg-card shadow-sm [@container_work_(min-width:48rem)]:w-[calc(100%+17px)] [@container_work_(min-width:48rem)]:max-w-none [@container_work_(min-width:48rem)]:rounded-r-none [@container_work_(min-width:48rem)]:border-r-card relative z-10" : "border-transparent hover:bg-background/60"}`}>
                  <span aria-hidden="true" className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center bg-transparent">{stepIcon(step.id)}</span>
                  <span className="min-w-0"><span className="block text-sm font-semibold leading-snug">{step.title}</span><span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">{step.note}</span></span>
                </Button>
              </div>)}
            </div>
          </JourneyNavigation>

          <section aria-labelledby="desk-heading" className="relative min-w-0 rounded-2xl border border-border bg-card px-5 py-5 shadow-sm [@container_work_(min-width:48rem)]:-ml-px [@container_work_(min-width:40rem)]:px-7">
            <h3 id="desk-heading" className="mb-5 text-xs font-semibold text-muted-foreground">On Hobson's Desk</h3>
            <div key={selected}>
              <h4 className="text-lg font-semibold leading-snug">{selectedStep?.title}</h4>
              {journeyExtended && (selected === "draft" || selected === "approve" || selected === "await") ? approvalDesk : investigationDesk}
            </div>
            {showActionBar && <div className="sticky bottom-0 -mx-5 mt-6 border-t border-border bg-background px-5 py-4 [@container_work_(min-width:40rem)]:-mx-7 [@container_work_(min-width:40rem)]:px-7">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={approveAndSend} disabled={needsReview}>Approve and send</Button>
                <Button size="sm" variant="outline" onClick={() => { setDraftBody(emailBody); setEditing(true); }}>Change before sending</Button>
                <Button size="sm" variant="ghost" onClick={returnToInvestigation}>Not now</Button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{needsReview ? "Approval is unavailable until I've reviewed the revised draft." : "Not now leaves the email unsent and waiting for your decision — you can return to it here at any time."}</p>
            </div>}
          </section>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 [@container_work_(min-width:40rem)]:px-6">
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">Illustrative work and paper extracts only — no live work is running.</p>
        </footer>
      </div>
    </div>
  );
}
