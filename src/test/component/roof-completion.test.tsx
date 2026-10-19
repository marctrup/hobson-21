import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkOverview } from "@/components/prototype/WorkOverview";
import { createRoofWork, endRoofWork, restartRoofWork, roofAttention, roofOverviewCounts } from "@/components/prototype/roofWorkLifecycle";

describe("Reversible roof completion demonstration", () => {
  it("removes resolved attention and moves exactly one job into accomplishments without changing the attempt", () => {
    const work = createRoofWork();
    work.help = { shown: true, choice: null };
    const original = structuredClone(work);
    expect(roofOverviewCounts(work)).toEqual({ accomplished: 3, active: 5, needsYou: 4 });
    expect(roofOverviewCounts(work, true)).toEqual({ accomplished: 4, active: 4, needsYou: 2 });
    expect(roofAttention(work, true)).toEqual({ insurer: false, help: false });
    expect(work).toEqual(original);
    expect(roofOverviewCounts(work, false)).toEqual({ accomplished: 3, active: 5, needsYou: 4 });
  });

  it("preserves ended status and fresh attempt authority independently of the preview", () => {
    const ended = endRoofWork(createRoofWork());
    const fresh = restartRoofWork(ended);
    const original = structuredClone(fresh);
    expect(roofOverviewCounts(ended)).toEqual({ accomplished: 3, active: 4, needsYou: 2 });
    expect(roofOverviewCounts(fresh, true)).toEqual({ accomplished: 4, active: 4, needsYou: 2 });
    expect(fresh).toEqual(original);
    expect(fresh.insurerPrepared).toBe(false);
    expect(fresh.contractorRequestSent).toBe(false);
    expect(fresh.previous).toHaveLength(1);
    expect(roofOverviewCounts(fresh)).toEqual({ accomplished: 3, active: 5, needsYou: 2 });
  });

  it("inspects records without executing actions and restores the exact paused activity", async () => {
    const user = userEvent.setup();
    const work = createRoofWork();
    work.paused = true;
    work.guidance.contactOnHold = true;
    work.help = { shown: true, choice: "enquiry" };
    const change = vi.fn();
    const guide = vi.fn();
    render(<WorkOverview roofWork={work} onRoofWorkChange={change} onGuide={guide} onClose={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Investigating the roof leak" }));
    await user.click(screen.getByRole("button", { name: /Contact the insurer/ }));
    await user.click(screen.getByRole("button", { name: "Preview completed work" }));
    expect(screen.queryByRole("button", { name: "Resume work" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Review approval" })).not.toBeInTheDocument();
    for (const name of ["Contractor repair completion report", "Confirmation email", "Relevant inspection record"]) {
      await user.click(screen.getByRole("button", { name, exact: true }));
      expect(screen.getByLabelText(`${name} illustrative preview`)).toBeVisible();
    }
    await user.click(screen.getByRole("button", { name: "Recorded the authorised repair instruction", exact: true }));
    await user.click(screen.getByRole("button", { name: "Authorised repair instruction record", exact: true }));
    expect(screen.getByLabelText("Authorised repair instruction record illustrative preview")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Earlier investigation history" }));
    await user.click(screen.getByRole("button", { name: "Preserved investigation · Attempt 1" }));
    expect(screen.getByRole("region", { name: "Preserved investigation record" })).toBeVisible();
    expect(change).not.toHaveBeenCalled();
    expect(guide).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Return to investigation" }));
    expect(screen.getByRole("button", { name: /Contact the insurer/ })).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("button", { name: "Resume work" })).toBeEnabled();
    expect(screen.getByRole("article", { name: "Draft insurer notification preview" })).toBeVisible();
    expect(change).not.toHaveBeenCalled();
  });

  it("reopens completed work from the overview and restores all original requests on return", async () => {
    const user = userEvent.setup();
    render(<WorkOverview onGuide={vi.fn()} onClose={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Investigating the roof leak" }));
    await user.click(screen.getByRole("button", { name: "Preview needs help" }));
    await user.click(screen.getByRole("button", { name: "Preview completed work" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    expect(screen.getByRole("region", { name: "What I'm looking after" })).not.toHaveTextContent("Burlington Gardens");
    expect(screen.getByRole("region", { name: "Needs you" })).not.toHaveTextContent("Burlington Gardens");
    const completed = screen.getByRole("region", { name: "What I've accomplished" });
    expect(within(completed).getAllByText("Burlington Gardens")).toHaveLength(1);
    await user.click(within(completed).getByRole("button", { name: "Investigating the roof leak" }));
    expect(screen.getByRole("region", { name: "Completed roof leak work journey" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Return to investigation" }));
    await user.click(screen.getByRole("button", { name: "Back to What I'm Up To" }));
    expect(screen.getByRole("region", { name: "What I've accomplished" })).not.toHaveTextContent("Burlington Gardens");
    expect(within(screen.getByRole("region", { name: "What I'm looking after" })).getAllByText("Burlington Gardens")).toHaveLength(1);
    const requests = screen.getByRole("region", { name: "Needs you" });
    expect(within(requests).getByText("Clarify responsibility for the shopfront roof")).toBeInTheDocument();
    expect(within(requests).getByText("Contact the insurer")).toBeInTheDocument();
  });

  it("retains ended-attempt records through completion preview and returns to ended work", async () => {
    const user = userEvent.setup();
    const work = endRoofWork(createRoofWork());
    render(<WorkOverview roofWork={work} onGuide={vi.fn()} onClose={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Investigating the roof leak" }));
    await user.click(screen.getByRole("button", { name: "Preview completed work" }));
    await user.click(screen.getByRole("button", { name: "Earlier investigation history" }));
    await user.click(screen.getByRole("button", { name: "Previous attempt 1 · Ended by you" }));
    expect(screen.getByRole("article", { name: "Insurer notification historical draft" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Return to investigation" }));
    expect(screen.getByRole("button", { name: "Start again" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Pause work" })).not.toBeInTheDocument();
  });
});