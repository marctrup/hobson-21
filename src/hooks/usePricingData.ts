import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingPricing {
  cost_per_lease: number;
  cost_per_document: number;
  minimum_fee: number;
  cost_per_question_pack: number;
}

interface TierLimit {
  tier: number;
  monthly_questions: string;
  monthly_extractions: string;
  overage_behaviour: string;
}

const DEFAULT_PRICING: OnboardingPricing = {
  cost_per_lease: 2.0,
  cost_per_document: 0.2,
  minimum_fee: 5.0,
  cost_per_question_pack: 7.50,
};

const DEFAULT_LIMITS: TierLimit[] = [
  { tier: 1, monthly_questions: "300", monthly_extractions: "3", overage_behaviour: "charge" },
  { tier: 2, monthly_questions: "Unlimited", monthly_extractions: "Unlimited", overage_behaviour: "none" },
  { tier: 3, monthly_questions: "Unlimited", monthly_extractions: "Unlimited", overage_behaviour: "none" },
  { tier: 4, monthly_questions: "Unlimited", monthly_extractions: "Unlimited", overage_behaviour: "none" },
];

export function usePricingData() {
  const [pricing, setPricing] = useState<OnboardingPricing>(DEFAULT_PRICING);
  const [tierLimits, setTierLimits] = useState<TierLimit[]>(DEFAULT_LIMITS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [pRes, tRes] = await Promise.all([
          supabase.from("onboarding_pricing").select("cost_per_lease, cost_per_document, minimum_fee, cost_per_question_pack").limit(1).single(),
          supabase.from("tier_usage_limits" as any).select("*").order("tier" as any),
        ]);

        if (pRes.data) {
          setPricing({
            cost_per_lease: Number(pRes.data.cost_per_lease),
            cost_per_document: Number(pRes.data.cost_per_document),
            minimum_fee: Number(pRes.data.minimum_fee),
            cost_per_question_pack: Number((pRes.data as any).cost_per_question_pack ?? 7.50),
          });
        }

        if (tRes.data && (tRes.data as any[]).length > 0) {
          setTierLimits((tRes.data as any[]).map((d: any) => ({
            tier: d.tier,
            monthly_questions: d.monthly_questions,
            monthly_extractions: d.monthly_extractions,
            overage_behaviour: d.overage_behaviour,
          })));
        }
      } catch (err) {
        console.error("Error fetching pricing data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();

    // Real-time updates
    const ch1 = supabase
      .channel("pricing-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "onboarding_pricing" }, (payload) => {
        const d = payload.new as any;
        if (d) setPricing({ cost_per_lease: Number(d.cost_per_lease), cost_per_document: Number(d.cost_per_document), minimum_fee: Number(d.minimum_fee) });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "tier_usage_limits" }, (payload) => {
        const d = payload.new as any;
        if (d) {
          setTierLimits(prev => prev.map(t => t.tier === d.tier ? { ...t, monthly_questions: d.monthly_questions, monthly_extractions: d.monthly_extractions, overage_behaviour: d.overage_behaviour } : t));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(ch1); };
  }, []);

  const getTierLimit = (tier: number) => tierLimits.find(t => t.tier === tier) || DEFAULT_LIMITS[tier - 1];

  return { pricing, tierLimits, getTierLimit, loading };
}
