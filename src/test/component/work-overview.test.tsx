import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkOverview } from "@/components/prototype/WorkOverview";

describe("Illustrative work journey", () => {
  it("preserves established findings and pause state when returning to the overview", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    await user.click(screen.getByRole("button", { name: "Pause work" }));
    expect(screen.getByRole("button", { name: "Resume work" })).toBeEnabled();
    expect(screen.getByText("Example Tenant Ltd")).toBeVisible();
    expect(screen.getByText("31 December 2026")).toBeVisible();
    expect(screen.getByText("£24,000")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Back to What I've Done" }));
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    expect(screen.getByRole("button", { name: "Resume work" })).toBeEnabled();
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