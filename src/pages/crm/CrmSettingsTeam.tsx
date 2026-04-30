import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import {
  useCrmTeam,
  useCrmInvitations,
  useChangeRole,
  useRevokeRole,
  useRevokeInvitation,
  type CrmTeamRole,
} from "@/hooks/crm/useCrmTeam";
import { InviteUserDialog } from "@/components/crm/InviteUserDialog";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/NotFound";

const ROLE_LABEL: Record<CrmTeamRole, string> = {
  admin: "Admin",
  crm_write: "Editor",
  crm_read: "Viewer",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function CrmSettingsTeam() {
  const { isAdmin, isLoading } = useCrmAccess();
  const { user } = useAuth();
  const [inviteOpen, setInviteOpen] = useState(false);

  const { data: members = [], isLoading: loadingMembers } = useCrmTeam();
  const { data: invitations = [], isLoading: loadingInvites } = useCrmInvitations();
  const changeRole = useChangeRole();
  const revokeRole = useRevokeRole();
  const revokeInvite = useRevokeInvitation();

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading…</div>;
  }
  if (!isAdmin) return <NotFound />;

  const pendingInvites = invitations.filter((i) => i.status === "pending");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Helmet>
        <title>Team & Roles | CRM Settings</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="mb-2">
        <Link
          to="/crm/settings"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="size-3.5" /> Settings
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Team & roles</h1>
          <p className="text-sm text-slate-500 mt-1">
            Invite teammates and manage who can access the CRM.
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="gap-1">
          <Plus className="size-4" /> Invite user
        </Button>
      </div>

      {/* Members table */}
      <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <header className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-medium">Active team members</h2>
          <span className="text-xs text-slate-500">
            {members.length} {members.length === 1 ? "member" : "members"}
          </span>
        </header>

        {loadingMembers ? (
          <div className="p-6 text-sm text-slate-500">Loading members…</div>
        ) : members.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No team members yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="text-left px-5 py-2 font-medium">Email</th>
                <th className="text-left px-5 py-2 font-medium">Name</th>
                <th className="text-left px-5 py-2 font-medium">Role</th>
                <th className="text-left px-5 py-2 font-medium">Granted</th>
                <th className="px-5 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m) => {
                const isSelf = m.user_id === user?.id;
                return (
                  <tr key={m.user_id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3">
                      <span className="font-medium">{m.email}</span>
                      {isSelf && (
                        <span className="ml-2 text-xs text-slate-400">(you)</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {m.display_name ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <Select
                        value={m.role}
                        disabled={changeRole.isPending}
                        onValueChange={(v) =>
                          changeRole.mutate({
                            user_id: m.user_id,
                            new_role: v as CrmTeamRole,
                          })
                        }
                      >
                        <SelectTrigger className="h-8 w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="crm_read">Viewer</SelectItem>
                          <SelectItem value="crm_write">Editor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {formatDate(m.granted_at)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revoke CRM access?</AlertDialogTitle>
                            <AlertDialogDescription>
                              <strong>{m.email}</strong> will lose all CRM
                              access immediately. They'll keep their normal user
                              account. You can re-invite them later.
                              {isSelf && (
                                <span className="block mt-2 text-amber-700">
                                  Note: this will revoke your own access.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() =>
                                revokeRole.mutate({ user_id: m.user_id })
                              }
                            >
                              Revoke access
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* Pending invitations */}
      <section className="bg-white border border-slate-200 rounded-lg overflow-hidden mt-6">
        <header className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-medium">Pending invitations</h2>
          <span className="text-xs text-slate-500">
            {pendingInvites.length}
          </span>
        </header>
        {loadingInvites ? (
          <div className="p-6 text-sm text-slate-500">Loading…</div>
        ) : pendingInvites.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No pending invitations.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="text-left px-5 py-2 font-medium">Email</th>
                <th className="text-left px-5 py-2 font-medium">Role</th>
                <th className="text-left px-5 py-2 font-medium">Sent</th>
                <th className="text-left px-5 py-2 font-medium">Expires</th>
                <th className="px-5 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingInvites.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-medium">{inv.email}</td>
                  <td className="px-5 py-3">{ROLE_LABEL[inv.role]}</td>
                  <td className="px-5 py-3 text-slate-500">
                    {formatDate(inv.created_at)}
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {formatDate(inv.expires_at)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-600"
                      disabled={revokeInvite.isPending}
                      onClick={() => revokeInvite.mutate(inv.id)}
                    >
                      Revoke
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
