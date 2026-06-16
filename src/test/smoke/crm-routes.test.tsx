import { describe, it, expect, vi } from "vitest";

// Grant CRM admin access for every test in this file.
vi.mock("@/hooks/crm/useCrmAccess", () => ({
  useCrmAccess: () => ({
    isLoading: false,
    isAuthenticated: true,
    hasAccess: true,
    canWrite: true,
    isAdmin: true,
    role: "admin" as const,
  }),
}));

// Stub useAuth so pages that read user info don't blow up.
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "test-user", email: "test@hobsonschoice.ai" },
    session: null,
    isLoading: false,
    signOut: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { renderWithProviders } from "../utils";
import CrmDashboard from "@/pages/crm/CrmDashboard";
import CrmClients from "@/pages/crm/CrmClients";
import CrmPipeline from "@/pages/crm/CrmPipeline";
import CrmSettings from "@/pages/crm/CrmSettings";
import CrmIssues from "@/pages/crm/CrmIssues";
import CrmTasks from "@/pages/crm/CrmTasks";

/**
 * Layer 1 — CRM smoke tests.
 * useCrmAccess + useAuth are mocked so we can render guarded pages.
 * Supabase is mocked globally in src/test/setup.ts.
 */
const cases: Array<[string, () => JSX.Element, string]> = [
  ["CRM Dashboard (/crm)",            () => <CrmDashboard />, "/crm"],
  ["CRM Clients (/crm/clients)",      () => <CrmClients />,   "/crm/clients"],
  ["CRM Pipeline (/crm/pipeline)",    () => <CrmPipeline />,  "/crm/pipeline"],
  ["CRM Issues (/crm/issues)",        () => <CrmIssues />,    "/crm/issues"],
  ["CRM Tasks (/crm/tasks)",          () => <CrmTasks />,     "/crm/tasks"],
  ["CRM Settings (/crm/settings)",    () => <CrmSettings />,  "/crm/settings"],
];

describe("CRM — route smoke", () => {
  for (const [name, factory, route] of cases) {
    it(`${name} renders without throwing`, () => {
      const { container } = renderWithProviders(factory(), { route });
      expect(container).toBeTruthy();
    });
  }
});
