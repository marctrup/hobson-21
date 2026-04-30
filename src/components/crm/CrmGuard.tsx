import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import NotFound from "@/pages/NotFound";

interface CrmGuardProps {
  children: ReactNode;
}

/**
 * Gate every /crm route. Rules:
 * - Loading: show nothing
 * - Not authenticated: redirect to /auth, preserving the destination
 * - Authenticated but no CRM role: render the public 404 page
 *   (we deliberately do NOT reveal that /crm exists to non-staff)
 */
export const CrmGuard = ({ children }: CrmGuardProps) => {
  const { isLoading, isAuthenticated, hasAccess } = useCrmAccess();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="size-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/auth?returnTo=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (!hasAccess) {
    return <NotFound />;
  }

  return <>{children}</>;
};
