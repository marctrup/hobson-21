import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star, Plus, Trash2, Mail, Phone, Globe, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import { toast } from "@/hooks/use-toast";
import { StageBadge } from "@/components/crm/StageBadge";
import { InterestBadge } from "@/components/crm/InterestBadge";
import {
  SEGMENT_LABELS,
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABELS,
  INTEREST_LEVELS,
  INTEREST_LEVEL_LABELS,
  CLIENT_STATUSES,
  CLIENT_STATUS_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
  formatGBP,
  formatDateUK,
  formatDateTimeUK,
  formatSqft,
  SENIORITY_LABELS,
  DEPARTMENTS,
  DEPARTMENT_LABELS,
  SENIORITY_LEVELS,
  PLATFORM_ROLES,
  PLATFORM_ROLE_LABELS,
} from "@/lib/crm/labels";
import { cn } from "@/lib/utils";
import { ClientCommunicationsTab } from "@/components/crm/communications/ClientCommunicationsTab";
import { ClientIssuesTab } from "@/components/crm/issues/ClientIssuesTab";
import { ClientTasksTab } from "@/components/crm/tasks/ClientTasksTab";

type TabKey = "overview" | "contacts" | "users" | "communications" | "issues" | "tasks" | "notes" | "activity";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "contacts", label: "Contacts" },
  { key: "users", label: "Platform users" },
  { key: "communications", label: "Communications" },
  { key: "issues", label: "Issues" },
  { key: "tasks", label: "Tasks" },
  { key: "notes", label: "Notes" },
  { key: "activity", label: "Activity" },
];

export default function CrmClientDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canWrite, isAdmin } = useCrmAccess();
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabKey | null) ?? "overview";
  const [tab, setTabState] = useState<TabKey>(initialTab);
  const focusCommId = searchParams.get("focusComm");

  // Keep tab in sync with URL when arriving via deep link.
  useEffect(() => {
    const t = searchParams.get("tab") as TabKey | null;
    if (t && t !== tab) setTabState(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const setTab = (next: TabKey) => {
    setTabState(next);
    const sp = new URLSearchParams(searchParams);
    if (next === "overview") sp.delete("tab");
    else sp.set("tab", next);
    sp.delete("focusComm");
    setSearchParams(sp, { replace: true });
  };

  const clientQ = useQuery({
    queryKey: ["crm-client", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_clients")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const updateClient = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => {
      const { error } = await supabase.from("crm_clients").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-client", id] });
      qc.invalidateQueries({ queryKey: ["crm-clients"] });
      toast({ title: "Saved" });
    },
    onError: (e: Error) =>
      toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  const deleteClient = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("crm_clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Client deleted" });
      navigate("/crm/clients");
    },
    onError: (e: Error) =>
      toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });

  if (clientQ.isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading…</div>;
  }
  if (clientQ.error || !clientQ.data) {
    return <div className="p-6 text-sm text-rose-600">Client not found.</div>;
  }

  const c = clientQ.data;

  return (
    <>
      <Helmet>
        <title>{c.name} | CRM</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="p-6 max-w-7xl mx-auto">
        <Link to="/crm/clients" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="size-4" /> Back to clients
        </Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{c.name}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <span>{SEGMENT_LABELS[c.segment] ?? c.segment}</span>
              {c.sub_sector && <span>· {c.sub_sector}</span>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {canWrite ? (
              <Select
                value={c.pipeline_stage}
                onValueChange={(v) => updateClient.mutate({ pipeline_stage: v })}
              >
                <SelectTrigger className="w-[180px] bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PIPELINE_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>{PIPELINE_STAGE_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <StageBadge stage={c.pipeline_stage} />
            )}
            {canWrite ? (
              <Select
                value={c.interest_level}
                onValueChange={(v) => updateClient.mutate({ interest_level: v })}
              >
                <SelectTrigger className="w-[120px] bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INTEREST_LEVELS.map((s) => (
                    <SelectItem key={s} value={s}>{INTEREST_LEVEL_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <InterestBadge level={c.interest_level} />
            )}
            {isAdmin && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-rose-600">
                    <Trash2 className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this client?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently removes the client and all linked contacts, users, notes, and activity. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteClient.mutate()}>
                      Delete client
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-slate-200 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "px-3 py-2 text-sm font-medium border-b-2 -mb-px",
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-900",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "overview" && <OverviewTab client={c} canWrite={canWrite} onSave={(p) => updateClient.mutate(p)} />}
          {tab === "contacts" && <ContactsTab clientId={id} canWrite={canWrite} />}
          {tab === "users" && <UsersTab clientId={id} canWrite={canWrite} />}
          {tab === "communications" && (
            <ClientCommunicationsTab
              clientId={id}
              canWrite={canWrite}
              focusCommId={focusCommId}
            />
          )}
          {tab === "issues" && <ClientIssuesTab clientId={id} canWrite={canWrite} />}
          {tab === "tasks" && <ClientTasksTab clientId={id} canWrite={canWrite} />}
          {tab === "notes" && <NotesTab clientId={id} userId={user?.id} canWrite={canWrite} />}
          {tab === "activity" && <ActivityTab clientId={id} />}
        </div>
      </div>
    </>
  );
}

/* ----------------------------- Overview tab ----------------------------- */

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-baseline justify-between gap-4 py-1.5 text-sm border-b border-slate-100 last:border-0">
    <span className="text-slate-500">{label}</span>
    <span className="text-slate-900 text-right">{value ?? "—"}</span>
  </div>
);

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border border-slate-200 rounded-lg">
    <div className="px-4 py-2 border-b border-slate-200 text-sm font-medium">{title}</div>
    <div className="p-4">{children}</div>
  </div>
);

