import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkOverview } from "@/components/prototype/WorkOverview";
import { applyPaperAttachment, applyPaperPlacement, initialWorkGuidance, SIDE_LETTER_ATTACHMENT_ID, SIDE_LETTER_ATTACHMENT_INSTRUCTION } from "@/components/prototype/workGuidance";

describe("Focused renewal preparation", () => {
  it.each(["Prepare the renewal summary", "Prepare the tenant communication"])("starts %s without preparing an outcome or requesting approval", async title => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await user.click(screen.getByRole("button", { name: new RegExp(title) }));
    expect(screen.queryByRole("region", { name: "Subtask journey" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Start this work" }));
    expect(screen.getByRole("region", { name: "Subtask journey" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Approve and send" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back to tenancy renewal" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    await user.click(screen.getByRole("button", { name: /Needs attention/ }));
    expect(screen.getByRole("region", { name: "Ongoing" })).not.toHaveTextContent("Stanley House · Flat 6");
    await user.click(screen.getByRole("button", { name: "Clear filter" }));
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await user.click(screen.getByRole("button", { name: new RegExp(title) }));
    expect(screen.queryByRole("button", { name: "Start this work" })).not.toBeInTheDocument();
  });
  it("retains both rent positions and the original end date without resolving later papers", async () => {
    let state = applyPaperAttachment(initialWorkGuidance, SIDE_LETTER_ATTACHMENT_INSTRUCTION, SIDE_LETTER_ATTACHMENT_ID).state;
    for (const type of ["advance", "advance", "examine"] as const) state = applyPaperPlacement(state, SIDE_LETTER_ATTACHMENT_ID, { type }).state;
    const user = userEvent.setup();
    render(<WorkOverview suppliedPapers={state.suppliedPapers} onClose={vi.fn()} onGuide={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    expect(screen.getByText("Recorded the original annual rent of £24,000.")).toBeVisible();
    expect(screen.getByText("Recorded the tenancy end date in the original lease as 31 December 2026.")).toBeVisible();
    expect(screen.getByText(/later annual rent of £27,000 from 1 October 2024/)).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Prepare the renewal summary/ }));
    expect(screen.queryByRole("button", { name: "Start this work" })).not.toBeInTheDocument();
    expect(within(screen.getByRole("region", { name: "Subtask journey" })).getByText(/Deed of Variation remains under review/)).toBeVisible();
  });
});