import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkOverview } from "@/components/prototype/WorkOverview";

describe("Illustrative work journey", () => {
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