const OverviewTab = ({
  client,
  canWrite,
  onSave,
}: {
  client: any;
  canWrite: boolean;
  onSave: (patch: Record<string, unknown>) => void;
}) => {
  const c = client;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="Contact">
        <Row label="Website" value={c.website ? <a className="underline" href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank" rel="noreferrer">{c.website}</a> : "—"} />
        <Row label="Email" value={c.email || "—"} />
        <Row label="Phone" value={c.phone || "—"} />
        <Row label="Address" value={[c.address_line_1, c.city, c.postcode].filter(Boolean).join(", ") || "—"} />
        <Row label="Country" value={c.country || "—"} />
      </Card>

      <Card title="Primary commercial contact">
        <Row label="Name" value={c.primary_contact_name || "—"} />
        <Row label="Role" value={c.primary_contact_role || "—"} />
        <Row label="Email" value={c.primary_contact_email || "—"} />
        <Row label="Phone" value={c.primary_contact_phone || "—"} />
      </Card>

      <Card title="Firmographics">
        <Row label="Type" value={c.client_type === "individual" ? "Individual" : "Business"} />
        <Row label="Staff size" value={c.staff_size_band || "—"} />
        <Row label="Annual revenue" value={c.annual_revenue_band || "—"} />
      </Card>

      <Card title="Property profile">
        <Row label="Number of properties" value={c.property_count ?? "—"} />
        <Row label="Total floor area" value={formatSqft(c.total_floor_area_sqft)} />
        <Row label="Tenure mix" value={c.tenure_mix || "—"} />
        <Row label="Annual property spend" value={formatGBP(c.estimated_annual_property_spend_gbp)} />
        <Row label="Lease events (12m)" value={c.upcoming_lease_events_12m ?? "—"} />
      </Card>

      <Card title="Subscription">
        <Row label="Status" value={SUBSCRIPTION_STATUS_LABELS[c.subscription_status] ?? c.subscription_status} />
        <Row label="Plan" value={c.subscription_plan || "—"} />
        <Row label="Monthly value" value={formatGBP(c.contracted_monthly_value_gbp)} />
        <Row label="Licensed seats" value={c.licensed_user_seats ?? "—"} />
        <Row label="Billing cycle" value={c.billing_cycle || "—"} />
        <Row label="Contract" value={c.contract_start_date || c.contract_end_date ? `${formatDateUK(c.contract_start_date)} → ${formatDateUK(c.contract_end_date)}` : "—"} />
      </Card>

      <Card title="Sales">
        <Row label="Pipeline stage" value={<StageBadge stage={c.pipeline_stage} />} />
        <Row label="Interest level" value={<InterestBadge level={c.interest_level} />} />
        <Row label="Deal value" value={formatGBP(c.estimated_deal_value_gbp)} />
        <Row label="Probability" value={c.probability_to_close != null ? `${c.probability_to_close}%` : "—"} />
        <Row label="Expected close" value={formatDateUK(c.expected_close_date)} />
        <Row label="Lead source" value={c.lead_source || "—"} />
        <Row label="Next action" value={c.next_action ? `${c.next_action}${c.next_action_date ? ` · ${formatDateUK(c.next_action_date)}` : ""}` : "—"} />
        <Row label="Last contact" value={formatDateUK(c.last_contact_date)} />
      </Card>

      {canWrite && (
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-sm font-medium mb-2">Quick status update</div>
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={c.status} onValueChange={(v) => onSave({ status: v })}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CLIENT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{CLIENT_STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-slate-500">
              Changes are logged in the activity log automatically.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ----------------------------- Contacts tab ----------------------------- */

const ContactsTab = ({ clientId, canWrite }: { clientId: string; canWrite: boolean }) => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    job_title: "",
    email: "",
    phone: "",
    is_primary: false,
    notes: "",
  });

  const list = useQuery({
    queryKey: ["crm-contacts", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_contacts")
        .select("*")
        .eq("client_id", clientId)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!form.full_name.trim()) throw new Error("Name is required");
      const { error } = await supabase.from("crm_contacts").insert({
        client_id: clientId,
        full_name: form.full_name.trim(),
        job_title: form.job_title || null,
        email: form.email || null,
        phone: form.phone || null,
        is_primary: form.is_primary,
        notes: form.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-contacts", clientId] });
      setForm({ full_name: "", job_title: "", email: "", phone: "", is_primary: false, notes: "" });
      setOpen(false);
      toast({ title: "Contact added" });
    },
    onError: (e: Error) =>
      toast({ title: "Could not add contact", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("crm_contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-contacts", clientId] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-500">
          The people you talk to about the commercial relationship.
        </div>
        {canWrite && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1"><Plus className="size-4" /> Add contact</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add contact</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Full name *</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Job title</Label>
                    <Input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_primary} onChange={(e) => setForm({ ...form, is_primary: e.target.checked })} />
                  Primary contact
                </label>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => create.mutate()} disabled={create.isPending}>
                  {create.isPending ? "Saving…" : "Add contact"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {list.isLoading ? (
          <div className="p-6 text-sm text-slate-500">Loading…</div>
        ) : !list.data?.length ? (
          <div className="p-8 text-center text-sm text-slate-500">No contacts yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Name</th>
                <th className="text-left px-4 py-2 font-medium">Job title</th>
                <th className="text-left px-4 py-2 font-medium">Email</th>
                <th className="text-left px-4 py-2 font-medium">Phone</th>
                {canWrite && <th />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.data.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium">
                    {p.full_name}{" "}
                    {p.is_primary && (
                      <span className="ml-1 text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                        Primary
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">{p.job_title ?? "—"}</td>
                  <td className="px-4 py-2">{p.email ?? "—"}</td>
                  <td className="px-4 py-2">{p.phone ?? "—"}</td>
                  {canWrite && (
                    <td className="px-2 py-2 text-right">
                      <button
                        onClick={() => remove.mutate(p.id)}
                        className="text-slate-400 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

/* ----------------------------- Users tab ----------------------------- */

const UsersTab = ({ clientId, canWrite }: { clientId: string; canWrite: boolean }) => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    job_title: "",
    seniority_level: "",
    department: "",
    platform_role: "standard_user",
    is_primary_admin: false,
  });

  const list = useQuery({
    queryKey: ["crm-client-users", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_client_users")
        .select("*")
        .eq("client_id", clientId)
        .order("is_primary_admin", { ascending: false })
        .order("full_name", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!form.full_name.trim()) throw new Error("Name is required");
      if (!form.email.trim()) throw new Error("Email is required");
      const { error } = await supabase.from("crm_client_users").insert({
        client_id: clientId,
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        job_title: form.job_title || null,
        seniority_level: form.seniority_level || null,
        department: form.department || null,
        platform_role: form.platform_role,
        is_primary_admin: form.is_primary_admin,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-client-users", clientId] });
      qc.invalidateQueries({ queryKey: ["crm-client", clientId] });
      setForm({ full_name: "", email: "", job_title: "", seniority_level: "", department: "", platform_role: "standard_user", is_primary_admin: false });
      setOpen(false);
      toast({ title: "User added" });
    },
    onError: (e: Error) =>
      toast({ title: "Could not add user", description: e.message, variant: "destructive" }),
  });

  const setPrimary = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("crm_client_users")
        .update({ is_primary_admin: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-client-users", clientId] });
      qc.invalidateQueries({ queryKey: ["crm-client", clientId] });
      toast({ title: "Primary admin updated" });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("crm_client_users").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-client-users", clientId] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-500">
          End-users of the AI platform at this client. Mark one as the primary admin.
        </div>
        {canWrite && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1"><Plus className="size-4" /> Add user</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add platform user</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Full name *</Label>
                    <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Job title</Label>
                  <Input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Seniority</Label>
                    <Select value={form.seniority_level} onValueChange={(v) => setForm({ ...form, seniority_level: v })}>
                      <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        {SENIORITY_LEVELS.map((s) => <SelectItem key={s} value={s}>{SENIORITY_LABELS[s]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                      <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((s) => <SelectItem key={s} value={s}>{DEPARTMENT_LABELS[s]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Platform role</Label>
                  <Select value={form.platform_role} onValueChange={(v) => setForm({ ...form, platform_role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PLATFORM_ROLES.map((s) => <SelectItem key={s} value={s}>{PLATFORM_ROLE_LABELS[s]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_primary_admin} onChange={(e) => setForm({ ...form, is_primary_admin: e.target.checked })} />
                  Set as primary admin for this client
                </label>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => create.mutate()} disabled={create.isPending}>
                  {create.isPending ? "Saving…" : "Add user"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {list.isLoading ? (
          <div className="p-6 text-sm text-slate-500">Loading…</div>
        ) : !list.data?.length ? (
          <div className="p-8 text-center text-sm text-slate-500">No platform users yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Name</th>
                <th className="text-left px-4 py-2 font-medium">Job title</th>
                <th className="text-left px-4 py-2 font-medium">Department</th>
                <th className="text-left px-4 py-2 font-medium">Seniority</th>
                <th className="text-left px-4 py-2 font-medium">Platform role</th>
                {canWrite && <th />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.data.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium">
                    <div className="flex items-center gap-1.5">
                      {u.is_primary_admin && (
                        <Star className="size-3.5 fill-amber-400 text-amber-500" aria-label="Primary admin" />
                      )}
                      <span>{u.full_name}</span>
                    </div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-2">{u.job_title ?? "—"}</td>
                  <td className="px-4 py-2">{u.department ? DEPARTMENT_LABELS[u.department] : "—"}</td>
                  <td className="px-4 py-2">{u.seniority_level ? SENIORITY_LABELS[u.seniority_level] : "—"}</td>
                  <td className="px-4 py-2">{PLATFORM_ROLE_LABELS[u.platform_role] ?? u.platform_role}</td>
                  {canWrite && (
                    <td className="px-2 py-2 text-right whitespace-nowrap">
                      {!u.is_primary_admin && (
                        <button
                          onClick={() => setPrimary.mutate(u.id)}
                          className="text-xs text-slate-600 hover:text-slate-900 mr-2"
                        >
                          Make primary
                        </button>
                      )}
                      <button
                        onClick={() => remove.mutate(u.id)}
                        className="text-slate-400 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="size-4 inline" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

/* ----------------------------- Notes tab ----------------------------- */

const NotesTab = ({
  clientId,
  userId,
  canWrite,
}: {
  clientId: string;
  userId?: string;
  canWrite: boolean;
}) => {
  const qc = useQueryClient();
  const [content, setContent] = useState("");

  const list = useQuery({
    queryKey: ["crm-notes", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_notes")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!content.trim()) return;
      if (!userId) throw new Error("Not signed in");
      const { error } = await supabase.from("crm_notes").insert({
        client_id: clientId,
        content: content.trim(),
        created_by: userId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setContent("");
      qc.invalidateQueries({ queryKey: ["crm-notes", clientId] });
    },
    onError: (e: Error) =>
      toast({ title: "Could not save note", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("crm_notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-notes", clientId] }),
  });

  return (
    <div className="space-y-4">
      {canWrite && (
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <Textarea
            rows={3}
            placeholder="Add a note…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <Button size="sm" onClick={() => create.mutate()} disabled={!content.trim() || create.isPending}>
              {create.isPending ? "Saving…" : "Add note"}
            </Button>
          </div>
        </div>
      )}

      {list.isLoading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : !list.data?.length ? (
        <div className="text-sm text-slate-500 bg-white border border-slate-200 rounded-lg p-8 text-center">
          No notes yet.
        </div>
      ) : (
        <ul className="space-y-2">
          {list.data.map((n) => (
            <li key={n.id} className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm text-slate-800 whitespace-pre-wrap">{n.content}</div>
                {canWrite && n.created_by === userId && (
                  <button
                    onClick={() => remove.mutate(n.id)}
                    className="text-slate-400 hover:text-rose-600"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">{formatDateUK(n.created_at)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ----------------------------- Activity tab ----------------------------- */

const ActivityTab = ({ clientId }: { clientId: string }) => {
  const list = useQuery({
    queryKey: ["crm-activity", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_activity_log")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {list.isLoading ? (
        <div className="p-6 text-sm text-slate-500">Loading…</div>
      ) : !list.data?.length ? (
        <div className="p-8 text-center text-sm text-slate-500">
          No activity recorded yet.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {list.data.map((a) => (
            <li key={a.id} className="px-4 py-3 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <div className="font-medium text-slate-900">{a.description ?? a.action_type}</div>
                <div className="text-xs text-slate-500 shrink-0">{formatDateTimeUK(a.created_at)}</div>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {a.entity_type} · {a.action_type}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
