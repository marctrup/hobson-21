import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import { toast } from "@/hooks/use-toast";
import {
  SEGMENT_LABELS,
  SEGMENT_KEYS,
  sectorHasSubSectors,
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABELS,
  INTEREST_LEVELS,
  INTEREST_LEVEL_LABELS,
  CLIENT_STATUSES,
  CLIENT_STATUS_LABELS,
  PRIORITIES,
  PRIORITY_LABELS,
  STAFF_SIZE_BANDS,
  CHAMPION_ROLES,
  CHAMPION_ROLE_LABELS,
  TENURE_MIX,
  TENURE_MIX_LABELS,
  SUBSCRIPTION_TIERS,
  SUBSCRIPTION_TIER_LABELS,
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS,
  BILLING_CYCLES,
  BILLING_CYCLE_LABELS,
} from "@/lib/crm/labels";
import { SubSectorMultiSelect } from "@/components/crm/SubSectorMultiSelect";
import { useSubSectors } from "@/hooks/crm/useSubSectors";
import { syncClientSubSectors } from "@/lib/crm/clientSubSectors";

const SegmentKeys = SEGMENT_KEYS;

const ClientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  client_type: z.enum(["business", "individual"]).nullable(),
  segment: z.enum(SegmentKeys).nullable(),
  website: z.string().trim().max(300).optional().or(z.literal("")),
  email: z.string().trim().max(255).email("Invalid email").optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  pipeline_stage: z.string(),
  interest_level: z.string(),
  status: z.string(),
  priority: z.string(),
  primary_contact_name: z.string().trim().max(200).optional().or(z.literal("")),
  primary_contact_role: z.string().trim().max(200).optional().or(z.literal("")),
  primary_contact_email: z.string().trim().max(255).optional().or(z.literal("")),
});

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border border-slate-200 rounded-lg">
    <div className="px-4 py-2 border-b border-slate-200 text-sm font-medium text-slate-700">
      {title}
    </div>
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Field = ({
  label,
  children,
  error,
  full,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  full?: boolean;
}) => (
  <div className={full ? "md:col-span-2" : ""}>
    <Label className="text-xs font-medium text-slate-600">{label}</Label>
    <div className="mt-1">{children}</div>
    {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
  </div>
);

export default function CrmClientNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canWrite } = useCrmAccess();

  const [form, setForm] = useState({
    name: "",
    client_type: null as "business" | "individual" | null,
    segment: null as string | null,
    website: "",
    email: "",
    phone: "",
    linkedin_url: "",
    address_line_1: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    primary_contact_name: "",
    primary_contact_role: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    staff_size_band: "",
    champion_role: "",
    property_count: "",
    tenure_mix: "",
    subscription_status: "not_subscribed",
    subscription_plan: "",
    contracted_monthly_value_gbp: "",
    licensed_user_seats: "",
    billing_cycle: "",
    contract_start_date: "",
    contract_end_date: "",
    pipeline_stage: "new_enquiry",
    interest_level: "warm",
    lead_source: "",
    lead_source_detail: "",
    expected_close_date: "",
    next_action: "",
    next_action_date: "",
    status: "lead",
    priority: "medium",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subSectorIds, setSubSectorIds] = useState<string[]>([]);
  const { data: allSubSectors } = useSubSectors();

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // When sector changes, drop any selected sub-sectors that no longer apply.
  const onSectorChange = (next: string) => {
    set("segment", next);
    if (!sectorHasSubSectors(next)) {
      setSubSectorIds([]);
      return;
    }
    const valid = new Set(
      (allSubSectors ?? []).filter((s) => s.sector === next).map((s) => s.id),
    );
    setSubSectorIds((prev) => prev.filter((id) => valid.has(id)));
  };

  const numericOrNull = (v: string) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const dateOrNull = (v: string) => (v ? v : null);
  const stringOrNull = (v: string) => (v.trim() === "" ? null : v.trim());

  const create = useMutation({
    mutationFn: async () => {
      const parsed = ClientSchema.safeParse(form);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
          fieldErrors[i.path.join(".")] = i.message;
        });
        setErrors(fieldErrors);
        throw new Error("Please fix the highlighted fields.");
      }
      setErrors({});

      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        website: stringOrNull(form.website),
        email: stringOrNull(form.email),
        phone: stringOrNull(form.phone),
        linkedin_url: stringOrNull(form.linkedin_url),
        address_line_1: stringOrNull(form.address_line_1),
        city: stringOrNull(form.city),
        postcode: stringOrNull(form.postcode),
        country: stringOrNull(form.country),
        primary_contact_name: stringOrNull(form.primary_contact_name),
        primary_contact_role: stringOrNull(form.primary_contact_role),
        primary_contact_email: stringOrNull(form.primary_contact_email),
        primary_contact_phone: stringOrNull(form.primary_contact_phone),
        staff_size_band: stringOrNull(form.staff_size_band),
        champion_role: stringOrNull(form.champion_role),
        property_count: numericOrNull(form.property_count),
        tenure_mix: stringOrNull(form.tenure_mix),
        subscription_status: form.subscription_status,
        subscription_plan: stringOrNull(form.subscription_plan),
        contracted_monthly_value_gbp: numericOrNull(form.contracted_monthly_value_gbp),
        licensed_user_seats: numericOrNull(form.licensed_user_seats),
        billing_cycle: stringOrNull(form.billing_cycle),
        contract_start_date: dateOrNull(form.contract_start_date),
        contract_end_date: dateOrNull(form.contract_end_date),
        pipeline_stage: form.pipeline_stage,
        interest_level: form.interest_level,
        lead_source: stringOrNull(form.lead_source),
        lead_source_detail: stringOrNull(form.lead_source_detail),
        expected_close_date: dateOrNull(form.expected_close_date),
        next_action: stringOrNull(form.next_action),
        next_action_date: dateOrNull(form.next_action_date),
        status: form.status,
        priority: form.priority,
        owner_id: user?.id ?? null,
        created_by: user?.id ?? null,
      };
      // Only include client_type/segment when explicitly chosen — otherwise let DB defaults apply.
      if (form.client_type) payload.client_type = form.client_type;
      if (form.segment) payload.segment = form.segment;

      const { data, error } = await supabase
        .from("crm_clients")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(payload as any)
        .select("id")
        .single();
      if (error) throw error;

      // Persist sub-sector links (best-effort; surface errors via toast).
      if (sectorHasSubSectors(form.segment) && subSectorIds.length > 0) {
        try {
          await syncClientSubSectors(data.id, subSectorIds);
        } catch (e) {
          toast({
            title: "Client created, but sub-sectors couldn't be saved",
            description: (e as Error).message,
            variant: "destructive",
          });
        }
      }
      return data;
    },
    onSuccess: (data) => {
      toast({ title: "Client created" });
      navigate(`/crm/clients/${data.id}`);
    },
    onError: (e: Error) => {
      toast({ title: "Could not create client", description: e.message, variant: "destructive" });
    },
  });

  if (!canWrite) {
    return (
      <div className="p-6 text-sm text-slate-600">
        You don't have permission to create clients.
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>New client | CRM</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {/* ============== Mobile form ============== */}
      <div className="md:hidden p-4 pb-28 max-w-xl mx-auto">
        <h1 className="text-xl font-semibold tracking-tight">New client</h1>
        <p className="text-sm text-slate-500 mt-1">
          Just the basics. You can add more details later on desktop.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <Label className="text-sm font-medium">Name *</Label>
            <Input
              className="mt-1 h-11 text-base"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium">Type</Label>
            <Select
              value={form.client_type ?? undefined}
              onValueChange={(v) => set("client_type", v as "business" | "individual")}
            >
              <SelectTrigger className="mt-1 h-11"><SelectValue placeholder="Business or individual?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Segment</Label>
            <Select value={form.segment ?? undefined} onValueChange={onSectorChange}>
              <SelectTrigger className="mt-1 h-11"><SelectValue placeholder="Choose a sector" /></SelectTrigger>
              <SelectContent>
                {Object.entries(SEGMENT_LABELS).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {sectorHasSubSectors(form.segment) && (
            <div>
              <Label className="text-sm font-medium">Sub-sectors</Label>
              <div className="mt-1">
                <SubSectorMultiSelect
                  sector={form.segment as string}
                  value={subSectorIds}
                  onChange={setSubSectorIds}
                />
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium">Primary contact name</Label>
            <Input
              className="mt-1 h-11 text-base"
              value={form.primary_contact_name}
              onChange={(e) => set("primary_contact_name", e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Primary contact email</Label>
            <Input
              className="mt-1 h-11 text-base"
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              value={form.primary_contact_email}
              onChange={(e) => set("primary_contact_email", e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Primary contact phone</Label>
            <Input
              className="mt-1 h-11 text-base"
              type="tel"
              inputMode="tel"
              value={form.primary_contact_phone}
              onChange={(e) => set("primary_contact_phone", e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Champion's role</Label>
            <Select value={form.champion_role} onValueChange={(v) => set("champion_role", v)}>
              <SelectTrigger className="mt-1 h-11"><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {CHAMPION_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{CHAMPION_ROLE_LABELS[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Notes</Label>
            <Textarea
              className="mt-1 min-h-[120px] text-base"
              value={form.next_action}
              onChange={(e) => set("next_action", e.target.value)}
              placeholder="Anything useful to remember…"
            />
          </div>
        </div>

        {/* Sticky create bar */}
        <div
          className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 p-3 flex gap-2"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <Button
            variant="outline"
            className="h-12"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-12 text-base"
            onClick={() => create.mutate()}
            disabled={create.isPending}
          >
            {create.isPending ? "Saving…" : "Create client"}
          </Button>
        </div>
      </div>

      {/* ============== Desktop form ============== */}
      <div className="hidden md:block p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">New client</h1>
            <p className="text-sm text-slate-500 mt-1">
              Capture as much or as little as you have. You can edit anytime.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={() => create.mutate()} disabled={create.isPending}>
              {create.isPending ? "Saving…" : "Create client"}
            </Button>
          </div>
        </div>

        <Section title="Identity">
          <Field label="Name *" error={errors.name} full>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Type">
            <Select
              value={form.client_type ?? undefined}
              onValueChange={(v) => set("client_type", v as "business" | "individual")}
            >
              <SelectTrigger><SelectValue placeholder="Business or individual?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Segment">
            <Select value={form.segment ?? undefined} onValueChange={onSectorChange}>
              <SelectTrigger><SelectValue placeholder="Choose a sector" /></SelectTrigger>
              <SelectContent>
                {Object.entries(SEGMENT_LABELS).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {sectorHasSubSectors(form.segment) && (
            <Field label="Sub-sectors">
              <SubSectorMultiSelect
                sector={form.segment as string}
                value={subSectorIds}
                onChange={setSubSectorIds}
              />
            </Field>
          )}
          <Field label="Website">
            <Input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="example.com" />
          </Field>
          <Field label="General email" error={errors.email}>
            <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="General phone">
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="LinkedIn URL">
            <Input value={form.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} />
          </Field>
        </Section>

        <Section title="Address">
          <Field label="Address line 1" full>
            <Input value={form.address_line_1} onChange={(e) => set("address_line_1", e.target.value)} />
          </Field>
          <Field label="City">
            <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
          </Field>
          <Field label="Postcode">
            <Input value={form.postcode} onChange={(e) => set("postcode", e.target.value)} />
          </Field>
          <Field label="Country">
            <Input value={form.country} onChange={(e) => set("country", e.target.value)} />
          </Field>
        </Section>

        <Section title="Primary commercial contact">
          <Field label="Full name">
            <Input value={form.primary_contact_name} onChange={(e) => set("primary_contact_name", e.target.value)} />
          </Field>
          <Field label="Job title">
            <Input value={form.primary_contact_role} onChange={(e) => set("primary_contact_role", e.target.value)} />
          </Field>
          <Field label="Email">
            <Input value={form.primary_contact_email} onChange={(e) => set("primary_contact_email", e.target.value)} />
          </Field>
          <Field label="Phone">
            <Input value={form.primary_contact_phone} onChange={(e) => set("primary_contact_phone", e.target.value)} />
          </Field>
        </Section>

        <Section title="Firmographics">
          <Field label="Staff size">
            <Select value={form.staff_size_band} onValueChange={(v) => set("staff_size_band", v)}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {STAFF_SIZE_BANDS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Champion's role">
            <Select value={form.champion_role} onValueChange={(v) => set("champion_role", v)}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {CHAMPION_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{CHAMPION_ROLE_LABELS[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </Section>

        <Section title="Property profile">
          <Field label="Number of properties">
            <Input type="number" value={form.property_count} onChange={(e) => set("property_count", e.target.value)} />
          </Field>
          <Field label="Tenure mix">
            <Select value={form.tenure_mix} onValueChange={(v) => set("tenure_mix", v)}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {TENURE_MIX.map((t) => <SelectItem key={t} value={t}>{TENURE_MIX_LABELS[t]}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </Section>

        <Section title="Subscription">
          <Field label="Subscription status">
            <Select value={form.subscription_status} onValueChange={(v) => set("subscription_status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SUBSCRIPTION_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{SUBSCRIPTION_STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Plan">
            <Input value={form.subscription_plan} onChange={(e) => set("subscription_plan", e.target.value)} placeholder="Starter / Pro / Enterprise" />
          </Field>
          <Field label="Monthly value (£)">
            <Input type="number" value={form.contracted_monthly_value_gbp} onChange={(e) => set("contracted_monthly_value_gbp", e.target.value)} />
          </Field>
          <Field label="Licensed seats">
            <Input type="number" value={form.licensed_user_seats} onChange={(e) => set("licensed_user_seats", e.target.value)} />
          </Field>
          <Field label="Billing cycle">
            <Select value={form.billing_cycle} onValueChange={(v) => set("billing_cycle", v)}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {BILLING_CYCLES.map((b) => <SelectItem key={b} value={b}>{BILLING_CYCLE_LABELS[b]}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Contract start">
            <Input type="date" value={form.contract_start_date} onChange={(e) => set("contract_start_date", e.target.value)} />
          </Field>
          <Field label="Contract end">
            <Input type="date" value={form.contract_end_date} onChange={(e) => set("contract_end_date", e.target.value)} />
          </Field>
        </Section>

        <Section title="Sales & relationship">
          <Field label="Pipeline stage">
            <Select value={form.pipeline_stage} onValueChange={(v) => set("pipeline_stage", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PIPELINE_STAGES.map((s) => <SelectItem key={s} value={s}>{PIPELINE_STAGE_LABELS[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Interest level">
            <Select value={form.interest_level} onValueChange={(v) => set("interest_level", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {INTEREST_LEVELS.map((s) => <SelectItem key={s} value={s}>{INTEREST_LEVEL_LABELS[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Lead source">
            <Select value={form.lead_source} onValueChange={(v) => set("lead_source", v)}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {LEAD_SOURCES.map((s) => <SelectItem key={s} value={s}>{LEAD_SOURCE_LABELS[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Lead source detail">
            <Input value={form.lead_source_detail} onChange={(e) => set("lead_source_detail", e.target.value)} />
          </Field>
          <Field label="Expected close date">
            <Input type="date" value={form.expected_close_date} onChange={(e) => set("expected_close_date", e.target.value)} />
          </Field>
          <Field label="Next action date">
            <Input type="date" value={form.next_action_date} onChange={(e) => set("next_action_date", e.target.value)} />
          </Field>
          <Field label="Next action" full>
            <Textarea value={form.next_action} onChange={(e) => set("next_action", e.target.value)} rows={2} />
          </Field>
        </Section>

        <Section title="Status">
          <Field label="Status">
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CLIENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{CLIENT_STATUS_LABELS[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Priority">
            <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((s) => <SelectItem key={s} value={s}>{PRIORITY_LABELS[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </Section>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={() => create.mutate()} disabled={create.isPending}>
            {create.isPending ? "Saving…" : "Create client"}
          </Button>
        </div>
      </div>
    </>
  );
}
