import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  MessageSquare,
  AlertTriangle,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import { cn } from "@/lib/utils";


const NAV = [
  { to: "/crm", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/crm/clients", label: "Clients", icon: Users },
  { to: "/crm/pipeline", label: "Pipeline", icon: KanbanSquare, soon: true },
  { to: "/crm/communications", label: "Communications", icon: MessageSquare, soon: true },
  { to: "/crm/issues", label: "Issues", icon: AlertTriangle, soon: true },
  { to: "/crm/tasks", label: "Tasks", icon: CheckSquare, soon: true },
  { to: "/crm/reports", label: "Reports", icon: BarChart3, soon: true },
  { to: "/crm/settings", label: "Settings", icon: Settings, soon: true },
];

const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
  admin: { label: "Admin", cls: "bg-purple-100 text-purple-800 border-purple-200" },
  crm_write: { label: "Editor", cls: "bg-blue-100 text-blue-800 border-blue-200" },
  crm_read: { label: "Read-only", cls: "bg-slate-100 text-slate-700 border-slate-200" },
};

export const CrmLayout = () => {
  const { user, signOut } = useAuth();
  const { role, canWrite } = useCrmAccess();
  const navigate = useNavigate();

  const badge = role ? ROLE_BADGE[role] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-14 flex items-center px-4 border-b border-slate-200">
          <span className="font-semibold tracking-tight">Hobson CRM</span>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  )
                }
              >
                <Icon className="size-4" />
                <span className="flex-1">{item.label}</span>
                {item.soon && (
                  <span className="text-[10px] uppercase tracking-wide text-slate-400">
                    Soon
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-3 text-xs text-slate-500">
          <div className="truncate">{user?.email}</div>
          {badge && (
            <span
              className={cn(
                "inline-block mt-1 px-2 py-0.5 rounded-md border text-[10px] font-medium",
                badge.cls,
              )}
            >
              {badge.label}
            </span>
          )}
          <button
            onClick={async () => {
              await signOut();
              navigate("/auth");
            }}
            className="mt-3 flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="text-sm text-slate-500">Internal CRM · Hobson's Choice</div>
          {canWrite && (
            <Button
              size="sm"
              onClick={() => navigate("/crm/clients/new")}
              className="gap-1"
            >
              <Plus className="size-4" /> New client
            </Button>
          )}
        </header>
        <main className="flex-1 overflow-auto"><Outlet /></main>
      </div>
    </div>
  );
};
