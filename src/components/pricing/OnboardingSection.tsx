import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const DEFAULTS = {
  cost_per_lease: 2.0,
  cost_per_document: 0.2,
  minimum_fee: 5.0,
};

export default function OnboardingSection() {
  const [pricing, setPricing] = useState(DEFAULTS);
  const [leases, setLeases] = useState(0);
  const [documents, setDocuments] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    const fetchPricing = async () => {
      const { data } = await supabase
        .from("onboarding_pricing")
        .select("cost_per_lease, cost_per_document, minimum_fee")
        .limit(1)
        .single();

      if (data) {
        setPricing({
          cost_per_lease: Number(data.cost_per_lease),
          cost_per_document: Number(data.cost_per_document),
          minimum_fee: Number(data.minimum_fee),
        });
      }
    };
    fetchPricing();

    // Real-time updates
    const channel = supabase
      .channel("onboarding-pricing-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "onboarding_pricing" },
        (payload) => {
          const d = payload.new as any;
          if (d) {
            setPricing({
              cost_per_lease: Number(d.cost_per_lease),
              cost_per_document: Number(d.cost_per_document),
              minimum_fee: Number(d.minimum_fee),
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const leaseSubtotal = leases * pricing.cost_per_lease;
  const docSubtotal = documents * pricing.cost_per_document;
  const rawTotal = leaseSubtotal + docSubtotal;
  const minimumApplies = rawTotal > 0 && rawTotal < pricing.minimum_fee;
  const total = rawTotal === 0 ? 0 : Math.max(rawTotal, pricing.minimum_fee);

  return (
    <section className="py-16 md:py-24 bg-background" id="onboarding">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Onboarding</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Getting Hobson ready for your business
          </h2>
        </div>

        {/* Explanation block */}
        <div className="rounded-2xl p-8 sm:p-10 mb-10" style={{ backgroundColor: "#1A1A2E" }}>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Why is there an onboarding fee?
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-white/85 mb-6">
            Before Hobson can reason across your documents, it needs to read and understand them. This is not a simple file upload — Hobson processes every lease and document using AI, extracting meaning, relationships and obligations so it can answer questions accurately from day one. That processing work happens once, thoroughly, and is never repeated for the same document. The onboarding fee covers exactly that work — nothing more. The more documents you have, the more work is involved. The less you have, the less you pay.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-white/65">✓ One-time only — never charged again for the same documents</p>
            <p className="text-sm text-white/65">✓ Processing completes in minutes — Hobson is ready to use immediately after</p>
            <p className="text-sm text-white/65">✓ Add documents later at any time — each new upload is charged at the same rate</p>
          </div>
        </div>

        {/* Calculator */}
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-8">
            Estimate your onboarding cost
          </h3>

          <div className="space-y-6 mb-8">
            {/* Lease input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-foreground">How many leases?</label>
                <span className="text-xs text-muted-foreground">£{pricing.cost_per_lease.toFixed(2)} each</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Tenancy agreements, commercial leases, licence agreements</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLeases(Math.max(0, leases - 1))}
                  className="w-10 h-10 rounded-lg border border-border bg-muted flex items-center justify-center text-foreground font-bold text-lg hover:bg-muted/80 transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  value={leases}
                  onChange={(e) => setLeases(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 text-center rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setLeases(leases + 1)}
                  className="w-10 h-10 rounded-lg border border-border bg-muted flex items-center justify-center text-foreground font-bold text-lg hover:bg-muted/80 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Document input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-foreground">How many other documents?</label>
                <span className="text-xs text-muted-foreground">£{pricing.cost_per_document.toFixed(2)} each</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Compliance certificates, insurance policies, contracts, process guides, anything else</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDocuments(Math.max(0, documents - 1))}
                  className="w-10 h-10 rounded-lg border border-border bg-muted flex items-center justify-center text-foreground font-bold text-lg hover:bg-muted/80 transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  value={documents}
                  onChange={(e) => setDocuments(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 text-center rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setDocuments(documents + 1)}
                  className="w-10 h-10 rounded-lg border border-border bg-muted flex items-center justify-center text-foreground font-bold text-lg hover:bg-muted/80 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Calculation panel */}
          <div className="rounded-xl bg-muted/50 border border-border p-5 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Leases: {leases} × £{pricing.cost_per_lease.toFixed(2)}</span>
                <span>£{leaseSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Documents: {documents} × £{pricing.cost_per_document.toFixed(2)}</span>
                <span>£{docSubtotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-border my-2" />
              <div className="flex justify-between text-base font-bold text-foreground">
                <span>Your onboarding fee</span>
                <span>£{total.toFixed(2)}</span>
              </div>
              {minimumApplies && (
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum fee of £{pricing.minimum_fee.toFixed(2)} applies
                </p>
              )}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => setPaymentOpen(true)}
            disabled={total === 0}
            className="w-full py-4 rounded-xl text-base font-bold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#E94560" }}
          >
            Pay onboarding fee and get started
          </button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Secure payment. You will not be charged again for these documents.
          </p>
        </div>
      </div>

      {/* Payment modal placeholder */}
      {paymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => setPaymentOpen(false)}>
          <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-foreground mb-2">Pay onboarding fee</h3>
            <p className="text-sm text-muted-foreground mb-6">Stripe integration coming soon.</p>

            <div className="rounded-lg bg-muted/50 border border-border p-4 mb-6 space-y-1 text-sm">
              {leases > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>{leases} lease{leases !== 1 ? "s" : ""}</span>
                  <span>£{leaseSubtotal.toFixed(2)}</span>
                </div>
              )}
              {documents > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>{documents} document{documents !== 1 ? "s" : ""}</span>
                  <span>£{docSubtotal.toFixed(2)}</span>
                </div>
              )}
              {minimumApplies && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Minimum fee applies</span>
                  <span />
                </div>
              )}
              <div className="border-t border-border pt-1">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <input placeholder="Card number" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground" disabled />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="MM / YY" className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground" disabled />
                <input placeholder="CVC" className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground" disabled />
              </div>
            </div>

            <button
              disabled
              className="w-full py-3 rounded-lg text-sm font-semibold text-white opacity-50 cursor-not-allowed"
              style={{ backgroundColor: "#E94560" }}
            >
              Pay £{total.toFixed(2)}
            </button>
            <button onClick={() => setPaymentOpen(false)} className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors text-center">
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
