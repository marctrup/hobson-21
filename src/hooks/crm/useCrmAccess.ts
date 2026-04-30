import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type CrmRole = "admin" | "crm_write" | "crm_read" | null;

interface CrmAccess {
  isLoading: boolean;
  isAuthenticated: boolean;
  hasAccess: boolean;
  canWrite: boolean;
  isAdmin: boolean;
  role: CrmRole;
}

/**
 * Determines whether the current user can access the CRM.
 * Treats admin as full access; crm_write as editor; crm_read as view-only.
 */
export function useCrmAccess(): CrmAccess {
  const { user, isLoading: authLoading } = useAuth();
  const [role, setRole] = useState<CrmRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const check = async () => {
      if (!user) {
        if (active) {
          setRole(null);
          setIsLoading(false);
        }
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["admin", "crm_write", "crm_read"]);

      if (!active) return;

      const roles = (data ?? []).map((r) => r.role as string);
      // Priority: admin > crm_write > crm_read
      const resolved: CrmRole = roles.includes("admin")
        ? "admin"
        : roles.includes("crm_write")
          ? "crm_write"
          : roles.includes("crm_read")
            ? "crm_read"
            : null;
      setRole(resolved);
      setIsLoading(false);
    };

    if (!authLoading) check();
    return () => {
      active = false;
    };
  }, [user, authLoading]);

  const hasAccess = role !== null;
  const canWrite = role === "admin" || role === "crm_write";
  const isAdmin = role === "admin";

  return {
    isLoading: authLoading || isLoading,
    isAuthenticated: !!user,
    hasAccess,
    canWrite,
    isAdmin,
    role,
  };
}
