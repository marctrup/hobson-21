import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TierLimit {
  tier: number;
  monthly_questions: string;
  monthly_extractions: string;
  overage_behaviour: string;
}

export default function PricingSettings() {
  const [costPerDocument, setCostPerDocument] = useState("0.20");
  const [costPerQuestionPack, setCostPerQuestionPack] = useState("7.50");
  const [questionsPerPack, setQuestionsPerPack] = useState("100");
  const [tierLimits, setTierLimits] = useState<TierLimit[]>([
    { tier: 1, monthly_questions: "300", monthly_extractions: "3", overage_behaviour: "charge" },
    { tier: 2, monthly_questions: "Unlimited", monthly_extractions: "Unlimited", overage_behaviour: "none" },
    { tier: 3, monthly_questions: "Unlimited", monthly_extractions: "Unlimited", overage_behaviour: "none" },
    { tier: 4, monthly_questions: "Unlimited", monthly_extractions: "Unlimited", overage_behaviour: "none" },
  ]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [pricingRes, limitsRes] = await Promise.all([
        supabase.from("onboarding_pricing").select("*").limit(1).single(),
        supabase.from("tier_usage_limits" as any).select("*").order("tier" as any),
      ]);

      if (pricingRes.data) {
        const d = pricingRes.data as any;
        setCostPerDocument(String(d.cost_per_document));
        if (d.cost_per_question_pack !== undefined) setCostPerQuestionPack(String(d.cost_per_question_pack));
      }

      if (limitsRes.data && (limitsRes.data as any[]).length > 0) {
        setTierLimits((limitsRes.data as any[]).map((d: any) => ({
          tier: d.tier,
          monthly_questions: d.monthly_questions,
          monthly_extractions: d.monthly_extractions,
          overage_behaviour: d.overage_behaviour,
        })));
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateTierLimit = (tier: number, field: keyof TierLimit, value: string) => {
    setTierLimits(prev => prev.map(t => t.tier === tier ? { ...t, [field]: value } : t));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save onboarding pricing
      const { data: existing } = await supabase.from("onboarding_pricing").select("id").limit(1).single();

      if (existing) {
        const { error } = await (supabase.from("onboarding_pricing") as any).update({
          cost_per_document: parseFloat(costPerDocument),
          cost_per_question_pack: parseFloat(costPerQuestionPack),
          updated_at: new Date().toISOString(),
        }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from("onboarding_pricing") as any).insert({
          cost_per_document: parseFloat(costPerDocument),
          cost_per_question_pack: parseFloat(costPerQuestionPack),
        });
        if (error) throw error;
      }

      // Save tier limits
      for (const limit of tierLimits) {
        const { error } = await (supabase.from("tier_usage_limits" as any) as any)
          .update({
            monthly_questions: limit.monthly_questions,
            monthly_extractions: limit.monthly_extractions,
            overage_behaviour: limit.overage_behaviour,
            updated_at: new Date().toISOString(),
          })
          .eq("tier", limit.tier);
        if (error) throw error;
      }

      toast({ title: "Settings updated." });
    } catch (err: any) {
      console.error("Error saving settings:", err);
      toast({ title: "Error", description: "Failed to save settings. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader><CardTitle>Pricing & Usage Settings</CardTitle></CardHeader>
        <CardContent><div className="animate-pulse h-32 bg-muted rounded" /></CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Pricing & Usage Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-8">
          {/* Subsection 1 — Document & Question Pricing */}
          <div>
            <h3 className="text-lg font-semibold mb-1">Document & Question Pricing</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set the price per document and per question top-up pack. Changes update the pricing page calculator automatically.
            </p>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-sm font-medium mb-1 block">Price per document (£)</label>
                <Input type="number" step="0.01" min="0" value={costPerDocument} onChange={e => setCostPerDocument(e.target.value)} required disabled={saving} />
                <p className="text-xs text-muted-foreground mt-1">Applied to all document types — leases, certificates, contracts, etc.</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Cost per 100 questions top-up (£)</label>
                <Input type="number" step="0.01" min="0" value={costPerQuestionPack} onChange={e => setCostPerQuestionPack(e.target.value)} required disabled={saving} />
                <p className="text-xs text-muted-foreground mt-1">Price charged for each top-up pack of 100 questions</p>
              </div>
            </div>
          </div>

          {/* Subsection 2 — Tier Usage Limits */}
          <div>
            <h3 className="text-lg font-semibold mb-1">Tier Usage Limits</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set monthly question and document allowances per tier. Changes take effect immediately across the product and pricing page.
            </p>
            <div className="space-y-6">
              {tierLimits.map(limit => {
                const isUnlimited = false;
                return (
                  <div key={limit.tier} className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Tier {limit.tier}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Monthly questions included</label>
                        <Input
                          type={isUnlimited ? "text" : "number"}
                          value={limit.monthly_questions}
                          onChange={e => updateTierLimit(limit.tier, "monthly_questions", e.target.value)}
                          disabled={saving || isUnlimited}
                          className={isUnlimited ? "opacity-60" : ""}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {isUnlimited ? "Unlimited — no cap" : `Questions a Tier ${limit.tier} user can ask per month`}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Monthly document extractions included</label>
                        <Input
                          type={isUnlimited ? "text" : "number"}
                          value={limit.monthly_extractions}
                          onChange={e => updateTierLimit(limit.tier, "monthly_extractions", e.target.value)}
                          disabled={saving || isUnlimited}
                          className={isUnlimited ? "opacity-60" : ""}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {isUnlimited ? "Unlimited — no cap" : `Documents a Tier ${limit.tier} user can extract per month at no extra charge`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
