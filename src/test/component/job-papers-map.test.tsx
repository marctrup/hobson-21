import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkOverview } from "@/components/prototype/WorkOverview";

describe("Job-scoped Papers / Map", () => {
  it("keeps roof papers separate and preserves the paused investigation when opening its map", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onGuide={vi.fn()} onClose={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Investigating the roof leak" }));
    await user.click(screen.getByRole("button", { name: "Pause work" }));
    await user.click(screen.getByRole("button", { name: "Papers" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("button", { name: /Tenant's report/ })).toBeInTheDocument();
    expect(within(dialog).queryByText("Deed of Variation")).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Map" }));
    expect(within(dialog).getByRole("img", { name: "Burlington Gardens job map" })).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Back to job" }));
    expect(screen.getByRole("button", { name: "Resume work" })).toBeEnabled();
  });

  it("shows only renewal papers, keeps the missing side letter unavailable and points to Stanley House", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onGuide={vi.fn()} onClose={vi.fn()} sideLetterRequested />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await user.click(screen.getByRole("button", { name: "Papers" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Deed of Variation")).toBeInTheDocument();
    expect(within(dialog).queryByText("Tenant's report")).not.toBeInTheDocument();
    expect(within(dialog).getByText("Awaiting paper")).toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: /Side Letter/ })).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Map" }));
    expect(within(dialog).getByRole("img", { name: "Stanley House · Flat 6 job map" })).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Back to job" }));
    expect(screen.getByRole("button", { name: /Checking the tenancy history/ })).toHaveAttribute("aria-current", "step");
  });
});