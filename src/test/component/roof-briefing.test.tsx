import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoofLeakJourney } from "@/components/prototype/RoofLeakJourney";
import { createRoofWork, createUnstartedRoofWork, endRoofWork, sendInsurerNotification, type RoofWorkState } from "@/components/prototype/roofWorkLifecycle";
import { WorkOverview } from "@/components/prototype/WorkOverview";

function renderJourney(work: RoofWorkState = createRoofWork(), initialView: "briefing" | "detail" = "briefing") {
  return render(
    <RoofLeakJourney
      work={work}
      onWorkUpdate={vi.fn()}
      onEnd={vi.fn()}
      onRestart={vi.fn()}
      paused={work.paused}
      onPauseChange={vi.fn()}
      onBack={vi.fn()}
      onGuide={vi.fn()}
      initialView={initialView}
      guidance={work.guidance}
      help={work.help}
      onHelpChange={vi.fn()}
    />,
  );
}

describe("Roof leak — glass workboard briefing", () => {
  it.each(["Contractor inspection", "Contact the insurer"])("requires an explicit start for %s and retains the instruction on return", async title => {
    const user = userEvent.setup();
    render(<WorkOverview onClose={vi.fn()} onGuide={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Investigating the roof leak" }));
    await user.click(screen.getByRole("button", { name: "View not-commenced demonstration" }));
    await user.click(screen.getByRole("button", { name: new RegExp(title) }));
    await user.click(screen.getByRole("button", { name: "Start this work" }));
    await user.click(screen.getByRole("button", { name: "Back to roof leak investigation" }));
    await user.click(screen.getByRole("button", { name: /What I've done/ }));
    expect(screen.getAllByRole("button", { name: /Asked me to begin/ })).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: new RegExp(title) }));
    expect(screen.queryByRole("button", { name: "Start this work" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Approve and send" })).not.toBeInTheDocument();
  });

  it("keeps all three activity round trips read-only and scopes lease guidance without granting authority", async () => {
    const user = userEvent.setup();
    const work = createRoofWork();
    const before = structuredClone(work);
    const onWorkUpdate = vi.fn();
    const onGuide = vi.fn();
    render(<RoofLeakJourney work={work} onWorkUpdate={onWorkUpdate} onEnd={vi.fn()} onRestart={vi.fn()} paused={false} onPauseChange={vi.fn()} onBack={vi.fn()} onGuide={onGuide} guidance={work.guidance} help={work.help} onHelpChange={vi.fn()} />);
    for (const activity of [/Establish repairing responsibility/, /Contractor inspection/, /Contact the insurer/]) {
      await user.click(screen.getByRole("button", { name: activity }));
      if (activity.source === "Establish repairing responsibility") {
        await user.click(screen.getByRole("button", { name: "Guide Hobson" }));
        expect(onGuide).toHaveBeenLastCalledWith("lease");
        await user.click(screen.getByRole("button", { name: "Found the Business Lease" }));
        await user.click(screen.getByRole("button", { name: "Hide supporting detail" }));
      }
      await user.click(screen.getByRole("button", { name: "Back to roof leak investigation" }));
    }
    expect(onWorkUpdate).not.toHaveBeenCalled();
    expect(work).toEqual(before);
    expect(work.insurerApproval).toBeUndefined();
    expect(work.insurerSent).toBe(false);
    expect(work.contractorRequestSent).toBe(true);
    expect(work.help).toEqual({ shown: false, choice: null });
  });

  it("opens with the plan, what's been done and what's left — and no detailed surface", () => {
    renderJourney();
    expect(screen.getByRole("heading", { name: "The plan" })).toBeVisible();
    expect(screen.getByText("Establish who's responsible for the affected roof, arrange an inspection and decide what needs to happen next.")).toBeVisible();
    expect(screen.getByRole("heading", { name: "What's been done" })).toBeVisible();
    expect(screen.getByText("Received the report of the leak.")).toBeVisible();
    expect(screen.getByText("Found the relevant Business Lease.")).toBeVisible();
    expect(screen.getByText("Sent the contractor inspection request.")).toBeVisible();
    expect(screen.getByRole("heading", { name: "What's left" })).toBeVisible();
    expect(screen.getByRole("button", { name: /Establish repairing responsibility/ })).toHaveTextContent("Reviewing the lease — responsibility not yet established.");
    expect(screen.getByRole("button", { name: /Contractor inspection/ })).toHaveTextContent("Request sent — awaiting a response.");
    expect(screen.getByRole("button", { name: /Contact the insurer/ })).toHaveTextContent("Notification prepared but not sent — needs your approval.");
    // None of the detailed surface is shown until an activity is selected.
    expect(screen.queryByText("On Hobson's Desk")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Preview needs help" })).not.toBeInTheDocument();
    expect(screen.queryByText("Read the tenant's report.")).not.toBeInTheDocument();
    expect(screen.queryByText(/I'm continuing my review of the lease/)).not.toBeInTheDocument();
  });

  it("opens the detailed surface at the selected activity and returns to the briefing", async () => {
    const user = userEvent.setup();
    renderJourney();
    await user.click(screen.getByRole("button", { name: /Contact the insurer/ }));
    expect(screen.queryByRole("article", { name: "Draft insurer notification preview" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Review notification" }));
    expect(screen.getByRole("article", { name: "Draft insurer notification preview" })).toBeVisible();
    expect(screen.getByRole("heading", { level: 2, name: "Contact the insurer" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "The plan" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back to roof leak investigation" }));
    expect(screen.getByRole("heading", { name: "The plan" })).toBeVisible();
    expect(screen.queryByRole("article", { name: "Draft insurer notification preview" })).not.toBeInTheDocument();
  });

  it("opens the detail directly when entered from a decision", () => {
    renderJourney(createRoofWork(), "detail");
    expect(screen.queryByRole("heading", { name: "The plan" })).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Focused activity work" })).toBeVisible();
  });

  it("shows the insurer notification as on hold, never as needing you, while contact is held", () => {
    const work = createRoofWork();
    work.guidance.contactOnHold = true;
    renderJourney(work);
    const insurer = screen.getByRole("button", { name: /Contact the insurer/ });
    expect(insurer).toHaveTextContent("On hold at your request");
    expect(insurer).not.toHaveTextContent("needs your approval");
  });

  it("shows the notification as sent and records it under what's been done", () => {
    renderJourney(sendInsurerNotification(createRoofWork()));
    expect(screen.getByRole("button", { name: /Contact the insurer/ })).toHaveTextContent("Sent — awaiting a response.");
    expect(screen.getByText("Sent the insurer notification with your approval.")).toBeVisible();
  });

  it("says the investigation is paused without hiding the outstanding items", () => {
    const work = createRoofWork();
    work.paused = true;
    renderJourney(work);
    expect(screen.getByText(/I've paused this investigation at your request/)).toBeVisible();
    expect(screen.getByRole("button", { name: /Establish repairing responsibility/ })).toBeEnabled();
  });

  it("asks for help rather than claiming responsibility is established", () => {
    const work = createRoofWork();
    work.help = { shown: true, choice: null };
    renderJourney(work);
    const lease = screen.getByRole("button", { name: /Establish repairing responsibility/ });
    expect(lease).toHaveTextContent("Needs your help");
    expect(lease).not.toHaveTextContent("responsibility not yet established");
  });

  it("uses the ended-work experience instead of the briefing once ended", () => {
    renderJourney(endRoofWork(createRoofWork()));
    expect(screen.queryByRole("heading", { name: "The plan" })).not.toBeInTheDocument();
    expect(screen.getByText("Investigation ended by you")).toBeVisible();
  });

  it("keeps pause and resume inside the More work options menu", async () => {
    const user = userEvent.setup();
    const onPauseChange = vi.fn();
    const work = createRoofWork();
    render(
      <RoofLeakJourney
        work={work}
        onWorkUpdate={vi.fn()}
        onEnd={vi.fn()}
        onRestart={vi.fn()}
        paused={false}
        onPauseChange={onPauseChange}
        onBack={vi.fn()}
        onGuide={vi.fn()}
        guidance={work.guidance}
        help={work.help}
        onHelpChange={vi.fn()}
      />,
    );
    expect(screen.queryByRole("button", { name: "Pause work" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "More work options" }));
    await user.click(screen.getByRole("menuitem", { name: "Pause work" }));
    expect(onPauseChange).toHaveBeenCalledWith(true);
  });
});
