import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoofLeakJourney } from "@/components/prototype/RoofLeakJourney";
import { createRoofWork, endRoofWork, sendInsurerNotification, type RoofWorkState } from "@/components/prototype/roofWorkLifecycle";

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
    expect(screen.queryByRole("button", { name: /What I've done/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/I'm continuing my review of the lease/)).not.toBeInTheDocument();
  });

  it("opens the detailed surface at the selected activity and returns to the briefing", async () => {
    const user = userEvent.setup();
    renderJourney();
    await user.click(screen.getByRole("button", { name: /Contact the insurer/ }));
    expect(screen.getByRole("article", { name: "Draft insurer notification preview" })).toBeVisible();
    expect(screen.getByRole("button", { name: /Contact the insurer/ })).toHaveAttribute("aria-current", "step");
    expect(screen.queryByRole("heading", { name: "The plan" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back to job overview" }));
    expect(screen.getByRole("heading", { name: "The plan" })).toBeVisible();
    expect(screen.queryByRole("article", { name: "Draft insurer notification preview" })).not.toBeInTheDocument();
  });

  it("opens the detail directly when entered from a decision", () => {
    renderJourney(createRoofWork(), "detail");
    expect(screen.queryByRole("heading", { name: "The plan" })).not.toBeInTheDocument();
    expect(screen.getByText("On Hobson's Desk")).toBeVisible();
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
