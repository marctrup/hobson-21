import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AgentsCollection } from "@/components/prototype/AgentsCollection";
import { initialAgentsState, AGENT_JOBS } from "@/pages/prototypeAgents";
import type { WorkspaceActions } from "@/components/prototype/AgentsWorkspace";

const actions: WorkspaceActions = { openAgent: vi.fn(), openList: vi.fn(), openWork: vi.fn(), confirm: vi.fn(), discard: vi.fn(), amend: vi.fn(), pause: vi.fn(), fillInput: vi.fn(), empty: vi.fn(), approveJob: vi.fn() };
const start = () => render(<AgentsCollection state={initialAgentsState(false, true)} actions={actions} approvedJobs={[]} />);
describe("Large agent directory", () => {
  it("searches the entire large collection by place, not just the first visible agents", () => {
    start();
    fireEvent.change(screen.getByRole("textbox", { name: "Search agents" }), { target: { value: "Juniper House" } });
    const buttons = screen.getAllByRole("button", { name: /^Juniper House/ });
    expect(buttons).toHaveLength(4);
    fireEvent.click(buttons[0]);
    expect(actions.openAgent).toHaveBeenCalledWith("large-9-compliance");
    fireEvent.click(screen.getByRole("button", { name: "Clear agent search" }));
    expect(screen.getByRole("status")).toHaveTextContent("44 agents");
  });
  it("folds all groups without removing agents from the searchable collection", () => {
    start();
    expect(screen.getByRole("button", { name: "Expand groups" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Compliance Management/ })).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("44 agents");
    fireEvent.click(screen.getByRole("button", { name: "Expand groups" }));
    expect(screen.getByRole("button", { name: /^Compliance Management/ })).toBeInTheDocument();
  });
  it("opens workload scope without approving or changing the responsibility", () => {
    start();
    fireEvent.change(screen.getByRole("textbox", { name: "Search agents" }), { target: { value: "Juniper House" } });
    fireEvent.click(screen.getByRole("button", { name: "View 4 jobs for Juniper House · Compliance Management, 1 need you" }));
    expect(actions.openWork).toHaveBeenCalledWith("large-9-compliance");
    expect(actions.approveJob).not.toHaveBeenCalled();
    expect(actions.confirm).not.toHaveBeenCalled();
  });
  it("excludes missing responsibilities from the work summary", () => {
    render(<AgentsCollection state={initialAgentsState(true)} actions={actions} approvedJobs={[]} />);
    expect(screen.getByRole("button", { name: /^What I’m Up To/ })).toHaveTextContent("No decisions waiting for you");
    expect(screen.getByRole("status")).toHaveTextContent("0 agents");
    expect(AGENT_JOBS.length).toBeGreaterThan(100);
  });
});