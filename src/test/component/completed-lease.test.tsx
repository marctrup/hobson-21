import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkOverview } from "@/components/prototype/WorkOverview";

describe("Completed Flat 3 lease exploration", () => {
  it("keeps the original three accomplishments and never starts or mutates work when explored", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const guide = vi.fn();
    render(<WorkOverview onClose={vi.fn()} onGuide={guide} onRoofWorkChange={change} />);
    await user.click(screen.getByRole("tab", { name: /Completed/ }));
    const accomplishments = screen.getByRole("region", { name: "Completed" });
    expect(within(accomplishments).getAllByRole("article")).toHaveLength(3);
    await user.click(within(accomplishments).getByRole("button", { name: "The lease, made clear" }));
    expect(screen.queryByRole("button", { name: /^(Pause|Resume) work$/ })).not.toBeInTheDocument();
    const journey = screen.getByRole("navigation", { name: "The completed lease journey" });
    expect(within(journey).getAllByRole("button")).toHaveLength(3);
    await user.click(screen.getByRole("button", { name: "Reviewed the lease" }));
    await user.click(screen.getByRole("button", { name: "Business Lease · View paper" }));
    expect(screen.getByLabelText("Flat 3 Business Lease illustrative preview")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Identified the rent and key dates" }));
    await user.click(screen.getByRole("button", { name: "Business Lease · Rent wording" }));
    expect(screen.getByLabelText("Rent wording illustrative extract")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Prepared the cited summary" }));
    await user.click(screen.getByRole("button", { name: /^Map$/ }));
    expect(screen.getByRole("group", { name: "Stanley House · Flat 3 Papers / Map" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    // The Completed view is remembered when returning from the journey.
    expect(within(screen.getByRole("region", { name: "Completed" })).getAllByRole("article")).toHaveLength(3);
    await user.click(screen.getByRole("tab", { name: /Ongoing/ }));
    expect(screen.getByRole("region", { name: "Ongoing" })).not.toHaveTextContent("The lease, made clear");
    expect(change).not.toHaveBeenCalled();
    expect(guide).not.toHaveBeenCalled();
  });
});