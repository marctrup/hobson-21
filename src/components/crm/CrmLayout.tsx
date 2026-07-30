import { ReactNode, useState } from "react";
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
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import { useWorkspaceName } from "@/hooks/crm/useWorkspaceName";
import { cn } from "@/lib/utils";
import hobsonOwl from "@/assets/owl-mascot.png";


type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  soon?: boolean;
  adminOnly?: boolean;
};

const NAV: NavItem[] = [
  { to: "/crm", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/crm/clients", label: "Clients", icon: Users },
  { to: "/crm/pipeline", label: "Pipeline", icon: KanbanSquare },
  { to: "/crm/communications", label: "Communications", icon: MessageSquare },
  { to: "/crm/issues", label: "Issues", icon: AlertTriangle },
  { to: "/crm/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/crm/reports", label: "Reports", icon: BarChart3 },
  { to: "/crm/settings", label: "Settings", icon: Settings, adminOnly: true },
];

const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
  admin: { label: "Admin", cls: "bg-bone-wash text-ink border-bone" },
  crm_write: { label: "Editor", cls: "bg-bone-wash text-ink border-bone" },
  crm_read: { label: "Read-only", cls: "bg-bone-wash text-charcoal border-bone" },
};

export const CrmLayout = ({ children }: { children?: ReactNode }) => {
  const { user, signOut } = useAuth();
  const { role, isAdmin, canWrite } = useCrmAccess();
  const { name: workspaceName } = useWorkspaceName();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const badge = role ? ROLE_BADGE[role] : null;
  const showWorkspaceSubtitle =
    workspaceName && workspaceName !== "Hobson CRM";

  const SidebarInner = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <div className="h-14 flex items-center gap-2 px-4 border-b border-bone">
        <img
          src={hobsonOwl}
          alt="Hobson"
          className="h-8 w-8 object-contain shrink-0"
        />
        <div className="flex flex-col min-w-0">
          <span className="font-semibold tracking-tight leading-tight">
            Hobson CRM
          </span>
          {showWorkspaceSubtitle && (
            <span
              className="text-[11px] text-ink-muted leading-tight truncate"
              title={workspaceName}
            >
              {workspaceName}
            </span>
          )}
        </div>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {NAV.filter((item) => !item.adminOnly || isAdmin).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px]",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-charcoal hover:bg-primary/10 hover:text-primary",
                )
              }
            >
              <Icon className="size-4" />
              <span className="flex-1">{item.label}</span>
              {item.soon && (
                <span className="text-[10px] uppercase tracking-wide text-ink-muted">
                  Soon
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-bone p-3 text-xs text-ink-muted">
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
            onNavigate?.();
            await signOut();
            navigate("/auth");
          }}
          className="mt-3 flex items-center gap-2 text-charcoal hover:text-ink"
        >
          <LogOut className="size-3.5" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-paper text-ink flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 bg-white border-r border-bone flex-col">
        <SidebarInner />
      </aside>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 flex flex-col">
          <SidebarInner onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-bone flex items-center justify-between px-4 md:px-6 gap-2">
          {/* Mobile: hamburger + brand */}
          <div className="flex md:hidden items-center gap-2 min-w-0">
            <SheetTriggerButton onClick={() => setMobileOpen(true)} />
            <img src={hobsonOwl} alt="Hobson" className="h-7 w-7 object-contain shrink-0" />
            <span className="font-semibold tracking-tight truncate">Hobson CRM</span>
          </div>
          {/* Desktop subtitle */}
          <div className="hidden md:block text-sm text-ink-muted">Internal CRM · Hobson's Choice</div>
          {canWrite && (
            <Button
              size="sm"
              onClick={() => navigate("/crm/clients/new")}
              className="hidden md:inline-flex gap-1"
            >
              <Plus className="size-4" /> New client
            </Button>
          )}
        </header>
        <main className="flex-1 overflow-auto">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
};

const SheetTriggerButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Open navigation"
    className="inline-flex items-center justify-center h-11 w-11 -ml-2 rounded-md text-charcoal hover:bg-bone-wash"
  >
    <Menu className="size-5" />
  </button>
);
