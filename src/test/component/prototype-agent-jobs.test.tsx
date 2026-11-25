import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AgentsJobs } from "@/components/prototype/AgentsJobs";
import { initialAgentsState, type AgentJob } from "@/pages/prototypeAgents";
import type { WorkspaceActions } from "@/components/prototype/AgentsWorkspace";

const actions: WorkspaceActions = { openAgent: vi.fn(), openList: vi.fn(), openWork: vi.fn(), confirm: vi.fn(), discard: vi.fn(), amend: vi.fn(), pause: vi.fn(), fillInput: vi.fn(), empty: vi.fn(), approveJob: vi.fn() };
const history: AgentJob[] = Array.from({ length: 73 }, (_, i) => ({ id: `history-${i}`, agentId: i % 2 ? "break" : "compliance", category: "What I’ve accomplished", title: `Historical job ${i + 1}`, detail: `Recorded result at ${i === 72 ? "Stanley House" : "Paragon Court"}.` }));
const openCompleted = () => fireEvent.mouseDown(screen.getByRole("tab", { name: "Completed 73" }), { button: 0, ctrlKey: false });
const list = () => within(screen.getByRole("list", { name: "Matching jobs" }));

describe("Large Agents job collections", () => {
  it("keeps a long accomplishment history bounded and reaches the last record through pages", () => {
    render(<AgentsJobs state={initialAgentsState()} actions={actions} approvedJobs={[]} jobs={history} />);
    openCompleted();
    expect(list().getAllByRole("listitem").length).toBeLessThan(history.length);
    expect(screen.getByRole("button", { name: "Previous job page" })).toBeDisabled();
    while (!screen.getByRole("button", { name: "Next job page" }).hasAttribute("disabled")) fireEvent.click(screen.getByRole("button", { name: "Next job page" }));
    expect(list().getByRole("button", { name: "Historical job 73" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Previous job page" }));
    expect(list().queryByRole("button", { name: "Historical job 73" })).toBeNull();
  });
  it("searches beyond the visible page using place and responsibility and restores the full collection", () => {
    render(<AgentsJobs state={initialAgentsState()} actions={actions} approvedJobs={[]} jobs={history} />);
    openCompleted();
    fireEvent.change(screen.getByRole("textbox", { name: "Search jobs" }), { target: { value: "Stanley House" } });
    expect(list().getAllByRole("listitem")).toHaveLength(1);
    expect(list().getByRole("button", { name: "Historical job 73" })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Search jobs" }), { target: { value: "Break Monitoring" } });
    expect(screen.getByRole("tab", { name: "Completed 36" })).toBeInTheDocument();
    expect(list().queryByRole("button", { name: "Historical job 1" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Clear job search" }));
    expect(screen.getByRole("tab", { name: "Completed 73" })).toBeInTheDocument();
  });
  it("opens one result at a time without acting on any job", () => {
    const approveJob = vi.fn();
    render(<AgentsJobs state={initialAgentsState()} actions={{ ...actions, approveJob }} approvedJobs={[]} jobs={history} />);
    openCompleted();
    const first = list().getByRole("button", { name: "Historical job 1" });
    const second = list().getByRole("button", { name: "Historical job 2" });
    fireEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(approveJob).not.toHaveBeenCalled();
  });
  it("keeps the originating responsibility scope across every view", () => {
    render(<AgentsJobs state={initialAgentsState()} actions={actions} approvedJobs={[]} jobs={history} agentId="break" />);
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Completed 36" }), { button: 0, ctrlKey: false });
    expect(list().queryByRole("button", { name: "Historical job 1" })).toBeNull();
    expect(list().getByRole("button", { name: "Historical job 2" })).toBeInTheDocument();
  });
});