import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/hooks/crm/useCrmAccess", () => ({
  useCrmAccess: () => ({
    isLoading: false, isAuthenticated: true, hasAccess: true,
    canWrite: true, isAdmin: true, role: "admin" as const,
  }),
}));

// Provide deterministic pipeline stages
const stages = [
  { key: "new",         label: "New Lead",   sort_order: 1, colour: "slate",  is_active: true },
  { key: "qualifying",  label: "Qualifying", sort_order: 2, colour: "blue",   is_active: true },
  { key: "proposal",    label: "Proposal",   sort_order: 3, colour: "violet", is_active: true },
  { key: "won",         label: "Won",        sort_order: 4, colour: "green",  is_active: true },
];

vi.mock("@/hooks/crm/usePipelineStages", async () => {
  const actual = await vi.importActual<any>("@/hooks/crm/usePipelineStages");
  return {
    ...actual,
    usePipelineStages: () => ({ data: stages, isLoading: false }),
    stageColourClasses: () => "bg-slate-100 text-slate-700 border-slate-200",
  };
});

import { renderWithProviders } from "../utils";
import { screen, waitFor } from "@testing-library/react";
import CrmPipeline from "@/pages/crm/CrmPipeline";

describe("CRM Pipeline board", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders every active stage as a column, in sort order", async () => {
    renderWithProviders(<CrmPipeline />, { route: "/crm/pipeline" });

    await waitFor(() => {
      for (const s of stages) {
        expect(screen.getAllByText(s.label).length).toBeGreaterThan(0);
      }
    });

    // Order check: read column headings off the DOM in document order
    const html = document.body.innerHTML;
    const positions = stages.map((s) => html.indexOf(s.label));
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i]).toBeGreaterThan(positions[i - 1]);
    }
  });

  it("never renders 'on_hold' as a kanban column", async () => {
    renderWithProviders(<CrmPipeline />, { route: "/crm/pipeline" });
    await waitFor(() => {
      expect(screen.getAllByText(/New Lead/i).length).toBeGreaterThan(0);
    });
    expect(screen.queryByText(/^on[_ ]hold$/i)).not.toBeInTheDocument();
  });
});
