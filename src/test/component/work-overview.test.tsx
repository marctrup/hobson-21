import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkOverview } from "@/components/prototype/WorkOverview";

describe("Illustrative work journey", () => {
  it("preserves the selected evidence and pause state when guidance adds a paper", async () => {
    const user = userEvent.setup();
    const props = { onClose: vi.fn(), onGuide: vi.fn() };
    const { rerender } = render(<WorkOverview {...props} sideLetterRequested={false} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await user.click(screen.getByRole("button", { name: "Pause work" }));
    await user.click(screen.getByRole("button", { name: /Original annual rent\s*£24,000/ }));
    rerender(<WorkOverview {...props} sideLetterRequested />);
    expect(screen.getByRole("region", { name: "Original annual rent evidence" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Resume work" })).toBeEnabled();
    expect(screen.getAllByRole("article", { name: "Side Letter — 2024" })).toHaveLength(1);
    const sideLetter = screen.getByRole("article", { name: "Side Letter — 2024" });
    expect(within(sideLetter).queryByRole("button", { name: /View paper/ })).not.toBeInTheDocument();
    await user.click(within(sideLetter).getByRole("button", { name: "Side Letter — 2024" }));
    expect(screen.queryByRole("region", { name: "Original annual rent evidence" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Checking the tenancy history/ })).toHaveAttribute("aria-current", "step");
    await user.click(screen.getByRole("button", { name: "Back to What I've Done" }));
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    expect(screen.getAllByRole("article", { name: "Side Letter — 2024" })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Resume work" })).toBeEnabled();
  });

  it("opens one original-lease finding at a time and reuses its paper preview", async () => {
    const user = userEvent.setup();
    const guide = vi.fn();
    render(<WorkOverview onClose={vi.fn()} onGuide={guide} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
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
    expect(screen.getByRole("button", { name: "Pause work" })).toBeEnabled();
    expect(guide).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Close evidence" }));
    expect(screen.queryByRole("region", { name: "Deed of Variation investigation" })).not.toBeInTheDocument();
  });

  it("preserves established findings and pause state when returning to the overview", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await user.click(screen.getByRole("button", { name: "Pause work" }));
    expect(screen.getByRole("button", { name: "Resume work" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: /Read the existing tenancy/ }));
    expect(screen.getByText("Example Tenant Ltd")).toBeVisible();
    expect(screen.getByText("31 December 2026")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Reviewed the rent/ }));
    expect(screen.getByText("£24,000")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Back to What I've Done" }));
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    expect(screen.getByRole("button", { name: "Resume work" })).toBeEnabled();
  });

  it("browses every step without changing work status or sending instructions", async () => {
    const user = userEvent.setup();
    const guide = vi.fn();
    render(<WorkOverview onClose={vi.fn()} onGuide={guide} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    expect(screen.getByRole("button", { name: /Checking the tenancy history/ })).toHaveAttribute("aria-current", "step");
    for (const title of [/Read the existing tenancy/, /Reviewed the rent/, /Prepare renewal summary/, /Checking the tenancy history/]) {
      const step = screen.getByRole("button", { name: title });
      await user.click(step);
      expect(step).toHaveAttribute("aria-current", "step");
      expect(screen.getByRole("button", { name: "Pause work" })).toBeEnabled();
      expect(guide).not.toHaveBeenCalled();
    }
  });

  it("asks approval before sending the renewal email and reflects the decision", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await user.click(screen.getByRole("button", { name: "Preview approval stage" }));
    expect(screen.getByRole("button", { name: /Approve sending the renewal email/ })).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("May I send this email?")).toBeVisible();
    expect(screen.getByText("tenant@example.com")).toBeVisible();
    expect(screen.getByText((_, el) => el?.tagName === "P" && /Attachments:\s*None/.test(el.textContent ?? ""))).toBeVisible();
    expect(screen.getByText("What approving this allows")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Not now" }));
    expect(screen.getByRole("button", { name: /Checking the tenancy history/ })).toHaveAttribute("aria-current", "step");
    await user.click(screen.getByRole("button", { name: "Back to What I've Done" }));
    const needsYou = screen.getByRole("region", { name: /Needs you/ });
    expect(within(needsYou).getByText("Stanley House · Flat 6")).toBeInTheDocument();
    // One job, one place: Flat 6 stays in What I'm looking after, not duplicated.
    const lookingAfter = screen.getByRole("region", { name: /What I'm looking after/ });
    expect(lookingAfter).toHaveTextContent("Stanley House · Flat 6");
    expect(within(lookingAfter).getByText("Renewal email — your approval needed")).toBeInTheDocument();
    const renewalDecision = within(needsYou).getByText("Stanley House · Flat 6").closest("article")!;
    await user.click(within(renewalDecision).getByRole("button", { name: "Review decision" }));
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
    expect(screen.getByRole("button", { name: /Approve sending the renewal email/ })).toHaveTextContent("Email sent.");
    await user.click(screen.getByRole("button", { name: "Return to the investigation" }));
    expect(screen.getByRole("button", { name: /Checking the tenancy history/ })).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("button", { name: /Original annual rent\s*£24,000/ })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back to What I've Done" }));
    expect(screen.getByRole("region", { name: /What I'm looking after/ })).toHaveTextContent("Renewal email sent — awaiting the tenant's response");
    expect(screen.getByRole("region", { name: /Needs you/ })).not.toHaveTextContent("Stanley House · Flat 6");
  });

  it("keeps approval inside the journey and gates approval on the draft's readiness", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await user.click(screen.getByRole("button", { name: "Preview approval stage" }));
    expect(screen.getByRole("button", { name: /Approve sending the renewal email/ })).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("Why I'm asking")).toBeVisible();
    expect(screen.getByText("Before I send")).toBeVisible();
    expect(screen.getByText("Ready for your approval")).toBeVisible();
    expect(screen.getByText("Still to establish")).toBeVisible();
    expect(screen.getByRole("button", { name: "Approve and send" })).toBeEnabled();
    // Earlier steps remain selectable with their evidence while approval is open.
    await user.click(screen.getByRole("button", { name: /Checking the tenancy history/ }));
    expect(screen.getByRole("button", { name: /Original annual rent\s*£24,000/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Drafted email to discuss the tenancy renewal/ })).toBeInTheDocument();
    // Edits are preserved when returning to the approval step.
    await user.click(screen.getByRole("button", { name: /Approve sending the renewal email/ }));
    await user.click(screen.getByRole("button", { name: "Change before sending" }));
    await user.type(screen.getByLabelText("Edit the email"), " — revised");
    await user.click(screen.getByRole("button", { name: "Keep this version" }));
    await user.click(screen.getByRole("button", { name: /Read the existing tenancy/ }));
    await user.click(screen.getByRole("button", { name: /Approve sending the renewal email/ }));
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
});