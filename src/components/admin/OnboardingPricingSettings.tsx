import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function OnboardingPricingSettings() {
  const [costPerLease, setCostPerLease] = useState("2.00");
  const [costPerDocument, setCostPerDocument] = useState("0.20");
  const [minimumFee, setMinimumFee] = useState("5.00");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const { data, error } = await supabase
        .from("onboarding_pricing")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setCostPerLease(String(data.cost_per_lease));
        setCostPerDocument(String(data.cost_per_document));
        setMinimumFee(String(data.minimum_fee));
      }
    } catch (err) {
      console.error("Error fetching onboarding pricing:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Get existing row
      const { data: existing } = await supabase
        .from("onboarding_pricing")
        .select("id")
        .limit(1)
        .single();

      if (existing) {
        const { error } = await supabase
          .from("onboarding_pricing")
          .update({
            cost_per_lease: parseFloat(costPerLease),
            cost_per_document: parseFloat(costPerDocument),
            minimum_fee: parseFloat(minimumFee),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("onboarding_pricing")
          .insert({
            cost_per_lease: parseFloat(costPerLease),
            cost_per_document: parseFloat(costPerDocument),
            minimum_fee: parseFloat(minimumFee),
          });

        if (error) throw error;
      }

      toast({
        title: "Onboarding pricing updated",
        description: "The new rates are now live on the pricing page.",
      });
    } catch (err: any) {
      console.error("Error saving onboarding pricing:", err);
      toast({
        title: "Error",
        description: "Failed to save pricing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Onboarding Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-32 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Onboarding Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-5 max-w-md">
          <div>
            <label htmlFor="costPerLease" className="text-sm font-medium mb-1 block">
              Cost per lease (£)
            </label>
            <Input
              id="costPerLease"
              type="number"
              step="0.01"
              min="0"
              value={costPerLease}
              onChange={(e) => setCostPerLease(e.target.value)}
              required
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Applied to tenancy agreements, commercial leases and licence agreements
            </p>
          </div>

          <div>
            <label htmlFor="costPerDocument" className="text-sm font-medium mb-1 block">
              Cost per other document (£)
            </label>
            <Input
              id="costPerDocument"
              type="number"
              step="0.01"
              min="0"
              value={costPerDocument}
              onChange={(e) => setCostPerDocument(e.target.value)}
              required
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Applied to compliance certificates, insurance policies, contracts, process guides and all other documents
            </p>
          </div>

          <div>
            <label htmlFor="minimumFee" className="text-sm font-medium mb-1 block">
              Minimum onboarding fee (£)
            </label>
            <Input
              id="minimumFee"
              type="number"
              step="0.01"
              min="0"
              value={minimumFee}
              onChange={(e) => setMinimumFee(e.target.value)}
              required
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground mt-1">
              The minimum charge regardless of document count
            </p>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save pricing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
