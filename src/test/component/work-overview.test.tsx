import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkOverview } from "@/components/prototype/WorkOverview";

const openNeedsYou = async (user: ReturnType<typeof userEvent.setup>) => {
  const filter = screen.getByRole("button", { name: /Needs attention/ });
  if (filter.getAttribute("aria-pressed") !== "true") await user.click(filter);
};

const openTerms = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: /Establish the current tenancy terms/ }));
  await user.click(screen.getAllByRole("button", { name: "View supporting detail" })[1]);
};
const openCommunication = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: /Prepare the tenant communication/ }));
  const start = screen.queryByRole("button", { name: "Start this work" });
  if (start) await user.click(start);
  const review = screen.queryByRole("button", { name: "Review decision" });
  if (review) await user.click(review);
};
const pauseWork = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: "More work options" }));
  await user.click(screen.getByRole("menuitem", { name: "Pause work" }));
};
describe("Illustrative work journey", () => {
  it("preserves the selected evidence and pause state when guidance adds a paper", async () => {
    const user = userEvent.setup();
    const props = { onClose: vi.fn(), onGuide: vi.fn() };
    const { rerender } = render(<WorkOverview {...props} sideLetterRequested={false} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await openTerms(user);
    await pauseWork(user);
    await user.click(screen.getByRole("button", { name: /Original annual rent\s*£24,000/ }));
    rerender(<WorkOverview {...props} sideLetterRequested />);
    expect(screen.getByRole("region", { name: "Original annual rent evidence" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "More work options" }));
    expect(screen.getByRole("menuitem", { name: "Resume work" })).toBeEnabled();
    await user.keyboard("{Escape}");
    expect(screen.getAllByRole("article", { name: "Side Letter — 2024" })).toHaveLength(1);
    const sideLetter = screen.getByRole("article", { name: "Side Letter — 2024" });
    expect(within(sideLetter).queryByRole("button", { name: /View paper/ })).not.toBeInTheDocument();
    await user.click(within(sideLetter).getByRole("button", { name: "Side Letter — 2024" }));
    expect(screen.queryByRole("region", { name: "Original annual rent evidence" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Checking the tenancy history/ })).toHaveAttribute("aria-current", "step");
    if (screen.queryByRole("button", { name: "Back to tenancy renewal" })) await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await openTerms(user);
    expect(screen.getAllByRole("article", { name: "Side Letter — 2024" })).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "More work options" }));
    expect(screen.getByRole("menuitem", { name: "Resume work" })).toBeEnabled();
    await user.keyboard("{Escape}");
  });

  it("opens one original-lease finding at a time and reuses its paper preview", async () => {
    const user = userEvent.setup();
    const guide = vi.fn();
    render(<WorkOverview onClose={vi.fn()} onGuide={guide} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await openTerms(user);
    const rent = screen.getByRole("button", { name: /Original annual rent\s*£24,000/ });
    await user.click(rent);
    const rentEvidence = screen.getByRole("region", { name: "Original annual rent evidence" });
    expect(rent).toHaveAttribute("aria-expanded", "true");
    await user.click(within(rentEvidence).getByRole("button", { name: /View paper/ }));
    expect(within(rentEvidence).getByLabelText("Business Lease illustrative extract")).toHaveTextContent("£24,000");
    await user.click(screen.getByRole("button", { name: /Tenancy end date in the original lease\s*31 December 2026/ }));
    expect(screen.queryByRole("region", { name: "Original annual rent evidence" })).not.toBeInTheDocument();
    const endEvidence = screen.getByRole("region", { name: "Tenancy end date in the original lease evidence" });
    await user.click(within(endEvidence).getByRole("button", { name: /View paper/ }));
    expect(within(endEvidence).getByLabelText("Business Lease illustrative extract")).toHaveTextContent("31 December 2026");
    await user.click(screen.getByRole("button", { name: "Deed of Variation" }));
    expect(screen.queryByRole("region", { name: "Tenancy end date in the original lease evidence" })).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Deed of Variation investigation" })).toBeVisible();
    expect(screen.getByRole("button", { name: /Checking the tenancy history/ })).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("button", { name: "More work options" })).toBeEnabled();
    expect(guide).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Close evidence" }));
    expect(screen.queryByRole("region", { name: "Deed of Variation investigation" })).not.toBeInTheDocument();
  });

  it("preserves established findings and pause state when returning to the overview", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await openTerms(user);
    await pauseWork(user);
    await user.click(screen.getByRole("button", { name: "More work options" }));
    expect(screen.getByRole("menuitem", { name: "Resume work" })).toBeEnabled();
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: /Read the existing tenancy/ }));
    expect(screen.getByText("Example Tenant Ltd")).toBeVisible();
    expect(screen.getByText("31 December 2026")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Reviewed the rent/ }));
    expect(screen.getByText("£24,000")).toBeVisible();
    if (screen.queryByRole("button", { name: "Back to tenancy renewal" })) await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await openTerms(user);
    await user.click(screen.getByRole("button", { name: "More work options" }));
    expect(screen.getByRole("menuitem", { name: "Resume work" })).toBeEnabled();
    await user.keyboard("{Escape}");
  });

  it("browses subtasks without starting work or sending instructions", async () => {
    const user = userEvent.setup();
    const guide = vi.fn();
    render(<WorkOverview onClose={vi.fn()} onGuide={guide} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    for (const title of ["Establish the current tenancy terms", "Prepare the renewal summary", "Prepare the tenant communication"]) {
      await user.click(screen.getByRole("button", { name: new RegExp(title) }));
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeVisible();
      expect(guide).not.toHaveBeenCalled();
      expect(screen.queryByRole("button", { name: "Approve and send" })).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    }
  });

  it("asks approval before sending the renewal email and reflects the decision", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await openCommunication(user);
    await user.click(screen.getByRole("button", { name: "Preview approval stage" }));
    expect(screen.getByRole("heading", { name: "Prepare the tenant communication" })).toBeVisible();
    expect(screen.getByText("May I send this email?")).toBeVisible();
    expect(screen.getByText("tenant@example.com")).toBeVisible();
    expect(screen.getByText((_, el) => el?.tagName === "P" && /Attachments:\s*None/.test(el.textContent ?? ""))).toBeVisible();
    expect(screen.getByText("What approving this allows")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Not now" }));
    expect(screen.getByRole("heading", { name: "Establish the current tenancy terms" })).toBeVisible();
    if (screen.queryByRole("button", { name: "Back to tenancy renewal" })) await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    await openNeedsYou(user);
    const needsYou = screen.getByRole("region", { name: "Ongoing" });
    expect(within(needsYou).getByText("Stanley House · Flat 6")).toBeInTheDocument();
    // One job, one place: Flat 6 stays in Ongoing, not duplicated.
    await user.click(screen.getByRole("tab", { name: /Ongoing/ }));
    if (screen.queryByRole("button", { name: "Clear filter" })) await user.click(screen.getByRole("button", { name: "Clear filter" }));
    const allWork = screen.getByRole("region", { name: "Ongoing" });
    expect(allWork).toHaveTextContent("Stanley House · Flat 6");
    expect(allWork).toHaveTextContent("Needs you — Renewal email");
    await openNeedsYou(user);
    const renewalDecision = within(screen.getByRole("region", { name: "Ongoing" })).getByText("Stanley House · Flat 6").closest("article");
    if (!renewalDecision) throw new Error("Missing renewal job");
    await user.click(within(renewalDecision).getByRole("button", { name: "Getting the tenancy renewal ready" }));
    expect(screen.getByRole("heading", { name: "The plan" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Approve and send" })).not.toBeInTheDocument();
    await openCommunication(user);
    expect(screen.getByText("May I send this email?")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Change before sending" }));
    await user.type(screen.getByLabelText("Edit the email"), " — revised");
    await user.click(screen.getByRole("button", { name: "Keep this version" }));
    expect(screen.getByText(/Approval applies to the latest version/)).toBeVisible();
    expect(screen.queryByText("Email sent.")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ask me to review this version" }));
    await user.click(screen.getByRole("button", { name: "Approve and send" }));
    expect(screen.getAllByRole("status").some((el) => el.textContent === "Email sent.")).toBe(true);
    expect(screen.getByText(/I'll wait for the tenant's response/)).toBeVisible();
    expect(screen.getAllByRole("status").some(el => el.textContent === "Email sent — awaiting a response")).toBe(true);
    await user.click(screen.getByRole("button", { name: "Return to the investigation" }));
    await user.click(screen.getAllByRole("button", { name: "View supporting detail" })[1]);
    expect(screen.getByRole("button", { name: /Checking the tenancy history/ })).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("button", { name: /Original annual rent\s*£24,000/ })).toBeInTheDocument();
    if (screen.queryByRole("button", { name: "Back to tenancy renewal" })) await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    // Sent: the job stays in Ongoing; the decision leaves Needs you.
    await user.click(screen.getByRole("tab", { name: /Ongoing/ }));
    if (screen.queryByRole("button", { name: "Clear filter" })) await user.click(screen.getByRole("button", { name: "Clear filter" }));
    expect(screen.getByRole("region", { name: "Ongoing" })).toHaveTextContent("Stanley House · Flat 6");
    expect(screen.getByRole("region", { name: "Ongoing" })).not.toHaveTextContent("Needs you — Renewal email");
    await openNeedsYou(user);
    expect(screen.getByRole("region", { name: "Ongoing" })).not.toHaveTextContent("Stanley House · Flat 6");
  });

  it("keeps approval inside the journey and gates approval on the draft's readiness", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await openCommunication(user);
    await user.click(screen.getByRole("button", { name: "Preview approval stage" }));
    expect(screen.getByRole("heading", { name: "Prepare the tenant communication" })).toBeVisible();
    expect(screen.getByText("Why I'm asking")).toBeVisible();
    expect(screen.getByText("Before I send")).toBeVisible();
    expect(screen.getByText("Ready for your approval")).toBeVisible();
    expect(screen.getByText("Still to establish")).toBeVisible();
    expect(screen.getByRole("button", { name: "Approve and send" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Change before sending" }));
    await user.type(screen.getByLabelText("Edit the email"), " — revised");
    await user.click(screen.getByRole("button", { name: "Keep this version" }));
    await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    await openNeedsYou(user);
    const decision = screen.getByText("Stanley House · Flat 6").closest("article");
    if (!decision) throw new Error("Missing renewal decision");
    await user.click(within(decision).getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await openCommunication(user);
    expect(screen.getByText(/— revised/)).toBeVisible();
    // Any edit clears the ready state until the revised draft is explicitly reviewed.
    expect(screen.getByText("Needs another check")).toBeVisible();
    expect(screen.getByRole("button", { name: "Approve and send" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Ask me to review this version" }));
    expect(screen.getByText("Ready for your approval")).toBeVisible();
    expect(screen.getByRole("button", { name: "Approve and send" })).toBeEnabled();
  });

  it("delegates guidance to the existing conversation without closing the journey", async () => {
    const user = userEvent.setup();
    const guide = vi.fn();
    const close = vi.fn();
    render(<WorkOverview onClose={close} onGuide={guide} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await user.click(screen.getByRole("button", { name: "Guide Hobson" }));
    expect(guide).toHaveBeenCalledTimes(1);
    expect(close).not.toHaveBeenCalled();
    expect(screen.getByRole("region", { name: "Tenancy renewal work journey" })).toBeVisible();
  });

  it("approves the insurer notification once, from either route, and removes it from Needs you", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await openNeedsYou(user);
    const needsYou = () => screen.getByRole("region", { name: "Ongoing" });
    await user.click(within(needsYou()).getByRole("button", { name: "Investigating the roof leak" }));
    expect(screen.getByRole("heading", { name: "The plan" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Contact the insurer/ }));
    await user.click(screen.getByRole("button", { name: "Review notification" }));
    await user.click(screen.getByRole("button", { name: "Not now" }));
    if (screen.queryByRole("button", { name: "Back to tenancy renewal" })) await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    // The selected view is remembered when returning from a job.
    expect(screen.getByRole("tab", { name: /Ongoing/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("button", { name: /Needs attention/ })).toHaveAttribute("aria-pressed", "true");
    expect(within(needsYou()).getByText("Needs you — Insurer notification")).toBeInTheDocument();
    // Route B reaches the same draft; an edit is shown back for explicit approval, never sent automatically.
    await user.click(screen.getByRole("tab", { name: /Ongoing/ }));
    if (screen.queryByRole("button", { name: "Clear filter" })) await user.click(screen.getByRole("button", { name: "Clear filter" }));
    await user.click(within(screen.getByRole("region", { name: "Ongoing" })).getByRole("button", { name: /Investigating the roof leak/ }));
    await user.click(screen.getByRole("button", { name: /Contact the insurer/ }));
    await user.click(screen.getByRole("button", { name: "Review notification" }));
    await user.click(screen.getByRole("button", { name: "Change before sending" }));
    const box = screen.getByLabelText("Edit the notification");
    await user.clear(box);
    await user.type(box, "Revised wording.");
    await user.click(screen.getByRole("button", { name: "Keep this version" }));
    expect(screen.getByRole("article", { name: "Draft insurer notification preview" })).toHaveTextContent("Revised wording.");
    await user.click(screen.getByRole("button", { name: "Approve and send" }));
    expect(screen.getByRole("article", { name: "Sent insurer notification" })).toHaveTextContent("Revised wording.");
    if (screen.queryByRole("button", { name: "Back to tenancy renewal" })) await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    await openNeedsYou(user);
    expect(within(needsYou()).queryByText("Needs you — Insurer notification")).not.toBeInTheDocument();
    expect(screen.getByText("2 jobs need your attention")).toBeInTheDocument();
  });

  it("shows the roof leak as one piece of work in Ongoing, flagged as needing you", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    const allWork = screen.getByRole("region", { name: "Ongoing" });
    // One job, one place: the investigation appears once, flagged with its outstanding decision.
    expect(within(allWork).getAllByText("Investigating the roof leak")).toHaveLength(1);
    expect(within(allWork).getByText("Checking repairing responsibility and waiting for the contractor.")).toBeInTheDocument();
    expect(within(allWork).getByText("Needs you — Insurer notification")).toBeInTheDocument();
    expect(screen.getByText("7 pieces of work")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Investigating the roof leak" }));
    expect(screen.getByRole("region", { name: "Roof leak investigation work journey" })).toBeVisible();
    // The calm briefing opens first: the plan, what's done and what's left — no detailed surface.
    expect(screen.getByRole("heading", { name: "The plan" })).toBeVisible();
    expect(screen.getByText(/Establish who's responsible for the affected roof/)).toBeVisible();
    expect(screen.getByRole("heading", { name: "What's been done" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "What's left" })).toBeVisible();
    expect(screen.queryByText(/I'm continuing my review of the lease/)).not.toBeInTheDocument();
    expect(screen.queryByText("Read the tenant's report.")).not.toBeInTheDocument();
    // Selecting an outstanding item opens the detailed Work Surface at that activity.
    await user.click(screen.getByRole("button", { name: /Establish repairing responsibility/ }));
    expect(screen.getByRole("heading", { level: 2, name: "Establish repairing responsibility" })).toBeVisible();
    expect(screen.queryByText("Happening now")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /What I've done/ })).not.toBeInTheDocument();
    // Parent records remain accessible at job level, never beside the subtask.
    await user.click(screen.getByRole("button", { name: "Back to roof leak investigation" }));
    await user.click(screen.getByRole("button", { name: /What I've done/ }));
    await user.click(screen.getByRole("button", { name: /Read the tenant's report\./ }));
    expect(screen.getByText("Recorded outcome")).toBeVisible();
    expect(screen.getByText(/the cause of the leak is not yet established\./)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Back to roof leak investigation" }));
    await user.click(screen.getByRole("button", { name: /Establish repairing responsibility/ }));
    await user.click(screen.getByRole("button", { name: "Review repairing obligations" }));
    expect(screen.getByText("Who is responsible for repairing the affected roof?")).toBeVisible();
    expect(screen.getByText(/I haven't finished reviewing the relevant repairing obligations\./)).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Business Lease · View paper/ }));
    expect(screen.getByLabelText("Business Lease illustrative extract")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Back to roof leak investigation" }));
    await user.click(screen.getByRole("button", { name: /Contractor inspection/ }));
    await user.click(screen.getByRole("button", { name: "Sent inspection request" }));
    expect(screen.getByText(/I'm awaiting a response\./)).toBeVisible();
    expect(screen.getByText("No inspection report has been received.")).toBeVisible();
    expect(screen.getByRole("article", { name: "Inspection request record" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Back to roof leak investigation" }));
    await user.click(screen.getByRole("button", { name: /Contact the insurer/ }));
    await user.click(screen.getByRole("button", { name: "Review notification" }));
    expect(screen.getByText("Needs your approval")).toBeVisible();
    expect(screen.getByRole("article", { name: "Draft insurer notification preview" })).toHaveTextContent("Insurer (illustrative recipient)");
    expect(screen.getByRole("button", { name: "Approve and send" })).toBeEnabled();

    // Selecting activities never changes their status, and the tenancy renewal is untouched.
    expect(screen.queryByRole("button", { name: /Reviewing repairing obligations/ })).not.toBeInTheDocument();
    if (screen.queryByRole("button", { name: "Back to tenancy renewal" })) await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    expect(screen.getByRole("region", { name: "Tenancy renewal work journey" })).toBeVisible();
  });

  it("opens attention work at its job briefing, never an individual approval", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await openNeedsYou(user);
    const ongoing = screen.getByRole("region", { name: "Ongoing" });
    expect(within(ongoing).getAllByRole("article")).toHaveLength(3);
    await user.click(within(ongoing).getByRole("button", { name: "Investigating the roof leak" }));
    expect(screen.getByRole("heading", { name: "The plan" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "What's left" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Approve and send" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Contact the insurer/ }));
    await user.click(screen.getByRole("button", { name: "Review notification" }));
    expect(screen.getByRole("button", { name: "Approve and send" })).toBeEnabled();
  });

  it("filters the current view by job, unit or place", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    const search = screen.getByLabelText("Find work or a place");
    await user.type(search, "Burlington");
    const allWork = screen.getByRole("region", { name: "Ongoing" });
    expect(within(allWork).getByText("Investigating the roof leak")).toBeInTheDocument();
    expect(within(allWork).queryByText("Getting the tenancy renewal ready")).not.toBeInTheDocument();
    await user.clear(search);
    await user.type(search, "Flat 8");
    expect(within(allWork).getByText("Reviewing the rent")).toBeInTheDocument();
    expect(within(allWork).queryByText("Investigating the roof leak")).not.toBeInTheDocument();
    // Search filters the selected view only: Needs you shows the Flat 8 decision.
    await openNeedsYou(user);
    const needsYou = screen.getByRole("region", { name: "Ongoing" });
    expect(within(needsYou).getByText("Stanley House · Flat 8")).toBeInTheDocument();
    expect(within(needsYou).queryByText("Burlington Gardens")).not.toBeInTheDocument();
  });
});
describe("Roof leak — when Hobson needs help", () => {
  it("asks for direction, prepares an unsent enquiry and clears the request", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Investigating the roof leak" }));
    await user.click(screen.getByRole("button", { name: /Establish repairing responsibility/ }));
    await user.click(screen.getByRole("button", { name: "Preview needs help" }));
    expect(screen.getByRole("region", { name: "Hobson needs your help" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Back to roof leak investigation" }));
    expect(screen.getByRole("button", { name: /Establish repairing responsibility/ })).toHaveTextContent("Needs your help");
    expect(screen.getByRole("button", { name: /Contractor inspection/ })).toHaveTextContent("Request sent — awaiting a response.");
    if (screen.queryByRole("button", { name: "Back to tenancy renewal" })) await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    await openNeedsYou(user);
    const needsYou = screen.getByRole("region", { name: "Ongoing" });
    expect(within(needsYou).getAllByText("Investigating the roof leak")).toHaveLength(1);
    expect(within(needsYou).getAllByRole("article")).toHaveLength(3);
    expect(screen.getByText("3 jobs need your attention")).toBeInTheDocument();
    await user.click(within(needsYou).getByRole("button", { name: "Investigating the roof leak" }));
    await user.click(screen.getByRole("button", { name: /Establish repairing responsibility/ }));
    await user.click(screen.getByRole("button", { name: "Review suggestion" }));
    await user.click(screen.getByRole("button", { name: "Prepare the enquiry" }));
    expect(screen.getByText("Enquiry prepared — Not sent")).toBeVisible();
    expect(screen.getByRole("article", { name: "Draft surveyor enquiry preview" })).toBeVisible();
    if (screen.queryByRole("button", { name: "Back to tenancy renewal" })) await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    expect(screen.queryByText("Clarify responsibility for the shopfront roof")).not.toBeInTheDocument();
  });

  it("closes the demonstration and restores the original working state", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Investigating the roof leak" }));
    await user.click(screen.getByRole("button", { name: /Establish repairing responsibility/ }));
    await user.click(screen.getByRole("button", { name: "Preview needs help" }));
    expect(screen.getByRole("region", { name: "Hobson needs your help" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Close this demonstration" }));
    expect(screen.queryByRole("region", { name: "Hobson needs your help" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Reviewing repairing obligations/ })).not.toBeInTheDocument();
    if (screen.queryByRole("button", { name: "Back to tenancy renewal" })) await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    expect(screen.queryByText("Clarify responsibility for the shopfront roof")).not.toBeInTheDocument();
    expect(screen.getByText("3 jobs need your attention")).toBeInTheDocument();
  });

  it("keeps an enquiry unsendable while contact is on hold, and leaving unresolved sends nothing", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} roofGuidance={{ shopfrontRequested: false, contactOnHold: true, holdWasLifted: false, leasePlansRequested: false }} />);
    await user.click(screen.getByRole("button", { name: "Investigating the roof leak" }));
    await user.click(screen.getByRole("button", { name: /Establish repairing responsibility/ }));
    await user.click(screen.getByRole("button", { name: "Preview needs help" }));
    await user.click(screen.getByRole("button", { name: "Leave unresolved" }));
    expect(screen.getByText(/I'll leave the responsibility question open for now/)).toBeVisible();
    expect(screen.queryByRole("article", { name: "Draft surveyor enquiry preview" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Prepare the enquiry" }));
    expect(screen.getByText(/can't send it while your hold on further contact stands/)).toBeVisible();
  });
});

describe("Roof leak — end or start again", () => {
  it("confirms ending, keeps history accessible and starts one fresh investigation", async () => {
    const user = userEvent.setup();
    const guide = vi.fn();
    render(<WorkOverview onClose={vi.fn()} onGuide={guide} />);
    await user.click(screen.getByRole("button", { name: "Investigating the roof leak" }));
    await user.click(screen.getByRole("button", { name: /Establish repairing responsibility/ }));
    await user.click(screen.getByRole("button", { name: "Preview needs help" }));
    await user.click(screen.getByRole("button", { name: "Prepare the enquiry" }));
    await user.click(screen.getByRole("button", { name: "More work options" }));
    await user.click(screen.getByRole("menuitem", { name: "End work" }));
    const confirm = screen.getByRole("alertdialog");
    await user.click(within(confirm).getByRole("button", { name: "Keep working" }));
    await user.click(screen.getByRole("button", { name: "More work options" }));
    expect(screen.getByRole("menuitem", { name: "Pause work" })).toBeEnabled();
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "More work options" }));
    await user.click(screen.getByRole("menuitem", { name: "End work" }));
    await user.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "End work" }));
    expect(screen.queryByRole("button", { name: "More work options" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Guide Hobson" })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Recorded investigation history" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Reviewing repairing obligations/ }));
    expect(screen.getByRole("article", { name: "Surveyor enquiry historical draft" })).toBeVisible();
    expect(screen.queryByRole("article", { name: "Insurer notification historical draft" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Business Lease · View paper/ }));
    expect(screen.getByLabelText("Business Lease illustrative extract")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Contact the insurer/ }));
    expect(screen.getByRole("article", { name: "Insurer notification historical draft" })).toBeVisible();
    expect(screen.queryByRole("article", { name: "Surveyor enquiry historical draft" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Contractor inspection/ }));
    const history = screen.getByRole("region", { name: "Recorded investigation history" });
    expect(history).toHaveTextContent("Request previously sent — No response recorded.");
    await user.click(screen.getByRole("button", { name: /What I've done/ }));
    await user.click(screen.getByRole("button", { name: /Read the tenant's report/ }));
    expect(screen.getByRole("region", { name: "Recorded investigation history" })).toHaveTextContent("The tenant reported water coming through");
    expect(screen.queryByRole("article", { name: "Insurer notification historical draft" })).not.toBeInTheDocument();
    if (screen.queryByRole("button", { name: "Back to tenancy renewal" })) await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    // Ended: the investigation leaves the ongoing list and appears only in the ended-work history.
    expect(within(screen.getByRole("region", { name: "Ongoing" })).getAllByText("Investigating the roof leak")).toHaveLength(1);
    expect(screen.getByRole("region", { name: "Ended work" })).toHaveTextContent("Investigating the roof leak");
    expect(screen.getByText("6 pieces of work")).toBeVisible();
    expect(screen.getByText("2 jobs need your attention")).toBeVisible();
    await user.click(screen.getByRole("tab", { name: /Completed/ }));
    expect(screen.getByRole("region", { name: "Completed" })).not.toHaveTextContent("Burlington Gardens");
    await user.click(screen.getByRole("tab", { name: /Ongoing/ }));
    if (screen.queryByRole("button", { name: "Clear filter" })) await user.click(screen.getByRole("button", { name: "Clear filter" }));
    await user.click(within(screen.getByRole("region", { name: "Ended work" })).getByRole("button", { name: "Investigating the roof leak" }));
    await user.click(screen.getByRole("button", { name: "Start again" }));
    await user.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("status")).toHaveTextContent("Ended by you");
    await user.click(screen.getByRole("button", { name: "Start again" }));
    await user.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Start again" }));
    await user.click(screen.getByRole("button", { name: "More work options" }));
    expect(screen.getByRole("menuitem", { name: "Pause work" })).toBeEnabled();
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: /Contractor inspection/ }));
    expect(screen.queryByRole("article", { name: "Inspection request record" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back to roof leak investigation" }));
    await user.click(screen.getByRole("button", { name: /Contact the insurer/ }));
    expect(screen.queryByRole("article", { name: "Draft insurer notification preview" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Review approval" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Back to roof leak investigation" }));
    await user.click(screen.getByRole("button", { name: /What I've done/ }));
    await user.click(screen.getByRole("button", { name: /Previous attempt/ }));
    expect(screen.getByRole("article", { name: "Surveyor enquiry historical draft" })).toBeVisible();
    expect(guide).not.toHaveBeenCalled();
    if (screen.queryByRole("button", { name: "Back to tenancy renewal" })) await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    expect(screen.getByText("7 pieces of work")).toBeVisible();
    expect(screen.queryByRole("region", { name: "Ended work" })).not.toBeInTheDocument();
    expect(within(screen.getByRole("region", { name: "Ongoing" })).getAllByText("Investigating the roof leak")).toHaveLength(1);
  });
});


describe("Job-level overview filters", () => {
  it("retains seven ongoing jobs and three completed jobs", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    expect(within(screen.getByRole("region", { name: "Ongoing" })).getAllByRole("article")).toHaveLength(7);
    await user.click(screen.getByRole("tab", { name: /Completed/ }));
    expect(within(screen.getByRole("region", { name: "Completed" })).getAllByRole("article")).toHaveLength(3);
    expect(screen.getByRole("region", { name: "Completed" })).not.toHaveTextContent("Burlington Gardens");
  });
  it("opens the briefing request in filtered ongoing and allows clearing it", async () => {
    const user = userEvent.setup();
    const props = { onClose: vi.fn(), onGuide: vi.fn() };
    const { rerender } = render(<WorkOverview {...props} />);
    await user.click(screen.getByRole("tab", { name: /Completed/ }));
    rerender(<WorkOverview {...props} focusNeedsYou={1} />);
    expect(within(screen.getByRole("region", { name: "Ongoing" })).getAllByRole("article")).toHaveLength(3);
    await user.click(screen.getByRole("button", { name: "Clear filter" }));
    await user.click(screen.getByRole("button", { name: "Investigating the roof leak" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    expect(within(screen.getByRole("region", { name: "Ongoing" })).getAllByRole("article")).toHaveLength(7);
  });
  it("searches completed work without admitting ongoing jobs", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await user.click(screen.getByRole("tab", { name: /Completed/ }));
    await user.type(screen.getByLabelText("Find work or a place"), "Flat 3");
    expect(within(screen.getByRole("region", { name: "Completed" })).getAllByRole("article")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "Investigating the roof leak" })).not.toBeInTheDocument();
  });
});
