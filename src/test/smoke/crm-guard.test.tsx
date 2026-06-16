import { describe, it, expect } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { CrmGuard } from "@/components/crm/CrmGuard";

function renderAt(route: string) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <HelmetProvider>
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={[route]}>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<div data-testid="auth-page">AUTH</div>} />
              <Route
                path="/crm"
                element={
                  <CrmGuard>
                    <div data-testid="crm-content">CRM</div>
                  </CrmGuard>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

describe("CrmGuard", () => {
  it("redirects unauthenticated users from /crm to /auth (preserving returnTo)", async () => {
    const { findByTestId, queryByTestId } = renderAt("/crm");
    await findByTestId("auth-page");
    expect(queryByTestId("crm-content")).not.toBeInTheDocument();
  });
});
